// ============================================================
//  src/features/diary/components/EntryCard.tsx
// ============================================================

import { Lock } from "lucide-react";
import { colors as C, fonts } from "../constants/tokens";
import type { DiaryEntry } from "../types";
import { MoodFace } from "./MoodFace";

type Props = {
  entry: DiaryEntry;
  isActive: boolean;
  onClick: () => void;
};
export function EntryCard({ entry, isActive, onClick }: Props) {
  const isPast = !entry.isToday;

  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        border: isActive ? `1.5px solid ${C.ink}` : `1px solid ${C.bdL}`,
        background: isActive ? C.inkS : C.white,
        transition: "all 0.14s",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <MoodFace score={entry.mood} size={20} />
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: isActive ? C.ink : C.muted,
              fontFamily: fonts.serif,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {entry.dateLabel}
          </p>

          {isPast && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: 2,
              }}
            >
              <Lock size={9} color={C.sub} />
              <span
                style={{
                  fontSize: 8,
                  color: C.sub,
                  fontWeight: 600,
                  lineHeight: 1.1,
                }}
              >
                Hanya baca
              </span>
            </div>
          )}
        </div>
      </div>

      <p
        style={{
          fontSize: 10,
          color: C.muted,
          fontStyle: "italic",
          lineHeight: 1.45,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          margin: 0,
        }}
      >
        &ldquo;{entry.preview}&rdquo;
      </p>
    </div>
  );
}
