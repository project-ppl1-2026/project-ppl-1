import { cn } from "@/lib/utils";

type WaveDividerProps = {
  fill: string;
  className?: string;
};

export function WaveTop({ fill, className }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-px inset-x-0 z-1 leading-none",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-18 w-full"
      >
        <path
          d="M0,0 L1440,0 L1440,28 C1200,60 960,8 720,36 C480,64 240,12 0,40 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function WaveBottom({ fill, className }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -bottom-px inset-x-0 z-1 leading-none",
        className,
      )}
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-18 w-full"
      >
        <path
          d="M0,44 C240,12 480,64 720,36 C960,8 1200,60 1440,28 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
