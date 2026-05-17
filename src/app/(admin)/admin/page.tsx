import prisma from "@/lib/prisma";
import { OverviewPage } from "@/components/admin/OverviewPage";

export default async function AdminPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    premiumUsers,
    activeUsers,
    nonActiveUsers,
    totalQuestionsActive,
    newUsersThisMonth,
    quizLogCount,
    segmentCountsRaw,
  ] = await Promise.all([
    prisma.user.count({ where: { role: { not: "admin" } } }),
    prisma.user.count({ where: { role: { not: "admin" }, isPremium: true } }),
    prisma.user.count({ where: { role: { not: "admin" }, status: "Aktif" } }),
    prisma.user.count({
      where: { role: { not: "admin" }, status: "Nonaktif" },
    }),
    prisma.quizQuestion.count({ where: { isActive: true } }),
    prisma.user.count({
      where: { role: { not: "admin" }, createdAt: { gte: startOfMonth } },
    }),
    prisma.quizLog.count(),
    prisma.quizQuestion.groupBy({
      by: ["ageSegment"],
      where: { isActive: true },
      _count: { _all: true },
    }),
  ]);

  const segmentCounts = segmentCountsRaw.map((item) => ({
    segment: item.ageSegment,
    count: item._count._all,
  }));

  return (
    <OverviewPage
      stats={{
        totalUsers,
        premiumUsers,
        activeUsers,
        nonActiveUsers,
        totalQuestionsActive,
        newUsersThisMonth,
        quizLogCount,
        segmentCounts,
      }}
    />
  );
}
