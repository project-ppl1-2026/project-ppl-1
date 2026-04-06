// ============================================================
// landing-data.ts — TemanTumbuh Landing Page Data
// Single source of truth for all section content
// ============================================================

// ── Features ──────────────────────────────────────────────────
export const features = [
  {
    iconName: "BookOpen",
    imageSrc: "/img/DigitalDiaryLogo.svg",
    title: "Digital Diary",
    desc: "Tulis perasaan dan pikiranmu setiap hari dengan aman, privat, dan terstruktur. AI kami mendengarkan tanpa menghakimi.",
    tag: "AI-Powered",
    num: "01",
    learnHref: "/features/diary",
  },
  {
    iconName: "Brain",
    imageSrc: "/img/BraveChoiceLogo.svg",
    title: "Brave Choice",
    desc: "Latih dirimu menghadapi situasi sosial yang sulit melalui simulasi dan quiz interaktif yang gamified.",
    tag: "Gamifikasi",
    num: "02",
    learnHref: "/features/brave-choice",
  },
  {
    iconName: "Heart",
    imageSrc: "/img/MoodCheckinLogo.svg",
    title: "Mood Check-in",
    desc: "Lacak suasana hatimu setiap hari. Streak harian menjaga konsistensimu dan kenali pola emosi dari waktu ke waktu.",
    tag: "Harian",
    num: "03",
    learnHref: "/features/mood",
  },
  {
    iconName: "BarChart2",
    imageSrc: "/img/InsightDashboardLogo.svg",
    title: "Insight Dashboard",
    desc: "Visualisasi tren emosimu dan dapatkan rekomendasi yang relevan. Laporan personal untuk orang tua & konselor.",
    tag: "Premium",
    num: "04",
    learnHref: "/features/insight",
  },
];

// ── Purpose / About ───────────────────────────────────────────
export const purposes = [
  {
    iconName: "Shield",
    tag: "10–12 tahun",
    title: "Untuk Anak",
    desc: "Antarmuka ramah dan menyenangkan untuk membantu anak mengenali dan mengekspresikan perasaan mereka dengan aman.",
    colorClass: "text-teal-600",
    themeKey: "teal" as const,
  },
  {
    iconName: "Star",
    tag: "13–17 tahun",
    title: "Untuk Remaja",
    desc: "Ruang aman bercerita, edukasi situasi berisiko, dan fitur streak untuk menjaga motivasi setiap hari.",
    colorClass: "text-amber-500",
    themeKey: "amber" as const,
  },
  {
    iconName: "Users",
    tag: "18–29 tahun",
    title: "Untuk Mahasiswa & Dewasa",
    desc: "Insight mendalam, laporan PDF, dan analisis tren emosi jangka panjang untuk mendukung kesehatan mental yang proaktif.",
    colorClass: "text-green-500",
    themeKey: "green" as const,
  },
];

export type PurposeThemeKey = "teal" | "amber" | "green";

export const purposeThemes: Record<
  PurposeThemeKey,
  {
    bubbleBg: string;
    bar: string;
    iconBg: string;
    tagBg: string;
    tagText: string;
    tagBorder: string;
  }
> = {
  teal: {
    bubbleBg: "bg-teal-100",
    bar: "bg-teal-600",
    iconBg: "bg-teal-50",
    tagBg: "bg-teal-50",
    tagText: "text-teal-700",
    tagBorder: "border-teal-200",
  },
  amber: {
    bubbleBg: "bg-amber-100",
    bar: "bg-amber-500",
    iconBg: "bg-amber-50",
    tagBg: "bg-amber-50",
    tagText: "text-amber-700",
    tagBorder: "border-amber-200",
  },
  green: {
    bubbleBg: "bg-green-100",
    bar: "bg-green-500",
    iconBg: "bg-green-50",
    tagBg: "bg-green-50",
    tagText: "text-green-700",
    tagBorder: "border-green-200",
  },
};

// ── How It Works ──────────────────────────────────────────────
export const howItWorksSteps = {
  teens: [
    "Daftar gratis dalam 2 menit",
    "Ceritakan harimu ke AI Diary",
    "Jawab Brave Choice Trivia",
    "Lihat perkembangan moodmu",
  ],
  parents: [
    "Terima undangan dari anak",
    "Akses laporan mood mingguan",
    "Pantau tren emosi tanpa privasi diary",
    "Dapat notifikasi jika ada risiko",
  ],
};

// ── Testimonials ──────────────────────────────────────────────
export const testimonials = [
  {
    quote:
      "TemanTumbuh benar-benar membantu aku memahami pola stres akademikku. Sekarang aku lebih tahu cara mengelolanya!",
    name: "Abdul Nurul Fikri",
    role: "Mahasiswa, 20 tahun",
    avatar:
      "https://images.unsplash.com/photo-1680265198350-e5a716d043ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGhhcHB5JTIwc3R1ZGVudCUyMGdyYWR1YXRpb24lMjBwcm91ZHxlbnwxfHx8fDE3NzQ5MzMwNTF8MA&ixlib=rb-4.1.0&q=80&w=200",
  },
  {
    quote:
      "Laporan berkala sangat membantu. Aku bisa tahu kondisi emosi anak tanpa menganggu privasinya.",
    name: "Sari Dewi",
    role: "Orang tua, Bandung",
    avatar:
      "https://images.unsplash.com/photo-1770872938168-c946eab8dc15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBkYXVnaHRlciUyMHdhcm0lMjBmYW1pbHklMjBsb3ZlJTIwYm9uZHxlbnwxfHx8fDE3NzQ5MzMwNTJ8MA&ixlib=rb-4.1.0&q=80&w=200",
  },
  {
    quote:
      "Fitur Brave Choice bikin aku mikir lebih dalam. Awalnya ragu, tapi ternyata asyik banget nulis diary di sini!",
    name: "Reza Pratama",
    role: "Remaja, 15 tahun",
    avatar:
      "https://images.unsplash.com/photo-1764032759724-22608ed91af8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc3R1ZGVudCUyMGNvbmZpZGVudCUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ5MzMwNTF8MA&ixlib=rb-4.1.0&q=80&w=200",
  },
];

// ── Hero images (for PolaroidCards) ──────────────────────────
export const heroImages = {
  img1: "https://images.unsplash.com/photo-1758272424285-32dde2c2548a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuYWdlJTIwZ2lybCUyMGpvdXJuYWxpbmclMjB3cml0aW5nJTIwcGVhY2VmdWwlMjBiZWRyb29tfGVufDF8fHx8MTc3NDkzMzA1MHww&ixlib=rb-4.1.0&q=80&w=400",
  img2: "https://images.unsplash.com/photo-1772724317387-7e763804b637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWVuJTIwZnJpZW5kcyUyMHNtaWxpbmclMjBoYXBweSUyMHN1cHBvcnRpdmUlMjBvdXRkb29yfGVufDF8fHx8MTc3NDkzMzA1MHww&ixlib=rb-4.1.0&q=80&w=400",
};

// ── Colour tokens (single source, re-exported for sections) ──
export const C = {
  bg0: "#FAFBFF",
  bg1: "#EEF4FB",
  bg2: "#E4EEFA",
  bg5: "#E8F7F3",
  bg6: "#D8F1EB",

  howBg: "#E0F5F0",
  howBgBot: "#D0EDE7",
  howCard: "#FFFFFF",
  howPanel: "#C8E8E2",
  howBorder: "#A8D4CC",

  teal: "#1A9688",
  tealMid: "#28B0A4",
  tealLight: "#4ECFC3",
  tealPale: "#A8E0DA",
  tealGhost: "#DDF5F2",

  green: "#1A9688",
  greenDeep: "#28B0A4",
  greenLight: "#4ECFC3",
  greenPale: "#A8E0DA",
  greenGhost: "#DDF5F2",

  gold: "#E0A030",
  goldPale: "#FDF0CC",

  textPrimary: "#1A2840",
  textSecondary: "#3A5068",
  textMuted: "#7090A8",
  textOnDark: "#EEF8FF",
  textSubOnDark: "#88C8D8",

  white: "#FFFFFF",
  border: "#C8DCED",
} as const;

// ── Bubble configs per section ────────────────────────────────
export type BubbleCfg = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  size: number;
  dur: number;
  delay: number;
  opacity: number;
  ay: number[];
  ax: number[];
  variant: "solid" | "outline";
  color: string;
};

export const heroBubbles: BubbleCfg[] = [
  {
    right: "-60px",
    top: "-60px",
    size: 320,
    dur: 16,
    delay: 0,
    opacity: 0.45,
    ay: [0, 20, -8, 0],
    ax: [0, -10, 4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-80px",
    bottom: "-80px",
    size: 280,
    dur: 12,
    delay: 1.5,
    opacity: 0.38,
    ay: [0, -18, 6, 0],
    ax: [0, 12, -4, 0],
    variant: "solid",
    color: C.greenPale,
  },
  {
    right: "40px",
    bottom: "60px",
    size: 120,
    dur: 9,
    delay: 0.5,
    opacity: 0.3,
    ay: [0, -14, 6, 0],
    ax: [0, -6, 3, 0],
    variant: "outline",
    color: C.tealPale,
  },
  {
    left: "60px",
    top: "80px",
    size: 100,
    dur: 11,
    delay: 2.5,
    opacity: 0.28,
    ay: [0, 16, -8, 0],
    ax: [0, 8, -4, 0],
    variant: "outline",
    color: C.tealMid,
  },
];

export const featuresBubbles: BubbleCfg[] = [
  {
    right: "-70px",
    top: "-50px",
    size: 260,
    dur: 13,
    delay: 0,
    opacity: 0.4,
    ay: [0, 18, -6, 0],
    ax: [0, -8, 3, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-60px",
    bottom: "-60px",
    size: 220,
    dur: 10,
    delay: 1,
    opacity: 0.35,
    ay: [0, -16, 6, 0],
    ax: [0, 8, -3, 0],
    variant: "solid",
    color: C.tealPale,
  },
  {
    right: "30px",
    bottom: "40px",
    size: 110,
    dur: 8,
    delay: 2,
    opacity: 0.28,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    left: "40px",
    top: "60px",
    size: 90,
    dur: 11,
    delay: 3,
    opacity: 0.25,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const purposeBubbles: BubbleCfg[] = [
  {
    left: "-80px",
    top: "-60px",
    size: 300,
    dur: 11,
    delay: 0.5,
    opacity: 0.4,
    ay: [0, 20, -6, 0],
    ax: [0, 14, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    right: "-60px",
    bottom: "-50px",
    size: 240,
    dur: 14,
    delay: 2,
    opacity: 0.35,
    ay: [0, -18, 6, 0],
    ax: [0, -10, 3, 0],
    variant: "solid",
    color: C.bg5,
  },
  {
    left: "50px",
    bottom: "50px",
    size: 120,
    dur: 9,
    delay: 0,
    opacity: 0.3,
    ay: [0, 16, -6, 0],
    ax: [0, -6, 2, 0],
    variant: "outline",
    color: C.tealLight,
  },
  {
    right: "50px",
    top: "70px",
    size: 100,
    dur: 8,
    delay: 3.5,
    opacity: 0.26,
    ay: [0, -14, 4, 0],
    ax: [0, 4, -2, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const howBubbles: BubbleCfg[] = [
  {
    right: "-70px",
    top: "-55px",
    size: 280,
    dur: 13,
    delay: 0,
    opacity: 0.42,
    ay: [0, 22, -8, 0],
    ax: [0, -14, 4, 0],
    variant: "solid",
    color: C.howPanel,
  },
  {
    left: "-60px",
    bottom: "-55px",
    size: 240,
    dur: 10,
    delay: 2,
    opacity: 0.38,
    ay: [0, -18, 6, 0],
    ax: [0, 10, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    right: "40px",
    bottom: "60px",
    size: 115,
    dur: 8,
    delay: 1,
    opacity: 0.28,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    left: "50px",
    top: "80px",
    size: 95,
    dur: 11,
    delay: 3,
    opacity: 0.25,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.teal,
  },
];

export const testiBubbles: BubbleCfg[] = [
  {
    right: "-60px",
    top: "-50px",
    size: 260,
    dur: 12,
    delay: 0,
    opacity: 0.4,
    ay: [0, -20, 8, 0],
    ax: [0, 10, -4, 0],
    variant: "solid",
    color: C.tealGhost,
  },
  {
    left: "-70px",
    bottom: "-60px",
    size: 220,
    dur: 9,
    delay: 1.5,
    opacity: 0.42,
    ay: [0, 18, -6, 0],
    ax: [0, 0, 0, 0],
    variant: "solid",
    color: C.bg6,
  },
  {
    left: "50px",
    top: "60px",
    size: 110,
    dur: 10,
    delay: 0,
    opacity: 0.28,
    ay: [0, 14, -6, 0],
    ax: [0, 6, -3, 0],
    variant: "outline",
    color: C.tealMid,
  },
  {
    right: "40px",
    bottom: "50px",
    size: 95,
    dur: 8,
    delay: 2.5,
    opacity: 0.26,
    ay: [0, -12, 4, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: C.tealLight,
  },
];

export const ctaBubbles: BubbleCfg[] = [
  {
    right: "-80px",
    top: "-70px",
    size: 320,
    dur: 14,
    delay: 0,
    opacity: 0.12,
    ay: [0, 24, -8, 0],
    ax: [0, -16, 6, 0],
    variant: "solid",
    color: "#ffffff",
  },
  {
    left: "-80px",
    bottom: "-70px",
    size: 280,
    dur: 11,
    delay: 1.5,
    opacity: 0.1,
    ay: [0, -20, 0, 0],
    ax: [0, 14, 0, 0],
    variant: "solid",
    color: "#ffffff",
  },
  {
    right: "60px",
    bottom: "60px",
    size: 140,
    dur: 9,
    delay: 0.5,
    opacity: 0.18,
    ay: [0, -14, 6, 0],
    ax: [0, -4, 2, 0],
    variant: "outline",
    color: "rgba(255,255,255,0.55)",
  },
  {
    left: "60px",
    top: "70px",
    size: 120,
    dur: 12,
    delay: 2,
    opacity: 0.16,
    ay: [0, 16, -6, 0],
    ax: [0, 4, -2, 0],
    variant: "outline",
    color: "rgba(255,255,255,0.5)",
  },
];
