export type Fase = 'A' | 'B' | 'C';

export type ElemenName =
  | "Al-Qur'an Hadis"
  | 'Aqidah'
  | 'Akhlak'
  | 'Fiqih'
  | 'Sejarah Peradaban Islam';

export type AssessmentType =
  | 'Observasi'
  | 'Hafalan'
  | 'Praktik'
  | 'Tes Lisan'
  | 'Proyek';

export type NavPage =
  | 'dashboard'
  | 'identitas'
  | 'pilih-cp'
  | 'generator-tp'
  | 'generator-atp'
  | 'modul-ajar'
  | 'unduh-print';

export interface CPItem {
  code: string; // e.g., "1.1"
  fase: Fase;
  elemen: ElemenName;
  redaksi: string; // Exact verbatim text from Kepka BKPDM No. 020 Tahun 2026
  allowedKeywords: string[];
}

export interface SchoolIdentity {
  pemerintahDaerah?: string;
  dinasPendidikan?: string;
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kotaKabupaten: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaGuru: string;
  nipGuru: string;
  fase: Fase;
  kelas: string;
  tahunAjaran: string;
  tanggalDokumen: string;
}

export interface TPItem {
  id: string;
  code: string; // e.g., "TP 1.1.1"
  fase: Fase;
  cpCode: string; // e.g., "1.1"
  elemen: ElemenName;
  rumusan: string;
  materiPokok: string;
  kko: string; // e.g., "Membaca (C1/C2)"
  dimensiP5: string[];
  indikatorMindful: string;
  indikatorMeaningful: string;
  indikatorJoyful: string;
  indikatorRefleksi?: string;
  prereqTag: string;
  orderRank: number;
  suggestedSemesterIndex: number; // 0..3 within the fase
  suggestedJP: number;
  suggestedAsesmen: AssessmentType;
}

export interface ATPItem {
  id: string;
  noUrut: number;
  semester: string;
  tpId: string;
  kodeTP: string;
  cpCode: string;
  elemen: ElemenName;
  rumusanTP: string;
  materi: string;
  alokasiJP: number;
  aktivitasMindful: string; // 5 menit
  aktivitasMeaningful: string; // 25 menit
  aktivitasJoyful: string; // 10 menit
  aktivitasRefleksi: string; // 5 menit
  asesmen: AssessmentType;
  prereqTag: string;
  orderRank: number;
}

export interface GlosariumItem {
  istilah: string;
  arti: string;
}

export interface ElemenDikembangkanItem {
  elemen: string;
  deskripsi: string;
}

export interface KonsepBesarItem {
  judul: string;
  deskripsi: string;
}

export interface DimensiProfilLulusanItem {
  dimensi: string;
  subElemen: string;
  deskripsi: string;
  pengalaman: string;
}

export interface PertemuanKegiatanItem {
  pertemuanKe: number;
  judul: string;
  jp: number;
  pendahuluan: string[];
  tahapMemahami: string;
  metodeMengaplikasi: string;
  tahapMengaplikasi: string;
  tahapMerefleksi: string;
  penutup: string[];
}

export interface RubrikKonseptualItem {
  level: string;
  deskripsi: string;
}

export interface LKPDPertemuanItem {
  pertemuanKe: number;
  mataPelajaran: string;
  kelas: string;
  materi: string;
  alokasiWaktu: string;
  kompetensi: string[];
  tujuan: string;
  petunjukKerja: string[];
  kegiatanTugas: string[];
  tabelKerjaHeaders: string[];
  tabelKerjaRows: string[][];
  pertanyaanRefleksi: string[];
}

export interface ContohSoalItem {
  pertanyaan: string;
  opsi?: string[];
  pembahasan: string;
  jawaban: string;
}

export interface LatihanPGItem {
  pertanyaan: string;
  opsi: string[];
}

export interface BahanAjarStructured {
  ringkasanIntro: string;
  definisiPenting: { istilah: string; arti: string }[];
  ringkasanPenutup: string;
  petaKonsepTop: string;
  petaKonsepCabang: { judul: string; subjudul: string; poin: string }[];
  materiInti: { judul: string; uraian: string; poin: string[] }[];
  tabelContohHeaders?: string[];
  tabelContohRows?: string[][];
  contohSoal: ContohSoalItem[];
  latihanPG: LatihanPGItem[];
  latihanIsian: string[];
  latihanUraian: string[];
  kunciPG: string[];
  kunciIsian: string[];
  kunciUraian: string[];
  rangkuman: string[];
}

export interface ModulAjarItem {
  id: string;
  atpId: string;
  tpId: string;
  kodeTP: string;
  cpCode: string;
  cpRedaksi: string;
  elemen: ElemenName;
  fase: Fase;
  semester: string;
  alokasiJP: number;
  materiPokok: string;

  // 1. Informasi Umum
  identitasPenulis: string;
  jenjangKelas?: string;
  alokasiWaktuDetail?: string;
  metodePembelajaran?: string;
  kompetensiAwal: string;
  profilPelajarPancasila: string[];
  saranaPrasarana: string;
  targetPesertaDidik: string;
  modelPembelajaran: string;

  // 2. Capaian Pembelajaran & 3. Alur Tujuan Pembelajaran
  elemenDikembangkan?: ElemenDikembangkanItem[];
  alurTpRantai?: string;
  keterkaitanAntarTp?: string;

  // 4. Tujuan Pembelajaran & 5. Pemahaman Bermakna & 6. Kerangka 8334
  tujuanPembelajaran: string;
  tujuanPembelajaranList?: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  konsepBesar?: KonsepBesarItem[];
  transferGoals?: string[];
  dimensiProfilLulusan?: DimensiProfilLulusanItem[];

  // 7. Kegiatan Pembelajaran
  persiapanPembelajaran: string[];
  kegiatanPendahuluan: string;
  kegiatanInti: string;
  kegiatanPenutup: string;
  pertemuanList?: PertemuanKegiatanItem[];

  // 8. Asesmen, 9. Pengayaan & Remedial, 10. Refleksi Guru
  asesmenDiagnostik: string;
  asesmenDiagnostikList?: string[];
  asesmenFormatif: string;
  asesmenFormatifList?: { jenis: string; keterangan: string }[];
  asesmenSumatif: string;
  asesmenSumatifHots?: string[];
  rubrikKonseptual?: RubrikKonseptualItem[];
  pengayaan: string;
  pengayaanList?: string[];
  remedial: string;
  remedialList?: string[];
  refleksiPesertaDidik: string;
  refleksiPendidik: string;
  refleksiGuruList?: string[];

  // 11. Lampiran (LKPD + Bahan Ajar + Glosarium + Daftar Pustaka)
  lkpdJudul: string;
  lkpdPetunjuk: string[];
  lkpdTugas: string[];
  lkpdPertemuanList?: LKPDPertemuanItem[];
  bahanBacaanPendidik: string;
  bahanBacaanPesertaDidik: string;
  bahanAjar?: BahanAjarStructured;
  glosarium: GlosariumItem[];
  daftarPustaka: string[];
}

export interface OrderWarning {
  id: string;
  atpId: string;
  kodeTP: string;
  message: string;
}

export interface CompletenessIssue {
  cpCode: string;
  elemen: ElemenName;
  message: string;
  type: 'missing-tp' | 'missing-atp';
}

export interface UserSession {
  namaGuru: string;
  nipOrEmail: string;
  loggedInAt: string;
}

export interface ButtonTestResult {
  name: string;
  passed: boolean;
  detail: string;
}
