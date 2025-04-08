"use server";

import { Models, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import {
  DATABASE_ID,
  PLANS_COLLECTION_ID,
  USERS_COLLECTION_ID,
} from "../appwrite/config";
import { handleError } from "../utils";

export const getPlanByName = async (planName: string) => {
  try {
    const { database } = await createAdminClient();

    const plan = await database.listDocuments(
      DATABASE_ID!,
      PLANS_COLLECTION_ID!,
      [Query.equal("name", planName)]
    );

    return plan;
  } catch (error) {
    handleError(error, "Failed to get Plan by Name");
  }
};

export const applyUserPlan = async (userId: string, planName: string) => {
  try {
    const { database } = await createAdminClient();

    const plan = await getPlanByName(planName);

    if (plan && plan.total > 0) {
      const userUpdated = await database.updateDocument(
        DATABASE_ID!,
        USERS_COLLECTION_ID!,
        userId,
        { plans: plan.documents[0].$id }
      );

      return userUpdated;
    }
  } catch (error) {
    handleError(error, "Failed to apply user plan");
  }
};

export const getPlanById = async (planId: string) => {
  if (!planId) return null;
  try {
    const { database } = await createAdminClient();

    const plan = await database.getDocument(
      DATABASE_ID!,
      PLANS_COLLECTION_ID!,
      planId
    );

    return plan;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.type === "document_not_found") {
      return null;
    }
    handleError(error, "Failed to get user plan");
    return null;
  }
};

export const isPlanHasFeature = async (
  plan: Models.Document,
  feature: PlansFeatures
) => {
  const features = plan.features;
  return features.includes(feature);
};
