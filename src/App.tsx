import { useEffect, useMemo, useState } from 'react';
import { Menu, Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { DashboardView } from './components/DashboardView';
import { ExportPrintView } from './components/ExportPrintView';
import { GeneratorATPView } from './components/GeneratorATPView';
import { GeneratorTPView } from './components/GeneratorTPView';
import { IdentityView } from './components/IdentityView';
import { LoginScreen } from './components/LoginScreen';
import { ModulAjarView } from './components/ModulAjarView';
import { QuickSettingsPanel } from './components/QuickSettingsPanel';
import { SelectCPView } from './components/SelectCPView';
import { Sidebar } from './components/Sidebar';
import {
  checkOutsideKepka0202026,
  CP_DATABASE,
  createInitialFaseATPs,
  DEFAULT_IDENTITY,
  FASE_OPTIONS,
  getKopInstansiLines,
} from './data/cpDatabase';
import {
  ATPItem,
  ButtonTestResult,
  Fase,
  ModulAjarItem,
  NavPage,
  SchoolIdentity,
  TPItem,
  UserSession,
} from './types/curriculum';
import {
  createDocxBlob,
  createModulAjarDocxBlob,
  DocxExportMode,
  downloadDocxFile,
  downloadModulAjarDocx,
} from './utils/docxExporter';
import {
  autoFixATPOrder,
  checkCPCompleteness,
  formatModulAjarForClipboard,
  formatTPsForClipboard,
  generateAllModulAjarFromATP,
  generateATPFromTPs,
  generateModulAjarForATPRow,
  generateTPsForCPs,
  normalizeModulAjar,
  syncModulWithIdentity,
  validateATPOrder,
} from './utils/generators';
import {
  buildStandaloneHtmlString,
  downloadStandaloneHtmlFile,
} from './utils/standaloneHtmlBuilder';

const STORAGE_KEYS = {
  SESSION: 'pai_kepka020_session',
  DARK: 'pai_kepka020_dark',
  IDENTITY: 'pai_kepka020_identity',
  SELECTED_CPS: 'pai_kepka020_selected_cps',
  TPS: 'pai_kepka020_tps',
  ATPS: 'pai_kepka020_atps',
  MODULS: 'pai_kepka020_moduls',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Abaikan jika browser memblokir localStorage atau kuota penuh
  }
}

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() =>
    readStorage<UserSession | null>(STORAGE_KEYS.SESSION, null)
  );
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEYS.DARK, false)
  );
  const [identity, setIdentity] = useState<SchoolIdentity>(() => ({
    ...DEFAULT_IDENTITY,
    ...readStorage<Partial<SchoolIdentity>>(STORAGE_KEYS.IDENTITY, DEFAULT_IDENTITY),
  }));
  const [selectedCpCodes, setSelectedCpCodes] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.SELECTED_CPS, ['1.1', '1.2', '1.3', '1.4', '1.5'])
  );
  const [tps, setTps] = useState<TPItem[]>(() =>
    readStorage<TPItem[]>(STORAGE_KEYS.TPS, createInitialFaseATPs())
  );
  const [atps, setAtps] = useState<ATPItem[]>(() => {
    const stored = readStorage<ATPItem[] | null>(STORAGE_KEYS.ATPS, null);
    if (stored) return stored;
    return generateATPFromTPs('A', createInitialFaseATPs());
  });
  const [moduls, setModuls] = useState<ModulAjarItem[]>(() => {
    const stored = readStorage<ModulAjarItem[] | null>(STORAGE_KEYS.MODULS, null);
    if (stored) {
      return stored.map((m) => normalizeModulAjar(m, identity, atps, tps));
    }
    const initTps = createInitialFaseATPs();
    const initAtps = generateATPFromTPs('A', initTps);
    return generateAllModulAjarFromATP(DEFAULT_IDENTITY, initTps, initAtps);
  });

  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [exportDocMode, setExportDocMode] = useState<DocxExportMode>('cp_tp_atp');
  const [exportModulAtpId, setExportModulAtpId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<ButtonTestResult[]>([]);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    writeStorage(STORAGE_KEYS.DARK, darkMode);
  }, [darkMode]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.SESSION, session);
  }, [session]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.IDENTITY, identity);
  }, [identity]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.SELECTED_CPS, selectedCpCodes);
  }, [selectedCpCodes]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.TPS, tps);
  }, [tps]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.ATPS, atps);
  }, [atps]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.MODULS, moduls);
  }, [moduls]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.clearTimeout((window as unknown as { __paiToast?: number }).__paiToast);
    (window as unknown as { __paiToast?: number }).__paiToast = window.setTimeout(() => {
      setToastMsg(null);
    }, 3200);
  };

  const faseTps = useMemo(
    () => tps.filter((t) => t.fase === identity.fase),
    [tps, identity.fase]
  );

  const faseAtps = useMemo(
    () => atps.filter((a) => a.cpCode.startsWith(identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.')),
    [atps, identity.fase]
  );

  const activeFaseCps = useMemo(
    () => CP_DATABASE.filter((c) => c.fase === identity.fase),
    [identity.fase]
  );

  const faseModuls = useMemo(
    () => moduls.filter((m) => m.fase === identity.fase),
    [moduls, identity.fase]
  );

  const orderWarnings = useMemo(() => validateATPOrder(faseAtps), [faseAtps]);

  const completenessIssues = useMemo(
    () => checkCPCompleteness(identity.fase, tps, faseAtps),
    [identity.fase, tps, faseAtps]
  );

  const handleChangeFase = (newFase: Fase) => {
    const faseMeta = FASE_OPTIONS.find((f) => f.value === newFase) || FASE_OPTIONS[0];
    const newCpCodes = CP_DATABASE.filter((c) => c.fase === newFase).map((c) => c.code);
    const nextIdentity: SchoolIdentity = {
      ...identity,
      fase: newFase,
      kelas: faseMeta.kelasList[2] || faseMeta.kelasList[0],
    };
    setIdentity(nextIdentity);
    setSelectedCpCodes(newCpCodes);

    // If this fase doesn't have TPs yet, auto-generate so user immediately sees rich data
    const existingForFase = tps.filter((t) => t.fase === newFase);
    if (existingForFase.length === 0) {
      const generated = generateTPsForCPs(newFase, newCpCodes, tps);
      const otherTps = tps.filter((t) => t.fase !== newFase);
      const mergedTps = [...otherTps, ...generated];
      setTps(mergedTps);
      const generatedAtp = generateATPFromTPs(newFase, mergedTps);
      const otherAtps = atps.filter(
        (a) => !a.cpCode.startsWith(newFase === 'A' ? '1.' : newFase === 'B' ? '2.' : '3.')
      );
      setAtps([...otherAtps, ...generatedAtp]);
      const generatedModuls = generateAllModulAjarFromATP(nextIdentity, mergedTps, generatedAtp);
      setModuls((prev) => [
        ...prev.filter((m) => m.fase !== newFase).map((m) => syncModulWithIdentity(m, nextIdentity)),
        ...generatedModuls,
      ]);
    } else {
      setModuls((prev) => prev.map((m) => syncModulWithIdentity(m, nextIdentity)));
    }
    showToast(`Beralih ke Fase ${newFase} (${nextIdentity.kelas})`);
  };

  const handleSaveIdentity = (updated: SchoolIdentity) => {
    const fallbackKop = getKopInstansiLines(updated);
    const cleaned: SchoolIdentity = {
      ...updated,
      pemerintahDaerah: (updated.pemerintahDaerah?.trim() || fallbackKop.pemerintahDaerah).toUpperCase(),
      dinasPendidikan: (updated.dinasPendidikan?.trim() || fallbackKop.dinasPendidikan).toUpperCase(),
      namaSekolah: updated.namaSekolah.trim() || identity.namaSekolah,
      npsn: updated.npsn.trim() || '-',
      alamat: updated.alamat.trim() || '-',
      kotaKabupaten: updated.kotaKabupaten.trim() || '-',
      namaKepalaSekolah: updated.namaKepalaSekolah.trim() || '-',
      nipKepalaSekolah: updated.nipKepalaSekolah.trim() || '-',
      namaGuru: updated.namaGuru.trim() || identity.namaGuru,
      nipGuru: updated.nipGuru.trim() || '-',
      tahunAjaran: updated.tahunAjaran.trim() || '2026/2027',
      tanggalDokumen: updated.tanggalDokumen.trim() || '13 Juli 2026',
    };
    const faseChanged = cleaned.fase !== identity.fase;
    setIdentity(cleaned);
    setSession((prev) =>
      prev
        ? {
            ...prev,
            namaGuru: cleaned.namaGuru,
            nipOrEmail: cleaned.nipGuru || '-',
          }
        : prev
    );

    if (faseChanged) {
      const faseMeta = FASE_OPTIONS.find((f) => f.value === cleaned.fase) || FASE_OPTIONS[0];
      const newCpCodes = CP_DATABASE.filter((c) => c.fase === cleaned.fase).map((c) => c.code);
      setSelectedCpCodes(newCpCodes);
      const existingForFase = tps.filter((t) => t.fase === cleaned.fase);
      if (existingForFase.length === 0) {
        const generated = generateTPsForCPs(cleaned.fase, newCpCodes, tps);
        const otherTps = tps.filter((t) => t.fase !== cleaned.fase);
        const mergedTps = [...otherTps, ...generated];
        setTps(mergedTps);
        const generatedAtp = generateATPFromTPs(cleaned.fase, mergedTps);
        const prefix = cleaned.fase === 'A' ? '1.' : cleaned.fase === 'B' ? '2.' : '3.';
        const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
        setAtps([...otherAtps, ...generatedAtp]);
        const generatedModuls = generateAllModulAjarFromATP(cleaned, mergedTps, generatedAtp);
        setModuls((prev) => [
          ...prev.filter((m) => m.fase !== cleaned.fase).map((m) => syncModulWithIdentity(m, cleaned)),
          ...generatedModuls,
        ]);
      } else {
        setModuls((prev) => prev.map((m) => syncModulWithIdentity(m, cleaned)));
      }
      showToast(`Identitas tersimpan & beralih ke Fase ${cleaned.fase} (${cleaned.kelas || faseMeta.kelasList[2]}).`);
    } else {
      setModuls((prev) => prev.map((m) => syncModulWithIdentity(m, cleaned)));
      showToast('Identitas sekolah, guru & dokumen berhasil disinkronkan.');
    }
  };

  const handleToggleCp = (code: string) => {
    setSelectedCpCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAllCps = () => {
    const all = CP_DATABASE.filter((c) => c.fase === identity.fase).map((c) => c.code);
    setSelectedCpCodes(all);
  };

  const handleClearCps = () => {
    setSelectedCpCodes([]);
  };

  const handleGenerateTP = () => {
    const codes =
      selectedCpCodes.filter((c) => CP_DATABASE.some((cp) => cp.code === c && cp.fase === identity.fase));
    const targetCodes =
      codes.length > 0
        ? codes
        : CP_DATABASE.filter((c) => c.fase === identity.fase).map((c) => c.code);

    const generated = generateTPsForCPs(identity.fase, targetCodes, tps);
    const otherFaseTps = tps.filter((t) => t.fase !== identity.fase);
    setTps([...otherFaseTps, ...generated]);
    setActivePage('generator-tp');
    showToast(`Berhasil generate ${generated.length} TP Pembelajaran Mendalam Fase ${identity.fase}.`);
  };

  const handleGenerateATP = () => {
    const currentTps = tps.filter((t) => t.fase === identity.fase);
    if (currentTps.length === 0) {
      showToast('Silakan generate TP terlebih dahulu sebelum menyusun ATP.');
      setActivePage('pilih-cp');
      return;
    }
    const generatedAtp = generateATPFromTPs(identity.fase, tps);
    const prefix = identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.';
    const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
    setAtps([...otherAtps, ...generatedAtp]);
    const generatedModuls = generateAllModulAjarFromATP(identity, tps, generatedAtp);
    setModuls((prev) => [...prev.filter((m) => m.fase !== identity.fase), ...generatedModuls]);
    setActivePage('generator-atp');
    showToast(`Berhasil menyusun ${generatedAtp.length} baris ATP & menyinkronkan Modul Ajar.`);
  };

  const handleAddTP = (newTp: TPItem) => {
    setTps((prev) => [...prev, newTp]);
    showToast(`${newTp.code} berhasil ditambahkan.`);
  };

  const handleUpdateTP = (updatedTp: TPItem) => {
    setTps((prev) => prev.map((t) => (t.id === updatedTp.id ? updatedTp : t)));
    // Sync matching ATP row if exists
    setAtps((prev) =>
      prev.map((a) =>
        a.tpId === updatedTp.id
          ? {
              ...a,
              kodeTP: updatedTp.code,
              materi: updatedTp.materiPokok,
              rumusanTP: updatedTp.rumusan,
              aktivitasMindful: updatedTp.indikatorMindful,
              aktivitasMeaningful: updatedTp.indikatorMeaningful,
              aktivitasJoyful: updatedTp.indikatorJoyful,
            }
          : a
      )
    );
    showToast(`${updatedTp.code} berhasil diperbarui.`);
  };

  const handleDeleteTP = (id: string) => {
    setTps((prev) => prev.filter((t) => t.id !== id));
    setAtps((prev) =>
      prev
        .filter((a) => a.tpId !== id)
        .map((a, idx) => ({ ...a, noUrut: idx + 1 }))
    );
    showToast('TP berhasil dihapus.');
  };

  const handleMoveATP = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= faseAtps.length) return;
    const reordered = [...faseAtps];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    const normalized = reordered.map((r, i) => ({ ...r, noUrut: i + 1 }));

    const prefix = identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.';
    const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
    setAtps([...otherAtps, ...normalized]);
  };

  const handleReorderATP = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...faseAtps];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const normalized = reordered.map((r, i) => ({ ...r, noUrut: i + 1 }));

    const prefix = identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.';
    const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
    setAtps([...otherAtps, ...normalized]);
  };

  const handleAutoFixOrder = () => {
    const fixed = autoFixATPOrder(identity.fase, faseAtps);
    const prefix = identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.';
    const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
    setAtps([...otherAtps, ...fixed]);
    showToast('Urutan prasyarat dan semester ATP telah dirapikan otomatis.');
  };

  const handleUpdateATP = (updated: ATPItem) => {
    setAtps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    showToast(`Baris ATP ${updated.kodeTP} diperbarui.`);
  };

  const handleDeleteATP = (id: string) => {
    const prefix = identity.fase === 'A' ? '1.' : identity.fase === 'B' ? '2.' : '3.';
    const remaining = faseAtps
      .filter((a) => a.id !== id)
      .map((r, i) => ({ ...r, noUrut: i + 1 }));
    const otherAtps = atps.filter((a) => !a.cpCode.startsWith(prefix));
    setAtps([...otherAtps, ...remaining]);
    showToast('Baris ATP dihapus.');
  };

  const handleCopyAllTP = () => {
    const formatted = formatTPsForClipboard(faseTps, identity);
    if (!navigator.clipboard?.writeText) {
      showToast('Browser tidak mengizinkan akses clipboard otomatis.');
      return;
    }
    navigator.clipboard
      .writeText(formatted)
      .then(() => {
        showToast(`${faseTps.length} TP berhasil disalin ke clipboard untuk RPP / Modul Ajar.`);
      })
      .catch(() => {
        showToast('Gagal menyalin otomatis. Silakan gunakan tombol Unduh DOCX / PDF.');
      });
  };

  const handleDownloadDocx = (mode: DocxExportMode, modulOverride?: ModulAjarItem | null) => {
    const filteredCps = activeFaseCps.filter((c) => selectedCpCodes.includes(c.code));
    const targetCps = mode === 'cp' && filteredCps.length > 0 ? filteredCps : activeFaseCps;
    const targetModul =
      modulOverride ||
      faseModuls.find((m) => m.atpId === exportModulAtpId) ||
      faseModuls[0] ||
      null;
    const filename = downloadDocxFile(identity, faseTps, faseAtps, mode, {
      cps: targetCps,
      modul: targetModul,
      allModuls: faseModuls,
    });
    showToast(`File Word berhasil diunduh: ${filename}`);
  };

  const handleOpenPrintPreview = (mode: DocxExportMode, modulAtpId?: string) => {
    setExportDocMode(mode);
    if (modulAtpId) {
      setExportModulAtpId(modulAtpId);
    }
    setActivePage('unduh-print');
  };

  const handlePrint = () => {
    setActivePage('unduh-print');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadStandaloneHtml = () => {
    const filename = downloadStandaloneHtmlFile(identity);
    showToast(`Aplikasi 1 File HTML siap offline diunduh: ${filename}`);
  };

  const handleResetFaseA = () => {
    const initialTps = createInitialFaseATPs();
    const initialAtps = generateATPFromTPs('A', initialTps);
    const nextIdentity: SchoolIdentity = {
      ...DEFAULT_IDENTITY,
      pemerintahDaerah: identity.pemerintahDaerah || DEFAULT_IDENTITY.pemerintahDaerah,
      dinasPendidikan: identity.dinasPendidikan || DEFAULT_IDENTITY.dinasPendidikan,
      namaSekolah: identity.namaSekolah || DEFAULT_IDENTITY.namaSekolah,
      namaGuru: identity.namaGuru || DEFAULT_IDENTITY.namaGuru,
      fase: 'A',
      kelas: 'Kelas 1 & 2',
    };
    const initialModuls = generateAllModulAjarFromATP(nextIdentity, initialTps, initialAtps);
    setIdentity(nextIdentity);
    setSelectedCpCodes(['1.1', '1.2', '1.3', '1.4', '1.5']);
    setTps(initialTps);
    setAtps(initialAtps);
    setModuls(initialModuls);
    showToast('Contoh lengkap TP, ATP & Modul Ajar Fase A telah dimuat ulang.');
  };

  const handleGenerateAllModuls = () => {
    if (faseAtps.length === 0) {
      showToast('Silakan generate ATP terlebih dahulu sebagai pijakan Modul Ajar.');
      setActivePage('generator-atp');
      return;
    }
    const generated = generateAllModulAjarFromATP(identity, tps, faseAtps);
    setModuls((prev) => [...prev.filter((m) => m.fase !== identity.fase), ...generated]);
    setActivePage('modul-ajar');
    showToast(`Berhasil menyusun ${generated.length} Modul Ajar lengkap dari CP, TP & ATP.`);
  };

  const handleRegenerateSingleModul = (atpId: string) => {
    const targetAtp = faseAtps.find((a) => a.id === atpId);
    if (!targetAtp) return;
    const tp = tps.find((t) => t.id === targetAtp.tpId);
    const fresh = generateModulAjarForATPRow(identity, targetAtp, faseAtps, tp);
    setModuls((prev) => {
      const exists = prev.some((m) => m.atpId === atpId && m.fase === identity.fase);
      if (exists) {
        return prev.map((m) => (m.atpId === atpId && m.fase === identity.fase ? fresh : m));
      }
      return [...prev, fresh];
    });
    showToast(`Modul Ajar ${fresh.kodeTP} disinkronkan dari CP, TP & ATP.`);
  };

  const handleUpdateModul = (updated: ModulAjarItem) => {
    setModuls((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Perubahan Modul Ajar ${updated.kodeTP} disimpan.`);
  };

  const handleDownloadModulDocx = (modul: ModulAjarItem) => {
    const filename = downloadModulAjarDocx(identity, modul);
    showToast(`Modul Ajar DOCX diunduh: ${filename}`);
  };

  const handleCopyModul = (modul: ModulAjarItem) => {
    const text = formatModulAjarForClipboard(modul, identity);
    if (!navigator.clipboard?.writeText) {
      showToast('Browser tidak mengizinkan akses clipboard otomatis.');
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast(`Modul Ajar ${modul.kodeTP} disalin ke clipboard.`);
      })
      .catch(() => {
        showToast('Gagal menyalin otomatis. Silakan unduh DOCX atau PDF.');
      });
  };

  const handleRunButtonTests = () => {
    const sampleTpsA = generateTPsForCPs('A', ['1.1', '1.2', '1.3', '1.4', '1.5'], []);
    const sampleAtpA = generateATPFromTPs('A', sampleTpsA);
    const outCheck = checkOutsideKepka0202026('Pembagian Harta Waris Mawaris', 'A');
    const swappedAtp = [...sampleAtpA];
    const wudhuIdx = swappedAtp.findIndex((x) => x.prereqTag === 'bersuci');
    const salatIdx = swappedAtp.findIndex((x) => x.prereqTag === 'salat_fardu');
    let swapDetected = false;
    if (wudhuIdx !== -1 && salatIdx !== -1 && wudhuIdx < salatIdx) {
      const tmp = swappedAtp[wudhuIdx];
      swappedAtp[wudhuIdx] = swappedAtp[salatIdx];
      swappedAtp[salatIdx] = tmp;
      swapDetected = validateATPOrder(swappedAtp).length > 0;
    }
    const missingCp14 = checkCPCompleteness(
      'A',
      sampleTpsA.filter((t) => t.cpCode !== '1.4'),
      sampleAtpA
    ).some((i) => i.cpCode === '1.4');
    const docxBlob = createDocxBlob(identity, faseTps, faseAtps, 'cp_tp_atp', {
      cps: activeFaseCps,
    });
    const cpDocxBlob = createDocxBlob(identity, faseTps, faseAtps, 'cp', {
      cps: activeFaseCps,
    });
    const sampleModuls = generateAllModulAjarFromATP(identity, sampleTpsA, sampleAtpA);
    const fullBundleDocxBlob = createDocxBlob(identity, sampleTpsA, sampleAtpA, 'full_bundle', {
      cps: CP_DATABASE.filter((c) => c.fase === 'A'),
      allModuls: sampleModuls,
    });
    const modulDocxBlob = sampleModuls[0] ? createModulAjarDocxBlob(identity, sampleModuls[0]) : null;
    const standaloneHtml = buildStandaloneHtmlString(identity);
    const clipboardText = formatTPsForClipboard(faseTps, identity);

    const results: ButtonTestResult[] = [
      {
        name: 'Tombol Simpan & Sinkron Identitas Sekolah/Guru/Dokumen',
        passed:
          !!identity.namaSekolah &&
          !!localStorage.getItem(STORAGE_KEYS.IDENTITY) &&
          session?.namaGuru === identity.namaGuru &&
          (!sampleModuls[0] || sampleModuls[0].identitasPenulis.includes(identity.namaSekolah)),
        detail: `Identitas "${identity.namaSekolah}" & "${identity.namaGuru}" tersinkron ke tampilan, sesi, dan dokumen.`,
      },
      {
        name: 'Database CP Kepka BKPDM No. 020/2026',
        passed: CP_DATABASE.length === 15,
        detail: `${CP_DATABASE.length} CP resmi Fase A, B, dan C siap tanpa ketik ulang.`,
      },
      {
        name: 'Guard Materi Di Luar CP 020/2026',
        passed: outCheck.isOutside && outCheck.reason.includes('Di luar CP Kepka 020/2026'),
        detail: outCheck.reason,
      },
      {
        name: 'Tombol Generate TP (4-7 TP per CP + Deep Learning)',
        passed: sampleTpsA.length >= 20 && sampleTpsA.every((t) => t.indikatorMindful && t.indikatorMeaningful && t.indikatorJoyful),
        detail: `5 CP Fase A terpecah menjadi ${sampleTpsA.length} TP lengkap Mindful/Meaningful/Joyful.`,
      },
      {
        name: 'Tombol Generate ATP & Deteksi Urutan Salah',
        passed: sampleAtpA.length === sampleTpsA.length && swapDetected,
        detail: 'Urutan prasyarat otomatis & deteksi kesalahan (Wudhu sebelum Salat) aktif.',
      },
      {
        name: 'Generator Modul Ajar Lengkap (3 Bagian Kurikulum Merdeka)',
        passed:
          sampleModuls.length === sampleAtpA.length &&
          !!modulDocxBlob &&
          modulDocxBlob.size > 1000 &&
          sampleModuls[0].lkpdTugas.length >= 3,
        detail: `${sampleModuls.length} Modul Ajar lengkap (Informasi Umum, Komponen Inti, Lampiran LKPD/Glosarium/Pustaka) + DOCX siap.`,
      },
      {
        name: 'Fitur Cek Kelengkapan CP',
        passed: missingCp14,
        detail: 'Mendeteksi akurat apabila CP 1.4 belum dibuat TP-nya.',
      },
      {
        name: 'Pratinjau & Ekspor DOCX Rapi (CP / TP / ATP / Modul / Paket Lengkap)',
        passed: docxBlob.size > 1000 && cpDocxBlob.size > 1000 && fullBundleDocxBlob.size > 1000,
        detail: `OOXML DOCX terformat presisi (${docxBlob.size.toLocaleString('id-ID')} bytes CP-TP-ATP · ${fullBundleDocxBlob.size.toLocaleString('id-ID')} bytes Paket Lengkap).`,
      },
      {
        name: 'Tombol Salin TP, Print PDF & Unduh 1-File HTML',
        passed: clipboardText.length > 100 && standaloneHtml.includes('<!doctype html>'),
        detail: `Salin TP (${faseTps.length} item), window.print(), dan HTML statis (${Math.round(standaloneHtml.length / 1024)} KB) siap.`,
      },
    ];

    setTestResults(results);
    showToast(`Uji Tombol selesai: ${results.filter((r) => r.passed).length}/${results.length} fitur terverifikasi.`);
  };

  if (!session) {
    return (
      <LoginScreen
        identity={identity}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onLogin={(s) => {
          setSession(s);
          const nextIdentity: SchoolIdentity = {
            ...identity,
            namaGuru: s.namaGuru,
            nipGuru: s.nipOrEmail && s.nipOrEmail !== '-' ? s.nipOrEmail : identity.nipGuru,
          };
          setIdentity(nextIdentity);
          setModuls((prev) => prev.map((m) => syncModulWithIdentity(m, nextIdentity)));
          showToast(`Selamat datang, ${s.namaGuru} (${nextIdentity.namaSekolah})`);
        }}
      />
    );
  }

  const pageTitles: Record<NavPage, string> = {
    dashboard: 'Dashboard & Tes Tombol',
    identitas: 'Identitas Sekolah',
    'pilih-cp': 'Pilih CP (Kepka 020/2026)',
    'generator-tp': 'Generator TP Pembelajaran Mendalam',
    'generator-atp': 'Generator ATP & Urutan Prasyarat',
    'modul-ajar': 'Modul Ajar Lengkap Kurikulum Merdeka',
    'unduh-print': 'Unduh PDF / Print & Ekspor DOCX (F4)',
  };

  return (
    <div className="min-h-screen flex bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        activePage={activePage}
        identity={identity}
        tpCount={faseTps.length}
        atpCount={faseAtps.length}
        modulCount={faseModuls.length}
        darkMode={darkMode}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onSelectPage={setActivePage}
        onToggleDark={() => setDarkMode((d) => !d)}
        onOpenQuickSettings={() => setQuickSettingsOpen(true)}
        onLogout={() => setSession(null)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="no-print sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="lg:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {pageTitles[activePage]}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                {identity.namaSekolah} (NPSN {identity.npsn}) · {identity.namaGuru} · Fase {identity.fase} ({identity.kelas}) · TA {identity.tahunAjaran}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Ganti tema terang atau gelap"
              className="min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
              <span className="hidden sm:inline">{darkMode ? 'Terang' : 'Gelap'}</span>
            </button>
            <button
              type="button"
              onClick={() => setQuickSettingsOpen(true)}
              className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#14532d] hover:bg-emerald-900 text-white inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-300" />
              <span>Pengaturan Cepat</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              identity={identity}
              tps={tps}
              atps={faseAtps}
              completenessIssues={completenessIssues}
              orderWarnings={orderWarnings}
              testResults={testResults}
              onRunButtonTests={handleRunButtonTests}
              onNavigate={setActivePage}
              onResetFaseA={handleResetFaseA}
            />
          )}

          {activePage === 'identitas' && (
            <IdentityView identity={identity} onSave={handleSaveIdentity} />
          )}

          {activePage === 'pilih-cp' && (
            <SelectCPView
              fase={identity.fase}
              identity={identity}
              selectedCpCodes={selectedCpCodes}
              onChangeFase={handleChangeFase}
              onToggleCp={handleToggleCp}
              onSelectAllCps={handleSelectAllCps}
              onClearCps={handleClearCps}
              onGenerateTP={handleGenerateTP}
              onOpenPrintPreview={() => handleOpenPrintPreview('cp')}
            />
          )}

          {activePage === 'generator-tp' && (
            <GeneratorTPView
              fase={identity.fase}
              identity={identity}
              tps={tps}
              onGenerateTP={handleGenerateTP}
              onGenerateATP={handleGenerateATP}
              onAddTP={handleAddTP}
              onUpdateTP={handleUpdateTP}
              onDeleteTP={handleDeleteTP}
              onCopyAllTP={handleCopyAllTP}
              onOpenPrintPreview={() => handleOpenPrintPreview('tp')}
            />
          )}

          {activePage === 'generator-atp' && (
            <GeneratorATPView
              fase={identity.fase}
              identity={identity}
              atps={faseAtps}
              orderWarnings={orderWarnings}
              completenessIssues={completenessIssues}
              onGenerateATP={handleGenerateATP}
              onMoveATP={handleMoveATP}
              onReorderATP={handleReorderATP}
              onAutoFixOrder={handleAutoFixOrder}
              onUpdateATP={handleUpdateATP}
              onDeleteATP={handleDeleteATP}
              onGoToSelectCP={() => setActivePage('pilih-cp')}
              onOpenPrintPreview={() => handleOpenPrintPreview('atp')}
            />
          )}

          {activePage === 'modul-ajar' && (
            <ModulAjarView
              fase={identity.fase}
              identity={identity}
              atps={faseAtps}
              modulList={moduls}
              onGenerateAllModuls={handleGenerateAllModuls}
              onRegenerateSingleModul={handleRegenerateSingleModul}
              onUpdateModul={handleUpdateModul}
              onDownloadModulDocx={handleDownloadModulDocx}
              onCopyModul={handleCopyModul}
              onOpenPrintPreview={(atpId) => handleOpenPrintPreview('modul', atpId)}
            />
          )}

          {activePage === 'unduh-print' && (
            <ExportPrintView
              identity={identity}
              cps={activeFaseCps}
              selectedCpCodes={selectedCpCodes}
              tps={tps}
              atps={faseAtps}
              moduls={moduls}
              activeDocMode={exportDocMode}
              onChangeDocMode={setExportDocMode}
              selectedModulAtpId={exportModulAtpId}
              onChangeSelectedModulAtpId={setExportModulAtpId}
              onDownloadDocx={handleDownloadDocx}
              onPrint={handlePrint}
              onCopyTP={handleCopyAllTP}
              onDownloadStandaloneHtml={handleDownloadStandaloneHtml}
            />
          )}
        </main>
      </div>

      <QuickSettingsPanel
        open={quickSettingsOpen}
        fase={identity.fase}
        darkMode={darkMode}
        completenessIssues={completenessIssues}
        orderWarnings={orderWarnings}
        onClose={() => setQuickSettingsOpen(false)}
        onChangeFase={handleChangeFase}
        onToggleDark={() => setDarkMode((d) => !d)}
        onGenerateTP={handleGenerateTP}
        onGenerateATP={handleGenerateATP}
        onGenerateModulAjar={handleGenerateAllModuls}
        onExportDocxBoth={() => handleDownloadDocx('both')}
        onResetExampleFaseA={handleResetFaseA}
      />

      {toastMsg && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-xl bg-[#14532d] text-white text-sm font-semibold shadow-lg border border-amber-400"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
