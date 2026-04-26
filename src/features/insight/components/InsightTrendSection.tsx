"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartTooltip,
  StatBox,
  TopCard,
  TopCardHeader,
  TrendPlaceholder,
} from "./insight-primitives";
import { MONTHS_ID } from "../lib/insight-data";
import type { TrendPoint } from "../lib/insight-types";
import { getAvgLabel } from "../lib/insight-utils";

export function InsightTrendSection({
  selectedMonth,
  hasTrendData,
  trendData,
  peakMood,
  lowMood,
  avgMood,
  stableDays,
}: {
  selectedMonth: number;
  hasTrendData: boolean;
  trendData: TrendPoint[];
  peakMood: number;
  lowMood: number;
  avgMood: number;
  stableDays: number;
}) {
  return (
    <TopCard>
      <TopCardHeader
        title="Tren Mood"
        subtitle={`Gambaran mood kamu selama bulan ${MONTHS_ID[selectedMonth].toLowerCase()}.`}
      />

      {hasTrendData ? (
        <div className="flex flex-1 flex-col px-6 py-6">
          <div className="mb-4 grid grid-cols-2 gap-4 2xl:grid-cols-4">
            <StatBox
              value={`${peakMood}/5`}
              label="Mood terbaik"
              helper="Nilai mood tertinggi yang muncul bulan ini."
              valueColor="var(--tt-dashboard-success)"
            />
            <StatBox
              value={`${lowMood}/5`}
              label="Mood terendah"
              helper="Nilai mood paling rendah yang sempat tercatat."
              valueColor="var(--tt-dashboard-danger)"
            />
            <StatBox
              value={`${avgMood}/5`}
              label={getAvgLabel(avgMood)}
              helper="Rata-rata mood sepanjang bulan."
              valueColor="var(--tt-dashboard-brand-deep)"
            />
            <StatBox
              value={`${stableDays} hari`}
              label="Hari cukup stabil"
              helper="Jumlah hari dengan mood di level cukup baik."
              valueColor="#7C3AED"
            />
          </div>

          <div
            className="flex flex-1 flex-col rounded-3xl border p-4"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #F9FCFB 100%)",
              borderColor: "rgba(25,39,44,0.08)",
            }}
          >
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 8, right: 8, left: -28, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="moodAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--tt-dashboard-brand)"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="60%"
                        stopColor="var(--tt-dashboard-brand)"
                        stopOpacity={0.08}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--tt-dashboard-brand)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(25,39,44,0.08)"
                  />

                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    minTickGap={16}
                    tickMargin={12}
                    tick={{
                      fill: "var(--tt-dashboard-text-3)",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={12}
                    width={32}
                    tick={{
                      fill: "var(--tt-dashboard-text-3)",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      stroke: "rgba(26,150,136,0.12)",
                      strokeWidth: 1,
                    }}
                    content={<ChartTooltip />}
                  />

                  <ReferenceLine
                    y={3.5}
                    stroke="#F59E0B"
                    strokeDasharray="4 4"
                  />

                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--tt-dashboard-brand-deep)"
                    strokeWidth={4}
                    fill="url(#moodAreaGradient)"
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: "#FFFFFF",
                      stroke: "var(--tt-dashboard-brand)",
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 0,
                      fill: "var(--tt-dashboard-brand)",
                    }}
                    connectNulls={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span
                  className="h-[4px] w-7 rounded-full"
                  style={{ background: "var(--tt-dashboard-brand-deep)" }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--tt-dashboard-text-2)" }}
                >
                  Mood harian
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="h-[2px] w-7 rounded-full"
                  style={{
                    background:
                      "repeating-linear-gradient(to right, #F59E0B 0 4px, transparent 4px 7px)",
                  }}
                />
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
      ) : (
        <TrendPlaceholder />
      )}
    </TopCard>
  );
}
