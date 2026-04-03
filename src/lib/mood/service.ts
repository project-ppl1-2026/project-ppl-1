import prisma from "@/lib/prisma";

export function getLocalDateString(date: Date, timeZone: string): string {
  try {
    // 'en-CA' or 'fr-CA' format outputs YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    // fallback if timezone string is invalid, fallback to UTC date
    return date.toISOString().split("T")[0];
  }
}

export function parseDateString(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z"); // Parsing simple YYYY-MM-DD as start of day UTC
}

interface CreateMoodLogData {
  userId: string;
  moodScore: number;
  note?: string;
  timezone: string;
}

export async function createMoodLog(data: CreateMoodLogData) {
  const { userId, moodScore, note, timezone } = data;
  const now = new Date();

  // Tanggal saat ini menurut timezone user (e.g. "2024-03-03")
  const currentDateLocal = getLocalDateString(now, timezone);

  // Buat boundary awal hari dan akhir hari (dalam UTC base)
  // Untuk mempermudah filter, lebih baik kita mengandalkan date-only string manipulation,
  // Tapi prisma butuh objek DateTime atau range.
  // Karena kita simpan 'createdAt' di database (yang berbasis UTC),
  // Untuk mengecek "Apakah ada submission HARI INI sesuai timezone user",
  // Kita cek log terakhir dan bandingkan 'getLocalDateString' nya dengan current hari ini

  const lastLog = await prisma.moodLog.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true },
  });

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  let finalStreak = user.currentStreak;

  if (lastLog) {
    const lastLogDateLocal = getLocalDateString(lastLog.createdAt, timezone);

    if (lastLogDateLocal === currentDateLocal) {
      throw new Error("Kamu sudah mengisi mood check-in hari ini.");
    }

    // Menghitung delta hari tanpa pusing oleh jam (menggunakan midnight UTC ref)
    const currentRef = parseDateString(currentDateLocal);
    const lastRef = parseDateString(lastLogDateLocal);

    const diffTime = currentRef.getTime() - lastRef.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Mengisi di hari yang berurutan
      finalStreak += 1;
    } else if (diffDays > 1) {
      // Bolong lebih dari 1 hari
      finalStreak = 1;
    }
  } else {
    // Log pertama kali seumur hidup
    finalStreak = 1;
  }

  // Gunakan transaction untuk memastikan data integrity
  const [newLog, updatedUser] = await prisma.$transaction([
    prisma.moodLog.create({
      data: {
        userId,
        moodScore,
        note,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { currentStreak: finalStreak },
    }),
  ]);

  return { newLog, updatedUser };
}

export async function getMoodLogs(
  userId: string,
  dateLocalStr?: string,
  timezone?: string,
) {
  // Jika ada request tangggal spesifik "YYYY-MM-DD"
  if (dateLocalStr) {
    // Kita harus mem-filter data yang createdAt-nya kalau diformat jadi dateLocalStr
    // Solusi termudah karena DB kita kecil, ambil semua yang mendekati atau filter langsung.
    // Solusi tepat: Range >= start && < end (besok) - Sayangnya ini butuh math timezone.
    // Supaya akurat tanpa native TZ Prisma extension, ambil semua logs user (krn max 1/hari),
    // lalu filter di memory.
    const logs = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const tzToUse = timezone || "UTC";
    return logs.filter(
      (log) => getLocalDateString(log.createdAt, tzToUse) === dateLocalStr,
    );
  }

  // Berikan semua kalau tanpa tanggal (atau pakai pagination nanti)
  return prisma.moodLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function resetStreakIfMissed(userId: string, timezone: string) {
  const lastLog = await prisma.moodLog.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!lastLog) return;

  const now = new Date();
  const currentDateLocal = getLocalDateString(now, timezone);
  const lastLogDateLocal = getLocalDateString(lastLog.createdAt, timezone);

  const currentRef = parseDateString(currentDateLocal);
  const lastRef = parseDateString(lastLogDateLocal);

  const diffTime = currentRef.getTime() - lastRef.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays > 1) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentStreak: 0 },
    });
  }
}
