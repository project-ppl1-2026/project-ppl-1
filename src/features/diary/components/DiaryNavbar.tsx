// ============================================================
//  src/features/diary/components/DiaryNavbar.tsx
//  Top navigation bar halaman diary
// ============================================================

import { ChevronLeft, Crown } from "lucide-react";
import { colors as C } from "../constants/tokens";
import type { UserProfile, PlanConfig } from "../types";
import { PillBadge } from "./PillBadge";

type Props = {
  user: UserProfile;
  planCfg: PlanConfig;
  diaryRemaining: number;
  onBack?: () => void;
};

export function DiaryNavbar({ user, planCfg, diaryRemaining, onBack }: Props) {
  const isPremium = user.plan === "premium";
  const isQuotaLow = !isPremium && diaryRemaining <= 3;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: 10,
        columnGap: 10,
        padding: "12px 14px",
        background: "rgba(255,255,255,0.97)",
        borderBottom: `1px solid ${C.bdL}`,
        boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: onBack ? "pointer" : "default",
          minWidth: 0,
        }}
      >
        <ChevronLeft size={14} color={C.sub} />
        <span
          style={{
            fontSize: 12,
            color: C.sub,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Safe Diary
        </span>
      </button>

      <div style={{ flex: 1, minWidth: 0 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          marginLeft: "auto",
        }}
      >
        <PillBadge
          bg={isPremium ? C.goldS : C.inkS}
          color={isPremium ? C.gold : C.ink}
          border={isPremium ? C.goldL : C.bd}
        >
          {isPremium ? <Crown size={12} color={C.gold} /> : null}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isPremium ? C.gold : C.ink,
              whiteSpace: "nowrap",
            }}
          >
            {isPremium ? "Premium Plan" : "Free Plan"}
          </span>
        </PillBadge>

        {!isPremium ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 8,
              background: C.bg,
              border: `1px solid ${C.bdL}`,
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: C.sub,
                whiteSpace: "nowrap",
              }}
            >
              Sesi bulan ini:
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: isQuotaLow ? C.red : C.ink,
                whiteSpace: "nowrap",
              }}
            >
              {user.diarySessionsUsedThisMonth}/{planCfg.diaryPerMonth}
            </span>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
