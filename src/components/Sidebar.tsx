import React from 'react';
import {
  BookCheck,
  BookOpenText,
  Building2,
  Download,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Moon,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import { NavPage, SchoolIdentity } from '../types/curriculum';

interface SidebarProps {
  activePage: NavPage;
  identity: SchoolIdentity;
  tpCount: number;
  atpCount: number;
  modulCount: number;
  darkMode: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectPage: (page: NavPage) => void;
  onToggleDark: () => void;
  onOpenQuickSettings: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  identity,
  tpCount,
  atpCount,
  modulCount,
  darkMode,
  mobileOpen,
  onCloseMobile,
  onSelectPage,
  onToggleDark,
  onOpenQuickSettings,
  onLogout,
}) => {
  const navItems: { id: NavPage; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard & Tes', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'identitas', label: 'Identitas Sekolah', icon: <Building2 className="w-4 h-4 shrink-0" /> },
    { id: 'pilih-cp', label: 'Pilih CP (020/2026)', icon: <BookCheck className="w-4 h-4 shrink-0" /> },
    { id: 'generator-tp', label: 'Generator TP', icon: <ListChecks className="w-4 h-4 shrink-0" />, count: tpCount },
    { id: 'generator-atp', label: 'Generator ATP', icon: <GitBranch className="w-4 h-4 shrink-0" />, count: atpCount },
    { id: 'modul-ajar', label: 'Modul Ajar Lengkap', icon: <BookOpenText className="w-4 h-4 shrink-0" />, count: modulCount },
    { id: 'unduh-print', label: 'Unduh PDF / Print & DOCX', icon: <Download className="w-4 h-4 shrink-0" /> },
  ];

  const handleNav = (page: NavPage) => {
    onSelectPage(page);
    onCloseMobile();
  };

  const content = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-base font-bold text-[#14532d] dark:text-emerald-400">
              PAI Kurikulum Merdeka
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
              Kepka 020/2026 · Fase {identity.fase}
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleNav('identitas')}
          className="w-full text-left mb-4 p-3 rounded-lg bg-stone-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-[#14532d] dark:hover:border-emerald-500 transition-colors cursor-pointer"
        >
          <div className="text-xs font-bold text-[#14532d] dark:text-emerald-400 truncate">
            {identity.namaSekolah}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
            {identity.namaGuru}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
            NPSN {identity.npsn} · TA {identity.tahunAjaran}
          </div>
        </button>

        <nav className="space-y-1.5" aria-label="Menu Utama">
          {navItems.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full min-h-[44px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#14532d] text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span
                    className={`text-xs tabular-nums shrink-0 ${
                      active ? 'text-amber-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => {
            onOpenQuickSettings();
            onCloseMobile();
          }}
          className="w-full min-h-[42px] flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Pengaturan Cepat</span>
        </button>

        <button
          type="button"
          onClick={onToggleDark}
          className="w-full min-h-[42px] flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
          <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full min-h-[42px] flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="no-print hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {content}
      </aside>

      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};
