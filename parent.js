/**
 * File: parent.js
 * Logika Aplikasi HP Khusus Orang Tua ("Diko Parent Monitor" - /parent).
 * Memantau Laporan Perkembangan Anak, Koleksi Badge, Log Percakapan,
 * serta Mengatur Jam Tidur, Kunci Layar Jarak Jauh, & Didikan Custom AI Kak Diko.
 */

(function () {
  'use strict';

  const CHARACTER_META = {
    owl: { name: 'Kak Diko Burung Hantu', emoji: '🦉', phaseColor: '#F59E0B' },
    dino: { name: 'Kak Diko Dino Ceria', emoji: '🦖', phaseColor: '#10B981' },
    robot: { name: 'Kak Diko Robo Pintar', emoji: '🤖', phaseColor: '#3B82F6' },
    cat: { name: 'Kak Diko Kucing Imut', emoji: '🐱', phaseColor: '#EC4899' },
    astro: { name: 'Kak Diko Astronot', emoji: '🚀', phaseColor: '#8B5CF6' }
  };

  const ALL_BADGES = [
    {
      id: 'badge_kenalan',
      title: 'Sahabat Kak Diko',
      icon: '🌟',
      category: 'Sosial & Karakter',
      desc: 'Berkenalan & memilih karakter favorit.'
    },
    {
      id: 'badge_suara',
      title: 'Pemberani Suara',
      icon: '🎙️',
      category: 'Komunikasi',
      desc: 'Berbicara & bertanya jawab dengan Kak Diko.'
    },
    {
      id: 'badge_matematika',
      title: 'Ksatria Angka',
      icon: '🧮',
      category: 'Matematika',
      desc: 'Menjawab tantangan berhitung & logika.'
    },
    {
      id: 'badge_literasi',
      title: 'Penjelajah Kata',
      icon: '📖',
      category: 'Bahasa Indonesia',
      desc: 'Menyelesaikan latihan suku kata & literasi.'
    },
    {
      id: 'badge_sains',
      title: 'Ilmuwan Cilik IPAS',
      icon: '🔬',
      category: 'Sains & Alam',
      desc: 'Menaklukkan misi sains & eksperimen.'
    },
    {
      id: 'badge_english',
      title: 'Bintang English Quest',
      icon: '🇬🇧',
      category: 'Bahasa Inggris',
      desc: 'Menyusun kalimat Bahasa Inggris ala Duolingo.'
    },
    {
      id: 'badge_petualang',
      title: 'Penakluk Peta Level',
      icon: '🗺️',
      category: 'Kurikulum SD',
      desc: 'Membuka minimal Level 3 di Peta Kelas.'
    },
    {
      id: 'badge_master',
      title: 'Juara Bintang SD',
      icon: '👑',
      category: 'Pencapaian Utama',
      desc: 'Mengumpulkan minimal 10 Bintang atau 100 XP.'
    }
  ];

  const state = {
    syncCode: 'DIKO-2026',
    activeTab: 'report',
    childData: null
  };

  const el = {
    topSyncCodeLabel: document.getElementById('topSyncCodeLabel'),
    refreshParentDataBtn: document.getElementById('refreshParentDataBtn'),
    parentSyncCodeInput: document.getElementById('parentSyncCodeInput'),
    parentConnectCodeBtn: document.getElementById('parentConnectCodeBtn'),
    parentToastBanner: document.getElementById('parentToastBanner'),

    parentChildCharBadge: document.getElementById('parentChildCharBadge'),
    parentChildNameTitle: document.getElementById('parentChildNameTitle'),
    parentChildCompanionSub: document.getElementById('parentChildCompanionSub'),

    pTabReportBtn: document.getElementById('pTabReportBtn'),
    pTabControlBtn: document.getElementById('pTabControlBtn'),
    pTabBadgesBtn: document.getElementById('pTabBadgesBtn'),

    pViewReport: document.getElementById('pViewReport'),
    pViewControl: document.getElementById('pViewControl'),
    pViewBadges: document.getElementById('pViewBadges'),

    repStarsText: document.getElementById('repStarsText'),
    repXpText: document.getElementById('repXpText'),
    repDurationText: document.getElementById('repDurationText'),
    repStreakText: document.getElementById('repStreakText'),
    repGradePhasePill: document.getElementById('repGradePhasePill'),

    scoreMembacaText: document.getElementById('scoreMembacaText'),
    barMembacaFill: document.getElementById('barMembacaFill'),
    scoreBerhitungText: document.getElementById('scoreBerhitungText'),
    barBerhitungFill: document.getElementById('barBerhitungFill'),
    scoreSainsText: document.getElementById('scoreSainsText'),
    barSainsFill: document.getElementById('barSainsFill'),
    scoreKarakterText: document.getElementById('scoreKarakterText'),
    barKarakterFill: document.getElementById('barKarakterFill'),
    scoreEnglishText: document.getElementById('scoreEnglishText'),
    barEnglishFill: document.getElementById('barEnglishFill'),

    parentCheerInput: document.getElementById('parentCheerInput'),
    sendCheerBtn: document.getElementById('sendCheerBtn'),
    parentActivityFeed: document.getElementById('parentActivityFeed'),
    parentRecentChatsBox: document.getElementById('parentRecentChatsBox'),

    remoteLockStatusBadge: document.getElementById('remoteLockStatusBadge'),
    remoteLockNowBtn: document.getElementById('remoteLockNowBtn'),
    remoteUnlockNowBtn: document.getElementById('remoteUnlockNowBtn'),

    pDirectiveInput: document.getElementById('pDirectiveInput'),
    pBedtimeStart: document.getElementById('pBedtimeStart'),
    pBedtimeEnd: document.getElementById('pBedtimeEnd'),
    pScheduleSelect: document.getElementById('pScheduleSelect'),
    pDailyLimitSelect: document.getElementById('pDailyLimitSelect'),
    saveParentControlsBtn: document.getElementById('saveParentControlsBtn'),

    parentBadgeCountPill: document.getElementById('parentBadgeCountPill'),
    parentBadgesGrid: document.getElementById('parentBadgesGrid'),
    pChildGradeSelect: document.getElementById('pChildGradeSelect'),
    pChildCharSelect: document.getElementById('pChildCharSelect'),
    pDriveWebhookInput: document.getElementById('pDriveWebhookInput'),
    pUpdateProfileBtn: document.getElementById('pUpdateProfileBtn'),
    pExportReportBtn: document.getElementById('pExportReportBtn')
  };

  function showToast(msg, isAlert = false) {
    if (!el.parentToastBanner) return;
    el.parentToastBanner.textContent = msg;
    el.parentToastBanner.style.background = isAlert ? '#FEF2F2' : '#ECFDF5';
    el.parentToastBanner.style.color = isAlert ? '#B91C1C' : '#047857';
    el.parentToastBanner.style.borderColor = isAlert ? '#FECACA' : '#6EE7B7';
  }

  function formatDuration(sec = 0) {
    const total = Math.max(Number(sec) || 0, 0);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}m ${String(s).padStart(2, '0')}d`;
  }

  function getPhaseLabel(grade = 1) {
    const g = Number(grade) || 1;
    if (g <= 2) return `Kelas ${g} • Fase A`;
    if (g <= 4) return `Kelas ${g} • Fase B`;
    return `Kelas ${g} • Fase C`;
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    const map = {
      report: [el.pTabReportBtn, el.pViewReport],
      control: [el.pTabControlBtn, el.pViewControl],
      badges: [el.pTabBadgesBtn, el.pViewBadges]
    };

    for (const [key, [btn, view]] of Object.entries(map)) {
      if (btn) btn.classList.toggle('active', key === tabName);
      if (view) view.classList.toggle('hidden', key !== tabName);
    }
  }

  function renderDashboard(payload) {
    if (!payload) return;
    state.childData = payload;

    const charKey = String(payload.characterId || 'dino').toLowerCase();
    const charMeta = CHARACTER_META[charKey] || CHARACTER_META.owl;
    const childName = payload.childName || 'Budi';
    const grade = Number(payload.grade) || 4;
    const bio = payload.childBio || 'Sains & Petualangan';

    if (el.parentChildCharBadge) el.parentChildCharBadge.textContent = charMeta.emoji;
    if (el.parentChildNameTitle) el.parentChildNameTitle.textContent = `${childName} (Kelas ${grade} SD)`;
    if (el.parentChildCompanionSub) {
      el.parentChildCompanionSub.textContent = `Mentor: ${charMeta.name} • Minat: ${bio}`;
    }

    // Metrics
    if (el.repStarsText) el.repStarsText.textContent = String(payload.stars ?? 0);
    if (el.repXpText) el.repXpText.textContent = `${payload.xp ?? 0} XP`;
    if (el.repDurationText) el.repDurationText.textContent = formatDuration(payload.studySeconds ?? 0);
    if (el.repStreakText) el.repStreakText.textContent = `${payload.duoStreak ?? 1} Hari`;
    if (el.repGradePhasePill) el.repGradePhasePill.textContent = getPhaseLabel(grade);

    // Skill bars
    const scores = payload.skillScores || {
      membaca: 85,
      berhitung: 92,
      sains: 90,
      karakter: 88,
      english: 84
    };
    const updateBar = (scoreEl, fillEl, val) => {
      const clamped = Math.min(Math.max(Number(val) || 75, 10), 100);
      if (scoreEl) scoreEl.textContent = `${clamped}%`;
      if (fillEl) fillEl.style.width = `${clamped}%`;
    };
    updateBar(el.scoreMembacaText, el.barMembacaFill, scores.membaca);
    updateBar(el.scoreBerhitungText, el.barBerhitungFill, scores.berhitung);
    updateBar(el.scoreSainsText, el.barSainsFill, scores.sains);
    updateBar(el.scoreKarakterText, el.barKarakterFill, scores.karakter);
    updateBar(el.scoreEnglishText, el.barEnglishFill, scores.english);

    // Activity Feed
    if (el.parentActivityFeed) {
      const logs = Array.isArray(payload.activityLog) ? payload.activityLog : [];
      el.parentActivityFeed.innerHTML = logs.length
        ? logs
            .slice(0, 6)
            .map(
              (item) => `
            <div class="phone-feed-item">
              <span class="feed-time">${item.time || 'Hari ini'}</span>
              <span class="feed-text">${item.text || ''}</span>
            </div>`
            )
            .join('')
        : '<div class="phone-feed-item">Belum ada aktivitas tercatat hari ini.</div>';
    }

    // Recent Chats
    if (el.parentRecentChatsBox) {
      const chats = Array.isArray(payload.recentChats) ? payload.recentChats : [];
      el.parentRecentChatsBox.innerHTML = chats.length
        ? chats
            .slice(-4)
            .map((c) => {
              const speaker = c.role === 'model' ? `${charMeta.emoji} Kak Diko` : `👦 ${childName}`;
              return `<div class="chat-line"><strong>${speaker}:</strong> ${c.text}</div>`;
            })
            .join('')
        : '<div class="chat-line">Belum ada percakapan suara hari ini.</div>';
    }

    // Parent Controls
    const pc = payload.parentControls || {};
    if (el.pDirectiveInput && pc.parentDirective !== undefined) {
      el.pDirectiveInput.value = pc.parentDirective;
    }
    if (el.pBedtimeStart && pc.bedtimeStart) el.pBedtimeStart.value = pc.bedtimeStart;
    if (el.pBedtimeEnd && pc.bedtimeEnd) el.pBedtimeEnd.value = pc.bedtimeEnd;
    if (el.pScheduleSelect && pc.scheduleNote !== undefined) {
      el.pScheduleSelect.value = pc.scheduleNote;
    }
    if (el.pDailyLimitSelect && pc.dailyLimitMinutes !== undefined) {
      el.pDailyLimitSelect.value = String(pc.dailyLimitMinutes);
    }
    if (el.pDriveWebhookInput && pc.driveWebhookUrl) {
      el.pDriveWebhookInput.value = pc.driveWebhookUrl;
    }

    const isLocked = Boolean(pc.remoteLocked);
    if (el.remoteLockStatusBadge) {
      el.remoteLockStatusBadge.textContent = isLocked ? '🔒 Layar Terkunci' : '🔓 Layar Terbuka';
      el.remoteLockStatusBadge.style.background = isLocked ? '#FEE2E2' : '#D1FAE5';
      el.remoteLockStatusBadge.style.color = isLocked ? '#B91C1C' : '#047857';
    }

    // Badges Grid in Parent App
    const unlockedSet = new Set(Array.isArray(payload.badgesUnlocked) ? payload.badgesUnlocked : ['badge_kenalan']);
    if (el.parentBadgeCountPill) {
      el.parentBadgeCountPill.textContent = `${unlockedSet.size} / ${ALL_BADGES.length} Terbuka`;
    }
    if (el.parentBadgesGrid) {
      el.parentBadgesGrid.innerHTML = ALL_BADGES.map((b) => {
        const unlocked = unlockedSet.has(b.id);
        return `
          <div class="parent-badge-card ${unlocked ? 'unlocked' : 'locked'}">
            <div class="p-badge-icon">${unlocked ? b.icon : '🔒'}</div>
            <div>
              <div class="p-badge-title">${b.title}</div>
              <div class="p-badge-desc">${b.desc}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    if (el.pChildGradeSelect) el.pChildGradeSelect.value = String(grade);
    if (el.pChildCharSelect) el.pChildCharSelect.value = charKey;
  }

  async function fetchChildProgress(code) {
    const cleanCode = String(code || state.syncCode || 'DIKO-2026').trim().toUpperCase();
    state.syncCode = cleanCode;
    if (el.topSyncCodeLabel) el.topSyncCodeLabel.textContent = cleanCode;
    if (el.parentSyncCodeInput) el.parentSyncCodeInput.value = cleanCode;

    try {
      const res = await fetch(`/api/sync?syncCode=${encodeURIComponent(cleanCode)}`);
      const data = await res.json();
      if (data?.payload) {
        renderDashboard(data.payload);
        // Simpan juga ke localStorage agar preview satu browser langsung sinkron
        try {
          localStorage.setItem('kak_diko_parent_controls_v3', JSON.stringify(data.payload.parentControls || {}));
        } catch {}
        showToast(`✅ Laporan perkembangan ${data.payload.childName || 'Anak'} berhasil dimuat (Kode: ${cleanCode}).`);
      } else {
        showToast(`ℹ️ Kode ${cleanCode} belum memiliki data. Menampilkan profil baru.`);
      }
    } catch (err) {
      showToast('⚠️ Gagal memuat dari server, memeriksa penyimpanan lokal...', true);
    }
  }

  async function pushParentUpdate(partialPayload, successMsg) {
    const cleanCode = state.syncCode || 'DIKO-2026';
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode: cleanCode,
          role: 'parent',
          payload: partialPayload
        })
      });
      const data = await res.json();
      if (data?.payload) {
        renderDashboard(data.payload);
        try {
          localStorage.setItem(
            'kak_diko_parent_controls_v3',
            JSON.stringify(data.payload.parentControls || {})
          );
          localStorage.setItem('kak_diko_shared_family_v3', JSON.stringify(data.payload));
        } catch {}
      }
      showToast(successMsg || '✅ Pengaturan berhasil dikirim ke perangkat anak!');
    } catch (err) {
      showToast('⚠️ Gagal mengirim pengaturan ke server.', true);
    }
  }

  function bindEvents() {
    el.pTabReportBtn?.addEventListener('click', () => switchTab('report'));
    el.pTabControlBtn?.addEventListener('click', () => switchTab('control'));
    el.pTabBadgesBtn?.addEventListener('click', () => switchTab('badges'));

    el.refreshParentDataBtn?.addEventListener('click', () => fetchChildProgress(state.syncCode));
    el.parentConnectCodeBtn?.addEventListener('click', () => {
      const code = el.parentSyncCodeInput?.value || 'DIKO-2026';
      fetchChildProgress(code);
    });

    // Kirim Apresiasi +5 Bintang dari HP Orang Tua
    el.sendCheerBtn?.addEventListener('click', () => {
      const cheerMsg =
        el.parentCheerInput?.value?.trim() ||
        'Hebat sekali belajarnya hari ini Nak! Ini hadiah +5 Bintang dari Ayah & Ibu!';
      pushParentUpdate(
        {
          bonusStars: 5,
          bonusXp: 25,
          parentCheerMessage: cheerMsg,
          parentLogEntry: `Orang Tua mengirim hadiah +5 ⭐ & pesan: "${cheerMsg}"`
        },
        '🎁 Hadiah +5 Bintang & Pesan Semangat berhasil dikirim ke layar Chromebook anak!'
      );
    });

    // Preset Directive Chips
    document.querySelectorAll('[data-p-directive]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-p-directive') || '';
        if (el.pDirectiveInput) el.pDirectiveInput.value = text;
      });
    });

    // Remote Lock / Unlock
    el.remoteLockNowBtn?.addEventListener('click', () => {
      pushParentUpdate(
        {
          remoteLocked: true,
          parentLogEntry: 'Orang Tua mengaktifkan Kunci Layar Istirahat dari HP.'
        },
        '🔒 Layar perangkat anak berhasil DIKUNCI dari jarak jauh!'
      );
    });

    el.remoteUnlockNowBtn?.addEventListener('click', () => {
      pushParentUpdate(
        {
          remoteLocked: false,
          parentLogEntry: 'Orang Tua membuka Kunci Layar perangkat anak dari HP.'
        },
        '🔓 Kunci layar perangkat anak berhasil DIBUKA!'
      );
    });

    // Simpan Kontrol & Amanat AI
    el.saveParentControlsBtn?.addEventListener('click', () => {
      const directive = el.pDirectiveInput?.value?.trim() || '';
      const bedtimeStart = el.pBedtimeStart?.value || '21:00';
      const bedtimeEnd = el.pBedtimeEnd?.value || '05:30';
      const scheduleNote = el.pScheduleSelect?.value || '';
      const dailyLimitMinutes = Number(el.pDailyLimitSelect?.value) || 0;

      pushParentUpdate(
        {
          parentDirective: directive,
          bedtimeStart,
          bedtimeEnd,
          scheduleNote,
          dailyLimitMinutes,
          parentLogEntry: `Orang Tua memperbarui fokus didikan AI & jadwal jam tidur (${bedtimeStart}–${bedtimeEnd}).`
        },
        '📲 Fokus didikan AI Kak Diko & jadwal jam tidur berhasil diterapkan ke perangkat anak!'
      );
    });

    // Update Profil & Karakter Anak dari HP
    el.pUpdateProfileBtn?.addEventListener('click', () => {
      const grade = Number(el.pChildGradeSelect?.value) || 4;
      const characterId = el.pChildCharSelect?.value || 'dino';
      const driveWebhookUrl = el.pDriveWebhookInput?.value?.trim() || '';

      pushParentUpdate(
        {
          grade,
          characterId,
          parentControls: {
            ...(state.childData?.parentControls || {}),
            driveWebhookUrl
          },
          parentLogEntry: `Orang Tua menyesuaikan profil ke Kelas ${grade} SD dengan karakter ${characterId.toUpperCase()}.`
        },
        `✅ Profil anak diperbarui ke Kelas ${grade} SD (${CHARACTER_META[characterId]?.name || 'Kak Diko'})!`
      );
    });

    // Export Laporan JSON
    el.pExportReportBtn?.addEventListener('click', () => {
      const reportData = state.childData || {};
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-perkembangan-${(reportData.childName || 'anak').toLowerCase()}-${state.syncCode}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('📥 File Laporan Perkembangan Anak (.json) berhasil diunduh!');
    });
  }

  bindEvents();
  fetchChildProgress('DIKO-2026');
})();
