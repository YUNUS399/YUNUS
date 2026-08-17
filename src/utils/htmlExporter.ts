import { LessonData } from '../types';

/**
 * Menerbitkan seluruh materi, kuis, dan simulasi menjadi 1 file HTML mandiri (Single-File HTML5/CSS/JS)
 * yang 100% offline, ramah sentuhan IFP, tanpa ketergantungan internet.
 */
export function exportToStandaloneHtml(data: LessonData) {
  const jsonEncodedData = JSON.stringify(data).replace(/</g, '\\u003c');

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.subjectTitle)} - ${escapeHtml(data.topicTitle)}</title>
  <style>
    :root {
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --bg-main: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #475569;
      --border: #cbd5e1;
      --success: #16a34a;
      --danger: #dc2626;
      --radius: 16px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Touch Friendly Standard IFP */
    button, input, select {
      font-family: inherit;
    }

    /* Header */
    header {
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .school-logo {
      font-size: 38px;
      background: #e0f2fe;
      padding: 8px 14px;
      border-radius: 12px;
    }

    .header-titles h1 {
      font-size: 24px;
      color: #0369a1;
      font-weight: 800;
    }

    .header-titles p {
      font-size: 14px;
      color: #64748b;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-touch {
      min-height: 56px;
      min-width: 56px;
      padding: 12px 20px;
      border-radius: 12px;
      border: none;
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      transition: transform 0.1s ease, background-color 0.2s ease;
    }

    .btn-touch:active {
      transform: scale(0.94);
    }

    .btn-primary {
      background: var(--primary);
      color: #ffffff;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
    }

    /* Main Layout */
    .app-container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Sidebar Nav */
    aside {
      width: 280px;
      background: #ffffff;
      border-right: 2px solid #e2e8f0;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .nav-btn {
      min-height: 64px;
      width: 100%;
      border-radius: 14px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #334155;
      font-size: 17px;
      font-weight: 700;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
    }

    .nav-btn.active {
      background: #e0f2fe;
      border-color: #0284c7;
      color: #0369a1;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
    }

    .nav-icon {
      font-size: 26px;
    }

    /* Content Area */
    main {
      flex: 1;
      padding: 28px;
      overflow-y: auto;
      background: #f8fafc;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s ease-in-out;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards */
    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid #e2e8f0;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }

    .card-title {
      font-size: 22px;
      color: #0369a1;
      font-weight: 800;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Simulation Canvas */
    .sim-canvas-container {
      background: #0f172a;
      border-radius: var(--radius);
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
    }

    canvas {
      background: #1e293b;
      border-radius: 12px;
      max-width: 100%;
      height: 320px;
      touch-action: none;
    }

    /* Quiz Module */
    .quiz-option {
      min-height: 64px;
      width: 100%;
      padding: 16px 20px;
      margin-bottom: 12px;
      border-radius: 12px;
      border: 2px solid #cbd5e1;
      background: #ffffff;
      font-size: 18px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .quiz-option.correct {
      background: #dcfce7;
      border-color: #16a34a;
      color: #14532d;
    }

    .quiz-option.wrong {
      background: #fee2e2;
      border-color: #dc2626;
      color: #7f1d1d;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-overlay.open {
      display: flex;
    }

    .modal-body {
      background: white;
      border-radius: 20px;
      max-width: 700px;
      width: 100%;
      padding: 32px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    /* Canvas Whiteboard */
    #wb-canvas {
      background: rgba(255, 255, 255, 0.95);
      border: 2px dashed #0284c7;
      border-radius: 12px;
      width: 100%;
      height: 400px;
      cursor: crosshair;
    }

    @media (max-width: 900px) {
      .app-container { flex-direction: column; }
      aside { width: 100%; flex-direction: row; overflow-x: auto; }
      .nav-btn { min-width: 180px; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header>
    <div class="brand">
      <div class="school-logo">${escapeHtml(data.schoolLogoEmoji)}</div>
      <div class="header-titles">
        <h1 id="hdr-title">${escapeHtml(data.subjectTitle)}: ${escapeHtml(data.topicTitle)}</h1>
        <p id="hdr-sub">${escapeHtml(data.classLevel)} | ${escapeHtml(data.schoolName)}</p>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn-touch" onclick="toggleHelpModal()">❓ Petunjuk</button>
      <button class="btn-touch btn-primary" onclick="toggleWhiteboard()">🖊️ Papan Coretan</button>
    </div>
  </header>

  <div class="app-container">
    <!-- SIDEBAR NAV -->
    <aside>
      <button class="nav-btn active" id="btn-nav-pengantar" onclick="switchTab('pengantar')">
        <span class="nav-icon">📖</span> Pengantar Materi
      </button>
      <button class="nav-btn" id="btn-nav-simulasi" onclick="switchTab('simulasi')">
        <span class="nav-icon">🔬</span> Simulasi Interaktif
      </button>
      <button class="nav-btn" id="btn-nav-uji" onclick="switchTab('uji')">
        <span class="nav-icon">📝</span> Uji Pemahaman
      </button>
      <button class="nav-btn" id="btn-nav-profil" onclick="switchTab('profil')">
        <span class="nav-icon">👤</span> Profil Pembuat
      </button>
    </aside>

    <!-- MAIN WORKSPACE -->
    <main>
      <!-- TAB 1: PENGANTAR MATERI -->
      <section id="tab-pengantar" class="tab-content active">
        ${data.sections.map((sec, idx) => `
          <div class="card">
            <div class="card-title">${sec.icon} ${escapeHtml(sec.title)}</div>
            <p style="font-size: 17px; line-height: 1.6; color: #334155; margin-bottom: 16px;">
              ${escapeHtml(sec.summary)}
            </p>
            <div style="background: #f1f5f9; padding: 16px; border-radius: 12px; border-left: 4px solid #0284c7;">
              <p style="font-size: 16px; line-height: 1.6; color: #0f172a;">${escapeHtml(sec.contentMarkdown)}</p>
            </div>
            <div style="margin-top: 16px;">
              <strong style="color: #0369a1;">Poin Kunci Pembelajaran:</strong>
              <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.6;">
                ${sec.keyPoints.map(kp => `<li>${escapeHtml(kp)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </section>

      <!-- TAB 2: SIMULASI INTERAKTIF -->
      <section id="tab-simulasi" class="tab-content">
        <div class="card">
          <div class="card-title">🔬 Simulasi Pendulum & Gravitasi IFP</div>
          <p style="color: #475569; margin-bottom: 20px;">
            Geser kontrol di bawah ini dengan sentuhan jari untuk mengubah panjang tali dan percepatan gravitasi, lalu amati perubahan ayunan bandul secara teratur.
          </p>
          <div class="sim-canvas-container">
            <canvas id="simCanvas" width="600" height="320"></canvas>
            <div style="display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; justify-content: center; width: 100%;">
              <button class="btn-touch btn-primary" onclick="toggleSimPlay()" id="btnSimPlay">⏸️ Pause</button>
              <button class="btn-touch" onclick="resetSim()">🔄 Reset Bandul</button>
              <button class="btn-touch" onclick="setPreset('earth')">🌍 Bumi (9.8 m/s²)</button>
              <button class="btn-touch" onclick="setPreset('moon')">🌙 Bulan (1.6 m/s²)</button>
              <button class="btn-touch" onclick="setPreset('jupiter')">🪐 Yupiter (24.8 m/s²)</button>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 24px;">
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1;">
              <label style="font-weight: 700; color: #0f172a; display: block; margin-bottom: 8px;">Panjang Tali (L): <span id="valLength">1.8</span> m</label>
              <input type="range" id="inputLength" min="0.5" max="3.0" step="0.1" value="1.8" style="width: 100%; height: 20px;" oninput="updateSimParams()">
            </div>
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1;">
              <label style="font-weight: 700; color: #0f172a; display: block; margin-bottom: 8px;">Gravitasi (g): <span id="valGravity">9.8</span> m/s²</label>
              <input type="range" id="inputGravity" min="1.0" max="25.0" step="0.5" value="9.8" style="width: 100%; height: 20px;" oninput="updateSimParams()">
            </div>
          </div>
        </div>
      </section>

      <!-- TAB 3: UJI PEMAHAMAN -->
      <section id="tab-uji" class="tab-content">
        <div class="card">
          <div class="card-title">📝 Kuis Interaktif Pemahaman Materi</div>
          <div id="quiz-box">
            <!-- Dynamic quiz content populated by JS -->
          </div>
        </div>
      </section>

      <!-- TAB 4: PROFIL PEMBUAT -->
      <section id="tab-profil" class="tab-content">
        <div class="card">
          <div style="display: flex; gap: 24px; align-items: center; margin-bottom: 24px; flex-wrap: wrap;">
            <div style="font-size: 72px; background: #e0f2fe; padding: 20px; border-radius: 20px;">${escapeHtml(data.teacherProfile.avatarEmoji)}</div>
            <div>
              <h2 style="font-size: 26px; font-weight: 800; color: #0369a1;">${escapeHtml(data.teacherProfile.name)}</h2>
              <p style="font-size: 16px; color: #475569; font-weight: 600;">NIP: ${escapeHtml(data.teacherProfile.nip)}</p>
              <p style="font-size: 16px; color: #0284c7; font-weight: 700; margin-top: 4px;">${escapeHtml(data.teacherProfile.school)}</p>
            </div>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #334155; margin-bottom: 20px;">${escapeHtml(data.teacherProfile.bio)}</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #0284c7; margin-bottom: 20px;">
            <strong style="color: #0369a1; font-size: 18px;">Capaian Pembelajaran (CP / KD):</strong>
            <ul style="margin-top: 10px; padding-left: 20px; line-height: 1.6;">
              ${data.teacherProfile.competencies.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- MODAL HELP -->
  <div class="modal-overlay" id="helpModal">
    <div class="modal-body">
      <h2 style="font-size: 24px; font-weight: 800; color: #0369a1; margin-bottom: 16px;">❓ Petunjuk Penggunaan IFP</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #334155; white-space: pre-line; margin-bottom: 24px;">
        ${escapeHtml(data.helpGuideText)}
      </p>
      <button class="btn-touch btn-primary" style="width: 100%;" onclick="toggleHelpModal()">Tutup Petunjuk</button>
    </div>
  </div>

  <!-- MODAL WHITEBOARD -->
  <div class="modal-overlay" id="wbModal">
    <div class="modal-body" style="max-width: 900px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 22px; font-weight: 800; color: #0369a1;">🖊️ Papan Coretan IFP</h2>
        <div style="display: flex; gap: 8px;">
          <button class="btn-touch" style="min-height: 44px;" onclick="clearWb()">🧹 Hapus Semua</button>
          <button class="btn-touch btn-primary" style="min-height: 44px;" onclick="toggleWhiteboard()">❌ Tutup</button>
        </div>
      </div>
      <canvas id="wb-canvas" width="800" height="400"></canvas>
    </div>
  </div>

  <!-- EMBEDDED JS LOGIC -->
  <script>
    const LESSON_DATA = ${jsonEncodedData};

    let currentTab = 'pengantar';
    let quizIndex = 0;
    let quizScore = 0;
    let userAnswers = {};

    // Simulation State
    let simLength = LESSON_DATA.simulationParams.length;
    let simGravity = LESSON_DATA.simulationParams.gravity;
    let simAngle = (LESSON_DATA.simulationParams.angle * Math.PI) / 180;
    let simAngularVel = 0;
    let simIsRunning = true;

    // Audio synth
    function playBeep(type) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'correct') {
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'wrong') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } else {
          osc.frequency.setValueAtTime(500, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      } catch(e){}
    }

    // Tab Switching
    function switchTab(tabId) {
      playBeep('click');
      currentTab = tabId;
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

      document.getElementById('tab-' + tabId).classList.add('active');
      document.getElementById('btn-nav-' + tabId).classList.add('active');

      if (tabId === 'simulasi') {
        initSimCanvas();
      }
    }

    // Modal Toggles
    function toggleHelpModal() {
      playBeep('click');
      const m = document.getElementById('helpModal');
      m.classList.toggle('open');
    }

    function toggleWhiteboard() {
      playBeep('click');
      const m = document.getElementById('wbModal');
      m.classList.toggle('open');
      if (m.classList.contains('open')) {
        setTimeout(initWbCanvas, 100);
      }
    }

    // Quiz Renderer
    function renderQuiz() {
      const box = document.getElementById('quiz-box');
      if (quizIndex >= LESSON_DATA.quizQuestions.length) {
        box.innerHTML = \`
          <div style="text-align: center; padding: 32px 16px;">
            <div style="font-size: 64px; margin-bottom: 12px;">🎉</div>
            <h2 style="font-size: 28px; font-weight: 800; color: #0284c7; margin-bottom: 12px;">Kuis Selesai!</h2>
            <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 24px;">
              Skor Anda: \${quizScore} / \${LESSON_DATA.quizQuestions.length * 20}
            </p>
            <button class="btn-touch btn-primary" onclick="restartQuiz()">🔄 Ulangi Kuis</button>
          </div>
        \`;
        return;
      }

      const q = LESSON_DATA.quizQuestions[quizIndex];
      const answered = userAnswers[q.id] !== undefined;

      let html = \`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-weight: 700; color: #0369a1; font-size: 16px;">Soal \${quizIndex + 1} dari \${LESSON_DATA.quizQuestions.length}</span>
          <span style="background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 700;">\${q.category || 'Umum'}</span>
        </div>
        <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 20px; line-height: 1.5;">\${q.question}</h3>
        <div>
      \`;

      q.options.forEach((opt, idx) => {
        let cls = 'quiz-option';
        if (answered) {
          if (idx === q.correctAnswerIndex) cls += ' correct';
          else if (idx === userAnswers[q.id]) cls += ' wrong';
        }
        html += \`
          <button class="\${cls}" onclick="selectAnswer(\${idx})" \${answered ? 'disabled' : ''}>
            <span style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%; font-weight: 800;">
              \${String.fromCharCode(65 + idx)}
            </span>
            <span>\${opt}</span>
          </button>
        \`;
      });

      if (answered) {
        html += \`
          <div style="background: #e0f2fe; padding: 16px; border-radius: 12px; border-left: 4px solid #0284c7; margin-top: 20px;">
            <strong style="color: #0369a1;">Penjelasan:</strong>
            <p style="margin-top: 6px; color: #0f172a;">\${q.explanation}</p>
          </div>
          <button class="btn-touch btn-primary" style="margin-top: 20px; width: 100%;" onclick="nextQuestion()">Soal Berikutnya ➡️</button>
        \`;
      }

      html += '</div>';
      box.innerHTML = html;
    }

    function selectAnswer(idx) {
      const q = LESSON_DATA.quizQuestions[quizIndex];
      userAnswers[q.id] = idx;
      if (idx === q.correctAnswerIndex) {
        quizScore += 20;
        playBeep('correct');
      } else {
        playBeep('wrong');
      }
      renderQuiz();
    }

    function nextQuestion() {
      playBeep('click');
      quizIndex++;
      renderQuiz();
    }

    function restartQuiz() {
      playBeep('click');
      quizIndex = 0;
      quizScore = 0;
      userAnswers = {};
      renderQuiz();
    }

    // Simulation Engine
    function initSimCanvas() {
      const canvas = document.getElementById('simCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      function draw() {
        if (simIsRunning) {
          const dt = 0.05;
          const angularAcc = (-simGravity / simLength) * Math.sin(simAngle);
          simAngularVel += angularAcc * dt;
          simAngle += simAngularVel * dt;
          simAngularVel *= 0.995; // damping
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const originX = canvas.width / 2;
        const originY = 40;
        const pixelLen = simLength * 80;
        const bobX = originX + pixelLen * Math.sin(simAngle);
        const bobY = originY + pixelLen * Math.cos(simAngle);

        // Ceiling
        ctx.fillStyle = '#64748b';
        ctx.fillRect(originX - 60, originY - 10, 120, 10);

        // String
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, 24, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        requestAnimationFrame(draw);
      }

      draw();
    }

    function toggleSimPlay() {
      simIsRunning = !simIsRunning;
      document.getElementById('btnSimPlay').innerText = simIsRunning ? '⏸️ Pause' : '▶️ Play';
    }

    function resetSim() {
      simAngle = (LESSON_DATA.simulationParams.angle * Math.PI) / 180;
      simAngularVel = 0;
      simIsRunning = true;
      document.getElementById('btnSimPlay').innerText = '⏸️ Pause';
    }

    function setPreset(preset) {
      if (preset === 'earth') simGravity = 9.8;
      if (preset === 'moon') simGravity = 1.6;
      if (preset === 'jupiter') simGravity = 24.8;
      document.getElementById('inputGravity').value = simGravity;
      document.getElementById('valGravity').innerText = simGravity;
      resetSim();
    }

    function updateSimParams() {
      simLength = parseFloat(document.getElementById('inputLength').value);
      simGravity = parseFloat(document.getElementById('inputGravity').value);
      document.getElementById('valLength').innerText = simLength;
      document.getElementById('valGravity').innerText = simGravity;
    }

    // Whiteboard Canvas
    let wbCtx = null;
    let isDrawing = false;

    function initWbCanvas() {
      const cvs = document.getElementById('wb-canvas');
      if (!cvs) return;
      wbCtx = cvs.getContext('2d');
      wbCtx.lineWidth = 4;
      wbCtx.lineCap = 'round';
      wbCtx.strokeStyle = '#0284c7';

      cvs.onpointerdown = (e) => {
        isDrawing = true;
        wbCtx.beginPath();
        wbCtx.moveTo(e.offsetX, e.offsetY);
      };

      cvs.onpointermove = (e) => {
        if (!isDrawing) return;
        wbCtx.lineTo(e.offsetX, e.offsetY);
        wbCtx.stroke();
      };

      cvs.onpointerup = () => isDrawing = false;
    }

    function clearWb() {
      if (!wbCtx) return;
      const cvs = document.getElementById('wb-canvas');
      wbCtx.clearRect(0, 0, cvs.width, cvs.height);
    }

    // Init
    window.onload = function() {
      renderQuiz();
      initSimCanvas();
    };
  </script>
</body>
</html>`;

  // Create downloadable Blob
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bahan_Ajar_IFP_${data.subjectTitle.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
