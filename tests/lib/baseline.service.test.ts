import { describe, it, expect, vi, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

// Mock server-only sebelum apapun diload
vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  default: {
    baseline: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/baseline/inference", () => ({
  runBaselineInference: vi.fn(),
}));

import { getBaselineByUserId, analyzeAndSaveBaseline } from "@/lib/baseline/service";
import { runBaselineInference } from "@/lib/baseline/inference";

const mockBaselineFindUnique = vi.mocked(prisma.baseline.findUnique);
const mockBaselineUpsert = vi.mocked(prisma.baseline.upsert);
const mockRunBaselineInference = vi.mocked(runBaselineInference);

describe("lib/baseline/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getBaselineByUserId", () => {
    it("Harus return null jika baseline belum ada", async () => {
      mockBaselineFindUnique.mockResolvedValue(null);

      const result = await getBaselineByUserId("user-baru");

      expect(result).toBeNull();
      expect(mockBaselineFindUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: "user-baru" } }),
      );
    });

    it("Harus return data baseline dengan label Beginner jika isBeginner = true", async () => {
      const mockBaseline = {
        id: "base-1",
        userId: "user1",
        isBeginner: true,
        mlConfidenceScore: { toNumber: () => 0.85 },
        analyzedAt: new Date("2025-01-01"),
      };
      mockBaselineFindUnique.mockResolvedValue(mockBaseline as never);

      const result = await getBaselineByUserId("user1");

      expect(result).not.toBeNull();
      expect(result?.label).toBe("Beginner");
      expect(result?.isBeginner).toBe(true);
      expect(result?.id).toBe("base-1");
      expect(result?.confidenceScore).toBe(0.85);
    });

    it("Harus return label Intermediate jika isBeginner = false", async () => {
      const mockBaseline = {
        id: "base-2",
        userId: "user2",
        isBeginner: false,
        mlConfidenceScore: null,
        analyzedAt: new Date("2025-01-01"),
      };
      mockBaselineFindUnique.mockResolvedValue(mockBaseline as never);

      const result = await getBaselineByUserId("user2");

      expect(result?.label).toBe("Intermediate");
      expect(result?.isBeginner).toBe(false);
      expect(result?.confidenceScore).toBeNull();
    });
  });

  describe("analyzeAndSaveBaseline", () => {
    it("Harus jalankan inference dan simpan hasilnya ke DB", async () => {
      mockRunBaselineInference.mockResolvedValue({
        isBeginner: true,
        confidenceScore: 0.9,
        label: "Beginner",
        labelIndex: 0,
        inputName: "answers",
      } as never);

      const mockSaved = {
        id: "base-1",
        userId: "user1",
        isBeginner: true,
        mlConfidenceScore: { toNumber: () => 0.9 },
        analyzedAt: new Date(),
      };
      mockBaselineUpsert.mockResolvedValue(mockSaved as never);

      const answers = [
        "Agree", "Disagree", "Agree", "Agree",
        "Yes", "No", "Yes", "No",
      ] as never;

      const result = await analyzeAndSaveBaseline({ answers, userId: "user1" });

      expect(mockRunBaselineInference).toHaveBeenCalledWith(answers);
      expect(mockBaselineUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user1" },
          create: expect.objectContaining({ userId: "user1", isBeginner: true }),
          update: expect.objectContaining({ isBeginner: true }),
        }),
      );
      expect(result.baseline.label).toBe("Beginner");
      expect(result.inference.isBeginner).toBe(true);
    });

    it("Harus simpan label Intermediate jika inference return isBeginner = false", async () => {
      mockRunBaselineInference.mockResolvedValue({
        isBeginner: false,
        confidenceScore: 0.75,
        label: "Intermediate",
        labelIndex: 1,
        inputName: "answers",
      } as never);

      const mockSaved = {
        id: "base-2",
        userId: "user2",
        isBeginner: false,
        mlConfidenceScore: { toNumber: () => 0.75 },
        analyzedAt: new Date(),
      };
      mockBaselineUpsert.mockResolvedValue(mockSaved as never);

      const result = await analyzeAndSaveBaseline({
        answers: [] as never,
        userId: "user2",
      });

      expect(result.baseline.label).toBe("Intermediate");
      expect(result.inference.isBeginner).toBe(false);
    });
  });
});
