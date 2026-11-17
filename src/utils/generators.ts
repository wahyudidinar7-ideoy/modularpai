import { CP_DATABASE, DASAR_HUKUM_TEXT, FASE_OPTIONS, TP_TEMPLATES } from '../data/cpDatabase';
import {
  ATPItem,
  CompletenessIssue,
  ElemenName,
  Fase,
  GlosariumItem,
  ModulAjarItem,
  OrderWarning,
  SchoolIdentity,
  TPItem,
} from '../types/curriculum';
import {
  buildStructuredModulPayload,
  extractKelasShort,
  getOfficialDaftarPustaka,
  getOfficialModulModelLabel,
} from './modulContentBuilder';

export function getSemestersForFase(fase: Fase): string[] {
  return FASE_OPTIONS.find((f) => f.value === fase)?.semesters || FASE_OPTIONS[0].semesters;
}

export function inferPrereqTagAndRank(text: string, cpCode: string): { prereqTag: string; orderRank: number } {
  const lower = text.toLowerCase();
  if (/\b(rukun iman)\b/.test(lower)) return { prereqTag: 'rukun_iman', orderRank: 5 };
  if (/\b(huruf hijaiyah berharakat|huruf lepas|fathah|kasrah|dammah)\b/.test(lower))
    return { prereqTag: 'huruf_lepas', orderRank: 10 };
  if (/\b(sukun|tasydid)\b/.test(lower) && !/mad thabi/.test(lower))
    return { prereqTag: 'huruf_sukun_tasydid', orderRank: 10 };
  if (/\b(mad thabi)\b/.test(lower)) return { prereqTag: 'mad_thabii', orderRank: 10 };
  if (/\b(iman kepada allah|wujud|sifat wajib allah)\b/.test(lower))
    return { prereqTag: 'iman_allah', orderRank: 12 };
  if (/\b(rukun islam|syahadat)\b/.test(lower))
    return { prereqTag: 'rukun_islam_syahadat', orderRank: 15 };
  if (/\b(huruf hijaiyah bersambung|bersambung)\b/.test(lower))
    return { prereqTag: 'huruf_sambung', orderRank: 20 };
  if (/\b(al-fatihah|fatihah)\b/.test(lower)) return { prereqTag: 'surah_fatihah', orderRank: 30 };
  if (/\b(bersuci|wudhu|wudu|istinja|najis|hadas)\b/.test(lower))
    return { prereqTag: 'bersuci', orderRank: 35 };
  if (/\b(tayamum)\b/.test(lower)) return { prereqTag: 'tayamum', orderRank: 42 };
  if (/\b(adzan|azan|iqamah)\b/.test(lower)) return { prereqTag: 'adzan_iqamah', orderRank: 44 };
  if (/\b(surah pendek|al-ikhlas|al-ma|at-tin|ad-duha)\b/.test(lower))
    return { prereqTag: 'surah_pendek', orderRank: 45 };
  if (/\b(salat fardu|shalat fardu)\b/.test(lower) && !/berjamaah/.test(lower))
    return { prereqTag: 'salat_fardu', orderRank: 60 };
  if (/\b(berjamaah)\b/.test(lower)) return { prereqTag: 'salat_berjamaah', orderRank: 65 };
  if (/\b(salat sunnah|dhuha|rawatib)\b/.test(lower))
    return { prereqTag: 'salat_sunnah', orderRank: 70 };
  if (/\b(salat jumat|jumat)\b/.test(lower)) return { prereqTag: 'salat_jumat', orderRank: 72 };
  if (/\b(zikir|doa setelah salat|berdoa setelah salat)\b/.test(lower))
    return { prereqTag: 'zikir_doa', orderRank: 78 };
  if (/\b(puasa|ramadan)\b/.test(lower)) return { prereqTag: 'puasa_ramadan', orderRank: 80 };
  if (/\b(zakat)\b/.test(lower)) return { prereqTag: 'zakat_fitrah', orderRank: 84 };
  if (/\b(haji)\b/.test(lower)) return { prereqTag: 'haji_zikir', orderRank: 88 };

  const elemNum = Number(cpCode.split('.')[1] || 1);
  return { prereqTag: `custom_${cpCode}`, orderRank: 50 + elemNum };
}

export function generateTPsForCPs(
  fase: Fase,
  selectedCpCodes: string[],
  existingTps: TPItem[]
): TPItem[] {
  const validCodes = selectedCpCodes.filter((code) =>
    CP_DATABASE.some((cp) => cp.code === code && cp.fase === fase)
  );

  // Keep existing TPs from unselected CPs in the same fase (or manual custom ones if user kept them)
  const keptTps = existingTps.filter(
    (tp) => tp.fase === fase && !validCodes.includes(tp.cpCode)
  );

  const newlyGenerated: TPItem[] = [];
  for (const cpCode of validCodes) {
    const cp = CP_DATABASE.find((c) => c.code === cpCode);
    if (!cp) continue;
    const templates = TP_TEMPLATES.filter((t) => t.cpCode === cpCode);
    for (const tpl of templates) {
      newlyGenerated.push({
        id: `tp-${tpl.cpCode}-${tpl.subIndex}`,
        code: `TP ${tpl.cpCode}.${tpl.subIndex}`,
        fase,
        cpCode: tpl.cpCode,
        elemen: cp.elemen,
        rumusan: tpl.rumusan,
        materiPokok: tpl.materiPokok,
        kko: tpl.kko,
        dimensiP5: [...tpl.dimensiP5],
        indikatorMindful: tpl.indikatorMindful,
        indikatorMeaningful: tpl.indikatorMeaningful,
        indikatorJoyful: tpl.indikatorJoyful,
        indikatorRefleksi: tpl.indikatorRefleksi,
        prereqTag: tpl.prereqTag,
        orderRank: tpl.orderRank,
        suggestedSemesterIndex: tpl.suggestedSemesterIndex,
        suggestedJP: tpl.suggestedJP,
        suggestedAsesmen: tpl.suggestedAsesmen,
      });
    }
  }

  return [...keptTps, ...newlyGenerated].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
}

export function generateATPFromTPs(fase: Fase, tps: TPItem[]): ATPItem[] {
  const semesters = getSemestersForFase(fase);
  const faseTps = tps.filter((t) => t.fase === fase);
  if (faseTps.length === 0) return [];

  // Sort by pedagogical prerequisite orderRank first, then suggestedSemesterIndex, then TP code
  const sorted = [...faseTps].sort((a, b) => {
    if (a.suggestedSemesterIndex !== b.suggestedSemesterIndex) {
      return a.suggestedSemesterIndex - b.suggestedSemesterIndex;
    }
    if (a.orderRank !== b.orderRank) {
      return a.orderRank - b.orderRank;
    }
    return a.code.localeCompare(b.code, undefined, { numeric: true });
  });

  // Enforce global prerequisite ordering even across semesters
  const ordered = enforceGlobalPrerequisites(sorted, semesters);

  return ordered.map((tp, idx) => {
    const semIndex = Math.min(Math.max(tp.suggestedSemesterIndex, 0), semesters.length - 1);
    return {
      id: `atp-${tp.id}`,
      noUrut: idx + 1,
      semester: semesters[semIndex],
      tpId: tp.id,
      kodeTP: tp.code,
      cpCode: tp.cpCode,
      elemen: tp.elemen,
      rumusanTP: tp.rumusan,
      materi: tp.materiPokok,
      alokasiJP: tp.suggestedJP || 4,
      aktivitasMindful: tp.indikatorMindful,
      aktivitasMeaningful: tp.indikatorMeaningful,
      aktivitasJoyful: tp.indikatorJoyful,
      aktivitasRefleksi:
        tp.indikatorRefleksi ||
        'Siswa menyampaikan satu hikmah yang dipelajari dan menuliskan komitmen kebaikan untuk dipraktikkan hari ini.',
      asesmen: tp.suggestedAsesmen || 'Observasi',
      prereqTag: tp.prereqTag,
      orderRank: tp.orderRank,
    };
  });
}

function enforceGlobalPrerequisites(tps: TPItem[], semesters: string[]): TPItem[] {
  // Ensure orderRank strictly guides placement so prerequisites are never after dependents
  const cloned = tps.map((t) => ({ ...t }));
  cloned.sort((a, b) => {
    if (a.orderRank !== b.orderRank) return a.orderRank - b.orderRank;
    return a.suggestedSemesterIndex - b.suggestedSemesterIndex;
  });

  // Re-balance semester indices monotonically so later items never jump backward in semester
  let maxSemSeen = 0;
  for (let i = 0; i < cloned.length; i++) {
    const targetSem = Math.min(Math.max(cloned[i].suggestedSemesterIndex, maxSemSeen), semesters.length - 1);
    cloned[i].suggestedSemesterIndex = targetSem;
    maxSemSeen = targetSem;
  }
  return cloned;
}

function matchesTopic(item: ATPItem, regex: RegExp): boolean {
  return regex.test(`${item.materi} ${item.rumusanTP} ${item.prereqTag}`);
}

export function validateATPOrder(atpList: ATPItem[]): OrderWarning[] {
  const warnings: OrderWarning[] = [];
  if (atpList.length < 2) return warnings;

  const findIndices = (regex: RegExp) =>
    atpList.map((item, idx) => (matchesTopic(item, regex) ? idx : -1)).filter((i) => i !== -1);

  const checkPrereqPair = (
    prereqRegex: RegExp,
    dependentRegex: RegExp,
    messageBuilder: (prereq: ATPItem, dependent: ATPItem) => string
  ) => {
    const prereqIdxs = findIndices(prereqRegex);
    const depIdxs = findIndices(dependentRegex);
    for (const dIdx of depIdxs) {
      for (const pIdx of prereqIdxs) {
        if (dIdx !== pIdx && pIdx > dIdx) {
          const prereq = atpList[pIdx];
          const dependent = atpList[dIdx];
          warnings.push({
            id: `warn-${dependent.id}-${prereq.id}`,
            atpId: dependent.id,
            kodeTP: dependent.kodeTP,
            message: messageBuilder(prereq, dependent),
          });
        }
      }
    }
  };

  // 1. Bersuci/Wudhu harus sebelum Salat
  checkPrereqPair(
    /\b(bersuci|wudhu|wudu|tayamum)\b/i,
    /\b(salat fardu|shalat fardu|salat berjamaah|salat sunnah|salat jumat)\b/i,
    (p, d) => `TP Wudhu/Bersuci (${p.kodeTP}) harus sebelum TP Salat (${d.kodeTP}).`
  );

  // 2. Huruf hijaiyah berharakat (lepas) harus sebelum Huruf bersambung / Surah
  checkPrereqPair(
    /\b(huruf_lepas|huruf hijaiyah berharakat|fathah, kasrah)\b/i,
    /\b(huruf_sambung|huruf hijaiyah bersambung|surah_fatihah|surah al-fatihah|surah pendek)\b/i,
    (p, d) => `TP Huruf Hijaiyah Berharakat (${p.kodeTP}) harus sebelum TP ${d.materi} (${d.kodeTP}).`
  );

  // 3. Huruf sukun & tasydid harus sebelum Kalimat Al-Qur'an
  checkPrereqPair(
    /\b(huruf_sukun_tasydid|huruf hijaiyah berharakat sukun)\b/i,
    /\b(kalimat_alquran|kalimat dalam al-qur)\b/i,
    (p, d) => `TP Sukun & Tasydid (${p.kodeTP}) harus sebelum TP Kalimat Al-Qur'an (${d.kodeTP}).`
  );

  // 4. Salat Fardu harus sebelum Salat Berjamaah / Salat Sunnah / Salat Jumat
  checkPrereqPair(
    /\b(salat_fardu|salat fardu)\b/i,
    /\b(salat_berjamaah|salat_sunnah|salat_jumat|berjamaah|salat jumat)\b/i,
    (p, d) => `TP Salat Fardu (${p.kodeTP}) harus sebelum TP ${d.materi} (${d.kodeTP}).`
  );

  // 5. Salat harus sebelum Zikir & Doa Setelah Salat
  checkPrereqPair(
    /\b(salat_fardu|salat_berjamaah|salat fardu)\b/i,
    /\b(zikir_doa|zikir dan berdoa setelah salat|zikir dan doa setelah salat)\b/i,
    (p, d) => `TP Salat (${p.kodeTP}) harus sebelum TP Zikir & Doa Setelah Salat (${d.kodeTP}).`
  );

  // 6. Rukun Iman harus sebelum Rukun Islam & Syahadatain
  checkPrereqPair(
    /\b(rukun_iman|rukun iman)\b/i,
    /\b(rukun_islam_syahadat|rukun islam & syahadatain)\b/i,
    (p, d) => `TP Rukun Iman (${p.kodeTP}) sebaiknya sebelum TP Rukun Islam & Syahadatain (${d.kodeTP}).`
  );

  // 7. Dakwah Makkah harus sebelum Hijrah Madinah
  checkPrereqPair(
    /\b(sejarah_makkah|periode makkah)\b/i,
    /\b(sejarah_hijrah|sejarah_madinah|hijrah)\b/i,
    (p, d) => `TP Dakwah Makkah (${p.kodeTP}) harus sebelum TP Hijrah/Madinah (${d.kodeTP}).`
  );

  // 8. Semester regression check
  const semesterOrderScore = (sem: string) => {
    const numMatch = sem.match(/\d+/);
    const kelas = numMatch ? Number(numMatch[0]) : 1;
    const isGenap = /genap/i.test(sem) ? 1 : 0;
    return kelas * 2 + isGenap;
  };

  for (let i = 1; i < atpList.length; i++) {
    const prev = atpList[i - 1];
    const curr = atpList[i];
    if (semesterOrderScore(curr.semester) < semesterOrderScore(prev.semester)) {
      warnings.push({
        id: `warn-sem-${curr.id}`,
        atpId: curr.id,
        kodeTP: curr.kodeTP,
        message: `Urutan Semester tidak runtut: ${curr.kodeTP} (${curr.semester}) berada setelah ${prev.kodeTP} (${prev.semester}).`,
      });
    }
  }

  // Deduplicate by message
  const seen = new Set<string>();
  return warnings.filter((w) => {
    if (seen.has(w.message)) return false;
    seen.add(w.message);
    return true;
  });
}

export function autoFixATPOrder(fase: Fase, atpList: ATPItem[]): ATPItem[] {
  const semesters = getSemestersForFase(fase);
  const semIndex = (sem: string) => {
    const idx = semesters.indexOf(sem);
    return idx === -1 ? 0 : idx;
  };

  const sorted = [...atpList].sort((a, b) => {
    if (a.orderRank !== b.orderRank) return a.orderRank - b.orderRank;
    return semIndex(a.semester) - semIndex(b.semester);
  });

  // Keep semester progression monotonic
  let maxSem = 0;
  return sorted.map((item, idx) => {
    const currentSem = semIndex(item.semester);
    const fixedSemIdx = Math.max(currentSem, maxSem);
    maxSem = Math.min(fixedSemIdx, semesters.length - 1);
    return {
      ...item,
      noUrut: idx + 1,
      semester: semesters[maxSem],
    };
  });
}

export function checkCPCompleteness(
  fase: Fase,
  tps: TPItem[],
  atps: ATPItem[]
): CompletenessIssue[] {
  const issues: CompletenessIssue[] = [];
  const faseCps = CP_DATABASE.filter((c) => c.fase === fase);
  const faseTps = tps.filter((t) => t.fase === fase);

  for (const cp of faseCps) {
    const cpTps = faseTps.filter((t) => t.cpCode === cp.code);
    if (cpTps.length === 0) {
      issues.push({
        cpCode: cp.code,
        elemen: cp.elemen,
        type: 'missing-tp',
        message: `CP ${cp.code} (${cp.elemen}) belum dibuat TP-nya.`,
      });
    } else {
      const atpTpIds = new Set(atps.map((a) => a.tpId));
      const missingInAtp = cpTps.filter((t) => !atpTpIds.has(t.id));
      if (missingInAtp.length > 0) {
        issues.push({
          cpCode: cp.code,
          elemen: cp.elemen,
          type: 'missing-atp',
          message: `CP ${cp.code} (${cp.elemen}) memiliki ${missingInAtp.length} TP yang belum masuk ke ATP.`,
        });
      }
    }
  }

  return issues;
}

export function buildIdentitasPenulis(identity: SchoolIdentity): string {
  return `${identity.namaGuru} (NIP. ${identity.nipGuru || '-'}) | ${identity.namaSekolah} (NPSN: ${identity.npsn}) | Tahun Penyusunan ${identity.tahunAjaran}`;
}

export function formatTPsForClipboard(tps: TPItem[], identity: SchoolIdentity): string {
  const header = [
    `TUJUAN PEMBELAJARAN (TP) PAI & BUDI PEKERTI - FASE ${identity.fase} (${identity.kelas})`,
    `${identity.namaSekolah} (NPSN: ${identity.npsn}) | ${identity.kotaKabupaten} | Tahun Ajaran ${identity.tahunAjaran}`,
    `Guru PAI Penyusun: ${identity.namaGuru} (NIP. ${identity.nipGuru || '-'}) | Kepala Sekolah: ${identity.namaKepalaSekolah} (NIP. ${identity.nipKepalaSekolah || '-'})`,
    'Dasar: Kepka BKPDM No. 020 Tahun 2026 (Pembelajaran Mendalam)',
    '='.repeat(72),
    '',
  ].join('\n');

  const body = tps
    .map(
      (tp, i) =>
        `${i + 1}. [${tp.code}] (${tp.elemen} - CP ${tp.cpCode})\n` +
        `   Rumusan TP : ${tp.rumusan}\n` +
        `   Materi     : ${tp.materiPokok} | KKO: ${tp.kko}\n` +
        `   Dimensi P5 : ${tp.dimensiP5.join(', ')}\n` +
        `   Mindful    : ${tp.indikatorMindful}\n` +
        `   Meaningful : ${tp.indikatorMeaningful}\n` +
        `   Joyful     : ${tp.indikatorJoyful}`
    )
    .join('\n\n');

  return header + body;
}

function getSaranaByElemen(elemen: ElemenName, materi: string): string {
  switch (elemen) {
    case "Al-Qur'an Hadis":
      return `Mushaf Al-Qur'an / Buku Iqra, kartu huruf dan kalimat hijaiyah, papan tulis & spidol warna, pelantang suara/audio murattal, serta lembar aktivitas ${materi}.`;
    case 'Aqidah':
      return `Kartu konsep keimanan, poster Asmaulhusna/Rukun Iman, gambar fenomena alam ciptaan Allah Swt., proyektor/papan tempel, dan buku ajar PAI SD.`;
    case 'Akhlak':
      return `Kartu skenario perilaku sehari-hari, papan refleksi syukur kelas, spidol warna, lembar pengamatan sikap, dan buku PAI & Budi Pekerti.`;
    case 'Fiqih':
      return `Poster urutan tata cara ibadah, perlengkapan peraga praktik (sajadah, mukena/sarung, area wudhu sekolah/air bersih), kartu jadwal/hitungan ibadah, dan lembar ceklis praktik.`;
    case 'Sejarah Peradaban Islam':
      return `Kartu lini masa kisah teladan, peta perjalanan sejarah Islam (Makkah–Madinah), media cerita bergambar/boneka tangan, dan buku kisah Nabi & Sahabat.`;
  }
}

function getGlosariumByElemen(elemen: ElemenName, materi: string): GlosariumItem[] {
  const common: GlosariumItem[] = [
    {
      istilah: 'Pembelajaran Mendalam',
      arti: 'Pendekatan belajar yang memadukan kesadaran penuh (mindful), keterkaitan makna kehidupan nyata (meaningful), dan suasana gembira (joyful).',
    },
    {
      istilah: materi,
      arti: 'Pokok bahasan utama dalam modul ajar ini yang bersumber langsung dari CP Kepka BKPDM No. 020 Tahun 2026.',
    },
  ];

  const byElemen: Record<ElemenName, GlosariumItem[]> = {
    "Al-Qur'an Hadis": [
      { istilah: 'Makhraj', arti: 'Tempat keluarnya bunyi huruf hijaiyah dari organ ucap secara tepat.' },
      { istilah: 'Tartil', arti: 'Membaca Al-Qur\'an secara perlahan, jelas, dan sesuai kaidah tajwid.' },
      { istilah: 'Hadis', arti: 'Perkataan, perbuatan, dan ketetapan Nabi Muhammad Saw. sebagai pedoman umat Islam.' },
    ],
    Aqidah: [
      { istilah: 'Iman', arti: 'Keyakinan teguh di dalam hati, diucapkan dengan lisan, dan dibuktikan dengan amal perbuatan.' },
      { istilah: 'Asmaulhusna', arti: 'Nama-nama Allah Swt. yang indah, agung, dan mencerminkan sifat kesempurnaan-Nya.' },
    ],
    Akhlak: [
      { istilah: 'Akhlak Mahmudah', arti: 'Perilaku terpuji yang sesuai tuntunan Al-Qur\'an dan teladan Rasulullah Saw.' },
      { istilah: 'Kalimat Tayyibah', arti: 'Ucapan yang baik untuk menyucikan, memuji, dan mengingat Allah Swt.' },
    ],
    Fiqih: [
      { istilah: 'Thaharah (Bersuci)', arti: 'Menyucikan diri dari hadas dan najis sebagai syarat sah ibadah kepada Allah Swt.' },
      { istilah: 'Rukun', arti: 'Bagian pokok dalam ibadah yang wajib dipenuhi agar ibadah dinyatakan sah.' },
    ],
    'Sejarah Peradaban Islam': [
      { istilah: 'Keteladanan (Uswah)', arti: 'Sikap dan perilaku mulia para nabi, rasul, serta sahabat untuk ditiru dalam kehidupan sehari-hari.' },
      { istilah: 'Hijrah', arti: 'Perpindahan menuju keadaan, tempat, dan kebiasaan hidup yang lebih baik karena Allah Swt.' },
    ],
  };

  return [...byElemen[elemen], ...common];
}

export function generateModulAjarForATPRow(
  identity: SchoolIdentity,
  atp: ATPItem,
  allFaseAtps: ATPItem[],
  tp?: TPItem
): ModulAjarItem {
  const cp = CP_DATABASE.find((c) => c.code === atp.cpCode);
  const cpRedaksi = cp?.redaksi || '';
  const idxInAtp = allFaseAtps.findIndex((a) => a.id === atp.id);
  const prevAtp = idxInAtp > 0 ? allFaseAtps[idxInAtp - 1] : null;

  const kompetensiAwal = prevAtp
    ? `Peserta didik telah memahami materi prasyarat sebelumnya yaitu ${prevAtp.materi} (${prevAtp.kodeTP}) serta memiliki pengetahuan awal tentang ${atp.elemen} dalam keseharian.`
    : `Peserta didik mengenal dasar-dasar ${atp.elemen} dan terbiasa berdoa sebelum belajar sesuai tingkat perkembangan Fase ${identity.fase} (${identity.kelas}).`;

  const dimensiP5 = tp?.dimensiP5?.length
    ? [...tp.dimensiP5]
    : ['Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', 'Mandiri'];

  const modelPembelajaran = getOfficialModulModelLabel(identity.fase);

  const pertanyaanPemantik = [
    `Mengapa kita perlu mempelajari dan mengamalkan ${atp.materi} dengan tepat sesuai ajaran Islam?`,
    `Bagaimana perasaanmu ketika mampu mempraktikkan ${atp.materi} dengan penuh kesadaran dan kesungguhan?`,
    `Bagaimana pengaruh pengamalan ${atp.materi} terhadap kebiasaan baik kita di rumah, sekolah, dan masyarakat?`,
  ];

  const persiapanPembelajaran = [
    `Menyiapkan ruang kelas yang bersih, nyaman, serta menata tempat duduk agar kondusif untuk aktivitas berpasangan maupun kelompok.`,
    `Menyiapkan perangkat ajar (CP ${atp.cpCode}, ${atp.kodeTP}), media belajar untuk materi "${atp.materi}", serta instrumen asesmen ${atp.asesmen}.`,
    `Memastikan peserta didik siap secara fisik dan emosional sebelum memulai aktivitas berkesadaran (Mindful).`,
  ];

  const structured = buildStructuredModulPayload(identity, atp, tp);
  const firstPertemuan = structured.pertemuanList?.[0];

  const kegiatanPendahuluan = firstPertemuan
    ? firstPertemuan.pendahuluan.map((p, i) => `${i + 1}. ${p}`).join('\n')
    : `1. Guru menyapa dengan salam hangat, mengajak berdoa sebelum belajar, dan mengecek kesiapan siswa.\n2. Aktivitas Mindful: ${atp.aktivitasMindful}`;

  const kegiatanInti = firstPertemuan
    ? `TAHAP 1 - MEMAHAMI (Mindful): ${firstPertemuan.tahapMemahami}\n` +
      `TAHAP 2 - MENGAPLIKASI (Meaningful | Metode: ${firstPertemuan.metodeMengaplikasi}): ${firstPertemuan.tahapMengaplikasi}\n` +
      `TAHAP 3 - MEREFLEKSI (Joyful): ${firstPertemuan.tahapMerefleksi}`
    : `1. Aktivitas Meaningful: ${atp.aktivitasMeaningful}\n2. Aktivitas Joyful: ${atp.aktivitasJoyful}`;

  const kegiatanPenutup = firstPertemuan
    ? firstPertemuan.penutup.map((p, i) => `${i + 1}. ${p}`).join('\n')
    : `1. Refleksi: ${atp.aktivitasRefleksi}\n2. Doa penutup majelis dan tindak lanjut pembiasaan di rumah.`;

  const lkpdTugas =
    structured.lkpdPertemuanList?.[0]?.kegiatanTugas || [
      `Amati dan pahami kembali materi "${atp.materi}" bersama teman sebangku atau kelompok kecilmu.`,
      `Tuliskan atau praktikkan 2 contoh penerapan nyata "${atp.materi}" yang dapat dilakukan di rumah dan di sekolah hari ini.`,
      `Ikuti aktivitas kelompok ("${atp.aktivitasJoyful}") dan catat hasil temuan kelompokmu secara jujur.`,
    ];

  return {
    id: `modul-${atp.id}`,
    atpId: atp.id,
    tpId: atp.tpId,
    kodeTP: atp.kodeTP,
    cpCode: atp.cpCode,
    cpRedaksi,
    elemen: atp.elemen,
    fase: identity.fase,
    semester: atp.semester,
    alokasiJP: atp.alokasiJP,
    materiPokok: atp.materi,

    identitasPenulis: buildIdentitasPenulis(identity),
    kompetensiAwal,
    profilPelajarPancasila: dimensiP5,
    saranaPrasarana: getSaranaByElemen(atp.elemen, atp.materi),
    targetPesertaDidik: 'Reguler (Semua Peserta Didik)',
    modelPembelajaran,

    tujuanPembelajaran: `[${atp.kodeTP}] ${atp.rumusanTP}`,
    pemahamanBermakna: `${atp.aktivitasMeaningful} Dengan demikian, pembelajaran ${atp.materi} membentuk karakter beriman, sadar diri, dan bermanfaat bagi sesama.`,
    pertanyaanPemantik,
    persiapanPembelajaran,
    kegiatanPendahuluan,
    kegiatanInti,
    kegiatanPenutup,
    asesmenDiagnostik: `Asesmen Diagnostik (Pre-test): Menanyakan kesiapan peserta didik serta menggali pengetahuan awal terkait ${prevAtp ? prevAtp.materi : atp.materi} melalui pertanyaan pemantik lisan.`,
    asesmenFormatif: `Asesmen Formatif (Selama Proses): Observasi lembar ceklis ketercapaian, penilaian antar teman sebaya, dan jurnal refleksi selama proses memahami serta mengaplikasi.`,
    asesmenSumatif: `Asesmen Sumatif (${atp.asesmen}): Penilaian ketercapaian ${atp.kodeTP} menggunakan soal HOTS dan teknik ${atp.asesmen} pada akhir unit pembelajaran "${atp.materi}".`,
    pengayaan: (structured.pengayaanList || []).join(' '),
    remedial: (structured.remedialList || []).join(' '),
    refleksiPesertaDidik: `${atp.aktivitasRefleksi} Peserta didik menilai pencapaian pemahaman serta pengalaman belajarnya.`,
    refleksiPendidik: (structured.refleksiGuruList || []).join(' '),

    lkpdJudul: `LKPD ${atp.kodeTP} — ${atp.materi}`,
    lkpdPetunjuk: structured.lkpdPertemuanList?.[0]?.petunjukKerja || [
      'Baca petunjuk pengerjaan dengan cermat dan awali dengan Basmalah.',
      'Kerjakan tugas secara individu maupun berkelompok dengan tertib.',
      'Tanyakan kepada guru apabila mengalami kesulitan.',
    ],
    lkpdTugas,
    bahanBacaanPendidik: `Panduan Capaian Pembelajaran PAI dan Budi Pekerti Fase ${identity.fase} (${DASAR_HUKUM_TEXT}), khususnya CP ${atp.cpCode} (${atp.elemen}): "${cpRedaksi}", dilengkapi Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses.`,
    bahanBacaanPesertaDidik: `Ringkasan materi "${atp.materi}" pada Bahan Ajar dan Buku Siswa PAI dan Budi Pekerti ${atp.semester} untuk ${identity.kelas}.`,
    glosarium: getGlosariumByElemen(atp.elemen, atp.materi),
    daftarPustaka: getOfficialDaftarPustaka(identity.kelas),

    ...structured,
  };
}

export function normalizeModulAjar(
  modul: ModulAjarItem,
  identity: SchoolIdentity,
  allFaseAtps: ATPItem[],
  tps: TPItem[]
): ModulAjarItem {
  if (
    modul.pertemuanList &&
    modul.pertemuanList.length > 0 &&
    modul.lkpdPertemuanList &&
    modul.lkpdPertemuanList.length > 0 &&
    modul.bahanAjar &&
    modul.rubrikKonseptual
  ) {
    return modul;
  }
  const matchedAtp: ATPItem = allFaseAtps.find((a) => a.id === modul.atpId) || {
    id: modul.atpId,
    noUrut: 1,
    semester: modul.semester,
    tpId: modul.tpId,
    kodeTP: modul.kodeTP,
    cpCode: modul.cpCode,
    elemen: modul.elemen,
    rumusanTP: modul.tujuanPembelajaran.replace(/^\[[^\]]+\]\s*/, ''),
    materi: modul.materiPokok,
    alokasiJP: modul.alokasiJP || 4,
    aktivitasMindful: 'Peserta didik menenangkan diri sejenak dan membaca basmalah.',
    aktivitasMeaningful: modul.pemahamanBermakna,
    aktivitasJoyful: 'Permainan edukatif dan kerja kelompok kontekstual.',
    aktivitasRefleksi: modul.refleksiPesertaDidik,
    asesmen: 'Observasi',
    prereqTag: 'custom',
    orderRank: 50,
  };
  const tp = tps.find((t) => t.id === matchedAtp.tpId);
  const structured = buildStructuredModulPayload(identity, matchedAtp, tp);
  return {
    ...modul,
    ...structured,
    identitasPenulis: buildIdentitasPenulis(identity),
    targetPesertaDidik: modul.targetPesertaDidik || 'Reguler (Semua Peserta Didik)',
    pertanyaanPemantik:
      modul.pertanyaanPemantik && modul.pertanyaanPemantik.length >= 3
        ? modul.pertanyaanPemantik
        : [
            `Mengapa kita perlu mempelajari dan mengamalkan ${modul.materiPokok} dengan tepat?`,
            ...(modul.pertanyaanPemantik || []),
          ].slice(0, 3),
    daftarPustaka:
      modul.daftarPustaka && modul.daftarPustaka.length >= 4
        ? modul.daftarPustaka
        : getOfficialDaftarPustaka(identity.kelas),
  };
}

export function generateAllModulAjarFromATP(
  identity: SchoolIdentity,
  tps: TPItem[],
  atps: ATPItem[]
): ModulAjarItem[] {
  const tpById = new Map(tps.map((t) => [t.id, t]));
  return atps.map((atp) => generateModulAjarForATPRow(identity, atp, atps, tpById.get(atp.tpId)));
}

export function syncModulWithIdentity(modul: ModulAjarItem, identity: SchoolIdentity): ModulAjarItem {
  const kelasShort = extractKelasShort(modul.semester, identity.kelas);
  return {
    ...modul,
    identitasPenulis: buildIdentitasPenulis(identity),
    jenjangKelas: modul.jenjangKelas || `SD / ${identity.kelas}`,
    lkpdPertemuanList: modul.lkpdPertemuanList?.map((lkpd) => ({
      ...lkpd,
      kelas: kelasShort,
    })),
    bahanBacaanPesertaDidik:
      modul.fase === identity.fase
        ? `Ringkasan materi "${modul.materiPokok}" pada Bahan Ajar dan Buku Siswa PAI dan Budi Pekerti ${modul.semester} untuk ${identity.kelas}.`
        : modul.bahanBacaanPesertaDidik,
    daftarPustaka:
      modul.fase === identity.fase
        ? getOfficialDaftarPustaka(identity.kelas)
        : modul.daftarPustaka,
  };
}

export function formatModulAjarForClipboard(modul: ModulAjarItem, identity: SchoolIdentity): string {
  const kelasLabel = modul.jenjangKelas || `SD / ${identity.kelas}`;
  const alokasiText = modul.alokasiWaktuDetail || `${modul.alokasiJP} JP (@ 35 Menit)`;
  const metodeText = modul.metodePembelajaran || 'Diskusi, Tanya Jawab, Demonstrasi, Ceramah Bermakna';

  const lines: string[] = [
    `RENCANA PEMBELAJARAN MENDALAM`,
    modul.materiPokok,
    `KURIKULUM MERDEKA DEEP LEARNING`,
    `Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses | Kepka BKPDM No. 020 Tahun 2026`,
    `${identity.namaSekolah} (NPSN: ${identity.npsn}) | ${identity.kotaKabupaten}`,
    '='.repeat(72),
    '',
    'BAGIAN 1: INFORMASI UMUM',
    `- Nama Penyusun        : ${identity.namaGuru} (NIP. ${identity.nipGuru || '-'})`,
    `- Satuan Pendidikan    : ${identity.namaSekolah} (NPSN: ${identity.npsn})`,
    `- Jenjang/Kelas        : ${kelasLabel}`,
    `- Fase                 : ${modul.fase}`,
    `- Mata Pelajaran       : Pendidikan Agama Islam dan Budi Pekerti (PAI)`,
    `- Materi Pokok         : ${modul.materiPokok}`,
    `- Alokasi Waktu        : ${alokasiText}`,
    `- Tahun Ajaran/Semester: ${identity.tahunAjaran} / ${modul.semester}`,
    `- Model Pembelajaran   : ${modul.modelPembelajaran}`,
    `- Metode               : ${metodeText}`,
    `- Target Peserta Didik : ${modul.targetPesertaDidik}`,
    '',
    'BAGIAN 2: CAPAIAN PEMBELAJARAN (CP)',
    `FASE ${modul.fase}: ${modul.cpRedaksi}`,
    ...(modul.elemenDikembangkan || []).map((e) => `* ${e.elemen}: ${e.deskripsi}`),
    '',
    'BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP)',
    modul.alurTpRantai || `[${modul.kodeTP}] ${modul.materiPokok}`,
    `Keterkaitan antar TP: ${modul.keterkaitanAntarTp || modul.pemahamanBermakna}`,
    '',
    'BAGIAN 4: TUJUAN PEMBELAJARAN',
    ...(modul.tujuanPembelajaranList || [modul.tujuanPembelajaran]).map((t, i) => `${i + 1}. ${t}`),
    '',
    'BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING)',
    'A. Pertanyaan Esensial:',
    ...modul.pertanyaanPemantik.map((q) => `* ${q}`),
    'B. Konsep Besar (Big Ideas):',
    ...(modul.konsepBesar || []).map((k) => `* ${k.judul}: ${k.deskripsi}`),
    'C. Transfer Goals:',
    ...(modul.transferGoals || []).map((g) => `* ${g}`),
    '',
    'BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334)',
    ...(modul.dimensiProfilLulusan || []).map(
      (d) => `* ${d.dimensi}: ${d.subElemen}. ${d.deskripsi} (Pengalaman: ${d.pengalaman})`
    ),
    '',
    'BAGIAN 7: KEGIATAN PEMBELAJARAN',
    ...(modul.pertemuanList || []).flatMap((p) => [
      `PERTEMUAN ${p.pertemuanKe}: ${p.judul} (${p.jp} × 35 menit)`,
      'PENDAHULUAN (+/- 15 menit):',
      ...p.pendahuluan.map((item, idx) => `${idx + 1}. ${item}`),
      'KEGIATAN INTI:',
      `> TAHAP 1: MEMAHAMI (Mindful) — ${p.tahapMemahami}`,
      `> TAHAP 2: MENGAPLIKASI (Meaningful) [Metode: ${p.metodeMengaplikasi}] — ${p.tahapMengaplikasi}`,
      `> TAHAP 3: MEREFLEKSI (Joyful) — ${p.tahapMerefleksi}`,
      'PENUTUP (+/- 10 menit):',
      ...p.penutup.map((item, idx) => `${idx + 1}. ${item}`),
      '',
    ]),
    'BAGIAN 8: ASESMEN',
    'A. Asesmen Diagnostik (Pre-test):',
    ...(modul.asesmenDiagnostikList || [modul.asesmenDiagnostik]).map((x, i) => `${i + 1}. ${x}`),
    'B. Asesmen Formatif (Proses):',
    ...(modul.asesmenFormatifList || [{ jenis: 'Observasi', keterangan: modul.asesmenFormatif }]).map(
      (x) => `* ${x.jenis}: ${x.keterangan}`
    ),
    'C. Asesmen Sumatif (Akhir):',
    ...(modul.asesmenSumatifHots || [modul.asesmenSumatif]).map((x, i) => `${i + 1}. ${x}`),
    'D. Rubrik Pemahaman Konseptual:',
    ...(modul.rubrikKonseptual || []).map((r) => `- ${r.level}: ${r.deskripsi}`),
    '',
    'BAGIAN 9: PENGAYAAN DAN REMEDIAL',
    'Program Pengayaan:',
    ...(modul.pengayaanList || [modul.pengayaan]).map((x) => `* ${x}`),
    'Program Remedial:',
    ...(modul.remedialList || [modul.remedial]).map((x) => `* ${x}`),
    '',
    'BAGIAN 10: REFLEKSI GURU',
    ...(modul.refleksiGuruList || [modul.refleksiPendidik]).map((x, i) => `${i + 1}. ${x}\n   Jawaban: ..........`),
    '',
    'BAGIAN 11: LAMPIRAN (LKPD, BAHAN AJAR, GLOSARIUM, DAFTAR PUSTAKA)',
    ...(modul.lkpdPertemuanList || []).flatMap((lkpd) => [
      `LKPD PERTEMUAN ${lkpd.pertemuanKe}: ${lkpd.materi} (${lkpd.alokasiWaktu})`,
      ...lkpd.kegiatanTugas.map((t, i) => `  ${i + 1}. ${t}`),
    ]),
    `Rangkuman Bahan Ajar:`,
    ...(modul.bahanAjar?.rangkuman || []).map((r) => `* ${r}`),
    `Glosarium:`,
    ...modul.glosarium.map((g) => `* ${g.istilah}: ${g.arti}`),
  ];

  return lines.join('\n');
}


