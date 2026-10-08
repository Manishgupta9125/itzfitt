import React from 'react';
import { Play, RotateCcw, Volume2, Sparkles, SlidersHorizontal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

export default function InteractivePlayground({
  currentTheme,
  onSelectTheme,
  themes,
  onResetScroll,
  onLaunchSprint,
  isAudioActive,
  onToggleAudio
}) {
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [currentTheme.trailColor, '#38bdf8', '#fbbf24', '#ffffff']
    });
    audioEngine.playRev();
  };

  return (
    <section id="sandbox" className="relative py-20 px-6 md:px-12 bg-[#090b0f] text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>INTERACTIVE SANDBOX</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              Kinetic Test Bench & Quick Controls
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onLaunchSprint();
                audioEngine.playRev();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              style={{
                backgroundColor: currentTheme.trailColor,
                color: '#0a0a0a',
                boxShadow: `0 10px 25px -5px ${currentTheme.trailColor}66`
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              LAUNCH 1/4 MILE SPRINT
            </button>

            <button
              onClick={onResetScroll}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET GRID
            </button>

            <button
              onClick={triggerConfetti}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              CELEBRATE FINISH
            </button>
          </div>
        </div>

        {/* Theme and Audio Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Palette Switcher */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white/80 mb-3">
              KINETIC NEON ACCENT SELECTION
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Switch the car's trailing neon particle glow, road reflections, and ambient illumination in real time:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-white bg-white/10 scale-105 shadow-xl'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/5'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: theme.trailColor }}
                  />
                  <span className="text-[11px] font-mono font-bold">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Synthesizer Details */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white/80">
                  SYNTHETIC AUDIO HARMONICS
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isAudioActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isAudioActive ? 'SYNTHESIZER ONLINE' : 'MUTED'}
                </span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed mb-4">
                Interactive real-time audio generation via HTML5 Web Audio API. As you scroll,
                oscillator frequencies dynamically modulate from 65Hz idle to 350Hz high-velocity
                pitch, simulating cockpit propulsion acoustics.
              </p>
            </div>

            <button
              onClick={onToggleAudio}
              className={`w-full py-2.5 rounded-xl border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isAudioActive
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isAudioActive ? 'TEST ENGINE REV' : 'ENABLE ENGINE AUDIO'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
