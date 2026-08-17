import React from 'react';
import { BookOpen, FlaskConical, FileText, UserCheck } from 'lucide-react';
import { ActiveTab } from '../types';
import { soundFx } from '../utils/sound';

interface SidebarNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'pengantar' as ActiveTab,
      label: 'Pengantar Materi',
      iconEmoji: '📖',
      LucideIcon: BookOpen,
      desc: 'Konsep dasar & penjelasan',
    },
    {
      id: 'simulasi' as ActiveTab,
      label: 'Simulasi Interaktif',
      iconEmoji: '🔬',
      LucideIcon: FlaskConical,
      desc: 'Praktikum & eksperimen IFP',
    },
    {
      id: 'uji' as ActiveTab,
      label: 'Uji Pemahaman',
      iconEmoji: '📝',
      LucideIcon: FileText,
      desc: 'Kuis & latihan soal sentuh',
    },
    {
      id: 'profil' as ActiveTab,
      label: 'Profil Pembuat',
      iconEmoji: '👤',
      LucideIcon: UserCheck,
      desc: 'Info guru & kompetensi (KD)',
    },
  ];

  const handleSelect = (id: ActiveTab) => {
    soundFx.playClick();
    setActiveTab(id);
  };

  return (
    <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible shrink-0 sticky lg:top-[85px] z-20">
      <div className="hidden lg:block px-2 mb-2">
        <span className="text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
          Navigasi Modul IFP
        </span>
      </div>

      {menuItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.LucideIcon;

        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`touch-target-lg min-h-[64px] min-w-[220px] lg:min-w-0 w-full p-3.5 sm:p-4 rounded-2xl flex items-center gap-4 text-left transition-all btn-bounce border-2 ${
              isActive
                ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-600 dark:border-sky-500 text-sky-900 dark:text-sky-100 shadow-lg shadow-sky-500/10 scale-[1.01]'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 font-bold transition-transform ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md scale-110'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
              }`}
            >
              <span>{item.iconEmoji}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base lg:text-lg leading-tight truncate">
                  {item.label}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {item.desc}
              </p>
            </div>

            <div className="shrink-0 hidden lg:block">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-sky-600 dark:text-sky-400 translate-x-1' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                }`}
              />
            </div>
          </button>
        );
      })}
    </aside>
  );
};
