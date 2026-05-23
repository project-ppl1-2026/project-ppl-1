// Mock untuk @/lib/baseline/service
// File ini ada karena src/lib/baseline/service.ts tidak ada di project.
// Kalau suatu saat service.ts dibuat, file ini bisa dihapus
// dan alias di vitest.config.mts bisa dihapus juga.

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
