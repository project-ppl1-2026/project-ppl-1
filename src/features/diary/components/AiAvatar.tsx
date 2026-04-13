// ============================================================
//  src/features/diary/components/AiAvatar.tsx
// ============================================================

import { colors as C, fonts } from "../constants/tokens";

export function AiAvatar() {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 9,
        background: `linear-gradient(135deg,${C.inkD},${C.inkM})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 900,
          color: C.white,
          fontFamily: fonts.sans,
        }}
      >
        TT
      </span>
    </div>
  );
}
