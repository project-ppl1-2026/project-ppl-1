// ============================================================
// src/lib/home-utils.ts
// Helper untuk home page
// ============================================================

export type MoodLogLite = {
  createdAt: Date;
  moodScore: number;
};

export type WeekMoodBox = {
  dayLabel: string;
  dateNumber: number;
  moodScore: number | null;
  isToday: boolean;
};

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDayKey(dayKey: string) {
  return new Date(`${dayKey}T00:00:00Z`);
}

export function getMoodLabel(score: number | null) {
  if (score === null) return "Belum isi";
  if (score <= 1) return "Sangat Sedih";
  if (score === 2) return "Sedih";
  if (score === 3) return "Biasa";
  if (score === 4) return "Senang";

  return "Sangat Senang";
}

export function getDayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function hasMoodCheckinToday(logs: MoodLogLite[], now = new Date()) {
  const { start, end } = getDayRange(now);

  return logs.some((log) => {
    const current = new Date(log.createdAt);
    return current >= start && current <= end;
  });
}

export function getWeekMoodData(
  logs: MoodLogLite[],
  now = new Date(),
): WeekMoodBox[] {
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const currentDay = now.getDay();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const found = logs.find((log) => {
      const d = new Date(log.createdAt);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });

    return {
      dayLabel: dayNames[date.getDay()],
      dateNumber: date.getDate(),
      moodScore: found?.moodScore ?? null,
      isToday:
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate(),
    };
  });
}

export function getLongestMoodStreak(logs: MoodLogLite[]) {
  if (logs.length === 0) {
    return 0;
  }

  const uniqueDayKeys = Array.from(
    new Set(logs.map((log) => toDayKey(new Date(log.createdAt)))),
  ).sort();

  if (uniqueDayKeys.length === 0) {
    return 0;
  }

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDayKeys.length; i += 1) {
    const prev = parseDayKey(uniqueDayKeys[i - 1]);
    const next = parseDayKey(uniqueDayKeys[i]);
    const diffDays = Math.round(
      (next.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
