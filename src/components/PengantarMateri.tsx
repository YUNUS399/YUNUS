import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle, Lightbulb, BookOpen, Layers } from 'lucide-react';
import { LessonSection } from '../types';
import { speakText, stopSpeech, soundFx } from '../utils/sound';

interface PengantarMateriProps {
  sections: LessonSection[];
}

export const PengantarMateri: React.FC<PengantarMateriProps> = ({ sections }) => {
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentSection = sections[activeSecIdx] || sections[0];

  const handleSpeak = () => {
    soundFx.playClick();
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const fullText = `${currentSection.title}. ${currentSection.summary}. ${currentSection.contentMarkdown}`;
      setIsSpeaking(true);
      speakText(fullText, () => setIsSpeaking(false));
    }
  };

  const handleSecChange = (index: number) => {
    stopSpeech();
    setIsSpeaking(false);
    soundFx.playClick();
    setActiveSecIdx(index);
  };

  if (!currentSection) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Sub-Tabs (Top Carousel for Quick IFP Touching) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec, idx) => {
          const isActive = idx === activeSecIdx;
          return (
            <button
              key={sec.id || idx}
              onClick={() => handleSecChange(idx)}
              className={`touch-target-lg min-h-[56px] px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all btn-bounce border-2 flex items-center gap-2.5 ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{sec.icon || "📘"}</span>
              <span>Sub-Bab {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Section Card */}
      <div className="soft-card rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-300">
        
        {/* Header Action Bar inside Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 flex items-center justify-center text-3xl font-extrabold border border-sky-200 dark:border-sky-800 shadow-sm">
              {currentSection.icon || "📖"}
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-sky-800 dark:text-sky-300">
                Sub-Materi {activeSecIdx + 1} dari {sections.length}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentSection.title}
              </h2>
            </div>
          </div>

          {/* Text-To-Speech Button */}
          <button
            onClick={handleSpeak}
            className={`touch-target-lg min-h-[52px] px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md transition-all btn-bounce ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-sky-50 dark:bg-sky-900/40 text-sky-800 dark:text-sky-200 hover:bg-sky-100 border border-sky-200 dark:border-sky-800'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Hentikan Suara</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-sky-600" />
                <span>Bacakan Materi (TTS)</span>
              </>
            )}
          </button>
        </div>

        {/* Highlight Summary Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border-l-8 border-sky-600 dark:border-sky-500 mb-8 shadow-sm">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-900 dark:text-sky-300">
                Ringkasan Utama:
              </span>
              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed mt-1">
                {currentSection.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Explanation Text */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            Penjelasan Lengkap Materi
          </h3>
          <div className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line bg-slate-50/80 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {currentSection.contentMarkdown}
          </div>
        </div>

        {/* Key Points Checklist */}
        {currentSection.keyPoints && currentSection.keyPoints.length > 0 && (
          <div className="bg-sky-50/50 dark:bg-sky-950/30 rounded-2xl p-6 border border-sky-100 dark:border-sky-900/50">
            <h4 className="text-base font-extrabold text-sky-900 dark:text-sky-300 mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              Poin Kunci yang Wajib Dipahami Siswa:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSection.keyPoints.map((point, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 shadow-xs"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Pagination for Easy IFP Touching */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200 dark:border-slate-700/80">
          <button
            onClick={() => handleSecChange(Math.max(0, activeSecIdx - 1))}
            disabled={activeSecIdx === 0}
            className="touch-target-lg min-h-[52px] px-6 rounded-xl font-bold text-sm sm:text-base bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-all btn-bounce"
          >
            ⬅️ Sub-Materi Sebelumnya
          </button>
          
          <span className="font-bold text-sm text-slate-500 dark:text-slate-400">
            {activeSecIdx + 1} / {sections.length}
          </span>

          <button
            onClick={() => handleSecChange(Math.min(sections.length - 1, activeSecIdx + 1))}
            disabled={activeSecIdx === sections.length - 1}
            className="touch-target-lg min-h-[52px] px-6 rounded-xl font-bold text-sm sm:text-base bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all btn-bounce"
          >
            Sub-Materi Selanjutnya ➡️
          </button>
        </div>

      </div>
    </div>
  );
};
