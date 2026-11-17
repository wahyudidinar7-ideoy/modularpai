import { CP_DATABASE, DASAR_HUKUM_TEXT, getKopInstansiLines } from '../data/cpDatabase';
import { ATPItem, CPItem, ModulAjarItem, SchoolIdentity, TPItem } from '../types/curriculum';
import { extractSemesterLabel } from './modulContentBuilder';

export type DocxExportMode =
  | 'both'
  | 'tp'
  | 'atp'
  | 'cp'
  | 'cp_tp_atp'
  | 'modul'
  | 'all_modul'
  | 'full_bundle';

function escapeXml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function paragraphXml(
  text: string,
  options?: {
    bold?: boolean;
    italic?: boolean;
    size?: number; // half-points (22 = 11pt)
    align?: 'left' | 'center' | 'right' | 'both';
    color?: string;
    spaceAfter?: number;
    spaceBefore?: number;
    line?: number;
    firstLine?: number;
    keepNext?: boolean;
    bottomDoubleBorder?: boolean;
  }
): string {
  const align = options?.align || 'left';
  const size = options?.size || 22;
  const color = options?.color || '111827';
  const spaceAfter = options?.spaceAfter ?? 100;
  const spaceBefore = options?.spaceBefore ?? 0;
  const line = options?.line ?? 360; // 1.5 spasi baku penulisan ilmiah
  const indXml = options?.firstLine ? `<w:ind w:firstLine="${options.firstLine}"/>` : '';
  const pBdr = options?.bottomDoubleBorder
    ? `<w:pBdr><w:bottom w:val="double" w:sz="12" w:space="6" w:color="14532D"/></w:pBdr>`
    : '';
  const keepNext = options?.keepNext ? '<w:keepNext/>' : '';

  const rPr = [
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>',
    `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`,
    `<w:color w:val="${color}"/>`,
    options?.bold ? '<w:b/>' : '',
    options?.italic ? '<w:i/>' : '',
  ].join('');

  return `<w:p><w:pPr>${pBdr}${keepNext}<w:jc w:val="${align}"/>${indXml}<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}" w:line="${line}" w:lineRule="auto"/></w:pPr><w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(
    text
  )}</w:t></w:r></w:p>`;
}

function pageBreakXml(): string {
  return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
}

function rowXml(cells: string[], isHeader = false): string {
  const trPr = `<w:trPr><w:cantSplit/>${isHeader ? '<w:tblHeader/>' : ''}</w:trPr>`;
  return `<w:tr>${trPr}${cells.join('')}</w:tr>`;
}

function tableXml(colWidths: number[], rows: string[]): string {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return (
    `<w:tbl>` +
    `<w:tblPr><w:tblW w:w="${totalWidth}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr>` +
    `<w:tblGrid>${colWidths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>` +
    rows.join('') +
    `</w:tbl>`
  );
}

function cellXml(
  lines: {
    text: string;
    bold?: boolean;
    italic?: boolean;
    size?: number;
    align?: 'left' | 'center' | 'right' | 'both';
    color?: string;
  }[],
  widthDxa: number,
  bgHex?: string,
  noBorder?: boolean
): string {
  const borders = noBorder
    ? `<w:tcBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>`
    : `<w:tcBorders>
        <w:top w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
        <w:left w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
        <w:right w:val="single" w:sz="4" w:space="0" w:color="94A3B8"/>
      </w:tcBorders>`;

  const shading = bgHex ? `<w:shd w:val="clear" w:color="auto" w:fill="${bgHex}"/>` : '';
  const paragraphs = lines
    .map((l) =>
      paragraphXml(l.text, {
        bold: l.bold,
        italic: l.italic,
        size: l.size || 18,
        align: l.align || 'left',
        color: l.color || '111827',
        spaceAfter: 40,
        line: 300,
      })
    )
    .join('');

  return `<w:tc><w:tcPr><w:tcW w:w="${widthDxa}" w:type="dxa"/>${borders}${shading}<w:vAlign w:val="top"/><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="115" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="115" w:type="dxa"/></w:tcMar></w:tcPr>${paragraphs}</w:tc>`;
}

function kopSekolahXml(identity: SchoolIdentity, docTitle: string, subtitle?: string): string[] {
  const chunks: string[] = [];
  const kop = getKopInstansiLines(identity);
  chunks.push(
    paragraphXml(kop.pemerintahDaerah, {
      bold: true,
      size: 22,
      align: 'center',
      color: '1E293B',
      spaceAfter: 20,
    })
  );
  chunks.push(
    paragraphXml(kop.dinasPendidikan, {
      bold: true,
      size: 24,
      align: 'center',
      color: '1E293B',
      spaceAfter: 30,
    })
  );
  chunks.push(
    paragraphXml(identity.namaSekolah.toUpperCase(), {
      bold: true,
      size: 28,
      align: 'center',
      color: '14532D',
      spaceAfter: 30,
    })
  );
  chunks.push(
    paragraphXml(`${identity.alamat} | NPSN: ${identity.npsn} | ${identity.kotaKabupaten}`, {
      size: 18,
      align: 'center',
      color: '475569',
      spaceAfter: 120,
      bottomDoubleBorder: true,
    })
  );
  chunks.push(
    paragraphXml(docTitle, {
      bold: true,
      size: 23,
      align: 'center',
      color: '111827',
      spaceBefore: 120,
      spaceAfter: 40,
      keepNext: true,
    })
  );
  chunks.push(
    paragraphXml(
      subtitle ||
        `Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti | Fase ${identity.fase} (${identity.kelas}) | Tahun Ajaran ${identity.tahunAjaran}`,
      { bold: true, size: 19, align: 'center', color: '14532D', spaceAfter: 40, keepNext: true }
    )
  );
  chunks.push(
    paragraphXml(`Dasar Hukum: ${DASAR_HUKUM_TEXT}`, {
      italic: true,
      size: 17,
      align: 'center',
      color: '475569',
      spaceAfter: 160,
    })
  );
  return chunks;
}

function identitasTableXml(identity: SchoolIdentity): string {
  return tableXml(
    [2500, 7100],
    [
      rowXml([
        cellXml([{ text: 'Satuan Pendidikan', bold: true }], 2500, 'F8FAFC'),
        cellXml([{ text: `${identity.namaSekolah} (NPSN: ${identity.npsn})` }], 7100),
      ]),
      rowXml([
        cellXml([{ text: 'Alamat / Kota', bold: true }], 2500, 'F8FAFC'),
        cellXml([{ text: `${identity.alamat}${identity.kotaKabupaten ? `, ${identity.kotaKabupaten}` : ''}` }], 7100),
      ]),
      rowXml([
        cellXml([{ text: 'Fase / Kelas / TA', bold: true }], 2500, 'F8FAFC'),
        cellXml([{ text: `Fase ${identity.fase} (${identity.kelas}) — Tahun Ajaran ${identity.tahunAjaran}` }], 7100),
      ]),
      rowXml([
        cellXml([{ text: 'Guru PAI Penyusun', bold: true }], 2500, 'F8FAFC'),
        cellXml([{ text: `${identity.namaGuru} (NIP. ${identity.nipGuru || '-'})` }], 7100),
      ]),
      rowXml([
        cellXml([{ text: 'Kepala Sekolah', bold: true }], 2500, 'F8FAFC'),
        cellXml([{ text: `${identity.namaKepalaSekolah} (NIP. ${identity.nipKepalaSekolah || '-'})` }], 7100),
      ]),
    ]
  );
}

function signatureTableXml(identity: SchoolIdentity): string {
  return tableXml(
    [4819, 4819],
    [
      rowXml([
        cellXml(
          [
            { text: 'Mengetahui,', size: 19, align: 'center' },
            { text: 'Kepala Sekolah', bold: true, size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: identity.namaKepalaSekolah, bold: true, size: 19, align: 'center' },
            { text: `NIP. ${identity.nipKepalaSekolah || '-'}`, size: 18, align: 'center' },
          ],
          4819,
          undefined,
          true
        ),
        cellXml(
          [
            {
              text: `${identity.kotaKabupaten || 'Indonesia'}, ${identity.tanggalDokumen || '13 Juli 2026'}`,
              size: 19,
              align: 'center',
            },
            { text: 'Guru PAI dan Budi Pekerti', bold: true, size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: '', size: 19, align: 'center' },
            { text: identity.namaGuru, bold: true, size: 19, align: 'center' },
            { text: `NIP. ${identity.nipGuru || '-'}`, size: 18, align: 'center' },
          ],
          4819,
          undefined,
          true
        ),
      ]),
    ]
  );
}

function cpSectionXml(cps: CPItem[], sectionLabel: string): string[] {
  const chunks: string[] = [];
  chunks.push(
    paragraphXml(sectionLabel, {
      bold: true,
      size: 21,
      color: '14532D',
      spaceBefore: 120,
      spaceAfter: 80,
      keepNext: true,
    })
  );
  const cols = [900, 2100, 6600];
  const header = rowXml(
    [
      cellXml([{ text: 'Kode', bold: true, color: 'FFFFFF', align: 'center' }], cols[0], '14532D'),
      cellXml([{ text: 'Elemen', bold: true, color: 'FFFFFF', align: 'center' }], cols[1], '14532D'),
      cellXml(
        [{ text: 'Redaksi Capaian Pembelajaran (Kepka BKPDM No. 020 Tahun 2026)', bold: true, color: 'FFFFFF', align: 'center' }],
        cols[2],
        '14532D'
      ),
    ],
    true
  );
  const rows = cps.map((cp, idx) => {
    const bg = idx % 2 === 1 ? 'F8FAFC' : undefined;
    return rowXml([
      cellXml([{ text: `CP ${cp.code}`, bold: true, align: 'center', size: 18 }], cols[0], bg),
      cellXml([{ text: cp.elemen, bold: true, size: 18 }], cols[1], bg),
      cellXml([{ text: cp.redaksi, size: 18, align: 'both' }], cols[2], bg),
    ]);
  });
  chunks.push(tableXml(cols, [header, ...rows]));
  return chunks;
}

function tpSectionXml(tps: TPItem[], sectionLabel: string): string[] {
  const chunks: string[] = [];
  chunks.push(
    paragraphXml(sectionLabel, {
      bold: true,
      size: 21,
      color: '14532D',
      spaceBefore: 120,
      spaceAfter: 80,
      keepNext: true,
    })
  );

  const tpCols = [950, 1250, 3200, 1500, 2700];
  const tpHeader = rowXml(
    [
      cellXml([{ text: 'Kode TP', bold: true, color: 'FFFFFF', align: 'center' }], tpCols[0], '14532D'),
      cellXml([{ text: 'Elemen / CP', bold: true, color: 'FFFFFF', align: 'center' }], tpCols[1], '14532D'),
      cellXml([{ text: 'Rumusan TP Lengkap', bold: true, color: 'FFFFFF', align: 'center' }], tpCols[2], '14532D'),
      cellXml([{ text: 'Materi & KKO / P5', bold: true, color: 'FFFFFF', align: 'center' }], tpCols[3], '14532D'),
      cellXml([{ text: 'Indikator Mindful / Meaningful / Joyful', bold: true, color: 'FFFFFF', align: 'center' }], tpCols[4], '14532D'),
    ],
    true
  );

  const tpRows = tps.map((tp, idx) => {
    const bg = idx % 2 === 1 ? 'F8FAFC' : undefined;
    return rowXml([
      cellXml([{ text: tp.code, bold: true, align: 'center', size: 18 }], tpCols[0], bg),
      cellXml([{ text: `${tp.elemen} (CP ${tp.cpCode})`, size: 18 }], tpCols[1], bg),
      cellXml([{ text: tp.rumusan, size: 18, align: 'both' }], tpCols[2], bg),
      cellXml(
        [
          { text: `Materi: ${tp.materiPokok}`, bold: true, size: 17 },
          { text: `KKO: ${tp.kko}`, size: 17 },
          { text: `Dimensi P5: ${tp.dimensiP5.join(', ')}`, size: 16, color: '475569', align: 'both' },
        ],
        tpCols[3],
        bg
      ),
      cellXml(
        [
          { text: `Mindful: ${tp.indikatorMindful}`, size: 17, align: 'both' },
          { text: `Meaningful: ${tp.indikatorMeaningful}`, size: 17, align: 'both' },
          { text: `Joyful: ${tp.indikatorJoyful}`, size: 17, align: 'both' },
        ],
        tpCols[4],
        bg
      ),
    ]);
  });

  chunks.push(tableXml(tpCols, [tpHeader, ...tpRows]));
  return chunks;
}

function atpSectionXml(atps: ATPItem[], sectionLabel: string): string[] {
  const chunks: string[] = [];
  chunks.push(
    paragraphXml(sectionLabel, {
      bold: true,
      size: 21,
      color: '14532D',
      spaceBefore: 120,
      spaceAfter: 80,
      keepNext: true,
    })
  );

  const atpCols = [550, 1150, 950, 2650, 650, 2650, 1000];
  const atpHeader = rowXml(
    [
      cellXml([{ text: 'No', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[0], '14532D'),
      cellXml([{ text: 'Semester', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[1], '14532D'),
      cellXml([{ text: 'Kode TP', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[2], '14532D'),
      cellXml([{ text: 'Rumusan TP & Materi', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[3], '14532D'),
      cellXml([{ text: 'JP', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[4], '14532D'),
      cellXml([{ text: 'Aktivitas Pembelajaran Mendalam', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[5], '14532D'),
      cellXml([{ text: 'Asesmen', bold: true, color: 'FFFFFF', align: 'center' }], atpCols[6], '14532D'),
    ],
    true
  );

  const atpRows = atps.map((row, idx) => {
    const bg = idx % 2 === 1 ? 'F8FAFC' : undefined;
    return rowXml([
      cellXml([{ text: String(row.noUrut), bold: true, align: 'center', size: 18 }], atpCols[0], bg),
      cellXml([{ text: row.semester, size: 17 }], atpCols[1], bg),
      cellXml([{ text: row.kodeTP, bold: true, size: 17, align: 'center' }], atpCols[2], bg),
      cellXml(
        [
          { text: row.materi, bold: true, size: 17, color: '14532D' },
          { text: row.rumusanTP, size: 17, align: 'both' },
        ],
        atpCols[3],
        bg
      ),
      cellXml([{ text: `${row.alokasiJP} JP`, bold: true, align: 'center', size: 18 }], atpCols[4], bg),
      cellXml(
        [
          { text: `Mindful (5 menit): ${row.aktivitasMindful}`, size: 16, align: 'both' },
          { text: `Meaningful (25 menit): ${row.aktivitasMeaningful}`, size: 16, align: 'both' },
          { text: `Joyful (10 menit): ${row.aktivitasJoyful}`, size: 16, align: 'both' },
          { text: `Refleksi (5 menit): ${row.aktivitasRefleksi}`, size: 16, align: 'both' },
        ],
        atpCols[5],
        bg
      ),
      cellXml([{ text: row.asesmen, align: 'center', size: 17 }], atpCols[6], bg),
    ]);
  });

  chunks.push(tableXml(atpCols, [atpHeader, ...atpRows]));
  return chunks;
}

function modulBodyXml(identity: SchoolIdentity, modul: ModulAjarItem, includeKop = true): string[] {
  const chunks: string[] = [];
  const kop = getKopInstansiLines(identity);

  if (includeKop) {
    chunks.push(
      paragraphXml(kop.pemerintahDaerah, {
        bold: true,
        size: 22,
        align: 'center',
        color: '1E293B',
        spaceAfter: 20,
      })
    );
    chunks.push(
      paragraphXml(kop.dinasPendidikan, {
        bold: true,
        size: 24,
        align: 'center',
        color: '1E293B',
        spaceAfter: 30,
      })
    );
    chunks.push(
      paragraphXml(identity.namaSekolah.toUpperCase(), {
        bold: true,
        size: 28,
        align: 'center',
        color: '14532D',
        spaceAfter: 30,
      })
    );
    chunks.push(
      paragraphXml(`${identity.alamat} | NPSN: ${identity.npsn} | ${identity.kotaKabupaten}`, {
        size: 18,
        align: 'center',
        color: '475569',
        spaceAfter: 120,
        bottomDoubleBorder: true,
      })
    );
  }

  // Judul Dokumen Sesuai Format PDF Lampiran
  chunks.push(
    paragraphXml('RENCANA PEMBELAJARAN MENDALAM', {
      bold: true,
      size: 24,
      align: 'center',
      color: '111827',
      spaceBefore: 100,
      spaceAfter: 30,
      keepNext: true,
    })
  );
  chunks.push(
    paragraphXml(`${modul.materiPokok} (${modul.kodeTP})`, {
      bold: true,
      size: 22,
      align: 'center',
      color: '14532D',
      spaceAfter: 30,
      keepNext: true,
    })
  );
  chunks.push(
    paragraphXml('KURIKULUM MERDEKA DEEP LEARNING', {
      bold: true,
      size: 20,
      align: 'center',
      color: '1E293B',
      spaceAfter: 25,
    })
  );
  chunks.push(
    paragraphXml('Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses', {
      size: 19,
      align: 'center',
      color: '334155',
      spaceAfter: 20,
    })
  );
  chunks.push(
    paragraphXml('Kepka BKPDM No. 020 Tahun 2026', {
      size: 19,
      align: 'center',
      color: '334155',
      spaceAfter: 140,
    })
  );

  const addPartHeading = (title: string) => {
    chunks.push(
      paragraphXml(title, {
        bold: true,
        size: 21,
        color: '111827',
        spaceBefore: 140,
        spaceAfter: 60,
        keepNext: true,
      })
    );
  };

  const addSubHeading = (title: string) => {
    chunks.push(
      paragraphXml(title, {
        bold: true,
        size: 20,
        color: '14532D',
        spaceBefore: 90,
        spaceAfter: 40,
        keepNext: true,
      })
    );
  };

  const addBodyPara = (text: string, opts?: { indent?: boolean; bold?: boolean; italic?: boolean; size?: number }) => {
    chunks.push(
      paragraphXml(text, {
        bold: opts?.bold,
        italic: opts?.italic,
        size: opts?.size || 20,
        align: 'both',
        line: 360,
        firstLine: opts?.indent ? 709 : 0,
        spaceAfter: 50,
      })
    );
  };

  const jenjangKelas = modul.jenjangKelas || `SD / ${identity.kelas}`;
  const alokasiWaktu = modul.alokasiWaktuDetail || `${modul.alokasiJP} JP (@ 35 Menit)`;
  const metode =
    modul.metodePembelajaran ||
    'Diskusi, Tanya Jawab, Presentasi, Demonstrasi, Ceramah Bermakna';

  // BAGIAN 1: INFORMASI UMUM
  addPartHeading('BAGIAN 1: INFORMASI UMUM');
  const infoRows: [string, string][] = [
    ['Nama Penyusun', `${identity.namaGuru} (NIP. ${identity.nipGuru || '-'})`],
    ['Satuan Pendidikan', `${identity.namaSekolah} (NPSN: ${identity.npsn})`],
    ['Jenjang/Kelas', jenjangKelas],
    ['Fase', modul.fase],
    ['Mata Pelajaran', 'Pendidikan Agama Islam dan Budi Pekerti (PAI)'],
    ['Materi Pokok', modul.materiPokok],
    ['Alokasi Waktu', alokasiWaktu],
    ['Tahun Ajaran / Semester', `${identity.tahunAjaran} / ${extractSemesterLabel(modul.semester)} (${modul.semester})`],
    ['Model Pembelajaran', modul.modelPembelajaran],
    ['Metode', metode],
    ['Target Peserta Didik', modul.targetPesertaDidik],
  ];
  chunks.push(
    tableXml(
      [2700, 6900],
      [
        rowXml(
          [
            cellXml([{ text: 'Komponen', bold: true, size: 19 }], 2700, 'E2E8F0'),
            cellXml([{ text: 'Keterangan', bold: true, size: 19 }], 6900, 'E2E8F0'),
          ],
          true
        ),
        ...infoRows.map(([k, v]) =>
          rowXml([
            cellXml([{ text: k, bold: true, size: 19 }], 2700, 'F8FAFC'),
            cellXml([{ text: v, size: 19, align: 'both' }], 6900),
          ])
        ),
      ]
    )
  );

  // BAGIAN 2: CAPAIAN PEMBELAJARAN (CP)
  addPartHeading('BAGIAN 2: CAPAIAN PEMBELAJARAN (CP)');
  addSubHeading(`FASE ${modul.fase} (CP ${modul.cpCode} — Kepka BKPDM No. 020 Tahun 2026)`);
  addBodyPara(modul.cpRedaksi, { indent: true });
  addSubHeading('Elemen CP yang Dikembangkan');
  (modul.elemenDikembangkan || []).forEach((item) => {
    addBodyPara(`• ${item.elemen}: ${item.deskripsi}`);
  });

  // BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP)
  addPartHeading('BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP)');
  addBodyPara(modul.alurTpRantai || `[${modul.kodeTP}] ${modul.materiPokok}`, { bold: true });
  addBodyPara(`Keterkaitan antar TP: ${modul.keterkaitanAntarTp || modul.pemahamanBermakna}`, {
    italic: true,
    indent: true,
  });

  // BAGIAN 4: TUJUAN PEMBELAJARAN
  addPartHeading('BAGIAN 4: TUJUAN PEMBELAJARAN');
  (modul.tujuanPembelajaranList || [modul.tujuanPembelajaran]).forEach((t, idx) => {
    addBodyPara(`${idx + 1}. ${t}`);
  });

  // BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING)
  addPartHeading('BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING)');
  addSubHeading('A. Pertanyaan Esensial (Essential Questions)');
  modul.pertanyaanPemantik.forEach((q) => addBodyPara(`• ${q}`));
  addSubHeading('B. Konsep Besar (Big Ideas)');
  (modul.konsepBesar || []).forEach((k) => addBodyPara(`• ${k.judul}: ${k.deskripsi}`));
  addSubHeading('C. Transfer Goals');
  (modul.transferGoals || []).forEach((g) => addBodyPara(`• ${g}`));

  // BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334)
  addPartHeading('BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334)');
  if (modul.dimensiProfilLulusan && modul.dimensiProfilLulusan.length > 0) {
    modul.dimensiProfilLulusan.forEach((d) => {
      addBodyPara(`• ${d.dimensi}: Sub-elemen ${d.subElemen}. ${d.deskripsi} (Pengalaman: ${d.pengalaman})`);
    });
  } else {
    addBodyPara(`• ${modul.profilPelajarPancasila.join('; ')}.`);
  }

  // BAGIAN 7: KEGIATAN PEMBELAJARAN
  addPartHeading('BAGIAN 7: KEGIATAN PEMBELAJARAN');
  (modul.pertemuanList || []).forEach((p) => {
    const menitInti = Math.max(45, p.jp * 35 - 25);
    addSubHeading(`PERTEMUAN ${p.pertemuanKe}: ${p.judul} (${p.jp} × 35 menit)`);
    addBodyPara('PENDAHULUAN (±15 menit)', { bold: true });
    p.pendahuluan.forEach((item, idx) => addBodyPara(`${idx + 1}. ${item}`));
    addBodyPara(`KEGIATAN INTI (±${menitInti} menit)`, { bold: true });
    addBodyPara(`▶ TAHAP 1: MEMAHAMI (Mindful)`, { bold: true });
    addBodyPara(p.tahapMemahami, { indent: true });
    addBodyPara(`▶ TAHAP 2: MENGAPLIKASI (Meaningful)`, { bold: true });
    addBodyPara(`Metode: ${p.metodeMengaplikasi}. ${p.tahapMengaplikasi}`, { indent: true });
    addBodyPara(`▶ TAHAP 3: MEREFLEKSI (Joyful)`, { bold: true });
    addBodyPara(p.tahapMerefleksi, { indent: true });
    addBodyPara('PENUTUP (±10 menit)', { bold: true });
    p.penutup.forEach((item, idx) => addBodyPara(`${idx + 1}. ${item}`));
  });

  // BAGIAN 8: ASESMEN
  addPartHeading('BAGIAN 8: ASESMEN');
  addSubHeading('A. Asesmen Diagnostik (Pre-test)');
  (modul.asesmenDiagnostikList || [modul.asesmenDiagnostik]).forEach((q, idx) =>
    addBodyPara(`${idx + 1}. ${q}`)
  );
  addSubHeading('B. Asesmen Formatif (Proses)');
  (modul.asesmenFormatifList || [{ jenis: 'Observasi', keterangan: modul.asesmenFormatif }]).forEach((f) =>
    addBodyPara(`• ${f.jenis}: ${f.keterangan}`)
  );
  addSubHeading('C. Asesmen Sumatif (Akhir)');
  (modul.asesmenSumatifHots || [modul.asesmenSumatif]).forEach((s, idx) =>
    addBodyPara(`${idx + 1}. ${s}`)
  );
  if (modul.rubrikKonseptual && modul.rubrikKonseptual.length > 0) {
    addSubHeading('D. Rubrik Pemahaman Konseptual');
    chunks.push(
      tableXml(
        [2000, 7600],
        [
          rowXml(
            [
              cellXml([{ text: 'Level', bold: true, size: 18 }], 2000, 'E2E8F0'),
              cellXml([{ text: 'Deskriptor', bold: true, size: 18 }], 7600, 'E2E8F0'),
            ],
            true
          ),
          ...modul.rubrikKonseptual.map((r) =>
            rowXml([
              cellXml([{ text: r.level, bold: true, size: 18 }], 2000, 'F8FAFC'),
              cellXml([{ text: r.deskripsi, size: 18, align: 'both' }], 7600),
            ])
          ),
        ]
      )
    );
  }

  // BAGIAN 9: PENGAYAAN DAN REMEDIAL
  addPartHeading('BAGIAN 9: PENGAYAAN DAN REMEDIAL');
  addSubHeading('Program Pengayaan');
  (modul.pengayaanList || [modul.pengayaan]).forEach((item) => addBodyPara(`• ${item}`));
  addSubHeading('Program Remedial');
  (modul.remedialList || [modul.remedial]).forEach((item) => addBodyPara(`• ${item}`));

  // BAGIAN 10: REFLEKSI GURU
  addPartHeading('BAGIAN 10: REFLEKSI GURU');
  (modul.refleksiGuruList || [modul.refleksiPendidik]).forEach((q, idx) => {
    addBodyPara(`${idx + 1}. ${q}`);
    addBodyPara('   Jawaban: ......................................................................', {
      italic: true,
    });
  });

  // BAGIAN 11: LAMPIRAN
  addPartHeading('BAGIAN 11: LAMPIRAN');
  addSubHeading('A. Lembar Kerja Peserta Didik (LKPD)');
  chunks.push(
    paragraphXml(`LEMBAR KERJA PESERTA DIDIK (LKPD) — ${modul.materiPokok}`, {
      bold: true,
      size: 21,
      align: 'center',
      color: '14532D',
      spaceAfter: 80,
    })
  );

  (modul.lkpdPertemuanList || []).forEach((lkpd) => {
    addSubHeading(`LKPD PERTEMUAN ${lkpd.pertemuanKe}`);
    chunks.push(
      tableXml(
        [2700, 6900],
        [
          rowXml(
            [
              cellXml([{ text: 'Komponen', bold: true, size: 18 }], 2700, 'E2E8F0'),
              cellXml([{ text: 'Keterangan', bold: true, size: 18 }], 6900, 'E2E8F0'),
            ],
            true
          ),
          rowXml([
            cellXml([{ text: 'Mata Pelajaran', bold: true, size: 18 }], 2700, 'F8FAFC'),
            cellXml([{ text: lkpd.mataPelajaran, size: 18 }], 6900),
          ]),
          rowXml([
            cellXml([{ text: 'Kelas', bold: true, size: 18 }], 2700, 'F8FAFC'),
            cellXml([{ text: lkpd.kelas, size: 18 }], 6900),
          ]),
          rowXml([
            cellXml([{ text: 'Materi', bold: true, size: 18 }], 2700, 'F8FAFC'),
            cellXml([{ text: lkpd.materi, size: 18 }], 6900),
          ]),
          rowXml([
            cellXml([{ text: 'Alokasi Waktu', bold: true, size: 18 }], 2700, 'F8FAFC'),
            cellXml([{ text: lkpd.alokasiWaktu, size: 18 }], 6900),
          ]),
        ]
      )
    );
    addBodyPara('A. Kompetensi yang Dikembangkan', { bold: true });
    lkpd.kompetensi.forEach((k, i) => addBodyPara(`${i + 1}. ${k}`));
    addBodyPara('B. Tujuan Pembelajaran', { bold: true });
    addBodyPara(lkpd.tujuan, { indent: true });
    addBodyPara('C. Petunjuk Kerja', { bold: true });
    lkpd.petunjukKerja.forEach((pk, i) => addBodyPara(`${i + 1}. ${pk}`));
    addBodyPara('D. Kegiatan/Tugas', { bold: true });
    lkpd.kegiatanTugas.forEach((t, i) => addBodyPara(`${i + 1}. ${t}`));
    addBodyPara('E. Tabel Kerja', { bold: true });

    const numCols = Math.max(1, lkpd.tabelKerjaHeaders.length);
    const colW = Math.floor(9600 / numCols);
    const colWidths = Array(numCols).fill(colW);
    colWidths[numCols - 1] += 9600 - colW * numCols;
    chunks.push(
      tableXml(colWidths, [
        rowXml(
          lkpd.tabelKerjaHeaders.map((h, idx) =>
            cellXml([{ text: h, bold: true, size: 17 }], colWidths[idx], 'E2E8F0')
          ),
          true
        ),
        ...lkpd.tabelKerjaRows.map((row) =>
          rowXml(
            row.map((c, idx) => cellXml([{ text: c || ' ', size: 17 }], colWidths[idx]))
          )
        ),
      ])
    );

    addBodyPara('F. Pertanyaan Refleksi', { bold: true });
    lkpd.pertanyaanRefleksi.forEach((pr, i) =>
      addBodyPara(`${i + 1}. ${pr} (....................................................)`)
    );
    addBodyPara('G. Penilaian', { bold: true });
    chunks.push(
      tableXml(
        [3000, 1800, 4800],
        [
          rowXml(
            [
              cellXml([{ text: 'Nama', bold: true, size: 18 }], 3000, 'E2E8F0'),
              cellXml([{ text: 'Skor (1-100)', bold: true, size: 18 }], 1800, 'E2E8F0'),
              cellXml([{ text: 'Catatan Guru', bold: true, size: 18 }], 4800, 'E2E8F0'),
            ],
            true
          ),
          rowXml([
            cellXml([{ text: ' ', size: 18 }], 3000),
            cellXml([{ text: ' ', size: 18 }], 1800),
            cellXml([{ text: ' ', size: 18 }], 4800),
          ]),
        ]
      )
    );
  });

  // B. BAHAN AJAR (8 BAGIAN)
  if (modul.bahanAjar) {
    const ba = modul.bahanAjar;
    addSubHeading('B. BAHAN AJAR');
    addBodyPara(`${modul.materiPokok} — Mata Pelajaran: PAI | ${jenjangKelas} | Kurikulum Merdeka`, {
      bold: true,
    });

    addSubHeading('BAGIAN 1: RINGKASAN MATERI');
    addBodyPara(ba.ringkasanIntro, { indent: true });
    addBodyPara('Definisi Penting:', { bold: true });
    ba.definisiPenting.forEach((d) => addBodyPara(`• ${d.istilah}: ${d.arti}`));
    addBodyPara(ba.ringkasanPenutup, { indent: true });

    addSubHeading('BAGIAN 2: PETA KONSEP');
    chunks.push(
      tableXml(
        [4800, 4800],
        [
          rowXml([
            cellXml([{ text: ba.petaKonsepTop, bold: true, align: 'center', size: 18 }], 4800, 'FEF3C7'),
            cellXml([{ text: 'Peta Konsep Pembelajaran', bold: true, align: 'center', size: 18 }], 4800, 'FEF3C7'),
          ]),
          rowXml(
            ba.petaKonsepCabang.slice(0, 2).map((cab, idx) =>
              cellXml(
                [
                  { text: cab.judul, bold: true, align: 'center', size: 18 },
                  { text: cab.subjudul, italic: true, align: 'center', size: 17 },
                  { text: cab.poin, align: 'center', size: 17 },
                ],
                4800,
                idx === 0 ? 'ECFDF5' : 'FFF1F2'
              )
            )
          ),
        ]
      )
    );

    addSubHeading('BAGIAN 3: MATERI INTI');
    ba.materiInti.forEach((sub) => {
      addBodyPara(sub.judul, { bold: true });
      addBodyPara(sub.uraian, { indent: true });
      sub.poin.forEach((pt) => addBodyPara(`• ${pt}`));
    });
    if (ba.tabelContohHeaders && ba.tabelContohRows) {
      const nCols = ba.tabelContohHeaders.length;
      const cw = Math.floor(9600 / nCols);
      const widths = Array(nCols).fill(cw);
      widths[nCols - 1] += 9600 - cw * nCols;
      chunks.push(
        tableXml(widths, [
          rowXml(
            ba.tabelContohHeaders.map((h, i) =>
              cellXml([{ text: h, bold: true, color: 'FFFFFF', size: 18 }], widths[i], '14532D')
            ),
            true
          ),
          ...ba.tabelContohRows.map((row) =>
            rowXml(row.map((c, i) => cellXml([{ text: c, size: 18 }], widths[i])))
          ),
        ])
      );
    }

    addSubHeading('BAGIAN 4: CONTOH SOAL DAN PEMBAHASAN');
    ba.contohSoal.forEach((cs, idx) => {
      addBodyPara(`Contoh Soal ${idx + 1}`, { bold: true });
      addBodyPara(cs.pertanyaan);
      (cs.opsi || []).forEach((op) => addBodyPara(`   ${op}`));
      addBodyPara(`Pembahasan: ${cs.pembahasan}`);
      addBodyPara(`Jawaban: ${cs.jawaban}`, { bold: true });
    });

    addSubHeading('BAGIAN 5: LATIHAN SOAL');
    addBodyPara('I. Pilihan Ganda', { bold: true });
    ba.latihanPG.forEach((pg, idx) => {
      addBodyPara(`${idx + 1}. ${pg.pertanyaan}`);
      addBodyPara(`   ${pg.opsi.join('   ')}`);
    });
    addBodyPara('II. Isian Singkat', { bold: true });
    ba.latihanIsian.forEach((is, idx) => addBodyPara(`${idx + 1}. ${is}`));
    addBodyPara('III. Uraian/Essay', { bold: true });
    ba.latihanUraian.forEach((ur, idx) => addBodyPara(`${idx + 1}. ${ur}`));

    addSubHeading('BAGIAN 6: KUNCI JAWABAN');
    addBodyPara('Pilihan Ganda', { bold: true });
    ba.kunciPG.forEach((k, idx) => addBodyPara(`${idx + 1}. ${k}`));
    addBodyPara('Isian Singkat', { bold: true });
    ba.kunciIsian.forEach((k, idx) => addBodyPara(`${idx + 1}. ${k}`));
    addBodyPara('Uraian/Essay', { bold: true });
    ba.kunciUraian.forEach((k, idx) => addBodyPara(`${idx + 1}. ${k}`));

    addSubHeading('BAGIAN 7: RANGKUMAN');
    ba.rangkuman.forEach((r) => addBodyPara(`• ${r}`));

    addSubHeading('BAGIAN 8: GLOSARIUM');
    chunks.push(
      tableXml(
        [2600, 7000],
        [
          rowXml(
            [
              cellXml([{ text: 'Istilah', bold: true, color: 'FFFFFF', size: 18 }], 2600, '14532D'),
              cellXml([{ text: 'Definisi', bold: true, color: 'FFFFFF', size: 18 }], 7000, '14532D'),
            ],
            true
          ),
          ...modul.glosarium.map((g, i) =>
            rowXml([
              cellXml([{ text: g.istilah, bold: true, size: 18 }], 2600, i % 2 === 1 ? 'F8FAFC' : undefined),
              cellXml([{ text: g.arti, size: 18, align: 'both' }], 7000, i % 2 === 1 ? 'F8FAFC' : undefined),
            ])
          ),
        ]
      )
    );

    addSubHeading('Daftar Pustaka');
    modul.daftarPustaka.forEach((d, idx) => addBodyPara(`${idx + 1}. ${d}`));
  }

  addSubHeading('C. Tanda Tangan Pengesahan');
  chunks.push(paragraphXml('', { spaceAfter: 60 }));
  chunks.push(signatureTableXml(identity));
  return chunks;
}

function wrapWordDocument(bodyChunks: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyChunks.join('\n')}
    <w:sectPr>
      <w:pgSz w:w="12189" w:h="18709"/>
      <w:pgMar w:top="1134" w:right="1021" w:bottom="1134" w:left="1247" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function buildDocumentXml(
  identity: SchoolIdentity,
  tps: TPItem[],
  atps: ATPItem[],
  mode: DocxExportMode,
  options?: { cps?: CPItem[]; modul?: ModulAjarItem | null; allModuls?: ModulAjarItem[] }
): string {
  const cps = options?.cps || CP_DATABASE.filter((c) => c.fase === identity.fase);
  const chunks: string[] = [];

  if (mode === 'modul' && options?.modul) {
    chunks.push(...modulBodyXml(identity, options.modul, true));
    return wrapWordDocument(chunks);
  }

  if (mode === 'all_modul') {
    const list = options?.allModuls || [];
    list.forEach((m, idx) => {
      if (idx > 0) chunks.push(pageBreakXml());
      chunks.push(...modulBodyXml(identity, m, idx === 0));
    });
    return wrapWordDocument(chunks);
  }

  const titleMap: Record<string, string> = {
    cp: 'CAPAIAN PEMBELAJARAN (CP) PAI & BUDI PEKERTI',
    tp: 'DAFTAR TUJUAN PEMBELAJARAN (TP) BERBASIS PEMBELAJARAN MENDALAM',
    atp: 'ALUR TUJUAN PEMBELAJARAN (ATP) BERBASIS PEMBELAJARAN MENDALAM',
    both: 'PERANGKAT PEMBELAJARAN MENDALAM: TUJUAN PEMBELAJARAN (TP) & ALUR TUJUAN PEMBELAJARAN (ATP)',
    cp_tp_atp: 'PERANGKAT PEMBELAJARAN MENDALAM: CP, TP, DAN ATP',
    full_bundle: 'PERANGKAT PEMBELAJARAN LENGKAP: CP, TP, ATP & MODUL AJAR KURIKULUM MERDEKA',
  };

  chunks.push(...kopSekolahXml(identity, titleMap[mode] || titleMap.both));
  chunks.push(identitasTableXml(identity));
  chunks.push(paragraphXml('', { spaceAfter: 100 }));

  if (mode === 'cp' || mode === 'cp_tp_atp' || mode === 'full_bundle') {
    chunks.push(...cpSectionXml(cps, 'A. CAPAIAN PEMBELAJARAN (CP) — KEPKA BKPDM NO. 020 TAHUN 2026'));
    chunks.push(paragraphXml('', { spaceAfter: 120 }));
  }

  if (mode === 'tp' || mode === 'both' || mode === 'cp_tp_atp' || mode === 'full_bundle') {
    const label =
      mode === 'tp' || mode === 'both'
        ? 'A. TUJUAN PEMBELAJARAN (TP) PEMBELAJARAN MENDALAM'
        : 'B. TUJUAN PEMBELAJARAN (TP) PEMBELAJARAN MENDALAM';
    if (mode === 'cp_tp_atp' || mode === 'full_bundle') chunks.push(pageBreakXml());
    chunks.push(...tpSectionXml(tps, label));
    chunks.push(paragraphXml('', { spaceAfter: 120 }));
  }

  if (mode === 'atp' || mode === 'both' || mode === 'cp_tp_atp' || mode === 'full_bundle') {
    const label =
      mode === 'atp'
        ? 'A. ALUR TUJUAN PEMBELAJARAN (ATP) PEMBELAJARAN MENDALAM'
        : mode === 'both'
        ? 'B. ALUR TUJUAN PEMBELAJARAN (ATP) PEMBELAJARAN MENDALAM'
        : 'C. ALUR TUJUAN PEMBELAJARAN (ATP) PEMBELAJARAN MENDALAM';
    if (mode === 'both' || mode === 'cp_tp_atp' || mode === 'full_bundle') chunks.push(pageBreakXml());
    chunks.push(...atpSectionXml(atps, label));
    chunks.push(paragraphXml('', { spaceAfter: 160 }));
  }

  chunks.push(signatureTableXml(identity));

  if (mode === 'full_bundle') {
    const list = options?.allModuls || [];
    list.forEach((m) => {
      chunks.push(pageBreakXml());
      chunks.push(...modulBodyXml(identity, m, false));
    });
  }

  return wrapWordDocument(chunks);
}

// Pure TS CRC32 + Uncompressed ZIP builder for genuine .docx files
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(entries: { name: string; content: string }[]): Uint8Array {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = encoder.encode(entry.content);
    const crc = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    localParts.push(localHeader, dataBytes);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((acc, p) => acc + p.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalSize = offset + centralSize + eocd.length;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  for (const part of localParts) {
    result.set(part, pos);
    pos += part.length;
  }
  for (const part of centralParts) {
    result.set(part, pos);
    pos += part.length;
  }
  result.set(eocd, pos);
  return result;
}

function packageDocx(documentXml: string): Blob {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;

  const zipBytes = buildZip([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'word/_rels/document.xml.rels', content: docRels },
    { name: 'word/document.xml', content: documentXml },
  ]);

  const buffer = zipBytes.buffer.slice(zipBytes.byteOffset, zipBytes.byteOffset + zipBytes.byteLength) as ArrayBuffer;
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

function triggerDownload(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}

export function createDocxBlob(
  identity: SchoolIdentity,
  tps: TPItem[],
  atps: ATPItem[],
  mode: DocxExportMode,
  options?: { cps?: CPItem[]; modul?: ModulAjarItem | null; allModuls?: ModulAjarItem[] }
): Blob {
  return packageDocx(buildDocumentXml(identity, tps, atps, mode, options));
}

export function downloadDocxFile(
  identity: SchoolIdentity,
  tps: TPItem[],
  atps: ATPItem[],
  mode: DocxExportMode,
  options?: { cps?: CPItem[]; modul?: ModulAjarItem | null; allModuls?: ModulAjarItem[] }
): string {
  const blob = createDocxBlob(identity, tps, atps, mode, options);
  const safeSchool = identity.namaSekolah.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'Sekolah';
  const suffixMap: Record<DocxExportMode, string> = {
    cp: 'CP_Kepka_020_2026',
    tp: 'TP_Saja',
    atp: 'ATP_Saja',
    both: 'TP_dan_ATP',
    cp_tp_atp: 'CP_TP_dan_ATP',
    modul: `Modul_Ajar_${(options?.modul?.kodeTP || 'Unit').replace(/[^a-zA-Z0-9]+/g, '_')}`,
    all_modul: 'Semua_Modul_Ajar',
    full_bundle: 'Perangkat_Lengkap_CP_TP_ATP_Modul_Ajar',
  };
  const filename = `${suffixMap[mode]}_PAI_Fase_${identity.fase}_${safeSchool}.docx`;
  return triggerDownload(blob, filename);
}

export function createModulAjarDocxBlob(identity: SchoolIdentity, modul: ModulAjarItem): Blob {
  return createDocxBlob(identity, [], [], 'modul', { modul });
}

export function downloadModulAjarDocx(identity: SchoolIdentity, modul: ModulAjarItem): string {
  return downloadDocxFile(identity, [], [], 'modul', { modul });
}
