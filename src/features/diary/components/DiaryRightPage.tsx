// ============================================================
//  src/features/diary/components/DiaryRightPage.tsx
//  Halaman kanan diary — responsive desktop & mobile
// ============================================================

import {
  Lock,
  ChevronLeft,
  ChevronRight,
  SendHorizonal,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type RefObject,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";

import { colors as C, fonts } from "../constants/tokens";
import type { DiaryEntry, ChatMessage } from "../types";
import { MoodFace } from "./MoodFace";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { PillBadge } from "./PillBadge";

type Props = {
  entry: DiaryEntry;
  messages: ChatMessage[];
  inputValue: string;
  isAiTyping: boolean;
  sendError?: string | null;
  isReadOnly: boolean;
  canWriteDiary: boolean;
  isPremium: boolean;
  diaryPerMonth: number;
  isMobile?: boolean;
  onPrevEntry: () => void;
  onNextEntry: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

type DisplayChatMessage = ChatMessage & {
  displayKey: string;
  showAiMeta?: boolean;
  showTimestamp?: boolean;
};

export function DiaryRightPage({
  entry,
  messages,
  inputValue,
  isAiTyping,
  sendError,
  isReadOnly,
  canWriteDiary,
  isPremium,
  diaryPerMonth,
  isMobile = false,
  onPrevEntry,
  onNextEntry,
  onInputChange,
  onSend,
  onKeyDown,
}: Props) {
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canSend = inputValue.trim().length > 0 && !isAiTyping;
  const displayMessages = useMemo(
    () => buildDisplayMessages(messages),
    [messages],
  );
  const lastMessageText =
    displayMessages[displayMessages.length - 1]?.text ?? "";

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    const maxHeight = isMobile ? 96 : 120;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [textareaRef, isMobile]);

  useEffect(() => {
    const chatContainer = chatScrollRef.current;

    if (!chatContainer) {
      return;
    }

    let nestedRafId: number | null = null;
    const id = window.requestAnimationFrame(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;

      nestedRafId = window.requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });
    });

    const timeoutId = window.setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 120);

    return () => {
      window.cancelAnimationFrame(id);

      if (nestedRafId !== null) {
        window.cancelAnimationFrame(nestedRafId);
      }

      window.clearTimeout(timeoutId);
    };
  }, [entry.id, displayMessages.length, lastMessageText, isAiTyping]);

  useEffect(() => {
    resizeTextarea();
  }, [inputValue, isMobile, resizeTextarea]);

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
      }
      return;
    }

    onKeyDown(e);

    if (e.key === "Enter" && e.shiftKey) {
      window.requestAnimationFrame(() => {
        resizeTextarea();
      });
    }
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);

    const el = e.target;
    const maxHeight = isMobile ? 96 : 120;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: C.paper,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        minHeight: 0,
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      {!isMobile ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 14,
            height: "100%",
            background:
              "linear-gradient(to right,rgba(0,0,0,0.05),transparent)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ) : null}

      <div
        style={{
          flexShrink: 0,
          padding: isMobile ? "16px 16px 12px" : "16px 22px 12px",
          borderBottom: `1px solid ${C.spine}`,
          background: C.paper,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          zIndex: 2,
          position: "relative",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontWeight: 900,
                fontSize: isMobile ? 14 : 15,
                color: C.inkD,
                fontFamily: fonts.serif,
                fontStyle: "italic",
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {entry.dateLabel}
            </p>

            {entry.isToday ? (
              <PillBadge bg={C.okL} color={C.okD} border={`${C.ok}30`}>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: C.ok,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 9, fontWeight: 700, color: C.okD }}>
                  Hari Ini · Aktif
                </span>
              </PillBadge>
            ) : (
              <PillBadge bg={C.bg} color={C.sub} border={C.bdL}>
                <Lock size={9} color={C.sub} />
                <span style={{ fontSize: 9, fontWeight: 600, color: C.sub }}>
                  Hanya Baca
                </span>
              </PillBadge>
            )}
          </div>

          <p
            style={{
              fontSize: 10.5,
              color: C.sub,
              fontFamily: fonts.sans,
              margin: 0,
            }}
          >
            Safe Diary · AI Companion
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <MoodFace score={entry.mood} size={28} />
          <div style={{ height: 28, width: 1, background: C.bdL }} />
          <NavArrowButton onClick={onPrevEntry} direction="left" />
          <NavArrowButton onClick={onNextEntry} direction="right" />
        </div>
      </div>

      {!isPremium && entry.isToday && !canWriteDiary ? (
        <div
          style={{
            flexShrink: 0,
            padding: isMobile ? "10px 14px" : "10px 22px",
            background: C.amberL,
            borderBottom: `1px solid ${C.amberB}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <TriangleAlert
              size={16}
              color={C.amber}
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 12,
                color: C.amber,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              Batas {diaryPerMonth} sesi diary bulan ini tercapai. Upgrade ke
              Premium untuk menulis tanpa batas.
            </span>
          </div>

          <button
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 10,
              border: "none",
              background: C.gold,
              color: C.white,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: fonts.sans,
            }}
          >
            Upgrade →
          </button>
        </div>
      ) : null}

      <div
        ref={chatScrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: isMobile ? "14px 14px 18px" : "16px 22px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: `linear-gradient(180deg, ${C.paper} 0%, ${C.white} 100%)`,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isReadOnly ? (
          <div
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: C.bg,
              border: `1px solid ${C.bdL}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "center",
              maxWidth: "100%",
            }}
          >
            <Lock size={11} color={C.sub} />
            <p
              style={{
                fontSize: 11,
                color: C.sub,
                fontStyle: "italic",
                margin: 0,
                textAlign: "center",
              }}
            >
              Diary ini sudah selesai — entri lampau hanya bisa dibaca.
            </p>
          </div>
        ) : null}

        {displayMessages.map((msg) => (
          <ChatBubble
            key={msg.displayKey}
            message={msg}
            showAiMeta={msg.showAiMeta}
            showTimestamp={msg.showTimestamp}
          />
        ))}

        {isAiTyping ? <TypingIndicator /> : null}
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: isMobile ? "12px 14px 10px" : "10px 18px",
          borderTop: `1px solid ${C.spine}`,
          background: C.paperL,
          zIndex: 2,
          position: "relative",
        }}
      >
        {sendError ? (
          <div
            style={{
              marginBottom: 10,
              padding: "8px 10px",
              borderRadius: 10,
              border: `1px solid ${C.amberB}`,
              background: C.amberL,
              color: C.amber,
              fontSize: 11,
              lineHeight: 1.45,
              fontFamily: fonts.sans,
            }}
          >
            {sendError}
          </div>
        ) : null}

        {isReadOnly ? (
          <LockedInputNotice message="Entri lampau tidak bisa diedit — pilih Hari Ini untuk menulis baru." />
        ) : !canWriteDiary ? (
          <LockedInputNotice message="Batas sesi bulan ini tercapai. Upgrade ke Premium untuk lanjut menulis." />
        ) : (
          <ChatInputRow
            value={inputValue}
            canSend={canSend}
            textareaRef={textareaRef}
            onChange={handleTextareaChange}
            onSend={onSend}
            onKeyDown={handleTextareaKeyDown}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}

function buildDisplayMessages(messages: ChatMessage[]): DisplayChatMessage[] {
  return messages.flatMap((message, index) => {
    const baseId = message.id || `${message.role}-${index}`;

    if (message.role !== "ai") {
      return [
        {
          ...message,
          displayKey: baseId,
          showAiMeta: false,
          showTimestamp: true,
        },
      ];
    }

    const bubbles = splitAiMessageIntoBubbles(message.text);

    if (bubbles.length <= 1) {
      return [
        {
          ...message,
          text: bubbles[0] ?? message.text,
          displayKey: baseId,
          showAiMeta: true,
          showTimestamp: true,
        },
      ];
    }

    return bubbles.map((bubbleText, bubbleIndex) => ({
      ...message,
      text: bubbleText,
      displayKey: `${baseId}-bubble-${bubbleIndex}`,
      showAiMeta: bubbleIndex === 0,
      showTimestamp: bubbleIndex === bubbles.length - 1,
    }));
  });
}

function splitAiMessageIntoBubbles(rawText: string): string[] {
  const normalized = rawText.replace(/\r\n/g, "\n").trim();

  if (!normalized) {
    return [];
  }

  const paragraphBlocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphBlocks.length > 1) {
    return paragraphBlocks.flatMap((block) => splitLongBlockIntoBubbles(block));
  }

  const lineBlocks = normalized
    .split("\n")
    .map((block) => block.trim())
    .filter(Boolean);

  if (lineBlocks.length > 1) {
    return lineBlocks.flatMap((block) => splitLongBlockIntoBubbles(block));
  }

  return splitLongBlockIntoBubbles(normalized);
}

function splitLongBlockIntoBubbles(block: string): string[] {
  const MAX_BUBBLE_CHARS = 210;
  const IDEAL_BUBBLE_CHARS = 150;
  const MAX_SENTENCES_PER_BUBBLE = 2;

  if (block.length <= MAX_BUBBLE_CHARS) {
    return [block];
  }

  const sentences = splitIntoSentences(block);

  if (sentences.length <= 1) {
    return chunkTextByLength(block, IDEAL_BUBBLE_CHARS);
  }

  const bundled: string[] = [];
  let currentBubble = "";
  let sentenceCount = 0;

  for (const sentence of sentences) {
    const nextBubble = currentBubble
      ? `${currentBubble} ${sentence}`
      : sentence;

    const canAppendByLength = nextBubble.length <= MAX_BUBBLE_CHARS;
    const canAppendByCount = sentenceCount < MAX_SENTENCES_PER_BUBBLE;

    if (currentBubble && (!canAppendByLength || !canAppendByCount)) {
      bundled.push(currentBubble);
      currentBubble = sentence;
      sentenceCount = 1;
      continue;
    }

    currentBubble = nextBubble;
    sentenceCount += 1;

    if (currentBubble.length >= IDEAL_BUBBLE_CHARS) {
      bundled.push(currentBubble);
      currentBubble = "";
      sentenceCount = 0;
    }
  }

  if (currentBubble) {
    bundled.push(currentBubble);
  }

  return bundled.flatMap((item) =>
    item.length <= MAX_BUBBLE_CHARS
      ? [item]
      : chunkTextByLength(item, IDEAL_BUBBLE_CHARS),
  );
}

function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+(?:[.!?]+|$)/g);

  if (!matches) {
    return [text.trim()].filter(Boolean);
  }

  return matches.map((item) => item.trim()).filter(Boolean);
}

function chunkTextByLength(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);

  if (!words.length) {
    return [];
  }

  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    const candidate = currentChunk ? `${currentChunk} ${word}` : word;

    if (currentChunk && candidate.length > maxChars) {
      chunks.push(currentChunk);
      currentChunk = word;
      continue;
    }

    currentChunk = candidate;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function NavArrowButton({
  onClick,
  direction,
}: {
  onClick: () => void;
  direction: "left" | "right";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${C.bdL}`,
        background: C.white,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {direction === "left" ? (
        <ChevronLeft size={13} color={C.ink} />
      ) : (
        <ChevronRight size={13} color={C.ink} />
      )}
    </button>
  );
}

function LockedInputNotice({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        background: C.bg,
        border: `1px solid ${C.bdL}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <Lock size={13} color={C.sub} />
      <p
        style={{
          fontSize: 12,
          color: C.sub,
          fontStyle: "italic",
          margin: 0,
          textAlign: "center",
        }}
      >
        {message}
      </p>
    </div>
  );
}

function ChatInputRow({
  value,
  canSend,
  textareaRef,
  onChange,
  onSend,
  onKeyDown,
  isMobile,
}: {
  value: string;
  canSend: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  isMobile: boolean;
}) {
  const placeholder = isMobile
    ? "Ceritakan harimu..."
    : "Ceritakan harimu... (Enter untuk kirim)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: isMobile ? 8 : 10,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: isMobile ? 40 : 42,
          maxHeight: isMobile ? 108 : 132,
          borderRadius: 14,
          border: `1.5px solid ${C.bd}`,
          background: C.white,
          display: "flex",
          alignItems: "flex-end",
          padding: isMobile ? "0 12px" : "0 14px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          minWidth: 0,
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
            fontFamily: fonts.sans,
            fontStyle: "italic",
            fontSize: isMobile ? 12 : 12.5,
            color: C.text,
            lineHeight: isMobile ? 1.45 : 1.6,
            padding: isMobile ? "9px 0" : "10px 0",
            minHeight: isMobile ? 22 : 24,
            maxHeight: isMobile ? 96 : 120,
            minWidth: 0,
            overflowY: "hidden",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        />
      </div>

      <button
        onClick={onSend}
        disabled={!canSend}
        style={{
          width: isMobile ? 40 : 42,
          height: isMobile ? 40 : 42,
          borderRadius: 12,
          border: "none",
          flexShrink: 0,
          background: canSend
            ? `linear-gradient(135deg, ${C.inkD}, ${C.inkM})`
            : C.bdL,
          cursor: canSend ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.18s",
        }}
      >
        <SendHorizonal size={isMobile ? 15 : 16} color={C.white} />
      </button>
    </div>
  );
}
