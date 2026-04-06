"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const FACES = [
  {
    id: 1,
    label: "Sangat Sedih",
    color: "#1a9688",
    img: "/img/FaceVerySad.png",
    activeImg: "/img/VerySadActive.png",
  },
  {
    id: 2,
    label: "Sedih",
    color: "#1a9688",
    img: "/img/FaceSad.png",
    activeImg: "/img/SadActive.png",
  },
  {
    id: 3,
    label: "Biasa Aja",
    color: "#1a9688",
    img: "/img/FaceNeutral.png",
    activeImg: "/img/NeutralActive.png",
  },
  {
    id: 4,
    label: "Senang",
    color: "#1a9688",
    img: "/img/FaceHappy.png",
    activeImg: "/img/HappyActive.png",
  },
  {
    id: 5,
    label: "Sangat Senang",
    color: "#1a9688",
    img: "/img/FaceVeryHappy.png",
    activeImg: "/img/VeryHappyActive.png",
  },
];

export function MoodCheckin({
  userName: initialUserName = "[Username]",
}: {
  userName?: string;
}) {
  const [userName, setUserName] = useState(initialUserName);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };
    void fetchUser();
  }, []);

  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const wordCount = note.trim() === "" ? 0 : note.trim().split(/\s+/).length;
  const isOverWords = wordCount > 100;

  // Evaluate Streak On Mount
  useEffect(() => {
    const evaluateStreak = async () => {
      try {
        await fetch("/api/mood/streak", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }),
        });
      } catch (error) {
        console.error("Failed to evaluate streak:", error);
      }
    };
    evaluateStreak();
  }, []);

  // Submit Mutation (TanStack Query)
  const submitMutation = useMutation({
    mutationFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodScore, note, timezone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.message || "Something went wrong",
        };
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(
        `Mood berhasil disubmit! Streak kamu: ${data.currentStreak || "aktif"}`,
      );
      setMoodScore(null);
      setNote("");
    },
    onError: (error: { status?: number; message?: string }) => {
      if (error?.status === 409) {
        toast.error("Kamu sudah mengisi mood check-in hari ini.");
      } else {
        toast.error("Gagal mengirim mood. Silakan coba lagi.");
      }
    },
  });

  const handleSave = () => {
    if (moodScore !== null && !isOverWords) {
      submitMutation.mutate();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{
        backgroundColor: "var(--about-bg-section)",
      }}
    >
      {/* Background decorations - simplified without gradients */}
      <div
        className="absolute rounded-full pointer-events-none opacity-50"
        style={{
          width: 500,
          height: 500,
          left: "-12%",
          top: "-15%",
          border: "2px solid var(--about-light-teal)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-20"
        style={{
          width: 300,
          height: 300,
          left: "75%",
          top: "65%",
          border: "2px solid var(--brand-primary)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none opacity-10"
        style={{
          width: 200,
          height: 200,
          left: "80%",
          top: "-5%",
          border: "2px solid var(--about-dark-teal)",
        }}
      />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl space-y-0 my-10">
        {/* Greeting */}
        <div className="text-center mb-10">
          <p className="text-sm font-bold mb-3 uppercase tracking-widest text-[var(--about-text-muted)]">
            Check-in Harian
          </p>
          <h1 className="leading-tight font-extrabold text-[var(--about-dark-teal)] text-3xl sm:text-4xl lg:text-5xl">
            Bagaimana perasaanmu <br /> hari ini,{" "}
            <span className="text-[var(--brand-primary)]">{userName}</span>?
          </h1>
          <p className="text-base mt-4 text-[var(--about-text-muted)] font-medium">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[2rem] p-10 sm:p-12 space-y-10 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl"
          style={{
            boxShadow:
              "0 24px 64px rgba(27,107,107,0.14), 0 0 0 1px rgba(255,255,255,0.6)",
          }}
        >
          {/* Face selector */}
          <div>
            <p className="text-sm font-bold mb-8 text-center uppercase tracking-widest text-[var(--about-text-muted)]">
              Pilih Ekspresi Emosimu
            </p>
            <div className="flex justify-between items-center gap-2 sm:gap-4">
              {FACES.map(({ id, label, color, img, activeImg }) => (
                <button
                  key={id}
                  onClick={() => setMoodScore(id)}
                  className="flex flex-col items-center justify-start gap-2 sm:gap-3 flex-1 py-4 rounded-[1.5rem] transition-all duration-200 group relative"
                  style={{
                    transform: moodScore === id ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <div className="transition-transform duration-200 group-hover:scale-105 h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full flex items-center justify-center relative">
                    <Image
                      src={img}
                      alt={label}
                      fill
                      sizes="(max-width: 640px) 56px, 64px"
                      className={`absolute object-contain transition-opacity duration-200 ${moodScore === id ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
                    />
                    <Image
                      src={activeImg}
                      alt={`${label} Active`}
                      fill
                      sizes="(max-width: 640px) 56px, 64px"
                      className={`absolute object-contain transition-opacity duration-200 ${moodScore === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    />
                  </div>
                  <span
                    className="text-center leading-tight text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                    style={{
                      color:
                        moodScore === id ? color : "var(--about-text-muted)",
                    }}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--brand-border)]" />

          {/* Notes area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-[var(--about-dark-teal)]">
                Catatan singkat (opsional)
              </p>
              <span
                className="text-sm font-medium"
                style={{
                  color: isOverWords ? "#EF4444" : "var(--about-text-muted)",
                }}
              >
                {wordCount} / 100 kata
              </span>
            </div>
            <div className="relative">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ceritakan sedikit tentang harimu... Ada hal yang membuatmu merasa seperti ini?"
                rows={6}
                className="w-full rounded-[1.5rem] px-5 py-5 text-base resize-none outline-none transition-all placeholder:text-[var(--brand-text-muted)] bg-[var(--about-accent-soft)] text-[var(--about-dark-teal)]"
                style={{
                  border: `1.5px solid ${isOverWords ? "#EF4444" : "var(--brand-border)"}`,
                  lineHeight: 1.7,
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = isOverWords
                    ? "#EF4444"
                    : "var(--brand-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = isOverWords
                    ? "#EF4444"
                    : "var(--brand-border)")
                }
              />
              {isOverWords && (
                <p className="text-xs mt-1 text-[#EF4444]">
                  Melebihi batas 100 kata
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSave}
            disabled={
              moodScore === null || isOverWords || submitMutation.isPending
            }
            className="w-full h-16 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300"
            style={{
              backgroundColor:
                moodScore !== null && !isOverWords && !submitMutation.isPending
                  ? "var(--brand-primary)"
                  : "var(--brand-border)",
              color:
                moodScore !== null && !isOverWords && !submitMutation.isPending
                  ? "white"
                  : "var(--about-text-muted)",
              boxShadow:
                moodScore !== null && !isOverWords && !submitMutation.isPending
                  ? "0 12px 36px rgba(27,107,107,0.30)"
                  : "none",
              cursor:
                moodScore !== null && !isOverWords && !submitMutation.isPending
                  ? "pointer"
                  : "not-allowed",
              transform:
                moodScore !== null && !isOverWords && !submitMutation.isPending
                  ? "scale(1)"
                  : "scale(0.98)",
            }}
          >
            {moodScore === null ? (
              "Pilih emosimu terlebih dahulu"
            ) : isOverWords ? (
              "Kurangi jumlah kata"
            ) : submitMutation.isPending ? (
              "Mengirim..."
            ) : (
              <>Kirim</>
            )}
          </button>
        </div>

        {/* Below card hint */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] opacity-60" />
          <p className="text-[13px] font-medium text-[#9CA3AF]">
            Mood check-in membantumu membangun self-awareness dari hari ke hari
          </p>
        </div>
      </div>
    </div>
  );
}
