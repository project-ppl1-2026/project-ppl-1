"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { fadeUpVariants, springSmooth } from "@/lib/animations";
import { ProfileStatusBadge } from "@/components/profile/profile-status-badge";

interface ProfileAvatarCardProps {
  name: string;
  email: string;
  image: string | null;
  profileFilled: boolean;
  isRefreshing?: boolean;
}

export function ProfileAvatarCard({
  name,
  email,
  image,
  profileFilled,
  isRefreshing = false,
}: ProfileAvatarCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={springSmooth}
      className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left"
    >
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-3xl font-bold"
        style={{
          background: "var(--color-brand-teal-ghost)",
          color: "var(--color-brand-teal)",
          border: "4px solid white",
          boxShadow: "0 10px 30px rgba(26,40,64,0.08)",
        }}
      >
        {image && image.startsWith("http") ? (
          <Image
            src={image}
            alt={name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          (name?.charAt(0) || "?").toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-brand-primary)" }}
          >
            {name}
          </h1>

          {!profileFilled ? <ProfileStatusBadge status="incomplete" /> : null}
        </div>

        <p
          className="break-all text-sm"
          style={{ color: "var(--color-text-brand-muted)" }}
        >
          {email}
        </p>

        {isRefreshing ? (
          <p
            className="mt-2 text-xs"
            style={{ color: "var(--color-text-brand-muted)" }}
          >
            Menyegarkan data...
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
