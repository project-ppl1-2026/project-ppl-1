// ============================================================
//  src/features/diary/components/ChatBubble.tsx
// ============================================================

import { colors as C, fonts } from "../constants/tokens";
import type { ChatMessage } from "../types";
import { AiAvatar } from "./AiAvatar";

type Props = {
  message: ChatMessage;
};

export function ChatBubble({ message }: Props) {
  const isAi = message.role === "ai";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAi ? "flex-start" : "flex-end",
        gap: 8,
      }}
    >
      {isAi && <AiAvatar />}

      <div style={{ maxWidth: "72%" }}>
        {isAi && (
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: C.sub,
              margin: "0 0 3px",
            }}
          >
            AI Teman
          </p>
        )}

        <div
          style={{
            padding: "9px 13px",
            borderRadius: 14,
            background: isAi
              ? C.white
              : `linear-gradient(135deg,${C.inkD},${C.inkM})`,
            border: isAi ? `1px solid ${C.bdL}` : "none",
            boxShadow: isAi
              ? "0 1px 4px rgba(0,0,0,0.06)"
              : "0 2px 8px rgba(0,0,0,0.10)",
            borderBottomRightRadius: isAi ? 14 : 4,
            borderBottomLeftRadius: isAi ? 4 : 14,
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.65,
              color: isAi ? C.text : C.white,
              fontFamily: fonts.sans,
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {message.text}
          </div>
        </div>

        <p
          style={{
            fontSize: 9,
            color: C.sub,
            marginTop: 3,
            textAlign: isAi ? "left" : "right",
          }}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}
