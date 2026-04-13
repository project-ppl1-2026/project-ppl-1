// ============================================================
//  src/features/diary/hooks/useBraveChoice.ts
//  Custom hook — state management untuk Brave Choice Quiz
// ============================================================

"use client";

import { useState, useCallback } from "react";
import type { BraveChoiceQuiz, UserProfile } from "../types";
import { PLAN_CONFIG } from "../constants/planConfig";
import {
  getBraveChoiceQuiz,
  submitQuizAnswer,
} from "../services/diaryServices";

export function useBraveChoice(user: UserProfile | null) {
  const [showModal, setShowModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<BraveChoiceQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // TODO: saat backend siap, quizUsedToday seharusnya dari server (user.quizUsedToday)
  // Saat ini kita track di local state per sesi
  const [quizUsedToday, setQuizUsedToday] = useState(user?.quizUsedToday ?? 0);

  const planCfg = user ? PLAN_CONFIG[user.plan] : PLAN_CONFIG.free;
  const quizRemaining =
    planCfg.quizPerDay === Infinity
      ? Infinity
      : Math.max(0, planCfg.quizPerDay - quizUsedToday);
  const canDoQuiz = user?.plan === "premium" || quizRemaining > 0;

  const loadQuiz = useCallback(async () => {
    if (!canDoQuiz) return;
    setShowModal(true);
    setIsLoading(true);
    setCurrentQuiz(null);
    try {
      const quiz = await getBraveChoiceQuiz();
      setCurrentQuiz(quiz);
    } catch {
      // fallback tetap null, QuizModal sudah handle state ini
    } finally {
      setIsLoading(false);
    }
  }, [canDoQuiz]);

  const loadNextQuiz = useCallback(async () => {
    setIsLoading(true);
    setCurrentQuiz(null);
    try {
      const quiz = await getBraveChoiceQuiz();
      setCurrentQuiz(quiz);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswerSubmit = useCallback(
    async (quizId: string, selectedLabel: string, isBrave: boolean) => {
      setQuizUsedToday((prev) => prev + 1);
      try {
        // TODO: kirim ke server saat backend siap
        await submitQuizAnswer(quizId, selectedLabel, isBrave);
      } catch {
        // silent fail — counter local sudah update
      }
    },
    [],
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    setCurrentQuiz(null);
  }, []);

  return {
    showModal,
    currentQuiz,
    isLoading,
    quizRemaining,
    quizUsedToday,
    canDoQuiz,
    planCfg,
    loadQuiz,
    loadNextQuiz,
    handleAnswerSubmit,
    closeModal,
  };
}
