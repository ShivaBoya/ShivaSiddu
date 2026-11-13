import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function CinematicTransitionOverlay({
  isTransitioning,
  transitionType,
  onMidpoint
}) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isTransitioning) return;

    // Midpoint trigger to switch scene under the transition veil
    const midTimer = setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, prefersReducedMotion ? 350 : 650);

    return () => clearTimeout(midTimer);
  }, [isTransitioning, onMidpoint, prefersReducedMotion]);

  if (!isTransitioning) return null;

  // Reduced motion: Clean velvet fade
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 bg-midnight pointer-events-none"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden select-none">
      {/* 1. Rose Bloom & Particle Burst (Scene 01 -> 02) */}
      {transitionType === 'rose-burst' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-radial from-wine via-midnight to-midnight flex items-center justify-center"
        >
          {/* Shockwave circle */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: [0.2, 2.5, 4], opacity: [0.9, 0.6, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-80 h-80 rounded-full border-2 border-champagne shadow-[0_0_50px_#F3D8C4]"
          />
          {/* Glowing Rose Core */}
          <motion.div
            initial={{ scale: 0.5, rotate: 0 }}
            animate={{ scale: [0.5, 1.4, 2], rotate: 180, opacity: [1, 1, 0] }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute text-6xl filter drop-shadow-[0_0_35px_#D98BA9]"
          >
            🌹
          </motion.div>
          {/* Bursting Stardust sparks */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI) / 8) * 350,
                y: Math.sin((i * Math.PI) / 8) * 350,
                opacity: 0,
                scale: 0.2
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute w-2 h-2 rounded-full bg-champagne shadow-[0_0_12px_#FFF8F5]"
            />
          ))}
        </motion.div>
      )}

      {/* 2. Cosmic Hyperdrive Zoom (Scene 02 -> 03) */}
      {transitionType === 'cosmic-zoom' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-midnight flex items-center justify-center overflow-hidden"
        >
          {/* Radial light burst */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose/40 via-burgundy/60 to-midnight" />

          {/* Streaking star lines rushing towards viewer */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0.1, opacity: 0.2 }}
                animate={{ scaleY: [0.1, 8, 15], opacity: [0.2, 1, 0] }}
                transition={{ duration: 1.0, ease: "easeInOut", delay: (i % 3) * 0.05 }}
                className="absolute w-[2px] h-32 bg-gradient-to-t from-transparent via-champagne to-white origin-center"
                style={{
                  transform: `rotate(${angle}deg) translateY(-80px)`,
                  filter: 'drop-shadow(0 0 8px #F3D8C4)'
                }}
              />
            );
          })}

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.8, 3], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, ease: "easeIn" }}
            className="w-48 h-48 rounded-full bg-champagne/30 blur-2xl"
          />
        </motion.div>
      )}

      {/* 3. Photos Floating & Converging into Scrapbook (Scene 03 -> 04) */}
      {transitionType === 'photo-converge' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0 bg-midnight/95 backdrop-blur-2xl flex items-center justify-center"
        >
          {/* Converging photo frames animation */}
          {[-120, -60, 0, 60, 120].map((offset, i) => (
            <motion.div
              key={i}
              initial={{ x: offset * 3, y: (i % 2 === 0 ? -150 : 150), rotate: (i - 2) * 15, scale: 0.8, opacity: 0.8 }}
              animate={{ x: 0, y: 0, rotate: 0, scale: 1.1, opacity: [0.8, 1, 0] }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute w-36 h-48 rounded-xl bg-gradient-to-b from-[#2a1723] to-[#1a0e17] border border-champagne/50 shadow-2xl p-2 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-lg bg-burgundy/40 border border-white/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose fill-rose/40 animate-pulse" />
              </div>
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-wine/50 via-transparent to-midnight" />
        </motion.div>
      )}

      {/* 4. Cinematic Page-Turn & Petal Shower (Scene 04 -> 05) */}
      {transitionType === 'page-turn-petals' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-midnight overflow-hidden"
        >
          {/* Peeling Page effect */}
          <motion.div
            initial={{ x: 0, rotateY: 0 }}
            animate={{ x: '-100%', rotateY: -75 }}
            transition={{ duration: 1.0, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 bg-gradient-to-r from-[#20101a] via-[#3a162b] to-[#120810] border-r-4 border-champagne/40 origin-left shadow-2xl"
          />

          {/* Petal burst emerging from the page turn */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${Math.random() * 80 + 10}vw`,
                y: '-10vh',
                rotate: 0,
                opacity: 0
              }}
              animate={{
                y: '110vh',
                x: `+=${(Math.random() - 0.5) * 150}px`,
                rotate: 360,
                opacity: [0, 0.9, 0]
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.4,
                ease: "easeOut",
                delay: Math.random() * 0.2
              }}
              className="absolute text-2xl filter drop-shadow-md"
            >
              🌸
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 5. Butterfly Swarm into Birthday Starlight (Scene 05 -> 06) */}
      {transitionType === 'butterfly-lights' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-radial from-burgundy via-midnight to-midnight flex items-center justify-center overflow-hidden"
        >
          {/* Glowing butterflies fluttering across */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '-15vw',
                y: `${20 + i * 6}vh`,
                scale: 0.6 + (i % 3) * 0.3,
                opacity: 0
              }}
              animate={{
                x: '115vw',
                y: `${20 + i * 6 + Math.sin(i) * 60}vh`,
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 1.1 + (i % 4) * 0.15,
                ease: "easeInOut",
                delay: i * 0.05
              }}
              className="absolute text-3xl filter drop-shadow-[0_0_12px_#F3D8C4]"
            >
              🦋
            </motion.div>
          ))}

          {/* Golden Bokeh light spheres */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 2.5], opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.0, delay: 0.2 + i * 0.08 }}
              className="absolute rounded-full bg-gradient-to-tr from-champagne to-rose blur-xl"
              style={{
                width: `${120 + i * 20}px`,
                height: `${120 + i * 20}px`,
                left: `${10 + i * 8}%`,
                top: `${20 + (i % 5) * 12}%`
              }}
            />
          ))}
        </motion.div>
      )}

      {/* 6. Candle Extinguish, Darkness & Golden Envelope Reveal (Scene 06 -> 07) */}
      {transitionType === 'candle-darkness-gold' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 bg-midnight/98 flex flex-col items-center justify-center"
        >
          {/* Brief cinematic smoke/darkness veil */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-black/80"
          />

          {/* Golden Letter / Starlight Emblem emerging */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="relative z-10 w-24 h-24 rounded-full border-2 border-champagne flex items-center justify-center shadow-[0_0_40px_#F3D8C4]"
          >
            <Sparkles className="w-12 h-12 text-champagne animate-spin" style={{ animationDuration: '4s' }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: [0, 1, 0], y: [15, 0, -10] }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="relative z-10 font-serif italic text-champagne text-lg tracking-widest mt-4 uppercase"
          >
            One final thing...
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}

