import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      name: true,
      email: true,
      isPremium: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isPremium = user.isPremium;
  const currentPlan = isPremium ? "Premium" : "Free";

  const freeFeatures = [
    "Mood check-in harian",
    "Diary harian",
    "Akses fitur dasar TemanTumbuh",
  ];

  const premiumFeatures = [
    "Insight emosi yang lebih lengkap",
    "Rekomendasi dukungan yang lebih personal",
    "Ringkasan dan pola tren yang lebih mendalam",
    "Akses penuh ke fitur premium",
  ];

  return (
    <main
      className="min-h-screen px-3 py-4 md:px-5 md:py-5"
      style={{ background: "var(--tt-dashboard-page-bg, #F7FAF9)" }}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <section
          className="rounded-[20px] border px-4 py-4 md:px-5 md:py-5"
          style={{
            background: "var(--tt-dashboard-card, #FFFFFF)",
            borderColor: "var(--tt-dashboard-border, #D9E5E2)",
            boxShadow: "0 8px 22px rgba(26, 40, 64, 0.045)",
          }}
        >
          <p
            className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--tt-dashboard-text-2, #7A8A8C)" }}
          >
            Subscription
          </p>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h1
                className="text-[22px] font-extrabold leading-tight md:text-[26px]"
                style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
              >
                Kelola paket akunmu
              </h1>

              <p
                className="mt-1.5 text-[13px] leading-relaxed md:text-sm"
                style={{ color: "var(--tt-dashboard-text-2, #6B7280)" }}
              >
                Lihat status paketmu saat ini, upgrade ke premium, atau kelola
                langganan jika sudah aktif.
              </p>
            </div>

            <div
              className="inline-flex h-fit items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
              style={{
                background: isPremium
                  ? "var(--tt-dashboard-success-soft, rgba(34,197,94,0.12))"
                  : "var(--tt-dashboard-chip-bg, rgba(26,150,136,0.10))",
                color: isPremium
                  ? "var(--tt-dashboard-success, #169B62)"
                  : "var(--tt-dashboard-button-bg, #1A9688)",
              }}
            >
              Paket saat ini: {currentPlan}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div
            className="rounded-[20px] border p-4 md:p-5"
            style={{
              background: "var(--tt-dashboard-card, #FFFFFF)",
              borderColor: "var(--tt-dashboard-border, #D9E5E2)",
              boxShadow: "0 8px 22px rgba(26, 40, 64, 0.045)",
            }}
          >
            <div className="mb-4 flex flex-col gap-1">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "var(--tt-dashboard-text-2, #7A8A8C)" }}
              >
                Status akun
              </p>
              <h2
                className="text-[18px] font-bold leading-snug"
                style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
              >
                {isPremium
                  ? "Akun kamu sedang aktif di Premium"
                  : "Akun kamu masih menggunakan paket Free"}
              </h2>
            </div>

            <div className="grid gap-2.5 md:grid-cols-2">
              <div
                className="rounded-[16px] border p-3"
                style={{
                  background: "var(--tt-dashboard-soft, #F9FCFB)",
                  borderColor: "var(--tt-dashboard-border, #D9E5E2)",
                }}
              >
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: "var(--tt-dashboard-text-2, #7A8A8C)" }}
                >
                  Nama
                </p>
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
                >
                  {user.name || "Pengguna TemanTumbuh"}
                </p>
              </div>

              <div
                className="rounded-[16px] border p-3"
                style={{
                  background: "var(--tt-dashboard-soft, #F9FCFB)",
                  borderColor: "var(--tt-dashboard-border, #D9E5E2)",
                }}
              >
                <p
                  className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: "var(--tt-dashboard-text-2, #7A8A8C)" }}
                >
                  Email
                </p>
                <p
                  className="break-all text-[13px] font-semibold"
                  style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div
                className="rounded-[16px] border p-3"
                style={{
                  background: "var(--tt-dashboard-soft, #F9FCFB)",
                  borderColor: "var(--tt-dashboard-border, #D9E5E2)",
                }}
              >
                <p
                  className="mb-2.5 text-[13px] font-bold"
                  style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
                >
                  Free
                </p>

                <div className="space-y-1.5">
                  {freeFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-lg px-2.5 py-2 text-[12px] leading-relaxed"
                      style={{
                        background: "rgba(26,150,136,0.05)",
                        color: "var(--tt-dashboard-text-2, #6B7280)",
                      }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-[16px] border p-3"
                style={{
                  background: isPremium
                    ? "rgba(26,150,136,0.06)"
                    : "var(--tt-dashboard-soft, #F9FCFB)",
                  borderColor: isPremium
                    ? "rgba(26,150,136,0.22)"
                    : "var(--tt-dashboard-border, #D9E5E2)",
                }}
              >
                <p
                  className="mb-2.5 text-[13px] font-bold"
                  style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
                >
                  Premium
                </p>

                <div className="space-y-1.5">
                  {premiumFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-lg px-2.5 py-2 text-[12px] leading-relaxed"
                      style={{
                        background: isPremium
                          ? "rgba(26,150,136,0.08)"
                          : "rgba(26,150,136,0.05)",
                        color: "var(--tt-dashboard-text-2, #6B7280)",
                      }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-[20px] border p-4 md:p-5"
            style={{
              background: "var(--tt-dashboard-card, #FFFFFF)",
              borderColor: "var(--tt-dashboard-border, #D9E5E2)",
              boxShadow: "0 8px 22px rgba(26, 40, 64, 0.045)",
            }}
          >
            <div className="mb-4">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "var(--tt-dashboard-text-2, #7A8A8C)" }}
              >
                Kelola langganan
              </p>

              <h2
                className="mt-1 text-[18px] font-bold"
                style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
              >
                {isPremium ? "Pengaturan Premium" : "Upgrade ke Premium"}
              </h2>

              <p
                className="mt-1.5 text-[13px] leading-relaxed"
                style={{ color: "var(--tt-dashboard-text-2, #6B7280)" }}
              >
                {isPremium
                  ? "Kamu bisa melanjutkan, menghentikan, atau meninjau detail langganan dari sini."
                  : "Aktifkan premium untuk membuka insight dan fitur tambahan."}
              </p>
            </div>

            <div className="space-y-2.5">
              {!isPremium ? (
                <>
                  <Link
                    href="/payment"
                    className="flex h-10 w-full items-center justify-center rounded-[12px] text-[13px] font-semibold text-white transition hover:opacity-90"
                    style={{
                      background: "var(--tt-dashboard-button-bg, #1A9688)",
                      boxShadow: "0 5px 14px rgba(26,150,136,0.18)",
                    }}
                  >
                    Upgrade ke Premium
                  </Link>

                  <Link
                    href="/pricing"
                    className="flex h-10 w-full items-center justify-center rounded-[12px] border text-[13px] font-semibold transition hover:opacity-85"
                    style={{
                      borderColor: "var(--tt-dashboard-border, #D9E5E2)",
                      color: "var(--tt-dashboard-text, #1F2A37)",
                      background: "#FFFFFF",
                    }}
                  >
                    Lihat detail paket
                  </Link>
                </>
              ) : (
                <>
                  <form action={resumeSubscription}>
                    <button
                      type="submit"
                      className="flex h-10 w-full items-center justify-center rounded-[12px] text-[13px] font-semibold text-white transition hover:opacity-90"
                      style={{
                        background: "var(--tt-dashboard-button-bg, #1A9688)",
                        boxShadow: "0 5px 14px rgba(26,150,136,0.18)",
                      }}
                    >
                      Kelola pembayaran
                    </button>
                  </form>

                  <form action={cancelSubscription}>
                    <button
                      type="submit"
                      className="flex h-10 w-full items-center justify-center rounded-[12px] border text-[13px] font-semibold transition hover:opacity-85"
                      style={{
                        borderColor: "rgba(209, 106, 61, 0.28)",
                        color: "#B4532A",
                        background: "#FFF8F4",
                      }}
                    >
                      Berhenti berlangganan
                    </button>
                  </form>
                </>
              )}
            </div>

            <div
              className="mt-4 rounded-[16px] border p-3"
              style={{
                background: "var(--tt-dashboard-soft, #F9FCFB)",
                borderColor: "var(--tt-dashboard-border, #D9E5E2)",
              }}
            >
              <p
                className="mb-1.5 text-[13px] font-semibold"
                style={{ color: "var(--tt-dashboard-text, #1F2A37)" }}
              >
                Catatan
              </p>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "var(--tt-dashboard-text-2, #6B7280)" }}
              >
                Tombol kelola pembayaran, berhenti berlangganan, dan aktifkan
                lagi sebaiknya dihubungkan ke endpoint backend subscription
                kamu.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-start">
          <Link
            href="/home"
            className="inline-flex h-9 items-center justify-center rounded-[10px] px-3.5 text-[13px] font-semibold transition hover:opacity-85"
            style={{
              background: "var(--tt-dashboard-card, #FFFFFF)",
              color: "var(--tt-dashboard-text, #1F2A37)",
              border: "1px solid var(--tt-dashboard-border, #D9E5E2)",
            }}
          >
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
