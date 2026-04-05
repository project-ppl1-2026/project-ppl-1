import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesHero() {
  return (
    <section className="relative pt-24 pb-16 px-6 lg:px-16 overflow-hidden bg-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -left-20 w-96 h-96 rounded-full bg-teal-600/5 blur-3xl border border-white/20" />
        <div className="absolute top-48 -right-20 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl border border-white/20" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-20">
          {/* Left */}
          <div className="flex-1 pt-4 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
                Platform Emosional Terlengkap · Untuk Remaja Indonesia
              </span>
            </div>
            <h1 className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-teal-950 mb-6">
              Ekosistem Lengkap
              <br className="hidden lg:block" />
              <span className="text-teal-600"> Keamanan Emosional</span>
              <br className="hidden lg:block" />
              Kamu
            </h1>
            <p className="text-base lg:text-lg text-teal-700/80 leading-relaxed mb-8 font-serif max-w-lg mx-auto lg:mx-0">
              Dari diary harian yang didampingi AI, pilihan emosional yang
              melatih keberanian, hingga pemantauan mood visual — semua dalam
              satu platform yang aman dan terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold shadow-xl shadow-teal-900/20 w-full gap-2"
                >
                  Mulai Sesi Gratis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-2 border-teal-100 text-teal-800 font-bold hover:bg-teal-50 w-full"
                >
                  Lihat Harga
                </Button>
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 w-full relative">
            <div className="rounded-[2rem] overflow-hidden border-2 border-teal-50 shadow-2xl relative bg-teal-50 aspect-[4/3] lg:aspect-[5/4]">
              <img
                src="https://images.unsplash.com/photo-1622997074056-9e652a0cf5bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwdGVlbmFnZSUyMHN0dWRlbnRzJTIwdXNpbmclMjBwaG9uZSUyMGxhcHRvcCUyMHN0dWR5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzc1MDQwOTg3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="TemanTumbuh youth using app"
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Fake UI Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/70 flex items-center gap-3 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_#D1FAE5]" />
                <p className="text-xs font-bold text-teal-950 flex-1">
                  AI Teman sedang mendengar Clarisya...
                </p>
                <div className="flex gap-1 items-end h-4">
                  <div className="w-1 bg-teal-700 rounded-full h-1 animate-pulse" />
                  <div
                    className="w-1 bg-teal-700 rounded-full h-2 animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 bg-teal-700 rounded-full h-3 animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
