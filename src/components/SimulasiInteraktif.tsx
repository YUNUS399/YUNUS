import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap, Compass } from 'lucide-react';
import { SimulationParams } from '../types';
import { soundFx } from '../utils/sound';

interface SimulasiInteraktifProps {
  initialParams: SimulationParams;
}

export const SimulasiInteraktif: React.FC<SimulasiInteraktifProps> = ({ initialParams }) => {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [isRunning, setIsRunning] = useState(true);
  const [activePreset, setActivePreset] = useState<'earth' | 'moon' | 'jupiter' | 'custom'>('earth');
  
  // Interactive Physics State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef<number>((initialParams.angle * Math.PI) / 180);
  const angularVelRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Calculated period T = 2 * PI * sqrt(L / g)
  const calculatedPeriod = params.gravity > 0 
    ? (2 * Math.PI * Math.sqrt(params.length / params.gravity)).toFixed(2) 
    : '∞';
  const calculatedFrequency = params.gravity > 0 
    ? (1 / parseFloat(calculatedPeriod)).toFixed(2) 
    : '0';

  useEffect(() => {
    angleRef.current = (params.angle * Math.PI) / 180;
    angularVelRef.current = 0;
  }, [params.length, params.gravity]);

  // Main Physics Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const originX = canvas.width / 2;
      const originY = 40;
      const pixelLength = params.length * 90; // scale factor

      // Update Physics if running and not dragging
      if (isRunning && !isDraggingRef.current) {
        const dt = 0.04;
        const angularAcc = (-params.gravity / params.length) * Math.sin(angleRef.current);
        angularVelRef.current += angularAcc * dt;
        angleRef.current += angularVelRef.current * dt;

        // Apply Damping
        angularVelRef.current *= (1 - params.damping * 0.1);
      }

      const bobX = originX + pixelLength * Math.sin(angleRef.current);
      const bobY = originY + pixelLength * Math.cos(angleRef.current);

      // Draw Grid / Angle Reference Lines
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, originY + pixelLength + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Mounting Stand Ceiling
      ctx.fillStyle = '#475569';
      ctx.fillRect(originX - 70, originY - 12, 140, 12);
      ctx.fillStyle = '#64748b';
      for (let i = -60; i <= 60; i += 15) {
        ctx.beginPath();
        ctx.moveTo(originX + i, originY - 12);
        ctx.lineTo(originX + i - 8, originY - 22);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Rope
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = isDraggingRef.current ? '#38bdf8' : '#e2e8f0';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Pendulum Bob (Size proportional to mass)
      const radius = 18 + params.mass * 6;
      
      // Outer Glow
      ctx.beginPath();
      ctx.arc(bobX, bobY, radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = isDraggingRef.current ? 'rgba(56, 189, 248, 0.3)' : 'rgba(2, 132, 199, 0.2)';
      ctx.fill();

      // Bob Circle
      ctx.beginPath();
      ctx.arc(bobX, bobY, radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, radius);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(1, '#0284c7');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Live Angle Text near bob
      const currAngleDeg = Math.round((angleRef.current * 180) / Math.PI);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText(`Sudut: ${currAngleDeg}°`, bobX + radius + 10, bobY + 5);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [params, isRunning]);

  // Touch & Pointer Drag Controls on Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const originX = canvas.width / 2;
    const originY = 40;

    const dx = x - originX;
    const dy = y - originY;

    if (dy > 0) {
      isDraggingRef.current = true;
      angleRef.current = Math.atan2(dx, dy);
      angularVelRef.current = 0;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const originX = canvas.width / 2;
    const originY = 40;

    const dx = x - originX;
    const dy = y - originY;

    if (dy > 0) {
      angleRef.current = Math.atan2(dx, dy);
      angularVelRef.current = 0;
    }
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  };

  const setPreset = (preset: 'earth' | 'moon' | 'jupiter') => {
    soundFx.playClick();
    setActivePreset(preset);
    let g = 9.8;
    if (preset === 'moon') g = 1.6;
    if (preset === 'jupiter') g = 24.8;

    setParams((prev) => ({ ...prev, gravity: g }));
  };

  const handleReset = () => {
    soundFx.playClick();
    angleRef.current = (params.angle * Math.PI) / 180;
    angularVelRef.current = 0;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="soft-card rounded-3xl p-6 sm:p-8">
        
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-800 dark:text-sky-300">
              Laboratorium Virtual IFP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              🔬 Simulasi Pendulum & Hukum Gravitasi
            </h2>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Preset Lingkungan:</span>
            <button
              onClick={() => setPreset('earth')}
              className={`touch-target-lg px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activePreset === 'earth'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              🌍 Bumi (9.8)
            </button>
            <button
              onClick={() => setPreset('moon')}
              className={`touch-target-lg px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activePreset === 'moon'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              🌙 Bulan (1.6)
            </button>
            <button
              onClick={() => setPreset('jupiter')}
              className={`touch-target-lg px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all ${
                activePreset === 'jupiter'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              🪐 Yupiter (24.8)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Canvas Display Stage */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 border-2 border-slate-800 shadow-2xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between text-slate-400 text-xs font-bold mb-3 px-2">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Compass className="w-4 h-4" /> Sentuh & Geser Beban Bandul Langsung di Layar
              </span>
              <span className="bg-slate-800 text-sky-300 px-2.5 py-1 rounded-full">
                Interactive Canvas
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={560}
              height={320}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-auto bg-slate-900 rounded-2xl cursor-grab active:cursor-grabbing touch-none border border-slate-800"
            />

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-5 w-full justify-center">
              <button
                onClick={() => { soundFx.playClick(); setIsRunning(!isRunning); }}
                className={`touch-target-lg min-h-[56px] px-6 rounded-2xl font-extrabold text-base flex items-center gap-2.5 shadow-lg transition-all btn-bounce ${
                  isRunning ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Pause Simulasi
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Jalankan Simulasi
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="touch-target-lg min-h-[56px] px-5 rounded-2xl font-bold text-base bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 transition-all btn-bounce border border-slate-700"
              >
                <RotateCcw className="w-5 h-5" /> Reset Posisi
              </button>
            </div>
          </div>

          {/* Parameter Control Panel (Touch Friendly Sliders) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Readouts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800">
                <span className="text-xs font-black uppercase text-sky-800 dark:text-sky-300 flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Periode (T)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-sky-900 dark:text-sky-100 mt-1">
                  {calculatedPeriod} <span className="text-sm font-bold text-sky-700 dark:text-sky-400">detik</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                <span className="text-xs font-black uppercase text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                  <Zap className="w-4 h-4" /> Frekuensi (f)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-indigo-900 dark:text-indigo-100 mt-1">
                  {calculatedFrequency} <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Hz</span>
                </p>
              </div>
            </div>

            {/* Sliders Container */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5">
              
              {/* Length Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                    Panjang Tali (L):
                  </label>
                  <span className="px-3 py-1 bg-sky-600 text-white font-black text-sm rounded-lg">
                    {params.length.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={params.length}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setParams({ ...params, length: parseFloat(e.target.value) });
                  }}
                  className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600 touch-pan-x"
                />
              </div>

              {/* Gravity Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                    Percepatan Gravitasi (g):
                  </label>
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black text-sm rounded-lg">
                    {params.gravity.toFixed(1)} m/s²
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="25.0"
                  step="0.5"
                  value={params.gravity}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setParams({ ...params, gravity: parseFloat(e.target.value) });
                  }}
                  className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 touch-pan-x"
                />
              </div>

              {/* Mass Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-extrabold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                    Massa Bandul (m):
                  </label>
                  <span className="px-3 py-1 bg-emerald-600 text-white font-black text-sm rounded-lg">
                    {params.mass.toFixed(1)} kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={params.mass}
                  onChange={(e) => setParams({ ...params, mass: parseFloat(e.target.value) })}
                  className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 touch-pan-x"
                />
              </div>

            </div>

            {/* Note box */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium">
              💡 <strong>Tips Kelas:</strong> Amati bahwa mengubah <em>Massa Bandul</em> tidak mengubah nilai periode T! Hal ini membuktikan hukum ayunan matematis ideal.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
