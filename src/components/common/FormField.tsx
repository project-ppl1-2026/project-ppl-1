"use client";

// ============================================================
// src/components/common/FormField.tsx
// Wrapper untuk form field dengan label dan error message
// Digunakan di register dan login form
// ============================================================

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

// ─── Input Component ──────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, id, rightElement, className, ...props },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium"
            style={{ color: "#1A1A1A" }}
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              // Base styles
              "w-full px-4 py-3 rounded-xl text-sm transition-all duration-150",
              "bg-white placeholder:text-gray-400",
              // Border
              error
                ? "border-2 border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                : "border border-gray-200 hover:border-gray-300 focus:border-[#1B6B6B] focus:ring-2 focus:ring-[#1B6B6B]/20",
              // Focus
              "focus:outline-none",
              // Right element padding
              rightElement && "pr-11",
              className,
            )}
            style={{ color: "#1A1A1A" }}
            {...props}
          />

          {/* Right element (show/hide password icon, dll.) */}
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            className="text-xs flex items-center gap-1"
            style={{ color: "#EF4444" }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
              <path
                d="M6 4v2.5M6 8h.01"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text (hanya tampil kalau tidak ada error) */}
        {helperText && !error && (
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
FormInput.displayName = "FormInput";

// ─── Submit Button ────────────────────────────────────────────
interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  isLoading,
  loadingText = "Memproses...",
  children,
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled ?? isLoading}
      className={cn(
        "w-full py-3 px-6 rounded-xl font-semibold text-sm text-white",
        "transition-all duration-200 flex items-center justify-center gap-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "hover:opacity-90 active:scale-[0.98]",
        className,
      )}
      style={{ background: "#1B6B6B" }}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// ─── Error Alert ──────────────────────────────────────────────
interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm border animate-fade-in"
      style={{
        background: "#FEF2F2",
        borderColor: "#FECACA",
        color: "#B91C1C",
      }}
      role="alert"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0 mt-0.5"
      >
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" />
        <path
          d="M8 5v3.5M8 10.5h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="hover:opacity-70 transition-opacity"
          aria-label="Tutup pesan error"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2l10 10M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────
interface SuccessScreenProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export function SuccessScreen({
  title,
  description,
  actionLabel,
  onAction,
}: SuccessScreenProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center animate-scale-in">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background: "#EAF6F6" }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="14" cy="14" r="13" stroke="#1B6B6B" strokeWidth="2" />
          <path
            d="M8 14l4 4 8-8"
            stroke="#1B6B6B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold mb-2" style={{ color: "#1A1A1A" }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
        {description}
      </p>

      <SubmitButton type="button" onClick={onAction}>
        {actionLabel}
      </SubmitButton>
    </div>
  );
}
