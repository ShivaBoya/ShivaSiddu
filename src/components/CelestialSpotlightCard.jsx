import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * CelestialSpotlightCard
 * Ultra-luxury frosted obsidian glassmorphism card with:
 * 1. 3D perspective tilt reacting to cursor coordinates
 * 2. Radial cursor spotlight border glow and surface illumination
 * 3. 1px luminous champagne/rose-gold edge highlight
 * 4. Specular inner highlight and ambient drop shadow
 * 5. Full accessibility & keyboard activation (Enter / Space)
 */
export default function CelestialSpotlightCard({
  children,
  className = '',
  isSelected = false,
  onClick,
  enableTilt = true,
  spotlightColor = 'rgba(245, 208, 169, 0.45)',
  ...rest
}) {
  const cardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Smooth springs for 3D tilt
  const springConfig = { stiffness: 180, damping: 22, mass: 0.5 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS custom variables for dynamic radial spotlights
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    if (enableTilt && !prefersReducedMotion && window.innerWidth >= 768) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      // Subtle 3D tilt (max 7 degrees)
      rotateX.set(-normY * 6.5);
      rotateY.set(normX * 6.5);
    }
  }, [enableTilt, prefersReducedMotion, rotateX, rotateY]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) onClick(e);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: enableTilt && !prefersReducedMotion ? rotateX : 0,
        rotateY: enableTilt && !prefersReducedMotion ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`group relative rounded-2xl sm:rounded-3xl p-[1px] transition-all duration-500 overflow-hidden cursor-pointer select-none touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D0A9] ${
        isSelected
          ? 'shadow-[0_20px_50px_-10px_rgba(245,208,169,0.38),0_0_35px_rgba(43,18,63,0.7)] scale-[1.01]'
          : 'shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_18px_45px_rgba(20,27,65,0.5)]'
      } ${className}`}
      {...rest}
    >
      {/* 1. Dynamic Cursor Radial Spotlight Border Mask */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"
        style={{
          opacity: isHovered || isSelected ? 1 : 0.4,
          background: isSelected
            ? `radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, rgba(232, 168, 124, 0.45) 30%, rgba(43, 18, 63, 0.3) 70%, transparent 100%)`
            : `radial-gradient(260px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, rgba(255, 255, 255, 0.08) 50%, rgba(20, 27, 65, 0.3) 80%, transparent 100%)`
        }}
      />

      {/* 2. Static Elegant Ambient Border Base */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl transition-colors duration-500 ${
          isSelected
            ? 'border-2 border-[#F5D0A9]'
            : 'border border-white/[0.09] group-hover:border-[#F5D0A9]/50'
        }`}
      />

      {/* 3. Obsidian Frosted Glass Body */}
      <div
        className="relative z-10 w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-500 overflow-hidden flex flex-col justify-between"
        style={{
          background: isSelected
            ? 'linear-gradient(145deg, rgba(20, 27, 65, 0.8) 0%, rgba(43, 18, 63, 0.72) 50%, rgba(7, 8, 15, 0.92) 100%)'
            : 'linear-gradient(145deg, rgba(14, 18, 32, 0.7) 0%, rgba(10, 12, 22, 0.78) 50%, rgba(7, 8, 15, 0.88) 100%)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          boxShadow: isSelected
            ? 'inset 0 1px 1px rgba(245, 208, 169, 0.5), inset 0 0 40px rgba(232, 168, 124, 0.12)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.14)'
        }}
      >
        {/* Specular Inner Surface Spotlight that follows cursor */}
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: isHovered || isSelected ? 1 : 0,
            background: `radial-gradient(320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245, 208, 169, 0.1), transparent 75%)`
          }}
        />

        {/* Subtle Aurora Ambient Sheen on Top-Right */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 bg-[radial-gradient(circle,rgba(232,168,124,0.15)_0%,transparent_70%)] blur-2xl" />

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
