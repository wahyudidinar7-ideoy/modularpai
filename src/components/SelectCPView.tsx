import React, { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Printer,
  ShieldAlert,
  Sparkles,
  Square,
  X,
} from 'lucide-react';
import {
  checkOutsideKepka0202026,
  CP_DATABASE,
  DASAR_HUKUM_TEXT,
  FASE_OPTIONS,
} from '../data/cpDatabase';
import { Fase, SchoolIdentity } from '../types/curriculum';

interface SelectCPViewProps {
  fase: Fase;
  identity?: SchoolIdentity;
  selectedCpCodes: string[];
  onChangeFase: (fase: Fase) => void;
  onToggleCp: (code: string) => void;
  onSelectAllCps: () => void;
  onClearCps: () => void;
  onGenerateTP: () => void;
  onOpenPrintPreview?: () => void;
}

export const SelectCPView: React.FC<SelectCPViewProps> = ({
  fase,
  identity,
  selectedCpCodes,
  onChangeFase,
  onToggleCp,
  onSelectAllCps,
  onClearCps,
  onGenerateTP,
  onOpenPrintPreview,
}) => {
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [scopeQuery, setScopeQuery] = useState('');

  const faseCps = CP_DATABASE.filter((cp) => cp.fase === fase);
  const scopeResult = checkOutsideKepka0202026(scopeQuery, fase);

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
              Pilih Capaian Pembelajaran (CP) Resmi
            </h1>
            {identity && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {identity.namaSekolah} (NPSN {identity.npsn}) · Guru PAI: {identity.namaGuru} · TA {identity.tahunAjaran}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Database CP sudah tertanam utuh sesuai {DASAR_HUKUM_TEXT}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <label htmlFor="select-fase-cp" className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Pilih Fase:
            </label>
            <select
              id="select-fase-cp"
              value={fase}
              onChange={(e) => onChangeFase(e.target.value as Fase)}
              className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-[#14532d] dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            >
              {FASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSelectAllCps}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-[#14532d] dark:text-emerald-400" />
              <span>Centang Semua (5 CP)</span>
            </button>
            <button
              type="button"
              onClick={onClearCps}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              <Square className="w-4 h-4 text-slate-400" />
              <span>Hapus Centang</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenPrintPreview && (
              <button
                type="button"
                onClick={onOpenPrintPreview}
                className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#14532d] dark:border-emerald-600 text-[#14532d] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau &amp; Cetak / Word</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowOriginalModal(true)}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tampilkan CP Asli Kepka 020/2026</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {faseCps.map((cp) => {
            const checked = selectedCpCodes.includes(cp.code);
            return (
              <label
                key={cp.code}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer ${
                  checked
                    ? 'border-[#14532d] bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleCp(cp.code)}
                  className="mt-1 w-5 h-5 accent-[#14532d] shrink-0 cursor-pointer"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#14532d] dark:text-emerald-400">
                    <span className="tabular-nums">CP {cp.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{cp.elemen}</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed">
                    {cp.redaksi}
                  </p>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-300 tabular-nums">
            Terpilih: <strong>{selectedCpCodes.length}</strong> dari 5 CP Fase {fase}
          </div>
          <button
            type="button"
            disabled={selectedCpCodes.length === 0}
            onClick={onGenerateTP}
            className="min-h-[46px] inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#14532d] hover:bg-emerald-900 disabled:opacity-40 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate TP dari CP Terpilih</span>
          </button>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Validasi Materi terhadap Batas CP Kepka 020/2026
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sistem menolak materi di luar cakupan CP SD Kepka BKPDM No. 020 Tahun 2026 (misal: Mawaris, Munakahat, Fikih Muamalah, atau materi fase yang lebih tinggi).
        </p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={scopeQuery}
            onChange={(e) => setScopeQuery(e.target.value)}
            placeholder="Ketik topik untuk cek kesesuaian CP Fase ini (misal: Mawaris, Zakat Fitrah, Wudhu)..."
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
          />
        </div>
        {scopeQuery.trim().length > 2 && (
          <div className="mt-3">
            {scopeResult.isOutside ? (
              <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-sm text-red-800 dark:text-red-300 font-semibold">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>{scopeResult.reason}</div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <span>Topik tidak bertentangan dengan batas luar CP Kepka 020/2026 Fase {fase}.</span>
              </div>
            )}
          </div>
        )}
      </section>

      {showOriginalModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                  Naskah CP Asli — Kepka BKPDM No. 020 Tahun 2026
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {DASAR_HUKUM_TEXT}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOriginalModal(false)}
                aria-label="Tutup modal CP Asli"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-6 text-sm">
              {FASE_OPTIONS.map((fOpt) => (
                <div key={fOpt.value} className="space-y-2.5">
                  <h4 className="font-bold text-base text-[#14532d] dark:text-emerald-400 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                    {fOpt.label}
                  </h4>
                  {CP_DATABASE.filter((c) => c.fase === fOpt.value).map((item) => (
                    <div
                      key={item.code}
                      className="p-3.5 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="font-bold text-xs text-amber-700 dark:text-amber-400">
                        {item.code} · {item.elemen}
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">
                        {item.redaksi}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Redaksi CP verbatim tidak diubah sedikit pun dari dokumen resmi.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowOriginalModal(false)}
                className="px-4 py-2 rounded-lg bg-[#14532d] text-white text-xs font-bold cursor-pointer"
              >
                Tutup Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
