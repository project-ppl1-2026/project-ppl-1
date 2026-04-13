"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  show: boolean;
  onFinish: () => void;
};

const PHASE_SWITCH = 1500;
const COVER_START = 1850;
const COVER_DURATION = 2000;
const OPEN_HOLD = 1200;
const EXIT_AT = COVER_START + COVER_DURATION + OPEN_HOLD;

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function DiaryBookIntro({ show, onFinish }: Props) {
  const [shouldExit, setShouldExit] = useState(false);
  const [closedOpacity, setClosedOpacity] = useState(1);
  const [openOpacity, setOpenOpacity] = useState(0);
  const [coverDeg, setCoverDeg] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [captionText, setCaptionText] = useState("Membuka diary...");
  const [captionSub, setCaptionSub] = useState(
    "siapkan ruang tenang untuk hari ini",
  );

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const captionChangedRef = useRef(false);

  useEffect(() => {
    if (!show) return;

    setShouldExit(false);
    startRef.current = null;
    captionChangedRef.current = false;

    setClosedOpacity(1);
    setOpenOpacity(0);
    setCoverDeg(0);
    setCursorVisible(false);
    setCaptionText("Membuka diary...");
    setCaptionSub("siapkan ruang tenang untuk hari ini");

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      if (elapsed >= PHASE_SWITCH - 160 && elapsed < PHASE_SWITCH + 320) {
        const t = Math.min(1, (elapsed - (PHASE_SWITCH - 160)) / 480);
        const eased = easeOut(t);
        setOpenOpacity(eased);
        setClosedOpacity(1 - eased);
      } else if (elapsed >= PHASE_SWITCH + 320) {
        setOpenOpacity(1);
        setClosedOpacity(0);
      }

      if (elapsed >= COVER_START) {
        const raw = Math.min(1, (elapsed - COVER_START) / COVER_DURATION);
        const eased = easeInOut(raw);
        setCoverDeg(-158 * eased);

        if (raw > 0.62 && !captionChangedRef.current) {
          captionChangedRef.current = true;
          setCaptionText("Diary terbuka");
          setCaptionSub("yuk mulai refleksi hari ini!");
        }
      }

      if (elapsed >= COVER_START + COVER_DURATION + 180) {
        const blink = Math.sin(
          ((elapsed - (COVER_START + COVER_DURATION + 180)) / 560) * Math.PI,
        );
        setCursorVisible(Math.max(0, blink) > 0.5);
      }

      if (elapsed >= EXIT_AT) {
        setShouldExit(true);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [show]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {show && !shouldExit ? (
        <motion.div
          key="book-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "radial-gradient(ellipse 80% 70% at 50% 40%, #0F5651 0%, #0A3A3A 45%, #061F1F 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            overflow: "hidden",
            padding: "clamp(16px, 3vw, 32px)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 55% 40% at 50% 25%, rgba(29,154,141,0.18) 0%, transparent 70%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "clamp(14%, 18%, 20%)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(220px, 52vw, 430px)",
              height: "clamp(28px, 7vw, 54px)",
              borderRadius: 999,
              background: "rgba(0,0,0,0.28)",
              filter: "blur(22px)",
              opacity: 0.45,
            }}
          />

          <div
            style={{
              perspective: 2200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              maxWidth: 700,
              height: "min(52vw, 390px)",
              minHeight: 230,
            }}
          >
            {/* CLOSED BOOK */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: closedOpacity, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                width: "clamp(170px, 38vw, 270px)",
                aspectRatio: "270 / 344",
                borderRadius:
                  "clamp(6px, 1vw, 8px) clamp(12px, 2vw, 18px) clamp(12px, 2vw, 18px) clamp(6px, 1vw, 8px)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius:
                    "clamp(6px, 1vw, 8px) clamp(12px, 2vw, 18px) clamp(12px, 2vw, 18px) clamp(6px, 1vw, 8px)",
                  background:
                    "linear-gradient(150deg, #1D9A8D 0%, #166C67 40%, #0C4747 80%, #072E2E 100%)",
                  overflow: "hidden",
                  boxShadow:
                    "6px 6px 32px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}
              >
                <Grain />
                <Shimmer />

                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "clamp(12px, 2.8vw, 18px)",
                    background:
                      "linear-gradient(90deg,#051E1E 0%,#083030 100%)",
                    borderRadius:
                      "clamp(6px, 1vw, 8px) 0 0 clamp(6px, 1vw, 8px)",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: "clamp(12px, 3vw, 20px)",
                    border: "1px solid rgba(100,220,200,0.24)",
                    borderRadius: "clamp(6px, 1.4vw, 8px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "clamp(18px, 4vw, 26px)",
                    border: "0.5px solid rgba(100,220,200,0.12)",
                    borderRadius: "clamp(4px, 1vw, 6px)",
                  }}
                />

                <ClosedCoverContent />
              </div>

              <div
                style={{
                  position: "absolute",
                  right: "clamp(-8px, -1.2vw, -10px)",
                  top: "clamp(9px, 2vw, 14px)",
                  bottom: "clamp(9px, 2vw, 14px)",
                  width: "clamp(8px, 1.8vw, 12px)",
                  borderRadius: 4,
                  background: "linear-gradient(90deg,#D6C89A 0%,#C8B882 100%)",
                  boxShadow:
                    "2px 0 8px rgba(0,0,0,0.3), inset 0 0 0 0.5px rgba(120,90,30,0.25)",
                }}
              />
            </motion.div>

            {/* OPEN BOOK */}
            <div
              style={{
                position: "absolute",
                width: "clamp(300px, 82vw, 560px)",
                aspectRatio: "560 / 340",
                transformStyle: "preserve-3d",
                display: "flex",
                alignItems: "stretch",
                opacity: openOpacity,
                transition: "opacity 0.4s ease",
              }}
            >
              <OpenPage side="left">
                <PageLabel>Kemarin</PageLabel>
                <RuledLines />
                {[
                  { top: "17.6%", width: "66%" },
                  { top: "24.7%", width: "80%" },
                  { top: "31.8%", width: "58%" },
                  { top: "38.8%", width: "75%" },
                  { top: "45.9%", width: "61%" },
                  { top: "52.9%", width: "84%" },
                  { top: "60%", width: "48%" },
                ].map(({ top, width }, i) => (
                  <FakeText key={i} top={top} left="10%" width={width} />
                ))}
              </OpenPage>

              <OpenPage side="right">
                <PageLabel right>Hari ini</PageLabel>
                <RuledLines right />
                {[
                  { top: "17.6%", width: "70%" },
                  { top: "24.7%", width: "60%" },
                  { top: "31.8%", width: "82%" },
                ].map(({ top, width }, i) => (
                  <FakeText key={i} top={top} left="7.2%" width={width} />
                ))}

                <div
                  style={{
                    position: "absolute",
                    top: "31.8%",
                    left: "calc(7.2% + 82% + 4px)",
                    width: 2,
                    height: "4.2%",
                    minHeight: 8,
                    maxHeight: 14,
                    background: "#1D9A8D",
                    borderRadius: 1,
                    opacity: cursorVisible ? 1 : 0,
                    transition: "opacity 0.12s",
                  }}
                />
              </OpenPage>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "clamp(16px, 4vw, 28px)",
                  transform: "translateX(-50%)",
                  background:
                    "linear-gradient(90deg,#B89050 0%,#D4AA6A 30%,#C89848 60%,#A07838 100%)",
                  boxShadow:
                    "inset 0 0 8px rgba(0,0,0,0.12), inset 1px 0 0 rgba(255,255,255,0.18)",
                  zIndex: 5,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "clamp(36px, 9vw, 64px)",
                  transform: "translateX(-50%)",
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 72%)",
                  pointerEvents: "none",
                  zIndex: 6,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: "50%",
                  height: "100%",
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${coverDeg}deg)`,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    borderRadius:
                      "0 clamp(12px, 2vw, 18px) clamp(12px, 2vw, 18px) 0",
                    background:
                      "linear-gradient(150deg,#1D9A8D 0%,#166C67 40%,#0C4747 80%,#072E2E 100%)",
                    overflow: "hidden",
                    boxShadow:
                      "4px 0 24px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <Grain />
                  <Shimmer />
                  <div
                    style={{
                      position: "absolute",
                      inset: "clamp(12px, 3vw, 20px)",
                      border: "1px solid rgba(100,220,200,0.18)",
                      borderRadius: "clamp(6px, 1.4vw, 8px)",
                    }}
                  />
                  <MinimalFlapContent />
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderRadius:
                      "0 clamp(12px, 2vw, 18px) clamp(12px, 2vw, 18px) 0",
                    background:
                      "linear-gradient(160deg,#FDF6E0 0%,#EDD9B2 100%)",
                    boxShadow: "inset 8px 0 18px rgba(0,0,0,0.07)",
                  }}
                />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              position: "absolute",
              bottom: "clamp(18px, 4vw, 26px)",
              textAlign: "center",
              paddingInline: 16,
              maxWidth: "92vw",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(12px, 2.8vw, 13px)",
                fontWeight: 700,
                color: "rgba(160,230,215,0.85)",
                letterSpacing: 0.3,
                transition: "opacity 0.4s",
              }}
            >
              {captionText}
            </p>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "clamp(10px, 2.5vw, 11px)",
                fontStyle: "italic",
                color: "rgba(120,190,175,0.55)",
                lineHeight: 1.5,
              }}
            >
              {captionSub}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Grain() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(-50deg,transparent 0px,transparent 2px,rgba(255,255,255,0.022) 2px,rgba(255,255,255,0.022) 3px)",
      }}
    />
  );
}

function Shimmer() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(160deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.03) 35%,transparent 65%)",
      }}
    />
  );
}

function ClosedCoverContent() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(18px, 5vw, 36px) clamp(16px, 4vw, 28px)",
        textAlign: "center",
        color: "#C8F5EE",
      }}
    >
      <div
        style={{
          width: "clamp(26px, 8vw, 40px)",
          height: 1,
          background: "rgba(120,220,200,0.5)",
          margin: "0 auto 12px",
        }}
      />
      <p
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          fontSize: "clamp(8px, 2vw, 10px)",
          fontWeight: 700,
          letterSpacing: "clamp(1.5px, 0.6vw, 3px)",
          textTransform: "uppercase",
          color: "rgba(160,235,220,0.65)",
          marginBottom: 10,
        }}
      >
        Safe Diary
      </p>
      <h1
        style={{
          margin: 0,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(22px, 5.5vw, 34px)",
          fontWeight: 900,
          lineHeight: 1.08,
          color: "#E8FBF8",
          textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          marginBottom: 10,
        }}
      >
        Teman
        <br />
        Tumbuh
      </h1>
      <div
        style={{
          width: "clamp(26px, 8vw, 40px)",
          height: 1,
          background: "rgba(120,220,200,0.5)",
          margin: "0 auto 10px",
        }}
      />
      <p
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          fontSize: "clamp(9px, 2.3vw, 12px)",
          lineHeight: 1.6,
          color: "rgba(190,240,230,0.65)",
        }}
      >
        Ruang refleksi harian
        <br />
        yang tenang &amp; hangat
      </p>
    </div>
  );
}

function MinimalFlapContent() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            width: "clamp(24px, 7vw, 38px)",
            height: 1,
            background: "rgba(120,220,200,0.42)",
            margin: "0 auto 12px",
          }}
        />
        <p
          style={{
            margin: 0,
            fontFamily: "sans-serif",
            fontSize: "clamp(8px, 2vw, 9.5px)",
            fontWeight: 700,
            letterSpacing: "clamp(1.6px, 0.5vw, 2.8px)",
            textTransform: "uppercase",
            color: "rgba(160,235,220,0.58)",
          }}
        >
          Safe Diary
        </p>
        <div
          style={{
            width: "clamp(24px, 7vw, 38px)",
            height: 1,
            background: "rgba(120,220,200,0.42)",
            margin: "12px auto 0",
          }}
        />
      </div>
    </div>
  );
}

function OpenPage({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  const isLeft = side === "left";

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: isLeft
          ? "clamp(12px, 2vw, 18px) 0 0 clamp(12px, 2vw, 18px)"
          : "0 clamp(12px, 2vw, 18px) clamp(12px, 2vw, 18px) 0",
        background: isLeft
          ? "linear-gradient(160deg,#FFFCF3 0%,#F5E8C8 100%)"
          : "linear-gradient(160deg,#FEFBF0 0%,#F2E4C2 100%)",
        boxShadow: isLeft
          ? "-4px 0 20px rgba(0,0,0,0.3)"
          : "4px 0 20px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

function PageLabel({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <p
      style={{
        position: "absolute",
        top: "clamp(10px, 4vw, 20px)",
        left: right ? "7.2%" : "10%",
        margin: 0,
        fontFamily: "sans-serif",
        fontSize: "clamp(7px, 1.8vw, 9px)",
        fontWeight: 700,
        letterSpacing: "clamp(1.4px, 0.5vw, 2.5px)",
        textTransform: "uppercase",
        color: "rgba(130,90,40,0.45)",
      }}
    >
      {children}
    </p>
  );
}

function RuledLines({ right }: { right?: boolean }) {
  const tops = [
    "12.9%",
    "20%",
    "27.1%",
    "34.1%",
    "41.2%",
    "48.2%",
    "55.3%",
    "62.3%",
    "69.4%",
    "76.5%",
    "83.5%",
  ];

  return (
    <>
      {tops.map((top) => (
        <div
          key={top}
          style={{
            position: "absolute",
            left: right ? "7.2%" : "10%",
            right: right ? "10%" : "6.4%",
            top,
            height: 1,
            background: "rgba(140,100,50,0.14)",
          }}
        />
      ))}
    </>
  );
}

function FakeText({
  top,
  left,
  width,
}: {
  top: string;
  left: string;
  width: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height: 2,
        borderRadius: 2,
        background: "rgba(130,95,45,0.2)",
      }}
    />
  );
}
