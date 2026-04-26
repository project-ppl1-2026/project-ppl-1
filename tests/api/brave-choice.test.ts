import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/diary/brave-choice/route";
import { POST as POST_RESET } from "@/app/api/diary/brave-choice/reset/route";
import { GET as GET_STATUS } from "@/app/api/diary/brave-choice/status/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  getBraveChoiceQuizForUser,
  getBraveChoiceStatusForUser,
  resetBraveChoiceProgressForUser,
  submitBraveChoiceAnswerForUser,
} from "@/lib/diary/brave-choice-service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/diary/brave-choice-service", () => ({
  getBraveChoiceQuizForUser: vi.fn(),
  getBraveChoiceStatusForUser: vi.fn(),
  submitBraveChoiceAnswerForUser: vi.fn(),
  resetBraveChoiceProgressForUser: vi.fn(),
}));

const mockGetAuthenticatedUserIdFromRequest = vi.mocked(
  getAuthenticatedUserIdFromRequest,
);
const mockGetBraveChoiceQuizForUser = vi.mocked(getBraveChoiceQuizForUser);
const mockGetBraveChoiceStatusForUser = vi.mocked(getBraveChoiceStatusForUser);
const mockSubmitBraveChoiceAnswerForUser = vi.mocked(
  submitBraveChoiceAnswerForUser,
);
const mockResetBraveChoiceProgressForUser = vi.mocked(
  resetBraveChoiceProgressForUser,
);

describe("BraveChoice API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/diary/brave-choice", () => {
    it("returns 401 for unauthenticated user", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);

      const request = new Request(
        "http://localhost/api/diary/brave-choice?timezone=Asia/Jakarta",
      );
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it("returns quiz payload when authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceQuizForUser.mockResolvedValue({
        quiz: {
          id: "question-1",
          category: "Bullying",
          scenario: "Temanmu diejek di grup kelas.",
          options: [
            { label: "A", text: "Membela teman", isBrave: true },
            { label: "B", text: "Diam saja", isBrave: false },
          ],
          explanationWrong: "Diam memperkuat pelaku.",
          explanationRight: "Membela teman adalah tindakan berani.",
        },
        quizUsedToday: 1,
        isQuotaReached: false,
      });

      const request = new Request(
        "http://localhost/api/diary/brave-choice?timezone=Asia/Jakarta",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      const json = (await response.json()) as {
        success: boolean;
        data: {
          quiz: { id: string } | null;
          quizUsedToday: number;
          isQuotaReached: boolean;
        };
      };

      expect(json.success).toBe(true);
      expect(json.data.quiz?.id).toBe("question-1");
      expect(json.data.quizUsedToday).toBe(1);
      expect(json.data.isQuotaReached).toBe(false);
    });
  });

  describe("GET /api/diary/brave-choice/status", () => {
    it("returns status payload when authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceStatusForUser.mockResolvedValue({
        quizUsedToday: 5,
        isQuotaReached: true,
        hasAvailableQuestion: false,
      });

      const request = new Request(
        "http://localhost/api/diary/brave-choice/status?timezone=Asia/Jakarta",
      );
      const response = await GET_STATUS(request);

      expect(response.status).toBe(200);
      const json = (await response.json()) as {
        success: boolean;
        data: {
          quizUsedToday: number;
          isQuotaReached: boolean;
          hasAvailableQuestion: boolean;
        };
      };

      expect(json.success).toBe(true);
      expect(json.data.quizUsedToday).toBe(5);
      expect(json.data.isQuotaReached).toBe(true);
      expect(json.data.hasAvailableQuestion).toBe(false);
    });
  });

  describe("POST /api/diary/brave-choice", () => {
    it("stores answer and returns result", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockSubmitBraveChoiceAnswerForUser.mockResolvedValue({
        questionId: "question-1",
        chosenOption: "A",
        isCorrect: true,
        explanation: "Pilihanmu tepat.",
        quizUsedToday: 2,
      });

      const request = new Request("http://localhost/api/diary/brave-choice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: "question-1",
          chosenOption: "A",
          timezone: "Asia/Jakarta",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const json = (await response.json()) as {
        success: boolean;
        data: {
          questionId: string;
          isCorrect: boolean;
          quizUsedToday: number;
        };
      };

      expect(json.success).toBe(true);
      expect(json.data.questionId).toBe("question-1");
      expect(json.data.isCorrect).toBe(true);
      expect(json.data.quizUsedToday).toBe(2);
    });
  });

  describe("POST /api/diary/brave-choice/reset", () => {
    it("resets progress for authenticated user", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockResetBraveChoiceProgressForUser.mockResolvedValue({
        resetCount: 9,
      });

      const request = new Request(
        "http://localhost/api/diary/brave-choice/reset",
        {
          method: "POST",
        },
      );
      const response = await POST_RESET(request);

      expect(response.status).toBe(200);
      const json = (await response.json()) as {
        success: boolean;
        data: { resetCount: number };
      };

      expect(json.success).toBe(true);
      expect(json.data.resetCount).toBe(9);
    });
  });
});
