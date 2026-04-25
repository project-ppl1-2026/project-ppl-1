import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as GET_DIARY } from "@/app/api/diary/route";
import { GET as GET_COUNT } from "@/app/api/diary/count/route";
import { GET as GET_MESSAGES } from "@/app/api/diary/[entryId]/messages/route";
import { POST as POST_CHAT } from "@/app/api/diary/chat/route";
import { getAuthenticatedUserIdFromRequest } from "@/lib/auth";
import {
  listDiaryEntriesByMonth,
  getTotalDiaryCount,
  listDiaryMessagesByEntryId,
  sendDiaryChatMessage,
} from "@/lib/diary/service";

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserIdFromRequest: vi.fn(),
}));

vi.mock("@/lib/diary/service", () => ({
  listDiaryEntriesByMonth: vi.fn(),
  getTotalDiaryCount: vi.fn(),
  listDiaryMessagesByEntryId: vi.fn(),
  sendDiaryChatMessage: vi.fn(),
}));

const mockGetAuthId = vi.mocked(getAuthenticatedUserIdFromRequest);
const mockListDiary = vi.mocked(listDiaryEntriesByMonth);
const mockGetCount = vi.mocked(getTotalDiaryCount);
const mockListMessages = vi.mocked(listDiaryMessagesByEntryId);
const mockSendChat = vi.mocked(sendDiaryChatMessage);

describe("Diary API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/diary", () => {
    it("Harus return 401 jika belum login", async () => {
      mockGetAuthId.mockResolvedValue(null);
      const req = new Request("http://localhost/api/diary?month=2024-01");
      const res = await GET_DIARY(req);
      expect(res.status).toBe(401);
    });

    it("Harus return list diary sukses", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockListDiary.mockResolvedValue({
        entries: [{ id: "d1" } as never],
        diarySessionsUsedThisMonth: 1,
      });

      const req = new Request("http://localhost/api/diary?month=2024-01");
      const res = await GET_DIARY(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.entries.length).toBe(1);
    });
  });

  describe("GET /api/diary/count", () => {
    it("Harus return total count", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockGetCount.mockResolvedValue(5);

      const req = new Request("http://localhost/api/diary/count");
      const res = await GET_COUNT(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.count).toBe(5);
    });
  });

  describe("GET /api/diary/[entryId]/messages", () => {
    it("Harus return list messages", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockListMessages.mockResolvedValue([
        { id: "m1", text: "hello" } as never,
      ]);

      const req = new Request("http://localhost/api/diary/entry1/messages");
      const context = { params: Promise.resolve({ entryId: "entry1" }) };
      const res = await GET_MESSAGES(req, context);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.messages.length).toBe(1);
    });
  });

  describe("POST /api/diary/chat", () => {
    it("Harus return reply dari chat", async () => {
      mockGetAuthId.mockResolvedValue("user1");
      mockSendChat.mockResolvedValue({ reply: "Hai!" } as never);

      const req = new Request("http://localhost/api/diary/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryId: "e1",
          messageText: "Hello",
          timezone: "Asia/Jakarta",
        }),
      });
      const res = await POST_CHAT(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.reply).toBe("Hai!");
    });
  });
});
