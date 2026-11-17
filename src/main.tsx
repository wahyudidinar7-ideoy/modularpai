import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
}

class AppErrorBoundary extends React.Component<
  {children: React.ReactNode},
  ErrorBoundaryState
> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {hasError: true};
  }

  private handleResetLocalCache = () => {
    try {
      window.localStorage.clear();
    } catch {
      // Abaikan jika localStorage diblokir
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 text-slate-900 p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-center shadow-sm">
            <h1 className="text-lg font-bold text-[#14532d]">
              Terjadi Gangguan Memuat Data Lokal
            </h1>
            <p className="text-sm text-slate-600">
              Muat ulang halaman atau bersihkan cache penyimpanan lokal apabila data sebelumnya tidak kompatibel.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 rounded-lg bg-[#14532d] text-white text-sm font-bold cursor-pointer"
              >
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleResetLocalCache}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold cursor-pointer"
              >
                Reset Cache Lokal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
