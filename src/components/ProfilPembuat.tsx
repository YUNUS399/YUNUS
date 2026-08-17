import React from 'react';
import { User, Award, BookOpen, Mail, School, FileCheck } from 'lucide-react';
import { TeacherProfile } from '../types';

interface ProfilPembuatProps {
  profile: TeacherProfile;
}

export const ProfilPembuat: React.FC<ProfilPembuatProps> = ({ profile }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="soft-card rounded-3xl p-6 sm:p-8 lg:p-10">
        
        {/* Title Header */}
        <div className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-black uppercase tracking-widest text-sky-800 dark:text-sky-300">
            Informasi Pengembang & Bahan Ajar
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            👤 Profil Pembuat & Lembar Informasi Guru
          </h2>
        </div>

        {/* Teacher Card Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-slate-50 dark:from-slate-800 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700/80 mb-8">
          
          {/* Avatar Emoji */}
          <div className="w-24 h-24 rounded-3xl bg-sky-600 text-white flex items-center justify-center text-5xl shadow-lg border-4 border-white dark:border-slate-700 shrink-0">
            <span>{profile.avatarEmoji || "👨‍🏫"}</span>
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {profile.name}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
              <span className="bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 px-3 py-1 rounded-full border border-sky-300 dark:border-sky-700">
                NIP: {profile.nip || "-"}
              </span>
              <span className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300">
                <School className="w-4 h-4" /> {profile.school}
              </span>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">
              {profile.bio}
            </p>
          </div>

        </div>

        {/* Competencies (CP / KD) Section */}
        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600" />
            Capaian Pembelajaran (CP) / Kompetensi Dasar (KD)
          </h4>
          <div className="space-y-3">
            {profile.competencies && profile.competencies.length > 0 ? (
              profile.competencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                >
                  <FileCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {comp}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Belum ada daftar kompetensi.</p>
            )}
          </div>
        </div>

        {/* Teaching Notes for Educators */}
        {profile.teachingNotes && (
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-l-8 border-amber-500 text-slate-800 dark:text-slate-200 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-200 text-base">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Catatan & Panduan Pengajaran Guru:
            </div>
            <p className="text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line">
              {profile.teachingNotes}
            </p>
          </div>
        )}

        {/* Contact Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-500 font-semibold gap-2">
          <span className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-sky-600" /> Kontak Guru: {profile.email || "email@sekolah.sch.id"}
          </span>
          <span>Mata Pelajaran: {profile.subject} ({profile.gradeLevel})</span>
        </div>

      </div>
    </div>
  );
};
