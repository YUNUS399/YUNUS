import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarNav } from './components/SidebarNav';
import { PengantarMateri } from './components/PengantarMateri';
import { SimulasiInteraktif } from './components/SimulasiInteraktif';
import { UjiPemahaman } from './components/UjiPemahaman';
import { ProfilPembuat } from './components/ProfilPembuat';
import { PapanTulisModal } from './components/PapanTulisModal';
import { PetunjukModal } from './components/PetunjukModal';
import { TeacherEditorModal } from './components/TeacherEditorModal';
import { LessonData, ActiveTab, ThemeMode } from './types';
import { initialLessonData } from './utils/defaultData';
import { exportToStandaloneHtml } from './utils/htmlExporter';

export default function App() {
  // Load data from localStorage or fallback
  const [lessonData, setLessonData] = useState<LessonData>(() => {
    try {
      const saved = localStorage.getItem('ifp_lesson_master_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialLessonData;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('pengantar');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTeacherEditorOpen, setIsTeacherEditorOpen] = useState(false);

  // Save lesson data when changed
  const handleSaveLessonData = (newData: LessonData) => {
    setLessonData(newData);
    try {
      localStorage.setItem('ifp_lesson_master_data', JSON.stringify(newData));
    } catch {}
  };

  const handleExportHtml = () => {
    exportToStandaloneHtml(lessonData);
  };

  // Sync theme mode to document HTML element class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'high-contrast') {
      root.classList.add('high-contrast');
    }
  }, [themeMode]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      themeMode === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : themeMode === 'high-contrast'
        ? 'bg-white text-black'
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <Header
        lessonData={lessonData}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
        onOpenHelpModal={() => setIsHelpOpen(true)}
        onOpenTeacherEditor={() => setIsTeacherEditorOpen(true)}
        onExportHtml={handleExportHtml}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Dynamic Sidebar Navigation */}
        <SidebarNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'pengantar' && (
            <PengantarMateri sections={lessonData.sections} />
          )}

          {activeTab === 'simulasi' && (
            <SimulasiInteraktif initialParams={lessonData.simulationParams} />
          )}

          {activeTab === 'uji' && (
            <UjiPemahaman questions={lessonData.quizQuestions} />
          )}

          {activeTab === 'profil' && (
            <ProfilPembuat profile={lessonData.teacherProfile} />
          )}
        </main>

      </div>

      {/* Footer Info Bar */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            {lessonData.schoolName} &bull; Kerangka Master Bahan Ajar Interaktif IFP
          </span>
          <span className="text-sky-600 dark:text-sky-400 font-bold">
            100% Offline Compatible &bull; Interactive Flat Panel Ready
          </span>
        </div>
      </footer>

      {/* MODALS */}
      <PapanTulisModal
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
      />

      <PetunjukModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        helpText={lessonData.helpGuideText}
      />

      <TeacherEditorModal
        isOpen={isTeacherEditorOpen}
        onClose={() => setIsTeacherEditorOpen(false)}
        lessonData={lessonData}
        onSaveData={handleSaveLessonData}
        onExportHtml={handleExportHtml}
      />

    </div>
  );
}
