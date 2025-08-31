"use server";

import z from "zod";
import { jobInfoSchema } from "./schemas";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { insertJobInfo, updateJobInfo as updatedJobInfoDB } from "./db";
import { redirect } from "next/navigation";
import { JobInfoTable } from "@/drizzle/schema/jobinfo";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobInfoIdTag } from "./dbCache";

export async function createJobInfo(unsafeData: z.infer<typeof jobInfoSchema>) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to create job information.",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid job information.",
    };
  }

  const jobInfo = await insertJobInfo({ ...data, userId });

  redirect(`/app/job-infos/${jobInfo.id}`);
}

export async function updateJobInfo(
  id: string,
  unsafeData: z.infer<typeof jobInfoSchema>
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return {
      error: true,
      message: "You don't have permission to update job information.",
    };
  }

  const { success, data } = jobInfoSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "Invalid job information.",
    };
  }

  const existingJobInfo = await _getJobInfo(id, userId);
  if (!existingJobInfo) {
    return {
      error: true,
      message: "You don't have permission to do this.",
    };
  }

  const jobInfo = await updatedJobInfoDB(id, data);

  redirect(`/app/job-infos/${jobInfo.id}`);
}

async function _getJobInfo(id: string, userId: string) {
  "use cache";

  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
