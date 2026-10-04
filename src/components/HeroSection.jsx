import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import TelemetryHUD from './TelemetryHUD';
import { audioEngine } from '../utils/audioEngine';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  {
    id: 'box1',
    metric: '58%',
    value: 58,
    label: 'Increase in pick up point use',
    detail: 'Autonomous hub dispatch acceleration',
    color: '#def54f',
    textColor: '#111111',
    defaultPos: { top: '8%', right: '32%' },
    milestone: 0.25,
    tag: '+18.4% YoY'
  },
  {
    id: 'box2',
    metric: '23%',
    value: 23,
    label: 'Decreased in customer phone calls',
    detail: 'Real-time telemetry visibility',
    color: '#6ac9ff',
    textColor: '#111111',
    defaultPos: { bottom: '8%', right: '38%' },
    milestone: 0.48,
    tag: 'Frictionless'
  },
  {
    id: 'box3',
    metric: '27%',
    value: 27,
    label: 'Higher repeat order velocity',
    detail: 'Sub-second checkout & delivery pairing',
    color: '#27272a',
    borderColor: '#a1a1aa',
    textColor: '#ffffff',
    defaultPos: { top: '8%', right: '10%' },
    milestone: 0.70,
    tag: 'Retention'
  },
  {
    id: 'box4',
    metric: '40%',
    value: 40,
    label: 'Reduction in dispatch latency',
    detail: 'Predictive routing & fleet allocation',
    color: '#fa7328',
    textColor: '#111111',
    defaultPos: { bottom: '8%', right: '12%' },
    milestone: 0.90,
    tag: 'High Impact'
  }
];

const HEADLINE_TEXT = "WELCOME ITZFIZZ";

export default function HeroSection({
  currentTheme,
  onProgressUpdate,
  onSpeedUpdate
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const headlineRef = useRef(null);
  const cardsRef = useRef([]);

  const [speed, setSpeed] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const velocityTimeout = useRef(null);

  useEffect(() => {
    const letters = headlineRef.current
      ? Array.from(headlineRef.current.querySelectorAll('.headline-letter'))
      : [];

    const ctx = gsap.context(() => {
      // 1. Initial Load Animation
      const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      introTl
        .from('.hero-badge', {
          y: -20,
          opacity: 0,
          duration: 0.8,
          delay: 0.2
        })
        .from(
          letters,
          {
            y: 40,
            opacity: 0,
            stagger: 0.035,
            duration: 0.9,
            ease: 'back.out(1.7)'
          },
          '-=0.5'
        )
        .from(
          '.hero-subtext',
          {
            y: 20,
            opacity: 0,
            duration: 0.8
          },
          '-=0.6'
        )
        .from(
          carRef.current,
          {
            x: -80,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
          },
          '-=0.8'
        )
        .from(
          cardsRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
            stagger: 0.12,
            duration: 0.8,
            ease: 'back.out(1.4)'
          },
          '-=0.6'
        )
        .from(
          '.scroll-indicator-pulse',
          {
            opacity: 0,
            y: -10,
            duration: 0.6
          },
          '-=0.4'
        );

      // 2. Scroll-Driven Animation (Core Feature)
      const roadEl = roadRef.current;
      const carEl = carRef.current;
      const trailEl = trailRef.current;

      const updateDimensions = () => {
        if (!roadEl || !carEl || !headlineRef.current) return;

        const roadRect = roadEl.getBoundingClientRect();
        const carRect = carEl.getBoundingClientRect();
        const roadWidth = roadRect.width || window.innerWidth;
        const carWidth = carRect.width || 380;
        const endX = Math.max(roadWidth - carWidth + 80, 200);

        // Pre-compute letter coordinates relative to road
        const letterRects = letters.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return {
            element: letter,
            left: rect.left - roadRect.left,
            right: rect.right - roadRect.left,
            width: rect.width
          };
        });

        // Kill existing scrollTrigger if resizing
        ScrollTrigger.getById('carScrollTrigger')?.kill();

        // Main Car Travel Animation
        gsap.to(carEl, {
          id: 'carScrollTrigger',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2, // Buttery smooth momentum
            pin: trackRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              setScrollProgress(progress);
              if (onProgressUpdate) onProgressUpdate(progress);

              // Calculate current car position
              const currentX = gsap.getProperty(carEl, 'x') || 0;
              const carMidpoint = currentX + carWidth * 0.45;

              // Dynamically adjust trail width behind car
              if (trailEl) {
                gsap.set(trailEl, { width: Math.max(currentX + carWidth * 0.25, 0) });
              }

              // Letter Reveal Logic: letters illuminate when car & trail reach them
              letterRects.forEach(({ element, left }) => {
                if (carMidpoint >= left) {
                  element.classList.add('illuminated');
                  element.style.color = '#0a0a0a';
                  element.style.opacity = '1';
                } else {
                  element.classList.remove('illuminated');
                  element.style.color = 'rgba(255, 255, 255, 0.25)';
                  element.style.opacity = '0.25';
                }
              });

              // Dynamic scroll velocity calculation for speedometer
              const now = Date.now();
              const dt = Math.max(now - lastTime.current, 16);
              const currentScrollY = window.scrollY;
              const dy = Math.abs(currentScrollY - lastScrollY.current);
              lastScrollY.current = currentScrollY;
              lastTime.current = now;

              const instantSpeed = Math.min((dy / dt) * 65, 240);
              setSpeed(instantSpeed);
              if (onSpeedUpdate) onSpeedUpdate(instantSpeed);
              audioEngine.setSpeed(instantSpeed);

              clearTimeout(velocityTimeout.current);
              velocityTimeout.current = setTimeout(() => {
                setSpeed(0);
                if (onSpeedUpdate) onSpeedUpdate(0);
                audioEngine.setSpeed(0);
              }, 120);

              // Milestone triggers for the 4 stats cards
              cardsRef.current.forEach((cardEl, idx) => {
                if (!cardEl) return;
                const stat = STATS_DATA[idx];
                const isPassed = progress >= stat.milestone;

                if (isPassed) {
                  cardEl.classList.add('card-highlight');
                  gsap.to(cardEl, {
                    scale: 1.05,
                    boxShadow: `0 20px 40px -10px ${stat.color}66`,
                    duration: 0.3
                  });
                } else {
                  cardEl.classList.remove('card-highlight');
                  gsap.to(cardEl, {
                    scale: 1,
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                    duration: 0.3
                  });
                }
              });
            }
          },
          x: endX,
          ease: 'none'
        });
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [currentTheme]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0b0d11] text-white"
      style={{ height: '260vh' }}
    >
      {/* Sticky Viewport Track Container */}
      <div
        ref={trackRef}
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-radial from-zinc-900/60 via-[#0b0d11] to-[#050608] select-none"
      >
        {/* Subtle Ambient Grid & Stage Lighting */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentTheme.trailColor }}
        />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none bg-blue-500" />

        {/* Top Header Information Overlay */}
        <div className="relative z-10 pt-20 md:pt-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentTheme.trailColor }}
            />
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/80">
              Interactive Kinetic Showcase
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[11px] font-mono text-emerald-400">GSAP SCROLLTRIGGER</span>
          </div>

          <h2 className="hero-subtext text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-white/50 max-w-xl">
            PRECISION VEHICLE DYNAMICS • SCROLL VELOCITY ENGINE
          </h2>
        </div>

        {/* Center Roadway Canvas with Car, Trail, and Massive Headline */}
        <div className="relative w-full my-auto flex items-center justify-center">
          {/* Upper Stage Horizon Line */}
          <div className="absolute -top-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Road Surface */}
          <div
            ref={roadRef}
            className="relative w-full h-[220px] md:h-[250px] bg-gradient-to-b from-[#14161b] via-[#1a1d24] to-[#121418] border-y border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex items-center"
          >
            {/* Asphalt subtle texture overlay */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Glowing Top Curb Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentTheme.trailColor}88, rgba(255,255,255,0.8), transparent)`
              }}
            />

            {/* Glowing Bottom Curb Line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentTheme.trailColor}88, rgba(255,255,255,0.8), transparent)`
              }}
            />

            {/* Road Lane Center Dashed Lines */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] flex items-center justify-between opacity-20 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-8 h-[2px] bg-white/80 mx-2" />
              ))}
            </div>

            {/* Distance Markers on Road */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 text-[9px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
              <span>START [0M]</span>
              <span>STAGE I [100M]</span>
              <span>STAGE II [200M]</span>
              <span>STAGE III [300M]</span>
              <span className="text-emerald-400 font-bold">FINISH [400M]</span>
            </div>

            {/* Kinetic Neon Trail Layer (behind car) */}
            <div
              ref={trailRef}
              className="absolute top-0 left-0 h-full z-10 transition-colors duration-500 pointer-events-none"
              style={{
                width: 0,
                background: `linear-gradient(90deg, rgba(16,185,129,0.2) 0%, ${currentTheme.trailColor}bb 70%, ${currentTheme.trailColor} 100%)`,
                boxShadow: `0 0 45px 5px ${currentTheme.trailColor}88, inset 0 0 20px rgba(255,255,255,0.3)`
              }}
            >
              {/* Emissive Trail Edge Glow */}
              <div
                className="absolute top-0 right-0 w-8 h-full blur-md"
                style={{ backgroundColor: currentTheme.trailColor }}
              />
            </div>

            {/* Staggered Giant Headline: "WELCOME ITZFIZZ" */}
            <div
              ref={headlineRef}
              className="relative z-20 w-full flex items-center justify-center font-black tracking-widest sm:tracking-[0.25em] md:tracking-[0.35em] pointer-events-none select-none text-[clamp(2.2rem,6.8vw,6.5rem)] leading-none"
            >
              {HEADLINE_TEXT.split('').map((char, index) => {
                const isSpace = char === ' ';
                return (
                  <span
                    key={index}
                    className={`headline-letter inline-block transition-all duration-300 font-black ${
                      isSpace ? 'w-4 md:w-8' : ''
                    }`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.25)',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                  >
                    {isSpace ? '\u00A0' : char}
                  </span>
                );
              })}
            </div>

            {/* McLaren 720S Sports Car Visual Element */}
            <div
              ref={carRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 z-30 flex items-center will-change-transform cursor-grab active:cursor-grabbing pointer-events-auto"
              style={{
                height: '180px',
                width: '380px'
              }}
            >
              {/* Front Dual Headlight Projection Beams */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[90%] w-72 h-36 pointer-events-none opacity-60"
                style={{
                  background:
                    'radial-gradient(ellipse at left, rgba(255,255,255,0.7) 0%, rgba(200,240,255,0.3) 35%, transparent 75%)',
                  clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)'
                }}
              />

              {/* Exhaust Spark & Smoke wake effect */}
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-20 -translate-x-full blur-sm opacity-70 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.trailColor} 0%, transparent 70%)`
                }}
              />

              {/* High-Resolution Transparent Car Asset */}
              <img
                src="./car.png"
                alt="McLaren 720S Top View"
                className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.95)] drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-transform duration-150"
                draggable={false}
              />
            </div>

            {/* Chequered Finish Line Banner */}
            <div className="absolute right-0 top-0 bottom-0 w-8 z-15 flex flex-col pointer-events-none opacity-40">
              <div className="w-full h-full bg-[repeating-conic-gradient(#fff_0_90deg,#000_0_180deg)] [background-size:16px_16px]" />
            </div>
          </div>

          {/* Lower Stage Horizon Line */}
          <div className="absolute -bottom-6 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* 4 Interactive Impact Metrics / Statistics Cards */}
        {STATS_DATA.map((box, index) => (
          <div
            key={box.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="text-box absolute z-25 p-4 md:p-6 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 group hover:scale-105 cursor-pointer max-w-[280px] md:max-w-[340px]"
            style={{
              backgroundColor: box.color,
              color: box.textColor,
              borderColor: box.borderColor || 'rgba(255,255,255,0.2)',
              ...box.defaultPos
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-3xl md:text-5xl font-black font-mono tracking-tight leading-none">
                {box.metric}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-black/10 border border-black/10">
                {box.tag}
              </span>
            </div>
            <p className="font-bold text-xs md:text-sm leading-snug tracking-tight">
              {box.label}
            </p>
            <p className="text-[11px] opacity-75 mt-1 font-mono hidden md:block">
              {box.detail}
            </p>

            {/* Progress indicator dot */}
            <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-mono opacity-80">
              <span>STAGE {index + 1} TRIGGER</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}

        {/* Bottom Interactive HUD & Scroll Down Indicator */}
        <div className="relative z-10 pb-8 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
          <TelemetryHUD
            speed={speed}
            scrollProgress={scrollProgress}
            currentTheme={currentTheme}
          />

          {/* Central Scroll Indicator */}
          <div className="mx-auto flex flex-col items-center gap-2 text-white/50 text-xs font-mono">
            <span className="tracking-widest uppercase text-[10px] text-white/70">
              {scrollProgress > 0.95 ? 'FINISH LINE REACHED' : 'SCROLL TO DRIVE'}
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5 shadow-lg shadow-black/50">
              <div
                className="w-1.5 h-2.5 rounded-full animate-bounce"
                style={{ backgroundColor: currentTheme.trailColor }}
              />
            </div>
          </div>

          {/* Right Stage Completion Indicator */}
          <div className="hidden md:flex flex-col items-end font-mono text-xs text-white/60">
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              ACCELERATION TRAIL
            </span>
            <span className="font-bold text-white text-sm">
              {Math.round(scrollProgress * 100)}% COMPLETE
            </span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full transition-all duration-150"
                style={{
                  width: `${scrollProgress * 100}%`,
                  backgroundColor: currentTheme.trailColor
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
