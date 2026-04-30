import { requireAdmin } from "@/lib/admin/require-admin";
import prisma from "@/lib/prisma";
import { UsersPage } from "@/components/admin/UsersPage";

type UserPageProps = {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: UserPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const search = params.search ?? "";
  const filter = params.filter ?? "all";
  const page = Math.max(1, Number(params.page ?? 1));

  // limit=0 berarti "Semua". Default 10.
  const rawLimit = Number(params.limit ?? 10);
  const limit = Number.isNaN(rawLimit) || rawLimit < 0 ? 10 : rawLimit;

  const where: Record<string, unknown> = { role: { not: "admin" } };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (filter === "premium") where.isPremium = true;
  if (filter === "basic") where.isPremium = false;
  if (filter === "nonaktif") where.status = "Nonaktif";

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        status: true,
        createdAt: true,
        birthYear: true,
        gender: true,
        profileFilled: true,
        currentStreak: true,
        parent: {
          select: { email: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
      // limit=0 → ambil semua (skip .take dan .skip)
      ...(limit > 0 ? { skip: (page - 1) * limit, take: limit } : {}),
    }),
    prisma.user.count({ where }),
  ]);

  // Petakan parent ke field yang diharapkan UsersPage
  const mappedUsers = users.map(({ parent, ...u }) => ({
    ...u,
    parentEmail: parent?.email ?? null,
  }));

  return (
    <UsersPage
      users={mappedUsers}
      total={total}
      page={page}
      limit={limit}
      currentSearch={search}
      currentFilter={filter}
    />
  );
}
