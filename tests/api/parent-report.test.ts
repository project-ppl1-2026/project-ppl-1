import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/parent-report/send/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  sendWeeklyParentReportForUser,
  ParentReportError,
} from "@/lib/parent-report/service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/parent-report/service", () => ({
  sendWeeklyParentReportForUser: vi.fn(),
  ParentReportError: class ParentReportError extends Error {
    status: number;
    code: string;
    constructor(message: string, status = 400, code = "PARENT_REPORT_ERROR") {
      super(message);
      this.name = "ParentReportError";
      this.status = status;
      this.code = code;
    }
  },
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockSendWeeklyParentReport = vi.mocked(sendWeeklyParentReportForUser);

describe("Parent Report API Routes (/api/parent-report/send)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/parent-report/send", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });

    it("Harus return 200 dan pesan sukses jika laporan berhasil dikirim", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockResolvedValue({
        success: true,
        skipped: false,
        reportType: "premium_pdf",
        parentEmail: "ortu@example.com",
        period: { startKey: "2025-01-06", endKey: "2025-01-12" },
        filledDays: 5,
        generatedAt: new Date(),
      } as never);

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toBe("Laporan mingguan berhasil dikirim.");
      expect(mockSendWeeklyParentReport).toHaveBeenCalledWith({
        userId: "user1",
        timezone: "Asia/Jakarta",
        force: true,
      });
    });

    it("Harus return pesan 'laporan sudah dikirim' jika skipped reason already_sent", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockResolvedValue({
        success: true,
        skipped: true,
        reason: "already_sent",
        reportType: null,
        parentEmail: "ortu@example.com",
        period: {},
        filledDays: 0,
      } as never);

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toBe("Laporan periode ini sudah pernah dikirim.");
    });

    it("Harus return pesan 'belum ada data mood' jika skipped reason no_data", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockResolvedValue({
        success: true,
        skipped: true,
        reason: "no_data",
        reportType: null,
        parentEmail: "ortu@example.com",
        period: {},
        filledDays: 0,
      } as never);

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toBe(
        "Belum ada data mood untuk periode ini, jadi laporan tidak dikirim.",
      );
    });

    it("Harus tetap berjalan meski body tidak dikirim (timezone jadi undefined)", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockResolvedValue({
        success: true,
        skipped: false,
        reportType: "free_summary",
        parentEmail: "ortu@example.com",
        period: {},
        filledDays: 3,
      } as never);

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
      });
      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(mockSendWeeklyParentReport).toHaveBeenCalledWith(
        expect.objectContaining({ timezone: undefined }),
      );
    });

    it("Harus return 404 jika user tidak ditemukan (ParentReportError)", async () => {
      mockGetAuthId.mockResolvedValue("user-nonexistent");
      mockSendWeeklyParentReport.mockRejectedValue(
        new ParentReportError("User tidak ditemukan.", 404, "USER_NOT_FOUND"),
      );

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error).toBe("User tidak ditemukan.");
      expect(json.code).toBe("USER_NOT_FOUND");
    });

    it("Harus return 400 jika email orang tua belum terverifikasi", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockRejectedValue(
        new ParentReportError(
          "Email orang tua belum terverifikasi.",
          400,
          "PARENT_NOT_VERIFIED",
        ),
      );

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.code).toBe("PARENT_NOT_VERIFIED");
    });

    it("Harus return 500 jika terjadi error tak terduga", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendWeeklyParentReport.mockRejectedValue(
        new Error("Unexpected error"),
      );

      const req = new Request("http://localhost/api/parent-report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone: "Asia/Jakarta" }),
      });
      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe(
        "Terjadi kesalahan saat mengirim laporan mingguan.",
      );
    });
  });
});
