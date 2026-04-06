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
