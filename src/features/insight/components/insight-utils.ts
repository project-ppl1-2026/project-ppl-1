import { MONTHS_ID } from "./insight-data";
import type { InsightMap, TrendPoint } from "./insight-types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateID(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

export function getDayDifference(fromDate: string, toDate: string) {
  const a = new Date(`${fromDate}T00:00:00`);
  const b = new Date(`${toDate}T00:00:00`);
  const diffMs = a.getTime() - b.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getRelativeLabel(dateStr: string, allDates: string[]) {
  const sorted = [...allDates].sort();
  const latest = sorted[sorted.length - 1];
  const diff = getDayDifference(latest, dateStr);

  if (diff === 0) return "Hari ini";
  if (diff === 1) return "Kemarin";
  return `${diff} hari lalu`;
}

export function getMoodStatus(mood: number) {
  if (mood >= 4) {
    return {
      label: "Mood lagi baik",
      color: "var(--tt-dashboard-success)",
      bg: "var(--tt-dashboard-success-soft)",
    };
  }
  if (mood >= 3) {
    return {
      label: "Mood cukup stabil",
      color: "var(--tt-dashboard-brand)",
      bg: "var(--tt-dashboard-brand-soft)",
    };
  }
  if (mood >= 2) {
    return {
      label: "Mood agak turun",
      color: "var(--tt-dashboard-warning)",
      bg: "var(--tt-dashboard-warning-soft)",
    };
  }
  return {
    label: "Mood perlu perhatian",
    color: "var(--tt-dashboard-danger)",
    bg: "#FEF2F2",
  };
}

export function getMonthData(
  year: number,
  monthIndexZeroBased: number,
  insightMap: InsightMap,
): TrendPoint[] {
  const daysInMonth = new Date(year, monthIndexZeroBased + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const iso = `${year}-${String(monthIndexZeroBased + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    let mood = Math.round(
      Math.min(
        5,
        Math.max(1, 3.6 + Math.sin(i * 0.62) * 1.1 + Math.cos(i * 0.33) * 0.55),
      ),
    );

    if (insightMap[iso]) {
      mood = insightMap[iso].mood;
    }

    return { day, mood, iso };
  });
}

export function getAverageMood(data: { mood: number }[]) {
  if (!data.length) return 0;
  return Number(
    (data.reduce((sum, item) => sum + item.mood, 0) / data.length).toFixed(1),
  );
}

export function getPeakMood(data: { mood: number }[]) {
  return Math.round(Math.max(...data.map((item) => item.mood)));
}

export function getLowMood(data: { mood: number }[]) {
  return Math.round(Math.min(...data.map((item) => item.mood)));
}

export function countStableDays(data: { mood: number }[], threshold = 3.5) {
  return data.filter((item) => item.mood >= threshold).length;
}

export function getAvgLabel(avgMood: number) {
  if (avgMood >= 4.3) return "Cenderung baik";
  if (avgMood >= 3.3) return "Cukup stabil";
  if (avgMood >= 2.3) return "Naik turun";
  return "Perlu dijaga";
}
