import { z } from "zod";

export const diaryEntriesQuerySchema = z.object({
  month: z
    .string({ error: "Parameter month wajib diisi." })
    .regex(/^\d{4}-\d{2}$/, "Format month harus YYYY-MM."),
  timezone: z.string().trim().min(1).optional(),
});

export const diaryMessagesQuerySchema = z.object({
  timezone: z.string().trim().min(1).optional(),
});

export const diaryChatPayloadSchema = z.object({
  entryId: z.string().trim().min(1).default("today"),
  messageText: z
    .string({ error: "Pesan tidak boleh kosong." })
    .trim()
    .min(1, "Pesan tidak boleh kosong.")
    .max(5000, "Pesan terlalu panjang (maksimal 5000 karakter)."),
  timezone: z.string().trim().min(1).optional(),
});

export const braveChoiceQuerySchema = z.object({
  timezone: z.string().trim().min(1).optional(),
});

export const braveChoiceAnswerPayloadSchema = z.object({
  questionId: z
    .string({ error: "Question ID wajib diisi." })
    .trim()
    .min(1, "Question ID wajib diisi."),
  chosenOption: z
    .string({ error: "Pilihan jawaban wajib diisi." })
    .trim()
    .min(1, "Pilihan jawaban wajib diisi.")
    .refine(
      (value) => {
        const normalized = value.toUpperCase();
        return normalized === "A" || normalized === "B";
      },
      {
        message: "Pilihan jawaban harus A atau B.",
      },
    ),
  timezone: z.string().trim().min(1).optional(),
});
