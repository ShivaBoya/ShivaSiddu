import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles as SparklesIcon, Compass, Star, ArrowRight, X } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// 4 Interactive Constellations
const CONSTELLATIONS = [
  {
    id: 'c1',
    name: 'Indu Alpha',
    subtitle: 'The Core of Quiet Grace',
    coord: 'RA 12h 01m / Dec +2026',
    desc: 'The central light around which this entire universe orbits peacefully.'
  },
  {
    id: 'c2',
    name: 'Stella Serena',
    subtitle: 'The Star of Stillness',
    coord: 'RA 04h 15m / Dec +19.8°',
    desc: 'Named after the tranquil calm you bring to every space you enter.'
  },
  {
    id: 'c3',
    name: 'Lyra Aurea',
    subtitle: 'The Golden Smile',
    coord: 'RA 08h 42m / Dec +45.2°',
    desc: 'A luminous cluster celebrating the warmth and genuineness of your laughter.'
  },
  {
    id: 'c4',
    name: 'Vega Amoris',
    subtitle: 'The Star of Eternal Light',
    coord: 'RA 18h 36m / Dec +38.7°',
    desc: 'A constant beacon of appreciation and care, shining for you forever.'
  }
];

// Rich 3D Galaxy Spiral Particles (Midnight Blue, Violet, Cosmic Pink, Diamond White)
function CosmicGalaxy({ prefersReducedMotion, touchOffset }) {
  const pointsRef = useRef();

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  const [positions, colors] = useMemo(() => {
    const count = prefersReducedMotion ? 1200 : isMobile ? 1800 : 4800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const insideColor = new THREE.Color('#FFFFFF'); // Diamond Starlight Core
    const midPinkColor = new THREE.Color('#E03E85'); // Cosmic Pink
    const violetColor = new THREE.Color('#7B1FA2');  // Deep Radiant Violet
    const outerBlueColor = new THREE.Color('#1E88E5'); // Midnight Sapphire Blue

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 6.0 + 0.2;
      const spinAngle = radius * 4.6;
      const branchAngle = ((i % 4) * ((2 * Math.PI) / 4));

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.42);
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.42);
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.42);

      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      pos[i3 + 1] = randomY * (6 - radius) * 0.26;
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = insideColor.clone();
      if (radius < 2.0) {
        mixedColor.lerp(midPinkColor, radius / 2.0);
      } else if (radius < 4.0) {
        mixedColor.copy(midPinkColor).lerp(violetColor, (radius - 2.0) / 2.0);
      } else {
        mixedColor.copy(violetColor).lerp(outerBlueColor, (radius - 4.0) / 2.0);
      }

      col[i3] = mixedColor.r;
      col[i3 + 1] = mixedColor.g;
      col[i3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, [prefersReducedMotion, isMobile]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const speed = prefersReducedMotion ? 0.025 : 0.09;
      pointsRef.current.rotation.y += delta * speed + (touchOffset ? touchOffset.current.vx * 0.04 : 0);
      if (!prefersReducedMotion) {
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.08 + (touchOffset ? touchOffset.current.vy * 0.03 : 0);
      }
      if (touchOffset) {
        touchOffset.current.vx *= 0.95;
        touchOffset.current.vy *= 0.95;
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
        size={prefersReducedMotion ? 0.045 : 0.038}
        vertexColors
        transparent
        opacity={0.94}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Luminous Celestial Planet with Planetary Ring & Orbiting Moonlet
function CelestialStarCore({ prefersReducedMotion }) {
  const coreRef = useRef();
  const ringRef = useRef();
  const moonRef = useRef();

  useFrame((state, delta) => {
    const rotSpeed = prefersReducedMotion ? 0.04 : 0.16;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * rotSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (rotSpeed * 1.3);
      if (!prefersReducedMotion) {
        ringRef.current.rotation.x = 1.25 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
      }
    }
    if (moonRef.current && !prefersReducedMotion) {
      const time = state.clock.elapsedTime * 0.75;
      moonRef.current.position.x = Math.cos(time) * 1.85;
      moonRef.current.position.z = Math.sin(time) * 1.85;
      moonRef.current.position.y = Math.sin(time * 1.3) * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Luminous Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#E03E85"
          emissiveIntensity={2.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Planetary Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.92, 1.4, 64]} />
        <meshBasicMaterial
          color="#00E5FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Moonlet */}
      <mesh ref={moonRef} position={[1.85, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#E1BEE7" />
      </mesh>

      <Sparkles
        count={prefersReducedMotion ? 25 : 70}
        scale={3.4}
        size={3.0}
        speed={prefersReducedMotion ? 0.15 : 0.5}
        color="#00E5FF"
      />
    </group>
  );
}

export default function Scene02Universe({ onNextScene, isTransitioning }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeConstellation, setActiveConstellation] = useState(null);
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

  return (
    <section
      id="scene-universe"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center px-3 sm:px-6 pt-[max(3.6rem,calc(env(safe-area-inset-top)+2.4rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] overflow-hidden bg-[#040817] select-none"
    >
      {/* Cinematic Deep Space Nebula Clouds (Midnight Blue, Violet, Cosmic Pink) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/scenes/scene02-nebula-hero.jpg"
          alt="Rich Cosmic Nebula Clouds"
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-transparent to-[#040817]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(4,8,23,0.8)_100%)]" />
      </div>

      {/* 3D Cosmic Galaxy Canvas */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="absolute inset-0 z-1 pointer-events-auto touch-manipulation cursor-grab active:cursor-grabbing"
      >
        {hasWebGL ? (
          <Canvas
            camera={{ position: [0, 2.3, 5.2], fov: 55 }}
            dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.75) : 1}
            gl={{ antialias: typeof window !== 'undefined' && window.innerWidth > 640, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={0.7} />
            <pointLight position={[0, 0, 0]} intensity={3.0} color="#00E5FF" />
            <Float
              speed={prefersReducedMotion ? 0.3 : 1.4}
              rotationIntensity={prefersReducedMotion ? 0.1 : 0.35}
              floatIntensity={prefersReducedMotion ? 0.2 : 0.55}
            >
              <CosmicGalaxy prefersReducedMotion={prefersReducedMotion} touchOffset={touchOffset} />
              <CelestialStarCore prefersReducedMotion={prefersReducedMotion} />
            </Float>
          </Canvas>
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,#3B1466_0%,#040817_100%)] opacity-80" />
        )}
      </div>

      {/* Top Header & Constellation Badges */}
      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center px-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1 rounded-full mb-2 sm:mb-3 border border-[#E03E85]/40 bg-[#040817]/70 backdrop-blur-md shadow-[0_0_20px_rgba(224,62,133,0.35)]"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="font-serif italic text-xs tracking-widest text-[#E1BEE7] uppercase">
            Scene 02 &bull; The Celestial Domain
          </span>
        </motion.div>

        <h2 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_4px_30px_rgba(224,62,133,0.4)]">
          Welcome to your universe, <span className="bg-gradient-to-r from-[#00E5FF] via-[#E03E85] to-[#E1BEE7] bg-clip-text text-transparent font-display italic">Indu.</span>
        </h2>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#E1BEE7]/95 max-w-lg mx-auto font-light leading-relaxed mt-1 sm:mt-2 hidden sm:block">
          &ldquo;Somewhere between millions of stars, there is one light that makes everything feel different.&rdquo;
        </p>

        {/* 4 Interactive Constellation Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-2.5 sm:mt-4">
          {CONSTELLATIONS.map((c) => {
            const isSelected = activeConstellation?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveConstellation(isSelected ? null : c)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[42px] sm:min-h-[44px] rounded-full text-xs font-serif transition-all duration-300 flex items-center gap-1.5 cursor-pointer border backdrop-blur-md touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'border-[#00E5FF] bg-[#1E88E5]/30 text-white shadow-[0_0_20px_rgba(0,229,255,0.5)] scale-105'
                    : 'border-[#E03E85]/35 bg-[#040817]/60 text-[#E1BEE7]/80 hover:text-white hover:border-[#00E5FF]/70'
                }`}
              >
                <Star className={`w-3 h-3 ${isSelected ? 'fill-[#00E5FF] text-[#00E5FF]' : 'text-[#E03E85]'}`} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Constellation Detail Modal Card */}
      <AnimatePresence>
        {activeConstellation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative z-20 max-w-md w-full rounded-2xl p-4 sm:p-5 border border-[#00E5FF]/50 bg-[#040817]/95 shadow-[0_0_40px_rgba(0,229,255,0.3)] text-left my-auto backdrop-blur-2xl max-h-[60vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-[#00E5FF] uppercase">
                  {activeConstellation.coord}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                  {activeConstellation.name}
                </h3>
                <p className="font-serif italic text-xs text-[#E03E85]">
                  {activeConstellation.subtitle}
                </p>
              </div>
              <button
                onClick={() => setActiveConstellation(null)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#E1BEE7] hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-sans text-xs text-white/90 mt-2.5 leading-relaxed">
              {activeConstellation.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Curiosity CTA Trigger */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <button
            onClick={onNextScene}
            disabled={isTransitioning}
            className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-7 sm:px-11 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(30,136,229,0.5)] hover:shadow-[0_0_45px_rgba(224,62,133,0.6)] active:scale-95 cursor-pointer touch-manipulation"
          >
            {/* Midnight Blue & Cosmic Violet gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1] via-[#7B1FA2] to-[#E03E85] group-hover:opacity-95 transition-opacity" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(0,229,255,0.35),transparent)] bg-[length:200%_100%] animate-shimmer" />
            <div className="absolute inset-0 border border-[#00E5FF]/50 rounded-full group-hover:border-[#00E5FF] transition-colors" />

            <span className="relative z-10 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-widest text-white uppercase">
              Discover Your Little Universe 🌌
            </span>
            <ArrowRight className="relative z-10 w-4 h-4 text-[#00E5FF] group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>

        <p className="mt-1.5 sm:mt-2 text-[10px] text-[#00E5FF]/70 font-mono tracking-wider">
          ✦ TAP ANY CONSTELLATION ABOVE • EXPLORE THE COSMOS ✦
        </p>
      </div>
    </section>
  );
}
