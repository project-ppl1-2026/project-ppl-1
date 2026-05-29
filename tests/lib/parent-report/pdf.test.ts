import { describe, expect, it } from "vitest";

import { generatePremiumWeeklyReportPdf } from "@/lib/parent-report/pdf";
import type { WeeklyParentReportData } from "@/lib/parent-report/service";

function createReport(): WeeklyParentReportData {
  return {
    childName: "Budi",
    parentEmail: "ortu@example.com",
    timezone: "Asia/Jakarta",
    generatedAtLabel: "Senin, 25 Mei 2026 pukul 09.00",
    period: {
      startKey: "2026-05-17",
      endKey: "2026-05-23",
      dataEndKey: "2026-05-23",
      periodLabel: "17 Mei - 23 Mei 2026",
      dataRangeLabel: "17 Mei - 23 Mei 2026",
    },
    days: [
      {
        dateKey: "2026-05-20",
        dayName: "Rabu",
        dateLabel: "20 Mei 2026",
        score: 2,
        moodLabel: "Sedih",
      },
    ],
    moodSummary: {
      average: 2,
      averageLabel: "Perlu dijaga",
      filledDays: 1,
      missingDays: 6,
      conclusion:
        "Minggu ini suasana hati anak tampak lebih berat dan perlu ditemani.",
      trend: "Menjelang akhir data, suasana hati terlihat menurun.",
      guidance:
        "Mulai dengan pertanyaan ringan dan beri ruang aman untuk menjawab.",
    },
    insights: [
      {
        dateKey: "2026-05-20",
        dayName: "Rabu",
        dateLabel: "20 Mei 2026",
        mood: 2,
        reflection:
          "Ada tekanan sosial yang membuat anak membutuhkan dukungan.",
        pattern: "Cenderung menahan emosi sebelum bercerita.",
        affirmation: "Kamu tidak harus menghadapi semuanya sendirian.",
        actions: [
          {
            priorityLabel: "Prioritas tinggi",
            label: "Cari orang dewasa tepercaya",
            desc: "Ajak anak memilih satu orang dewasa yang aman untuk diajak bicara.",
          },
        ],
      },
    ],
    hasData: true,
    premiumSummary: {
      summary:
        "Hal yang tampak minggu ini adalah anak membutuhkan dukungan emosional.",
      patternSummary:
        "Pola yang perlu diperhatikan adalah kecenderungan menahan emosi.",
    },
  };
}

describe("generatePremiumWeeklyReportPdf", () => {
  it("Harus menghasilkan buffer PDF valid berisi ringkasan mingguan", () => {
    const pdf = generatePremiumWeeklyReportPdf(createReport());
    const content = pdf.toString("latin1");

    expect(pdf.subarray(0, 8).toString("latin1")).toBe("%PDF-1.4");
    expect(content).toContain("Kabar Mingguan Budi");
    expect(content).toContain("Periode: 17 Mei - 23 Mei 2026");
    expect(content).toContain("Rata-rata mood: 2/5");
    expect(content).toContain("Catatan Harian");
  });

  it("Harus memakai insight aman dan tidak memuat isi diary/chat mentah", () => {
    const report = createReport();
    const privateDiaryText =
      "Aku dibully oleh Danu di kantin sekolah jam istirahat";

    const pdf = generatePremiumWeeklyReportPdf({
      ...report,
      premiumSummary: {
        summary:
          "Hal yang tampak minggu ini adalah anak membutuhkan dukungan emosional.",
        patternSummary:
          "Pola yang perlu diperhatikan adalah kecenderungan menahan emosi.",
      },
      insights: [
        {
          ...report.insights[0]!,
          reflection:
            "Ada tekanan sosial yang membuat anak membutuhkan dukungan.",
        },
      ],
    });
    const content = pdf.toString("latin1");

    expect(content).not.toContain(privateDiaryText);
    expect(content).not.toContain("Danu");
    expect(content).not.toContain("kantin sekolah");
  });
});
