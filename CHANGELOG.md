# 📜 Changelog & Riwayat Revisi — Kak Diko World (AI Asisten Anak SD Kelas 1–6)

Semua perubahan arsitektur, penambahan fitur, dan pembaruan antarmuka pada proyek **Kak Diko - AI Asisten Anak** didokumentasikan secara kronologis di file ini untuk memudahkan revisi dan pengembangan ke depannya.

---

## [v4.0.0] — 2026-10-29 (Vibecode Profesional Game-Grade UI, Karakter AI Interaktif Hidup & Production Deploy)

### ✨ Ditambahkan (Added)
- **Panggung Karakter AI Interaktif Hidup (`#interactiveCharacterStage`)**:
  - 5 Wujud Rig SVG Multi-Layer 60 FPS (`🦉 Owl`, `🦖 Dino`, `🤖 Robo`, `🐱 Neko`, `🚀 Astro`) dengan animasi mata berkedip (`@keyframes rigBlinkEyes`), tangan melambai (`@keyframes rigWaveArm`), mulut bergerak sinkron saat berbicara (`@keyframes rigTalkMouth` + 7-bar **Voice Equalizer** `#voiceEqualizerBars`), serta lompatan perayaan (`@keyframes rigJumpCelebrate`).
  - **3 Tombol Interaksi Langsung + Ketuk Tubuh Karakter**:
    - `🖐️ Tos High-Five!` (`#interactHighFiveBtn`): Memicu lompatan karakter, ledakan partikel bintang/confetti (`#celebrationBurstLayer`), dan sapaan penyemangat bersuara.
    - `🍎 Kasih Energi` (`#interactFeedBtn`): Memberi camilan energi dan menaikkan **Level Persahabatan (`❤️ Sahabat Lv.X`)** beserta bar progres `#friendshipBarFill`.
    - `🎲 Tebak-Tebakan` (`#interactRiddleBtn`): Kak Diko melontarkan teka-teki interaktif bersuara sesuai kelas anak (Kelas 1–6 SD).
- **Floating Interactive AI Co-Pilot (`#floatingAiCoPilot`)**:
  - Asisten karakter mengambang di pojok kanan bawah yang memberikan **Petunjuk Soal 1-Klik (`💡 AI Hint`)** kontekstual di tab **Pulau Level**, **English Quest**, dan **Koleksi Badge**.
- **Pendamping Karakter Hidup di Duolingo English Quest (`#duoCompanionMiniBox`)**:
  - Karakter pilihan anak tampil beranimasi di sebelah kiri balon kalimat Bahasa Inggris dan ikut melompat saat jawaban anak benar.
- **Latar Dunia Dinamis (`body[data-scene]`) & Tombol 3D Tactile**:
  - Pergantian suasana panggung otomatis mengikuti karakter (`owl`, `dino`, `robot`, `cat`, `astro`) dan tombol 3D bergaya game edukasi (`border-bottom: 5px`).
- **Deploy Produksi Vercel**:
  - Aplikasi resmi live di `https://kak-diko.vercel.app` (Web Anak) dan `https://kak-diko.vercel.app/parent` (Aplikasi HP Orang Tua).

---

## [v3.0.0] — 2026-10-29 (Rebranding "Kak Diko", 5 Karakter Kustom, 8 Koleksi Badge & Aplikasi HP Orang Tua `/parent`)

### ✨ Ditambahkan (Added)
- **Rebranding Penuh ke "Kak Diko" & 5 Pilihan Karakter Kustom (`CHARACTER_COMPANIONS` di `api/curriculumData.js`)**:
  - Anak bebas memilih dan mengganti wujud Kak Diko sesuai kesukaannya (`owl`, `dino`, `robot`, `cat`, `astro`).
- **Aplikasi HP Khusus Kontrol & Monitoring Orang Tua (`/parent` — `parent.html` & `parent.js`)**:
  - **Tab 📊 Laporan Anak**: Pantauan Bintang ⭐, XP ⚡, Durasi Belajar ⏱️, Streak Duolingo 🔥, Grafik Penguasaan 5 Bidang Kurikulum, Log Percakapan Anak, dan tombol **🎁 Kirim Hadiah +5 Bintang & Pesan Semangat ke Layar Anak**.
  - **Tab 🎛️ Kontrol & AI**: Sakelar **🔒 Kunci Layar Anak Sekarang (Remote Lock)**, **🧠 Fokus Didikan Custom AI Kak Diko (`parentDirective`)**, **🌙 Jam Tidur Malam**, dan **Batas Durasi Layar Harian**.
  - **Tab 🏅 Badge & Cloud**: Pantauan 8 Badge Pencapaian Anak dan ekspor JSON / Google Drive Webhook.
- **Album Koleksi 8 Badge Pencapaian Anak (`ACHIEVEMENT_BADGES`)**:
  - Terbuka otomatis saat anak berbicara dengan Kak Diko, menyelesaikan misi Matematika/Sains/Literasi, menyusun kalimat di Duolingo English Quest, dan membuka level baru.
- **Penyederhanaan Setting di Web Anak**:
  - Pengaturan di layar Chromebook anak disederhanakan hanya berisi pengaturan dasar (*Pilih Karakter*, *Suara*, *Tema Warna*, dan *Kode Pairing HP Ortu*), sedangkan seluruh kontrol lanjutan dipindahkan ke `/parent`.

---

## [v2.0.0] — 2026-10-29 (Adaptasi Kurikulum SD Kelas 1–6, Peta 5 Level, Duolingo English Quest & Cloud Sync)

### ✨ Ditambahkan (Added)
- **Kurikulum Merdeka Adaptif SD Kelas 1 s/d Kelas 6 (Fase A, B, dan C)**:
  - Penyesuaian otomatis gaya bahasa, panjang kalimat TTS, dan tingkat kesulitan soal untuk Kelas 1–6 SD, ditambah input nama panggilan & bio/hobi singkat anak.
- **Peta Petualangan 5 Level per Kelas (30 Level Total)**:
  - Sistem pembukaan level bertahap (*progressive level unlocking*) dengan kuis interaktif dan mini-game Suku Kata & Berhitung.
- **Duolingo-Style English Quest**:
  - Fitur susun kepingan kata (*Word Bank*), latihan pengucapan (*Speak & Listen*), nyawa ❤️, XP ⚡, dan *Streak* 🔥 harian.
- **Sinkronisasi Cloud Ringan (`/api/sync` < 12 KB JSON)**:
  - Penyimpanan progres awan tanpa membebani ruang penyimpanan 32GB eMMC pada Chromebook sekolah.

---

## [v1.0.0] — 2026-10-29 (Fondasi Voice-First AI Tutor Anak SD & PWA Ringan Chromebook)

### ✨ Ditambahkan (Added)
- Ekstraksi dan peningkatan arsitektur dari prototipe awal (`master promt gemini-code-1793244559846.txt` & `tutor_ceria_sd1_canvas.html`).
- Pemisahan struktur kode modular (`index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.json`) dan backend Serverless (`api/chat.js`, `api/tts.js`, `api/systemPrompt.js`) menggunakan Google Gen AI SDK (`@google/genai`).
- Sanitasi teks TTS Bahasa Indonesia (`sanitizeForTTS`) agar bebas simbol Markdown dan mengeja operator matematika secara alami.
