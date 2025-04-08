"use server";

import { ID, OAuthProvider, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  USERS_COLLECTION_ID,
} from "../appwrite/config";
import { cookies } from "next/headers";
import { avatarPlacerHolderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { constructFileUrl, handleError } from "../utils";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";
import { getPlanById } from "./plans.actions";

export const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    [Query.equal("email", [email])]
  );

  return users.total > 0 ? users.documents[0] : null;
};

export const getUserById = async (id: string) => {
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    [Query.equal("accountId", id)]
  );

  return users.total > 0 ? users.documents[0] : null;
};

export const sendEmailOTP = async (email: string, id?: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(
      id ? id : ID.unique(),
      email
    );

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createEmailAuthAccount = async (
  fullName: string,
  email: string,
  type: "sign-in" | "sign-up"
) => {
  const existingUser = await getUserByEmail(email);
  if (type === "sign-up" && existingUser) {
    throw new Error("Email already exists");
  }

  const accountId = await sendEmailOTP(email, existingUser?.$id);

  if (!accountId) throw new Error("Failed to send email OTP");

  return { accountId };
};

export const createAccountIfNotExists = async (
  accountId: string,
  fullName: string,
  email: string
) => {
  const existingUser = await getUserById(accountId);

  if (!existingUser) {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlacerHolderUrl,
        accountId,
      }
    );

    return user;
  }

  return existingUser;
};

export const createOAuthAccount = async (path: string) => {
  try {
    const { account } = await createAdminClient();

    const OAuthURL = account.createOAuth2Token(
      OAuthProvider.Google,
      `${path}/oauth`,
      `${path}/sign-in`
    );

    return OAuthURL;
  } catch (error) {
    handleError(error, "Failed to create OAuth account");
  }
};

export const createSessionSecret = async (
  accountId: string,
  password: string,
  name: string
) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const { account: sessionAccount } = await createSessionClient();
    const user = await sessionAccount.get();

    if (name) {
      await sessionAccount.updateName(name);
    }

    await createAccountIfNotExists(accountId, name || user.name, user.email);

    return { sessionId: session.$id };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.type === "user_invalid_token") {
      return {
        error: {
          type: "user_invalid_token",
          message: "Invalid or expired token. Please check and try again.",
        },
      };
    }
    handleError(error, "Failed to verify secret OTP");
  }
};

export const updateUserAvatar = async (
  file: File,
  userId: string,
  path: string
) => {
  try {
    const { storage, database } = await createAdminClient();

    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      BUCKET_ID!,
      ID.unique(),
      inputFile
    );

    const userUpdated = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId,
      { avatar: constructFileUrl(bucketFile.$id) }
    );

    revalidatePath(path);
    return userUpdated;
  } catch (error) {
    handleError(error, "Failed to update user avatar");
  }
};

export const updateUserName = async (
  newUserName: string,
  userId: string,
  path: string
) => {
  try {
    const { database } = await createAdminClient();
    const { account } = await createSessionClient();

    await account.updateName(newUserName);

    const userUpdated = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId,
      { fullName: newUserName }
    );

    revalidatePath(path);
    return userUpdated;
  } catch (error) {
    handleError(error, "Failed to update user name");
  }
};

export const updateUserEmail = async (
  newUserEmail: string,
  userId: string,
  accountId: string,
  path: string
) => {
  try {
    const existingUser = await getUserByEmail(newUserEmail);
    if (existingUser) throw new Error("email_already_exists");

    const { database, users } = await createAdminClient();

    await users.updateEmail(accountId, newUserEmail);

    const userUpdated = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId,
      { email: newUserEmail }
    );

    revalidatePath(path);
    return userUpdated;
  } catch (error) {
    handleError(error, "Failed to update user email");
  }
};

export const getCurrentUser = async () => {
  try {
    const { account, database } = await createSessionClient();
    const result = await account.get();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return user.documents[0];
  } catch (error) {
    handleError(error, "Failed to get current user");
  }
};

export const getUserPlan = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/sign-up");

    const userPlan = await getPlanById(currentUser.plans?.$id);

    return userPlan;
  } catch (error) {
    handleError(error, "Failed to get User Plan");
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
    redirect("/sign-in");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
};
