import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  GitBranch,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import { CP_DATABASE, DASAR_HUKUM_TEXT } from '../data/cpDatabase';
import {
  ATPItem,
  ButtonTestResult,
  CompletenessIssue,
  NavPage,
  OrderWarning,
  SchoolIdentity,
  TPItem,
} from '../types/curriculum';

interface DashboardViewProps {
  identity: SchoolIdentity;
  tps: TPItem[];
  atps: ATPItem[];
  completenessIssues: CompletenessIssue[];
  orderWarnings: OrderWarning[];
  testResults: ButtonTestResult[];
  onRunButtonTests: () => void;
  onNavigate: (page: NavPage) => void;
  onResetFaseA: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  identity,
  tps,
  atps,
  completenessIssues,
  orderWarnings,
  testResults,
  onRunButtonTests,
  onNavigate,
  onResetFaseA,
}) => {
  const faseTps = tps.filter((t) => t.fase === identity.fase);
  const faseCps = CP_DATABASE.filter((c) => c.fase === identity.fase);
  const totalJP = atps.reduce((sum, item) => sum + Number(item.alokasiJP || 0), 0);

  const steps: { num: string; title: string; desc: string; page: NavPage; btnText: string }[] = [
    {
      num: '01',
      title: 'Isi Identitas Sekolah',
      desc: 'Lengkapi data SD, Kepala Sekolah, Guru PAI, Fase, dan Tahun Ajaran untuk kop dokumen.',
      page: 'identitas',
      btnText: 'Buka Identitas',
    },
    {
      num: '02',
      title: 'Pilih CP Kepka 020/2026',
      desc: 'Tentukan Fase A/B/C dan centang CP elemen yang ingin dipecah menjadi TP.',
      page: 'pilih-cp',
      btnText: 'Pilih CP',
    },
    {
      num: '03',
      title: 'Generate & Edit TP',
      desc: 'Pecah tiap CP menjadi 4–5 TP berprinsip Mindful, Meaningful, dan Joyful.',
      page: 'generator-tp',
      btnText: 'Kelola TP',
    },
    {
      num: '04',
      title: 'Susun ATP & Unduh Dokumen',
      desc: 'Urutkan prasyarat per semester, cek kelengkapan, lalu unduh DOCX atau Unduh PDF / Print ukuran F4.',
      page: 'unduh-print',
      btnText: 'Unduh PDF / Print',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Pembelajaran Mendalam Kurikulum Merdeka · {identity.namaSekolah} (NPSN: {identity.npsn})
            </div>
            <h1 className="text-2xl font-bold text-[#14532d] dark:text-emerald-400 mt-1 text-balance">
              Generator TP &amp; ATP PAI SD (Fase {identity.fase})
            </h1>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1.5">
              Guru PAI Penyusun: {identity.namaGuru} (NIP. {identity.nipGuru || '-'}) · Kepala Sekolah: {identity.namaKepalaSekolah} · TA {identity.tahunAjaran}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {DASAR_HUKUM_TEXT} Contoh lengkap Fase A sudah dimuat otomatis agar Anda dapat langsung meninjau rumusan TP, susunan ATP per semester, serta mengunduh format DOCX.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onRunButtonTests}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Tes Tombol</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pilih-cp')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-bold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Mulai Susun TP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Fase &amp; Kelas</div>
            <div className="text-xl font-bold text-[#14532d] dark:text-emerald-400 mt-1 tabular-nums">
              Fase {identity.fase}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{identity.kelas}</div>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Tujuan Pembelajaran</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {faseTps.length} TP
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dari {faseCps.length} Elemen CP
            </div>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Alur Tujuan (ATP)</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {atps.length} Baris
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              4 Semester Tersusun
            </div>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Beban Belajar</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {totalJP} JP
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              TA {identity.tahunAjaran}
            </div>
          </div>
        </div>
      </section>

      {testResults.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#14532d] dark:text-emerald-400">
                Hasil Uji Fungsi Tombol Aplikasi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Memastikan seluruh aksi Simpan, Generate, Edit, Hapus, Naik/Turun, Filter, Cek Urutan, Salin, Print, dan Unduh DOCX berjalan normal.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {testResults.filter((r) => r.passed).length} / {testResults.length} Lolos
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {testResults.map((res, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs ${
                  res.passed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                }`}
              >
                {res.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{res.name}</div>
                  <div className="text-slate-600 dark:text-slate-300 mt-0.5">{res.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cek Kelengkapan CP Fase {identity.fase}
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('generator-atp')}
              className="text-xs font-semibold text-[#14532d] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Lihat di ATP
            </button>
          </div>
          <div className="space-y-2.5">
            {faseCps.map((cp) => {
              const count = faseTps.filter((t) => t.cpCode === cp.code).length;
              return (
                <div
                  key={cp.code}
                  className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm"
                >
                  <div className="truncate">
                    <span className="font-bold text-[#14532d] dark:text-emerald-400 tabular-nums">
                      CP {cp.code}
                    </span>{' '}
                    <span className="text-slate-700 dark:text-slate-200">{cp.elemen}</span>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums shrink-0 ${
                      count > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {count > 0 ? `${count} TP` : 'Belum ada TP'}
                  </span>
                </div>
              );
            })}
          </div>
          {completenessIssues.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              {completenessIssues.map((iss, i) => (
                <div key={i} className="font-semibold">
                  {iss.message}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Alur Penyusunan Cepat
            </h2>
            <div className="space-y-3">
              {steps.map((st) => (
                <div
                  key={st.num}
                  className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-[#14532d] dark:text-emerald-400 tabular-nums mr-1.5">
                        {st.num}.
                      </span>
                      {st.title}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(st.page)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    {st.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {orderWarnings.length === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <GitBranch className="w-3.5 h-3.5" />
                  Urutan ATP valid tanpa loncatan prasyarat
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {orderWarnings.length} peringatan urutan ATP terdeteksi
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onResetFaseA}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Muat Contoh Fase A</span>
            </button>
          </div>
        </section>
      </div>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-bold text-[#14532d] dark:text-emerald-400">
            Prinsip Pembelajaran Mendalam dalam Setiap TP &amp; ATP
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('generator-tp')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532d] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>Lihat Contoh TP Fase {identity.fase}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-[#14532d] dark:text-emerald-400">
              1. Mindful (Berkesadaran)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Setiap awal pertemuan diawali jeda hadir penuh (5 menit): tarik napas tenang, tadabbur ayat singkat, mengingat nikmat Allah, dan menyadari tujuan belajar.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-[#14532d] dark:text-emerald-400">
              2. Meaningful (Bermakna)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Kegiatan inti (25 menit) mengaitkan langsung konsep agama dengan kebiasaan nyata siswa di rumah, sekolah, dan masyarakat—bukan hafalan kosong.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="font-bold text-[#14532d] dark:text-emerald-400">
              3. Joyful (Menggembirakan)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Diperkaya permainan kartu, tepuk irama, main peran, dan proyek kecil (10 menit) serta refleksi (5 menit) tanpa membuat siswa tertekan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
