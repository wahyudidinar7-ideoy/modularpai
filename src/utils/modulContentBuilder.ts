import { DASAR_HUKUM_TEXT } from '../data/cpDatabase';
import {
  ATPItem,
  BahanAjarStructured,
  DimensiProfilLulusanItem,
  ElemenDikembangkanItem,
  ElemenName,
  GlosariumItem,
  KonsepBesarItem,
  LKPDPertemuanItem,
  ModulAjarItem,
  PertemuanKegiatanItem,
  RubrikKonseptualItem,
  SchoolIdentity,
  TPItem,
} from '../types/curriculum';

export function extractKelasFromSemester(semester: string, fallbackKelas: string): string {
  const m = semester.match(/Kelas\s*\d+/i);
  if (m) return `SD / ${m[0]}`;
  return `SD / ${fallbackKelas}`;
}

export function extractKelasShort(semester: string, fallbackKelas: string): string {
  const m = semester.match(/Kelas\s*(\d+)/i);
  if (m) return m[1];
  return fallbackKelas;
}

export function extractSemesterLabel(semester: string): string {
  if (/ganjil/i.test(semester)) return 'Ganjil';
  if (/genap/i.test(semester)) return 'Genap';
  return semester;
}

export function computePertemuanSplit(alokasiJP: number): {
  jumlahPertemuan: number;
  jpPerPertemuan: number[];
  alokasiText: string;
} {
  const jp = Math.max(2, Number(alokasiJP) || 4);
  if (jp >= 6 && jp % 2 === 0) {
    const per = jp / 2;
    return {
      jumlahPertemuan: 2,
      jpPerPertemuan: [per, per],
      alokasiText: `2 Pertemuan × ${per} JP = ${jp} JP (@ 35 Menit)`,
    };
  }
  if (jp === 4) {
    return {
      jumlahPertemuan: 2,
      jpPerPertemuan: [2, 2],
      alokasiText: `2 Pertemuan × 2 JP = 4 JP (@ 35 Menit)`,
    };
  }
  if (jp > 4) {
    const p1 = Math.ceil(jp / 2);
    const p2 = jp - p1;
    return {
      jumlahPertemuan: 2,
      jpPerPertemuan: [p1, p2],
      alokasiText: `2 Pertemuan (${p1} JP + ${p2} JP) = ${jp} JP (@ 35 Menit)`,
    };
  }
  return {
    jumlahPertemuan: 1,
    jpPerPertemuan: [jp],
    alokasiText: `1 Pertemuan × ${jp} JP = ${jp} JP (@ 35 Menit)`,
  };
}

function getMetodeByElemen(elemen: ElemenName): string {
  switch (elemen) {
    case "Al-Qur'an Hadis":
      return 'Diskusi, Tanya Jawab, Demonstrasi Pelafalan, Talaqqi, Permainan Edukatif, Ceramah Bermakna';
    case 'Aqidah':
      return 'Diskusi, Tanya Jawab, Observasi Alam, Pemetaan Konsep, Ceramah Bermakna';
    case 'Akhlak':
      return 'Diskusi, Bermain Peran (Role Play), Studi Kasus Mini, Refleksi Diri, Ceramah Bermakna';
    case 'Fiqih':
      return 'Demonstrasi Praktik Ibadah, Diskusi, Tanya Jawab, Simulasi Terbimbing, Ceramah Bermakna';
    case 'Sejarah Peradaban Islam':
      return 'Bercerita Interaktif (Storytelling), Diskusi Kelompok, Lini Masa, Bermain Peran, Ceramah Bermakna';
  }
}

function getModelDetail(fase: string): string {
  if (fase === 'A') return 'Discovery Learning (Penemuan Terbimbing) dan Pembelajaran Bermain Bermakna';
  if (fase === 'B') return 'Discovery Learning (Penemuan Terbimbing) dan Pembelajaran Kooperatif Kontekstual';
  return 'Problem-Based Learning (Pembelajaran Berbasis Masalah) dan Proyek Kolaboratif Mendalam';
}

function getElemenDikembangkan(atp: ATPItem): ElemenDikembangkanItem[] {
  const map: Record<ElemenName, ElemenDikembangkanItem[]> = {
    "Al-Qur'an Hadis": [
      {
        elemen: "Al-Qur'an dan Hadis",
        deskripsi: `Peserta didik mampu memahami dan mempraktikkan materi ${atp.materi} secara benar, fasih, dan tartil sesuai kaidah yang berlaku.`,
      },
      {
        elemen: 'Akidah dan Akhlak',
        deskripsi: `Menumbuhkan kecintaan kepada Al-Qur'an dan Sunnah Rasulullah Saw. sebagai pedoman hidup serta wujud cinta kepada Allah Swt. (Hubbullah).`,
      },
    ],
    Aqidah: [
      {
        elemen: 'Aqidah',
        deskripsi: `Peserta didik memahami dan meyakini pokok keimanan terkait ${atp.materi} dengan penalaran yang sesuai tahap perkembangannya.`,
      },
      {
        elemen: 'Akhlak',
        deskripsi: `Mewujudkan keyakinan iman dalam perilaku jujur, tawaduk, dan bersyukur kepada Allah Swt. dalam kehidupan sehari-hari.`,
      },
    ],
    Akhlak: [
      {
        elemen: 'Akhlak',
        deskripsi: `Peserta didik membiasakan perilaku terpuji pada materi ${atp.materi} secara sadar dan konsisten di lingkungan sekolah maupun rumah.`,
      },
      {
        elemen: 'Aqidah',
        deskripsi: `Menghayati setiap akhlak mulia sebagai bentuk ketakwaan dan keikhlasan semata-mata mengharap rida Allah Swt.`,
      },
    ],
    Fiqih: [
      {
        elemen: 'Fiqih',
        deskripsi: `Peserta didik memahami syarat, rukun, serta mempraktikkan tata cara ibadah ${atp.materi} secara tertib dan sah.`,
      },
      {
        elemen: 'Akhlak',
        deskripsi: `Membiasakan kedisiplinan, kesucian lahir batin, dan kekhusyukan dalam melaksanakan ibadah kepada Allah Swt.`,
      },
    ],
    'Sejarah Peradaban Islam': [
      {
        elemen: 'Sejarah Peradaban Islam',
        deskripsi: `Peserta didik mengenal rangkaian peristiwa dan nilai keteladanan pada materi ${atp.materi} secara runtut.`,
      },
      {
        elemen: 'Akhlak',
        deskripsi: `Mengambil ibrah dan meneladani sifat mulia para nabi, rasul, serta sahabat dalam pergaulan sehari-hari.`,
      },
    ],
  };
  return map[atp.elemen];
}

function getAlurRantaiAndKeterkaitan(atp: ATPItem): {
  rantai: string;
  keterkaitan: string;
} {
  const m = atp.materi;
  if (/huruf hijaiyah berharakat/i.test(m)) {
    return {
      rantai:
        'TP-1 (Mengenal Bentuk Huruf) → TP-2 (Makharijul Huruf Dasar) → TP-3 (Harakat Fathah, Kasrah, Dammah) → TP-4 (Praktik Membaca Berharakat)',
      keterkaitan:
        'Pembelajaran dimulai dari pengenalan bentuk visual huruf hijaiyah, kemudian cara membunyikannya secara tepat sesuai tempat keluarnya suara (makhraj), pemberian tanda baca (harakat), hingga kemampuan mengombinasikan keduanya dalam bacaan sederhana sebagai fondasi mencintai Al-Qur\'an.',
    };
  }
  return {
    rantai: `TP-1 (Mengenal Konsep ${m}) → TP-2 (Memahami Makna & Kaidah ${m}) → TP-3 (Menerapkan ${m} dalam Praktik) → TP-4 (Membiasakan Sikap Terpuji Terkait ${m})`,
    keterkaitan: `Pembelajaran berawal dari pengenalan konsep dasar ${m}, dilanjutkan pendalaman makna serta hubungan sebab-akibatnya dalam ajaran Islam, penerapan melalui demonstrasi/simulasi terbimbing, hingga internalisasi nilai keimanan dan akhlak mulia dalam kehidupan sehari-hari.`,
  };
}

function getTujuanPembelajaranList(atp: ATPItem, tp?: TPItem): string[] {
  const m = atp.materi;
  const kko = tp?.kko || 'Memahami dan Menerapkan';
  return [
    `Melalui kegiatan pengamatan media ajar dan tanya jawab terbimbing, peserta didik mampu mengidentifikasi pokok materi ${m} (${kko}) secara mandiri dengan benar. (C1 - Surface Learning)`,
    `Melalui diskusi dan demonstrasi kontekstual (${atp.aktivitasMeaningful}), peserta didik mampu menjelaskan makna, urutan, atau perbedaan unsur penting pada ${m} dengan tepat. (C2 - Deep Learning)`,
    `Melalui aktivitas kolaboratif (${atp.aktivitasJoyful}), peserta didik mampu mempraktikkan atau menerapkan ${m} dalam situasi nyata di sekolah dan rumah dengan lancar. (C3 - Transfer Learning)`,
    `Melalui refleksi kesadaran penuh dan pembiasaan nilai, peserta didik mampu menunjukkan sikap cinta ajaran Islam, disiplin, dan santun sebagai wujud pengamalan ${m} dalam kehidupan sehari-hari. (A3 - Deep Learning)`,
  ];
}

function getKonsepBesar(atp: ATPItem): KonsepBesarItem[] {
  const m = atp.materi;
  switch (atp.elemen) {
    case "Al-Qur'an Hadis":
      return [
        {
          judul: 'Ketepatan (Ihsan)',
          deskripsi: `Mempelajari dan melafalkan ${m} dengan benar merupakan bentuk penghormatan serta wujud cinta seorang muslim kepada firman Allah Swt. dan sunnah Rasul-Nya.`,
        },
        {
          judul: 'Sistem Makna dan Tanda',
          deskripsi: `Setiap huruf, harakat, ayat, maupun kalimat hadis mengandung pesan petunjuk yang terjaga maknanya apabila dibaca dan diamalkan sesuai kaidah.`,
        },
        {
          judul: 'Identitas Muslim Pembelajar',
          deskripsi: `Kefasihan berinteraksi dengan ${m} menjadi kunci utama untuk memperdalam ajaran agama Islam serta menuntun ibadah harian agar lebih khusyuk.`,
        },
      ];
    case 'Aqidah':
      return [
        {
          judul: 'Tauhid sebagai Fondasi Hidup',
          deskripsi: `Memahami ${m} menanamkan keyakinan yang kokoh bahwa segala sesuatu di alam semesta berada dalam kekuasaan dan kasih sayang Allah Swt.`,
        },
        {
          judul: 'Keterkaitan Iman dan Perilaku',
          deskripsi: `Keyakinan batin pada ${m} tidak berhenti pada hafalan semata, melainkan tercermin pada kejujuran, rasa syukur, dan tanggung jawab anak saleh.`,
        },
        {
          judul: 'Ketenangan Jiwa (Mutmainnah)',
          deskripsi: `Kesadaran beriman memberikan rasa aman, optimistis, dan percaya diri ketika menghadapi berbagai tantangan belajar maupun pergaulan.`,
        },
      ];
    case 'Akhlak':
      return [
        {
          judul: 'Adab Mendahului Ilmu',
          deskripsi: `Pembiasaan ${m} mencerminkan kemuliaan pribadi seorang penuntut ilmu yang menghargai Allah Swt., diri sendiri, dan sesama makhluk.`,
        },
        {
          judul: 'Konsistensi Kebaikan (Istiqamah)',
          deskripsi: `Akhlak terpuji dibangun melalui latihan sadar setiap hari dari hal-hal kecil di rumah, kelas, dan lingkungan bermain.`,
        },
        {
          judul: 'Rahmat bagi Lingkungan',
          deskripsi: `Perilaku santun dan kasih sayang menebarkan kedamaian sehingga teman dan keluarga merasa nyaman berada di dekat kita.`,
        },
      ];
    case 'Fiqih':
      return [
        {
          judul: 'Tertib Syariat dan Keabsahan Ibadah',
          deskripsi: `Pelaksanaan ${m} yang sesuai syarat dan rukun menjadikan ibadah sah, teratur, dan diterima oleh Allah Swt.`,
        },
        {
          judul: 'Ibadah Membentuk Disiplin',
          deskripsi: `Setiap tata cara ibadah dalam Islam melatih kebersihan jasmani, ketepatan waktu, serta pengendalian diri peserta didik.`,
        },
        {
          judul: 'Kemudahan dan Kasih Sayang Syariat',
          deskripsi: `Ajaran fikih disusun agar mudah diamalkan secara bertahap dan selaras dengan kemampuan peserta didik dalam kehidupan nyata.`,
        },
      ];
    case 'Sejarah Peradaban Islam':
      return [
        {
          judul: 'Kisah sebagai Cermin Teladan (Uswah)',
          deskripsi: `Sejarah dalam ${m} bukan sekadar dongeng masa lalu, melainkan pedoman sikap berani, sabar, jujur, dan taat kepada Allah Swt.`,
        },
        {
          judul: 'Perjuangan Membutuhkan Kesabaran',
          deskripsi: `Keberhasilan dakwah para nabi, rasul, dan sahabat lahir dari ketekunan, doa, dan kerja sama menghadapi ujian.`,
        },
        {
          judul: 'Melanjutkan Nilai Keteladanan',
          deskripsi: `Peserta didik dapat menghidupkan akhlak tokoh teladan Islam dalam peran kecilnya sebagai pelajar di sekolah maupun anak di rumah.`,
        },
      ];
  }
}

function getTransferGoals(atp: ATPItem): string[] {
  const m = atp.materi;
  return [
    `Peserta didik mampu mempraktikkan pemahaman ${m} secara mandiri dalam rutinitas ibadah dan adab harian di rumah maupun masjid.`,
    `Peserta didik mampu membagikan atau mengajarkan kembali inti pelajaran ${m} dengan santun kepada adik, teman sebaya, atau anggota keluarga.`,
    `Peserta didik memiliki kebiasaan rutin mengaitkan sikap sehari-hari dengan nilai ${m} tanpa harus selalu diingatkan oleh guru atau orang tua.`,
  ];
}

function getDimensiProfilLulusan(atp: ATPItem): DimensiProfilLulusanItem[] {
  const m = atp.materi;
  return [
    {
      dimensi: 'Keimanan dan Ketakwaan',
      subElemen: 'Pelaksanaan Ritual Ibadah dan Penghayatan Nilai Agama',
      deskripsi: `Peserta didik menyadari bahwa mempelajari serta mengamalkan ${m} adalah bagian dari ibadah dan bukti cinta kepada Allah Swt. (Hubbullah).`,
      pengalaman: 'Memahami dan Merefleksi',
    },
    {
      dimensi: 'Penalaran Kritis',
      subElemen: 'Mengidentifikasi dan Mengolah Informasi',
      deskripsi: `Peserta didik mampu membedakan konsep benar dan keliru serta menemukan makna kehidupan nyata dari materi ${m}.`,
      pengalaman: 'Memahami',
    },
    {
      dimensi: 'Kreativitas',
      subElemen: 'Menghasilkan Gagasan dan Karya Orisinal',
      deskripsi: `Peserta didik mengekspresikan pemahaman ${m} melalui media visual, kartu belajar, praktik demonstrasi, atau catatan kreatif.`,
      pengalaman: 'Mengaplikasi',
    },
    {
      dimensi: 'Kolaborasi',
      subElemen: 'Kerja Sama dan Kepedulian Kelompok',
      deskripsi: `Peserta didik bekerja sama secara santun bersama pasangan atau kelompok dalam aktivitas permainan edukatif (${atp.aktivitasJoyful}).`,
      pengalaman: 'Mengaplikasi',
    },
    {
      dimensi: 'Kemandirian',
      subElemen: 'Regulasi Diri dan Tanggung Jawab Belajar',
      deskripsi: `Peserta didik secara sadar melatih dan membiasakan pengamalan ${m} di rumah dengan penuh kesungguhan dan rasa tanggung jawab.`,
      pengalaman: 'Merefleksi',
    },
  ];
}

function getPertemuanList(atp: ATPItem): PertemuanKegiatanItem[] {
  const split = computePertemuanSplit(atp.alokasiJP);
  const m = atp.materi;

  const p1: PertemuanKegiatanItem = {
    pertemuanKe: 1,
    judul: `Mengenal dan Memahami Makna ${m}`,
    jp: split.jpPerPertemuan[0],
    pendahuluan: [
      'Guru membuka kelas dengan salam hangat, menanyakan kabar, serta mengajak peserta didik membaca doa belajar (Rabbi zidni ilma) dengan khusyuk.',
      `Absensi Berkesadaran (Mindful): ${atp.aktivitasMindful}`,
      `CONNECTING: Guru mengaitkan materi ${m} dengan pengalaman harian peserta didik di rumah dan lingkungan sekitar.`,
      `ESSENTIAL QUESTION: "Mengapa kita perlu memahami ${m} dengan benar dan bagaimana manfaatnya dalam kehidupan kita sehari-hari?"`,
      `Penyampaian Tujuan: Guru menyampaikan tujuan pembelajaran (${atp.kodeTP}) dan rangkaian kegiatan menyenangkan hari ini.`,
    ],
    tahapMemahami: `Peserta didik mengamati media pembelajaran (poster/kartu konsep/tayangan) terkait ${m}. Guru memandu pemahaman konsep inti secara perlahan, kemudian mengajak peserta didik berhenti sejenak selama 10 detik untuk membayangkan penerapan ${m} dengan penuh kesadaran.`,
    metodeMengaplikasi: 'Demonstrasi Terbimbing dan Eksplorasi Berpasangan',
    tahapMengaplikasi: `${atp.aktivitasMeaningful} Peserta didik berlatih mengidentifikasi komponen utama ${m} secara berpasangan sementara guru berkeliling memberikan umpan balik yang membangun.`,
    tahapMerefleksi: `Peserta didik saling menyimak hasil temuan teman (Peer Review). Guru mengajukan pertanyaan reflektif: "Bagian mana dari ${m} yang paling berkesan bagi kalian hari ini dan mengapa?"`,
    penutup: [
      `EXIT TICKET: Peserta didik menyebutkan satu poin penting mengenai ${m} secara lisan atau menuliskannya pada kertas kecil sebelum keluar kelas.`,
      `REFLEKSI: ${atp.aktivitasRefleksi}`,
      `TRANSFER CHALLENGE & DOA: Peserta didik ditantang mempraktikkan atau menceritakan kembali inti ${m} kepada orang tua di rumah, ditutup dengan hamdalah dan doa kafaratul majelis.`,
    ],
  };

  if (split.jumlahPertemuan === 1) {
    return [
      {
        ...p1,
        judul: `Pendalaman, Praktik, dan Refleksi ${m}`,
        tahapMengaplikasi: `${atp.aktivitasMeaningful} Dilanjutkan aktivitas kelompok: ${atp.aktivitasJoyful} dengan bimbingan guru.`,
      },
    ];
  }

  const p2: PertemuanKegiatanItem = {
    pertemuanKe: 2,
    judul: `Aplikasi Nyata, Kolaborasi, dan Selebrasi ${m}`,
    jp: split.jpPerPertemuan[1],
    pendahuluan: [
      'Guru membuka pertemuan dengan salam ceria, doa sebelum belajar, serta mengulas kembali capaian pada Pertemuan 1.',
      `Absensi Berkesadaran (Mindful): Guru mengajak peserta didik menarik napas tenang dan mengingat kembali komitmen kebaikan tentang ${m}.`,
      `CONNECTING: Guru menanyakan pengalaman peserta didik saat mengerjakan Transfer Challenge bersama keluarga di rumah.`,
      `ESSENTIAL QUESTION: "Bagaimana cara terbaik menunjukkan pengamalan ${m} agar mendatangkan kebaikan bagi diri sendiri dan sesama?"`,
      `Penyampaian Tujuan: Hari ini peserta didik akan memperdalam keterampilan praktik ${m} melalui permainan kolaboratif dan unjuk karya.`,
    ],
    tahapMemahami: `Tadabbur singkat: Guru menegaskan nilai keutamaan (ihsan dan pahala) di balik pengamalan ${m} yang dilakukan secara tulus karena Allah Swt. Peserta didik merenungkan keterkaitan materi dengan adab sehari-hari.`,
    metodeMengaplikasi: 'Permainan Edukatif Kolaboratif dan Unjuk Praktik Kelompok',
    tahapMengaplikasi: `${atp.aktivitasJoyful} Setiap kelompok mempraktikkan atau mempresentasikan hasil kerja terkait ${m} sesuai instrumen asesmen (${atp.asesmen}) dengan pendampingan aktif guru.`,
    tahapMerefleksi: `Self-Assessment & Muhasabah: Peserta didik menilai tingkat pemahamannya (Sangat Baik / Cukup / Perlu Berlatih Lagi) serta menuliskan satu tekad kebaikan terkait ${m}.`,
    penutup: [
      `ASESMEN SUMATIF SINGKAT: Guru melakukan pengecekan ketercapaian ${atp.kodeTP} melalui teknik ${atp.asesmen}.`,
      `DOA PENUTUP: Guru dan peserta didik melafalkan hamdalah serta doa penutup majelis dengan tertib.`,
      `TRANSFER CHALLENGE: Peserta didik membiasakan pengamalan ${m} secara rutin setiap hari di rumah dengan pantauan orang tua.`,
    ],
  };

  return [p1, p2];
}

function getRubrikKonseptual(atp: ATPItem): RubrikKonseptualItem[] {
  const m = atp.materi;
  return [
    {
      level: 'Transfer (4)',
      deskripsi: `Mampu memahami, mempraktikkan ${m} secara sempurna dan mandiri, serta mengaitkan alasan maknawinya dalam situasi kehidupan nyata baru.`,
    },
    {
      level: 'Deep (3)',
      deskripsi: `Memahami konsep pokok dan nilai penting ${m} secara utuh serta mampu membedakan penerapan yang tepat dan keliru tanpa bantuan penuh.`,
    },
    {
      level: 'Surface (2)',
      deskripsi: `Mampu mengingat istilah atau urutan dasar ${m}, namun masih sesekali tertukar saat diminta menjelaskan alasan maupun mempraktikkannya.`,
    },
    {
      level: 'Pre (1)',
      deskripsi: `Belum mengenal konsep dasar ${m} secara konsisten sehingga memerlukan bimbingan intensif dan contoh konkret bertahap.`,
    },
  ];
}

function getLkpdPertemuanList(
  atp: ATPItem,
  identity: SchoolIdentity,
  pertemuans: PertemuanKegiatanItem[]
): LKPDPertemuanItem[] {
  const kelasShort = extractKelasShort(atp.semester, identity.kelas);
  const m = atp.materi;

  const isHijaiyahDasar = /huruf hijaiyah berharakat/i.test(m);
  const isSukunTasydid = /sukun|tasydid|mad thabi/i.test(m);
  const isFiqih = atp.elemen === 'Fiqih';
  const isAqidah = atp.elemen === 'Aqidah';
  const isSpi = atp.elemen === 'Sejarah Peradaban Islam';

  return pertemuans.map((p) => {
    let tabelHeaders = ['No.', 'Aspek / Butir Kegiatan ' + m, 'Hasil Pengamatan / Praktik', 'Status (Sudah / Perlu Latihan)'];
    let tabelRows: string[][] = [
      ['1', `Konsep dasar dan pengertian ${m}`, '', ''],
      ['2', `Contoh penerapan ${m} di sekolah`, '', ''],
      ['3', `Contoh penerapan ${m} di rumah`, '', ''],
    ];

    if (isHijaiyahDasar && p.pertemuanKe === 1) {
      tabelHeaders = ['Huruf 1', 'Huruf 2', 'Huruf 3', 'Huruf 4', 'Huruf 5'];
      tabelRows = [
        ['ا (Alif)', 'ب (Ba)', 'ت (Ta)', 'ث (Tsa)', 'ج (Jim)'],
        ['ح (Ha)', 'خ (Kha)', 'د (Dal)', 'ذ (Dzal)', 'ر (Ra)'],
      ];
    } else if (isHijaiyahDasar && p.pertemuanKe >= 2) {
      tabelHeaders = ['Huruf', 'Fathah (a)', 'Kasrah (i)', 'Dammah (u)'];
      tabelRows = [
        ['ب', 'بَ (Ba)', 'بِ (Bi)', 'بُ (Bu)'],
        ['ت', 'تَ (....)', 'تِ (....)', 'تُ (....)'],
        ['ج', 'جَ (....)', 'جِ (....)', 'جُ (....)'],
      ];
    } else if (isSukunTasydid) {
      tabelHeaders = ['No.', 'Contoh Kata / Kalimat Al-Qur\'an', 'Tanda Baca yang Ditemukan', 'Penilaian Teman (Fasihi / Berlatih)'];
      tabelRows = [
        ['1', 'قُلْ هُوَ اللّٰهُ', 'Sukun dan Tasydid', ''],
        ['2', 'إِيَّاكَ نَعْبُدُ', 'Tasydid dan Mad', ''],
        ['3', 'مَالِكِ يَوْمِ الدِّيْنِ', 'Mad dan Tasydid', ''],
      ];
    } else if (isFiqih) {
      tabelHeaders = ['No.', `Tahapan / Rukun ${m}`, 'Keterangan Pelaksanaan', 'Ceklis Praktik (Ya/Belum)'];
      tabelRows = [
        ['1', `Niat dan kesiapan diri sebelum ${m}`, 'Dilakukan dengan sadar dan tertib', ''],
        ['2', `Urutan rukun pokok ${m}`, 'Sesuai tuntunan syariat Islam', ''],
        ['3', `Tertib dan doa penutup`, 'Dilaksanakan dengan khusyuk', ''],
      ];
    } else if (isAqidah) {
      tabelHeaders = ['No.', `Pokok Keyakinan (${m})`, 'Makna Singkat', 'Contoh Sikap Nyata Sehari-hari'];
      tabelRows = [
        ['1', 'Bukti keyakinan dalam hati', 'Meyakini kebenaran ajaran Islam', ''],
        ['2', 'Ucapan yang mencerminkan iman', 'Membiasakan kalimat tayyibah', ''],
        ['3', 'Perbuatan nyata anak saleh', 'Jujur, patuh, dan gemar berbagi', ''],
      ];
    } else if (isSpi) {
      tabelHeaders = ['No.', `Peristiwa / Sikap Teladan (${m})`, 'Nilai Kebaikan yang Dipetik', 'Rencana Peneladanan di Rumah/Sekolah'];
      tabelRows = [
        ['1', 'Kesabaran dan keteguhan iman', 'Tidak mudah menyerah saat belajar', ''],
        ['2', 'Kejujuran dan amanah', 'Selalu berkata benar kepada teman', ''],
        ['3', 'Kasih sayang dan tanggung jawab', 'Membantu orang tua dan teman', ''],
      ];
    }

    return {
      pertemuanKe: p.pertemuanKe,
      mataPelajaran: 'Pendidikan Agama Islam dan Budi Pekerti (PAI)',
      kelas: kelasShort,
      materi: p.pertemuanKe === 1 ? `${m} — Pemahaman Konsep Dasar` : `${m} — Praktik dan Pengamalan`,
      alokasiWaktu: `${p.jp} × 35 menit`,
      kompetensi: [
        `Mengidentifikasi dan menjelaskan konsep inti ${m} (${atp.kodeTP}) secara runtut dan tepat.`,
        `Menunjukkan sikap percaya diri, santun, dan bertanggung jawab saat mempraktikkan ${m}.`,
      ],
      tujuan:
        p.pertemuanKe === 1
          ? `Peserta didik mampu mengenali, menjelaskan, serta memberi contoh dasar terkait ${m} dengan benar.`
          : `Peserta didik mampu mempraktikkan dan mengaitkan nilai ${m} dalam kehidupan sehari-hari bersama kelompok maupun mandiri.`,
      petunjukKerja: [
        'Awali pengerjaan dengan membaca Basmalah dan duduk dengan tenang.',
        'Bacalah setiap instruksi tugas secara cermat bersama teman atau secara mandiri.',
        'Tanyakan kepada guru apabila terdapat langkah atau istilah yang belum dipahami.',
        'Kumpulkan hasil lembar kerja tepat waktu dengan rapi dan jujur.',
      ],
      kegiatanTugas:
        p.pertemuanKe === 1
          ? [
              `Eksplorasi Konsep: Amati media pembelajaran mengenai ${m}, lalu tuliskan 2 poin penting yang paling kamu pahami.`,
              `Diskusi Berpasangan: Lengkapi Tabel Kerja di bawah ini bersama teman sebangku dengan saling menghargai pendapat.`,
              `Praktik Sederhana: Sampaikan secara lisan satu contoh penerapan ${m} di lingkungan sekolah atau rumah.`,
            ]
          : [
              `Demonstrasi dan Kolaborasi: Ikuti kegiatan "${atp.aktivitasJoyful}" bersama kelompokmu secara tertib dan gembira.`,
              `Pengisian Tabel Evaluasi: Catat hasil praktik atau pengamatan pada Tabel Kerja di bawah ini secara jujur.`,
              `Komitmen Pribadi: Tuliskan satu kebiasaan baik terkait ${m} yang akan kamu lakukan mulai hari ini di rumah.`,
            ],
      tabelKerjaHeaders: tabelHeaders,
      tabelKerjaRows: tabelRows,
      pertanyaanRefleksi: [
        'Apa hal paling penting yang sudah kamu pelajari pada pertemuan hari ini?',
        'Bagian mana dari materi ini yang masih terasa sulit dan perlu latihan lagi?',
        'Bagaimana caramu mengamalkan pembelajaran hari ini di rumah bersama keluarga?',
      ],
    };
  });
}

function getBahanAjar(atp: ATPItem): BahanAjarStructured {
  const m = atp.materi;
  const isHijaiyahDasar = /huruf hijaiyah berharakat/i.test(m);

  if (isHijaiyahDasar) {
    return {
      ringkasanIntro:
        'Pada materi ini peserta didik mempelajari cara membaca Al-Qur\'an dengan benar melalui pengenalan tempat keluarnya bunyi huruf (Makharijul Huruf) serta tanda baca vokal dasar (Harakat) pada huruf hijaiyah.',
      definisiPenting: [
        {
          istilah: 'Makharijul Huruf',
          arti: 'Tempat keluarnya bunyi huruf hijaiyah dari organ ucap (bibir, lidah, tenggorokan) saat dilafalkan.',
        },
        {
          istilah: 'Harakat',
          arti: 'Tanda baca yang memberikan bunyi vokal dasar (a, i, u) pada huruf hijaiyah agar dapat dibaca.',
        },
      ],
      ringkasanPenutup:
        'Ketepatan makhraj dan harakat menjaga kemurnian bunyi serta makna ayat suci Al-Qur\'an sebagaimana mulut ibarat alat musik yang menghasilkan suara merdu apabila dibunyikan pada posisi yang benar.',
      petaKonsepTop: 'BELAJAR HURUF HIJAIYAH BERHARAKAT',
      petaKonsepCabang: [
        {
          judul: 'Makharijul Huruf',
          subjudul: '(Tempat Bunyi Keluar)',
          poin: 'Dua Bibir (Asy-Syafatain) | Lidah (Al-Lisan) | Tenggorokan (Al-Halq)',
        },
        {
          judul: 'Harakat Dasar',
          subjudul: '(Tanda Baca Vokal)',
          poin: 'Fathah (a) | Kasrah (i) | Dammah (u)',
        },
      ],
      materiInti: [
        {
          judul: 'A. Mengenal Makharijul Huruf (Tempat Keluar Huruf)',
          uraian: 'Setiap huruf hijaiyah memiliki tempat keluar suara yang khas agar bunyinya jelas dan tidak tertukar:',
          poin: [
            'Asy-Syafatain (Dua Bibir): Huruf yang keluar dengan mengatupkan atau menggerakkan bibir, misalnya Ba (ب), Mim (م), Wau (و), dan Fa (ف).',
            'Al-Halq (Tenggorokan): Huruf yang keluar dari pangkal hingga ujung tenggorokan, misalnya Hamzah (أ), Ha (هـ), \'Ain (ع), dan Ha (ح).',
            'Al-Lisan (Lidah): Huruf yang keluar melalui gerak lidah menyentuh gigi atau langit-langit, misalnya Ta (ت), Dal (د), dan Nun (ن).',
          ],
        },
        {
          judul: 'B. Huruf Hijaiyah Berharakat Dasar',
          uraian: 'Huruf hijaiyah memerlukan harakat agar dapat dibunyikan menjadi vokal a, i, atau u:',
          poin: [
            'Fathah (garis miring di atas huruf): menghasilkan bunyi vokal "a". Contoh: بَ dibaca Ba.',
            'Kasrah (garis miring di bawah huruf): menghasilkan bunyi vokal "i". Contoh: بِ dibaca Bi.',
            'Dammah (tanda seperti wau kecil di atas huruf): menghasilkan bunyi vokal "u". Contoh: بُ dibaca Bu.',
          ],
        },
      ],
      tabelContohHeaders: ['Huruf', 'Fathah (a)', 'Kasrah (i)', 'Dammah (u)'],
      tabelContohRows: [
        ['Alif (أ)', 'أَ (A)', 'إِ (I)', 'أُ (U)'],
        ['Ra (ر)', 'رَ (Ra)', 'رِ (Ri)', 'رُ (Ru)'],
        ['Sa (س)', 'سَ (Sa)', 'سِ (Si)', 'سُ (Su)'],
      ],
      contohSoal: [
        {
          pertanyaan: 'Manakah huruf di bawah ini yang makhrajnya keluar dari dua bibir?',
          opsi: ['a. Alif (أ)', 'b. Ba (ب)', 'c. \'Ain (ع)'],
          pembahasan: 'Huruf Alif dan \'Ain keluar dari tenggorokan (Al-Halq), sedangkan huruf Ba diucapkan dengan merapatkan kedua bibir.',
          jawaban: 'b. Ba (ب)',
        },
        {
          pertanyaan: 'Bagaimana bunyi huruf Ta (ت) apabila diberi tanda harakat Kasrah?',
          pembahasan: 'Tanda Kasrah terletak di bawah huruf dan memberikan bunyi vokal "i". Jadi, Ta + Kasrah dibaca Ti.',
          jawaban: 'Ti (تِ)',
        },
        {
          pertanyaan: 'Tanda baca Dammah terletak di sebelah mana huruf hijaiyah?',
          pembahasan: 'Fathah berada di atas, Kasrah di bawah, dan Dammah juga berada di atas huruf berbentuk melengkung seperti angka sembilan kecil.',
          jawaban: 'Di atas huruf',
        },
      ],
      latihanPG: [
        { pertanyaan: 'Huruf hijaiyah berjumlah ....', opsi: ['A. 20', 'B. 25', 'C. 28/29', 'D. 10'] },
        { pertanyaan: 'Tanda baca garis di atas huruf disebut ....', opsi: ['A. Kasrah', 'B. Fathah', 'C. Dammah', 'D. Sukun'] },
        { pertanyaan: 'Huruf مَ dibaca ....', opsi: ['A. Mi', 'B. Mu', 'C. Ma', 'D. Am'] },
        { pertanyaan: 'Huruf yang keluar dari tenggorokan adalah ....', opsi: ['A. Ba (ب)', 'B. Mim (م)', 'C. Ha (هـ)', 'D. Wau (و)'] },
        { pertanyaan: 'Bunyi vokal "U" dihasilkan oleh harakat ....', opsi: ['A. Fathah', 'B. Dammah', 'C. Kasrah', 'D. Tanwin'] },
      ],
      latihanIsian: [
        'Harakat yang letaknya di bawah huruf disebut __________.',
        'Huruf جُ dibaca __________.',
        'Sebutkan satu huruf hijaiyah yang keluar dari dua bibir! __________.',
      ],
      latihanUraian: [
        'Tuliskan bunyi bacaan dari rangkaian huruf berharakat berikut: دَ - دِ - دُ !',
        'Mengapa kita harus mempelajari Makharijul Huruf dengan benar saat membaca Al-Qur\'an?',
      ],
      kunciPG: [
        'C — Jumlah huruf hijaiyah standar adalah 28 atau 29 huruf (termasuk Alif/Hamzah).',
        'B — Fathah adalah tanda garis di atas huruf yang berbunyi "a".',
        'C — Mim berharakat fathah dibaca "Ma".',
        'C — Huruf Ha (هـ) berasal dari tenggorokan.',
        'B — Dammah memberikan bunyi vokal "u".',
      ],
      kunciIsian: ['Kasrah', 'Ju', 'Ba / Mim / Wau / Fa (pilih salah satu)'],
      kunciUraian: [
        'Da - Di - Du.',
        'Agar dapat membaca Al-Qur\'an secara benar, fasih, dan tidak mengubah makna ayat karena setiap huruf memiliki bunyi yang khas.',
      ],
      rangkuman: [
        'Makharijul Huruf adalah tempat keluarnya bunyi huruf hijaiyah dari organ ucap.',
        'Huruf hijaiyah memiliki daerah makhraj utama meliputi dua bibir (seperti Ba), tenggorokan (seperti Ha), dan lidah (seperti Ta).',
        'Harakat adalah tanda bunyi vokal: Fathah (bunyi A), Kasrah (bunyi I), dan Dammah (bunyi U).',
        'Membaca Al-Qur\'an sesuai makhraj dan harakat menumbuhkan kecintaan kepada Allah Swt. serta bernilai pahala ibadah.',
      ],
    };
  }

  // Domain-rich structured Bahan Ajar for any other PAI topic based strictly on CP/TP/ATP
  const materiByElemen: Record<ElemenName, {
    definisi: { istilah: string; arti: string }[];
    cabang1: { judul: string; subjudul: string; poin: string };
    cabang2: { judul: string; subjudul: string; poin: string };
    inti: { judul: string; uraian: string; poin: string[] }[];
    tabelHeaders: string[];
    tabelRows: string[][];
    contoh: { pertanyaan: string; opsi?: string[]; pembahasan: string; jawaban: string }[];
    pg: { pertanyaan: string; opsi: string[] }[];
    isian: string[];
    uraian: string[];
    kunciPG: string[];
    kunciIsian: string[];
    kunciUraian: string[];
  }> = {
    "Al-Qur'an Hadis": {
      definisi: [
        { istilah: m, arti: `Pokok bahasan Al-Qur'an dan Hadis sesuai CP ${atp.cpCode} yang membimbing kefasihan bacaan, hafalan, dan pengamalan.` },
        { istilah: 'Tartil dan Istiqamah', arti: 'Membaca dengan jelas, tenang, serta membiasakan pengamalan nilai Al-Qur\'an dan Hadis setiap hari.' },
      ],
      cabang1: { judul: 'Pemahaman Bacaan & Dalil', subjudul: '(Konsep dan Kaidah)', poin: `Mengenal struktur bacaan, arti pokok, dan pesan utama ${m}` },
      cabang2: { judul: 'Pengamalan Sehari-hari', subjudul: '(Transfer Kehidupan Nyata)', poin: `${atp.aktivitasMeaningful}` },
      inti: [
        {
          judul: `A. Memahami Pokok Bahasan ${m}`,
          uraian: `Materi ${m} merupakan bagian integral dari Capaian Pembelajaran ${atp.cpCode} yang wajib dikuasai secara sadar dan bermakna:`,
          poin: [
            `Tujuan Utama: ${atp.rumusanTP}`,
            `Keterkaitan Nyata: ${atp.aktivitasMeaningful}`,
            'Adab Berinteraksi: Diawali dengan niat ikhlas, membaca taawuz dan basmalah, serta menjaga kesucian diri.',
          ],
        },
        {
          judul: `B. Langkah Praktik Terbimbing`,
          uraian: 'Peserta didik berlatih secara bertahap dari menyimak, menirukan, hingga mengamalkan:',
          poin: [
            'Tahap Simak dan Amati: Memperhatikan contoh pelafalan atau kandungan pesan dari guru.',
            'Tahap Latihan Berpasangan: Saling mengecek ketepatan bacaan dan pemahaman makna bersama teman.',
            'Tahap Pembiasaan: Mengamalkan pesan materi dalam salat, doa, dan perilaku harian di rumah.',
          ],
        },
      ],
      tabelHeaders: ['Aspek Belajar', 'Fokus Penguasaan', 'Contoh Penerapan Nyata'],
      tabelRows: [
        ['Pengetahuan', `Memahami isi dan kaidah ${m}`, 'Menjelaskan kembali dengan bahasa sendiri'],
        ['Keterampilan', `Melafalkan / mempraktikkan ${m} secara tepat`, 'Membaca atau mempraktikkan saat beribadah'],
        ['Sikap', 'Cinta Al-Qur\'an dan Hadis', 'Rutin mengaji dan berperilaku bersih/disiplin'],
      ],
      contoh: [
        {
          pertanyaan: `Apa langkah pertama yang harus dilakukan sebelum belajar atau membaca materi ${m}?`,
          opsi: ['a. Tergesa-gesa tanpa niat', 'b. Membaca basmalah dan menenangkan diri', 'c. Berbicara saat guru menjelaskan'],
          pembahasan: 'Setiap aktivitas baik dalam Islam diawali dengan niat ikhlas, membaca basmalah, dan kesadaran penuh agar mendapat keberkahan.',
          jawaban: 'b. Membaca basmalah dan menenangkan diri',
        },
        {
          pertanyaan: `Mengapa materi ${m} penting dipelajari dan diamalkan setiap hari?`,
          pembahasan: `Karena ${atp.aktivitasMeaningful} sehingga ilmu yang dipelajari menjadi amal saleh nyata.`,
          jawaban: `Untuk meningkatkan kualitas ibadah dan akhlak mulia dalam kehidupan sehari-hari.`,
        },
      ],
      pg: [
        { pertanyaan: `Pokok bahasan utama pada pembelajaran ini adalah ....`, opsi: [`A. ${m}`, 'B. Sejarah Kerajaan', 'C. Ilmu Hitung', 'D. Olahraga'] },
        { pertanyaan: 'Sikap yang tepat sebelum memulai pembelajaran Al-Qur\'an Hadis adalah ....', opsi: ['A. Gaduh di kelas', 'B. Membaca basmalah dengan khusyuk', 'C. Menunda tugas', 'D. Bermain sendiri'] },
        { pertanyaan: `Asesmen yang digunakan untuk mengukur penguasaan ${m} pada unit ini adalah ....`, opsi: ['A. Tidak ada penilaian', `B. ${atp.asesmen}`, 'C. Membiarkan salah', 'D. Mengabaikan praktik'] },
        { pertanyaan: 'Pendekatan Pembelajaran Mendalam memadukan prinsip ....', opsi: ['A. Hafalan tanpa makna', 'B. Mindful, Meaningful, dan Joyful', 'C. Cepat dan tergesa', 'D. Persaingan tidak sehat'] },
        { pertanyaan: `Wujud cinta kepada Allah Swt. melalui materi ${m} ditunjukkan dengan ....`, opsi: ['A. Malas berlatih', 'B. Mengamalkan dengan sungguh-sungguh', 'C. Melupakan pelajaran', 'D. Menyalahkan teman'] },
      ],
      isian: [
        `Dasar hukum Capaian Pembelajaran PAI SD yang digunakan adalah Kepka BKPDM No. 020 Tahun __________.`,
        `Sebelum membaca atau belajar, seorang muslim membiasakan mengucap __________.`,
        `Pembelajaran ${m} melatih siswa agar selalu menjaga sikap __________ dan cinta Al-Qur'an.`,
      ],
      uraian: [
        `Jelaskan secara singkat apa yang kamu pahami tentang materi ${m}!`,
        `Tuliskan dua contoh penerapan ${m} yang dapat kamu lakukan di rumah bersama orang tua!`,
      ],
      kunciPG: [
        `A — Fokus materi unit ${atp.kodeTP} adalah ${m}.`,
        'B — Membaca basmalah dan menenangkan hati adalah adab utama menuntut ilmu.',
        `B — Teknik penilaian unit ini menggunakan ${atp.asesmen}.`,
        'B — Pembelajaran Mendalam berlandaskan tiga prinsip: Mindful, Meaningful, dan Joyful.',
        'B — Wujud cinta kepada Allah adalah kesungguhan mempelajari dan mengamalkannya.',
      ],
      kunciIsian: ['2026', 'Basmalah', 'Jujur / Disiplin / Khusyuk'],
      kunciUraian: [
        `${m} merupakan bagian dari pembelajaran Al-Qur'an Hadis yang mengajarkan pemahaman makna dan praktik bacaan/amalan secara benar.`,
        'Membaca dan mengulang materi setelah Magrib serta mengamalkan adab kebaikan di hadapan orang tua dan adik/kakak.',
      ],
    },
    Aqidah: {
      definisi: [
        { istilah: m, arti: `Pokok keyakinan Islam pada CP ${atp.cpCode} yang menumbuhkan keimanan kokoh kepada Allah Swt.` },
        { istilah: 'Iman', arti: 'Keyakinan teguh di dalam hati, diucapkan dengan lisan, dan dibuktikan melalui amal perbuatan.' },
      ],
      cabang1: { judul: 'Keyakinan (I\'tiqad)', subjudul: '(Memahami Dalil dan Makna)', poin: `Mengenal hakikat ${m} melalui ciptaan dan firman Allah` },
      cabang2: { judul: 'Pengamalan Iman', subjudul: '(Buah Keimanan dalam Sikap)', poin: `${atp.aktivitasMeaningful}` },
      inti: [
        {
          judul: `A. Hakikat Keimanan pada Materi ${m}`,
          uraian: `Keimanan tidak hanya diucapkan di lisan, tetapi dipahami dengan akal sehat dan dirasakan dalam ketenangan hati:`,
          poin: [
            `Fokus CP ${atp.cpCode}: ${atp.rumusanTP}`,
            `Makna Kontekstual: ${atp.aktivitasMeaningful}`,
            'Buah Keimanan: Melahirkan sikap jujur karena sadar selalu diawasi Allah Swt., berani berbuat benar, serta gemar bersyukur.',
          ],
        },
        {
          judul: 'B. Menghubungkan Keyakinan dengan Kehidupan Sehari-hari',
          uraian: 'Peserta didik dapat membuktikan keimanan melalui kebiasaan positif berikut:',
          poin: [
            'Mengucap kalimat tayyibah (Subhanallah, Alhamdulillah) saat menyaksikan keindahan alam ciptaan Allah.',
            'Menjaga amanah serta tidak berbohong meskipun tidak ada orang dewasa yang melihat.',
            'Menghormati orang tua, guru, dan menyayangi sesama teman.',
          ],
        },
      ],
      tabelHeaders: ['Unsur Keimanan', 'Penjelasan Pokok', 'Bukti Perilaku Anak Saleh'],
      tabelRows: [
        ['Keyakinan Hati', `Meyakini kebenaran ${m} sepenuh hati`, 'Tenang, bersyukur, dan tidak sombong'],
        ['Pengucapan Lisan', 'Mengagungkan asma dan ajaran Allah Swt.', 'Rajin berdoa dan bertutur kata santun'],
        ['Amal Perbuatan', 'Menjalankan perintah dan menjauhi larangan', 'Jujur, disiplin, dan rajin beribadah'],
      ],
      contoh: [
        {
          pertanyaan: `Bagaimana wujud pembuktian keimanan seorang siswa setelah mempelajari ${m}?`,
          opsi: ['a. Hanya menghafal tanpa diamalkan', 'b. Bersikap jujur, bersyukur, dan taat beribadah', 'c. Merasa lebih baik dari orang lain'],
          pembahasan: 'Iman yang benar selalu membuahkan akhlak terpuji seperti jujur, rendah hati, dan taat beribadah.',
          jawaban: 'b. Bersikap jujur, bersyukur, dan taat beribadah',
        },
        {
          pertanyaan: `Apa hubungan antara keyakinan ${m} dengan perilaku sehari-hari di sekolah?`,
          pembahasan: 'Siswa yang yakin akan pengawasan dan kasih sayang Allah Swt. akan menjaga perkataan dan perbuatannya setiap saat.',
          jawaban: 'Mendorong siswa bersikap jujur, santun, dan tekun belajar.',
        },
      ],
      pg: [
        { pertanyaan: 'Keyakinan teguh di dalam hati yang dibuktikan dengan ucapan dan perbuatan disebut ....', opsi: ['A. Ragu-ragu', 'B. Iman', 'C. Lupa', 'D. Main-main'] },
        { pertanyaan: `Materi keimanan yang dipelajari pada unit ${atp.kodeTP} adalah ....`, opsi: [`A. ${m}`, 'B. Tata cara jual beli', 'C. Matematika dasar', 'D. Seni rupa'] },
        { pertanyaan: 'Kalimat yang tepat diucapkan ketika mengagumi keindahan alam ciptaan Allah adalah ....', opsi: ['A. Astagfirullah', 'B. Subhanallah', 'C. Insyaallah', 'D. Maaf'] },
        { pertanyaan: 'Anak yang beriman menyadari bahwa setiap perbuatannya selalu ....', opsi: ['A. Tersembunyi selamanya', 'B. Diawasi oleh Allah Swt.', 'C. Tidak dicatat', 'D. Diabaikan'] },
        { pertanyaan: 'Buah terpenting dari mempelajari Aqidah adalah tumbuhnya sikap ....', opsi: ['A. Sombong', 'B. Tawaduk, jujur, dan bersyukur', 'C. Pemalas', 'D. Acuh tak acuh'] },
      ],
      isian: [
        'Iman yang sempurna mencakup keyakinan hati, ucapan lisan, dan __________ perbuatan.',
        `Materi Aqidah pada pertemuan ini membahas tentang __________.`,
        'Ketika menerima nikmat dari Allah Swt., kita mengucap __________. ',
      ],
      uraian: [
        `Jelaskan mengapa kita harus meyakini materi ${m} dalam kehidupan seorang muslim!`,
        `Berikan dua contoh perilaku jujur dan bersyukur yang mencerminkan pemahamanmu tentang ${m}!`,
      ],
      kunciPG: [
        'B — Iman mencakup hati, lisan, dan amal perbuatan.',
        `A — Unit ${atp.kodeTP} membahas ${m}.`,
        'B — Subhanallah berarti Maha Suci Allah atas segala ciptaan-Nya.',
        'B — Allah Maha Melihat dan Mengawasi setiap amal hamba-Nya.',
        'B — Iman melahirkan kerendahan hati, kejujuran, dan rasa syukur.',
      ],
      kunciIsian: ['Amal / bukti', m, 'Alhamdulillah'],
      kunciUraian: [
        `Karena ${m} menjadi pedoman keyakinan agar hidup terarah, tenang, dan senantiasa taat kepada Allah Swt.`,
        'Tidak menyontek saat ulangan serta mengucap terima kasih dan membantu orang tua di rumah.',
      ],
    },
    Akhlak: {
      definisi: [
        { istilah: m, arti: `Perilaku terpuji dalam ajaran Islam pada CP ${atp.cpCode} yang menjadi kebiasaan harian.` },
        { istilah: 'Akhlak Mahmudah', arti: 'Sifat dan perbuatan mulia yang dicintai Allah Swt., Rasulullah Saw., serta sesama manusia.' },
      ],
      cabang1: { judul: 'Kesadaran Adab (Mindful)', subjudul: '(Niat dan Hati yang Bersih)', poin: `Memahami pentingnya ${m} sebelum bertindak` },
      cabang2: { judul: 'Aksi Nyata Kebaikan', subjudul: '(Pembiasaan Terpuji)', poin: `${atp.aktivitasMeaningful}` },
      inti: [
        {
          judul: `A. Mengenal Nilai Luhur ${m}`,
          uraian: 'Akhlak mulia merupakan cerminan keindahan ajaran Islam dalam berinteraksi dengan Allah Swt., diri sendiri, dan sesama:',
          poin: [
            `Tujuan Pembelajaran: ${atp.rumusanTP}`,
            `Penerapan Bermakna: ${atp.aktivitasMeaningful}`,
            'Keteladanan: Rasulullah Saw. diutus ke muka bumi untuk menyempurnakan akhlak yang mulia.',
          ],
        },
        {
          judul: 'B. Langkah Membiasakan Akhlak Terpuji',
          uraian: 'Agar akhlak baik melekat menjadi karakter, peserta didik melatih tiga kebiasaan berikut:',
          poin: [
            'Berhenti sejenak (jeda sadar) sebelum berbicara atau bertindak agar tidak menyakiti orang lain.',
            'Membiasakan empat kata ajaib: permisi, tolong, maaf, dan terima kasih.',
            'Mengevaluasi diri setiap malam sebelum tidur atas kebaikan yang sudah diperbuat.',
          ],
        },
      ],
      tabelHeaders: ['Situasi Sehari-hari', 'Sikap yang Kurang Tepat', 'Sikap Akhlak Mulia yang Diterapkan'],
      tabelRows: [
        ['Memulai kegiatan belajar', 'Langsung bermain dan ribut', 'Mengucap basmalah dan duduk tenang'],
        ['Menemukan barang teman terjatuh', 'Menyembunyikan atau membiarkan', 'Mengembalikan dengan jujur dan santun'],
        ['Berbicara dengan guru/orang tua', 'Berbicara kasar dan memotong ucapan', 'Berbicara lembut, sopan, dan menghormati'],
      ],
      contoh: [
        {
          pertanyaan: 'Bagaimana sikap terbaik ketika melihat teman kesulitan merapikan alat belajarnya?',
          opsi: ['a. Menertawakannya', 'b. Membantunya dengan ikhlas dan ramah', 'c. Pergi meninggalkannya'],
          pembahasan: 'Akhlak terpuji mendorong seorang muslim ringan tangan membantu sesama dengan penuh kasih sayang.',
          jawaban: 'b. Membantunya dengan ikhlas dan ramah',
        },
        {
          pertanyaan: `Mengapa kebiasaan mengamalkan ${m} harus dimulai dari hal-hal kecil?`,
          pembahasan: 'Kebiasaan baik yang dilakukan terus-menerus sejak kecil akan tumbuh menjadi karakter mulia saat dewasa.',
          jawaban: 'Agar terbentuk karakter yang kokoh dan tulus dalam keseharian.',
        },
      ],
      pg: [
        { pertanyaan: 'Perilaku yang baik dan terpuji menurut ajaran Islam disebut ....', opsi: ['A. Akhlak madzmumah', 'B. Akhlak mahmudah', 'C. Sikap tergesa', 'D. Perilaku ceroboh'] },
        { pertanyaan: `Unit pembelajaran ${atp.kodeTP} berfokus pada pembiasaan ....`, opsi: [`A. ${m}`, 'B. Berhitung cepat', 'C. Menggambar peta', 'D. Olahraga atletik'] },
        { pertanyaan: 'Apabila melakukan kekhilafan kepada teman, sikap terpuji yang harus dilakukan adalah ....', opsi: ['A. Menyalahkan teman', 'B. Segera meminta maaf dengan tulus', 'C. Bersembunyi', 'D. Marah balik'] },
        { pertanyaan: 'Ucapan santun ketika menerima bantuan atau nikmat adalah ....', opsi: ['A. Alhamdulillah dan terima kasih', 'B. Mengeluh', 'C. Diam saja', 'D. Mengabaikan'] },
        { pertanyaan: 'Teladan akhlak paling sempurna bagi seluruh umat Islam adalah ....', opsi: ['A. Nabi Muhammad Saw.', 'B. Orang yang sombong', 'C. Tokoh fiksi', 'D. Siapa saja'] },
      ],
      isian: [
        'Akhlak yang terpuji disebut juga dengan istilah akhlak __________.',
        'Memulai pekerjaan baik hendaknya mengucap kalimat __________.',
        `Salah satu contoh pengamalan ${m} di rumah adalah __________ kepada orang tua.`,
      ],
      uraian: [
        `Tuliskan tiga manfaat memiliki sikap sesuai materi ${m} dalam pergaulan di sekolah!`,
        `Ceritakan satu pengalaman baik yang pernah kamu lakukan atau ingin kamu biasakan mulai hari ini!`,
      ],
      kunciPG: [
        'B — Akhlak mahmudah berarti akhlak terpuji.',
        `A — Fokus materi unit ini adalah ${m}.`,
        'B — Mengakui kekhilafan dan meminta maaf adalah cerminan kejujuran dan kerendahan hati.',
        'A — Bersyukur kepada Allah dan berterima kasih kepada sesama adalah bagian dari akhlak mulia.',
        'A — Nabi Muhammad Saw. adalah uswatun hasanah (teladan terbaik).',
      ],
      kunciIsian: ['Mahmudah', 'Basmalah', 'Hormat / patuh / membantu'],
      kunciUraian: [
        'Membuat hati tenang, disayang oleh Allah Swt. dan orang tua, serta memiliki banyak teman yang rukun.',
        'Jawaban bebas yang mencerminkan perilaku jujur, santun, syukur, atau membantu sesama di rumah dan sekolah.',
      ],
    },
    Fiqih: {
      definisi: [
        { istilah: m, arti: `Ketentuan tata cara ibadah dalam syariat Islam pada CP ${atp.cpCode} agar sah dan tertib.` },
        { istilah: 'Rukun dan Tertib', arti: 'Bagian pokok ibadah yang wajib dilaksanakan secara berurutan sesuai tuntunan Rasulullah Saw.' },
      ],
      cabang1: { judul: 'Ketentuan Syariat', subjudul: '(Syarat, Rukun, dan Urutan)', poin: `Memahami tata cara ${m} secara runtut dan sah` },
      cabang2: { judul: 'Praktik Ibadah Khusyuk', subjudul: '(Penerapan Harian)', poin: `${atp.aktivitasMeaningful}` },
      inti: [
        {
          judul: `A. Memahami Ketentuan Dasar ${m}`,
          uraian: 'Ibadah yang diterima Allah Swt. adalah ibadah yang dilandasi niat ikhlas dan dilaksanakan sesuai tuntunan tata caranya:',
          poin: [
            `Kompetensi Inti (${atp.kodeTP}): ${atp.rumusanTP}`,
            `Makna Hidup (${atp.materi}): ${atp.aktivitasMeaningful}`,
            'Tertib Urutan: Setiap gerakan dan bacaan dilakukan dengan tenang (tuma\'ninah), tidak terburu-buru, dan penuh kesadaran.',
          ],
        },
        {
          judul: 'B. Panduan Praktik Terstruktur',
          uraian: 'Agar peserta didik terampil mempraktikkan ibadah secara benar, perhatikan langkah berikut:',
          poin: [
            'Persiapan: Memastikan kebersihan badan, pakaian, dan tempat pelaksanaan ibadah.',
            'Pelaksanaan: Mengikuti urutan rukun dari niat hingga penutup secara tertib.',
            'Evaluasi Mandiri: Memperbaiki gerakan atau bacaan yang masih kurang tepat dengan bimbingan guru dan orang tua.',
          ],
        },
      ],
      tabelHeaders: ['Tahapan', `Unsur Pelaksanaan ${m}`, 'Keterangan Penting'],
      tabelRows: [
        ['1. Persiapan', 'Niat ikhlas dan kesucian diri', 'Dilakukan dengan hati tenang karena Allah Swt.'],
        ['2. Inti Ibadah', `Rukun dan gerakan pokok ${m}`, 'Dilaksanakan secara tertib dan tidak melompati urutan'],
        ['3. Penutup', 'Doa, zikir, dan menjaga adab sesudahnya', 'Membentuk kedisiplinan dalam aktivitas berikutnya'],
      ],
      contoh: [
        {
          pertanyaan: `Apa hal utama yang menentukan sah tidaknya ibadah dalam materi ${m}?`,
          opsi: ['a. Dilakukan asal cepat selesai', 'b. Memenuhi syarat, rukun, dan dilakukan dengan tertib', 'c. Hanya meniru tanpa memahami niat'],
          pembahasan: 'Dalam ilmu fikih, ibadah harus memenuhi syarat sah dan rukunnya secara berurutan (tertib) serta disertai niat ikhlas.',
          jawaban: 'b. Memenuhi syarat, rukun, dan dilakukan dengan tertib',
        },
        {
          pertanyaan: `Mengapa dalam melaksanakan ibadah ${m} kita dianjurkan bersikap tenang dan tuma'ninah?`,
          pembahasan: 'Ketenangan menjaga kekhusyukan hati serta menghindarkan dari kesalahan gerakan atau bacaan.',
          jawaban: 'Agar ibadah khusyuk, benar urutannya, dan menenangkan jiwa.',
        },
      ],
      pg: [
        { pertanyaan: 'Bagian pokok dalam suatu ibadah yang wajib dipenuhi agar ibadah dinyatakan sah disebut ....', opsi: ['A. Pilihan bebas', 'B. Rukun', 'C. Kebiasaan', 'D. Hiburan'] },
        { pertanyaan: `Pokok ibadah yang dipelajari dan dipraktikkan pada unit ${atp.kodeTP} adalah ....`, opsi: [`A. ${m}`, 'B. Menulis cerpen', 'C. Berhitung pecahan', 'D. Menggambar bebas'] },
        { pertanyaan: 'Melaksanakan rangkaian ibadah secara berurutan dari awal hingga akhir disebut ....', opsi: ['A. Acak', 'B. Tertib', 'C. Tergesa', 'D. Terlambat'] },
        { pertanyaan: 'Niat dalam beribadah ditujukan semata-mata karena ....', opsi: ['A. Ingin dipuji teman', 'B. Allah Swt.', 'C. Takut dimarahi', 'D. Hadiah semata'] },
        { pertanyaan: `Asesmen untuk menguji keterampilan praktik ${m} pada unit ini berupa ....`, opsi: ['A. Mengarang bebas', `B. ${atp.asesmen}`, 'C. Diam saja', 'D. Mewarnai bebas'] },
      ],
      isian: [
        'Melakukan ibadah secara berurutan tanpa mendahulukan yang akhir disebut __________.',
        `Niat dalam melaksanakan ${m} harus dilakukan dengan penuh ke-__________-an.`,
        'Menjaga kebersihan badan sebelum beribadah merupakan bagian dari perintah __________.',
      ],
      uraian: [
        `Jelaskan mengapa kita harus mempelajari tata cara ${m} secara tertib dan tidak asal meniru!`,
        `Sebutkan dua manfaat membiasakan pengamalan ${m} dalam kehidupan disiplin seorang pelajar!`,
      ],
      kunciPG: [
        'B — Rukun adalah unsur wajib yang menentukan sahnya suatu ibadah.',
        `A — Materi fikih pada unit ini adalah ${m}.`,
        'B — Tertib berarti melaksanakan sesuai urutan yang benar.',
        'B — Setiap ibadah diniatkan ikhlas karena Allah Swt.',
        `B — Teknik asesmen yang ditetapkan pada ATP adalah ${atp.asesmen}.`,
      ],
      kunciIsian: ['Tertib', 'ikhlas', 'bersuci / thaharah'],
      kunciUraian: [
        'Supaya ibadah yang dilakukan sah sesuai syariat Islam, tepat rukun dan syaratnya, serta diterima oleh Allah Swt.',
        'Melatih kedisiplinan waktu, menjaga kebersihan lahir batin, serta menumbuhkan ketenangan hati saat belajar.',
      ],
    },
    'Sejarah Peradaban Islam': {
      definisi: [
        { istilah: m, arti: `Kisah sejarah perjuangan dan keteladanan dalam Islam pada CP ${atp.cpCode}.` },
        { istilah: 'Uswah Hasanah (Keteladanan)', arti: 'Sikap mulia para nabi, rasul, dan sahabat yang patut dicontoh dalam kehidupan sehari-hari.' },
      ],
      cabang1: { judul: 'Alur Peristiwa Sejarah', subjudul: '(Tokoh dan Kronologi)', poin: `Memahami perjalanan dan ujian pada kisah ${m}` },
      cabang2: { judul: 'Ibrah dan Keteladanan', subjudul: '(Meneladani Akhlak Tokoh)', poin: `${atp.aktivitasMeaningful}` },
      inti: [
        {
          judul: `A. Mengenal Kisah dan Perjuangan dalam ${m}`,
          uraian: 'Sejarah Islam memuat pelajaran berharga tentang keteguhan iman, kesabaran, kejujuran, dan pengabdian kepada Allah Swt.:',
          poin: [
            `Fokus CP ${atp.cpCode}: ${atp.rumusanTP}`,
            `Nilai Keteladanan: ${atp.aktivitasMeaningful}`,
            'Hikmah Sejarah: Kesulitan dan tantangan perjuangan dapat dilalui dengan kesabaran, doa, serta musyawarah.',
          ],
        },
        {
          judul: 'B. Menerapkan Teladan dalam Kehidupan Pelajar',
          uraian: 'Peserta didik menghidupkan pesan keteladanan tersebut melalui tindakan sederhana berikut:',
          poin: [
            'Berani mengakui kesalahan serta meminta maaf dengan jujur apabila berbuat khilaf.',
            'Tekun dan sabar menyelesaikan tugas sekolah tanpa mudah mengeluh.',
            'Menjaga amanah, menyayangi sesama, dan gemar menolong tanpa membeda-bedakan.',
          ],
        },
      ],
      tabelHeaders: ['Aspek Kisah', 'Nilai yang Ditampilkan Tokoh', 'Contoh Peneladanan oleh Siswa'],
      tabelRows: [
        ['Kejujuran & Amanah', 'Selalu berkata benar dan dapat dipercaya', 'Menjaga barang titipan teman dan tidak berbohong'],
        ['Kesabaran & Ketekunan', 'Tetap teguh menghadapi ujian dakwah', 'Tekun belajar dan tidak cepat menyerah'],
        ['Kepedulian & Persaudaraan', 'Menyayangi umat dan mengutamakan persatuan', 'Rukun bermain dan membantu teman kesulitan'],
      ],
      contoh: [
        {
          pertanyaan: `Apa tujuan utama kita mempelajari kisah sejarah dalam materi ${m}?`,
          opsi: ['a. Sekadar hiburan pengisi waktu', 'b. Mengambil hikmah dan meneladani akhlak mulia tokohnya', 'c. Menghafal tanggal tanpa makna'],
          pembahasan: 'Al-Qur\'an menyajikan kisah umat dan nabi terdahulu agar menjadi pelajaran (ibrah) serta teladan akhlak bagi orang beriman.',
          jawaban: 'b. Mengambil hikmah dan meneladani akhlak mulia tokohnya',
        },
        {
          pertanyaan: 'Bagaimana cara meneladani sikap sabar dan jujur dalam kehidupan siswa di kelas?',
          pembahasan: 'Dapat diwujudkan dengan mengerjakan ulangan sendiri secara jujur serta sabar mendengarkan penjelasan teman saat berdiskusi.',
          jawaban: 'Jujur saat mengerjakan tugas dan sabar berinteraksi dengan teman.',
        },
      ],
      pg: [
        { pertanyaan: 'Sikap terpuji dari tokoh sejarah Islam yang patut kita contoh disebut ....', opsi: ['A. Keteladanan (uswah)', 'B. Kesombongan', 'C. Kemarahan', 'D. Kecerobohan'] },
        { pertanyaan: `Pokok kisah yang dipelajari pada unit ${atp.kodeTP} adalah ....`, opsi: [`A. ${m}`, 'B. Ilmu cuaca', 'C. Olahraga air', 'D. Bangunan modern'] },
        { pertanyaan: 'Gelar Nabi Muhammad Saw. karena kejujuran dan dapat dipercaya adalah ....', opsi: ['A. Al-Amin', 'B. Al-Maidah', 'C. Al-Quddus', 'D. Al-Khaliq'] },
        { pertanyaan: 'Ketika menghadapi tugas belajar yang sulit, sikap meneladani para nabi dan sahabat adalah ....', opsi: ['A. Menyerah seketika', 'B. Bersabar, berusaha, dan berdoa', 'C. Menyalahkan teman', 'D. Meninggalkan kelas'] },
        { pertanyaan: 'Pelajaran berharga atau hikmah yang diambil dari sebuah peristiwa sejarah disebut ....', opsi: ['A. Ibrah', 'B. Masalah', 'C. Kerugian', 'D. Lupa'] },
      ],
      isian: [
        'Sikap baik yang dapat ditiru dari kisah nabi dan sahabat disebut __________.',
        `Materi sejarah yang dipelajari pada unit ${atp.kodeTP} adalah __________.`,
        'Dalam menghadapi ujian hidup, para nabi selalu mengutamakan sikap __________ dan tawakal.',
      ],
      uraian: [
        `Sebutkan dua nilai keteladanan utama dari materi ${m} yang paling berkesan bagimu!`,
        'Bagaimana caramu menerapkan sifat jujur dan sabar di sekolah maupun di rumah?',
      ],
      kunciPG: [
        'A — Uswah berarti keteladanan yang baik.',
        `A — Unit ini membahas ${m}.`,
        'A — Al-Amin berarti orang yang terpercaya.',
        'B — Kesabaran, ikhtiar, dan doa adalah ciri keteladanan para nabi.',
        'A — Ibrah berarti pelajaran atau hikmah berharga.',
      ],
      kunciIsian: ['Keteladanan / Uswah', m, 'Sabar'],
      kunciUraian: [
        'Kejujuran dalam berkata dan bertindak, serta kesabaran dan ketekunan dalam menghadapi tantangan.',
        'Tidak berbohong kepada orang tua maupun guru, menjaga amanah teman, dan tekun menyelesaikan tugas tanpa mengeluh.',
      ],
    },
  };

  const data = materiByElemen[atp.elemen];
  return {
    ringkasanIntro: `Selamat belajar anak-anak hebat. Pada kesempatan ini kita akan mempelajari materi "${m}" agar pemahaman keislaman dan pengamalan ibadah sehari-hari semakin kuat, benar, serta penuh makna.`,
    definisiPenting: data.definisi,
    ringkasanPenutup: `Dengan memahami dan mengamalkan ${m} secara sadar, belajar Pendidikan Agama Islam terasa lebih mudah, bermakna, dan membahagiakan hati.`,
    petaKonsepTop: `MATERI INTI: ${m.toUpperCase()}`,
    petaKonsepCabang: [data.cabang1, data.cabang2],
    materiInti: data.inti,
    tabelContohHeaders: data.tabelHeaders,
    tabelContohRows: data.tabelRows,
    contohSoal: data.contoh,
    latihanPG: data.pg,
    latihanIsian: data.isian,
    latihanUraian: data.uraian,
    kunciPG: data.kunciPG,
    kunciIsian: data.kunciIsian,
    kunciUraian: data.kunciUraian,
    rangkuman: [
      `${m} merupakan bagian penting dari Capaian Pembelajaran PAI dan Budi Pekerti (${atp.elemen} — CP ${atp.cpCode}).`,
      `Pemahaman konsep berjalan seiring dengan pengamalan nyata dalam kehidupan sehari-hari (${atp.aktivitasMeaningful}).`,
      `Proses pembelajaran dilaksanakan dengan suasana berkesadaran (mindful), bermakna (meaningful), dan menggembirakan (joyful).`,
      `Setiap kebaikan yang diamalkan dari materi ${m} dengan ikhlas bernilai pahala di sisi Allah Swt.`,
    ],
  };
}

export function buildStructuredModulPayload(
  identity: SchoolIdentity,
  atp: ATPItem,
  tp?: TPItem
): Omit<
  ModulAjarItem,
  | 'id'
  | 'atpId'
  | 'tpId'
  | 'kodeTP'
  | 'cpCode'
  | 'cpRedaksi'
  | 'elemen'
  | 'fase'
  | 'semester'
  | 'alokasiJP'
  | 'materiPokok'
  | 'identitasPenulis'
  | 'kompetensiAwal'
  | 'profilPelajarPancasila'
  | 'saranaPrasarana'
  | 'targetPesertaDidik'
  | 'modelPembelajaran'
  | 'tujuanPembelajaran'
  | 'pemahamanBermakna'
  | 'pertanyaanPemantik'
  | 'persiapanPembelajaran'
  | 'kegiatanPendahuluan'
  | 'kegiatanInti'
  | 'kegiatanPenutup'
  | 'asesmenDiagnostik'
  | 'asesmenFormatif'
  | 'asesmenSumatif'
  | 'pengayaan'
  | 'remedial'
  | 'refleksiPesertaDidik'
  | 'refleksiPendidik'
  | 'lkpdJudul'
  | 'lkpdPetunjuk'
  | 'lkpdTugas'
  | 'bahanBacaanPendidik'
  | 'bahanBacaanPesertaDidik'
  | 'glosarium'
  | 'daftarPustaka'
> {
  const split = computePertemuanSplit(atp.alokasiJP);
  const { rantai, keterkaitan } = getAlurRantaiAndKeterkaitan(atp);
  const pertemuanList = getPertemuanList(atp);
  const lkpdPertemuanList = getLkpdPertemuanList(atp, identity, pertemuanList);
  const bahanAjar = getBahanAjar(atp);
  const m = atp.materi;

  return {
    jenjangKelas: extractKelasFromSemester(atp.semester, identity.kelas),
    alokasiWaktuDetail: split.alokasiText,
    metodePembelajaran: getMetodeByElemen(atp.elemen),
    elemenDikembangkan: getElemenDikembangkan(atp),
    alurTpRantai: rantai,
    keterkaitanAntarTp: keterkaitan,
    tujuanPembelajaranList: getTujuanPembelajaranList(atp, tp),
    konsepBesar: getKonsepBesar(atp),
    transferGoals: getTransferGoals(atp),
    dimensiProfilLulusan: getDimensiProfilLulusan(atp),
    pertemuanList,
    asesmenDiagnostikList: [
      `Sebutkan hal awal yang sudah kamu ketahui tentang ${m}!`,
      `Bagaimana cara atau contoh sederhana mengamalkan ${m} dalam kegiatan harianmu?`,
      `Apakah kamu sudah pernah mempraktikkan atau mendengar kisah terkait ${m} di rumah?`,
    ],
    asesmenFormatifList: [
      {
        jenis: 'Observasi',
        keterangan: `Lembar ceklis ketepatan penguasaan konsep dan praktik ${m} selama kegiatan inti berlangsung.`,
      },
      {
        jenis: 'Antar Teman',
        keterangan: `Saling menilai kefasihan, ketertiban, atau kesantunan teman sebaya saat berpasangan.`,
      },
      {
        jenis: 'Jurnal Refleksi',
        keterangan: `Catatan singkat perasaan peserta didik dan pemahaman paling bermakna setelah belajar.`,
      },
    ],
    asesmenSumatifHots: [
      `Soal HOTS 1: Seorang temanmu mengalami kesulitan saat hendak mempraktikkan ${m} di rumah atau sekolah. Berdasarkan pembelajaran hari ini, langkah tepat apa yang kamu sarankan dan mengapa langkah tersebut penting?`,
      `Soal HOTS 2: Jika kamu melihat temanmu keliru dalam memahami atau mempraktikkan ${m}, bagaimana cara santun untuk membantunya agar tetap semangat belajar dan mencintai ajaran Islam?`,
    ],
    rubrikKonseptual: getRubrikKonseptual(atp),
    pengayaanList: [
      `Menjadi "Tutor Sebaya" untuk membimbing teman yang masih memerlukan latihan pada materi ${m}.`,
      `Membuat karya ringkas/peta pikiran atau catatan kreatif tentang penerapan ${m} di rumah.`,
      `Menghafal atau memperdalam satu contoh dalil/teladan tambahan terkait ${m}.`,
    ],
    remedialList: [
      `Bimbingan individu atau kelompok kecil menggunakan media kartu visual dan peraga konkret ${m}.`,
      `Latihan repetisi bertahap dengan contoh langsung yang dipandu secara perlahan oleh guru.`,
      `Pendampingan khusus bersama orang tua melalui catatan pengulangan singkat di rumah.`,
    ],
    refleksiGuruList: [
      `Apakah peserta didik telah mencapai pemahaman mendalam (deep understanding) mengenai alasan dan makna pentingnya ${m}?`,
      `Apakah terdapat bukti transfer of learning (peserta didik mencoba mengamalkan ${m} di luar jam pelajaran)?`,
      `Bagian mana dari penerapan model ${getModelDetail(identity.fase)} yang berjalan paling efektif kali ini?`,
      `Apa perbaikan pembelajaran yang perlu dilakukan untuk menumbuhkan kecintaan peserta didik terhadap ajaran Islam pada materi berikutnya?`,
    ],
    lkpdPertemuanList,
    bahanAjar,
  };
}

export function getOfficialModulModelLabel(fase: string): string {
  return getModelDetail(fase);
}

export function getOfficialDaftarPustaka(kelas: string): string[] {
  return [
    `Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.`,
    `Badan Kurikulum, Perbukuan, dan Penilaian / ${DASAR_HUKUM_TEXT}`,
    `Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi. Buku Panduan Guru dan Buku Siswa Pendidikan Agama Islam dan Budi Pekerti SD (${kelas}). Jakarta: Kemendikbudristek.`,
    `Kementerian Agama Republik Indonesia. Al-Qur'an dan Terjemahannya. Jakarta: Lajnah Pentashihan Mushaf Al-Qur'an.`,
  ];
}

export function ensureGlosariumNonEmpty(glosarium: GlosariumItem[], materi: string): GlosariumItem[] {
  if (glosarium && glosarium.length > 0) return glosarium;
  return [
    {
      istilah: materi,
      arti: 'Pokok bahasan utama dalam rencana pembelajaran mendalam PAI berdasarkan Kepka BKPDM No. 020 Tahun 2026.',
    },
  ];
}
