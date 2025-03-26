"use server";

import { ID, OAuthProvider, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { DATABASE_ID, USERS_COLLECTION_ID } from "../appwrite/config";
import { cookies } from "next/headers";
import { avatarPlacerHolderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { handleError } from "../utils";

const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    [Query.equal("email", [email])]
  );

  return users.total > 0 ? users.documents[0] : null;
};

const getUserById = async (id: string) => {
  const { database } = await createAdminClient();

  const users = await database.listDocuments(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    [Query.equal("accountId", [id])]
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
  email: string
) => {
  const existingUser = await getUserByEmail(email);

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

export const createOAuthAccount = async () => {
  try {
    const { account } = await createAdminClient();

    const OAuthURL = account.createOAuth2Token(
      OAuthProvider.Google,
      "http://localhost:3000/oauth",
      "http://localhost:3000/sign-in"
    );

    return OAuthURL;
  } catch (error) {
    handleError(error, "Failed to create OAuth account");
  }
};

export const verifySecret = async (accountId: string, password: string) => {
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

    createAccountIfNotExists(accountId, user.name, user.email);

    return { sessionId: session.$id };
  } catch (error) {
    handleError(error, "Failed to verify secret OTP");
  }
};

export const getCurrentUser = async () => {
  const { account, database } = await createSessionClient();
  const result = await account.get();

  const user = await database.listDocuments(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    [Query.equal("accountId", result.$id)]
  );

  if (user.total <= 0) return null;

  return user.documents[0];
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
