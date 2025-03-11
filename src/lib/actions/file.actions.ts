"use server";
import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { constructFileUrl, getFileType, handleError } from "../utils";
import {
  BUCKET_ID,
  DATABASE_ID,
  FILES_COLLECTION_ID,
} from "../appwrite/config";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

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
