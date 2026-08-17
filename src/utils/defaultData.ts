import { LessonData } from '../types';

export const initialLessonData: LessonData = {
  subjectTitle: "Fisika & Sains Terapan",
  topicTitle: "Gerak Harmonis Sederhana & Pendulum",
  classLevel: "Kelas X / XI - SMA & SMK",
  schoolName: "SMA Negeri 1 Indonesia",
  schoolLogoEmoji: "🏫",
  helpGuideText: "Petunjuk Penggunaan Layar Sentuh IFP:\n1. Tekan tombol menu di sebelah kiri untuk berpindah modul.\n2. Di menu Simulasi Interaktif, geser slider ukuran besar atau sentuh beban untuk mengamati ayunan pendulum.\n3. Gunakan Papan Tulis IFP untuk mencoret/menulis langsung di atas layar saat menerangkan materi.\n4. Kuis dapat dikerjakan siswa secara langsung dengan menekan pilihan jawaban pada layar.",
  
  sections: [
    {
      id: "sec-1",
      title: "1. Konsep Dasar Pendulum",
      icon: "⏱️",
      summary: "Pendulum atau ayunan matematis adalah sistem fisika yang bergerak bolak-balik secara teratur melalui titik setimbangnya.",
      contentMarkdown: "Pendulum (bandul) terdiri dari sebuah beban bernyawa massa (m) yang digantungkan pada seutas tali ringan sepanjang (L). Ketika bandul disimpangkan dengan sudut kecil dari posisi tegak lurus lalu dilepaskan, gaya gravitasi akan menarik bandul kembali ke titik terendah (posisi setimbang). Gerakan periodik ini dinamakan **Gerak Harmonis Sederhana (GHS)**.",
      keyPoints: [
        "Periode (T): Waktu yang dibutuhkan bandul untuk melakukan 1 kali ayunan penuh (bolak-balik).",
        "Frekuensi (f): Jumlah ayunan yang terjadi dalam satu detik (Hertz/Hz).",
        "Titik Setimbang: Posisi tengah di mana gaya total yang bekerja pada bandul sama dengan nol."
      ],
      interactiveDiagramType: "pendulum"
    },
    {
      id: "sec-2",
      title: "2. Rumus & Faktor yang Mempengaruhi",
      icon: "📐",
      summary: "Periode ayunan pendulum dipengaruhi oleh panjang tali (L) dan percepatan gravitasi (g), TETAPI tidak dipengaruhi oleh massa bandul!",
      contentMarkdown: "Persamaan matematik periode pendulum matematis ideal adalah:\n\n**T = 2π × √(L / g)**\n\nKeterangan:\n- **T** = Periode ayunan (detik)\n- **L** = Panjang tali bandul (meter)\n- **g** = Percepatan gravitasi (m/s²)\n\n*Catatan Penting untuk Pembelajaran:* Makin panjang tali (L), makin lambat ayunannya (periode makin besar). Sebaliknya, makin besar gravitasi (g), ayunan akan semakin cepat.",
      keyPoints: [
        "Massa benda TIDAK mempengaruhi periode ayunan pada sudut simpangan kecil.",
        "Panjang tali sebanding dengan kuadrat periode (T² ~ L).",
        "Variasi gravitasi di Bulan (1.6 m/s²) membuat ayunan pendulum jauh lebih lambat daripada di Bumi (9.8 m/s²)."
      ],
      interactiveDiagramType: "orbit"
    },
    {
      id: "sec-3",
      title: "3. Penerapan dalam Kehidupan Nyata",
      icon: "🕰️",
      summary: "Sistem pendulum dimanfaatkan dalam jam dinding kuno, peredam gempa pada pencakar langit, hingga pengukur massa bumi.",
      contentMarkdown: "Teknologi pendulum telah digunakan berabad-abad:\n1. **Jam Bandul (Pendulum Clock)**: Ditemukan oleh Christiaan Huygens pada tahun 1656 untuk mengukur waktu secara presisi.\n2. **Tuned Mass Damper (Peredam Gempa)**: Bandul raksasa di puncak gedung tinggi (seperti Taipei 101) yang bergerak berlawanan arah dari getaran gempa/angin untuk menjaga kestabilan gedung.\n3. **Pendulum Foucault**: Bukti empiris bahwa Bumi berotasi pada porosnya.",
      keyPoints: [
        "Peredam gempa pendulum menetralkan resonansi gedung saat terjadi guncangan.",
        "Pendulum digunakan para ilmuwan untuk menghitung presisi nilai gravitasi lokal."
      ],
      interactiveDiagramType: "circuit"
    }
  ],

  quizQuestions: [
    {
      id: "q-1",
      question: "Faktor manakah yang mempengaruhi nilai periode (T) ayunan pendulum sederhana pada sudut simpangan kecil?",
      options: [
        "Massa beban bandul",
        "Panjang tali dan percepatan gravitasi",
        "Warna beban dan bahan tali",
        "Luas permukaan beban"
      ],
      correctAnswerIndex: 1,
      explanation: "Sesuai rumus T = 2π√(L/g), periode ayunan hanya dipengaruhi oleh panjang tali (L) dan percepatan gravitasi (g). Masa beban tidak berpengaruh.",
      category: "Konsep Dasar"
    },
    {
      id: "q-2",
      question: "Jika panjang tali pendulum diperpanjang menjadi 4 kali lipat dari panjang semula, apa yang terjadi pada periode ayunannya?",
      options: [
        "Periode menjadi 4 kali lebih cepat",
        "Periode menjadi 2 kali lebih besar (lambat)",
        "Periode tetap sama",
        "Periode menjadi setengahnya"
      ],
      correctAnswerIndex: 1,
      explanation: "Karena T sebanding dengan akar panjang tali (√4 = 2), maka periode ayunan menjadi 2 kali lebih besar dari semula.",
      category: "Perhitungan"
    },
    {
      id: "q-3",
      question: "Bagaimana ayunan pendulum yang sama jika dibawa dan diayunkan di permukaan Bulan dibandingkan dengan di Bumi?",
      options: [
        "Ayunan di Bulan bergerak lebih cepat karena tidak ada udara",
        "Ayunan di Bulan bergerak lebih lambat karena gravitasi Bulan lebih kecil",
        "Ayunan berhenti seketika",
        "Periode di Bulan dan di Bumi persis sama"
      ],
      correctAnswerIndex: 1,
      explanation: "Gravitasi Bulan hanya ~1,6 m/s² (1/6 Bumi). Karena g lebih kecil di penyebut rumus T = 2π√(L/g), maka T bertambah besar yang artinya ayunan bergerak lebih lambat.",
      category: "Aplikasi Fisika"
    },
    {
      id: "q-4",
      question: "Apa nama teknologi bandul raksasa yang dipasang di gedung pencakar langit untuk meredam goyangan gempa bumi?",
      options: [
        "Gyroscopic Stabilizer",
        "Tuned Mass Damper (TMD)",
        "Seismograf Aktif",
        "Hydraulic Shock Absorber"
      ],
      correctAnswerIndex: 1,
      explanation: "Tuned Mass Damper (TMD) adalah pendam gempa berbasis massa terikat pendulum yang mengayun berlawanan dari goyangan gedung.",
      category: "Penerapan Teknologi"
    },
    {
      id: "q-5",
      question: "Satuan Internasional (SI) untuk mengukur Frekuensi ayunan adalah...",
      options: [
        "Joule (J)",
        "Hertz (Hz)",
        "Newton (N)",
        "Watt (W)"
      ],
      correctAnswerIndex: 1,
      explanation: "Frekuensi diukur dalam satuan Hertz (Hz), menyatakan jumlah getaran/ayunan per detik.",
      category: "Satuan Fisika"
    }
  ],

  simulationParams: {
    mass: 1.5,
    length: 1.8,
    gravity: 9.8,
    damping: 0.05,
    angle: 30
  },

  teacherProfile: {
    name: "Dr. Budi Santoso, M.Pd.",
    nip: "19850412 201001 1 012",
    school: "SMA Negeri 1 Indonesia",
    subject: "Fisika / Sains IPA",
    gradeLevel: "SMA / SMK Kelas X & XI",
    bio: "Guru Penggerak & Pengembang Media Pembelajaran Digital Interaktif berbasis IFP. Berfokus pada pembelajaran kontekstual berpusat pada siswa.",
    email: "budi.santoso@sekolah.sch.id",
    avatarEmoji: "👨‍🏫",
    competencies: [
      "CP Fisika - Menganalisis gerak harmonis sederhana pada ayunan bandul dan getaran pegas.",
      "KD 3.11 - Menganalisis hubungan antara gaya dan getaran dalam kehidupan sehari-hari.",
      "4.11 - Melakukan percobaan getaran harmonis pada ayunan sederhana berikut presentasi hasil percobaan."
    ],
    teachingNotes: "Catatan untuk Pengajar:\nGunakan fitur 'Simulasi Interaktif' saat demonstrasi di depan kelas. Ajak siswa maju ke depan layar sentuh IFP untuk menggeser panjang tali dan gravitasi, lalu amati perbedaan frekuensi ayunannya."
  }
};
