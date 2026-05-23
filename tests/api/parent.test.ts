import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as GET_STATUS } from "@/app/api/parent/status/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    parent: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockFindFirst = vi.mocked(prisma.parent.findFirst);
const mockUpdate = vi.mocked(prisma.parent.update);

describe("Parent API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/parent/status", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);
      const req = new Request("http://localhost/api/parent/status");
      const res = await GET_STATUS(req);
      expect(res.status).toBe(401);
    });

    it("Harus return status parent yang benar", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      mockFindFirst.mockResolvedValue({
        email: "test@example.com",
        status: "pending",
        expiresAt: futureDate,
        rejectedAt: null,
      } as never);

      const req = new Request("http://localhost/api/parent/status");
      const res = await GET_STATUS(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.email).toBe("test@example.com");
      expect(json.status).toBe("pending");
    });

    it("Harus return status kosong jika parent belum ada", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockFindFirst.mockResolvedValue(null);

      const req = new Request("http://localhost/api/parent/status");
      const res = await GET_STATUS(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.email).toBeNull();
      expect(json.status).toBeNull();
      expect(json.reason).toBeNull();
    });

    it("Harus menandai pending yang sudah expired", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockFindFirst.mockResolvedValue({
        email: "test@example.com",
        status: "pending",
        expiresAt: pastDate,
        rejectedAt: null,
        lastSentAt: null,
        lastReportType: null,
        lastReportStatus: null,
      } as never);

      const req = new Request("http://localhost/api/parent/status");
      const res = await GET_STATUS(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.status).toBe("expired");
      expect(json.reason).toBe("expired");
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { userId: "user1" },
        data: { status: "expired", token: null },
      });
    });

    it("Harus membedakan reason rejected dan expired", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockFindFirst.mockResolvedValueOnce({
        email: "test@example.com",
        status: "expired",
        expiresAt: null,
        rejectedAt: new Date(),
        lastSentAt: null,
        lastReportType: null,
        lastReportStatus: null,
      } as never);

      let req = new Request("http://localhost/api/parent/status");
      let res = await GET_STATUS(req);
      let json = await res.json();
      expect(json.reason).toBe("rejected");

      mockFindFirst.mockResolvedValueOnce({
        email: "test@example.com",
        status: "expired",
        expiresAt: null,
        rejectedAt: null,
        lastSentAt: null,
        lastReportType: null,
        lastReportStatus: null,
      } as never);

      req = new Request("http://localhost/api/parent/status");
      res = await GET_STATUS(req);
      json = await res.json();
      expect(json.reason).toBe("expired");
    });

    it("Harus return 500 jika parent status gagal", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthId.mockResolvedValue("user1");
      mockFindFirst.mockRejectedValue(new Error("DB down"));

      const req = new Request("http://localhost/api/parent/status");
      const res = await GET_STATUS(req);

      expect(res.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });
});
