# Testing TemanTumbuh

Folder `tests` berisi automated test untuk memastikan fitur utama TemanTumbuh tetap berjalan sebelum perubahan dipush. Test dibagi berdasarkan level: API route, service/helper, non-functional requirement, dan browser E2E.

## Struktur

| Folder | Isi |
| --- | --- |
| `api/` | Unit/integration-style test untuk Next.js API routes, termasuk auth helper route, baseline, diary, mood, insight, payment, parent consent/report, subscription, dan admin. |
| `lib/` | Unit test untuk service layer, validation schema, encryption, redirect helper, prompt/LLM helper, PDF report, baseline, diary, mood, insight, dan subscription. |
| `nfr/` | Test non-functional requirement yang bisa diverifikasi lokal lewat Vitest, misalnya konfigurasi keamanan dan requirement teknis. |
| `e2e/` | Playwright smoke test untuk auth guard, MVP flow, browser compatibility, dan security headers. |

## Command Utama

Jalankan dari root project:

```bash
corepack pnpm test
corepack pnpm test:coverage
corepack pnpm test:e2e
```

## Vitest

`corepack pnpm test` menjalankan semua file dengan pola:

```text
tests/**/*.test.ts
tests/**/*.test.tsx
```

Konfigurasi ada di `vitest.config.mts`.

Catatan penting:

- Environment default adalah `node`.
- Alias `@` diarahkan ke `src`.
- Mock `server-only` diarahkan ke `__mocks__/server-only.ts`.
- Script `pretest` menjalankan `prisma generate`, jadi dependency Prisma harus sehat sebelum test berjalan.

## Coverage

`corepack pnpm test:coverage` memakai V8 coverage dengan threshold:

| Metric | Threshold |
| --- | ---: |
| Statements | 90% |
| Branches | 80% |
| Functions | 90% |
| Lines | 90% |

Coverage difokuskan pada API route dan service/helper kritis yang tercantum di `vitest.config.mts`.

## Playwright E2E

`corepack pnpm test:e2e` menjalankan test di:

| Project | Browser/Device |
| --- | --- |
| `chromium` | Desktop Chrome |
| `webkit` | Desktop Safari/WebKit |
| `mobile-chrome` | Pixel 7 |

Konfigurasi ada di `playwright.config.ts`.

Playwright akan menjalankan dev server:

```bash
corepack pnpm dev --hostname 127.0.0.1 --port 3000
```

Base URL E2E adalah:

```text
http://127.0.0.1:3000
```

Report lokal akan dibuat di `playwright-report/`, sedangkan failure artifacts berada di `test-results/`. Keduanya sudah diabaikan oleh `.gitignore`.

## Checklist Sebelum Push

- `corepack pnpm lint`
- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm test:e2e` untuk perubahan yang menyentuh UI/route/auth/layout.
- Jika menjalankan `corepack pnpm exec tsc --noEmit`, pastikan test mock tetap cocok dengan type service yang dipakai.

## Troubleshooting

- Jika `pnpm` tidak dikenali, gunakan `corepack pnpm ...`.
- Jika Vitest gagal sebelum test berjalan karena Prisma, jalankan `corepack pnpm install` lalu `corepack pnpm generate`.
- Jika Playwright gagal karena browser belum tersedia, install browser Playwright sesuai instruksi output CLI.
- Jika E2E WebKit gagal pada redirect guard dengan URL sempat tetap di halaman protected, cek apakah test menunggu redirect client/server guard dengan cukup stabil.
