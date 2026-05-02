"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  CreditCard,
  LayoutDashboard,
  LineChart,
  Menu,
  NotebookPen,
  X,
  Lock,
  LogOut,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type ShellUser = {
  name: string;
  email: string;
  isPremium?: boolean;
  image?: string | null;
};

type Props = {
  user: ShellUser;
  children: React.ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/home", icon: LayoutDashboard },
  { label: "TemanCerita", href: "/diary", icon: NotebookPen },
  { label: "Insight", href: "/insight", icon: LineChart },
  { label: "Subscription", href: "/subscription", icon: CreditCard },
];

function SidebarNavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  locked,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
  locked?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={locked ? "/subscription" : href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-[0.95rem] px-3.5 py-2.5 transition-all"
      style={{
        background: active ? "var(--tt-dashboard-active-bg)" : "transparent",
        color: active
          ? "var(--tt-dashboard-active-text)"
          : "var(--tt-dashboard-text)",
        boxShadow: active ? "0 8px 18px rgba(26,150,136,0.14)" : "none",
      }}
      aria-current={active ? "page" : undefined}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg">
        <Icon size={16} />
      </div>
      <span className="text-[13px] font-bold">{label}</span>

      {locked && (
        <Lock
          size={14}
          className="opacity-70"
          style={{ color: "var(--tt-dashboard-text-2)" }}
        />
      )}
    </Link>
  );
}

function MobileSidebar({
  open,
  onClose,
  user,
  pathname,
  onLogout,
  isLoggingOut,
}: {
  open: boolean;
  onClose: () => void;
  user: ShellUser;
  pathname: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const userImageSrc =
    typeof user.image === "string" && user.image.trim() !== ""
      ? user.image
      : null;

  const userInitials = user.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-black/25 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex w-[260px] flex-col border-r px-3 py-4 shadow-xl backdrop-blur-md transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          borderColor: "var(--tt-dashboard-shell-border)",
          background:
            "linear-gradient(180deg, rgba(246,250,249,0.98) 0%, rgba(241,247,246,0.98) 100%)",
        }}
      >
        {/* Header: brand + close */}
        <div className="mb-4 flex items-center justify-between px-1">
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
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "var(--tt-dashboard-chip-bg)",
              color: "var(--tt-dashboard-text)",
            }}
            aria-label="Tutup menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile card + Logout button (side by side) */}
        <div className="mb-3 flex items-stretch gap-2">
          {/* Profile card — clickable, navigates straight to /profile */}
          <Link
            href="/profile"
            onClick={onClose}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-3 py-3 transition-all hover:shadow-md"
            style={{
              background: "var(--tt-dashboard-card-bg)",
              borderColor: "var(--tt-dashboard-card-border)",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-[12px] font-black text-white"
              style={{ background: "var(--tt-dashboard-brand)" }}
            >
              {userImageSrc ? (
                <Image
                  src={userImageSrc}
                  alt={user.name ?? "avatar"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[13px] font-bold"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                {user.name ?? "Pengguna"}
              </p>
              <p
                className="truncate text-[11px]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                {user.email ?? ""}
              </p>
            </div>
          </Link>

          {/* Logout — icon only, beside profile */}
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex w-12 shrink-0 items-center justify-center rounded-2xl transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{ color: "#DC2626" }}
            aria-label="Keluar"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/home" && pathname.startsWith(item.href));

              const isLocked = item.href === "/insight" && !user.isPremium;

              return (
                <SidebarNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                  locked={isLocked}
                  onClick={onClose}
                />
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

export function AppSidebarShell({ user, children }: Props) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(Boolean(user.isPremium));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const shellUser = useMemo(() => ({ ...user, isPremium }), [isPremium, user]);

  const refreshPremiumStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription/status", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { isPremium?: boolean };
      setIsPremium(Boolean(data.isPremium));
    } catch (error) {
      console.error("Premium status refresh failed:", error);
    }
  }, []);

  useEffect(() => {
    setIsPremium(Boolean(user.isPremium));
  }, [user.isPremium]);

  useEffect(() => {
    void refreshPremiumStatus();
  }, [pathname, refreshPremiumStatus]);

  useEffect(() => {
    if (!pathname.startsWith("/subscription")) return;
    const intervalId = window.setInterval(() => {
      void refreshPremiumStatus();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [pathname, refreshPremiumStatus]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      setMobileOpen(false);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login";
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // For mobile collapsed bar avatar
  const userImageSrc =
    typeof shellUser.image === "string" && shellUser.image.trim() !== ""
      ? shellUser.image
      : null;

  const userInitials = shellUser.name
    ? shellUser.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    /* Fullscreen — zero padding, no wrapper card */
    <div className="h-[100dvh] w-full overflow-hidden bg-[var(--tt-dashboard-page-bg)]">
      {/* Mobile slide-out nav */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={shellUser}
        pathname={pathname}
        onLogout={() => void handleLogout()}
        isLoggingOut={isLoggingOut}
      />

      <div className="flex h-full w-full">
        {/* ── Desktop Sidebar ── */}
        <aside
          className="hidden shrink-0 border-r lg:flex lg:flex-col"
          style={{
            width: 232,
            background: "var(--tt-dashboard-sidebar-bg)",
            borderColor: "var(--tt-dashboard-shell-border)",
          }}
        >
          {/* Brand */}
          <div className="px-4 pb-3 pt-5">
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

          {/* Nav */}
          <nav className="mt-2 flex-1 px-3">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/home" && pathname.startsWith(item.href));
                const isLocked = item.href === "/insight" && !isPremium;

                return (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={active}
                    locked={isLocked}
                  />
                );
              })}
            </div>
          </nav>
        </aside>

        {/* ── Content area ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile hamburger bar — left: hamburger + brand, right: avatar + logout */}
          <div
            className="flex shrink-0 items-center gap-3 border-b px-4 py-3 lg:hidden"
            style={{
              borderColor: "var(--tt-dashboard-shell-border)",
              background: "var(--tt-dashboard-page-bg)",
            }}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "var(--tt-dashboard-chip-bg)",
                color: "var(--tt-dashboard-text)",
              }}
              aria-label="Buka menu"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <p
                className="text-[9px] font-extrabold uppercase tracking-[0.14em]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                TEMANTUMBUH
              </p>
            </div>

            {/* Right: avatar (-> /profile) + logout (icon only) */}
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-[11px] font-black text-white"
                style={{ background: "var(--tt-dashboard-brand)" }}
                aria-label="Profil"
                title="Profil"
              >
                {userImageSrc ? (
                  <Image
                    src={userImageSrc}
                    alt={shellUser.name ?? "avatar"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  userInitials
                )}
              </Link>

              <button
                type="button"
                onClick={() => void handleLogout()}
                disabled={isLoggingOut}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: "#DC2626" }}
                aria-label="Keluar"
                title="Keluar"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          {/* Page content */}
          <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
