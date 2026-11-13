import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Heart, Eye, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { SCRAPBOOK_MEMORIES } from '../data/memories';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Scene04Memories({
  onOpenPhotoModal,
  playMemorySfx,
  onNextScene,
  isTransitioning
}) {
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentMemory = SCRAPBOOK_MEMORIES[activeMemoryIndex];
  const touchStartX = useRef(0);

  const handlePrev = () => {
    if (playMemorySfx) playMemorySfx();
    setActiveMemoryIndex((prev) => (prev - 1 + SCRAPBOOK_MEMORIES.length) % SCRAPBOOK_MEMORIES.length);
  };

  const handleNext = () => {
    if (playMemorySfx) playMemorySfx();
    setActiveMemoryIndex((prev) => (prev + 1) % SCRAPBOOK_MEMORIES.length);
  };

  const handleTouchStart = (e) => {
    if (e.touches[0]) touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches[0]) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 45) {
        handlePrev();
      } else if (diff < -45) {
        handleNext();
      }
    }
  };

  const handleInspect = (mem) => {
    if (playMemorySfx) playMemorySfx();
    onOpenPhotoModal(mem);
  };

  return (
    <section
      id="scene-memories"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.6rem,calc(env(safe-area-inset-top)+2.4rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] bg-[#1A120E] overflow-hidden select-none"
    >
      {/* Rustic Candlelit Wooden Desk Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/scenes/scene04-scrapbook-desk.jpg"
          alt="Vintage Candlelit Scrapbook Desk"
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        {/* Warm Candlelight Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(245,208,97,0.22)_0%,rgba(197,125,93,0.1)_45%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A120E] via-[#1A120E]/70 to-[#1A120E]/60" />
      </div>

      {/* Header */}
      <div className="text-center relative z-10 max-w-3xl px-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-1 sm:mb-2 border border-[#D4AF37]/40 bg-[#2B1E16]/80 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.25)]"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#F5D061]" />
          <span className="font-serif italic text-xs tracking-widest text-[#F5D061] uppercase">
            Scene 04 &bull; Luxury Digital Scrapbook
          </span>
        </motion.div>

        <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF8EE] drop-shadow-[0_4px_30px_rgba(245,208,97,0.35)]">
          Little <span className="bg-gradient-to-r from-[#FFF8EE] via-[#F5D061] to-[#D4AF37] bg-clip-text text-transparent font-display italic">Memories</span>
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#F5D061]/85 max-w-xl mx-auto font-light leading-relaxed mt-0.5 sm:mt-1 hidden sm:block">
          Moments captured in quiet light, woven into the fabric of time.
        </p>
      </div>

      {/* Handcrafted Romantic Scrapbook Desk Composition */}
      <div className="relative z-10 w-full max-w-4xl my-auto flex flex-col items-center px-1">
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex items-center justify-center w-full touch-manipulation"
        >
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute -left-1 sm:left-4 z-30 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[#2B1E16]/90 border border-[#D4AF37]/50 text-[#F5D061] hover:text-[#FFF8EE] flex items-center justify-center cursor-pointer transition-all shadow-xl active:scale-95 hover:border-[#F5D061] touch-manipulation"
            title="Previous memory"
            aria-label="Previous memory"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-1 sm:right-4 z-30 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-[#2B1E16]/90 border border-[#D4AF37]/50 text-[#F5D061] hover:text-[#FFF8EE] flex items-center justify-center cursor-pointer transition-all shadow-xl active:scale-95 hover:border-[#F5D061] touch-manipulation"
            title="Next memory"
            aria-label="Next memory"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Background Ghost Polaroid Cards (Creating Physical Scrapbook Layering) */}
          <div className="absolute max-w-sm sm:max-w-md w-full h-[380px] rounded-2xl bg-[#FFF8EE]/10 border border-[#D4AF37]/20 shadow-2xl -rotate-6 scale-95 pointer-events-none hidden sm:block" />
          <div className="absolute max-w-sm sm:max-w-md w-full h-[380px] rounded-2xl bg-[#FFF8EE]/10 border border-[#D4AF37]/20 shadow-2xl rotate-4 scale-95 pointer-events-none hidden sm:block" />

          {/* Active Scrapbook Polaroid on Textured Warm Parchment */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMemory.id}
              initial={{ opacity: 0, scale: 0.94, rotate: prefersReducedMotion ? 0 : -3 }}
              animate={{ opacity: 1, scale: 1, rotate: prefersReducedMotion ? 0 : 0.5 }}
              exit={{ opacity: 0, scale: 0.94, rotate: prefersReducedMotion ? 0 : 3 }}
              transition={{ duration: 0.45 }}
              className="relative max-w-[92vw] xs:max-w-sm sm:max-w-md w-full rounded-2xl p-3.5 sm:p-6 border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col items-center overflow-hidden z-20"
              style={{
                backgroundImage: `linear-gradient(rgba(43, 30, 22, 0.92), rgba(26, 18, 14, 0.96)), url('/images/assets/luxury-paper-texture.jpg')`,
                backgroundSize: 'cover'
              }}
            >
              {/* Antique Gold Washi Tape Accent */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 shadow-md backdrop-blur-md border border-[#F5D061]/60 rotate-1 flex items-center justify-center text-[9px] sm:text-[10px] uppercase font-sans tracking-widest text-[#FFF8EE] font-semibold z-30"
                style={{ backgroundColor: currentMemory.tapeColor || '#8B4513' }}
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{currentMemory.tag}</span>
              </div>

              {/* Decorative Corner Antique Wax Seal Stamp */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#8B4513] to-[#D4AF37] border border-[#FFE8A3] flex items-center justify-center shadow-md">
                <Heart className="w-3 h-3 text-[#FFF8EE] fill-[#FFF8EE]" />
              </div>

              {/* Polaroid Frame & Photo Container */}
              <div
                onClick={() => handleInspect(currentMemory)}
                className="relative mt-1.5 sm:mt-2 overflow-hidden rounded-xl bg-[#0F0A07] w-full aspect-[4/4.2] border-2 border-[#D4AF37]/40 cursor-pointer group max-h-[28vh] xs:max-h-[32vh] sm:max-h-[38vh] shadow-inner p-1 touch-manipulation"
              >
                <img
                  src={currentMemory.image}
                  alt={currentMemory.caption}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />

                {/* Inspect Button */}
                <div className="absolute bottom-2 right-2 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs text-[#FFF8EE] bg-[#2B1E16]/85 border border-[#D4AF37]/50 flex items-center gap-1 opacity-90 group-hover:opacity-100 shadow-lg backdrop-blur-md">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F5D061]" />
                  <span>Inspect</span>
                </div>
              </div>

              {/* Handwritten Note Calligraphy */}
              <div className="w-full mt-2 sm:mt-3 px-1 text-center">
                <span className="font-serif italic text-[11px] sm:text-xs tracking-wider text-[#F5D061] uppercase font-medium">
                  {currentMemory.caption}
                </span>

                <h4 className="font-serif text-base sm:text-xl font-bold text-[#FFF8EE] mt-0.5 leading-snug">
                  &ldquo;{currentMemory.quote}&rdquo;
                </h4>

                <p className="font-serif italic text-xs sm:text-sm text-[#F5D061]/90 mt-1 leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                  {currentMemory.note}
                </p>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5 mt-2 sm:mt-3">
                {SCRAPBOOK_MEMORIES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMemoryIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer touch-manipulation ${
                      activeMemoryIndex === i ? 'w-5 bg-[#F5D061]' : 'w-2 bg-[#FFF8EE]/20'
                    }`}
                    aria-label={`View memory ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Curiosity CTA Trigger */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button
            onClick={onNextScene}
            disabled={isTransitioning}
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(245,208,97,0.6)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Antique Gold & Warm Parchment Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B2A1E] via-[#D4AF37] to-[#B8860B] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,248,238,0.3),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#FFF8EE]/50 rounded-full group-hover:border-[#FFF8EE] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#1A120E] uppercase">
              Turn Another Page 📖
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#1A120E] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
