import React from 'react';
import { X, CheckCircle, Smartphone, Monitor, Touchpad, Volume2, Download, PenTool } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface PetunjukModalProps {
  isOpen: boolean;
  onClose: () => void;
  helpText: string;
}

export const PetunjukModal: React.FC<PetunjukModalProps> = ({ isOpen, onClose, helpText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border-2 border-sky-500 shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-2xl font-bold">
              ❓
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Petunjuk Penggunaan Layar Sentuh IFP
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Panduan pengoperasian media interaktif di kelas
              </p>
            </div>
          </div>

          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="touch-target-lg min-h-[48px] min-w-[48px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center btn-bounce"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Custom Teacher Guide text */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 space-y-2">
          <h4 className="text-sm font-black text-sky-900 dark:text-sky-300 uppercase">
            Catatan dari Guru / Pembuat Materi:
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
            {helpText}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <Touchpad className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Tombol Sentuh Ramah IFP</strong>
              <span className="text-slate-500">Seluruh tombol berukuran minimal 60x60px dengan animasi mikro saat ditekan.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <PenTool className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Papan Coretan Digital</strong>
              <span className="text-slate-500">Mencoret atau menulis rumus langsung di atas layar saat presentasi.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Suara Interaktif & TTS</strong>
              <span className="text-slate-500">Membacakan teks secara otomatis dalam Bahasa Indonesia lewat pengeras suara.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <Download className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Ekspor Single-File HTML</strong>
              <span className="text-slate-500">Unduh seluruh bahan ajar menjadi 1 file HTML mandiri yang berjalan 100% offline.</span>
            </div>
          </div>

        </div>

        <button
          onClick={() => { soundFx.playClick(); onClose(); }}
          className="touch-target-lg min-h-[56px] w-full rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-base shadow-md transition-all btn-bounce"
        >
          Mengerti & Tutup
        </button>

      </div>
    </div>
  );
};
