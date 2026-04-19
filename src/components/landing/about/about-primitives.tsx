import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-brand-teal sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-text-brand-secondary">
        {description}
      </p>
    </div>
  );
}

export function StatChip({ value }: { value: string }) {
  return (
    <Card className="min-w-32">
      <CardContent className="flex flex-col items-center p-5 text-center">
        <p className="text-2xl font-extrabold text-brand-teal-dark">{value}</p>
      </CardContent>
    </Card>
  );
}

export function IconCard({
  icon: Icon,
  title,
  desc,
  tag,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <Card className="relative flex h-full w-full flex-col border-brand-border bg-card shadow-[0_8px_40px_rgba(27,107,107,0.10)]">
      <CardHeader className="space-y-4 pt-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-page-bg1">
          <Icon className="h-5 w-5 text-brand-teal-dark" />
        </div>
        {tag ? (
          <Badge className="w-fit rounded-full bg-brand-teal-ghost px-3 py-1 text-brand-teal hover:bg-brand-teal-ghost">
            {tag}
          </Badge>
        ) : null}
        <CardTitle className="text-xl text-text-brand-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-text-brand-secondary">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

export function TeamCard({
  name,
  role,
  subtitle,
  imgSrc,
  isPlaceholder,
}: {
  name: string;
  role: string;
  subtitle: string;
  imgSrc: string;
  isAdvisor: boolean;
  isPlaceholder: boolean;
}) {
  return (
    <Card className="overflow-hidden border-brand-border bg-card shadow-[0_8px_40px_rgba(27,107,107,0.10)]">
      <div className="relative h-56 overflow-hidden">
        {isPlaceholder ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,var(--color-page-bg1)_0%,var(--color-brand-teal-ghost)_100%)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal-dark/15">
              <Users className="h-8 w-8 text-brand-teal-dark" />
            </div>
            <p className="text-sm text-text-brand-secondary">Anggota Tim</p>
          </div>
        ) : (
          <>
            <Image
              src={imgSrc}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="scale-110 object-cover object-center blur-md opacity-22"
              unoptimized
            />
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain object-center"
              unoptimized
            />
          </>
        )}
      </div>
      <CardContent className="space-y-1.5 p-5">
        <p className="font-bold text-text-brand-primary">{name}</p>
        <p className="text-sm font-semibold text-brand-teal">{role}</p>
        <p className="text-xs text-text-brand-secondary">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
