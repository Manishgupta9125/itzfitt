import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureShowcase from './components/FeatureShowcase';
import InteractivePlayground from './components/InteractivePlayground';
import Footer from './components/Footer';
import { audioEngine } from './utils/audioEngine';

const COLOR_THEMES = [
  { id: 'emerald', name: 'Emerald', trailColor: '#45db7d' },
  { id: 'cyan', name: 'Cyber Cyan', trailColor: '#38bdf8' },
  { id: 'volt', name: 'Volt Lime', trailColor: '#def54f' },
  { id: 'orange', name: 'Hyper Orange', trailColor: '#fa7328' },
  { id: 'violet', name: 'Neon Violet', trailColor: '#c084fc' }
];

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(COLOR_THEMES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isAutoCruising, setIsAutoCruising] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const cruiseInterval = useRef(null);

  // Auto-Cruise scroll loop
  useEffect(() => {
    if (isAutoCruising) {
      cruiseInterval.current = setInterval(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = window.scrollY + 8;

        if (targetScroll >= maxScroll * 0.72) {
          setIsAutoCruising(false);
          clearInterval(cruiseInterval.current);
        } else {
          window.scrollBy({ top: 8, behavior: 'auto' });
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
    const heroTrack = window.innerHeight * 1.8;
    window.scrollTo({ top: heroTrack, behavior: 'smooth' });
  };

  const handleToggleAudio = () => {
    const isMuted = audioEngine.toggleMute();
    setIsAudioActive(!isMuted);
    if (!isMuted) audioEngine.playRev();
  };

  return (
    <div className="min-h-screen bg-[#0b0d11] text-white selection:bg-emerald-500 selection:text-black">
      {/* Dynamic Top Navigation Bar */}
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

      {/* Main Core Scroll-Driven Hero Section */}
      <main>
        <HeroSection
          currentTheme={currentTheme}
          onProgressUpdate={setScrollProgress}
          onSpeedUpdate={setSpeed}
        />

        {/* In-depth Specifications & Architectural Breakdown */}
        <FeatureShowcase currentTheme={currentTheme} />

        {/* Interactive Kinetic Sandbox Bench */}
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

      {/* Submission Footer with Reference Details */}
      <Footer onResetScroll={handleResetScroll} currentTheme={currentTheme} />
    </div>
  );
}
