import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data/birthday';
import { triggerCelebrationConfetti } from '../components/CelebrationConfetti';
import { useReducedMotion } from '../hooks/useReducedMotion';

// 6 Exact Candle Coordinates on the Gourmet Celestial Cake (% of hero container)
const CANDLE_COORDINATES = [
  { id: 0, x: 32.2, y: 26.5, height: 'h-10' }, // Leftmost
  { id: 1, x: 39.2, y: 23.5, height: 'h-11' }, // Second left
  { id: 2, x: 41.8, y: 20.2, height: 'h-12' }, // Third left
  { id: 3, x: 51.6, y: 17.0, height: 'h-14' }, // Center tall hero candle
  { id: 4, x: 61.2, y: 22.0, height: 'h-11' }, // Fifth right
  { id: 5, x: 69.4, y: 24.2, height: 'h-10' }  // Rightmost
];

// Realistic Flickering Candle Flame with Hot Blue Core & Amber Heat Halo
function RealisticFlame({ candleIndex, isProminent }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center w-8 h-14 pointer-events-none select-none">
      {/* Outer Radiant Heat Halo */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1, opacity: 0.6 }
            : {
                scale: isProminent ? [1.2, 1.6, 1.15, 1.5, 1.2] : [1, 1.35, 0.9, 1.25, 1],
                opacity: isProminent ? [0.8, 1, 0.75, 1, 0.8] : [0.6, 0.95, 0.55, 0.9, 0.6]
              }
        }
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: candleIndex * 0.16
        }}
        className="absolute w-12 h-14 rounded-full bg-gradient-to-t from-amber-500/50 via-yellow-300/40 to-transparent blur-md pointer-events-none"
      />

      {/* Main Flame Teardrop */}
      <motion.div
        animate={
          prefersReducedMotion
            ? { scale: 1 }
            : {
                scaleY: [1, 1.25, 0.92, 1.15, 1],
                scaleX: [1, 0.88, 1.12, 0.94, 1],
                rotate: [0, 3.5, -3, 2.5, 0]
              }
        }
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: candleIndex * 0.2
        }}
        className={`relative w-4.5 rounded-t-full rounded-b-md bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 origin-bottom shadow-[0_0_20px_#FFD700,0_0_35px_#FF9100] ${
          isProminent ? 'h-10 shadow-[0_0_30px_#FFD700,0_0_50px_#FFA000]' : 'h-8'
        }`}
      >
        {/* Hot Blue Wick Core */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full bg-cyan-300 opacity-95 blur-[0.2px]" />
      </motion.div>
    </div>
  );
}

// Dissipating Candle Smoke Trail Component
function CandleSmoke({ candleIndex }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.75, 0.45, 0],
        y: [0, -35, -70, -115],
        x: [0, candleIndex % 2 === 0 ? -14 : 14, candleIndex % 2 === 0 ? 10 : -10],
        scale: [0.5, 1.3, 2.1, 2.8]
      }}
      transition={{ duration: 3.2, ease: 'easeOut' }}
      className="absolute -top-6 w-4 h-8 rounded-full bg-white/45 blur-sm pointer-events-none"
    />
  );
}

export default function Scene06BirthdayCake({
  onNextScene,
  playCandleSfx,
  isTransitioning
}) {
  // Array of 6 boolean states for individual candle tap interaction
  const [candles, setCandles] = useState([true, true, true, true, true, true]);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isProminent, setIsProminent] = useState(false);
  const [isCinematicPause, setIsCinematicPause] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const allCandlesOut = candles.every((lit) => !lit);

  // Tap a single candle to extinguish it
  const handleTapCandle = (index) => {
    if (!candles[index]) return;
    const nextCandles = [...candles];
    nextCandles[index] = false;
    setCandles(nextCandles);
    if (playCandleSfx) playCandleSfx();
  };

  // Click "MAKE A WISH" to extinguish all candles at once
  const handleBlowAllCandles = () => {
    if (allCandlesOut) {
      // Relight option
      setCandles([true, true, true, true, true, true]);
      setHasCelebrated(false);
      setIsCinematicPause(false);
      return;
    }

    setIsProminent(true);
    setCandles([false, false, false, false, false, false]);
    if (playCandleSfx) playCandleSfx();
  };

  // When all candles go out, trigger the cinematic suspense pause then celebration
  useEffect(() => {
    if (allCandlesOut && !hasCelebrated) {
      setIsCinematicPause(true);

      // 1.2s Cinematic suspenseful pause before celebration explosion
      const timer = setTimeout(() => {
        setIsCinematicPause(false);
        setHasCelebrated(true);
        triggerCelebrationConfetti();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [allCandlesOut, hasCelebrated]);

  const celebration = BIRTHDAY_CONFIG.celebration;

  return (
    <section
      id="scene-birthday"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.4rem,calc(env(safe-area-inset-top)+2rem))] pb-[max(1.3rem,calc(env(safe-area-inset-bottom)+0.8rem))] bg-[#061024] overflow-hidden text-center select-none"
    >
      {/* 1. MIDNIGHT BALLROOM & CELESTIAL BOKEH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Deep Midnight Blue Atmospheric Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0C1B3D_0%,#061024_70%,#030814_100%)]" />

        {/* Ambient Candlelight Glow Cone */}
        <motion.div
          animate={
            allCandlesOut
              ? { opacity: 0.15, scale: 0.9 }
              : { opacity: [0.65, 0.85, 0.65], scale: [1, 1.05, 1] }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(255,183,3,0.22)_0%,rgba(11,27,61,0.5)_50%,transparent_75%)] blur-3xl"
        />

        {/* Floating Golden Celebration Dust */}
        {!prefersReducedMotion && (
          <>
            <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#FFD700] blur-[1px] animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-[#FFE57F] blur-[1.5px] animate-ping" />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-[#FFA000] blur-[1px] opacity-75" />
            <div className="absolute top-1/2 right-1/5 w-1.5 h-1.5 rounded-full bg-[#FFD700] blur-[0.5px]" />
          </>
        )}
      </div>

      {/* 2. SCENE HEADER (Sized gracefully so it does not compete with the cake) */}
      <div className="relative z-20 max-w-2xl px-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-1 sm:mb-1.5 border border-[#FFD700]/40 bg-[#0B1B3D]/85 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.3)]"
        >
          <Gift className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="font-serif italic text-xs tracking-widest text-[#FFD700] uppercase">
            Scene 06 &bull; The Celebration
          </span>
        </motion.div>

        <p className="font-serif italic text-xs sm:text-base text-[#F3D8C4] mb-0.5">
          &ldquo;Today is not just another day.&rdquo;
        </p>

        <h2 className="font-serif text-xl xs:text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#FFFDF7] via-[#FFD700] to-[#FFA000] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(255,215,0,0.5)]">
          {celebration.mainHeading}
        </h2>
      </div>

      {/* 3. HERO OBJECT: THE REALISTIC GOURMET CELESTIAL CAKE WITH INTERACTIVE CANDLES */}
      <div className="relative z-20 my-auto flex flex-col items-center w-full px-2">
        {/* Wish Prompt / Relight Pill */}
        <div className="mb-1.5 sm:mb-3">
          <button
            onClick={handleBlowAllCandles}
            className={`group px-5 sm:px-7 py-2 min-h-[44px] rounded-full border transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-xl backdrop-blur-md touch-manipulation active:scale-95 ${
              !allCandlesOut
                ? 'border-[#FFD700] bg-[#0B1B3D]/90 shadow-[0_0_25px_rgba(255,215,0,0.5)] animate-pulse'
                : 'border-white/30 bg-[#061024]/90 opacity-90 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FFD700] group-hover:rotate-45 transition-transform" />
            <span className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-white uppercase">
              {!allCandlesOut ? celebration.cakePrompt : "Wish Granted ✨ Tap to Re-light"}
            </span>
          </button>
        </div>

        {/* The Central Hero Cake Container (Feather-masked into midnight atmosphere) */}
        <div className="relative w-[90vw] xs:w-[350px] sm:w-[440px] md:w-[490px] h-[38vh] xs:h-[42vh] sm:h-[46vh] md:h-[48vh] max-h-[450px] flex items-center justify-center select-none">
          {/* Gourmet Realistic Royal Blue Cake Artwork */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle at 50% 55%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0) 78%)',
              maskImage:
                'radial-gradient(circle at 50% 55%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0) 78%)'
            }}
          >
            <img
              src="/images/scenes/scene06-celestial-cake.jpg"
              alt="Gourmet Celestial Royal Blue Birthday Cake with Golden Stars"
              className="w-full h-full object-cover object-center scale-105 drop-shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
              loading="eager"
            />

            {/* Ambient Chiaroscuro Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061024]/70 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* 6 Interactive Candle Hotspots Physically Mapped onto the Cake Candles */}
          {CANDLE_COORDINATES.map((candle, index) => {
            const isLit = candles[index];

            return (
              <div
                key={candle.id}
                onClick={() => handleTapCandle(index)}
                style={{ left: `${candle.x}%`, top: `${candle.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full w-12 h-16 flex flex-col items-center justify-end cursor-pointer touch-manipulation z-30 group"
                title={isLit ? "Tap to blow this candle!" : "Extinguished candle"}
              >
                <AnimatePresence mode="wait">
                  {isLit ? (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group-hover:scale-115 transition-transform"
                    >
                      <RealisticFlame candleIndex={index} isProminent={isProminent} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative flex flex-col items-center justify-end"
                    >
                      {/* Burnt Wick Cap over extinguished candle to conceal photograph flame */}
                      <div className="w-4 h-7 rounded-full bg-[#061024]/95 blur-[0.8px] -mb-1 flex flex-col items-center justify-end shadow-md">
                        <div className="w-1 h-4 bg-neutral-900 rounded-t-sm" />
                      </div>
                      <CandleSmoke candleIndex={index} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Tap Candle Hint */}
        {!allCandlesOut && (
          <p className="text-[10px] sm:text-xs text-[#FFD700]/75 font-mono tracking-wider mt-1">
            ✦ TAP CANDLES TO BLOW OUT FLAMES ✦
          </p>
        )}

        {/* Celebration Wish Blessing (Appears when candles are blown) */}
        <AnimatePresence>
          {hasCelebrated && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-2 max-w-lg px-3 py-2 rounded-2xl bg-[#0B1B3D]/90 border border-[#FFD700]/50 shadow-[0_0_30px_rgba(255,215,0,0.4)] backdrop-blur-md"
            >
              <p className="font-serif italic text-xs sm:text-sm text-[#FFFDF7] leading-relaxed">
                &ldquo;{celebration.blownMessage}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM CURIOSITY CTA TRIGGER (OPEN YOUR FINAL SURPRISE) */}
      <div className="relative z-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button
            onClick={onNextScene}
            disabled={isTransitioning}
            className={`group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 cursor-pointer touch-manipulation active:scale-95 ${
              hasCelebrated
                ? 'shadow-[0_0_40px_rgba(255,215,0,0.65)] hover:shadow-[0_0_60px_rgba(255,215,0,0.85)] animate-bounce'
                : 'shadow-[0_0_30px_rgba(255,215,0,0.35)] hover:shadow-[0_0_45px_rgba(255,215,0,0.55)]'
            }`}
          >
            {/* Midnight Navy & Champagne Gold Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3D] via-[#D4AF37] to-[#FFA000] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#FFFDF7]/60 rounded-full group-hover:border-white transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-[#061024] uppercase drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
              Open Your Final Surprise ❤️
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#061024] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
