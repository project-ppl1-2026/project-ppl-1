// ============================================================
//  src/components/ui/PillBadge.tsx
//  Reusable pill/badge komponen
// ============================================================

import type { ReactNode, CSSProperties } from "react";

type Props = {
  children: ReactNode;
  bg: string;
  color: string;
  border?: string;
  style?: CSSProperties;
  className?: string;
};

export function PillBadge({ children, bg, color, border, style }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 9px",
        borderRadius: 100,
        background: bg,
        border: border ? `1px solid ${border}` : "none",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
