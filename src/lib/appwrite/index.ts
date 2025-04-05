"use server";

import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
  Users,
} from "node-appwrite";
import { cookies } from "next/headers";
import {
  SECRET_KEY,
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  PROJECT_ID,
} from "./config";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(PROJECT_ID!);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(SECRET_KEY!);

  return {
    get users() {
      return new Users(client);
    },
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
