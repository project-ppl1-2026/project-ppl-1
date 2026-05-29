# Non-Functional Requirement Testing

Dokumen ini merangkum test NFR yang ditambahkan agar janji non-fungsional bisa dicek lewat automated test.

| Kode | Aspek NFR | Bukti Test | Kriteria Pass |
|---|---|---|---|
| NFR-SEC-001 | Security headers | `tests/nfr/non-functional-requirements.test.ts`, `tests/e2e/nfr-smoke.spec.ts` | Aplikasi mengirim HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, dan Permissions-Policy. |
| NFR-SEC-002 | Email verification | `tests/nfr/non-functional-requirements.test.ts` | Registrasi manual mewajibkan verifikasi email. |
| NFR-SEC-003 | Social auth account linking | `tests/nfr/non-functional-requirements.test.ts` | Implicit account linking hanya untuk trusted provider Google. |
| NFR-PRV-001 | Data protection | `tests/nfr/non-functional-requirements.test.ts`, `tests/lib/encryption.test.ts` | Diary menggunakan encrypt/decrypt dan enkripsi sudah punya unit test. |
| NFR-PRV-002 | Privacy-safe insight | `tests/nfr/non-functional-requirements.test.ts`, `tests/lib/insight/service.test.ts` | Insight tidak mengutip note atau diary mentah. |
| NFR-REL-001 | Reliability validation | `tests/nfr/non-functional-requirements.test.ts` | Schema utama menolak payload invalid. |
| NFR-PERF-001 | Performance budget lokal | `tests/nfr/non-functional-requirements.test.ts`, `tests/e2e/nfr-smoke.spec.ts` | Validasi schema utama < 250 ms untuk 1000 iterasi dan halaman login render < 5 detik. |
| NFR-COMP-001 | Browser compatibility | `playwright.config.ts`, `tests/e2e/nfr-smoke.spec.ts` | Smoke test berjalan di Chromium, WebKit, dan mobile Chrome. |

Catatan batasan: test lokal ini belum menggantikan load test produksi, monitoring uptime, audit pentest, atau pengujian SMTP/Midtrans/OAuth end-to-end dengan kredensial asli.
