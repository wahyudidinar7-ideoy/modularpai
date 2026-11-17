import React from 'react';
import { getKopInstansiLines } from '../data/cpDatabase';
import { ModulAjarItem, SchoolIdentity } from '../types/curriculum';
import { extractSemesterLabel } from '../utils/modulContentBuilder';

interface ModulDocumentBodyProps {
  identity: SchoolIdentity;
  modul: ModulAjarItem;
  showFullKop?: boolean;
}

export const ModulDocumentBody: React.FC<ModulDocumentBodyProps> = ({
  identity,
  modul,
  showFullKop = true,
}) => {
  const kop = getKopInstansiLines(identity);
  const jenjangKelas = modul.jenjangKelas || `SD / ${identity.kelas}`;
  const alokasiWaktu = modul.alokasiWaktuDetail || `${modul.alokasiJP} JP (@ 35 Menit)`;
  const metode =
    modul.metodePembelajaran ||
    'Diskusi, Tanya Jawab, Presentasi, Demonstrasi, Ceramah Bermakna';
  const elemenDikembangkan = modul.elemenDikembangkan || [
    {
      elemen: modul.elemen,
      deskripsi: `Peserta didik menguasai kompetensi inti ${modul.materiPokok} (${modul.kodeTP}) sesuai tingkat perkembangannya.`,
    },
  ];
  const tujuanList = modul.tujuanPembelajaranList?.length
    ? modul.tujuanPembelajaranList
    : [modul.tujuanPembelajaran];
  const konsepBesar = modul.konsepBesar || [
    {
      judul: 'Pembelajaran Bermakna',
      deskripsi: modul.pemahamanBermakna,
    },
  ];
  const transferGoals = modul.transferGoals || [
    `Peserta didik dapat mengamalkan nilai ${modul.materiPokok} secara mandiri di rumah dan di sekolah.`,
  ];
  const dimensiProfil = modul.dimensiProfilLulusan || [];
  const pertemuans = modul.pertemuanList || [];
  const diagList = modul.asesmenDiagnostikList || [modul.asesmenDiagnostik];
  const formList = modul.asesmenFormatifList || [
    { jenis: 'Observasi', keterangan: modul.asesmenFormatif },
  ];
  const sumHots = modul.asesmenSumatifHots || [modul.asesmenSumatif];
  const rubrik = modul.rubrikKonseptual || [];
  const pengayaanList = modul.pengayaanList || [modul.pengayaan];
  const remedialList = modul.remedialList || [modul.remedial];
  const refleksiGuru = modul.refleksiGuruList || [modul.refleksiPendidik];
  const lkpdList = modul.lkpdPertemuanList || [];
  const bahanAjar = modul.bahanAjar;

  return (
    <div className="space-y-5 text-[13px] leading-[1.5] text-slate-900">
      {/* Kop Sekolah Resmi */}
      {showFullKop && (
        <div className="text-center border-b-4 border-double border-[#14532d] pb-3.5">
          <div className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
            {kop.pemerintahDaerah}
          </div>
          <div className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide mt-0.5">
            {kop.dinasPendidikan}
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#14532d] uppercase mt-0.5">
            {identity.namaSekolah}
          </div>
          <div className="text-xs text-slate-600 mt-0.5">
            {identity.alamat} | NPSN: {identity.npsn} | {identity.kotaKabupaten}
          </div>
        </div>
      )}

      {/* Judul Dokumen Sesuai Format PDF Lampiran */}
      <div className="text-center space-y-1 pb-2">
        <div className="text-base font-bold uppercase tracking-wide text-slate-900">
          RENCANA PEMBELAJARAN MENDALAM
        </div>
        <div className="text-sm font-bold text-[#14532d]">
          {modul.materiPokok} ({modul.kodeTP})
        </div>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-800">
          KURIKULUM MERDEKA DEEP LEARNING
        </div>
        <div className="text-xs text-slate-700">
          Permendikdasmen No. 1 Tahun 2026 tentang Standar Proses
        </div>
        <div className="text-xs text-slate-700">
          Kepka BKPDM No. 020 Tahun 2026
        </div>
      </div>

      {/* BAGIAN 1: INFORMASI UMUM */}
      <section className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 1: INFORMASI UMUM
        </h3>
        <table className="print-table w-full text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-left">
              <th className="border border-slate-400 p-2 font-bold w-48">Komponen</th>
              <th className="border border-slate-400 p-2 font-bold">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Nama Penyusun</td>
              <td className="border border-slate-400 p-2 align-top">
                {identity.namaGuru} (NIP. {identity.nipGuru || '-'})
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Satuan Pendidikan</td>
              <td className="border border-slate-400 p-2 align-top">
                {identity.namaSekolah} (NPSN: {identity.npsn})
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Jenjang/Kelas</td>
              <td className="border border-slate-400 p-2 align-top">{jenjangKelas}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Fase</td>
              <td className="border border-slate-400 p-2 align-top">{modul.fase}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Mata Pelajaran</td>
              <td className="border border-slate-400 p-2 align-top">
                Pendidikan Agama Islam dan Budi Pekerti (PAI)
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Materi Pokok</td>
              <td className="border border-slate-400 p-2 align-top font-semibold">
                {modul.materiPokok}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Alokasi Waktu</td>
              <td className="border border-slate-400 p-2 align-top">{alokasiWaktu}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">
                Tahun Ajaran / Semester
              </td>
              <td className="border border-slate-400 p-2 align-top">
                {identity.tahunAjaran} / {extractSemesterLabel(modul.semester)} ({modul.semester})
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Model Pembelajaran</td>
              <td className="border border-slate-400 p-2 align-top doc-justify">
                {modul.modelPembelajaran}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">Metode</td>
              <td className="border border-slate-400 p-2 align-top doc-justify">{metode}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-semibold align-top">
                Target Peserta Didik
              </td>
              <td className="border border-slate-400 p-2 align-top doc-justify">
                {modul.targetPesertaDidik}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* BAGIAN 2: CAPAIAN PEMBELAJARAN (CP) */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 2: CAPAIAN PEMBELAJARAN (CP)
        </h3>
        <div className="font-bold text-xs uppercase text-[#14532d]">
          FASE {modul.fase} (CP {modul.cpCode} — Kepka BKPDM No. 020 Tahun 2026)
        </div>
        <p className="doc-indent doc-justify text-slate-800">{modul.cpRedaksi}</p>
        <div className="font-bold text-slate-900 pt-1">Elemen CP yang Dikembangkan</div>
        <ul className="list-disc pl-6 space-y-1 text-slate-800">
          {elemenDikembangkan.map((item, idx) => (
            <li key={idx} className="doc-justify">
              <strong>{item.elemen}:</strong> {item.deskripsi}
            </li>
          ))}
        </ul>
      </section>

      {/* BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP) */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 3: ALUR TUJUAN PEMBELAJARAN (ATP)
        </h3>
        <div className="font-bold text-slate-900">
          {modul.alurTpRantai || `[${modul.kodeTP}] ${modul.materiPokok}`}
        </div>
        <p className="doc-justify italic text-slate-800">
          <strong>Keterkaitan antar TP:</strong>{' '}
          {modul.keterkaitanAntarTp || modul.pemahamanBermakna}
        </p>
      </section>

      {/* BAGIAN 4: TUJUAN PEMBELAJARAN */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 4: TUJUAN PEMBELAJARAN
        </h3>
        <ol className="list-decimal pl-6 space-y-1.5 text-slate-800">
          {tujuanList.map((t, idx) => (
            <li key={idx} className="doc-justify">
              {t}
            </li>
          ))}
        </ol>
      </section>

      {/* BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING) */}
      <section className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 5: PEMAHAMAN BERMAKNA (DEEP LEARNING)
        </h3>
        <div>
          <div className="font-bold text-slate-900">A. Pertanyaan Esensial (Essential Questions)</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {modul.pertanyaanPemantik.map((q, idx) => (
              <li key={idx} className="doc-justify">
                {q}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold text-slate-900">B. Konsep Besar (Big Ideas)</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {konsepBesar.map((k, idx) => (
              <li key={idx} className="doc-justify">
                <strong>{k.judul}:</strong> {k.deskripsi}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold text-slate-900">C. Transfer Goals</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {transferGoals.map((g, idx) => (
              <li key={idx} className="doc-justify">
                {g}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334) */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 6: DIMENSI PROFIL LULUSAN (KERANGKA 8334)
        </h3>
        {dimensiProfil.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1.5 text-slate-800">
            {dimensiProfil.map((d, idx) => (
              <li key={idx} className="doc-justify">
                <strong>{d.dimensi}:</strong> Sub-elemen {d.subElemen}. <em>{d.deskripsi}</em>{' '}
                (Pengalaman: {d.pengalaman})
              </li>
            ))}
          </ul>
        ) : (
          <p className="doc-justify text-slate-800">
            {modul.profilPelajarPancasila.join('; ')}.
          </p>
        )}
      </section>

      {/* BAGIAN 7: KEGIATAN PEMBELAJARAN */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 7: KEGIATAN PEMBELAJARAN
        </h3>
        {pertemuans.length > 0 ? (
          pertemuans.map((p) => {
            const menitInti = Math.max(45, p.jp * 35 - 25);
            return (
              <div key={p.pertemuanKe} className="space-y-2.5 border-l-2 border-[#14532d]/40 pl-3.5">
                <div className="font-bold text-slate-900">
                  PERTEMUAN {p.pertemuanKe}: {p.judul} ({p.jp} × 35 menit)
                </div>

                <div>
                  <div className="font-bold text-[#14532d] text-xs uppercase">
                    PENDAHULUAN (±15 menit)
                  </div>
                  <ol className="list-decimal pl-6 mt-1 space-y-1 text-slate-800">
                    {p.pendahuluan.map((item, idx) => (
                      <li key={idx} className="doc-justify">
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-[#14532d] text-xs uppercase">
                    KEGIATAN INTI (±{menitInti} menit)
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">▶ TAHAP 1: MEMAHAMI (Mindful)</div>
                    <p className="doc-justify text-slate-800 mt-0.5">{p.tahapMemahami}</p>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">▶ TAHAP 2: MENGAPLIKASI (Meaningful)</div>
                    <p className="doc-justify text-slate-800 mt-0.5">
                      <strong>Metode: {p.metodeMengaplikasi}.</strong> {p.tahapMengaplikasi}
                    </p>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">▶ TAHAP 3: MEREFLEKSI (Joyful)</div>
                    <p className="doc-justify text-slate-800 mt-0.5">{p.tahapMerefleksi}</p>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#14532d] text-xs uppercase">
                    PENUTUP (±10 menit)
                  </div>
                  <ol className="list-decimal pl-6 mt-1 space-y-1 text-slate-800">
                    {p.penutup.map((item, idx) => (
                      <li key={idx} className="doc-justify">
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })
        ) : (
          <div className="space-y-2">
            <p className="whitespace-pre-line doc-justify">{modul.kegiatanPendahuluan}</p>
            <p className="whitespace-pre-line doc-justify">{modul.kegiatanInti}</p>
            <p className="whitespace-pre-line doc-justify">{modul.kegiatanPenutup}</p>
          </div>
        )}
      </section>

      {/* BAGIAN 8: ASESMEN */}
      <section className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 8: ASESMEN
        </h3>

        <div>
          <div className="font-bold text-slate-900">A. Asesmen Diagnostik (Pre-test)</div>
          <ol className="list-decimal pl-6 mt-1 space-y-1 text-slate-800">
            {diagList.map((q, idx) => (
              <li key={idx} className="doc-justify">
                {q}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="font-bold text-slate-900">B. Asesmen Formatif (Proses)</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {formList.map((item, idx) => (
              <li key={idx} className="doc-justify">
                <strong>{item.jenis}:</strong> {item.keterangan}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-bold text-slate-900">C. Asesmen Sumatif (Akhir)</div>
          <ol className="list-decimal pl-6 mt-1 space-y-1 text-slate-800">
            {sumHots.map((s, idx) => (
              <li key={idx} className="doc-justify">
                {s}
              </li>
            ))}
          </ol>
        </div>

        {rubrik.length > 0 && (
          <div className="print-avoid-break">
            <div className="font-bold text-slate-900 mb-1.5">D. Rubrik Pemahaman Konseptual</div>
            <table className="print-table w-full text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-left">
                  <th className="border border-slate-400 p-2 w-28 font-bold">Level</th>
                  <th className="border border-slate-400 p-2 font-bold">Deskriptor</th>
                </tr>
              </thead>
              <tbody>
                {rubrik.map((r, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-400 p-2 font-bold align-top">{r.level}</td>
                    <td className="border border-slate-400 p-2 align-top doc-justify">
                      {r.deskripsi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* BAGIAN 9: PENGAYAAN DAN REMEDIAL */}
      <section className="space-y-2.5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 9: PENGAYAAN DAN REMEDIAL
        </h3>
        <div>
          <div className="font-bold text-slate-900">Program Pengayaan</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {pengayaanList.map((item, idx) => (
              <li key={idx} className="doc-justify">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-bold text-slate-900">Program Remedial</div>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-slate-800">
            {remedialList.map((item, idx) => (
              <li key={idx} className="doc-justify">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BAGIAN 10: REFLEKSI GURU */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 10: REFLEKSI GURU
        </h3>
        <ol className="list-decimal pl-6 space-y-2 text-slate-800">
          {refleksiGuru.map((q, idx) => (
            <li key={idx} className="doc-justify">
              <div>{q}</div>
              <div className="text-slate-600 mt-0.5">
                <em>Jawaban:</em> ......................................................................
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* BAGIAN 11: LAMPIRAN */}
      <section className="space-y-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          BAGIAN 11: LAMPIRAN
        </h3>

        {/* A. LEMBAR KERJA PESERTA DIDIK (LKPD) */}
        <div className="space-y-5">
          <div className="font-bold text-slate-900">
            A. Lembar Kerja Peserta Didik (LKPD)
          </div>

          <div className="text-center border-b border-slate-300 pb-2">
            <div className="font-bold text-sm uppercase">
              LEMBAR KERJA PESERTA DIDIK (LKPD)
            </div>
            <div className="font-bold text-xs text-[#14532d]">{modul.materiPokok}</div>
          </div>

          {lkpdList.length > 0 ? (
            lkpdList.map((lkpd) => (
              <div
                key={lkpd.pertemuanKe}
                className="print-avoid-break border border-slate-300 rounded-lg p-4 space-y-3 bg-stone-50/40"
              >
                <div className="font-bold text-xs uppercase text-[#14532d]">
                  LKPD PERTEMUAN {lkpd.pertemuanKe}
                </div>

                <table className="print-table w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-left">
                      <th className="border border-slate-400 p-2 w-40 font-bold">Komponen</th>
                      <th className="border border-slate-400 p-2 font-bold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Mata Pelajaran</td>
                      <td className="border border-slate-400 p-2">{lkpd.mataPelajaran}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Kelas</td>
                      <td className="border border-slate-400 p-2">{lkpd.kelas}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Materi</td>
                      <td className="border border-slate-400 p-2">{lkpd.materi}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-400 p-2 font-semibold">Alokasi Waktu</td>
                      <td className="border border-slate-400 p-2">{lkpd.alokasiWaktu}</td>
                    </tr>
                  </tbody>
                </table>

                <div>
                  <div className="font-bold text-xs">A. Kompetensi yang Dikembangkan</div>
                  <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-xs">
                    {lkpd.kompetensi.map((k, idx) => (
                      <li key={idx}>{k}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-xs">B. Tujuan Pembelajaran</div>
                  <p className="text-xs mt-0.5 doc-justify">{lkpd.tujuan}</p>
                </div>

                <div>
                  <div className="font-bold text-xs">C. Petunjuk Kerja</div>
                  <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-xs">
                    {lkpd.petunjukKerja.map((pk, idx) => (
                      <li key={idx}>{pk}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-xs">D. Kegiatan/Tugas</div>
                  <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-xs">
                    {lkpd.kegiatanTugas.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-xs mb-1">E. Tabel Kerja</div>
                  <table className="print-table w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-left">
                        {lkpd.tabelKerjaHeaders.map((h, i) => (
                          <th key={i} className="border border-slate-400 p-2 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lkpd.tabelKerjaRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="border border-slate-400 p-2 min-h-[28px]">
                              {cell || '\u00A0'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <div className="font-bold text-xs">F. Pertanyaan Refleksi</div>
                  <ol className="list-decimal pl-5 mt-1 space-y-0.5 text-xs">
                    {lkpd.pertanyaanRefleksi.map((pr, idx) => (
                      <li key={idx}>
                        {pr} (....................................................)
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="font-bold text-xs mb-1">G. Penilaian</div>
                  <table className="print-table w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-left">
                        <th className="border border-slate-400 p-2 w-44 font-bold">Nama</th>
                        <th className="border border-slate-400 p-2 w-28 font-bold">Skor (1-100)</th>
                        <th className="border border-slate-400 p-2 font-bold">Catatan Guru</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-400 p-3">&nbsp;</td>
                        <td className="border border-slate-400 p-3">&nbsp;</td>
                        <td className="border border-slate-400 p-3">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 border border-slate-300 rounded">
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                {modul.lkpdTugas.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* B. BAHAN AJAR (8 BAGIAN SESUAI PDF) */}
        {bahanAjar && (
          <div className="space-y-4 pt-4 border-t border-slate-300">
            <div>
              <div className="font-bold text-sm uppercase text-slate-900">B. BAHAN AJAR</div>
              <div className="font-bold text-sm text-[#14532d] mt-0.5">{modul.materiPokok}</div>
              <div className="text-xs text-slate-600">
                Mata Pelajaran: PAI | {jenjangKelas} | Kurikulum Merdeka
              </div>
            </div>

            {/* BAGIAN 1: RINGKASAN MATERI */}
            <div className="space-y-1.5">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 1: RINGKASAN MATERI
              </div>
              <p className="doc-indent doc-justify">{bahanAjar.ringkasanIntro}</p>
              <div className="font-bold text-xs pt-1">Definisi Penting:</div>
              <ul className="list-disc pl-6 space-y-1">
                {bahanAjar.definisiPenting.map((d, idx) => (
                  <li key={idx} className="doc-justify">
                    <strong>{d.istilah}:</strong> {d.arti}
                  </li>
                ))}
              </ul>
              <p className="doc-indent doc-justify">{bahanAjar.ringkasanPenutup}</p>
            </div>

            {/* BAGIAN 2: PETA KONSEP */}
            <div className="print-avoid-break space-y-2">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 2: PETA KONSEP
              </div>
              <div className="border border-dashed border-amber-400 bg-amber-50/40 rounded-lg p-4 space-y-3 text-center">
                <div className="inline-block px-4 py-1.5 rounded border border-slate-700 bg-white font-bold text-xs">
                  {bahanAjar.petaKonsepTop}
                </div>
                <div className="text-xs font-bold text-slate-600">↓</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {bahanAjar.petaKonsepCabang.map((cab, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded border border-slate-400 text-xs ${
                        idx === 0 ? 'bg-emerald-50/70' : 'bg-rose-50/70'
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-center">{cab.judul}</div>
                      <div className="text-[11px] text-slate-600 text-center mb-1">
                        {cab.subjudul}
                      </div>
                      <div className="text-center text-slate-800">{cab.poin}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BAGIAN 3: MATERI INTI */}
            <div className="space-y-2.5">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 3: MATERI INTI
              </div>
              {bahanAjar.materiInti.map((sub, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-bold text-slate-900">{sub.judul}</div>
                  <p className="doc-justify text-slate-800">{sub.uraian}</p>
                  <ul className="list-disc pl-6 space-y-1 text-slate-800">
                    {sub.poin.map((pt, pIdx) => (
                      <li key={pIdx} className="doc-justify">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {bahanAjar.tabelContohHeaders && bahanAjar.tabelContohRows && (
                <div className="pt-1 print-avoid-break">
                  <table className="print-table w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#14532d] text-white text-left">
                        {bahanAjar.tabelContohHeaders.map((h, i) => (
                          <th key={i} className="border border-slate-400 p-2 font-bold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bahanAjar.tabelContohRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="border border-slate-400 p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BAGIAN 4: CONTOH SOAL & PEMBAHASAN */}
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 4: CONTOH SOAL DAN PEMBAHASAN
              </div>
              {bahanAjar.contohSoal.map((cs, idx) => (
                <div key={idx} className="space-y-0.5 text-slate-800">
                  <div className="font-bold">Contoh Soal {idx + 1}</div>
                  <p className="doc-justify">{cs.pertanyaan}</p>
                  {cs.opsi && (
                    <div className="pl-4 text-xs space-y-0.5">
                      {cs.opsi.map((op, oIdx) => (
                        <div key={oIdx}>{op}</div>
                      ))}
                    </div>
                  )}
                  <p className="doc-justify">
                    <strong>Pembahasan:</strong> {cs.pembahasan}
                  </p>
                  <div>
                    <strong>Jawaban:</strong> {cs.jawaban}
                  </div>
                </div>
              ))}
            </div>

            {/* BAGIAN 5: LATIHAN SOAL */}
            <div className="space-y-2.5">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 5: LATIHAN SOAL
              </div>
              <div>
                <div className="font-bold">I. Pilihan Ganda</div>
                <ol className="list-decimal pl-6 mt-1 space-y-1.5">
                  {bahanAjar.latihanPG.map((pg, idx) => (
                    <li key={idx}>
                      <div>{pg.pertanyaan}</div>
                      <div className="grid grid-cols-2 gap-x-4 text-xs mt-0.5">
                        {pg.opsi.map((op, oIdx) => (
                          <div key={oIdx}>{op}</div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="font-bold">II. Isian Singkat</div>
                <ol className="list-decimal pl-6 mt-1 space-y-1">
                  {bahanAjar.latihanIsian.map((is, idx) => (
                    <li key={idx}>{is}</li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="font-bold">III. Uraian/Essay</div>
                <ol className="list-decimal pl-6 mt-1 space-y-1">
                  {bahanAjar.latihanUraian.map((ur, idx) => (
                    <li key={idx}>{ur}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* BAGIAN 6: KUNCI JAWABAN */}
            <div className="space-y-1.5">
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 6: KUNCI JAWABAN
              </div>
              <div>
                <div className="font-bold text-xs">Pilihan Ganda</div>
                <ol className="list-decimal pl-6 text-xs space-y-0.5">
                  {bahanAjar.kunciPG.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="font-bold text-xs">Isian Singkat</div>
                <ol className="list-decimal pl-6 text-xs space-y-0.5">
                  {bahanAjar.kunciIsian.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ol>
              </div>
              <div>
                <div className="font-bold text-xs">Uraian/Essay</div>
                <ol className="list-decimal pl-6 text-xs space-y-0.5">
                  {bahanAjar.kunciUraian.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* BAGIAN 7: RANGKUMAN */}
            <div>
              <div className="font-bold text-xs uppercase text-slate-900">
                BAGIAN 7: RANGKUMAN
              </div>
              <ul className="list-disc pl-6 mt-1 space-y-1">
                {bahanAjar.rangkuman.map((r, idx) => (
                  <li key={idx} className="doc-justify">
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* BAGIAN 8: GLOSARIUM */}
            <div className="print-avoid-break">
              <div className="font-bold text-xs uppercase text-slate-900 mb-1.5">
                BAGIAN 8: GLOSARIUM
              </div>
              <table className="print-table w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-left">
                    <th className="border border-slate-400 p-2 w-44 font-bold">Istilah</th>
                    <th className="border border-slate-400 p-2 font-bold">Definisi</th>
                  </tr>
                </thead>
                <tbody>
                  {modul.glosarium.map((g, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-400 p-2 font-bold align-top">{g.istilah}</td>
                      <td className="border border-slate-400 p-2 align-top doc-justify">{g.arti}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Daftar Pustaka */}
            <div>
              <div className="font-bold text-xs uppercase text-slate-900">Daftar Pustaka</div>
              <ol className="list-decimal pl-6 mt-1 space-y-0.5 text-xs">
                {modul.daftarPustaka.map((d, idx) => (
                  <li key={idx} className="doc-justify">
                    {d}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* C. TANDA TANGAN (Simetris Tengah Kanan Kiri) */}
        <div className="print-avoid-break pt-4 border-t border-slate-200">
          <div className="font-bold text-xs uppercase text-slate-900 mb-3">
            C. Tanda Tangan Pengesahan
          </div>
          <div className="grid grid-cols-2 gap-8 text-xs text-center">
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
              <div className="font-bold">Guru Mata Pelajaran PAI</div>
              <div className="h-16" />
              <div className="font-bold underline">{identity.namaGuru}</div>
              <div className="tabular-nums">NIP. {identity.nipGuru || '-'}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
