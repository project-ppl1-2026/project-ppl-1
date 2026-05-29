import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/diary/brave-choice/route";
import { POST as POST_RESET } from "@/app/api/diary/brave-choice/reset/route";
import { GET as GET_STATUS } from "@/app/api/diary/brave-choice/status/route";
import { GET as GET_STATS } from "@/app/api/diary/brave-choice/stats/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  BraveChoiceServiceError,
  getBraveChoiceQuizForUser,
  getBraveChoiceStatusForUser,
  getBraveChoiceStatsForUser,
  resetBraveChoiceProgressForUser,
  submitBraveChoiceAnswerForUser,
} from "@/lib/diary/brave-choice-service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/diary/brave-choice-service", () => ({
  BraveChoiceServiceError: class BraveChoiceServiceError extends Error {
    status: number;
    code: string;
    constructor(message: string, status = 400, code = "BRAVE_CHOICE_ERROR") {
      super(message);
      this.name = "BraveChoiceServiceError";
      this.status = status;
      this.code = code;
    }
  },
  getBraveChoiceQuizForUser: vi.fn(),
  getBraveChoiceStatusForUser: vi.fn(),
  getBraveChoiceStatsForUser: vi.fn(),
  submitBraveChoiceAnswerForUser: vi.fn(),
  resetBraveChoiceProgressForUser: vi.fn(),
}));

const mockGetAuthenticatedUserIdFromRequest = vi.mocked(
  getAuthenticatedUserIdFromRequest,
);
const mockGetBraveChoiceQuizForUser = vi.mocked(getBraveChoiceQuizForUser);
const mockGetBraveChoiceStatusForUser = vi.mocked(getBraveChoiceStatusForUser);
const mockGetBraveChoiceStatsForUser = vi.mocked(getBraveChoiceStatsForUser);
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

    it("returns service error when quiz service rejects with BraveChoiceServiceError", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceQuizForUser.mockRejectedValue(
        new BraveChoiceServiceError("Quota habis", 403, "QUIZ_QUOTA_EXCEEDED"),
      );

      const request = new Request("http://localhost/api/diary/brave-choice");
      const response = await GET(request);

      expect(response.status).toBe(403);
      const json = await response.json();
      expect(json.code).toBe("QUIZ_QUOTA_EXCEEDED");
    });

    it("returns 500 when quiz service throws unexpected error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceQuizForUser.mockRejectedValue(new Error("DB down"));

      const request = new Request("http://localhost/api/diary/brave-choice");
      const response = await GET(request);

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });

  describe("GET /api/diary/brave-choice/status", () => {
    it("returns 401 when not authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);

      const request = new Request(
        "http://localhost/api/diary/brave-choice/status",
      );
      const response = await GET_STATUS(request);

      expect(response.status).toBe(401);
    });

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

    it("returns service error from status service", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceStatusForUser.mockRejectedValue(
        new BraveChoiceServiceError(
          "User tidak ditemukan",
          404,
          "USER_NOT_FOUND",
        ),
      );

      const request = new Request(
        "http://localhost/api/diary/brave-choice/status",
      );
      const response = await GET_STATUS(request);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.code).toBe("USER_NOT_FOUND");
    });

    it("returns 500 when status service throws unexpected error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceStatusForUser.mockRejectedValue(new Error("DB down"));

      const request = new Request(
        "http://localhost/api/diary/brave-choice/status",
      );
      const response = await GET_STATUS(request);

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });

  describe("GET /api/diary/brave-choice/stats", () => {
    it("returns stats payload when authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceStatsForUser.mockResolvedValue({
        correct: 22,
        total: 25,
        pct: 88,
      });

      const request = new Request(
        "http://localhost/api/diary/brave-choice/stats?timezone=Asia/Jakarta",
      );
      const response = await GET_STATS(request);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.pct).toBe(88);
      expect(mockGetBraveChoiceStatsForUser).toHaveBeenCalledWith("user-1");
    });

    it("returns 401 when not authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);

      const request = new Request(
        "http://localhost/api/diary/brave-choice/stats",
      );
      const response = await GET_STATS(request);

      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.success).toBe(false);
    });

    it("returns 500 when stats service throws unexpected error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockGetBraveChoiceStatsForUser.mockRejectedValue(new Error("DB down"));

      const request = new Request(
        "http://localhost/api/diary/brave-choice/stats",
      );
      const response = await GET_STATS(request);

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      consoleSpy.mockRestore();
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

    it("returns 401 when not authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);

      const request = new Request("http://localhost/api/diary/brave-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: "q1", chosenOption: "A" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it("returns 400 when answer payload invalid", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");

      const request = new Request("http://localhost/api/diary/brave-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: "", chosenOption: "C" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("returns service error from submit service", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockSubmitBraveChoiceAnswerForUser.mockRejectedValue(
        new BraveChoiceServiceError(
          "Soal tidak ditemukan",
          404,
          "QUESTION_NOT_FOUND",
        ),
      );

      const request = new Request("http://localhost/api/diary/brave-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: "q1", chosenOption: "A" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.code).toBe("QUESTION_NOT_FOUND");
    });

    it("returns 500 when submit service throws unexpected error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockSubmitBraveChoiceAnswerForUser.mockRejectedValue(
        new Error("DB down"),
      );

      const request = new Request("http://localhost/api/diary/brave-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: "q1", chosenOption: "A" }),
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });

  describe("POST /api/diary/brave-choice/reset", () => {
    it("returns 401 when not authenticated", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);

      const request = new Request(
        "http://localhost/api/diary/brave-choice/reset",
        { method: "POST" },
      );
      const response = await POST_RESET(request);

      expect(response.status).toBe(401);
    });

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

    it("returns service error from reset service", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockResetBraveChoiceProgressForUser.mockRejectedValue(
        new BraveChoiceServiceError(
          "User tidak ditemukan",
          404,
          "USER_NOT_FOUND",
        ),
      );

      const request = new Request(
        "http://localhost/api/diary/brave-choice/reset",
        { method: "POST" },
      );
      const response = await POST_RESET(request);

      expect(response.status).toBe(404);
      const json = await response.json();
      expect(json.code).toBe("USER_NOT_FOUND");
    });

    it("returns 500 when reset service throws unexpected error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user-1");
      mockResetBraveChoiceProgressForUser.mockRejectedValue(
        new Error("DB down"),
      );

      const request = new Request(
        "http://localhost/api/diary/brave-choice/reset",
        { method: "POST" },
      );
      const response = await POST_RESET(request);

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });
});
