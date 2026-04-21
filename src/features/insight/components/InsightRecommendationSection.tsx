"use client";

import { PRIORITY_STYLE } from "./insight-data";
import {
  InsightPlaceholderCard,
  PriorityBadge,
  SurfaceCard,
} from "./insight-primitives";
import type { DayInsight } from "./insight-types";

export function InsightRecommendationSection({
  selectedInsight,
}: {
  selectedInsight?: Omit<DayInsight, "date">;
}) {
  const hasInsight = Boolean(selectedInsight);

  return (
    <div className="mt-4">
      <SurfaceCard className="overflow-hidden">
        <div
          className="border-b px-6 py-5"
          style={{ borderColor: "rgba(25,39,44,0.08)" }}
        >
          <p
            className="text-base font-bold leading-6"
            style={{ color: "var(--tt-dashboard-brand-deep)" }}
          >
            Rekomendasi Dukungan
          </p>
          <p
            className="mt-1 text-sm leading-6"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            Langkah yang bisa kamu lakukan mulai dari yang paling penting.
          </p>
        </div>

        <div className="space-y-3 px-6 py-6">
          {hasInsight && selectedInsight ? (
            selectedInsight.actions.map((action, index) => {
              const config = PRIORITY_STYLE[action.priority];

              return (
                <div
                  key={`${action.label}-${index}`}
                  className="rounded-3xl border px-5 py-5"
                  style={{
                    background: config.panel,
                    borderColor: config.ring,
                  }}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p
                          className="text-base font-semibold leading-7"
                          style={{ color: "var(--tt-dashboard-text)" }}
                        >
                          {action.label}
                        </p>
                        <PriorityBadge priority={action.priority} />
                      </div>

                      <p
                        className="mt-2 text-sm leading-7"
                        style={{ color: "var(--tt-dashboard-text-2)" }}
                      >
                        {action.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <InsightPlaceholderCard title="Rekomendasi utama" />
              <InsightPlaceholderCard title="Langkah berikutnya" />
            </>
          )}
        </div>
      </SurfaceCard>
    </div>
  );
}
