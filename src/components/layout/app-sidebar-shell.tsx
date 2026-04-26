"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  NotebookPen,
  X,
  Lock,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

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

function UserAvatar({
  user,
  size = 44,
  roundedClass = "rounded-full",
}: {
  user: ShellUser;
  size?: number;
  roundedClass?: string;
}) {
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const imageSrc =
    typeof user.image === "string" && user.image.trim() !== ""
      ? user.image
      : null;

  return (
    <div
      className={`overflow-hidden border ${roundedClass}`}
      style={{
        width: size,
        height: size,
        borderColor: "var(--tt-dashboard-card-border)",
        background: "var(--tt-dashboard-card-bg)",
        flexShrink: 0,
      }}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={user.name}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          width={size}
          height={size}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-sm font-extrabold"
          style={{
            background: "var(--tt-dashboard-brand-soft)",
            color: "var(--tt-dashboard-text)",
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

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
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{
          background: active ? "rgba(255,255,255,0.14)" : "transparent",
        }}
      >
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

function SidebarProfileCard({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: ShellUser;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[1.1rem] border bg-white/92 p-3.5"
      style={{
        borderColor: "var(--tt-dashboard-card-border)",
        boxShadow: "0 8px 18px rgba(26,150,136,0.08)",
      }}
    >
      <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-3">
        <UserAvatar user={user} size={46} />

        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[13px] font-extrabold"
            style={{ color: "var(--tt-dashboard-text)" }}
          >
            {user.name}
          </p>
          <p
            className="mt-0.5 truncate text-[11px]"
            style={{ color: "var(--tt-dashboard-text-2)" }}
          >
            {user.email}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => {
          void onLogout();
        }}
        disabled={isLoggingOut}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          color: "#FF4D4F",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#FFF1F0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
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
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/25 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex w-[88px] flex-col border-r px-3 py-4 shadow-xl backdrop-blur-md transition-transform duration-300 lg:hidden ${
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

        <nav className="mt-2 flex flex-col gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/home" && pathname.startsWith(item.href));

            const isLocked = item.href === "/insight" && !user.isPremium;

            return (
              <Link
                key={item.href}
                href={isLocked ? "/subscription" : item.href}
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
                  opacity: isLocked ? 0.8 : 1,
                }}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <item.icon size={18} />
                {isLocked && (
                  <Lock
                    size={10}
                    className="absolute right-1 top-1 opacity-70"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className="mt-auto border-t pt-4"
          style={{ borderColor: "var(--tt-dashboard-shell-border)" }}
        >
          <Link
            href="/profile"
            onClick={onClose}
            className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl transition-all"
            style={{
              background: "var(--tt-dashboard-chip-bg)",
            }}
            title="Profile"
            aria-label="Profile"
          >
            <UserAvatar user={user} size={48} roundedClass="rounded-xl" />
          </Link>

          <button
            type="button"
            onClick={() => {
              void onLogout();
            }}
            disabled={isLoggingOut}
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              background: "#FEE2E2",
              color: "#DC2626",
            }}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppSidebarShell({ user, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPremium, setIsPremium] = useState(Boolean(user.isPremium));

  const shellUser = useMemo(
    () => ({
      ...user,
      isPremium,
    }),
    [isPremium, user],
  );

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

  const activeLabel = useMemo(() => {
    const active = navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/home" && pathname.startsWith(item.href)),
    );
    return active?.label ?? "Dashboard";
  }, [pathname]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      setMobileOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tt-dashboard-page-bg)] p-2 lg:h-[100dvh] lg:overflow-hidden">
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={shellUser}
        pathname={pathname}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <div
        className="mx-auto min-h-[calc(100vh-16px)] max-w-[1360px] overflow-hidden rounded-[1.5rem] border lg:h-[calc(100dvh-16px)] lg:min-h-0"
        style={{
          background: "var(--tt-dashboard-page-bg)",
          borderColor: "var(--tt-dashboard-shell-border)",
          boxShadow: "var(--tt-dashboard-shell-shadow)",
        }}
      >
        <div className="grid min-h-[calc(100vh-16px)] lg:grid-cols-[232px_minmax(0,1fr)] lg:h-full lg:min-h-0">
          <aside
            className="hidden border-r lg:flex lg:flex-col"
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

              <div
                className="mt-3 border-t px-3 pb-3 pt-3"
                style={{ borderColor: "var(--tt-dashboard-shell-border)" }}
              >
                <SidebarProfileCard
                  user={shellUser}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col bg-[var(--tt-dashboard-page-bg)] lg:h-full lg:min-h-0">
            <div
              className="relative z-[60] border-b bg-white/80 px-4 py-3 backdrop-blur-sm lg:hidden"
              style={{ borderColor: "var(--tt-dashboard-shell-border)" }}
            >
              <div className="flex min-h-[56px] items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="relative z-[70] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "var(--tt-dashboard-chip-bg)",
                      color: "var(--tt-dashboard-text)",
                    }}
                    aria-label="Buka menu"
                  >
                    <Menu size={18} />
                  </button>

                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.14em] leading-none"
                      style={{ color: "var(--tt-dashboard-text-3)" }}
                    >
                      TEMANTUMBUH
                    </p>
                    <h2
                      className="mt-1 truncate text-base font-extrabold leading-tight"
                      style={{ color: "var(--tt-dashboard-text)" }}
                    >
                      Hai, {shellUser.name}
                    </h2>
                    <p
                      className="mt-0.5 text-[11px] leading-none"
                      style={{ color: "var(--tt-dashboard-text-2)" }}
                    >
                      {activeLabel}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full"
                    aria-label="Profile"
                    title="Profile"
                  >
                    <UserAvatar user={shellUser} size={44} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      void handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="flex h-11 w-11 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      borderColor: "var(--tt-dashboard-card-border)",
                      background: "#FEE2E2",
                      color: "#DC2626",
                    }}
                    aria-label="Logout"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>

            <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
