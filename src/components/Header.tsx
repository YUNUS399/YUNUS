import React from 'react';
import { 
  HelpCircle, 
  PenTool, 
  Settings, 
  Download, 
  Maximize, 
  Minimize, 
  Sun, 
  Moon, 
  Eye, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { LessonData, ThemeMode } from '../types';
import { soundFx } from '../utils/sound';

interface HeaderProps {
  lessonData: LessonData;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenWhiteboard: () => void;
  onOpenHelpModal: () => void;
  onOpenTeacherEditor: () => void;
  onExportHtml: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lessonData,
  themeMode,
  setThemeMode,
  isMuted,
  setIsMuted,
  onOpenWhiteboard,
  onOpenHelpModal,
  onOpenTeacherEditor,
  onExportHtml,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    soundFx.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleMuteToggle = () => {
    soundFx.setMuted(!isMuted);
    setIsMuted(!isMuted);
    soundFx.playClick();
  };

  const cycleTheme = () => {
    soundFx.playClick();
    if (themeMode === 'light') setThemeMode('dark');
    else if (themeMode === 'dark') setThemeMode('high-contrast');
    else setThemeMode('light');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 shadow-sm transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Logo & School / Subject Titles */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-3xl shadow-inner border border-sky-200 dark:border-sky-800">
            {lessonData.schoolLogoEmoji || "🏫"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-black text-sky-800 dark:text-sky-300 tracking-tight">
                {lessonData.subjectTitle}
              </h1>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                {lessonData.classLevel}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 line-clamp-1">
              {lessonData.topicTitle} &bull; <span className="text-slate-500">{lessonData.schoolName}</span>
            </p>
          </div>
        </div>

        {/* IFP Action Toolbar Buttons - All >60px Touch Targets */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          
          {/* Papan Tulis Coretan */}
          <button
            onClick={() => { soundFx.playClick(); onOpenWhiteboard(); }}
            title="Buka Papan Coretan IFP"
            className="touch-target-lg min-h-[52px] px-3.5 sm:px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all btn-bounce"
          >
            <PenTool className="w-5 h-5" />
            <span className="hidden md:inline">Papan Coretan</span>
          </button>

          {/* Editor Guru */}
          <button
            onClick={() => { soundFx.playClick(); onOpenTeacherEditor(); }}
            title="Edit Konten & Pengaturan"
            className="touch-target-lg min-h-[52px] px-3.5 sm:px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all btn-bounce"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden lg:inline">Edit Konten</span>
          </button>

          {/* Export Single-File HTML */}
          <button
            onClick={() => { soundFx.playClick(); onExportHtml(); }}
            title="Unduh File HTML Mandiri untuk Offline IFP"
            className="touch-target-lg min-h-[52px] px-3.5 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md transition-all btn-bounce"
          >
            <Download className="w-5 h-5" />
            <span className="hidden xl:inline">Ekspor HTML</span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            className="touch-target-lg min-h-[52px] min-w-[52px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center transition-all btn-bounce border border-slate-200 dark:border-slate-700"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          {/* High Contrast / Dark / Light Theme Cycle */}
          <button
            onClick={cycleTheme}
            title="Ubah Tema Latar IFP"
            className="touch-target-lg min-h-[52px] min-w-[52px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center transition-all btn-bounce border border-slate-200 dark:border-slate-700"
          >
            {themeMode === 'light' && <Sun className="w-5 h-5 text-amber-500" />}
            {themeMode === 'dark' && <Moon className="w-5 h-5 text-indigo-400" />}
            {themeMode === 'high-contrast' && <Eye className="w-5 h-5 text-yellow-400" />}
          </button>

          {/* Petunjuk Penggunaan Modal */}
          <button
            onClick={() => { soundFx.playClick(); onOpenHelpModal(); }}
            title="Bantuan & Petunjuk Penggunaan"
            className="touch-target-lg min-h-[52px] min-w-[52px] px-3 rounded-xl bg-sky-50 dark:bg-sky-900/50 hover:bg-sky-100 text-sky-700 dark:text-sky-200 font-bold flex items-center justify-center transition-all btn-bounce border border-sky-200 dark:border-sky-800"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Fullscreen IFP Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Layar Penuh IFP"
            className="touch-target-lg min-h-[52px] min-w-[52px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center transition-all btn-bounce border border-slate-200 dark:border-slate-700"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

        </div>
      </div>
    </header>
  );
};
