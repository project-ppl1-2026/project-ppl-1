"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Flame,
  Lock,
  NotebookPen,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { MoodDayCard } from "./MoodDayCard";
import { WeekFilterBar } from "./WeekFilterBar";
import type {
  BaselineResponse,
  MoodLog,
  SessionUser,
  WeekData,
} from "../types";
import {
  buildWeeksFromLogs,
  computeLongestStreak,
  getInitialSelectedWeek,
  getTimezone,
} from "../utils";
import { getMoodColor } from "@/components/mood/mood-face-icons";

function DonutRing({
  pct,
  color,
  size = 44,
  stroke = 5,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`${color}20`}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SkeletonBox({ h = 120 }: { h?: number }) {
  return (
    <div
      className="animate-pulse rounded-[1rem]"
      style={{
        background: "var(--tt-dashboard-skeleton)",
        minHeight: h,
      }}
    />
  );
}

export function HomeDashboardContent() {
  const router = useRouter();
  const [timezone] = useState(() => getTimezone());

  const now = useMemo(() => new Date(), []);

  const dateStr = useMemo(
    () =>
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [now],
  );

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession().then((r) => r.data),
    staleTime: 30_000,
  });

  const sessionUser = sessionData?.user as SessionUser | undefined;

  useEffect(() => {
    if (!sessionUser?.id) return;

    fetch("/api/mood/streak", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    }).catch(console.error);
  }, [sessionUser?.id, timezone]);

  const { data: moodLogs = [], isLoading: moodLoading } = useQuery<MoodLog[]>({
    queryKey: ["mood-logs"],
    queryFn: async () => {
      const res = await fetch("/api/mood", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch mood logs");
      const json = (await res.json()) as { success: boolean; data: MoodLog[] };
      return json.data ?? [];
    },
    enabled: !!sessionUser?.id,
    staleTime: 30_000,
  });

  const { data: baseline = null, isLoading: baselineLoading } =
    useQuery<BaselineResponse>({
      queryKey: ["baseline"],
      queryFn: async () => {
        const res = await fetch("/api/baseline", { cache: "no-store" });
        if (!res.ok) return null;
        const json = (await res.json()) as {
          success: boolean;
          baseline: BaselineResponse;
        };
        return json.baseline ?? null;
      },
      enabled: !!sessionUser?.id,
      staleTime: 300_000,
    });

  const weeks = useMemo(
    () => buildWeeksFromLogs(moodLogs, timezone, 24),
    [moodLogs, timezone],
  );

  const initialWeek = useMemo(() => getInitialSelectedWeek(weeks), [weeks]);

  const [selectedWeekId, setSelectedWeekId] = useState<string>(
    initialWeek?.id ?? "",
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialWeek?.days?.[0]?.fullDate,
  );

  useEffect(() => {
    if (!initialWeek || selectedWeekId) return;
    setSelectedWeekId(initialWeek.id);
    setSelectedDate(initialWeek.days?.[0]?.fullDate);
  }, [initialWeek, selectedWeekId]);

  const currentWeek: WeekData | undefined = useMemo(
    () => weeks.find((w) => w.id === selectedWeekId),
    [weeks, selectedWeekId],
  );

  const currentWeekIndex = useMemo(
    () => weeks.findIndex((w) => w.id === selectedWeekId),
    [weeks, selectedWeekId],
  );

  const longestStreak = computeLongestStreak(moodLogs, timezone);
  const totalMoodLogs = moodLogs.length;
  const currentStreak = sessionUser?.currentStreak ?? 0;
  const isPremium = sessionUser?.isPremium ?? false;
  const parentEmail = sessionUser?.parentEmail ?? null;

  const braveChoice = {
    pct: 88,
    weekDelta: 3,
    correct: 22,
    total: 25,
  };

  const isLoading = sessionLoading || moodLoading || baselineLoading;

  const handleInsightClick = () => {
    if (!isPremium) {
      router.push("/subscription");
      return;
    }
    router.push("/insight");
  };

  const handleInsightKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleInsightClick();
    }
  };

  const handlePrevWeek = () => {
    if (currentWeekIndex <= 0) return;
    const prev = weeks[currentWeekIndex - 1];
    if (!prev) return;

    setSelectedWeekId(prev.id);
    setSelectedDate(prev.days?.[0]?.fullDate);
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < 0 || currentWeekIndex >= weeks.length - 1) return;
    const next = weeks[currentWeekIndex + 1];
    if (!next) return;

    setSelectedWeekId(next.id);
    setSelectedDate(next.days?.[0]?.fullDate);
  };

  const handleCalendarDateChange = (date: Date | undefined) => {
    setSelectedDate(date);

    if (!date) return;

    const targetTime = date.getTime();

    const matchedWeek = weeks.find((week) => {
      const first = week.days[0]?.fullDate?.getTime();
      const last = week.days[6]?.fullDate?.getTime();

      return !!first && !!last && targetTime >= first && targetTime <= last;
    });

    if (matchedWeek) {
      setSelectedWeekId(matchedWeek.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--tt-dashboard-page-bg)] px-2.5 py-2.5">
        <div className="mb-3">
          <SkeletonBox h={38} />
        </div>

        <div className="grid gap-2.5 xl:grid-cols-[0.86fr_2.14fr]">
          <SkeletonBox h={220} />
          <div className="grid gap-2.5 md:grid-cols-2">
            <SkeletonBox h={110} />
            <SkeletonBox h={110} />
            <SkeletonBox h={88} />
            <SkeletonBox h={88} />
          </div>
        </div>

        <div className="mt-2.5">
          <SkeletonBox h={84} />
        </div>

        <div className="mt-2.5">
          <SkeletonBox h={330} />
        </div>
      </div>
    );
  }

  const streakWeek = weeks[weeks.length - 1]?.days ?? [];

  return (
    <div className="min-h-screen bg-[var(--tt-dashboard-page-bg)] px-2.5 py-2.5">
      <div className="mb-3">
        <p
          className="mb-1 text-[8px] font-bold uppercase tracking-[0.13em]"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        >
          DASHBOARD · {dateStr.toUpperCase()}
        </p>
        <h1
          className="text-[20px] font-extrabold leading-tight md:text-[25px]"
          style={{ color: "var(--tt-dashboard-text)" }}
        >
          Selamat datang, {sessionUser?.name ?? "Teman"}!
        </h1>
      </div>

      <div className="grid gap-2.5 xl:grid-cols-[0.86fr_2.14fr]">
        <div
          className="rounded-[1.15rem] p-3"
          style={{
            background: "var(--tt-dashboard-hero-bg)",
            boxShadow: "var(--tt-dashboard-hero-shadow)",
          }}
        >
          <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.11em] text-white/65">
            Mood Streak
          </p>

          <div className="mt-4 mb-2.5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <Flame size={32} className="text-[var(--tt-dashboard-warning)]" />
            </div>

            <div>
              <div className="flex items-end gap-1">
                <span className="text-[34px] font-black leading-none text-white">
                  {currentStreak}
                </span>
                <span className="pb-0.5 text-[13px] font-semibold text-white/75">
                  Hari
                </span>
              </div>
              <p className="text-[10px] text-white/60">
                Konsisten menjaga refleksi harianmu
              </p>
            </div>
          </div>

          <div className="mt-6 mb-2.5 grid grid-cols-2 gap-1.5">
            <div className="rounded-lg bg-white/10 px-2.5 py-2 text-center">
              <p className="text-[15px] font-black text-white">
                {longestStreak}
              </p>
              <p className="text-[8px] text-white/60">Terpanjang</p>
            </div>
            <div className="rounded-lg bg-white/10 px-2.5 py-2 text-center">
              <p className="text-[15px] font-black text-white">
                {totalMoodLogs}
              </p>
              <p className="text-[8px] text-white/60">Total Diary</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {streakWeek.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="h-1.5 w-full rounded-full"
                  style={{
                    background:
                      d.score !== null
                        ? getMoodColor(d.score)
                        : "rgba(255,255,255,0.18)",
                  }}
                />
                <span className="text-[6px] text-white/50">{d.day[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2.5 md:grid-cols-2">
          <div className="tt-dashboard-card rounded-[1.15rem] p-3">
            <div className="flex h-full flex-col justify-center">
              <p
                className="mb-2 text-[8px] font-bold uppercase tracking-[0.11em]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                Brave Choice
              </p>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <DonutRing
                    pct={braveChoice.pct}
                    color="var(--tt-dashboard-warning)"
                  />
                  <span
                    className="absolute text-[11px] font-black"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    {braveChoice.pct}%
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <p
                    className="text-[18px] font-black leading-none"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    {braveChoice.correct}/{braveChoice.total}
                  </p>
                  <p
                    className="mt-1 text-[12px] font-semibold"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    pilihan benar
                  </p>
                  <p
                    className="text-[10px]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    Akurasi Keputusan
                  </p>
                  <p
                    className="mt-2 text-[9px] font-bold"
                    style={{ color: "var(--tt-dashboard-success)" }}
                  >
                    ↑ +{braveChoice.weekDelta}% minggu ini
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="tt-dashboard-card rounded-[1.15rem] p-3">
            <div className="flex h-full flex-col">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p
                  className="text-[8px] font-bold uppercase tracking-[0.11em]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Laporan Orang Tua
                </p>

                {parentEmail ? (
                  <span
                    className="inline-flex items-center gap-1 text-[9px] font-bold"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    <CheckCircle2 size={10} /> Terverifikasi
                  </span>
                ) : (
                  <span
                    className="rounded-full px-2 py-1 text-[9px] font-bold"
                    style={{
                      background: "var(--tt-dashboard-chip-bg)",
                      color: "var(--tt-dashboard-chip-text)",
                    }}
                  >
                    Belum aktif
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center">
                <p
                  className="truncate text-[12px] font-bold"
                  style={{ color: "var(--tt-dashboard-text)" }}
                >
                  {parentEmail ?? "Belum ada email orang tua"}
                </p>

                <p
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  {parentEmail
                    ? "Jadwal pengiriman laporan berikutnya"
                    : "Tambahkan email untuk laporan mingguan"}
                </p>

                {parentEmail && currentWeek ? (
                  <div
                    className="mt-5 flex items-center gap-2 text-[11px]"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    <CalendarDays size={12} />
                    <span>
                      Periode: {currentWeek.days[0]?.date ?? "-"} -{" "}
                      {currentWeek.days[6]?.date ?? "-"}{" "}
                      {currentWeek.days[6]?.month ?? ""} {now.getFullYear()}
                    </span>
                  </div>
                ) : (
                  <Link
                    href="/settings/parent-email"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold text-white"
                    style={{ background: "var(--tt-dashboard-button-bg)" }}
                  >
                    Tambah Email <ArrowRight size={11} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={handleInsightClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleInsightKeyDown}
            className="tt-dashboard-card flex cursor-pointer items-center gap-2.5 rounded-[1.15rem] p-3 transition hover:-translate-y-0.5"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="text-[14px] font-extrabold"
                  style={{ color: "var(--tt-dashboard-text)" }}
                >
                  Lihat Insight
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[8px] font-black"
                  style={{
                    background: "var(--tt-dashboard-warning-soft)",
                    color: "var(--tt-dashboard-warning)",
                  }}
                >
                  Premium
                </span>
              </div>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                Analisis premium emosimu
              </p>
            </div>

            {isPremium ? (
              <ArrowRight
                size={15}
                style={{ color: "var(--tt-dashboard-text-2)" }}
              />
            ) : (
              <Lock size={13} style={{ color: "var(--tt-dashboard-text-2)" }} />
            )}
          </div>

          {baseline ? (
            <div className="tt-dashboard-card rounded-[1.15rem] p-3">
              <p
                className="mb-1 text-[8px] font-bold uppercase tracking-[0.11em]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                LEVEL {baseline.isBeginner ? "BEGINNER" : "INTERMEDIATE"}
              </p>

              <p
                className="text-[14px] font-extrabold"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                Baseline Assessment
              </p>

              <Link
                href="/baseline"
                className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                Kerjakan kembali Baseline Assessment
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <Link
          href="/diary"
          className="flex items-center gap-2.5 rounded-[1.15rem] p-3 text-white"
          style={{
            background: "var(--tt-dashboard-button-bg)",
            boxShadow: "0 10px 20px rgba(26,150,136,0.14)",
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <NotebookPen size={15} />
          </div>

          <div className="flex-1">
            <h3 className="text-[14px] font-extrabold">Tulis Diary</h3>
            <p className="mt-0.5 text-[10px] text-white/75">
              Lanjutkan refleksi harianmu
            </p>
          </div>

          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-2.5">
        <div className="tt-dashboard-card rounded-[1.15rem] p-3">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2
                className="truncate text-[15px] font-extrabold"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                Riwayat Mood Minggu Ini
              </h2>
              <p
                className="text-[10px]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                {currentWeek?.label ?? "Belum ada data"}
              </p>
            </div>

            <WeekFilterBar
              selectedDate={selectedDate}
              onDateChange={handleCalendarDateChange}
              onPrev={handlePrevWeek}
              onNext={handleNextWeek}
              disablePrev={currentWeekIndex <= 0}
              disableNext={
                currentWeekIndex < 0 || currentWeekIndex >= weeks.length - 1
              }
            />
          </div>

          {currentWeek?.days?.length ? (
            <div className="overflow-x-auto pb-2">
              <div className="grid min-w-[700px] grid-flow-col auto-cols-[88px] gap-2 md:min-w-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-7">
                {currentWeek.days.map((d, i) => (
                  <MoodDayCard key={`${d.day}-${d.date}-${i}`} d={d} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl border px-4 py-8 text-center text-sm"
              style={{
                borderColor: "var(--tt-dashboard-card-border)",
                color: "var(--tt-dashboard-text-2)",
                background: "var(--tt-dashboard-brand-soft)",
              }}
            >
              Belum ada data mood untuk filter yang dipilih.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
