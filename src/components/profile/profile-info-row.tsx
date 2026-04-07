"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileInfoRowProps {
  label: string;
  value: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function ProfileInfoRow({
  label,
  value,
  rightSlot,
  className,
}: ProfileInfoRowProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--color-text-brand-primary)" }}
      >
        {label}
      </p>

      <div
        className="flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3"
        style={{
          border: "1px solid var(--color-brand-border)",
          background: "var(--color-page-bg1, #F8FBFD)",
          color: "var(--color-text-brand-primary)",
        }}
      >
        <span className="text-sm">{value}</span>
        {rightSlot}
      </div>
    </div>
  );
}
