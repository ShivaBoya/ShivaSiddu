import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Moon, ArrowRight } from 'lucide-react';
import { GARDEN_FLOWERS } from '../data/messages';
import { triggerGentleStars } from '../components/CelebrationConfetti';
import { useReducedMotion } from '../hooks/useReducedMotion';
import EnchantedGardenCanvas from '../components/EnchantedGardenCanvas';
import BotanicalFlower from '../components/BotanicalFlower';

export default function Scene05Garden({
  playFlowerSfx,
  onNextScene,
  isTransitioning
}) {
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [bloomedFlowers, setBloomedFlowers] = useState(new Set());
  const [isWishTriggered, setIsWishTriggered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleFlowerClick = (flower) => {
    setSelectedFlower(flower);
    setBloomedFlowers((prev) => new Set([...prev, flower.id]));
    triggerGentleStars();
    if (playFlowerSfx) playFlowerSfx();
  };

  const handleMakeWish = () => {
    if (isWishTriggered || isTransitioning) return;
    setIsWishTriggered(true);
    triggerGentleStars();
    if (playFlowerSfx) playFlowerSfx();

    // After 900ms of grand all-flower bloom and firefly surge, transition to birthday celebration
    setTimeout(() => {
      onNextScene();
    }, 900);
  };

  return (
    <section
      id="scene-garden"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.4rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(1.3rem,calc(env(safe-area-inset-bottom)+0.8rem))] bg-[#071F15] overflow-hidden select-none"
    >
      {/* 1. FULL-BLEED ENCHANTED GARDEN ARTWORK BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          src="/images/scenes/scene05-enchanted-garden.jpg"
          alt="Enchanted Fairy Garden with Glowing Lanterns"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.04, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full object-cover object-center opacity-85"
        />
        {/* Atmospheric Moonlight & Emerald Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,31,21,0.5)_65%,#071F15_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071F15] via-transparent to-[#071F15]/80" />
      </div>

      {/* 2. LIVING ENCHANTED GARDEN CANVAS (Fireflies, Petals, Butterflies) */}
      <EnchantedGardenCanvas isWishTriggered={isWishTriggered} />

      {/* 3. VOLUMETRIC MOONLIGHT & LANTERN GLOWS */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,232,163,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(186,104,200,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* 4. SCENE HEADER */}
      <div className="text-center relative z-20 max-w-2xl px-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-1 sm:mb-2 border border-[#80E27E]/50 bg-[#0C3022]/85 backdrop-blur-md shadow-[0_0_20px_rgba(128,226,126,0.35)]"
        >
          <Moon className="w-3.5 h-3.5 text-[#FFE8A3]" />
          <span className="font-serif italic text-xs tracking-widest text-[#FFE8A3] uppercase">
            Scene 05 &bull; The Enchanted Sanctuary
          </span>
        </motion.div>

        <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_30px_rgba(255,107,157,0.5)]">
          A Garden for <span className="bg-gradient-to-r from-[#FF6B9D] via-[#FFE8A3] to-[#80E27E] bg-clip-text text-transparent font-display italic">Indu</span>
        </h2>
        <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#E1BEE7]/90 max-w-lg mx-auto font-light leading-relaxed mt-0.5 sm:mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Five sacred blossoms bloom along the moonlit path. Touch each flower to unveil its secret.
        </p>
      </div>

      {/* 5. FIVE INTERACTIVE BOTANICAL BLOSSOMS (NO CARDS - Positioned in Garden Space) */}
      <div className="relative z-20 w-full max-w-6xl my-auto flex-1 flex items-center justify-center">
        {/* DESKTOP MEADOW LAYOUT (>= 768px): Natural clearing positioning across the garden banks */}
        <div className="hidden md:flex items-center justify-between w-full px-6 lg:px-12">
          {GARDEN_FLOWERS.map((flower) => {
            const isBloomed = bloomedFlowers.has(flower.id);
            return (
              <BotanicalFlower
                key={flower.id}
                flower={flower}
                isBloomed={isBloomed}
                isAllBloomed={isWishTriggered}
                onClick={() => handleFlowerClick(flower)}
              />
            );
          })}
        </div>

        {/* MOBILE PORTRAIT LAYOUT (< 768px): Staggered constellation layout over the winding garden path */}
        <div className="md:hidden relative w-full h-[52vh] max-h-[460px] flex items-center justify-center px-2">
          {/* Flower 1: Top Left */}
          <div className="absolute left-[8%] top-[8%]">
            <BotanicalFlower
              flower={GARDEN_FLOWERS[0]}
              isBloomed={bloomedFlowers.has(GARDEN_FLOWERS[0].id)}
              isAllBloomed={isWishTriggered}
              onClick={() => handleFlowerClick(GARDEN_FLOWERS[0])}
            />
          </div>

          {/* Flower 2: Top Right */}
          <div className="absolute right-[8%] top-[8%]">
            <BotanicalFlower
              flower={GARDEN_FLOWERS[1]}
              isBloomed={bloomedFlowers.has(GARDEN_FLOWERS[1].id)}
              isAllBloomed={isWishTriggered}
              onClick={() => handleFlowerClick(GARDEN_FLOWERS[1])}
            />
          </div>

          {/* Flower 3: Center Stage Clearing */}
          <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
            <BotanicalFlower
              flower={GARDEN_FLOWERS[2]}
              isBloomed={bloomedFlowers.has(GARDEN_FLOWERS[2].id)}
              isAllBloomed={isWishTriggered}
              onClick={() => handleFlowerClick(GARDEN_FLOWERS[2])}
            />
          </div>

          {/* Flower 4: Bottom Left */}
          <div className="absolute left-[8%] bottom-[6%]">
            <BotanicalFlower
              flower={GARDEN_FLOWERS[3]}
              isBloomed={bloomedFlowers.has(GARDEN_FLOWERS[3].id)}
              isAllBloomed={isWishTriggered}
              onClick={() => handleFlowerClick(GARDEN_FLOWERS[3])}
            />
          </div>

          {/* Flower 5: Bottom Right */}
          <div className="absolute right-[8%] bottom-[6%]">
            <BotanicalFlower
              flower={GARDEN_FLOWERS[4]}
              isBloomed={bloomedFlowers.has(GARDEN_FLOWERS[4].id)}
              isAllBloomed={isWishTriggered}
              onClick={() => handleFlowerClick(GARDEN_FLOWERS[4])}
            />
          </div>
        </div>
      </div>

      {/* 6. ETHEREAL SECRET MESSAGE MODAL */}
      <AnimatePresence>
        {selectedFlower && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071F15]/85 backdrop-blur-xl touch-manipulation"
            onClick={() => setSelectedFlower(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl p-5 sm:p-8 border-2 border-[#80E27E]/60 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-center overflow-hidden bg-[#0C3022]/95 max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFlower(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#FFE8A3] hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-95"
                title="Close secret"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing Bloomed Blossom Showcase */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <BotanicalFlower flower={selectedFlower} isBloomed={true} isAllBloomed={false} />
              </div>

              <span className="font-serif italic text-xs tracking-widest text-[#FFE8A3] uppercase">
                {selectedFlower.name} &bull; Sacred Truth
              </span>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
                {selectedFlower.headline}
              </h3>

              {/* Personal Heartfelt Message from Shiva */}
              <div className="p-3.5 sm:p-5 rounded-2xl border border-[#80E27E]/40 bg-[#071F15]/90 my-3 sm:my-4 text-left shadow-inner">
                <p className="font-serif italic text-xs sm:text-sm text-[#FFF]/95 leading-relaxed">
                  &ldquo;{selectedFlower.message}&rdquo;
                </p>
                {selectedFlower.quote && (
                  <p className="font-sans text-[11px] text-[#FFE8A3]/90 mt-2.5 pt-2 border-t border-white/10">
                    &bull; {selectedFlower.quote}
                  </p>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-[#E1BEE7]/90 font-sans italic">
                A blossom that blooms forever in the Induverse.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. BOTTOM CURIOSITY CTA TRIGGER (MAKE A WISH 🌸) */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <motion.button
            onClick={handleMakeWish}
            disabled={isWishTriggered || isTransitioning}
            animate={
              isWishTriggered
                ? { scale: [1, 1.08, 1], boxShadow: '0 0 50px rgba(255,232,163,0.85)' }
                : {}
            }
            transition={{ duration: 0.5 }}
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(255,107,157,0.45)] hover:shadow-[0_0_45px_rgba(128,226,126,0.65)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Emerald, Floral Pink & Champagne Gold Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C3022] via-[#FF6B9D] to-[#BA68C8] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,232,163,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#FFE8A3]/60 rounded-full group-hover:border-[#FFE8A3] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Make a Wish 🌸
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#FFE8A3] group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
