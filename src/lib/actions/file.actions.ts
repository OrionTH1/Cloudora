"use server";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, handleError } from "../utils";
import {
  BUCKET_ID,
  DATABASE_ID,
  FILES_COLLECTION_ID,
} from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";
import { getCurrentUser, getUserByEmail } from "./user.actions";
import { redirect } from "next/navigation";
import { isPlanHasFeature } from "./plans.actions";

export const uploadFiles = async (
  file: File,
  ownerId: string,
  accountId: string,
  maxStorageSize: number,
  path: string
) => {
  const { storage, database } = await createAdminClient();
  try {
    const totalStorageUsed = await getTotalSpaceUsed();

    if (totalStorageUsed) {
      if (totalStorageUsed.total + file.size > maxStorageSize) {
        return { error: "storage_limit_exceeded", response: null };
      }
    }

    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      BUCKET_ID!,
      ID.unique(),
      inputFile
    );

    const fileInfo = getFileType(bucketFile.name);
    const fileDocument = {
      type: fileInfo.type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: fileInfo.extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId: accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await database
      .createDocument(
        DATABASE_ID!,
        FILES_COLLECTION_ID!,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(BUCKET_ID!, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    return { error: null, response: newFile };
  } catch (error) {
    handleError(error, "failed to upload files");
  }
};

export const createQueries = async (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types && types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  const [sortBy, orderBy] = sort.split("-");

  queries.push(
    orderBy == "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
  );

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { database } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries = await createQueries(
      currentUser,
      types,
      searchText,
      sort,
      limit
    );
    const files = await database.listDocuments(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      queries
    );

    const ownFiles = [];
    const filesSharedWithMe = [];
    for (const file of files.documents) {
      if (file.users.includes(currentUser.email)) {
        filesSharedWithMe.push(file);
        continue;
      }
      ownFiles.push(file);
    }

    return { ownFiles, filesSharedWithMe };
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async (
  fileId: string,
  name: string,
  path: string
) => {
  const { database } = await createAdminClient();

  try {
    const newName = `${name}`;

    const updatedFile = await database.updateDocument(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      fileId,
      { name: newName }
    );

    revalidatePath(path);

    return { error: null, response: updatedFile };
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const shareFileToUsers = async (
  fileId: string,
  emails: string[],
  path: string
) => {
  try {
    const { database } = await createAdminClient();
    const user = await getCurrentUser();
    if (!user) redirect("sign-up");

    const hasShareFeature = await isPlanHasFeature(user.plans, "share_files");

    if (!hasShareFeature) {
      return { error: "does_not_has_feature", response: null };
    }

    const usersToShare = [];
    for (const email of emails) {
      const user = await getUserByEmail(email);
      if (!user) {
        return { error: "email_does_not_exits", response: email };
      }

      usersToShare.push(user.email);
    }

    const updatedFile = await database.updateDocument(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      fileId,
      { users: usersToShare }
    );

    revalidatePath(path);

    return { error: null, response: updatedFile };
  } catch (error) {
    handleError(error, "Failed to share file");
  }
};

export const deleteFile = async (
  fileId: string,
  bucketFileId: string,
  path: string
) => {
  const { database, storage } = await createAdminClient();

  try {
    await database.deleteDocument(DATABASE_ID!, FILES_COLLECTION_ID!, fileId);

    await storage.deleteFile(BUCKET_ID!, bucketFileId);

    revalidatePath(path);
    return { error: null, response: true };
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

const updateSpaceUsedFile = (
  newFile: Models.Document,
  fileStoraged: SpaceUsedFile
) => {
  const newFileDate = new Date(newFile.$updatedAt);

  if (newFileDate.getTime() > fileStoraged.date) {
    fileStoraged.date = newFileDate.getTime();
  }

  fileStoraged.size += newFile.size;
};

export const getTotalSpaceUsed = async () => {
  try {
    const files = await getFiles({
      types: [],
      searchText: "",
      sort: "$createdAt-desc",
    });

    if (!files) throw new Error("Files not found");

    const spaceUsed = {
      image: {
        url: "/cloud/files?type=images",
        icon: "/assets/icons/file-image-light.svg",
        date: 0,
        size: 0,
        title: "Images",
      },
      document: {
        url: "/cloud/files?type=documents",
        icon: "/assets/icons/file-document-light.svg",
        date: 0,
        size: 0,
        title: "Documents",
      },
      media: {
        url: "/cloud/files?type=medias",
        icon: "/assets/icons/file-video-light.svg",
        date: 0,
        size: 0,
        title: "Video, Audio",
      },
      other: {
        url: "/cloud/files?type=other",
        icon: "/assets/icons/file-other-light.svg",
        date: 0,
        size: 0,
        title: "Others",
      },
      total: 0,
    } as SpaceUsedObject;

    for (const file of files?.ownFiles) {
      const fileType = getFileType(file.name).type;

      switch (fileType) {
        case "document":
          updateSpaceUsedFile(file, spaceUsed.document);
          spaceUsed.total += file.size;
          break;
        case "image":
          updateSpaceUsedFile(file, spaceUsed.image);
          spaceUsed.total += file.size;
          break;
        case "video":
        case "audio":
          updateSpaceUsedFile(file, spaceUsed.media);
          spaceUsed.total += file.size;
          break;
        default:
          updateSpaceUsedFile(file, spaceUsed.other);
          spaceUsed.total += file.size;
          break;
      }
    }

    return spaceUsed;
  } catch (error) {
    handleError(error, "Failed to get total space used");
  }
};
