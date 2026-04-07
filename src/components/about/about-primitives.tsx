import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <Badge className="mb-4 rounded-full bg-about-light-teal px-4 py-1.5 text-about-dark-teal hover:bg-about-light-teal">
        {label}
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight text-about-text-dark sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-about-text-muted">
        {description}
      </p>
    </div>
  );
}

export function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <Card className="min-w-32 border-about-light-teal bg-card shadow-[0_10px_30px_rgba(27,107,107,0.14)]">
      <CardContent className="flex flex-col items-center p-5 text-center">
        <p className="text-2xl font-extrabold text-about-dark-teal">{value}</p>
        <p className="mt-1 text-xs text-about-text-muted">{label}</p>
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
    <Card className="relative border-about-light-teal bg-card shadow-[0_8px_40px_rgba(27,107,107,0.10)]">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-[linear-gradient(90deg,var(--about-dark-teal)_0%,var(--about-accent)_100%)]" />
      <CardHeader className="space-y-4 pt-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-about-light-teal">
          <Icon className="h-5 w-5 text-about-dark-teal" />
        </div>
        {tag ? (
          <Badge className="w-fit rounded-full bg-about-accent-soft px-3 py-1 text-about-accent hover:bg-about-accent-soft">
            {tag}
          </Badge>
        ) : null}
        <CardTitle className="text-xl text-about-text-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-about-text-muted">{desc}</p>
      </CardContent>
    </Card>
  );
}

export function TeamCard({
  name,
  role,
  subtitle,
  imgSrc,
  isAdvisor,
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
    <Card
      className={cn(
        "overflow-hidden border-about-light-teal bg-card shadow-[0_8px_40px_rgba(27,107,107,0.10)]",
        isAdvisor && "border-2 border-about-accent",
      )}
    >
      <div className="relative h-56 overflow-hidden">
        {isPlaceholder ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,var(--about-light-teal)_0%,var(--about-accent-soft)_100%)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-about-dark-teal/15">
              <Users className="h-8 w-8 text-about-dark-teal" />
            </div>
            <p className="text-sm text-about-text-muted">Anggota Tim</p>
          </div>
        ) : (
          <Image
            src={imgSrc}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top"
            unoptimized
          />
        )}
        {isAdvisor ? (
          <Badge className="absolute right-3 top-3 rounded-full bg-about-accent px-2.5 py-1 text-white hover:bg-about-accent">
            Dosen Pembimbing
          </Badge>
        ) : null}
      </div>
      <CardContent className="space-y-1.5 p-5">
        <p className="font-bold text-about-text-dark">{name}</p>
        <p className="text-sm font-semibold text-about-accent">{role}</p>
        <p className="text-xs text-about-text-muted">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
