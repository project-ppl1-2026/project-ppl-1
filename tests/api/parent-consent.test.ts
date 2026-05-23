import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
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

import { GET, POST } from "@/app/api/parent-consent/route";
import { setUserParentEmail } from "@/lib/auth";
import prisma from "@/lib/prisma";

const mockFindParent = vi.mocked(prisma.parent.findFirst);
const mockUpdateParent = vi.mocked(prisma.parent.update);
const mockSetUserParentEmail = vi.mocked(setUserParentEmail);

const validParent = {
  id: "parent-1",
  userId: "user-1",
  email: "parent@example.com",
  status: "pending",
  expiresAt: new Date("2099-01-01T00:00:00.000Z"),
};
const validToken = "valid-token-1234567890";

describe("Parent Consent API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/parent-consent", () => {
    it("return HTML 400 jika token valid tapi decision belum dipilih", async () => {
      const response = await GET(
        new Request(`http://localhost/api/parent-consent?token=${validToken}`),
      );

      expect(response.status).toBe(400);
      expect(response.headers.get("Content-Type")).toContain("text/html");
      await expect(response.text()).resolves.toContain(
        "Keputusan belum dipilih",
      );
    });

    it("return JSON 400 jika token dan decision invalid", async () => {
      const response = await GET(
        new Request("http://localhost/api/parent-consent?token=&decision=nope"),
      );

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.title).toBe("Link tidak valid");
    });

    it("return 404 jika token tidak ditemukan", async () => {
      mockFindParent.mockResolvedValue(null);

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=accept`,
        ),
      );

      expect(response.status).toBe(404);
    });

    it("return 400 jika parent sudah diproses", async () => {
      mockFindParent.mockResolvedValue({
        ...validParent,
        status: "verified",
      } as never);

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=accept`,
        ),
      );

      expect(response.status).toBe(400);
    });

    it("menandai expired jika link kedaluwarsa", async () => {
      mockFindParent.mockResolvedValue({
        ...validParent,
        expiresAt: new Date("2000-01-01T00:00:00.000Z"),
      } as never);

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=accept`,
        ),
      );

      expect(response.status).toBe(404);
      expect(mockUpdateParent).toHaveBeenCalledWith({
        where: { id: "parent-1" },
        data: { status: "expired", token: null },
      });
    });

    it("accept menghubungkan email orang tua dan verify parent", async () => {
      mockFindParent.mockResolvedValue(validParent as never);

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=accept`,
        ),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.decision).toBe("accept");
      expect(mockSetUserParentEmail).toHaveBeenCalledWith(
        "user-1",
        "parent@example.com",
      );
      expect(mockUpdateParent).toHaveBeenCalledWith({
        where: { id: "parent-1" },
        data: expect.objectContaining({
          status: "verified",
          token: null,
        }),
      });
    });

    it("reject melepas email orang tua", async () => {
      mockFindParent.mockResolvedValue(validParent as never);

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=reject`,
        ),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.decision).toBe("reject");
      expect(mockSetUserParentEmail).toHaveBeenCalledWith("user-1", null);
      expect(mockUpdateParent).toHaveBeenCalledWith({
        where: { id: "parent-1" },
        data: expect.objectContaining({
          status: "expired",
          token: null,
        }),
      });
    });

    it("return 500 jika terjadi error tak terduga", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockFindParent.mockRejectedValue(new Error("DB down"));

      const response = await GET(
        new Request(
          `http://localhost/api/parent-consent?token=${validToken}&decision=accept`,
        ),
      );

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });

  describe("POST /api/parent-consent", () => {
    it("return 400 jika payload invalid", async () => {
      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: "", decision: "accept" }),
        }),
      );

      expect(response.status).toBe(400);
    });

    it("return 404 jika parent tidak pending", async () => {
      mockFindParent.mockResolvedValue({
        ...validParent,
        status: "verified",
      } as never);

      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: validToken, decision: "accept" }),
        }),
      );

      expect(response.status).toBe(404);
    });

    it("return 404 dan menandai expired jika POST link kedaluwarsa", async () => {
      mockFindParent.mockResolvedValue({
        ...validParent,
        expiresAt: new Date("2000-01-01T00:00:00.000Z"),
      } as never);

      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: validToken, decision: "accept" }),
        }),
      );

      expect(response.status).toBe(404);
      expect(mockUpdateParent).toHaveBeenCalledWith({
        where: { id: "parent-1" },
        data: { status: "expired", token: null },
      });
    });

    it("accept via JSON return success", async () => {
      mockFindParent.mockResolvedValue(validParent as never);

      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: validToken, decision: "accept" }),
        }),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true, decision: "accept" });
    });

    it("reject via form return HTML", async () => {
      mockFindParent.mockResolvedValue(validParent as never);
      const body = new FormData();
      body.set("token", validToken);
      body.set("decision", "reject");

      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          body,
        }),
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("text/html");
      await expect(response.text()).resolves.toContain("Permintaan Ditolak");
    });

    it("return 500 jika POST gagal", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockFindParent.mockRejectedValue(new Error("DB down"));

      const response = await POST(
        new Request("http://localhost/api/parent-consent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: validToken, decision: "accept" }),
        }),
      );

      expect(response.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });
});
