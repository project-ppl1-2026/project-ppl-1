"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, User, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import {
  profileEditFormSchema,
  type ProfileEditFormInput,
} from "@/lib/validations";

type ParentStatus = "pending" | "verified" | "expired" | null;

type ParentStatusResponse = {
  email: string | null;
  status: ParentStatus;
  expiresAt: string | null;
};

type ProfileData = {
  name: string;
  email: string;
  createdAt?: string | null;
  birthYear?: number | null;
  parentEmail?: string | null;
};

type ProfileSettingsFormInput = Pick<
  ProfileEditFormInput,
  "name" | "birthYear" | "parentEmail"
>;

const profileSettingsSchema = profileEditFormSchema.pick({
  name: true,
  birthYear: true,
  parentEmail: true,
});

interface ProfileContentProps {
  activeTab: number;
}

function getAccountTypeLabelFromBirthYear(
  birthYear: string | number | null | undefined,
) {
  const year = Number(birthYear);
  if (!Number.isFinite(year) || year < 1900) {
    return "Belum diatur";
  }

  const age = new Date().getFullYear() - year;
  return age <= 29 ? "Pelajar / Remaja (Usia 10-29)" : "Dewasa (> 29 Tahun)";
}

export function ProfileContent({ activeTab }: ProfileContentProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [parentStatus, setParentStatus] = useState<ParentStatus>(null);
  const [parentEmailServer, setParentEmailServer] = useState<string | null>(
    null,
  );
  const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSavingParentEmail, setIsSavingParentEmail] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const {
    register,
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileSettingsFormInput>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      birthYear: "",
      parentEmail: "",
    },
  });

  const watchedBirthYear = watch("birthYear");
  const watchedParentEmail = watch("parentEmail");

  const accountTypeLabel = useMemo(
    () =>
      getAccountTypeLabelFromBirthYear(
        watchedBirthYear || profile?.birthYear || null,
      ),
    [profile?.birthYear, watchedBirthYear],
  );

  useEffect(() => {
    const fetchSessionAndParentStatus = async () => {
      try {
        const [{ data: sessionData }, statusResponse, accountsResponse] =
          await Promise.all([
            authClient.getSession(),
            fetch("/api/parent/status", { cache: "no-store" }),
            authClient.listAccounts(),
          ]);

        if (sessionData?.user) {
          const userProfile: ProfileData = {
            name: sessionData.user.name,
            email: sessionData.user.email,
            createdAt: sessionData.user.createdAt
              ? new Date(sessionData.user.createdAt).toISOString()
              : null,
            birthYear:
              (sessionData.user as { birthYear?: number }).birthYear ?? null,
            parentEmail:
              (sessionData.user as { parentEmail?: string }).parentEmail ??
              null,
          };

          setProfile(userProfile);
          reset({
            name: userProfile.name,
            birthYear: userProfile.birthYear
              ? String(userProfile.birthYear)
              : "",
            parentEmail: userProfile.parentEmail || "",
          });
        }

        if (statusResponse.ok) {
          const parentResult =
            (await statusResponse.json()) as ParentStatusResponse;
          setParentStatus(parentResult.status);
          setParentEmailServer(parentResult.email);
          if (parentResult.email) {
            setValue("parentEmail", parentResult.email, { shouldDirty: false });
          }
        }

        if (accountsResponse?.data) {
          setIsGoogleLinked(
            accountsResponse.data.some(
              (account: { providerId: string }) =>
                account.providerId === "google",
            ),
          );
        }
      } catch {
        toast.error("Gagal memuat data profil.");
      }
    };

    void fetchSessionAndParentStatus();
  }, [reset, setValue]);

  const handleSaveProfile = handleSubmit(async (formValues) => {
    setIsUpdatingProfile(true);

    try {
      const response = await authClient.updateUser({
        name: formValues.name.trim(),
        birthYear: Number(formValues.birthYear),
      });

      if (response.error) {
        toast.error(response.error.message || "Gagal memperbarui profil.");
        return;
      }

      const nextProfile: ProfileData | null = profile
        ? {
            ...profile,
            name: formValues.name.trim(),
            birthYear: Number(formValues.birthYear),
          }
        : null;

      setProfile(nextProfile);
      setIsEditingProfile(false);
      toast.success("Profil berhasil diperbarui.");
    } catch {
      toast.error("Terjadi kesalahan sistem saat memperbarui profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  });

  const handleCancelEdit = () => {
    if (!profile) {
      setIsEditingProfile(false);
      return;
    }

    reset({
      name: profile.name,
      birthYear: profile.birthYear ? String(profile.birthYear) : "",
      parentEmail: getValues("parentEmail") || profile.parentEmail || "",
    });
    setIsEditingProfile(false);
  };

  const handleSaveParentEmail = async () => {
    const currentInput = (watch("parentEmail") || "").trim().toLowerCase();

    if (!currentInput) {
      toast.error("Email orang tua tidak boleh kosong.");
      return;
    }

    setIsSavingParentEmail(true);
    try {
      const response = await authClient.updateUser({
        parentEmail: currentInput,
      });

      if (response.error) {
        toast.error(
          response.error.message || "Gagal menyimpan email orang tua.",
        );
        return;
      }

      toast.success(`Permintaan persetujuan telah dikirim ke ${currentInput}`);

      const statusResponse = await fetch("/api/parent/status", {
        cache: "no-store",
      });

      if (statusResponse.ok) {
        const statusResult =
          (await statusResponse.json()) as ParentStatusResponse;
        setParentStatus(statusResult.status);
        setParentEmailServer(statusResult.email);
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan email orang tua.");
    } finally {
      setIsSavingParentEmail(false);
    }
  };

  if (activeTab === 0) {
    return (
      <>
        <Card className="w-full rounded-[20px] border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-(--brand-primary)" />
              <CardTitle className="text-base font-extrabold text-(--brand-text-primary)">
                Informasi Profil
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 items-start gap-2 border-b border-slate-200 px-8 py-5 md:grid-cols-[250px_1fr] md:items-center md:gap-6">
              <div>
                <p className="text-sm font-bold text-slate-900">Nama Lengkap</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Nama yang akan ditampilkan pada profil Anda.
                </p>
              </div>
              <div className="w-full max-w-md">
                <input
                  {...register("name")}
                  placeholder="Ketik nama Anda..."
                  disabled={!isEditingProfile || isUpdatingProfile}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 transition focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary) disabled:cursor-not-allowed disabled:opacity-70"
                />
                {errors.name?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-2 border-b border-slate-200 px-8 py-5 md:grid-cols-[250px_1fr] md:items-center md:gap-6">
              <div>
                <p className="text-sm font-bold text-slate-900">Email</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {isGoogleLinked
                    ? "Terhubung via Google SSO"
                    : "Email & Kata Sandi"}
                </p>
              </div>
              <div className="inline-flex max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900">
                {profile?.email || "memuat@email.com"}
                {isGoogleLinked && (
                  <Badge
                    variant="outline"
                    className="ml-1 gap-1.5 border-red-200 bg-red-50 py-0 text-[10px] font-bold text-red-600"
                  >
                    Google
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-2 border-b border-slate-200 px-8 py-5 md:grid-cols-[250px_1fr] md:items-center md:gap-6">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Tahun Lahir ({accountTypeLabel})
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Pilih tahun lahir Anda.
                </p>
              </div>
              <div className="w-full max-w-md">
                <select
                  {...register("birthYear")}
                  disabled={!isEditingProfile || isUpdatingProfile}
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 transition focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary) disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option value="">Pilih Tahun</option>
                  {Array.from(
                    { length: 100 },
                    (_, index) => new Date().getFullYear() - index,
                  ).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.birthYear?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.birthYear.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-b-[20px] bg-slate-50/60 px-8 py-5 md:flex-row md:items-center md:justify-between">
              <p className="text-xs text-slate-500">
                Profil hanya bisa diubah setelah menekan tombol Edit Profile.
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                {!isGoogleLinked && (
                  <Link
                    href="/profile/change-password"
                    className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-(--brand-border) bg-white px-4 text-sm font-semibold text-(--brand-text-secondary) transition-colors hover:bg-slate-50"
                  >
                    Reset Password
                  </Link>
                )}

                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdatingProfile}
                      className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile || !isValid}
                      className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-(--brand-primary) px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-(--brand-primary) px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full rounded-[20px] border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-[15px] font-extrabold text-(--brand-text-primary)">
                    Akun Aktif
                  </p>
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-800"
                  >
                    Aktif
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Bergabung sejak{" "}
                  <strong className="text-(--brand-text-primary)">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Memuat..."}
                  </strong>{" "}
                  · Free Plan
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </>
    );
  }

  return (
    <>
      {parentStatus === "verified" && (
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-600" />
          <div className="flex flex-col">
            <p className="text-sm font-extrabold text-emerald-800">
              Terverifikasi
            </p>
            <p className="mt-0.5 text-xs text-emerald-700">
              Email orang tua ({parentEmailServer}) sudah terkonfirmasi dan
              laporan aktif.
            </p>
          </div>
        </div>
      )}

      {parentStatus === "pending" && (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
          <Mail className="h-7 w-7 shrink-0 text-amber-600" />
          <div className="flex flex-col">
            <p className="text-sm font-extrabold text-amber-800">
              Menunggu Persetujuan
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              Email permintaan telah dikirim ke{" "}
              <span className="font-bold">{parentEmailServer}</span>.
            </p>
          </div>
        </div>
      )}

      {parentStatus === "expired" && (
        <div className="flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
          <Mail className="h-7 w-7 shrink-0 text-red-600" />
          <div className="flex flex-col">
            <p className="text-sm font-extrabold text-red-800">
              Tautan Kedaluwarsa
            </p>
            <p className="mt-0.5 text-xs text-red-700">
              Tautan konfirmasi untuk {parentEmailServer} telah kedaluwarsa.
              Silakan kirim ulang.
            </p>
          </div>
        </div>
      )}

      <Card className="w-full rounded-[20px] border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2.5 border-b border-slate-200 px-8 py-6">
          <Users className="h-4 w-4 text-(--brand-primary)" />
          <div>
            <CardTitle className="text-base font-extrabold text-(--brand-text-primary)">
              Konfigurasi Laporan
            </CardTitle>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Atur pengiriman laporan kepada orang tua/wali kamu.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 items-start gap-4 border-b border-slate-200 px-8 py-6 md:grid-cols-[250px_1fr] md:items-center">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Email Orang Tua
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Laporan mingguan akan dikirimkan ke email ini.
              </p>
            </div>
            <div className="flex w-full gap-2.5">
              <input
                type="email"
                placeholder="ortu@email.com"
                value={watchedParentEmail || ""}
                onChange={(event) =>
                  setValue("parentEmail", event.target.value)
                }
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 transition focus:border-(--brand-primary) focus:outline-none focus:ring-1 focus:ring-(--brand-primary)"
              />
              <button
                onClick={handleSaveParentEmail}
                disabled={
                  isSavingParentEmail ||
                  ((watchedParentEmail || "").trim().toLowerCase() ===
                    (parentEmailServer || "").trim().toLowerCase() &&
                    parentStatus !== "expired")
                }
                className="inline-flex h-11 cursor-pointer items-center rounded-xl border border-(--brand-primary-pale) bg-(--brand-primary-ghost) px-5 text-sm font-bold text-(--brand-primary-dark) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSavingParentEmail ? "Tunggu..." : "Simpan"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full rounded-[20px] border-slate-200 bg-slate-50 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-2.5 rounded-t-[20px] border-b border-slate-200 bg-white px-8 py-6">
          <ShieldCheck className="h-4 w-4 text-(--brand-primary)" />
          <div className="space-y-1">
            <CardTitle className="text-base font-extrabold text-(--brand-text-primary)">
              Yang Tidak Dikirim ke Orang Tua
            </CardTitle>
            <p className="text-[11px] text-slate-500">
              Privasi diary kamu terlindungi sepenuhnya.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 rounded-b-[20px] bg-white p-8">
          {[
            "Isi diary atau jurnal pribadi",
            "Hasil refleksi AI yang personal",
            "Pesan atau catatan yang kamu tulis",
            "Detail skor per sesi Brave Choice",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <ShieldCheck className="h-3 w-3 text-emerald-700" />
              </div>
              <span className="text-[13px] font-medium text-slate-600">
                {item}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
