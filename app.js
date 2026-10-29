/**
 * File: app.js
 * Logika Frontend Vanilla JavaScript v4.0 untuk PWA Kak Diko World SD (Kelas 1 s/d Kelas 6).
 * Mencakup:
 * 1. Living Interactive AI Character Rig (5 Karakter SVG Multi-Layer dengan Lip-Sync, Kedip Mata, Lambaian & Lompat)
 * 2. Interaksi Langsung Anak dengan Karakter (Tos High-Five, Kasih Energi + Bar Persahabatan, & Tebak-Tebakan)
 * 3. Floating AI Assistant Co-Pilot di Semua Halaman (Memberi Petunjuk Soal Level & English Quest)
 * 4. Pulau Petualangan 5 Level per Kelas (Kelas 1–6), Duolingo-Style English Quest, & Koleksi 8 Badge
 * 5. Sinkronisasi Dua Arah Real-Time dengan Aplikasi HP Khusus Orang Tua (`/parent` & `/api/sync`)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kak_diko_sd_v4_state';
  const API_CHAT_URL = '/api/chat';
  const API_SYNC_URL = '/api/sync';
  const API_TIMEOUT_MS = 12000;

  // ==========================================================================
  // 1. KATALOG 5 KARAKTER INTERAKTIF "KAK DIKO" (FULL ANIMATED SVG PUPPET RIGS)
  // ==========================================================================
  const CHARACTER_CATALOG = {
    owl: {
      id: 'owl',
      name: 'Kak Diko Burung Hantu',
      shortLabel: '🦉 Burung Hantu Pintar',
      emoji: '🦉',
      snackEmoji: '🫐 Buah Beri Emas',
      borderColor: '#F59E0B',
      bgGradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      greeting:
        'Huu-huu ceria! Halo sahabat pintar! Aku Kak Diko si Burung Hantu Profesor. Ketuk tubuhku untuk tos atau tekan mikrofon untuk bertualang ilmu!',
      highFiveLine:
        'Huu-huu mantap! Tos dulu sahabat pintar, semangat belajarmu hari ini luar biasa!',
      feedLine:
        'Nyam-nyam! Terima kasih buah beri emasnya, energi otak Kak Diko Burung Hantu langsung penuh seratus persen!',
      svgHtml: `
        <svg viewBox="0 0 200 200" aria-label="Rig Interaktif Kak Diko Burung Hantu">
          <ellipse cx="100" cy="182" rx="54" ry="10" fill="rgba(15,23,42,0.14)" />
          <!-- Sayap Kiri & Kanan (Melambai) -->
          <g class="rig-arm">
            <ellipse cx="36" cy="118" rx="18" ry="34" transform="rotate(18 36 118)" fill="#D97706" />
          </g>
          <ellipse cx="164" cy="118" rx="18" ry="34" transform="rotate(-18 164 118)" fill="#D97706" />
          <!-- Badan Bulat Hangat -->
          <ellipse cx="100" cy="118" rx="56" ry="58" fill="#F59E0B" stroke="#B45309" stroke-width="4" />
          <ellipse cx="100" cy="128" rx="40" ry="42" fill="#FEF3C7" />
          <!-- Pola Bulu Dada -->
          <path d="M84 118 Q90 124 96 118 M104 118 Q110 124 116 118 M92 134 Q100 142 108 134" stroke="#D97706" stroke-width="3.5" fill="none" stroke-linecap="round" />
          <!-- Topi Wisuda Profesor -->
          <polygon points="100,24 46,46 100,64 154,46" fill="#1E293B" stroke="#FBBF24" stroke-width="3" />
          <rect x="74" y="54" width="52" height="12" rx="4" fill="#334155" />
          <path d="M138 48 L146 72" stroke="#FBBF24" stroke-width="4" stroke-linecap="round" />
          <circle cx="146" cy="74" r="5" fill="#F59E0B" />
          <!-- Mata Besar Berkedip & Kacamata -->
          <g class="rig-eyes">
            <circle cx="78" cy="86" r="20" fill="#FFFFFF" stroke="#B45309" stroke-width="4" />
            <circle cx="122" cy="86" r="20" fill="#FFFFFF" stroke="#B45309" stroke-width="4" />
            <line x1="98" y1="86" x2="102" y2="86" stroke="#B45309" stroke-width="4" />
            <circle cx="80" cy="86" r="10" fill="#0F172A" />
            <circle cx="120" cy="86" r="10" fill="#0F172A" />
            <circle cx="84" cy="82" r="3.5" fill="#FFFFFF" />
            <circle cx="124" cy="82" r="3.5" fill="#FFFFFF" />
          </g>
          <!-- Paruh & Mulut Bicara (Lip-Sync) -->
          <g class="rig-mouth">
            <polygon points="91,98 109,98 100,114" fill="#EA580C" />
            <ellipse cx="100" cy="108" rx="6" ry="4" fill="#9A3412" />
          </g>
          <!-- Kaki Kecil -->
          <ellipse cx="80" cy="174" rx="12" ry="6" fill="#EA580C" />
          <ellipse cx="120" cy="174" rx="12" ry="6" fill="#EA580C" />
        </svg>`
    },
    dino: {
      id: 'dino',
      name: 'Kak Diko Dino Ceria',
      shortLabel: '🦖 Dino Penjelajah',
      emoji: '🦖',
      snackEmoji: '🍎 Apel Purba Super',
      borderColor: '#10B981',
      bgGradient: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
      greeting:
        'Rawrr ceria! Halo penjelajah hebat! Aku Kak Diko Dino asisten AI belajarmu. Yuk tos dulu atau tekan mikrofon untuk mulai petualangan!',
      highFiveLine:
        'Rawrr keren! Tos dino super kuat! Kamu anak paling pemberani dan cerdas hari ini!',
      feedLine:
        'Krauk-krauk! Wah apel merahnya segar sekali, tenaga Kak Diko Dino makin siap menemanimu naik level!',
      svgHtml: `
        <svg viewBox="0 0 200 200" aria-label="Rig Interaktif Kak Diko Dino">
          <ellipse cx="100" cy="182" rx="56" ry="10" fill="rgba(15,23,42,0.14)" />
          <!-- Ekor & Sirip Punggung -->
          <path d="M44 148 Q16 140 22 114 Q30 124 48 128" fill="#059669" />
          <polygon points="62,38 72,20 82,36" fill="#F59E0B" />
          <polygon points="84,34 96,16 106,34" fill="#F97316" />
          <polygon points="108,38 120,22 126,42" fill="#F59E0B" />
          <!-- Badan & Kepala Dino Ramah -->
          <rect x="48" y="42" width="100" height="126" rx="48" fill="#10B981" stroke="#047857" stroke-width="4" />
          <!-- Perut Krem Garis Dino -->
          <ellipse cx="102" cy="126" rx="34" ry="36" fill="#FEF08A" />
          <line x1="76" y1="116" x2="128" y2="116" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
          <line x1="74" y1="132" x2="130" y2="132" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
          <!-- Tangan Dino Melambai -->
          <g class="rig-arm">
            <ellipse cx="42" cy="112" rx="16" ry="10" transform="rotate(-24 42 112)" fill="#10B981" stroke="#047857" stroke-width="3.5" />
          </g>
          <ellipse cx="156" cy="112" rx="16" ry="10" transform="rotate(24 156 112)" fill="#10B981" stroke="#047857" stroke-width="3.5" />
          <!-- Mata Berkedip Ekspresif -->
          <g class="rig-eyes">
            <circle cx="78" cy="72" r="14" fill="#FFFFFF" stroke="#047857" stroke-width="3.5" />
            <circle cx="122" cy="72" r="14" fill="#FFFFFF" stroke="#047857" stroke-width="3.5" />
            <circle cx="80" cy="72" r="7.5" fill="#0F172A" />
            <circle cx="124" cy="72" r="7.5" fill="#0F172A" />
            <circle cx="83" cy="69" r="3" fill="#FFFFFF" />
            <circle cx="127" cy="69" r="3" fill="#FFFFFF" />
          </g>
          <!-- Pipi Merona -->
          <ellipse cx="62" cy="86" rx="8" ry="5" fill="#FB7185" opacity="0.65" />
          <ellipse cx="138" cy="86" rx="8" ry="5" fill="#FB7185" opacity="0.65" />
          <!-- Mulut Dino Ceria (Lip-Sync) -->
          <g class="rig-mouth">
            <path d="M78 92 Q100 112 122 92 Z" fill="#065F46" />
            <polygon points="85,93 90,100 95,93" fill="#FFFFFF" />
            <polygon points="105,93 110,100 115,93" fill="#FFFFFF" />
            <ellipse cx="100" cy="101" rx="10" ry="5" fill="#FB7185" />
          </g>
          <!-- Kaki Dino -->
          <rect x="66" y="162" width="24" height="16" rx="8" fill="#059669" />
          <rect x="110" y="162" width="24" height="16" rx="8" fill="#059669" />
        </svg>`
    },
    robot: {
      id: 'robot',
      name: 'Kak Diko Robo Pintar',
      shortLabel: '🤖 Robot Masa Depan',
      emoji: '🤖',
      snackEmoji: '🔋 Baterai Quantum',
      borderColor: '#3B82F6',
      bgGradient: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
      greeting:
        'Bip-bop ceria! Sistem asisten pintar aktif! Aku Kak Diko Robo, siap memecahkan misi sains dan logika bersamamu!',
      highFiveLine:
        'Bip-bop turbo! Tos elektrik berhasil! Otak kita makin kompak memecahkan teka-teki!',
      feedLine:
        'Bzzzt-mantap! Baterai Quantum terisi penuh, radar kecerdasan Kak Diko Robo naik ke level maksimum!',
      svgHtml: `
        <svg viewBox="0 0 200 200" aria-label="Rig Interaktif Kak Diko Robo">
          <ellipse cx="100" cy="182" rx="52" ry="10" fill="rgba(15,23,42,0.14)" />
          <!-- Antena Pemancar Cahaya -->
          <line x1="100" y1="18" x2="100" y2="42" stroke="#2563EB" stroke-width="6" stroke-linecap="round" />
          <circle cx="100" cy="16" r="10" fill="#F59E0B" stroke="#FEF08A" stroke-width="3" />
          <!-- Tangan Robot Melambai -->
          <g class="rig-arm">
            <rect x="22" y="96" width="22" height="42" rx="11" transform="rotate(20 33 117)" fill="#60A5FA" stroke="#1D4ED8" stroke-width="3.5" />
          </g>
          <rect x="156" y="96" width="22" height="42" rx="11" transform="rotate(-20 167 117)" fill="#60A5FA" stroke="#1D4ED8" stroke-width="3.5" />
          <!-- Kepala & Badan Cyber -->
          <rect x="44" y="40" width="112" height="84" rx="26" fill="#3B82F6" stroke="#1D4ED8" stroke-width="4" />
          <rect x="54" y="50" width="92" height="64" rx="18" fill="#0F172A" />
          <!-- Mata LED Digital Berkedip -->
          <g class="rig-eyes">
            <circle cx="78" cy="76" r="13" fill="#38BDF8" />
            <circle cx="122" cy="76" r="13" fill="#38BDF8" />
            <circle cx="82" cy="72" r="4" fill="#FFFFFF" />
            <circle cx="126" cy="72" r="4" fill="#FFFFFF" />
          </g>
          <!-- Mulut Gelombang LED (Lip-Sync) -->
          <g class="rig-mouth">
            <rect x="76" y="96" width="48" height="10" rx="5" fill="#34D399" />
          </g>
          <!-- Badan Bawah & Panel Energi -->
          <rect x="58" y="128" width="84" height="44" rx="16" fill="#60A5FA" stroke="#1D4ED8" stroke-width="4" />
          <circle cx="100" cy="150" r="12" fill="#FEF08A" stroke="#F59E0B" stroke-width="3" />
        </svg>`
    },
    cat: {
      id: 'cat',
      name: 'Kak Diko Kucing Imut',
      shortLabel: '🐱 Kucing Imut Cerdas',
      emoji: '🐱',
      snackEmoji: '🍓 Biskuit Stroberi',
      borderColor: '#EC4899',
      bgGradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
      greeting:
        'Meong ceria! Halo sahabat baikku! Aku Kak Diko Neko asisten belajarmu yang imut. Yuk kita bermain sambil belajar!',
      highFiveLine:
        'Meong-hore! Tos telapak kucing lembut! Kamu pintar dan baik hati sekali!',
      feedLine:
        'Nyam-meong! Biskuit stroberinya enak sekali, Kak Diko Kucing makin semangat membantumu!',
      svgHtml: `
        <svg viewBox="0 0 200 200" aria-label="Rig Interaktif Kak Diko Kucing">
          <ellipse cx="100" cy="182" rx="52" ry="10" fill="rgba(15,23,42,0.14)" />
          <!-- Telinga Kucing -->
          <polygon points="48,74 56,24 90,52" fill="#F472B6" stroke="#DB2777" stroke-width="4" />
          <polygon points="152,74 144,24 110,52" fill="#F472B6" stroke="#DB2777" stroke-width="4" />
          <!-- Tangan Kucing Melambai -->
          <g class="rig-arm">
            <ellipse cx="38" cy="122" rx="16" ry="11" transform="rotate(-20 38 122)" fill="#F9A8D4" stroke="#DB2777" stroke-width="3.5" />
          </g>
          <ellipse cx="162" cy="122" rx="16" ry="11" transform="rotate(20 162 122)" fill="#F9A8D4" stroke="#DB2777" stroke-width="3.5" />
          <!-- Kepala & Badan Kucing -->
          <circle cx="100" cy="104" r="56" fill="#F9A8D4" stroke="#DB2777" stroke-width="4" />
          <ellipse cx="100" cy="134" rx="34" ry="24" fill="#FDF2F8" />
          <!-- Mata Berkilau Berkedip -->
          <g class="rig-eyes">
            <circle cx="76" cy="88" r="12" fill="#0F172A" />
            <circle cx="124" cy="88" r="12" fill="#0F172A" />
            <circle cx="80" cy="84" r="4" fill="#FFFFFF" />
            <circle cx="128" cy="84" r="4" fill="#FFFFFF" />
          </g>
          <!-- Kumis Kucing -->
          <line x1="36" y1="96" x2="58" y2="98" stroke="#9D174D" stroke-width="3" stroke-linecap="round" />
          <line x1="36" y1="106" x2="58" y2="104" stroke="#9D174D" stroke-width="3" stroke-linecap="round" />
          <line x1="164" y1="96" x2="142" y2="98" stroke="#9D174D" stroke-width="3" stroke-linecap="round" />
          <line x1="164" y1="106" x2="142" y2="104" stroke="#9D174D" stroke-width="3" stroke-linecap="round" />
          <!-- Hidung & Mulut Kucing (Lip-Sync) -->
          <polygon points="94,98 106,98 100,105" fill="#BE185D" />
          <g class="rig-mouth">
            <path d="M86 108 Q100 122 114 108 Z" fill="#E11D48" />
          </g>
          <!-- Kalung Lonceng Emas -->
          <rect x="70" y="148" width="60" height="10" rx="5" fill="#EF4444" />
          <circle cx="100" cy="156" r="9" fill="#FBBF24" stroke="#B45309" stroke-width="2.5" />
        </svg>`
    },
    astro: {
      id: 'astro',
      name: 'Kak Diko Kapten Astronot',
      shortLabel: '🚀 Kapten Astronot',
      emoji: '🚀',
      snackEmoji: '🌟 Kristal Bintang',
      borderColor: '#8B5CF6',
      bgGradient: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
      greeting:
        'Tiga, dua, satu, meluncur! Halo kapten muda! Aku Kak Diko Astronot, siap menjelajah galaksi ilmu pengetahuan bersamamu!',
      highFiveLine:
        'Tos gravitasi nol! Kamu siap terbang tinggi meraih cita-citamu, Kapten!',
      feedLine:
        'Woow! Kristal bintang diterima, roket pengetahuan Kak Diko Astronot siap melesat ke planet berikutnya!',
      svgHtml: `
        <svg viewBox="0 0 200 200" aria-label="Rig Interaktif Kak Diko Astronot">
          <ellipse cx="100" cy="182" rx="52" ry="10" fill="rgba(15,23,42,0.22)" />
          <!-- Tangan Astronot Melambai -->
          <g class="rig-arm">
            <rect x="24" y="106" width="24" height="38" rx="12" transform="rotate(24 36 125)" fill="#FFFFFF" stroke="#7C3AED" stroke-width="3.5" />
          </g>
          <rect x="152" y="106" width="24" height="38" rx="12" transform="rotate(-24 164 125)" fill="#FFFFFF" stroke="#7C3AED" stroke-width="3.5" />
          <!-- Baju Ruang Angkasa -->
          <rect x="54" y="114" width="92" height="58" rx="24" fill="#FFFFFF" stroke="#7C3AED" stroke-width="4" />
          <rect x="76" y="128" width="48" height="26" rx="8" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2.5" />
          <circle cx="90" cy="141" r="5" fill="#10B981" />
          <circle cx="110" cy="141" r="5" fill="#F59E0B" />
          <!-- Helm Kubah Astronot -->
          <circle cx="100" cy="78" r="52" fill="#FFFFFF" stroke="#7C3AED" stroke-width="4.5" />
          <rect x="58" y="48" width="84" height="56" rx="26" fill="#1E1B4B" stroke="#38BDF8" stroke-width="3" />
          <!-- Mata Berkedip di Dalam Visor -->
          <g class="rig-eyes">
            <circle cx="80" cy="72" r="10" fill="#38BDF8" />
            <circle cx="120" cy="72" r="10" fill="#38BDF8" />
            <circle cx="83" cy="69" r="3.5" fill="#FFFFFF" />
            <circle cx="123" cy="69" r="3.5" fill="#FFFFFF" />
          </g>
          <!-- Mulut Senyum Visor (Lip-Sync) -->
          <g class="rig-mouth">
            <ellipse cx="100" cy="90" rx="12" ry="6" fill="#FCD34D" />
          </g>
        </svg>`
    }
  };

  const ACHIEVEMENT_BADGES = [
    {
      id: 'badge_kenalan',
      title: 'Sahabat Kak Diko',
      icon: '🌟',
      category: 'Sosial & Karakter',
      desc: 'Berkenalan dengan Kak Diko dan memilih karakter favoritmu.'
    },
    {
      id: 'badge_suara',
      title: 'Pemberani Suara',
      icon: '🎙️',
      category: 'Komunikasi Aktif',
      desc: 'Berani berbicara dan bertanya jawab dengan Kak Diko.'
    },
    {
      id: 'badge_matematika',
      title: 'Ksatria Angka',
      icon: '🧮',
      category: 'Matematika & Logika',
      desc: 'Menjawab tantangan berhitung dan logika matematika dengan tepat.'
    },
    {
      id: 'badge_literasi',
      title: 'Penjelajah Kata',
      icon: '📖',
      category: 'Bahasa Indonesia',
      desc: 'Menyelesaikan latihan membaca suku kata dan kosakata.'
    },
    {
      id: 'badge_sains',
      title: 'Ilmuwan Cilik IPAS',
      icon: '🔬',
      category: 'Sains & Alam',
      desc: 'Menaklukkan misi pengetahuan alam dan eksperimen sains.'
    },
    {
      id: 'badge_english',
      title: 'Bintang English Quest',
      icon: '🇬🇧',
      category: 'Bahasa Inggris',
      desc: 'Berhasil menyusun kalimat Bahasa Inggris ala Duolingo.'
    },
    {
      id: 'badge_petualang',
      title: 'Penakluk Pulau Level',
      icon: '🗺️',
      category: 'Kurikulum SD',
      desc: 'Membuka minimal Level 3 pada Pulau Petualangan Kelasmu.'
    },
    {
      id: 'badge_master',
      title: 'Juara Bintang SD',
      icon: '👑',
      category: 'Pencapaian Utama',
      desc: 'Mengumpulkan minimal 10 Bintang atau 100 XP Belajar.'
    }
  ];

  const RIDDLES_BY_GRADE = {
    1: 'Aku buah berwarna merah, rasanya manis, kalau 3 ditambah 2 jumlahku jadi berapa ya?',
    2: 'Aku punya jarum pendek dan jarum panjang di dinding, serta berdetak tik-tok. Siapakah aku?',
    3: 'Aku dingin seperti batu di kulkas, tapi kalau dijemur matahari aku berubah jadi air. Peristiwa apakah itu?',
    4: 'Ketika kamu menyalakan kipas angin di kamar, energi listrik berubah menjadi energi apa ya?',
    5: 'Aku adalah planet terbesar di tata surya dan punya bintik merah raksasa. Planet apakah aku?',
    6: 'Bumi berputar pada porosnya sehingga terjadi siang dan malam. Disebut gerakan apakah itu?'
  };

  // ==========================================================================
  // 2. BANK KURIKULUM PULAU 5 LEVEL PER KELAS (KELAS 1 S/D KELAS 6 SD)
  // ==========================================================================
  const LEVEL_QUESTS_BY_GRADE = {
    1: [
      {
        level: 1,
        title: 'Penjumlahan Apel',
        subject: 'Matematika',
        icon: '🍎',
        question: 'Ibu membeli 4 apel merah lalu Ayah membawa lagi 3 apel merah. Berapa jumlah apel semuanya?',
        choices: ['6 Apel', '7 Apel', '8 Apel'],
        answer: '7 Apel'
      },
      {
        level: 2,
        title: 'Mengeja Kata',
        subject: 'Bahasa Indonesia',
        icon: '📖',
        question: 'Jika suku kata SE dan PA dan TU digabung, menjadi nama benda apa yang dipakai di kaki?',
        choices: ['SEPEDA', 'SEPATU', 'CELANA'],
        answer: 'SEPATU'
      },
      {
        level: 3,
        title: 'Suara & Ciri Hewan',
        subject: 'Sains Alam',
        icon: '🐰',
        question: 'Hewan manakah yang memiliki telinga panjang, bergerak melompat, dan suka makan wortel?',
        choices: ['Kelinci', 'Kucing', 'Ayam'],
        answer: 'Kelinci'
      },
      {
        level: 4,
        title: 'Empat Kata Ajaib',
        subject: 'Karakter Pancasila',
        icon: '💛',
        question: 'Saat kita meminta bantuan kepada teman atau kakak, kata sopan apa yang harus diucapkan?',
        choices: ['Tolong', 'Cepat', 'Awas'],
        answer: 'Tolong'
      },
      {
        level: 5,
        title: 'Tantangan Bintang Kelas 1',
        subject: 'Campuran',
        icon: '👑',
        question: 'Ada 10 balon di pesta, lalu 3 balon terbang ke langit. Sisa balon sekarang ada berapa?',
        choices: ['6 Balon', '7 Balon', '8 Balon'],
        answer: '7 Balon'
      }
    ],
    2: [
      {
        level: 1,
        title: 'Hitungan Puluhan',
        subject: 'Matematika',
        icon: '🔢',
        question: 'Di perpustakaan ada 25 buku cerita dan 15 buku gambar. Berapa jumlah seluruh buku tersebut?',
        choices: ['35 Buku', '40 Buku', '45 Buku'],
        answer: '40 Buku'
      },
      {
        level: 2,
        title: 'Membaca Jam',
        subject: 'Matematika',
        icon: '🕒',
        question: 'Jika jarum pendek menunjuk angka 7 dan jarum panjang menunjuk angka 12, pukul berapakah itu?',
        choices: ['Pukul 07.00', 'Pukul 12.00', 'Pukul 07.30'],
        answer: 'Pukul 07.00'
      },
      {
        level: 3,
        title: 'Hidup Bersih & Sehat',
        subject: 'Sains & Kesehatan',
        icon: '🧼',
        question: 'Mengapa kita harus menggosok gigi sebelum tidur malam?',
        choices: ['Agar kuman tidak merusak gigi', 'Agar cepat mengantuk', 'Agar gigi berubah warna'],
        answer: 'Agar kuman tidak merusak gigi'
      },
      {
        level: 4,
        title: 'Hidup Rukun',
        subject: 'Pancasila',
        icon: '🤝',
        question: 'Contoh sikap rukun saat bermain bersama teman di lapangan sekolah adalah...',
        choices: ['Bergantian memakai mainan', 'Merebut bola teman', 'Marah saat kalah'],
        answer: 'Bergantian memakai mainan'
      },
      {
        level: 5,
        title: 'Tantangan Juara Kelas 2',
        subject: 'Campuran',
        icon: '🏆',
        question: 'Satu minggu terdiri dari berapa hari?',
        choices: ['5 Hari', '7 Hari', '10 Hari'],
        answer: '7 Hari'
      }
    ],
    3: [
      {
        level: 1,
        title: 'Petualangan Perkalian',
        subject: 'Matematika',
        icon: '✖️',
        question: 'Budi memiliki 4 kotak kelereng. Setiap kotak berisi 6 kelereng. Berapa total kelereng Budi?',
        choices: ['20 Kelereng', '24 Kelereng', '28 Kelereng'],
        answer: '24 Kelereng'
      },
      {
        level: 2,
        title: 'Perubahan Wujud Benda',
        subject: 'IPAS Sains',
        icon: '🧊',
        question: 'Peristiwa es batu yang berubah menjadi air saat diletakkan di tempat terbuka disebut...',
        choices: ['Mencair', 'Membeku', 'Menguap'],
        answer: 'Mencair'
      },
      {
        level: 3,
        title: 'Tokoh Cerita',
        subject: 'Bahasa Indonesia',
        icon: '📚',
        question: 'Pesan kebaikan yang dapat kita tiru dari sebuah dongeng atau cerita disebut...',
        choices: ['Amanat cerita', 'Latar tempat', 'Judul buku'],
        answer: 'Amanat cerita'
      },
      {
        level: 4,
        title: 'Lambang Sila Pancasila',
        subject: 'Pancasila',
        icon: '🦅',
        question: 'Sila ketiga Pancasila yang berbunyi "Persatuan Indonesia" dilambangkan dengan gambar...',
        choices: ['Pohon Beringin', 'Bintang Emas', 'Kepala Banteng'],
        answer: 'Pohon Beringin'
      },
      {
        level: 5,
        title: 'Tantangan Juara Kelas 3',
        subject: 'Campuran',
        icon: '🌟',
        question: 'Jika 36 buah jeruk dibagikan sama rata kepada 4 anak, masing-masing anak mendapat berapa jeruk?',
        choices: ['8 Jeruk', '9 Jeruk', '10 Jeruk'],
        answer: '9 Jeruk'
      }
    ],
    4: [
      {
        level: 1,
        title: 'Misi Pecahan Senilai',
        subject: 'Matematika',
        icon: '🍕',
        question: 'Sebuah kue dipotong menjadi 8 bagian sama besar. Jika Raka memakan 2 bagian, bentuk sederhana pecahannya adalah...',
        choices: ['1/4', '1/2', '2/4'],
        answer: '1/4'
      },
      {
        level: 2,
        title: 'Gaya & Energi',
        subject: 'IPAS Sains',
        icon: '⚡',
        question: 'Pada saat kita menyalakan kipas angin listrik di rumah, terjadi perubahan energi listrik menjadi...',
        choices: ['Energi Gerak', 'Energi Kimia', 'Energi Cahaya'],
        answer: 'Energi Gerak'
      },
      {
        level: 3,
        title: 'Gagasan Pokok',
        subject: 'Bahasa Indonesia',
        icon: '📝',
        question: 'Inti pembahasan utama yang menjadi dasar pengembangan sebuah paragraf disebut...',
        choices: ['Gagasan Pokok', 'Kalimat Tanya', 'Daftar Pustaka'],
        answer: 'Gagasan Pokok'
      },
      {
        level: 4,
        title: 'Keliling Persegi',
        subject: 'Matematika Geometri',
        icon: '📐',
        question: 'Sebuah taman berbentuk persegi memiliki panjang sisi 9 meter. Berapa meter keliling taman tersebut?',
        choices: ['27 Meter', '36 Meter', '81 Meter'],
        answer: '36 Meter'
      },
      {
        level: 5,
        title: 'Tantangan Juara Kelas 4',
        subject: 'Kebudayaan & Sains',
        icon: '🏛️',
        question: 'Semboyan bangsa Indonesia "Bhinneka Tunggal Ika" memiliki arti...',
        choices: ['Berbeda-beda tetapi tetap satu jua', 'Bersatu kita teguh', 'Maju terus pantang mundur'],
        answer: 'Berbeda-beda tetapi tetap satu jua'
      }
    ],
    5: [
      {
        level: 1,
        title: 'Volume Bangun Ruang',
        subject: 'Matematika',
        icon: '📦',
        question: 'Sebuah kotak mainan berbentuk kubus memiliki panjang rusuk 5 cm. Berapakah volume kubus tersebut?',
        choices: ['25 cm³', '100 cm³', '125 cm³'],
        answer: '125 cm³'
      },
      {
        level: 2,
        title: 'Organ Pernapasan',
        subject: 'IPAS Biologi',
        icon: '🫁',
        question: 'Tempat terjadinya pertukaran oksigen dan karbon dioksida di dalam paru-paru manusia disebut...',
        choices: ['Alveolus', 'Bronkus', 'Trakea'],
        answer: 'Alveolus'
      },
      {
        level: 3,
        title: 'Rantai Makanan',
        subject: 'IPAS Ekosistem',
        icon: '🌾',
        question: 'Dalam ekosistem sawah, tanaman padi dapat membuat makanannya sendiri melalui fotosintesis sehingga berperan sebagai...',
        choices: ['Produsen', 'Konsumen Tingkat I', 'Pengurai'],
        answer: 'Produsen'
      },
      {
        level: 4,
        title: 'Pecahan ke Persen',
        subject: 'Matematika',
        icon: '💯',
        question: 'Bentuk persen dari pecahan 3/4 adalah...',
        choices: ['25%', '50%', '75%'],
        answer: '75%'
      },
      {
        level: 5,
        title: 'Tantangan Juara Kelas 5',
        subject: 'Penalaran Kritis',
        icon: '🔬',
        question: 'Teks yang menjelaskan proses terjadinya fenomena alam seperti pelangi atau gunung meletus disebut...',
        choices: ['Teks Eksplanasi', 'Teks Narasi Fiksi', 'Teks Puisi'],
        answer: 'Teks Eksplanasi'
      }
    ],
    6: [
      {
        level: 1,
        title: 'Perbandingan & Rasio',
        subject: 'Matematika',
        icon: '⚖️',
        question: 'Perbandingan buku cerita Andi dan Budi adalah 2 : 3. Jika jumlah buku mereka 30 buah, berapa buku milik Budi?',
        choices: ['12 Buku', '18 Buku', '20 Buku'],
        answer: '18 Buku'
      },
      {
        level: 2,
        title: 'Sistem Tata Surya',
        subject: 'IPAS Astronomi',
        icon: '🪐',
        question: 'Planet terbesar di dalam sistem tata surya kita yang memiliki bintik merah raksasa adalah...',
        choices: ['Jupiter', 'Saturnus', 'Mars'],
        answer: 'Jupiter'
      },
      {
        level: 3,
        title: 'Rotasi & Revolusi Bumi',
        subject: 'IPAS Sains',
        icon: '🌍',
        question: 'Peristiwa pergantian siang dan malam di permukaan Bumi disebabkan oleh...',
        choices: ['Rotasi Bumi pada porosnya', 'Revolusi Bumi mengelilingi Matahari', 'Gerhana Bulan'],
        answer: 'Rotasi Bumi pada porosnya'
      },
      {
        level: 4,
        title: 'Sejarah Kemerdekaan',
        subject: 'Sejarah Nasional',
        icon: '🇮🇩',
        question: 'Siapakah tokoh pengetik naskah asli Proklamasi Kemerdekaan Indonesia pada tahun 1945?',
        choices: ['Sayuti Melik', 'Achmad Soebardjo', 'Sukarni'],
        answer: 'Sayuti Melik'
      },
      {
        level: 5,
        title: 'Boss Level Lulus SD',
        subject: 'Matematika Statistika',
        icon: '🎓',
        question: 'Nilai ulangan Raka adalah 80, 90, dan 100. Berapakah nilai rata-rata (mean) ulangan Raka?',
        choices: ['85', '90', '95'],
        answer: '90'
      }
    ]
  };

  // ==========================================================================
  // 3. BANK SOAL DUOLINGO-STYLE ENGLISH QUEST PER KELAS (KELAS 1 S/D 6)
  // ==========================================================================
  const DUO_EXERCISES_BY_GRADE = {
    1: [
      {
        english: 'I have two red apples',
        indoHint: 'Susun dalam Bahasa Inggris: "Saya punya dua apel merah"',
        targetWords: ['I', 'have', 'two', 'red', 'apples'],
        distractors: ['blue', 'cat']
      },
      {
        english: 'The cute cat is sleeping',
        indoHint: 'Susun dalam Bahasa Inggris: "Kucing lucu itu sedang tidur"',
        targetWords: ['The', 'cute', 'cat', 'is', 'sleeping'],
        distractors: ['dog', 'big']
      },
      {
        english: 'Good morning my teacher',
        indoHint: 'Susun dalam Bahasa Inggris: "Selamat pagi guruku"',
        targetWords: ['Good', 'morning', 'my', 'teacher'],
        distractors: ['night', 'book']
      }
    ],
    2: [
      {
        english: 'She likes reading story books',
        indoHint: 'Susun dalam Bahasa Inggris: "Dia suka membaca buku cerita"',
        targetWords: ['She', 'likes', 'reading', 'story', 'books'],
        distractors: ['water', 'table']
      },
      {
        english: 'There are five yellow stars',
        indoHint: 'Susun dalam Bahasa Inggris: "Ada lima bintang kuning"',
        targetWords: ['There', 'are', 'five', 'yellow', 'stars'],
        distractors: ['green', 'shoes']
      },
      {
        english: 'We play football together',
        indoHint: 'Susun dalam Bahasa Inggris: "Kami bermain sepak bola bersama"',
        targetWords: ['We', 'play', 'football', 'together'],
        distractors: ['sleep', 'chair']
      }
    ],
    3: [
      {
        english: 'I go to school every morning',
        indoHint: 'Susun dalam Bahasa Inggris: "Saya pergi ke sekolah setiap pagi"',
        targetWords: ['I', 'go', 'to', 'school', 'every', 'morning'],
        distractors: ['yesterday', 'bird']
      },
      {
        english: 'My mother cooks delicious rice',
        indoHint: 'Susun dalam Bahasa Inggris: "Ibuku memasak nasi yang lezat"',
        targetWords: ['My', 'mother', 'cooks', 'delicious', 'rice'],
        distractors: ['flying', 'cold']
      },
      {
        english: 'Can you help me please',
        indoHint: 'Susun dalam Bahasa Inggris: "Bisakah kamu menolongku?"',
        targetWords: ['Can', 'you', 'help', 'me', 'please'],
        distractors: ['apple', 'window']
      }
    ],
    4: [
      {
        english: 'My favorite hobby is swimming',
        indoHint: 'Susun dalam Bahasa Inggris: "Hobi favoritku adalah berenang"',
        targetWords: ['My', 'favorite', 'hobby', 'is', 'swimming'],
        distractors: ['because', 'under']
      },
      {
        english: 'The library is next to the classroom',
        indoHint: 'Susun dalam Bahasa Inggris: "Perpustakaan itu berada di sebelah ruang kelas"',
        targetWords: ['The', 'library', 'is', 'next', 'to', 'the', 'classroom'],
        distractors: ['hungry', 'river']
      },
      {
        english: 'What time do you wake up',
        indoHint: 'Susun dalam Bahasa Inggris: "Jam berapa kamu bangun tidur?"',
        targetWords: ['What', 'time', 'do', 'you', 'wake', 'up'],
        distractors: ['pencil', 'clouds']
      }
    ],
    5: [
      {
        english: 'Yesterday we visited the science museum',
        indoHint: 'Susun dalam Bahasa Inggris: "Kemarin kami mengunjungi museum sains"',
        targetWords: ['Yesterday', 'we', 'visited', 'the', 'science', 'museum'],
        distractors: ['tomorrow', 'faster']
      },
      {
        english: 'Plants need sunlight and water to grow',
        indoHint: 'Susun dalam Bahasa Inggris: "Tumbuhan membutuhkan sinar matahari dan air untuk tumbuh"',
        targetWords: ['Plants', 'need', 'sunlight', 'and', 'water', 'to', 'grow'],
        distractors: ['blanket', 'loudly']
      },
      {
        english: 'An elephant is bigger than a rabbit',
        indoHint: 'Susun dalam Bahasa Inggris: "Seekor gajah lebih besar daripada seekor kelinci"',
        targetWords: ['An', 'elephant', 'is', 'bigger', 'than', 'a', 'rabbit'],
        distractors: ['smallest', 'spoon']
      }
    ],
    6: [
      {
        english: 'The Earth revolves around the sun',
        indoHint: 'Susun dalam Bahasa Inggris: "Bumi berevolusi mengelilingi matahari"',
        targetWords: ['The', 'Earth', 'revolves', 'around', 'the', 'sun'],
        distractors: ['between', 'kitchen']
      },
      {
        english: 'I want to become an astronaut in the future',
        indoHint: 'Susun dalam Bahasa Inggris: "Saya ingin menjadi astronot di masa depan"',
        targetWords: ['I', 'want', 'to', 'become', 'an', 'astronaut', 'in', 'the', 'future'],
        distractors: ['yesterday', 'bridge']
      },
      {
        english: 'Excuse me could you show me the way',
        indoHint: 'Susun dalam Bahasa Inggris: "Permisi, bisakah Anda menunjukkan jalannya kepada saya?"',
        targetWords: ['Excuse', 'me', 'could', 'you', 'show', 'me', 'the', 'way'],
        distractors: ['swimming', 'plate']
      }
    ]
  };

  const WORDS_DATA = [
    {
      word: 'BUKU',
      syllables: ['BU', 'KU'],
      emoji: '📚',
      sentence: 'Mari kita eja bersama Kak Diko, B, U, dibaca BU. K, U, dibaca KU. Digabung menjadi BUKU!'
    },
    {
      word: 'SEPATU',
      syllables: ['SE', 'PA', 'TU'],
      emoji: '👟',
      sentence: 'S, E, dibaca SE. P, A, dibaca PA. T, U, dibaca TU. Jadinya SEPATU!'
    },
    {
      word: 'PELANGI',
      syllables: ['PE', 'LA', 'NGI'],
      emoji: '🌈',
      sentence: 'PE, LA, NGI, digabung menjadi PELANGI yang indah setelah hujan!'
    },
    {
      word: 'SAHABAT',
      syllables: ['SA', 'HA', 'BAT'],
      emoji: '🤝',
      sentence: 'SA, HA, BAT, artinya teman baik yang saling menolong di sekolah!'
    }
  ];

  const MATH_ITEMS = [
    { emoji: '🍎', name: 'apel merah' },
    { emoji: '🌟', name: 'bintang kuning' },
    { emoji: '🎈', name: 'balon warna-warni' },
    { emoji: '🐱', name: 'kucing kecil' }
  ];

  const state = {
    activeTab: 'tutor',
    drawerOpen: false,
    onboardingCompleted: true,
    grade: 4,
    characterId: 'dino',
    childName: 'Budi',
    childBio: 'suka dinosaurus, robot, dan sains',
    topic: 'kenalan',
    stars: 14,
    xp: 185,
    friendshipPct: 82,
    friendshipLevel: 3,
    streak: 3,
    hearts: 3,
    isMuted: false,
    speechRate: 0.92,
    isListening: false,
    isThinking: false,
    isSpeaking: false,
    lastEngineMode: 'gemini-3.5-flash-lite',
    parentDirective: '',
    bedtimeStart: '21:00',
    bedtimeEnd: '05:30',
    scheduleNote: '',
    dailyLimitMinutes: 30,
    remoteLocked: false,
    parentCheerMessage: '',
    studySecondsElapsed: 0,
    breakShown: false,
    syncCode: 'DIKO-2026',
    unlockedLevelsByGrade: { 1: 3, 2: 2, 3: 2, 4: 3, 5: 1, 6: 1 },
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
        type: 'start',
        text: 'Memulai sesi petualangan bersama Kak Diko Dino'
      }
    ],
    activeLevelNumber: 2,
    currentWordIdx: 0,
    currentMathProblem: { a: 6, b: 3, answer: 9, item: MATH_ITEMS[0] },
    duoExerciseIdx: 0,
    duoSelectedWords: [],
    duoAvailableBank: [],
    history: []
  };

  function getActiveCharacter() {
    return CHARACTER_CATALOG[state.characterId] || CHARACTER_CATALOG.dino;
  }

  // ==========================================================================
  // 4. PARTIKEL PERAYAAN BINTANG & ANIMASI LOMPAT KARAKTER
  // ==========================================================================
  function triggerCelebrationBurst(customEmojis = ['⭐', '✨', '🎉', '🌟', '🦖']) {
    const layer = document.getElementById('celebrationBurstLayer');
    const stageEl = document.getElementById('interactiveCharacterStage');

    if (stageEl) {
      stageEl.classList.remove('is-celebrating');
      void stageEl.offsetWidth;
      stageEl.classList.add('is-celebrating');
      setTimeout(() => stageEl.classList.remove('is-celebrating'), 700);
    }

    if (!layer) return;
    for (let i = 0; i < 14; i++) {
      const span = document.createElement('span');
      span.className = 'burst-particle';
      span.textContent = customEmojis[i % customEmojis.length];
      span.style.left = `${30 + Math.random() * 40}%`;
      span.style.top = `${35 + Math.random() * 25}%`;
      const tx = `${(Math.random() - 0.5) * 320}px`;
      const ty = `${-80 - Math.random() * 180}px`;
      span.style.setProperty('--tx', tx);
      span.style.setProperty('--ty', ty);
      layer.appendChild(span);
      setTimeout(() => span.remove(), 980);
    }
  }

  function addFriendshipPoints(amount = 10, emoteLabel = '❤️ Sahabat +10!') {
    state.friendshipPct += amount;
    if (state.friendshipPct >= 100) {
      state.friendshipLevel += 1;
      state.friendshipPct = 25;
    }
    const fillEl = document.getElementById('friendshipBarFill');
    const lvlEl = document.getElementById('friendshipLevelNum');
    const emoteEl = document.getElementById('characterFloatingEmote');
    if (fillEl) fillEl.style.width = `${Math.min(100, state.friendshipPct)}%`;
    if (lvlEl) lvlEl.textContent = String(state.friendshipLevel);
    if (emoteEl && emoteLabel) {
      emoteEl.textContent = emoteLabel;
    }
  }

  function unlockBadge(badgeId, logText = '') {
    if (!state.badgesUnlocked.includes(badgeId)) {
      state.badgesUnlocked.push(badgeId);
      const badgeObj = ACHIEVEMENT_BADGES.find((b) => b.id === badgeId);
      if (badgeObj) {
        addActivityLog('badge', logText || `Meraih Badge Baru: "${badgeObj.title}" ${badgeObj.icon}`);
      }
    }
    if ((state.stars >= 10 || state.xp >= 100) && !state.badgesUnlocked.includes('badge_master')) {
      state.badgesUnlocked.push('badge_master');
      addActivityLog('badge', 'Meraih Badge Utama: "Juara Bintang SD" 👑');
    }
  }

  function addActivityLog(type, text) {
    state.activityLog.unshift({
      time: 'Baru saja',
      type,
      text: String(text || '').slice(0, 160)
    });
    if (state.activityLog.length > 14) {
      state.activityLog = state.activityLog.slice(0, 14);
    }
  }

  // ==========================================================================
  // 5. PENYIMPANAN MEMORI LOKAL & SINKRONISASI DUA ARAH DENGAN HP ORANG TUA
  // ==========================================================================
  function getSerializablePayload() {
    const trimmedHistory =
      state.history.length > 16
        ? [...state.history.slice(0, 2), ...state.history.slice(-14)]
        : state.history;

    const recentChats = trimmedHistory.slice(-6).map((item) => ({
      role: item.role,
      text: item?.parts?.[0]?.text || ''
    }));

    return {
      onboardingCompleted: state.onboardingCompleted,
      grade: state.grade,
      characterId: state.characterId,
      childName: state.childName,
      childBio: state.childBio,
      topic: state.topic,
      stars: state.stars,
      xp: state.xp,
      duoStreak: state.streak,
      studySeconds: state.studySecondsElapsed,
      syncCode: state.syncCode,
      unlockedLevels: state.unlockedLevelsByGrade,
      unlockedLevelsByGrade: state.unlockedLevelsByGrade,
      badgesUnlocked: state.badgesUnlocked,
      skillScores: state.skillScores,
      activityLog: state.activityLog,
      recentChats,
      history: trimmedHistory,
      parentControls: {
        parentDirective: state.parentDirective,
        bedtimeStart: state.bedtimeStart,
        bedtimeEnd: state.bedtimeEnd,
        scheduleNote: state.scheduleNote,
        dailyLimitMinutes: state.dailyLimitMinutes,
        remoteLocked: state.remoteLocked,
        parentCheerMessage: state.parentCheerMessage
      }
    };
  }

  function applyLoadedPayload(parsed) {
    if (!parsed || typeof parsed !== 'object') return;
    if (typeof parsed.onboardingCompleted === 'boolean') {
      state.onboardingCompleted = parsed.onboardingCompleted;
    }
    if (parsed.grade && Number(parsed.grade) >= 1 && Number(parsed.grade) <= 6) {
      state.grade = Number(parsed.grade);
    }
    if (typeof parsed.characterId === 'string' && CHARACTER_CATALOG[parsed.characterId]) {
      state.characterId = parsed.characterId;
    }
    if (typeof parsed.childName === 'string' && parsed.childName.trim()) {
      state.childName = parsed.childName.trim();
    }
    if (typeof parsed.childBio === 'string' && parsed.childBio.trim()) {
      state.childBio = parsed.childBio.trim();
    }
    if (typeof parsed.topic === 'string') state.topic = parsed.topic;
    if (typeof parsed.stars === 'number') state.stars = parsed.stars;
    if (typeof parsed.xp === 'number') state.xp = parsed.xp;
    if (typeof parsed.duoStreak === 'number') state.streak = parsed.duoStreak;
    if (typeof parsed.studySeconds === 'number') {
      state.studySecondsElapsed = Math.max(state.studySecondsElapsed, parsed.studySeconds);
    }
    if (typeof parsed.syncCode === 'string' && parsed.syncCode.trim()) {
      state.syncCode = parsed.syncCode.trim();
    }

    const levelsMap = parsed.unlockedLevelsByGrade || parsed.unlockedLevels;
    if (levelsMap && typeof levelsMap === 'object') {
      state.unlockedLevelsByGrade = {
        ...state.unlockedLevelsByGrade,
        ...levelsMap
      };
    }

    if (Array.isArray(parsed.badgesUnlocked)) {
      state.badgesUnlocked = Array.from(new Set([...state.badgesUnlocked, ...parsed.badgesUnlocked]));
    }
    if (parsed.skillScores && typeof parsed.skillScores === 'object') {
      state.skillScores = { ...state.skillScores, ...parsed.skillScores };
    }
    if (Array.isArray(parsed.activityLog) && parsed.activityLog.length > 0) {
      state.activityLog = parsed.activityLog;
    }
    if (Array.isArray(parsed.history)) {
      state.history = parsed.history;
    }

    const pc = parsed.parentControls || {};
    if (typeof pc.parentDirective === 'string') state.parentDirective = pc.parentDirective;
    if (typeof pc.bedtimeStart === 'string') state.bedtimeStart = pc.bedtimeStart;
    if (typeof pc.bedtimeEnd === 'string') state.bedtimeEnd = pc.bedtimeEnd;
    if (typeof pc.scheduleNote === 'string') state.scheduleNote = pc.scheduleNote;
    if (typeof pc.dailyLimitMinutes === 'number') state.dailyLimitMinutes = pc.dailyLimitMinutes;
    if (typeof pc.remoteLocked === 'boolean') state.remoteLocked = pc.remoteLocked;
    if (typeof pc.parentCheerMessage === 'string' && pc.parentCheerMessage.trim()) {
      state.parentCheerMessage = pc.parentCheerMessage.trim();
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        applyLoadedPayload(JSON.parse(raw));
      }
      const sharedFamily = localStorage.getItem('kak_diko_shared_family_v3');
      if (sharedFamily) {
        applyLoadedPayload(JSON.parse(sharedFamily));
      }
    } catch (err) {
      console.warn('[Kak Diko] LocalStorage dilewati:', err);
    }
  }

  function saveState() {
    try {
      const payload = getSerializablePayload();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem('kak_diko_shared_family_v3', JSON.stringify(payload));
    } catch {
      // Abaikan bila kuota storage terbatas
    }
  }

  async function pushProgressToCloud(silent = false) {
    const syncBanner = document.getElementById('syncStatusBanner');
    const codeInput = document.getElementById('syncCodeInput');
    const code = (codeInput?.value || state.syncCode || 'DIKO-2026').trim().toUpperCase();
    state.syncCode = code;
    saveState();

    if (!silent && syncBanner) {
      syncBanner.textContent = '⏳ Menyinkronkan laporan ke Aplikasi HP Orang Tua...';
    }

    try {
      const res = await fetch(API_SYNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode: state.syncCode,
          role: 'child',
          payload: getSerializablePayload()
        })
      });
      const data = await res.json();
      if (res.ok && data?.payload) {
        applyLoadedPayload(data.payload);
        saveState();
        renderParentCheerAndLockState();
        if (!silent && syncBanner) {
          syncBanner.textContent = `✅ Tersinkron dengan Aplikasi HP Orang Tua (Kode: ${state.syncCode}).`;
        }
      }
    } catch {
      if (!silent && syncBanner) {
        syncBanner.textContent = 'ℹ️ Tersimpan di memori lokal perangkat.';
      }
    }
  }

  async function loadFromCloudSync() {
    const syncBanner = document.getElementById('syncStatusBanner');
    const codeInput = document.getElementById('syncCodeInput');
    const code = (codeInput?.value || state.syncCode || 'DIKO-2026').trim().toUpperCase();
    state.syncCode = code;

    try {
      const res = await fetch(`${API_SYNC_URL}?syncCode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (res.ok && data?.payload) {
        applyLoadedPayload(data.payload);
        saveState();
        renderAllViews();
        if (syncBanner) {
          syncBanner.textContent = `✅ Terhubung ke HP Orang Tua! Profil "${state.childName || 'Budi'}" (Kelas ${state.grade} SD) aktif.`;
        }
      }
    } catch {
      if (syncBanner) {
        syncBanner.textContent = '⚠️ Gagal menghubungi server sinkronisasi.';
      }
    }
  }

  function renderParentCheerAndLockState() {
    const cheerBanner = document.getElementById('parentCheerBanner');
    const cheerText = document.getElementById('parentCheerText');
    if (cheerBanner && cheerText) {
      if (state.parentCheerMessage) {
        cheerText.textContent = `Pesan dari HP Orang Tua: "${state.parentCheerMessage}"`;
        cheerBanner.classList.remove('hidden');
      } else {
        cheerBanner.classList.add('hidden');
      }
    }

    if (state.remoteLocked) {
      showBedtimeOrBreakOverlay('remote-lock');
    }
  }

  // ==========================================================================
  // 6. EFEK SUARA SINTETIS WEB AUDIO API (0 FILE AUDIO BERAT)
  // ==========================================================================
  let audioCtx = null;
  function playSoundEffect(type) {
    if (state.isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.11);
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'star') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.09);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch {
      // Abaikan bila autoplay dibatasi
    }
  }

  // ==========================================================================
  // 7. WEB SPEECH API EKSPRESIF + LIP-SYNC KARAKTER AI
  // ==========================================================================
  let idVoice = null;
  let enVoice = null;

  function initVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    idVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('id')) ||
      voices.find((v) => v.name && v.name.toLowerCase().includes('indonesia')) ||
      null;
    enVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) ||
      null;
  }

  if ('speechSynthesis' in window) {
    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;
  }

  function sanitizeForTTS(text) {
    if (!text) return '';
    return String(text)
      .replace(/[*#_~`>|\[\]]/g, '')
      .replace(/\+/g, ' ditambah ')
      .replace(/=/g, ' sama dengan ')
      .replace(/(\d)\s*-\s*(\d)/g, '$1 dikurangi $2')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function speakText(text, langOverride = 'id-ID') {
    const clean = langOverride === 'en-US' ? String(text || '').trim() : sanitizeForTTS(text);
    if (!clean || state.isMuted || !('speechSynthesis' in window)) {
      updateMicVisualState('idle');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = langOverride;
      if (langOverride === 'en-US' && enVoice) {
        utterance.voice = enVoice;
      } else if (idVoice) {
        utterance.voice = idVoice;
      }

      const gradePitchMap = { 1: 1.12, 2: 1.1, 3: 1.06, 4: 1.04, 5: 1.02, 6: 1.0 };
      utterance.pitch = gradePitchMap[state.grade] || 1.06;
      utterance.rate = langOverride === 'en-US' ? 0.86 : state.speechRate;

      utterance.onstart = () => {
        state.isSpeaking = true;
        updateMicVisualState('speaking');
      };
      utterance.onend = () => {
        state.isSpeaking = false;
        updateMicVisualState('idle');
      };
      utterance.onerror = () => {
        state.isSpeaking = false;
        updateMicVisualState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      updateMicVisualState('idle');
    }
  }

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let recognitionMode = 'tutor';

  if (SpeechRecognitionClass) {
    recognition = new SpeechRecognitionClass();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      state.isListening = true;
      if (recognitionMode === 'tutor') {
        updateMicVisualState('listening');
      }
    };

    recognition.onresult = (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || '';
      if (!transcript.trim()) {
        updateMicVisualState('idle');
        return;
      }
      if (recognitionMode === 'duo-english') {
        evaluateDuoSpokenPhrase(transcript.trim());
      } else {
        handleChildMessage(transcript.trim());
      }
    };

    recognition.onerror = () => {
      state.isListening = false;
      updateMicVisualState('idle');
    };

    recognition.onend = () => {
      state.isListening = false;
      if (!state.isThinking && !state.isSpeaking) {
        updateMicVisualState('idle');
      }
    };
  }

  // ==========================================================================
  // 8. EKSTRAKSI NAMA & PENGIRIMAN PESAN KE OTAK AI "KAK DIKO"
  // ==========================================================================
  function extractChildNameFromText(text) {
    if (!text || typeof text !== 'string') return null;
    const cleaned = text.trim();
    if (/\b(siapa|apa|ingat|tahu|lupa)\b.*\b(namaku|nama\s+saya|nama\s+aku)\b/i.test(cleaned)) {
      return null;
    }
    const patterns = [
      /(?:nama\s+aku|namaku|nama\s+saya|panggil\s+aku|aku\s+bernama)\s+([a-zA-Z]{2,15})/i,
      /^(?:halo|hai)?\s*(?:kak\s+(?:diko|bimo))?[,\s]*(?:aku|saya)\s+([a-zA-Z]{2,14})[!.,?]?$/i,
      /^([a-zA-Z]{3,12})[!.]?$/i
    ];
    const stopWords = new Set([
      'halo', 'hai', 'iya', 'tidak', 'mau', 'bisa', 'belajar', 'hitung', 'baca',
      'siapa', 'apa', 'kak', 'diko', 'bimo', 'lima', 'empat', 'tiga', 'dua', 'satu',
      'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'buku', 'bola', 'kucing',
      'kelinci', 'sapi', 'kuda', 'meja', 'apel', 'betul', 'benar',
      'tadi', 'ya', 'dong', 'deh', 'nih', 'sih', 'kan', 'lagi', 'itu', 'ini', 'kelas'
    ]);

    for (let i = 0; i < patterns.length; i++) {
      if (i === 2 && state.childName) continue;
      const match = cleaned.match(patterns[i]);
      if (match && match[1]) {
        const candidate = match[1].toLowerCase();
        if (!stopWords.has(candidate)) {
          state.childName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
          return state.childName;
        }
      }
    }
    return null;
  }

  async function handleChildMessage(userMessage) {
    const cleanInput = String(userMessage || '').trim();
    if (!cleanInput || state.isThinking) return;

    document.getElementById('childTranscriptText').textContent = `"${cleanInput}"`;
    extractChildNameFromText(cleanInput);

    state.isThinking = true;
    updateMicVisualState('thinking');

    let replyText = '';
    let engineLabel = 'gemini-3.5-flash-lite';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

      const response = await fetch(API_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanInput,
          history: state.history,
          topic: state.topic,
          childName: state.childName,
          grade: state.grade,
          characterId: state.characterId,
          childBio: state.childBio,
          parentDirective: state.parentDirective,
          scheduleNote: state.scheduleNote
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.reply === 'string' && data.reply.trim()) {
          replyText = sanitizeForTTS(data.reply);
        }
        if (data && typeof data.childName === 'string' && data.childName.trim()) {
          state.childName = data.childName.trim();
        }
        if (data && data.mode === 'gemini-api') {
          engineLabel = `Gemini (${data.model || 'gemini-3.5-flash-lite'})`;
        } else if (data && data.mode) {
          engineLabel = `Adaptive Tutor (${data.mode})`;
        }
      }
    } catch {
      engineLabel = 'Offline Adaptive Tutor';
    }

    const activeChar = getActiveCharacter();
    if (!replyText) {
      const callName = state.childName || 'teman pintar';
      replyText = `Wah seru sekali ceritamu ${callName}! Sebagai anak Kelas ${state.grade} SD yang hebat, yuk kita coba tantangan berikutnya bersama ${activeChar.name}?`;
    }

    state.isThinking = false;
    state.lastEngineMode = engineLabel;
    state.history.push({ role: 'user', parts: [{ text: cleanInput }] });
    state.history.push({ role: 'model', parts: [{ text: replyText }] });
    state.stars += 1;
    state.xp += 10;
    addFriendshipPoints(12, '🤩 Seru Banget! +10 XP');
    triggerCelebrationBurst(['⭐', '✨', activeChar.emoji]);

    unlockBadge('badge_suara', `Berdialog suara dengan ${activeChar.name}: "${cleanInput}"`);
    if (state.topic === 'berhitung' || /hitung|pecahan|tambah|kali/i.test(cleanInput)) {
      unlockBadge('badge_matematika');
      state.skillScores.berhitung = Math.min(100, (state.skillScores.berhitung || 85) + 2);
    } else if (state.topic === 'alam' || /sains|ipas|robot|energi|planet|dino/i.test(cleanInput)) {
      unlockBadge('badge_sains');
      state.skillScores.sains = Math.min(100, (state.skillScores.sains || 85) + 2);
    } else if (state.topic === 'membaca') {
      unlockBadge('badge_literasi');
      state.skillScores.membaca = Math.min(100, (state.skillScores.membaca || 82) + 2);
    }

    addActivityLog('voice', `Mengobrol dengan ${activeChar.name} (Topik: ${state.topic})`);
    playSoundEffect('star');
    saveState();
    renderAllViews();
    pushProgressToCloud(true);

    document.getElementById('bimoResponseText').textContent = replyText;
    speakText(replyText, 'id-ID');
  }

  // ==========================================================================
  // 9. INTERAKSI LANGSUNG ANAK DENGAN KARAKTER AI (TOS, ENERGI, TEBAK-TEBAKAN)
  // ==========================================================================
  function selectCharacterCompanion(charId, announce = true) {
    if (!CHARACTER_CATALOG[charId]) return;
    state.characterId = charId;
    unlockBadge('badge_kenalan', `Memilih asisten karakter ${CHARACTER_CATALOG[charId].name}`);
    triggerCelebrationBurst([CHARACTER_CATALOG[charId].emoji, '✨', '🌟']);
    saveState();
    renderAllViews();
    pushProgressToCloud(true);

    if (announce) {
      const charObj = CHARACTER_CATALOG[charId];
      playSoundEffect('star');
      document.getElementById('bimoResponseText').textContent = charObj.greeting;
      speakText(charObj.greeting, 'id-ID');
    }
  }

  function handleCharacterHighFive() {
    const charObj = getActiveCharacter();
    state.xp += 5;
    addFriendshipPoints(15, '🖐️ Tos Hebat! +5 XP');
    triggerCelebrationBurst(['🖐️', '⭐', '⚡', charObj.emoji]);
    playSoundEffect('star');
    document.getElementById('bimoResponseText').textContent = charObj.highFiveLine;
    speakText(charObj.highFiveLine, 'id-ID');
    saveState();
    renderAllViews();
  }

  function handleCharacterFeed() {
    const charObj = getActiveCharacter();
    state.xp += 10;
    state.stars += 1;
    addFriendshipPoints(20, `${charObj.snackEmoji} +10 XP!`);
    triggerCelebrationBurst(['🍎', '❤️', '🌟', charObj.emoji]);
    playSoundEffect('star');
    document.getElementById('bimoResponseText').textContent = charObj.feedLine;
    speakText(charObj.feedLine, 'id-ID');
    saveState();
    renderAllViews();
  }

  function handleCharacterRiddle() {
    const charObj = getActiveCharacter();
    const riddle = RIDDLES_BY_GRADE[state.grade] || RIDDLES_BY_GRADE[4];
    const callName = state.childName || 'sahabat pintar';
    const fullLine = `Tebak-tebakan seru dari ${charObj.name} untuk ${callName}! ${riddle}`;
    addFriendshipPoints(10, '🎲 Tebak Yuk!');
    playSoundEffect('pop');
    document.getElementById('bimoResponseText').textContent = fullLine;
    speakText(fullLine, 'id-ID');
  }

  function handleFloatingCoPilotHint() {
    const charObj = getActiveCharacter();
    const tipEl = document.getElementById('copilotTipText');
    let hintMsg = '';

    if (state.activeTab === 'levels') {
      const quests = LEVEL_QUESTS_BY_GRADE[state.grade] || LEVEL_QUESTS_BY_GRADE[1];
      const q = quests.find((item) => item.level === state.activeLevelNumber) || quests[0];
      hintMsg = `💡 Petunjuk ${charObj.name}: Untuk misi "${q.title}", ingat huruf depannya adalah "${q.answer.charAt(0)}"!`;
    } else if (state.activeTab === 'english') {
      const ex = getActiveDuoExercise();
      hintMsg = `💡 Hint English: Kalimatnya dimulai dengan "${ex.targetWords.slice(0, 2).join(' ')}..."`;
    } else if (state.activeTab === 'badges') {
      hintMsg = `🏆 Hebat! Kamu sudah membuka ${state.badgesUnlocked.length} dari 8 Badge Juara!`;
    } else {
      hintMsg = `✨ Ketuk tubuh ${charObj.name} untuk Tos, atau tekan tombol Mikrofon untuk ngobrol!`;
    }

    if (tipEl) tipEl.textContent = hintMsg;
    triggerCelebrationBurst([charObj.emoji, '💡', '✨']);
    playSoundEffect('pop');
    speakText(hintMsg, 'id-ID');
  }

  function renderCharacterVisuals() {
    const charObj = getActiveCharacter();
    document.body.setAttribute('data-scene', charObj.id);

    const headerAvatar = document.getElementById('headerCharacterAvatar');
    if (headerAvatar) {
      headerAvatar.textContent = charObj.emoji;
      headerAvatar.style.borderColor = charObj.borderColor;
      headerAvatar.style.background = charObj.bgGradient;
    }

    const headerSub = document.getElementById('headerCharacterSubtitle');
    if (headerSub) {
      headerSub.textContent = `${charObj.shortLabel} • Sinkron HP Ortu (${state.syncCode})`;
    }

    const mascotTag = document.getElementById('mascotCharacterNameTag');
    if (mascotTag) {
      mascotTag.textContent = `${charObj.emoji} ${charObj.name}`;
      mascotTag.style.borderColor = charObj.borderColor;
    }

    const speakerName = document.getElementById('bubbleSpeakerName');
    if (speakerName) {
      speakerName.textContent = `💬 ${charObj.name} Berkata:`;
    }

    const customSvgBox = document.getElementById('mascotCustomSvgBox');
    if (customSvgBox) {
      customSvgBox.innerHTML = charObj.svgHtml;
    }

    const duoMini = document.getElementById('duoCompanionMiniBox');
    if (duoMini) {
      duoMini.textContent = charObj.emoji;
    }

    const copilotEmoji = document.getElementById('copilotEmojiSpan');
    if (copilotEmoji) {
      copilotEmoji.textContent = charObj.emoji;
    }

    document.querySelectorAll('[data-char-switch]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-char-switch') === state.characterId);
    });

    const inspectorChar = document.getElementById('inspectorCharacterName');
    if (inspectorChar) inspectorChar.textContent = charObj.shortLabel;
  }

  function renderBadgesCollection() {
    const unlockedSet = new Set(state.badgesUnlocked);
    const total = ACHIEVEMENT_BADGES.length;
    const unlockedCount = unlockedSet.size;

    const navCount = document.getElementById('navBadgeCountText');
    if (navCount) navCount.textContent = `${unlockedCount}/${total}`;

    const summaryPill = document.getElementById('badgeSummaryPill');
    if (summaryPill) summaryPill.textContent = `Terbuka: ${unlockedCount} / ${total} Badge`;

    const progressFill = document.getElementById('badgeCollectionProgressFill');
    if (progressFill) {
      progressFill.style.width = `${Math.round((unlockedCount / total) * 100)}%`;
    }

    const grid = document.getElementById('badgesGridContainer');
    if (!grid) return;
    grid.innerHTML = '';

    ACHIEVEMENT_BADGES.forEach((badge) => {
      const isUnlocked = unlockedSet.has(badge.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `badge-collect-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-emblem-circle">${isUnlocked ? badge.icon : '🔒'}</div>
        <span class="badge-category-tag">${badge.category}</span>
        <strong class="badge-card-title">${badge.title}</strong>
        <p class="badge-card-desc">${badge.desc}</p>
        <span class="badge-status-pill ${isUnlocked ? 'earned' : 'pending'}">
          ${isUnlocked ? '✅ Sudah Diraih (Ketuk Suara)' : '🎯 Selesaikan Misi'}
        </span>
      `;

      card.addEventListener('click', () => {
        const callName = state.childName || 'teman pintar';
        if (isUnlocked) {
          triggerCelebrationBurst([badge.icon, '⭐', '🎉']);
          playSoundEffect('star');
          speakText(
            `Selamat ${callName}! Kamu sudah meraih badge ${badge.title} karena berhasil ${badge.desc}`,
            'id-ID'
          );
        } else {
          playSoundEffect('pop');
          speakText(
            `Ayo dapatkan badge ${badge.title} dengan cara ${badge.desc}`,
            'id-ID'
          );
        }
      });

      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // 10. PULAU PETUALANGAN LEVEL & MINI-GAMES (KELAS 1 S/D 6)
  // ==========================================================================
  function renderLevelMap() {
    const quests = LEVEL_QUESTS_BY_GRADE[state.grade] || LEVEL_QUESTS_BY_GRADE[1];
    const unlockedMax = state.unlockedLevelsByGrade[state.grade] || 1;

    document.getElementById('unlockedLevelCountBadge').textContent =
      `Kelas ${state.grade} SD • Pulau Terbuka: ${unlockedMax} / 5`;

    document.querySelectorAll('.grade-pill-btn').forEach((btn) => {
      const g = Number(btn.getAttribute('data-select-grade'));
      btn.classList.toggle('active', g === state.grade);
    });

    const nodesContainer = document.getElementById('levelNodesContainer');
    nodesContainer.innerHTML = '';

    quests.forEach((q) => {
      const isUnlocked = q.level <= unlockedMax;
      const isCompleted = q.level < unlockedMax;
      const isActive = q.level === state.activeLevelNumber;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `level-node-card ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active-level' : ''}`;
      card.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.25rem;">${isUnlocked ? q.icon : '🔒'}</div>
        <div style="font-size: 0.82rem; font-weight: 900; color: #0F172A;">Pulau Level ${q.level}</div>
        <div style="font-size: 0.74rem; font-weight: 700; color: #475569; margin: 0.15rem 0;">${q.title}</div>
        <div style="font-size: 0.74rem; font-weight: 900; color: #B45309;">
          ${isCompleted ? '⭐⭐⭐ Tuntas' : isUnlocked ? '🎯 Mainkan!' : 'Terkunci'}
        </div>
      `;

      card.addEventListener('click', () => {
        if (!isUnlocked) {
          playSoundEffect('pop');
          speakText(`Selesaikan dulu Pulau Level ${unlockedMax} bersama Kak Diko untuk membuka Pulau Level ${q.level} ya!`);
          return;
        }
        state.activeLevelNumber = q.level;
        renderLevelMap();
        renderActiveLevelChallenge();
      });

      nodesContainer.appendChild(card);
    });

    renderActiveLevelChallenge();
  }

  function renderActiveLevelChallenge() {
    const quests = LEVEL_QUESTS_BY_GRADE[state.grade] || LEVEL_QUESTS_BY_GRADE[1];
    const currentQuest =
      quests.find((q) => q.level === state.activeLevelNumber) || quests[0];

    document.getElementById('activeLevelTitleBadge').textContent =
      `${currentQuest.icon} Kelas ${state.grade} • Pulau Level ${currentQuest.level}: ${currentQuest.title} (${currentQuest.subject})`;
    document.getElementById('levelQuestionText').textContent = currentQuest.question;

    const choicesGrid = document.getElementById('levelChoicesGrid');
    choicesGrid.innerHTML = '';

    currentQuest.choices.forEach((choiceText) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'math-choice-btn';
      btn.style.fontSize = '0.98rem';
      btn.textContent = choiceText;

      btn.addEventListener('click', () => {
        const feedbackEl = document.getElementById('levelQuestFeedback');
        const callName = state.childName || 'teman pintar';

        if (choiceText === currentQuest.answer) {
          state.stars += 2;
          state.xp += 25;
          const currentUnlocked = state.unlockedLevelsByGrade[state.grade] || 1;
          if (currentQuest.level >= currentUnlocked && currentUnlocked < 5) {
            state.unlockedLevelsByGrade[state.grade] = currentUnlocked + 1;
            state.activeLevelNumber = currentUnlocked + 1;
          }

          if (state.unlockedLevelsByGrade[state.grade] >= 3) {
            unlockBadge('badge_petualang', `Membuka Pulau Level 3 di Kelas ${state.grade} SD`);
          }
          if (/Matematika/i.test(currentQuest.subject)) unlockBadge('badge_matematika');
          if (/Sains|IPAS/i.test(currentQuest.subject)) unlockBadge('badge_sains');
          if (/Bahasa/i.test(currentQuest.subject)) unlockBadge('badge_literasi');

          addActivityLog(
            'level',
            `Menaklukkan Pulau Kelas ${state.grade} Level ${currentQuest.level}: ${currentQuest.title} (+25 XP)`
          );
          triggerCelebrationBurst(['⭐', '🏝️', '🎉', getActiveCharacter().emoji]);
          playSoundEffect('star');
          saveState();
          renderAllViews();
          pushProgressToCloud(true);

          const congrats = `Hore tepat sekali ${callName}! Jawabanmu ${choiceText} benar. Kak Diko bangga sekali, kamu mendapat 25 XP dan membuka pulau berikutnya!`;
          feedbackEl.style.background = '#D1FAE5';
          feedbackEl.style.color = '#047857';
          feedbackEl.textContent = `🎉 Luar Biasa! +2 Bintang & +25 XP — Pulau berikutnya terbuka!`;
          speakText(congrats, 'id-ID');
        } else {
          playSoundEffect('pop');
          const hint = `Hampir tepat ${callName}! Coba perhatikan soalnya sekali lagi bersama Kak Diko ya.`;
          feedbackEl.style.background = '#FFE4E6';
          feedbackEl.style.color = '#BE123C';
          feedbackEl.textContent = `💡 Belum tepat, ayo coba pilih jawaban lainnya!`;
          speakText(hint, 'id-ID');
        }
      });

      choicesGrid.appendChild(btn);
    });
  }

  // ==========================================================================
  // 11. DUOLINGO-STYLE ENGLISH QUEST (WORD BANK, LISTEN, & SPEAK EN-US)
  // ==========================================================================
  function getActiveDuoExercise() {
    const list = DUO_EXERCISES_BY_GRADE[state.grade] || DUO_EXERCISES_BY_GRADE[1];
    return list[state.duoExerciseIdx % list.length];
  }

  function initDuoExercise() {
    const ex = getActiveDuoExercise();
    state.duoSelectedWords = [];

    const combined = [...ex.targetWords, ...ex.distractors];
    state.duoAvailableBank = combined.map((word, idx) => ({
      id: `tile_${idx}_${word}`,
      word,
      used: false
    }));
    state.duoAvailableBank.sort((a, b) => a.word.localeCompare(b.word));

    renderDuoView();
  }

  function renderDuoView() {
    const list = DUO_EXERCISES_BY_GRADE[state.grade] || DUO_EXERCISES_BY_GRADE[1];
    const ex = getActiveDuoExercise();

    document.getElementById('duoStreakCount').textContent = String(state.streak);
    document.getElementById('duoHeartsDisplay').textContent =
      '❤️'.repeat(Math.max(1, state.hearts));
    document.getElementById('duoGradeTag').textContent = `English • Kelas ${state.grade} SD`;

    const progressPct = Math.min(100, (((state.duoExerciseIdx % list.length) + 1) / list.length) * 100);
    document.getElementById('duoProgressFill').style.width = `${progressPct}%`;

    document.getElementById('duoEnglishPhraseText').textContent = `"${ex.english}"`;
    document.getElementById('duoIndoHintText').textContent = ex.indoHint;

    const slotEl = document.getElementById('duoSelectedWordsSlot');
    slotEl.innerHTML = '';
    if (state.duoSelectedWords.length === 0) {
      slotEl.innerHTML =
        '<span style="font-size: 0.82rem; font-weight: 700; color: #94A3B8;">Ketuk kepingan kata 3D di bawah untuk menyusun kalimat Bahasa Inggris...</span>';
    } else {
      state.duoSelectedWords.forEach((tileObj, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'duo-word-tile selected';
        btn.textContent = tileObj.word;
        btn.addEventListener('click', () => {
          playSoundEffect('pop');
          tileObj.used = false;
          state.duoSelectedWords.splice(idx, 1);
          renderDuoView();
        });
        slotEl.appendChild(btn);
      });
    }

    const bankEl = document.getElementById('duoWordBankContainer');
    bankEl.innerHTML = '';
    state.duoAvailableBank.forEach((tileObj) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'duo-word-tile';
      btn.disabled = tileObj.used;
      btn.style.opacity = tileObj.used ? '0.35' : '1';
      btn.textContent = tileObj.word;
      btn.addEventListener('click', () => {
        if (tileObj.used) return;
        playSoundEffect('pop');
        speakText(tileObj.word, 'en-US');
        tileObj.used = true;
        state.duoSelectedWords.push(tileObj);
        renderDuoView();
      });
      bankEl.appendChild(btn);
    });
  }

  function checkDuoWordBankAnswer() {
    const ex = getActiveDuoExercise();
    const userSentence = state.duoSelectedWords.map((t) => t.word).join(' ');
    const targetSentence = ex.targetWords.join(' ');
    const banner = document.getElementById('duoFeedbackBanner');

    if (userSentence.toLowerCase() === targetSentence.toLowerCase()) {
      state.stars += 2;
      state.xp += 20;
      state.streak += 1;
      state.skillScores.english = Math.min(100, (state.skillScores.english || 80) + 4);
      unlockBadge('badge_english', `Menyusun kalimat English Quest: "${targetSentence}"`);
      addActivityLog('english', `Menyelesaikan English Quest: "${targetSentence}" (+20 XP)`);

      triggerCelebrationBurst(['🇬🇧', '⭐', '🎉', getActiveCharacter().emoji]);
      playSoundEffect('star');
      saveState();
      pushProgressToCloud(true);

      banner.style.background = '#DCFCE7';
      banner.style.color = '#15803D';
      banner.textContent = `🎉 Awesome! "${targetSentence}" — Kamu dapat +20 XP & Badge English Quest!`;
      speakText(`Awesome! ${targetSentence}`, 'en-US');

      setTimeout(() => {
        state.duoExerciseIdx += 1;
        initDuoExercise();
        renderAllViews();
      }, 1400);
    } else {
      state.hearts = Math.max(1, state.hearts - 1);
      playSoundEffect('pop');
      banner.style.background = '#FFE4E6';
      banner.style.color = '#BE123C';
      banner.textContent = `💡 Hampir benar! Susunan yang tepat dimulai dengan kata "${ex.targetWords[0]}". Yuk coba perbaiki!`;
      renderDuoView();
    }
  }

  function evaluateDuoSpokenPhrase(spokenTranscript) {
    const ex = getActiveDuoExercise();
    const banner = document.getElementById('duoFeedbackBanner');
    state.stars += 2;
    state.xp += 20;
    unlockBadge('badge_english', `Latihan Speaking English: "${spokenTranscript}"`);
    addActivityLog('english', `Berlatih Speaking English: "${spokenTranscript}" (+20 XP)`);
    triggerCelebrationBurst(['🎙️', '🇬🇧', '🌟']);
    playSoundEffect('star');
    saveState();
    renderAllViews();
    pushProgressToCloud(true);

    banner.style.background = '#DCFCE7';
    banner.style.color = '#15803D';
    banner.textContent = `🎙️ Great pronunciation! Kamu mengucapkan: "${spokenTranscript}" (+20 XP)`;
    speakText(`Great job speaking English! ${ex.english}`, 'en-US');
  }

  // ==========================================================================
  // 12. MINI-GAMES VISUAL (MENGEJA & BERHITUNG)
  // ==========================================================================
  function renderWordCard() {
    const item = WORDS_DATA[state.currentWordIdx % WORDS_DATA.length];
    document.getElementById('wordEmojiDisplay').textContent = item.emoji;
    const container = document.getElementById('wordSyllablesContainer');
    container.innerHTML = '';

    item.syllables.forEach((syl) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'syllable-btn';
      btn.textContent = syl;
      btn.addEventListener('click', () => {
        unlockBadge('badge_literasi', `Berlatih mengeja kata ${item.word}`);
        playSoundEffect('pop');
        speakText(syl.toLowerCase(), 'id-ID');
        renderBadgesCollection();
      });
      container.appendChild(btn);
    });
  }

  function generateMathCard() {
    const multiplier = state.grade >= 3 ? 3 : 1;
    const a = (Math.floor(Math.random() * 5) + 2) * multiplier;
    const b = (Math.floor(Math.random() * 4) + 1) * multiplier;
    const item = MATH_ITEMS[Math.floor(Math.random() * MATH_ITEMS.length)];
    state.currentMathProblem = { a, b, answer: a + b, item };

    const visualEl = document.getElementById('mathVisualObjects');
    if (a <= 8 && b <= 8) {
      visualEl.innerHTML = `
        <span>${item.emoji.repeat(a)}</span>
        <strong style="font-size: 1rem; color: #047857;">ditambah</strong>
        <span>${item.emoji.repeat(b)}</span>
      `;
    } else {
      visualEl.innerHTML = `
        <span>${item.emoji} <strong>${a}</strong></span>
        <strong style="font-size: 1rem; color: #047857;">ditambah</strong>
        <span>${item.emoji} <strong>${b}</strong></span>
      `;
    }

    document.getElementById('mathQuestionLabel').textContent =
      `Ada ${a} ${item.name} ditambah ${b} ${item.name}. Semuanya jadi berapa?`;

    const choicesSet = new Set([a + b]);
    while (choicesSet.size < 3) {
      const offset = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      choicesSet.add(Math.max(1, a + b + offset));
    }
    const choices = Array.from(choicesSet).sort((x, y) => x - y);

    const grid = document.getElementById('mathChoicesGrid');
    grid.innerHTML = '';
    choices.forEach((num) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'math-choice-btn';
      btn.textContent = String(num);
      btn.addEventListener('click', () => {
        if (num === state.currentMathProblem.answer) {
          state.stars += 1;
          state.xp += 10;
          unlockBadge('badge_matematika', `Menyelesaikan soal berhitung cepat (${a} + ${b} = ${num})`);
          triggerCelebrationBurst(['🔢', '⭐', '🎉']);
          playSoundEffect('star');
          saveState();
          renderAllViews();
          pushProgressToCloud(true);
          document.getElementById('mathFeedbackBanner').textContent =
            '⭐ Hebat! Jawabanmu Benar (+1 Bintang & +10 XP)';
          speakText(
            `Hore tepat sekali! ${a} ${item.name} ditambah ${b} ${item.name} sama dengan ${num}.`,
            'id-ID'
          );
        } else {
          playSoundEffect('pop');
          document.getElementById('mathFeedbackBanner').textContent =
            '💡 Yuk coba hitung sekali lagi!';
        }
      });
      grid.appendChild(btn);
    });
  }

  // ==========================================================================
  // 13. KONTROL JAM TIDUR & REMOTE LOCK DARI APLIKASI HP ORANG TUA
  // ==========================================================================
  function showBedtimeOrBreakOverlay(reason) {
    const overlay = document.getElementById('breakOverlay');
    const titleEl = document.getElementById('breakModalTitle');
    const msgEl = document.getElementById('breakModalMessage');
    const callName = state.childName || 'teman pintar';

    if (reason === 'remote-lock') {
      titleEl.textContent = `🔒 Layar Istirahat Diaktifkan dari HP Orang Tua`;
      msgEl.textContent = `Halo ${callName}, Ayah & Ibu mengaktifkan waktu istirahat dari HP. Yuk istirahat dulu bersama Kak Diko ya!`;
    } else if (reason === 'bedtime') {
      titleEl.textContent = `🌙 Waktunya Tidur Malam, ${callName}!`;
      msgEl.textContent = `Sekarang sudah masuk jam istirahat malam (${state.bedtimeStart} – ${state.bedtimeEnd}). Kak Diko juga mau istirahat supaya besok pagi kita bisa belajar dengan segar lagi!`;
    } else {
      titleEl.textContent = `⏱️ Waktunya Istirahat Mata & Minum Air Putih!`;
      msgEl.textContent = `Kamu sudah belajar dengan sangat hebat hari ini. Yuk istirahatkan matamu sebentar sesuai aturan Ayah & Ibu ya!`;
    }

    overlay.classList.remove('hidden');
  }

  function startStudyAndBedtimeTimer() {
    setInterval(() => {
      state.studySecondsElapsed += 1;
      const mins = Math.floor(state.studySecondsElapsed / 60);
      const secs = state.studySecondsElapsed % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      const timerEl = document.getElementById('studyTimerText');
      if (timerEl) timerEl.textContent = formatted;

      if (
        state.dailyLimitMinutes > 0 &&
        !state.breakShown &&
        state.studySecondsElapsed >= state.dailyLimitMinutes * 60
      ) {
        state.breakShown = true;
        showBedtimeOrBreakOverlay('duration');
      }
    }, 1000);
  }

  // ==========================================================================
  // 14. RENDERING UI UTAMA, STATE PANGGUNG KARAKTER, & MIKROFON
  // ==========================================================================
  function updateMicVisualState(mode) {
    const btn = document.getElementById('mainMicBtn');
    const label = document.getElementById('micStatusLabel');
    const badge = document.getElementById('statusBadge');
    const wave = document.getElementById('speakingWaveBadge');
    const icon = document.getElementById('micIconSpan');
    const stageEl = document.getElementById('interactiveCharacterStage');
    const moodBadge = document.getElementById('characterMoodBadge');
    const emoteEl = document.getElementById('characterFloatingEmote');
    const charName = getActiveCharacter().name;

    btn.classList.remove('mic-listening', 'mic-thinking', 'mic-speaking');
    stageEl?.classList.remove('is-listening', 'is-thinking', 'is-speaking');
    wave.classList.add('hidden');

    if (mode === 'listening') {
      btn.classList.add('mic-listening');
      stageEl?.classList.add('is-listening');
      icon.textContent = '🛑';
      label.textContent = 'Mendengarkan... Ayo Bicara Sekarang!';
      badge.textContent = '🎙️ Sedang Mendengarkan';
      if (moodBadge) moodBadge.textContent = '👂 Mood: Fokus Mendengar';
      if (emoteEl) emoteEl.textContent = '👂 Aku Mendengarkanmu!';
    } else if (mode === 'thinking') {
      btn.classList.add('mic-thinking');
      stageEl?.classList.add('is-thinking');
      icon.textContent = '💭';
      label.textContent = `${charName} Sedang Berpikir...`;
      badge.textContent = '💭 Memikirkan Jawaban';
      if (moodBadge) moodBadge.textContent = '🤔 Mood: Berpikir Cerdas';
      if (emoteEl) emoteEl.textContent = '💡 Tunggu Sebentar Ya...';
    } else if (mode === 'speaking') {
      btn.classList.add('mic-speaking');
      stageEl?.classList.add('is-speaking');
      icon.textContent = '🔊';
      wave.classList.remove('hidden');
      label.textContent = `${charName} Sedang Bicara (Ketuk untuk Berhenti)`;
      badge.textContent = `🔊 ${charName} Berbicara`;
      if (moodBadge) moodBadge.textContent = '🗣️ Mood: Bercerita Ceria!';
      if (emoteEl) emoteEl.textContent = '🎵 Dengarkan Yuk!';
    } else {
      icon.textContent = '🎙️';
      label.textContent = `Ketuk Tombol Mikrofon untuk Bicara dengan ${charName}!`;
      badge.textContent = 'Siap Mendengarkan';
      if (moodBadge) moodBadge.textContent = '🤩 Mood: Siap Bermain!';
    }
  }

  function renderAllViews() {
    const phaseLabel = state.grade <= 2 ? 'Fase A' : state.grade <= 4 ? 'Fase B' : 'Fase C';
    document.getElementById('headerGradeBadge').textContent = `Kelas ${state.grade} SD • ${phaseLabel}`;
    document.getElementById('starCountText').textContent = String(state.stars);
    document.getElementById('xpCountText').textContent = String(state.xp);

    const displayName = state.childName || 'Budi';
    document.getElementById('childNameDisplay').textContent = `${displayName} (Kelas ${state.grade} SD)`;
    document.getElementById('childBioBadge').textContent = `✨ Hobi: ${state.childBio || 'Sains & Cerita'}`;

    const inspName = document.getElementById('inspectorChildName');
    if (inspName) inspName.textContent = state.childName || 'Budi';
    const inspGrade = document.getElementById('inspectorGradeText');
    if (inspGrade) inspGrade.textContent = `Kelas ${state.grade} SD (${phaseLabel})`;

    document.querySelectorAll('.topic-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-topic') === state.topic);
    });

    renderCharacterVisuals();
    renderParentCheerAndLockState();
    renderLevelMap();
    renderDuoView();
    renderBadgesCollection();
  }

  // ==========================================================================
  // 15. EVENT LISTENERS & NAVIGASI
  // ==========================================================================
  function switchTab(tabName) {
    state.activeTab = tabName;
    document.getElementById('viewTutor').classList.toggle('hidden', tabName !== 'tutor');
    document.getElementById('viewLevels').classList.toggle('hidden', tabName !== 'levels');
    document.getElementById('viewEnglish').classList.toggle('hidden', tabName !== 'english');
    document.getElementById('viewBadges').classList.toggle('hidden', tabName !== 'badges');

    document.getElementById('tabTutorBtn').classList.toggle('active', tabName === 'tutor');
    document.getElementById('tabLevelsBtn').classList.toggle('active', tabName === 'levels');
    document.getElementById('tabEnglishBtn').classList.toggle('active', tabName === 'english');
    document.getElementById('tabBadgesBtn').classList.toggle('active', tabName === 'badges');

    const coPilotBubble = document.getElementById('copilotBubble');
    if (coPilotBubble) {
      coPilotBubble.classList.toggle('hidden', tabName === 'tutor');
    }
  }

  function openProfileModal() {
    document.getElementById('profileNameInput').value = state.childName;
    document.getElementById('profileBioInput').value = state.childBio;
    document.querySelectorAll('#modalGradeGrid .grade-option-card').forEach((card) => {
      card.classList.toggle('selected', Number(card.getAttribute('data-modal-grade')) === state.grade);
    });
    document.querySelectorAll('#modalCharacterGrid .character-option-card').forEach((card) => {
      card.classList.toggle('selected', card.getAttribute('data-modal-char') === state.characterId);
    });
    const previewAv = document.getElementById('modalPreviewAvatar');
    if (previewAv) previewAv.textContent = getActiveCharacter().emoji;
    document.getElementById('profileOnboardingModal').classList.remove('hidden');
  }

  function bindEvents() {
    document.getElementById('tabTutorBtn').addEventListener('click', () => switchTab('tutor'));
    document.getElementById('tabLevelsBtn').addEventListener('click', () => switchTab('levels'));
    document.getElementById('tabEnglishBtn').addEventListener('click', () => switchTab('english'));
    document.getElementById('tabBadgesBtn').addEventListener('click', () => switchTab('badges'));

    // Interaksi Langsung di Panggung Karakter AI
    document.getElementById('mascotInteractiveHitbox')?.addEventListener('click', handleCharacterHighFive);
    document.getElementById('interactHighFiveBtn')?.addEventListener('click', handleCharacterHighFive);
    document.getElementById('interactFeedBtn')?.addEventListener('click', handleCharacterFeed);
    document.getElementById('interactRiddleBtn')?.addEventListener('click', handleCharacterRiddle);

    // Floating AI Co-Pilot Hint
    document.getElementById('copilotTriggerBtn')?.addEventListener('click', handleFloatingCoPilotHint);
    document.getElementById('duoCompanionMiniBox')?.addEventListener('click', () => {
      const ex = getActiveDuoExercise();
      speakText(ex.english, 'en-US');
    });

    // Bar Cepat Ganti Karakter di Panggung Tutor
    document.querySelectorAll('[data-char-switch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const charId = btn.getAttribute('data-char-switch') || 'dino';
        selectCharacterCompanion(charId, true);
      });
    });

    document.getElementById('dismissCheerBtn')?.addEventListener('click', () => {
      state.parentCheerMessage = '';
      document.getElementById('parentCheerBanner')?.classList.add('hidden');
      saveState();
    });

    // Modal Onboarding: Karakter, Kelas 1-6, & Bio Anak
    document.getElementById('openProfileModalBtn').addEventListener('click', openProfileModal);
    document.getElementById('brandCharacterTrigger')?.addEventListener('click', openProfileModal);
    document.getElementById('basicChangeCharBtn')?.addEventListener('click', openProfileModal);
    document.getElementById('closeProfileModalBtn').addEventListener('click', () => {
      document.getElementById('profileOnboardingModal').classList.add('hidden');
    });

    let selectedModalGrade = state.grade;
    let selectedModalChar = state.characterId;

    document.querySelectorAll('#modalCharacterGrid .character-option-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedModalChar = card.getAttribute('data-modal-char') || 'dino';
        document.querySelectorAll('#modalCharacterGrid .character-option-card').forEach((c) => {
          c.classList.toggle('selected', c.getAttribute('data-modal-char') === selectedModalChar);
        });
        const previewAv = document.getElementById('modalPreviewAvatar');
        if (previewAv && CHARACTER_CATALOG[selectedModalChar]) {
          previewAv.textContent = CHARACTER_CATALOG[selectedModalChar].emoji;
        }
      });
    });

    document.querySelectorAll('#modalGradeGrid .grade-option-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedModalGrade = Number(card.getAttribute('data-modal-grade')) || 4;
        document.querySelectorAll('#modalGradeGrid .grade-option-card').forEach((c) => {
          c.classList.toggle('selected', Number(c.getAttribute('data-modal-grade')) === selectedModalGrade);
        });
      });
    });

    document.querySelectorAll('.bio-preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.getElementById('profileBioInput').value = chip.getAttribute('data-bio-chip') || '';
      });
    });

    document.getElementById('saveProfileOnboardingBtn').addEventListener('click', () => {
      const newName = document.getElementById('profileNameInput').value.trim();
      const newBio = document.getElementById('profileBioInput').value.trim();
      if (newName) state.childName = newName;
      if (newBio) state.childBio = newBio;
      state.grade = selectedModalGrade;
      state.characterId = selectedModalChar;
      state.onboardingCompleted = true;
      state.activeLevelNumber = state.unlockedLevelsByGrade[state.grade] || 1;

      unlockBadge('badge_kenalan', `Memilih asisten ${getActiveCharacter().name} & Kelas ${state.grade} SD`);
      triggerCelebrationBurst([getActiveCharacter().emoji, '🎉', '⭐']);
      saveState();
      initDuoExercise();
      generateMathCard();
      renderAllViews();
      pushProgressToCloud(true);
      document.getElementById('profileOnboardingModal').classList.add('hidden');

      const callName = state.childName || 'teman pintar';
      const charObj = getActiveCharacter();
      const welcome = `Halo ${callName} dari Kelas ${state.grade} SD! Aku ${charObj.name}, senang sekali tahu kamu ${state.childBio}. Yuk kita mulai petualangan belajarnya, kamu siap?`;
      document.getElementById('bimoResponseText').textContent = welcome;
      speakText(welcome, 'id-ID');
    });

    // Pilihan Cepat Kelas di Pulau Level
    document.querySelectorAll('.grade-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.grade = Number(btn.getAttribute('data-select-grade')) || 4;
        state.activeLevelNumber = state.unlockedLevelsByGrade[state.grade] || 1;
        saveState();
        initDuoExercise();
        generateMathCard();
        renderAllViews();
        pushProgressToCloud(true);
      });
    });

    document.getElementById('speakLevelQuestionBtn').addEventListener('click', () => {
      speakText(document.getElementById('levelQuestionText').textContent, 'id-ID');
    });

    // Duolingo English Quest Controls
    document.getElementById('duoSpeakPhraseBtn').addEventListener('click', () => {
      const ex = getActiveDuoExercise();
      speakText(ex.english, 'en-US');
    });

    document.getElementById('duoCheckAnswerBtn').addEventListener('click', checkDuoWordBankAnswer);

    document.getElementById('duoNextExerciseBtn').addEventListener('click', () => {
      state.duoExerciseIdx += 1;
      initDuoExercise();
    });

    document.getElementById('duoVoicePracticeBtn').addEventListener('click', () => {
      const ex = getActiveDuoExercise();
      if (!recognition) {
        evaluateDuoSpokenPhrase(ex.english);
        return;
      }
      try {
        recognitionMode = 'duo-english';
        recognition.lang = 'en-US';
        recognition.start();
      } catch {
        evaluateDuoSpokenPhrase(ex.english);
      }
    });

    // Panel Pengaturan Simpel Anak (`#basicSettingsToggleBtn`)
    document.getElementById('basicSettingsToggleBtn')?.addEventListener('click', () => {
      state.drawerOpen = !state.drawerOpen;
      document.getElementById('parentDrawer').classList.toggle('hidden', !state.drawerOpen);
      document.getElementById('viewTutor').classList.toggle('with-drawer', state.drawerOpen);
    });

    document.getElementById('childThemeSelect')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'mint') {
        document.body.style.background = 'linear-gradient(180deg, #D1FAE5 0%, #ECFDF5 100%)';
      } else if (val === 'sky') {
        document.body.style.background = 'linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%)';
      } else {
        document.body.style.background = 'linear-gradient(180deg, #E0F2FE 0%, #FEF9C3 55%, #DCFCE7 100%)';
      }
    });

    document.getElementById('cloudSaveBtn').addEventListener('click', () => pushProgressToCloud(false));
    document.getElementById('cloudLoadBtn').addEventListener('click', loadFromCloudSync);

    // Mute & Mikrofon Utama
    document.getElementById('muteToggleBtn').addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      if (state.isMuted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      document.getElementById('muteToggleBtn').textContent = state.isMuted
        ? '🔇 Suara Bisu'
        : '🔊 Suara Aktif';
    });

    document.getElementById('mainMicBtn').addEventListener('click', () => {
      playSoundEffect('pop');
      if (state.isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        state.isSpeaking = false;
        updateMicVisualState('idle');
        return;
      }

      if (!recognition) {
        const msg =
          'Sensor mikrofon langsung sedang tidak aktif di pratinjau ini. Yuk klik tombol kalimat contoh di bawah atau ketik pesanmu untuk Kak Diko ya!';
        document.getElementById('bimoResponseText').textContent = msg;
        speakText(msg, 'id-ID');
        return;
      }

      if (state.isListening) {
        recognition.stop();
      } else {
        try {
          recognitionMode = 'tutor';
          recognition.lang = state.topic === 'english' ? 'en-US' : 'id-ID';
          recognition.start();
        } catch {
          updateMicVisualState('idle');
        }
      }
    });

    document.getElementById('replayVoiceBtn').addEventListener('click', () => {
      speakText(document.getElementById('bimoResponseText').textContent, 'id-ID');
    });

    document.getElementById('slowerVoiceBtn').addEventListener('click', () => {
      state.speechRate = state.speechRate === 0.92 ? 0.78 : 0.92;
      document.getElementById('speechRateLabel').textContent =
        state.speechRate === 0.92 ? 'Normal' : 'Pelan (0.78x)';
      speakText(document.getElementById('bimoResponseText').textContent, 'id-ID');
    });

    document.getElementById('resetSessionBtn').addEventListener('click', () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      state.history = [];
      saveState();
      renderAllViews();
      document.getElementById('childTranscriptText').textContent = '"Belum ada suara yang direkam"';
      const welcome = `Halo ${state.childName || 'teman pintar'}! Siap memulai petualangan baru untuk Kelas ${state.grade} SD bersama ${getActiveCharacter().name}?`;
      document.getElementById('bimoResponseText').textContent = welcome;
      speakText(welcome, 'id-ID');
    });

    document.querySelectorAll('.topic-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.topic = btn.getAttribute('data-topic') || 'kenalan';
        saveState();
        renderAllViews();
        const callName = state.childName || 'teman pintar';
        const charName = getActiveCharacter().name;
        const topicPrompts = {
          kenalan: `Halo ${callName} dari Kelas ${state.grade} SD! Ceritakan ke ${charName}, kegiatan seru apa yang paling kamu sukai hari ini?`,
          membaca: `Ayo kita asah cerita dan kosakata Bahasa Indonesia Kelas ${state.grade} SD bersama ${charName}! Kamu siap?`,
          berhitung: `Yuk kita pecahkan teka-teki Misi Angka Kelas ${state.grade} SD bersama ${charName}! Siap berhitung?`,
          alam: `Seru sekali belajar Sains Ajaib Kelas ${state.grade} SD bersama ${charName}! Mau tahu rahasia alam hari ini?`,
          budipekerti: `Anak hebat Kelas ${state.grade} SD seperti ${callName} pasti punya sikap terpuji! Yuk berdiskusi bersama ${charName}?`,
          english: `Let's practice English together ${callName}! Can you tell Kak Diko what your favorite animal or hobby is in English?`
        };
        const msg = topicPrompts[state.topic] || topicPrompts.kenalan;
        document.getElementById('bimoResponseText').textContent = msg;
        speakText(msg, state.topic === 'english' ? 'en-US' : 'id-ID');
      });
    });

    document.querySelectorAll('.sim-chip[data-sim]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-sim');
        if (text) handleChildMessage(text);
      });
    });

    document.getElementById('fallbackChatForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('fallbackChatInput');
      const val = input.value.trim();
      if (!val || state.isThinking) return;
      input.value = '';
      handleChildMessage(val);
    });

    document.getElementById('extendStudyTimeBtn').addEventListener('click', () => {
      if (state.dailyLimitMinutes > 0) {
        state.dailyLimitMinutes += 15;
      }
      state.remoteLocked = false;
      state.breakShown = false;
      document.getElementById('breakOverlay').classList.add('hidden');
      renderAllViews();
    });

    document.getElementById('nextWordBtn').addEventListener('click', () => {
      state.currentWordIdx = (state.currentWordIdx + 1) % WORDS_DATA.length;
      renderWordCard();
    });

    document.getElementById('speakFullWordBtn').addEventListener('click', () => {
      unlockBadge('badge_literasi', 'Menyelesaikan latihan membaca suku kata');
      renderBadgesCollection();
      speakText(WORDS_DATA[state.currentWordIdx].sentence, 'id-ID');
    });

    document.getElementById('newMathProblemBtn').addEventListener('click', () => {
      generateMathCard();
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initDuoExercise();
    renderWordCard();
    generateMathCard();
    renderAllViews();
    bindEvents();
    startStudyAndBedtimeTimer();
    loadFromCloudSync();
    registerServiceWorker();
  });
})();
