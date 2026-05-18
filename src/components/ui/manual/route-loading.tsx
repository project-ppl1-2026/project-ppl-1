"use client";

import { usePathname } from "next/navigation";

import { PageLoader } from "@/components/ui/manual/page-loader";

type RouteLoadingVariant =
  | "dashboard"
  | "diary"
  | "insight"
  | "profile"
  | "subscription";

export function RouteLoadingByPath() {
  const pathname = usePathname();
  const variant = getRouteLoadingVariant(pathname);

  return (
    <RouteLoadingShell
      label={getRouteLoadingLabel(variant)}
      variant={variant}
    />
  );
}

export function RouteLoadingShell({
  label = "Memuat halaman...",
  variant = "dashboard",
}: {
  label?: string;
  variant?: RouteLoadingVariant;
}) {
  if (variant === "diary") {
    return <PageLoader message={label} />;
  }

  if (variant === "insight") {
    return (
      <ShellFrame label={label}>
        <InsightSkeleton />
      </ShellFrame>
    );
  }

  if (variant === "subscription") {
    return (
      <ShellFrame label={label}>
        <SubscriptionSkeleton />
      </ShellFrame>
    );
  }

  if (variant === "profile") {
    return (
      <ShellFrame label={label}>
        <ProfileSkeleton />
      </ShellFrame>
    );
  }

  return (
    <ShellFrame label={label}>
      <DashboardSkeleton />
    </ShellFrame>
  );
}

function getRouteLoadingVariant(pathname: string): RouteLoadingVariant {
  if (pathname.startsWith("/diary")) return "diary";
  if (pathname.startsWith("/insight")) return "insight";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/subscription")) return "subscription";
  return "dashboard";
}

function getRouteLoadingLabel(variant: RouteLoadingVariant) {
  if (variant === "diary") return "Memuat diary...";
  if (variant === "insight") return "Memuat insight...";
  if (variant === "profile") return "Memuat profil...";
  if (variant === "subscription") return "Memuat subscription...";
  return "Memuat dashboard...";
}

function ShellFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <main
      className="flex h-full min-h-[100vh] w-full items-center justify-center bg-[var(--tt-dashboard-page-bg)] px-5"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-5xl">
        {children}
        <p className="sr-only">{label}</p>
      </div>
    </main>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[1.15rem] bg-[rgba(255,255,255,0.62)] shadow-sm ${className}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-5 h-5 w-44 animate-pulse rounded-full bg-[rgba(26,150,136,0.16)]" />
      <div className="grid gap-3 xl:grid-cols-[280px_1fr]">
        <SkeletonBlock className="h-[220px]" />
        <div className="grid grid-cols-2 gap-3">
          <SkeletonBlock className="h-[108px]" />
          <SkeletonBlock className="h-[108px]" />
          <SkeletonBlock className="h-[88px]" />
          <SkeletonBlock className="h-[88px]" />
        </div>
      </div>
      <SkeletonBlock className="mt-3 h-[72px]" />
      <SkeletonBlock className="mt-3 h-[300px]" />
    </>
  );
}

function InsightSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="h-4 w-28 animate-pulse rounded-full bg-[rgba(26,150,136,0.16)]" />
          <div className="mt-3 h-8 w-52 animate-pulse rounded-full bg-white/70" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-2xl bg-white/70" />
      </div>
      <SkeletonBlock className="h-[300px]" />
      <SkeletonBlock className="h-[260px]" />
      <SkeletonBlock className="h-[180px]" />
    </div>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <SkeletonBlock className="h-[190px] rounded-[28px]" />
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <SkeletonBlock className="h-[360px] rounded-[28px]" />
        <SkeletonBlock className="h-[420px] rounded-[28px]" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="h-10 w-48 animate-pulse rounded-full bg-white/70" />
      <div className="overflow-hidden rounded-[20px] bg-white shadow-sm">
        <div className="h-16 animate-pulse border-b border-slate-200 bg-slate-50" />
        <div className="space-y-px">
          <div className="h-20 animate-pulse bg-white" />
          <div className="h-20 animate-pulse bg-slate-50/70" />
          <div className="h-20 animate-pulse bg-white" />
          <div className="h-20 animate-pulse bg-slate-50/70" />
        </div>
      </div>
    </div>
  );
}
