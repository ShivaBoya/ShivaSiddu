import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Clock, X, Lock, KeyRound } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * BirthdayLockModal
 * Romantic luxury lock screen showing live countdown until Indu's birthday (Dec 01, 2026).
 * Features:
 * - Live ticking Days, Hours, Minutes, Seconds cards with champagne gold glow
 * - Heartfelt message from Shiva explaining that her universe is preparing its stars
 * - Secret preview passcode prompt (clicking the discreet lock icon unlocks for Shiva)
 */
export default function BirthdayLockModal({
  isOpen,
  onClose,
  countdown,
  onDevUnlock
}) {
  const prefersReducedMotion = useReducedMotion();
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  if (!isOpen) return null;

  const { days, hours, minutes, seconds } = countdown;

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (clean === 'shiva' || clean === '1201' || clean === 'indu') {
      onDevUnlock();
      setShowPasscode(false);
      onClose();
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const formatDigit = (num) => String(num || 0).padStart(2, '0');

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 xs:p-4 bg-[#050204]/90 backdrop-blur-2xl select-none touch-manipulation overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full rounded-3xl p-5 xs:p-6 sm:p-8 border-2 border-[#F5D061]/50 shadow-[0_30px_90px_rgba(184,20,36,0.55)] text-center overflow-hidden bg-gradient-to-b from-[#12050B] via-[#0A0307] to-[#050204] my-auto"
        >
          {/* Ambient Volumetric Glow Behind Modal */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle,rgba(245,208,97,0.22)_0%,rgba(184,20,36,0.18)_50%,transparent_75%)] blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle,rgba(230,34,56,0.2)_0%,transparent_70%)] blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#F5D061] hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-95 z-20"
            title="Return to the Rose"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-3 border border-[#F5D061]/40 bg-[#1A0A10]/80 shadow-[0_0_20px_rgba(245,208,97,0.25)]">
            <Clock className="w-3.5 h-3.5 text-[#F5D061] animate-pulse" />
            <span className="font-serif italic text-[11px] sm:text-xs tracking-widest text-[#F5D061] uppercase">
              ✦ The Universe is Preparing ✦
            </span>
          </div>

          {/* Header Title */}
          <h3 className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_25px_rgba(245,208,97,0.45)]">
            Almost Time, <span className="bg-gradient-to-r from-[#FFF5E6] via-[#F5D061] to-[#E5B842] bg-clip-text text-transparent italic font-display">Indu</span>
          </h3>

          <p className="font-sans text-xs sm:text-sm text-[#F5D061]/90 max-w-sm mx-auto font-light leading-relaxed mt-1 mb-5">
            The stars are aligning for your special day. Your universe will fully awaken on:
          </p>

          {/* Target Date Pill */}
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#8A0F1C]/70 via-[#B81424]/70 to-[#8A0F1C]/70 border border-[#F5D061]/50 shadow-[0_0_25px_rgba(184,20,36,0.5)] mb-6">
            <Heart className="w-3.5 h-3.5 text-[#F5D061] fill-[#F5D061]" />
            <span className="font-serif font-bold text-xs sm:text-sm tracking-widest text-[#FFF8F0] uppercase">
              December 01, 2026
            </span>
            <Heart className="w-3.5 h-3.5 text-[#F5D061] fill-[#F5D061]" />
          </div>

          {/* 4 LUXURY COUNTDOWN BOXES */}
          <div className="grid grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3.5 max-w-sm mx-auto mb-6">
            {/* Days */}
            <div className="flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#F5D061]/40 shadow-inner">
              <span className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(245,208,97,0.5)]">
                {formatDigit(days)}
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] text-[#F5D061]/80 tracking-widest uppercase mt-0.5">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#F5D061]/40 shadow-inner">
              <span className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(245,208,97,0.5)]">
                {formatDigit(hours)}
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] text-[#F5D061]/80 tracking-widest uppercase mt-0.5">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#F5D061]/40 shadow-inner">
              <span className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(245,208,97,0.5)]">
                {formatDigit(minutes)}
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] text-[#F5D061]/80 tracking-widest uppercase mt-0.5">
                Mins
              </span>
            </div>

            {/* Seconds */}
            <div className="flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 rounded-2xl bg-black/50 border border-[#FF2E63]/50 shadow-[0_0_15px_rgba(255,46,99,0.3)]">
              <span className="font-serif text-2xl xs:text-3xl sm:text-4xl font-bold text-[#FF85A1] tracking-tight drop-shadow-[0_2px_10px_rgba(255,46,99,0.7)] animate-pulse">
                {formatDigit(seconds)}
              </span>
              <span className="font-sans text-[9px] xs:text-[10px] text-[#FF85A1]/90 tracking-widest uppercase mt-0.5 font-semibold">
                Secs
              </span>
            </div>
          </div>

          {/* Heartfelt Note */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-white/5 max-w-sm mx-auto mb-5 text-center">
            <p className="font-serif italic text-xs sm:text-sm text-[#FFF8F0]/90 leading-relaxed">
              &ldquo;Some surprises are worth waiting for. Every star and every petal has been created exclusively for you.&rdquo;
            </p>
            <p className="font-sans text-[11px] text-[#F5D061] font-medium mt-1.5">
              With love, Shiva ❤️
            </p>
          </div>

          {/* Return Button */}
          <button
            onClick={onClose}
            className="w-full max-w-xs mx-auto py-3 px-6 rounded-full bg-gradient-to-r from-[#8A0F1C] via-[#B81424] to-[#E62238] border border-[#F5D061]/50 text-white font-serif text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_0_25px_rgba(184,20,36,0.4)] hover:shadow-[0_0_35px_rgba(245,208,97,0.6)] cursor-pointer touch-manipulation active:scale-95 transition-all"
          >
            Wait With Me ✨
          </button>

          {/* Discreet Developer / Shiva Unlock Trigger */}
          <div className="mt-4 flex items-center justify-center">
            <button
              onClick={() => setShowPasscode(!showPasscode)}
              className="text-[10px] text-white/20 hover:text-white/40 flex items-center gap-1 transition-colors cursor-pointer"
              title="Shiva Preview Access"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>Preview Mode</span>
            </button>
          </div>

          {/* Passcode input for Shiva */}
          {showPasscode && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handlePasscodeSubmit}
              className="mt-3 flex items-center justify-center gap-2 max-w-xs mx-auto"
            >
              <input
                type="password"
                placeholder="Passcode (shiva)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`px-3 py-1 text-xs rounded-lg bg-black/60 border text-white placeholder-white/40 focus:outline-none ${
                  passcodeError ? 'border-red-500' : 'border-[#F5D061]/40'
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 text-xs rounded-lg bg-[#F5D061] text-[#050204] font-semibold hover:bg-white transition-colors"
              >
                Unlock
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
