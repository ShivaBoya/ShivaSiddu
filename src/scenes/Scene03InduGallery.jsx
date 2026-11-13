import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, Award, ChevronLeft, ChevronRight, Heart, Eye, ArrowRight } from 'lucide-react';
import { INDU_GALLERY } from '../data/memories';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Scene03InduGallery({
  onOpenPhoto,
  playMemorySfx,
  onNextScene,
  isTransitioning
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const touchStartX = useRef(0);

  const activeItem = INDU_GALLERY[currentIndex];

  const handleSelectPhoto = (idx) => {
    if (playMemorySfx) playMemorySfx();
    setCurrentIndex(idx);
    setTilt({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    if (playMemorySfx) playMemorySfx();
    setCurrentIndex((prev) => (prev - 1 + INDU_GALLERY.length) % INDU_GALLERY.length);
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (playMemorySfx) playMemorySfx();
    setCurrentIndex((prev) => (prev + 1) % INDU_GALLERY.length);
    setTilt({ x: 0, y: 0 });
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

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="scene-gallery"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.6rem,calc(env(safe-area-inset-top)+2.4rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] bg-[#0F1115] overflow-hidden select-none"
    >
      {/* Museum Gallery Salon Backdrop & Directional Spotlights */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/scenes/scene03-museum-gallery.jpg"
          alt="Luxury Art Museum Gallery Salon"
          className="w-full h-full object-cover opacity-25 scale-105"
        />
        {/* Overhead Directional Gallery Spotlight Cones */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(243,216,196,0.22)_0%,rgba(212,175,55,0.1)_45%,transparent_75%)] blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-[#0F1115]/60" />
      </div>

      {/* Header */}
      <div className="text-center relative z-10 max-w-3xl px-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-1 sm:mb-2 border border-[#E5C583]/40 bg-[#161920]/80 backdrop-blur-md shadow-[0_0_20px_rgba(229,197,131,0.25)]"
        >
          <Award className="w-3.5 h-3.5 text-[#F3D8C4]" />
          <span className="font-serif italic text-xs tracking-widest text-[#F3D8C4] uppercase">
            Scene 03 &bull; Luxury Editorial Exhibition
          </span>
        </motion.div>

        <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFFDF7] drop-shadow-[0_4px_30px_rgba(229,197,131,0.35)]">
          The Beauty of <span className="bg-gradient-to-r from-[#FFFDF7] via-[#F3D8C4] to-[#D4AF37] bg-clip-text text-transparent font-display italic">Indu</span>
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#F3D8C4]/85 max-w-xl mx-auto font-light leading-relaxed mt-0.5 sm:mt-1 hidden sm:block">
          &ldquo;A collection of little moments, each one beautiful in its own way.&rdquo;
        </p>
      </div>

      {/* Grand Museum Baroque Exhibition Frame & Editorial Centerpiece */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full max-w-5xl my-auto flex flex-col items-center px-1 touch-manipulation"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 bg-[#161920]/90 border border-[#E5C583]/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col md:flex-row items-center gap-3 sm:gap-6 md:gap-10 overflow-hidden backdrop-blur-2xl"
          >
            {/* Museum Gilded Picture Frame with 3D Parallax Tilt */}
            <div
              onClick={() => onOpenPhoto(currentIndex)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: prefersReducedMotion
                  ? 'none'
                  : `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="relative w-full md:w-1/2 flex items-center justify-center cursor-pointer group touch-manipulation"
            >
              {/* Opulent Antique Gold Baroque Moulding Frame */}
              <div className="relative p-2.5 sm:p-4.5 rounded-2xl bg-gradient-to-tr from-[#1B1812] via-[#2A241A] to-[#3B3224] border-2 sm:border-4 border-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.2)] group-hover:border-[#F3D8C4] transition-colors duration-500 max-h-[30vh] xs:max-h-[34vh] sm:max-h-[48vh] md:max-h-[52vh]">
                {/* Ornate Gold Filigree Corner Reliefs */}
                <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFE8A3]" />
                <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFE8A3]" />
                <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFE8A3]" />
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFE8A3]" />

                {/* Inner Charcoal Velvet Matting & Photograph Container */}
                <div className="relative overflow-hidden rounded-xl border border-black/80 bg-[#0A0B0E] shadow-inner p-0.5 sm:p-1">
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    className="w-auto h-full max-h-[25vh] xs:max-h-[29vh] sm:max-h-[43vh] md:max-h-[47vh] object-contain rounded-lg transition-transform duration-700 group-hover:scale-102"
                  />

                  {/* Museum Glass Specular Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-700" />

                  {/* View Full Size Pill */}
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs text-[#FFFDF7] bg-[#161920]/80 border border-[#E5C583]/50 flex items-center gap-1 opacity-90 group-hover:opacity-100 shadow-xl backdrop-blur-md">
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F3D8C4]" />
                    <span>Zoom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* High-Fashion Editorial Description & Museum Plaque */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left py-0.5 sm:py-1">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <span className="w-6 sm:w-8 h-[1px] bg-[#D4AF37]" />
                  <span className="font-serif italic text-[11px] sm:text-xs tracking-widest text-[#F3D8C4] uppercase">
                    Portrait 0{currentIndex + 1} of 05 &bull; {activeItem.accent}
                  </span>
                </div>

                <h3 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFDF7] mb-1 sm:mb-2">
                  {activeItem.title}
                </h3>

                <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#F3D8C4]/90 mb-2 sm:mb-4 leading-relaxed font-normal">
                  {activeItem.subtitle}
                </p>

                {/* Brushed Brass Museum Plaque with Quote */}
                <div className="p-2.5 sm:p-4 rounded-xl border border-[#E5C583]/30 bg-[#12141A]/90 relative overflow-hidden shadow-inner">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FFFDF7] via-[#D4AF37] to-[#B8860B]" />
                  <p className="font-serif italic text-[11px] sm:text-xs md:text-sm text-[#FFFDF7]/95 pl-1.5 sm:pl-2 leading-relaxed">
                    &ldquo;{activeItem.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Navigation Arrows & Gilded Selector Badges */}
              <div className="flex items-center justify-between mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1D24] border border-[#E5C583]/40 text-[#F3D8C4] hover:text-[#FFFDF7] flex items-center justify-center transition-all cursor-pointer shadow-md hover:border-[#D4AF37] active:scale-95 touch-manipulation"
                    title="Previous portrait"
                    aria-label="Previous portrait"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1D24] border border-[#E5C583]/40 text-[#F3D8C4] hover:text-[#FFFDF7] flex items-center justify-center transition-all cursor-pointer shadow-md hover:border-[#D4AF37] active:scale-95 touch-manipulation"
                    title="Next portrait"
                    aria-label="Next portrait"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* 5 Gilded Indicator Badges */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {INDU_GALLERY.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPhoto(idx)}
                      className={`h-8 sm:h-8 px-2.5 sm:px-3 rounded-full text-xs font-serif transition-all duration-300 cursor-pointer touch-manipulation active:scale-95 ${
                        currentIndex === idx
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0B0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)] scale-105'
                          : 'bg-white/5 text-[#F3D8C4]/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
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
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:shadow-[0_0_45px_rgba(243,216,196,0.55)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Charcoal & Champagne Gold Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A241A] via-[#D4AF37] to-[#B8860B] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#FFFDF7]/50 rounded-full group-hover:border-[#FFFDF7] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#0A0B0E] uppercase">
              See What Makes You Special 💗
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#0A0B0E] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
