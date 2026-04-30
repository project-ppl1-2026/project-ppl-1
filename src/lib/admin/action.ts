"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin/require-admin";
import { setUserParentEmail } from "@/lib/auth";
import { requestParentConsentEmail } from "@/lib/parent-consent";
import prisma from "@/lib/prisma";

// ── Result type ──────────────────────────────────────────────────
export type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

function fail(error: string): ActionResult {
  return { success: false, error };
}
function ok(message?: string): ActionResult {
  return { success: true, message };
}

// ── Schemas ──────────────────────────────────────────────────────
const createSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(120),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  isPremium: z.boolean().optional().default(false),
  status: z.enum(["Aktif", "Nonaktif"]).optional().default("Aktif"),
});

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  isPremium: z.boolean(),
  status: z.enum(["Aktif", "Nonaktif"]),
});

const linkParentSchema = z.object({
  userId: z.string().min(1),
  parentEmail: z.string().trim().toLowerCase().email("Email tidak valid"),
});

// ── Actions ──────────────────────────────────────────────────────

/**
 * Buat user baru. emailVerified=true supaya saat user login pakai Google
 * dengan email ini, akan otomatis tersambung lewat accountLinking.
 */
export async function createUserAction(
  input: z.infer<typeof createSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = createSchema.safeParse(input);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Payload tidak valid");
    }

    const { name, email, isPremium, status } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return fail("Email sudah terdaftar");

    await prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        emailVerified: true,
        isPremium,
        status,
        role: "user",
        profileFilled: false,
        currentStreak: 0,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return ok(`User ${email} berhasil dibuat`);
  } catch (e) {
    console.error("createUserAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal menambahkan user");
  }
}

/**
 * Edit nama, premium, status. Email tidak bisa diubah.
 */
export async function updateUserAction(
  input: z.infer<typeof updateSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = updateSchema.safeParse(input);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Payload tidak valid");
    }

    const { id, name, isPremium, status } = parsed.data;

    await prisma.user.update({
      where: { id },
      data: { name, isPremium, status },
    });

    revalidatePath("/admin/users");
    return ok("Perubahan disimpan");
  } catch (e) {
    console.error("updateUserAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal menyimpan perubahan");
  }
}

/**
 * Hapus user. Cascade akan menghapus session, account, parent, payments, dll.
 */
export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (admin.id === id) return fail("Tidak bisa menghapus akun sendiri");

    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return ok("User dihapus");
  } catch (e) {
    console.error("deleteUserAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal menghapus user");
  }
}

/**
 * Toggle Aktif ↔ Nonaktif.
 */
export async function toggleStatusAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const current = await prisma.user.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current) return fail("User tidak ditemukan");

    const next = current.status === "Aktif" ? "Nonaktif" : "Aktif";
    await prisma.user.update({ where: { id }, data: { status: next } });

    revalidatePath("/admin/users");
    return ok(`Status diubah ke ${next}`);
  } catch (e) {
    console.error("toggleStatusAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal mengubah status");
  }
}

/**
 * Toggle Premium ↔ Basic.
 */
export async function togglePremiumAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const current = await prisma.user.findUnique({
      where: { id },
      select: { isPremium: true },
    });
    if (!current) return fail("User tidak ditemukan");

    await prisma.user.update({
      where: { id },
      data: { isPremium: !current.isPremium },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return ok(current.isPremium ? "Diturunkan ke Basic" : "Dijadikan Premium");
  } catch (e) {
    console.error("togglePremiumAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal mengubah premium");
  }
}

/**
 * Sambung / kirim ulang akun ortu. Reuse `requestParentConsentEmail` —
 * sama dengan flow di better-auth hook: kirim email konsen + upsert
 * Parent row pending. Endpoint /api/parent/consent (yang sudah ada)
 * akan handle saat ortu klik Setuju/Tolak.
 */
export async function linkParentAction(
  input: z.infer<typeof linkParentSchema>,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const parsed = linkParentSchema.safeParse(input);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message ?? "Email tidak valid");
    }

    const { userId, parentEmail } = parsed.data;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!target) return fail("User tidak ditemukan");

    if (parentEmail === target.email) {
      return fail("Email orang tua tidak boleh sama dengan email user");
    }

    const appUrl =
      process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) return fail("BETTER_AUTH_URL belum dikonfigurasi");

    // Kirim email & upsert Parent row pending (reuse fungsi yang sudah ada)
    await requestParentConsentEmail({
      userId: target.id,
      childName: target.name,
      parentEmail,
      appUrl,
    });

    // Sync user.parentEmail (akan dikosongkan otomatis oleh /api/parent/consent
    // kalau ortu menolak)
    await setUserParentEmail(target.id, parentEmail);

    revalidatePath("/admin/users");
    return ok("Email persetujuan dikirim ke orang tua. Berlaku 3 hari.");
  } catch (e) {
    console.error("linkParentAction:", e);
    return fail(
      e instanceof Error ? e.message : "Gagal mengirim email persetujuan",
    );
  }
}

/**
 * Putus sambungan ortu. Hapus Parent row + clear user.parentEmail.
 */
export async function unlinkParentAction(
  userId: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();

    await prisma.parent.deleteMany({ where: { userId } });
    await setUserParentEmail(userId, null);

    revalidatePath("/admin/users");
    return ok("Sambungan ortu dihapus");
  } catch (e) {
    console.error("unlinkParentAction:", e);
    return fail(e instanceof Error ? e.message : "Gagal memutus sambungan");
  }
}
