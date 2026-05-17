import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as GET_STATUS } from "@/app/api/parent/status/route";
import {
  GET as GET_CONSENT,
  POST as POST_CONSENT,
} from "@/app/api/parent-consent/route";
import {
  getAuthenticatedUserIdFromRequest,
  setUserParentEmail,
} from "@/lib/auth";
import prisma from "@/lib/prisma";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
  setUserParentEmail: vi.fn(),
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
const mockSetUserParentEmail = vi.mocked(setUserParentEmail);
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
  });

  describe("GET /api/parent-consent", () => {
    it("Harus return 400 jika token tidak ada", async () => {
      const req = new Request("http://localhost/api/parent-consent");
      const res = await GET_CONSENT(req);
      expect(res.status).toBe(400);
    });

    it("Harus sukses verifikasi dengan decision accept", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      mockFindFirst.mockResolvedValue({
        id: "p1",
        userId: "user1",
        email: "parent@test.com",
        status: "pending",
        expiresAt: futureDate,
      } as never);

      mockSetUserParentEmail.mockResolvedValue({} as never);
      mockUpdate.mockResolvedValue({} as never);

      const req = new Request(
        "http://localhost/api/parent-consent?token=valid-token-with-at-least-20-chars&decision=accept",
      );
      const res = await GET_CONSENT(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.decision).toBe("accept");
    });
  });

  describe("POST /api/parent-consent", () => {
    it("Harus sukses submit dari POST payload", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      mockFindFirst.mockResolvedValue({
        id: "p1",
        userId: "user1",
        email: "parent@test.com",
        status: "pending",
        expiresAt: futureDate,
      } as never);

      mockSetUserParentEmail.mockResolvedValue({} as never);
      mockUpdate.mockResolvedValue({} as never);

      const req = new Request("http://localhost/api/parent-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "valid-token-with-at-least-20-chars",
          decision: "accept",
        }),
      });
      const res = await POST_CONSENT(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.decision).toBe("accept");
    });
  });
});
