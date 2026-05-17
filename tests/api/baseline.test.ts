import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST, PATCH } from "@/app/api/baseline/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  analyzeAndSaveBaseline,
  getBaselineByUserId,
} from "@/lib/baseline/service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/baseline/service", () => ({
  analyzeAndSaveBaseline: vi.fn(),
  getBaselineByUserId: vi.fn(),
}));

const mockGetAuthenticatedUserIdFromRequest = vi.mocked(
  getAuthenticatedUserIdFromRequest,
);
const mockGetBaselineByUserId = vi.mocked(getBaselineByUserId);
const mockAnalyzeAndSaveBaseline = vi.mocked(analyzeAndSaveBaseline);

describe("Baseline API Routes (/api/baseline)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/baseline", () => {
    it("Harus return 401 jika user belum login", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);
      const req = new Request("http://localhost/api/baseline", {
        method: "GET",
      });
      const res = await GET(req);

      expect(res.status).toBe(401);
    });

    it("Harus mengembalikan data baseline user jika berhasil", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");
      const mockBaseline = { id: "b1", score: 80 };
      mockGetBaselineByUserId.mockResolvedValue(mockBaseline as never);

      const req = new Request("http://localhost/api/baseline", {
        method: "GET",
      });
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.baseline).toEqual(mockBaseline);
    });
  });

  describe("POST /api/baseline", () => {
    it("Harus return 401 jika user belum login", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);
      const req = new Request("http://localhost/api/baseline", {
        method: "POST",
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
    });

    it("Harus return 400 jika payload tidak valid", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");

      const req = new Request("http://localhost/api/baseline", {
        method: "POST",
        body: JSON.stringify({ answers: "not-an-array" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
    });

    it("Harus return 200 jika payload valid dan berhasil disimpan", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");

      const mockResult = {
        baseline: { id: "b1" },
        inference: {
          labelIndex: 1,
          label: "Normal",
          isBeginner: true,
          confidenceScore: 0.9,
          inputName: "i1",
        },
      };

      mockAnalyzeAndSaveBaseline.mockResolvedValue(mockResult as never);

      const req = new Request("http://localhost/api/baseline", {
        method: "POST",
        body: JSON.stringify({
          answers: [
            "Agree",
            "Agree",
            "Agree",
            "Agree",
            "Yes",
            "Yes",
            "Yes",
            "Yes",
          ],
        }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.baseline).toEqual(mockResult.baseline);
      expect(json.prediction.label).toBe("Normal");
    });
  });

  describe("PATCH /api/baseline", () => {
    it("Harus return 200 dan mengupdate jika payload valid", async () => {
      mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");

      const mockResult = {
        baseline: { id: "b1" },
        inference: {
          labelIndex: 2,
          label: "Moderate",
          isBeginner: false,
          confidenceScore: 0.85,
          inputName: "i1",
        },
      };

      mockAnalyzeAndSaveBaseline.mockResolvedValue(mockResult as never);

      const req = new Request("http://localhost/api/baseline", {
        method: "PATCH",
        body: JSON.stringify({
          answers: [
            "Disagree",
            "Disagree",
            "Disagree",
            "Disagree",
            "No",
            "No",
            "No",
            "No",
          ],
        }),
      });
      const res = await PATCH(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.prediction.label).toBe("Moderate");
    });
  });
});
