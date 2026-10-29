/**
 * File: tests/verify.test.mjs
 * Automated Verification Suite untuk PWA Kak Diko SD Kelas 1–6 (v3.0),
 * Kustomisasi Karakter, Koleksi Badge, & Aplikasi HP Khusus Orang Tua (/parent).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSystemInstruction,
  extractChildName,
  generateSmartFallbackReply,
  historyToInteractionSteps,
  pruneHistory,
  sanitizeForTTS
} from '../api/systemPrompt.js';
import {
  ACHIEVEMENT_BADGES,
  CHARACTER_COMPANIONS,
  GRADE_PROFILES,
  getCharacterCompanion,
  getGradeProfile
} from '../api/curriculumData.js';
import { createAppServer } from '../dev-server.mjs';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');

test('1. Kelengkapan file deliverables PWA Anak, Aplikasi HP Ortu (/parent), dan Serverless (v3.0)', () => {
  const requiredFiles = [
    'index.html',
    'parent.html',
    'styles.css',
    'app.js',
    'parent.js',
    'manifest.json',
    'manifest-parent.json',
    'sw.js',
    'api/chat.js',
    'api/sync.js',
    'api/tts.js',
    'api/curriculumData.js',
    'api/systemPrompt.js',
    'package.json',
    'vercel.json',
    'assets/kak-bimo-256.jpg',
    'assets/icon-192.png',
    'assets/icon-512.png'
  ];

  for (const rel of requiredFiles) {
    const abs = path.join(ROOT_DIR, rel);
    assert.equal(fs.existsSync(abs), true, `File wajib ${rel} harus tersedia`);
    const stat = fs.statSync(abs);
    assert.equal(stat.size > 0, true, `File ${rel} tidak boleh kosong`);
  }
});

test('2. sanitizeForTTS menghapus simbol Markdown, emoji, mengubah simbol matematika, dan mendukung batas kalimat per kelas', () => {
  const raw =
    '🌟 **Hebat sekali** Budi! #Satu: 3 + 2 = 5 dan 6 - 2 = 4. Kalimat ketiga ini untuk anak kelas atas? Kalimat keempat ini harus dipangkas.';
  const cleanedGrade1 = sanitizeForTTS(raw, 2);

  assert.equal(cleanedGrade1.includes('*'), false);
  assert.equal(cleanedGrade1.includes('#'), false);
  assert.equal(cleanedGrade1.includes('🌟'), false);
  assert.equal(cleanedGrade1.includes('ditambah'), true);
  assert.equal(cleanedGrade1.includes('dikurangi'), true);
  assert.equal(cleanedGrade1.includes('sama dengan'), true);
  assert.equal(cleanedGrade1.includes('Kalimat ketiga'), false);

  const cleanedGrade5 = sanitizeForTTS(raw, 3);
  assert.equal(cleanedGrade5.includes('Kalimat ketiga'), true);
  assert.equal(cleanedGrade5.includes('Kalimat keempat'), false);
});

test('3. extractChildName mengenali nama panggilan anak bersama Kak Diko secara akurat', () => {
  assert.equal(extractChildName('Halo Kak Diko, namaku Budi!'), 'Budi');
  assert.equal(extractChildName('Halo Kak Diko, aku Aisyah!'), 'Aisyah');
  assert.equal(extractChildName('Panggil aku Raka'), 'Raka');
  assert.equal(extractChildName('Halo', ''), '');
  assert.equal(extractChildName('Siapa namaku tadi Kak Diko?', 'Budi'), 'Budi');
});

test('4. Katalog 5 Karakter Kustom Kak Diko & 8 Koleksi Badge tersedia lengkap', () => {
  const expectedChars = ['owl', 'dino', 'robot', 'cat', 'astro'];
  for (const cid of expectedChars) {
    const c = getCharacterCompanion(cid);
    assert.equal(c.id, cid);
    assert.equal(c.name.includes('Kak Diko'), true);
  }
  assert.equal(ACHIEVEMENT_BADGES.length, 8);
});

test('5. Kurikulum SD Kelas 1 s/d 6 dan buildSystemInstruction menyertakan Kak Diko, Karakter Kustom, Bio Anak & Arahan HP Ortu', () => {
  for (let g = 1; g <= 6; g++) {
    const profile = getGradeProfile(g);
    assert.equal(profile.grade, g);
    assert.equal(Boolean(profile.phase), true);
  }

  const promptGrade4 = buildSystemInstruction({
    grade: 4,
    characterId: 'dino',
    topic: 'sains',
    childName: 'Budi',
    childBio: 'Suka robotika dan dinosaurus',
    parentDirective: 'Tuntun PR secara bertahap dan ingatkan berdoa',
    scheduleNote: 'Sore hari setelah mengaji'
  });

  assert.equal(promptGrade4.includes('Kak Diko'), true);
  assert.equal(promptGrade4.includes('Kak Diko Dino Ceria'), true);
  assert.equal(promptGrade4.includes('Kelas 4 SD'), true);
  assert.equal(promptGrade4.includes('Budi'), true);
  assert.equal(promptGrade4.includes('dinosaurus'), true);
  assert.equal(promptGrade4.includes('ingatkan berdoa'), true);
});

test('6. Endpoint /api/chat, /api/sync, dan /parent menangani sinkronisasi 2 arah antara Web Anak & Aplikasi HP Orang Tua', async () => {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Pastikan halaman Aplikasi HP Orang Tua (/parent) dapat diakses
    const parentPageRes = await fetch(`${baseUrl}/parent`);
    assert.equal(parentPageRes.status, 200);
    const parentHtml = await parentPageRes.text();
    assert.equal(parentHtml.includes('Diko Parent Monitor'), true);

    // 2. Uji /api/chat dengan karakter 'robot' dan nama 'Budi'
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Halo Kak Diko, namaku Budi!',
        history: [],
        grade: 4,
        characterId: 'robot',
        topic: 'sains',
        childName: '',
        childBio: 'Suka robotika dan sains'
      })
    });
    assert.equal(chatRes.status, 200);
    const chatData = await chatRes.json();
    assert.equal(chatData.childName, 'Budi');
    assert.equal(chatData.characterId, 'robot');
    assert.equal(chatData.reply.includes('Budi'), true);

    // 3. Anak mengirim progres (`role: 'child'`) ke /api/sync
    const childPushRes = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncCode: 'DIKO-TEST99',
        role: 'child',
        payload: {
          childName: 'Budi',
          grade: 4,
          characterId: 'dino',
          stars: 10,
          xp: 120,
          badgesUnlocked: ['badge_kenalan', 'badge_sains']
        }
      })
    });
    assert.equal(childPushRes.status, 200);

    // 4. Aplikasi HP Orang Tua mengirim kontrol & hadiah +5 bintang (`role: 'parent'`) ke /api/sync
    const parentPushRes = await fetch(`${baseUrl}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncCode: 'DIKO-TEST99',
        role: 'parent',
        payload: {
          bonusStars: 5,
          bonusXp: 25,
          parentDirective: 'Latih pecahan dan sopan santun',
          bedtimeStart: '20:45',
          remoteLocked: false,
          parentCheerMessage: 'Hebat sekali Budi anak Ayah & Ibu!'
        }
      })
    });
    assert.equal(parentPushRes.status, 200);
    const parentPushData = await parentPushRes.json();
    assert.equal(parentPushData.payload.stars, 15, 'Bintang anak (10) + bonus ortu (5) harus menjadi 15');
    assert.equal(parentPushData.payload.parentControls.parentDirective, 'Latih pecahan dan sopan santun');
    assert.equal(parentPushData.payload.badgesUnlocked.includes('badge_sains'), true, 'Badge anak tidak boleh hilang saat ortu update kontrol');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('7. Arsitektur Interactive AI Character Stage (v4.0 Vibecode Game UI) memiliki rig SVG animasi, interaksi karakter, dan AI Co-Pilot', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
  const stylesCss = fs.readFileSync(path.join(ROOT_DIR, 'styles.css'), 'utf-8');
  const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf-8');

  // Pastikan komponen Game Stage & Karakter Interaktif tersedia di index.html
  assert.equal(indexHtml.includes('id="interactiveCharacterStage"'), true);
  assert.equal(indexHtml.includes('id="interactHighFiveBtn"'), true);
  assert.equal(indexHtml.includes('id="interactFeedBtn"'), true);
  assert.equal(indexHtml.includes('id="interactRiddleBtn"'), true);
  assert.equal(indexHtml.includes('id="friendshipBarFill"'), true);
  assert.equal(indexHtml.includes('id="floatingAiCoPilot"'), true);
  assert.equal(indexHtml.includes('id="duoCompanionMiniBox"'), true);

  // Pastikan keyframe animasi Puppet Rig dan 3D tactile buttons tersedia di styles.css
  assert.equal(stylesCss.includes('@keyframes rigBlinkEyes'), true);
  assert.equal(stylesCss.includes('@keyframes rigWaveArm'), true);
  assert.equal(stylesCss.includes('@keyframes rigTalkMouth'), true);
  assert.equal(stylesCss.includes('@keyframes rigJumpCelebrate'), true);
  assert.equal(stylesCss.includes('.btn-3d-amber'), true);
  assert.equal(stylesCss.includes('.btn-3d-emerald'), true);

  // Pastikan fungsi interaksi karakter & SVG multi-layer tersedia di app.js
  assert.equal(appJs.includes('handleCharacterHighFive'), true);
  assert.equal(appJs.includes('handleCharacterFeed'), true);
  assert.equal(appJs.includes('handleCharacterRiddle'), true);
  assert.equal(appJs.includes('handleFloatingCoPilotHint'), true);
  assert.equal(appJs.includes('class="rig-eyes"'), true);
  assert.equal(appJs.includes('class="rig-arm"'), true);
  assert.equal(appJs.includes('class="rig-mouth"'), true);
});

