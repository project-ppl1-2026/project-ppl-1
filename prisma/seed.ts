import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  await prisma.quizQuestion.createMany({
    data: [
      {
        ageSegment: "ANAK",
        category: "Grooming Online",
        scenario:
          "Kamu baru kenal seseorang di game online. Ia sering memuji kamu dan meminta pindah chat ke aplikasi pribadi tanpa memberi tahu orang tua.",
        optionA: "Tetap chat diam-diam karena dia terlihat baik.",
        optionB: "Tolak pindah chat pribadi dan beri tahu orang tua/guru.",
        correctOption: "B",
        explanationCorrect:
          "Lebih aman menolak komunikasi rahasia dan melibatkan orang dewasa tepercaya. Pelaku grooming sering membangun kedekatan lalu memindahkan anak ke ruang privat agar sulit diawasi.",
        explanationIncorrect:
          "Chat diam-diam membuat kamu lebih mudah dimanipulasi dan sulit meminta bantuan jika mulai ada paksaan, ancaman, atau permintaan tidak nyaman.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Manipulasi & Ancaman",
        scenario:
          "Seseorang yang lebih tua memberi kamu hadiah online dan berkata, 'Jangan bilang siapa-siapa, ini rahasia kita.'",
        optionA:
          "Ceritakan kepada orang tua/guru dan jangan menerima hadiah lanjutan.",
        optionB: "Simpan rahasianya supaya dia tidak kecewa.",
        correctOption: "A",
        explanationCorrect:
          "Meminta anak menyimpan rahasia dari orang dewasa adalah tanda manipulasi. Hadiah dapat dipakai untuk membuat anak merasa berutang.",
        explanationIncorrect:
          "Menyimpan rahasia dapat membuat pelaku semakin berani meminta hal lain dan membuat kamu merasa bersalah untuk menolak.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Batasan Diri & Consent",
        scenario:
          "Seorang kakak kelas memaksa kamu ikut ke tempat sepi setelah pulang sekolah dan bilang kamu penakut kalau menolak.",
        optionA: "Ikut saja supaya tidak diejek.",
        optionB: "Tolak, tetap di area ramai, dan cari guru/satpam/orang tua.",
        correctOption: "B",
        explanationCorrect:
          "Keputusan aman adalah menjaga diri di area ramai dan mencari orang dewasa tepercaya. Tekanan dan ejekan tidak boleh membuat kamu mengabaikan rasa tidak aman.",
        explanationIncorrect:
          "Mengikuti paksaan ke tempat sepi bisa meningkatkan risiko kekerasan, eksploitasi, atau tekanan lanjutan.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Ada orang tidak dikenal di depan sekolah mengaku disuruh orang tuamu menjemput, tetapi ia tidak bisa menyebutkan nama lengkap orang tua atau kode jemput.",
        optionA: "Masuk mobil karena ia bilang terburu-buru.",
        optionB: "Tunggu di pos sekolah dan minta guru menghubungi orang tua.",
        correctOption: "B",
        explanationCorrect:
          "Verifikasi lewat guru atau orang tua adalah langkah aman. Anak tidak perlu mengikuti orang yang identitas dan izinnya belum jelas.",
        explanationIncorrect:
          "Langsung ikut orang tidak dikenal dapat membuka risiko penculikan, eksploitasi, atau situasi berbahaya lain.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Keamanan Digital",
        scenario:
          "Teman online meminta foto kartu pelajar dan alamat rumah untuk 'mengirim hadiah ulang tahun'.",
        optionA: "Jangan kirim data pribadi dan beri tahu orang tua.",
        optionB: "Kirim saja karena hadiahnya menarik.",
        correctOption: "A",
        explanationCorrect:
          "Data pribadi seperti alamat, sekolah, dan kartu identitas tidak boleh dibagikan kepada orang yang tidak dikenal. Data ini bisa dipakai untuk melacak atau menekan anak.",
        explanationIncorrect:
          "Mengirim data pribadi dapat membuat pelaku mengetahui lokasi dan memanfaatkan informasi itu untuk manipulasi atau ancaman.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Minta Bantuan",
        scenario:
          "Kamu merasa takut karena seseorang terus mengirim pesan meski sudah kamu abaikan.",
        optionA: "Blokir, simpan bukti, lalu minta bantuan orang tua/guru.",
        optionB: "Balas marah-marah supaya dia berhenti.",
        correctOption: "A",
        explanationCorrect:
          "Memblokir, menyimpan bukti, dan meminta bantuan adalah langkah aman. Dukungan orang dewasa membantu menghentikan kontak yang tidak sehat.",
        explanationIncorrect:
          "Membalas dengan emosi bisa memperpanjang interaksi dan membuat pelaku memiliki peluang lebih besar untuk memancing respons.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Teman-teman menantang kamu bolos sekolah untuk bertemu orang yang baru dikenal dari media sosial.",
        optionA: "Ikut supaya dianggap berani.",
        optionB: "Tolak dan ajak teman membicarakannya ke guru/orang tua.",
        correctOption: "B",
        explanationCorrect:
          "Menolak ajakan berisiko dan melibatkan orang dewasa adalah keputusan aman. Pertemuan dengan orang asing perlu pengawasan.",
        explanationIncorrect:
          "Bolos dan bertemu orang baru tanpa izin dapat membuat kamu berada di tempat yang tidak aman tanpa perlindungan.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Tawaran Modeling/Influencer",
        scenario:
          "Akun asing mengajak kamu jadi model anak dan meminta kamu datang ke studio tanpa orang tua karena katanya 'lebih profesional'.",
        optionA:
          "Tolak jika tanpa pendamping orang tua dan minta orang tua memeriksa dulu.",
        optionB: "Datang sendiri karena kesempatan ini jarang.",
        correctOption: "A",
        explanationCorrect:
          "Anak harus didampingi orang tua/wali untuk tawaran seperti modeling. Tawaran yang meminta anak datang sendiri adalah tanda bahaya.",
        explanationIncorrect:
          "Datang sendiri membuat anak rentan terhadap penipuan, pemaksaan, atau eksploitasi karena tidak ada pendamping yang melindungi.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Manipulasi & Ancaman",
        scenario:
          "Seseorang berkata akan menyebarkan chat kamu kalau kamu tidak menuruti permintaannya.",
        optionA: "Turuti saja supaya masalah cepat selesai.",
        optionB:
          "Jangan turuti, simpan bukti, dan lapor ke orang dewasa tepercaya.",
        correctOption: "B",
        explanationCorrect:
          "Ancaman adalah bentuk paksaan. Menyimpan bukti dan melapor membantu menghentikan tekanan tanpa membuat kamu semakin terjebak.",
        explanationIncorrect:
          "Menuruti ancaman sering membuat pelaku meminta hal yang lebih besar karena tahu kamu takut.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Batasan Diri & Consent",
        scenario:
          "Paman temanmu meminta kamu duduk terlalu dekat dan kamu merasa tidak nyaman, tetapi ia bilang kamu harus sopan kepada orang dewasa.",
        optionA:
          "Pindah menjauh, bilang tidak nyaman, dan cari orang dewasa lain.",
        optionB: "Diam saja karena takut dianggap tidak sopan.",
        correctOption: "A",
        explanationCorrect:
          "Rasa tidak nyaman perlu dihargai. Anak boleh membuat batasan tubuh dan mencari bantuan walaupun orang itu lebih tua.",
        explanationIncorrect:
          "Diam karena takut tidak sopan bisa membuat batasan diri diabaikan dan meningkatkan risiko perilaku tidak aman berulang.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Keamanan Digital",
        scenario:
          "Di grup game, ada link hadiah diamond gratis yang meminta username, password, dan nomor HP orang tua.",
        optionA: "Isi datanya agar dapat hadiah.",
        optionB: "Jangan klik/isi, keluar dari link, dan tanya orang tua.",
        correctOption: "B",
        explanationCorrect:
          "Link hadiah palsu dapat mencuri akun atau data keluarga. Memeriksa dengan orang tua membantu menghindari penipuan digital.",
        explanationIncorrect:
          "Memberikan password atau nomor HP bisa membuat akun diambil alih dan data dipakai untuk memeras atau menipu.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Minta Bantuan",
        scenario:
          "Kamu melihat temanmu diajak orang dewasa keluar sekolah dengan alasan diberi uang jajan.",
        optionA: "Beri tahu guru/satpam segera.",
        optionB: "Biarkan saja karena itu urusan temanmu.",
        correctOption: "A",
        explanationCorrect:
          "Memberi tahu guru/satpam adalah tindakan peduli dan aman. Orang dewasa di sekolah dapat memverifikasi dan mencegah risiko.",
        explanationIncorrect:
          "Mengabaikan situasi berisiko membuat teman mungkin kehilangan kesempatan mendapat bantuan tepat waktu.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Tetangga menawarkan kamu bekerja ringan sepulang sekolah dengan bayaran besar, tetapi orang tua tidak boleh tahu.",
        optionA: "Terima karena uangnya banyak.",
        optionB: "Tolak dan bicarakan dengan orang tua/wali.",
        correctOption: "B",
        explanationCorrect:
          "Anak tidak boleh menerima kerja rahasia tanpa persetujuan orang tua/wali. Bayaran besar dan rahasia adalah tanda tawaran tidak aman.",
        explanationIncorrect:
          "Kerja rahasia dapat berubah menjadi eksploitasi karena tidak ada orang dewasa yang mengawasi hak dan keselamatan anak.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Dokumen & Identitas",
        scenario:
          "Ada orang meminta memfoto akta lahir/kartu keluarga untuk mendaftarkan kamu ikut lomba berhadiah.",
        optionA: "Minta orang tua memeriksa dan jangan kirim dokumen sendiri.",
        optionB: "Kirim foto dokumen agar cepat terdaftar.",
        correctOption: "A",
        explanationCorrect:
          "Dokumen identitas harus dikelola orang tua/wali. Permintaan dokumen dari orang tidak jelas bisa dipakai untuk penipuan atau kontrol.",
        explanationIncorrect:
          "Mengirim dokumen sendiri membuat data keluarga rentan disalahgunakan dan sulit ditarik kembali.",
        isActive: true,
      },
      {
        ageSegment: "ANAK",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Akun media sosial menawarkan jalan-jalan gratis ke kota lain untuk anak-anak yang mau ikut tanpa izin tertulis orang tua.",
        optionA: "Ikut karena gratis.",
        optionB:
          "Tolak dan laporkan/tunjukkan tawaran itu ke orang tua atau guru.",
        correctOption: "B",
        explanationCorrect:
          "Perjalanan anak harus jelas, aman, dan disetujui orang tua/wali. Tawaran gratis tanpa izin adalah red flag.",
        explanationIncorrect:
          "Pergi tanpa izin dan tanpa informasi jelas membuat anak berisiko hilang kontak, dieksploitasi, atau tidak bisa meminta bantuan.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Grooming Online",
        scenario:
          "Orang yang kamu kenal di media sosial mulai sering curhat, memuji, lalu meminta kamu merahasiakan hubungan kalian dari keluarga.",
        optionA: "Tetap rahasiakan karena ia membuatmu merasa spesial.",
        optionB:
          "Waspada, batasi komunikasi, simpan bukti, dan cerita ke orang dewasa tepercaya.",
        correctOption: "B",
        explanationCorrect:
          "Grooming sering dimulai dari perhatian intens, isolasi, dan permintaan rahasia. Membatasi kontak dan mencari dukungan membantu mencegah manipulasi.",
        explanationIncorrect:
          "Merahasiakan relasi membuat kamu lebih mudah dikontrol dan semakin jauh dari orang yang bisa menolong.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Tawaran Kerja/Beasiswa",
        scenario:
          "Akun lowongan menawarkan kerja part-time dengan gaji sangat tinggi, tanpa wawancara, dan meminta kamu membayar biaya admin hari ini.",
        optionA:
          "Tolak, verifikasi perusahaan, dan jangan bayar biaya di awal.",
        optionB: "Bayar cepat agar tidak kehilangan kesempatan.",
        correctOption: "A",
        explanationCorrect:
          "Biaya rekrutmen, janji gaji tidak realistis, dan proses tergesa-gesa adalah tanda risiko penipuan atau eksploitasi. Verifikasi dulu sumber resmi.",
        explanationIncorrect:
          "Membayar biaya awal bisa menjadi awal jeratan utang atau penipuan yang menekan korban untuk terus mengikuti instruksi.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Teman online mengajak bertemu di tempat sepi karena katanya malu jika bertemu di tempat ramai.",
        optionA:
          "Tolak tempat sepi; jika perlu bertemu, harus di tempat publik dan diketahui keluarga.",
        optionB: "Setuju karena ia terlihat baik di chat.",
        correctOption: "A",
        explanationCorrect:
          "Tempat publik, izin keluarga, dan batasan yang jelas mengurangi risiko kekerasan atau pemaksaan.",
        explanationIncorrect:
          "Bertemu di tempat sepi tanpa orang yang tahu lokasimu membuat kamu sulit mencari bantuan jika situasi berubah berbahaya.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Batasan Diri & Consent",
        scenario:
          "Pacarmu memaksa kamu mengirim foto pribadi dan berkata itu bukti sayang.",
        optionA:
          "Tolak, jelaskan batasan, dan cari bantuan jika ia terus memaksa.",
        optionB: "Kirim karena takut diputuskan.",
        correctOption: "A",
        explanationCorrect:
          "Consent berarti kamu berhak menolak tekanan. Paksaan emosional bukan bukti sayang dan dapat menjadi alat kontrol.",
        explanationIncorrect:
          "Mengirim karena takut diputuskan dapat membuat kamu rentan terhadap ancaman penyebaran atau pemerasan.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Manipulasi & Ancaman",
        scenario:
          "Seseorang mengancam akan menyebarkan rumor jika kamu tidak mau ikut pergi dengannya.",
        optionA: "Ikut saja agar rumor tidak menyebar.",
        optionB:
          "Jangan ikut, simpan bukti ancaman, dan lapor ke guru/orang tua/pihak aman.",
        correctOption: "B",
        explanationCorrect:
          "Ancaman adalah tanda paksaan. Bukti dan dukungan orang dewasa membantu melindungi keselamatanmu.",
        explanationIncorrect:
          "Mengikuti ancaman dapat membawa kamu ke situasi yang lebih sulit dikontrol dan membuat pelaku semakin berani menekan.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Dokumen & Identitas",
        scenario:
          "Panitia lomba online meminta foto KTP orang tua, KK, dan alamat lengkap lewat DM pribadi, bukan website resmi.",
        optionA: "Minta verifikasi resmi dan jangan kirim dokumen lewat DM.",
        optionB: "Kirim saja supaya pendaftaran diterima.",
        correctOption: "A",
        explanationCorrect:
          "Dokumen keluarga hanya boleh diberikan lewat kanal resmi yang jelas dan setelah diverifikasi. DM pribadi bukan jalur aman.",
        explanationIncorrect:
          "Dokumen dapat disalahgunakan untuk penipuan, pemalsuan, atau tekanan kepada keluarga.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Teman mengajak ikut promosi produk ke luar kota tanpa izin orang tua, katanya nanti semua biaya ditanggung sponsor.",
        optionA: "Ikut agar tidak dianggap cupu.",
        optionB:
          "Tolak sampai ada izin tertulis, detail acara, dan pendamping jelas.",
        correctOption: "B",
        explanationCorrect:
          "Perjalanan remaja harus transparan: identitas penyelenggara, pendamping, izin keluarga, lokasi, dan kontak darurat harus jelas.",
        explanationIncorrect:
          "Pergi tanpa izin dan detail jelas membuat kamu rentan ditinggalkan, dikontrol, atau dieksploitasi.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Minta Bantuan",
        scenario:
          "Kamu sadar temanmu dikontrol pacarnya: HP dicek, dilarang bertemu keluarga, dan sering dipaksa pergi.",
        optionA:
          "Ajak bicara pelan-pelan, tawarkan dukungan, dan ajak mencari bantuan orang dewasa/layanan aman.",
        optionB: "Marahi temanmu karena tetap bertahan.",
        correctOption: "A",
        explanationCorrect:
          "Pendekatan suportif lebih aman karena korban manipulasi sering takut atau merasa bersalah. Dukungan membantu ia punya pilihan keluar.",
        explanationIncorrect:
          "Memarahi bisa membuat teman defensif, malu, atau semakin terisolasi dari orang yang ingin menolong.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Grooming Online",
        scenario:
          "Orang dewasa di komunitas online memberi perhatian khusus, lalu meminta kamu menghapus chat supaya tidak ketahuan admin.",
        optionA: "Hapus chat karena dia bilang itu demi keamanan.",
        optionB:
          "Jangan hapus, keluar dari chat, screenshot bukti, dan lapor ke admin/orang dewasa.",
        correctOption: "B",
        explanationCorrect:
          "Meminta menghapus bukti adalah tanda bahaya. Menyimpan bukti dan melapor membantu menghentikan perilaku predator.",
        explanationIncorrect:
          "Menghapus chat membuat bukti hilang dan dapat mempersulit bantuan jika permintaannya makin tidak aman.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Tawaran Modeling/Influencer",
        scenario:
          "Agen casting menawarkan jadi talent, tetapi meminta kamu datang malam hari sendirian ke apartemen untuk 'screen test'.",
        optionA:
          "Tolak, minta alamat kantor resmi, kontrak, dan pendamping orang tua/wali.",
        optionB: "Datang sendiri karena takut kesempatan hilang.",
        correctOption: "A",
        explanationCorrect:
          "Casting yang aman punya identitas lembaga jelas, jadwal wajar, lokasi profesional, dan pendamping. Ajakan datang sendiri malam hari adalah red flag.",
        explanationIncorrect:
          "Datang sendiri ke lokasi privat dapat meningkatkan risiko pemaksaan, kekerasan, atau eksploitasi.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Seseorang menawarkan kerja live streaming dengan target jam panjang, kontrak tidak jelas, dan semua penghasilan akan 'dipegang dulu' oleh manajer.",
        optionA: "Terima karena katanya banyak yang sukses.",
        optionB:
          "Tolak sampai kontrak, jam kerja, pembayaran, dan identitas manajer jelas serta dicek orang dewasa.",
        correctOption: "B",
        explanationCorrect:
          "Jam kerja, kontrol penghasilan, dan kontrak tidak jelas dapat menjadi tanda eksploitasi. Verifikasi sebelum menerima.",
        explanationIncorrect:
          "Mengabaikan detail pembayaran dan kontrol kerja dapat membuat kamu kehilangan kendali atas pendapatan dan aktivitas.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Keamanan Digital",
        scenario:
          "Kamu mendapatkan pesan 'beasiswa rahasia' yang meminta login akun email dan password untuk verifikasi.",
        optionA: "Jangan beri password; cek website sekolah/lembaga resmi.",
        optionB: "Berikan password karena beasiswanya mendesak.",
        correctOption: "A",
        explanationCorrect:
          "Password tidak pernah boleh dibagikan. Beasiswa resmi tidak meminta password pribadi melalui pesan.",
        explanationIncorrect:
          "Memberikan password bisa membuat akun diambil alih untuk menipu, memeras, atau mengakses data pribadi.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Relasi Tidak Sehat",
        scenario:
          "Pacar baru ingin kamu putus kontak dengan teman dan keluarga karena katanya hanya dia yang benar-benar peduli.",
        optionA: "Ikuti agar hubungan tetap harmonis.",
        optionB: "Pertahankan jaringan dukungan dan waspadai upaya isolasi.",
        correctOption: "B",
        explanationCorrect:
          "Isolasi dari keluarga/teman adalah taktik kontrol. Menjaga jaringan dukungan membuat kamu punya ruang aman untuk bertanya dan meminta bantuan.",
        explanationIncorrect:
          "Mengikuti isolasi membuat kamu lebih sulit melihat tanda bahaya dan lebih bergantung pada satu orang yang mengontrol.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Minta Bantuan",
        scenario:
          "Kamu terlanjur membagikan foto pribadi dan sekarang diancam. Kamu takut dimarahi orang tua.",
        optionA:
          "Simpan bukti, jangan kirim hal lain, dan cari bantuan orang dewasa/layanan pelaporan.",
        optionB: "Kirim permintaan berikutnya agar ancaman berhenti.",
        correctOption: "A",
        explanationCorrect:
          "Langkah aman adalah menghentikan pengiriman, menyimpan bukti, dan mencari bantuan. Kamu tidak sendirian dan tidak perlu menghadapi ancaman sendiri.",
        explanationIncorrect:
          "Menuruti ancaman biasanya tidak menghentikan pelaku; pelaku bisa meminta lebih banyak karena tahu ancaman berhasil.",
        isActive: true,
      },
      {
        ageSegment: "REMAJA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Seseorang menawarkan ikut event luar kota gratis, tetapi tiket dan penginapan hanya dikirim setelah kamu sampai di terminal sendirian.",
        optionA: "Pergi dulu karena nanti pasti diarahkan.",
        optionB:
          "Tolak sampai detail resmi, tiket, penginapan, penanggung jawab, dan izin keluarga jelas.",
        correctOption: "B",
        explanationCorrect:
          "Perjalanan aman harus memiliki detail yang bisa diverifikasi sebelum berangkat. Ketidakjelasan logistik adalah tanda risiko.",
        explanationIncorrect:
          "Berangkat tanpa detail membuat kamu bergantung pada pihak yang tidak jelas dan sulit keluar jika situasi berubah buruk.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Kontrak & Hak Kerja",
        scenario:
          "Kamu ditawari magang luar kota dengan gaji besar, tetapi diminta menandatangani kontrak kosong karena detailnya 'diisi nanti'.",
        optionA:
          "Tolak menandatangani dan minta kontrak lengkap untuk dibaca dulu.",
        optionB: "Tanda tangan agar slot tidak diambil orang lain.",
        correctOption: "A",
        explanationCorrect:
          "Kontrak harus jelas sebelum ditandatangani: tugas, jam kerja, upah, lokasi, hak keluar, dan kontak perusahaan. Kontrak kosong berisiko disalahgunakan.",
        explanationIncorrect:
          "Menandatangani kontrak kosong membuat kamu tidak tahu kewajiban yang akan dipaksakan dan bisa merugikan keselamatan maupun hak kerja.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Tawaran Kerja/Beasiswa",
        scenario:
          "Agen menawarkan kerja luar negeri untuk mahasiswa, tetapi meminta biaya besar dan menahan ijazah sementara sebagai jaminan.",
        optionA: "Setuju karena katanya prosedur normal.",
        optionB:
          "Tolak dan verifikasi legalitas agen, kontrak, serta larangan penahanan dokumen.",
        correctOption: "B",
        explanationCorrect:
          "Biaya rekrutmen tinggi dan penahanan dokumen adalah red flag eksploitasi kerja. Verifikasi legalitas dan jangan menyerahkan dokumen penting sebagai jaminan.",
        explanationIncorrect:
          "Menyetujui penahanan dokumen dapat membatasi kebebasan bergerak dan membuat kamu sulit keluar dari situasi eksploitatif.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Komunitas baru mengajak kamu ke acara networking di kota lain, tetapi lokasi berubah-ubah dan hanya satu orang yang memegang semua tiket.",
        optionA:
          "Minta itinerary tertulis, kontak panitia resmi, dan rencana pulang mandiri sebelum berangkat.",
        optionB: "Ikut saja karena networking penting untuk karier.",
        correctOption: "A",
        explanationCorrect:
          "Itinerary, kontak resmi, dan kemampuan pulang mandiri membuat perjalanan lebih aman dan mengurangi ketergantungan pada pihak tidak jelas.",
        explanationIncorrect:
          "Berangkat tanpa informasi dan akses pulang mandiri membuat kamu mudah dikontrol jika situasi tidak sesuai janji.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Manajer kerja freelance meminta kamu bekerja 12 jam sehari tanpa kontrak, pembayaran ditunda, dan kamu tidak boleh berhenti sebelum target tercapai.",
        optionA: "Terima karena pengalaman kerja penting.",
        optionB:
          "Tolak atau minta kontrak jelas, batas jam kerja, pembayaran, dan hak berhenti.",
        correctOption: "B",
        explanationCorrect:
          "Jam kerja berlebihan, pembayaran ditahan, dan larangan berhenti adalah indikator kerja paksa/eksploitasi. Hak kerja perlu jelas sejak awal.",
        explanationIncorrect:
          "Menganggap semua itu sebagai pengalaman dapat menormalkan kondisi eksploitatif dan membuat kamu sulit menolak kemudian.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Grooming Online",
        scenario:
          "Mentor online yang baru kamu kenal menawarkan bantuan karier, lalu mulai meminta foto pribadi dan menekan agar kamu tidak cerita ke teman.",
        optionA:
          "Beri batasan, hentikan komunikasi yang tidak profesional, dan dokumentasikan pesan.",
        optionB: "Ikuti karena takut kehilangan mentor.",
        correctOption: "A",
        explanationCorrect:
          "Relasi mentoring harus profesional. Permintaan foto pribadi dan isolasi dari teman adalah tanda manipulasi, bukan dukungan karier.",
        explanationIncorrect:
          "Menuruti karena takut kehilangan akses bisa membuat posisi kamu makin rentan terhadap tekanan dan pemerasan.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Dokumen & Identitas",
        scenario:
          "Penyedia program exchange meminta paspor asli dititipkan ke agen selama proses, padahal belum ada surat resmi dan alamat kantor jelas.",
        optionA: "Titipkan agar proses cepat.",
        optionB:
          "Jangan serahkan paspor; cek legalitas program dan gunakan kanal resmi.",
        correctOption: "B",
        explanationCorrect:
          "Paspor adalah dokumen kontrol mobilitas. Penahanan dokumen tanpa dasar resmi adalah red flag dalam eksploitasi/trafficking.",
        explanationIncorrect:
          "Menyerahkan paspor ke pihak tidak jelas dapat membatasi kemampuanmu pulang, melapor, atau keluar dari situasi berbahaya.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Relasi Tidak Sehat",
        scenario:
          "Pasanganmu menawarkan membiayai hidup dan kuliah asal kamu pindah ke kota lain dan memutus kontak dengan teman dekat.",
        optionA:
          "Tolak syarat isolasi dan diskusikan dengan keluarga/teman tepercaya.",
        optionB: "Terima karena bantuan finansial besar.",
        correctOption: "A",
        explanationCorrect:
          "Bantuan yang disertai isolasi dan kontrol adalah red flag. Keputusan besar seperti pindah kota perlu jaringan dukungan dan transparansi.",
        explanationIncorrect:
          "Menerima bantuan dengan syarat memutus kontak dapat membuat kamu bergantung penuh dan sulit keluar jika mulai dikontrol.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Manipulasi & Ancaman",
        scenario:
          "Perekrut berkata kamu akan didenda besar kalau membatalkan keberangkatan, padahal belum ada kontrak yang jelas.",
        optionA: "Bayar saja agar tidak bermasalah.",
        optionB:
          "Minta dasar tertulis, jangan bayar, dan konsultasi ke kampus/keluarga/layanan hukum.",
        correctOption: "B",
        explanationCorrect:
          "Ancaman denda tanpa kontrak jelas adalah tekanan. Konsultasi membantu memeriksa apakah klaim itu sah atau manipulatif.",
        explanationIncorrect:
          "Membayar karena panik bisa memperkuat pola pemerasan dan tidak menjamin ancaman berhenti.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Tawaran Modeling/Influencer",
        scenario:
          "Brand menawarkan kamu jadi ambassador dengan syarat tinggal di rumah talent, semua HP disimpan manajer, dan aktivitas diatur penuh.",
        optionA:
          "Minta kontrak, aturan kerja, akses komunikasi pribadi, dan hak keluar sebelum setuju.",
        optionB: "Setuju karena fasilitas ditanggung.",
        correctOption: "A",
        explanationCorrect:
          "Akses komunikasi dan hak keluar harus tetap ada. Aturan yang mengontrol HP, tempat tinggal, dan aktivitas penuh dapat menjadi tanda eksploitasi.",
        explanationIncorrect:
          "Fasilitas gratis bisa menjadi alat kontrol jika kamu kehilangan kebebasan komunikasi dan mobilitas.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Minta Bantuan",
        scenario:
          "Teman kuliahmu bercerita terjebak kerja promosi yang menahan gaji dan melarang pulang sebelum target.",
        optionA: "Bilang itu risiko kerja dan minta dia bertahan.",
        optionB:
          "Dengarkan, bantu simpan bukti, dan arahkan ke keluarga/kampus/layanan bantuan.",
        correctOption: "B",
        explanationCorrect:
          "Dukungan praktis seperti bukti, kontak aman, dan jalur bantuan dapat membantu korban keluar tanpa disalahkan.",
        explanationIncorrect:
          "Menyuruh bertahan dapat membuat korban makin merasa sendirian dan menunda bantuan ketika tanda eksploitasi sudah jelas.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Keamanan Digital",
        scenario:
          "Kamu mendapat email kerja remote dari perusahaan asing, tetapi domain email gratisan dan perekrut meminta instal aplikasi chat terenkripsi untuk semua proses.",
        optionA:
          "Verifikasi domain, profil perusahaan, dan kontrak melalui kanal resmi sebelum lanjut.",
        optionB:
          "Ikuti proses di aplikasi itu karena perusahaan global sering begitu.",
        correctOption: "A",
        explanationCorrect:
          "Verifikasi identitas perekrut dan kanal resmi penting, terutama untuk tawaran remote/luar negeri. Identitas digital yang tidak jelas adalah red flag.",
        explanationIncorrect:
          "Mengikuti proses tertutup tanpa verifikasi bisa membuat kamu diarahkan ke penipuan, pemerasan, atau kerja eksploitatif.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Agen pelatihan kerja menawarkan pinjaman biaya keberangkatan yang harus dibayar dari gaji nanti, tapi jumlah bunga dan potongan tidak jelas.",
        optionA: "Ambil karena tidak perlu bayar sekarang.",
        optionB:
          "Tolak sampai skema biaya, bunga, potongan, dan kontrak jelas serta dicek pihak tepercaya.",
        correctOption: "B",
        explanationCorrect:
          "Utang yang tidak transparan dapat menjadi jeratan kerja paksa. Semua biaya dan potongan harus jelas sebelum setuju.",
        explanationIncorrect:
          "Menerima utang tidak jelas bisa membuat gaji terus dipotong dan kamu merasa tidak bisa berhenti.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Tawaran Kerja/Beasiswa",
        scenario:
          "Ada program beasiswa informal yang meminta kamu pindah tempat tinggal ke asrama tertutup tanpa informasi pengelola dan aturan keluar.",
        optionA:
          "Tolak sampai ada legalitas lembaga, aturan tertulis, kontak darurat, dan izin keluarga.",
        optionB: "Ambil karena biaya hidup ditanggung.",
        correctOption: "A",
        explanationCorrect:
          "Program aman harus transparan mengenai pengelola, aturan tinggal, hak keluar, dan kontak darurat. Tempat tinggal tertutup tanpa kejelasan berisiko.",
        explanationIncorrect:
          "Biaya hidup yang ditanggung dapat menjadi alat ketergantungan jika aturan membatasi mobilitas dan komunikasi.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Batasan Diri & Consent",
        scenario:
          "Atasan magang mengajak meeting berdua larut malam di kamar hotel dan berkata penilaian magangmu tergantung kehadiranmu.",
        optionA: "Datang agar nilai magang aman.",
        optionB:
          "Tolak meeting privat, minta lokasi profesional/jam kerja, dan lapor ke pembimbing jika ditekan.",
        correctOption: "B",
        explanationCorrect:
          "Penilaian tidak boleh dipakai untuk memaksa situasi tidak aman. Meeting profesional perlu tempat dan waktu yang wajar.",
        explanationIncorrect:
          "Mengikuti tekanan dapat membuat kamu berada dalam situasi tidak seimbang dan membuka peluang pemaksaan lanjutan.",
        isActive: true,
      },
      {
        ageSegment: "MAHASISWA",
        category: "Minta Bantuan",
        scenario:
          "Kamu curiga lowongan yang kamu ikuti palsu setelah diminta mengirim dokumen dan membayar biaya. Kamu sudah telanjur kirim CV.",
        optionA:
          "Hentikan proses, amankan akun, simpan bukti, dan lapor ke platform/kampus jika perlu.",
        optionB: "Lanjut karena CV sudah telanjur dikirim.",
        correctOption: "A",
        explanationCorrect:
          "Walau data awal sudah terkirim, kamu tetap bisa mengurangi risiko dengan menghentikan proses, mengamankan akun, dan menyimpan bukti.",
        explanationIncorrect:
          "Melanjutkan karena sudah telanjur dapat membuat kamu masuk lebih dalam ke tekanan biaya atau permintaan dokumen lanjutan.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Tawaran Kerja/Beasiswa",
        scenario:
          "Agen menawarkan kerja luar negeri dengan gaji tinggi, tetapi tidak ada kontrak tertulis dan meminta keberangkatan besok.",
        optionA: "Berangkat cepat karena peluang jarang datang.",
        optionB:
          "Tunda, minta kontrak lengkap, cek legalitas agen, visa, alamat kerja, dan kontak darurat.",
        correctOption: "B",
        explanationCorrect:
          "Keberangkatan mendadak tanpa kontrak dan legalitas jelas adalah red flag. Verifikasi dokumen kerja dan agen sebelum berangkat.",
        explanationIncorrect:
          "Berangkat tanpa kontrak membuat posisi kamu lemah jika pekerjaan, upah, atau lokasi ternyata berbeda dari janji.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Dokumen & Identitas",
        scenario:
          "Calon pemberi kerja meminta paspor asli disimpan perusahaan sejak hari pertama 'agar aman'.",
        optionA:
          "Tolak penahanan paspor dan minta kebijakan tertulis yang tidak membatasi akses dokumen.",
        optionB: "Serahkan karena itu aturan perusahaan.",
        correctOption: "A",
        explanationCorrect:
          "Penahanan dokumen identitas adalah indikator kuat kontrol dalam kerja paksa. Pekerja harus tetap memiliki akses terhadap dokumen pribadi.",
        explanationIncorrect:
          "Menyerahkan paspor tanpa akses bisa membuat kamu sulit keluar, pulang, atau meminta bantuan.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Perusahaan menjanjikan biaya keberangkatan gratis, tetapi setelah tiba kamu harus membayar utang akomodasi, alat kerja, dan pelatihan yang tidak pernah dijelaskan.",
        optionA: "Terima saja karena sudah sampai di lokasi.",
        optionB:
          "Minta rincian tertulis, simpan bukti, dan cari bantuan jika biaya dipakai untuk menahanmu bekerja.",
        correctOption: "B",
        explanationCorrect:
          "Biaya tidak transparan dan utang yang menahan pekerja adalah red flag debt bondage. Bukti dan bantuan penting untuk keluar dari tekanan.",
        explanationIncorrect:
          "Menerima tanpa mempertanyakan dapat membuat utang terus bertambah dan dipakai untuk memaksa kamu tetap bekerja.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Kontrak & Hak Kerja",
        scenario:
          "Kontrak kerja menyebut gaji besar, tetapi tidak ada jam kerja, hari libur, alamat tempat kerja, atau mekanisme resign.",
        optionA:
          "Minta revisi kontrak agar hak, jam, lokasi, upah, dan mekanisme keluar jelas.",
        optionB: "Tanda tangan karena yang penting gajinya besar.",
        correctOption: "A",
        explanationCorrect:
          "Kontrak yang jelas melindungi hak pekerja dan membantu mendeteksi eksploitasi sebelum terjadi.",
        explanationIncorrect:
          "Gaji besar tanpa detail hak kerja bisa menutupi kondisi kerja panjang, isolasi, atau pembayaran tidak sesuai.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Relasi Tidak Sehat",
        scenario:
          "Pasangan mengajak pindah ke kota lain dan meminta kamu menyerahkan ATM serta HP karena ia akan mengatur semua kebutuhanmu.",
        optionA: "Setuju karena pasangan ingin bertanggung jawab.",
        optionB:
          "Tolak kontrol penuh atas uang/komunikasi dan diskusikan dengan orang tepercaya.",
        correctOption: "B",
        explanationCorrect:
          "Mengontrol uang, dokumen, dan komunikasi adalah tanda kontrol koersif. Menjaga akses pribadi membuat kamu tetap punya pilihan aman.",
        explanationIncorrect:
          "Menyerahkan ATM dan HP dapat membuat kamu bergantung penuh dan sulit meminta bantuan jika mulai dibatasi.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Kamu ditawari menjadi pekerja event luar kota. Lokasi penginapan belum jelas dan semua transportasi hanya diatur oleh perekrut.",
        optionA:
          "Minta detail penginapan, kontak penyelenggara, kontrak, dan siapkan akses pulang mandiri.",
        optionB: "Ikut saja karena akomodasi ditanggung.",
        correctOption: "A",
        explanationCorrect:
          "Akses informasi dan rencana pulang mandiri mengurangi ketergantungan pada perekrut serta menjaga keselamatan.",
        explanationIncorrect:
          "Ketergantungan penuh pada perekrut untuk transportasi dan tempat tinggal dapat menjadi alat kontrol.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Manipulasi & Ancaman",
        scenario:
          "Pemberi kerja mengancam akan melaporkanmu ke polisi jika kamu menolak lembur tanpa bayaran, padahal kontrak tidak menyebut kewajiban itu.",
        optionA: "Ikuti semua lembur agar tidak dilaporkan.",
        optionB:
          "Simpan bukti, cek kontrak, dan cari bantuan hukum/organisasi pekerja/otoritas terkait.",
        correctOption: "B",
        explanationCorrect:
          "Ancaman hukum untuk memaksa kerja adalah bentuk tekanan. Bukti dan bantuan profesional penting agar kamu tidak menghadapi ancaman sendiri.",
        explanationIncorrect:
          "Mengikuti ancaman dapat menormalisasi kerja paksa dan membuat pemberi kerja terus menaikkan tekanan.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Tawaran Kerja/Beasiswa",
        scenario:
          "Lowongan remote meminta kamu membuat akun bank/crypto atas namamu untuk menerima uang klien, tanpa penjelasan pekerjaan jelas.",
        optionA: "Tolak dan laporkan lowongan mencurigakan.",
        optionB: "Terima karena tidak perlu modal dan bisa kerja dari rumah.",
        correctOption: "A",
        explanationCorrect:
          "Pekerjaan yang meminta akun pribadi untuk aliran uang tanpa tugas jelas dapat mengarah ke penipuan atau eksploitasi kriminal. Menolak melindungi identitas dan legalitasmu.",
        explanationIncorrect:
          "Menggunakan akun pribadi untuk transaksi pihak lain bisa membuat kamu terlibat masalah hukum dan dikontrol oleh perekrut.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Minta Bantuan",
        scenario:
          "Temanmu pulang dari kerja luar kota dengan takut, gajinya ditahan, dan dokumennya masih di agen.",
        optionA: "Sarankan dia melupakan saja agar tidak ribet.",
        optionB:
          "Dampingi menyimpan bukti dan menghubungi keluarga, layanan bantuan, atau otoritas yang aman.",
        correctOption: "B",
        explanationCorrect:
          "Penahanan gaji dan dokumen adalah tanda eksploitasi. Dukungan yang tidak menyalahkan korban membantu pemulihan dan pelaporan aman.",
        explanationIncorrect:
          "Mengabaikan masalah bisa membuat korban tetap rentan, dokumen tidak kembali, dan pola eksploitasi berulang pada orang lain.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Keamanan Digital",
        scenario:
          "Perekrut meminta semua komunikasi dihapus setelah interview dan melarang kamu bercerita ke keluarga karena 'proses eksklusif'.",
        optionA:
          "Simpan komunikasi, verifikasi, dan jangan lanjut jika proses harus dirahasiakan.",
        optionB: "Hapus chat agar terlihat profesional.",
        correctOption: "A",
        explanationCorrect:
          "Proses kerja yang valid tidak perlu menghapus bukti atau melarang keluarga tahu. Transparansi adalah perlindungan.",
        explanationIncorrect:
          "Menghapus chat menghilangkan bukti jika terjadi penipuan, ancaman, atau eksploitasi.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Bos mengatakan gaji tiga bulan pertama ditahan untuk 'jaminan loyalitas' dan kamu baru dibayar kalau tidak resign.",
        optionA: "Terima karena mungkin budaya perusahaan.",
        optionB:
          "Tolak atau minta dasar hukum/kontrak; cari bantuan jika upah ditahan.",
        correctOption: "B",
        explanationCorrect:
          "Penahanan upah untuk mencegah pekerja keluar adalah indikator eksploitasi. Upah dan hak keluar harus jelas.",
        explanationIncorrect:
          "Menerima penahanan upah membuat kamu terikat secara ekonomi dan sulit meninggalkan kondisi tidak aman.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Kontrak & Hak Kerja",
        scenario:
          "Perekrut bilang pekerjaan sebenarnya berbeda dari iklan, tetapi kamu baru akan tahu detailnya setelah tiba di lokasi.",
        optionA:
          "Minta deskripsi kerja tertulis dan tolak jika tidak transparan.",
        optionB: "Tetap lanjut karena sudah percaya perekrut.",
        correctOption: "A",
        explanationCorrect:
          "Perubahan pekerjaan tanpa detail tertulis adalah red flag. Informasi tugas, lokasi, upah, dan atasan harus jelas sebelum setuju.",
        explanationIncorrect:
          "Lanjut tanpa detail bisa membuat kamu menerima pekerjaan yang tidak sesuai, berisiko, atau eksploitatif.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Batasan Diri & Consent",
        scenario:
          "Klien kerja pribadi mengajak bertemu malam di kamar hotel untuk membahas proyek dan menjanjikan kontrak besar.",
        optionA: "Datang agar kontrak tidak hilang.",
        optionB:
          "Minta tempat publik/jam kerja, ajak rekan, atau lakukan meeting online.",
        correctOption: "B",
        explanationCorrect:
          "Batas profesional penting. Tempat publik, jam wajar, dan pendamping mengurangi risiko pemaksaan atau pelecehan.",
        explanationIncorrect:
          "Datang sendiri ke ruang privat dalam relasi kuasa/uang tidak seimbang dapat membuat kamu rentan ditekan.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Keamanan Perjalanan & Mobilitas",
        scenario:
          "Tempat kerja menyediakan mess, tetapi pekerja tidak boleh keluar tanpa izin dan HP hanya boleh dipakai satu jam sehari.",
        optionA:
          "Pertanyakan aturan, cari bantuan, dan jangan abaikan pembatasan mobilitas/komunikasi.",
        optionB: "Ikuti karena tinggal di mess memang ada aturan.",
        correctOption: "A",
        explanationCorrect:
          "Pembatasan mobilitas dan komunikasi dapat menjadi indikator kontrol dalam trafficking/kerja paksa. Aturan tempat tinggal tidak boleh menghilangkan kebebasan dasar.",
        explanationIncorrect:
          "Menganggapnya normal dapat membuat kontrol semakin kuat dan mempersulit akses bantuan.",
        isActive: true,
      },
      {
        ageSegment: "DEWASA_MUDA",
        category: "Eksploitasi Ekonomi",
        scenario:
          "Seseorang menawarkan melunasi utangmu jika kamu mau bekerja di bisnisnya, tetapi pekerjaan, jam, dan gaji tidak dijelaskan.",
        optionA: "Terima karena masalah utang selesai.",
        optionB:
          "Tolak sampai ada perjanjian jelas; jangan tukar kendali diri dengan bantuan finansial tidak transparan.",
        correctOption: "B",
        explanationCorrect:
          "Bantuan finansial tanpa kejelasan kerja dapat menjadi pintu ketergantungan dan eksploitasi. Perjanjian perlu transparan dan adil.",
        explanationIncorrect:
          "Menerima tanpa detail dapat membuat utang berubah menjadi alat kontrol untuk memaksa kamu bekerja atau tinggal di tempat tertentu.",
        isActive: true,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
