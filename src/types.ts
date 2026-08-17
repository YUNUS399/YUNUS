export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category?: string;
}

export interface LessonSection {
  id: string;
  title: string;
  icon: string; // Emoji or Lucide icon key
  summary: string;
  contentMarkdown: string;
  keyPoints: string[];
  interactiveDiagramType?: 'pendulum' | 'orbit' | 'circuit' | 'general';
}

export interface SimulationParams {
  mass: number;        // kg or relative unit
  length: number;      // meters or length
  gravity: number;     // m/s^2
  damping: number;     // air resistance
  angle: number;       // starting angle in deg
}

export interface TeacherProfile {
  name: string;
  nip: string;
  school: string;
  subject: string;
  gradeLevel: string;
  bio: string;
  email: string;
  avatarEmoji: string;
  competencies: string[]; // KD / CP
  teachingNotes: string;
}

export interface LessonData {
  subjectTitle: string;
  topicTitle: string;
  classLevel: string;
  schoolName: string;
  schoolLogoEmoji: string;
  helpGuideText: string;
  sections: LessonSection[];
  quizQuestions: QuizQuestion[];
  simulationParams: SimulationParams;
  teacherProfile: TeacherProfile;
}

export type ActiveTab = 'pengantar' | 'simulasi' | 'uji' | 'profil' | 'papan_tulis' | 'editor';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';
