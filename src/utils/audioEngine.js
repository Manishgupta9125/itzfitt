// Synthetic Web Audio API engine for futuristic vehicle sound effects
// Does not require any external audio files - completely self-contained!

class VehicleAudioEngine {
  constructor() {
    this.ctx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.filter = null;
    this.isMuted = true;
    this.isPlaying = false;
    this.targetPitch = 60;
    this.currentPitch = 60;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Main drive oscillator (futuristic electric motor harmonics)
      this.oscillator = this.ctx.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(65, this.ctx.currentTime);

      // Lowpass filter for smooth cockpit electric hum
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(4, this.ctx.currentTime);

      // Gain node for volume control
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

      this.oscillator.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext initialization failed or blocked:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.setSpeed(0);
    } else if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  // speed from 0 to 100 (or velocity)
  setSpeed(velocity) {
    if (this.isMuted || !this.ctx || !this.gainNode) return;

    const normalizedVel = Math.min(Math.max(velocity, 0), 150);
    const targetFreq = 70 + normalizedVel * 3.5;
    const targetFilter = 400 + normalizedVel * 12;
    const targetVol = normalizedVel > 2 ? Math.min(0.08 + (normalizedVel / 150) * 0.12, 0.22) : 0.02;

    this.oscillator.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    this.filter.frequency.setTargetAtTime(targetFilter, this.ctx.currentTime, 0.08);
    this.gainNode.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.08);
  }

  playRev() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.gainNode.gain.setTargetAtTime(0.2, now, 0.04);
    this.oscillator.frequency.exponentialRampToValueAtTime(320, now + 0.3);
    this.oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.8);
    this.gainNode.gain.setTargetAtTime(0.03, now + 0.8, 0.2);
  }
}

export const audioEngine = new VehicleAudioEngine();
