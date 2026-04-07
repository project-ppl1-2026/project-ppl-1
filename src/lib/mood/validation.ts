import { z } from "zod";

/**
 * Validasi untuk request payload dari submit mood check-in.
 */
export const moodSubmitSchema = z.object({
  moodScore: z
    .number()
    .int("Skor mood harus berupa bilangan bulat.")
    .min(1, "Skor mood minimal adalah 1.")
    .max(5, "Skor mood maksimal adalah 5."),
  note: z.string().optional(),
  timezone: z.string().min(3, "Timezone tidak valid."),
});

/**
 * Validasi query params untuk GET /api/mood.
 */
export const moodHistoryQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD.")
    .optional(),
  timezone: z.string().min(3, "Timezone tidak valid.").optional(),
});

/**
 * Validasi payload untuk PATCH /api/mood/streak.
 */
export const moodStreakPatchSchema = z.object({
  timezone: z
    .string({ error: "Timezone identifier (misal: Asia/Jakarta) diperlukan." })
    .min(3, "Timezone tidak valid."),
});
