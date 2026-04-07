import "server-only";

import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

import { runBaselineInference } from "./inference";
import type { BaselineAnswersTuple } from "./validation";

export type BaselineRecordResponse = {
  analyzedAt: Date;
  confidenceScore: number | null;
  id: string;
  isBeginner: boolean;
  label: "Beginner" | "Intermediate";
  userId: string;
};

type AnalyzeAndSaveBaselineParams = {
  answers: BaselineAnswersTuple;
  userId: string;
};

function formatBaselineRecord(record: {
  analyzedAt: Date;
  id: string;
  isBeginner: boolean;
  mlConfidenceScore: Prisma.Decimal | null;
  userId: string;
}): BaselineRecordResponse {
  return {
    analyzedAt: record.analyzedAt,
    confidenceScore: record.mlConfidenceScore
      ? Number(record.mlConfidenceScore)
      : null,
    id: record.id,
    isBeginner: record.isBeginner,
    label: record.isBeginner ? "Beginner" : "Intermediate",
    userId: record.userId,
  };
}

/**
 * Reads the latest saved baseline result for the current user.
 */
export async function getBaselineByUserId(userId: string) {
  const baseline = await prisma.baseline.findUnique({
    where: { userId },
    select: {
      id: true,
      userId: true,
      isBeginner: true,
      mlConfidenceScore: true,
      analyzedAt: true,
    },
  });

  return baseline ? formatBaselineRecord(baseline) : null;
}

/**
 * Runs the baseline model and upserts the result into the `baseline` table.
 */
export async function analyzeAndSaveBaseline({
  answers,
  userId,
}: AnalyzeAndSaveBaselineParams) {
  const inference = await runBaselineInference(answers);

  const baseline = await prisma.baseline.upsert({
    where: { userId },
    create: {
      userId,
      isBeginner: inference.isBeginner,
      mlConfidenceScore: new Prisma.Decimal(inference.confidenceScore),
      analyzedAt: new Date(),
    },
    update: {
      isBeginner: inference.isBeginner,
      mlConfidenceScore: new Prisma.Decimal(inference.confidenceScore),
      analyzedAt: new Date(),
    },
    select: {
      id: true,
      userId: true,
      isBeginner: true,
      mlConfidenceScore: true,
      analyzedAt: true,
    },
  });

  return {
    baseline: formatBaselineRecord(baseline),
    inference,
  };
}
