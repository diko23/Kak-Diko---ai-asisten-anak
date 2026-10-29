---
trigger: model_decision
description: "Aktifkan aturan ini saat memodifikasi atau memperluas proyek Kak Diko SD Kelas 1–6 (Voice-First AI Tutor, Custom Character, Level Quest, Duolingo English, Badge Collection & Dedicated Mobile Parent App /parent untuk Chromebook 2GB RAM / 32GB eMMC & Vercel Serverless)."
---

# Invarian Arsitektur: Kak Diko SD Kelas 1–6 & Diko Parent Monitor (v3.0)

1. **Pemisahan Tegas Antarmuka Anak (`index.html`) vs. Aplikasi HP Orang Tua (`parent.html` / `/parent`)**:
   - Antarmuka web anak (`index.html`) hanya boleh menampilkan pengaturan dasar ramah anak (*Pilih Karakter Kak Diko*, *Suara*, *Tema Warna*, dan *Kode Sinkronisasi*).
   - Seluruh kontrol lanjutan orang tua (*Remote Screen Lock*, *Jam Tidur Malam*, *Fokus Didikan Custom AI `parentDirective`*, dan *Grafik Laporan Perkembangan Anak*) wajib berada di aplikasi HP khusus orang tua (`parent.html` & `parent.js`).
2. **Sinkronisasi Dua Arah Ringan (`/api/sync` < 12 KB JSON, 0 MB Beban Chromebook)**:
   - Gunakan `role: 'child'` saat aplikasi anak mengirim pembaruan progres/badge/log, dan `role: 'parent'` saat aplikasi HP orang tua mengirim pembaruan kontrol atau hadiah bintang, sehingga kedua state digabungkan (`mergeFamilyPayload`) tanpa saling menimpa.
3. **Identitas "Kak Diko" & 5 Karakter Kustom (`CHARACTER_COMPANIONS`)**:
   - Gunakan `getCharacterCompanion(characterId)` (`owl`, `dino`, `robot`, `cat`, `astro`) dan `getGradeProfile(grade)` (Kelas 1–6 SD) di dalam `buildSystemInstruction()` pada `api/systemPrompt.js`.
4. **Google Gen AI SDK Modern (`@google/genai` >= `2.29.1`)**:
   - Gunakan `ai.interactions.create` dengan model **`gemini-3.5-flash-lite`** (`/api/chat`) dan **`gemini-3.8-flash-lite-tts`** (`/api/tts`).
5. **Interactive AI Character Stage & Game-Grade Kid UI (v4.0)**:
   - Pertahankan rig SVG multi-layer murni (`.rig-eyes`, `.rig-arm`, `.rig-mouth` di `app.js` & `styles.css`) pada `#interactiveCharacterStage` serta `#floatingAiCoPilot` agar berjalan 60 FPS di Chromebook RAM 2GB tanpa ketergantungan WebGL/Canvas berat.
