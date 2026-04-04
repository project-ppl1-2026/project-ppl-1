export const aboutImages = {
  hero: "https://images.unsplash.com/photo-1624731556141-847f6d44e0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBzdXBwb3J0aXZlJTIwZ3JvdXAlMjBzdHVkeSUyMEluZG9uZXNpYXxlbnwxfHx8fDE3NzQ5NTA1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  youth:
    "https://images.unsplash.com/photo-1747470198294-b906f9d0af48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVucyUyMHlvdXRoJTIwZW1vdGlvbmFsJTIwd2VsbGJlaW5nJTIwbWVudGFsJTIwaGVhbHRoJTIwc3VwcG9ydHxlbnwxfHx8fDE3NzQ5NTA1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
  clarisya:
    "https://images.unsplash.com/photo-1651604147958-c3e7dd3acc63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwSW5kb25lc2lhJTIwQXNpYW4lMjBkZXZlbG9wZXIlMjBwcm9ncmFtbWVyfGVufDF8fHx8MTc3NDk1MDUzN3ww&ixlib=rb-4.1.0&q=80&w=400",
  mira: "https://images.unsplash.com/photo-1758685848208-e108b6af94cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBwcm9mZXNzb3IlMjB0ZWFjaGVyJTIwYWNhZGVtaWMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc0OTUwNTMzfDA&ixlib=rb-4.1.0&q=80&w=400",
  dev: "https://images.unsplash.com/photo-1701967341617-14499d8bf8c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGRldmVsb3BlciUyMHN0dWRlbnQlMjBsYXB0b3AlMjJjb2Rpbmd8ZW58MXx8fHwxNzc0OTUwNTM0fDA&ixlib=rb-4.1.0&q=80&w=400",
  dev2: "https://images.unsplash.com/photo-1709202967828-e1a7823ccdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc3R1ZGVudCUyMHNtaWxpbmclMjBjb25maWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5NTA1MzN8MA&ixlib=rb-4.1.0&q=80&w=400",
} as const;

export const heroStats = [
  { value: "10-29", label: "Rentang Usia Pengguna" },
  { value: "3", label: "Fitur Inti Platform" },
  { value: "SDG 16", label: "Komitmen Global" },
] as const;

export const missions = [
  {
    icon: "lightbulb",
    title: "Empowering Reflection",
    desc: "Membantu remaja mengenali dan memahami emosinya sendiri melalui Daily Mood Check-In harian dan Safe Diary yang terjaga privasinya.",
    tag: "Refleksi Diri",
  },
  {
    icon: "book",
    title: "Social Education",
    desc: "Edukasi interaktif melalui Brave Choice Trivia Quiz untuk melatih kemampuan berpikir kritis dalam menghadapi situasi sosial berisiko.",
    tag: "Edukasi Sosial",
  },
  {
    icon: "shield",
    title: "Trusted Bridge",
    desc: "Menjembatani komunikasi antara anak dan orang tua dengan prinsip privasi ketat melalui laporan mingguan yang bersifat generik.",
    tag: "Jembatan Keluarga",
  },
] as const;

export const sdgPoints = [
  {
    icon: "book",
    title: "Safe Diary & Deteksi Kekerasan Emosional",
    desc: "Fitur Safe Diary mendeteksi pola bahasa yang mengindikasikan tekanan emosional, lalu memberi notifikasi halus ke pengguna dan ringkasan aman ke orang tua.",
  },
  {
    icon: "target",
    title: "Brave Choice Trivia & Edukasi Eksploitasi",
    desc: "Modul Brave Choice Trivia mensimulasikan skenario nyata agar pengguna terlatih membuat keputusan yang berani dan aman.",
  },
  {
    icon: "globe",
    title: "Laporan Mingguan & Peran Orang Tua",
    desc: "Orang tua hanya melihat laporan mood generik tanpa konten diary untuk menjaga kepercayaan anak sekaligus dukungan keluarga.",
  },
] as const;

export const impactStats = [
  { value: "10K+", label: "Remaja Terlindungi" },
  { value: "70%", label: "Kesadaran Emosi Meningkat" },
  { value: "100%", label: "Data Terenkripsi" },
] as const;

export const teamMembers = [
  {
    name: "Mira Suryani, S.Pd, M.Kom.",
    role: "Dosen Pembimbing",
    subtitle: "Program Studi Informatika · Universitas Padjadjaran",
    imgSrc: aboutImages.mira,
    isAdvisor: true,
    isPlaceholder: false,
  },
  {
    name: "Clarisya",
    role: "Informatics Student & Lead Developer",
    subtitle: "UI/UX Design · Full-Stack Development · Kelompok Cegukan",
    imgSrc: aboutImages.clarisya,
    isAdvisor: false,
    isPlaceholder: false,
  },
  {
    name: "Anggota Tim",
    role: "Backend Developer",
    subtitle: "Kelompok Cegukan · Universitas Padjadjaran",
    imgSrc: aboutImages.dev,
    isAdvisor: false,
    isPlaceholder: false,
  },
  {
    name: "Anggota Tim",
    role: "Frontend Developer",
    subtitle: "Kelompok Cegukan · Universitas Padjadjaran",
    imgSrc: aboutImages.dev2,
    isAdvisor: false,
    isPlaceholder: false,
  },
  {
    name: "Anggota Tim",
    role: "Data & Research",
    subtitle: "Kelompok Cegukan · Universitas Padjadjaran",
    imgSrc: "",
    isAdvisor: false,
    isPlaceholder: true,
  },
  {
    name: "Anggota Tim",
    role: "QA & Documentation",
    subtitle: "Kelompok Cegukan · Universitas Padjadjaran",
    imgSrc: "",
    isAdvisor: false,
    isPlaceholder: true,
  },
] as const;
