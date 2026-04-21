import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function cancelSubscription() {
  "use server";

  redirect("/api/subscription/cancel");
}

async function resumeSubscription() {
  "use server";

  redirect("/api/subscription/resume");
}

const basicFeatures = ["Mood check-in", "Diary harian", "Riwayat dasar"];

const premiumFeatures = [
  "Insight lengkap",
  "Tren mood",
  "Rekomendasi personal",
  "Akses premium",
];

export default async function SubscriptionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isPremium: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isPremium = Boolean(user.isPremium);

  return (
    <main
      className="tt-dashboard-scroll-y h-full min-h-0 px-3 py-4 md:px-5 md:py-5"
      style={{ background: "var(--tt-dashboard-page-bg)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 pb-4">
        <section className="tt-dashboard-card rounded-[28px] px-5 py-6 md:px-7 md:py-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.16em]"
                style={{ color: "var(--tt-dashboard-text-3)" }}
              >
                Subscription
              </p>

              <h1
                className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]"
                style={{ color: "var(--tt-dashboard-text)" }}
              >
                {isPremium ? "Premium aktif" : "Upgrade ke Premium!"}
              </h1>

              <p
                className="mt-2 max-w-[640px] text-[13px] leading-6 md:text-[14px]"
                style={{ color: "var(--tt-dashboard-text-2)" }}
              >
                {isPremium
                  ? "Semua fitur utama sudah terbuka."
                  : "Buka pengalaman yang lebih lengkap untuk refleksi harianmu."}
              </p>
            </div>

            <div
              className="inline-flex h-fit items-center rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{
                background: isPremium
                  ? "var(--tt-dashboard-success-soft)"
                  : "var(--tt-dashboard-brand-soft)",
                color: isPremium
                  ? "var(--tt-dashboard-success)"
                  : "var(--tt-dashboard-brand)",
              }}
            >
              {isPremium ? "Premium Aktif" : "Direkomendasikan"}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <PlanCard
            title="Basic"
            subtitle="Pakai gratis"
            active={!isPremium}
            subdued
            features={basicFeatures}
            footer={
              !isPremium ? (
                <div
                  className="flex h-12 items-center justify-center rounded-[16px] text-[13px] font-semibold"
                  style={{
                    background: "var(--tt-dashboard-brand-soft)",
                    color: "var(--tt-dashboard-text-2)",
                    border: "1px solid var(--tt-dashboard-card-border)",
                  }}
                >
                  Paket saat ini
                </div>
              ) : (
                <div
                  className="flex h-12 items-center justify-center rounded-[16px] text-[13px] font-semibold"
                  style={{
                    background: "#FFFFFF",
                    color: "var(--tt-dashboard-text-3)",
                    border: "1px solid var(--tt-dashboard-card-border)",
                  }}
                >
                  Paket dasar
                </div>
              )
            }
          />

          <PlanCard
            title="Premium"
            subtitle="Lebih lengkap"
            active={isPremium}
            featured
            features={premiumFeatures}
            footer={
              isPremium ? (
                <div className="space-y-3">
                  <form action={resumeSubscription}>
                    <button
                      type="submit"
                      className="h-12 w-full rounded-[16px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95"
                      style={{
                        background: "var(--gradient-brand-btn)",
                        boxShadow: "0 12px 26px rgba(26,150,136,0.18)",
                      }}
                    >
                      Kelola pembayaran
                    </button>
                  </form>

                  <form action={cancelSubscription}>
                    <button
                      type="submit"
                      className="h-12 w-full rounded-[16px] text-[14px] font-semibold transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95"
                      style={{
                        background: "#FFF8F4",
                        color: "#B4532A",
                        border: "1px solid rgba(209,106,61,0.28)",
                      }}
                    >
                      Berhenti berlangganan
                    </button>
                  </form>
                </div>
              ) : (
                <form action={resumeSubscription}>
                  <button
                    type="submit"
                    className="h-12 w-full rounded-[16px] text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95"
                    style={{
                      background: "var(--gradient-brand-btn)",
                      boxShadow: "0 12px 26px rgba(26,150,136,0.18)",
                    }}
                  >
                    Upgrade ke Premium
                  </button>
                </form>
              )
            }
          />
        </section>
      </div>
    </main>
  );
}

function PlanCard({
  title,
  subtitle,
  active,
  features,
  footer,
  featured = false,
  subdued = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  features: string[];
  footer: React.ReactNode;
  featured?: boolean;
  subdued?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] p-5 transition-all duration-200 hover:-translate-y-[2px] md:p-6 ${
        featured ? "" : "tt-dashboard-card"
      }`}
      style={
        featured
          ? {
              background:
                "linear-gradient(160deg, rgba(237,249,247,0.98) 0%, rgba(255,255,255,1) 60%, rgba(244,251,250,1) 100%)",
              border: "1px solid rgba(26,150,136,0.18)",
              boxShadow: "0 20px 46px rgba(26,150,136,0.12)",
            }
          : subdued
            ? {
                opacity: 0.98,
              }
            : undefined
      }
    >
      {featured ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ border: "1px solid rgba(78,207,195,0.28)" }}
          />
          <div
            className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full blur-3xl"
            style={{ background: "rgba(26,150,136,0.10)" }}
          />
        </>
      ) : null}

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[11px] font-extrabold uppercase tracking-[0.14em]"
              style={{
                color: featured
                  ? "var(--tt-dashboard-brand)"
                  : "var(--tt-dashboard-text-3)",
              }}
            >
              {subtitle}
            </p>

            <h2
              className="mt-2 text-[28px] font-extrabold leading-none md:text-[34px]"
              style={{ color: "var(--tt-dashboard-text)" }}
            >
              {title}
            </h2>
          </div>

          {active ? (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{
                background: featured
                  ? "rgba(26,150,136,0.12)"
                  : "var(--tt-dashboard-chip-bg)",
                color: "var(--tt-dashboard-brand)",
              }}
            >
              Aktif
            </span>
          ) : null}
        </div>

        <div className="mt-6 space-y-2.5">
          {features.map((feature) => (
            <FeatureRow key={feature} text={feature} featured={featured} />
          ))}
        </div>

        <div className="mt-6">{footer}</div>
      </div>
    </section>
  );
}

function FeatureRow({
  text,
  featured = false,
}: {
  text: string;
  featured?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[16px] px-3.5 py-3 transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_6px_16px_rgba(26,150,136,0.08)]"
      style={{
        background: featured
          ? "rgba(26,150,136,0.07)"
          : "rgba(26,150,136,0.04)",
        border: featured
          ? "1px solid rgba(26,150,136,0.10)"
          : "1px solid transparent",
      }}
    >
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          background: featured
            ? "rgba(26,150,136,0.14)"
            : "rgba(26,150,136,0.08)",
          color: "var(--tt-dashboard-brand)",
        }}
      >
        <span className="text-[11px] font-bold">✓</span>
      </div>

      <p
        className="text-[13px] font-medium"
        style={{
          color: featured
            ? "var(--tt-dashboard-text)"
            : "var(--tt-dashboard-text-2)",
        }}
      >
        {text}
      </p>
    </div>
  );
}
