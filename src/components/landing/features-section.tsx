import * as React from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Brain, Heart, BarChart2 } from "lucide-react";
import {
  FloatingBubble,
  IconBox,
  SectionHeader,
  WhiteCard,
} from "./landing-primitives";
import { features } from "./landing-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen: BookOpen,
  Brain: Brain,
  Heart: Heart,
  BarChart2: BarChart2,
};

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <FloatingBubble size={400} top="6%" right="4%" opacity={0.06} />
      <FloatingBubble
        size={300}
        bottom="6%"
        left="3%"
        color="#10b981"
        opacity={0.05}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          label="FITUR KAMI"
          title="TemanTumbuh's Fitur"
          description="Formulas utama yang membuatkan dinilai terbaik oleh para ahli kesehatan mental remaja"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, i) => {
            const Icon = iconMap[feat.iconName];
            return (
              <WhiteCard key={i} className="cursor-pointer space-y-4 p-6" hover>
                <div className="flex items-start justify-between">
                  <IconBox size={48}>
                    {feat.imageSrc ? (
                      <Image
                        src={feat.imageSrc}
                        alt={feat.title}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    ) : (
                      <Icon className="h-5.5 w-5.5 text-teal-600" />
                    )}
                  </IconBox>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">
                    {feat.tag}
                  </span>
                </div>
                <div>
                  <h3 className="mb-2 font-bold text-slate-900">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {feat.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-teal-600">
                  Pelajari lebih <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </WhiteCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
