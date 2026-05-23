import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "@/app/api/subscription/status/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import { getSubscriptionStatus } from "@/lib/subscription/service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/subscription/service", () => ({
  getSubscriptionStatus: vi.fn(),
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockGetSubscriptionStatus = vi.mocked(getSubscriptionStatus);

describe("Subscription API Routes (/api/subscription/status)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/subscription/status", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);
      const req = new Request("http://localhost/api/subscription/status");
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it("Harus mengembalikan status subscription user free", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetSubscriptionStatus.mockResolvedValue({
        isPremium: false,
        subscription: null,
        activeSubscriptionCount: 0,
        premiumUntil: null,
        pendingPayment: null,
        canRenew: true,
      } as never);

      const req = new Request("http://localhost/api/subscription/status");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.isPremium).toBe(false);
      expect(json.subscription).toBeNull();
    });

    it("Harus mengembalikan status subscription user premium", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      mockGetSubscriptionStatus.mockResolvedValue({
        isPremium: true,
        subscription: {
          id: "sub1",
          startedAt: new Date(),
          expiresAt,
          isActive: true,
        },
        activeSubscriptionCount: 1,
        premiumUntil: expiresAt,
        pendingPayment: null,
        canRenew: true,
      } as never);

      const req = new Request("http://localhost/api/subscription/status");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.isPremium).toBe(true);
      expect(json.subscription).not.toBeNull();
    });

    it("Harus serialize pendingPayment grossAmount ke string", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetSubscriptionStatus.mockResolvedValue({
        isPremium: false,
        subscription: null,
        activeSubscriptionCount: 0,
        premiumUntil: null,
        canRenew: false,
        pendingPayment: {
          id: "pay1",
          orderId: "TT-user1-001",
          grossAmount: { toString: () => "50000" },
          status: "pending",
          snapToken: "snap-token",
          durationMonths: 1,
          createdAt: new Date("2026-05-23T00:00:00.000Z"),
        },
      } as never);

      const req = new Request("http://localhost/api/subscription/status");
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.pendingPayment.grossAmount).toBe("50000");
      expect(json.pendingPayment.orderId).toBe("TT-user1-001");
    });

    it("Harus return 500 jika subscription status gagal", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockGetAuthId.mockResolvedValue("user1");
      mockGetSubscriptionStatus.mockRejectedValue(new Error("DB down"));

      const req = new Request("http://localhost/api/subscription/status");
      const res = await GET(req);

      expect(res.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });
});
