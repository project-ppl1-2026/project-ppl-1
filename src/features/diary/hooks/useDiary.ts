"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DiaryEntry,
  ChatMessage,
  PlanConfig,
  UserProfile,
} from "../types";
import {
  getDiaryEntries,
  getDiaryMessages,
  sendChatMessage,
} from "../services/diaryServices";

type InitialUserMeta = {
  id: string;
  name: string;
  plan: "free" | "premium";
  streakDays: number;
  parentEmail?: string;
};

export function useDiary(entryId?: string, initialUserMeta?: InitialUserMeta) {
  const today = useMemo(() => new Date(), []);
  const initialMonthKey = formatMonthKey(today);

  const [isLoading, setIsLoading] = useState(true);
  const [isMonthLoading, setIsMonthLoading] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [activeMonthKey, setActiveMonthKey] = useState(initialMonthKey);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const initialEntryIdRef = useRef(entryId);
  const hasResolvedInitialEntryRef = useRef(false);
  const pendingCalendarSelectionRef = useRef<Date | undefined>(undefined);

  const planCfg: PlanConfig = useMemo(() => {
    if (user?.plan === "premium") {
      return {
        diaryPerMonth: Infinity,
        quizPerDay: Infinity,
      };
    }

    return {
      diaryPerMonth: 10,
      quizPerDay: 5,
    };
  }, [user?.plan]);

  const activeMonth = useMemo(() => {
    return formatMonthLabel(activeMonthKey);
  }, [activeMonthKey]);

  useEffect(() => {
    setUser({
      id: initialUserMeta?.id ?? "unknown",
      name: initialUserMeta?.name ?? "User",
      plan: initialUserMeta?.plan ?? "free",
      diarySessionsUsedThisMonth: 0,
      quizUsedToday: 0,
      streakDays: initialUserMeta?.streakDays ?? 0,
      totalEntries: 0,
      avatarInitials: initialUserMeta?.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    });
  }, [initialUserMeta]);

  useEffect(() => {
    let ignore = false;

    async function loadEntries() {
      setIsLoading(true);
      setIsMonthLoading(true);

      // reset keras supaya UI lama benar-benar hilang
      setEntries([]);
      setSelectedEntry(null);
      setMessages([]);

      const diaryEntries = await getDiaryEntries(activeMonthKey);

      if (ignore) return;

      setEntries(diaryEntries);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              totalEntries: diaryEntries.length,
            }
          : prev,
      );

      setIsMonthLoading(false);
      setIsLoading(false);
    }

    loadEntries();

    return () => {
      ignore = true;
    };
  }, [activeMonthKey]);

  useEffect(() => {
    if (isMonthLoading) return;

    // kalau satu bulan ini memang kosong
    if (!entries.length) {
      setSelectedEntry(null);
      setMessages([]);
      pendingCalendarSelectionRef.current = undefined;
      return;
    }

    let nextEntry: DiaryEntry | null = null;

    // route entry hanya sekali saat awal
    if (!hasResolvedInitialEntryRef.current && initialEntryIdRef.current) {
      nextEntry =
        entries.find((entry) => entry.id === initialEntryIdRef.current) ?? null;

      hasResolvedInitialEntryRef.current = true;

      if (nextEntry) {
        setSelectedDate(parseDateKey(nextEntry.date));
      }
    }

    const targetDate = pendingCalendarSelectionRef.current ?? selectedDate;

    if (!nextEntry && targetDate) {
      const targetDateKey = formatDateKey(targetDate);
      nextEntry =
        entries.find(
          (entry) => normalizeDateKey(entry.date) === targetDateKey,
        ) ?? null;

      // bulan ada diary, tapi hari yang dipilih tidak ada
      if (!nextEntry && pendingCalendarSelectionRef.current) {
        const fallbackEntry = findClosestEntry(entries, targetDate);

        if (fallbackEntry) {
          if (typeof window !== "undefined") {
            window.alert(
              `Kamu tidak menulis diary di tanggal ${formatFullDate(
                targetDate,
              )}. Kami mengarahkanmu ke diary terdekat di bulan ini.`,
            );
          }

          nextEntry = fallbackEntry;
          setSelectedDate(parseDateKey(fallbackEntry.date));
        }

        pendingCalendarSelectionRef.current = undefined;
      }
    }

    if (!nextEntry) {
      const todayKey = formatDateKey(today);
      nextEntry =
        entries.find((entry) => normalizeDateKey(entry.date) === todayKey) ??
        entries.find((entry) => entry.isToday) ??
        null;
    }

    if (!nextEntry) {
      setSelectedEntry(null);
      setMessages([]);
      return;
    }

    setSelectedEntry((prev) => {
      if (prev?.id === nextEntry?.id) return prev;
      return nextEntry;
    });
  }, [entries, selectedDate, today, isMonthLoading]);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      if (!selectedEntry) {
        setMessages([]);
        return;
      }

      const diaryMessages = await getDiaryMessages(selectedEntry.id);

      if (ignore) return;
      setMessages(diaryMessages);
    }

    loadMessages();

    return () => {
      ignore = true;
    };
  }, [selectedEntry]);

  const currentEntryIndex = selectedEntry
    ? entries.findIndex((entry) => entry.id === selectedEntry.id)
    : 0;

  const diaryRemaining =
    user?.plan === "premium"
      ? Infinity
      : Math.max(
          0,
          planCfg.diaryPerMonth - (user?.diarySessionsUsedThisMonth ?? 0),
        );

  const isReadOnly = selectedEntry ? !selectedEntry.isToday : true;
  const canWriteDiary = user?.plan === "premium" || diaryRemaining > 0;

  async function handleSendMessage() {
    if (!selectedEntry || !inputValue.trim() || !canWriteDiary) return;

    const userText = inputValue.trim();

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      time: new Date()
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(":", "."),
    };

    const nextMessages = [...messages, newUserMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsAiTyping(true);

    try {
      const aiText = await sendChatMessage(
        selectedEntry.id,
        userText,
        nextMessages,
      );

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: aiText,
        time: new Date()
          .toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(":", "."),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsAiTyping(false);
    }
  }

  function handleKeyDown() {}
  function selectEntry(entry: DiaryEntry) {
    hasResolvedInitialEntryRef.current = true;
    initialEntryIdRef.current = undefined;
    pendingCalendarSelectionRef.current = undefined;

    setSelectedEntry(entry);
    setSelectedDate(parseDateKey(entry.date));
  }

  function goToPrevEntry() {
    if (currentEntryIndex < entries.length - 1) {
      const next = entries[currentEntryIndex + 1];
      selectEntry(next);
    }
  }

  function goToNextEntry() {
    if (currentEntryIndex > 0) {
      const next = entries[currentEntryIndex - 1];
      selectEntry(next);
    }
  }

  function goToToday() {
    const now = new Date();

    hasResolvedInitialEntryRef.current = true;
    initialEntryIdRef.current = undefined;
    pendingCalendarSelectionRef.current = undefined;

    setSelectedDate(now);
    setActiveMonthKey(formatMonthKey(now));
  }

  function goToPrevMonth() {
    hasResolvedInitialEntryRef.current = true;
    initialEntryIdRef.current = undefined;
    pendingCalendarSelectionRef.current = undefined;

    setActiveMonthKey((prev) => {
      const next = shiftMonthKey(prev, -1);

      setSelectedDate((current) => {
        if (!current) return parseMonthKeyToDate(next);
        return clampDateToMonth(current, next);
      });

      return next;
    });
  }

  function goToNextMonth() {
    hasResolvedInitialEntryRef.current = true;
    initialEntryIdRef.current = undefined;
    pendingCalendarSelectionRef.current = undefined;

    setActiveMonthKey((prev) => {
      const next = shiftMonthKey(prev, 1);

      setSelectedDate((current) => {
        if (!current) return parseMonthKeyToDate(next);
        return clampDateToMonth(current, next);
      });

      return next;
    });
  }

  function selectCalendarDate(date: Date | undefined) {
    setSelectedDate(date);

    if (!date) {
      setSelectedEntry(null);
      setMessages([]);
      pendingCalendarSelectionRef.current = undefined;
      return;
    }

    hasResolvedInitialEntryRef.current = true;
    initialEntryIdRef.current = undefined;
    pendingCalendarSelectionRef.current = date;

    const nextMonthKey = formatMonthKey(date);
    const nextDateKey = formatDateKey(date);

    if (nextMonthKey !== activeMonthKey) {
      setActiveMonthKey(nextMonthKey);
      return;
    }

    const matchedEntry =
      entries.find((entry) => normalizeDateKey(entry.date) === nextDateKey) ??
      null;

    if (matchedEntry) {
      setSelectedEntry(matchedEntry);
      pendingCalendarSelectionRef.current = undefined;
      return;
    }

    // bulan ini ada diary, tapi tanggalnya kosong
    const fallbackEntry = findClosestEntry(entries, date);

    if (fallbackEntry) {
      if (typeof window !== "undefined") {
        window.alert(
          `Kamu tidak menulis diary di tanggal ${formatFullDate(
            date,
          )}. Kami mengarahkanmu ke diary terdekat di bulan ini.`,
        );
      }

      setSelectedEntry(fallbackEntry);
      setSelectedDate(parseDateKey(fallbackEntry.date));
    } else {
      setSelectedEntry(null);
      setMessages([]);
    }

    pendingCalendarSelectionRef.current = undefined;
  }

  return {
    isLoading,
    isMonthLoading,
    user,
    entries,
    messages,
    selectedEntry,
    activeMonth,
    activeMonthKey,
    selectedDate,
    inputValue,
    isAiTyping,
    isReadOnly,
    canWriteDiary,
    currentEntryIndex,
    diaryRemaining,
    planCfg,
    chatScrollRef,
    textareaRef,
    setInputValue,
    setSelectedEntry: selectEntry,
    handleSendMessage,
    handleKeyDown,
    goToPrevEntry,
    goToNextEntry,
    goToToday,
    goToPrevMonth,
    goToNextMonth,
    selectCalendarDate,
  };
}

function findClosestEntry(entries: DiaryEntry[], targetDate: Date) {
  if (!entries.length) return null;

  const targetTime = startOfDay(targetDate).getTime();

  const sorted = [...entries].sort((a, b) => {
    const aDiff = Math.abs(
      startOfDay(parseDateKey(a.date)).getTime() - targetTime,
    );
    const bDiff = Math.abs(
      startOfDay(parseDateKey(b.date)).getTime() - targetTime,
    );
    return aDiff - bDiff;
  });

  return sorted[0] ?? null;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(monthKey: string) {
  const [yearStr, monthStr] = monthKey.split("-");
  const date = new Date(Number(yearStr), Number(monthStr) - 1, 1);

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const normalized = normalizeDateKey(dateKey);
  const [yearStr, monthStr, dayStr] = normalized.split("-");
  return new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
}

function normalizeDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function shiftMonthKey(monthKey: string, delta: number) {
  const [yearStr, monthStr] = monthKey.split("-");
  const date = new Date(Number(yearStr), Number(monthStr) - 1 + delta, 1);
  return formatMonthKey(date);
}

function parseMonthKeyToDate(monthKey: string) {
  const [yearStr, monthStr] = monthKey.split("-");
  return new Date(Number(yearStr), Number(monthStr) - 1, 1);
}

function clampDateToMonth(date: Date, monthKey: string) {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;

  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.min(date.getDate(), lastDay);

  return new Date(year, monthIndex, day);
}
