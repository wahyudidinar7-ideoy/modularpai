import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  GripVertical,
  Printer,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import {
  AssessmentType,
  ATPItem,
  CompletenessIssue,
  Fase,
  OrderWarning,
  SchoolIdentity,
} from '../types/curriculum';
import { getSemestersForFase } from '../utils/generators';

interface GeneratorATPViewProps {
  fase: Fase;
  identity?: SchoolIdentity;
  atps: ATPItem[];
  orderWarnings: OrderWarning[];
  completenessIssues: CompletenessIssue[];
  onGenerateATP: () => void;
  onMoveATP: (index: number, direction: -1 | 1) => void;
  onReorderATP: (fromIndex: number, toIndex: number) => void;
  onAutoFixOrder: () => void;
  onUpdateATP: (item: ATPItem) => void;
  onDeleteATP: (id: string) => void;
  onGoToSelectCP: () => void;
  onOpenPrintPreview?: () => void;
}

const ASSESSMENT_OPTIONS: AssessmentType[] = [
  'Observasi',
  'Hafalan',
  'Praktik',
  'Tes Lisan',
  'Proyek',
];

export const GeneratorATPView: React.FC<GeneratorATPViewProps> = ({
  fase,
  identity,
  atps,
  orderWarnings,
  completenessIssues,
  onGenerateATP,
  onMoveATP,
  onReorderATP,
  onAutoFixOrder,
  onUpdateATP,
  onDeleteATP,
  onGoToSelectCP,
  onOpenPrintPreview,
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<ATPItem | null>(null);
  const [showCompletenessReport, setShowCompletenessReport] = useState(false);

  const semesters = getSemestersForFase(fase);
  const totalJP = atps.reduce((sum, a) => sum + Number(a.alokasiJP || 0), 0);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    onUpdateATP(editingRow);
    setEditingRow(null);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
              Alur Tujuan Pembelajaran (ATP) · Fase {fase}
            </h1>
            {identity && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {identity.namaSekolah} (NPSN {identity.npsn}) · Guru PAI: {identity.namaGuru} · TA {identity.tahunAjaran}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 tabular-nums">
              Total {atps.length} unit pembelajaran · {totalJP} JP · Urutan prasyarat logis &amp; Aktivitas Pembelajaran Mendalam
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onGenerateATP}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate ATP</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCompletenessReport((v) => !v)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer whitespace-nowrap"
            >
              <ClipboardCheck className="w-4 h-4 text-[#14532d] dark:text-emerald-400" />
              <span>Cek Kelengkapan</span>
            </button>
            {onOpenPrintPreview && (
              <button
                type="button"
                onClick={onOpenPrintPreview}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#14532d] dark:border-emerald-600 text-[#14532d] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-bold cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4" />
                <span>Pratinjau &amp; Cetak / Word</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Peringatan Urutan Salah (Merah) */}
      {orderWarnings.length > 0 && (
        <section
          role="alert"
          className="bg-red-50 dark:bg-red-950/50 border-2 border-red-400 dark:border-red-700 rounded-xl p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5 text-red-800 dark:text-red-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Peringatan Urutan Prasyarat ATP ({orderWarnings.length} temuan)</span>
            </div>
            <button
              type="button"
              onClick={onAutoFixOrder}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer shrink-0"
            >
              <Wand2 className="w-4 h-4" />
              <span>Perbaiki Urutan Otomatis</span>
            </button>
          </div>
          <ul className="space-y-1.5 text-sm text-red-800 dark:text-red-200 list-disc pl-5">
            {orderWarnings.map((w) => (
              <li key={w.id} className="font-semibold">
                {w.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cek Kelengkapan */}
      {(showCompletenessReport || completenessIssues.length > 0) && (
        <section
          className={`rounded-xl p-5 border ${
            completenessIssues.length > 0
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              {completenessIssues.length > 0 ? (
                <>
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Hasil Cek Kelengkapan CP ke TP &amp; ATP:</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Semua 5 CP Fase {fase} sudah memiliki TP dan masuk ke dalam ATP!</span>
                </>
              )}
            </div>
            {completenessIssues.length > 0 && (
              <button
                type="button"
                onClick={onGoToSelectCP}
                className="px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
              >
                Lengkapi CP Sekarang
              </button>
            )}
          </div>
          {completenessIssues.length > 0 && (
            <ul className="mt-2.5 space-y-1 text-sm list-disc pl-5">
              {completenessIssues.map((iss, idx) => (
                <li key={idx} className="font-semibold">
                  {iss.message}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {atps.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <div className="text-base font-bold">Belum ada baris ATP untuk Fase {fase}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pastikan sudah ada TP, lalu klik Generate ATP untuk menyusun alur semester secara otomatis.
          </p>
          <button
            type="button"
            onClick={onGenerateATP}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14532d] text-white text-sm font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate ATP Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {atps.map((row, idx) => {
            const hasWarning = orderWarnings.some((w) => w.atpId === row.id);
            return (
              <div
                key={row.id}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== idx) {
                    onReorderATP(dragIndex, idx);
                  }
                  setDragIndex(null);
                }}
                className={`bg-white dark:bg-slate-900 rounded-xl p-5 border transition-colors ${
                  hasWarning
                    ? 'border-red-400 dark:border-red-700 bg-red-50/30 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2.5 text-sm">
                    <span
                      title="Seret untuk memindah urutan"
                      className="hidden sm:inline-flex items-center text-slate-400 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-[#14532d] dark:text-emerald-400 tabular-nums">
                      #{row.noUrut}
                    </span>
                    <span aria-hidden="true">·</span>
                    <select
                      aria-label={`Semester untuk ${row.kodeTP}`}
                      value={row.semester}
                      onChange={(e) => onUpdateATP({ ...row, semester: e.target.value })}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs font-bold"
                    >
                      {semesters.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold tabular-nums">{row.kodeTP}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{row.elemen}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-xs font-bold tabular-nums text-amber-700 dark:text-amber-400">
                      {row.alokasiJP} JP
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Asesmen: {row.asesmen}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveATP(idx, -1)}
                      aria-label="Naikkan urutan"
                      className="min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 text-xs font-semibold cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Naik</span>
                    </button>
                    <button
                      type="button"
                      disabled={idx === atps.length - 1}
                      onClick={() => onMoveATP(idx, 1)}
                      aria-label="Turunkan urutan"
                      className="min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 text-xs font-semibold cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                      <span>Turun</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRow({ ...row })}
                      className="min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteATP(row.id)}
                      className="min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {row.materi}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {row.rumusanTP}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5 mt-3 text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                    <div className="font-bold text-[#14532d] dark:text-emerald-400">
                      Mindful (5 menit)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{row.aktivitasMindful}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                    <div className="font-bold text-[#14532d] dark:text-emerald-400">
                      Meaningful (25 menit)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {row.aktivitasMeaningful}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                    <div className="font-bold text-[#14532d] dark:text-emerald-400">
                      Joyful (10 menit)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">{row.aktivitasJoyful}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                    <div className="font-bold text-[#14532d] dark:text-emerald-400">
                      Refleksi (5 menit)
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {row.aktivitasRefleksi}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Edit ATP */}
      {editingRow && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                Edit Baris ATP ({editingRow.kodeTP})
              </h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Semester</label>
                  <select
                    value={editingRow.semester}
                    onChange={(e) => setEditingRow({ ...editingRow, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Alokasi (JP)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={editingRow.alokasiJP}
                    onChange={(e) =>
                      setEditingRow({ ...editingRow, alokasiJP: Number(e.target.value) || 2 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Jenis Asesmen</label>
                  <select
                    value={editingRow.asesmen}
                    onChange={(e) =>
                      setEditingRow({ ...editingRow, asesmen: e.target.value as AssessmentType })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {ASSESSMENT_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Materi</label>
                <input
                  type="text"
                  required
                  value={editingRow.materi}
                  onChange={(e) => setEditingRow({ ...editingRow, materi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Rumusan TP</label>
                <textarea
                  rows={2}
                  required
                  value={editingRow.rumusanTP}
                  onChange={(e) => setEditingRow({ ...editingRow, rumusanTP: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Aktivitas Mindful (5 menit)</label>
                <input
                  type="text"
                  required
                  value={editingRow.aktivitasMindful}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, aktivitasMindful: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Aktivitas Meaningful (25 menit)
                </label>
                <input
                  type="text"
                  required
                  value={editingRow.aktivitasMeaningful}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, aktivitasMeaningful: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Aktivitas Joyful (10 menit)</label>
                <input
                  type="text"
                  required
                  value={editingRow.aktivitasJoyful}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, aktivitasJoyful: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Aktivitas Refleksi (5 menit)</label>
                <input
                  type="text"
                  required
                  value={editingRow.aktivitasRefleksi}
                  onChange={(e) =>
                    setEditingRow({ ...editingRow, aktivitasRefleksi: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#14532d] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Perubahan ATP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
