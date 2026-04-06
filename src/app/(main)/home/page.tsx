import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  CalendarDays,
  Lock,
  TrendingUp,
  Users,
} from "lucide-react";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getBaselineByUserId } from "@/lib/baseline/service";
import { BrandPageBackground } from "@/components/layout/brand-page-background";
import {
  CalendarMiniIcon,
  DonutRing,
  FlameIcon,
  MoodFaceIcon,
  getMoodColor,
} from "@/components/home/home-visuals";
import {
  getWeekMoodData,
  hasMoodCheckinToday,
  type MoodLogLite,
} from "@/lib/home-utils";

function CompactStatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[1.3rem] p-4"
      style={{
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(26,150,136,0.10)",
        boxShadow: "0 8px 24px rgba(26,40,64,0.05)",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-[var(--brand-text-muted)]">
          {title}
        </p>
        {icon}
      </div>

      <p className="text-2xl font-extrabold text-[var(--about-dark-teal)]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[var(--brand-text-muted)]">{subtitle}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  title,
  description,
  icon,
  premium = false,
  dark = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-[1.35rem] p-4 transition hover:-translate-y-0.5"
      style={
        dark
          ? {
              background:
                "linear-gradient(135deg, #0F7E79 0%, #16A3A0 65%, #23B5AF 100%)",
              boxShadow: "0 12px 28px rgba(26,150,136,0.16)",
            }
          : {
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(26,150,136,0.10)",
              boxShadow: "0 8px 24px rgba(26,40,64,0.05)",
            }
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              background: dark ? "rgba(255,255,255,0.14)" : "#F4FBFA",
            }}
          >
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`text-base font-extrabold ${
                  dark ? "text-white" : "text-[var(--about-dark-teal)]"
                }`}
              >
                {title}
              </h3>

              {premium && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    background: "rgba(245,158,11,0.14)",
                    color: "#B45309",
                  }}
                >
                  Premium
                </span>
              )}
            </div>

            <p
              className={`mt-1 text-xs ${
                dark ? "text-white/80" : "text-[var(--brand-text-muted)]"
              }`}
            >
              {description}
            </p>
          </div>
        </div>

        {premium && !dark && (
          <div className="flex items-center gap-1 text-[var(--brand-text-muted)]">
            <Lock size={12} />
          </div>
        )}
      </div>
    </Link>
  );
}

function getLevelBadgeStyles(label: "Beginner" | "Intermediate") {
  if (label === "Beginner") {
    return {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#B45309",
      border: "rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    bg: "rgba(34, 197, 94, 0.12)",
    color: "#15803D",
    border: "rgba(34, 197, 94, 0.22)",
  };
}

export default async function MainHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      currentStreak: true,
      parentEmail: true,
    },
  });

  const baseline = await getBaselineByUserId(userId);

  if (!baseline) {
    redirect("/baseline");
  }

  const moodLogs = await prisma.moodLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      createdAt: true,
      moodScore: true,
    },
  });

  const typedMoodLogs: MoodLogLite[] = moodLogs.map((log) => ({
    createdAt: log.createdAt,
    moodScore: log.moodScore,
  }));

  const checkedInToday = hasMoodCheckinToday(typedMoodLogs, now);

  if (!checkedInToday) {
    redirect("/mood");
  }

  const weekData = getWeekMoodData(typedMoodLogs, now);
  const totalMoodLogs = typedMoodLogs.length;
  const longestStreak = user?.currentStreak ?? 0;
  const braveChoicePct = 88;
  const baselineBadge = getLevelBadgeStyles(baseline.label);

  return (
    <BrandPageBackground fillViewport>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p
              className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--brand-text-muted)" }}
            >
              Dashboard ·{" "}
              {now.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <h1
              className="text-2xl font-extrabold sm:text-[28px]"
              style={{ color: "var(--about-dark-teal)" }}
            >
              Selamat datang, {user?.name ?? "User"}!
            </h1>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
          <div
            className="rounded-[1.6rem] p-5"
            style={{
              background:
                "linear-gradient(145deg, #0D4F4F 0%, #1B6B6B 45%, #1A9688 100%)",
              boxShadow: "0 18px 42px rgba(27,107,107,0.22)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                  Mood Streak Aktif
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    <FlameIcon size={30} />
                  </div>

                  <div>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black leading-none text-white sm:text-5xl">
                        {user?.currentStreak ?? 0}
                      </span>
                      <span className="pb-1 text-base font-semibold text-white/70">
                        Hari
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-white/65">
                      Streak harian untuk mood check-in
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center">
                  <p className="text-lg font-black text-white">
                    {longestStreak}
                  </p>
                  <p className="text-[10px] text-white/60">Terpanjang</p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center">
                  <p className="text-lg font-black text-white">
                    {totalMoodLogs}
                  </p>
                  <p className="text-[10px] text-white/60">Total Check-in</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2">
              {weekData.map((item) => (
                <div
                  key={`${item.dayLabel}-${item.dateNumber}`}
                  className="text-center"
                >
                  <div
                    className="mx-auto mb-2 h-1.5 w-full rounded-full"
                    style={{
                      background:
                        item.moodScore !== null
                          ? getMoodColor(item.moodScore)
                          : "rgba(255,255,255,0.18)",
                    }}
                  />
                  <p className="text-[10px] font-semibold text-white/60">
                    {item.dayLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[1.6rem] p-5"
            style={{
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(26,150,136,0.10)",
              boxShadow: "0 8px 24px rgba(26,40,64,0.05)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand-text-muted)]">
              Brave Choice
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <DonutRing
                  pct={braveChoicePct}
                  color="#E0A030"
                  size={64}
                  stroke={7}
                />
                <span className="absolute text-sm font-black text-[var(--about-dark-teal)]">
                  {braveChoicePct}%
                </span>
              </div>

              <div>
                <p className="text-2xl font-black text-[var(--about-dark-teal)]">
                  {braveChoicePct}%
                </p>
                <p className="text-xs text-[var(--brand-text-muted)]">
                  Akurasi keputusan aman
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#22C55E]">
                  +3% minggu ini
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-[#E8F1F0]">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${braveChoicePct}%`,
                  background:
                    "linear-gradient(90deg, #0F766E, #14B8A6, #F59E0B)",
                }}
              />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-4">
          <CompactStatCard
            title="Level Baseline"
            value={baseline.label}
            subtitle="Hasil penilaian baseline terakhir"
            icon={
              <span
                className="rounded-full px-2 py-1 text-[10px] font-bold"
                style={{
                  background: baselineBadge.bg,
                  color: baselineBadge.color,
                  border: `1px solid ${baselineBadge.border}`,
                }}
              >
                {baseline.label}
              </span>
            }
          />

          <CompactStatCard
            title="Mood Hari Ini"
            value={checkedInToday ? "Sudah" : "Belum"}
            subtitle="Status check-in harian"
            icon={<MoodFaceIcon score={4} size={24} />}
          />

          <CompactStatCard
            title="Laporan Orang Tua"
            value={user?.parentEmail ? "Terverifikasi" : "Belum aktif"}
            subtitle={
              user?.parentEmail ? user.parentEmail : "Belum ada email orang tua"
            }
            icon={<Users size={16} className="text-[var(--brand-primary)]" />}
          />

          <CompactStatCard
            title="Periode Laporan"
            value="Mingguan"
            subtitle="Ringkasan tren emosi berikutnya"
            icon={<CalendarMiniIcon />}
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <QuickActionCard
            href="/diary"
            title="Tulis Diary"
            description="Refleksi harianmu bersama AI"
            icon={<BookOpenText size={20} className="text-white" />}
            dark
          />

          <QuickActionCard
            href="/insight"
            title="Lihat Insight"
            description="Analisis premium emosimu"
            icon={
              <TrendingUp size={20} className="text-[var(--brand-primary)]" />
            }
            premium
          />

          <QuickActionCard
            href="/baseline"
            title="Kerjakan Ulang Baseline"
            description="Update hasil level baseline kapan saja"
            icon={
              <CalendarDays size={20} className="text-[var(--brand-primary)]" />
            }
          />
        </section>

        <section
          className="mt-5 rounded-[1.6rem] p-5"
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(26,150,136,0.10)",
            boxShadow: "0 8px 24px rgba(26,40,64,0.05)",
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[var(--about-dark-teal)]">
                Riwayat Mood Minggu Ini
              </h2>
              <p className="text-xs text-[var(--brand-text-muted)]">
                {weekData[0]?.dateNumber} – {weekData[6]?.dateNumber}{" "}
                {now.toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold"
              style={{
                background: "#F8FCFC",
                border: "1px solid rgba(26,150,136,0.10)",
                color: "var(--brand-text-secondary)",
              }}
            >
              <CalendarDays size={14} className="text-[var(--brand-primary)]" />
              {now.toLocaleDateString("id-ID", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {weekData.map((item) => {
              const moodColor = getMoodColor(item.moodScore);

              return (
                <div
                  key={`${item.dayLabel}-${item.dateNumber}-box`}
                  className="rounded-[1.2rem] p-3 text-center"
                  style={{
                    background: item.isToday ? `${moodColor}14` : "#F4FBFA",
                    border: item.isToday
                      ? `1.5px solid ${moodColor}`
                      : "1px solid rgba(26,150,136,0.10)",
                  }}
                >
                  <p className="text-[11px] font-semibold text-[var(--brand-text-muted)]">
                    {item.dayLabel}
                  </p>

                  <div className="my-3 flex justify-center">
                    <MoodFaceIcon score={item.moodScore} size={34} />
                  </div>

                  <p className="text-xs font-semibold text-[var(--brand-text-muted)]">
                    {item.dateNumber}
                  </p>

                  <p
                    className="mt-2 text-sm font-extrabold"
                    style={{ color: moodColor }}
                  >
                    {item.moodScore ? `${item.moodScore}/5` : "-"}
                  </p>

                  {item.isToday && (
                    <p className="mt-2 text-[10px] font-bold text-[var(--brand-primary)]">
                      Hari ini
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </BrandPageBackground>
  );
}
