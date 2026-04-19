import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(145deg,var(--color-brand-teal-dark)_0%,#0D5050_40%,var(--color-brand-teal)_100%)] py-24 text-white">
      <div className="pointer-events-none absolute -left-24 -top-48 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8 px-6 text-center lg:px-8">
        <h2 className="text-4xl leading-tight font-bold md:text-5xl">
          Mari Tumbuh Bersama.
          <br />
          Mulai Perjalananmu Sekarang.
        </h2>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/85">
          Bergabunglah dengan ribuan remaja yang sudah merasakan manfaat
          TemanTumbuh. Gratis selamanya untuk fitur dasar, karena kesehatan
          emosional adalah hak setiap generasi muda.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            variant="secondary"
            className="h-14 rounded-2xl bg-white px-10 font-bold text-brand-teal-dark shadow-lg hover:bg-white/85 transition-all"
          >
            <Link href="/register">Daftar Gratis Sekarang</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-14 rounded-2xl border-white/30 bg-transparent px-10 font-bold text-white hover:bg-white/5 hover:text-white transition-all"
          >
            <Link href="/">Lihat Platform</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-2 text-sm text-white/75">
          <a
            href="mailto:temantumbuh.team@gmail.com"
            className="inline-flex items-center gap-2 hover:opacity-90"
          >
            <Mail className="h-4 w-4" />
            temantumbuh.team@gmail.com
          </a>
          <span className="hidden h-4 w-px bg-white/30 sm:block" />
          <span className="text-white/65">
            © 2026 TemanTumbuh · Kelompok Cegukan · UNPAD
          </span>
        </div>
      </div>
    </section>
  );
}
