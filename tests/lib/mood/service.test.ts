import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLocalDateString,
  parseDateString,
  createMoodLog,
  getMoodLogs,
  resetStreakIfMissed,
} from "@/lib/mood/service";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    moodLog: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const mockMoodFindFirst = vi.mocked(prisma.moodLog.findFirst);
const mockMoodFindMany = vi.mocked(prisma.moodLog.findMany);
const mockUserFindUnique = vi.mocked(prisma.user.findUnique);
const mockUserUpdate = vi.mocked(prisma.user.update);
const mockTransaction = vi.mocked(prisma.$transaction);

describe("lib/mood/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────
  // getLocalDateString
  // ─────────────────────────────────────
  describe("getLocalDateString", () => {
    it("Harus return YYYY-MM-DD sesuai timezone Jakarta", () => {
      const date = new Date("2025-01-01T05:00:00Z"); // 12:00 WIB
      expect(getLocalDateString(date, "Asia/Jakarta")).toBe("2025-01-01");
    });

    it("Harus return tanggal berbeda jika UTC vs WIB beda hari", () => {
      const date = new Date("2025-01-01T18:00:00Z"); // 01:00 WIB keesokan harinya
      expect(getLocalDateString(date, "Asia/Jakarta")).toBe("2025-01-02");
    });

    it("Harus fallback ke UTC date jika timezone tidak valid", () => {
      const date = new Date("2025-06-15T10:00:00Z");
      expect(getLocalDateString(date, "Bukan/Timezone")).toBe("2025-06-15");
    });

    it("Harus handle timezone Amerika yang beda jauh dari UTC", () => {
      // 2025-01-01 04:00 UTC = 2024-12-31 23:00 New York (UTC-5)
      const date = new Date("2025-01-01T04:00:00Z");
      expect(getLocalDateString(date, "America/New_York")).toBe("2024-12-31");
    });
  });

  // ─────────────────────────────────────
  // parseDateString
  // ─────────────────────────────────────
  describe("parseDateString", () => {
    it("Harus parse YYYY-MM-DD jadi Date awal hari UTC", () => {
      const result = parseDateString("2025-01-15");
      expect(result.toISOString()).toBe("2025-01-15T00:00:00.000Z");
    });

    it("Harus return Date yang valid", () => {
      const result = parseDateString("2025-12-31");
      expect(result).toBeInstanceOf(Date);
      expect(isNaN(result.getTime())).toBe(false);
    });
  });

  // ─────────────────────────────────────
  // createMoodLog
  // ─────────────────────────────────────
  describe("createMoodLog", () => {
    it("Harus throw error jika user tidak ditemukan", async () => {
      mockMoodFindFirst.mockResolvedValue(null);
      mockUserFindUnique.mockResolvedValue(null);

      await expect(
        createMoodLog({ userId: "user1", moodScore: 3, timezone: "Asia/Jakarta" }),
      ).rejects.toThrow("User tidak ditemukan.");
    });

    it("Harus throw error jika sudah submit mood hari ini (tanggal lokal sama)", async () => {
      // createdAt = sekarang = hari yang sama di WIB
      const now = new Date();
      mockMoodFindFirst.mockResolvedValue({ id: "log1", createdAt: now } as never);
      mockUserFindUnique.mockResolvedValue({ currentStreak: 3 } as never);

      await expect(
        createMoodLog({ userId: "user1", moodScore: 3, timezone: "Asia/Jakarta" }),
      ).rejects.toThrow("Kamu sudah mengisi mood check-in hari ini.");
    });

    it("Harus set streak = 1 jika ini log pertama (lastLog null)", async () => {
      mockMoodFindFirst.mockResolvedValue(null);
      mockUserFindUnique.mockResolvedValue({ currentStreak: 0 } as never);
      mockTransaction.mockResolvedValue([
        { id: "log1", moodScore: 3 },
        { id: "user1", currentStreak: 1 },
      ] as never);

      const result = await createMoodLog({
        userId: "user1",
        moodScore: 3,
        timezone: "Asia/Jakarta",
      });

      expect(mockTransaction).toHaveBeenCalled();
      expect(result.updatedUser.currentStreak).toBe(1);
    });

    it("Harus naikkan streak jika log terakhir kemarin (diffDays = 1)", async () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(3, 0, 0, 0); // jam 10:00 WIB kemarin

      mockMoodFindFirst.mockResolvedValue({ id: "log0", createdAt: yesterday } as never);
      mockUserFindUnique.mockResolvedValue({ currentStreak: 5 } as never);
      mockTransaction.mockResolvedValue([
        { id: "log1", moodScore: 4 },
        { id: "user1", currentStreak: 6 },
      ] as never);

      const result = await createMoodLog({
        userId: "user1",
        moodScore: 4,
        timezone: "Asia/Jakarta",
      });

      expect(result.updatedUser.currentStreak).toBe(6);
    });

    it("Harus reset streak ke 1 jika bolong lebih dari 1 hari", async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);
      threeDaysAgo.setUTCHours(3, 0, 0, 0);

      mockMoodFindFirst.mockResolvedValue({ id: "log-old", createdAt: threeDaysAgo } as never);
      mockUserFindUnique.mockResolvedValue({ currentStreak: 10 } as never);
      mockTransaction.mockResolvedValue([
        { id: "log1", moodScore: 2 },
        { id: "user1", currentStreak: 1 },
      ] as never);

      const result = await createMoodLog({
        userId: "user1",
        moodScore: 2,
        timezone: "Asia/Jakarta",
      });

      expect(result.updatedUser.currentStreak).toBe(1);
    });

    it("Harus menyertakan note jika dikirim", async () => {
      mockMoodFindFirst.mockResolvedValue(null);
      mockUserFindUnique.mockResolvedValue({ currentStreak: 0 } as never);
      mockTransaction.mockResolvedValue([
        { id: "log1", moodScore: 5, note: "Hari baik" },
        { id: "user1", currentStreak: 1 },
      ] as never);

      const result = await createMoodLog({
        userId: "user1",
        moodScore: 5,
        note: "Hari baik",
        timezone: "Asia/Jakarta",
      });

      expect(result.newLog.note).toBe("Hari baik");
    });
  });

  // ─────────────────────────────────────
  // getMoodLogs
  // ─────────────────────────────────────
  describe("getMoodLogs", () => {
    it("Harus return semua log jika tidak ada filter tanggal", async () => {
      const mockLogs = [
        { id: "log1", createdAt: new Date("2025-01-01T05:00:00Z") },
        { id: "log2", createdAt: new Date("2025-01-02T05:00:00Z") },
      ];
      mockMoodFindMany.mockResolvedValue(mockLogs as never);

      const result = await getMoodLogs("user1");

      expect(mockMoodFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: "user1" } }),
      );
      expect(result).toHaveLength(2);
    });

    it("Harus filter log berdasarkan tanggal lokal jika dateLocalStr diberikan", async () => {
      const mockLogs = [
        { id: "log1", createdAt: new Date("2025-01-01T05:00:00Z") }, // 2025-01-01 WIB
        { id: "log2", createdAt: new Date("2025-01-02T05:00:00Z") }, // 2025-01-02 WIB
      ];
      mockMoodFindMany.mockResolvedValue(mockLogs as never);

      const result = await getMoodLogs("user1", "2025-01-01", "Asia/Jakarta");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("log1");
    });

    it("Harus pakai UTC jika timezone tidak diberikan saat filter tanggal", async () => {
      const mockLogs = [
        { id: "log1", createdAt: new Date("2025-06-15T10:00:00Z") },
      ];
      mockMoodFindMany.mockResolvedValue(mockLogs as never);

      const result = await getMoodLogs("user1", "2025-06-15");

      expect(result).toHaveLength(1);
    });

    it("Harus return array kosong jika tidak ada log yang cocok tanggalnya", async () => {
      const mockLogs = [
        { id: "log1", createdAt: new Date("2025-01-05T05:00:00Z") },
      ];
      mockMoodFindMany.mockResolvedValue(mockLogs as never);

      const result = await getMoodLogs("user1", "2025-01-01", "Asia/Jakarta");

      expect(result).toHaveLength(0);
    });
  });

  // ─────────────────────────────────────
  // resetStreakIfMissed
  // ─────────────────────────────────────
  describe("resetStreakIfMissed", () => {
    it("Harus tidak melakukan apa-apa jika tidak ada log", async () => {
      mockMoodFindFirst.mockResolvedValue(null);

      await resetStreakIfMissed("user1", "Asia/Jakarta");

      expect(mockUserUpdate).not.toHaveBeenCalled();
    });

    it("Harus tidak reset streak jika log terakhir kemarin (diffDays = 1)", async () => {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      yesterday.setUTCHours(3, 0, 0, 0);

      mockMoodFindFirst.mockResolvedValue({ createdAt: yesterday } as never);

      await resetStreakIfMissed("user1", "Asia/Jakarta");

      expect(mockUserUpdate).not.toHaveBeenCalled();
    });

    it("Harus reset streak ke 0 jika bolong lebih dari 1 hari", async () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);
      threeDaysAgo.setUTCHours(3, 0, 0, 0);

      mockMoodFindFirst.mockResolvedValue({ createdAt: threeDaysAgo } as never);
      mockUserUpdate.mockResolvedValue({} as never);

      await resetStreakIfMissed("user1", "Asia/Jakarta");

      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: "user1" },
        data: { currentStreak: 0 },
      });
    });

    it("Harus tidak reset jika log terakhir hari ini", async () => {
      const todayWib = new Date();
      todayWib.setUTCHours(3, 0, 0, 0); // 10:00 WIB hari ini

      mockMoodFindFirst.mockResolvedValue({ createdAt: todayWib } as never);

      await resetStreakIfMissed("user1", "Asia/Jakarta");

      expect(mockUserUpdate).not.toHaveBeenCalled();
    });
  });
});
