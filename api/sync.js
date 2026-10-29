/**
 * File: api/sync.js
 * Endpoint Serverless `/api/sync` (v3.0) untuk Sinkronisasi Dua Arah:
 * [Aplikasi Web Anak (Chromebook)] <---> [Cloud Sync / Drive] <---> [Aplikasi HP Khusus Orang Tua (/parent)]
 *
 * Fitur Utama:
 * 1. Merge pintar antara Progres Anak (`role: 'child'`) dan Kontrol Jarak Jauh HP Orang Tua (`role: 'parent'`).
 * 2. Menyimpan Laporan Perkembangan Anak (Skor 5 Bidang, Koleksi Badge, Durasi Belajar, Log Obrolan & Aktivitas).
 * 3. Mendukung Supabase Cloud DB REST API & Google Drive / Sheets Apps Script Webhook (0 MB beban Chromebook).
 */

const memorySyncStore = new Map();

function createDefaultFamilyRecord(syncCode = 'DIKO-2026') {
  const now = new Date().toISOString();
  return {
    syncCode,
    updatedAt: now,
    payload: {
      childName: 'Budi',
      grade: 4,
      characterId: 'dino',
      childBio: 'suka robot, sains, dan dinosaurus',
      stars: 14,
      xp: 185,
      studySeconds: 740,
      duoStreak: 3,
      unlockedLevels: {
        1: 3,
        2: 2,
        3: 2,
        4: 3,
        5: 1,
        6: 1
      },
      badgesUnlocked: [
        'badge_kenalan',
        'badge_suara',
        'badge_matematika',
        'badge_sains',
        'badge_english',
        'badge_petualang',
        'badge_master'
      ],
      skillScores: {
        membaca: 85,
        berhitung: 92,
        sains: 90,
        karakter: 88,
        english: 84
      },
      activityLog: [
        {
          time: 'Baru saja',
          type: 'badge',
          text: 'Membuka Badge "Ilmuwan Cilik IPAS" & "Bintang English Quest"'
        },
        {
          time: '3 menit lalu',
          type: 'level',
          text: 'Menyelesaikan Misi Kelas 4 Level 2: Gaya & Perubahan Energi (+25 XP)'
        },
        {
          time: '6 menit lalu',
          type: 'english',
          text: 'Menyusun kalimat Duolingo English: "My favorite hobby is swimming" (+20 XP)'
        },
        {
          time: '9 menit lalu',
          type: 'voice',
          text: 'Berdialog suara dengan Kak Diko Dino tentang pecahan & eksperimen sains'
        }
      ],
      recentChats: [
        {
          role: 'user',
          text: 'Halo Kak Diko! Aku Budi, beri aku tantangan sains dan pecahan Kelas 4 ya!'
        },
        {
          role: 'model',
          text: 'Rawrr ceria! Halo Budi yang suka robot dan dinosaurus! Kalau pizza dibagi 8 potong sama besar lalu dimakan 2 potong, berapa nilai pecahannya ya?'
        }
      ],
      parentControls: {
        parentDirective:
          'Gunakan perumpamaan dinosaurus dan robot, tuntun logika bertahap tanpa memberi jawaban PR langsung, dan ingatkan Budi berdoa sebelum belajar.',
        bedtimeStart: '21:00',
        bedtimeEnd: '05:30',
        scheduleNote: '',
        dailyLimitMinutes: 30,
        remoteLocked: false,
        parentCheerMessage: 'Semangat terus belajarnya Budi sayang! Ayah & Ibu bangga lihat progresmu hari ini!',
        driveWebhookUrl: '',
        updatedByParentAt: now
      }
    }
  };
}

// Seed default demo code DIKO-2026 dan BIMO-2026
memorySyncStore.set('DIKO-2026', createDefaultFamilyRecord('DIKO-2026'));
memorySyncStore.set('BIMO-2026', createDefaultFamilyRecord('BIMO-2026'));

function sanitizeSyncCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return '';
  return rawCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-_]/g, '')
    .slice(0, 24);
}

function mergeFamilyPayload(existingPayload = {}, incomingPayload = {}, role = 'full') {
  const base = existingPayload && typeof existingPayload === 'object' ? existingPayload : {};
  const next = incomingPayload && typeof incomingPayload === 'object' ? incomingPayload : {};

  const mergedParentControls = {
    ...(base.parentControls || {}),
    ...(next.parentControls || {})
  };

  if (typeof next.parentDirective === 'string') {
    mergedParentControls.parentDirective = next.parentDirective;
  }
  if (typeof next.bedtimeStart === 'string') {
    mergedParentControls.bedtimeStart = next.bedtimeStart;
  }
  if (typeof next.bedtimeEnd === 'string') {
    mergedParentControls.bedtimeEnd = next.bedtimeEnd;
  }
  if (typeof next.scheduleNote === 'string') {
    mergedParentControls.scheduleNote = next.scheduleNote;
  }
  if (next.dailyLimitMinutes !== undefined) {
    mergedParentControls.dailyLimitMinutes = Number(next.dailyLimitMinutes) || 0;
  }
  if (typeof next.remoteLocked === 'boolean') {
    mergedParentControls.remoteLocked = next.remoteLocked;
  }
  if (typeof next.parentCheerMessage === 'string') {
    mergedParentControls.parentCheerMessage = next.parentCheerMessage;
  }

  // Jika pengiriman berasal dari Aplikasi HP Orang Tua (`role === 'parent'`),
  // pertahankan progres anak dan tambahkan bonus bintang jika orang tua mengirim hadiah apresiasi.
  if (role === 'parent') {
    const bonusStars = Number(next.bonusStars) || 0;
    const bonusXp = Number(next.bonusXp) || 0;
    const updatedActivityLog = Array.isArray(base.activityLog) ? [...base.activityLog] : [];
    if (next.parentLogEntry) {
      updatedActivityLog.unshift({
        time: 'Baru saja (HP Ortu)',
        type: 'parent',
        text: String(next.parentLogEntry).slice(0, 180)
      });
    }

    return {
      ...base,
      childName: next.childName !== undefined ? next.childName : base.childName,
      grade: next.grade !== undefined ? Number(next.grade) : base.grade,
      characterId: next.characterId || base.characterId || 'owl',
      childBio: next.childBio !== undefined ? next.childBio : base.childBio,
      stars: (Number(base.stars) || 0) + bonusStars,
      xp: (Number(base.xp) || 0) + bonusXp,
      activityLog: updatedActivityLog.slice(0, 15),
      parentControls: {
        ...mergedParentControls,
        updatedByParentAt: new Date().toISOString()
      }
    };
  }

  // Jika pengiriman berasal dari Aplikasi Web Anak (`role === 'child'` atau `'full'`),
  // perbarui progres, badge, dan log anak, namun tetap jaga `parentControls` dari HP orang tua.
  return {
    ...base,
    ...next,
    skillScores: {
      ...(base.skillScores || {}),
      ...(next.skillScores || {})
    },
    unlockedLevels: {
      ...(base.unlockedLevels || {}),
      ...(next.unlockedLevels || {})
    },
    badgesUnlocked: Array.isArray(next.badgesUnlocked)
      ? Array.from(new Set([...(base.badgesUnlocked || []), ...next.badgesUnlocked]))
      : base.badgesUnlocked || [],
    activityLog: Array.isArray(next.activityLog)
      ? next.activityLog.slice(0, 15)
      : base.activityLog || [],
    recentChats: Array.isArray(next.recentChats)
      ? next.recentChats.slice(-8)
      : base.recentChats || [],
    parentControls: mergedParentControls
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Ambil State & Laporan Perkembangan Anak berdasarkan Kode Keluarga (`?syncCode=DIKO-2026`)
  if (req.method === 'GET') {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const rawParam =
      parsedUrl.searchParams.get('syncCode') || parsedUrl.searchParams.get('code') || '';
    const syncCode = sanitizeSyncCode(rawParam);

    if (!syncCode) {
      return res.status(400).json({
        error: 'Parameter syncCode (Kode Keluarga) wajib diisi.'
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const sbRes = await fetch(
          `${supabaseUrl}/rest/v1/kak_bimo_progress?sync_code=eq.${encodeURIComponent(syncCode)}&select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`
            }
          }
        );
        if (sbRes.ok) {
          const rows = await sbRes.json();
          if (Array.isArray(rows) && rows[0]?.payload) {
            return res.status(200).json({
              ok: true,
              status: 'ok',
              source: 'supabase-cloud',
              syncCode,
              payload: rows[0].payload,
              record: {
                syncCode,
                payload: rows[0].payload,
                updatedAt: rows[0].updated_at
              },
              updatedAt: rows[0].updated_at
            });
          }
        }
      } catch (err) {
        console.warn('[Sync Supabase Read Fallback]:', err?.message || err);
      }
    }

    const saved = memorySyncStore.get(syncCode) || null;
    return res.status(200).json({
      ok: true,
      status: 'ok',
      source: saved ? 'cloud-sync-store' : 'empty',
      syncCode,
      payload: saved ? saved.payload : null,
      record: saved,
      updatedAt: saved ? saved.updatedAt : null
    });
  }

  // 2. POST: Simpan / Gabungkan Progres Anak atau Pengaturan HP Orang Tua
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Format JSON tidak valid.' });
      }
    }

    const syncCode = sanitizeSyncCode(body?.syncCode);
    const incomingPayload = body?.payload;
    const role = String(body?.role || 'full').toLowerCase();
    const driveWebhookUrl = String(
      body?.driveWebhookUrl ||
        incomingPayload?.parentControls?.driveWebhookUrl ||
        process.env.GOOGLE_DRIVE_WEBHOOK_URL ||
        ''
    ).trim();

    if (!syncCode || !incomingPayload || typeof incomingPayload !== 'object') {
      return res.status(400).json({
        error: 'Kode Keluarga (syncCode) dan data payload progres wajib disertakan.'
      });
    }

    const existingRecord = memorySyncStore.get(syncCode);
    const mergedPayload = mergeFamilyPayload(
      existingRecord ? existingRecord.payload : {},
      incomingPayload,
      role
    );

    const updatedAt = new Date().toISOString();
    const record = {
      syncCode,
      updatedAt,
      payload: mergedPayload
    };

    memorySyncStore.set(syncCode, record);
    const targetsSynced = ['cloud-sync-store'];

    // Opsi A: Simpan ke Supabase Cloud DB bila variabel environment tersedia
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const sbRes = await fetch(`${supabaseUrl}/rest/v1/kak_bimo_progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            sync_code: syncCode,
            payload: mergedPayload,
            updated_at: updatedAt
          })
        });
        if (sbRes.ok) targetsSynced.push('supabase-cloud');
      } catch (err) {
        console.warn('[Sync Supabase Write Warning]:', err?.message || err);
      }
    }

    // Opsi B: Teruskan ke Google Drive / Google Sheets melalui Google Apps Script Webhook
    if (driveWebhookUrl && /^https:\/\/script\.google\.com\/macros\/s\//i.test(driveWebhookUrl)) {
      try {
        const driveRes = await fetch(driveWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        if (driveRes.ok) targetsSynced.push('google-drive-webhook');
      } catch (err) {
        console.warn('[Sync Google Drive Webhook Warning]:', err?.message || err);
      }
    }

    return res.status(200).json({
      ok: true,
      status: 'saved',
      syncCode,
      updatedAt,
      targetsSynced,
      payload: mergedPayload,
      sizeBytes: Buffer.byteLength(JSON.stringify(mergedPayload), 'utf8')
    });
  }

  return res.status(405).json({ error: 'Metode tidak diizinkan.' });
}
