import React, { useEffect, useState } from 'react';
import {
  Copy,
  Download,
  Eye,
  FileCode2,
  FileText,
  Maximize2,
  Minimize2,
  Printer,
  X,
} from 'lucide-react';
import { DASAR_HUKUM_TEXT, getKopInstansiLines } from '../data/cpDatabase';
import {
  ATPItem,
  CPItem,
  ModulAjarItem,
  SchoolIdentity,
  TPItem,
} from '../types/curriculum';
import { DocxExportMode } from '../utils/docxExporter';
import { ModulDocumentBody } from './ModulDocumentBody';

interface ExportPrintViewProps {
  identity: SchoolIdentity;
  cps: CPItem[];
  selectedCpCodes: string[];
  tps: TPItem[];
  atps: ATPItem[];
  moduls: ModulAjarItem[];
  activeDocMode: DocxExportMode;
  onChangeDocMode: (mode: DocxExportMode) => void;
  selectedModulAtpId: string;
  onChangeSelectedModulAtpId: (atpId: string) => void;
  onDownloadDocx: (mode: DocxExportMode, modul?: ModulAjarItem | null) => void;
  onPrint: () => void;
  onCopyTP: () => void;
  onDownloadStandaloneHtml: () => void;
}

const DOC_MODE_OPTIONS: { value: DocxExportMode; label: string }[] = [
  { value: 'cp_tp_atp', label: 'CP, TP & ATP' },
  { value: 'cp', label: 'CP Resmi' },
  { value: 'tp', label: 'TP Saja' },
  { value: 'atp', label: 'ATP Saja' },
  { value: 'modul', label: 'Modul Ajar' },
  { value: 'all_modul', label: 'Semua Modul Ajar' },
  { value: 'full_bundle', label: 'Paket Lengkap' },
];

const DOC_TITLES: Record<DocxExportMode, string> = {
  cp: 'CAPAIAN PEMBELAJARAN (CP) PAI DAN BUDI PEKERTI',
  tp: 'DAFTAR TUJUAN PEMBELAJARAN (TP) BERBASIS PEMBELAJARAN MENDALAM',
  atp: 'ALUR TUJUAN PEMBELAJARAN (ATP) BERBASIS PEMBELAJARAN MENDALAM',
  both: 'TUJUAN PEMBELAJARAN (TP) DAN ALUR TUJUAN PEMBELAJARAN (ATP)',
  cp_tp_atp: 'PERANGKAT PEMBELAJARAN MENDALAM: CP, TP, DAN ATP',
  modul: 'MODUL AJAR KURIKULUM MERDEKA',
  all_modul: 'KUMPULAN MODUL AJAR KURIKULUM MERDEKA',
  full_bundle: 'PERANGKAT PEMBELAJARAN LENGKAP: CP, TP, ATP, DAN MODUL AJAR',
};

const KopSekolahPrint: React.FC<{
  identity: SchoolIdentity;
  title: string;
  subtitle?: string;
}> = ({ identity, title, subtitle }) => {
  const kop = getKopInstansiLines(identity);
  return (
    <div className="text-center border-b-4 border-double border-[#14532d] pb-3.5 mb-5">
      <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
        {kop.pemerintahDaerah}
      </div>
      <div className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wide mt-0.5">
        {kop.dinasPendidikan}
      </div>
      <div className="text-lg sm:text-xl font-bold text-[#14532d] uppercase tracking-wide mt-0.5">
        {identity.namaSekolah}
      </div>
      <div className="text-xs text-slate-600 mt-0.5">
        {identity.alamat} | NPSN: {identity.npsn} | {identity.kotaKabupaten}
      </div>
      <div className="text-sm font-bold text-slate-900 mt-3 uppercase">
        {title}
      </div>
      <div className="text-xs font-semibold text-[#14532d] mt-0.5">
        {subtitle ||
          `Mata Pelajaran Pendidikan Agama Islam dan Budi Pekerti | Fase ${identity.fase} (${identity.kelas}) | Tahun Ajaran ${identity.tahunAjaran}`}
      </div>
      <div className="text-[11px] text-slate-600 mt-1 italic">
        Dasar Hukum: {DASAR_HUKUM_TEXT}
      </div>
    </div>
  );
};

const IdentitasPrintTable: React.FC<{ identity: SchoolIdentity }> = ({ identity }) => (
  <table className="print-table w-full text-xs border-collapse mb-6">
    <tbody>
      <tr>
        <td className="border border-slate-400 p-2 font-bold bg-stone-50 w-44">Satuan Pendidikan</td>
        <td className="border border-slate-400 p-2">
          {identity.namaSekolah} (NPSN {identity.npsn})
        </td>
        <td className="border border-slate-400 p-2 font-bold bg-stone-50 w-40">Fase, Kelas, dan Tahun Ajaran</td>
        <td className="border border-slate-400 p-2">
          Fase {identity.fase} ({identity.kelas}), Tahun Ajaran {identity.tahunAjaran}
        </td>
      </tr>
      <tr>
        <td className="border border-slate-400 p-2 font-bold bg-stone-50">Alamat Sekolah</td>
        <td className="border border-slate-400 p-2" colSpan={3}>
          {identity.alamat}
          {identity.kotaKabupaten ? `, ${identity.kotaKabupaten}` : ''}
        </td>
      </tr>
      <tr>
        <td className="border border-slate-400 p-2 font-bold bg-stone-50">Guru PAI Penyusun</td>
        <td className="border border-slate-400 p-2">
          {identity.namaGuru} (NIP {identity.nipGuru || '-'})
        </td>
        <td className="border border-slate-400 p-2 font-bold bg-stone-50">Kepala Sekolah</td>
        <td className="border border-slate-400 p-2">
          {identity.namaKepalaSekolah} (NIP {identity.nipKepalaSekolah || '-'})
        </td>
      </tr>
    </tbody>
  </table>
);

const SignaturePrintBlock: React.FC<{ identity: SchoolIdentity }> = ({ identity }) => (
  <div className="print-avoid-break grid grid-cols-2 gap-8 mt-8 pt-4 text-xs text-center">
    <div className="flex flex-col items-center">
      <div>Mengetahui,</div>
      <div className="font-bold">Kepala Sekolah</div>
      <div className="h-16" />
      <div className="font-bold underline">{identity.namaKepalaSekolah}</div>
      <div className="tabular-nums">NIP. {identity.nipKepalaSekolah || '-'}</div>
    </div>
    <div className="flex flex-col items-center">
      <div>
        {identity.kotaKabupaten}, {identity.tanggalDokumen}
      </div>
      <div className="font-bold">Guru PAI dan Budi Pekerti</div>
      <div className="h-16" />
      <div className="font-bold underline">{identity.namaGuru}</div>
      <div className="tabular-nums">NIP. {identity.nipGuru || '-'}</div>
    </div>
  </div>
);

const ModulPrintSection: React.FC<{
  identity: SchoolIdentity;
  modul: ModulAjarItem;
  showFullKop: boolean;
}> = ({ identity, modul, showFullKop }) => (
  <ModulDocumentBody identity={identity} modul={modul} showFullKop={showFullKop} />
);

export const ExportPrintView: React.FC<ExportPrintViewProps> = ({
  identity,
  cps,
  selectedCpCodes,
  tps,
  atps,
  moduls,
  activeDocMode,
  onChangeDocMode,
  selectedModulAtpId,
  onChangeSelectedModulAtpId,
  onDownloadDocx,
  onPrint,
  onCopyTP,
  onDownloadStandaloneHtml,
}) => {
  const [fullScreenPreview, setFullScreenPreview] = useState(false);

  const faseTps = tps.filter((t) => t.fase === identity.fase);
  const totalJP = atps.reduce((s, a) => s + Number(a.alokasiJP || 0), 0);

  const filteredCps = cps.filter((c) => selectedCpCodes.includes(c.code));
  const displayedCps = filteredCps.length > 0 ? filteredCps : cps;

  const faseModuls = moduls.filter((m) => m.fase === identity.fase);
  const activeModul =
    faseModuls.find((m) => m.atpId === selectedModulAtpId) || faseModuls[0] || null;

  useEffect(() => {
    if (faseModuls.length > 0 && !faseModuls.some((m) => m.atpId === selectedModulAtpId)) {
      onChangeSelectedModulAtpId(faseModuls[0].atpId);
    }
  }, [faseModuls, selectedModulAtpId, onChangeSelectedModulAtpId]);

  const showCP =
    activeDocMode === 'cp' || activeDocMode === 'cp_tp_atp' || activeDocMode === 'full_bundle';
  const showTP =
    activeDocMode === 'tp' ||
    activeDocMode === 'both' ||
    activeDocMode === 'cp_tp_atp' ||
    activeDocMode === 'full_bundle';
  const showATP =
    activeDocMode === 'atp' ||
    activeDocMode === 'both' ||
    activeDocMode === 'cp_tp_atp' ||
    activeDocMode === 'full_bundle';
  const showSingleModul = activeDocMode === 'modul';
  const showAllModuls = activeDocMode === 'all_modul' || activeDocMode === 'full_bundle';

  const activeModeLabel =
    DOC_MODE_OPTIONS.find((o) => o.value === activeDocMode)?.label || 'TP & ATP';

  const sectionNumberForTP = showCP ? 'B.' : 'A.';
  const sectionNumberForATP = showCP ? 'C.' : showTP ? 'B.' : 'A.';

  const previewSheet = (
    <div className="print-surface max-w-[215mm] min-h-[330mm] mx-auto bg-white text-slate-900 border border-slate-300 shadow-sm rounded-lg p-6 sm:px-[22mm] sm:py-[20mm]">
      <div className="min-w-0">
        {!showSingleModul && !showAllModuls && (
          <>
            <KopSekolahPrint
              identity={identity}
              title={DOC_TITLES[activeDocMode] || DOC_TITLES.cp_tp_atp}
            />
            <IdentitasPrintTable identity={identity} />
          </>
        )}

        {activeDocMode === 'full_bundle' && (
          <>
            <KopSekolahPrint identity={identity} title={DOC_TITLES.full_bundle} />
            <IdentitasPrintTable identity={identity} />
          </>
        )}

        {/* CP Section */}
        {showCP && (
          <div className="mb-7">
            <h2 className="text-sm font-bold text-[#14532d] mb-2 uppercase tracking-wide">
              A. Capaian Pembelajaran (CP) Resmi Berdasarkan Kepka BKPDM No. 020 Tahun 2026 ({displayedCps.length} Elemen)
            </h2>
            <table className="print-table w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-left">
                  <th className="border border-slate-400 p-2 w-20 text-center">Kode</th>
                  <th className="border border-slate-400 p-2 w-40">Elemen</th>
                  <th className="border border-slate-400 p-2">
                    Redaksi Capaian Pembelajaran (Kepka BKPDM No. 020 Tahun 2026)
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedCps.map((cp) => (
                  <tr key={cp.code}>
                    <td className="border border-slate-400 p-2 text-center font-bold tabular-nums align-top">
                      CP {cp.code}
                    </td>
                    <td className="border border-slate-400 p-2 font-bold align-top">{cp.elemen}</td>
                    <td className="border border-slate-400 p-2 doc-justify align-top">
                      {cp.redaksi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TP Section */}
        {showTP && (
          <div className={showCP ? 'print-page-break mb-7' : 'mb-7'}>
            {showCP && (
              <div className="no-print my-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <div className="flex-1 border-t border-dashed border-slate-300" />
                <span>Batas Halaman Baru (Tujuan Pembelajaran)</span>
                <div className="flex-1 border-t border-dashed border-slate-300" />
              </div>
            )}
            <h2 className="text-sm font-bold text-[#14532d] mb-2 uppercase tracking-wide">
              {sectionNumberForTP} Daftar Tujuan Pembelajaran (TP) Pendekatan Pembelajaran Mendalam ({faseTps.length} TP)
            </h2>
            <table className="print-table w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-left">
                  <th className="border border-slate-400 p-2 w-20">Kode TP</th>
                  <th className="border border-slate-400 p-2 w-28">Elemen dan CP</th>
                  <th className="border border-slate-400 p-2">Rumusan TP Lengkap dan Materi Pokok</th>
                  <th className="border border-slate-400 p-2 w-36">KKO dan Dimensi P5</th>
                  <th className="border border-slate-400 p-2 w-56">Indikator Mindful, Meaningful, dan Joyful</th>
                </tr>
              </thead>
              <tbody>
                {faseTps.map((tp) => (
                  <tr key={tp.id}>
                    <td className="border border-slate-400 p-2 font-bold tabular-nums align-top">
                      {tp.code}
                    </td>
                    <td className="border border-slate-400 p-2 align-top">
                      <div className="font-semibold">{tp.elemen}</div>
                      <div className="text-[11px] text-slate-600">CP {tp.cpCode}</div>
                    </td>
                    <td className="border border-slate-400 p-2 align-top doc-justify">
                      <div className="font-semibold text-[#14532d] mb-0.5">{tp.materiPokok}</div>
                      <div>{tp.rumusan}</div>
                    </td>
                    <td className="border border-slate-400 p-2 align-top">
                      <div className="font-semibold">{tp.kko}</div>
                      <div className="text-[11px] text-slate-600 mt-1">{tp.dimensiP5.join(', ')}</div>
                    </td>
                    <td className="border border-slate-400 p-2 align-top space-y-1 text-[11px] doc-justify">
                      <div>
                        <strong>Mindful:</strong> {tp.indikatorMindful}
                      </div>
                      <div>
                        <strong>Meaningful:</strong> {tp.indikatorMeaningful}
                      </div>
                      <div>
                        <strong>Joyful:</strong> {tp.indikatorJoyful}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ATP Section */}
        {showATP && (
          <div className={showCP || showTP ? 'print-page-break mb-7' : 'mb-7'}>
            {(showCP || showTP) && (
              <div className="no-print my-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <div className="flex-1 border-t border-dashed border-slate-300" />
                <span>Batas Halaman Baru (Alur Tujuan Pembelajaran)</span>
                <div className="flex-1 border-t border-dashed border-slate-300" />
              </div>
            )}
            <h2 className="text-sm font-bold text-[#14532d] mb-2 uppercase tracking-wide">
              {sectionNumberForATP} Alur Tujuan Pembelajaran (ATP) Pendekatan Pembelajaran Mendalam ({atps.length} Unit, Total {totalJP} JP)
            </h2>
            <table className="print-table w-full text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50 text-left">
                  <th className="border border-slate-400 p-2 w-10 text-center">No.</th>
                  <th className="border border-slate-400 p-2 w-24">Semester</th>
                  <th className="border border-slate-400 p-2 w-20">Kode TP</th>
                  <th className="border border-slate-400 p-2 w-52">Materi Pokok dan Rumusan TP</th>
                  <th className="border border-slate-400 p-2 w-14 text-center">JP</th>
                  <th className="border border-slate-400 p-2">Aktivitas Pembelajaran Mendalam</th>
                  <th className="border border-slate-400 p-2 w-24">Asesmen</th>
                </tr>
              </thead>
              <tbody>
                {atps.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-slate-400 p-2 text-center font-bold tabular-nums align-top">
                      {row.noUrut}
                    </td>
                    <td className="border border-slate-400 p-2 align-top">{row.semester}</td>
                    <td className="border border-slate-400 p-2 font-bold tabular-nums align-top">
                      {row.kodeTP}
                    </td>
                    <td className="border border-slate-400 p-2 align-top doc-justify">
                      <div className="font-bold text-[#14532d]">{row.materi}</div>
                      <div className="text-[11px] mt-0.5">{row.rumusanTP}</div>
                    </td>
                    <td className="border border-slate-400 p-2 text-center font-bold tabular-nums align-top">
                      {row.alokasiJP} JP
                    </td>
                    <td className="border border-slate-400 p-2 align-top space-y-1 text-[11px] doc-justify">
                      <div>
                        <strong>Mindful (5 menit):</strong> {row.aktivitasMindful}
                      </div>
                      <div>
                        <strong>Meaningful (25 menit):</strong> {row.aktivitasMeaningful}
                      </div>
                      <div>
                        <strong>Joyful (10 menit):</strong> {row.aktivitasJoyful}
                      </div>
                      <div>
                        <strong>Refleksi (5 menit):</strong> {row.aktivitasRefleksi}
                      </div>
                    </td>
                    <td className="border border-slate-400 p-2 align-top font-semibold">
                      {row.asesmen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(showCP || showTP || showATP) && (
          <SignaturePrintBlock identity={identity} />
        )}

        {/* Single Modul Ajar */}
        {showSingleModul && (
          activeModul ? (
            <ModulPrintSection identity={identity} modul={activeModul} showFullKop={true} />
          ) : (
            <div className="py-10 text-center text-sm text-slate-500">
              Belum ada Modul Ajar pada Fase {identity.fase}. Silakan generate ATP dan Modul Ajar terlebih dahulu.
            </div>
          )
        )}

        {/* All Modul Ajar / Bundle */}
        {showAllModuls && (
          faseModuls.length > 0 ? (
            faseModuls.map((m, idx) => (
              <div
                key={m.id}
                className={
                  activeDocMode === 'full_bundle' || idx > 0 ? 'print-page-break' : ''
                }
              >
                {(activeDocMode === 'full_bundle' || idx > 0) && (
                  <div className="no-print my-6 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                    <div className="flex-1 border-t border-dashed border-slate-300" />
                    <span>
                      Halaman Baru — Modul Ajar #{idx + 1} ({m.kodeTP})
                    </span>
                    <div className="flex-1 border-t border-dashed border-slate-300" />
                  </div>
                )}
                <ModulPrintSection
                  identity={identity}
                  modul={m}
                  showFullKop={activeDocMode === 'all_modul' && idx === 0}
                />
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-sm text-slate-500">
              Belum ada Modul Ajar untuk Fase {identity.fase}. Silakan buka menu Modul Ajar untuk generate terlebih dahulu.
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
              Pratinjau Cetak F4, Unduh PDF &amp; Ekspor Word (.docx)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Setiap hasil generate (CP, TP, ATP, dan Modul Ajar) diformat F4 (215 × 330 mm) siap cetak dengan Kop Sekolah, tabel terkunci presisi, pengulangan header otomatis, dan blok tanda tangan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFullScreenPreview((v) => !v)}
            className="min-h-[42px] self-start inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer whitespace-nowrap"
          >
            {fullScreenPreview ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span>{fullScreenPreview ? 'Tutup Pratinjau Penuh' : 'Pratinjau Layar Penuh'}</span>
          </button>
        </div>

        {/* Selector Cakupan Dokumen */}
        <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            1. Pilih Dokumen yang Akan Dipratinjau &amp; Disimpan:
          </div>
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-100 dark:bg-slate-800 rounded-xl">
            {DOC_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangeDocMode(opt.value)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  activeDocMode === opt.value
                    ? 'bg-[#14532d] text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {activeDocMode === 'modul' && faseModuls.length > 0 && (
            <div className="pt-1">
              <label
                htmlFor="export-modul-select"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
              >
                Pilih Unit Modul Ajar:
              </label>
              <select
                id="export-modul-select"
                value={activeModul?.atpId || ''}
                onChange={(e) => onChangeSelectedModulAtpId(e.target.value)}
                className="w-full md:w-auto md:min-w-[420px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                {faseModuls.map((m, idx) => (
                  <option key={m.id} value={m.atpId}>
                    #{idx + 1} · {m.semester} · {m.kodeTP} ({m.alokasiJP} JP) — {m.materiPokok}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Tombol Simpan PDF & Word */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            2. Simpan / Cetak Dokumen Terpilih ({activeModeLabel}):
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onDownloadDocx(activeDocMode, activeModul)}
              className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Simpan Word (.docx) — {activeModeLabel}</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="min-h-[46px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Unduh PDF / Print</span>
            </button>

            <button
              type="button"
              onClick={() => onDownloadDocx('both')}
              className="min-h-[46px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-[#14532d] dark:text-emerald-400" />
              <span>Unduh TP &amp; ATP (.docx)</span>
            </button>

            <button
              type="button"
              onClick={onCopyTP}
              className="min-h-[46px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              <span>Salin TP</span>
            </button>

            <button
              type="button"
              onClick={onDownloadStandaloneHtml}
              className="min-h-[46px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#14532d] dark:border-emerald-600 text-[#14532d] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Unduh 1 File HTML (Offline)</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tips PDF: Klik <strong>Unduh PDF / Print</strong> lalu pilih tujuan <em>Save as PDF</em>, ukuran kertas <em>F4 / Folio (215 × 330 mm)</em>, dan matikan opsi <em>Headers and footers</em> agar hasil PDF bersih siap jilid. File Word (.docx) sudah memakai ukuran F4, lebar kolom tetap, &amp; pengulangan header tabel otomatis.
          </p>
        </div>
      </section>

      {/* Indikator Bar Pratinjau */}
      <div className="no-print flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 px-1">
        <div className="inline-flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#14532d] dark:text-emerald-400" />
          <span>Pratinjau Kertas F4 — {activeModeLabel}</span>
        </div>
        <span className="tabular-nums text-slate-500">
          Ukuran F4 Portrait (215 × 330 mm) · Margin Ilmiah 20/18/20/22 mm
        </span>
      </div>

      {/* Mode Normal vs Pratinjau Layar Penuh */}
      {fullScreenPreview ? (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm overflow-y-auto p-4 sm:p-8">
          <div className="no-print max-w-[215mm] mx-auto mb-4 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="text-xs font-bold text-[#14532d] dark:text-emerald-400">
              Pratinjau Cetak F4 — {activeModeLabel}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onDownloadDocx(activeDocMode, activeModul)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14532d] text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Simpan Word (.docx)</span>
              </button>
              <button
                type="button"
                onClick={onPrint}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF / Print</span>
              </button>
              <button
                type="button"
                onClick={() => setFullScreenPreview(false)}
                className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto pb-8">{previewSheet}</div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">{previewSheet}</div>
      )}
    </div>
  );
};
