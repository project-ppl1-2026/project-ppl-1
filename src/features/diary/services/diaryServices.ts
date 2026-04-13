// ============================================================
//  src/features/diary/services/diaryServices.ts
// ============================================================

import type { DiaryEntry, ChatMessage, BraveChoiceQuiz } from "../types";

const MOCK_ENTRIES: DiaryEntry[] = [
  {
    id: "entry-1",
    date: "2026-04-13",
    dateLabel: "Senin, 13 Apr 2026",
    preview: "Hari ini aku merasa jauh lebih baik dari kemarin...",
    mood: 4,
    isToday: true,
  },
  {
    id: "entry-2",
    date: "2026-04-12",
    dateLabel: "Minggu, 12 Apr 2026",
    preview: "Presentasi tadi bikin aku deg-degan banget...",
    mood: 3,
  },
  {
    id: "entry-3",
    date: "2026-04-11",
    dateLabel: "Sabtu, 11 Apr 2026",
    preview: "Akhirnya bisa ngobrol sama mama soal ini...",
    mood: 5,
  },
  {
    id: "entry-4",
    date: "2026-04-10",
    dateLabel: "Jumat, 10 Apr 2026",
    preview: "Nggak terlalu produktif, tapi oke-oke aja...",
    mood: 3,
  },
  {
    id: "entry-5",
    date: "2026-04-09",
    dateLabel: "Kamis, 9 Apr 2026",
    preview: "Dapat nilai bagus di ujian fisika!",
    mood: 5,
  },
  {
    id: "entry-6",
    date: "2026-03-28",
    dateLabel: "Sabtu, 28 Mar 2026",
    preview: "Weekend yang melelahkan tapi menyenangkan!",
    mood: 4,
  },
  {
    id: "entry-7",
    date: "2026-03-27",
    dateLabel: "Jumat, 27 Mar 2026",
    preview: "Teman-teman sedikit nyebelin hari ini...",
    mood: 2,
  },
  {
    id: "entry-8",
    date: "2026-05-02",
    dateLabel: "Sabtu, 2 Mei 2026",
    preview: "Aku merasa lebih tenang minggu ini...",
    mood: 4,
  },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "ai",
    text: "Halo Clarisya! Selamat pagi 🌱 Ceritakan, bagaimana harimu dimulai hari ini?",
    time: "07.30",
  },
  {
    id: "msg-2",
    role: "user",
    text: "Pagi! Aku merasa agak cemas soal presentasi hari ini, tapi juga excited.",
    time: "07.32",
  },
  {
    id: "msg-3",
    role: "ai",
    text: "Cemas dan excited sekaligus — itu tanda kamu peduli dan siap. Apa yang paling bikin kamu deg-degan dari presentasi itu?",
    time: "07.32",
  },
  {
    id: "msg-4",
    role: "user",
    text: "Takut lupa materi di tengah-tengah, atau audience-nya nggak tertarik sama topikku.",
    time: "07.35",
  },
  {
    id: "msg-5",
    role: "ai",
    text: "Ketakutan itu sangat wajar. Coba ingat: satu hal yang sudah kamu persiapkan dengan baik untuk presentasi itu apa? Mulai dari sana, dan kamu akan menemukan kepercayaan dirimu 🌟",
    time: "07.35",
  },
];

const MOCK_QUIZ_POOL: BraveChoiceQuiz[] = [
  {
    id: "quiz-1",
    scenario:
      "Temanmu disudutkan di grup chat — meme memalukan disebarkan. Kamu yang pertama melihatnya. Semua diam.",
    options: [
      {
        label: "A",
        text: "Diam saja agar tidak jadi target berikutnya.",
        isBrave: false,
      },
      {
        label: "B",
        text: "Kirim pesan pribadi: 'Aku lihat itu. Aku di sini untukmu.'",
        isBrave: true,
      },
    ],
    explanationWrong:
      "Diam saat seseorang disakiti bukan netral — itu persetujuan pasif.",
    explanationRight:
      "Mendukung teman secara privat adalah tindakan keberanian yang nyata.",
  },
];

export async function getDiaryEntries(month: string): Promise<DiaryEntry[]> {
  await delay(350);
  return MOCK_ENTRIES.filter((entry) => entry.date.startsWith(month)).sort(
    (a, b) => (a.date < b.date ? 1 : -1),
  );
}

export async function getDiaryMessages(
  entryId: string,
): Promise<ChatMessage[]> {
  void entryId;
  await delay(250);
  return MOCK_MESSAGES;
}

export async function sendChatMessage(
  entryId: string,
  userMessage: string,
  history: ChatMessage[],
): Promise<string> {
  void entryId;
  void userMessage;
  void history;

  await delay(900);

  const mockReplies = [
    "Terima kasih sudah mau cerita. Bagaimana perasaanmu sekarang setelah menuliskannya? 🌿",
    "Itu insight yang bagus banget! Apa satu langkah kecil yang bisa kamu lakukan hari ini?",
    "Kamu sedang berkembang — terus ceritakan kalau mau, aku di sini mendengarkan 🌱",
    "Wajar banget kamu merasakan itu. Apa yang membuat kamu tetap semangat hari ini?",
    "Keren! Kamu sudah mengenali perasaanmu sendiri dengan baik. Itu skill penting banget lho ✨",
  ];

  return mockReplies[Math.floor(Math.random() * mockReplies.length)];
}

export async function getBraveChoiceQuiz(): Promise<BraveChoiceQuiz> {
  await delay(700);
  return MOCK_QUIZ_POOL[Math.floor(Math.random() * MOCK_QUIZ_POOL.length)];
}

export async function submitQuizAnswer(
  quizId: string,
  selectedLabel: string,
  isBrave: boolean,
): Promise<void> {
  void quizId;
  void selectedLabel;
  void isBrave;

  await delay(200);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
