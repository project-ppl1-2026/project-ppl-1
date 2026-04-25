"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, NotebookPen } from "lucide-react";

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

        if (!res.ok) {
          throw new Error("Failed to sync streak");
        }

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

  const braveChoice = {
    pct: 88,
    weekDelta: 3,
    correct: 22,
    total: 25,
  };

  const isLoading =
    sessionLoading || moodLoading || baselineLoading || countLoading;

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

  const streakWeek = weeks[weeks.length - 1]?.days ?? [];

  if (isLoading) {
    return (
      <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden bg-[var(--tt-dashboard-page-bg)] px-2.5 py-2.5">
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

        <div className="mx-auto w-full max-w-none">
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

          <div className="mt-2.5 pb-2">
            <SkeletonBox h={330} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden bg-[var(--tt-dashboard-page-bg)] px-2.5 py-2.5">
      <div className="tt-dashboard-scroll-y mx-auto h-full overflow-y-auto pl-4 pr-2.5 py-2.5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-3"
        >
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
        </motion.div>

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
          className="mt-2.5"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.985 }}
        >
          <Link
            href="/diary"
            className="flex items-center gap-2.5 rounded-[1.15rem] p-3 text-white transition-shadow duration-300"
            style={{
              background: "var(--tt-dashboard-button-bg)",
              boxShadow: "0 10px 20px rgba(26,150,136,0.14)",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: -4 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"
            >
              <NotebookPen size={15} />
            </motion.div>

            <div className="flex-1">
              <h3 className="text-[14px] font-extrabold">Tulis Diary</h3>
              <p className="mt-0.5 text-[12px] text-white/85">
                Lanjutkan refleksi harianmu bersama TemanCerita!
              </p>
            </div>

            <motion.div whileHover={{ x: 2 }}>
              <ArrowRight size={15} />
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
  );
}
