// Fallback mock untuk test yang perlu menghindari import server-only
// dari @/lib/baseline/service.

export const getBaselineByUserId = async (_userId: string) => null;

export const analyzeAndSaveBaseline = async (_params: {
  answers: unknown[];
  userId: string;
}) => ({
  baseline: {
    id: "",
    label: "Beginner",
    isBeginner: true,
    confidenceScore: null,
    analyzedAt: new Date(),
  },
  inference: {
    labelIndex: 0,
    label: "Beginner",
    isBeginner: true,
    confidenceScore: null,
    inputName: "answers",
  },
});
