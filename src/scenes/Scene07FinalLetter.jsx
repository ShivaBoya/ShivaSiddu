import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, Maximize2 } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthday';
import { triggerCelebrationConfetti } from '../components/CelebrationConfetti';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Scene07FinalLetter({ onRestart, onOpenPhotoModal, playRevealSfx }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { letter, couplePhoto } = BIRTHDAY_CONFIG;

  const handleRevealClick = () => {
    setIsRevealed(true);
    triggerCelebrationConfetti();
    if (playRevealSfx) playRevealSfx();
  };

  return (
    <section
      id="scene-letter"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.6rem,calc(env(safe-area-inset-top)+2.4rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] bg-[#1F050C] overflow-hidden text-center select-none"
    >
      {/* Dark Walnut Wood, Velvet Roses & Letter Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/scenes/scene07-letter-envelope.jpg"
          alt="Luxury Letter Envelope with Red Roses and Wax Seals"
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        {/* Soft Warm Rose Gold & Burgundy Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(232,165,152,0.18)_0%,rgba(46,8,20,0.6)_55%,transparent_80%)] blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F050C] via-[#1F050C]/75 to-[#1F050C]/65" />
      </div>

      {/* PRELUDE STATE: Couple photograph is STRICTLY HIDDEN */}
      {!isRevealed ? (
        <div className="relative z-10 my-auto max-w-2xl mx-auto flex flex-col items-center px-2">
          {/* Opulent Letter Envelope Centerpiece with Roses & Wax Seal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="relative mb-3 sm:mb-5 cursor-pointer group touch-manipulation active:scale-95"
            onClick={handleRevealClick}
          >
            {/* Ambient Halo */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#E8A598]/30 via-[#C77D72]/30 to-[#E8A598]/30 blur-2xl group-hover:opacity-100 opacity-60 transition-opacity" />

            <div className="relative w-64 xs:w-72 sm:w-92 md:w-[420px] rounded-2xl overflow-hidden border-2 border-[#E8A598]/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-102">
              <img
                src="/images/scenes/scene07-letter-envelope.jpg"
                alt="Velvet Letter Envelope with Red Roses"
                className="w-full h-auto object-cover max-h-[28vh] xs:max-h-[32vh] sm:max-h-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F050C]/70 via-transparent to-transparent pointer-events-none" />

              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.25),transparent)] bg-[length:200%_100%] animate-shimmer pointer-events-none" />
            </div>
          </motion.div>

          <h2 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFFDF8] mb-1 sm:mb-2 drop-shadow-[0_4px_30px_rgba(232,165,152,0.4)]">
            {letter.preludeHeading}
          </h2>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#E8A598]/90 max-w-md mx-auto mb-4 sm:mb-6 leading-relaxed font-light">
            Before your journey through this universe concludes, there is one last memory to keep close to your heart.
          </p>

          <button
            onClick={handleRevealClick}
            className="group relative px-7 sm:px-9 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_35px_rgba(199,125,114,0.45)] hover:shadow-[0_0_50px_rgba(232,165,152,0.65)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Deep Burgundy & Rose Gold Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E0814] via-[#8A0F1C] to-[#C77D72] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,253,248,0.3),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#E8A598]/60 rounded-full group-hover:border-[#FFFDF8] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#FFFDF8] uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E8A598]" />
              Reveal The Final Memory
            </span>
          </button>
        </div>
      ) : (
        /* CLIMAX REVEAL STATE: Authentic Couple Photograph & Shiva's Letter */
        <div className="relative z-10 w-full max-w-4xl my-auto flex flex-col items-center overflow-hidden px-1">
          {/* Header */}
          <div className="text-center mb-1.5 sm:mb-3">
            <span className="font-serif italic text-[11px] sm:text-xs tracking-widest text-[#E8A598] uppercase px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full border border-[#E8A598]/40 bg-[#2E0814]/80 backdrop-blur-md shadow-[0_0_20px_rgba(232,165,152,0.3)]">
              The Culmination of The Induverse
            </span>
            <h2 className="font-serif text-xl xs:text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#FFFDF8] via-[#E8A598] to-[#C77D72] bg-clip-text text-transparent mt-0.5 sm:mt-1 drop-shadow-[0_4px_30px_rgba(232,165,152,0.4)]">
              {letter.title}
            </h2>
          </div>

          {/* Side-by-Side on Desktop, Scaled Stack on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 bg-[#2A0914]/90 border border-[#E8A598]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col md:flex-row items-center gap-3 sm:gap-6 overflow-hidden max-h-[66vh] md:max-h-[62vh] backdrop-blur-2xl"
          >
            {/* Opulent Gold & Rose-Gold Framed Couple Photograph Reveal */}
            <div
              className="relative group cursor-pointer w-full md:w-5/12 flex items-center justify-center shrink-0 touch-manipulation"
              onClick={() =>
                onOpenPhotoModal({
                  image: couplePhoto,
                  caption: "Shiva & Indu",
                  subtitle: "A moment of shared warmth and peaceful presence.",
                  quote: "In every universe, some souls are simply meant to share the same sky."
                })
              }
            >
              <div className="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-tr from-[#1F050C] via-[#2E0814] to-[#3E0C1C] border-2 border-[#E8A598]/70 shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_30px_rgba(232,165,152,0.3)] overflow-hidden max-h-[22vh] xs:max-h-[25vh] sm:max-h-[44vh] group-hover:border-[#FFFDF8] transition-colors duration-500">
                {/* Metallic Corner Ornaments */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#E8A598]" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#E8A598]" />
                <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#E8A598]" />
                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#E8A598]" />

                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0F0206]">
                  <img
                    src={couplePhoto}
                    alt="Shiva and Indu"
                    className="w-auto h-full max-h-[19vh] xs:max-h-[22vh] sm:max-h-[40vh] object-contain rounded-lg shadow-xl transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] text-[#FFFDF8] bg-[#1F050C]/85 border border-[#E8A598]/50 flex items-center gap-1 opacity-90 group-hover:opacity-100 shadow-lg backdrop-blur-md">
                    <Maximize2 className="w-3 h-3 text-[#E8A598]" />
                    <span>Enlarge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shiva's Letter on Warm Ivory Parchment with Internal Scroll */}
            <div
              className="w-full md:w-7/12 text-left overflow-y-auto flex-1 min-h-[20vh] max-h-[34vh] sm:max-h-[46vh] pr-2 custom-scrollbar rounded-2xl p-3 sm:p-5 border border-[#E8A598]/40 shadow-inner touch-pan-y"
              style={{
                backgroundImage: `linear-gradient(rgba(31, 5, 12, 0.94), rgba(20, 3, 8, 0.97)), url('/images/assets/luxury-paper-texture.jpg')`,
                backgroundSize: 'cover'
              }}
            >
              <h3 className="font-display italic text-xl xs:text-2xl sm:text-3xl text-[#E8A598] mb-2 sm:mb-3">
                {letter.salutation}
              </h3>

              <div className="space-y-2.5 sm:space-y-3 font-serif text-xs sm:text-sm text-[#FFFDF8]/95 leading-relaxed font-normal">
                {letter.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-[#E8A598]/30 text-right">
                <p className="font-display italic text-base sm:text-xl text-[#E8A598]">
                  {letter.signOff}
                </p>
                <p className="font-serif text-[11px] sm:text-xs tracking-widest text-[#FFFDF8] uppercase font-semibold mt-0.5">
                  {letter.signature}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Replay Journey Button */}
      <div className="relative z-10 flex flex-col items-center">
        <button
          onClick={onRestart}
          className="group inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full border border-[#E8A598]/40 text-xs font-serif text-[#E8A598] hover:text-[#FFFDF8] hover:border-[#FFFDF8] bg-[#2E0814]/70 transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md touch-manipulation"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-500" />
          <span>Revisit Your Universe ✨</span>
        </button>
      </div>
    </section>
  );
}
