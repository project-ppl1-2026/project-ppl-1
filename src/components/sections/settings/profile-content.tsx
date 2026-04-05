"use client";

import { User, ShieldCheck, Mail, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface ParentStatusResponse {
  email: string | null;
  status: "pending" | "verified" | "expired" | null;
  expiresAt: string | null;
}

interface ProfileContentProps {
  activeTab: number;
}

export function ProfileContent({ activeTab }: ProfileContentProps) {
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    createdAt?: string | null;
    role?: string;
    parentEmail?: string | null;
    birthYear?: number | null;
  } | null>(null);
  const [nameValue, setNameValue] = useState<string>("");
  const [parentEmailInput, setParentEmailInput] = useState<string>("");
  const [birthYearValue, setBirthYearValue] = useState<string>("");
  const [parentStatus, setParentStatus] =
    useState<ParentStatusResponse["status"]>(null);
  const [parentEmailServer, setParentEmailServer] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleSaveProfileInfo = async () => {
    if (!nameValue.trim() || !birthYearValue) {
      toast.error("Nama lengkap dan tahun lahir harus diisi.");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const { error } = await authClient.updateUser({
        name: nameValue.trim(),
        birthYear: Number(birthYearValue),
      });
      if (error) {
        toast.error("Gagal memperbarui profil: " + error.message);
      } else {
        toast.success("Profil berhasil diperbarui.");
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                name: nameValue.trim(),
                birthYear: Number(birthYearValue),
              }
            : prev,
        );
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat memperbarui profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Semua kolom kata sandi harus diisi.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        toast.error(res.error.message || "Kata sandi lama tidak sesuai.");
      } else {
        toast.success("Kata sandi berhasil diganti.");
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setProfile({
          name: data.user.name,
          email: data.user.email,
          createdAt: data.user.createdAt
            ? new Date(data.user.createdAt).toISOString()
            : null,
          role: data.user.role || "Pelajar / Remaja (Usia 10–29)",
          parentEmail: data.user.parentEmail || null,
          birthYear: (data.user as { birthYear?: number }).birthYear || null,
        });
        setNameValue(data.user.name);
        setParentEmailInput(
          (data.user as { parentEmail?: string }).parentEmail || "",
        );
        const birthYearParam = (data.user as { birthYear?: number }).birthYear;
        if (birthYearParam) {
          setBirthYearValue(String(birthYearParam));
        }

        // Fetch linked accounts
        const accountsRes = await authClient.listAccounts();
        if (accountsRes?.data) {
          setIsGoogleLinked(
            accountsRes.data.some(
              (acc: { providerId: string }) => acc.providerId === "google",
            ),
          );
        }
      }
    };

    const fetchParentStatus = async () => {
      try {
        const response = await fetch("/api/parent/status", {
          cache: "no-store",
        });
        if (response.ok) {
          const result = (await response.json()) as ParentStatusResponse;
          setParentStatus(result.status);
          setParentEmailServer(result.email);
          if (result.email) {
            setParentEmailInput(result.email);
          }
        }
      } catch {
        console.error("Gagal memuat status orang tua.");
      }
    };

    fetchSession();
    fetchParentStatus();
  }, []);

  const handleSaveParentEmail = async () => {
    if (!parentEmailInput) {
      toast.error("Email orang tua tidak boleh kosong");
      return;
    }

    setIsSaving(true);
    try {
      const normalizedEmail = parentEmailInput.trim().toLowerCase();
      const response = await authClient.updateUser({
        parentEmail: normalizedEmail,
      });

      if (response.error) {
        toast.error(
          response.error.message || "Gagal menyimpan email orang tua",
        );
      } else {
        toast.success(
          "Permintaan persetujuan telah dikirim ke " + normalizedEmail,
        );

        // Re-fetch parent status
        const statusRes = await fetch("/api/parent/status", {
          cache: "no-store",
        });
        if (statusRes.ok) {
          const result = (await statusRes.json()) as ParentStatusResponse;
          setParentStatus(result.status);
          setParentEmailServer(result.email);
        }
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (activeTab === 0) {
    return (
      <>
        <Card className="rounded-[18px] border-slate-200 shadow-sm w-full">
          <CardHeader className="border-b border-slate-200 px-7 py-5 flex flex-row items-center gap-2.5 space-y-0">
            <User className="h-4 w-4 text-teal-800" />
            <CardTitle className="text-[15px] font-extrabold text-teal-950">
              Informasi Profil
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-center gap-2 md:gap-6 border-b border-slate-200 px-7 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Nama Lengkap</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Nama yang akan ditampilkan pada profil Anda.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="Ketik nama Anda..."
                  disabled={isUpdatingProfile}
                  className="rounded-xl border-slate-200 bg-slate-50 font-semibold focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:border-amber-500 px-3.5 py-5 h-auto text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-center gap-2 md:gap-6 border-b border-slate-200 px-7 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Email</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {isGoogleLinked
                    ? "Terhubung via Google SSO"
                    : "Email & Kata Sandi"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-center gap-2 md:gap-6 border-b border-slate-200 px-7 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Tahun Lahir</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  Pilih tahun lahir Anda.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <Select
                  disabled={isUpdatingProfile}
                  value={birthYearValue || profile?.birthYear?.toString() || ""}
                  onValueChange={(val) => {
                    setBirthYearValue(val);
                  }}
                >
                  <SelectTrigger className="px-3.5 py-5 h-auto text-sm rounded-xl border-slate-200 bg-slate-50 font-semibold focus:ring-1 focus:ring-amber-500 focus:border-amber-500">
                    <SelectValue placeholder="Pilih Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 100 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-center gap-2 md:gap-6 border-b border-slate-200 px-7 py-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Jenis Akun</p>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900">
                  {Number(birthYearValue) > 0
                    ? new Date().getFullYear() - Number(birthYearValue) <= 29
                      ? "Pelajar / Remaja (Usia 10–29)"
                      : "Dewasa (> 29 Tahun)"
                    : profile?.birthYear
                      ? new Date().getFullYear() - profile.birthYear <= 29
                        ? "Pelajar / Remaja (Usia 10–29)"
                        : "Dewasa (> 29 Tahun)"
                      : profile?.role === "user"
                        ? "Pelajar / Remaja (Usia 10–29)"
                        : profile?.role || "Memuat..."}
                </div>
              </div>
            </div>

            {isGoogleLinked ? (
              <div className="mx-4 md:mx-7 mb-6 mt-4 flex items-start gap-3 rounded-2xl border border-amber-200/50 bg-amber-50 p-4">
                <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Keamanan</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    Kata sandi akunmu
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Kamu masuk menggunakan Google SSO. Kata sandi tidak
                    digunakan, tapi kamu bisa mengelolanya dari pengaturan akun
                    Google.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-start gap-2 md:gap-6 border-b border-slate-200 px-7 py-4">
                <div>
                  {" "}
                  <p className="text-sm font-bold text-slate-900">Keamanan</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    Kata sandi akunmu
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {isChangingPassword ? (
                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <input
                        type="password"
                        placeholder="Kata Sandi Lama"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition"
                      />
                      <input
                        type="password"
                        placeholder="Kata Sandi Baru"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleChangePassword}
                          disabled={isSubmittingPassword}
                          className="px-5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-sm font-bold text-teal-800 hover:bg-teal-100 transition disabled:opacity-50"
                        >
                          {isSubmittingPassword ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          onClick={() => setIsChangingPassword(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Ganti Kata Sandi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end px-7 py-5 border-t border-slate-200 bg-slate-50/50 rounded-b-[18px]">
              <button
                onClick={handleSaveProfileInfo}
                disabled={
                  isUpdatingProfile ||
                  !nameValue.trim() ||
                  !birthYearValue ||
                  (nameValue.trim() === profile?.name &&
                    birthYearValue === profile?.birthYear?.toString())
                }
                className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-900 transition disabled:opacity-50"
              >
                {isUpdatingProfile ? "Menyimpan..." : "Simpan Perbaikan"}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[18px] border-slate-200 shadow-sm w-full">
          <CardHeader className="border-b border-slate-200 px-7 py-5 flex flex-row items-center gap-2.5 space-y-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-[15px] font-extrabold text-teal-950">
              Status Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-7 w-full">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-[15px] font-extrabold text-teal-950">
                    Akun Aktif
                  </p>
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-800"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    Aktif
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Bergabung sejak{" "}
                  <strong className="text-teal-950">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "id-ID",
                          { month: "long", year: "numeric" },
                        )
                      : "Memuat..."}
                  </strong>{" "}
                  · Free Plan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // TAB 1: Laporan Orang Tua
  return (
    <>
      {parentStatus === "verified" && (
        <div className="rounded-2xl px-6 py-4 bg-emerald-50 border border-emerald-200 flex items-center gap-4">
          <ShieldCheck className="h-7 w-7 text-emerald-600 shrink-0" />
          <div className="flex flex-col">
            <p className="font-extrabold text-sm text-emerald-800">
              Terverifikasi
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Email orang tua ({parentEmailServer}) sudah terkonfirmasi dan
              laporan aktif.
            </p>
          </div>
        </div>
      )}

      {parentStatus === "pending" && (
        <div className="rounded-2xl px-6 py-4 bg-amber-50 border border-amber-200 flex items-center gap-4">
          <Mail className="h-7 w-7 text-amber-600 shrink-0" />
          <div className="flex flex-col">
            <p className="font-extrabold text-sm text-amber-800">
              Menunggu Persetujuan
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Email permintaan telah dikirim ke{" "}
              <span className="font-bold">{parentEmailServer}</span>. Menunggu
              persetujuan.
            </p>
          </div>
        </div>
      )}

      {parentStatus === "expired" && (
        <div className="rounded-2xl px-6 py-4 bg-red-50 border border-red-200 flex items-center gap-4">
          <Mail className="h-7 w-7 text-red-600 shrink-0" />
          <div className="flex flex-col">
            <p className="font-extrabold text-sm text-red-800">
              Tautan Kedaluwarsa
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Tautan konfirmasi untuk {parentEmailServer} telah kedaluwarsa.
              Silakan kirim ulang.
            </p>
          </div>
        </div>
      )}

      <Card className="rounded-[18px] border-slate-200 shadow-sm w-full">
        <CardHeader className="border-b border-slate-200 px-7 py-5 flex flex-row items-center gap-2.5 space-y-0">
          <Users className="h-4 w-4 text-teal-800" />
          <div>
            <CardTitle className="text-[15px] font-extrabold text-teal-950">
              Konfigurasi Laporan
            </CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Atur pengiriman laporan kepada orang tua/wali kamu.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-start md:items-center gap-4 border-b border-slate-200 px-7 py-6">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Email Orang Tua
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                Laporan mingguan akan dikirimkan ke email ini.
              </p>
            </div>
            <div className="flex gap-2.5 w-full">
              <input
                type="email"
                placeholder="ortu@email.com"
                value={parentEmailInput}
                onChange={(e) => setParentEmailInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition"
              />
              <button
                onClick={handleSaveParentEmail}
                disabled={
                  isSaving ||
                  (parentEmailInput === parentEmailServer &&
                    parentStatus !== "expired")
                }
                className="px-5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-sm font-bold text-teal-800 hover:bg-teal-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? "Tunggu..." : "Simpan"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[18px] border-slate-200 shadow-sm w-full bg-slate-50">
        <CardHeader className="border-b border-slate-200 px-7 py-5 flex flex-row items-center gap-2.5 space-y-0 bg-white rounded-t-[18px]">
          <ShieldCheck className="h-4 w-4 text-teal-800" />
          <div className="space-y-1">
            <CardTitle className="text-[15px] font-extrabold text-teal-950">
              Yang TIDAK Dikirim ke Orang Tua
            </CardTitle>
            <p className="text-[11px] text-slate-500">
              Privasi diary kamu terlindungi sepenuhnya.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-7 space-y-3 bg-white rounded-b-[18px]">
          {[
            "Isi diary atau jurnal pribadi",
            "Hasil refleksi AI yang personal",
            "Pesan atau catatan yang kamu tulis",
            "Detail skor per sesi Brave Choice",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <div className="h-5 w-5 flex-shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
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
