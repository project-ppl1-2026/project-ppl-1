# GuardianAngel

## 🛡️ Product Overview: Guardian Angel AI

Platform perlindungan anak berbasis Next.js yang mengintegrasikan AI untuk deteksi dini trauma emosional dan pencocokan identitas korban hilang. Fokus utama: **Anonimitas, Keamanan Data (AES-256), dan UX yang tidak mencurigatif (Stealth Mode).**

---

## 🎯 Project Objectives & Success Indicators

### **General Objective**

Mendeploy aplikasi web yang fungsional dalam 5 bulan, mampu mendeteksi trauma teks dengan akurasi **>80%**, melakukan *face matching* di sisi klien, dan telah lulus uji coba oleh **30 tester**.

### **Success Indicators (KPIs)**

* **Sprint Progress:** Tiap 2 minggu ada fitur baru yang bisa di-demo (*Shippable feature*).
* **Performance:** Skor Lighthouse untuk *Performance* > 90 (LCP < 3 detik).
* **Reliability:** 0 kritis bug pada akhir bulan ke-5.
* **Security:** Hasil audit internal menunjukkan data sensitif di Supabase terenkripsi penuh.

---

## 🚀 5-Month Roadmap: What To Do (Action Plan)

### **Bulan 1: Setup Architecture & Auth**

**Objective:** Sistem bisa login, register, dan koneksi DB stabil.

* **Backend (2 Orang):**
* Setup Repo & Init Prisma dengan PostgreSQL Supabase.
* Konfigurasi **Better Auth** (Credentials & Social Login).
* Desain Schema Database (Tabel: User, Diary, Evidence, Identity).


* **Frontend (2 Orang):**
* Setup Next.js (App Router), Tailwind, & Shadcn/UI.
* Buat Layout Utama & Navigation (Stealth Mode/Quick Exit).
* Implementasi Auth Pages (Login/Register) & Protected Routes.


* **Sprint Indicator:** User bisa login dan masuk ke Dashboard kosong.

### **Bulan 2: Core Feature (Diary & Locker)**

**Objective:** Data sensitif bisa disimpan secara aman.

* **Backend (2 Orang):**
* Build Server Actions untuk CRUD Diary.
* Implementasi **AES-256 Encryption** pada kolom isi diari sebelum masuk DB.
* Setup Supabase Storage Bucket dengan RLS (Row Level Security).


* **Frontend (2 Orang):**
* Build UI "Healing Diary" (Rich Text Editor sederhana).
* Build "Secure Locker" (Upload interface dengan preview).
* Integrasi integrasi API/Actions untuk simpan data ke BE.


* **Sprint Indicator:** User bisa simpan diari terenkripsi dan upload file ke locker.

### **Bulan 3: AI Intelligence (The "Brain")**

**Objective:** AI berfungsi secara fungsional.

* **Backend (2 Orang):**
* Integrasi OpenAI API (GPT-4o mini) untuk *Sentiment Analysis*.
* Buat logic "High Alert": Jika score trauma tinggi, set flag di DB.
* Optimasi prompt untuk deteksi tanda-tanda kekerasan pada anak.


* **Frontend (2 Orang):**
* Implementasi **TensorFlow.js / Face-api.js** untuk fitur Angel Matcher.
* Buat UI Scanner Wajah (Camera akses & matching progress).
* Visualisasi Mood Tracker berdasarkan data dari AI Backend.


* **Sprint Indicator:** Diari yang ditulis muncul skor emosinya; Pencarian wajah berfungsi di browser.

### **Bulan 4: Admin Dashboard & Payment**

**Objective:** NGO bisa melihat data dan user bisa berdonasi.

* **Backend (2 Orang):**
* Integrasi **Midtrans API** (Donasi & Konseling).
* Build Admin API untuk statistik kasus (Data agregat).
* Security hardening (Rate limiting & Sentry logging).


* **Frontend (2 Orang):**
* Build Admin Dashboard (Charts & Heatmap sebaran kasus).
* Integrasi Payment Gateway (Checkout UI).
* Refining UI ramah anak (Kid-friendly design polish).


* **Sprint Indicator:** Donasi berhasil via Midtrans; Admin bisa lihat grafik laporan.

### **Bulan 5: UAT, Testing & Launch**

**Objective:** Aplikasi stabil dan bebas bug setelah diuji 30 orang.

* **Backend (2 Orang):**
* Fixing bugs dari hasil UAT.
* Optimasi query Prisma & Database Indexing.
* Final deployment ke Vercel (Production mode).


* **Frontend (2 Orang):**
* Fixing UI/UX issues dari feedback tester.
* Performance tuning (Code splitting & Caching).
* Dokumentasi teknis untuk serah terima.


* **Sprint Indicator:** Laporan UAT dari 30 orang selesai; Aplikasi live di domain utama.

---

## 📦 Technical Tool Checklist for Team

* **Version Control:** GitHub (Wajib pakai Branching Strategy: `main`, `staging`, `feature/xxx`).
* **Testing:** Jest (Unit Test) & Postman (API Test).
* **Monitoring:** Sentry (Error tracking).
* **Communication:** Discord/Slack (Integrasi notifikasi GitHub & Sentry).
