import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCompletionsCreate, mockPrisma, mockSyncUserPremiumStatus } =
  vi.hoisted(() => ({
    mockCompletionsCreate: vi.fn(),
    mockPrisma: {
      insight: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      moodLog: {
        findMany: vi.fn(),
      },
      diary: {
        findMany: vi.fn(),
      },
    },
    mockSyncUserPremiumStatus: vi.fn(),
  }));

vi.mock("openai", () => ({
  default: vi.fn().mockImplementation(function MockOpenAI() {
    return {
      chat: {
        completions: {
          create: mockCompletionsCreate,
        },
      },
    };
  }),
}));

vi.mock("@/lib/prisma", () => ({
  default: mockPrisma,
}));

vi.mock("@/lib/subscription/service", () => ({
  syncUserPremiumStatus: mockSyncUserPremiumStatus,
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn((value: string) => value.replace(/^encrypted:/, "")),
}));

import { Priority, Sender } from "@/app/generated/prisma/client";
import { generateDailyInsight } from "@/lib/insight/service";

describe("lib/insight/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSyncUserPremiumStatus.mockResolvedValue({ isPremium: true });
    mockPrisma.insight.findFirst.mockResolvedValue(null);
    mockPrisma.moodLog.findMany.mockResolvedValue([
      {
        moodScore: 2,
        note: "Aku takut karena rahasia keluarga dibahas di kelas",
        createdAt: new Date("2026-05-20T04:00:00.000Z"),
      },
    ]);
    mockPrisma.diary.findMany.mockResolvedValue([
      {
        id: "diary-1",
        messages: [
          {
            senderType: Sender.USER,
            content:
              "encrypted:Aku dibully oleh Danu di kantin sekolah jam istirahat",
            createdAt: new Date("2026-05-20T05:00:00.000Z"),
          },
        ],
      },
    ]);
    mockPrisma.insight.create.mockImplementation(async (args) => ({
      id: "insight-1",
      ...args.data,
    }));
  });

  it("Harus menyimpan insight dengan struktur lengkap tanpa mengutip isi diary atau note mentah", async () => {
    mockCompletionsCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              averageScore: 2,
              analysisText:
                "Aku dibully oleh Danu di kantin sekolah jam istirahat",
              cognitivePattern:
                "Aku takut karena rahasia keluarga dibahas di kelas",
              affirmation:
                "Kamu tetap berharga dan boleh mencari orang dewasa tepercaya.",
              recommendations: [
                {
                  priority: "TINGGI",
                  label: "Cerita ke wali kelas",
                  desc: "Aku dibully oleh Danu di kantin sekolah jam istirahat",
                },
              ],
            }),
          },
        },
      ],
    });

    await generateDailyInsight({
      userId: "user-1",
      date: "2026-05-20",
      timezone: "Asia/Jakarta",
    });

    const createArg = mockPrisma.insight.create.mock.calls[0]?.[0];
    expect(createArg).toBeTruthy();
    expect(createArg.data.averageScore).toBe(2);
    expect(createArg.data.analysisText).not.toContain("Danu");
    expect(createArg.data.analysisText).not.toContain("kantin sekolah");
    expect(createArg.data.cognitivePattern).not.toContain("rahasia keluarga");
    expect(createArg.data.affirmation).toBe(
      "Kamu tetap berharga dan boleh mencari orang dewasa tepercaya.",
    );
    expect(createArg.data.recommendations.create).toEqual([
      {
        priority: Priority.TINGGI,
        actionText: JSON.stringify({
          label: "Cerita ke wali kelas",
          desc: "Pilih satu hal ringan yang terasa aman untuk dilakukan hari ini.",
        }),
      },
    ]);
  });
});
