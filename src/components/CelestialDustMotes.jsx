import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * CelestialDustMotes
 * High-performance lightweight 2D canvas particle system rendering
 * floating micro-bokeh dust motes in champagne gold, diamond starlight,
 * and twilight indigo that gently react to cursor movements with parallax depth.
 */
export default function CelestialDustMotes({ className = '' }) {
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
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Particle Palette: Warm Champagne Gold, Diamond Starlight, Rose Gold, Twilight Lavender
    const palette = [
      { r: 245, g: 208, b: 169 }, // Champagne Gold (#F5D0A9)
      { r: 255, g: 248, b: 240 }, // Diamond Starlight (#FFF8F0)
      { r: 232, g: 168, b: 124 }, // Rose Gold (#E8A87C)
      { r: 180, g: 160, b: 220 }  // Twilight Lavender
    ];

    const particleCount = prefersReducedMotion ? 25 : (window.innerWidth < 768 ? 40 : 85);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        color,
        alpha: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.15, // Gentle upward drift
        depth: Math.random() * 0.8 + 0.2, // Parallax depth multiplier
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI * 2
      });
    }

    let lastTime = performance.now();

    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;
        const normX = (mouse.x - width / 2) / (width / 2);
        const normY = (mouse.y - height / 2) / (height / 2);
        mouse.vx = normX * 18;
        mouse.vy = normY * 18;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion update
        if (!prefersReducedMotion) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.pulseVal += p.pulseSpeed;

          // Parallax offset based on mouse position & depth
          const parallaxX = mouse.vx * p.depth;
          const parallaxY = mouse.vy * p.depth;

          // Wrap boundaries
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          const currentX = p.x + parallaxX;
          const currentY = p.y + parallaxY;

          // Pulsing opacity
          const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulseVal));

          // Draw soft micro-bokeh dust mote
          const grad = ctx.createRadialGradient(
            currentX,
            currentY,
            0,
            currentX,
            currentY,
            p.radius * 2.4
          );
          grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`);
          grad.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.5})`);
          grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, p.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Static soft dot for reduced motion
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-2 select-none ${className}`}
      aria-hidden="true"
    />
  );
}

