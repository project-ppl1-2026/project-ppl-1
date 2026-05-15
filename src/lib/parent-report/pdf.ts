import type { WeeklyParentReportData } from "./service";

type TextOptions = {
  bold?: boolean;
  size?: number;
  gapAfter?: number;
  width?: number;
  indent?: number;
};

type PdfPage = {
  commands: string[];
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 48;
const BOTTOM_MARGIN = 54;

function normalizePdfText(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      // Replace common unicode characters with ASCII equivalents
      .replace(/[\u2018\u2019\u201A]/g, "'")
      .replace(/[\u201C\u201D\u201E]/g, '"')
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2026]/g, "...")
      .replace(/[\u00A0]/g, " ")
      .replace(/[\u2022]/g, "-")
      .replace(/[\u00AB\u00BB]/g, '"')
      .replace(/[\u2039\u203A]/g, "'")
      .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "")
  );
}

function escapePdfText(value: string) {
  return normalizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number) {
  const words = normalizePdfText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length <= maxChars) {
      current = `${current} ${word}`;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

class SimplePdf {
  private pages: PdfPage[] = [{ commands: [] }];
  private y = PAGE_HEIGHT - MARGIN;

  private get page() {
    return this.pages[this.pages.length - 1]!;
  }

  addTitle(text: string) {
    this.addText(text, { bold: true, size: 22, gapAfter: 8 });
  }

  addSection(text: string) {
    this.ensureSpace(36);
    this.y -= 3;
    // Teal accent bar on the left
    this.page.commands.push(
      `0.102 0.588 0.533 rg ${MARGIN} ${this.y - 2} 3 16 re f`,
    );
    // Section text with offset for the accent bar
    this.addText(text, { bold: true, size: 13, gapAfter: 6, indent: 12 });
  }

  addBrandHeader() {
    // Teal header background
    this.page.commands.push(
      `0.078 0.286 0.286 rg 0 ${PAGE_HEIGHT - 60} ${PAGE_WIDTH} 60 re f`,
    );
    // Brand name in white
    this.page.commands.push(
      `1 1 1 rg BT /F2 9 Tf ${MARGIN + 4} ${PAGE_HEIGHT - 28} Td (TEMANTUMBUH) Tj ET`,
    );
    // Subtitle
    this.page.commands.push(
      `0.85 0.85 0.85 rg BT /F1 8 Tf ${MARGIN + 4} ${PAGE_HEIGHT - 42} Td (Laporan Mingguan Premium) Tj ET`,
    );
    this.y = PAGE_HEIGHT - 60 - 20;
  }

  addFooter() {
    const footerY = 30;
    // Teal line
    this.page.commands.push(
      `0.102 0.588 0.533 rg ${MARGIN} ${footerY + 14} ${PAGE_WIDTH - MARGIN * 2} 1 re f`,
    );
    // Footer text
    this.page.commands.push(
      `0.4 0.4 0.4 rg BT /F1 7 Tf ${MARGIN} ${footerY} Td (TemanTumbuh Premium - Menemani tumbuh kembang anak dengan aman. Laporan ini bersifat rahasia.) Tj ET`,
    );
  }

  addText(text: string, options: TextOptions = {}) {
    const size = options.size ?? 10;
    const lineHeight = Math.ceil(size * 1.35);
    const x = MARGIN + (options.indent ?? 0);
    const width =
      options.width ?? PAGE_WIDTH - MARGIN * 2 - (options.indent ?? 0);
    const maxChars = Math.max(16, Math.floor(width / (size * 0.52)));
    const lines = wrapText(text, maxChars);

    for (const line of lines) {
      this.ensureSpace(lineHeight);
      const font = options.bold ? "F2" : "F1";
      this.page.commands.push(
        `0 0 0 rg BT /${font} ${size} Tf ${x} ${this.y} Td (${escapePdfText(line)}) Tj ET`,
      );
      this.y -= lineHeight;
    }

    this.y -= options.gapAfter ?? 6;
  }

  addColoredText(
    text: string,
    r: number,
    g: number,
    b: number,
    options: TextOptions = {},
  ) {
    const size = options.size ?? 10;
    const lineHeight = Math.ceil(size * 1.35);
    const x = MARGIN + (options.indent ?? 0);
    const width =
      options.width ?? PAGE_WIDTH - MARGIN * 2 - (options.indent ?? 0);
    const maxChars = Math.max(16, Math.floor(width / (size * 0.52)));
    const lines = wrapText(text, maxChars);

    for (const line of lines) {
      this.ensureSpace(lineHeight);
      const font = options.bold ? "F2" : "F1";
      this.page.commands.push(
        `${r} ${g} ${b} rg BT /${font} ${size} Tf ${x} ${this.y} Td (${escapePdfText(line)}) Tj ET`,
      );
      this.y -= lineHeight;
    }

    this.y -= options.gapAfter ?? 6;
  }

  addBullet(text: string) {
    this.addText(`- ${text}`, { indent: 10 });
  }

  addMoodBullet(text: string, score: number | null) {
    this.ensureSpace(18);
    const size = 10;
    const lineHeight = Math.ceil(size * 1.45);
    const maxChars = Math.max(
      16,
      Math.floor((PAGE_WIDTH - MARGIN * 2 - 30) / (size * 0.52)),
    );
    const lines = wrapText(text, maxChars);

    const lastLineY = this.y - (lines.length - 1) * lineHeight;

    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.page.commands.push(
        `0 0 0 rg BT /F1 ${size} Tf ${MARGIN + 10} ${this.y} Td (${escapePdfText(line)}) Tj ET`,
      );
      this.y -= lineHeight;
    }

    // Draw mood face right after the last line text (approximate text width + small gap)
    if (score !== null) {
      const lastLine = lines[lines.length - 1] ?? "";
      const approxTextWidth = lastLine.length * size * 0.52;
      const cx = MARGIN + 10 + approxTextWidth + 8;
      const cy = lastLineY + 3;
      const r = 5;
      const colors: Record<number, [number, number, number]> = {
        1: [0.937, 0.267, 0.267],
        2: [0.976, 0.451, 0.086],
        3: [0.918, 0.702, 0.031],
        4: [0.133, 0.773, 0.369],
        5: [0.063, 0.725, 0.506],
      };
      const [cr, cg, cb] = colors[score] ?? [0.5, 0.5, 0.5];
      const k = 0.5523;
      this.page.commands.push(
        `${cr} ${cg} ${cb} RG 0.9 w`,
        `${cx + r} ${cy} m`,
        `${cx + r} ${cy + r * k} ${cx + r * k} ${cy + r} ${cx} ${cy + r} c`,
        `${cx - r * k} ${cy + r} ${cx - r} ${cy + r * k} ${cx - r} ${cy} c`,
        `${cx - r * k} ${cy - r} ${cx - r} ${cy - r * k} ${cx} ${cy - r} c`,
        `${cx + r * k} ${cy - r} ${cx + r} ${cy - r * k} ${cx + r} ${cy} c`,
        `S`,
      );
      // Eyes
      this.page.commands.push(
        `${cr} ${cg} ${cb} rg`,
        `${cx - 2} ${cy + 1.5} 0.9 0.9 re f`,
        `${cx + 1.5} ${cy + 1.5} 0.9 0.9 re f`,
      );
      // Mouth
      if (score >= 4) {
        this.page.commands.push(
          `${cr} ${cg} ${cb} RG 0.6 w`,
          `${cx - 2.5} ${cy - 1.5} m ${cx - 1} ${cy - 3} ${cx + 1} ${cy - 3} ${cx + 2.5} ${cy - 1.5} c S`,
        );
      } else if (score === 3) {
        this.page.commands.push(
          `${cr} ${cg} ${cb} RG 0.6 w`,
          `${cx - 2} ${cy - 2} m ${cx + 2} ${cy - 2} l S`,
        );
      } else {
        this.page.commands.push(
          `${cr} ${cg} ${cb} RG 0.6 w`,
          `${cx - 2.5} ${cy - 3} m ${cx - 1} ${cy - 1.5} ${cx + 1} ${cy - 1.5} ${cx + 2.5} ${cy - 3} c S`,
        );
      }
    }

    this.y -= 4;
  }

  addDivider() {
    this.ensureSpace(16);
    this.page.commands.push(
      `0.102 0.588 0.533 rg ${MARGIN} ${this.y} ${PAGE_WIDTH - MARGIN * 2} 0.5 re f`,
    );
    this.y -= 18;
  }

  toBuffer() {
    // Add footer to all pages
    for (const page of this.pages) {
      const footerY = 30;
      page.commands.push(
        `0.102 0.588 0.533 rg ${MARGIN} ${footerY + 14} ${PAGE_WIDTH - MARGIN * 2} 0.5 re f`,
      );
      page.commands.push(
        `0.4 0.4 0.4 rg BT /F1 7 Tf ${MARGIN} ${footerY} Td (TemanTumbuh Premium - Menemani tumbuh kembang anak dengan aman.) Tj ET`,
      );
    }

    const objects: string[] = [];
    const pageObjectIds = this.pages.map((_, index) => 5 + index * 2);

    objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${this.pages.length} >>`;
    objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

    this.pages.forEach((page, index) => {
      const pageObjectId = 5 + index * 2;
      const contentObjectId = pageObjectId + 1;
      const content = page.commands.join("\n");
      const contentLength = Buffer.byteLength(content, "latin1");

      objects[pageObjectId - 1] =
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
      objects[contentObjectId - 1] =
        `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`;
    });

    let output = "%PDF-1.4\n";
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets[index + 1] = Buffer.byteLength(output, "latin1");
      output += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = Buffer.byteLength(output, "latin1");
    output += `xref\n0 ${objects.length + 1}\n`;
    output += "0000000000 65535 f \n";
    for (let i = 1; i <= objects.length; i++) {
      output += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(output, "latin1");
  }

  private ensureSpace(height: number) {
    if (this.y - height >= BOTTOM_MARGIN) {
      return;
    }

    this.pages.push({ commands: [] });
    this.y = PAGE_HEIGHT - MARGIN;
  }
}

export function generatePremiumWeeklyReportPdf(report: WeeklyParentReportData) {
  const pdf = new SimplePdf();

  // ─── Branded Header ───
  pdf.addBrandHeader();
  pdf.addText("", { gapAfter: 6 });

  pdf.addTitle(`Kabar Mingguan ${report.childName}`);
  pdf.addText(`Anak: ${report.childName}`, {
    bold: true,
    size: 11,
    gapAfter: 4,
  });
  pdf.addText(`Periode: ${report.period.periodLabel}`, {
    size: 11,
    gapAfter: 4,
  });
  pdf.addText(`Dibuat: ${report.generatedAtLabel}`, { size: 10, gapAfter: 12 });
  pdf.addDivider();
  pdf.addText("", { gapAfter: 8 });

  // ─── Cerita Minggu Ini ───
  pdf.addSection("Cerita Minggu Ini");
  pdf.addText(report.moodSummary.conclusion);
  pdf.addText(report.moodSummary.trend);
  pdf.addText(report.moodSummary.guidance);
  pdf.addColoredText(
    `Rata-rata mood: ${report.moodSummary.average}/5 (${report.moodSummary.averageLabel}).`,
    0.102,
    0.588,
    0.533,
    { bold: true },
  );

  // ─── Catatan Harian ───
  pdf.addSection("Catatan Harian");
  for (const day of report.days) {
    const moodText =
      day.score === null
        ? "Belum ada mood tercatat"
        : `${day.moodLabel} (${day.score}/5)`;
    pdf.addMoodBullet(
      `${day.dayName}, ${day.dateLabel}: ${moodText}`,
      day.score,
    );
  }
  pdf.addText("", { gapAfter: 8 });

  // ─── Hal yang Terlihat ───
  pdf.addSection("Hal yang Terlihat");
  pdf.addText("Hal yang tampak minggu ini:", { bold: true, gapAfter: 4 });
  pdf.addText(
    report.premiumSummary?.summary ??
      "Belum ada catatan pendamping tambahan pada periode ini.",
  );
  pdf.addText("Pola yang perlu diperhatikan:", { bold: true, gapAfter: 4 });
  pdf.addText(
    report.premiumSummary?.patternSummary ??
      "Pola yang lebih rinci belum terlihat pada periode ini.",
  );

  // ─── Catatan Tambahan per Hari ───
  if (report.insights.length) {
    pdf.addSection("Catatan Tambahan per Hari");
    for (const insight of report.insights) {
      pdf.addColoredText(
        `${insight.dayName}, ${insight.dateLabel}`,
        0.102,
        0.588,
        0.533,
        {
          bold: true,
          size: 11,
          gapAfter: 6,
        },
      );
      pdf.addText("Yang terlihat:", { bold: true, gapAfter: 2 });
      pdf.addText(insight.reflection || "Belum tersedia.", { gapAfter: 8 });
      pdf.addText("Pola:", { bold: true, gapAfter: 2 });
      pdf.addText(insight.pattern || "Belum tersedia.", { gapAfter: 8 });
      if (insight.affirmation) {
        pdf.addText("Kalimat penguat:", { bold: true, gapAfter: 2 });
        pdf.addText(`"${insight.affirmation}"`, { gapAfter: 8 });
      }
      if (insight.actions.length) {
        pdf.addText("Rekomendasi:", { bold: true, gapAfter: 4 });
        for (const action of insight.actions) {
          pdf.addText(`${action.priorityLabel} - ${action.label}`, {
            bold: true,
            indent: 10,
            gapAfter: 2,
          });
          pdf.addText(action.desc, { indent: 10, gapAfter: 6 });
        }
      }
      pdf.addText("", { gapAfter: 12 });
    }
  }

  return pdf.toBuffer();
}
