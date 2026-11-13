import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * CinematicRose
 * Full-screen & immersive rose centerpiece:
 * - NO card, NO rectangular box, NO visible borders!
 * - Organic radial feather masking that seamlessly blends the crimson petals and gold glitter into the dark atmospheric space.
 * - Volumetric celestial light rays radiating from behind the bloom.
 * - Interactive 3D mouse parallax and touch drag physics.
 */
export default function CinematicRose({ isBursting }) {
  const prefersReducedMotion = useReducedMotion();

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);
  const lightShiftX = useTransform(smoothX, [-0.5, 0.5], [-40, 40]);
  const lightShiftY = useTransform(smoothY, [-0.5, 0.5], [-30, 30]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = e.clientX / innerWidth - 0.5;
      const normalizedY = e.clientY / innerHeight - 0.5;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  const handleTouchMove = (e) => {
    if (prefersReducedMotion || !e.touches[0]) return;
    const touch = e.touches[0];
    const { innerWidth, innerHeight } = window;
    const normalizedX = touch.clientX / innerWidth - 0.5;
    const normalizedY = touch.clientY / innerHeight - 0.5;
    mouseX.set(normalizedX * 1.4);
    mouseY.set(normalizedY * 1.4);
  };

  const handleTouchEnd = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex items-center justify-center pointer-events-auto select-none touch-manipulation my-auto"
    >
      {/* 1. Volumetric Overhead Radiant Light Cones */}
      <motion.div
        style={prefersReducedMotion ? {} : { x: lightShiftX, y: lightShiftY }}
        className="absolute -top-32 w-80 sm:w-[600px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(245,208,97,0.25)_0%,rgba(230,34,56,0.15)_40%,transparent_75%)] blur-3xl pointer-events-none -z-10"
      />

      {/* 2. Rotating Celestial Volumetric Light Rays */}
      {!prefersReducedMotion && (
        <div className="absolute w-[360px] h-[360px] sm:w-[640px] sm:h-[640px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(245,208,97,0.12)_0deg,transparent_40deg,rgba(230,34,56,0.12)_90deg,transparent_130deg,rgba(245,208,97,0.12)_180deg,transparent_220deg,rgba(230,34,56,0.12)_270deg,transparent_310deg,rgba(245,208,97,0.12)_360deg)] animate-spin-slow blur-2xl pointer-events-none -z-10" />
      )}

      {/* 3. Deep Crimson & Warm Gold Ambient Aura */}
      <div className="absolute w-72 h-72 sm:w-[520px] sm:h-[520px] rounded-full bg-[#B81424]/35 blur-[90px] sm:blur-[120px] -z-10" />
      <div className="absolute w-56 h-56 sm:w-[380px] sm:h-[380px] rounded-full bg-[#F5D061]/25 blur-[60px] sm:blur-[80px] -z-10" />

      {/* 4. The Grand Centerpiece Rose (No Card, No Box, Seamless Feather Edge) */}
      <motion.div
        style={prefersReducedMotion ? {} : { rotateX, rotateY, transformPerspective: 1200 }}
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px) brightness(1.3)' }}
        animate={
          isBursting
            ? { scale: [1, 1.15], opacity: [1, 0.9], filter: 'blur(0px) brightness(1.4)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }
        }
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[88vw] xs:w-[360px] sm:w-[480px] md:w-[560px] h-[38vh] xs:h-[42vh] sm:h-[48vh] md:h-[52vh] max-h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Organic Floating Breathing Movement */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [-5, 5, -5],
                  rotate: [-0.4, 0.4, -0.4],
                  scale: [1, 1.025, 1],
                }
          }
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full h-full flex items-center justify-center overflow-visible"
        >
          {/* Hero Rose Image with FEATHERED RADIAL MASK - Blends seamlessly into space with 0 hard edges */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0) 73%)',
              maskImage:
                'radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0) 73%)',
            }}
          >
            <img
              src="/images/scenes/scene01-rose-hero.jpg"
              alt="Majestic Crimson Rose with Golden Dust"
              className="w-full h-full object-cover object-center scale-110 drop-shadow-[0_0_60px_rgba(230,34,56,0.6)]"
              loading="eager"
            />

            {/* Seamless Chiaroscuro Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050204]/80 via-transparent to-[#050204]/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,2,4,0.7)_80%)] pointer-events-none" />

            {/* Specular golden light beam sweep across petals */}
            {!prefersReducedMotion && (
              <motion.div
                animate={{ x: ['-180%', '240%'] }}
                transition={{ duration: 6, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-[#FFE8A3]/25 to-transparent skew-x-[-28deg] pointer-events-none"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
