import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioSourceType, setAudioSourceType] = useState('synthesizer');

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const sfxGainRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Helper to ensure AudioContext exists and is running
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      const ctx = new AudioCtx();

      const master = ctx.createGain();
      master.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, ctx.currentTime);
      master.connect(ctx.destination);

      const sfxGain = ctx.createGain();
      sfxGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.5, ctx.currentTime);
      sfxGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      sfxGainRef.current = sfxGain;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [isMuted, volume]);

  // Procedural ambient soundtrack generator
  const initSynth = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = masterGainRef.current;
    if (!masterGain) return;

    const chordProgression = [
      [155.56, 233.08, 293.66, 349.23], // Eb minor9
      [174.61, 220.00, 261.63, 329.63], // F maj7
      [130.81, 196.00, 246.94, 293.66], // C minor9
      [146.83, 220.00, 293.66, 369.99]  // D minor/F#
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
      const now = audioCtxRef.current.currentTime;
      const freqs = chordProgression[chordIndex % chordProgression.length];
      chordIndex++;

      freqs.forEach((freq, idx) => {
        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        const filter = audioCtxRef.current.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + Math.random() * 400, now);

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.05 / freqs.length, now + 2.5);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 8.5);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 9.0);
      });

      // Delicate high starlight chime
      if (Math.random() > 0.35) {
        const chimeOsc = audioCtxRef.current.createOscillator();
        const chimeGain = audioCtxRef.current.createGain();
        chimeOsc.type = 'sine';
        const chimeFreqs = [587.33, 659.25, 880.0, 987.77, 1174.66];
        chimeOsc.frequency.setValueAtTime(chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)], now + 1);
        chimeGain.gain.setValueAtTime(0.001, now + 1);
        chimeGain.gain.linearRampToValueAtTime(0.02, now + 1.2);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);
        chimeOsc.start(now + 1);
        chimeOsc.stop(now + 4.5);
      }
    };

    playChord();
    synthIntervalRef.current = setInterval(playChord, 6500);
  }, [getAudioContext]);

  // Audio elements & lifecycle
  useEffect(() => {
    const audio = new Audio('/music/indu-theme.mp3');
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    audio.addEventListener('canplaythrough', () => {
      setAudioSourceType('file');
    });

    audio.addEventListener('error', () => {
      setAudioSourceType('synthesizer');
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Sync volume & mute changes
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        effectiveVol * 0.4,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
    if (sfxGainRef.current && audioCtxRef.current) {
      sfxGainRef.current.gain.setTargetAtTime(
        effectiveVol * 0.5,
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [volume, isMuted]);

  // Original Subtle Sound Effects (Respects isMuted & volume)
  const playMemorySfx = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [880.0, 1318.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.04, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(sfxGainRef.current || ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.3);
    });
  }, [isMuted, volume, getAudioContext]);

  const playFlowerSfx = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Ascending blossom chime (C5, E5, G5, C6)
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.035, now + idx * 0.06 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.4);
      osc.connect(gain);
      gain.connect(sfxGainRef.current || ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.5);
    });
  }, [isMuted, volume, getAudioContext]);

  const playCandleSfx = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Soft gentle air puff
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(sfxGainRef.current || ctx.destination);
    noise.start(now);

    // Warm celebratory harmonic chime (Eb major triad)
    [311.13, 392.00, 466.16, 622.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.25 + idx * 0.04);
      gain.gain.setValueAtTime(0.001, now + 0.25 + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.25 + idx * 0.04 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25 + idx * 0.04 + 2.0);
      osc.connect(gain);
      gain.connect(sfxGainRef.current || ctx.destination);
      osc.start(now + 0.25 + idx * 0.04);
      osc.stop(now + 0.25 + idx * 0.04 + 2.2);
    });
  }, [isMuted, volume, getAudioContext]);

  const playRevealSfx = useCallback(() => {
    if (isMuted || volume <= 0) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Celestial crescendo harp flourish
    [392.0, 493.88, 587.33, 739.99, 880.0, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.09 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 2.8);
      osc.connect(gain);
      gain.connect(sfxGainRef.current || ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 3.0);
    });
  }, [isMuted, volume, getAudioContext]);

  const startMusic = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);

    if (audioSourceType === 'file' && audioRef.current) {
      audioRef.current.play().catch(() => {
        initSynth();
      });
    } else {
      initSynth();
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    }
  }, [audioSourceType, initSynth]);

  const togglePlay = useCallback(() => {
    if (!hasStarted) {
      startMusic();
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      if (audioSourceType === 'file' && audioRef.current) {
        audioRef.current.pause();
      } else if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
    } else {
      setIsPlaying(true);
      if (audioSourceType === 'file' && audioRef.current) {
        audioRef.current.play().catch(() => {});
      } else if (audioCtxRef.current) {
        audioCtxRef.current.resume();
      } else {
        initSynth();
      }
    }
  }, [hasStarted, isPlaying, audioSourceType, startMusic, initSynth]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    isPlaying,
    volume,
    setVolume,
    isMuted,
    togglePlay,
    toggleMute,
    startMusic,
    hasStarted,
    audioSourceType,
    // Original Sound Effects
    playMemorySfx,
    playFlowerSfx,
    playCandleSfx,
    playRevealSfx
  };
}
