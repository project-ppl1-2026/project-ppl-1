"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LogOut } from "lucide-react";
import Image from "next/image";

import { authClient } from "@/lib/auth-client";
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
import { fadeUp } from "./home-dashboard-motion";
import { SkeletonBox } from "./home-dashboard-primitives";
import { HomeDashboardTopSection } from "./HomeDashboardTopSection";
import { HomeDashboardMoodHistory } from "./HomeDashboardMoodHistory";

export function HomeDashboardContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [timezone] = useState(() => getTimezone());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const sessionUser = sessionData?.user as SessionUser | undefined;

  useEffect(() => {
    if (!sessionUser?.id) return;
    const syncStreak = async () => {
      try {
        const res = await fetch("/api/mood/streak", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timezone }),
        });
        if (!res.ok) throw new Error("Failed to sync streak");
        await queryClient.invalidateQueries({ queryKey: ["session"] });
        await queryClient.refetchQueries({
          queryKey: ["session"],
          type: "active",
        });
      } catch (error) {
        console.error(error);
      }
    };
    void syncStreak();
  }, [sessionUser?.id, timezone, queryClient]);

  const { data: moodLogs = [], isLoading: moodLoading } = useQuery<MoodLog[]>({
    queryKey: ["mood-logs"],
    queryFn: async () => {
      const res = await fetch("/api/mood", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch mood logs");
      const json = (await res.json()) as { success: boolean; data: MoodLog[] };
      return json.data ?? [];
    },
    enabled: !!sessionUser?.id,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { data: totalDiaries = 0, isLoading: countLoading } = useQuery({
    queryKey: ["total-diaries"],
    queryFn: async () => {
      const res = await fetch("/api/diary/count", { cache: "no-store" });
      if (!res.ok) return 0;
      const json = await res.json();
      return json.data?.count ?? 0;
    },
    enabled: !!sessionUser?.id,
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

  const { data: braveChoiceStats = null, isLoading: braveChoiceLoading } =
    useQuery({
      queryKey: ["brave-choice-stats"],
      queryFn: async () => {
        const res = await fetch(
          `/api/diary/brave-choice/stats?timezone=${timezone}`,
          { cache: "no-store" },
        );
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? null;
      },
      enabled: !!sessionUser?.id,
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
  const currentStreak = sessionUser?.currentStreak ?? 0;
  const isPremium = sessionUser?.isPremium ?? false;
  const parentEmail = sessionUser?.parentEmail ?? null;
  const braveChoice = braveChoiceStats ?? { pct: 0, correct: 0, total: 0 };

  const isLoading =
    sessionLoading ||
    moodLoading ||
    baselineLoading ||
    countLoading ||
    braveChoiceLoading;

  const handleInsightClick = () => {
    router.push(isPremium ? "/insight" : "/subscription");
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
    if (matchedWeek) setSelectedWeekId(matchedWeek.id);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const streakWeek = weeks[weeks.length - 1]?.days ?? [];

  const userImageSrc =
    typeof sessionUser?.image === "string" && sessionUser.image.trim() !== ""
      ? sessionUser.image
      : null;

  const userInitials = sessionUser?.name
    ? sessionUser.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-[var(--tt-dashboard-page-bg)]">
        <style jsx global>{`
          @keyframes tt-skeleton {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
        <div
          className="flex shrink-0 items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--tt-dashboard-card-border)" }}
        >
          <div className="w-48 space-y-2">
            <SkeletonBox h={12} />
            <SkeletonBox h={26} />
          </div>
          <SkeletonBox h={36} />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div className="grid gap-3 xl:grid-cols-[280px_1fr]">
              <SkeletonBox h={220} />
              <div className="grid grid-cols-2 gap-3">
                <SkeletonBox h={110} />
                <SkeletonBox h={110} />
                <SkeletonBox h={88} />
                <SkeletonBox h={88} />
              </div>
            </div>
            <SkeletonBox h={72} />
            <SkeletonBox h={330} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--tt-dashboard-page-bg)]">
      {/* ── Top Header Bar ── */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="flex shrink-0 items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--tt-dashboard-card-border)" }}
      >
        {/* Left: greeting + title */}
        <div>
          <p
            className="mb-0.5 text-[11px] font-semibold"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            Selamat datang kembali,{" "}
            <span style={{ color: "var(--tt-dashboard-brand)" }}>
              {sessionUser?.name ?? "Teman"}!
            </span>
          </p>
          <h1
            className="text-[22px] font-black leading-tight md:text-[26px]"
            style={{ color: "var(--tt-dashboard-text)" }}
          >
            Dashboard
          </h1>
        </div>

        {/* Right: avatar + logout — DESKTOP ONLY (mobile uses sidebar shell) */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* Profile button — direct link to /profile, no dropdown */}
          <Link href="/profile" aria-label="Profil pengguna">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors duration-200"
              style={{ background: "var(--tt-dashboard-chip-bg)" }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-black text-white"
                style={{ background: "var(--tt-dashboard-brand)" }}
              >
                {userImageSrc ? (
                  <Image
                    src={userImageSrc}
                    alt={sessionUser?.name ?? "avatar"}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  userInitials
                )}
              </div>
              <span
                className="text-[12px] font-bold"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                {sessionUser?.name ?? "Pengguna"}
              </span>
            </motion.div>
          </Link>

          {/* Logout — icon only red button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              void handleLogout();
            }}
            disabled={isLoggingOut}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
            aria-label="Keluar"
            title="Keluar"
          >
            <LogOut size={15} />
          </motion.button>
        </div>
      </motion.header>

      {/* ── Scrollable Body ── */}
      <div className="tt-dashboard-scroll-y flex-1 overflow-y-auto">
        <div className="px-6 py-5">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em]"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            {dateStr.toUpperCase()}
          </motion.p>

          <HomeDashboardTopSection
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalDiaries={totalDiaries}
            streakWeek={streakWeek}
            getMoodColor={getMoodColor}
            braveChoice={braveChoice}
            parentEmail={parentEmail}
            currentWeek={currentWeek}
            year={now.getFullYear()}
            isPremium={isPremium}
            baseline={baseline}
            onInsightClick={handleInsightClick}
            onInsightKeyDown={handleInsightKeyDown}
          />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
            className="mt-3"
            whileHover={{
              y: -3,
              boxShadow: "0 14px 32px rgba(26,150,136,0.16)",
            }}
            whileTap={{ scale: 0.985 }}
            style={{ borderRadius: "1.15rem" }}
          >
            <Link
              href="/diary"
              className="relative flex items-center gap-4 overflow-hidden rounded-[1.15rem] px-5 py-4"
              style={{
                background: "rgba(26, 150, 136, 0.09)",
                border: "1px solid rgba(26, 150, 136, 0.22)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {/* decorative glow circle */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full"
                style={{ background: "rgba(26, 150, 136, 0.10)" }}
              />

              {/* text body */}
              <div className="relative flex-1">
                <h3
                  className="text-[15px] font-extrabold"
                  style={{ color: "var(--tt-dashboard-brand-deep)" }}
                >
                  Tulis Diary
                </h3>
                <p
                  className="mt-0.5 text-[12px]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Lanjutkan refleksi harianmu bersama TemanCerita!
                </p>
              </div>

              {/* arrow CTA */}
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.18 }}
                className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--tt-dashboard-brand)" }}
              >
                <ArrowRight size={14} color="white" />
              </motion.div>
            </Link>
          </motion.div>

          <HomeDashboardMoodHistory
            selectedDate={selectedDate}
            onDateChange={handleCalendarDateChange}
            onPrev={handlePrevWeek}
            onNext={handleNextWeek}
            disablePrev={currentWeekIndex <= 0}
            disableNext={
              currentWeekIndex < 0 || currentWeekIndex >= weeks.length - 1
            }
            currentWeek={currentWeek}
          />
        </div>
      </div>
    </div>
  );
}
