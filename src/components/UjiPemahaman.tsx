import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';
import { soundFx } from '../utils/sound';

interface UjiPemahamanProps {
  questions: QuizQuestion[];
}

export const UjiPemahaman: React.FC<UjiPemahamanProps> = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIdx];
  const isAnswered = currentQ ? userAnswers[currentQ.id] !== undefined : false;
  const selectedOption = currentQ ? userAnswers[currentQ.id] : undefined;

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered || !currentQ) return;

    const isCorrect = optIdx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      soundFx.playCorrect();
      setScore((prev) => prev + 20);
    } else {
      soundFx.playWrong();
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      soundFx.playCelebration();
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setUserAnswers({});
    setScore(0);
    setIsCompleted(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="soft-card rounded-3xl p-8 text-center text-slate-500">
        Belum ada soal kuis yang dimasukkan. Silakan gunakan Editor Guru untuk menambahkan soal.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="soft-card rounded-3xl p-6 sm:p-8 lg:p-10">
        
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-800 dark:text-sky-300">
              Evaluasi Interaktif Layar Sentuh
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              📝 Uji Pemahaman Siswa
            </h2>
          </div>

          {!isCompleted && (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 font-extrabold text-sm sm:text-base border border-sky-200 dark:border-sky-800">
                Soal {currentIdx + 1} dari {questions.length}
              </span>
            </div>
          )}
        </div>

        {/* COMPLETED STATE CARD */}
        {isCompleted ? (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center text-5xl shadow-xl border-4 border-amber-300 dark:border-amber-700">
              <Award className="w-14 h-14 text-amber-500" />
            </div>

            <div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                Kuis Selesai! Luar Biasa 🎉
              </h3>
              <p className="text-slate-600 dark:text-slate-300 font-semibold mt-2">
                Hasil evaluasi interaktif langsung di layar IFP:
              </p>
            </div>

            {/* Score Pill */}
            <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-xl">
              <span className="text-xs font-black uppercase tracking-widest text-sky-100">
                Total Skor Anda
              </span>
              <div className="text-5xl sm:text-6xl font-black my-1">
                {score} <span className="text-2xl font-bold text-sky-200">/ {questions.length * 20}</span>
              </div>
              <p className="text-sm font-semibold text-sky-100 mt-1">
                {score >= 80 ? 'Sangat Baik! Pemahaman Materi Sempurna.' : 'Bagus! Pelajari kembali materi yang belum dikuasai.'}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRestart}
                className="touch-target-lg min-h-[60px] px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg flex items-center gap-3 mx-auto shadow-lg transition-all btn-bounce"
              >
                <RotateCcw className="w-6 h-6" /> Kerjakan Ulang Kuis
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE QUIZ QUESTION */
          <div className="space-y-6">
            
            {/* Category badge */}
            {currentQ.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                Kategori: {currentQ.category}
              </span>
            )}

            {/* Question Text */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Touch Option Cards (Min 64px height) */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isThisSelected = selectedOption === optIdx;
                const isCorrectIndex = optIdx === currentQ.correctAnswerIndex;

                let btnStyles = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

                if (isAnswered) {
                  if (isCorrectIndex) {
                    btnStyles = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 dark:border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-md scale-[1.01]';
                  } else if (isThisSelected) {
                    btnStyles = 'bg-rose-50 dark:bg-rose-950/80 border-rose-600 dark:border-rose-500 text-rose-900 dark:text-rose-100';
                  } else {
                    btnStyles = 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`touch-target-lg min-h-[64px] w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-bold text-base sm:text-lg flex items-center justify-between gap-4 transition-all btn-bounce ${btnStyles}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Badge A, B, C, D */}
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 ${
                        isAnswered && isCorrectIndex
                          ? 'bg-emerald-600 text-white'
                          : isAnswered && isThisSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </div>

                    {/* Status Icons */}
                    {isAnswered && isCorrectIndex && (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && isThisSelected && !isCorrectIndex && (
                      <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-5 sm:p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/80 border-l-8 border-sky-600 dark:border-sky-500 space-y-2 animate-fadeIn shadow-sm">
                <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200 font-extrabold text-base">
                  <HelpCircle className="w-5 h-5 text-sky-600" />
                  Penjelasan Kunci Jawaban:
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-base font-semibold leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next / Finish Button */}
            {isAnswered && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="touch-target-lg min-h-[60px] px-8 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-lg flex items-center gap-3 shadow-lg transition-all btn-bounce"
                >
                  {currentIdx < questions.length - 1 ? (
                    <>
                      Soal Berikutnya <ArrowRight className="w-6 h-6" />
                    </>
                  ) : (
                    <>
                      Lihat Hasil Kuis 🎉
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
