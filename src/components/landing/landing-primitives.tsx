import * as React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── Shared Primitive Components for Landing Page ───

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="mb-3 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-bold tracking-wider text-teal-800 hover:bg-teal-100">
      {children}
    </Badge>
  );
}

export function SectionHeading({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <h2
      className={cn(
        "text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl",
        center && "text-center",
      )}
    >
      {children}
    </h2>
  );
}

export function SectionHeader({
  label,
  title,
  description,
  center = true,
}: {
  label: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-14 max-w-3xl space-y-4",
        center && "text-center",
      )}
    >
      <SectionLabel>{label}</SectionLabel>
      <SectionHeading center={center}>{title}</SectionHeading>
      <p
        className={cn(
          "text-base text-slate-500 sm:text-lg",
          center && "mx-auto max-w-xl",
        )}
      >
        {description}
      </p>
    </div>
  );
}

export function FloatingBubble({
  size,
  top,
  bottom,
  left,
  right,
  color = "#0D9488",
  opacity = 0.1,
}: {
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute rounded-full blur-3xl filter"
      style={{
        width: size,
        height: size,
        top,
        bottom,
        left,
        right,
        backgroundColor: color,
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

export function PolaroidCard({
  src,
  label,
  rotate = 0,
}: {
  src: string;
  label?: string;
  rotate?: number;
}) {
  return (
    <Card
      className="flex-shrink-0 select-none border-none bg-white p-3 pb-8 shadow-[0px_12px_40px_rgba(0,0,0,0.18)] rounded-sm"
      style={{
        transform: `rotate(${rotate}deg)`,
        width: 210,
      }}
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-sm bg-slate-100">
        <Image
          src={src}
          alt={label || ""}
          fill
          sizes="210px"
          className="object-cover pointer-events-none"
          unoptimized
        />
      </div>
      {label && (
        <p className="mt-4 text-center text-xs font-semibold text-slate-500">
          {label}
        </p>
      )}
    </Card>
  );
}

export function IconBox({
  children,
  size = 48,
  color = "#0D9488",
  className,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-2xl", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: `${color}1A`, // 10% opacity hex
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ color?: string }>(child)) {
          return React.cloneElement(child, {
            color: color,
          });
        }
        return child;
      })}
    </div>
  );
}

export function WhiteCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-slate-100 bg-white shadow-[0px_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300",
        hover &&
          "hover:-translate-y-2 hover:shadow-[0px_12px_40px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      {children}
    </Card>
  );
}
