import React from 'react';
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  Download,
  GitBranch,
  ListChecks,
  Moon,
  RotateCcw,
  Sun,
  X,
} from 'lucide-react';
import { FASE_OPTIONS } from '../data/cpDatabase';
import { CompletenessIssue, Fase, OrderWarning } from '../types/curriculum';

interface QuickSettingsPanelProps {
  open: boolean;
  fase: Fase;
  darkMode: boolean;
  completenessIssues: CompletenessIssue[];
  orderWarnings: OrderWarning[];
  onClose: () => void;
  onChangeFase: (fase: Fase) => void;
  onToggleDark: () => void;
  onGenerateTP: () => void;
  onGenerateATP: () => void;
  onGenerateModulAjar: () => void;
  onExportDocxBoth: () => void;
  onResetExampleFaseA: () => void;
}

export const QuickSettingsPanel: React.FC<QuickSettingsPanelProps> = ({
  open,
  fase,
  darkMode,
  completenessIssues,
  orderWarnings,
  onClose,
  onChangeFase,
  onToggleDark,
  onGenerateTP,
  onGenerateATP,
  onGenerateModulAjar,
  onExportDocxBoth,
  onResetExampleFaseA,
}) => {
  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-[#14532d] dark:text-emerald-400">
                Panel Pengaturan Cepat
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kontrol cepat fase, tampilan, dan aksi generator
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel pengaturan cepat"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Ganti Fase Aktif
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FASE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChangeFase(opt.value)}
                  className={`min-h-[42px] px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    fase === opt.value
                      ? 'bg-[#14532d] text-white'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Fase {opt.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Tema Tampilan
            </div>
            <button
              type="button"
              onClick={onToggleDark}
              className="w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer"
            >
              <span>{darkMode ? 'Mode Gelap Aktif' : 'Mode Terang Aktif'}</span>
              {darkMode ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600" />
              )}
            </button>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Status Kelengkapan &amp; Urutan
            </div>
            <div className="space-y-2 text-xs">
              {completenessIssues.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Semua 5 CP Fase {fase} sudah lengkap menjadi TP &amp; ATP.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{completenessIssues.length} catatan kelengkapan CP perlu dilengkapi.</span>
                </div>
              )}

              {orderWarnings.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Urutan prasyarat ATP sudah logis.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{orderWarnings.length} peringatan urutan prasyarat ATP.</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Aksi Cepat Generator
            </div>
            <button
              type="button"
              onClick={() => {
                onGenerateTP();
                onClose();
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white text-sm font-semibold cursor-pointer"
            >
              <ListChecks className="w-4 h-4" />
              <span>Generate TP Otomatis</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onGenerateATP();
                onClose();
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-semibold cursor-pointer"
            >
              <GitBranch className="w-4 h-4" />
              <span>Generate ATP Otomatis</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onGenerateModulAjar();
                onClose();
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-[#14532d] dark:border-emerald-600 text-[#14532d] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-semibold cursor-pointer"
            >
              <BookOpenText className="w-4 h-4" />
              <span>Generate Modul Ajar Lengkap</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onExportDocxBoth();
                onClose();
              }}
              className="w-full min-h-[44px] flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh TP &amp; ATP (DOCX)</span>
            </button>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onResetExampleFaseA();
              onClose();
            }}
            className="w-full min-h-[42px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang Contoh Lengkap Fase A</span>
          </button>
        </div>
      </div>
    </div>
  );
};
