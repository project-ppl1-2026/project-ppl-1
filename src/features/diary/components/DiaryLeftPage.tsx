"use client";

import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Crown,
  Flame,
  BookMarked,
  AlertTriangle,
  X,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

import { colors as C } from "../constants/tokens";
import type { DiaryEntry, UserProfile, PlanConfig } from "../types";
import { EntryCard } from "./EntryCard";
import { CalendarDropdown } from "@/components/ui/manual/calendar-dropdown";

type Props = {
  mode: "desktop" | "mobile";
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  user: UserProfile;
  entries: DiaryEntry[];
  selectedEntry: DiaryEntry | null;
  activeMonth: string;
  selectedDate?: Date;
  planCfg: PlanConfig;
  quizRemaining: number;
  canDoQuiz: boolean;
  onSelectEntry: (entry: DiaryEntry) => void;
  onGoToToday: () => void;
  onOpenQuiz: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date | undefined) => void;
};

export function DiaryLeftPage({
  mode,
  isOpen,
  onClose,
  onOpen,
  user,
  entries,
  selectedEntry,
  activeMonth,
  selectedDate,
  planCfg,
  quizRemaining,
  canDoQuiz,
  onSelectEntry,
  onGoToToday,
  onOpenQuiz,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
}: Props) {
  if (mode === "mobile") {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(16, 28, 38, 0.34)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 220ms ease",
            zIndex: 100,
          }}
        />

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: "min(90vw, 380px)",
            background: C.paperL,
            borderRight: `1px solid ${C.bdL}`,
            boxShadow: "20px 0 60px rgba(12, 24, 32, 0.16)",
            transform: isOpen ? "translateX(0)" : "translateX(-104%)",
            transition: "transform 260ms ease",
            zIndex: 120,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "visible",
          }}
        >
          <PanelContent
            user={user}
            entries={entries}
            selectedEntry={selectedEntry}
            activeMonth={activeMonth}
            selectedDate={selectedDate}
            planCfg={planCfg}
            quizRemaining={quizRemaining}
            canDoQuiz={canDoQuiz}
            onSelectEntry={onSelectEntry}
            onGoToToday={onGoToToday}
            onOpenQuiz={onOpenQuiz}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onSelectDate={onSelectDate}
            onClose={onClose}
            showClose
            mobileMode
          />
        </div>
      </>
    );
  }

  if (!isOpen) {
    return (
      <div
        className="hidden md:flex"
        style={{
          width: 58,
          minWidth: 58,
          maxWidth: 58,
          background: C.paper,
          borderRight: `1px solid ${C.bdL}`,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 14,
        }}
      >
        <button
          type="button"
          onClick={onOpen}
          aria-label="Buka riwayat diary"
          title="Buka riwayat diary"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: `1px solid ${C.bdL}`,
            background: C.white,
            color: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(13,70,70,0.06)",
            flexShrink: 0,
          }}
        >
          <PanelLeftOpen size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 352,
        minWidth: 352,
        maxWidth: 352,
        background: C.paperL,
        borderRight: `1px solid ${C.bdL}`,
        display: "flex",
        flexDirection: "column",
        minHeight: 720,
        overflow: "visible",
      }}
    >
      <PanelContent
        user={user}
        entries={entries}
        selectedEntry={selectedEntry}
        activeMonth={activeMonth}
        selectedDate={selectedDate}
        planCfg={planCfg}
        quizRemaining={quizRemaining}
        canDoQuiz={canDoQuiz}
        onSelectEntry={onSelectEntry}
        onGoToToday={onGoToToday}
        onOpenQuiz={onOpenQuiz}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onSelectDate={onSelectDate}
        onClose={onClose}
        showClose
        desktopCloseIcon
      />
    </div>
  );
}

type PanelContentProps = {
  user: UserProfile;
  entries: DiaryEntry[];
  selectedEntry: DiaryEntry | null;
  activeMonth: string;
  selectedDate?: Date;
  planCfg: PlanConfig;
  quizRemaining: number;
  canDoQuiz: boolean;
  onSelectEntry: (entry: DiaryEntry) => void;
  onGoToToday: () => void;
  onOpenQuiz: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onClose: () => void;
  showClose: boolean;
  desktopCloseIcon?: boolean;
  mobileMode?: boolean;
};

function PanelContent({
  user,
  entries,
  selectedEntry,
  activeMonth,
  selectedDate,
  planCfg,
  quizRemaining,
  canDoQuiz,
  onSelectEntry,
  onGoToToday,
  onOpenQuiz,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onClose,
  showClose,
  desktopCloseIcon = false,
  mobileMode = false,
}: PanelContentProps) {
  const iconBtn: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: `1px solid ${C.bdL}`,
    background: C.white,
    color: C.ink,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(13,70,70,0.06)",
    flexShrink: 0,
  };

  return (
    <>
      <div
        style={{
          padding: "16px 14px 12px",
          borderBottom: `1px solid ${C.bdL}`,
          background: C.paper,
          position: "sticky",
          top: 0,
          zIndex: mobileMode ? 5 : 2,
          overflow: "visible",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 800,
                color: C.inkD,
              }}
            >
              Riwayat Diary
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 10,
                color: C.sub,
                fontWeight: 600,
              }}
            >
              Total {user.totalEntries} entri
            </p>
          </div>

          <div style={{ flex: 1 }} />

          {showClose ? (
            <button
              type="button"
              onClick={onClose}
              style={iconBtn}
              aria-label="Tutup riwayat diary"
              title="Tutup riwayat diary"
            >
              {desktopCloseIcon ? (
                <PanelLeftClose size={16} />
              ) : (
                <X size={16} />
              )}
            </button>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: 6,
            alignItems: "center",
            position: "relative",
            zIndex: mobileMode ? 6 : 2,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: mobileMode ? 7 : 2,
              overflow: "visible",
            }}
          >
            <CalendarDropdown
              date={selectedDate}
              monthLabel={activeMonth}
              onChange={(d) => onSelectDate(d)}
            />
          </div>

          <MonthNavButton
            direction="prev"
            onClick={onPrevMonth}
            ariaLabel="Bulan sebelumnya"
          />
          <MonthNavButton
            direction="next"
            onClick={onNextMonth}
            ariaLabel="Bulan berikutnya"
          />
        </div>
      </div>

      <div
        style={{
          padding: "10px 12px",
          borderBottom: `1px solid ${C.bdL}`,
          background: C.paper,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onGoToToday}
          style={{
            width: "100%",
            height: 40,
            borderRadius: 12,
            border: "none",
            background: `linear-gradient(135deg, ${C.inkD}, ${C.inkM})`,
            color: C.white,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 8px 18px rgba(26,150,136,0.18)",
          }}
        >
          Pergi ke Hari Ini
        </button>

        <button
          type="button"
          onClick={canDoQuiz ? onOpenQuiz : undefined}
          style={{
            width: "100%",
            minHeight: 40,
            borderRadius: 12,
            border: `1px solid ${canDoQuiz ? C.bd : C.bdL}`,
            background: canDoQuiz ? C.inkS : "#F7F8F8",
            color: canDoQuiz ? C.ink : C.sub,
            fontSize: 12,
            fontWeight: 700,
            cursor: canDoQuiz ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            opacity: canDoQuiz ? 1 : 0.7,
          }}
        >
          <HelpCircle size={15} color={canDoQuiz ? C.ink : C.sub} />
          <span>Brave Choice Quiz</span>
          <div style={{ flex: 1 }} />

          {user.plan === "free" ? (
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: canDoQuiz ? C.ink : C.redD,
                padding: "3px 8px",
                borderRadius: 999,
                background: canDoQuiz ? C.inkT : C.redL,
                border: `1px solid ${canDoQuiz ? C.bd : "#F7B6B6"}`,
                whiteSpace: "nowrap",
              }}
            >
              {quizRemaining}/{planCfg.quizPerDay}
            </span>
          ) : (
            <Crown size={14} color={C.gold} />
          )}
        </button>

        {!canDoQuiz && user.plan === "free" ? (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              background: C.redL,
              border: `1px solid #F5BBBB`,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle
              size={14}
              color={C.red}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 10,
                lineHeight: 1.5,
                color: C.redD,
                fontWeight: 600,
              }}
            >
              Kuota quiz hari ini habis. Upgrade ke Premium untuk akses
              unlimited.
            </p>
          </div>
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: C.paperL,
        }}
      >
        {entries.length > 0 ? (
          entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isActive={selectedEntry?.id === entry.id}
              onClick={() => onSelectEntry(entry)}
            />
          ))
        ) : (
          <div
            style={{
              border: `1px solid ${C.bdL}`,
              background: C.white,
              borderRadius: 12,
              padding: "16px 14px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 12,
                fontWeight: 800,
                color: C.inkD,
              }}
            >
              Belum ada entri diary
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: C.sub,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              Coba pilih tanggal lain atau kembali ke hari ini.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 14px",
          borderTop: `1px solid ${C.bdL}`,
          background: C.paper,
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: C.muted,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <Flame size={14} color={C.orange} />
          <span>
            Streak{" "}
            <strong style={{ color: C.ink }}>{user.streakDays} hari</strong>
          </span>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: C.muted,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <BookMarked size={14} color={C.ink} />
          <span>
            <strong style={{ color: C.ink }}>{user.totalEntries}</strong> entri
          </span>
        </div>
      </div>
    </>
  );
}

function MonthNavButton({
  direction,
  onClick,
  ariaLabel,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        border: `1px solid ${C.bdL}`,
        background: C.white,
        color: C.ink,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(13,70,70,0.05)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {direction === "prev" ? (
        <ChevronLeft size={15} color={C.ink} />
      ) : (
        <ChevronRight size={15} color={C.ink} />
      )}
    </button>
  );
}
