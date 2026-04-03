import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/mood/streak/route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
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

const mockGetSession = vi.mocked(auth.api.getSession);
const mockFindFirst = vi.mocked(prisma.moodLog.findFirst);

describe("Mood Streak API (/api/mood/streak)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Harus return 401 jika user belum login", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new Request("http://localhost/api/mood/streak", {
      method: "PATCH",
    });
    const res = await PATCH(req);

    expect(res.status).toBe(401);
  });

  it("Harus return 400 jika payload timezone tidak dikirim", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user1" },
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);
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
    mockGetSession.mockResolvedValue({
      user: { id: "user1" },
    } as unknown as Awaited<ReturnType<typeof auth.api.getSession>>);

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
