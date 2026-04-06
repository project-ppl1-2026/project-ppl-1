"use client";

type FaceProps = {
  active: boolean;
};

export function FaceVerySad({ active }: FaceProps) {
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <circle
        cx={26}
        cy={26}
        r={24}
        fill={active ? "rgba(239, 68, 68, 0.10)" : "var(--card)"}
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={2}
      />
      <path
        d="M17 20 Q19 18 21 20"
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M31 20 Q33 18 35 20"
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {active && (
        <>
          <ellipse
            cx={18}
            cy={24}
            rx={1.5}
            ry={2.5}
            fill="#93C5FD"
            opacity={0.7}
          />
          <ellipse
            cx={34}
            cy={24}
            rx={1.5}
            ry={2.5}
            fill="#93C5FD"
            opacity={0.7}
          />
        </>
      )}

      <path
        d="M17 35 Q26 27 35 35"
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 16 L20 19"
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M37 16 L32 19"
        stroke={active ? "#EF4444" : "var(--brand-text-muted)"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FaceSad({ active }: FaceProps) {
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <circle
        cx={26}
        cy={26}
        r={24}
        fill={active ? "rgba(249, 115, 22, 0.10)" : "var(--card)"}
        stroke={active ? "#F97316" : "var(--brand-text-muted)"}
        strokeWidth={2}
      />
      <circle
        cx={19}
        cy={21}
        r={2.5}
        fill={active ? "#F97316" : "var(--brand-text-muted)"}
      />
      <circle
        cx={33}
        cy={21}
        r={2.5}
        fill={active ? "#F97316" : "var(--brand-text-muted)"}
      />
      <path
        d="M18 34 Q26 29 34 34"
        stroke={active ? "#F97316" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 18 L21 20"
        stroke={active ? "#F97316" : "var(--brand-text-muted)"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M36 18 L31 20"
        stroke={active ? "#F97316" : "var(--brand-text-muted)"}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FaceNeutral({ active }: FaceProps) {
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <circle
        cx={26}
        cy={26}
        r={24}
        fill={active ? "rgba(234, 179, 8, 0.10)" : "var(--card)"}
        stroke={active ? "#EAB308" : "var(--brand-text-muted)"}
        strokeWidth={2}
      />
      <circle
        cx={19}
        cy={21}
        r={2.5}
        fill={active ? "#EAB308" : "var(--brand-text-muted)"}
      />
      <circle
        cx={33}
        cy={21}
        r={2.5}
        fill={active ? "#EAB308" : "var(--brand-text-muted)"}
      />
      <path
        d="M19 33 L33 33"
        stroke={active ? "#EAB308" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FaceHappy({ active }: FaceProps) {
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <circle
        cx={26}
        cy={26}
        r={24}
        fill={active ? "rgba(34, 197, 94, 0.10)" : "var(--card)"}
        stroke={active ? "#22C55E" : "var(--brand-text-muted)"}
        strokeWidth={2}
      />
      <path
        d="M17 22 Q19 19 21 22"
        stroke={active ? "#22C55E" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M31 22 Q33 19 35 22"
        stroke={active ? "#22C55E" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 30 Q26 38 35 30"
        stroke={active ? "#22C55E" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />

      {active && (
        <>
          <ellipse
            cx={14}
            cy={30}
            rx={4}
            ry={2.5}
            fill="#22C55E"
            opacity={0.18}
          />
          <ellipse
            cx={38}
            cy={30}
            rx={4}
            ry={2.5}
            fill="#22C55E"
            opacity={0.18}
          />
        </>
      )}
    </svg>
  );
}

export function FaceVeryHappy({ active }: FaceProps) {
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <circle
        cx={26}
        cy={26}
        r={24}
        fill={active ? "rgba(16, 185, 129, 0.10)" : "var(--card)"}
        stroke={active ? "#10B981" : "var(--brand-text-muted)"}
        strokeWidth={2}
      />
      <path
        d="M17 22 Q19 19 21 22"
        stroke={active ? "#10B981" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M31 22 Q33 19 35 22"
        stroke={active ? "#10B981" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx={19}
        cy={20.5}
        r={1.5}
        fill={active ? "#10B981" : "var(--brand-text-muted)"}
        opacity={0.5}
      />
      <circle
        cx={33}
        cy={20.5}
        r={1.5}
        fill={active ? "#10B981" : "var(--brand-text-muted)"}
        opacity={0.5}
      />
      <path
        d="M15 30 Q26 42 37 30"
        stroke={active ? "#10B981" : "var(--brand-text-muted)"}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 30 Q26 40 37 30 Q30 38 22 38 Z"
        fill="#10B981"
        opacity={active ? 0.12 : 0.06}
      />

      {active && (
        <>
          <path
            d="M8 12 L9 15 L12 16 L9 17 L8 20 L7 17 L4 16 L7 15 Z"
            fill="#10B981"
            opacity={0.6}
          />
          <path
            d="M42 10 L43 12 L45 13 L43 14 L42 16 L41 14 L39 13 L41 12 Z"
            fill="#10B981"
            opacity={0.5}
          />
        </>
      )}

      <ellipse cx={12} cy={31} rx={5} ry={3} fill="#10B981" opacity={0.15} />
      <ellipse cx={40} cy={31} rx={5} ry={3} fill="#10B981" opacity={0.15} />
    </svg>
  );
}
