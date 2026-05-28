# Evaluasi Eksternal - Retrospective Think Aloud

Dokumen ini menempatkan hasil Retrospective Think Aloud sebagai evaluasi eksternal. Bug report section sengaja diletakkan sebelum analisis akhir agar temuan aplikasi terlihat dulu dan bisa langsung diturunkan menjadi upaya perbaikan.

## Tujuan

Evaluasi dilakukan untuk mengetahui apakah pengguna dapat menyelesaikan alur MVP TemanTumbuh dengan jelas, aman, dan minim kebingungan. Fokus evaluasi adalah hambatan nyata yang muncul saat pengguna mencoba fitur, bukan hanya penilaian kepuasan di akhir.

## Metode

Metode yang digunakan adalah Retrospective Think Aloud. Responden menjalankan skenario penggunaan terlebih dahulu, lalu setelah sesi selesai responden diminta menceritakan ulang apa yang dipikirkan, bagian yang membingungkan, dan alasan tindakan yang dilakukan. Catatan evaluator digunakan untuk mengubah temuan menjadi bug report.

## Cakupan Skenario MVP

| Kode | Fungsi MVP | Skenario Evaluasi |
|---|---|---|
| F001 | Social Auth | Responden menemukan opsi masuk/daftar dengan Google. |
| F002 | Registrasi User | Responden mencoba membuat akun manual dan memahami validasi form. |
| F003 | Login User | Responden mencoba login manual dan memahami pesan error. |
| F004 | Kelola Profil | Responden menemukan halaman profil dan memahami aksi edit profil. |
| F005 | Update Security | Responden menemukan alur lupa password/ganti password. |
| F006 | Baseline Questions | Responden memahami pertanyaan awal dan tombol lanjut/simpan. |
| F007 | Mood Check-In | Responden memilih mood dan mengisi catatan maksimal 100 kata. |
| F008 | Manage Parent Email | Responden menemukan input email orang tua dan memahami status verifikasi. |
| F009 | User Dashboard | Responden membaca statistik, streak, dan navigasi utama. |
| F010 | Safe Diary | Responden membuka ruang diary dan mencoba mengirim pesan. |
| F011 | Brave Choice | Responden menemukan kuis Brave Choice dari area Safe Diary. |

## Bug Report Section

Gunakan tabel ini untuk memasukkan temuan dari sesi presentasi atau sesi responden. Kolom severity dapat menggunakan High, Medium, atau Low.

| ID Bug | Fungsi | Severity | Langkah Reproduksi | Hasil Aktual | Hasil yang Diharapkan | Upaya Perbaikan | Status |
|---|---|---|---|---|---|---|---|
| BUG-001 | Fxxx - Nama Fungsi | High/Medium/Low | 1. Buka ... 2. Klik ... | Jelaskan perilaku aplikasi yang terjadi. | Jelaskan perilaku yang seharusnya. | Jelaskan rencana/fix yang dilakukan. | Open/In Progress/Fixed |

## Catatan Retrospektif Responden

| Responden | Skenario | Kutipan/Parafrase Think Aloud | Interpretasi Evaluator |
|---|---|---|---|
| R1 | Fxxx | "..." | ... |

## Ringkasan Temuan

Ringkasan dibuat setelah bug report terisi. Kelompokkan temuan berdasarkan tema, misalnya validasi form, navigasi, keterbacaan, feedback setelah submit, dan pemahaman fitur premium/non-premium.

## Rekomendasi Perbaikan

Prioritaskan perbaikan yang menghambat penyelesaian alur MVP. Temuan high severity diperbaiki terlebih dahulu, disusul medium severity yang memengaruhi kejelasan dan kenyamanan pengguna.
