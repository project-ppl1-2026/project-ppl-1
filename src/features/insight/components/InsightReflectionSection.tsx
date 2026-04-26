"use client";

import {
  EmptyReflectionState,
  InsightPlaceholderCard,
  NotebookReflection,
  TopCard,
  TopCardHeader,
} from "./insight-primitives";
import type { DayInsight } from "../lib/insight-types";
import {
  formatDateID,
  getEmotionalStatus,
  getRelativeLabel,
} from "../lib/insight-utils";

export function InsightReflectionSection({
  effectiveDate,
  availableDates,
  isToday,
  selectedInsight,
}: {
  effectiveDate: string;
  availableDates: string[];
  isToday: boolean;
  selectedInsight?: Omit<DayInsight, "date">;
}) {
  const hasInsight = Boolean(selectedInsight);
  const moodStatus = selectedInsight
    ? getEmotionalStatus(selectedInsight.mood)
    : null;

  return (
    <TopCard>
      <TopCardHeader
        title="Refleksi AI Harian"
        subtitle={`${getRelativeLabel(effectiveDate, availableDates)} - ${formatDateID(effectiveDate)}`}
        right={
          hasInsight && selectedInsight && moodStatus ? (
            <div className="shrink-0 text-right">
              <div className="flex items-end justify-end gap-1">
                <span
                  className="text-[40px] font-bold leading-none"
                  style={{ color: "var(--tt-dashboard-brand-deep)" }}
                >
                  {selectedInsight.mood}
                </span>
                <span
                  className="pb-1 text-base font-semibold leading-none"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  /5
                </span>
              </div>

              <span
                className="mt-3 inline-flex h-8 items-center rounded-full px-3 text-sm font-semibold"
                style={{
                  background: moodStatus.bg,
                  color: moodStatus.color,
                }}
              >
                {moodStatus.label}
              </span>
            </div>
          ) : null
        }
      />

      <div className="flex flex-col gap-4 px-6 py-6 xl:flex-1">
        {hasInsight && selectedInsight ? (
          <>
            <NotebookReflection text={selectedInsight.reflection} />

            <div className="grid gap-4 lg:grid-cols-2">
              <div
                className="rounded-3xl border px-5 py-5"
                style={{
                  background: "#F8FCFB",
                  borderColor: "rgba(25,39,44,0.08)",
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.12em]"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Pola yang terlihat
                </p>
                <p
                  className="mt-3 text-sm leading-7"
                  style={{ color: "var(--tt-dashboard-text)" }}
                >
                  {selectedInsight.pattern}
                </p>
              </div>

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
                  Pengingat hari ini
                </p>
                <p
                  className="mt-3 text-base italic leading-8"
                  style={{ color: "var(--tt-dashboard-brand-deep)" }}
                >
                  {selectedInsight.affirmation}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <EmptyReflectionState isToday={isToday} />
            <div className="grid gap-4 lg:grid-cols-2">
              <InsightPlaceholderCard title="Pola yang terlihat" />
              <InsightPlaceholderCard title="Pengingat hari ini" />
            </div>
          </>
        )}
      </div>
    </TopCard>
  );
}
