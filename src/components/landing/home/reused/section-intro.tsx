import { cn } from "@/lib/utils";

type SectionIntroProps = {
  badge: string;
  title: string;
  description: string;
  accent?: string;
  className?: string;
};

export function SectionIntro({
  badge,
  title,
  description,
  accent,
  className,
}: SectionIntroProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="mb-4 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-teal-pale bg-brand-teal-ghost px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-teal">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
          {badge}
        </span>
      </div>

      <h2 className="mb-3 text-3xl font-bold leading-tight text-text-brand-primary md:text-4xl">
        {accent ? <span className="text-brand-teal">{accent}</span> : null}
        {title}
      </h2>

      <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-brand-secondary md:text-base">
        {description}
      </p>
    </div>
  );
}
