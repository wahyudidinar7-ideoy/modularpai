import React, { useEffect, useState } from 'react';
import {
  Copy,
  Download,
  Edit3,
  Eye,
  Printer,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  ATPItem,
  Fase,
  ModulAjarItem,
  SchoolIdentity,
} from '../types/curriculum';
import { ModulDocumentBody } from './ModulDocumentBody';

interface ModulAjarViewProps {
  fase: Fase;
  identity: SchoolIdentity;
  atps: ATPItem[];
  modulList: ModulAjarItem[];
  onGenerateAllModuls: () => void;
  onRegenerateSingleModul: (atpId: string) => void;
  onUpdateModul: (updated: ModulAjarItem) => void;
  onDownloadModulDocx: (modul: ModulAjarItem) => void;
  onCopyModul: (modul: ModulAjarItem) => void;
  onOpenPrintPreview?: (atpId: string) => void;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  fase,
  identity,
  atps,
  modulList,
  onGenerateAllModuls,
  onRegenerateSingleModul,
  onUpdateModul,
  onDownloadModulDocx,
  onCopyModul,
  onOpenPrintPreview,
}) => {
  const faseModuls = modulList.filter((m) => m.fase === fase);
  const [selectedAtpId, setSelectedAtpId] = useState<string>(atps[0]?.id || '');
  const [editingModul, setEditingModul] = useState<ModulAjarItem | null>(null);

  useEffect(() => {
    if (atps.length > 0 && !atps.some((a) => a.id === selectedAtpId)) {
      setSelectedAtpId(atps[0].id);
    }
  }, [atps, selectedAtpId]);

  const activeModul =
    faseModuls.find((m) => m.atpId === selectedAtpId) || faseModuls[0] || null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModul) return;
    const updatedLkpd = editingModul.lkpdPertemuanList?.map((lkpd, i) =>
      i === 0 ? { ...lkpd, kegiatanTugas: [...editingModul.lkpdTugas] } : lkpd
    );
    const updatedKonsep = editingModul.konsepBesar?.map((k, i) =>
      i === 0 ? { ...k, deskripsi: editingModul.pemahamanBermakna } : k
    );
    const updatedPertemuan = editingModul.pertemuanList?.map((p, i) =>
      i === 0
        ? {
            ...p,
            pendahuluanTujuan: editingModul.kegiatanPendahuluan,
            memahami: editingModul.kegiatanInti,
            penutupRefleksi: editingModul.kegiatanPenutup,
          }
        : p
    );
    onUpdateModul({
      ...editingModul,
      konsepBesar: updatedKonsep,
      pertemuanList: updatedPertemuan,
      lkpdPertemuanList: updatedLkpd,
    });
    setEditingModul(null);
  };

  if (atps.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
        <div className="text-base font-bold">
          Belum ada ATP untuk dijadikan pijakan Modul Ajar Fase {fase}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Silakan susun atau generate TP dan ATP terlebih dahulu agar Modul Ajar dapat berpedoman langsung dari CP, TP, dan ATP Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
              Modul Ajar Lengkap Kurikulum Merdeka · Fase {fase}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {identity.namaSekolah} (NPSN {identity.npsn}) · Guru PAI: {identity.namaGuru} · TA {identity.tahunAjaran}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Berpedoman langsung pada CP, TP, dan ATP yang telah ter-generate dalam format Rencana Pembelajaran Mendalam (11 Bagian Lengkap, LKPD per Pertemuan, dan Bahan Ajar Terstruktur).
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            {onOpenPrintPreview && activeModul && (
              <button
                type="button"
                onClick={() => onOpenPrintPreview(activeModul.atpId)}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#14532d] dark:border-emerald-600 text-[#14532d] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-bold cursor-pointer whitespace-nowrap"
              >
                <Eye className="w-4 h-4" />
                <span>Pratinjau F4 &amp; Paket Cetak</span>
              </button>
            )}
            <button
              type="button"
              onClick={onGenerateAllModuls}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Semua Modul ({atps.length})</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <label htmlFor="select-atp-modul" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Pilih Unit ATP / TP Sebagai Pijakan Modul Ajar:
            </label>
            <select
              id="select-atp-modul"
              value={selectedAtpId}
              onChange={(e) => setSelectedAtpId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            >
              {atps.map((a) => (
                <option key={a.id} value={a.id}>
                  #{a.noUrut} · {a.semester} · {a.kodeTP} ({a.alokasiJP} JP) — {a.materi}
                </option>
              ))}
            </select>
          </div>

          {activeModul && (
            <div className="flex flex-wrap gap-2 shrink-0 md:pt-5">
              <button
                type="button"
                onClick={() => onRegenerateSingleModul(activeModul.atpId)}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronkan dari ATP</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEditingModul({
                    ...activeModul,
                    pertanyaanPemantik: [...activeModul.pertanyaanPemantik],
                    persiapanPembelajaran: [...activeModul.persiapanPembelajaran],
                    lkpdPetunjuk: [...activeModul.lkpdPetunjuk],
                    lkpdTugas: [...activeModul.lkpdTugas],
                    glosarium: activeModul.glosarium.map((g) => ({ ...g })),
                    daftarPustaka: [...activeModul.daftarPustaka],
                  })
                }
                className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Modul</span>
              </button>
              <button
                type="button"
                onClick={() => onCopyModul(activeModul)}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Modul</span>
              </button>
              <button
                type="button"
                onClick={() => onDownloadModulDocx(activeModul)}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>Unduh DOCX</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Unduh PDF / Print</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {!activeModul ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <div className="text-base font-bold">Modul Ajar belum digenerate untuk Fase {fase}</div>
          <button
            type="button"
            onClick={onGenerateAllModuls}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14532d] text-white text-sm font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Modul Ajar Sekarang</span>
          </button>
        </div>
      ) : (
        <article className="print-surface max-w-[215mm] min-h-[330mm] mx-auto bg-white text-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:px-[22mm] sm:py-[20mm]">
          <ModulDocumentBody identity={identity} modul={activeModul} showFullKop={true} />
        </article>
      )}

      {/* Modal Edit Modul Ajar */}
      {editingModul && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                Edit Modul Ajar ({editingModul.kodeTP})
              </h3>
              <button
                type="button"
                onClick={() => setEditingModul(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="font-bold text-xs text-[#14532d] dark:text-emerald-400">
                1. Informasi Umum
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Kompetensi Awal</label>
                <textarea
                  rows={2}
                  value={editingModul.kompetensiAwal}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, kompetensiAwal: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Metode Pembelajaran</label>
                <input
                  type="text"
                  value={editingModul.metodePembelajaran || ''}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, metodePembelajaran: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Model Pembelajaran</label>
                <input
                  type="text"
                  value={editingModul.modelPembelajaran}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, modelPembelajaran: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="font-bold text-xs text-[#14532d] dark:text-emerald-400 pt-2">
                2. Komponen Inti
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Pemahaman Bermakna</label>
                <textarea
                  rows={2}
                  value={editingModul.pemahamanBermakna}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, pemahamanBermakna: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Pertanyaan Pemantik (1 baris per pertanyaan)
                </label>
                <textarea
                  rows={2}
                  value={editingModul.pertanyaanPemantik.join('\n')}
                  onChange={(e) =>
                    setEditingModul({
                      ...editingModul,
                      pertanyaanPemantik: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Kegiatan Pendahuluan</label>
                <textarea
                  rows={3}
                  value={editingModul.kegiatanPendahuluan}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, kegiatanPendahuluan: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Kegiatan Inti</label>
                <textarea
                  rows={3}
                  value={editingModul.kegiatanInti}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, kegiatanInti: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Kegiatan Penutup</label>
                <textarea
                  rows={3}
                  value={editingModul.kegiatanPenutup}
                  onChange={(e) =>
                    setEditingModul({ ...editingModul, kegiatanPenutup: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="font-bold text-xs text-[#14532d] dark:text-emerald-400 pt-2">
                3. Lampiran (LKPD)
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Tugas LKPD (1 baris per nomor tugas)
                </label>
                <textarea
                  rows={4}
                  value={editingModul.lkpdTugas.join('\n')}
                  onChange={(e) =>
                    setEditingModul({
                      ...editingModul,
                      lkpdTugas: e.target.value.split('\n').filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingModul(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#14532d] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Modul Ajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
