import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/insight/route";
import { POST } from "@/app/api/insight/generate/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  getInsightMapForUser,
  generateDailyInsight,
  InsightServiceError,
} from "@/lib/insight/service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/insight/service", () => ({
  getInsightMapForUser: vi.fn(),
  generateDailyInsight: vi.fn(),
  InsightServiceError: class InsightServiceError extends Error {
    status: number;
    code: string;
    constructor(message: string, status = 400, code = "INSIGHT_ERROR") {
      super(message);
      this.name = "InsightServiceError";
      this.status = status;
      this.code = code;
    }
  },
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockGetInsightMapForUser = vi.mocked(getInsightMapForUser);
const mockGenerateDailyInsight = vi.mocked(generateDailyInsight);

describe("Insight API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ----------------------
  // GET /api/insight
  // ----------------------
  describe("GET /api/insight", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);

      const req = new Request("http://localhost/api/insight");
      const res = await GET(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("Harus return insight map user jika berhasil", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      const mockData = {
        "2025-01-01": {
          mood: 4,
          reflection: "Hari yang baik",
          pattern: "Overthinking",
          affirmation: "Kamu sudah cukup baik hari ini",
          actions: [
            { priority: "Medium", label: "Jalan kaki", desc: "10 menit" },
          ],
        },
      };
      mockGetInsightMapForUser.mockResolvedValue(mockData as never);

      const req = new Request("http://localhost/api/insight");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toEqual(mockData);
      expect(mockGetInsightMapForUser).toHaveBeenCalledWith("user1");
    });

    it("Harus return 403 jika user bukan premium (InsightServiceError)", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetInsightMapForUser.mockRejectedValue(
        new InsightServiceError(
          "Membutuhkan premium account",
          403,
          "PREMIUM_REQUIRED",
        ),
      );

      const req = new Request("http://localhost/api/insight");
      const res = await GET(req);

      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.error).toBe("Membutuhkan premium account");
      expect(json.code).toBe("PREMIUM_REQUIRED");
    });

    it("Harus return 500 jika terjadi error tak terduga", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetInsightMapForUser.mockRejectedValue(new Error("DB error"));

      const req = new Request("http://localhost/api/insight");
      const res = await GET(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe("Terjadi kesalahan saat mengambil insight.");
    });
  });

  // ------------------------------
  // POST /api/insight/generate
  // ------------------------------
  describe("POST /api/insight/generate", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it("Harus return 400 jika field date tidak dikirim", async () => {
      mockGetAuthId.mockResolvedValue("user1");

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Berdasarkan tanggal (date) diperlukan.");
    });

    it("Harus return 400 jika date bukan string", async () => {
      mockGetAuthId.mockResolvedValue("user1");

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: 20250101 }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it("Harus return 200 dan data insight jika berhasil", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      const mockInsight = {
        id: "insight-1",
        userId: "user1",
        date: new Date("2025-01-01"),
        averageScore: 4,
        analysisText: "Hari yang produktif",
        cognitivePattern: "Fokus tinggi",
        affirmation: "Kamu hebat!",
        recommendations: [],
      };
      mockGenerateDailyInsight.mockResolvedValue(mockInsight as never);

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01", timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("insight-1");
      expect(mockGenerateDailyInsight).toHaveBeenCalledWith({
        userId: "user1",
        date: "2025-01-01",
        timezone: "Asia/Jakarta",
      });
    });

    it("Harus return 400 jika insight untuk tanggal ini sudah ada", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGenerateDailyInsight.mockRejectedValue(
        new InsightServiceError(
          "Insight untuk tanggal ini sudah ada.",
          400,
          "INSIGHT_EXISTS",
        ),
      );

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.code).toBe("INSIGHT_EXISTS");
    });

    it("Harus return 403 jika user bukan premium", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGenerateDailyInsight.mockRejectedValue(
        new InsightServiceError(
          "Membutuhkan premium account",
          403,
          "PREMIUM_REQUIRED",
        ),
      );

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.code).toBe("PREMIUM_REQUIRED");
    });

    it("Harus return 400 jika tidak ada diary messages pada tanggal itu", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGenerateDailyInsight.mockRejectedValue(
        new InsightServiceError(
          "Harus ada minimal percakapan di dalam TemanCerita untuk generate insight tanggal ini.",
          400,
          "NO_DIARY_MESSAGES",
        ),
      );

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.code).toBe("NO_DIARY_MESSAGES");
    });

    it("Harus tetap berhasil meski timezone tidak dikirim", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGenerateDailyInsight.mockResolvedValue({ id: "insight-2" } as never);

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(mockGenerateDailyInsight).toHaveBeenCalledWith({
        userId: "user1",
        date: "2025-01-01",
        timezone: undefined,
      });
    });

    it("Harus return 500 jika terjadi error tak terduga", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGenerateDailyInsight.mockRejectedValue(new Error("DB error"));

      const req = new Request("http://localhost/api/insight/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2025-01-01" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe("Terjadi kesalahan saat menghasilkan insight.");
    });
  });
});
