"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, Twitter, Youtube } from "lucide-react";

const footerLinks = [
  { label: "Tentang TemanTumbuh", href: "/about" },
  { label: "Fitur", href: "/features" },
  { label: "Harga", href: "/pricing" },
  { label: "Cara Kerja", href: "/#how" },
  { label: "Testimoni", href: "/#testi" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: <Instagram size={18} /> },
  { label: "Twitter/X", href: "#", icon: <Twitter size={18} /> },
  { label: "YouTube", href: "#", icon: <Youtube size={18} /> },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--brand-footer-bg) 0%, var(--brand-footer-mid) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <Image
                src="/img/LOGO_TEMANTUMBUH.svg"
                alt="TemanTumbuh"
                width={32}
                height={32}
                className="rounded-lg brightness-0 invert"
              />
              <span className="text-sm font-bold text-(--brand-footer-text)">
                TemanTumbuh
              </span>
            </div>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-(--brand-footer-subtext)">
              Platform refleksi diri dan kesadaran sosial untuk usia 10-29
              tahun. Tumbuh bersama, lebih aman.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:temantumbuh.team@gmail.com"
                className="flex cursor-pointer items-center gap-2 text-sm text-(--brand-footer-subtext) transition-opacity duration-150 hover:opacity-70"
              >
                <Mail size={14} />
                temantumbuh.team@gmail.com
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-(--brand-primary-light)">
              Tautan
            </p>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="cursor-pointer text-sm text-(--brand-footer-subtext) transition-opacity duration-150 hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-(--brand-primary-light)">
              Ikuti Kami
            </p>

            <div className="mb-6 flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-(--brand-primary-light) transition-all duration-150 hover:-translate-y-0.5 hover:opacity-80"
                  style={{ background: "var(--brand-footer-card)" }}
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-(--brand-primary) px-4 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
            >
              Mulai Diary
            </Link>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-6 text-center text-xs"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.42)",
          }}
        >
          TemanTumbuh © 2025. All rights reserved. · Proyek Perangkat Lunak I ·
          Kelompok Cegukan · Universitas Padjadjaran
        </div>
      </div>
    </footer>
  );
}
