"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
};

export function WeekFilterBar({
  selectedDate,
  onDateChange,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(
    selectedDate ?? new Date(),
  );

  React.useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate);
    }
  }, [selectedDate]);

  const monthYearLabel = React.useMemo(() => {
    const base = selectedDate ?? new Date();
    return new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(base);
  }, [selectedDate]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onPrev}
        disabled={disablePrev}
        className="flex h-8 w-8 items-center justify-center rounded-xl transition disabled:opacity-30"
        style={{
          background: "var(--tt-dashboard-chip-bg)",
          color: "var(--tt-dashboard-text)",
        }}
      >
        <ChevronLeft size={14} />
      </button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 min-w-[140px] items-center justify-center gap-2 rounded-xl px-3 text-[12px] font-bold"
            style={{
              background: "var(--tt-dashboard-chip-bg)",
              color: "var(--tt-dashboard-text)",
            }}
          >
            <CalendarDays size={13} />
            <span>{monthYearLabel}</span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="z-[9999] w-[280px] rounded-2xl border p-3 shadow-xl"
          style={{
            background: "#FEFCF8",
            borderColor: "var(--tt-dashboard-card-border)",
          }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            onSelect={(date) => {
              onDateChange(date);
              if (date) setOpen(false);
            }}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={2035}
            initialFocus
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>

      <button
        onClick={onNext}
        disabled={disableNext}
        className="flex h-8 w-8 items-center justify-center rounded-xl transition disabled:opacity-30"
        style={{
          background: "var(--tt-dashboard-chip-bg)",
          color: "var(--tt-dashboard-text)",
        }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
