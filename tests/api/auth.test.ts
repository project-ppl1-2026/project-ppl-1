import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as POST_CHECK_EMAIL } from "@/app/api/auth/check-email/route";
import { GET as GET_POST_LOGIN_STATUS } from "@/app/api/auth/post-login-status/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { getPostLoginRedirect } from "@/lib/get-post-login-redirect";
import prisma from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/get-post-login-redirect", () => ({
  getPostLoginRedirect: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockGetPostLoginRedirect = vi.mocked(getPostLoginRedirect);
const mockUserFindFirst = vi.mocked(prisma.user.findFirst);

describe("Auth API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------
  // POST /api/auth/check-email
  // -------------------------
  describe("POST /api/auth/check-email", () => {
    it("Harus return 400 jika email tidak dikirim", async () => {
      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const res = await POST_CHECK_EMAIL(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Email diperlukan.");
    });

    it("Harus return 400 jika email bukan string", async () => {
      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: 12345 }),
      });
      const res = await POST_CHECK_EMAIL(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Email diperlukan.");
    });

    it("Harus return exists: true jika email ditemukan di database", async () => {
      mockUserFindFirst.mockResolvedValue({ id: "user1" } as never);

      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "ada@example.com" }),
      });
      const res = await POST_CHECK_EMAIL(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.exists).toBe(true);
      // Pastikan query pakai email lowercase & trimmed
      expect(mockUserFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: "ada@example.com" },
        }),
      );
    });

    it("Harus return exists: false jika email tidak ditemukan", async () => {
      mockUserFindFirst.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "tidakada@example.com" }),
      });
      const res = await POST_CHECK_EMAIL(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.exists).toBe(false);
    });

    it("Harus lowercase dan trim email sebelum query", async () => {
      mockUserFindFirst.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "  TEST@EXAMPLE.COM  " }),
      });
      await POST_CHECK_EMAIL(req);

      expect(mockUserFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: "test@example.com" },
        }),
      );
    });

    it("Harus return 500 jika terjadi error tak terduga", async () => {
      mockUserFindFirst.mockRejectedValue(new Error("DB error"));

      const req = new Request("http://localhost/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
      const res = await POST_CHECK_EMAIL(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe("Terjadi kesalahan.");
    });
  });

  // --------------------------------
  // GET /api/auth/post-login-status
  // --------------------------------
  describe("GET /api/auth/post-login-status", () => {
    it("Harus return isAuthenticated: false dan nextRoute: /login jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth/post-login-status");
      const res = await GET_POST_LOGIN_STATUS(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.isAuthenticated).toBe(false);
      expect(json.nextRoute).toBe("/login");
    });

    it("Harus return isAuthenticated: true dan nextRoute dari getPostLoginRedirect", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetPostLoginRedirect.mockResolvedValue("/home");

      const req = new Request("http://localhost/api/auth/post-login-status");
      const res = await GET_POST_LOGIN_STATUS(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.isAuthenticated).toBe(true);
      expect(json.nextRoute).toBe("/home");
      expect(mockGetPostLoginRedirect).toHaveBeenCalledWith("user1");
    });

    it("Harus redirect ke /baseline jika user belum isi baseline", async () => {
      mockGetAuthId.mockResolvedValue("user2");
      mockGetPostLoginRedirect.mockResolvedValue("/baseline");

      const req = new Request("http://localhost/api/auth/post-login-status");
      const res = await GET_POST_LOGIN_STATUS(req);

      const json = await res.json();
      expect(json.isAuthenticated).toBe(true);
      expect(json.nextRoute).toBe("/baseline");
    });

    it("Harus redirect ke /mood jika user belum isi mood hari ini", async () => {
      mockGetAuthId.mockResolvedValue("user3");
      mockGetPostLoginRedirect.mockResolvedValue("/mood");

      const req = new Request("http://localhost/api/auth/post-login-status");
      const res = await GET_POST_LOGIN_STATUS(req);

      const json = await res.json();
      expect(json.isAuthenticated).toBe(true);
      expect(json.nextRoute).toBe("/mood");
    });

    it("Harus redirect ke /admin jika user adalah admin", async () => {
      mockGetAuthId.mockResolvedValue("admin1");
      mockGetPostLoginRedirect.mockResolvedValue("/admin");

      const req = new Request("http://localhost/api/auth/post-login-status");
      const res = await GET_POST_LOGIN_STATUS(req);

      const json = await res.json();
      expect(json.isAuthenticated).toBe(true);
      expect(json.nextRoute).toBe("/admin");
    });
  });
});
