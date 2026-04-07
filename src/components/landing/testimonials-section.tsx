import * as React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { FloatingBubble, SectionHeader, WhiteCard } from "./landing-primitives";
import { testimonials } from "./landing-data";

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-teal-50 to-white py-24">
      <FloatingBubble size={400} top="8%" left="50%" opacity={0.08} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="TESTIMONI"
          title="Apa Kata Mereka?"
          description="Pengalaman nyata dari pengguna TemanTumbuh"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <WhiteCard key={i} className="space-y-5 p-6" hover>
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              {/* Quote */}
              <Quote className="h-5 w-5 text-teal-600/40" />
              <p className="text-sm leading-relaxed text-slate-900">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </WhiteCard>
          ))}
        </div>
      </div>
    </section>
  );
}
