import { requireAdmin } from "@/lib/admin/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";
import QueryProvider from "@/components/providers/query-providers";

export const metadata = {
  title: "Admin Panel — TemanTumbuh",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--tt-dashboard-page-bg)" }}
    >
      <QueryProvider>
        <AdminShell adminName={admin.name} adminEmail={admin.email}>
          {children}
        </AdminShell>
      </QueryProvider>
    </div>
  );
}
