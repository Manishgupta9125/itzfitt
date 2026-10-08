import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import MetricsShowcase from './components/MetricsShowcase';
import FeatureShowcase from './components/FeatureShowcase';
import InteractivePlayground from './components/InteractivePlayground';
import Footer from './components/Footer';
import { audioEngine } from './utils/audioEngine';

gsap.registerPlugin(ScrollTrigger);

const COLOR_THEMES = [
  { id: 'emerald', name: 'Emerald', trailColor: '#45db7d' },
  { id: 'cyan', name: 'Cyber Cyan', trailColor: '#38bdf8' },
  { id: 'volt', name: 'Volt Lime', trailColor: '#def54f' },
  { id: 'orange', name: 'Hyper Orange', trailColor: '#fa7328' },
  { id: 'violet', name: 'Neon Violet', trailColor: '#c084fc' }
];

const HEADLINE_LETTERS = [
  'W', 'E', 'L', 'C', 'O', 'M', 'E', ' ', 'I', 'T', 'Z', 'F', 'I', 'Z', 'Z'
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(COLOR_THEMES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isAutoCruising, setIsAutoCruising] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const cruiseInterval = useRef(null);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const headlineRef = useRef(null);

  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const velocityTimeout = useRef(null);

  // Auto-Cruise scroll loop for demonstration
  useEffect(() => {
    if (isAutoCruising) {
      cruiseInterval.current = setInterval(() => {
        const heroEnd = window.innerHeight * 1.35;
        const targetScroll = window.scrollY + 6;

        if (targetScroll >= heroEnd) {
          setIsAutoCruising(false);
          clearInterval(cruiseInterval.current);
        } else {
          window.scrollBy({ top: 6, behavior: 'auto' });
        }
      }, 16);
    } else {
      if (cruiseInterval.current) clearInterval(cruiseInterval.current);
    }

    return () => {
      if (cruiseInterval.current) clearInterval(cruiseInterval.current);
    };
  }, [isAutoCruising]);

  const handleToggleAutoCruise = () => {
    setIsAutoCruising((prev) => !prev);
    if (!isAutoCruising) audioEngine.playRev();
  };

  const handleResetScroll = () => {
    setIsAutoCruising(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchSprint = () => {
    setIsAutoCruising(false);
    const heroEnd = window.innerHeight * 1.35;
    window.scrollTo({ top: heroEnd, behavior: 'smooth' });
  };

  const handleToggleAudio = () => {
    const isMuted = audioEngine.toggleMute();
    setIsAudioActive(!isMuted);
    if (!isMuted) audioEngine.playRev();
  };

  // Main Scroll Animation for the Car Hero (Preserving exact Start Point & Final Point)
  useEffect(() => {
    const letters = headlineRef.current
      ? Array.from(headlineRef.current.querySelectorAll('.value-letter'))
      : [];

    const ctx = gsap.context(() => {
      const roadEl = roadRef.current;
      const carEl = carRef.current;
      const trailEl = trailRef.current;

      const setupAnimation = () => {
        if (!roadEl || !carEl || !headlineRef.current) return;

        const roadRect = roadEl.getBoundingClientRect();
        const roadWidth = window.innerWidth;
        const carWidth = carEl.offsetWidth || 419;

        // In Picture 2 (final point), car's nose has driven off right edge,
        // leaving the rear ~145px (spoiler & vents) visible at the right edge
        const endX = Math.max(roadWidth - 145, 100);

        // Precompute letter offsets relative to road left
        const letterRects = letters.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return rect.left - roadRect.left;
        });

        // Kill existing ScrollTrigger if resizing
        ScrollTrigger.getById('carMainTrigger')?.kill();

        // Main Car Translation & Sync
        gsap.to(carEl, {
          id: 'carMainTrigger',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.0,
            pin: trackRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              setScrollProgress(p);

              const currentX = gsap.getProperty(carEl, 'x') || 0;
              const carMidpoint = currentX + carWidth * 0.45;

              // 1. Green Trail expansion:
              // At start (Pic 1), 50px green slice behind car tail.
              // At end (Pic 2), entire road is green.
              if (trailEl) {
                if (p >= 0.96) {
                  gsap.set(trailEl, { width: roadWidth });
                } else {
                  gsap.set(trailEl, { width: Math.max(currentX + 50, 50) });
                }
              }

              // 2. Letters Reveal:
              // At start (Pic 1), no letters are visible.
              // When car passes a letter, it illuminates in black on top of the green trail.
              letters.forEach((letter, i) => {
                const targetLeft = letterRects[i] ?? 0;
                if (p > 0.02 && carMidpoint >= targetLeft) {
                  letter.style.opacity = '1';
                } else {
                  letter.style.opacity = '0';
                }
              });

              // 3. Four Statistics Boxes:
              // Box 1 (58% Lime): fades in between 0.15 and 0.35
              const b1 = gsap.utils.clamp(0, 1, (p - 0.15) / 0.2);
              if (box1Ref.current) gsap.set(box1Ref.current, { opacity: b1 });

              // Box 2 (23% Blue): fades in between 0.35 and 0.55
              const b2 = gsap.utils.clamp(0, 1, (p - 0.35) / 0.2);
              if (box2Ref.current) gsap.set(box2Ref.current, { opacity: b2 });

              // Box 3 (27% Dark): fades in between 0.55 and 0.75
              const b3 = gsap.utils.clamp(0, 1, (p - 0.55) / 0.2);
              if (box3Ref.current) gsap.set(box3Ref.current, { opacity: b3 });

              // Box 4 (40% Orange): fades in between 0.75 and 0.95
              const b4 = gsap.utils.clamp(0, 1, (p - 0.75) / 0.2);
              if (box4Ref.current) gsap.set(box4Ref.current, { opacity: b4 });

              // 4. Calculate scroll velocity for speedometer & audio engine
              const now = Date.now();
              const dt = Math.max(now - lastTime.current, 16);
              const currentScrollY = window.scrollY;
              const dy = Math.abs(currentScrollY - lastScrollY.current);
              lastScrollY.current = currentScrollY;
              lastTime.current = now;

              const instantSpeed = Math.min((dy / dt) * 65, 240);
              setSpeed(instantSpeed);
              audioEngine.setSpeed(instantSpeed);

              clearTimeout(velocityTimeout.current);
              velocityTimeout.current = setTimeout(() => {
                setSpeed(0);
                audioEngine.setSpeed(0);
              }, 120);
            }
          },
          x: endX,
          ease: 'none'
        });
      };

      lastTime.current = Date.now();
      const timer = setTimeout(setupAnimation, 80);
      window.addEventListener('resize', setupAnimation);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', setupAnimation);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar (Reveals smoothly when scrolling past hero section, leaving Start Point 100% clean) */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollProgress >= 0.85
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <Navbar
          scrollProgress={scrollProgress}
          speed={speed}
          isAutoCruising={isAutoCruising}
          onToggleAutoCruise={handleToggleAutoCruise}
          onResetScroll={handleResetScroll}
          currentTheme={currentTheme}
          onSelectTheme={setCurrentTheme}
          themes={COLOR_THEMES}
          isAudioActive={isAudioActive}
          onToggleAudio={handleToggleAudio}
        />
      </div>

      {/* ========================================================================= */}
      {/* CORE CAR ANIMATION HERO SECTION (Exact Picture 1 Start & Picture 2 Final) */}
      {/* ========================================================================= */}
      <div
        ref={sectionRef}
        style={{
          height: '220vh',
          position: 'relative',
          backgroundColor: '#d1d1d1'
        }}
      >
        {/* Pinned 100vh Track */}
        <div
          ref={trackRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#d1d1d1',
            overflow: 'hidden'
          }}
        >
          {/* Horizontal Road (200px Height, Dark #1e1e1e) */}
          <div
            ref={roadRef}
            style={{
              width: '100vw',
              height: '200px',
              backgroundColor: '#1e1e1e',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* Green Kinetic Trail (revealed as car moves) */}
            <div
              ref={trailRef}
              style={{
                height: '200px',
                backgroundColor: currentTheme?.trailColor || '#45db7d',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 2,
                width: '50px' // Initial trail behind car tail at Start Point (Pic 1)
              }}
            />

            {/* Giant Headline: "WELCOME ITZFIZZ" */}
            <div
              ref={headlineRef}
              style={{
                position: 'absolute',
                left: '5%',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 5,
                display: 'flex',
                gap: '0.25rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}
            >
              {HEADLINE_LETTERS.map((char, index) => {
                if (char === ' ') {
                  return (
                    <span
                      key={index}
                      style={{ display: 'inline-block', width: '2rem' }}
                    >
                      &nbsp;
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    className="value-letter"
                    style={{
                      color: '#111111',
                      fontWeight: 900,
                      fontSize: 'clamp(4rem, 8.5vw, 7.8rem)',
                      lineHeight: 1,
                      opacity: 0, // Starts at 0, revealed by car
                      transition: 'opacity 0.15s ease',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Orange McLaren 720S Sports Car (Top-down view, 200px height) */}
            <img
              ref={carRef}
              src="/car.png"
              alt="McLaren 720S"
              style={{
                height: '200px',
                width: 'auto',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 10,
                pointerEvents: 'none',
                willChange: 'transform',
                display: 'block'
              }}
              draggable={false}
            />
          </div>

          {/* Box 1 (Top Left): 58% Increase in pick up point use */}
          <div
            ref={box1Ref}
            style={{
              position: 'absolute',
              top: '6%',
              right: '32%',
              backgroundColor: '#def54f',
              color: '#111111',
              padding: '24px 28px',
              borderRadius: '12px',
              opacity: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '220px',
              maxWidth: '260px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)'
            }}
          >
            <span
              style={{
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              58%
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginTop: '6px',
                lineHeight: 1.25,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Increase in pick up point use
            </span>
          </div>

          {/* Box 3 (Top Right): 27% Increase in pick up point use */}
          <div
            ref={box3Ref}
            style={{
              position: 'absolute',
              top: '6%',
              right: '10%',
              backgroundColor: '#2b2d30',
              color: '#ffffff',
              padding: '24px 28px',
              borderRadius: '12px',
              opacity: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '220px',
              maxWidth: '260px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)'
            }}
          >
            <span
              style={{
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              27%
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginTop: '6px',
                lineHeight: 1.25,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Increase in pick up point use
            </span>
          </div>

          {/* Box 2 (Bottom Left): 23% Decreased in customer phone calls */}
          <div
            ref={box2Ref}
            style={{
              position: 'absolute',
              bottom: '6%',
              right: '35%',
              backgroundColor: '#56b4f7',
              color: '#111111',
              padding: '24px 28px',
              borderRadius: '12px',
              opacity: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '220px',
              maxWidth: '260px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)'
            }}
          >
            <span
              style={{
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              23%
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginTop: '6px',
                lineHeight: 1.25,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Decreased in customer phone calls
            </span>
          </div>

          {/* Box 4 (Bottom Right): 40% Decreased in customer phone calls */}
          <div
            ref={box4Ref}
            style={{
              position: 'absolute',
              bottom: '6%',
              right: '12.5%',
              backgroundColor: '#fa7328',
              color: '#111111',
              padding: '24px 28px',
              borderRadius: '12px',
              opacity: 0,
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: '220px',
              maxWidth: '260px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)'
            }}
          >
            <span
              style={{
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              40%
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                marginTop: '6px',
                lineHeight: 1.25,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Decreased in customer phone calls
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REST OF THE WEBSITE (Impact Metrics, Motion Specs, Sandbox, Footer)       */}
      {/* ========================================================================= */}
      <main>
        {/* Transition Divider from Hero Canvas into ITZFIZZ Fleet Ecosystem */}
        <div className="relative py-10 bg-gradient-to-b from-[#d1d1d1] via-[#10141d] to-[#0b0d11] flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-xs font-mono text-white/90 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Scroll Down to Explore ITZFIZZ Ecosystem & Technical Architecture</span>
            <span className="font-bold text-emerald-400 text-sm">↓</span>
          </div>
        </div>

        {/* Detailed Impact Analytics Breakdown for the 4 Stat Cards */}
        <MetricsShowcase currentTheme={currentTheme} />

        {/* Technical Architecture & Assessment Rubric Checklist */}
        <FeatureShowcase currentTheme={currentTheme} />

        {/* Interactive Kinetic Sandbox Bench & Sprint Launcher */}
        <InteractivePlayground
          currentTheme={currentTheme}
          onSelectTheme={setCurrentTheme}
          themes={COLOR_THEMES}
          onResetScroll={handleResetScroll}
          onLaunchSprint={handleLaunchSprint}
          isAudioActive={isAudioActive}
          onToggleAudio={handleToggleAudio}
        />
      </main>

      {/* Assessment Submission Footer with Reference Benchmark Details */}
      <Footer onResetScroll={handleResetScroll} currentTheme={currentTheme} />
    </div>
  );
}
