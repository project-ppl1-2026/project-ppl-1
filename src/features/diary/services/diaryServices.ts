// ============================================================
//  src/features/diary/services/diaryServices.ts
// ============================================================

import type { DiaryEntry, ChatMessage, BraveChoiceQuiz } from "../types";
type ApiErrorResponse = {
  error?: string;
};

type DiaryEntriesApiResponse = {
  success?: boolean;
  error?: string;
  data?: {
    entries?: DiaryEntry[];
    diarySessionsUsedThisMonth?: number;
  };
};

type DiaryMessagesApiResponse = {
  success?: boolean;
  error?: string;
  data?: {
    messages?: ChatMessage[];
  };
};

export type SendDiaryChatStreamResult = {
  aiMessage: ChatMessage;
  entry: DiaryEntry;
  diarySessionsUsedThisMonth: number;
};

type SendDiaryChatStreamOptions = {
  onChunk?: (textChunk: string) => void;
};

const MOCK_QUIZ_POOL: BraveChoiceQuiz[] = [
  {
    id: "quiz-1",
    scenario:
      "Temanmu disudutkan di grup chat — meme memalukan disebarkan. Kamu yang pertama melihatnya. Semua diam.",
    options: [
      {
        label: "A",
        text: "Diam saja agar tidak jadi target berikutnya.",
        isBrave: false,
      },
      {
        label: "B",
        text: "Kirim pesan pribadi: 'Aku lihat itu. Aku di sini untukmu.'",
        isBrave: true,
      },
    ],
    explanationWrong:
      "Diam saat seseorang disakiti bukan netral — itu persetujuan pasif.",
    explanationRight:
      "Mendukung teman secara privat adalah tindakan keberanian yang nyata.",
  },
];

export async function getDiaryEntries(month: string): Promise<{
  entries: DiaryEntry[];
  diarySessionsUsedThisMonth: number;
}> {
  const timezone = getTimezone();
  const query = new URLSearchParams({
    month,
    timezone,
  }).toString();

  const response = await fetch(`/api/diary?${query}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await extractResponseError(
        response,
        "Gagal memuat riwayat diary. Silakan coba lagi.",
      ),
    );
  }

  const payload = (await response.json()) as DiaryEntriesApiResponse;

  if (!payload.success || !payload.data) {
    throw new Error(payload.error || "Riwayat diary tidak valid.");
  }

  return {
    entries: Array.isArray(payload.data.entries) ? payload.data.entries : [],
    diarySessionsUsedThisMonth:
      typeof payload.data.diarySessionsUsedThisMonth === "number"
        ? payload.data.diarySessionsUsedThisMonth
        : 0,
  };
}

export async function getDiaryMessages(
  entryId: string,
): Promise<ChatMessage[]> {
  const timezone = getTimezone();
  const query = new URLSearchParams({
    timezone,
  }).toString();

  const response = await fetch(
    `/api/diary/${encodeURIComponent(entryId)}/messages?${query}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await extractResponseError(
        response,
        "Gagal memuat percakapan diary. Silakan coba lagi.",
      ),
    );
  }

  const payload = (await response.json()) as DiaryMessagesApiResponse;

  if (!payload.success || !payload.data) {
    throw new Error(payload.error || "Percakapan diary tidak valid.");
  }

  return Array.isArray(payload.data.messages) ? payload.data.messages : [];
}

export async function sendChatMessageStream(
  entryId: string,
  userMessage: string,
  options: SendDiaryChatStreamOptions = {},
): Promise<SendDiaryChatStreamResult> {
  const timezone = getTimezone();
  const response = await fetch("/api/diary/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entryId,
      messageText: userMessage,
      timezone,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await extractResponseError(
        response,
        "Gagal mengirim pesan diary. Silakan coba lagi.",
      ),
    );
  }

  if (!response.body) {
    throw new Error("Stream diary tidak tersedia.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let doneResult: SendDiaryChatStreamResult | null = null;

  const handleSseBlock = (rawBlock: string) => {
    const parsed = parseSseBlock(rawBlock);

    if (!parsed) {
      return;
    }

    if (parsed.event === "chunk") {
      const data = asRecord(parsed.data);
      const textChunk = typeof data?.text === "string" ? data.text : "";

      if (textChunk) {
        options.onChunk?.(textChunk);
      }

      return;
    }

    if (parsed.event === "error") {
      const data = asRecord(parsed.data);
      const message =
        typeof data?.error === "string"
          ? data.error
          : "Terjadi kesalahan saat memproses chat diary.";

      throw new Error(message);
    }

    if (parsed.event === "done") {
      const data = parsed.data;

      if (isSendDiaryChatStreamResult(data)) {
        doneResult = data;
        return;
      }

      throw new Error("Balasan diary stream tidak valid.");
    }
  };

  const processBuffer = () => {
    let separatorIndex = buffer.indexOf("\n\n");

    while (separatorIndex !== -1) {
      const rawBlock = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      if (rawBlock) {
        handleSseBlock(rawBlock);
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunkText = decoder.decode(value, { stream: true });
      buffer += chunkText.replace(/\r\n/g, "\n");
      processBuffer();
    }

    buffer += decoder.decode().replace(/\r\n/g, "\n");
    processBuffer();

    const leftover = buffer.trim();

    if (leftover) {
      handleSseBlock(leftover);
    }
  } finally {
    reader.releaseLock();
  }

  if (!doneResult) {
    throw new Error("Balasan AI belum lengkap. Coba kirim ulang pesanmu.");
  }

  return doneResult;
}

export async function getBraveChoiceQuiz(): Promise<BraveChoiceQuiz> {
  await delay(700);
  return MOCK_QUIZ_POOL[Math.floor(Math.random() * MOCK_QUIZ_POOL.length)];
}

export async function submitQuizAnswer(
  quizId: string,
  selectedLabel: string,
  isBrave: boolean,
): Promise<void> {
  void quizId;
  void selectedLabel;
  void isBrave;

  await delay(200);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTimezone() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!timezone) {
      return "Asia/Jakarta";
    }

    return timezone;
  } catch {
    return "Asia/Jakarta";
  }
}

async function extractResponseError(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const payload = (await response.json()) as ApiErrorResponse;

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // Ignore parsing error and fallback to generic message.
  }

  return fallbackMessage;
}

function parseSseBlock(
  rawBlock: string,
): { event: string; data: unknown } | null {
  const lines = rawBlock.split("\n");
  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line || line.startsWith(":")) {
      continue;
    }

    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim() || "message";
      continue;
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (!dataLines.length) {
    return null;
  }

  const rawData = dataLines.join("\n");

  try {
    return {
      event,
      data: JSON.parse(rawData),
    };
  } catch {
    return {
      event,
      data: rawData,
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function isDiaryEntry(value: unknown): value is DiaryEntry {
  const record = asRecord(value);

  if (!record) {
    return false;
  }

  return (
    typeof record.id === "string" &&
    typeof record.date === "string" &&
    typeof record.dateLabel === "string" &&
    typeof record.preview === "string" &&
    typeof record.mood === "number"
  );
}

function isChatMessage(value: unknown): value is ChatMessage {
  const record = asRecord(value);

  if (!record) {
    return false;
  }

  const role = record.role;

  return (
    typeof record.text === "string" &&
    typeof record.time === "string" &&
    (role === "ai" || role === "user")
  );
}

function isSendDiaryChatStreamResult(
  value: unknown,
): value is SendDiaryChatStreamResult {
  const record = asRecord(value);

  if (!record) {
    return false;
  }

  return (
    isChatMessage(record.aiMessage) &&
    isDiaryEntry(record.entry) &&
    typeof record.diarySessionsUsedThisMonth === "number"
  );
}
