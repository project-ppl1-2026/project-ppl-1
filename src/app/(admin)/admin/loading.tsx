export default function AdminLoading() {
  return (
    <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-4">
      <svg
        width="44"
        height="44"
        viewBox="0 0 36 36"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: "0.8s" }}
      >
        <circle
          cx="18"
          cy="18"
          r="15"
          stroke="var(--color-brand-teal-ghost, #DDF5F2)"
          strokeWidth="3"
        />
        <path
          d="M18 3a15 15 0 0115 15"
          stroke="var(--tt-dashboard-brand, #1A9688)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p
        className="text-[13px] font-semibold tracking-wide"
        style={{ color: "var(--tt-dashboard-text-2, #6B7C93)" }}
      >
        Mengambil Data...
      </p>
    </div>
  );
}
