"use client";

// ============================================================
// src/components/common/PageShell.tsx
// Komponen wrapper untuk halaman yang masih placeholder.
// Menampilkan informasi halaman, status, dan TODO list.
// Hapus komponen ini dan ganti dengan implementasi asli
// saat sprint yang bersangkutan tiba.
// ============================================================

import Link from "next/link";

interface TodoItem {
  label: string;
  tag: "FE" | "BE" | "FE+BE";
  sprint?: number;
}

interface PageShellProps {
  title: string;
  description: string;
  route: string;
  sprint: number;
  icon?: string;
  accentColor?: string;
  todos: TodoItem[];
  backHref?: string;
  backLabel?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const TAG_COLORS = {
  FE: { bg: "#DBEAFE", color: "#1E3A8A" },
  BE: { bg: "#EDE9FE", color: "#5B21B6" },
  "FE+BE": { bg: "#D0EEEE", color: "#1B6B6B" },
};

export function PageShell({
  title,
  description,
  route,
  sprint,
  icon = "📄",
  accentColor = "#1B6B6B",
  todos,
  backHref,
  backLabel = "Kembali",
  isPremium = false,
  isAdmin = false,
}: PageShellProps) {
  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: isAdmin ? "#0F0F1A" : "#F2F5F5" }}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Back link */}
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
            style={{ color: isAdmin ? "#9CA3AF" : "#6B7280" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </Link>
        )}

        {/* Header card */}
        <div className="rounded-2xl p-6" style={{ background: accentColor }}>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {isPremium && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    Premium
                  </span>
                )}
                {isAdmin && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    Admin Only
                  </span>
                )}
              </div>
              <p className="text-sm mt-1 opacity-80 text-white">
                {description}
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="text-xs opacity-60 text-white font-mono">
                  {route}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}
                >
                  Sprint {sprint}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3 border"
          style={{
            background: "#FEF3C7",
            borderColor: "#FDE68A",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="flex-shrink-0"
          >
            <path d="M9 1L1 16h16L9 1z" fill="#F59E0B" opacity="0.2" />
            <path
              d="M9 1L1 16h16L9 1z"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 7v4M9 13h.01"
              stroke="#92400E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-sm" style={{ color: "#92400E" }}>
            <strong>Halaman ini sedang dikembangkan</strong> — akan
            diimplementasikan pada Sprint {sprint}.
          </p>
        </div>

        {/* TODO list */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: isAdmin ? "#1A1A2E" : "white",
            borderColor: isAdmin ? "#2D2D4E" : "#E5E7EB",
          }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: isAdmin ? "#2D2D4E" : "#F3F4F6" }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: isAdmin ? "#E5E7EB" : "#1A1A1A" }}
            >
              Yang harus dikerjakan di Sprint {sprint}
            </h2>
          </div>

          <div
            className="divide-y"
            style={{ borderColor: isAdmin ? "#2D2D4E" : "#F9FAFB" }}
          >
            {todos.map((todo, i) => {
              const tagStyle = TAG_COLORS[todo.tag];
              return (
                <div
                  key={i}
                  className="px-5 py-3.5 flex items-start gap-3"
                  style={{
                    background:
                      i % 2 === 0
                        ? "transparent"
                        : isAdmin
                          ? "rgba(255,255,255,0.02)"
                          : "#FAFAFA",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5"
                    style={{ borderColor: isAdmin ? "#4B5563" : "#D1D5DB" }}
                  />
                  <span
                    className="flex-1 text-sm leading-relaxed"
                    style={{ color: isAdmin ? "#D1D5DB" : "#374151" }}
                  >
                    {todo.label}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {todo.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
