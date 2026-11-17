import React, { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { DASAR_HUKUM_TEXT, FASE_OPTIONS, getKopInstansiLines } from '../data/cpDatabase';
import { Fase, SchoolIdentity } from '../types/curriculum';

interface IdentityViewProps {
  identity: SchoolIdentity;
  onSave: (updated: SchoolIdentity) => void;
}

export const IdentityView: React.FC<IdentityViewProps> = ({ identity, onSave }) => {
  const [form, setForm] = useState<SchoolIdentity>(identity);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setForm(identity);
  }, [identity]);

  const selectedFaseMeta = FASE_OPTIONS.find((f) => f.value === form.fase) || FASE_OPTIONS[0];
  const kop = getKopInstansiLines(form);

  const handleFaseChange = (newFase: Fase) => {
    const meta = FASE_OPTIONS.find((f) => f.value === newFase) || FASE_OPTIONS[0];
    setForm((prev) => ({
      ...prev,
      fase: newFase,
      kelas: meta.kelasList[2] || meta.kelasList[0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#14532d] dark:text-emerald-400">
            Identitas Satuan Pendidikan &amp; Guru Penyusun
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Isi satu kali dan otomatis tersinkron ke seluruh tampilan aplikasi (Header, Sidebar, Dashboard) serta kop, tabel identitas, dan blok tanda tangan dokumen CP, TP, ATP, dan Modul Ajar (PDF &amp; Word).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id-pemda" className="block text-sm font-semibold mb-1.5">
              Pemerintah Kabupaten / Kota (Baris 1 Kop)
            </label>
            <input
              id="id-pemda"
              type="text"
              required
              placeholder="PEMERINTAH KABUPATEN ..."
              value={form.pemerintahDaerah ?? kop.pemerintahDaerah}
              onChange={(e) => setForm({ ...form, pemerintahDaerah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-dinas" className="block text-sm font-semibold mb-1.5">
              Dinas Pendidikan (Baris 2 Kop)
            </label>
            <input
              id="id-dinas"
              type="text"
              required
              placeholder="DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA"
              value={form.dinasPendidikan ?? kop.dinasPendidikan}
              onChange={(e) => setForm({ ...form, dinasPendidikan: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-nama-sd" className="block text-sm font-semibold mb-1.5">
              Nama SD / MI
            </label>
            <input
              id="id-nama-sd"
              type="text"
              required
              value={form.namaSekolah}
              onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-npsn" className="block text-sm font-semibold mb-1.5">
              NPSN
            </label>
            <input
              id="id-npsn"
              type="text"
              required
              value={form.npsn}
              onChange={(e) => setForm({ ...form, npsn: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="id-alamat" className="block text-sm font-semibold mb-1.5">
              Alamat Lengkap Sekolah
            </label>
            <input
              id="id-alamat"
              type="text"
              required
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-kota" className="block text-sm font-semibold mb-1.5">
              Kota / Kabupaten
            </label>
            <input
              id="id-kota"
              type="text"
              value={form.kotaKabupaten}
              onChange={(e) => setForm({ ...form, kotaKabupaten: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-tanggal" className="block text-sm font-semibold mb-1.5">
              Tanggal Pengesahan Dokumen
            </label>
            <input
              id="id-tanggal"
              type="text"
              value={form.tanggalDokumen}
              onChange={(e) => setForm({ ...form, tanggalDokumen: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-ks" className="block text-sm font-semibold mb-1.5">
              Nama Kepala Sekolah
            </label>
            <input
              id="id-ks"
              type="text"
              required
              value={form.namaKepalaSekolah}
              onChange={(e) => setForm({ ...form, namaKepalaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-nip-ks" className="block text-sm font-semibold mb-1.5">
              NIP Kepala Sekolah
            </label>
            <input
              id="id-nip-ks"
              type="text"
              value={form.nipKepalaSekolah}
              onChange={(e) => setForm({ ...form, nipKepalaSekolah: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-guru" className="block text-sm font-semibold mb-1.5">
              Nama Guru PAI Penyusun
            </label>
            <input
              id="id-guru"
              type="text"
              required
              value={form.namaGuru}
              onChange={(e) => setForm({ ...form, namaGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-nip-guru" className="block text-sm font-semibold mb-1.5">
              NIP Guru PAI
            </label>
            <input
              id="id-nip-guru"
              type="text"
              required
              value={form.nipGuru}
              onChange={(e) => setForm({ ...form, nipGuru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div>
            <label htmlFor="id-fase" className="block text-sm font-semibold mb-1.5">
              Fase Capaian Pembelajaran
            </label>
            <select
              id="id-fase"
              value={form.fase}
              onChange={(e) => handleFaseChange(e.target.value as Fase)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            >
              {FASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="id-kelas" className="block text-sm font-semibold mb-1.5">
              Kelas Sasaran
            </label>
            <select
              id="id-kelas"
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            >
              {selectedFaseMeta.kelasList.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="id-ta" className="block text-sm font-semibold mb-1.5">
              Tahun Ajaran
            </label>
            <input
              id="id-ta"
              type="text"
              required
              value={form.tahunAjaran}
              onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })}
              placeholder="2026/2027"
              className="w-full md:w-64 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-[#14532d]"
            />
          </div>

          <div className="md:col-span-2 pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Identitas</span>
            </button>
            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identitas tersimpan di perangkat Anda.</span>
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pratinjau Kop, Identitas &amp; Pengesahan Dokumen Resmi (Tersinkron Otomatis)
          </div>
          <span className="text-[11px] font-semibold text-[#14532d] dark:text-emerald-400">
            Format F4 identik dengan hasil Unduh PDF / Print &amp; Word (.docx)
          </span>
        </div>
        <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-5 sm:p-6 bg-white text-slate-900 space-y-5">
          <div className="text-center border-b-4 border-double border-[#14532d] pb-3.5">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {kop.pemerintahDaerah}
            </div>
            <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-0.5">
              {kop.dinasPendidikan}
            </div>
            <div className="text-lg font-bold text-[#14532d] uppercase tracking-wide mt-0.5">
              {form.namaSekolah || 'NAMA SEKOLAH'}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {form.alamat || '-'} · NPSN: {form.npsn || '-'} · {form.kotaKabupaten || '-'}
            </div>
            <div className="text-sm font-bold text-slate-900 mt-3 uppercase">
              PERANGKAT PEMBELAJARAN MENDALAM: CP, TP, ATP &amp; MODUL AJAR
            </div>
            <div className="text-xs font-semibold text-[#14532d] mt-0.5">
              Pendidikan Agama Islam dan Budi Pekerti · Fase {form.fase} ({form.kelas}) · Tahun Ajaran {form.tahunAjaran}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 italic">
              Dasar Hukum: {DASAR_HUKUM_TEXT}
            </div>
          </div>

          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-stone-50 w-40">Satuan Pendidikan</td>
                <td className="border border-slate-300 p-2">
                  {form.namaSekolah || '-'} (NPSN: {form.npsn || '-'})
                </td>
                <td className="border border-slate-300 p-2 font-bold bg-stone-50 w-36">Fase / Kelas / TA</td>
                <td className="border border-slate-300 p-2">
                  Fase {form.fase} ({form.kelas}) · {form.tahunAjaran}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-stone-50">Guru PAI Penyusun</td>
                <td className="border border-slate-300 p-2">
                  {form.namaGuru || '-'} (NIP. {form.nipGuru || '-'})
                </td>
                <td className="border border-slate-300 p-2 font-bold bg-stone-50">Kepala Sekolah</td>
                <td className="border border-slate-300 p-2">
                  {form.namaKepalaSekolah || '-'} (NIP. {form.nipKepalaSekolah || '-'})
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid grid-cols-2 gap-8 pt-4 text-xs text-center">
            <div className="flex flex-col items-center">
              <div>Mengetahui,</div>
              <div className="font-bold">Kepala Sekolah</div>
              <div className="h-12" />
              <div className="font-bold underline">{form.namaKepalaSekolah || '-'}</div>
              <div className="tabular-nums">NIP. {form.nipKepalaSekolah || '-'}</div>
            </div>
            <div className="flex flex-col items-center">
              <div>
                {form.kotaKabupaten || '-'}, {form.tanggalDokumen || '-'}
              </div>
              <div className="font-bold">Guru PAI dan Budi Pekerti</div>
              <div className="h-12" />
              <div className="font-bold underline">{form.namaGuru || '-'}</div>
              <div className="tabular-nums">NIP. {form.nipGuru || '-'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
