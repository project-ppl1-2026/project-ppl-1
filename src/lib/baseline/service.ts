import "server-only";

import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { runBaselineInference } from "@/lib/baseline/inference";
import type { BaselineAnswersTuple } from "@/lib/baseline/validation";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type BaselineResult = {
  id: string;
  userId: string;
  isBeginner: boolean;
  label: "Beginner" | "Intermediate";
  confidenceScore: number | null;
  analyzedAt: Date;
};

function toConfidenceScore(
  value: Prisma.Decimal | { toNumber: () => number } | number | null,
): number | null {
  if (value === null) return null;
  if (typeof value === "number") return value;
  if (typeof value.toNumber === "function") return value.toNumber();

  return null;
}

// ─────────────────────────────────────────────────────────────
// getBaselineByUserId
// ─────────────────────────────────────────────────────────────

/**
 * Ambil hasil baseline yang sudah tersimpan untuk user tertentu.
 * Return null jika user belum pernah mengisi baseline.
 */
export async function getBaselineByUserId(
  userId: string,
): Promise<BaselineResult | null> {
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

  if (!baseline) return null;

  const confidenceScore = toConfidenceScore(baseline.mlConfidenceScore);

  return {
    id: baseline.id,
    userId: baseline.userId,
    isBeginner: baseline.isBeginner,
    label: baseline.isBeginner ? "Beginner" : "Intermediate",
    confidenceScore,
    analyzedAt: baseline.analyzedAt,
  };
}

// ─────────────────────────────────────────────────────────────
// analyzeAndSaveBaseline
// ─────────────────────────────────────────────────────────────

/**
 * Jalankan ML inference lalu simpan (atau update) hasilnya ke database.
 * Return data baseline yang sudah disimpan beserta hasil inference-nya.
 */
export async function analyzeAndSaveBaseline({
  answers,
  userId,
}: {
  answers: BaselineAnswersTuple;
  userId: string;
}): Promise<{
  baseline: BaselineResult;
  inference: Awaited<ReturnType<typeof runBaselineInference>>;
}> {
  const inference = await runBaselineInference(answers);

  const saved = await prisma.baseline.upsert({
    where: { userId },
    create: {
      userId,
      isBeginner: inference.isBeginner,
      mlConfidenceScore: inference.confidenceScore,
      analyzedAt: new Date(),
    },
    update: {
      isBeginner: inference.isBeginner,
      mlConfidenceScore: inference.confidenceScore,
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

  const confidenceScore = toConfidenceScore(saved.mlConfidenceScore);

  const baseline: BaselineResult = {
    id: saved.id,
    userId: saved.userId,
    isBeginner: saved.isBeginner,
    label: saved.isBeginner ? "Beginner" : "Intermediate",
    confidenceScore,
    analyzedAt: saved.analyzedAt,
  };

  return { baseline, inference };
}
