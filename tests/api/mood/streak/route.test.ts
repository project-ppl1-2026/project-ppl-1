import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/mood/streak/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    moodLog: {
      findFirst: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}));

const mockGetAuthenticatedUserIdFromRequest = vi.mocked(
  getAuthenticatedUserIdFromRequest,
);
const mockFindFirst = vi.mocked(prisma.moodLog.findFirst);

describe("Mood Streak API (/api/mood/streak)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Harus return 401 jika user belum login", async () => {
    mockGetAuthenticatedUserIdFromRequest.mockResolvedValue(null);
    const req = new Request("http://localhost/api/mood/streak", {
      method: "PATCH",
    });
    const res = await PATCH(req);

    expect(res.status).toBe(401);
  });

  it("Harus return 400 jika payload timezone tidak dikirim", async () => {
    mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");
    const req = new Request("http://localhost/api/mood/streak", {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/timezone/i);
  });

  it("Harus sukses dan memanggil reset function jika valid", async () => {
    mockGetAuthenticatedUserIdFromRequest.mockResolvedValue("user1");

    // Mock findFirst agar tidak error di service, disimulasikan telat misal
    const d = new Date();
    d.setDate(d.getDate() - 2);
    mockFindFirst.mockResolvedValue({ createdAt: d } as unknown as Awaited<
      ReturnType<typeof prisma.moodLog.findFirst>
    >);

    const req = new Request("http://localhost/api/mood/streak", {
      method: "PATCH",
      body: JSON.stringify({ timezone: "Asia/Jakarta" }),
    });
    const res = await PATCH(req);

    expect(res.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalled();
  });
});
