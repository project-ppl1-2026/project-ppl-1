"use client";

import { CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileStatus = "pending" | "verified" | "expired" | "incomplete";

interface ProfileStatusBadgeProps {
  status: ProfileStatus;
  className?: string;
}

const statusMap = {
  pending: {
    label: "Menunggu Persetujuan",
    icon: Clock3,
    className: "bg-amber-100 text-amber-800",
  },
  verified: {
    label: "Terverifikasi",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-800",
  },
  expired: {
    label: "Kedaluwarsa",
    icon: ShieldAlert,
    className: "bg-red-100 text-red-700",
  },
  incomplete: {
    label: "Profil belum lengkap",
    icon: ShieldAlert,
    className: "bg-amber-100 text-amber-800",
  },
} as const;

export function ProfileStatusBadge({
  status,
  className,
}: ProfileStatusBadgeProps) {
  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}
