import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audioEngine } from '../utils/audioEngine';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  {
    id: 'box1',
    metric: '58%',
    label: 'Increase in pick up point use',
    color: '#def54f',
    textColor: '#111111',
    style: { top: '6%', right: '32%' },
    milestoneStart: 0.15,
    milestoneEnd: 0.35
  },
  {
    id: 'box2',
    metric: '23%',
    label: 'Decreased in customer phone calls',
    color: '#56b4f7',
    textColor: '#111111',
    style: { bottom: '6%', right: '35%' },
    milestoneStart: 0.35,
    milestoneEnd: 0.55
  },
  {
    id: 'box3',
    metric: '27%',
    label: 'Increase in pick up point use',
    color: '#2b2d30',
    textColor: '#ffffff',
    style: { top: '6%', right: '10%' },
    milestoneStart: 0.55,
    milestoneEnd: 0.75
  },
  {
    id: 'box4',
    metric: '40%',
    label: 'Decreased in customer phone calls',
    color: '#fa7328',
    textColor: '#111111',
    style: { bottom: '6%', right: '12%' },
    milestoneStart: 0.75,
    milestoneEnd: 0.95
  }
];

const HEADLINE_LETTERS = ['W', 'E', 'L', 'C', 'O', 'M', 'E', ' ', 'I', 'T', 'Z', 'F', 'I', 'Z', 'Z'];

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

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const velocityTimeout = useRef(null);

  useEffect(() => {
    const letters = headlineRef.current
      ? Array.from(headlineRef.current.querySelectorAll('.value-letter'))
      : [];

    const ctx = gsap.context(() => {
      const roadEl = roadRef.current;
      const carEl = carRef.current;
      const trailEl = trailRef.current;

      const updateDimensions = () => {
        if (!roadEl || !carEl || !headlineRef.current) return;

        const roadRect = roadEl.getBoundingClientRect();
        const roadWidth = window.innerWidth;
        // McLaren 720S image aspect ratio is ~2.09, so width is ~419px at 200px height
        const carWidth = carEl.offsetWidth || 419;

        // In Picture 2 (final point), car has driven past right edge,
        // leaving the rear ~145px (spoiler & engine cover) on screen:
        const endX = Math.max(roadWidth - 145, 100);

        // Precompute letter offsets relative to road's left
        const letterRects = letters.map((letter) => {
          const rect = letter.getBoundingClientRect();
          return {
            element: letter,
            left: rect.left - roadRect.left
          };
        });

        // Kill previous ScrollTrigger instance on resize
        ScrollTrigger.getById('carScrollTrigger')?.kill();

        // Main Car Travel ScrollTrigger
        gsap.to(carEl, {
          id: 'carScrollTrigger',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.0,
            pin: trackRef.current,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              setScrollProgress(progress);
              if (onProgressUpdate) onProgressUpdate(progress);

              // Current car X position
              const currentX = gsap.getProperty(carEl, 'x') || 0;
              const carMidpoint = currentX + carWidth * 0.45;

              // 1. Trail expansion:
              // At start (Pic 1), trail is ~45px behind the car tail.
              // At end (Pic 2), trail covers the entire road.
              if (trailEl) {
                if (progress >= 0.96) {
                  gsap.set(trailEl, { width: roadWidth });
                } else {
                  gsap.set(trailEl, { width: Math.max(currentX + 45, 45) });
                }
              }

              // 2. Letter reveal:
              // At progress 0 (Pic 1), no letters are visible.
              // As the car passes each letter, it illuminates in black on top of the green trail.
              letters.forEach((letter, i) => {
                const targetLeft = letterRects[i]?.left ?? 0;
                if (progress > 0.02 && carMidpoint >= targetLeft) {
                  letter.style.opacity = '1';
                } else {
                  letter.style.opacity = '0';
                }
              });

              // 3. Four Statistics Boxes:
              // Fade in cleanly as scroll progresses, all 4 visible at final point (Pic 2)
              cardsRef.current.forEach((cardEl, idx) => {
                if (!cardEl) return;
                const stat = STATS_DATA[idx];
                // Smooth clamped opacity between milestoneStart and milestoneEnd
                const opacity = gsap.utils.clamp(
                  0,
                  1,
                  (progress - stat.milestoneStart) / (stat.milestoneEnd - stat.milestoneStart)
                );
                gsap.set(cardEl, { opacity });
              });

              // 4. Scroll velocity calculation for optional engine audio
              const now = Date.now();
              const dt = Math.max(now - lastTime.current, 16);
              const currentScrollY = window.scrollY;
              const dy = Math.abs(currentScrollY - lastScrollY.current);
              lastScrollY.current = currentScrollY;
              lastTime.current = now;

              const instantSpeed = Math.min((dy / dt) * 65, 240);
              if (onSpeedUpdate) onSpeedUpdate(instantSpeed);
              audioEngine.setSpeed(instantSpeed);

              clearTimeout(velocityTimeout.current);
              velocityTimeout.current = setTimeout(() => {
                if (onSpeedUpdate) onSpeedUpdate(0);
                audioEngine.setSpeed(0);
              }, 120);
            }
          },
          x: endX,
          ease: 'none'
        });
      };

      lastTime.current = Date.now();
      // Run initial layout setup after DOM render
      const timeoutId = setTimeout(updateDimensions, 100);
      window.addEventListener('resize', updateDimensions);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', updateDimensions);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [currentTheme, onProgressUpdate, onSpeedUpdate]);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: '240vh' }}
    >
      {/* Sticky Pinned Viewport Track (Picture 1 & Picture 2 Canvas) */}
      <div
        ref={trackRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-[#d1d1d1] overflow-hidden select-none relative"
      >
        {/* Horizontal Roadway (200px Height, Dark Charcoal #1e1e1e) */}
        <div
          ref={roadRef}
          className="relative w-full overflow-hidden bg-[#1e1e1e] flex items-center shadow-lg"
          style={{ height: '200px' }}
        >
          {/* Green Kinetic Trail (revealed by car) */}
          <div
            ref={trailRef}
            className="absolute top-0 left-0 h-full pointer-events-none transition-colors duration-300"
            style={{
              width: '45px',
              backgroundColor: currentTheme?.trailColor || '#45db7d',
              zIndex: 2
            }}
          />

          {/* Giant Headline: "WELCOME ITZFIZZ" */}
          <div
            ref={headlineRef}
            className="absolute z-[5] left-[5%] top-1/2 -translate-y-1/2 flex items-center gap-[0.25rem] md:gap-[0.35rem] pointer-events-none select-none"
            style={{ whiteSpace: 'nowrap' }}
          >
            {HEADLINE_LETTERS.map((char, index) => {
              if (char === ' ') {
                return (
                  <span
                    key={index}
                    className="inline-block w-4 md:w-8"
                  >
                    &nbsp;
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  className="value-letter inline-block text-[#111111] font-black leading-none transition-opacity duration-150"
                  style={{
                    opacity: 0,
                    fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Orange McLaren 720S Sports Car (Top-Down View, 200px Height) */}
          <div
            ref={carRef}
            className="absolute top-0 left-0 z-10 will-change-transform pointer-events-none flex items-center"
            style={{ height: '200px', width: 'auto' }}
          >
            <img
              src="/car.png"
              alt="McLaren 720S Top View"
              className="h-full w-auto object-contain block drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]"
              draggable={false}
            />
          </div>
        </div>

        {/* 4 Statistics Cards (Positions, Metrics, and Colors matching Picture 2) */}
        {STATS_DATA.map((box, index) => (
          <div
            key={box.id}
            id={box.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="text-box absolute z-20 flex flex-col justify-center transition-transform hover:scale-105 duration-200"
            style={{
              backgroundColor: box.color,
              color: box.textColor,
              ...box.style,
              padding: '24px 28px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
              opacity: 0, // Starts at 0 for Picture 1, fades in to 1 for Picture 2
              minWidth: '220px',
              maxWidth: '260px'
            }}
          >
            <span
              className="font-bold leading-none tracking-tight"
              style={{
                fontSize: '56px',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              {box.metric}
            </span>
            <span
              className="font-medium leading-snug mt-2"
              style={{
                fontSize: '16px',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              {box.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
