import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";
import playwrightConfig from "../../playwright.config";
import {
  diaryMessageSchema,
  loginSchema,
  moodCheckInSchema,
  registerSchema,
} from "@/lib/validations";

const sourcePath = (relativePath: string) =>
  fileURLToPath(new URL(`../../${relativePath}`, import.meta.url));

describe("Non-Functional Requirements", () => {
  describe("Security hardening", () => {
    it("NFR-SEC-001 mengaktifkan security headers untuk seluruh route", async () => {
      expect(nextConfig.headers).toBeTypeOf("function");

      const headerRules = await nextConfig.headers?.();
      const globalRule = headerRules?.find((rule) => rule.source === "/:path*");
      const headers = new Map(
        globalRule?.headers.map((header) => [header.key, header.value]),
      );

      expect(headers.get("Strict-Transport-Security")).toContain(
        "includeSubDomains",
      );
      expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(headers.get("X-Frame-Options")).toBe("DENY");
      expect(headers.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headers.get("Permissions-Policy")).toContain("camera=()");
    });

    it("NFR-SEC-002 mengharuskan email verification untuk registrasi manual", () => {
      const authSource = readFileSync(sourcePath("src/lib/auth.ts"), "utf8");

      expect(authSource).toContain("emailAndPassword");
      expect(authSource).toContain("requireEmailVerification: true");
      expect(authSource).toContain("sendVerificationEmail");
    });

    it("NFR-SEC-003 membatasi implicit account linking ke provider Google yang dipercaya", () => {
      const authSource = readFileSync(sourcePath("src/lib/auth.ts"), "utf8");

      expect(authSource).toContain("accountLinking");
      expect(authSource).toContain('trustedProviders: ["google"]');
      expect(authSource).toContain("disableImplicitLinking: false");
    });
  });

  describe("Privacy and data protection", () => {
    it("NFR-PRV-001 mengenkripsi konten diary melalui utility encrypt/decrypt", () => {
      const encryptionSource = readFileSync(
        sourcePath("src/lib/encryption.ts"),
        "utf8",
      );
      const diaryServiceSource = readFileSync(
        sourcePath("src/lib/diary/service.ts"),
        "utf8",
      );

      expect(encryptionSource).toContain("createCipheriv");
      expect(encryptionSource).toContain("createDecipheriv");
      expect(diaryServiceSource).toContain("encrypt(");
      expect(diaryServiceSource).toContain("decrypt(");
    });

    it("NFR-PRV-002 insight tidak boleh mengutip data diary atau note mentah", () => {
      const insightSource = readFileSync(
        sourcePath("src/lib/insight/service.ts"),
        "utf8",
      );

      expect(insightSource).toContain("makePrivacySafeText");
      expect(insightSource).toContain("sensitiveSources");
      expect(insightSource).toContain("Jangan memberi diagnosis");
      expect(insightSource).toContain("tanpa mengutip isi diary");
    });
  });

  describe("Reliability and validation", () => {
    it("NFR-REL-001 validasi input utama menolak payload tidak valid secara konsisten", () => {
      expect(
        loginSchema.safeParse({ email: "salah", password: "" }).success,
      ).toBe(false);
      expect(
        registerSchema.safeParse({
          name: "A",
          email: "email-salah",
          password: "pendek",
          confirmPassword: "beda",
          agreeToTerms: false,
        }).success,
      ).toBe(false);
      expect(moodCheckInSchema.safeParse({ moodLevel: 6 }).success).toBe(false);
      expect(diaryMessageSchema.safeParse({ messageText: "" }).success).toBe(
        false,
      );
    });

    it("NFR-PERF-001 validasi schema utama memenuhi budget performa lokal", () => {
      const start = performance.now();

      for (let i = 0; i < 1_000; i += 1) {
        loginSchema.safeParse({
          email: `user${i}@example.com`,
          password: "Password123",
        });
        moodCheckInSchema.safeParse({
          moodLevel: (i % 5) + 1,
          note: "Hari ini cukup stabil.",
        });
        diaryMessageSchema.safeParse({
          messageText: "Aku ingin cerita sebentar.",
        });
      }

      const elapsedMs = performance.now() - start;
      expect(elapsedMs).toBeLessThan(250);
    });
  });

  describe("Browser compatibility", () => {
    it("NFR-COMP-001 Playwright menjalankan smoke test di desktop dan mobile browser", () => {
      const projectNames = playwrightConfig.projects?.map(
        (project) => project.name,
      );

      expect(projectNames).toEqual(
        expect.arrayContaining(["chromium", "webkit", "mobile-chrome"]),
      );
    });
  });
});
