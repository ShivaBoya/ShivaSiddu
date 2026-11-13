import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Scene-specific atmospheric configurations
const SCENE_THEMES = [
  // Scene 01: Deep black, crimson red, warm gold
  {
    particleColors: ['#F5D061', '#E62238', '#FFD700', '#FFF8F0'],
    petalColors: ['#B81424', '#8A0F1C', '#E62238'],
    hasPetals: true,
    particleCountMult: 1.2
  },
  // Scene 02: Midnight blue, violet, cosmic pink
  {
    particleColors: ['#1E88E5', '#9C27B0', '#E03E85', '#00E5FF', '#FFFFFF'],
    petalColors: [],
    hasPetals: false,
    particleCountMult: 1.5
  },
  // Scene 03: Elegant charcoal, champagne gold, warm ivory
  {
    particleColors: ['#F3D8C4', '#E5C583', '#D4AF37', '#FFFDF7'],
    petalColors: [],
    hasPetals: false,
    particleCountMult: 0.8
  },
  // Scene 04: Warm parchment, cream, antique gold
  {
    particleColors: ['#F5D061', '#D4AF37', '#E5A823', '#FFF8EE'],
    petalColors: ['#C57D5D', '#D9822B', '#C48A5E'],
    hasPetals: true,
    particleCountMult: 0.9
  },
  // Scene 05: Emerald green, floral pink, lavender
  {
    particleColors: ['#FFE8A3', '#80E27E', '#BA68C8', '#FFF'],
    petalColors: ['#FF6B9D', '#BA68C8', '#F48FB1'],
    hasPetals: true,
    particleCountMult: 1.3
  },
  // Scene 06: Midnight navy, champagne gold, warm candlelight
  {
    particleColors: ['#FFD700', '#F3D8C4', '#F5D061', '#64B5F6', '#FFE082'],
    petalColors: [],
    hasPetals: false,
    particleCountMult: 1.4
  },
  // Scene 07: Deep burgundy, ivory, soft rose gold
  {
    particleColors: ['#F3D8C4', '#E8A598', '#F5D061', '#FFF8F5'],
    petalColors: ['#8A0F1C', '#B81424', '#D98BA9'],
    hasPetals: true,
    particleCountMult: 1.1
  }
];

export default function ParticleBackground({ activeSceneIndex = 0, intensity = 1.0 }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse influence
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const speedMult = prefersReducedMotion ? 0.25 : 1.0;
    const theme = SCENE_THEMES[activeSceneIndex] || SCENE_THEMES[0];

    // Particles creation
    const baseCount = Math.floor(((width * height) / 12000) * intensity * theme.particleCountMult);
    const particleCount = Math.min(prefersReducedMotion ? 35 : 110, baseCount);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const color = theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.0 + 0.6,
        alpha: Math.random() * 0.7 + 0.25,
        speedX: (Math.random() - 0.5) * 0.35 * speedMult,
        speedY: -(Math.random() * 0.45 + 0.15) * speedMult,
        color,
        pulseSpeed: (Math.random() * 0.02 + 0.01) * speedMult,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    // Petals creation
    const petalCount = theme.hasPetals
      ? Math.min(prefersReducedMotion ? 7 : 20, Math.floor(width / 65))
      : 0;
    const petals = [];

    for (let i = 0; i < petalCount; i++) {
      const color = theme.petalColors[Math.floor(Math.random() * theme.petalColors.length)] || '#B81424';
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 6,
        speedX: (Math.random() - 0.5) * 0.5 * speedMult,
        speedY: (Math.random() * 0.6 + 0.3) * speedMult,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025 * speedMult,
        oscillation: Math.random() * Math.PI * 2,
        oscSpeed: (Math.random() * 0.02 + 0.01) * speedMult,
        alpha: Math.random() * 0.5 + 0.35,
        color
      });
    }

    let tick = 0;
    let isPaused = false;

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isPaused) return;
      tick++;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render stardust particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulse = Math.sin(tick * p.pulseSpeed + p.pulseOffset);
        const currentAlpha = Math.max(0.1, Math.min(1.0, p.alpha + pulse * 0.2));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      // Render petals
      petals.forEach((pt) => {
        pt.y += pt.speedY;
        pt.oscillation += pt.oscSpeed;
        pt.x += Math.sin(pt.oscillation) * 0.8 + pt.speedX;
        pt.rotation += pt.rotSpeed;

        if (pt.y > height + 20) {
          pt.y = -20;
          pt.x = Math.random() * width;
        }
        if (pt.x < -20) pt.x = width + 20;
        if (pt.x > width + 20) pt.x = -20;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(pt.size * 0.6, -pt.size * 0.4, pt.size, pt.size * 0.2, 0, pt.size * 1.2);
        ctx.bezierCurveTo(-pt.size, pt.size * 0.2, -pt.size * 0.6, -pt.size * 0.4, 0, 0);
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSceneIndex, intensity, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-1"
      style={{ opacity: 0.92 }}
    />
  );
}
