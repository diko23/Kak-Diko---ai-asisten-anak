/**
 * File: api/systemPrompt.js
 * Kontrak System Instruction Adaptif "Kak Diko" (Kelas 1 s/d Kelas 6 SD,
 * Kustomisasi Karakter Favorit Anak, Bio Anak, Jadwal Kegiatan/Jam Tidur,
 * & Instruksi Didikan Custom dari Aplikasi HP Orang Tua)
 * untuk Otak AI Interaktif (`gemini-3.5-flash-lite`).
 */

import { getCharacterCompanion, getGradeProfile } from './curriculumData.js';

export const BASE_SYSTEM_IDENTITY = `Kamu adalah "Kak Diko", sahabat dan mentor belajar interaktif yang sabar, ekspresif, ceria, dan suportif untuk siswa Sekolah Dasar (Kelas 1 sampai Kelas 6 SD) di Indonesia.

ATURAN UTAMA FORMAT SUARA / TEXT-TO-SPEECH (WAJIB DIPATUHI 100%):
1. Gunakan Bahasa Indonesia lisan yang ekspresif, hangat, dan sangat alami saat dibacakan oleh mesin suara (Text-to-Speech).
2. DILARANG KERAS menggunakan format markdown apa pun seperti tanda bintang (*), pagar (#), garis bawah (_), poin-poin (bullet points), atau emoji karena teks akan langsung dibacakan oleh mesin suara.
3. Tulis semua simbol operasi matematika menjadi kata lisan (contoh: tulis "ditambah" bukan "+", tulis "dikurangi" bukan "-", tulis "dikali" bukan "x", tulis "dibagi" bukan "/", tulis "sama dengan" bukan "=").
4. Selalu akhiri jawabanmu dengan SATU pertanyaan pemantik yang ramah agar terjadi dialog dua arah dengan anak.
5. Jika jawaban anak belum tepat, puji keberaniannya lebih dulu, jangan menyalahkan secara kasar, lalu berikan petunjuk bertahap (scaffolding) sesuai umurnya.`;

export const TOPIC_GUIDANCE = {
  kenalan:
    'Fokus saat ini: Perkenalan akrab dengan Kak Diko, menanyakan kabar/kegiatan hari ini, mengaitkan obrolan dengan hobi/cita-cita di bio anak, lalu mengajak memilih tantangan belajar.',
  membaca:
    'Fokus saat ini: Literasi Bahasa Indonesia sesuai jenjang kelas anak (mengeja suku kata untuk kelas bawah, memahami cerita/ide pokok/eksplanasi untuk kelas atas).',
  berhitung:
    'Fokus saat ini: Numerasi dan Matematika sesuai jenjang kelas anak menggunakan analogi benda nyata atau hobi anak.',
  alam:
    'Fokus saat ini: Sains & IPAS (mengenal hewan, tumbuhan, energi, ekosistem, atau tata surya sesuai jenjang kelas anak).',
  budipekerti:
    'Fokus saat ini: Pendidikan Pancasila, karakter mulia, sopan santun kepada orang tua/guru, kejujuran, dan kebiasaan disiplin.',
  english:
    'Fokus saat ini: Belajar Bahasa Inggris interaktif bergaya Duolingo. Gunakan campuran Bahasa Indonesia dan frasa Bahasa Inggris yang jelas sesuai level kelas anak, lalu minta anak menirukan atau menerjemahkan kata/kalimat pendek.'
};

export const SYSTEM_INSTRUCTION = BASE_SYSTEM_IDENTITY;

/**
 * Menyusun system_instruction dinamis berdasarkan:
 * - Kelas Anak (Kelas 1 s/d Kelas 6 SD)
 * - Karakter Kustom Kak Diko pilihan anak (owl, dino, robot, cat, astro)
 * - Nama & Bio Singkat Anak (Hobi, Cita-cita, Minat)
 * - Topik Aktif (termasuk Bahasa Inggris / Duolingo mode)
 * - Instruksi Didikan Custom dari Aplikasi HP Orang Tua
 * - Pengingat Jadwal Kegiatan / Jam Tidur Anak
 */
export function buildSystemInstruction({
  grade = 1,
  characterId = 'owl',
  topic = 'kenalan',
  childName = '',
  childBio = '',
  parentDirective = '',
  scheduleNote = ''
} = {}) {
  const profile = getGradeProfile(grade);
  const companion = getCharacterCompanion(characterId);
  const cleanTopic = String(topic || 'kenalan').toLowerCase().trim();
  const cleanName = String(childName || '').trim();
  const cleanBio = String(childBio || '').trim().slice(0, 300);
  const cleanDirective = String(parentDirective || '').trim().slice(0, 400);
  const cleanSchedule = String(scheduleNote || '').trim().slice(0, 250);

  const sections = [
    BASE_SYSTEM_IDENTITY,
    `WUJUD KARAKTER KAK DIKO PILIHAN ANAK: ${companion.name}. ${companion.personaFlavor}`,
    `PROFIL JENJANG ANAK (KELAS ${profile.grade} SD - ${profile.phase}, Usia ${profile.ageRange}):
- Batas Panjang Jawaban: Maksimal ${profile.maxSentences} kalimat pendek saja per respons.
- Gaya Bahasa & Ekspresi: ${profile.personaStyle}
- Cakupan Materi Kelas ${profile.grade} SD: ${profile.curriculumFocus}`
  ];

  if (TOPIC_GUIDANCE[cleanTopic]) {
    sections.push(`KONTEKS TOPIK AKTIF: ${TOPIC_GUIDANCE[cleanTopic]}`);
  }

  if (cleanName) {
    sections.push(
      `MEMORI NAMA ANAK: Nama panggilan anak adalah "${cleanName}". Sapa dan panggil "${cleanName}" dengan akrab.`
    );
  } else {
    sections.push(
      'MEMORI NAMA ANAK: Anak belum menyebutkan nama panggilannya. Sapa dengan ramah dan tanyakan nama panggilannya.'
    );
  }

  if (cleanBio) {
    sections.push(
      `BIO & MINAT ANAK: "${cleanBio}". Gunakan minat, hobi, atau cita-cita anak ini sebagai contoh atau analogi soal agar anak merasa sangat antusias!`
    );
  }

  if (cleanDirective) {
    sections.push(
      `AMANAT DIDIKAN KHUSUS DARI APLIKASI HP ORANG TUA (WAJIB DITEKANKAN SECARA HALUS & MENDIDIK): "${cleanDirective}". Selipkan pesan didikan orang tua ini secara alami dan positif di dalam bimbinganmu.`
    );
  }

  if (cleanSchedule) {
    sections.push(
      `ADAPTASI JADWAL KEGIATAN ANAK SAAT INI: "${cleanSchedule}". Ingatkan anak dengan lembut tentang jadwal kegiatan atau waktu istirahat ini.`
    );
  }

  return sections.join('\n\n');
}

/**
 * Membersihkan teks keluaran model agar 100% aman dan alami saat dibacakan oleh TTS.
 * Mendukung batas 2 kalimat (Kelas 1-2) atau 3 kalimat (Kelas 3-6).
 */
export function sanitizeForTTS(rawText, maxSentences = 2) {
  if (!rawText || typeof rawText !== 'string') {
    return 'Halo teman pintar! Yuk tekan tombol mikrofon besarnya lalu cerita sama Kak Diko ya?';
  }

  const allowedSentences = Math.min(Math.max(Number(maxSentences) || 2, 1), 3);

  let cleaned = rawText
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*#_~`>|\[\]]/g, '')
    .replace(/[\p{Extended_Pictographic}\u2600-\u27BF]/gu, '')
    .replace(/\+/g, ' ditambah ')
    .replace(/=/g, ' sama dengan ')
    .replace(/(\d)\s*-\s*(\d)/g, '$1 dikurangi $2')
    .replace(/(\d)\s*[x×*]\s*(\d)/gi, '$1 dikali $2')
    .replace(/(\d)\s*[/÷]\s*(\d)/g, '$1 dibagi $2')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Halo teman pintar! Yuk tekan tombol mikrofon besarnya lalu cerita sama Kak Diko ya?';
  }

  const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (sentences && sentences.length > allowedSentences) {
    cleaned = sentences
      .slice(0, allowedSentences)
      .map((s) => s.trim())
      .join(' ');
  }

  if (!/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  return cleaned;
}

/**
 * Mengekstrak nama panggilan anak dari teks percakapan Bahasa Indonesia.
 */
export function extractChildName(text, currentName = '') {
  if (!text || typeof text !== 'string') return currentName || '';
  const cleaned = text.trim();

  if (/\b(siapa|apa|ingat|tahu|lupa)\b.*\b(namaku|nama\s+saya|nama\s+aku)\b/i.test(cleaned)) {
    return currentName || '';
  }

  const explicitPatterns = [
    /(?:nama\s+aku|namaku|nama\s+saya|panggil\s+aku|panggil\s+saya|aku\s+bernama)\s+([a-zA-Z]{2,15})/i,
    /^(?:halo|hai|hei)?\s*(?:kak\s+(?:diko|bimo))?[,\s]*(?:aku|saya)\s+([a-zA-Z]{2,14})[!.,?]?$/i,
    /^([a-zA-Z]{3,12})[!.]?$/i
  ];

  const stopWords = new Set([
    'halo', 'hai', 'iya', 'tidak', 'mau', 'bisa', 'belajar', 'hitung', 'baca',
    'siapa', 'apa', 'kak', 'diko', 'bimo', 'lima', 'empat', 'tiga', 'dua', 'satu',
    'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'buku', 'bola', 'kucing',
    'kelinci', 'sapi', 'kuda', 'meja', 'apel', 'benar', 'betul', 'sudah', 'belum',
    'pagi', 'siang', 'sore', 'malam', 'anak', 'pintar', 'hebat', 'terima', 'kasih',
    'tadi', 'ya', 'dong', 'deh', 'nih', 'sih', 'kan', 'lagi', 'itu', 'ini', 'kelas'
  ]);

  for (let i = 0; i < explicitPatterns.length; i++) {
    if (i === 2 && currentName) continue;
    const match = cleaned.match(explicitPatterns[i]);
    if (match && match[1]) {
      const candidate = match[1].toLowerCase();
      if (!stopWords.has(candidate)) {
        return candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }
  }

  return currentName || '';
}

/**
 * Mencari nama panggilan anak dari pesan terbaru maupun dari riwayat percakapan sebelumnya.
 */
export function resolveChildNameFromSession(message = '', history = [], currentName = '') {
  let resolved = extractChildName(message, currentName);
  if (!resolved && Array.isArray(history)) {
    for (const turn of history) {
      const turnText = turn?.parts?.[0]?.text || '';
      if (turn?.role === 'user') {
        const found = extractChildName(turnText, '');
        if (found) {
          resolved = found;
          break;
        }
      }
    }
  }
  return resolved || '';
}

/**
 * Memangkas riwayat percakapan menggunakan strategi Pinned-Intro Sliding Window:
 * Mengunci 2 pesan pertama (perkenalan nama/bio) + N pesan terbaru.
 */
export function pruneHistory(rawHistory, maxRecentMessages = 12) {
  if (!Array.isArray(rawHistory) || rawHistory.length === 0) return [];

  const normalized = [];
  for (const item of rawHistory) {
    if (!item || typeof item !== 'object') continue;

    let role = item.role;
    if (!role && item.type === 'user_input') role = 'user';
    if (!role && item.type === 'model_output') role = 'model';
    if (role !== 'user' && role !== 'model') continue;

    let text = '';
    if (Array.isArray(item.parts) && item.parts[0] && typeof item.parts[0].text === 'string') {
      text = item.parts[0].text;
    } else if (Array.isArray(item.content) && item.content[0] && typeof item.content[0].text === 'string') {
      text = item.content[0].text;
    } else if (typeof item.text === 'string') {
      text = item.text;
    }

    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) continue;

    normalized.push({
      role,
      parts: [{ text: trimmed }]
    });
  }

  if (normalized.length <= maxRecentMessages) {
    return normalized;
  }

  return [...normalized.slice(0, 2), ...normalized.slice(-maxRecentMessages)];
}

/**
 * Mengonversi array history + pesan baru ke dalam format Steps resmi SDK @google/genai v2.
 */
export function historyToInteractionSteps(cleanedHistory, newMessage) {
  const steps = [];
  const safeHistory = Array.isArray(cleanedHistory) ? cleanedHistory : [];

  for (const item of safeHistory) {
    const text = item?.parts?.[0]?.text;
    if (!text) continue;
    steps.push({
      type: item.role === 'model' ? 'model_output' : 'user_input',
      content: [{ type: 'text', text }]
    });
  }

  const cleanUserMsg = String(newMessage || '').trim().slice(0, 400);
  if (cleanUserMsg) {
    steps.push({
      type: 'user_input',
      content: [{ type: 'text', text: cleanUserMsg }]
    });
  }

  return steps;
}

/**
 * Mesin Penjawab Lokal Cerdas "Kak Diko" (Fallback deterministik yang tetap mematuhi Kelas 1-6, Karakter, Bio, & Amanat Orang Tua).
 */
export function generateSmartFallbackReply({
  message = '',
  history = [],
  topic = 'kenalan',
  childName = '',
  grade = 1,
  characterId = 'owl',
  childBio = '',
  parentDirective = '',
  scheduleNote = ''
} = {}) {
  const profile = getGradeProfile(grade);
  const companion = getCharacterCompanion(characterId);
  const cleanMsg = String(message || '').trim();
  const lower = cleanMsg.toLowerCase();

  const resolvedName = resolveChildNameFromSession(cleanMsg, history, childName);
  const callName = resolvedName || 'teman pintar';
  const introducedInThisMessage = extractChildName(cleanMsg, '');
  const justIntroducedName = Boolean(introducedInThisMessage);

  const cleanSchedule = String(scheduleNote || '').trim();
  const cleanDirective = String(parentDirective || '').trim();
  const cleanBio = String(childBio || '').trim();

  if (cleanSchedule && /tidur|istirahat|mandi|makan|mengaji/i.test(cleanSchedule)) {
    return sanitizeForTTS(
      `Wah ${callName} hebat sekali semangat belajarnya bersama ${companion.name}! Karena sekarang waktunya ${cleanSchedule}, setelah satu pertanyaan singkat ini kita istirahat dulu ya, setuju ${callName}?`,
      profile.maxSentences
    );
  }

  if (/siapa\s+nama(ku|\s+saya)|ingat\s+nama(ku|\s+saya)/i.test(lower)) {
    if (resolvedName) {
      const bioSuffix = cleanBio ? ` yang suka ${cleanBio}` : '';
      return sanitizeForTTS(
        `Tentu saja Kak Diko ingat, namamu adalah ${resolvedName} anak kelas ${profile.grade} yang hebat${bioSuffix}! Sekarang ${resolvedName} mau lanjut tantangan berhitung, bahasa Inggris, atau sains bersama Kak Diko?`,
        profile.maxSentences
      );
    }
    return sanitizeForTTS(
      'Kak Diko belum tahu namamu nih karena kamu belum memberi tahu Kak Diko. Boleh sebutkan siapa nama panggilanmu yang bagus?',
      profile.maxSentences
    );
  }

  if (justIntroducedName) {
    const bioHook = cleanBio ? ` yang gemar ${cleanBio}` : '';
    return sanitizeForTTS(
      `Halo ${resolvedName}${bioHook}, senang sekali ${companion.name} bisa belajar bareng anak kelas ${profile.grade} yang hebat hari ini! ${profile.sampleMathPrompt}`,
      profile.maxSentences
    );
  }

  if (topic === 'english' || /inggris|english|apple|cat|dog|red|blue|school|book/i.test(lower)) {
    return sanitizeForTTS(
      `Great job ${callName}, pelafalan bahasa Inggrismu keren sekali kata Kak Diko! ${profile.sampleEnglishPrompt}`,
      profile.maxSentences
    );
  }

  if (
    topic === 'berhitung' ||
    /tambah|kurang|kali|bagi|pecahan|angka|hitung|kelereng|apel|volume|rasio|\d/.test(lower)
  ) {
    return sanitizeForTTS(
      `Hebat sekali jawabanmu ${callName}, logika matematikamu makin tajam di kelas ${profile.grade}! ${profile.sampleMathPrompt}`,
      profile.maxSentences
    );
  }

  if (topic === 'membaca' || /eja|baca|huruf|kata|buku|cerita|paragraf|pidato/.test(lower)) {
    return sanitizeForTTS(
      `Bagus sekali ${callName}, kemampuan membacamu di kelas ${profile.grade} makin mantap bersama Kak Diko! ${profile.sampleReadingPrompt}`,
      profile.maxSentences
    );
  }

  if (topic === 'alam' || /hewan|kucing|kelinci|energi|ekosistem|planet|sains|ipas/.test(lower)) {
    return sanitizeForTTS(
      `Wah tepat sekali ${callName}, kamu kritis sekali mengamati alam bersama ${companion.name}! ${profile.sampleSciencePrompt}`,
      profile.maxSentences
    );
  }

  if (cleanDirective) {
    return sanitizeForTTS(
      `Terima kasih sudah bercerita dengan semangat ${callName}! Sambil kita lanjut belajar kelas ${profile.grade} bersama Kak Diko, ingat pesan orang tua untuk ${cleanDirective} ya, sekarang kamu siap coba tantangan berikutnya?`,
      profile.maxSentences
    );
  }

  return sanitizeForTTS(
    `Wah seru sekali ceritamu ${callName}, ${companion.name} senang sekali mendengarnya! ${profile.sampleMathPrompt}`,
    profile.maxSentences
  );
}
