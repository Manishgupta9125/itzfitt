import { ExternalLink, ArrowUp, Sparkles } from 'lucide-react';

const TECH_BADGES = [
  'HTML5 Semantic',
  'Tailwind CSS v4',
  'JavaScript (ES2024)',
  'React.js 19',
  'GSAP 3.12+',
  'ScrollTrigger Scrub',
  'Web Audio API',
  'Vite 8',
  'GitHub Pages Ready'
];

export default function Footer({ onResetScroll, currentTheme }) {
  return (
    <footer className="relative py-12 px-6 md:px-12 bg-[#050608] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-extrabold text-xl tracking-tight text-white">
              ITZ<span style={{ color: currentTheme.trailColor }}>FIZZ</span>
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              ASSIGNMENT SUBMISSION
            </span>
          </div>
          <p className="text-xs text-white/50 max-w-md">
            Recreation and high-performance enhancement of the McLaren 720S scroll-driven hero section
            animation inspired by the reference benchmark.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {TECH_BADGES.map((badge, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/60"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="https://paraschaturvedi.github.io/car-scroll-animation"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-all"
          >
            <span>Live Reference Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onResetScroll}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
