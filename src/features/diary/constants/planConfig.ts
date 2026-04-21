// ============================================================
//  src/components/diary/constants/planConfig.ts
//  Konfigurasi limit tiap plan — edit di sini jika ada perubahan
// ============================================================

import type { PlanType, PlanConfig } from "../types";

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  free: {
    diaryPerMonth: 15,
    quizPerDay: 5,
  },
  premium: {
    diaryPerMonth: Infinity,
    quizPerDay: Infinity,
  },
};
