"use client";

import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Info,
  Star,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ActionPriority = "High" | "Medium" | "Low";

type DayInsight = {
  date: string; // YYYY-MM-DD
  mood: number;
  reflection: string;
  pattern: string;
  affirmation: string;
  actions: {
    priority: ActionPriority;
    label: string;
    desc: string;
  }[];
};

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const SHORT_MONTHS_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const INSIGHT_BY_DATE: Record<string, Omit<DayInsight, "date">> = {
  "2026-03-29": {
    mood: 5,
    reflection:
      "Ini termasuk hari yang cukup menyenangkan buatmu. Aktivitas yang kamu lakukan membantu bikin suasana hati naik. Dari isi diary, kelihatan kamu merasa lebih lega, lebih hidup, dan lebih puas sama harimu.",
    pattern:
      "Saat kamu punya aktivitas yang kamu suka, mood-mu jauh lebih stabil. Jadi salah satu kuncinya adalah menjaga supaya kamu tetap punya ruang untuk kegiatan yang bikin kamu merasa nyaman.",
    affirmation:
      '"Saat kamu memberi waktu untuk hal yang kamu nikmati, pikiranmu juga ikut jadi lebih ringan."',
    actions: [
      {
        priority: "High",
        label: "Pertahankan aktivitas yang bikin nyaman",
        desc: "Kalau ada kegiatan yang terbukti bikin mood-mu membaik, usahakan tetap ada di jadwalmu setiap minggu.",
      },
      {
        priority: "Medium",
        label: "Simpan momen baik hari ini",
        desc: "Coba tulis atau foto hal yang bikin kamu senang hari itu supaya bisa kamu ingat saat mood lagi turun.",
      },
      {
        priority: "Low",
        label: "Cari pola yang bikin kamu lebih tenang",
        desc: "Perhatikan kegiatan seperti apa yang paling sering bikin kamu merasa lebih baik.",
      },
    ],
  },
  "2026-03-30": {
    mood: 3,
    reflection:
      "Kemarin kelihatan cukup berat. Kamu banyak mikir soal tugas dan hasilnya, jadi suasana hati juga ikut turun. Walau begitu, kamu tetap berusaha jalan terus. Itu tandanya kamu tetap punya semangat meski lagi capek.",
    pattern:
      "Kamu cenderung menilai semuanya dari hasil akhir. Padahal usaha yang kamu lakukan juga penting. Kadang kamu terlalu keras ke diri sendiri saat sesuatu belum sesuai harapan.",
    affirmation:
      '"Pelan-pelan juga tetap maju. Tidak harus selalu sempurna untuk bisa dibilang berhasil."',
    actions: [
      {
        priority: "High",
        label: "Bagi tugas jadi bagian kecil",
        desc: "Supaya tidak terasa menumpuk, pecah tugas besar jadi beberapa langkah kecil yang lebih ringan dikerjakan.",
      },
      {
        priority: "Medium",
        label: "Istirahat teratur saat belajar",
        desc: "Belajar terus tanpa jeda malah bikin cepat lelah. Coba selingi istirahat singkat supaya fokus tetap terjaga.",
      },
      {
        priority: "Low",
        label: "Tidur lebih cukup malam ini",
        desc: "Kalau badan kurang istirahat, pikiran juga biasanya jadi lebih sensitif dan gampang overthinking.",
      },
    ],
  },
  "2026-03-31": {
    mood: 4,
    reflection:
      "Hari ini kamu sempat tegang di awal, tapi akhirnya bisa melewati semuanya dengan cukup baik. Dari catatan harianmu, kelihatan kalau rasa cemas itu pelan-pelan berubah jadi lega setelah tugas selesai. Artinya, kamu sebenarnya makin mampu menenangkan diri saat ada tekanan.",
    pattern:
      "Kamu sering merasa kurang yakin sebelum mulai. Tapi setelah dijalani, hasilnya biasanya lebih baik dari yang kamu bayangkan. Jadi yang paling bikin berat bukan kemampuanmu, tapi rasa takut sebelum mencoba.",
    affirmation:
      '"Saat kamu memberi waktu untuk hal yang kamu nikmati, pikiranmu juga ikut jadi lebih ringan."',
    actions: [
      {
        priority: "High",
        label: "Cerita ke orang yang kamu percaya",
        desc: "Kalau lagi kepikiran terus, coba ngobrol ke teman dekat, kakak, atau konselor supaya bebanmu tidak dipendam sendiri.",
      },
      {
        priority: "Medium",
        label: "Tenangkan diri sebelum mulai",
        desc: "Sebelum presentasi atau tugas penting, ambil waktu sebentar untuk tarik napas pelan supaya badan tidak terlalu tegang.",
      },
      {
        priority: "Low",
        label: "Catat hal yang berhasil hari ini",
        desc: "Tulis 2–3 hal kecil yang berhasil kamu lakukan supaya kamu lebih sadar kalau kamu sudah berkembang.",
      },
    ],
  },
};

const PRIORITY_STYLE: Record<
  ActionPriority,
  { text: string; bg: string; color: string; border: string; panelBg: string }
> = {
  High: {
    text: "Prioritas tinggi",
    bg: "#FEF2F2",
    color: "var(--tt-dashboard-danger)",
    border: "#FECACA",
    panelBg: "#FFF7F7",
  },
  Medium: {
    text: "Prioritas sedang",
    bg: "var(--tt-dashboard-warning-soft)",
    color: "var(--tt-dashboard-warning)",
    border: "#FDE68A",
    panelBg: "#FFFBF1",
  },
  Low: {
    text: "Prioritas rendah",
    bg: "var(--tt-dashboard-success-soft)",
    color: "var(--tt-dashboard-success)",
    border: "#A7F3D0",
    panelBg: "#F7FCFB",
  },
};

function formatDateID(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}

function formatShortDateID(dateStr: string) {
  const [month, day] = dateStr.split("-").map(Number);
  return `${day} ${SHORT_MONTHS_ID[month - 1]}`;
}

function getRelativeLabel(dateStr: string, allDates: string[]) {
  const sorted = [...allDates].sort();
  const last = sorted[sorted.length - 1];
  const secondLast = sorted[sorted.length - 2];

  if (dateStr === last) return "Hari ini";
  if (dateStr === secondLast) return "Kemarin";
  return formatShortDateID(dateStr);
}

function getMoodStatus(mood: number) {
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

function getMonthData(year: number, monthIndexZeroBased: number) {
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

    if (INSIGHT_BY_DATE[iso]) {
      mood = INSIGHT_BY_DATE[iso].mood;
    }

    return { day, mood, iso };
  });
}

function getAverageMood(data: { mood: number }[]) {
  if (!data.length) return 0;
  return Number(
    (data.reduce((sum, item) => sum + item.mood, 0) / data.length).toFixed(1),
  );
}

function getPeakMood(data: { mood: number }[]) {
  return Math.round(Math.max(...data.map((item) => item.mood)));
}

function getLowMood(data: { mood: number }[]) {
  return Math.round(Math.min(...data.map((item) => item.mood)));
}

function countStableDays(data: { mood: number }[], threshold = 3.5) {
  return data.filter((item) => item.mood >= threshold).length;
}

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[1.45rem] border ${className}`}
      style={{
        background: "rgba(255,255,255,0.78)",
        borderColor: "var(--tt-dashboard-card-border)",
        boxShadow: "0 8px 24px rgba(26,40,64,0.04)",
      }}
    >
      {children}
    </section>
  );
}

function StatBox({
  value,
  label,
  helper,
  valueColor,
}: {
  value: string;
  label: string;
  helper?: string;
  valueColor?: string;
}) {
  return (
    <div
      className="relative rounded-[1.15rem] border px-4 py-4"
      style={{
        background: "rgba(255,255,255,0.9)",
        borderColor: "var(--tt-dashboard-card-border)",
      }}
    >
      <p
        className="text-[1rem] font-black leading-none md:text-[1rem]"
        style={{ color: valueColor ?? "var(--tt-dashboard-text)" }}
      >
        {value}
      </p>

      <div className="mt-2 flex items-start justify-between gap-2">
        <p
          className="max-w-[8rem] text-[8px] font-bold leading-3.5 md:text-[10px]"
          style={{ color: "var(--tt-dashboard-text)" }}
        >
          {label}
        </p>

        {helper ? (
          <div className="group relative shrink-0">
            <Info
              size={14}
              className="cursor-help"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            />
            <div
              className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-50 w-52 rounded-xl border px-3 py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                background: "#ffffff",
                borderColor: "var(--tt-dashboard-card-border)",
                color: "var(--tt-dashboard-text-2)",
                transform: "translateY(6px)",
              }}
            >
              <p className="text-[10px] leading-4">{helper}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg px-2.5 py-2 text-[10px] shadow-lg"
      style={{
        background: "var(--tt-dashboard-brand-deep)",
        color: "#fff",
      }}
    >
      <p className="font-bold">Tanggal {label}</p>
      <p className="mt-0.5 text-white/80">Skor mood: {payload[0]?.value}/5</p>
    </div>
  );
}

function PillButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold transition-all duration-200"
      style={{
        background: active ? "var(--tt-dashboard-active-bg)" : "#fff",
        color: active
          ? "var(--tt-dashboard-active-text)"
          : "var(--tt-dashboard-text-2)",
        borderColor: active ? "transparent" : "var(--tt-dashboard-card-border)",
        boxShadow: active ? "0 8px 18px rgba(26,150,136,0.14)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export default function InsightPage() {
  const availableDates = useMemo(() => Object.keys(INSIGHT_BY_DATE).sort(), []);

  const [selectedDate, setSelectedDate] = useState("2026-03-29");
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const currentIndex = availableDates.indexOf(selectedDate);
  const fallbackDate = availableDates[availableDates.length - 1];

  const effectiveDate = INSIGHT_BY_DATE[selectedDate]
    ? selectedDate
    : fallbackDate;
  const currentInsight = INSIGHT_BY_DATE[effectiveDate];

  const selectedDateObj = useMemo(
    () => new Date(effectiveDate),
    [effectiveDate],
  );
  const selectedYear = selectedDateObj.getFullYear();
  const selectedMonth = selectedDateObj.getMonth();

  const trendData = useMemo(
    () => getMonthData(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  );

  const moodStatus = getMoodStatus(currentInsight.mood);
  const avgMood = useMemo(() => getAverageMood(trendData), [trendData]);
  const peakMood = useMemo(() => getPeakMood(trendData), [trendData]);
  const lowMood = useMemo(() => getLowMood(trendData), [trendData]);
  const stableDays = useMemo(() => countStableDays(trendData), [trendData]);

  const topDatePills = useMemo(() => {
    return availableDates.map((date) => ({
      date,
      label: getRelativeLabel(date, availableDates),
    }));
  }, [availableDates]);

  function handlePrevDate() {
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1]);
    }
  }

  function handleNextDate() {
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1]);
    }
  }

  function handleDateChange(newDate: string) {
    if (!newDate) return;
    if (INSIGHT_BY_DATE[newDate]) {
      setSelectedDate(newDate);
      return;
    }

    const sameMonthDates = availableDates.filter((d) => {
      const a = new Date(d);
      const b = new Date(newDate);
      return (
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
      );
    });

    if (sameMonthDates.length > 0) {
      setSelectedDate(sameMonthDates[sameMonthDates.length - 1]);
    }
  }

  return (
    <main
      className="h-full min-h-0 overflow-hidden px-4 py-4 md:px-6 md:py-5 xl:px-8 xl:py-6"
      style={{ background: "var(--tt-dashboard-page-bg)" }}
    >
      <div className="mx-auto h-full max-w-[1320px] overflow-y-auto pr-1">
        <div className="pb-6">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.08em]"
                style={{
                  background: "var(--tt-dashboard-warning-soft)",
                  color: "var(--tt-dashboard-warning)",
                }}
              >
                <Star size={10} fill="currentColor" />
                Premium
              </span>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <h1
                  className="text-[2rem] font-black leading-tight md:text-[2.2rem]"
                  style={{ color: "var(--tt-dashboard-text)" }}
                >
                  Insight Harian
                </h1>
                <p
                  className="mt-1 text-[13px] md:text-[14px]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Ringkasan mood, pola, dan saran yang lebih gampang dibaca.
                </p>
              </div>

              <div className="max-w-full overflow-x-auto pb-1">
                <div className="flex min-w-max items-center gap-2">
                  <button
                    onClick={handlePrevDate}
                    disabled={currentIndex <= 0}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      background: "#fff",
                      borderColor: "var(--tt-dashboard-card-border)",
                      color: "var(--tt-dashboard-text)",
                    }}
                    aria-label="Hari sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {topDatePills.map((item) => (
                    <PillButton
                      key={item.date}
                      active={item.date === effectiveDate}
                      onClick={() => setSelectedDate(item.date)}
                    >
                      {item.label}
                    </PillButton>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      dateInputRef.current?.showPicker?.() ??
                      dateInputRef.current?.click()
                    }
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border px-4 text-[11px] font-semibold"
                    style={{
                      background: "#fff",
                      color: "var(--tt-dashboard-text-2)",
                      borderColor: "var(--tt-dashboard-card-border)",
                    }}
                  >
                    <CalendarDays size={13} />
                    {formatDateID(effectiveDate)}
                  </button>

                  <input
                    ref={dateInputRef}
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="sr-only"
                    min={availableDates[0]}
                    max={availableDates[availableDates.length - 1]}
                  />

                  <button
                    onClick={handleNextDate}
                    disabled={currentIndex >= availableDates.length - 1}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      background: "#fff",
                      borderColor: "var(--tt-dashboard-card-border)",
                      color: "var(--tt-dashboard-text)",
                    }}
                    aria-label="Hari berikutnya"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
            <Card className="overflow-hidden">
              <div
                className="border-b px-5 py-4"
                style={{ borderColor: "var(--tt-dashboard-card-border)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-[14px] font-black"
                      style={{ color: "var(--tt-dashboard-brand-deep)" }}
                    >
                      Refleksi AI Harian
                    </p>
                    <p
                      className="mt-1 text-[11px]"
                      style={{ color: "var(--tt-dashboard-text-2)" }}
                    >
                      {getRelativeLabel(effectiveDate, availableDates)} —{" "}
                      {formatDateID(effectiveDate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-end justify-end gap-1">
                      <span
                        className="text-[2rem] font-black leading-none"
                        style={{ color: "var(--tt-dashboard-brand-deep)" }}
                      >
                        {currentInsight.mood}
                      </span>
                      <span
                        className="pb-1 text-[13px] font-bold"
                        style={{ color: "var(--tt-dashboard-text-2)" }}
                      >
                        /5
                      </span>
                    </div>

                    <span
                      className="mt-2 inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold"
                      style={{
                        background: moodStatus.bg,
                        color: moodStatus.color,
                      }}
                    >
                      {moodStatus.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <p
                  className="text-[13px] leading-9"
                  style={{ color: "var(--tt-dashboard-text)" }}
                >
                  {currentInsight.reflection}
                </p>

                <div
                  className="rounded-[1.2rem] border px-5 py-4"
                  style={{
                    background: "var(--tt-dashboard-brand-soft-2)",
                    borderColor: "var(--tt-dashboard-card-border)",
                  }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.14em]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    Pola kognitif terdeteksi
                  </p>
                  <p
                    className="mt-3 text-[12px] leading-8"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    {currentInsight.pattern}
                  </p>
                </div>

                <div
                  className="rounded-[1.2rem] border px-5 py-4"
                  style={{
                    background: "rgba(255,255,255,0.84)",
                    borderColor: "var(--tt-dashboard-card-border)",
                  }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.14em]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    Afirmasi hari ini
                  </p>
                  <p
                    className="mt-3 text-[13px] italic leading-8"
                    style={{ color: "var(--tt-dashboard-brand-deep)" }}
                  >
                    {currentInsight.affirmation}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-visible">
              <div
                className="border-b px-5 py-4"
                style={{ borderColor: "var(--tt-dashboard-card-border)" }}
              >
                <div>
                  <p
                    className="text-[14px] font-black"
                    style={{ color: "var(--tt-dashboard-brand-deep)" }}
                  >
                    Tren Mood Bulanan
                  </p>
                  <p
                    className="mt-1 text-[11px]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    Gambaran mood kamu selama bulan{" "}
                    {MONTHS_ID[selectedMonth].toLowerCase()}.
                  </p>
                </div>
              </div>

              <div className="px-5 py-5">
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatBox
                    value={`${peakMood}/5`}
                    label="Mood terbaik"
                    helper="Nilai mood paling tinggi yang tercatat bulan ini."
                    valueColor="var(--tt-dashboard-success)"
                  />
                  <StatBox
                    value={`${lowMood}/5`}
                    label="Mood paling rendah"
                    helper="Nilai mood terendah yang sempat tercatat bulan ini."
                    valueColor="var(--tt-dashboard-danger)"
                  />
                  <StatBox
                    value={`${avgMood}/5`}
                    label="Rata-rata mood"
                    helper="Gambaran umum kondisi mood kamu selama sebulan."
                    valueColor="var(--tt-dashboard-brand-deep)"
                  />
                  <StatBox
                    value={`${stableDays} hari`}
                    label="Mood cukup stabil"
                    helper="Jumlah hari saat mood ada di tingkat yang cukup baik."
                    valueColor="#7C3AED"
                  />
                </div>

                <div className="h-[260px] md:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                    >
                      <CartesianGrid
                        stroke="rgba(84,103,109,0.12)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "var(--tt-dashboard-text-3)",
                          fontSize: 10,
                        }}
                        interval={4}
                      />
                      <YAxis
                        domain={[1, 5]}
                        tickCount={5}
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: "var(--tt-dashboard-text-3)",
                          fontSize: 10,
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={3.5}
                        stroke="#F59E0B"
                        strokeDasharray="4 4"
                      />
                      <Line
                        type="stepAfter"
                        dataKey="mood"
                        stroke="var(--tt-dashboard-brand-deep)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 4,
                          strokeWidth: 0,
                          fill: "var(--tt-dashboard-brand)",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-[2px] w-5 rounded-full"
                      style={{ background: "var(--tt-dashboard-brand-deep)" }}
                    />
                    <span style={{ color: "var(--tt-dashboard-text-2)" }}>
                      Mood harian
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-[2px] w-5 rounded-full"
                      style={{
                        background:
                          "repeating-linear-gradient(to right, #F59E0B 0 4px, transparent 4px 7px)",
                      }}
                    />
                    <span style={{ color: "var(--tt-dashboard-text-2)" }}>
                      Batas mood cukup stabil
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Card className="overflow-hidden">
              <div
                className="border-b px-5 py-4"
                style={{ borderColor: "var(--tt-dashboard-card-border)" }}
              >
                <p
                  className="text-[14px] font-black"
                  style={{ color: "var(--tt-dashboard-brand-deep)" }}
                >
                  Rekomendasi Dukungan
                </p>
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Saran yang bisa kamu lakukan dari yang paling penting sampai
                  tambahan.
                </p>
              </div>

              <div className="space-y-3 px-5 py-5">
                {currentInsight.actions.map((action, index) => {
                  const config = PRIORITY_STYLE[action.priority];

                  return (
                    <div
                      key={`${action.label}-${index}`}
                      className="rounded-[1.1rem] border px-4 py-4"
                      style={{
                        background: config.panelBg,
                        borderColor: config.border,
                      }}
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className="text-[13px] font-extrabold"
                              style={{ color: "var(--tt-dashboard-text)" }}
                            >
                              {action.label}
                            </p>

                            <span
                              className="rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.08em]"
                              style={{
                                background: config.bg,
                                color: config.color,
                                border: `1px solid ${config.border}`,
                              }}
                            >
                              {config.text}
                            </span>
                          </div>

                          <p
                            className="mt-2 text-[12px] leading-7"
                            style={{ color: "var(--tt-dashboard-text-2)" }}
                          >
                            {action.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
