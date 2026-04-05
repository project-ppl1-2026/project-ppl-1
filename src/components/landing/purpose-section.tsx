import * as React from "react";
import { Shield, Users, CheckCircle } from "lucide-react";
import { IconBox, SectionHeader, WhiteCard } from "./landing-primitives";
import { purposes } from "./landing-data";

const iconMap: Record<string, React.ElementType> = {
  Shield: Shield,
  Users: Users,
  CheckCircle: CheckCircle,
};

export function PurposeSection() {
  const themes = [
    {
      bubbleClass: "bg-teal-100",
      barClass: "bg-teal-600",
    },
    {
      bubbleClass: "bg-amber-100",
      barClass: "bg-amber-500",
    },
    {
      bubbleClass: "bg-green-100",
      barClass: "bg-green-500",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-emerald-50 py-36 md:py-44">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="TUJUAN KAMI"
          title="TemanTumbuh's Tujuan"
          description="Kami percaya setiap remaja berhak mendapat ruang aman untuk tumbuh"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {purposes.map((p, i) => {
            const Icon = iconMap[p.iconName];
            const theme = themes[i] ?? themes[0];

            return (
              <WhiteCard key={i} className="space-y-4 p-7" hover>
                <IconBox size={56} className={theme.bubbleClass}>
                  <Icon
                    className={`h-6.5 w-6.5 ${p.colorClass}`}
                    strokeWidth={2.2}
                  />
                </IconBox>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {p.desc}
                  </p>
                </div>
                <div className={`h-1 w-12 rounded-full ${theme.barClass}`} />
              </WhiteCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
