import type { ActionPriority, DayInsight, InsightMap } from "./insight-types";

export const TODAY_DATE = "2026-04-01";

export const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const BASE_INSIGHT_BY_DATE: InsightMap = {
  "2026-03-29": {
    mood: 5,
    reflection:
      "Hari ini terasa cukup menyenangkan. Aktivitas yang kamu lakukan membantu mood naik dan bikin kamu terasa lebih lega.",
    pattern:
      "Saat kamu masih punya ruang untuk melakukan hal yang kamu suka, perasaanmu cenderung lebih stabil.",
    affirmation:
      '"Saat kamu memberi ruang untuk hal yang kamu nikmati, pikiranmu ikut terasa lebih ringan."',
    actions: [
      {
        priority: "High",
        label: "Pertahankan aktivitas yang bikin nyaman",
        desc: "Usahakan tetap ada waktu untuk kegiatan yang terbukti bikin kamu merasa lebih baik.",
      },
      {
        priority: "Medium",
        label: "Simpan momen baik hari ini",
        desc: "Catat atau foto hal kecil yang bikin kamu senang supaya bisa kamu ingat lagi nanti.",
      },
      {
        priority: "Low",
        label: "Amati pola yang bikin tenang",
        desc: "Perhatikan kegiatan apa yang paling sering membantu kamu merasa lebih nyaman.",
      },
    ],
  },
  "2026-03-30": {
    mood: 3,
    reflection:
      "Kemarin terasa cukup berat. Pikiran soal tugas dan hasilnya bikin mood ikut turun, tapi kamu tetap berusaha jalan terus.",
    pattern:
      "Kamu cenderung menilai diri dari hasil akhir. Padahal usahamu juga penting, walau belum selalu terasa.",
    affirmation:
      '"Pelan-pelan juga tetap maju. Kamu tidak harus selalu sempurna untuk tetap dianggap berkembang."',
    actions: [
      {
        priority: "High",
        label: "Bagi tugas jadi bagian kecil",
        desc: "Pecah tugas besar jadi langkah kecil supaya terasa lebih ringan dijalani.",
      },
      {
        priority: "Medium",
        label: "Istirahat di sela belajar",
        desc: "Jeda singkat bisa bantu pikiran tetap fokus dan tidak cepat penuh.",
      },
      {
        priority: "Low",
        label: "Tidur lebih cukup malam ini",
        desc: "Istirahat yang cukup bisa bantu badan dan pikiran lebih stabil besok.",
      },
    ],
  },
  "2026-03-31": {
    mood: 4,
    reflection:
      "Hari ini sempat bikin tegang di awal, tapi akhirnya bisa kamu lewati dengan cukup baik. Rasa cemas pelan-pelan berubah jadi lega.",
    pattern:
      "Yang paling sering bikin berat ternyata bukan situasinya, tapi rasa takut sebelum mulai.",
    affirmation:
      '"Kamu tidak selalu harus siap sepenuhnya untuk bisa mulai melangkah."',
    actions: [
      {
        priority: "High",
        label: "Cerita ke orang yang kamu percaya",
        desc: "Saat pikiran terasa penuh, ngobrol bisa bantu beban terasa lebih ringan.",
      },
      {
        priority: "Medium",
        label: "Tenangkan diri sebelum mulai",
        desc: "Tarik napas pelan beberapa kali sebelum tugas penting supaya badan tidak terlalu tegang.",
      },
      {
        priority: "Low",
        label: "Catat hal yang berhasil hari ini",
        desc: "Tulis 2–3 hal kecil yang berjalan baik supaya kamu lebih sadar bahwa kamu berkembang.",
      },
    ],
  },
};

export const PRIORITY_STYLE: Record<
  ActionPriority,
  { label: string; bg: string; text: string; ring: string; panel: string }
> = {
  High: {
    label: "Prioritas tinggi",
    bg: "#FFF1F2",
    text: "#BE123C",
    ring: "#FBCFE8",
    panel: "#FFF8F9",
  },
  Medium: {
    label: "Prioritas sedang",
    bg: "#FFF8EB",
    text: "#B45309",
    ring: "#FDE68A",
    panel: "#FFFCF5",
  },
  Low: {
    label: "Prioritas ringan",
    bg: "#ECFDF5",
    text: "#047857",
    ring: "#A7F3D0",
    panel: "#F7FEFB",
  },
};

export function buildGeneratedInsight(): Omit<DayInsight, "date"> {
  return {
    mood: 4,
    reflection:
      "Hari ini kamu terlihat lebih tenang dibanding beberapa hari sebelumnya. Ada momen yang sempat bikin penuh, tapi kamu masih bisa mengembalikan fokus dengan cukup baik.",
    pattern:
      "Saat kamu tidak terlalu menekan diri untuk langsung sempurna, perasaanmu cenderung lebih stabil dan lebih mudah diarahkan.",
    affirmation: '"Hari ini tidak harus sempurna untuk tetap terasa berarti."',
    actions: [
      {
        priority: "High",
        label: "Pertahankan ritme yang terasa ringan",
        desc: "Lanjutkan hal-hal kecil yang tadi membantu kamu tetap tenang dan tidak terlalu kewalahan.",
      },
      {
        priority: "Medium",
        label: "Sisakan jeda sebelum berpindah aktivitas",
        desc: "Berhenti sebentar 3–5 menit bisa membantu pikiranmu lebih rapi sebelum lanjut ke hal berikutnya.",
      },
      {
        priority: "Low",
        label: "Catat satu hal baik hari ini",
        desc: "Satu catatan kecil cukup untuk mengingatkan bahwa harimu tetap punya progress.",
      },
    ],
  };
}
