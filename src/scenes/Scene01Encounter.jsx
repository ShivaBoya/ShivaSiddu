import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import CinematicRose from '../components/CinematicRose';
import RomanticScene01Canvas from '../components/RomanticScene01Canvas';
import BirthdayLockModal from '../components/BirthdayLockModal';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Scene01Encounter({
  onEnterUniverse,
  isTransitioning,
  isLocked = true,
  countdown,
  onDevUnlock,
  onStartMusic
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isBursting, setIsBursting] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState(null);
  const [showHeartPulse, setShowHeartPulse] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  const nameLetters = "INDU".split("");

  const handleEnterClick = (e) => {
    if (isBursting || isTransitioning) return;

    if (onStartMusic) onStartMusic();

    // Capture button coordinate for fountain origin
    const rect = e.currentTarget.getBoundingClientRect();
    setBurstOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });

    setIsBursting(true);
    setShowHeartPulse(true);

    if (isLocked) {
      // LOCKED UNTIL BIRTHDAY: Show gorgeous countdown timing modal
      setTimeout(() => {
        setIsBursting(false);
        setShowHeartPulse(false);
        setShowLockModal(true);
      }, 750);
    } else {
      // Unlocked on birthday (or dev override): Transition to Scene 02
      setTimeout(() => {
        onEnterUniverse();
      }, 750);
    }
  };

  return (
    <section
      id="scene-encounter"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-between px-3 sm:px-6 pt-[max(3.4rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(1.3rem,calc(env(safe-area-inset-bottom)+0.8rem))] text-center overflow-hidden bg-[#050204] select-none"
    >
      {/* 1. FULL-BLEED CINEMATIC ROSE BACKGROUND LAYER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-20">
        <motion.img
          src="/images/scenes/scene01-rose-hero.jpg"
          alt=""
          animate={prefersReducedMotion ? {} : { scale: [1.02, 1.08, 1.02] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full object-cover object-center opacity-30 filter blur-[4px]"
        />
        {/* Soft Vignette & Atmospheric Deep Burgundy Blend */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,2,4,0.15)_0%,rgba(5,2,4,0.65)_50%,#050204_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050204]/90 via-transparent to-[#050204]/95" />
      </div>

      {/* 2. HIGH-PERFORMANCE ROMANTIC HEARTS & DRIFTING PETALS CANVAS */}
      <RomanticScene01Canvas isBursting={isBursting} burstOrigin={burstOrigin} />

      {/* 3. VOLUMETRIC CRIMSON & CHAMPAGNE AMBIENT LIGHTING */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(245,208,97,0.2)_0%,rgba(184,20,36,0.14)_45%,transparent_75%)] blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-[radial-gradient(ellipse_at_bottom,rgba(230,34,56,0.22)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

      {/* 4. EXPANDING RADIANT HEART PULSE ON CTA TRIGGER */}
      <AnimatePresence>
        {showHeartPulse && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 2.2, 4.5], opacity: [0, 0.95, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <Heart className="w-48 h-48 sm:w-80 sm:h-80 text-[#FF2E63] fill-[#FF2E63]/30 filter drop-shadow-[0_0_80px_#FF2E63]" />
              <div className="absolute w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-radial from-[#F5D061]/60 via-[#FF2E63]/30 to-transparent blur-2xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. TOP PRELUDE TEXT BLOCK */}
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center px-2">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="font-serif italic text-sm xs:text-base sm:text-xl md:text-2xl text-[#FFF8F0]/95 leading-snug sm:leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
        >
          &ldquo;Some people make the world a little more beautiful just by being in it.&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="font-sans text-[10px] sm:text-xs text-[#F5D061]/90 tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-1.5 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          And today, the entire universe celebrates one of them.
        </motion.p>
      </div>

      {/* 6. CENTERPIECE: THE FULL IMMERSIVE ROSE & MONUMENTAL INDU TYPOGRAPHY */}
      <div className="relative z-20 my-auto flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-2">
        {/* The Hero Rose (Feather masked, NO card border) */}
        <CinematicRose isBursting={isBursting} />

        {/* Her Name Letter-by-Letter Luxury Cinematic Reveal */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-4 my-0.5 sm:my-1">
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 1.4 + i * 0.16,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="font-serif text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-bold tracking-widest bg-gradient-to-r from-[#FFF8E7] via-[#F5D061] to-[#E5B842] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,208,97,0.55)]"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Target Birthday Date with Ornamental Hairlines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.1 }}
          className="flex items-center gap-2.5 sm:gap-3 mt-0.5"
        >
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#F5D061]/60" />
          <span className="font-serif italic tracking-[0.2em] text-[11px] sm:text-sm text-[#F5D061]/90 font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            December 01, 2026
          </span>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#F5D061]/60" />
        </motion.div>
      </div>

      {/* 7. BOTTOM CURIOSITY CTA TRIGGER */}
      <div className="relative z-20 flex flex-col items-center pb-1 sm:pb-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <motion.button
            onClick={handleEnterClick}
            disabled={isBursting || isTransitioning}
            animate={
              isBursting
                ? { scale: [1, 1.08, 1], boxShadow: '0 0 55px rgba(245,208,97,0.8)' }
                : {}
            }
            transition={{ duration: 0.6 }}
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(184,20,36,0.45)] hover:shadow-[0_0_45px_rgba(245,208,97,0.65)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Crimson & Champagne Gold Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#8A0F1C] via-[#B81424] to-[#E62238] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,215,0,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#F5D061]/60 rounded-full group-hover:border-[#F5D061] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#FFF8F0] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Enter Your Universe ✨
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#F5D061] group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 3.0 }}
          className="mt-1 sm:mt-2.5 text-[9px] xs:text-[10px] sm:text-[11px] text-[#FFF8F0]/60 tracking-wider font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] max-w-[65vw] sm:max-w-none mx-auto leading-tight"
        >
          ✨ Best experienced with sound &bull; Handcrafted with love
        </motion.p>
      </div>

      {/* 8. BIRTHDAY TIMING LOCK MODAL (Displays when button clicked before Dec 1) */}
      <BirthdayLockModal
        isOpen={showLockModal}
        onClose={() => setShowLockModal(false)}
        countdown={countdown || { days: 16, hours: 5, minutes: 18, seconds: 42 }}
        onDevUnlock={onDevUnlock}
      />
    </section>
  );
}
