"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  LineChart,
  Menu,
  NotebookPen,
  Smile,
  ClipboardList,
  User,
  X,
} from "lucide-react";
import Image from "next/image";

type ShellUser = {
  name: string;
  email: string;
  isPremium?: boolean;
  avatar?: string | null;
};

type Props = {
  user: ShellUser;
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/home", icon: LayoutDashboard },
  { label: "Diary", href: "/diary", icon: NotebookPen },
  { label: "Mood Tracker", href: "/mood", icon: Smile },
  { label: "Baseline", href: "/baseline", icon: ClipboardList },
  { label: "Insight", href: "/insight", icon: LineChart },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Subscription", href: "/subscription", icon: CreditCard },
];

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/25 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex w-[84px] flex-col border-r px-3 py-4 shadow-xl backdrop-blur-md transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          borderColor: "var(--tt-dashboard-shell-border)",
          background:
            "linear-gradient(180deg, rgba(246,250,249,0.98) 0%, rgba(241,247,246,0.98) 100%)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: "var(--tt-dashboard-chip-bg)",
              color: "var(--tt-dashboard-text)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="mt-2 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/home" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-xl transition-all"
                style={{
                  background: active
                    ? "var(--tt-dashboard-active-bg)"
                    : "transparent",
                  color: active
                    ? "var(--tt-dashboard-active-text)"
                    : "var(--tt-dashboard-text)",
                  boxShadow: active
                    ? "0 8px 18px rgba(26,150,136,0.14)"
                    : "none",
                }}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function AppSidebarShell({ user, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = useMemo(() => {
    const active = navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/home" && pathname.startsWith(item.href)),
    );
    return active?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--tt-dashboard-page-bg)] p-2 xl:h-[100dvh] xl:overflow-hidden">
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className="mx-auto min-h-[calc(100vh-16px)] max-w-[1360px] overflow-hidden rounded-[1.5rem] border xl:h-[calc(100dvh-16px)] xl:min-h-0"
        style={{
          background: "var(--tt-dashboard-page-bg)",
          borderColor: "var(--tt-dashboard-shell-border)",
          boxShadow: "var(--tt-dashboard-shell-shadow)",
        }}
      >
        <div className="grid min-h-[calc(100vh-16px)] xl:grid-cols-[220px_minmax(0,1fr)] xl:h-full xl:min-h-0">
          <aside
            className="hidden border-r xl:flex xl:flex-col"
            style={{
              background: "var(--tt-dashboard-sidebar-bg)",
              borderColor: "var(--tt-dashboard-shell-border)",
            }}
          >
            <div className="px-4 pb-3 pt-4">
              <Link href="/home" className="flex items-center gap-3">
                <div>
                  <p
                    className="text-[10px] font-extrabold uppercase tracking-[0.14em]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    TEMANTUMBUH
                  </p>
                  <h2
                    className="text-[15px] font-extrabold leading-none"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    Dashboard
                  </h2>
                </div>
              </Link>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <nav className="px-3">
                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/home" && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-[0.95rem] px-3.5 py-2.5 transition-all"
                        style={{
                          background: active
                            ? "var(--tt-dashboard-active-bg)"
                            : "transparent",
                          color: active
                            ? "var(--tt-dashboard-active-text)"
                            : "var(--tt-dashboard-text)",
                          boxShadow: active
                            ? "0 8px 18px rgba(26,150,136,0.14)"
                            : "none",
                        }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{
                            background: active
                              ? "rgba(255,255,255,0.14)"
                              : "transparent",
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-[13px] font-bold">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div
                className="mt-3 border-t px-3 pb-3 pt-3"
                style={{ borderColor: "var(--tt-dashboard-shell-border)" }}
              >
                <div
                  className="rounded-[1.1rem] border bg-white/92 p-3.5"
                  style={{ borderColor: "var(--tt-dashboard-card-border)" }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: "var(--tt-dashboard-text-3)" }}
                  >
                    Akun aktif
                  </p>
                  <p
                    className="mt-2 text-[13px] font-extrabold"
                    style={{ color: "var(--tt-dashboard-text)" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="truncate text-[11px]"
                    style={{ color: "var(--tt-dashboard-text-2)" }}
                  >
                    {user.email}
                  </p>

                  <div className="mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-black">
                    <span
                      style={{
                        color: user.isPremium
                          ? "var(--tt-dashboard-warning)"
                          : "var(--tt-dashboard-chip-text)",
                        background: user.isPremium
                          ? "var(--tt-dashboard-warning-soft)"
                          : "var(--tt-dashboard-chip-bg)",
                        padding: "4px 9px",
                        borderRadius: "999px",
                      }}
                    >
                      {user.isPremium ? "PREMIUM" : "BASIC"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col bg-[var(--tt-dashboard-page-bg)] xl:h-full xl:min-h-0">
            <div
              className="relative z-[60] border-b bg-white/80 px-4 py-3 xl:hidden"
              style={{ borderColor: "var(--tt-dashboard-shell-border)" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="relative z-[70] flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: "var(--tt-dashboard-chip-bg)",
                      color: "var(--tt-dashboard-text)",
                    }}
                    aria-label="Buka menu"
                  >
                    <Menu size={18} />
                  </button>

                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: "var(--tt-dashboard-text-3)" }}
                    >
                      TEMANTUMBUH
                    </p>
                    <h2
                      className="text-base font-extrabold"
                      style={{ color: "var(--tt-dashboard-text)" }}
                    >
                      Hai, {user.name}
                    </h2>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--tt-dashboard-text-2)" }}
                    >
                      {activeLabel}
                    </p>
                  </div>
                </div>

                {/* DESKTOP: text button | MOBILE/TABLET: avatar */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="hidden rounded-xl px-3 py-2 text-xs font-bold xl:inline-flex"
                    style={{
                      background: "var(--tt-dashboard-chip-bg)",
                      color: "var(--tt-dashboard-text)",
                    }}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/profile"
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border xl:hidden"
                    style={{
                      borderColor: "var(--tt-dashboard-card-border)",
                      background: "var(--tt-dashboard-card)",
                    }}
                    aria-label="Profile"
                    title="Profile"
                  >
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center font-bold"
                        style={{
                          background: "var(--tt-dashboard-brand-soft)",
                          color: "var(--tt-dashboard-text)",
                        }}
                      >
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            <main className="min-w-0 flex-1 overflow-x-hidden xl:min-h-0 xl:overflow-hidden">
              <div className="mx-auto w-full max-w-[980px] xl:h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
