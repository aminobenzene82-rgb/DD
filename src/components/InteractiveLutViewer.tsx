import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export const InteractiveLutViewer: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activePreset, setActivePreset] = useState<'teal-orange' | 'vintage-film' | 'moody-noir'>('teal-orange');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) handleMove(e.clientX);
  };

  const presets = [
    {
      id: 'teal-orange',
      name: 'Teal & Orange Cine',
      badge: 'BLOCKBUSTER',
      color: 'bg-[#FFD400]',
      rawGradient: 'from-zinc-500 via-stone-400 to-zinc-600',
      gradedGradient: 'from-amber-600 via-teal-700 to-cyan-900',
      gradedFilter: 'contrast-125 saturate-150 hue-rotate-15'
    },
    {
      id: 'vintage-film',
      name: '16mm Kodak Nostalgia',
      badge: 'RETRO GRAIN',
      color: 'bg-[#FF4D8D]',
      rawGradient: 'from-zinc-500 via-stone-400 to-zinc-600',
      gradedGradient: 'from-orange-700 via-amber-600 to-rose-900',
      gradedFilter: 'contrast-110 saturate-125 sepia-25'
    },
    {
      id: 'moody-noir',
      name: 'Cyberpunk Moody Neon',
      badge: 'HIGH IMPACT',
      color: 'bg-[#00E5FF]',
      rawGradient: 'from-zinc-600 via-neutral-500 to-slate-700',
      gradedGradient: 'from-purple-900 via-indigo-950 to-pink-800',
      gradedFilter: 'contrast-140 saturate-140'
    }
  ];

  const currentPreset = presets.find(p => p.id === activePreset) || presets[0];

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border-3.5 border-[#1A1A1A] shadow-[6px_6px_0px_#1A1A1A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFD400] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-black border-2 border-[#1A1A1A] mb-2 shadow-[2px_2px_0px_#1A1A1A]">
            <Sparkles size={14} />
            INTERACTIVE COMPARISON
          </div>
          <h3 className="font-display text-2xl text-[#1A1A1A]">
            LUT COLOR GRADE SLIDER
          </h3>
          <p className="text-xs font-bold text-[#1A1A1A]/70">
            Drag the handle to see Flat Camera RAW transformed by our .CUBE 3D LUT presets.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(p.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-display border-2 border-[#1A1A1A] transition-transform ${
                activePreset === p.id
                  ? `${p.color} text-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] -translate-y-0.5`
                  : 'bg-white text-[#1A1A1A] hover:bg-gray-100'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Canvas Frame */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative h-64 sm:h-80 md:h-96 rounded-2xl border-3 border-[#1A1A1A] overflow-hidden cursor-ew-resize select-none bg-neutral-900 shadow-inner"
      >
        {/* Graded Image Layer (Underneath Full Width) */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentPreset.gradedGradient} flex items-center justify-center p-6 ${currentPreset.gradedFilter}`}>
          <div className="text-center text-white drop-shadow-lg">
            <span className="font-display text-3xl sm:text-5xl tracking-widest text-[#FFD400] drop-shadow-[2px_2px_0px_#000]">
              CINEMATIC GRADE
            </span>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white/90 mt-2">
              Color Corrected • 10-Bit Dynamic Depth • Rich Shadows
            </p>
          </div>
          {/* Label Graded */}
          <div className="absolute top-4 right-4 bg-[#6C2BD9] text-[#FFD400] px-3 py-1 rounded-xl font-display text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
            AFTER (LUT APPLIED)
          </div>
        </div>

        {/* Raw Log Image Layer (Clipped to Slider Left) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className={`w-full h-full bg-gradient-to-tr ${currentPreset.rawGradient} flex items-center justify-center p-6 filter grayscale contrast-75 brightness-110`}
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          >
            <div className="text-center text-white/70">
              <span className="font-display text-3xl sm:text-5xl tracking-widest opacity-80">
                FLAT RAW LOG
              </span>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/60 mt-2">
                Unprocessed Sensor Feed • Washed Out
              </p>
            </div>
            {/* Label Raw */}
            <div className="absolute top-4 left-4 bg-white text-[#1A1A1A] px-3 py-1 rounded-xl font-display text-xs border-2 border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]">
              BEFORE (RAW LOG)
            </div>
          </div>
        </div>

        {/* Slider Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#FFD400] shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#FFD400] border-3 border-[#1A1A1A] flex items-center justify-center shadow-[3px_3px_0px_#1A1A1A]">
            <Sliders size={16} className="text-[#1A1A1A]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-black text-[#1A1A1A]/70 mt-3">
        <span>◀ RAW FOOTAGE</span>
        <span className="bg-[#FFF8EC] px-3 py-1 rounded-lg border border-[#1A1A1A]">
          DRAG OR CLICK ANYWHERE TO COMPARE
        </span>
        <span>COLOR GRADED ▶</span>
      </div>
    </div>
  );
};
