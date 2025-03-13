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
import { getCurrentUser } from "./user.actions";

export const uploadFiles = async (
  file: File,
  ownerId: string,
  accountId: string,
  path: string
) => {
  const { storage, database } = await createAdminClient();
  try {
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
    return newFile;
  } catch (error) {
    handleError(error, "failed to upload files");
  }
};

export const createQueries = async (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { database } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const queries = await createQueries(currentUser);
    const files = await database.listDocuments(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      queries
    );

    return files;
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async (
  fileId: string,
  name: string,
  extension: string,
  path: string
) => {
  const { database } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await database.updateDocument(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      fileId,
      { name: newName }
    );

    revalidatePath(path);

    return updatedFile;
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const shareFileToUsers = async (
  fileId: string,
  emails: string[],
  path: string
) => {
  const { database } = await createAdminClient();

  try {
    const updatedFile = await database.updateDocument(
      DATABASE_ID!,
      FILES_COLLECTION_ID!,
      fileId,
      { users: emails }
    );

    revalidatePath(path);

    return updatedFile;
  } catch (error) {
    handleError(error, "Failed to rename file");
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
    return { success: true };
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};
