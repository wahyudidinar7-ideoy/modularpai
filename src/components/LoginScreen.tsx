import React, { useEffect, useState } from 'react';
import { BookOpen, Lock, Moon, Sun, UserCheck } from 'lucide-react';
import { SchoolIdentity, UserSession } from '../types/curriculum';

interface LoginScreenProps {
  identity: SchoolIdentity;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogin: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  identity,
  darkMode,
  onToggleDark,
  onLogin,
}) => {
  const [namaGuru, setNamaGuru] = useState(identity.namaGuru || 'Ahmad Fauzi, S.Pd.I.');
  const [nipOrEmail, setNipOrEmail] = useState(identity.nipGuru || '');
  const [pin, setPin] = useState('2026');
  const [error, setError] = useState('');

  useEffect(() => {
    setNamaGuru(identity.namaGuru || 'Ahmad Fauzi, S.Pd.I.');
    setNipOrEmail(identity.nipGuru || '');
  }, [identity.namaGuru, identity.nipGuru]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGuru.trim()) {
      setError('Mohon isi Nama Guru PAI terlebih dahulu.');
      return;
    }
    if (pin.trim().length < 4) {
      setError('PIN minimal 4 karakter (default: 2026).');
      return;
    }
    setError('');
    onLogin({
      namaGuru: namaGuru.trim(),
      nipOrEmail: nipOrEmail.trim() || '-',
      loggedInAt: new Date().toISOString(),
    });
  };

  const handleInstantLogin = () => {
    onLogin({
      namaGuru: namaGuru.trim() || identity.namaGuru || 'Guru PAI SD',
      nipOrEmail: nipOrEmail.trim() || identity.nipGuru || '-',
      loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-6 sm:px-6">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#14532d] text-amber-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#14532d] dark:text-emerald-400">
            Generator TP &amp; ATP PAI SD
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleDark}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[40px]"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-[#14532d] text-white rounded-2xl p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-300 tracking-wide">
              Kepka BKPDM No. 020 Tahun 2026 · Kurikulum Merdeka
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-3 leading-snug text-balance">
              Perangkat Pembelajaran Mendalam PAI &amp; Budi Pekerti SD
            </h1>
            <p className="text-sm text-emerald-100/90 mt-4 leading-relaxed">
              Susun Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) untuk Fase A, B, dan C secara otomatis berdasarkan Capaian Pembelajaran resmi dengan prinsip Mindful, Meaningful, dan Joyful.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-800 space-y-2.5 text-sm text-emerald-100">
            <div>1. Database CP verbatim Kepka BKPDM 020/2026 tertanam penuh</div>
            <div>2. Pemecahan otomatis 4–6 TP per CP sesuai taksonomi Bloom Fase A–C</div>
            <div>3. Validasi urutan prasyarat ATP &amp; ekspor langsung ke file DOCX</div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 sm:p-9 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Masuk Workspace Guru PAI
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {identity.namaSekolah} · Fase {identity.fase} ({identity.kelas}) · TA {identity.tahunAjaran}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-nama" className="block text-sm font-semibold mb-1.5">
                Nama Guru PAI Penyusun
              </label>
              <input
                id="login-nama"
                type="text"
                value={namaGuru}
                onChange={(e) => setNamaGuru(e.target.value)}
                placeholder="Contoh: Ahmad Fauzi, S.Pd.I."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              />
            </div>

            <div>
              <label htmlFor="login-nip" className="block text-sm font-semibold mb-1.5">
                NIP atau Email Sekolah (Opsional)
              </label>
              <input
                id="login-nip"
                type="text"
                value={nipOrEmail}
                onChange={(e) => setNipOrEmail(e.target.value)}
                placeholder="Contoh: 19890721 201903 1 008"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
              />
            </div>

            <div>
              <label htmlFor="login-pin" className="block text-sm font-semibold mb-1.5">
                PIN Akses Cepat (Minimal 4 digit)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Default: 2026"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PIN bawaan sudah terisi (2026). Anda dapat langsung menekan tombol masuk.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Masuk ke Generator TP &amp; ATP
              </button>
              <button
                type="button"
                onClick={handleInstantLogin}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Masuk Cepat (Langsung Buka Contoh Fase A)</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 dark:text-slate-400">
        Penyimpanan Lokal Browser (localStorage) · Data tetap aman saat halaman dimuat ulang
      </div>
    </div>
  );
};
