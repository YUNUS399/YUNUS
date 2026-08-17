import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Download, Upload, RotateCcw, FileCode, Check } from 'lucide-react';
import { LessonData, LessonSection, QuizQuestion } from '../types';
import { soundFx } from '../utils/sound';
import { initialLessonData } from '../utils/defaultData';

interface TeacherEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonData: LessonData;
  onSaveData: (newData: LessonData) => void;
  onExportHtml: () => void;
}

export const TeacherEditorModal: React.FC<TeacherEditorModalProps> = ({
  isOpen,
  onClose,
  lessonData,
  onSaveData,
  onExportHtml,
}) => {
  const [formData, setFormData] = useState<LessonData>(JSON.parse(JSON.stringify(lessonData)));
  const [activeTab, setActiveTab] = useState<'umum' | 'sections' | 'quiz' | 'profil'>('umum');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundFx.playCorrect();
    onSaveData(formData);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2000);
  };

  const handleResetDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke standar default?')) {
      soundFx.playClick();
      setFormData(JSON.parse(JSON.stringify(initialLessonData)));
      onSaveData(initialLessonData);
    }
  };

  const handleExportJson = () => {
    soundFx.playClick();
    const str = JSON.stringify(formData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Bahan_Ajar_${formData.subjectTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as LessonData;
        if (parsed.subjectTitle && parsed.sections) {
          soundFx.playCorrect();
          setFormData(parsed);
          onSaveData(parsed);
          alert('Berhasil mengimpor data bahan ajar JSON!');
        } else {
          alert('Format JSON tidak valid.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Section Handlers
  const addSection = () => {
    soundFx.playClick();
    const newSec: LessonSection = {
      id: `sec-${Date.now()}`,
      title: `${formData.sections.length + 1}. Sub-Bab Baru`,
      icon: '📚',
      summary: 'Ringkasan singkat sub-bab baru.',
      contentMarkdown: 'Isi penjelasan lengkap untuk sub-bab ini.',
      keyPoints: ['Poin kunci 1', 'Poin kunci 2'],
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSec],
    });
  };

  const removeSection = (idx: number) => {
    soundFx.playClick();
    const updated = formData.sections.filter((_, i) => i !== idx);
    setFormData({ ...formData, sections: updated });
  };

  // Quiz Handlers
  const addQuizQuestion = () => {
    soundFx.playClick();
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Pertanyaan baru kuis interaktif?',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correctAnswerIndex: 0,
      explanation: 'Penjelasan jawaban yang benar.',
      category: 'Umum',
    };
    setFormData({
      ...formData,
      quizQuestions: [...formData.quizQuestions, newQ],
    });
  };

  const removeQuizQuestion = (idx: number) => {
    soundFx.playClick();
    const updated = formData.quizQuestions.filter((_, i) => i !== idx);
    setFormData({ ...formData, quizQuestions: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl border-2 border-amber-500 shadow-2xl p-6 my-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
              ⚙️
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Editor Konten Bahan Ajar Guru
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Ubah judul, sub-bab materi, kuis, dan profil guru secara mandiri
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="touch-target-lg min-h-[48px] px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md btn-bounce"
            >
              <Save className="w-5 h-5" /> Simpan Perubahan
            </button>

            <button
              onClick={() => { soundFx.playClick(); onClose(); }}
              className="touch-target-lg min-h-[48px] min-w-[48px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center btn-bounce"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Saved Toast Notification */}
        {showSavedNotification && (
          <div className="p-4 rounded-xl bg-emerald-500 text-white font-extrabold text-center flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-5 h-5" /> Perubahan Berhasil Disimpan ke Sistem!
          </div>
        )}

        {/* Editor Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('umum')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border-2 transition-all ${
              activeTab === 'umum' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 text-slate-700'
            }`}
          >
            📋 Identitas Umum
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border-2 transition-all ${
              activeTab === 'sections' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 text-slate-700'
            }`}
          >
            📖 Sub-Bab Materi ({formData.sections.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border-2 transition-all ${
              activeTab === 'quiz' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 text-slate-700'
            }`}
          >
            📝 Soal Kuis ({formData.quizQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border-2 transition-all ${
              activeTab === 'profil' ? 'bg-amber-500 text-slate-950 border-amber-600' : 'bg-slate-100 text-slate-700'
            }`}
          >
            👤 Profil & KD Guru
          </button>
        </div>

        {/* TAB 1: IDENTITAS UMUM */}
        {activeTab === 'umum' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Mata Pelajaran:
                </label>
                <input
                  type="text"
                  value={formData.subjectTitle}
                  onChange={(e) => setFormData({ ...formData, subjectTitle: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Judul Topik / Materi Utama:
                </label>
                <input
                  type="text"
                  value={formData.topicTitle}
                  onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Tingkat Kelas / Fase:
                </label>
                <input
                  type="text"
                  value={formData.classLevel}
                  onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Nama Sekolah:
                </label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Petunjuk Penggunaan untuk Siswa / Pengunjung IFP:
              </label>
              <textarea
                rows={3}
                value={formData.helpGuideText}
                onChange={(e) => setFormData({ ...formData, helpGuideText: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              />
            </div>
          </div>
        )}

        {/* TAB 2: SECTIONS (SUB-BAB MATERI) */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-500">Daftar Modul Sub-Bab</span>
              <button
                onClick={addSection}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Sub-Bab
              </button>
            </div>

            {formData.sections.map((sec, idx) => (
              <div key={sec.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sky-800 dark:text-sky-300 text-sm">
                    Sub-Bab #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeSection(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Ikon Emoji:</label>
                    <input
                      type="text"
                      value={sec.icon}
                      onChange={(e) => {
                        const updated = [...formData.sections];
                        updated[idx].icon = e.target.value;
                        setFormData({ ...formData, sections: updated });
                      }}
                      className="w-full p-2.5 rounded-xl border font-bold text-center"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Judul Sub-Bab:</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => {
                        const updated = [...formData.sections];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, sections: updated });
                      }}
                      className="w-full p-2.5 rounded-xl border font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Ringkasan:</label>
                  <input
                    type="text"
                    value={sec.summary}
                    onChange={(e) => {
                      const updated = [...formData.sections];
                      updated[idx].summary = e.target.value;
                      setFormData({ ...formData, sections: updated });
                    }}
                    className="w-full p-2.5 rounded-xl border font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Isi Penjelasan Lengkap:</label>
                  <textarea
                    rows={3}
                    value={sec.contentMarkdown}
                    onChange={(e) => {
                      const updated = [...formData.sections];
                      updated[idx].contentMarkdown = e.target.value;
                      setFormData({ ...formData, sections: updated });
                    }}
                    className="w-full p-2.5 rounded-xl border font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: QUIZ QUESTIONS */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-slate-500">Bank Soal Kuis Interaktif</span>
              <button
                onClick={addQuizQuestion}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Soal
              </button>
            </div>

            {formData.quizQuestions.map((q, idx) => (
              <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sky-800 dark:text-sky-300 text-sm">
                    Soal #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeQuizQuestion(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Teks Pertanyaan Soal:</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...formData.quizQuestions];
                      updated[idx].question = e.target.value;
                      setFormData({ ...formData, quizQuestions: updated });
                    }}
                    className="w-full p-2.5 rounded-xl border font-bold"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${idx}`}
                        checked={q.correctAnswerIndex === optIdx}
                        onChange={() => {
                          const updated = [...formData.quizQuestions];
                          updated[idx].correctAnswerIndex = optIdx;
                          setFormData({ ...formData, quizQuestions: updated });
                        }}
                      />
                      <span className="text-xs font-bold w-4">{String.fromCharCode(65 + optIdx)}</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formData.quizQuestions];
                          updated[idx].options[optIdx] = e.target.value;
                          setFormData({ ...formData, quizQuestions: updated });
                        }}
                        className="w-full p-2 rounded-lg border text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Penjelasan Jawaban:</label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => {
                      const updated = [...formData.quizQuestions];
                      updated[idx].explanation = e.target.value;
                      setFormData({ ...formData, quizQuestions: updated });
                    }}
                    className="w-full p-2 rounded-xl border text-xs font-medium"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: TEACHER PROFILE */}
        {activeTab === 'profil' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Nama Guru Lengkap:
                </label>
                <input
                  type="text"
                  value={formData.teacherProfile.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teacherProfile: { ...formData.teacherProfile, name: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  NIP Guru:
                </label>
                <input
                  type="text"
                  value={formData.teacherProfile.nip}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teacherProfile: { ...formData.teacherProfile, nip: e.target.value },
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Bio / Pengenalan Guru:
              </label>
              <textarea
                rows={2}
                value={formData.teacherProfile.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teacherProfile: { ...formData.teacherProfile, bio: e.target.value },
                  })
                }
                className="w-full p-3 rounded-xl border-2 font-medium"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onExportHtml}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md"
            >
              <FileCode className="w-4 h-4" /> Ekspor Single-File HTML Standalone
            </button>

            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 border"
            >
              <Download className="w-4 h-4" /> Unduh JSON
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-2 border cursor-pointer">
              <Upload className="w-4 h-4" /> Impor JSON
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <button
            onClick={handleResetDefault}
            className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset ke Default
          </button>
        </div>

      </div>
    </div>
  );
};
