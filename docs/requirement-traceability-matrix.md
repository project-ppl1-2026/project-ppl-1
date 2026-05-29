# Requirement Traceability Matrix

Dokumen ini memisahkan test yang wajib karena kebutuhan Doktek dari test pendukung implementasi. Endpoint mengikuti backend route aktual yang dipakai aplikasi.

| Requirement | Endpoint / Flow Resmi | Test Utama | Status |
| --- | --- | --- | --- |
| Auth helper email | `POST /api/auth/check-email` | `tests/api/auth.test.ts` | Covered |
| Post-login redirect | `GET /api/auth/post-login-status` | `tests/api/auth.test.ts`, `tests/e2e/auth-and-guards.spec.ts` | Covered |
| Auth manual/social/password | `/api/auth/*` via Better Auth | `tests/e2e/auth-and-guards.spec.ts` untuk validasi UI dan guard awal | Partial; flow provider/session penuh perlu test integrasi Better Auth |
| Baseline assessment | `GET/POST/PATCH /api/baseline` | `tests/api/baseline.test.ts`, `tests/lib/baseline.service.test.ts` | Covered, termasuk aturan 8 jawaban |
| Mood check-in | `GET/POST /api/mood`, `PATCH /api/mood/streak` | `tests/api/mood/route.test.ts`, `tests/api/mood/streak/route.test.ts`, `tests/lib/mood/service.test.ts` | Covered, termasuk note maksimal 100 kata |
| TemanCerita diary | `GET /api/diary`, `GET /api/diary/count`, `GET /api/diary/:entryId/messages`, `POST /api/diary/chat/stream` | `tests/api/diary.test.ts`, `tests/api/diary-chat-stream.test.ts`, `tests/lib/diary/*` | Covered |
| BraveChoice | `GET/POST /api/diary/brave-choice`, status, stats, reset | `tests/api/brave-choice.test.ts` | Covered untuk user login; keputusan premium gating perlu finalisasi Doktek |
| Parent consent | `GET/POST /api/parent-consent`, `GET /api/parent/status` | `tests/api/parent-consent.test.ts`, `tests/api/parent.test.ts` | Covered |
| Parent report PDF | `POST /api/parent-report/send` | `tests/api/parent-report.test.ts`, `tests/lib/parent-report/pdf.test.ts` | Covered untuk API dan PDF buffer; email sandbox end-to-end belum |
| Payment create/cancel/webhook | `POST /api/payment/create`, `POST /api/payment/cancel`, `POST /api/payment/notification` | `tests/api/payment.test.ts`, `tests/api/payment-cancel-notification.test.ts` | Covered; Doktek harus memakai `/api/payment/notification`, bukan `/api/api/payment/webhook` |
| Subscription status | `GET /api/subscription/status` | `tests/api/subscription.test.ts`, `tests/lib/subscription/service.test.ts` | Covered |
| Insight Dashboard | `GET /api/insight`, `POST /api/insight/generate` | `tests/api/insight.test.ts`, `tests/lib/insight/service.test.ts` | Covered untuk API, premium gating, dan privacy guard output |
| Admin Overview/Users/Quiz | `GET /api/admin/overview`, `GET /api/admin/users`, `GET /api/admin/quiz` | `tests/api/admin.test.ts`, `tests/e2e/auth-and-guards.spec.ts` | Covered untuk 401/403/200 API dan unauth route guard |
| Cron parent report | `GET/POST /api/cron/weekly-parent-reports` | Belum ada dedicated test | Pending jika cron menjadi requirement evaluasi utama |
| Non-functional | Security headers, email verification, trusted Google linking, privacy guard, performance budget lokal, browser compatibility | `tests/nfr/non-functional-requirements.test.ts`, `tests/e2e/nfr-smoke.spec.ts`, privacy/encryption unit tests | Covered untuk automated local NFR; load test produksi, uptime monitoring, dan pentest tetap perlu workflow terpisah |

Catatan koreksi Doktek:
- Payment webhook resmi aplikasi adalah `POST /api/payment/notification`.
- TemanCerita menggunakan tabel `diary` dan `diary_message`, bukan `stories`.
- Endpoint support yang dipakai aplikasi seperti `/api/diary/count`, `/api/diary/chat/stream`, `/api/insight/*`, `/api/parent-report/send`, dan `/api/payment/cancel` perlu tercatat jika dianggap API resmi.
