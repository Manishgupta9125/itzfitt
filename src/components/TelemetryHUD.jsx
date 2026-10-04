import React from 'react';
import { Gauge, Zap, Compass, Flag } from 'lucide-react';

export default function TelemetryHUD({ speed, scrollProgress, currentTheme }) {
  // Compute simulated vehicle metrics based on scroll
  const gear = scrollProgress === 0 ? 'N' : scrollProgress < 0.2 ? '1' : scrollProgress < 0.45 ? '2' : scrollProgress < 0.7 ? '3' : scrollProgress < 0.9 ? '4' : '5';
  const rpm = Math.round(1200 + (speed / 240) * 7200);
  const gForce = (1.0 + (speed / 240) * 0.95).toFixed(2);
  const distance = Math.round(scrollProgress * 400); // 400m drag strip

  return (
    <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-4 bg-black/60 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/10 shadow-2xl">
      {/* Speedometer Circle */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <svg className="w-16 h-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/10"
            fill="transparent"
          />
          <circle
            cx="32"
            cy="32"
            r="26"
            stroke={currentTheme.trailColor}
            strokeWidth="4"
            strokeDasharray={163.36}
            strokeDashoffset={163.36 - (163.36 * Math.min(speed, 240)) / 240}
            strokeLinecap="round"
            className="transition-all duration-75"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-black font-mono leading-none tracking-tight text-white">
            {Math.round(speed)}
          </span>
          <span className="text-[9px] font-mono text-white/50 tracking-widest mt-0.5">MPH</span>
        </div>
      </div>

      <div className="h-10 w-[1px] bg-white/10" />

      {/* Telemetry Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <div className="text-white/40 text-[10px] tracking-wider uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> GEAR
          </div>
          <div className="text-sm font-bold text-white tracking-widest">{gear}</div>
        </div>

        <div>
          <div className="text-white/40 text-[10px] tracking-wider uppercase flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> RPM
          </div>
          <div className="text-sm font-bold text-white tracking-widest">{rpm}</div>
        </div>

        <div>
          <div className="text-white/40 text-[10px] tracking-wider uppercase flex items-center gap-1">
            <Flag className="w-3 h-3 text-emerald-400" /> DIST
          </div>
          <div className="text-sm font-bold text-white tracking-widest">{distance}m</div>
        </div>
      </div>
    </div>
  );
}
