"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Info,
  Star,
} from "lucide-react";
import { cn } from "./insight-utils";
import { PRIORITY_STYLE } from "./insight-data";
import type { ActionPriority } from "./insight-types";

export function SurfaceCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-3xl border bg-white", className)}
      style={{
        borderColor: "rgba(25,39,44,0.08)",
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.04), 0 10px 24px rgba(16,24,40,0.05)",
      }}
    >
      {children}
    </section>
  );
}

export function TopCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SurfaceCard className={cn("flex flex-col xl:min-h-[700px]", className)}>
      {children}
    </SurfaceCard>
  );
}

export function TopCardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-[112px] items-center justify-between gap-4 border-b px-6 py-5"
      style={{ borderColor: "rgba(25,39,44,0.08)" }}
    >
      <div className="min-w-0">
        <p
          className="text-base font-bold leading-6"
          style={{ color: "var(--tt-dashboard-brand-deep)" }}
        >
          {title}
        </p>
        <p
          className="mt-1 text-sm leading-6"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        >
          {subtitle}
        </p>
      </div>
      {right}
    </div>
  );
}

export function PremiumBadge() {
  return (
    <span
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3"
      style={{
        background: "var(--tt-dashboard-warning-soft)",
        color: "var(--tt-dashboard-warning)",
      }}
    >
      <Star size={12} fill="currentColor" />
      <span className="text-xs font-bold uppercase tracking-[0.08em]">
        Premium
      </span>
    </span>
  );
}

export function InsightActionButton({
  isToday,
  hasInsight,
  onClick,
}: {
  isToday: boolean;
  hasInsight: boolean;
  onClick: () => void;
}) {
  if (!isToday) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={hasInsight}
      className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        background: hasInsight ? "#E8F2F0" : "var(--gradient-brand-btn)",
        color: hasInsight ? "var(--tt-dashboard-text-2)" : "#FFFFFF",
        boxShadow: hasInsight ? "none" : "0 8px 18px rgba(26,150,136,0.16)",
      }}
    >
      {hasInsight
        ? "Insight hari ini sudah tersedia"
        : "Lihat Insight Hari Ini"}
    </button>
  );
}

export function PillButton({
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
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-all duration-200"
      style={{
        background: active ? "var(--tt-dashboard-active-bg)" : "#FFFFFF",
        color: active
          ? "var(--tt-dashboard-active-text)"
          : "var(--tt-dashboard-text-2)",
        borderColor: active ? "transparent" : "rgba(25,39,44,0.08)",
        boxShadow: active ? "0 8px 18px rgba(26,150,136,0.14)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(25,39,44,0.08)",
        color: "var(--tt-dashboard-text)",
      }}
    >
      {children}
    </button>
  );
}

export function DateButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-sm font-medium"
      style={{
        background: "#FFFFFF",
        color: "var(--tt-dashboard-text-2)",
        borderColor: "rgba(25,39,44,0.08)",
      }}
    >
      <CalendarDays size={14} />
      <span>{label}</span>
    </button>
  );
}

export function InfoHint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group relative shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Lihat penjelasan"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      >
        <Info
          size={17}
          className="cursor-help"
          style={{ color: "var(--tt-dashboard-text-3)" }}
        />
      </button>

      <div
        className={cn(
          "absolute bottom-[calc(100%+10px)] right-0 z-50 w-56 rounded-2xl border bg-white px-3 py-2 shadow-lg transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-[6px] opacity-0",
        )}
        style={{
          borderColor: "rgba(25,39,44,0.08)",
          color: "var(--tt-dashboard-text-2)",
          boxShadow: "0 10px 24px rgba(16,24,40,0.08)",
        }}
      >
        <p className="text-xs leading-5">{text}</p>
      </div>
    </div>
  );
}

export function StatBox({
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
  const isLong = value.length >= 7;
  const isVeryLong = value.length >= 9;

  return (
    <div
      className="min-w-0 rounded-[28px] border p-4"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(25,39,44,0.08)",
      }}
    >
      <div className="flex min-h-[50px] flex-col items-center justify-center text-center">
        <p
          className={cn(
            "max-w-full font-bold leading-[0.9] tracking-[-0.04em]",
            isVeryLong
              ? "break-all text-[18px] sm:text-[20px]"
              : isLong
                ? "break-words text-[20px] sm:text-[24px]"
                : "text-[24px] sm:text-[26px]",
          )}
          style={{ color: valueColor ?? "var(--tt-dashboard-text)" }}
        >
          {value}
        </p>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          <p
            className="text-[11px] font-semibold leading-4 sm:text-[12px]"
            style={{ color: "var(--tt-dashboard-text)" }}
          >
            {label}
          </p>
          {helper ? <InfoHint text={helper} /> : null}
        </div>
      </div>
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: ActionPriority }) {
  const config = PRIORITY_STYLE[priority];

  return (
    <span
      className="inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold"
      style={{
        background: config.bg,
        color: config.text,
        borderColor: config.ring,
      }}
    >
      {config.label}
    </span>
  );
}

export function ChartTooltip({
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
      className="rounded-2xl border bg-white px-3 py-2"
      style={{
        borderColor: "rgba(25,39,44,0.08)",
        boxShadow: "0 12px 28px rgba(16,24,40,0.10)",
      }}
    >
      <p
        className="text-xs font-semibold leading-5"
        style={{ color: "var(--tt-dashboard-text)" }}
      >
        {`Tanggal ${label}`}
      </p>
      <p
        className="mt-0.5 text-sm font-medium leading-5"
        style={{ color: "var(--tt-dashboard-text-2)" }}
      >
        Mood {payload[0]?.value}/5
      </p>
    </div>
  );
}

export function NotebookReflection({ text }: { text: string }) {
  const lineGap = 44;
  const topOffset = 18;

  return (
    <div
      className="min-h-[280px] overflow-hidden rounded-3xl border"
      style={{
        borderColor: "rgba(25,39,44,0.08)",
        backgroundColor: "#FCFEFD",
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent 0 ${lineGap - 1}px,
          rgba(25,39,44,0.08) ${lineGap - 1}px ${lineGap}px
        )`,
        backgroundPosition: `0 ${topOffset}px`,
      }}
    >
      <div className="w-full px-7 pb-6 pt-5">
        <p
          className="text-[15px] font-normal"
          style={{
            color: "var(--tt-dashboard-text)",
            lineHeight: `${lineGap}px`,
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function InsightPlaceholderCard({ title }: { title: string }) {
  return (
    <div
      className="rounded-3xl border px-5 py-5"
      style={{
        background: "#FFFFFF",
        borderColor: "rgba(25,39,44,0.08)",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-[0.12em]"
        style={{ color: "var(--tt-dashboard-text-2)" }}
      >
        {title}
      </p>

      <div className="mt-3 space-y-2.5">
        <div className="h-3.5 w-[85%] rounded-full bg-[rgba(25,39,44,0.08)]" />
        <div className="h-3.5 w-[72%] rounded-full bg-[rgba(25,39,44,0.08)]" />
      </div>
    </div>
  );
}

export function EmptyReflectionState({ isToday }: { isToday: boolean }) {
  return (
    <div
      className="rounded-3xl border px-5 py-5"
      style={{
        background: "#FCFEFD",
        borderColor: "rgba(25,39,44,0.08)",
      }}
    >
      <div className="space-y-3">
        <div className="h-4 w-[76%] rounded-full bg-[rgba(25,39,44,0.08)]" />
        <div className="h-4 w-[62%] rounded-full bg-[rgba(25,39,44,0.08)]" />
        <div className="h-4 w-[67%] rounded-full bg-[rgba(25,39,44,0.08)]" />
      </div>

      <div className="mt-5">
        <p
          className="text-sm leading-6"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        >
          {isToday
            ? "Insight hari ini belum tersedia. Tekan tombol di atas untuk melihat ringkasannya."
            : "Belum ada insight untuk tanggal ini."}
        </p>
      </div>
    </div>
  );
}

export function TrendPlaceholder() {
  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <div className="mb-4 grid grid-cols-2 gap-4 2xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-[28px] border p-4"
            style={{
              background: "#FFFFFF",
              borderColor: "rgba(25,39,44,0.08)",
            }}
          >
            <div className="flex min-h-[140px] flex-col items-center justify-center text-center">
              <div className="h-4 w-20 rounded-full bg-[rgba(25,39,44,0.08)]" />
              <div className="mt-2 h-8 w-16 rounded-full bg-[rgba(25,39,44,0.08)]" />
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex flex-1 flex-col rounded-3xl border p-4"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCFB 100%)",
          borderColor: "rgba(25,39,44,0.08)",
        }}
      >
        <div className="min-h-[320px] rounded-[24px] border border-[rgba(25,39,44,0.08)] bg-[rgba(25,39,44,0.02)] p-4">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-8">
              <div className="h-px w-full bg-[rgba(25,39,44,0.08)]" />
              <div className="h-px w-full bg-[rgba(25,39,44,0.08)]" />
              <div className="h-px w-full bg-[rgba(25,39,44,0.08)]" />
              <div className="h-px w-full bg-[rgba(25,39,44,0.08)]" />
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            >
              Belum ada data mood untuk ditampilkan.
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 opacity-60">
          <div className="flex items-center gap-2">
            <span className="h-[4px] w-7 rounded-full bg-[rgba(25,39,44,0.18)]" />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            >
              Mood harian
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[2px] w-7 rounded-full bg-[rgba(25,39,44,0.18)]" />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--tt-dashboard-text-2)" }}
            >
              Batas cukup stabil
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ChevronLeft, ChevronRight };
