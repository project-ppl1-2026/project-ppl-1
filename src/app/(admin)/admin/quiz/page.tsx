// src/app/(admin)/admin/quiz/page.tsx
import { requireAdmin } from "@/lib/admin/require-admin";
import prisma from "@/lib/prisma";
import { BraveChoicePage } from "@/components/admin/BraveChoicePage";

export default async function AdminQuizPage() {
  await requireAdmin();

  const questions = await prisma.quizQuestion.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      scenario: true,
      category: true,
      optionA: true,
      optionB: true,
      correctOption: true,
      explanationCorrect: true,
      explanationIncorrect: true,
      ageSegment: true,
      isActive: true,
      createdAt: true,
    },
  });

  return <BraveChoicePage initialQuestions={questions} />;
}
