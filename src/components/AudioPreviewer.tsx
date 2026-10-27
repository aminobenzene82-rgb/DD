import React, { useState, useRef } from 'react';
import { Volume2, Play, Square, Sparkles } from 'lucide-react';

interface SoundPreset {
  id: string;
  name: string;
  type: 'whoosh' | 'impact' | 'subdrop' | 'glitch' | 'riser';
  duration: string;
}

const SOUNDS: SoundPreset[] = [
  { id: '1', name: 'Cinematic Fast Whoosh', type: 'whoosh', duration: '0.8s' },
  { id: '2', name: 'Deep Cinematic Sub Boom', type: 'subdrop', duration: '1.4s' },
  { id: '3', name: 'Cyberpunk Glitch Hit', type: 'glitch', duration: '0.6s' },
  { id: '4', name: 'Tension Tension Riser', type: 'riser', duration: '2.0s' },
  { id: '5', name: 'Heavy Metal Punch Impact', type: 'impact', duration: '0.9s' }
];

export const AudioPreviewer: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthesizedSound = (sound: SoundPreset) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setPlayingId(sound.id);

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (sound.type === 'whoosh') {
        // Filtered noise or frequency sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.7);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
        setTimeout(() => setPlayingId(null), 700);

      } else if (sound.type === 'subdrop') {
        // Deep sub bass drop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
        setTimeout(() => setPlayingId(null), 1300);

      } else if (sound.type === 'glitch') {
        // High frequency modulated glitch
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.setValueAtTime(320, now + 0.1);
        osc.frequency.setValueAtTime(1400, now + 0.2);
        osc.frequency.setValueAtTime(180, now + 0.35);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        setTimeout(() => setPlayingId(null), 500);

      } else if (sound.type === 'riser') {
        // Pitch upward sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 1.8);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 1.6);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
        setTimeout(() => setPlayingId(null), 1900);

      } else {
        // Heavy impact
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
        setTimeout(() => setPlayingId(null), 700);
      }
    } catch {
      setPlayingId(null);
    }
  };

  return (
    <div className="bg-[#1A1A1A] text-white p-6 rounded-3xl border-3.5 border-[#1A1A1A] shadow-[6px_6px_0px_#FFD400]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Volume2 className="text-[#FFD400]" size={22} />
          <h3 className="font-display text-lg tracking-wide text-[#FFD400]">
            SOUND DESIGN PREVIEWER
          </h3>
        </div>
        <span className="text-[11px] font-black uppercase tracking-wider bg-[#FF4D8D] text-white px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
          <Sparkles size={12} />
          24-BIT WAV
        </span>
      </div>

      <p className="text-xs font-bold text-gray-300 mb-4 leading-relaxed">
        Test our custom acoustic transients directly in your browser. All 1,000+ files are master-engineered for cinematic punch.
      </p>

      <div className="space-y-2.5">
        {SOUNDS.map((sound) => {
          const isPlaying = playingId === sound.id;
          return (
            <div
              key={sound.id}
              onClick={() => playSynthesizedSound(sound)}
              className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                isPlaying
                  ? 'bg-[#6C2BD9] border-[#FFD400] translate-x-1 shadow-[3px_3px_0px_#FFD400]'
                  : 'bg-[#262626] border-white/10 hover:border-[#FFD400]/70 hover:bg-[#333333]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-display transition-transform ${
                    isPlaying ? 'bg-[#FFD400] text-[#1A1A1A] scale-110' : 'bg-white/10 text-white'
                  }`}
                  aria-label={`Play ${sound.name}`}
                >
                  {isPlaying ? <Square size={14} className="fill-[#1A1A1A]" /> : <Play size={14} className="fill-white ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-black text-white">{sound.name}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sound.type}</div>
                </div>
              </div>

              {/* Animated Waveform Visualizer */}
              <div className="flex items-center gap-1">
                {[4, 8, 14, 9, 16, 11, 6].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isPlaying ? 'bg-[#FFD400] animate-pulse' : 'bg-white/20'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(6, Math.random() * 20)}px` : `${h}px`
                    }}
                  />
                ))}
                <span className="text-[11px] font-bold text-gray-400 ml-2">{sound.duration}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
