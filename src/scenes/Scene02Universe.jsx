import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles as SparklesIcon,
  Compass,
  Star,
  ArrowRight,
  Orbit,
  Radio,
  Eye
} from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import CelestialDustMotes from '../components/CelestialDustMotes';
import CelestialSpotlightCard from '../components/CelestialSpotlightCard';
import MagneticPillButton from '../components/MagneticPillButton';

// 4 Interactive Constellations (100% of original text preserved with enriched telemetry)
const CONSTELLATIONS = [
  {
    id: 'c1',
    name: 'Indu Alpha',
    subtitle: 'The Core of Quiet Grace',
    coord: 'RA 12h 01m / Dec +2026',
    desc: 'The central light around which this entire universe orbits peacefully.',
    magnitude: '-26.7 Mag',
    spectralClass: 'Class O • Primary Starlight',
    stars: 7,
    glyph: 'alpha'
  },
  {
    id: 'c2',
    name: 'Stella Serena',
    subtitle: 'The Star of Stillness',
    coord: 'RA 04h 15m / Dec +19.8°',
    desc: 'Named after the tranquil calm you bring to every space you enter.',
    magnitude: '+1.4 Mag',
    spectralClass: 'Class B • Twilight Sapphire',
    stars: 5,
    glyph: 'serena'
  },
  {
    id: 'c3',
    name: 'Lyra Aurea',
    subtitle: 'The Golden Smile',
    coord: 'RA 08h 42m / Dec +45.2°',
    desc: 'A luminous cluster celebrating the warmth and genuineness of your laughter.',
    magnitude: '-0.5 Mag',
    spectralClass: 'Class G • Solar Champagne',
    stars: 6,
    glyph: 'lyra'
  },
  {
    id: 'c4',
    name: 'Vega Amoris',
    subtitle: 'The Star of Eternal Light',
    coord: 'RA 18h 36m / Dec +38.7°',
    desc: 'A constant beacon of appreciation and care, shining for you forever.',
    magnitude: '0.0 Mag',
    spectralClass: 'Class A • Diamond Rose',
    stars: 8,
    glyph: 'vega'
  }
];

// SVG Constellation Diagram Glyphs
function ConstellationGlyph({ type, isSelected = false, className = '' }) {
  const strokeColor = isSelected ? '#F5D0A9' : 'rgba(245, 208, 169, 0.45)';
  const starFill = isSelected ? '#FFF8F0' : '#E8A87C';

  if (type === 'alpha') {
    return (
      <svg viewBox="0 0 100 60" className={`w-full h-auto ${className}`} fill="none">
        <path
          d="M 15 45 L 35 20 L 50 10 L 65 20 L 85 45 M 35 20 L 65 20 M 50 10 L 50 48"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="2 2"
          className="transition-colors duration-500"
        />
        <circle cx="50" cy="10" r="3.5" fill={starFill} className="animate-pulse" />
        <circle cx="35" cy="20" r="2.5" fill={starFill} />
        <circle cx="65" cy="20" r="2.5" fill={starFill} />
        <circle cx="15" cy="45" r="2" fill={starFill} />
        <circle cx="85" cy="45" r="2" fill={starFill} />
        <circle cx="50" cy="48" r="3" fill="#F5D0A9" />
      </svg>
    );
  }

  if (type === 'serena') {
    return (
      <svg viewBox="0 0 70 50" className={`w-full h-auto ${className}`} fill="none">
        <path
          d="M 10 40 Q 35 10 60 25 M 60 25 L 45 42"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        <circle cx="10" cy="40" r="2.5" fill={starFill} />
        <circle cx="35" cy="18" r="3" fill={starFill} className="animate-pulse" />
        <circle cx="60" cy="25" r="2.5" fill={starFill} />
        <circle cx="45" cy="42" r="2" fill={starFill} />
      </svg>
    );
  }

  if (type === 'lyra') {
    return (
      <svg viewBox="0 0 70 50" className={`w-full h-auto ${className}`} fill="none">
        <path
          d="M 15 35 L 30 15 L 55 18 L 48 40 Z M 30 15 L 48 40"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
        <circle cx="30" cy="15" r="3" fill={starFill} className="animate-pulse" />
        <circle cx="55" cy="18" r="2.5" fill={starFill} />
        <circle cx="48" cy="40" r="2.5" fill={starFill} />
        <circle cx="15" cy="35" r="2" fill={starFill} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 70 50" className={`w-full h-auto ${className}`} fill="none">
      <path
        d="M 35 8 L 58 25 L 35 42 L 12 25 Z M 35 8 L 35 42"
        stroke={strokeColor}
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <circle cx="35" cy="8" r="3" fill={starFill} className="animate-pulse" />
      <circle cx="58" cy="25" r="2.5" fill={starFill} />
      <circle cx="35" cy="42" r="2.5" fill={starFill} />
      <circle cx="12" cy="25" r="2" fill={starFill} />
      <circle cx="35" cy="25" r="2" fill="#F5D0A9" />
    </svg>
  );
}

// Rich 3D Galaxy Spiral with Soft Circular Starlight Texture Map
function CosmicGalaxy({ prefersReducedMotion, touchOffset }) {
  const pointsRef = useRef();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Soft circular starlight particle texture to avoid square points
  const starTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(245, 208, 169, 0.85)');
    grad.addColorStop(0.55, 'rgba(232, 168, 124, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const [positions, colors] = useMemo(() => {
    const count = prefersReducedMotion ? 1000 : isMobile ? 1600 : 4000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const diamondCore = new THREE.Color('#FFF9F2');     // Diamond Starlight Core
    const champagneGold = new THREE.Color('#F5D0A9');   // Warm Champagne Gold
    const roseGold = new THREE.Color('#E8A87C');        // Metallic Rose Gold
    const velvetPlum = new THREE.Color('#5E1D4E');      // Velvet Plum / Nocturne
    const twilightIndigo = new THREE.Color('#141B41');  // Deep Midnight Indigo

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 6.2 + 0.2;
      const spinAngle = radius * 4.4;
      const branchAngle = (i % 4) * ((2 * Math.PI) / 4);

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45;

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY * (6.2 - radius) * 0.25;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = diamondCore.clone();
      if (radius < 1.6) {
        mixedColor.lerp(champagneGold, radius / 1.6);
      } else if (radius < 3.2) {
        mixedColor.copy(champagneGold).lerp(roseGold, (radius - 1.6) / 1.6);
      } else if (radius < 4.8) {
        mixedColor.copy(roseGold).lerp(velvetPlum, (radius - 3.2) / 1.6);
      } else {
        mixedColor.copy(velvetPlum).lerp(twilightIndigo, (radius - 4.8) / 1.4);
      }

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, [prefersReducedMotion, isMobile]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const speed = prefersReducedMotion ? 0.02 : 0.075;
      pointsRef.current.rotation.y += delta * speed + (touchOffset ? touchOffset.current.vx * 0.035 : 0);
      if (!prefersReducedMotion) {
        pointsRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.2) * 0.06 + (touchOffset ? touchOffset.current.vy * 0.025 : 0);
      }
      if (touchOffset) {
        touchOffset.current.vx *= 0.94;
        touchOffset.current.vy *= 0.94;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={prefersReducedMotion ? 0.055 : 0.048}
        map={starTexture || undefined}
        vertexColors
        transparent
        opacity={0.88}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Celestial Luminous Nocturne Planet with Champagne Saturnian Ring & Moonlet
function CelestialStarCore({ prefersReducedMotion }) {
  const coreRef = useRef();
  const ringRef = useRef();
  const moonRef = useRef();
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

  useFrame((state, delta) => {
    const rotSpeed = prefersReducedMotion ? 0.03 : 0.14;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * rotSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (rotSpeed * 1.25);
      if (!prefersReducedMotion) {
        ringRef.current.rotation.x = 1.32 + Math.sin(state.clock.elapsedTime * 0.28) * 0.07;
      }
    }
    if (moonRef.current && !prefersReducedMotion) {
      const time = state.clock.elapsedTime * 0.7;
      moonRef.current.position.x = Math.cos(time) * 1.9;
      moonRef.current.position.z = Math.sin(time) * 1.9;
      moonRef.current.position.y = Math.sin(time * 1.2) * 0.32;
    }
  });

  // Responsive position & scale: on mobile, centered in open sky between quote and tabs
  const groupPos = isMobile ? [0, 0.46, 0] : [0.05, 0.0, 0];
  const groupScale = isMobile ? 0.52 : 0.88;

  return (
    <group position={groupPos} scale={groupScale}>
      {/* Central Celestial Body in Velvet Nocturne & Champagne Rim */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial
          color="#161226"
          roughness={0.4}
          metalness={0.7}
          emissive="#3E1A38"
          emissiveIntensity={0.85}
        />
      </mesh>

      {/* Atmospheric Luminous Champagne Rim Halo */}
      <mesh scale={1.08}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial
          color="#F5D0A9"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Saturnian Champagne Starlight Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.78, 1.35, 64]} />
        <meshBasicMaterial
          color="#F5D0A9"
          side={THREE.DoubleSide}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Diamond Moonlet */}
      <mesh ref={moonRef} position={[1.9, 0, 0]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#FFF8F0" />
      </mesh>

      <Sparkles
        count={prefersReducedMotion ? 20 : 50}
        scale={3.2}
        size={2.6}
        speed={prefersReducedMotion ? 0.15 : 0.45}
        color="#F5D0A9"
      />
    </group>
  );
}

export default function Scene02Universe({ onNextScene, isTransitioning }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeConstellation, setActiveConstellation] = useState(CONSTELLATIONS[0]);
  const prefersReducedMotion = useReducedMotion();
  const touchOffset = useRef({ vx: 0, vy: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const handleTouchStart = (e) => {
    if (e.touches[0]) {
      touchOffset.current.lastX = e.touches[0].clientX;
      touchOffset.current.lastY = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      const dx = e.touches[0].clientX - touchOffset.current.lastX;
      const dy = e.touches[0].clientY - touchOffset.current.lastY;
      touchOffset.current.vx = dx;
      touchOffset.current.vy = dy;
      touchOffset.current.lastX = e.touches[0].clientX;
      touchOffset.current.lastY = e.touches[0].clientY;
    }
  };

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18
      }
    }
  };

  return (
    <section
      id="scene-universe"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-4 sm:px-6 md:px-8 pt-[max(3.8rem,calc(env(safe-area-inset-top)+2.4rem))] pb-[max(5rem,calc(env(safe-area-inset-bottom)+3.8rem))] lg:pb-8 overflow-hidden bg-[#07080F] select-none text-white"
    >
      {/* 1. LIVING AMBIENT NOCTURNE BACKGROUND WITH AURORA MESH */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Base Obsidian Foundation */}
        <div className="absolute inset-0 bg-[#07080F]" />

        {/* Cinematic Nebula Layer with Radial Darkening */}
        <img
          src="/images/scenes/scene02-nebula-hero.jpg"
          alt="Celestial Nebula"
          className="w-full h-full object-cover opacity-45 mix-blend-screen scale-105 filter saturate-125"
        />

        {/* Aurora Volumetric Light Orbs (Slow-drifting) */}
        <div
          className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(20,27,65,0.7)_0%,transparent_70%)] blur-3xl opacity-75"
          style={{ animation: prefersReducedMotion ? 'none' : 'float-slow 14s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/3 -right-28 w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(43,18,63,0.65)_0%,transparent_70%)] blur-3xl opacity-70"
          style={{ animation: prefersReducedMotion ? 'none' : 'float-slow 18s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(245,208,169,0.18)_0%,rgba(232,168,124,0.1)_40%,transparent_75%)] blur-3xl opacity-60"
          style={{ animation: prefersReducedMotion ? 'none' : 'float-medium 12s ease-in-out infinite' }}
        />

        {/* Ambient Film Grain / Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Vignette Edge Shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080F] via-transparent to-[#07080F]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,8,15,0.85)_100%)]" />
      </div>

      {/* 2. FLOATING MICRO-BOKEH DUST MOTES (Mouse Parallax) */}
      <CelestialDustMotes />

      {/* 3. INTERACTIVE 3D CELESTIAL CANVAS */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="absolute inset-0 z-1 pointer-events-auto touch-manipulation cursor-grab active:cursor-grabbing"
      >
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 2.2, 5.4], fov: 54 }}
            dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
            gl={{
              antialias: typeof window !== 'undefined' && window.innerWidth > 640,
              alpha: true,
              powerPreference: 'high-performance'
            }}
          >
            <ambientLight intensity={0.65} />
            <pointLight position={[0, 0, 0]} intensity={2.6} color="#F5D0A9" />
            <pointLight position={[2, 3, 2]} intensity={1.1} color="#141B41" />
            <Float
              speed={prefersReducedMotion ? 0.25 : 1.3}
              rotationIntensity={prefersReducedMotion ? 0.08 : 0.3}
              floatIntensity={prefersReducedMotion ? 0.15 : 0.45}
            >
              <CosmicGalaxy prefersReducedMotion={prefersReducedMotion} touchOffset={touchOffset} />
              <CelestialStarCore prefersReducedMotion={prefersReducedMotion} />
            </Float>
          </Canvas>
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,#2B123F_0%,#07080F_100%)] opacity-85" />
        )}
      </div>

      {/* 4. ASYMMETRIC EDITORIAL SPLIT-STAGE & BENTO-GALLERY ARCHITECTURE */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between"
      >
        {/* DESKTOP SPLIT-STAGE (lg+) & MOBILE ADAPTIVE CONTAINER */}
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 xl:gap-12 items-center my-auto">
          {/* ========================================================= */}
          {/* LEFT STAGE: EDITORIAL ANCHOR & ASTRO TELEMETRY (5 COLS)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left pt-1 sm:pt-2">
            {/* Astronomical Telemetry Pill Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full border border-[#F5D0A9]/35 bg-[#07080F]/80 backdrop-blur-xl shadow-[0_0_20px_rgba(245,208,169,0.22)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5D0A9] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5D0A9]" />
                </span>
                <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#F5D0A9] uppercase">
                  Scene 02 &bull; The Celestial Domain
                </span>
              </div>
            </motion.div>

            {/* Masked Editorial Typography Display Headline */}
            <motion.div variants={itemVariants} className="mt-2.5 sm:mt-4 overflow-hidden">
              <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-light tracking-tight text-white leading-[1.12]">
                Welcome to your universe,{' '}
                <span className="block lg:inline font-serif italic font-normal tracking-wide bg-gradient-to-r from-[#FFF8F0] via-[#F5D0A9] to-[#E8A87C] bg-clip-text text-transparent drop-shadow-[0_4px_28px_rgba(245,208,169,0.45)]">
                  Indu.
                </span>
              </h2>
            </motion.div>

            {/* Poetic Excerpt with Refined Champagne Luminescence Rule */}
            <motion.div
              variants={itemVariants}
              className="mt-2.5 sm:mt-4 max-w-md mx-auto lg:mx-0 border-l-0 lg:border-l lg:border-[#F5D0A9]/40 lg:pl-4"
            >
              <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#F5D0A9]/90 font-light leading-relaxed">
                &ldquo;Somewhere between millions of stars, there is one light that makes everything feel different.&rdquo;
              </p>
            </motion.div>

            {/* Telemetry Micro-Readouts (Desktop/Tablet) */}
            <motion.div
              variants={itemVariants}
              className="hidden sm:grid grid-cols-3 gap-2 mt-5 max-w-md mx-auto lg:mx-0 p-2.5 rounded-2xl border border-white/[0.08] bg-[#07080F]/60 backdrop-blur-xl"
            >
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#F5D0A9]/70 font-sans">Ephemeris</span>
                <span className="text-[11px] font-mono text-white/95 mt-0.5">{activeConstellation.coord.split('/')[0]}</span>
              </div>
              <div className="flex flex-col border-x border-white/[0.08] px-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#F5D0A9]/70 font-sans">Orbit</span>
                <span className="text-[11px] font-mono text-white/95 mt-0.5">Harmonious</span>
              </div>
              <div className="flex flex-col pl-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#F5D0A9]/70 font-sans">Sanctuary</span>
                <span className="text-[11px] font-mono text-[#F5D0A9] mt-0.5">Induverse</span>
              </div>
            </motion.div>

            {/* CTA Trigger (Desktop View - Stays in Left Column for Editorial Balance) */}
            <motion.div variants={itemVariants} className="hidden lg:flex flex-col items-start mt-6">
              <MagneticPillButton
                onClick={onNextScene}
                disabled={isTransitioning}
                label="Discover Your Little Universe 🌌"
              />
              <p className="mt-2.5 text-[10px] text-[#F5D0A9]/70 font-mono tracking-wider flex items-center gap-1.5">
                <SparklesIcon className="w-3 h-3 text-[#F5D0A9]" />
                <span>SELECT ANY CONSTELLATION • TOUCH & DRAG TO ORBIT</span>
              </p>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT STAGE: FLOATING CELESTIAL BENTO GALLERY (7 COLS)   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center mt-2 lg:mt-0">
            {/* DESKTOP BENTO GRID (Hidden on mobile) */}
            <div className="hidden lg:grid grid-cols-4 gap-3">
              {/* HERO BENTO CARD: Displays Current Active Constellation with Rich Detail */}
              <div className="col-span-4">
                <CelestialSpotlightCard
                  isSelected={true}
                  className="min-h-[165px]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#141B41]/80 border border-[#F5D0A9]/40 text-[9px] font-mono uppercase tracking-widest text-[#F5D0A9]">
                        <Orbit className="w-2.5 h-2.5 text-[#F5D0A9]" />
                        <span>Constellation Focus • {activeConstellation.coord}</span>
                      </div>
                      <h3 className="font-serif text-xl xl:text-2xl font-normal text-white mt-2 tracking-tight flex items-center gap-2">
                        <span>{activeConstellation.name}</span>
                        {activeConstellation.id === 'c1' && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F5D0A9]/20 text-[#F5D0A9] border border-[#F5D0A9]/40">Core Light</span>
                        )}
                      </h3>
                      <p className="font-serif italic text-xs text-[#E8A87C] mt-0.5">
                        {activeConstellation.subtitle}
                      </p>
                    </div>

                    <div className="w-28 h-14 opacity-85 group-hover:opacity-100 transition-opacity">
                      <ConstellationGlyph type={activeConstellation.glyph} isSelected={true} />
                    </div>
                  </div>

                  <p className="font-sans text-xs text-white/90 mt-2.5 leading-relaxed max-w-xl">
                    {activeConstellation.desc}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-white/[0.08] text-[10px] font-mono text-[#F5D0A9]/80">
                    <span>MAG: {activeConstellation.magnitude}</span>
                    <span>&bull;</span>
                    <span>{activeConstellation.spectralClass}</span>
                    <span>&bull;</span>
                    <span>{activeConstellation.stars} Constellation Nodes</span>
                  </div>
                </CelestialSpotlightCard>
              </div>

              {/* 4 COMPACT BENTO CARDS: Indu Alpha, Stella Serena, Lyra Aurea, Vega Amoris */}
              {CONSTELLATIONS.map((c) => {
                const isSelected = activeConstellation?.id === c.id;
                return (
                  <div key={c.id} className="col-span-1">
                    <CelestialSpotlightCard
                      isSelected={isSelected}
                      onClick={() => setActiveConstellation(c)}
                      data-constellation={c.id}
                      className="h-full min-h-[170px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-wider text-[#F5D0A9]/80 uppercase">
                          {c.coord.split('/')[0]}
                        </span>
                        <div className="w-9 h-6 opacity-75 group-hover:opacity-100 transition-opacity">
                          <ConstellationGlyph type={c.glyph} isSelected={isSelected} />
                        </div>
                      </div>

                      <h4 className="font-serif text-sm xl:text-base font-normal text-white mt-1.5 tracking-tight flex items-center justify-between">
                        <span className="truncate">{c.name}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#F5D0A9] animate-ping ml-1" />}
                      </h4>
                      <p className="font-serif italic text-[10px] xl:text-[11px] text-[#E8A87C] leading-snug truncate">
                        {c.subtitle}
                      </p>

                      <p className="font-sans text-[10px] xl:text-[11px] text-white/80 mt-2 line-clamp-2 leading-relaxed">
                        {c.desc}
                      </p>

                      <div className="mt-auto pt-2 flex items-center justify-between text-[9px] font-mono text-[#F5D0A9]/70">
                        <span>{c.magnitude}</span>
                        <Star className={`w-3 h-3 ${isSelected ? 'fill-[#F5D0A9] text-[#F5D0A9]' : 'text-white/40'}`} />
                      </div>
                    </CelestialSpotlightCard>
                  </div>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* MOBILE ADAPTIVE BENTO GALLERY (< lg)                      */}
            {/* ========================================================= */}
            <div className="lg:hidden w-full flex flex-col gap-2.5 max-w-md mx-auto">
              {/* Constellation Selector Tabs with Spotlight Glass */}
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#07080F]/70 border border-white/[0.08] backdrop-blur-xl">
                {CONSTELLATIONS.map((c) => {
                  const isSelected = activeConstellation?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConstellation(c)}
                      className={`py-2 px-1 rounded-xl text-center transition-all duration-300 cursor-pointer touch-manipulation flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#141B41] to-[#2B123F] border border-[#F5D0A9] shadow-[0_0_15px_rgba(245,208,169,0.35)]'
                          : 'border border-transparent text-white/60 hover:text-white'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'fill-[#F5D0A9] text-[#F5D0A9]' : 'text-white/40'
                        }`}
                      />
                      <span className="font-serif text-[10px] tracking-tight leading-tight truncate w-full text-center">
                        {c.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Constellation Detail Card (Mobile Bento Focus) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeConstellation?.id || 'default'}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl p-4 border border-[#F5D0A9]/50 bg-gradient-to-b from-[#141B41]/85 via-[#07080F]/92 to-[#07080F] backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(43,18,63,0.5)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#F5D0A9]">
                        <Radio className="w-2.5 h-2.5 text-[#F5D0A9] animate-pulse" />
                        <span>{activeConstellation.coord}</span>
                      </div>
                      <h3 className="font-serif text-lg font-normal text-white mt-0.5">
                        {activeConstellation.name}
                      </h3>
                      <p className="font-serif italic text-xs text-[#E8A87C]">
                        {activeConstellation.subtitle}
                      </p>
                    </div>

                    <div className="w-16 h-10 opacity-90">
                      <ConstellationGlyph type={activeConstellation.glyph} isSelected={true} />
                    </div>
                  </div>

                  <p className="font-sans text-xs text-white/90 mt-2.5 leading-relaxed">
                    {activeConstellation.desc}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.08] text-[9px] font-mono text-[#F5D0A9]/80">
                    <span>{activeConstellation.magnitude}</span>
                    <span>{activeConstellation.spectralClass}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE BOTTOM CTA BUTTON (Fixed above safe areas)          */}
        {/* ========================================================= */}
        <div className="lg:hidden w-full flex flex-col items-center pt-2 sm:pt-3">
          <MagneticPillButton
            onClick={onNextScene}
            disabled={isTransitioning}
            label="Discover Your Little Universe 🌌"
            className="w-full max-w-sm"
          />
          <p className="mt-1.5 text-[9px] xs:text-[10px] text-[#F5D0A9]/70 font-mono tracking-wider text-center">
            ✦ TAP CONSTELLATIONS • DRAG TO ROTATE COSMOS ✦
          </p>
        </div>
      </motion.div>
    </section>
  );
}
