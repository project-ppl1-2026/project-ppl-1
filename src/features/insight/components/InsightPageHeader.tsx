"use client";

import { ChevronLeft, ChevronRight } from "./insight-primitives";
import {
  DateButton,
  IconButton,
  InsightActionButton,
  PillButton,
} from "./insight-primitives";
import { formatDateID, getRelativeLabel } from "../lib/insight-utils";

export function InsightPageHeader({
  effectiveDate,
  availableDates,
  currentIndex,
  dateInputRef,
  isToday,
  hasInsight,
  isGenerating,
  onGenerateTodayInsight,
  onPrevDate,
  onNextDate,
  onDateChange,
}: {
  effectiveDate: string;
  availableDates: string[];
  currentIndex: number;
  dateInputRef: React.RefObject<HTMLInputElement | null>;
  isToday: boolean;
  hasInsight: boolean;
  isGenerating: boolean;
  onGenerateTodayInsight: () => void;
  onPrevDate: () => void;
  onNextDate: () => void;
  onDateChange: (newDate: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center gap-4">
            <h1
              className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[48px]"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              Insight Harian
            </h1>
          </div>
          <p
            className="text-base leading-7"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            Ringkasan mood, pola, dan saran yang lebih mudah dipahami.
          </p>
        </div>

        <div className="max-w-full overflow-x-auto pb-1 mt-2 xl:mt-0">
          <div className="flex min-w-max items-center gap-3">
            <InsightActionButton
              isToday={isToday}
              hasInsight={hasInsight}
              isGenerating={isGenerating}
              onClick={onGenerateTodayInsight}
            />

            <IconButton
              onClick={onPrevDate}
              disabled={currentIndex <= 0}
              ariaLabel="Hari sebelumnya"
            >
              <ChevronLeft size={16} />
            </IconButton>

            <PillButton active>
              {getRelativeLabel(effectiveDate, availableDates)}
            </PillButton>

            <DateButton
              label={formatDateID(effectiveDate)}
              onClick={() =>
                dateInputRef.current?.showPicker?.() ??
                dateInputRef.current?.click()
              }
            />

            <input
              ref={dateInputRef}
              type="date"
              value={effectiveDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="sr-only"
            />

            <IconButton
              onClick={onNextDate}
              disabled={currentIndex >= availableDates.length - 1}
              ariaLabel="Hari berikutnya"
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
