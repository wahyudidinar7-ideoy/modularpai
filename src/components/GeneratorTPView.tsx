import React, { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Edit3,
  GitBranch,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  checkOutsideKepka0202026,
  CP_DATABASE,
  ELEMEN_LIST,
  P5_DIMENSIONS,
} from '../data/cpDatabase';
import { AssessmentType, ElemenName, Fase, SchoolIdentity, TPItem } from '../types/curriculum';
import { inferPrereqTagAndRank } from '../utils/generators';

interface GeneratorTPViewProps {
  fase: Fase;
  identity?: SchoolIdentity;
  tps: TPItem[];
  onGenerateTP: () => void;
  onGenerateATP: () => void;
  onAddTP: (tp: TPItem) => void;
  onUpdateTP: (tp: TPItem) => void;
  onDeleteTP: (id: string) => void;
  onCopyAllTP: () => void;
  onOpenPrintPreview?: () => void;
}

export const GeneratorTPView: React.FC<GeneratorTPViewProps> = ({
  fase,
  identity,
  tps,
  onGenerateTP,
  onGenerateATP,
  onAddTP,
  onUpdateTP,
  onDeleteTP,
  onCopyAllTP,
  onOpenPrintPreview,
}) => {
  const [filterElemen, setFilterElemen] = useState<'Semua' | ElemenName>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingTP, setEditingTP] = useState<TPItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const faseCps = useMemo(() => CP_DATABASE.filter((c) => c.fase === fase), [fase]);

  const [newForm, setNewForm] = useState({
    cpCode: faseCps[0]?.code || '1.1',
    materiPokok: '',
    kko: fase === 'A' ? 'Mempraktikkan (C3)' : fase === 'B' ? 'Menerapkan (C3)' : 'Menganalisis (C4)',
    rumusan: '',
    dimensiP5: [P5_DIMENSIONS[0]],
    indikatorMindful: 'Siswa duduk tenang 10 detik, membaca basmalah, dan menyadari tujuan belajar hari ini.',
    indikatorMeaningful: '',
    indikatorJoyful: 'Permainan kartu berpasangan dan refleksi ceria.',
    indikatorRefleksi: 'Siswa menuliskan satu kebaikan yang akan dipraktikkan di rumah.',
    suggestedJP: 4,
    suggestedSemesterIndex: 0,
    suggestedAsesmen: 'Observasi' as AssessmentType,
  });

  const faseTps = useMemo(() => tps.filter((t) => t.fase === fase), [tps, fase]);

  const filteredTps = useMemo(() => {
    return faseTps.filter((tp) => {
      const matchElemen = filterElemen === 'Semua' || tp.elemen === filterElemen;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        tp.code.toLowerCase().includes(q) ||
        tp.rumusan.toLowerCase().includes(q) ||
        tp.materiPokok.toLowerCase().includes(q);
      return matchElemen && matchSearch;
    });
  }, [faseTps, filterElemen, searchQuery]);

  const handleCopyOne = (tp: TPItem) => {
    const text = `[${tp.code}] (${tp.elemen} - CP ${tp.cpCode})\n${tp.rumusan}\nMindful: ${tp.indikatorMindful}\nMeaningful: ${tp.indikatorMeaningful}\nJoyful: ${tp.indikatorJoyful}`;
    navigator.clipboard.writeText(text);
    setCopiedId(tp.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addScopeWarning = checkOutsideKepka0202026(
    `${newForm.materiPokok} ${newForm.rumusan}`,
    fase,
    newForm.cpCode
  );

  const editScopeWarning = editingTP
    ? checkOutsideKepka0202026(
        `${editingTP.materiPokok} ${editingTP.rumusan}`,
        fase,
        editingTP.cpCode
      )
    : { isOutside: false, reason: '' };

  const handleOpenAdd = () => {
    const defaultCp = faseCps[0]?.code || '1.1';
    setNewForm({
      cpCode: defaultCp,
      materiPokok: '',
      kko: fase === 'A' ? 'Mempraktikkan (C3)' : fase === 'B' ? 'Menerapkan (C3)' : 'Menganalisis (C4)',
      rumusan: '',
      dimensiP5: [P5_DIMENSIONS[0]],
      indikatorMindful:
        'Siswa duduk tenang 10 detik, menarik napas, dan menyadari nikmat Allah sebelum belajar.',
      indikatorMeaningful: 'Siswa mengaitkan materi pembelajaran dengan kebiasaan baik di rumah dan sekolah.',
      indikatorJoyful: 'Permainan kartu interaktif atau bermain peran kelompok dengan penuh keceriaan.',
      indikatorRefleksi: 'Siswa menyebutkan satu hikmah yang akan diamalkan hari ini.',
      suggestedJP: 4,
      suggestedSemesterIndex: 0,
      suggestedAsesmen: 'Observasi',
    });
    setShowAddModal(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (addScopeWarning.isOutside) return;
    const cp = CP_DATABASE.find((c) => c.code === newForm.cpCode) || faseCps[0];
    const existingForCp = faseTps.filter((t) => t.cpCode === cp.code);
    const nextIndex = existingForCp.length + 1;
    const code = `TP ${cp.code}.${nextIndex}`;
    const { prereqTag, orderRank } = inferPrereqTagAndRank(
      `${newForm.materiPokok} ${newForm.rumusan}`,
      cp.code
    );

    const created: TPItem = {
      id: `tp-manual-${Date.now()}`,
      code,
      fase,
      cpCode: cp.code,
      elemen: cp.elemen,
      rumusan: newForm.rumusan.trim(),
      materiPokok: newForm.materiPokok.trim(),
      kko: newForm.kko.trim(),
      dimensiP5: newForm.dimensiP5.length > 0 ? newForm.dimensiP5 : [P5_DIMENSIONS[0]],
      indikatorMindful: newForm.indikatorMindful.trim(),
      indikatorMeaningful: newForm.indikatorMeaningful.trim(),
      indikatorJoyful: newForm.indikatorJoyful.trim(),
      indikatorRefleksi: newForm.indikatorRefleksi.trim(),
      prereqTag,
      orderRank,
      suggestedSemesterIndex: newForm.suggestedSemesterIndex,
      suggestedJP: newForm.suggestedJP,
      suggestedAsesmen: newForm.suggestedAsesmen,
    };

    onAddTP(created);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTP || editScopeWarning.isOutside) return;
    const { prereqTag, orderRank } = inferPrereqTagAndRank(
      `${editingTP.materiPokok} ${editingTP.rumusan}`,
      editingTP.cpCode
    );
    onUpdateTP({
      ...editingTP,
      prereqTag: editingTP.prereqTag.startsWith('custom_') ? prereqTag : editingTP.prereqTag,
      orderRank: editingTP.prereqTag.startsWith('custom_') ? orderRank : editingTP.orderRank,
    });
    setEditingTP(null);
  };

  const toggleP5 = (list: string[], dim: string): string[] => {
    return list.includes(dim) ? list.filter((d) => d !== dim) : [...list, dim];
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
              Generator Tujuan Pembelajaran (TP) · Fase {fase}
            </h1>
            {identity && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {identity.namaSekolah} (NPSN {identity.npsn}) · Guru PAI: {identity.namaGuru} · TA {identity.tahunAjaran}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Total <strong className="tabular-nums">{faseTps.length}</strong> TP · Rumus ABCD + Materi + Konteks Bermakna + Mindful/Meaningful/Joyful
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={onGenerateTP}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate TP</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah TP Manual</span>
            </button>
            <button
              type="button"
              onClick={onCopyAllTP}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              <span>Salin Semua TP</span>
            </button>
            <button
              type="button"
              onClick={onGenerateATP}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              <GitBranch className="w-4 h-4" />
              <span>Generate ATP</span>
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg">
            {(['Semua', ...ELEMEN_LIST] as const).map((el) => (
              <button
                key={el}
                type="button"
                onClick={() => setFilterElemen(el)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  filterElemen === el
                    ? 'bg-white dark:bg-slate-900 text-[#14532d] dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {el}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode atau materi TP..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>
        </div>
      </section>

      {filteredTps.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">
            Belum ada TP untuk filter atau fase ini
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Klik tombol Generate TP untuk memecah CP Kepka 020/2026 menjadi TP Pembelajaran Mendalam secara otomatis.
          </p>
          <button
            type="button"
            onClick={onGenerateTP}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#14532d] text-white text-sm font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate TP Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTps.map((tp) => (
            <article
              key={tp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="text-sm font-bold text-[#14532d] dark:text-emerald-400 tabular-nums">
                    {tp.code}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-800 dark:text-slate-200">{tp.elemen}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">CP {tp.cpCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{tp.kko}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyOne(tp)}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    {copiedId === tp.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTP({ ...tp, dimensiP5: [...tp.dimensiP5] })}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTP(tp.id)}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Materi Pokok: {tp.materiPokok}
                </div>
                <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
                  {tp.rumusan}
                </p>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Dimensi Profil Pelajar Pancasila:</strong> {tp.dimensiP5.join(' · ')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                  <div className="font-bold text-[#14532d] dark:text-emerald-400 mb-1">
                    Mindful (Berkesadaran)
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tp.indikatorMindful}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                  <div className="font-bold text-[#14532d] dark:text-emerald-400 mb-1">
                    Meaningful (Bermakna)
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tp.indikatorMeaningful}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60">
                  <div className="font-bold text-[#14532d] dark:text-emerald-400 mb-1">
                    Joyful (Menggembirakan)
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tp.indikatorJoyful}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Edit TP */}
      {editingTP && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                Edit Tujuan Pembelajaran ({editingTP.code})
              </h3>
              <button
                type="button"
                onClick={() => setEditingTP(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Kode TP</label>
                  <input
                    type="text"
                    required
                    value={editingTP.code}
                    onChange={(e) => setEditingTP({ ...editingTP, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">KKO (C1-C6)</label>
                  <input
                    type="text"
                    required
                    value={editingTP.kko}
                    onChange={(e) => setEditingTP({ ...editingTP, kko: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Materi Pokok</label>
                <input
                  type="text"
                  required
                  value={editingTP.materiPokok}
                  onChange={(e) => setEditingTP({ ...editingTP, materiPokok: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Rumusan TP Lengkap</label>
                <textarea
                  rows={3}
                  required
                  value={editingTP.rumusan}
                  onChange={(e) => setEditingTP({ ...editingTP, rumusan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {editScopeWarning.isOutside && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 text-xs font-semibold text-red-700 dark:text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{editScopeWarning.reason}</span>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold mb-1.5">Dimensi Profil Pelajar Pancasila</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {P5_DIMENSIONS.map((dim) => (
                    <label key={dim} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTP.dimensiP5.includes(dim)}
                        onChange={() =>
                          setEditingTP({
                            ...editingTP,
                            dimensiP5: toggleP5(editingTP.dimensiP5, dim),
                          })
                        }
                        className="accent-[#14532d]"
                      />
                      <span>{dim}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Mindful</label>
                <input
                  type="text"
                  required
                  value={editingTP.indikatorMindful}
                  onChange={(e) => setEditingTP({ ...editingTP, indikatorMindful: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Meaningful</label>
                <input
                  type="text"
                  required
                  value={editingTP.indikatorMeaningful}
                  onChange={(e) =>
                    setEditingTP({ ...editingTP, indikatorMeaningful: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Joyful</label>
                <input
                  type="text"
                  required
                  value={editingTP.indikatorJoyful}
                  onChange={(e) => setEditingTP({ ...editingTP, indikatorJoyful: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTP(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editScopeWarning.isOutside}
                  className="px-5 py-2 rounded-lg bg-[#14532d] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah TP Manual */}
      {showAddModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                Tambah TP Manual (Sesuai CP Kepka 020/2026)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">CP Asal (Kepka 020/2026)</label>
                  <select
                    value={newForm.cpCode}
                    onChange={(e) => setNewForm({ ...newForm, cpCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {faseCps.map((c) => (
                      <option key={c.code} value={c.code}>
                        CP {c.code} · {c.elemen}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Kata Kerja Operasional (KKO)</label>
                  <input
                    type="text"
                    required
                    value={newForm.kko}
                    onChange={(e) => setNewForm({ ...newForm, kko: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Materi Pokok</label>
                <input
                  type="text"
                  required
                  value={newForm.materiPokok}
                  onChange={(e) => setNewForm({ ...newForm, materiPokok: e.target.value })}
                  placeholder="Harus sesuai ruang lingkup CP terpilih..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Rumusan TP (KKO + Materi + Konteks Bermakna + Mindful/Meaningful/Joyful)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newForm.rumusan}
                  onChange={(e) => setNewForm({ ...newForm, rumusan: e.target.value })}
                  placeholder="Contoh: Peserta didik mampu ... melalui ... (meaningful) dengan penuh kesadaran (mindful) dan gembira (joyful)."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              {addScopeWarning.isOutside && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-300 text-xs font-semibold text-red-700 dark:text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{addScopeWarning.reason}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Mindful (5 menit awal)</label>
                <input
                  type="text"
                  required
                  value={newForm.indikatorMindful}
                  onChange={(e) => setNewForm({ ...newForm, indikatorMindful: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Meaningful (25 menit inti)</label>
                <input
                  type="text"
                  required
                  value={newForm.indikatorMeaningful}
                  onChange={(e) => setNewForm({ ...newForm, indikatorMeaningful: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Indikator Joyful (10 menit gembira)</label>
                <input
                  type="text"
                  required
                  value={newForm.indikatorJoyful}
                  onChange={(e) => setNewForm({ ...newForm, indikatorJoyful: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addScopeWarning.isOutside}
                  className="px-5 py-2 rounded-lg bg-[#14532d] disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan TP Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
