import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Trash2, Download, PenTool } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface PapanTulisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PapanTulisModal: React.FC<PapanTulisModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokeColor, setStrokeColor] = useState('#0284c7');
  const [strokeWidth, setStrokeWidth] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(initCanvas, 100);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to fill modal container
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = 480;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = isEraser ? '#ffffff' : strokeColor;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvasImage = () => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Coretan_IFP_${Date.now()}.png`;
    a.click();
  };

  if (!isOpen) return null;

  const colors = ['#0284c7', '#dc2626', '#16a34a', '#eab308', '#9333ea', '#000000'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-5xl border-2 border-sky-500 shadow-2xl p-6 overflow-hidden flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-2xl font-bold">
              🖊️
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Papan Coretan Interaktif IFP
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Gunakan jari atau stylus untuk mencoret di atas layar saat menjelaskan materi
              </p>
            </div>
          </div>

          <button
            onClick={() => { soundFx.playClick(); onClose(); }}
            className="touch-target-lg min-h-[48px] min-w-[48px] rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center btn-bounce"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
          
          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1">Warna Pena:</span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => { soundFx.playClick(); setIsEraser(false); setStrokeColor(c); }}
                style={{ backgroundColor: c }}
                className={`w-9 h-9 rounded-full border-2 transition-transform btn-bounce ${
                  !isEraser && strokeColor === c ? 'scale-125 border-white ring-2 ring-sky-500' : 'border-transparent opacity-80'
                }`}
              />
            ))}
          </div>

          {/* Line Thickness */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Ketebalan:</span>
            {[4, 8, 14].map((w) => (
              <button
                key={w}
                onClick={() => { soundFx.playClick(); setStrokeWidth(w); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                  strokeWidth === w ? 'bg-sky-600 text-white border-sky-700' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { soundFx.playClick(); setIsEraser(!isEraser); }}
              className={`touch-target-lg px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                isEraser ? 'bg-rose-600 text-white border-rose-700' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Eraser className="w-4 h-4" /> Penghapus
            </button>

            <button
              onClick={clearCanvas}
              className="touch-target-lg px-3.5 py-2 rounded-xl text-xs font-extrabold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border flex items-center gap-1.5 hover:bg-slate-200"
            >
              <Trash2 className="w-4 h-4 text-rose-500" /> Hapus Layar
            </button>

            <button
              onClick={downloadCanvasImage}
              className="touch-target-lg px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" /> Simpan Gambar
            </button>
          </div>

        </div>

        {/* Canvas Area */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-white">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-[460px] cursor-crosshair touch-none"
          />
        </div>

      </div>
    </div>
  );
};
