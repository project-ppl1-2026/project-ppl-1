"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  COVER_DURATION,
  COVER_START,
  EXIT_AT,
  PHASE_SWITCH,
  easeInOut,
  easeOut,
  easeOutBack,
} from "./diaryShared";
import {
  BookShadow,
  BreathingGlow,
  Caption,
  FloatingParticles,
  LightBurst,
  SkipHint,
  SparkleBurst,
  StarField,
} from "./Diaryfx";
import { ClosedBook, OpenBook } from "./diary-book-art";

type Props = {
  show: boolean;
  onFinish: () => void;
};

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
  const [bookScale, setBookScale] = useState(0.85);
  const [bookTilt, setBookTilt] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showLightBurst, setShowLightBurst] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const captionChangedRef = useRef(false);
  const skippedRef = useRef(false);
  const sparkleTriggeredRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    stopAnimation();
    setShouldExit(true);
  }, [stopAnimation]);

  // Main animation loop
  useEffect(() => {
    if (!show) return;

    skippedRef.current = false;
    sparkleTriggeredRef.current = false;
    setShouldExit(false);
    startRef.current = null;
    captionChangedRef.current = false;

    setClosedOpacity(1);
    setOpenOpacity(0);
    setCoverDeg(0);
    setCursorVisible(false);
    setBookScale(0.85);
    setBookTilt(0);
    setGlowIntensity(0.5);
    setShowSparkles(false);
    setShowLightBurst(false);
    setCaptionText("Membuka diary...");
    setCaptionSub("siapkan ruang tenang untuk hari ini");

    const animate = (ts: number) => {
      if (skippedRef.current) return;

      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      // Book entrance + idle breathing
      if (elapsed < 1200) {
        const t = Math.min(1, elapsed / 1200);
        setBookScale(0.85 + 0.15 * easeOutBack(t));
      } else {
        const breathe = Math.sin((elapsed - 1200) / 800) * 0.012;
        const tilt = Math.sin((elapsed - 1200) / 1100) * 1.5;
        setBookScale(1 + breathe);
        setBookTilt(tilt);
      }

      // Glow breathing
      setGlowIntensity(0.5 + Math.sin(elapsed / 700) * 0.18);

      // Closed → open swap
      if (elapsed >= PHASE_SWITCH - 160 && elapsed < PHASE_SWITCH + 320) {
        const t = Math.min(1, (elapsed - (PHASE_SWITCH - 160)) / 480);
        const eased = easeOut(t);
        setOpenOpacity(eased);
        setClosedOpacity(1 - eased);
      } else if (elapsed >= PHASE_SWITCH + 320) {
        setOpenOpacity(1);
        setClosedOpacity(0);
      }

      // Cover flip + sparkle trigger + caption swap
      if (elapsed >= COVER_START) {
        const raw = Math.min(1, (elapsed - COVER_START) / COVER_DURATION);
        setCoverDeg(-158 * easeInOut(raw));

        if (raw > 0.45 && !sparkleTriggeredRef.current) {
          sparkleTriggeredRef.current = true;
          setShowLightBurst(true);
          setShowSparkles(true);
        }

        if (raw > 0.62 && !captionChangedRef.current) {
          captionChangedRef.current = true;
          setCaptionText("Diary terbuka");
          setCaptionSub("yuk mulai refleksi hari ini!");
        }
      }

      // Cursor blink
      if (elapsed >= COVER_START + COVER_DURATION + 180) {
        const blink = Math.sin(
          ((elapsed - (COVER_START + COVER_DURATION + 180)) / 560) * Math.PI,
        );
        setCursorVisible(Math.max(0, blink) > 0.5);
      }

      if (elapsed >= EXIT_AT) {
        stopAnimation();
        setShouldExit(true);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => stopAnimation();
  }, [show, stopAnimation]);

  // Skip on keyboard (Escape, Space, Enter)
  useEffect(() => {
    if (!show || shouldExit) return;
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" ||
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "Spacebar"
      ) {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, shouldExit, handleSkip]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {show && !shouldExit ? (
        <motion.div
          key="book-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleSkip}
          role="button"
          tabIndex={0}
          aria-label="Tap di mana saja untuk lewati"
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
            cursor: "pointer",
          }}
        >
          {/* Background FX */}
          <StarField />
          <FloatingParticles />
          <BreathingGlow intensity={glowIntensity} />
          <LightBurst show={showLightBurst} />
          <BookShadow />
          <SkipHint />

          {/* Book stage */}
          <div
            style={{
              perspective: 2400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              maxWidth: 700,
              height: "min(52vw, 390px)",
              minHeight: 230,
              transform: `scale(${bookScale}) rotateZ(${bookTilt}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.06s linear",
              willChange: "transform",
              pointerEvents: "none",
            }}
          >
            <SparkleBurst show={showSparkles} />
            <ClosedBook opacity={closedOpacity} />
            <OpenBook
              opacity={openOpacity}
              coverDeg={coverDeg}
              cursorVisible={cursorVisible}
            />
          </div>

          {/* Caption */}
          <Caption text={captionText} sub={captionSub} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
