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
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "?");
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
    this.ensureSpace(46);
    this.page.commands.push(
      `0.78 0.78 0.78 rg ${MARGIN} ${this.y} ${PAGE_WIDTH - MARGIN * 2} 1 re f`,
    );
    this.y -= 16;
    this.addText(text, { bold: true, size: 14, gapAfter: 8 });
  }

  addText(text: string, options: TextOptions = {}) {
    const size = options.size ?? 10;
    const lineHeight = Math.ceil(size * 1.45);
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

    this.y -= options.gapAfter ?? 3;
  }

  addBullet(text: string) {
    this.addText(`- ${text}`, { indent: 10 });
  }

  addDivider() {
    this.ensureSpace(16);
    this.page.commands.push(
      `0.72 0.72 0.72 rg ${MARGIN} ${this.y} ${PAGE_WIDTH - MARGIN * 2} 1 re f`,
    );
    this.y -= 18;
  }

  toBuffer() {
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

  pdf.addText("TemanTumbuh", { bold: true, size: 11, gapAfter: 4 });
  pdf.addTitle(`Kabar Mingguan ${report.childName}`);
  pdf.addText(`Anak: ${report.childName}`, { size: 11 });
  pdf.addText(`Periode: ${report.period.periodLabel}`, { size: 11 });
  pdf.addText(`Dibuat: ${report.generatedAtLabel}`, { size: 10 });
  pdf.addDivider();

  pdf.addSection("Cerita Minggu Ini");
  pdf.addText(report.moodSummary.conclusion);
  pdf.addText(report.moodSummary.trend);
  pdf.addText(report.moodSummary.guidance);
  pdf.addText(
    `Rata-rata mood: ${report.moodSummary.average}/5 (${report.moodSummary.averageLabel}).`,
    { bold: true },
  );

  pdf.addSection("Catatan Harian");
  for (const day of report.days) {
    const moodText =
      day.score === null
        ? "Belum ada mood tercatat"
        : `${day.moodLabel} (${day.score}/5)`;
    pdf.addBullet(`${day.dayName}, ${day.dateLabel}: ${moodText}`);
  }

  pdf.addSection("Hal yang Terlihat");
  pdf.addText(
    report.premiumSummary?.summary ??
      "Belum ada catatan pendamping tambahan pada periode ini.",
  );
  pdf.addText(
    report.premiumSummary?.patternSummary ??
      "Pola yang lebih rinci belum terlihat pada periode ini.",
  );

  if (report.insights.length) {
    pdf.addSection("Catatan Tambahan per Hari");
    for (const insight of report.insights) {
      pdf.addText(`${insight.dayName}, ${insight.dateLabel}`, {
        bold: true,
        size: 11,
        gapAfter: 3,
      });
      pdf.addText(`Yang terlihat: ${insight.reflection || "Belum tersedia."}`);
      pdf.addText(`Pola: ${insight.pattern || "Belum tersedia."}`);
      if (insight.affirmation) {
        pdf.addText(`Kalimat penguat: ${insight.affirmation}`);
      }
      for (const action of insight.actions) {
        pdf.addBullet(
          `${action.priorityLabel}: ${action.label} - ${action.desc}`,
        );
      }
    }
  }

  return pdf.toBuffer();
}
