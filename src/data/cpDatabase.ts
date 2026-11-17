import { AssessmentType, CPItem, ElemenName, Fase, SchoolIdentity, TPItem } from '../types/curriculum';

export const DASAR_HUKUM_TEXT =
  'Kepka BKPDM No. 020 Tahun 2026 tentang Perubahan atas Kepka BSKAP No. 046/H/KR/2025, Lampiran I, Capaian Pembelajaran PAI dan Budi Pekerti.';

export const FASE_OPTIONS: { value: Fase; label: string; kelasList: string[]; semesters: string[] }[] = [
  {
    value: 'A',
    label: 'Fase A (Kelas 1 & 2 SD/MI)',
    kelasList: ['Kelas 1', 'Kelas 2', 'Kelas 1 & 2'],
    semesters: ['Kelas 1 Ganjil', 'Kelas 1 Genap', 'Kelas 2 Ganjil', 'Kelas 2 Genap'],
  },
  {
    value: 'B',
    label: 'Fase B (Kelas 3 & 4 SD/MI)',
    kelasList: ['Kelas 3', 'Kelas 4', 'Kelas 3 & 4'],
    semesters: ['Kelas 3 Ganjil', 'Kelas 3 Genap', 'Kelas 4 Ganjil', 'Kelas 4 Genap'],
  },
  {
    value: 'C',
    label: 'Fase C (Kelas 5 & 6 SD/MI)',
    kelasList: ['Kelas 5', 'Kelas 6', 'Kelas 5 & 6'],
    semesters: ['Kelas 5 Ganjil', 'Kelas 5 Genap', 'Kelas 6 Ganjil', 'Kelas 6 Genap'],
  },
];

export const ELEMEN_LIST: ElemenName[] = [
  "Al-Qur'an Hadis",
  'Aqidah',
  'Akhlak',
  'Fiqih',
  'Sejarah Peradaban Islam',
];

export const P5_DIMENSIONS: string[] = [
  'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
  'Bernalar Kritis',
  'Mandiri',
  'Gotong Royong',
  'Kreatif',
  'Berkebinekaan Global',
];

/**
 * DATABASE CP RESMI - KEPKA BKPDM NO. 020 TAHUN 2026
 * Redaksi verbatim persis seperti dokumen, TIDAK BOLEH DIUBAH.
 */
export const CP_DATABASE: CPItem[] = [
  // FASE A - KELAS 1 & 2 SD/MI
  {
    code: '1.1',
    fase: 'A',
    elemen: "Al-Qur'an Hadis",
    redaksi:
      "Membaca dan membedakan huruf hijaiyah berharakat, huruf hijaiyah bersambung; menghafal Surah Al-Fatihah, beberapa surah pendek Al-Qur'an, dan hadis tentang kebersihan.",
    allowedKeywords: [
      'hijaiyah', 'hijaiah', 'harakat', 'fathah', 'kasrah', 'dammah', 'bersambung',
      'al-fatihah', 'fatihah', 'surah pendek', 'an-nas', 'al-ikhlas', 'al-falaq',
      'al-kautsar', 'kebersihan', 'hadis', 'thaharah', 'al-qur\'an', 'alquran',
    ],
  },
  {
    code: '1.2',
    fase: 'A',
    elemen: 'Aqidah',
    redaksi:
      'Menjelaskan dan meyakini rukun iman, iman kepada Allah Swt., beberapa asmaulhusna, dan iman kepada malaikat.',
    allowedKeywords: [
      'rukun iman', 'iman', 'allah', 'asmaulhusna', 'asmaul husna', 'ar-rahman',
      'ar-rahim', 'al-malik', 'al-quddus', 'malaikat', 'jibril', 'mikail',
    ],
  },
  {
    code: '1.3',
    fase: 'A',
    elemen: 'Akhlak',
    redaksi:
      'Menerapkan akhlak terhadap Allah Swt. dengan menyucikan dan memuji-Nya, dan akhlak terhadap diri sendiri.',
    allowedKeywords: [
      'akhlak', 'menyucikan', 'memuji', 'tasbih', 'tahmid', 'takbir', 'basmalah',
      'hamdalah', 'diri sendiri', 'jujur', 'disiplin', 'bersih', 'santun', 'kasih sayang',
    ],
  },
  {
    code: '1.4',
    fase: 'A',
    elemen: 'Fiqih',
    redaksi:
      'Menerapkan rukun Islam, syahadatain, tata cara bersuci, salat fardu, zikir dan berdoa setelah salat.',
    allowedKeywords: [
      'rukun islam', 'syahadat', 'syahadatain', 'bersuci', 'wudhu', 'wudu', 'tayamum',
      'istinja', 'salat', 'shalat', 'fardu', 'subuh', 'zuhur', 'asar', 'magrib', 'isya',
      'zikir', 'doa', 'berdoa',
    ],
  },
  {
    code: '1.5',
    fase: 'A',
    elemen: 'Sejarah Peradaban Islam',
    redaksi: 'Menceritakan kisah keteladanan beberapa nabi dan rasul.',
    allowedKeywords: [
      'kisah', 'keteladanan', 'nabi', 'rasul', 'adam', 'nuh', 'ibrahim', 'ismail',
      'musa', 'muhammad', 'teladan', 'sejarah',
    ],
  },

  // FASE B - KELAS 3 & 4 SD/MI
  {
    code: '2.1',
    fase: 'B',
    elemen: "Al-Qur'an Hadis",
    redaksi:
      "Membaca dan membedakan huruf hijaiyah yang berharakat sukun dan bertasydid, kalimat dalam Al-Qur'an, hadis tentang keutamaan membaca Al-Qur'an, dan hadis tentang salat fardu.",
    allowedKeywords: [
      'hijaiyah', 'hijaiah', 'sukun', 'tasydid', 'bertasydid', 'kalimat', 'ayat',
      "al-qur'an", 'alquran', 'keutamaan membaca', 'hadis', 'salat fardu', 'shalat fardu',
    ],
  },
  {
    code: '2.2',
    fase: 'B',
    elemen: 'Aqidah',
    redaksi:
      'Memahami dan meyakini sifat wajib Allah Swt. dan rasul-rasul-Nya, nama-nama kitab Allah Swt., dan para rasul-Nya.',
    allowedKeywords: [
      'sifat wajib', 'allah', 'rasul', 'siddiq', 'amanah', 'tabligh', 'fathanah',
      'wujud', 'qidam', 'baqa', 'kitab', 'taurat', 'zabur', 'injil', "al-qur'an",
      'ulul azmi', 'para rasul',
    ],
  },
  {
    code: '2.3',
    fase: 'B',
    elemen: 'Akhlak',
    redaksi: 'Menerapkan akhlak terhadap Allah Swt. dan akhlak terhadap Rasulullah Saw.',
    allowedKeywords: [
      'akhlak', 'allah', 'rasulullah', 'nabi muhammad', 'selawat', 'shalawat',
      'taat', 'syukur', 'ikhlas', 'tawakal', 'cinta rasul', 'meneladani',
    ],
  },
  {
    code: '2.4',
    fase: 'B',
    elemen: 'Fiqih',
    redaksi:
      'Menerapkan rukun iman, rukun Islam, tata cara bersuci, adzan, iqamah, salat fardu berjamaah, salat sunnah, zikir dan berdoa setelah salat.',
    allowedKeywords: [
      'rukun iman', 'rukun islam', 'bersuci', 'wudhu', 'wudu', 'tayamum', 'hadas',
      'adzan', 'azan', 'iqamah', 'salat', 'shalat', 'fardu', 'berjamaah', 'sunnah',
      'dhuha', 'rawatib', 'zikir', 'doa', 'berdoa',
    ],
  },
  {
    code: '2.5',
    fase: 'B',
    elemen: 'Sejarah Peradaban Islam',
    redaksi: 'Mengidentifikasi sejarah perjuangan Rasulullah Saw. dan para sahabatnya.',
    allowedKeywords: [
      'sejarah', 'perjuangan', 'rasulullah', 'muhammad', 'sahabat', 'abu bakar',
      'umar', 'utsman', 'ali', 'makkah', 'madinah', 'hijrah', 'dakwah',
    ],
  },

  // FASE C - KELAS 5 & 6 SD/MI
  {
    code: '3.1',
    fase: 'C',
    elemen: "Al-Qur'an Hadis",
    redaksi:
      "Membaca dan membedakan kalimat dalam Al-Qur'an yang berharakat sukun, bertasydid, mad thabi'i, dan surah-surah pendek dalam Al-Qur'an, hadis tentang amal saleh, dan hadis tentang ilmu.",
    allowedKeywords: [
      'kalimat', "al-qur'an", 'alquran', 'sukun', 'tasydid', 'bertasydid',
      "mad thabi'i", 'mad thabii', 'mad asli', 'surah pendek', 'ad-duha', 'al-maun',
      'at-tin', 'hadis', 'amal saleh', 'ilmu', 'menuntut ilmu',
    ],
  },
  {
    code: '3.2',
    fase: 'C',
    elemen: 'Aqidah',
    redaksi:
      'Memahami dan meyakini hari akhir, tanda-tandanya, dan berbagai ciptaan Allah Swt.',
    allowedKeywords: [
      'hari akhir', 'kiamat', 'tanda-tanda', 'kiamat sugra', 'kiamat kubra',
      'yaumul baats', 'yaumul hisab', 'ciptaan allah', 'alam semesta', 'makhluk',
    ],
  },
  {
    code: '3.3',
    fase: 'C',
    elemen: 'Akhlak',
    redaksi:
      'Menerapkan akhlak terhadap Allah Swt., akhlak terhadap Rasulullah Saw., dan akhlak terhadap sesama manusia.',
    allowedKeywords: [
      'akhlak', 'allah', 'rasulullah', 'sesama manusia', 'toleransi', 'tolong menolong',
      'peduli', 'silaturahmi', 'hormat', 'orang tua', 'guru', 'teman', 'empati',
    ],
  },
  {
    code: '3.4',
    fase: 'C',
    elemen: 'Fiqih',
    redaksi:
      'Menerapkan rukun iman, rukun Islam, tata cara bersuci, azan, iqamah, salat fardu berjamaah, salat sunnah, salat Jumat, puasa Ramadan, zakat fitrah, haji, zikir dan berdoa setelah salat.',
    allowedKeywords: [
      'rukun iman', 'rukun islam', 'bersuci', 'wudhu', 'tayamum', 'mandi wajib',
      'azan', 'adzan', 'iqamah', 'salat', 'shalat', 'berjamaah', 'sunnah', 'jumat',
      'puasa', 'ramadan', 'ramadhan', 'zakat fitrah', 'zakat', 'haji', 'umrah',
      'zikir', 'doa', 'berdoa',
    ],
  },
  {
    code: '3.5',
    fase: 'C',
    elemen: 'Sejarah Peradaban Islam',
    redaksi:
      'Menceritakan perjuangan Rasulullah Saw. dan para sahabatnya serta mengambil keteladanannya.',
    allowedKeywords: [
      'perjuangan', 'rasulullah', 'sahabat', 'khulafaur rasyidin', 'keteladanan',
      'teladan', 'fathu makkah', 'hijrah', 'piagam madinah', 'abu bakar', 'umar',
      'utsman', 'ali', 'sejarah',
    ],
  },
];

// Kata kunci topik di luar CP PAI SD Kepka BKPDM 020/2026
const OUT_OF_SCOPE_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b(mawaris|warisan|faraid|harta waris)\b/i, reason: 'Materi Mawaris/Warisan merupakan materi jenjang SMA/MA' },
  { pattern: /\b(munakahat|pernikahan|talak|rujuk|nikah)\b/i, reason: 'Materi Munakahat/Pernikahan merupakan materi jenjang SMA/SMK' },
  { pattern: /\b(jinayat|qishash|hudud|diyat)\b/i, reason: 'Materi Jinayat merupakan materi jenjang Madrasah Aliyah/SMA' },
  { pattern: /\b(jual beli|riba|mudharabah|musyarakah|perbankan syariah|muamalah)\b/i, reason: 'Materi Fikih Muamalah/Ekonomi Syariah tidak tercantum di CP PAI SD Kepka 020/2026' },
  { pattern: /\b(abbasiyah|umayyah|turki utsmani|andalusia|walisongo|penyebaran islam di indonesia)\b/i, reason: 'Materi Dinasti/Sejarah Islam Lanjutan bukan bagian CP SD Kepka 020/2026' },
  { pattern: /\b(qurban|akikah|aqiqah|pengurusan jenazah|memandikan jenazah)\b/i, reason: 'Materi Jenazah/Qurban tidak tercantum secara eksplisit di CP SD Kepka 020/2026' },
  { pattern: /\b(qada dan qadar|qadha dan qadar|takdir)\b/i, reason: 'Materi Qada dan Qadar tidak tercantum dalam CP Aqidah SD Kepka 020/2026' },
];

export function checkOutsideKepka0202026(
  text: string,
  fase: Fase,
  cpCode?: string
): { isOutside: boolean; reason: string } {
  const clean = text.trim();
  if (!clean) return { isOutside: false, reason: '' };

  for (const item of OUT_OF_SCOPE_PATTERNS) {
    if (item.pattern.test(clean)) {
      return {
        isOutside: true,
        reason: `Di luar CP Kepka 020/2026: ${item.reason}.`,
      };
    }
  }

  // Fase-specific checks
  if (fase === 'A') {
    if (/\b(puasa ramadan|zakat fitrah|haji|salat jumat|hari akhir|kiamat|mad thabi|sukun|tasydid)\b/i.test(clean)) {
      return {
        isOutside: true,
        reason: 'Di luar CP Kepka 020/2026 untuk Fase A: Materi tersebut berada pada CP Fase B atau Fase C.',
      };
    }
  }
  if (fase === 'B') {
    if (/\b(puasa ramadan|zakat fitrah|haji|salat jumat|hari akhir|kiamat|mad thabi)\b/i.test(clean)) {
      return {
        isOutside: true,
        reason: 'Di luar CP Kepka 020/2026 untuk Fase B: Materi tersebut berada pada CP Fase C.',
      };
    }
  }

  if (cpCode) {
    const cp = CP_DATABASE.find((c) => c.code === cpCode);
    if (cp && clean.length > 5) {
      const lower = clean.toLowerCase();
      const hasMatch = cp.allowedKeywords.some((kw) => lower.includes(kw));
      // If user explicitly enters an unrelated random subject like matematika/ipa/bahasa inggris
      if (/\b(matematika|pecahan|fotosintesis|gravitasi|bahasa inggris|perkalian|aljabar)\b/i.test(lower) && !hasMatch) {
        return {
          isOutside: true,
          reason: `Di luar CP Kepka 020/2026: Topik tidak sesuai dengan CP ${cp.code} (${cp.elemen}).`,
        };
      }
    }
  }

  return { isOutside: false, reason: '' };
}

export interface TPTemplate {
  cpCode: string;
  subIndex: number;
  materiPokok: string;
  kko: string;
  rumusan: string;
  dimensiP5: string[];
  indikatorMindful: string;
  indikatorMeaningful: string;
  indikatorJoyful: string;
  indikatorRefleksi: string;
  prereqTag: string;
  orderRank: number;
  suggestedSemesterIndex: number;
  suggestedJP: number;
  suggestedAsesmen: AssessmentType;
}

/**
 * Template pemecahan CP menjadi 4-6 TP Pembelajaran Mendalam per CP
 * Semua merujuk 100% pada redaksi Kepka BKPDM No. 020 Tahun 2026.
 */
export const TP_TEMPLATES: TPTemplate[] = [
  // ================= FASE A (C1 - C3) =================
  // CP 1.1 Al-Qur'an Hadis (5 TP)
  {
    cpCode: '1.1',
    subIndex: 1,
    materiPokok: 'Huruf Hijaiyah Berharakat (Fathah, Kasrah, Dammah)',
    kko: 'Membaca & Membedakan (C1-C2)',
    rumusan:
      'Peserta didik mampu membaca dan membedakan huruf hijaiyah berharakat fathah, kasrah, dan dammah (TP 1.1.1) melalui permainan kartu huruf serta mengaitkannya dengan bunyi awal kosakata Islami sehari-hari (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa duduk tenang 10 detik, menarik napas perlahan, lalu membaca basmalah sambil menyadari nikmat lisan dari Allah Swt.',
    indikatorMeaningful: 'Siswa menghubungkan bunyi huruf hijaiyah berharakat dengan lafal doa sehari-hari (seperti ba pada bismillah).',
    indikatorJoyful: 'Permainan "Tepuk Harakat" dan tebak kartu warna-warni huruf hijaiyah berpasangan.',
    indikatorRefleksi: 'Siswa menunjuk ikon perasaan dan menyebutkan satu huruf baru yang paling diingat hari ini.',
    prereqTag: 'huruf_lepas',
    orderRank: 10,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '1.1',
    subIndex: 2,
    materiPokok: 'Huruf Hijaiyah Bersambung',
    kko: 'Membaca & Membedakan (C2-C3)',
    rumusan:
      'Peserta didik mampu membaca dan membedakan huruf hijaiyah bersambung di awal, tengah, dan akhir kata (TP 1.1.2) melalui permainan menyusun kartu kata serta mengenali contoh lafal Al-Qur\'an di rumah (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Tadabbur singkat: siswa memejamkan mata 10 detik mensyukuri nikmat mata untuk membaca Al-Qur\'an.',
    indikatorMeaningful: 'Siswa mengamati huruf bersambung pada kata pendek yang sering ditemui di buku Iqra dan masjid.',
    indikatorJoyful: 'Lomba kelompok "Puzzle Sambung Huruf Hijaiyah" menggunakan kartu magnetik atau kertas lipat.',
    indikatorRefleksi: 'Siswa menuliskan atau menebalkan 2 contoh kata hijaiyah bersambung dan menceritakan kemudahannya.',
    prereqTag: 'huruf_sambung',
    orderRank: 20,
    suggestedSemesterIndex: 2,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '1.1',
    subIndex: 3,
    materiPokok: 'Hafalan Surah Al-Fatihah',
    kko: 'Menghafal (C1-C2)',
    rumusan:
      'Peserta didik mampu menghafal Surah Al-Fatihah dengan pelafalan makhraj yang jelas (TP 1.1.3) sebagai bacaan wajib dalam setiap salat harian (meaningful) melalui kegiatan sambung ayat berantai dengan sikap khusyuk (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menenangkan hati sebelum melantunkan Surah Al-Fatihah sambil menyadari bahwa Al-Fatihah adalah dialog dengan Allah Swt.',
    indikatorMeaningful: 'Siswa memahami bahwa Surah Al-Fatihah dibaca 17 kali sehari dalam salat fardu sebagai doa meminta petunjuk.',
    indikatorJoyful: 'Permainan "Sambung Ayat Estafet" dengan bola lembut dan irama murattal anak yang ceria.',
    indikatorRefleksi: 'Siswa mengecek kelancaran hafalan 7 ayat bersama teman sebangku dengan saling menyemangati.',
    prereqTag: 'surah_fatihah',
    orderRank: 30,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Hafalan',
  },
  {
    cpCode: '1.1',
    subIndex: 4,
    materiPokok: 'Hafalan Beberapa Surah Pendek Al-Qur\'an',
    kko: 'Menghafal (C1-C2)',
    rumusan:
      'Peserta didik mampu menghafal beberapa surah pendek Al-Qur\'an seperti Surah Al-Ikhlas, Al-Falaq, dan An-Nas (TP 1.1.4) untuk diamalkan dalam salat dan doa perlindungan sebelum tidur (meaningful) melalui kartu surah dengan tenang (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Tarik napas 3 kali, lalu siswa menyimak arti singkat bahwa Allah tempat berlindung dari segala keburukan.',
    indikatorMeaningful: 'Siswa mempraktikkan kebiasaan membaca Al-Ikhlas, Al-Falaq, dan An-Nas sebelum tidur di rumah bersama orang tua.',
    indikatorJoyful: 'Tebak kartu nama surah dan melagukan ayat pendek dengan gerakan tangan sederhana.',
    indikatorRefleksi: 'Siswa memilih satu surah pendek yang akan rutin dibaca malam ini sebelum tidur.',
    prereqTag: 'surah_pendek',
    orderRank: 40,
    suggestedSemesterIndex: 2,
    suggestedJP: 6,
    suggestedAsesmen: 'Hafalan',
  },
  {
    cpCode: '1.1',
    subIndex: 5,
    materiPokok: 'Hadis tentang Kebersihan',
    kko: 'Menghafal & Mempraktikkan (C1-C3)',
    rumusan:
      'Peserta didik mampu menghafal dan mempraktikkan hadis tentang kebersihan (TP 1.1.5) dalam menjaga kebersihan tubuh, pakaian, dan ruang kelas setiap hari (meaningful) melalui aksi "Detektif Kebersihan" dengan kesadaran diri (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa mengamati kebersihan meja dan pakaiannya sendiri selama 15 detik dengan penuh kesadaran.',
    indikatorMeaningful: 'Siswa mempraktikkan hadis kebersihan dengan merapikan alat tulis, membuang sampah pada tempatnya, dan mencuci tangan.',
    indikatorJoyful: 'Permainan lagu "Kebersihan Sebagian dari Iman" dan misi ceria "Detektif Kelas Bersih".',
    indikatorRefleksi: 'Siswa menyebutkan satu kebiasaan bersih yang langsung dilakukan setelah pulang sekolah.',
    prereqTag: 'hadis_kebersihan',
    orderRank: 45,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },

  // CP 1.2 Aqidah (4 TP)
  {
    cpCode: '1.2',
    subIndex: 1,
    materiPokok: 'Rukun Iman (6 Perkara)',
    kko: 'Menyebutkan & Menjelaskan (C1-C2)',
    rumusan:
      'Peserta didik mampu menyebutkan dan menjelaskan enam rukun iman secara runtut (TP 1.2.1) serta mengaitkannya dengan keyakinan anak muslim dalam bersikap baik setiap hari (meaningful) melalui lagu tepuk rukun iman dengan kesadaran penuh (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa meletakkan tangan di dada, menutup mata sejenak, dan merasakan keyakinan bahwa Allah selalu menyayangi hamba-Nya.',
    indikatorMeaningful: 'Siswa memahami rukun iman sebagai pondasi rumah keyakinan seorang muslim agar hidup tenang dan jujur.',
    indikatorJoyful: 'Menyanyikan "Lagu Enam Rukun Iman" dengan gerakan jari dan permainan mencocokkan kartu urutan.',
    indikatorRefleksi: 'Siswa mengulang urutan 6 rukun iman secara berpasangan dengan wajah ceria.',
    prereqTag: 'rukun_iman',
    orderRank: 5,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '1.2',
    subIndex: 2,
    materiPokok: 'Iman kepada Allah Swt.',
    kko: 'Menjelaskan & Meyakini (C2)',
    rumusan:
      'Peserta didik mampu menjelaskan bukti iman kepada Allah Swt. melalui pengamatan ciptaan-Nya di sekitar sekolah dan rumah (TP 1.2.2) untuk menumbuhkan rasa syukur dalam aktivitas harian (meaningful) secara penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa melihat keluar jendela atau mengamati tumbuhan selama 15 detik sambil mengucap Subhanallah.',
    indikatorMeaningful: 'Siswa membedakan ciptaan Allah (matahari, pohon, manusia) dan buatan manusia dalam kehidupan sehari-hari.',
    indikatorJoyful: 'Permainan gambar "Cari Ciptaan Allah" dan menggambar satu ciptaan Allah yang paling disukai.',
    indikatorRefleksi: 'Siswa mengucapkan satu nikmat ciptaan Allah yang paling disyukuri hari ini.',
    prereqTag: 'iman_allah',
    orderRank: 12,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '1.2',
    subIndex: 3,
    materiPokok: 'Beberapa Asmaulhusna (Ar-Rahman, Ar-Rahim, Al-Malik, Al-Quddus)',
    kko: 'Menyebutkan & Meneladani (C1-C3)',
    rumusan:
      'Peserta didik mampu menyebutkan dan menjelaskan arti beberapa asmaulhusna seperti Ar-Rahman, Ar-Rahim, dan Al-Quddus (TP 1.2.3) dengan meneladani sikap kasih sayang serta menjaga kebersihan diri di rumah dan sekolah (meaningful) secara sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Kreatif'],
    indikatorMindful: 'Hening sejenak mengingat kasih sayang Allah melalui orang tua dan guru yang merawat siswa hari ini.',
    indikatorMeaningful: 'Siswa memberi contoh perilaku nyata meneladani Ar-Rahman (berbagi bekal/menyayangi teman) dan Al-Quddus (menjaga kebersihan).',
    indikatorJoyful: 'Membuat mahkota atau kartu warna Asmaulhusna dan bermain tebak arti berpasangan.',
    indikatorRefleksi: 'Siswa berjanji melakukan satu kebaikan kasih sayang kepada teman atau keluarga sepulang sekolah.',
    prereqTag: 'asmaulhusna',
    orderRank: 25,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '1.2',
    subIndex: 4,
    materiPokok: 'Iman kepada Malaikat Allah',
    kko: 'Menyebutkan & Menceritakan (C1-C2)',
    rumusan:
      'Peserta didik mampu menyebutkan nama dan tugas pokok malaikat Allah Swt. (TP 1.2.4) sehingga terdorong berbuat jujur dan rajin beribadah karena merasa selalu diawasi malaikat pencatat amal (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menarik napas pelan dan menyadari bahwa malaikat Raqib dan Atid selalu mencatat setiap ucapan baik.',
    indikatorMeaningful: 'Siswa menghubungkan tugas malaikat Jibril, Mikail, Raqib, dan Atid dengan semangat beramal jujur di sekolah.',
    indikatorJoyful: 'Lagu "Sepuluh Malaikat Allah" dan permainan menjodohkan kartu nama malaikat dengan tugasnya.',
    indikatorRefleksi: 'Siswa menyebutkan satu perbuatan baik yang ingin dicatat malaikat Raqib hari ini.',
    prereqTag: 'iman_malaikat',
    orderRank: 50,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },

  // CP 1.3 Akhlak (4 TP)
  {
    cpCode: '1.3',
    subIndex: 1,
    materiPokok: 'Akhlak Menyucikan & Memuji Allah (Basmalah, Hamdalah, Tasbih)',
    kko: 'Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan akhlak terhadap Allah Swt. dengan membiasakan kalimat tayyibah basmalah, hamdalah, dan tasbih (TP 1.3.1) sebelum dan sesudah melakukan aktivitas harian seperti makan dan belajar (meaningful) dengan kesadaran hati (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa diam 10 detik sebelum membuka buku, mengingat bahwa setiap langkah dimulai dengan nama Allah.',
    indikatorMeaningful: 'Siswa mempraktikkan ucapan basmalah saat memulai kegiatan dan hamdalah saat menerima nikmat atau selesai belajar.',
    indikatorJoyful: 'Permainan simulasi situasi harian "Pilih Kalimat Tayyibah yang Tepat!" menggunakan papan kartu.',
    indikatorRefleksi: 'Siswa menghitung berapa kali telah mengucap basmalah dan hamdalah sejak pagi.',
    prereqTag: 'akhlak_allah',
    orderRank: 18,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '1.3',
    subIndex: 2,
    materiPokok: 'Akhlak Memuji Allah dan Rasa Syukur Sehari-hari',
    kko: 'Menceritakan & Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan sikap bersyukur sebagai wujud memuji Allah Swt. atas nikmat tubuh, keluarga, dan teman (TP 1.3.2) melalui kebiasaan berterima kasih dan berbagi di lingkungan sekitar (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Refleksi sunyi 15 detik: siswa mensyukuri mata, telinga, dan kesehatan yang masih berfungsi baik.',
    indikatorMeaningful: 'Siswa menuliskan/menggambar 3 nikmat Allah dan cara menjaganya di rumah.',
    indikatorJoyful: 'Membuat "Pohon Syukur Kelas" dari kertas warna berbentuk daun berisi ucapan syukur siswa.',
    indikatorRefleksi: 'Siswa menyampaikan satu ucapan terima kasih kepada teman atau guru di akhir pelajaran.',
    prereqTag: 'akhlak_syukur',
    orderRank: 32,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '1.3',
    subIndex: 3,
    materiPokok: 'Akhlak terhadap Diri Sendiri (Hidup Bersih, Jujur, Disiplin)',
    kko: 'Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan akhlak terhadap diri sendiri berupa sikap jujur, disiplin waktu, dan menjaga kebersihan badan (TP 1.3.3) dalam rutinitas pagi dan belajar di sekolah (meaningful) dengan kesadaran diri (mindful) dan gembira (joyful).',
    dimensiP5: ['Mandiri', 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia'],
    indikatorMindful: 'Siswa memeriksa kesiapan diri (seragam rapi, hati tenang, siap belajar jujur) sebelum materi dimulai.',
    indikatorMeaningful: 'Siswa bermain peran menghadapi situasi nyata (menemukan pensil teman, merapikan tas sendiri) untuk melatih kejujuran dan disiplin.',
    indikatorJoyful: 'Bermain peran "Anak Hebat Jujur & Disiplin" dengan properti sederhana di kelas.',
    indikatorRefleksi: 'Siswa mengisi ceklis sederhana kebiasaan mandiri yang akan dilakukan esok pagi.',
    prereqTag: 'akhlak_diri',
    orderRank: 55,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '1.3',
    subIndex: 4,
    materiPokok: 'Akhlak terhadap Diri Sendiri (Berani Bertanya & Gemar Belajar)',
    kko: 'Menunjukkan & Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan akhlak terpuji terhadap diri sendiri dengan sikap gemar belajar, santun berbicara, dan menjaga ucapan yang baik (TP 1.3.4) saat berinteraksi dengan teman dan keluarga (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Mandiri', 'Bernalar Kritis'],
    indikatorMindful: 'Latihan jeda 5 detik sebelum berbicara agar lisan hanya mengucapkan kata yang baik dan santun.',
    indikatorMeaningful: 'Siswa membedakan ucapan yang menyemangati teman dan ucapan yang menyakiti hati dalam kehidupan kelas.',
    indikatorJoyful: 'Permainan "Kotak Kata Baik" tempat siswa mengambil kartu pujian santun untuk teman sebangku.',
    indikatorRefleksi: 'Siswa menyebutkan satu kata baik yang ingin diucapkan kepada orang tua di rumah.',
    prereqTag: 'akhlak_lisan',
    orderRank: 68,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },

  // CP 1.4 Fiqih (5 TP)
  {
    cpCode: '1.4',
    subIndex: 1,
    materiPokok: 'Rukun Islam & Syahadatain',
    kko: 'Menyebutkan & Melafalkan (C1-C3)',
    rumusan:
      'Peserta didik mampu menyebutkan lima rukun Islam serta melafalkan syahadatain beserta artinya (TP 1.4.1) sebagai identitas dan janji setia seorang muslim dalam kehidupan sehari-hari (meaningful) melalui tepuk rukun Islam dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa duduk tegak, menarik napas, dan menyadari kebanggaan menjadi seorang muslim yang mencintai Allah dan Rasul-Nya.',
    indikatorMeaningful: 'Siswa memahami makna dua kalimat syahadat sebagai pintu utama menjadi muslim yang taat beribadah.',
    indikatorJoyful: 'Tepuk "Lima Rukun Islam" dan lomba menyusun urutan kartu rukun Islam secara berkelompok.',
    indikatorRefleksi: 'Siswa melafalkan syahadatain beserta artinya dengan suara jelas dan penuh keyakinan.',
    prereqTag: 'rukun_islam_syahadat',
    orderRank: 15,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Hafalan',
  },
  {
    cpCode: '1.4',
    subIndex: 2,
    materiPokok: 'Tata Cara Bersuci (Wudhu & Istinja)',
    kko: 'Mempraktikkan (C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan tata cara bersuci berupa istinja dan wudhu secara tertib (TP 1.4.2) sebagai cara menjaga kebersihan diri sebelum menghadap Allah Swt. dan sebelum belajar (meaningful) melalui simulasi gerakan wudhu dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa merasakan kesegaran air dan menyadari bahwa wudhu membersihkan kotoran lahir sekaligus menenangkan hati.',
    indikatorMeaningful: 'Siswa memahami bahwa bersuci bukan sekadar urutan gerakan, tetapi syarat sah salat dan pola hidup sehat.',
    indikatorJoyful: 'Lagu "Gerakan Wudhu Tertib" dan permainan menyusun kartu urutan anggota wudhu.',
    indikatorRefleksi: 'Siswa memeriksa kembali urutan wudhu dari niat hingga membasuh kaki dan berdoa.',
    prereqTag: 'bersuci',
    orderRank: 35,
    suggestedSemesterIndex: 1,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '1.4',
    subIndex: 3,
    materiPokok: 'Tata Cara Tayamum sebagai Keringanan Bersuci',
    kko: 'Mempraktikkan (C3)',
    rumusan:
      'Peserta didik mampu mempraktikkan tata cara tayamum dengan debu yang suci (TP 1.4.3) ketika dalam perjalanan atau tidak menemukan air agar tetap dapat melaksanakan salat (meaningful) melalui praktik berpasangan dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa merenungi betapa Allah Maha Pengasih dengan memberi kemudahan tayamum saat tidak ada air.',
    indikatorMeaningful: 'Siswa mengetahui kondisi nyata kapan tayamum dilakukan (sakit atau tidak ada air di perjalanan).',
    indikatorJoyful: 'Simulasi ceria "Koper Safar": siswa berlatih tayamum secara bergantian dengan kartu panduan visual.',
    indikatorRefleksi: 'Siswa membedakan bagian tubuh yang dibasuh saat wudhu dan yang diusap saat tayamum.',
    prereqTag: 'tayamum',
    orderRank: 42,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '1.4',
    subIndex: 4,
    materiPokok: 'Salat Fardu (Waktu, Jumlah Rakaat, Gerakan & Bacaan)',
    kko: 'Mempraktikkan (C3)',
    rumusan:
      'Peserta didik mampu menyebutkan waktu dan jumlah rakaat serta mempraktikkan gerakan dan bacaan salat fardu secara tertib (TP 1.4.4) sebagai bentuk ketaatan dan kedisiplinan waktu harian (meaningful) melalui praktik salat ceria dengan khusyuk (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa berdiri tenang menghadap kiblat 10 detik, menenangkan pikiran sebelum takbiratul ihram.',
    indikatorMeaningful: 'Siswa mengaitkan lima waktu salat fardu dengan jadwal aktivitas harian di rumah (bangun pagi, pulang sekolah, sore, malam).',
    indikatorJoyful: 'Permainan jam putar "Tebak Waktu & Rakaat Salat" serta praktik gerakan salat bersama.',
    indikatorRefleksi: 'Siswa menandai waktu salat yang sudah mulai rutin dikerjakan bersama keluarga di rumah.',
    prereqTag: 'salat_fardu',
    orderRank: 60,
    suggestedSemesterIndex: 2,
    suggestedJP: 8,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '1.4',
    subIndex: 5,
    materiPokok: 'Zikir dan Berdoa Setelah Salat',
    kko: 'Menghafal & Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu melafalkan zikir singkat (istighfar, tasbih, tahmid, takbir) dan doa setelah salat (TP 1.4.5) untuk memohon kebaikan bagi diri sendiri dan kedua orang tua (meaningful) melalui latihan berjamaah dengan khusyuk (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menengadahkan tangan dengan tenang setelah salam dan merasakan kedekatan hati dengan Allah Swt.',
    indikatorMeaningful: 'Siswa memahami pentingnya mendoakan kedua orang tua setiap selesai salat sebagai wujud bakti anak saleh.',
    indikatorJoyful: 'Menghitung tasbih menggunakan jari tangan secara berirama dan membuat kartu doa saku bergambar.',
    indikatorRefleksi: 'Siswa mempraktikkan doa untuk kedua orang tua secara bersama-sama dengan suara lembut.',
    prereqTag: 'zikir_doa',
    orderRank: 75,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Hafalan',
  },

  // CP 1.5 SPI (4 TP)
  {
    cpCode: '1.5',
    subIndex: 1,
    materiPokok: 'Kisah Keteladanan Nabi Adam a.s. (Taat & Mengakui Kesalahan)',
    kko: 'Menceritakan (C2-C3)',
    rumusan:
      'Peserta didik mampu menceritakan kembali kisah Nabi Adam a.s. dan sikap berani mengakui kesalahan serta memohon maaf kepada Allah (TP 1.5.1) untuk diterapkan saat bersalah kepada orang tua atau teman (meaningful) melalui dongeng bergambar dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa hening sejenak mengingat sikap jujur meminta maaf ketika melakukan kekhilafan.',
    indikatorMeaningful: 'Siswa mengaitkan keteladanan Nabi Adam a.s. dengan kebiasaan segera meminta maaf tanpa menyalahkan orang lain.',
    indikatorJoyful: 'Mendengarkan kisah dengan boneka tangan atau kartu cerita bergambar dan bermain peran dialog maaf.',
    indikatorRefleksi: 'Siswa menyebutkan kalimat permohonan maaf yang santun dalam kehidupan sehari-hari.',
    prereqTag: 'kisah_nabi_awal',
    orderRank: 28,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '1.5',
    subIndex: 2,
    materiPokok: 'Kisah Keteladanan Nabi Nuh a.s. (Sabar & Tekun Berdakwah)',
    kko: 'Menceritakan (C2-C3)',
    rumusan:
      'Peserta didik mampu menceritakan kisah keteladanan Nabi Nuh a.s. yang sabar dan pekerja keras membangun kapal atas perintah Allah (TP 1.5.2) sehingga menumbuhkan sikap pantang menyerah saat belajar (meaningful) melalui cerita interaktif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Kreatif'],
    indikatorMindful: 'Siswa menarik napas panjang dan melatih kesabaran hati saat menghadapi tugas yang terasa sulit.',
    indikatorMeaningful: 'Siswa mencontoh ketekunan Nabi Nuh a.s. dalam menyelesaikan pekerjaan rumah dan tugas sekolah tanpa mengeluh.',
    indikatorJoyful: 'Membuat lipatan kapal kertas sederhana sambil menceritakan urutan kisah Nabi Nuh a.s.',
    indikatorRefleksi: 'Siswa menyebutkan satu hal yang membutuhkan kesabaran ekstra minggu ini.',
    prereqTag: 'kisah_nabi_nuh',
    orderRank: 48,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '1.5',
    subIndex: 3,
    materiPokok: 'Kisah Keteladanan Nabi Ibrahim a.s. & Nabi Ismail a.s.',
    kko: 'Menceritakan (C2-C3)',
    rumusan:
      'Peserta didik mampu menceritakan kisah keteladanan Nabi Ibrahim a.s. dan Nabi Ismail a.s. tentang ketaatan, keberanian mencari kebenaran, dan bakti kepada orang tua (TP 1.5.3) dalam kehidupan keluarga sehari-hari (meaningful) melalui drama mini dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa merenungkan kasih sayang antara ayah dan anak serta ketaatan Nabi Ismail kepada Allah.',
    indikatorMeaningful: 'Siswa memberi contoh sikap patuh dan hormat kepada ayah dan ibu ketika diminta membantu di rumah.',
    indikatorJoyful: 'Main peran singkat kisah ketaatan Nabi Ibrahim dan Ismail bersama kelompok kecil.',
    indikatorRefleksi: 'Siswa memilih satu bentuk bakti yang akan dilakukan untuk orang tua hari ini.',
    prereqTag: 'kisah_ibrahim_ismail',
    orderRank: 64,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '1.5',
    subIndex: 4,
    materiPokok: 'Kisah Keteladanan Masa Kecil Nabi Muhammad Saw.',
    kko: 'Menceritakan (C2-C3)',
    rumusan:
      'Peserta didik mampu menceritakan kisah masa kecil Nabi Muhammad Saw. yang jujur (Al-Amin), penyayang, dan mandiri (TP 1.5.4) sebagai teladan pergaulan di sekolah dan rumah (meaningful) melalui peta cerita bergambar dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa berselawat bersama dengan lembut dan menumbuhkan rasa cinta kepada Nabi Muhammad Saw.',
    indikatorMeaningful: 'Siswa meneladani gelar Al-Amin (dapat dipercaya) dengan menjaga amanah teman dan tidak berbohong.',
    indikatorJoyful: 'Menyanyikan lagu selawat anak dan permainan menyusun "Kartu Teladan Al-Amin".',
    indikatorRefleksi: 'Siswa menuliskan satu sifat Nabi Muhammad Saw. yang paling ingin ditiru.',
    prereqTag: 'kisah_rasul_awal',
    orderRank: 80,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },

  // ================= FASE B (C2 - C4) =================
  // CP 2.1 Al-Qur'an Hadis (4 TP)
  {
    cpCode: '2.1',
    subIndex: 1,
    materiPokok: 'Huruf Hijaiyah Berharakat Sukun dan Bertasydid',
    kko: 'Membaca & Membedakan (C2-C3)',
    rumusan:
      'Peserta didik mampu membaca dan membedakan pelafalan huruf hijaiyah berharakat sukun dan bertasydid secara tepat (TP 2.1.1) untuk mencegah kesalahan bacaan dalam salat dan tadarus harian (meaningful) melalui permainan kartu bunyi dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa memusatkan pendengaran selama 10 detik dan melafalkan taawuz serta basmalah sebelum membaca huruf.',
    indikatorMeaningful: 'Siswa membandingkan perbedaan arti dan bunyi kata berharakat sukun (mati) dan tasydid (ditekan/rangkap) pada bacaan salat.',
    indikatorJoyful: 'Permainan "Detektif Sukun & Tasydid": menempel stiker warna pada kartu kata Al-Qur\'an secara berkelompok.',
    indikatorRefleksi: 'Siswa menyebutkan perbedaan cara membaca tanda sukun dan tanda tasydid dengan bahasanya sendiri.',
    prereqTag: 'huruf_sukun_tasydid',
    orderRank: 10,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '2.1',
    subIndex: 2,
    materiPokok: 'Kalimat dalam Al-Qur\'an',
    kko: 'Membaca & Menganalisis (C3-C4)',
    rumusan:
      'Peserta didik mampu membaca dan membedakan susunan kalimat dalam Al-Qur\'an yang mengandung harakat sukun dan tasydid secara tartil (TP 2.1.2) sebagai bekal membaca mushaf Al-Qur\'an di rumah dan TPA (meaningful) melalui latihan berpasangan dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Tadabbur singkat: siswa menyadari bahwa setiap huruf Al-Qur\'an yang dibaca bernilai pahala kebaikan.',
    indikatorMeaningful: 'Siswa berlatih membaca potongan ayat Al-Qur\'an dari juz 30 yang mengandung tanda sukun dan tasydid.',
    indikatorJoyful: 'Aktivitas "Tukar Kartu Ayat" berpasangan dengan sistem tutor sebaya yang suportif.',
    indikatorRefleksi: 'Siswa mencatat 2 ayat pendek yang sudah berhasil dibaca lancar tanpa ragu.',
    prereqTag: 'kalimat_alquran',
    orderRank: 25,
    suggestedSemesterIndex: 1,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '2.1',
    subIndex: 3,
    materiPokok: 'Hadis tentang Keutamaan Membaca Al-Qur\'an',
    kko: 'Menjelaskan & Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu membaca, memahami isi pokok, dan mempraktikkan hadis tentang keutamaan membaca Al-Qur\'an (TP 2.1.3) dengan menyusun jadwal tadarus singkat harian di rumah (meaningful) melalui diskusi kelompok dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa merefleksikan ketenangan batin saat mendengar lantunan Al-Qur\'an.',
    indikatorMeaningful: 'Siswa membuat komitmen jadwal membaca Al-Qur\'an/Iqra minimal 5–10 menit setiap hari setelah Magrib.',
    indikatorJoyful: 'Membuat poster mini "Jadwal Sahabat Al-Qur\'an" berhias kaligrafi sederhana.',
    indikatorRefleksi: 'Siswa menuliskan target halaman atau ayat yang ingin dibaca malam ini.',
    prereqTag: 'hadis_keutamaan_quran',
    orderRank: 45,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Hafalan',
  },
  {
    cpCode: '2.1',
    subIndex: 4,
    materiPokok: 'Hadis tentang Salat Fardu',
    kko: 'Menjelaskan & Menganalisis (C2-C4)',
    rumusan:
      'Peserta didik mampu membaca dan menganalisis pesan hadis tentang kewajiban serta keutamaan salat fardu tepat waktu (TP 2.1.4) dalam membentuk kedisiplinan hidup sehari-hari (meaningful) melalui kuis interaktif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa menyadari bahwa salat tepat waktu adalah pertemuan istimewa dengan Allah di sela kesibukan bermain dan belajar.',
    indikatorMeaningful: 'Siswa mengidentifikasi hambatan yang sering membuat terlambat salat dan merancang solusinya.',
    indikatorJoyful: 'Permainan kuis kelompok "Tangga Disiplin Salat" dan menghafal matan hadis dengan gerakan.',
    indikatorRefleksi: 'Siswa menuliskan satu cara agar tidak menunda salat saat sedang asyik bermain.',
    prereqTag: 'hadis_salat',
    orderRank: 65,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },

  // CP 2.2 Aqidah (4 TP)
  {
    cpCode: '2.2',
    subIndex: 1,
    materiPokok: 'Sifat Wajib Allah Swt.',
    kko: 'Memahami & Menganalisis (C2-C4)',
    rumusan:
      'Peserta didik mampu menjelaskan dan membedakan sifat wajib Allah Swt. (seperti Wujud, Qidam, Baqa, Mukhalafatu lilhawadisi) (TP 2.2.1) melalui pengamatan keteraturan alam sekitar agar semakin yakin dan tawaduk (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa mengamati keteraturan siang-malam dan bernapas sadar sambil merenungi keberadaan Allah Yang Maha Kekal.',
    indikatorMeaningful: 'Siswa menghubungkan sifat Baqa (kekal) dengan sifat manusia yang sementara sehingga terdorong memperbanyak kebaikan.',
    indikatorJoyful: 'Lagu sifat wajib Allah dan permainan kartu "Pasangkan Sifat & Artinya".',
    indikatorRefleksi: 'Siswa menyebutkan satu hikmah mengenal sifat wajib Allah bagi sikap rendah hati.',
    prereqTag: 'sifat_wajib_allah',
    orderRank: 15,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '2.2',
    subIndex: 2,
    materiPokok: 'Nama-Nama Kitab Allah Swt.',
    kko: 'Mengidentifikasi & Membedakan (C2-C4)',
    rumusan:
      'Peserta didik mampu mengidentifikasi empat kitab Allah Swt. beserta rasul penerimanya (TP 2.2.2) dan memposisikan Al-Qur\'an sebagai pedoman hidup umat Islam sehari-hari (meaningful) melalui peta konsep kolaboratif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa merenungkan betapa sayangnya Allah menurunkan kitab suci sebagai peta petunjuk hidup manusia.',
    indikatorMeaningful: 'Siswa mencontohkan cara memuliakan Al-Qur\'an di rumah dan mengamalkan pesannya (jujur, rajin, hormat).',
    indikatorJoyful: 'Membuat bagan lipat "4 Kitab Suci & Rasul Penerima" secara berkelompok.',
    indikatorRefleksi: 'Siswa menjelaskan alasan Al-Qur\'an disebut penyempurna kitab-kitab terdahulu.',
    prereqTag: 'kitab_allah',
    orderRank: 30,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '2.2',
    subIndex: 3,
    materiPokok: 'Iman kepada Para Rasul Allah Swt.',
    kko: 'Menjelaskan & Mengidentifikasi (C2-C3)',
    rumusan:
      'Peserta didik mampu menjelaskan makna beriman kepada para rasul Allah Swt. dan mengenal rasul Ulul Azmi (TP 2.2.3) untuk meneladani keteguhan hati mereka saat menghadapi tantangan belajar (meaningful) melalui permainan kartu profil rasul dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menarik napas tenang dan menyadari bahwa para rasul diutus membawa rahmat dan keteladanan.',
    indikatorMeaningful: 'Siswa mengaitkan keteguhan rasul Ulul Azmi dengan sikap tidak mudah menyerah saat menghadapi soal sulit atau perselisihan teman.',
    indikatorJoyful: 'Permainan "Kwartet Rasul Ulul Azmi" berisi petunjuk kisah singkat tiap rasul.',
    indikatorRefleksi: 'Siswa memilih satu sikap tangguh rasul Ulul Azmi untuk diterapkan minggu ini.',
    prereqTag: 'iman_rasul',
    orderRank: 40,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '2.2',
    subIndex: 4,
    materiPokok: 'Sifat Wajib Rasul (Siddiq, Amanah, Tabligh, Fathanah)',
    kko: 'Menganalisis & Menerapkan (C3-C4)',
    rumusan:
      'Peserta didik mampu membedakan empat sifat wajib rasul (Siddiq, Amanah, Tabligh, Fathanah) dan menganalisis penerapannya dalam tugas kelompok dan pergaulan sekolah (TP 2.2.4) (meaningful) melalui studi kasus mini dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa menilai kejujuran dan tanggung jawab dirinya hari ini secara tenang di dalam hati.',
    indikatorMeaningful: 'Siswa memecahkan studi kasus nyata di sekolah (menjaga barang titipan teman = Amanah, menyampaikan pesan guru dengan tepat = Tabligh).',
    indikatorJoyful: 'Main peran "Empat Pahlawan Sifat Rasul" dalam skenario kehidupan kelas.',
    indikatorRefleksi: 'Siswa menuliskan satu contoh tindakan Amanah yang akan dijaga hari ini.',
    prereqTag: 'sifat_rasul',
    orderRank: 55,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },

  // CP 2.3 Akhlak (4 TP)
  {
    cpCode: '2.3',
    subIndex: 1,
    materiPokok: 'Akhlak kepada Allah Swt. (Taat, Syukur, Ikhlas)',
    kko: 'Menganalisis & Menerapkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menerapkan akhlak terhadap Allah Swt. melalui sikap taat, syukur, dan ikhlas beribadah tanpa mengharap pujian teman (TP 2.3.1) dalam aktivitas sekolah dan rumah (meaningful) melalui refleksi jurnal harian dengan kesadaran diri (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa hening 15 detik memeriksa niat belajar hari ini agar semata-mata mencari rida Allah.',
    indikatorMeaningful: 'Siswa membandingkan tindakan membantu teman dengan ikhlas vs berharap imbalan dalam kehidupan nyata.',
    indikatorJoyful: 'Membuat "Kartu Niat Baik Rahasia" dan permainan tebak skenario akhlak terpuji.',
    indikatorRefleksi: 'Siswa menuliskan satu kebaikan yang dilakukan diam-diam tanpa pamer.',
    prereqTag: 'akhlak_allah_b',
    orderRank: 20,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '2.3',
    subIndex: 2,
    materiPokok: 'Akhlak kepada Allah Swt. (Tawakal dan Sabar)',
    kko: 'Menerapkan (C3)',
    rumusan:
      'Peserta didik mampu menerapkan akhlak tawakal dan sabar setelah berusaha sungguh-sungguh (TP 2.3.2) saat menghadapi hasil ulangan atau perlombaan sekolah (meaningful) melalui diskusi pengalaman nyata dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Mandiri', 'Bernalar Kritis'],
    indikatorMindful: 'Latihan pernapasan tenang ketika merasa kecewa atau cemas sebelum ujian.',
    indikatorMeaningful: 'Siswa memahami bahwa tawakal berarti belajar maksimal terlebih dahulu lalu menyerahkan hasil kepada Allah.',
    indikatorJoyful: 'Permainan kolaboratif "Menara Sedotan" yang melatih kesabaran, usaha, dan kerja sama.',
    indikatorRefleksi: 'Siswa merumuskan langkah ikhtiar dan doa sebelum menghadapi penilaian.',
    prereqTag: 'akhlak_tawakal',
    orderRank: 48,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '2.3',
    subIndex: 3,
    materiPokok: 'Akhlak terhadap Rasulullah Saw. (Membaca Selawat & Cinta Sunnah)',
    kko: 'Menerapkan (C3)',
    rumusan:
      'Peserta didik mampu menerapkan akhlak terhadap Rasulullah Saw. dengan membiasakan bacaan selawat serta meneladani sunnah keseharian beliau seperti salam dan senyum (TP 2.3.3) di lingkungan sekolah (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa melantunkan selawat Nabi dengan khidmat dan menyadari jasa besar Rasulullah Saw. bagi umat.',
    indikatorMeaningful: 'Siswa membiasakan adab sunnah Rasulullah: mengucap salam saat masuk kelas, berjabat tangan santun, dan makan duduk dengan tangan kanan.',
    indikatorJoyful: 'Tantangan ceria "3S (Senyum, Salam, Sapa) Sunnah Rasul" selama satu pekan.',
    indikatorRefleksi: 'Siswa memilih satu sunnah harian Nabi yang paling mudah dibiasakan di rumah.',
    prereqTag: 'akhlak_rasul_selawat',
    orderRank: 35,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '2.3',
    subIndex: 4,
    materiPokok: 'Akhlak terhadap Rasulullah Saw. (Meneladani Kasih Sayang & Kejujuran)',
    kko: 'Menganalisis & Menerapkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menganalisis dan menerapkan akhlak terhadap Rasulullah Saw. melalui sikap kasih sayang kepada sesama dan menjauhi perundungan (TP 2.3.4) dalam pergaulan teman sebaya (meaningful) melalui bermain peran dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa membayangkan perasaan teman saat diperlakukan lembut sebagaimana akhlak Rasulullah Saw.',
    indikatorMeaningful: 'Siswa mempraktikkan cara menegur teman dengan lembut dan membela teman yang kesusahan.',
    indikatorJoyful: 'Drama mini "Sahabat Nabi di Sekolah Kita" dan membuat gelang persahabatan.',
    indikatorRefleksi: 'Siswa menyampaikan satu kalimat baik kepada teman yang berbeda kelompok bermain.',
    prereqTag: 'akhlak_rasul_kasih',
    orderRank: 72,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },

  // CP 2.4 Fiqih (6 TP)
  {
    cpCode: '2.4',
    subIndex: 1,
    materiPokok: 'Penguatan Rukun Iman, Rukun Islam & Tata Cara Bersuci dari Hadas',
    kko: 'Menjelaskan & Mempraktikkan (C2-C3)',
    rumusan:
      'Peserta didik mampu membedakan najis dan hadas serta mempraktikkan tata cara bersuci (wudhu dan tayamum) secara sempurna (TP 2.4.1) sebagai prasyarat sahnya ibadah salat sehari-hari (meaningful) melalui praktik langsung berpasangan dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menyadari kesucian hati dan kebersihan badan sebelum melangkah ke tempat salat.',
    indikatorMeaningful: 'Siswa mempraktikkan cara membersihkan najis ringan/sedang pada pakaian dan menyempurnakan basuhan wudhu.',
    indikatorJoyful: 'Kuis kartu "Hadas vs Najis" dan simulasi pos praktik wudhu.',
    indikatorRefleksi: 'Siswa mengecek bagian wudhu yang sering terlewat agar semakin sempurna.',
    prereqTag: 'bersuci',
    orderRank: 12,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '2.4',
    subIndex: 2,
    materiPokok: 'Adzan dan Iqamah',
    kko: 'Mempraktikkan (C3)',
    rumusan:
      'Peserta didik mampu melafalkan dan mempraktikkan adzan serta iqamah dengan lafal, irama, dan adab yang benar (TP 2.4.2) serta menjawab seruan adzan ketika mendengar di lingkungan sekitar (meaningful) melalui main peran muadzin dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menyimak lafal adzan dengan tenang dan menyadari maknanya sebagai panggilan agung menuju kemenangan.',
    indikatorMeaningful: 'Siswa mempraktikkan adab ketika mendengar adzan berkumandang (menghentikan obrolan dan menjawab seruan muadzin).',
    indikatorJoyful: 'Main peran "Muadzin Muda" secara bergilir dengan mikrofon simulasi di kelas.',
    indikatorRefleksi: 'Siswa menyebutkan doa setelah adzan beserta waktu penerapannya.',
    prereqTag: 'adzan_iqamah',
    orderRank: 34,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '2.4',
    subIndex: 3,
    materiPokok: 'Salat Fardu Berjamaah',
    kko: 'Menerapkan & Mempraktikkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menganalisis keutamaan dan mempraktikkan tata cara salat fardu berjamaah beserta posisi imam, makmum, dan makmum masbuk (TP 2.4.3) untuk menumbuhkan kebersamaan di musala sekolah (meaningful) melalui simulasi berjamaah dengan khusyuk (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa merapikan saf berjamaah dalam suasana hening dan menyadari nilai persatuan di hadapan Allah.',
    indikatorMeaningful: 'Siswa mempraktikkan aturan makmum mengikuti imam dan tata cara makmum yang datang terlambat (masbuk).',
    indikatorJoyful: 'Permainan posisi saf "Imam, Makmum, dan Masbuk" dengan kartu peran.',
    indikatorRefleksi: 'Siswa menceritakan perbedaan pahala dan perasaan antara salat sendiri dan berjamaah.',
    prereqTag: 'salat_berjamaah',
    orderRank: 52,
    suggestedSemesterIndex: 2,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '2.4',
    subIndex: 4,
    materiPokok: 'Salat Sunnah (Rawatib, Dhuha, Tarawih/Witir)',
    kko: 'Membedakan & Mempraktikkan (C3-C4)',
    rumusan:
      'Peserta didik mampu membedakan jenis dan mempraktikkan salat sunnah seperti Salat Dhuha dan Rawatib (TP 2.4.4) sebagai amalan pelengkap untuk melatih kedisiplinan dan rasa syukur di sekolah (meaningful) melalui jadwal praktik ceria dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menenangkan hati sebelum salat Dhuha dan merasakan syukur atas rezeki kesehatan dan ilmu.',
    indikatorMeaningful: 'Siswa membedakan salat sunnah qabliyah-ba\'diyah dengan salat Dhuha dan mempraktikkannya pada jam istirahat sekolah.',
    indikatorJoyful: 'Permainan roda putar "Tebak Waktu & Rakaat Salat Sunnah" dan praktik Dhuha bersama.',
    indikatorRefleksi: 'Siswa menuliskan doa yang paling ingin dipanjatkan setelah salat Dhuha.',
    prereqTag: 'salat_sunnah',
    orderRank: 68,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '2.4',
    subIndex: 5,
    materiPokok: 'Zikir dan Berdoa Setelah Salat Berjamaah',
    kko: 'Menerapkan (C3)',
    rumusan:
      'Peserta didik mampu menerapkan bacaan zikir dan doa setelah salat fardu berjamaah dengan adab yang tertib dan suara lembut (TP 2.4.5) untuk menumbuhkan ketenangan jiwa sebelum beraktivitas (meaningful) melalui latihan terbimbing dengan khusyuk (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa memejamkan mata sejenak seusai salam untuk merasakan kedamaian hati saat berzikir.',
    indikatorMeaningful: 'Siswa membiasakan tidak langsung berdiri atau bercanda seusai salat berjamaah di musala sekolah.',
    indikatorJoyful: 'Menghias pembatas buku "Panduan Zikir & Doa Seusai Salat" untuk dibawa ke musala.',
    indikatorRefleksi: 'Siswa menyebutkan urutan zikir setelah salat secara lancar.',
    prereqTag: 'zikir_doa',
    orderRank: 78,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Hafalan',
  },

  // CP 2.5 SPI (4 TP)
  {
    cpCode: '2.5',
    subIndex: 1,
    materiPokok: 'Sejarah Dakwah Rasulullah Saw. di Makkah',
    kko: 'Mengidentifikasi (C2-C4)',
    rumusan:
      'Peserta didik mampu mengidentifikasi peristiwa penting perjuangan dakwah Rasulullah Saw. periode Makkah secara runtut (TP 2.5.1) dan mengambil pelajaran kesabaran saat menghadapi penolakan dalam kehidupan sehari-hari (meaningful) melalui lini masa visual dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa merenungkan beratnya perjuangan Rasulullah Saw. menyampaikan kebenaran di Makkah.',
    indikatorMeaningful: 'Siswa belajar tetap bersikap santun dan sabar meski pendapatnya tidak langsung diterima teman.',
    indikatorJoyful: 'Membuat lini masa "Jejak Dakwah Makkah" dengan kartu gambar yang disusun berkelompok.',
    indikatorRefleksi: 'Siswa menyebutkan alasan Rasulullah Saw. berdakwah secara sembunyi-sembunyi di awal Islam.',
    prereqTag: 'sejarah_makkah',
    orderRank: 28,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '2.5',
    subIndex: 2,
    materiPokok: 'Peristiwa Hijrah Rasulullah Saw. ke Madinah',
    kko: 'Mengidentifikasi & Menganalisis (C3-C4)',
    rumusan:
      'Peserta didik mampu mengidentifikasi sebab, perjalanan, dan strategi hijrah Rasulullah Saw. ke Madinah (TP 2.5.2) serta memaknai arti hijrah sebagai perubahan menuju kebiasaan lebih baik di sekolah (meaningful) melalui peta rute hijrah dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Bernalar Kritis', 'Gotong Royong'],
    indikatorMindful: 'Siswa hening 15 detik memikirkan satu kebiasaan kurang baik yang ingin ditinggalkan (hijrah diri).',
    indikatorMeaningful: 'Siswa menghubungkan semangat hijrah dengan tekad berpindah dari malas belajar menjadi rajin.',
    indikatorJoyful: 'Permainan papan "Peta Perjalanan Hijrah Makkah–Madinah" beserta pos tantangan kisah.',
    indikatorRefleksi: 'Siswa menuliskan satu "Hijrah Kecilku" pada kartu komitmen pribadi.',
    prereqTag: 'sejarah_hijrah',
    orderRank: 46,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '2.5',
    subIndex: 3,
    materiPokok: 'Perjuangan Rasulullah Saw. Membangun Masyarakat Madinah',
    kko: 'Mengidentifikasi (C2-C3)',
    rumusan:
      'Peserta didik mampu mengidentifikasi langkah perjuangan Rasulullah Saw. di Madinah dalam mempersaudarakan Muhajirin dan Ansar (TP 2.5.3) sebagai teladan kerukunan dan tolong-menolong di kelas (meaningful) melalui simulasi berbagi peran dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Gotong Royong', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa mensyukuri kehadiran teman-teman di kelas sebagai saudara sebangsa dan seiman.',
    indikatorMeaningful: 'Siswa mempraktikkan sikap menyambut siswa pindahan atau membantu teman yang kesulitan alat tulis seperti kaum Ansar.',
    indikatorJoyful: 'Bermain peran "Persaudaraan Muhajirin & Ansar" dalam proyek berbagi bekal atau alat belajar.',
    indikatorRefleksi: 'Siswa menyebutkan satu hal baik yang dapat dibagikan kepada teman minggu ini.',
    prereqTag: 'sejarah_madinah',
    orderRank: 60,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '2.5',
    subIndex: 4,
    materiPokok: 'Perjuangan Para Sahabat Rasulullah Saw.',
    kko: 'Mengidentifikasi (C2-C4)',
    rumusan:
      'Peserta didik mampu mengidentifikasi peran dan keteladanan para sahabat utama Rasulullah Saw. (Abu Bakar, Umar, Utsman, Ali, Khadijah) dalam membela Islam (TP 2.5.4) serta menerapkannya dalam tanggung jawab kelompok kelas (meaningful) melalui kartu biografi dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa merenungkan ketulusan para sahabat yang mendampingi perjuangan Rasulullah Saw.',
    indikatorMeaningful: 'Siswa mengaitkan keteladanan sahabat (kedermawanan Abu Bakar & Utsman, keberanian Umar, kecerdasan Ali) dengan peran siswa di kelas.',
    indikatorJoyful: 'Permainan "Tebak Tokoh Sahabat Nabi" menggunakan kartu petunjuk bergambar.',
    indikatorRefleksi: 'Siswa memilih satu tokoh sahabat yang paling menginspirasi beserta alasannya.',
    prereqTag: 'sejarah_sahabat',
    orderRank: 82,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },

  // ================= FASE C (C3 - C6) =================
  // CP 3.1 Al-Qur'an Hadis (5 TP)
  {
    cpCode: '3.1',
    subIndex: 1,
    materiPokok: 'Kalimat Al-Qur\'an Berharakat Sukun, Bertasydid, dan Mad Thabi\'i',
    kko: 'Menganalisis & Membaca (C3-C4)',
    rumusan:
      'Peserta didik mampu menganalisis dan membaca kalimat dalam Al-Qur\'an yang mengandung harakat sukun, tasydid, dan mad thabi\'i sepanjang dua harakat secara tepat (TP 3.1.1) guna menjaga kemurnian bacaan saat tadarus dan salat (meaningful) melalui analisis ayat bersama kelompok dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa memusatkan fokus pernapasan selama 15 detik sebelum menyimak tartil ayat Al-Qur\'an.',
    indikatorMeaningful: 'Siswa mempraktikkan panjang bacaan mad thabi\'i (2 harakat) agar tidak tertukar makna ayat ketika menjadi imam atau membaca Al-Qur\'an.',
    indikatorJoyful: 'Permainan "Kode Warna Tajwid" (menandai sukun, tasydid, mad thabi\'i dengan stabilo warna berbeda pada lembar ayat).',
    indikatorRefleksi: 'Siswa mengevaluasi bacaan diri sendiri menggunakan rubrik panjang-pendek harakat.',
    prereqTag: 'mad_thabii',
    orderRank: 10,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '3.1',
    subIndex: 2,
    materiPokok: 'Surah-Surah Pendek dalam Al-Qur\'an (Bacaan & Kandungan)',
    kko: 'Membaca & Mengevaluasi (C3-C5)',
    rumusan:
      'Peserta didik mampu membaca dengan tartil serta menganalisis pesan moral surah-surah pendek Al-Qur\'an seperti Al-Ma\'un, At-Tin, dan Ad-Duha (TP 3.1.2) untuk diwujudkan dalam kepedulian sosial terhadap anak yatim dan teman kurang mampu (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Tadabbur ayat: siswa merenungi pesan Surah Al-Ma\'un tentang siapa pendusta agama yang tidak peduli sesama.',
    indikatorMeaningful: 'Siswa menghubungkan kandungan Surah Al-Ma\'un dengan aksi nyata berbagi di sekolah.',
    indikatorJoyful: 'Proyek kreatif "Kartu Pesan Surah Pendek" dan sambung ayat estafet antar-kelompok.',
    indikatorRefleksi: 'Siswa menuliskan satu aksi peduli yang akan dilakukan sebagai pengamalan Surah Al-Ma\'un.',
    prereqTag: 'surah_pendek_c',
    orderRank: 28,
    suggestedSemesterIndex: 1,
    suggestedJP: 6,
    suggestedAsesmen: 'Hafalan',
  },
  {
    cpCode: '3.1',
    subIndex: 3,
    materiPokok: 'Hadis tentang Amal Saleh',
    kko: 'Menganalisis & Merancang (C4-C6)',
    rumusan:
      'Peserta didik mampu menganalisis kandungan hadis tentang amal saleh yang pahalanya terus mengalir dan merancang aksi kebaikan sederhana di lingkungan sekolah (TP 3.1.3) (meaningful) melalui proyek mini kelompok dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Kreatif'],
    indikatorMindful: 'Siswa merefleksikan manfaat amal kebaikan yang tetap dikenang dan berguna meski kecil.',
    indikatorMeaningful: 'Siswa merancang proyek nyata amal saleh di sekolah (misalnya gerakan infak Jumat, taman baca kelas, atau sedekah bibit tanaman).',
    indikatorJoyful: 'Presentasi galeri "Rencana Proyek Amal Saleh Kelompokku" dengan poster penuh warna.',
    indikatorRefleksi: 'Siswa mengevaluasi keterlaksanaan aksi amal saleh selama satu pekan.',
    prereqTag: 'hadis_amal_saleh',
    orderRank: 52,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.1',
    subIndex: 4,
    materiPokok: 'Hadis tentang Ilmu dan Keutamaan Menuntut Ilmu',
    kko: 'Menganalisis & Mengevaluasi (C4-C5)',
    rumusan:
      'Peserta didik mampu menganalisis hadis tentang kewajiban dan keutamaan menuntut ilmu serta mengevaluasi etos belajar pribadi (TP 3.1.4) dalam menghadapi tantangan era digital secara bijak (meaningful) melalui diskusi reflektif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Bernalar Kritis', 'Mandiri'],
    indikatorMindful: 'Siswa menenangkan pikiran dan menyadari bahwa belajar adalah ibadah yang dimudahkan jalannya menuju surga.',
    indikatorMeaningful: 'Siswa mengevaluasi penggunaan gawai pribadi antara waktu belajar ilmu bermanfaat dan waktu hiburan.',
    indikatorJoyful: 'Debat santun dan permainan "Piramida Ilmu" menyusun adab murid terhadap guru dan buku.',
    indikatorRefleksi: 'Siswa menuliskan satu perbaikan kebiasaan belajar untuk minggu depan.',
    prereqTag: 'hadis_ilmu',
    orderRank: 72,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },

  // CP 3.2 Aqidah (4 TP)
  {
    cpCode: '3.2',
    subIndex: 1,
    materiPokok: 'Makna Iman kepada Hari Akhir',
    kko: 'Menganalisis (C4)',
    rumusan:
      'Peserta didik mampu menganalisis makna iman kepada hari akhir serta tahapan kehidupan setelah kematian (TP 3.2.1) untuk menumbuhkan kesadaran tanggung jawab atas setiap perkataan dan perbuatan sehari-hari (meaningful) melalui peta konsep reflektif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Hening 20 detik: siswa merenungi bahwa setiap amal baik sekecil apa pun akan dipertanggungjawabkan di hadapan Allah.',
    indikatorMeaningful: 'Siswa mengaitkan keyakinan adanya Yaumul Hisab dengan sikap jujur saat ujian dan tidak menyakiti teman.',
    indikatorJoyful: 'Permainan kartu alur "Perjalanan Menuju Negeri Akhirat" secara berkelompok.',
    indikatorRefleksi: 'Siswa menuliskan satu bekal kebaikan yang ingin diperbanyak mulai hari ini.',
    prereqTag: 'hari_akhir',
    orderRank: 18,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '3.2',
    subIndex: 2,
    materiPokok: 'Tanda-Tanda Hari Akhir (Kiamat Sugra dan Kubra)',
    kko: 'Menganalisis & Membedakan (C4)',
    rumusan:
      'Peserta didik mampu membedakan kiamat sugra dan kiamat kubra serta menganalisis tanda-tanda hari akhir (TP 3.2.2) untuk menyikapi bencana alam dengan empati, kepedulian lingkungan, dan kesiapan iman (meaningful) melalui studi kasus berita dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Bernalar Kritis', 'Gotong Royong'],
    indikatorMindful: 'Siswa memanjatkan doa keselamatan untuk sesama dengan penuh empati.',
    indikatorMeaningful: 'Siswa membedakan musibah alam (kiamat sugra) dan berakhirnya alam semesta (kiamat kubra), serta merancang aksi jaga lingkungan.',
    indikatorJoyful: 'Aktivitas klasifikasi kartu "Sugra atau Kubra?" dengan diskusi cepat berpasangan.',
    indikatorRefleksi: 'Siswa menyebutkan hikmah mengetahui tanda-tanda hari akhir tanpa rasa takut berlebihan.',
    prereqTag: 'tanda_hari_akhir',
    orderRank: 36,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.2',
    subIndex: 3,
    materiPokok: 'Berbagai Ciptaan Allah Swt. (Alam Semesta & Keanekaragaman Makhluk)',
    kko: 'Menganalisis & Mengevaluasi (C4-C5)',
    rumusan:
      'Peserta didik mampu menganalisis keteraturan berbagai ciptaan Allah Swt. di darat, laut, dan langit sebagai bukti kekuasaan-Nya (TP 3.2.3) serta mengevaluasi cara manusia merawat bumi (meaningful) melalui observasi alam sekolah dengan penuh kesadaran (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa mengamati keajaiban ekosistem taman sekolah selama 1 menit dalam keheningan penuh takjub.',
    indikatorMeaningful: 'Siswa menghubungkan keanekaragaman ciptaan Allah dengan tanggung jawab menjaga kebersihan air, tanaman, dan hewan.',
    indikatorJoyful: 'Eksplorasi "Jurnal Pengamat Alam Ciptaan Allah" di halaman sekolah secara berkelompok.',
    indikatorRefleksi: 'Siswa menuliskan satu tindakan merawat ciptaan Allah di rumah.',
    prereqTag: 'ciptaan_allah',
    orderRank: 54,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.2',
    subIndex: 4,
    materiPokok: 'Hikmah Meyakini Hari Akhir dan Kebesaran Ciptaan Allah Swt.',
    kko: 'Mengevaluasi & Menerapkan (C5)',
    rumusan:
      'Peserta didik mampu mengevaluasi dampak keyakinan kepada hari akhir dan pengenalan ciptaan Allah Swt. terhadap perilaku disiplin, jujur, serta peduli sesama (TP 3.2.4) dalam kehidupan sehari-hari (meaningful) melalui proyek refleksi kreatif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Kreatif'],
    indikatorMindful: 'Refleksi mendalam: siswa membandingkan perilaku saat ingat hari akhir dan saat lalai.',
    indikatorMeaningful: 'Siswa merumuskan piagam komitmen kelas yang mencerminkan pribadi beriman kepada hari akhir.',
    indikatorJoyful: 'Membuat komik strip 4 panel bertema "Iman di Hati, Jujur di Aksi".',
    indikatorRefleksi: 'Siswa saling memberi umpan balik positif atas karya komik temannya.',
    prereqTag: 'hikmah_aqidah_c',
    orderRank: 76,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },

  // CP 3.3 Akhlak (4 TP)
  {
    cpCode: '3.3',
    subIndex: 1,
    materiPokok: 'Akhlak terhadap Allah Swt. (Muraqabah, Syukur, dan Taubat)',
    kko: 'Menerapkan & Mengevaluasi (C3-C5)',
    rumusan:
      'Peserta didik mampu menerapkan akhlak terhadap Allah Swt. melalui sikap muraqabah (merasa diawasi Allah) dan segera bertaubat bila keliru (TP 3.3.1) dalam aktivitas belajar maupun penggunaan media digital (meaningful) melalui jurnal refleksi dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menutup mata 15 detik menyadari kehadiran Allah yang Maha Melihat walau sedang sendirian.',
    indikatorMeaningful: 'Siswa menerapkan muraqabah ketika menggunakan internet atau saat mengerjakan ujian tanpa pengawasan ketat.',
    indikatorJoyful: 'Diskusi kelompok dengan permainan "Kompas Kejujuran" menghadapi dilema sehari-hari.',
    indikatorRefleksi: 'Siswa menuliskan satu kebiasaan beristighfar saat menyadari kekeliruan.',
    prereqTag: 'akhlak_allah_c',
    orderRank: 22,
    suggestedSemesterIndex: 0,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '3.3',
    subIndex: 2,
    materiPokok: 'Akhlak terhadap Rasulullah Saw. (Mengikuti Keteladanan Kepemimpinan & Kasih Sayang)',
    kko: 'Menganalisis & Menerapkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menganalisis dan menerapkan akhlak terhadap Rasulullah Saw. dengan meneladani sikap adil, pemaaf, dan pembawa kedamaian (TP 3.3.2) saat menyelesaikan perbedaan pendapat antar-teman (meaningful) melalui simulasi mediasi kelas dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa melantunkan selawat dan merenungi sifat pemaaf Rasulullah Saw. kepada orang yang memusuhinya.',
    indikatorMeaningful: 'Siswa mempraktikkan cara bermusyawarah dan memaafkan teman ketika terjadi salah paham di kelas.',
    indikatorJoyful: 'Main peran "Mediator Damai ala Rasulullah" dalam menyelesaikan kasus kecil di sekolah.',
    indikatorRefleksi: 'Siswa menilai kemampuan dirinya menahan amarah dalam situasi sulit.',
    prereqTag: 'akhlak_rasul_c',
    orderRank: 44,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Observasi',
  },
  {
    cpCode: '3.3',
    subIndex: 3,
    materiPokok: 'Akhlak terhadap Sesama Manusia (Toleransi & Menghargai Perbedaan)',
    kko: 'Menganalisis & Menerapkan (C3-C5)',
    rumusan:
      'Peserta didik mampu menerapkan akhlak terhadap sesama manusia dengan sikap toleransi, saling menghormati perbedaan suku, budaya, dan keyakinan (TP 3.3.3) dalam kehidupan bermasyarakat di Indonesia (meaningful) melalui proyek kolaboratif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Berkebinekaan Global', 'Gotong Royong'],
    indikatorMindful: 'Siswa mensyukuri keberagaman teman di kelas dan masyarakat sebagai sunnatullah.',
    indikatorMeaningful: 'Siswa merumuskan batas toleransi sosial (saling menghormati dan bekerja sama) tanpa mengorbankan akidah.',
    indikatorJoyful: 'Membuat papan kolase "Indahnya Hidup Rukun dalam Perbedaan" bersama kelompok.',
    indikatorRefleksi: 'Siswa menyebutkan satu sikap menghargai tetangga atau teman yang berbeda latar belakang.',
    prereqTag: 'akhlak_sesama_toleransi',
    orderRank: 62,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.3',
    subIndex: 4,
    materiPokok: 'Akhlak terhadap Sesama Manusia (Empati, Tolong-Menolong & Anti-Perundungan)',
    kko: 'Mengevaluasi & Menerapkan (C4-C6)',
    rumusan:
      'Peserta didik mampu mengevaluasi sikap empati dan merancang aksi tolong-menolong serta pencegahan perundungan terhadap sesama manusia (TP 3.3.4) di lingkungan sekolah dan keluarga (meaningful) melalui kampanye positif kelas dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Gotong Royong', 'Kreatif'],
    indikatorMindful: 'Siswa memejamkan mata 10 detik merasakan betapa berharganya kata-kata yang menguatkan hati orang lain.',
    indikatorMeaningful: 'Siswa membuat kesepakatan anti-mengejek dan prosedur menolong teman yang sedang kesulitan.',
    indikatorJoyful: 'Proyek "Kampanye Kata Baik & Sahabat Peduli" menggunakan poster atau kartu apresiasi.',
    indikatorRefleksi: 'Siswa memberikan satu kartu apresiasi tulus kepada seorang teman di kelas.',
    prereqTag: 'akhlak_sesama_empati',
    orderRank: 80,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },

  // CP 3.4 Fiqih (6 TP)
  {
    cpCode: '3.4',
    subIndex: 1,
    materiPokok: 'Pemantapan Bersuci, Azan, Iqamah, Salat Berjamaah & Salat Sunnah',
    kko: 'Mempraktikkan & Mengevaluasi (C3-C5)',
    rumusan:
      'Peserta didik mampu mengevaluasi kesempurnaan tata cara bersuci (termasuk mandi wajib dasar usia balig), azan, iqamah, salat berjamaah, dan salat sunnah secara mandiri (TP 3.4.1) sebagai persiapan memasuki usia balig (meaningful) melalui simulasi praktik terpadu dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa menyadari peralihan tanggung jawab ibadah saat memasuki usia balig dengan rasa syukur.',
    indikatorMeaningful: 'Siswa memahami tanda-tanda balig secara syar\'i dan tanggung jawab penuh menjaga salat lima waktu serta bersuci.',
    indikatorJoyful: 'Pos praktik terpadu "Siap Balig & Ibadah Mandiri" secara berpasangan.',
    indikatorRefleksi: 'Siswa mengevaluasi bagian gerakan atau bacaan salat yang masih perlu diperbaiki.',
    prereqTag: 'salat_berjamaah_c',
    orderRank: 15,
    suggestedSemesterIndex: 0,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '3.4',
    subIndex: 2,
    materiPokok: 'Ketentuan dan Praktik Salat Jumat',
    kko: 'Menganalisis & Mempraktikkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menganalisis ketentuan syarat wajib, syarat sah, khutbah, serta adab Salat Jumat (TP 3.4.2) agar dapat mengikuti Salat Jumat dengan tertib dan khusyuk di masjid lingkungan sekitar (meaningful) melalui simulasi khutbah dan salat dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Gotong Royong'],
    indikatorMindful: 'Siswa melatih sikap diam dan menyimak khutbah dengan penuh perhatian tanpa berbicara.',
    indikatorMeaningful: 'Siswa memahami adab mandi Jumat, berpakaian rapi, datang awal ke masjid, dan mendengarkan khutbah.',
    indikatorJoyful: 'Simulasi "Jumat Berkah" dengan peran khatib cilik, muadzin, dan makmum tertib.',
    indikatorRefleksi: 'Siswa menuliskan 3 hal yang dilarang saat khatib sedang berkhutbah.',
    prereqTag: 'salat_jumat',
    orderRank: 32,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '3.4',
    subIndex: 3,
    materiPokok: 'Ketentuan dan Hikmah Puasa Ramadan',
    kko: 'Menganalisis & Menerapkan (C3-C5)',
    rumusan:
      'Peserta didik mampu menganalisis syarat, rukun, hal yang membatalkan, serta hikmah puasa Ramadan bagi kesehatan jasmani dan empati sosial (TP 3.4.3) untuk mengamalkan puasa Ramadan secara penuh dan berkualitas (meaningful) melalui studi kasus dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa merenungkan nikmat makanan dan minuman serta merasakan empati kepada saudara yang kekurangan.',
    indikatorMeaningful: 'Siswa menyusun rencana amalan Ramadan (sahur, menjaga lisan, tadarus, berbuka sederhana).',
    indikatorJoyful: 'Permainan kartu "Sah atau Batal Puasaku?" berisi skenario nyata anak SD saat Ramadan.',
    indikatorRefleksi: 'Siswa menyebutkan satu godaan terbesar saat berpuasa dan cara mengendalikannya.',
    prereqTag: 'puasa_ramadan',
    orderRank: 48,
    suggestedSemesterIndex: 1,
    suggestedJP: 6,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '3.4',
    subIndex: 4,
    materiPokok: 'Ketentuan dan Praktik Zakat Fitrah',
    kko: 'Menganalisis & Mempraktikkan (C3-C4)',
    rumusan:
      'Peserta didik mampu menghitung takaran, mengidentifikasi golongan penerima (mustahik), serta mempraktikkan tata cara penyerahan zakat fitrah (TP 3.4.4) sebagai wujud kepedulian sosial menjelang Idulfitri (meaningful) melalui simulasi amil zakat dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Gotong Royong', 'Bernalar Kritis'],
    indikatorMindful: 'Siswa menyadari bahwa di dalam harta kita terdapat hak orang-orang yang membutuhkan.',
    indikatorMeaningful: 'Siswa berlatih menghitung besaran zakat fitrah keluarga (2,5 kg atau 3,5 liter beras per jiwa) dan melafalkan niat zakat.',
    indikatorJoyful: 'Simulasi "Posko Amil Zakat Fitrah Sekolah" lengkap dengan timbangan, kupon mustahik, dan doa penerima.',
    indikatorRefleksi: 'Siswa menjelaskan perbedaan muzaki dan mustahik serta hikmah zakat fitrah.',
    prereqTag: 'zakat_fitrah',
    orderRank: 64,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Praktik',
  },
  {
    cpCode: '3.4',
    subIndex: 5,
    materiPokok: 'Ketentuan Ibadah Haji serta Zikir & Doa Setelah Salat',
    kko: 'Menganalisis & Mempraktikkan (C3-C4)',
    rumusan:
      'Peserta didik mampu mengidentifikasi rukun dan urutan manasik ibadah haji serta menyempurnakan zikir dan doa setelah salat (TP 3.4.5) sebagai puncak rukun Islam yang menumbuhkan semangat persaudaraan umat (meaningful) melalui miniatur manasik dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa melafalkan talbiyah dengan khidmat dan merasakan kesetaraan manusia di hadapan Allah saat ihram.',
    indikatorMeaningful: 'Siswa memahami perbedaan rukun haji (ihram, wukuf, tawaf, sa\'i, tahallul) serta memantapkan doa harian setelah salat.',
    indikatorJoyful: 'Simulasi rute "Manasik Haji Mini" di halaman sekolah dengan pos-pos rukun haji.',
    indikatorRefleksi: 'Siswa menuliskan harapan dan doa agar suatu hari dapat menunaikan ibadah haji bersama keluarga.',
    prereqTag: 'haji_zikir',
    orderRank: 78,
    suggestedSemesterIndex: 3,
    suggestedJP: 6,
    suggestedAsesmen: 'Praktik',
  },

  // CP 3.5 SPI (4 TP)
  {
    cpCode: '3.5',
    subIndex: 1,
    materiPokok: 'Perjuangan Rasulullah Saw. pada Peristiwa Fathu Makkah & Haji Wada',
    kko: 'Menceritakan & Menganalisis (C3-C5)',
    rumusan:
      'Peserta didik mampu menceritakan peristiwa Fathu Makkah dan pesan Haji Wada Rasulullah Saw. serta menganalisis nilai pengampunan tanpa balas dendam (TP 3.5.1) dalam menyelesaikan konflik pertemanan (meaningful) melalui drama sejarah dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Berkebinekaan Global'],
    indikatorMindful: 'Siswa merenungkan kebesaran jiwa Rasulullah Saw. yang memaafkan penduduk Makkah saat meraih kemenangan.',
    indikatorMeaningful: 'Siswa mengaitkan pesan Haji Wada (kesetaraan manusia dan memuliakan sesama) dengan pergaulan tanpa membeda-bedakan teman.',
    indikatorJoyful: 'Pementasan mini "Pesan Damai Fathu Makkah" dan diskusi kelompok kartu peristiwa.',
    indikatorRefleksi: 'Siswa menuliskan satu keteladanan pemaaf dari peristiwa Fathu Makkah.',
    prereqTag: 'spi_fathu_makkah',
    orderRank: 30,
    suggestedSemesterIndex: 1,
    suggestedJP: 4,
    suggestedAsesmen: 'Tes Lisan',
  },
  {
    cpCode: '3.5',
    subIndex: 2,
    materiPokok: 'Keteladanan Khalifah Abu Bakar As-Siddiq dan Umar bin Khattab',
    kko: 'Menceritakan & Mengambil Keteladanan (C3-C5)',
    rumusan:
      'Peserta didik mampu menceritakan perjuangan Khalifah Abu Bakar As-Siddiq dan Umar bin Khattab serta mengambil keteladanan sifat jujur, tegas, dan peduli rakyat kecil (TP 3.5.2) dalam peran kepemimpinan di kelas (meaningful) melalui diskusi kasus dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Bernalar Kritis', 'Gotong Royong'],
    indikatorMindful: 'Siswa menyadari bahwa pemimpin sejati adalah pelayan yang paling peduli terhadap keselamatan orang yang dipimpinnya.',
    indikatorMeaningful: 'Siswa mempraktikkan kepemimpinan jujur dan peduli saat menjadi ketua piket atau ketua kelompok belajar.',
    indikatorJoyful: 'Membuat majalah dinding mini "Jejak Kepemimpinan Abu Bakar & Umar".',
    indikatorRefleksi: 'Siswa menilai satu sifat pemimpin adil yang sudah dipraktikkan di sekolah.',
    prereqTag: 'spi_abubakar_umar',
    orderRank: 56,
    suggestedSemesterIndex: 2,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.5',
    subIndex: 3,
    materiPokok: 'Keteladanan Khalifah Utsman bin Affan dan Ali bin Abi Thalib',
    kko: 'Menceritakan & Mengambil Keteladanan (C3-C5)',
    rumusan:
      'Peserta didik mampu menceritakan jasa Khalifah Utsman bin Affan (kodifikasi mushaf & kedermawanan) serta Ali bin Abi Thalib (kecerdasan & keberanian) dan mengambil keteladanannya dalam gemar membaca serta berderma di sekolah (TP 3.5.3) (meaningful) dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Kreatif', 'Mandiri'],
    indikatorMindful: 'Siswa bersyukur atas tersusunnya mushaf Al-Qur\'an hingga sampai ke tangan kita hari ini.',
    indikatorMeaningful: 'Siswa menghubungkan keteladanan Utsman (dermawan) dan Ali (cinta ilmu) dengan budaya literasi dan berbagi di kelas.',
    indikatorJoyful: 'Kuis interaktif "Siapa Sahabat Ini?" dan pameran poster tokoh teladan.',
    indikatorRefleksi: 'Siswa menyebutkan satu kontribusi nyata yang bisa diberikan untuk perpustakaan/pojok baca kelas.',
    prereqTag: 'spi_utsman_ali',
    orderRank: 74,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
  {
    cpCode: '3.5',
    subIndex: 4,
    materiPokok: 'Refleksi Keteladanan Rasulullah Saw. & Para Sahabat dalam Kehidupan Nyata',
    kko: 'Mengevaluasi & Merancang (C5-C6)',
    rumusan:
      'Peserta didik mampu mengevaluasi dan merancang proyek pribadi penerapan keteladanan Rasulullah Saw. serta para sahabatnya (jujur, amanah, peduli, cinta ilmu) sebagai bekal akhlak lulusan SD (TP 3.5.4) (meaningful) melalui presentasi karya reflektif dengan sadar (mindful) dan gembira (joyful).',
    dimensiP5: ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'],
    indikatorMindful: 'Siswa melakukan refleksi tenang perjalanan belajar PAI dari kelas 1 hingga kelas 6.',
    indikatorMeaningful: 'Siswa menyusun portofolio komitmen akhlak mulia sebelum melanjutkan ke jenjang SMP/MTs.',
    indikatorJoyful: 'Galeri karya "Surat Janji Teladan Sahabat Nabi" yang dipresentasikan dengan hangat di depan teman.',
    indikatorRefleksi: 'Siswa menyampaikan satu pesan kebaikan dan doa perpisahan untuk teman sekelas.',
    prereqTag: 'spi_keteladanan_akhir',
    orderRank: 90,
    suggestedSemesterIndex: 3,
    suggestedJP: 4,
    suggestedAsesmen: 'Proyek',
  },
];

export const DEFAULT_IDENTITY: SchoolIdentity = {
  pemerintahDaerah: 'PEMERINTAH KABUPATEN BANDUNG',
  dinasPendidikan: 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA',
  namaSekolah: 'SDN Nusantara Harapan 01',
  npsn: '20104589',
  alamat: 'Jl. Merdeka Pendidikan No. 45, Kec. Sukamaju',
  kotaKabupaten: 'Kabupaten Bandung',
  namaKepalaSekolah: 'Hj. Siti Aminah, S.Pd., M.Pd.',
  nipKepalaSekolah: '19720415 199803 2 004',
  namaGuru: 'Ahmad Fauzi, S.Pd.I.',
  nipGuru: '19890721 201903 1 008',
  fase: 'A',
  kelas: 'Kelas 1 & 2',
  tahunAjaran: '2026/2027',
  tanggalDokumen: '13 Juli 2026',
};

export function getKopInstansiLines(identity: SchoolIdentity): {
  pemerintahDaerah: string;
  dinasPendidikan: string;
} {
  const rawPemda = identity.pemerintahDaerah?.trim();
  const rawKota = identity.kotaKabupaten?.trim();
  const fallbackPemda = rawKota
    ? /^(kota|kabupaten|kab\.)\b/i.test(rawKota)
      ? `PEMERINTAH ${rawKota.toUpperCase()}`
      : `PEMERINTAH KABUPATEN ${rawKota.toUpperCase()}`
    : 'PEMERINTAH KABUPATEN ...';

  const rawDinas = identity.dinasPendidikan?.trim();

  return {
    pemerintahDaerah: (rawPemda || fallbackPemda).toUpperCase(),
    dinasPendidikan: (rawDinas || 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA').toUpperCase(),
  };
}

export function createInitialFaseATPs(): TPItem[] {
  return TP_TEMPLATES.filter((t) => t.cpCode.startsWith('1.')).map((t) => {
    const cp = CP_DATABASE.find((c) => c.code === t.cpCode)!;
    return {
      id: `tp-${t.cpCode}-${t.subIndex}`,
      code: `TP ${t.cpCode}.${t.subIndex}`,
      fase: 'A',
      cpCode: t.cpCode,
      elemen: cp.elemen,
      rumusan: t.rumusan,
      materiPokok: t.materiPokok,
      kko: t.kko,
      dimensiP5: [...t.dimensiP5],
      indikatorMindful: t.indikatorMindful,
      indikatorMeaningful: t.indikatorMeaningful,
      indikatorJoyful: t.indikatorJoyful,
      indikatorRefleksi: t.indikatorRefleksi,
      prereqTag: t.prereqTag,
      orderRank: t.orderRank,
      suggestedSemesterIndex: t.suggestedSemesterIndex,
      suggestedJP: t.suggestedJP,
      suggestedAsesmen: t.suggestedAsesmen,
    };
  });
}
