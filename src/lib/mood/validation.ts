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
