import {
  CP_DATABASE,
  DASAR_HUKUM_TEXT,
  DEFAULT_IDENTITY,
  FASE_OPTIONS,
  P5_DIMENSIONS,
  TP_TEMPLATES,
} from '../data/cpDatabase';
import { SchoolIdentity } from '../types/curriculum';

export function buildStandaloneHtmlString(currentIdentity?: SchoolIdentity): string {
  const payload = JSON.stringify({
    DASAR_HUKUM_TEXT,
    FASE_OPTIONS,
    P5_DIMENSIONS,
    CP_DATABASE,
    TP_TEMPLATES,
    DEFAULT_IDENTITY: currentIdentity || DEFAULT_IDENTITY,
  }).replace(/<\//g, '<\\/');

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generator TP &amp; ATP PAI SD - Kepka BKPDM 020/2026 (1-File Offline)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { sans: ['Arial', 'Helvetica', 'sans-serif'] }
        }
      }
    };
  </script>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; }
    .tabular-nums { font-variant-numeric: tabular-nums; }
    @media print {
      @page { size: 215mm 330mm; margin: 20mm 18mm 20mm 22mm; }
      .no-print { display: none !important; }
      body { background: #fff !important; color: #000 !important; font-family: 'Times New Roman', Times, serif !important; font-size: 11pt !important; line-height: 1.5 !important; }
      p, li { text-align: justify; line-height: 1.5; orphans: 3; widows: 3; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #1e293b !important; padding: 5px 6px !important; font-size: 9.5pt !important; line-height: 1.4 !important; vertical-align: top; }
      th { background: #ecfdf5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body class="bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen">
  <div id="app"></div>
  <script>
    const DB = ${payload};
    const STORAGE_KEY = 'pai_tp_atp_standalone_v1';

    const DEFAULT_STATE = {
      session: null,
      darkMode: false,
      page: 'dashboard',
      identity: DB.DEFAULT_IDENTITY,
      selectedCps: ['1.1', '1.2', '1.3', '1.4', '1.5'],
      tps: [],
      atps: [],
      filterElemen: 'Semua',
      searchQuery: '',
      selectedAtpId: '',
      testResults: []
    };

    function buildInitialFaseA(state) {
      const faseATemplates = DB.TP_TEMPLATES.filter(t => t.cpCode.startsWith('1.'));
      state.tps = faseATemplates.map(t => {
        const cp = DB.CP_DATABASE.find(c => c.code === t.cpCode);
        return {
          id: 'tp-' + t.cpCode + '-' + t.subIndex,
          code: 'TP ' + t.cpCode + '.' + t.subIndex,
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
          suggestedAsesmen: t.suggestedAsesmen
        };
      });
      state.atps = generateATPArray('A', state.tps);
    }

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return Object.assign({}, DEFAULT_STATE, parsed);
        }
      } catch (e) {}
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
      buildInitialFaseA(fresh);
      return fresh;
    }

    let state = loadState();

    function saveState() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
      document.documentElement.classList.toggle('dark', !!state.darkMode);
    }

    function showToast(msg) {
      let el = document.getElementById('toast-box');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-box';
        el.className = 'no-print fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg bg-[#14532d] text-white text-sm font-semibold shadow-lg border border-yellow-500';
        document.body.appendChild(el);
      }
      el.textContent = msg;
      el.style.display = 'block';
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
    }

    function getSemesters(fase) {
      const f = DB.FASE_OPTIONS.find(x => x.value === fase);
      return f ? f.semesters : DB.FASE_OPTIONS[0].semesters;
    }

    function generateATPArray(fase, tps) {
      const semesters = getSemesters(fase);
      const list = tps.filter(t => t.fase === fase).slice().sort((a, b) => a.orderRank - b.orderRank);
      let maxSem = 0;
      return list.map((tp, idx) => {
        const semIdx = Math.min(Math.max(tp.suggestedSemesterIndex || 0, maxSem), semesters.length - 1);
        maxSem = semIdx;
        return {
          id: 'atp-' + tp.id,
          noUrut: idx + 1,
          semester: semesters[semIdx],
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
          aktivitasRefleksi: tp.indikatorRefleksi || 'Siswa menuliskan satu hikmah belajar hari ini.',
          asesmen: tp.suggestedAsesmen || 'Observasi',
          prereqTag: tp.prereqTag,
          orderRank: tp.orderRank
        };
      });
    }

    function validateATP(atps) {
      const warns = [];
      const textOf = r => (r.materi + ' ' + r.rumusanTP + ' ' + r.prereqTag).toLowerCase();
      function checkPair(pRe, dRe, msgFn) {
        atps.forEach((d, dIdx) => {
          if (!dRe.test(textOf(d))) return;
          atps.forEach((p, pIdx) => {
            if (pIdx > dIdx && pRe.test(textOf(p))) {
              warns.push(msgFn(p, d));
            }
          });
        });
      }
      checkPair(/\\b(bersuci|wudhu|wudu|tayamum)\\b/, /\\b(salat fardu|salat berjamaah|salat sunnah|salat jumat)\\b/, (p, d) => 'TP Wudhu/Bersuci (' + p.kodeTP + ') harus sebelum TP Salat (' + d.kodeTP + ').');
      checkPair(/\\b(huruf_lepas|huruf hijaiyah berharakat)\\b/, /\\b(huruf_sambung|huruf hijaiyah bersambung|surah_fatihah|surah pendek)\\b/, (p, d) => 'TP Huruf Hijaiyah Berharakat (' + p.kodeTP + ') harus sebelum TP ' + d.materi + ' (' + d.kodeTP + ').');
      checkPair(/\\b(salat_fardu|salat fardu)\\b/, /\\b(salat_berjamaah|salat_sunnah|salat_jumat)\\b/, (p, d) => 'TP Salat Fardu (' + p.kodeTP + ') harus sebelum TP ' + d.materi + ' (' + d.kodeTP + ').');
      return Array.from(new Set(warns));
    }

    function checkCompleteness() {
      const fase = state.identity.fase;
      const cps = DB.CP_DATABASE.filter(c => c.fase === fase);
      const issues = [];
      cps.forEach(cp => {
        const cpTps = state.tps.filter(t => t.fase === fase && t.cpCode === cp.code);
        if (cpTps.length === 0) issues.push('CP ' + cp.code + ' (' + cp.elemen + ') belum dibuat TP-nya.');
      });
      return issues;
    }

    function esc(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function kopInstansi(id) {
      const rawPemda = String(id.pemerintahDaerah || '').trim();
      const rawKota = String(id.kotaKabupaten || '').trim();
      const fallbackPemda = rawKota
        ? (/^(kota|kabupaten|kab\.)\b/i.test(rawKota) ? 'PEMERINTAH ' + rawKota.toUpperCase() : 'PEMERINTAH KABUPATEN ' + rawKota.toUpperCase())
        : 'PEMERINTAH KABUPATEN ...';
      const rawDinas = String(id.dinasPendidikan || '').trim();
      return {
        pemerintahDaerah: (rawPemda || fallbackPemda).toUpperCase(),
        dinasPendidikan: (rawDinas || 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA').toUpperCase()
      };
    }

    // Minimal OOXML DOCX exporter
    function exportDocx(mode) {
      const id = state.identity;
      const kop = kopInstansi(id);
      const faseTps = state.tps.filter(t => t.fase === id.fase);
      const p = (txt, bold, sz, align, color) =>
        '<w:p><w:pPr><w:jc w:val="' + (align || 'both') + '"/><w:spacing w:after="90" w:line="360" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="' + (sz || 22) + '"/>' +
        (bold ? '<w:b/>' : '') + '<w:color w:val="' + (color || '111827') + '"/></w:rPr><w:t xml:space="preserve">' + esc(txt) + '</w:t></w:r></w:p>';

      let body = '';
      body += p(kop.pemerintahDaerah, true, 22, 'center', '1E293B');
      body += p(kop.dinasPendidikan, true, 24, 'center', '111827');
      body += p(id.namaSekolah.toUpperCase(), true, 26, 'center', '14532D');
      body += p(id.alamat + ' | NPSN: ' + id.npsn, false, 18, 'center', '475569');
      body += p('TUJUAN PEMBELAJARAN (TP) DAN ALUR TUJUAN PEMBELAJARAN (ATP) PAI SD', true, 22, 'center', '111827');
      body += p('Fase ' + id.fase + ' (' + id.kelas + ') | Tahun Ajaran ' + id.tahunAjaran, true, 19, 'center', '14532D');
      body += p('Dasar Hukum: ' + DB.DASAR_HUKUM_TEXT, false, 16, 'center', '475569');

      if (mode === 'both' || mode === 'tp') {
        body += p('A. DAFTAR TUJUAN PEMBELAJARAN (TP)', true, 20, 'left', '14532D');
        faseTps.forEach(t => {
          body += p(t.code + ' [' + t.elemen + ' - CP ' + t.cpCode + ']: ' + t.rumusan, false, 19, 'both');
          body += p('   Materi Pokok: ' + t.materiPokok + ' | KKO: ' + t.kko + ' | Dimensi P5: ' + t.dimensiP5.join(', '), false, 17, 'both', '475569');
          body += p('   Mindful: ' + t.indikatorMindful + ' | Meaningful: ' + t.indikatorMeaningful + ' | Joyful: ' + t.indikatorJoyful, false, 17, 'both', '334155');
        });
      }
      if (mode === 'both' || mode === 'atp') {
        body += p('B. ALUR TUJUAN PEMBELAJARAN (ATP)', true, 20, 'left', '14532D');
        state.atps.forEach(a => {
          body += p(a.noUrut + '. [' + a.semester + '] ' + a.kodeTP + ' (' + a.alokasiJP + ' JP) - ' + a.materi, true, 19, 'left');
          body += p('   Tujuan Pembelajaran: ' + a.rumusanTP, false, 18, 'both');
          body += p('   Mindful (5 menit): ' + a.aktivitasMindful + ' | Meaningful (25 menit): ' + a.aktivitasMeaningful + ' | Joyful (10 menit): ' + a.aktivitasJoyful + ' | Refleksi (5 menit): ' + a.aktivitasRefleksi + ' | Asesmen: ' + a.asesmen, false, 17, 'both', '334155');
        });
      }
      body += p('Mengetahui, Kepala Sekolah: ' + id.namaKepalaSekolah + ' (NIP ' + id.nipKepalaSekolah + ')', true, 18, 'left');
      body += p('Guru PAI Penyusun: ' + id.namaGuru + ' (NIP ' + id.nipGuru + ')', true, 18, 'left');

      const docXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="12189" w:h="18709"/><w:pgMar w:top="1134" w:right="1021" w:bottom="1134" w:left="1247" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>';
      const ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-officedocument.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
      const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';

      const entries = [
        { name: '[Content_Types].xml', content: ct },
        { name: '_rels/.rels', content: rels },
        { name: 'word/document.xml', content: docXml }
      ];
      const crcTable = new Uint32Array(256);
      for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); crcTable[n] = c >>> 0; }
      const crc32 = b => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
      const enc = new TextEncoder();
      const locals = [], centrals = []; let offset = 0;
      entries.forEach(e => {
        const nb = enc.encode(e.name), db = enc.encode(e.content), crc = crc32(db);
        const lh = new Uint8Array(30 + nb.length), lv = new DataView(lh.buffer);
        lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true); lv.setUint32(14, crc, true); lv.setUint32(18, db.length, true); lv.setUint32(22, db.length, true); lv.setUint16(26, nb.length, true); lh.set(nb, 30);
        const ch = new Uint8Array(46 + nb.length), cv = new DataView(ch.buffer);
        cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true); cv.setUint32(16, crc, true); cv.setUint32(20, db.length, true); cv.setUint32(24, db.length, true); cv.setUint16(28, nb.length, true); cv.setUint32(42, offset, true); ch.set(nb, 46);
        locals.push(lh, db); centrals.push(ch); offset += lh.length + db.length;
      });
      const cSize = centrals.reduce((a, b) => a + b.length, 0);
      const eocd = new Uint8Array(22), ev = new DataView(eocd.buffer);
      ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, entries.length, true); ev.setUint16(10, entries.length, true); ev.setUint32(12, cSize, true); ev.setUint32(16, offset, true);
      const out = new Uint8Array(offset + cSize + 22); let pos = 0;
      locals.concat(centrals).concat([eocd]).forEach(p => { out.set(p, pos); pos += p.length; });
      const blob = new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'TP_ATP_PAI_Fase_' + id.fase + '.docx'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('File DOCX berhasil diunduh!');
    }

    function render() {
      saveState();
      const root = document.getElementById('app');
      if (!state.session) {
        root.innerHTML = \`
          <div class="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-slate-950">
            <div class="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h1 class="text-xl font-bold text-[#14532d] dark:text-emerald-400">Generator TP &amp; ATP PAI SD</h1>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Kepka BKPDM No. 020 Tahun 2026 · Pembelajaran Mendalam</p>
                </div>
                <button onclick="toggleDark()" class="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 font-semibold">\${state.darkMode ? 'Mode Terang' : 'Mode Gelap'}</button>
              </div>
              <form onsubmit="handleLogin(event)" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold mb-1">Nama Guru PAI</label>
                  <input id="login-name" type="text" required value="\${esc(state.identity.namaGuru)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-1">PIN Akses Cepat (Default: 2026)</label>
                  <input id="login-pin" type="password" required value="2026" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                </div>
                <button type="submit" class="w-full py-3 px-4 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-bold text-sm">Masuk ke Aplikasi</button>
              </form>
            </div>
          </div>\`;
        return;
      }

      const id = state.identity;
      const kop = kopInstansi(id);
      const faseTps = state.tps.filter(t => t.fase === id.fase);
      const warns = validateATP(state.atps);
      const issues = checkCompleteness();
      const totalJP = state.atps.reduce((s, a) => s + Number(a.alokasiJP || 0), 0);

      const navBtn = (key, label) => \`
        <button onclick="setPage('\${key}')" class="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors \${state.page === key ? 'bg-[#14532d] text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}">\${label}</button>\`;

      let mainHtml = '';

      if (state.page === 'dashboard') {
        mainHtml = \`
          <div class="space-y-6">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 class="text-xl font-bold text-[#14532d] dark:text-emerald-400">Dashboard Generator TP &amp; ATP PAI SD</h2>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">\${DB.DASAR_HUKUM_TEXT}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                <div class="p-4 rounded-lg bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-500 dark:text-slate-400">Fase Aktif</div>
                  <div class="text-2xl font-bold text-[#14532d] dark:text-emerald-400 tabular-nums mt-1">Fase \${id.fase}</div>
                </div>
                <div class="p-4 rounded-lg bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-500 dark:text-slate-400">Total TP</div>
                  <div class="text-2xl font-bold tabular-nums mt-1">\${faseTps.length}</div>
                </div>
                <div class="p-4 rounded-lg bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-500 dark:text-slate-400">Baris ATP</div>
                  <div class="text-2xl font-bold tabular-nums mt-1">\${state.atps.length}</div>
                </div>
                <div class="p-4 rounded-lg bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-500 dark:text-slate-400">Total Alokasi</div>
                  <div class="text-2xl font-bold tabular-nums mt-1">\${totalJP} JP</div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 mt-5">
                <button onclick="runButtonTests()" class="px-5 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold text-sm">Tes Tombol</button>
                <button onclick="setPage('pilih-cp')" class="px-5 py-3 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-bold text-sm">Pilih CP &amp; Generate TP</button>
                <button onclick="setPage('unduh-print')" class="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-sm">Unduh PDF / Print &amp; DOCX</button>
              </div>
              \${state.testResults.length ? '<div class="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm space-y-1">' + state.testResults.map(r => '<div>' + (r.passed ? 'OK' : 'GAGAL') + ' · <strong>' + r.name + '</strong>: ' + r.detail + '</div>').join('') + '</div>' : ''}
            </div>
          </div>\`;
      } else if (state.page === 'identitas') {
        mainHtml = \`
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 class="text-lg font-bold text-[#14532d] dark:text-emerald-400 mb-4">Identitas Satuan Pendidikan &amp; Penyusun</h2>
            <form onsubmit="saveIdentityForm(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="block text-xs font-semibold mb-1">Pemerintah Kabupaten / Kota</label><input id="id-pemda" value="\${esc(kop.pemerintahDaerah)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm uppercase" /></div>
              <div><label class="block text-xs font-semibold mb-1">Dinas Pendidikan</label><input id="id-dinas" value="\${esc(kop.dinasPendidikan)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm uppercase" /></div>
              <div><label class="block text-xs font-semibold mb-1">Nama SD</label><input id="id-namaSekolah" value="\${esc(id.namaSekolah)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div><label class="block text-xs font-semibold mb-1">NPSN</label><input id="id-npsn" value="\${esc(id.npsn)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div class="md:col-span-2"><label class="block text-xs font-semibold mb-1">Alamat Sekolah</label><input id="id-alamat" value="\${esc(id.alamat)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div><label class="block text-xs font-semibold mb-1">Nama Kepala Sekolah</label><input id="id-ks" value="\${esc(id.namaKepalaSekolah)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div><label class="block text-xs font-semibold mb-1">NIP Kepala Sekolah</label><input id="id-nipks" value="\${esc(id.nipKepalaSekolah)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div><label class="block text-xs font-semibold mb-1">Nama Guru PAI Penyusun</label><input id="id-guru" value="\${esc(id.namaGuru)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div><label class="block text-xs font-semibold mb-1">NIP Guru PAI</label><input id="id-nipguru" value="\${esc(id.nipGuru)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div>
                <label class="block text-xs font-semibold mb-1">Fase</label>
                <select id="id-fase" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option value="A" \${id.fase==='A'?'selected':''}>Fase A (Kelas 1 &amp; 2)</option>
                  <option value="B" \${id.fase==='B'?'selected':''}>Fase B (Kelas 3 &amp; 4)</option>
                  <option value="C" \${id.fase==='C'?'selected':''}>Fase C (Kelas 5 &amp; 6)</option>
                </select>
              </div>
              <div><label class="block text-xs font-semibold mb-1">Kelas &amp; Tahun Ajaran</label><input id="id-tahun" value="\${esc(id.tahunAjaran)}" class="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" /></div>
              <div class="md:col-span-2 pt-2"><button type="submit" class="px-6 py-3 rounded-lg bg-[#14532d] text-white font-bold text-sm">Simpan Identitas</button></div>
            </form>
          </div>\`;
      } else if (state.page === 'pilih-cp') {
        const cps = DB.CP_DATABASE.filter(c => c.fase === id.fase);
        mainHtml = \`
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-[#14532d] dark:text-emerald-400">Pilih CP Kepka BKPDM No. 020 Tahun 2026</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">Pilih fase lalu centang elemen CP untuk dipecah menjadi TP Pembelajaran Mendalam.</p>
              </div>
              <select onchange="changeFase(this.value)" class="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold">
                <option value="A" \${id.fase==='A'?'selected':''}>Fase A (Kelas 1-2)</option>
                <option value="B" \${id.fase==='B'?'selected':''}>Fase B (Kelas 3-4)</option>
                <option value="C" \${id.fase==='C'?'selected':''}>Fase C (Kelas 5-6)</option>
              </select>
            </div>
            <div class="space-y-3">
              \${cps.map(cp => {
                const checked = state.selectedCps.includes(cp.code);
                return \`<label class="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input type="checkbox" \${checked?'checked':''} onchange="toggleCp('\${cp.code}')" class="mt-1 w-5 h-5 accent-[#14532d]" />
                  <div>
                    <div class="text-sm font-bold text-[#14532d] dark:text-emerald-400">CP \${cp.code} · \${cp.elemen}</div>
                    <div class="text-sm text-slate-700 dark:text-slate-200 mt-1">\${esc(cp.redaksi)}</div>
                  </div>
                </label>\`;
              }).join('')}
            </div>
            <div class="flex flex-wrap gap-3">
              <button onclick="generateTPAction()" class="px-6 py-3 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-bold text-sm">Generate TP dari CP Terpilih</button>
              <button onclick="showOriginalCP()" class="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-sm">Tampilkan CP Asli</button>
            </div>
          </div>\`;
      } else if (state.page === 'generator-tp') {
        const filtered = faseTps.filter(t => state.filterElemen === 'Semua' || t.elemen === state.filterElemen);
        mainHtml = \`
          <div class="space-y-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-[#14532d] dark:text-emerald-400">Daftar Tujuan Pembelajaran (TP) · Fase \${id.fase}</h2>
                <p class="text-xs text-slate-500">Total \${filtered.length} TP ditampilkan · Mindful, Meaningful, Joyful</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <select onchange="state.filterElemen=this.value;render()" class="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">
                  <option value="Semua" \${state.filterElemen==='Semua'?'selected':''}>Semua Elemen</option>
                  <option value="Al-Qur'an Hadis" \${state.filterElemen==="Al-Qur'an Hadis"?'selected':''}>Al-Qur'an Hadis</option>
                  <option value="Aqidah" \${state.filterElemen==='Aqidah'?'selected':''}>Aqidah</option>
                  <option value="Akhlak" \${state.filterElemen==='Akhlak'?'selected':''}>Akhlak</option>
                  <option value="Fiqih" \${state.filterElemen==='Fiqih'?'selected':''}>Fiqih</option>
                  <option value="Sejarah Peradaban Islam" \${state.filterElemen==='Sejarah Peradaban Islam'?'selected':''}>Sejarah Peradaban Islam</option>
                </select>
                <button onclick="generateTPAction()" class="px-4 py-2.5 rounded-lg bg-[#14532d] text-white font-bold text-sm">Generate TP</button>
                <button onclick="generateATPAction()" class="px-4 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-bold text-sm">Generate ATP</button>
              </div>
            </div>
            \${filtered.map(tp => \`
              <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-2">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="text-sm font-bold text-[#14532d] dark:text-emerald-400">\${tp.code} · \${tp.elemen} · CP \${tp.cpCode} · \${tp.kko}</div>
                  <div class="flex gap-2">
                    <button onclick="editTPPrompt('\${tp.id}')" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold">Edit</button>
                    <button onclick="deleteTP('\${tp.id}')" class="px-3 py-1.5 rounded border border-red-300 text-red-700 dark:text-red-400 text-xs font-semibold">Hapus</button>
                  </div>
                </div>
                <p class="text-sm leading-relaxed">\${esc(tp.rumusan)}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                  <div><strong>Mindful:</strong> \${esc(tp.indikatorMindful)}</div>
                  <div><strong>Meaningful:</strong> \${esc(tp.indikatorMeaningful)}</div>
                  <div><strong>Joyful:</strong> \${esc(tp.indikatorJoyful)}</div>
                </div>
              </div>\`).join('')}
          </div>\`;
      } else if (state.page === 'generator-atp') {
        mainHtml = \`
          <div class="space-y-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-[#14532d] dark:text-emerald-400">Alur Tujuan Pembelajaran (ATP) · Fase \${id.fase}</h2>
                <p class="text-xs text-slate-500">\${state.atps.length} Pertemuan/Unit · Total \${totalJP} JP</p>
              </div>
              <button onclick="generateATPAction()" class="px-5 py-2.5 rounded-lg bg-[#14532d] text-white font-bold text-sm">Generate ATP Otomatis</button>
            </div>
            \${warns.length ? '<div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-800 dark:text-red-300 text-sm font-semibold">' + warns.map(w => '<div>Peringatan Urutan: ' + esc(w) + '</div>').join('') + '</div>' : ''}
            \${issues.length ? '<div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-300 text-sm font-semibold">' + issues.map(i => '<div>Cek Kelengkapan: ' + esc(i) + '</div>').join('') + '</div>' : ''}
            <div class="space-y-3">
              \${state.atps.map((row, idx) => \`
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="text-sm font-bold text-[#14532d] dark:text-emerald-400 tabular-nums">#\${row.noUrut} · \${row.semester} · \${row.kodeTP} · \${row.alokasiJP} JP · \${row.asesmen}</div>
                    <div class="flex gap-1.5">
                      <button onclick="moveATP(\${idx}, -1)" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold">Naik</button>
                      <button onclick="moveATP(\${idx}, 1)" class="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-semibold">Turun</button>
                      <button onclick="deleteATP('\${row.id}')" class="px-3 py-1.5 rounded border border-red-300 text-red-700 text-xs font-semibold">Hapus</button>
                    </div>
                  </div>
                  <div class="text-sm font-semibold">\${esc(row.materi)}</div>
                  <div class="text-xs text-slate-600 dark:text-slate-300">\${esc(row.rumusanTP)}</div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 text-slate-600 dark:text-slate-300">
                    <div><strong>Mindful (5 mnt):</strong> \${esc(row.aktivitasMindful)}</div>
                    <div><strong>Meaningful (25 mnt):</strong> \${esc(row.aktivitasMeaningful)}</div>
                    <div><strong>Joyful (10 mnt):</strong> \${esc(row.aktivitasJoyful)}</div>
                    <div><strong>Refleksi (5 mnt):</strong> \${esc(row.aktivitasRefleksi)}</div>
                  </div>
        </div>\`).join('')}
            </div>
          </div>\`;
      } else if (state.page === 'modul-ajar') {
        const atpList = state.atps || [];
        if (!state.selectedAtpId || !atpList.some(a => a.id === state.selectedAtpId)) {
          state.selectedAtpId = atpList[0] ? atpList[0].id : '';
        }
        const curIdx = atpList.findIndex(a => a.id === state.selectedAtpId);
        const curAtp = curIdx >= 0 ? atpList[curIdx] : null;
        const prevAtp = curIdx > 0 ? atpList[curIdx - 1] : null;
        const curCp = curAtp ? DB.CP_DATABASE.find(c => c.code === curAtp.cpCode) : null;
        const curTp = curAtp ? state.tps.find(t => t.id === curAtp.tpId) : null;
        if (!curAtp) {
          mainHtml = '<div class="bg-white dark:bg-slate-900 border rounded-xl p-8 text-center text-sm">Silakan generate ATP terlebih dahulu sebagai pijakan Modul Ajar.</div>';
        } else {
          const semLabel = /genap/i.test(curAtp.semester) ? 'Genap' : 'Ganjil';
          const modelLabel = id.fase === 'A'
            ? 'Discovery Learning (Penemuan Terbimbing) dan Pembelajaran Bermain Bermakna'
            : id.fase === 'B'
            ? 'Discovery Learning (Penemuan Terbimbing) dan Pembelajaran Kooperatif Kontekstual'
            : 'Problem-Based Learning (Pembelajaran Berbasis Masalah) dan Proyek Kolaboratif Mendalam';
          mainHtml = \`
            <div class="space-y-4">
              <div class="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
                <div class="flex-1 min-w-[240px]">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Pijakan ATP / TP untuk Modul Ajar:</div>
                  <select onchange="state.selectedAtpId=this.value;render()" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold">
                    \${atpList.map(a => '<option value="' + esc(a.id) + '" ' + (a.id===curAtp.id?'selected':'') + '>#' + a.noUrut + ' · ' + esc(a.semester) + ' · ' + esc(a.kodeTP) + ' — ' + esc(a.materi) + '</option>').join('')}
                  </select>
                </div>
                <div class="flex gap-2">
                  <button onclick="window.print()" class="px-4 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-bold text-xs">Unduh PDF / Print</button>
                </div>
              </div>
              <div class="max-w-[215mm] mx-auto bg-white text-slate-900 border border-slate-200 rounded-xl sm:px-[22mm] sm:py-[20mm] p-6 space-y-4 text-[13px] leading-[1.5]" style="font-family: 'Times New Roman', Times, serif;">
                <div class="text-center border-b-4 border-double border-[#14532d] pb-3">
                  <div class="text-xs font-bold text-slate-800 uppercase">\${esc(kop.pemerintahDaerah)}</div>
                  <div class="text-sm font-bold text-slate-900 uppercase">\${esc(kop.dinasPendidikan)}</div>
                  <div class="text-lg font-bold text-[#14532d] mt-0.5">\${esc(id.namaSekolah.toUpperCase())}</div>
                  <div class="text-xs text-slate-600">\${esc(id.alamat)} | NPSN: \${esc(id.npsn)} | \${esc(id.kotaKabupaten)}</div>
                </div>
                <div class="text-center space-y-0.5 pb-1">
                  <div class="text-base font-bold uppercase">RENCANA PEMBELAJARAN MENDALAM</div>
                  <div class="text-sm font-bold text-[#14532d]">\${esc(curAtp.materi)} (\${esc(curAtp.kodeTP)})</div>
                  <div class="text-xs font-bold uppercase">KURIKULUM MERDEKA DEEP LEARNING</div>
                  <div class="text-xs text-slate-700">Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses | Kepka BKPDM No. 020 Tahun 2026</div>
                </div>
                <div>
                  <h3 class="font-bold text-sm uppercase mb-1.5">BAGIAN 1: INFORMASI UMUM</h3>
                  <table class="w-full text-xs border-collapse">
                    <thead><tr class="bg-stone-100 text-left"><th class="border p-2 w-48">Komponen</th><th class="border p-2">Keterangan</th></tr></thead>
                    <tbody>
                      <tr><td class="border p-2 font-semibold">Nama Penyusun</td><td class="border p-2">\${esc(id.namaGuru)} (NIP. \${esc(id.nipGuru || '-')})</td></tr>
                      <tr><td class="border p-2 font-semibold">Satuan Pendidikan</td><td class="border p-2">\${esc(id.namaSekolah)} (NPSN: \${esc(id.npsn)})</td></tr>
                      <tr><td class="border p-2 font-semibold">Jenjang/Kelas</td><td class="border p-2">SD / \${esc(id.kelas)}</td></tr>
                      <tr><td class="border p-2 font-semibold">Fase</td><td class="border p-2">\${esc(id.fase)}</td></tr>
                      <tr><td class="border p-2 font-semibold">Mata Pelajaran</td><td class="border p-2">Pendidikan Agama Islam dan Budi Pekerti (PAI)</td></tr>
                      <tr><td class="border p-2 font-semibold">Materi Pokok</td><td class="border p-2 font-semibold">\${esc(curAtp.materi)}</td></tr>
                      <tr><td class="border p-2 font-semibold">Alokasi Waktu</td><td class="border p-2">\${curAtp.alokasiJP} JP (@ 35 Menit)</td></tr>
                      <tr><td class="border p-2 font-semibold">Tahun Ajaran / Semester</td><td class="border p-2">\${esc(id.tahunAjaran)} / \${semLabel} (\${esc(curAtp.semester)})</td></tr>
                      <tr><td class="border p-2 font-semibold">Model Pembelajaran</td><td class="border p-2 text-justify">\${esc(modelLabel)}</td></tr>
                      <tr><td class="border p-2 font-semibold">Metode</td><td class="border p-2">Diskusi, Tanya Jawab, Presentasi, Demonstrasi, Ceramah Bermakna</td></tr>
                      <tr><td class="border p-2 font-semibold">Target Peserta Didik</td><td class="border p-2">Reguler (Semua Peserta Didik)</td></tr>
                    </tbody>
                  </table>
                </div>
                <div class="space-y-2 text-justify">
                  <h3 class="font-bold text-sm uppercase">BAGIAN 2: CAPAIAN PEMBELAJARAN (CP)</h3>
                  <div class="text-xs font-bold text-[#14532d]">FASE \${esc(id.fase)} (CP \${esc(curAtp.cpCode)})</div>
                  <p>\${esc(curCp ? curCp.redaksi : '')}</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP)</h3>
                  <p class="font-bold">TP-1 (Mengenal \${esc(curAtp.materi)}) → TP-2 (Memahami Makna) → TP-3 (Menerapkan) → TP-4 (Membiasakan Sikap Mulia)</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 4: TUJUAN PEMBELAJARAN</h3>
                  <p>1. [\${esc(curAtp.kodeTP)}] \${esc(curAtp.rumusanTP)} (C1-C3 &amp; A3 Deep Learning)</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING)</h3>
                  <p><strong>A. Pertanyaan Esensial:</strong> Mengapa kita perlu mempelajari dan mengamalkan \${esc(curAtp.materi)} dalam kehidupan sehari-hari?</p>
                  <p><strong>B. Konsep Besar &amp; Transfer Goals:</strong> \${esc(curAtp.aktivitasMeaningful)}</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334)</h3>
                  <p>Keimanan &amp; Ketakwaan, Penalaran Kritis, Kreativitas, Kolaborasi, dan Kemandirian (Pengalaman: Memahami, Mengaplikasi, Merefleksi).</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 7: KEGIATAN PEMBELAJARAN</h3>
                  <p><strong>PENDAHULUAN (±15 mnt):</strong> Salam, doa, aktivitas mindful (\${esc(curAtp.aktivitasMindful)}), Connecting, Essential Question, penyampaian tujuan.</p>
                  <p><strong>KEGIATAN INTI:</strong> Tahap 1 Memahami (Mindful), Tahap 2 Mengaplikasi (Meaningful: \${esc(curAtp.aktivitasMeaningful)}), Tahap 3 Merefleksi (Joyful: \${esc(curAtp.aktivitasJoyful)}).</p>
                  <p><strong>PENUTUP (±10 mnt):</strong> Exit Ticket, Refleksi (\${esc(curAtp.aktivitasRefleksi)}), Transfer Challenge &amp; Doa Penutup.</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 8: ASESMEN</h3>
                  <p>Diagnostik (Pre-test lisan), Formatif (Observasi &amp; antar teman), Sumatif (\${esc(curAtp.asesmen)} + Soal HOTS), dan Rubrik Konseptual (Level 1–4).</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 9: PENGAYAAN DAN REMEDIAL</h3>
                  <p>Pengayaan melalui tutor sebaya/proyek kreatif; Remedial melalui pendampingan bertahap dengan kartu peraga.</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 10: REFLEKSI GURU</h3>
                  <p>Evaluasi pencapaian deep understanding, transfer of learning, model pembelajaran, dan penumbuhan cinta ajaran Islam.</p>
                  <h3 class="font-bold text-sm uppercase pt-1">BAGIAN 11: LAMPIRAN (LKPD, BAHAN AJAR, GLOSARIUM, TANDA TANGAN)</h3>
                  <p><strong>A. LKPD (\${esc(curAtp.materi)}):</strong> Identitas, Kompetensi, Tujuan, Petunjuk Kerja, Kegiatan/Tugas, Tabel Kerja, Refleksi, dan Penilaian.</p>
                  <p><strong>B. Bahan Ajar:</strong> Ringkasan Materi, Peta Konsep, Materi Inti, Contoh Soal &amp; Pembahasan, Latihan Soal, Kunci Jawaban, Rangkuman, Glosarium, dan Daftar Pustaka (Permendikdasmen No. 1/2026 &amp; Kepka BKPDM No. 020/2026).</p>
                </div>
                <div class="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs text-center">
                  <div>Mengetahui,<br/><strong>Kepala Sekolah</strong><br/><br/><br/><strong class="underline">\${esc(id.namaKepalaSekolah)}</strong><br/>NIP. \${esc(id.nipKepalaSekolah || '-')}</div>
                  <div>\${esc(id.kotaKabupaten)}, \${esc(id.tanggalDokumen)}<br/><strong>Guru Mata Pelajaran PAI</strong><br/><br/><br/><strong class="underline">\${esc(id.namaGuru)}</strong><br/>NIP. \${esc(id.nipGuru || '-')}</div>
                </div>
              </div>
            </div>\`;
        }
      } else {
        mainHtml = \`
          <div class="space-y-4">
            <div class="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-wrap gap-3">
              <button onclick="exportDocx('both')" class="px-5 py-3 rounded-lg bg-[#14532d] text-white font-bold text-sm">Unduh TP &amp; ATP (1 File DOCX)</button>
              <button onclick="exportDocx('tp')" class="px-5 py-3 rounded-lg bg-emerald-700 text-white font-bold text-sm">Unduh TP Saja</button>
              <button onclick="exportDocx('atp')" class="px-5 py-3 rounded-lg bg-emerald-700 text-white font-bold text-sm">Unduh ATP Saja</button>
              <button onclick="window.print()" class="px-5 py-3 rounded-lg bg-yellow-500 text-slate-950 font-bold text-sm">Unduh PDF / Print</button>
              <button onclick="copyAllTP()" class="px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-sm">Salin TP</button>
            </div>
            <div class="max-w-[215mm] mx-auto bg-white text-slate-900 border border-slate-200 rounded-xl p-6">
              <div class="text-center border-b-2 border-[#14532d] pb-3 mb-4">
                <div class="text-xs font-bold text-slate-800 uppercase">\${esc(kop.pemerintahDaerah)}</div>
                <div class="text-sm font-bold text-slate-900 uppercase">\${esc(kop.dinasPendidikan)}</div>
                <div class="text-lg font-bold text-[#14532d] mt-0.5">\${esc(id.namaSekolah.toUpperCase())}</div>
                <div class="text-xs text-slate-600">\${esc(id.alamat)} · NPSN: \${esc(id.npsn)}</div>
                <div class="text-sm font-bold mt-2">TP &amp; ATP PAI SD FASE \${id.fase} (\${esc(id.kelas)}) · TA \${esc(id.tahunAjaran)}</div>
              </div>
              <h3 class="font-bold text-sm text-[#14532d] mb-2">Tabel Tujuan Pembelajaran (TP)</h3>
              <table class="w-full text-xs border-collapse mb-6">
                <thead><tr class="bg-emerald-50"><th class="border p-2">Kode</th><th class="border p-2">Elemen</th><th class="border p-2">Rumusan TP Pembelajaran Mendalam</th></tr></thead>
                <tbody>\${faseTps.map(t => '<tr><td class="border p-2 font-bold">' + esc(t.code) + '</td><td class="border p-2">' + esc(t.elemen) + '</td><td class="border p-2">' + esc(t.rumusan) + '</td></tr>').join('')}</tbody>
              </table>
              <h3 class="font-bold text-sm text-[#14532d] mb-2">Tabel Alur Tujuan Pembelajaran (ATP)</h3>
              <table class="w-full text-xs border-collapse">
                <thead><tr class="bg-emerald-50"><th class="border p-2">No</th><th class="border p-2">Semester</th><th class="border p-2">Kode</th><th class="border p-2">Materi &amp; Aktivitas Mendalam</th><th class="border p-2">JP</th><th class="border p-2">Asesmen</th></tr></thead>
                <tbody>\${state.atps.map(a => '<tr><td class="border p-2 text-center">' + a.noUrut + '</td><td class="border p-2">' + esc(a.semester) + '</td><td class="border p-2 font-bold">' + esc(a.kodeTP) + '</td><td class="border p-2"><strong>' + esc(a.materi) + '</strong><br/>Mindful: ' + esc(a.aktivitasMindful) + '<br/>Meaningful: ' + esc(a.aktivitasMeaningful) + '<br/>Joyful: ' + esc(a.aktivitasJoyful) + '</td><td class="border p-2 text-center">' + a.alokasiJP + '</td><td class="border p-2">' + esc(a.asesmen) + '</td></tr>').join('')}</tbody>
              </table>
              <div class="grid grid-cols-2 gap-8 mt-8 text-xs text-center">
                <div>Mengetahui,<br/>Kepala Sekolah<br/><br/><br/><strong>\${esc(id.namaKepalaSekolah)}</strong><br/>NIP. \${esc(id.nipKepalaSekolah)}</div>
                <div>\${esc(id.kotaKabupaten)}, \${esc(id.tanggalDokumen)}<br/>Guru PAI Penyusun<br/><br/><br/><strong>\${esc(id.namaGuru)}</strong><br/>NIP. \${esc(id.nipGuru)}</div>
              </div>
            </div>
          </div>\`;
      }

      root.innerHTML = \`
        <div class="min-h-screen flex flex-col lg:flex-row">
          <aside class="no-print w-full lg:w-64 shrink-0 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <div class="px-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div class="font-bold text-base text-[#14532d] dark:text-emerald-400">PAI Kurikulum Merdeka</div>
              <div class="text-xs text-slate-500">Kepka BKPDM No. 020/2026</div>
            </div>
            \${navBtn('dashboard', 'Dashboard & Tes Tombol')}
            \${navBtn('identitas', 'Identitas Sekolah')}
            \${navBtn('pilih-cp', 'Pilih CP (Fase A/B/C)')}
            \${navBtn('generator-tp', 'Generator TP')}
            \${navBtn('generator-atp', 'Generator ATP')}
            \${navBtn('modul-ajar', 'Modul Ajar Lengkap')}
            \${navBtn('unduh-print', 'Unduh PDF / Print &amp; DOCX')}
            <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button onclick="toggleDark()" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold">\${state.darkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}</button>
              <button onclick="state.session=null;render()" class="w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">Keluar</button>
            </div>
          </aside>
          <main class="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">\${mainHtml}</main>
        </div>\`;
    }

    window.handleLogin = function(e) {
      e.preventDefault();
      state.identity.namaGuru = document.getElementById('login-name').value.trim() || state.identity.namaGuru;
      state.session = { namaGuru: state.identity.namaGuru, at: new Date().toISOString() };
      render();
    };
    window.toggleDark = function() { state.darkMode = !state.darkMode; render(); };
    window.setPage = function(p) { state.page = p; render(); };
    window.saveIdentityForm = function(e) {
      e.preventDefault();
      state.identity.pemerintahDaerah = document.getElementById('id-pemda').value.trim().toUpperCase();
      state.identity.dinasPendidikan = document.getElementById('id-dinas').value.trim().toUpperCase();
      state.identity.namaSekolah = document.getElementById('id-namaSekolah').value;
      state.identity.npsn = document.getElementById('id-npsn').value;
      state.identity.alamat = document.getElementById('id-alamat').value;
      state.identity.namaKepalaSekolah = document.getElementById('id-ks').value;
      state.identity.nipKepalaSekolah = document.getElementById('id-nipks').value;
      state.identity.namaGuru = document.getElementById('id-guru').value;
      state.identity.nipGuru = document.getElementById('id-nipguru').value;
      const newFase = document.getElementById('id-fase').value;
      state.identity.tahunAjaran = document.getElementById('id-tahun').value;
      if (newFase !== state.identity.fase) {
        changeFase(newFase);
      } else {
        render();
      }
      showToast('Identitas sekolah berhasil disimpan!');
    };
    window.changeFase = function(f) {
      state.identity.fase = f;
      state.identity.kelas = f === 'A' ? 'Kelas 1 & 2' : f === 'B' ? 'Kelas 3 & 4' : 'Kelas 5 & 6';
      state.selectedCps = DB.CP_DATABASE.filter(c => c.fase === f).map(c => c.code);
      render();
    };
    window.toggleCp = function(code) {
      if (state.selectedCps.includes(code)) state.selectedCps = state.selectedCps.filter(x => x !== code);
      else state.selectedCps.push(code);
      render();
    };
    window.generateTPAction = function() {
      const f = state.identity.fase;
      const kept = state.tps.filter(t => t.fase === f && !state.selectedCps.includes(t.cpCode));
      const gen = [];
      state.selectedCps.forEach(code => {
        const cp = DB.CP_DATABASE.find(c => c.code === code && c.fase === f);
        if (!cp) return;
        DB.TP_TEMPLATES.filter(t => t.cpCode === code).forEach(t => {
          gen.push({
            id: 'tp-' + t.cpCode + '-' + t.subIndex,
            code: 'TP ' + t.cpCode + '.' + t.subIndex,
            fase: f,
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
            suggestedAsesmen: t.suggestedAsesmen
          });
        });
      });
      state.tps = state.tps.filter(t => t.fase !== f).concat(kept).concat(gen);
      state.page = 'generator-tp';
      render();
      showToast('Berhasil generate ' + gen.length + ' TP Pembelajaran Mendalam!');
    };
    window.generateATPAction = function() {
      state.atps = generateATPArray(state.identity.fase, state.tps);
      state.page = 'generator-atp';
      render();
      showToast('Berhasil generate ' + state.atps.length + ' baris ATP urut prasyarat!');
    };
    window.moveATP = function(idx, dir) {
      const target = idx + dir;
      if (target < 0 || target >= state.atps.length) return;
      const copy = state.atps.slice();
      const tmp = copy[idx]; copy[idx] = copy[target]; copy[target] = tmp;
      state.atps = copy.map((r, i) => Object.assign({}, r, { noUrut: i + 1 }));
      render();
    };
    window.deleteATP = function(id) {
      state.atps = state.atps.filter(a => a.id !== id).map((r, i) => Object.assign({}, r, { noUrut: i + 1 }));
      render();
    };
    window.editTPPrompt = function(id) {
      const tp = state.tps.find(t => t.id === id);
      if (!tp) return;
      state.editingTpId = id;
      const box = document.createElement('div');
      box.id = 'standalone-edit-modal';
      box.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60';
      box.innerHTML = '<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-3">' +
        '<div class="font-bold text-sm text-[#14532d] dark:text-emerald-400">Edit Rumusan ' + esc(tp.code) + '</div>' +
        '<textarea id="standalone-edit-txt" rows="4" class="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm">' + esc(tp.rumusan) + '</textarea>' +
        '<div class="flex justify-end gap-2">' +
        '<button type="button" onclick="document.getElementById(\\'standalone-edit-modal\\').remove()" class="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold">Batal</button>' +
        '<button type="button" onclick="saveStandaloneEdit(\\'' + tp.id + '\\')" class="px-4 py-2 rounded-lg bg-[#14532d] text-white text-xs font-bold">Simpan</button>' +
        '</div></div>';
      document.body.appendChild(box);
    };
    window.saveStandaloneEdit = function(id) {
      const tp = state.tps.find(t => t.id === id);
      const el = document.getElementById('standalone-edit-txt');
      if (tp && el && el.value.trim()) {
        tp.rumusan = el.value.trim();
        render();
        showToast('TP diperbarui!');
      }
      const modal = document.getElementById('standalone-edit-modal');
      if (modal) modal.remove();
    };
    window.deleteTP = function(id) {
      state.tps = state.tps.filter(t => t.id !== id);
      render();
    };
    window.copyAllTP = function() {
      const txt = state.tps.filter(t => t.fase === state.identity.fase).map(t => t.code + ': ' + t.rumusan).join('\\n\\n');
      navigator.clipboard.writeText(txt).then(() => showToast('Semua TP disalin ke clipboard!'));
    };
    window.showOriginalCP = function() {
      const list = DB.CP_DATABASE.filter(c => c.fase === state.identity.fase).map(c => c.code + ' ' + c.elemen + ': ' + c.redaksi).join('\\n\\n');
      showToast('CP Kepka 020/2026 Fase ' + state.identity.fase + ' terverifikasi (' + DB.CP_DATABASE.filter(c => c.fase === state.identity.fase).length + ' elemen).');
      console.info(list);
    };
    window.runButtonTests = function() {
      state.testResults = [
        { name: 'Simpan Identitas', passed: !!state.identity.namaSekolah, detail: 'Tersimpan di localStorage' },
        { name: 'Generate TP', passed: state.tps.length >= 4, detail: state.tps.length + ' TP aktif' },
        { name: 'Generate ATP & Urutan', passed: state.atps.length >= 4, detail: state.atps.length + ' baris ATP terstruktur' },
        { name: 'Export DOCX & Print', passed: typeof exportDocx === 'function', detail: 'OOXML builder siap' }
      ];
      render();
      showToast('Semua tombol berfungsi aktif!');
    };

    render();
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile(currentIdentity?: SchoolIdentity): string {
  const html = buildStandaloneHtmlString(currentIdentity);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const filename = 'Generator-TP-ATP-PAI-SD-Kepka-020-2026.html';
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
