import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLatestPendingPayment,
  activateSubscription,
  syncUserPremiumStatus,
  getSubscriptionStatus,
} from "@/lib/subscription/service";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    payment: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

const mockPaymentFindFirst = vi.mocked(prisma.payment.findFirst);
const mockTransaction = vi.mocked(prisma.$transaction);

describe("lib/subscription/service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────
  // getLatestPendingPayment
  // ─────────────────────────────────────
  describe("getLatestPendingPayment", () => {
    it("Harus return payment jika ada pending payment", async () => {
      const mockPayment = {
        id: "pay-1",
        orderId: "TT-001",
        grossAmount: 59000,
        status: "pending",
        snapToken: "snap-abc",
        durationMonths: 1,
        createdAt: new Date(),
      };
      mockPaymentFindFirst.mockResolvedValue(mockPayment as never);

      const result = await getLatestPendingPayment("user1");

      expect(result).toEqual(mockPayment);
      expect(mockPaymentFindFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user1",
            status: { in: ["pending", "challenge"] },
            snapToken: { not: null },
          }),
        }),
      );
    });

    it("Harus return null jika tidak ada pending payment", async () => {
      mockPaymentFindFirst.mockResolvedValue(null);

      const result = await getLatestPendingPayment("user1");

      expect(result).toBeNull();
    });
  });

  // ─────────────────────────────────────
  // activateSubscription
  // ─────────────────────────────────────
  describe("activateSubscription", () => {
    it("Harus buat subscription baru mulai dari sekarang jika tidak ada active sub", async () => {
      const mockSub = { id: "sub-1", isActive: true };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findFirst: vi.fn().mockResolvedValue(null), // tidak ada active sub
            create: vi.fn().mockResolvedValue(mockSub),
          },
          user: {
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      });

      const result = await activateSubscription({
        userId: "user1",
        paymentId: "pay-1",
        durationMonths: 1,
      });

      expect(result).toEqual(mockSub);
    });

    it("Harus append subscription setelah active sub yang ada (renewal)", async () => {
      const futureExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 hari ke depan
      const mockSub = { id: "sub-2", isActive: true };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findFirst: vi.fn().mockResolvedValue({ expiresAt: futureExpiry }), // ada active sub
            create: vi.fn().mockResolvedValue(mockSub),
          },
          user: {
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      });

      const result = await activateSubscription({
        userId: "user1",
        paymentId: "pay-2",
        durationMonths: 3,
      });

      expect(result).toEqual(mockSub);
    });

    it("Harus set isPremium = true di user setelah aktivasi", async () => {
      const mockUserUpdate = vi.fn().mockResolvedValue({});

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockResolvedValue({ id: "sub-1" }),
          },
          user: { update: mockUserUpdate },
        };
        return fn(tx);
      });

      await activateSubscription({
        userId: "user1",
        paymentId: "pay-1",
        durationMonths: 1,
      });

      expect(mockUserUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "user1" },
          data: { isPremium: true },
        }),
      );
    });
  });

  // ─────────────────────────────────────
  // syncUserPremiumStatus
  // ─────────────────────────────────────
  describe("syncUserPremiumStatus", () => {
    it("Harus return isPremium: true jika ada active subscription", async () => {
      const now = new Date();
      const activeSub = {
        id: "sub-1",
        startedAt: new Date(now.getTime() - 1000),
        expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([activeSub]),
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      const result = await syncUserPremiumStatus("user1");

      expect(result.isPremium).toBe(true);
      expect(result.subscription).toEqual(activeSub);
      expect(result.activeSubscriptionCount).toBe(1);
    });

    it("Harus return isPremium: false jika tidak ada active subscription", async () => {
      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([]), // tidak ada
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      const result = await syncUserPremiumStatus("user1");

      expect(result.isPremium).toBe(false);
      expect(result.subscription).toBeNull();
      expect(result.premiumUntil).toBeNull();
      expect(result.activeSubscriptionCount).toBe(0);
    });

    it("Harus update user.isPremium = false jika tidak ada active sub", async () => {
      const mockUserUpdate = vi.fn().mockResolvedValue({});

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([]),
          },
          user: { update: mockUserUpdate },
        };
        return fn(tx);
      });

      await syncUserPremiumStatus("user1");

      expect(mockUserUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { isPremium: false },
        }),
      );
    });

    it("Harus deactivate expired subscriptions (updateMany dengan lte: now)", async () => {
      const mockSubUpdateMany = vi.fn().mockResolvedValue({ count: 1 });

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: mockSubUpdateMany,
            findMany: vi.fn().mockResolvedValue([]),
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });

      await syncUserPremiumStatus("user1");

      expect(mockSubUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user1",
            isActive: true,
          }),
          data: { isActive: false },
        }),
      );
    });
  });

  // ─────────────────────────────────────
  // getSubscriptionStatus
  // ─────────────────────────────────────
  describe("getSubscriptionStatus", () => {
    it("Harus return status lengkap dengan canRenew: true jika tidak ada pending payment", async () => {
      const now = new Date();
      const activeSub = {
        id: "sub-1",
        startedAt: new Date(now.getTime() - 1000),
        expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([activeSub]),
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });
      mockPaymentFindFirst.mockResolvedValue(null); // tidak ada pending

      const result = await getSubscriptionStatus("user1");

      expect(result.isPremium).toBe(true);
      expect(result.canRenew).toBe(true);
      expect(result.pendingPayment).toBeNull();
      expect(result.subscription).not.toBeNull();
    });

    it("Harus return canRenew: false jika ada pending payment", async () => {
      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([]),
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });
      mockPaymentFindFirst.mockResolvedValue({
        id: "pay-1",
        status: "pending",
      } as never);

      const result = await getSubscriptionStatus("user1");

      expect(result.isPremium).toBe(false);
      expect(result.canRenew).toBe(false);
      expect(result.pendingPayment).not.toBeNull();
    });

    it("Harus return subscription: null jika tidak premium", async () => {
      mockTransaction.mockImplementation(async (fn) => {
        const tx = {
          subscription: {
            updateMany: vi.fn().mockResolvedValue({ count: 0 }),
            findMany: vi.fn().mockResolvedValue([]),
          },
          user: { update: vi.fn().mockResolvedValue({}) },
        };
        return fn(tx);
      });
      mockPaymentFindFirst.mockResolvedValue(null);

      const result = await getSubscriptionStatus("user1");

      expect(result.subscription).toBeNull();
    });
  });
});
