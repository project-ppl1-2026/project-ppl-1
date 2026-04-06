"use client";

import type { ReactNode } from "react";

interface ProfileReadonlyFieldProps {
  label: string;
  value: ReactNode;
  extra?: ReactNode;
}

export function ProfileReadonlyField({
  label,
  value,
  extra,
}: ProfileReadonlyFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-500">
        {label}
      </label>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-gray-900">
        <span>{value}</span>
        {extra}
      </div>
    </div>
  );
}
