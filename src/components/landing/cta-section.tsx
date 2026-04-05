import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FloatingBubble } from "./landing-primitives";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-teal-600 py-24">
      {/* White floating bubbles */}
      <FloatingBubble
        size={600}
        top="8%"
        left="6%"
        color="white"
        opacity={0.06}
      />
      <FloatingBubble
        size={400}
        bottom="10%"
        right="6%"
        color="white"
        opacity={0.05}
      />
      <FloatingBubble
        size={200}
        top="20%"
        right="20%"
        color="white"
        opacity={0.04}
      />

      <div className="relative z-10 mx-auto max-w-3xl space-y-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wider text-white">
          MULAI SEKARANG
        </div>

        <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          Siap Mulai Perjalananmu?
        </h2>

        <p className="text-base text-white/85 md:text-lg">
          Bergabung dengan 10.000+ remaja yang sudah merasakan manfaatnya.
          Gratis selamanya untuk fitur dasar.
        </p>

        <Link href="/register">
          <button className="mx-auto flex h-14 items-center gap-3 rounded-xl bg-white px-10 text-base font-bold text-teal-600 shadow-[0px_8px_32px_rgba(0,0,0,0.2)] transition-all hover:scale-105">
            Mulai Diary Sekarang <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </section>
  );
}
