// ============================================================
// src/lib/validations.ts
// Zod v4 compatible — pakai "error" bukan "required_error"
// ============================================================

import { z } from "zod";

// ─── Register Schema ─────────────────────────────────────────
export const registerSchema = z
  .object({
    name: z
      .string({ error: "Nama wajib diisi" })
      .min(2, "Nama minimal 2 karakter")
      .max(50, "Nama maksimal 50 karakter")
      .trim(),

    email: z
      .string({ error: "Email wajib diisi" })
      .email("Format email tidak valid")
      .toLowerCase()
      .trim(),

    password: z
      .string({ error: "Password wajib diisi" })
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus ada minimal 1 huruf kapital")
      .regex(/[0-9]/, "Harus ada minimal 1 angka"),

    confirmPassword: z.string({ error: "Konfirmasi password wajib diisi" }),

    // Opsional — untuk laporan ke orang tua
    parentEmail: z
      .string()
      .email("Format email orang tua tidak valid")
      .toLowerCase()
      .trim()
      .optional()
      .or(z.literal("")),

    agreeToTerms: z.literal(true, {
      error: "Kamu harus menyetujui syarat dan ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Login Schema ─────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),

  password: z
    .string({ error: "Password wajib diisi" })
    .min(1, "Password tidak boleh kosong"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Mood Check-In Schema ─────────────────────────────────────
export const moodCheckInSchema = z.object({
  moodLevel: z
    .number()
    .min(1, "Mood level minimal 1")
    .max(5, "Mood level maksimal 5")
    .int("Mood level harus bilangan bulat"),

  note: z
    .string()
    .max(2000, "Catatan maksimal 2000 karakter")
    .optional()
    .or(z.literal("")),
});

export type MoodCheckInInput = z.infer<typeof moodCheckInSchema>;

// ─── Diary Message Schema ─────────────────────────────────────
export const diaryMessageSchema = z.object({
  messageText: z
    .string({ error: "Pesan tidak boleh kosong" })
    .min(1, "Pesan tidak boleh kosong")
    .max(5000, "Pesan terlalu panjang (maksimal 5000 karakter)")
    .trim(),
});

export type DiaryMessageInput = z.infer<typeof diaryMessageSchema>;

// ─── Profile Update Schema ────────────────────────────────────
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .trim()
    .optional(),

  image: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// ─── Parent Report Settings Schema ────────────────────────────
export const parentReportSchema = z.object({
  parentEmail: z
    .string()
    .email("Format email tidak valid")
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal("")),

  parentReportEnabled: z.boolean().optional(),
});

export type ParentReportInput = z.infer<typeof parentReportSchema>;
