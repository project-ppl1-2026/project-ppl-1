"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ProfileSectionNoticeProps {
  children: ReactNode;
}

export function ProfileSectionNotice({ children }: ProfileSectionNoticeProps) {
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}
