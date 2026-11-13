import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const IMAGES_TO_PRELOAD = [
  '/images/indu/indu-01.jpg',
  '/images/indu/indu-02.jpg',
  '/images/indu/indu-03.jpg',
  '/images/indu/indu-04.jpg',
  '/images/indu/indu-05.jpg',
  '/images/indu/shiva-indu.jpg' // Preloaded in memory without displaying
];

export default function IntroLoader({ onComplete }) {
  const [progress, setProgress] = useState(10);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const total = IMAGES_TO_PRELOAD.length;

    const handleSingleLoad = () => {
      loadedCount++;
      const currentPct = Math.round(15 + (loadedCount / total) * 80);
      setProgress((prev) => Math.max(prev, currentPct));

      if (loadedCount >= total) {
        finishLoading();
      }
    };

    // Preload each image
    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleSingleLoad;
      img.onerror = handleSingleLoad; // Gracefully continue on error
    });

    // Safety timeout: Never leave user stuck on loader, cap at 3.5s max
    const timer = setTimeout(() => {
      finishLoading();
    }, 3500);

    const finishLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setIsDone(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 800); // Wait for fade-out transition
      }, 500);
    };

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-midnight select-none px-6 text-center"
        >
          {/* Radial ambient glow */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-burgundy/30 blur-[130px] pointer-events-none" />
          <div className="absolute w-[250px] h-[250px] rounded-full bg-rose/15 blur-[100px] pointer-events-none" />

          {/* Golden Centerpiece Emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative mb-8"
          >
            <div className="w-20 h-20 rounded-full border border-champagne/40 flex items-center justify-center p-1 shadow-glow-gold relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose to-champagne opacity-30 animate-ping" />
              <div className="w-full h-full rounded-full bg-midnight/90 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-champagne animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Brand Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gold-gradient uppercase mb-2"
          >
            The Induverse
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif italic text-sm sm:text-base text-champagne/80 mb-8 max-w-sm"
          >
            A little universe, created for one beautiful soul.
          </motion.p>

          {/* Champagne Progress Bar */}
          <div className="w-64 sm:w-80 relative flex flex-col items-center">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden p-0">
              <motion.div
                className="h-full bg-gradient-to-r from-burgundy via-rose to-champagne rounded-full shadow-[0_0_12px_#F3D8C4]"
                initial={{ width: '10%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.4 }}
              />
            </div>

            {/* Percentage & Status Label */}
            <div className="flex items-center justify-between w-full mt-3 text-[11px] font-sans tracking-widest uppercase text-rose-soft/70">
              <span>Aligning Stars</span>
              <span className="font-mono text-champagne font-semibold">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

