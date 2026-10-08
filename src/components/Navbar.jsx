import { Volume2, VolumeX, Play, Pause, RotateCcw, Activity } from 'lucide-react';

export default function Navbar({
  scrollProgress,
  speed,
  isAutoCruising,
  onToggleAutoCruise,
  onResetScroll,
  currentTheme,
  onSelectTheme,
  themes,
  isAudioActive,
  onToggleAudio
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 transition-all duration-300 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg shadow-black/50 group">
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
              ⚡
            </span>
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: currentTheme.trailColor }}
            />
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentTheme.trailColor }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg md:text-xl tracking-wider text-white">
                ITZ<span style={{ color: currentTheme.trailColor }}>FIZZ</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded-full bg-white/10 text-white/70 border border-white/10">
                ASSESSMENT SHOWCASE
              </span>
            </div>
            <p className="text-[11px] text-white/40 hidden md:block">
              Scroll-Driven McLaren 720S Assessment Project
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-mono text-white/70">
          <a href="#metrics" className="hover:text-white transition-colors hover:underline underline-offset-4">
            IMPACT METRICS
          </a>
          <a href="#specs" className="hover:text-white transition-colors hover:underline underline-offset-4">
            SPECIFICATIONS
          </a>
          <a href="#sandbox" className="hover:text-white transition-colors hover:underline underline-offset-4">
            SANDBOX BENCH
          </a>
        </nav>

        {/* Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-white/70">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>PROGRESS:</span>
            <span className="text-white font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-white/70">
            <span>VELOCITY:</span>
            <span
              className="font-bold tracking-wider"
              style={{ color: currentTheme.trailColor }}
            >
              {Math.round(speed)} MPH
            </span>
          </div>
        </div>

        {/* Controls & Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Palette */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t)}
                title={`Switch accent to ${t.name}`}
                className={`w-6 h-6 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  currentTheme.id === t.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.trailColor }}
              />
            ))}
          </div>

          {/* Audio Engine Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioActive ? 'Mute engine audio' : 'Enable interactive EV engine audio'}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
              isAudioActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAudioActive ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          {/* Auto-Cruise / Drive Button */}
          <button
            onClick={onToggleAutoCruise}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
              isAutoCruising
                ? 'bg-amber-500 text-black border-amber-400 font-bold animate-pulse'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            {isAutoCruising ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoCruising ? 'PAUSE CRUISE' : 'AUTO CRUISE'}</span>
          </button>

          {/* Reset Scroll */}
          <button
            onClick={onResetScroll}
            title="Return to top"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
