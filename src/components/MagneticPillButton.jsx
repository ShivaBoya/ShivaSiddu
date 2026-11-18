import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * MagneticPillButton
 * Ultra-luxury tactile magnetic CTA pill button featuring:
 * 1. Magnetic pull towards cursor on hover (desktop)
 * 2. Liquid-shimmer sweep highlight effect
 * 3. Smooth morphing astronomical compass / arrow icon
 * 4. Spring haptic tactile feedback (whileTap={{ scale: 0.96 }})
 * 5. Multi-layered frosted obsidian glass with champagne-gold luminous border
 */
export default function MagneticPillButton({
  onClick,
  disabled = false,
  label = 'Discover Your Little Universe 🌌',
  className = ''
}) {
  const buttonRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic spring physics
  const springConfig = { stiffness: 220, damping: 16, mass: 0.3 };
  const magneticX = useSpring(0, springConfig);
  const magneticY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !buttonRef.current || window.innerWidth < 768) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    // Subtle magnetic attraction (max 8px)
    magneticX.set(dx * 0.22);
    magneticY.set(dy * 0.22);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    magneticX.set(0);
    magneticY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      style={{
        x: magneticX,
        y: magneticY
      }}
      className={`group relative inline-flex items-center justify-center gap-3 px-8 sm:px-11 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] rounded-full overflow-hidden select-none touch-manipulation cursor-pointer transition-shadow duration-500 shadow-[0_10px_35px_rgba(20,27,65,0.7),0_0_30px_rgba(245,208,169,0.25)] hover:shadow-[0_15px_45px_rgba(43,18,63,0.8),0_0_45px_rgba(245,208,169,0.45)] active:shadow-[0_5px_20px_rgba(7,8,15,0.9)] ${className}`}
    >
      {/* 1. Base Gradient: Twilight Indigo & Velvet Plum to Obsidian */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141B41] via-[#2B123F] to-[#141B41] transition-all duration-500 group-hover:scale-105" />

      {/* 2. Frosted Obsidian Glass Sheen */}
      <div
        className="absolute inset-0 bg-[#07080F]/40 backdrop-blur-xl transition-opacity duration-300 group-hover:bg-[#07080F]/20"
      />

      {/* 3. Liquid-Shimmer Sweep Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            'linear-gradient(110deg, transparent 20%, rgba(245, 208, 169, 0.15) 38%, rgba(255, 248, 240, 0.45) 50%, rgba(245, 208, 169, 0.15) 62%, transparent 80%)',
          backgroundSize: '200% 100%',
          animation: prefersReducedMotion ? 'none' : 'shimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
        }}
      />

      {/* 4. Luminous Champagne 1px Edge Border */}
      <div className="absolute inset-0 rounded-full border border-[#F5D0A9]/40 group-hover:border-[#F5D0A9]/80 transition-colors duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]" />

      {/* 5. Button Text & Morphing Astronomical Icon */}
      <span className="relative z-10 font-serif text-xs sm:text-sm font-semibold tracking-widest text-[#FFF8F0] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] flex items-center gap-2">
        <span>{label}</span>
      </span>

      {/* Morphing Icon Container */}
      <div className="relative z-10 w-5 h-5 flex items-center justify-center text-[#F5D0A9]">
        {/* Resting Compass Icon */}
        <motion.div
          animate={{
            rotate: isHovered ? 45 : 0,
            scale: isHovered ? 0.8 : 1,
            opacity: isHovered ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Compass className="w-4 h-4 text-[#F5D0A9]" />
        </motion.div>

        {/* Hover Arrow Icon */}
        <motion.div
          animate={{
            x: isHovered ? 2 : -6,
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.7
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4 text-[#FFF8F0]" />
        </motion.div>
      </div>

      {/* Micro Sparkle Ambient Glow */}
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-[radial-gradient(circle,rgba(245,208,169,0.8)_0%,transparent_70%)] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}

