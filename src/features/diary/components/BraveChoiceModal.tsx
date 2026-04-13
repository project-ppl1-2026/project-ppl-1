// ============================================================
//  src/features/diary/components/BraveChoiceModal.tsx
//  Modal quiz Brave Choice — terpisah agar mudah di-test sendiri
// ============================================================

import {
  X,
  HelpCircle,
  Crown,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { colors as C, fonts } from "../constants/tokens";
import type { BraveChoiceQuiz, PlanType } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  quiz: BraveChoiceQuiz | null;
  isLoading: boolean;
  quizRemaining: number;
  quizPerDay: number;
  plan: PlanType;
  canLoadNext: boolean;
  onNextQuiz: () => void;
  onAnswerSubmit: (quizId: string, label: string, isBrave: boolean) => void;
};

export function BraveChoiceModal({
  isOpen,
  onClose,
  quiz,
  isLoading,
  quizRemaining,
  quizPerDay,
  plan,
  canLoadNext,
  onNextQuiz,
  onAnswerSubmit,
}: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  // Reset state tiap kali quiz baru dimuat
  useEffect(() => {
    setSelectedIdx(null);
    setIsChecked(false);
  }, [quiz?.id]);

  if (!isOpen) return null;

  const handleCheck = () => {
    if (selectedIdx === null || !quiz) return;
    const opt = quiz.options[selectedIdx];
    setIsChecked(true);
    onAnswerSubmit(quiz.id, opt.label, opt.isBrave);
  };

  const handleClose = () => {
    setSelectedIdx(null);
    setIsChecked(false);
    onClose();
  };

  const selectedOpt = quiz?.options[selectedIdx ?? -1];
  const selectedBrave = selectedOpt?.isBrave ?? false;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 20,
          background: C.white,
          boxShadow: "0 32px 80px rgba(0,0,0,0.30)",
          overflow: "hidden",
          animation: "ttSlideUp 0.25s ease-out",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "14px 18px",
            background: `linear-gradient(135deg,${C.inkD},${C.inkM})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <HelpCircle size={18} color={C.white} />
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.white,
                  margin: 0,
                }}
              >
                Brave Choice Quiz
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                }}
              >
                Pilih keputusan paling bijak
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Quota badge */}
            {plan === "free" ? (
              <QuotaBadge remaining={quizRemaining} perDay={quizPerDay} />
            ) : (
              <UnlimitedBadge />
            )}

            <button
              onClick={handleClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "none",
                background: "rgba(255,255,255,0.15)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={14} color={C.white} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "18px 20px" }}>
          {isLoading ? (
            <LoadingState />
          ) : quiz ? (
            <>
              {/* Scenario card */}
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: C.inkS,
                  border: `1px solid ${C.bd}`,
                  marginBottom: 14,
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: C.ink,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    margin: "0 0 6px",
                  }}
                >
                  SKENARIO
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: C.text,
                    lineHeight: 1.7,
                    fontFamily: fonts.serif,
                    margin: 0,
                  }}
                >
                  {quiz.scenario}
                </p>
              </div>

              {/* Option cards */}
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {quiz.options.map((opt, i) => (
                  <OptionCard
                    key={opt.label}
                    option={opt}
                    isSelected={selectedIdx === i}
                    isChecked={isChecked}
                    onClick={() => {
                      if (!isChecked) setSelectedIdx(i);
                    }}
                  />
                ))}
              </div>

              {/* Explanation after answer */}
              {isChecked && selectedOpt && (
                <ExplanationCard
                  isBrave={selectedBrave}
                  text={
                    selectedBrave
                      ? quiz.explanationRight
                      : quiz.explanationWrong
                  }
                />
              )}

              {/* Action buttons */}
              {!isChecked ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleCheck}
                    disabled={selectedIdx === null}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 12,
                      border: "none",
                      background:
                        selectedIdx !== null
                          ? `linear-gradient(135deg,${C.inkD},${C.inkM})`
                          : C.bdL,
                      color: C.white,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: fonts.sans,
                      cursor: selectedIdx !== null ? "pointer" : "not-allowed",
                      transition: "all 0.15s",
                    }}
                  >
                    Cek Jawaban
                  </button>
                  <button
                    onClick={handleClose}
                    style={{
                      height: 42,
                      padding: "0 18px",
                      borderRadius: 12,
                      border: `1.5px solid ${C.bdL}`,
                      background: C.white,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.muted,
                      cursor: "pointer",
                      fontFamily: fonts.sans,
                    }}
                  >
                    Lewati
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      height: 42,
                      borderRadius: 12,
                      border: "none",
                      background: `linear-gradient(135deg,${C.inkD},${C.inkM})`,
                      color: C.white,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: fonts.sans,
                      cursor: "pointer",
                    }}
                  >
                    Lanjutkan Menulis
                  </button>
                  {canLoadNext && (
                    <button
                      onClick={onNextQuiz}
                      style={{
                        height: 42,
                        padding: "0 16px",
                        borderRadius: 12,
                        border: `1.5px solid ${C.ink}`,
                        background: C.inkS,
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.ink,
                        cursor: "pointer",
                        fontFamily: fonts.sans,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      Soal Lagi
                      <ChevronRight size={13} color={C.ink} />
                    </button>
                  )}
                </div>
              )}

              {/* Upgrade nudge */}
              {plan === "free" && quizRemaining <= 1 && !isChecked && (
                <UpgradeNudge />
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function QuotaBadge({
  remaining,
  perDay,
}: {
  remaining: number;
  perDay: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <span style={{ fontSize: 10, color: C.white, fontWeight: 600 }}>
        {remaining}/{perDay} tersisa
      </span>
    </div>
  );
}

function UnlimitedBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.15)",
      }}
    >
      <Crown size={12} color="#FCD34D" />
      <span style={{ fontSize: 10, color: "#FCD34D", fontWeight: 600 }}>
        Unlimited
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "36px 0",
      }}
    >
      <Loader2
        size={36}
        color={C.ink}
        style={{ animation: "ttSpin 0.8s linear infinite" }}
      />
      <p
        style={{
          fontSize: 12,
          color: C.sub,
          fontFamily: fonts.serif,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        Menyiapkan soal untukmu...
      </p>
    </div>
  );
}

function OptionCard({
  option,
  isSelected,
  isChecked,
  onClick,
}: {
  option: { label: string; text: string; isBrave: boolean };
  isSelected: boolean;
  isChecked: boolean;
  onClick: () => void;
}) {
  const borderColor =
    isSelected && isChecked
      ? option.isBrave
        ? C.ok
        : C.red
      : isSelected
        ? C.ink
        : C.bdL;

  const bgColor =
    isSelected && isChecked
      ? option.isBrave
        ? C.okL
        : C.redL
      : isSelected
        ? C.inkS
        : C.bg;

  const labelBg =
    isSelected && isChecked
      ? option.isBrave
        ? C.ok
        : C.red
      : isSelected
        ? C.ink
        : C.bdL;

  const labelColor =
    isSelected && isChecked ? C.white : isSelected ? C.white : C.muted;

  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px",
        borderRadius: 12,
        cursor: isChecked ? "default" : "pointer",
        border: `2px solid ${borderColor}`,
        background: bgColor,
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          background: labelBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          transition: "all 0.15s",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: labelColor,
            fontFamily: fonts.sans,
          }}
        >
          {option.label}
        </span>
      </div>

      {isSelected && isChecked && (
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: option.isBrave ? C.ok : C.red,
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {option.isBrave ? "Bijak!" : "Kurang Tepat"}
        </p>
      )}

      <p
        style={{
          fontSize: 12,
          color: C.text,
          lineHeight: 1.55,
          fontFamily: fonts.serif,
          margin: 0,
        }}
      >
        {option.text}
      </p>
    </div>
  );
}

function ExplanationCard({
  isBrave,
  text,
}: {
  isBrave: boolean;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: isBrave ? C.okL : C.redL,
        border: `1px solid ${isBrave ? C.ok + "50" : C.red + "50"}`,
        marginBottom: 14,
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      {isBrave ? (
        <CheckCircle2
          size={18}
          color={C.ok}
          style={{ flexShrink: 0, marginTop: 1 }}
        />
      ) : (
        <AlertCircle
          size={18}
          color={C.red}
          style={{ flexShrink: 0, marginTop: 1 }}
        />
      )}
      <div>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: isBrave ? C.okD : C.redD,
            margin: "0 0 4px",
          }}
        >
          {isBrave ? "Pilihan Berani! ✨" : "Coba Pikirkan Lagi"}
        </p>
        <p
          style={{
            fontSize: 12,
            color: C.text,
            lineHeight: 1.6,
            fontFamily: fonts.serif,
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function UpgradeNudge() {
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: C.goldS,
        border: `1px solid ${C.goldL}`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Crown size={14} color={C.gold} />
      <p style={{ fontSize: 11, color: C.gold, fontWeight: 600, margin: 0 }}>
        Ini soal terakhirmu hari ini. Upgrade ke Premium untuk akses unlimited!
      </p>
    </div>
  );
}
