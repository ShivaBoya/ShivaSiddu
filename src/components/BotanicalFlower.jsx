import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * BotanicalFlower
 * 5 Unique, richly detailed botanical blossoms:
 * - Flower 1: Crimson Velvet Rose (layered curved rose petals with gold rim)
 * - Flower 2: Golden Sacred Lotus (radiant pointed lotus petals with starlight core)
 * - Flower 3: Celestial Starlight Orchid (flared orchid wings with magenta/violet gradients)
 * - Flower 4: Amber Moonlit Camellia (soft rounded pearlescent ivory petals with warm gold center)
 * - Flower 5: Everlasting Cosmic Rose (royal fuchsia multi-layered starfire petals)
 */
export default function BotanicalFlower({
  flower,
  isBloomed,
  isAllBloomed,
  onClick
}) {
  const prefersReducedMotion = useReducedMotion();
  const bloomed = isBloomed || isAllBloomed;
  const uid = flower.id;

  const renderPetals = () => {
    switch (flower.id) {
      case 'flower-1': // Crimson Velvet Rose
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 filter drop-shadow-[0_4px_20px_rgba(230,34,56,0.75)]">
            <defs>
              <linearGradient id={`grad-${uid}-outer`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF4D6D" />
                <stop offset="60%" stopColor="#C9184A" />
                <stop offset="100%" stopColor="#590D22" />
              </linearGradient>
              <linearGradient id={`grad-${uid}-mid`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F3" />
                <stop offset="50%" stopColor="#FF758F" />
                <stop offset="100%" stopColor="#A4133C" />
              </linearGradient>
              <radialGradient id={`grad-${uid}-core`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF" />
                <stop offset="50%" stopColor="#FFCCD5" />
                <stop offset="100%" stopColor="#800F2F" />
              </radialGradient>
            </defs>

            {/* Outer Layer: 8 Full Curved Rose Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.path
                key={`outer-${i}`}
                d="M 60,60 C 40,25 35,5 60,5 C 85,5 80,25 60,60 Z"
                fill={`url(#grad-${uid}-outer)`}
                stroke="#FF8FA3"
                strokeWidth="0.8"
                transform={`rotate(${angle} 60 60)`}
                animate={bloomed ? { scale: [1, 1.18, 1.12], rotate: angle + 8 } : { scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
              />
            ))}

            {/* Mid Layer: 8 Offset Petals */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <path
                key={`mid-${i}`}
                d="M 60,60 C 46,34 42,18 60,18 C 78,18 74,34 60,60 Z"
                fill={`url(#grad-${uid}-mid)`}
                stroke="#FFCCD5"
                strokeWidth="0.6"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}

            {/* Inner Spiral Petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse
                key={`in-${i}`}
                cx="60"
                cy="44"
                rx="10"
                ry="14"
                fill="#FF4D6D"
                stroke="#FFF"
                strokeWidth="0.5"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}

            {/* Rose Core with Gold Pollen */}
            <circle cx="60" cy="60" r="12" fill={`url(#grad-${uid}-core)`} />
            <circle cx="60" cy="60" r="6" fill="#FFD700" className="animate-pulse" />
          </svg>
        );

      case 'flower-2': // Golden Sacred Lotus
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 filter drop-shadow-[0_4px_22px_rgba(255,215,0,0.8)]">
            <defs>
              <linearGradient id={`grad-${uid}-lotus`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#FFF59D" />
                <stop offset="70%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>

            {/* 12 Pointed Lotus Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <motion.path
                key={`lotus-${i}`}
                d="M 60,60 C 48,30 50,8 60,8 C 70,8 72,30 60,60 Z"
                fill={`url(#grad-${uid}-lotus)`}
                stroke="#FFE082"
                strokeWidth="0.8"
                transform={`rotate(${angle} 60 60)`}
                animate={bloomed ? { scale: [1, 1.2, 1.15] } : { scale: 1 }}
                transition={{ duration: 0.7, delay: i * 0.03 }}
              />
            ))}

            {/* Inner Tier Petals */}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
              <ellipse
                key={`inner-lotus-${i}`}
                cx="60"
                cy="36"
                rx="9"
                ry="18"
                fill={`url(#grad-${uid}-lotus)`}
                stroke="#FFF"
                strokeWidth="0.5"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}

            {/* Sunburst Lotus Core */}
            <circle cx="60" cy="60" r="14" fill="#FFFDE7" />
            <circle cx="60" cy="60" r="8" fill="#FFB300" className="animate-ping" />
            <circle cx="60" cy="60" r="4" fill="#FFFFFF" />
          </svg>
        );

      case 'flower-3': // Celestial Starlight Orchid
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 filter drop-shadow-[0_4px_22px_rgba(186,104,200,0.85)]">
            <defs>
              <linearGradient id={`grad-${uid}-orchid`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E1BEE7" />
                <stop offset="70%" stopColor="#BA68C8" />
                <stop offset="100%" stopColor="#4A148C" />
              </linearGradient>
            </defs>

            {/* Left Wing Petal */}
            <motion.path
              d="M 60,60 C 20,45 8,15 42,16 C 54,18 56,42 60,60 Z"
              fill={`url(#grad-${uid}-orchid)`}
              stroke="#F3E5F5"
              strokeWidth="0.9"
              animate={bloomed ? { scale: [1, 1.2, 1.12], rotate: -6 } : { scale: 1 }}
            />

            {/* Right Wing Petal */}
            <motion.path
              d="M 60,60 C 100,45 112,15 78,16 C 66,18 64,42 60,60 Z"
              fill={`url(#grad-${uid}-orchid)`}
              stroke="#F3E5F5"
              strokeWidth="0.9"
              animate={bloomed ? { scale: [1, 1.2, 1.12], rotate: 6 } : { scale: 1 }}
            />

            {/* Top Sepal */}
            <path
              d="M 60,60 C 48,25 50,6 60,6 C 70,6 72,25 60,60 Z"
              fill={`url(#grad-${uid}-orchid)`}
              stroke="#FFF"
              strokeWidth="0.8"
            />

            {/* Bottom Sepals */}
            <path
              d="M 60,60 C 42,85 45,112 60,110 C 75,112 78,85 60,60 Z"
              fill={`url(#grad-${uid}-orchid)`}
              stroke="#CE93D8"
              strokeWidth="0.8"
            />

            {/* Orchid Nectar Lip with Glowing Core */}
            <ellipse cx="60" cy="66" rx="16" ry="13" fill="#E040FB" stroke="#FFF" strokeWidth="1.2" />
            <circle cx="60" cy="62" r="7" fill="#FFF9C4" className="animate-pulse" />
          </svg>
        );

      case 'flower-4': // Amber Moonlit Camellia
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 filter drop-shadow-[0_4px_20px_rgba(255,224,130,0.8)]">
            <defs>
              <radialGradient id={`grad-${uid}-camellia`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FFF9E6" />
                <stop offset="75%" stopColor="#FFE082" />
                <stop offset="100%" stopColor="#FFB300" />
              </radialGradient>
            </defs>

            {/* 8 Broad Overlapping Rounded Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.circle
                key={`cam-out-${i}`}
                cx="60"
                cy="35"
                r="24"
                fill={`url(#grad-${uid}-camellia)`}
                stroke="#FFF"
                strokeWidth="0.8"
                transform={`rotate(${angle} 60 60)`}
                animate={bloomed ? { scale: [1, 1.15, 1.1] } : { scale: 1 }}
              />
            ))}

            {/* Inner Cupped Petals */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
              <circle
                key={`cam-in-${i}`}
                cx="60"
                cy="44"
                r="16"
                fill={`url(#grad-${uid}-camellia)`}
                stroke="#FFE082"
                strokeWidth="0.6"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}

            {/* Amber Heart */}
            <circle cx="60" cy="60" r="13" fill="#FFA000" />
            <circle cx="60" cy="60" r="6" fill="#FFFDE7" className="animate-pulse" />
          </svg>
        );

      case 'flower-5': // Everlasting Cosmic Rose of Shiva
      default:
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 filter drop-shadow-[0_4px_24px_rgba(255,64,129,0.9)]">
            <defs>
              <linearGradient id={`grad-${uid}-eternal`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF0F5" />
                <stop offset="35%" stopColor="#FF4081" />
                <stop offset="70%" stopColor="#C2185B" />
                <stop offset="100%" stopColor="#880E4F" />
              </linearGradient>
            </defs>

            {/* 10 Starfire Rosette Petals */}
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
              <motion.path
                key={`eternal-${i}`}
                d="M 60,60 C 45,22 42,6 60,6 C 78,6 75,22 60,60 Z"
                fill={`url(#grad-${uid}-eternal)`}
                stroke="#FFD54F"
                strokeWidth="0.8"
                transform={`rotate(${angle} 60 60)`}
                animate={bloomed ? { scale: [1, 1.22, 1.15], rotate: angle + 10 } : { scale: 1 }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
              />
            ))}

            {/* Inner 10 Offset Petals */}
            {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((angle, i) => (
              <ellipse
                key={`eternal-in-${i}`}
                cx="60"
                cy="38"
                rx="10"
                ry="18"
                fill="#FF4081"
                stroke="#FFF"
                strokeWidth="0.6"
                transform={`rotate(${angle} 60 60)`}
              />
            ))}

            <circle cx="60" cy="60" r="16" fill={`url(#grad-${uid}-eternal)`} />
            <circle cx="60" cy="60" r="9" fill="#FFD700" className="animate-ping" />
            <circle cx="60" cy="60" r="5" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { scale: 1.14, y: -4 }}
      whileTap={{ scale: 0.94 }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [-3, 3, -3],
              rotate: [-1.5, 1.5, -1.5]
            }
      }
      transition={{
        duration: 5.2 + (parseInt(flower.id.slice(-1)) || 1) * 0.4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="relative flex flex-col items-center cursor-pointer select-none touch-manipulation group"
    >
      {/* 1. Luminous Bioluminescent Halo */}
      <div
        className={`absolute rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          bloomed ? 'w-36 h-36 opacity-95 scale-130' : 'w-28 h-28 opacity-70 group-hover:opacity-100 group-hover:scale-115'
        }`}
        style={{
          backgroundColor: flower.glowColor || 'rgba(255,107,157,0.7)',
          boxShadow: `0 0 50px ${flower.glowColor || 'rgba(255,107,157,0.7)'}`
        }}
      />

      {/* 2. Orbiting Golden Pollen Dust Motes */}
      {!prefersReducedMotion && (
        <>
          <div className="absolute -top-1 left-2 w-2 h-2 rounded-full bg-[#FFE8A3] shadow-[0_0_10px_#FFE8A3] animate-ping" />
          <div className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-[#80E27E] shadow-[0_0_10px_#80E27E] animate-pulse" />
          <div className="absolute -bottom-1 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />
        </>
      )}

      {/* 3. The Botanical Blossom (Interactive Floral Organism) */}
      <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center relative">
        {renderPetals()}
      </div>

      {/* 4. Elegant Floating Label Pill */}
      <motion.div
        animate={bloomed ? { scale: 1.05, y: -2 } : { scale: 1, y: 0 }}
        className={`mt-1 sm:mt-1.5 px-3.5 py-1 rounded-full border backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
          bloomed
            ? 'bg-[#0C3022]/95 border-[#FFE8A3] text-[#FFE8A3] shadow-[0_0_20px_rgba(255,232,163,0.5)]'
            : 'bg-[#071F15]/90 border-[#80E27E]/50 text-[#E1BEE7] group-hover:border-[#FFE8A3] group-hover:text-white'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FFE8A3]" />
        <span className="font-serif italic text-[11px] xs:text-xs sm:text-xs tracking-wider whitespace-nowrap">
          {flower.name.replace('The ', '')}
        </span>
      </motion.div>
    </motion.div>
  );
}
