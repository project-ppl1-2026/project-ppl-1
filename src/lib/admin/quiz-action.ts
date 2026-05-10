"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";

import { requireAdmin } from "@/lib/admin/require-admin";
import prisma from "@/lib/prisma";
import type { ActionResult } from "@/lib/admin/action";

function fail(error: string): ActionResult {
  return { success: false, error };
}
function ok(message?: string): ActionResult {
  return { success: true, message };
}

const quizSchema = z.object({
  scenario: z.string().trim().min(1, "Skenario wajib diisi"),
  category: z.string().trim().min(1, "Kategori wajib diisi"),
  optionA: z.string().trim().min(1, "Opsi A wajib diisi"),
  optionB: z.string().trim().min(1, "Opsi B wajib diisi"),
  correctOption: z.enum(["A", "B"]),
  explanationCorrect: z.string().trim(),
  explanationIncorrect: z.string().trim(),
  ageSegment: z.enum(["ANAK", "REMAJA", "MAHASISWA", "DEWASA_MUDA"]),
  isActive: z.boolean().default(true),
});

const updateQuizSchema = quizSchema.extend({
  id: z.string().min(1),
});

export async function createQuizQuestionAction(
  input: z.infer<typeof quizSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = quizSchema.safeParse(input);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Payload tidak valid");
    }

    await prisma.quizQuestion.create({
      data: parsed.data,
    });

    revalidatePath("/admin/quiz");
    revalidatePath("/admin");
    return ok("Soal baru berhasil ditambahkan");
  } catch (e) {
    console.error("createQuizQuestionAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal menambahkan soal");
  }
}

export async function updateQuizQuestionAction(
  input: z.infer<typeof updateQuizSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = updateQuizSchema.safeParse(input);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Payload tidak valid");
    }

    const { id, ...data } = parsed.data;

    await prisma.quizQuestion.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/quiz");
    revalidatePath("/admin");
    return ok("Perubahan berhasil disimpan");
  } catch (e) {
    console.error("updateQuizQuestionAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal mengubah soal");
  }
}

export async function deleteQuizQuestionAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.quizQuestion.delete({ where: { id } });

    revalidatePath("/admin/quiz");
    revalidatePath("/admin");
    return ok("Soal berhasil dihapus");
  } catch (e) {
    console.error("deleteQuizQuestionAction:", e);
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return fail(
        "Tidak bisa dihapus: Soal ini sudah pernah dijawab oleh pengguna. Silakan gunakan tombol Nonaktifkan sebagai gantinya.",
      );
    }
    return fail(e instanceof Error ? e.message : "Gagal menghapus soal");
  }
}

export async function toggleQuizQuestionActiveAction(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const current = await prisma.quizQuestion.findUnique({
      where: { id },
      select: { isActive: true },
    });
    if (!current) return fail("Soal tidak ditemukan");

    await prisma.quizQuestion.update({
      where: { id },
      data: { isActive: !current.isActive },
    });

    revalidatePath("/admin/quiz");
    revalidatePath("/admin");
    return ok(current.isActive ? "Soal dinonaktifkan" : "Soal diaktifkan");
  } catch (e) {
    console.error("toggleQuizQuestionActiveAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal mengubah status soal");
  }
}
