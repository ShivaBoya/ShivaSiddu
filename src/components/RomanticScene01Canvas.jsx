import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * RomanticScene01Canvas
 * High-performance 2D Canvas rendering:
 * 1. Floating Glowing Romantic Hearts (multiple sizes, depths, soft glowing halos, natural sway & rotation)
 * 2. Drifting Velvet Rose Petals (realistic 3D tumbling & aerodynamic flutter)
 * 3. Twinkling Golden Stardust (warm shimmering motes around the rose)
 * 4. Interactive Heart Burst Fountain (triggers when user clicks "Enter Your Universe")
 */
export default function RomanticScene01Canvas({ isBursting, burstOrigin }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const animFrameId = useRef(null);
  const burstParticlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palettes
    const heartColors = [
      { fill: '#FF2E63', glow: '#FF2E63', stroke: '#FFA0B5' }, // Radiant Crimson Pink
      { fill: '#E62238', glow: '#E62238', stroke: '#FF6B8B' }, // Deep Rose Crimson
      { fill: '#FF5E7E', glow: '#FF5E7E', stroke: '#FFE4E8' }, // Soft Romantic Rose
      { fill: '#F5D061', glow: '#F5D061', stroke: '#FFF5D6' }, // Warm Champagne Gold
      { fill: '#D90429', glow: '#FF4D6D', stroke: '#FF8FA3' }, // Velvet Passion
      { fill: '#FF85A1', glow: '#FF85A1', stroke: '#FFFFFF' }, // Rose Quartz
    ];

    const isMobile = width < 768;
    const heartCount = isMobile ? 22 : 36;
    const petalCount = isMobile ? 14 : 24;
    const sparkCount = isMobile ? 35 : 60;

    // 1. Initialize Floating Hearts
    const hearts = Array.from({ length: heartCount }, (_, i) => {
      const palette = heartColors[i % heartColors.length];
      const isForeground = Math.random() < 0.15; // A few hearts close to viewer
      const isBackground = Math.random() < 0.35; // Faint, small distant hearts

      let size = 14 + Math.random() * 12;
      let alpha = 0.5 + Math.random() * 0.4;
      let speedY = 0.45 + Math.random() * 0.65;
      let blur = 10;

      if (isForeground) {
        size = 28 + Math.random() * 14;
        alpha = 0.35 + Math.random() * 0.25;
        speedY = 0.8 + Math.random() * 0.8;
        blur = 18;
      } else if (isBackground) {
        size = 8 + Math.random() * 6;
        alpha = 0.2 + Math.random() * 0.3;
        speedY = 0.25 + Math.random() * 0.35;
        blur = 5;
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        baseAlpha: alpha,
        speedY,
        swaySpeed: 0.012 + Math.random() * 0.02,
        swayAmount: 0.8 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        palette,
        blur,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      };
    });

    // 2. Initialize Drifting Rose Petals
    const petals = Array.from({ length: petalCount }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 10 + Math.random() * 16,
        speedY: 0.5 + Math.random() * 0.8,
        speedX: 0.2 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        alpha: 0.45 + Math.random() * 0.4,
      };
    });

    // 3. Initialize Twinkling Golden Dust Sparks
    const sparks = Array.from({ length: sparkCount }, () => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1 + Math.random() * 2.2,
        speedY: 0.15 + Math.random() * 0.35,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.03 + Math.random() * 0.05,
      };
    });

    // Heart drawing helper (smooth mathematical Bezier curve with sharp bottom tip & soft top lobes)
    function drawHeart(ctx, x, y, size, rotation, palette, alpha, blur) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      if (palette.glow) {
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = blur || 12;
      }
      ctx.fillStyle = palette.fill;

      ctx.beginPath();
      const s = size / 20;
      // Heart centered around (0,0)
      ctx.moveTo(0, -6 * s);
      ctx.bezierCurveTo(-10 * s, -18 * s, -24 * s, -4 * s, -12 * s, 10 * s);
      ctx.bezierCurveTo(-6 * s, 17 * s, 0, 22 * s, 0, 26 * s);
      ctx.bezierCurveTo(0, 22 * s, 6 * s, 17 * s, 12 * s, 10 * s);
      ctx.bezierCurveTo(24 * s, -4 * s, 10 * s, -18 * s, 0, -6 * s);
      ctx.closePath();
      ctx.fill();

      if (palette.stroke) {
        ctx.strokeStyle = palette.stroke;
        ctx.lineWidth = 1 * s;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Petal drawing helper (organic curved velvet rose petal)
    function drawPetal(ctx, x, y, size, rotation, wobble, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(Math.cos(wobble), 1);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      // Velvet gradient
      const grad = ctx.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, '#B81424');
      grad.addColorStop(0.6, '#8A0F1C');
      grad.addColorStop(1, '#4A050D');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.75, -size * 0.5, size * 0.85, size * 0.45, 0, size);
      ctx.bezierCurveTo(-size * 0.85, size * 0.45, -size * 0.75, -size * 0.5, 0, -size);
      ctx.closePath();
      ctx.fill();

      // Subtle rose gold highlight on petal rim
      ctx.strokeStyle = 'rgba(245, 208, 97, 0.25)';
      ctx.lineWidth = 0.75;
      ctx.stroke();

      ctx.restore();
    }

    // Dust spark helper
    function drawSpark(ctx, x, y, radius, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowColor = '#F5D061';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#FFECA0';

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    let time = 0;
    let isHidden = false;

    const handleVisibility = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Main animation loop
    const render = () => {
      if (isHidden) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      time += 1;
      const speedMult = prefersReducedMotion ? 0.2 : 1;

      // 1. Render and update Golden Sparks
      for (let i = 0; i < sparks.length; i++) {
        const sp = sparks[i];
        if (!prefersReducedMotion) {
          sp.y -= sp.speedY;
          sp.x += sp.speedX;
          if (sp.y < -10) {
            sp.y = height + 10;
            sp.x = Math.random() * width;
          }
        }
        const twAlpha = sp.alpha * (0.6 + 0.4 * Math.sin(time * sp.twinkleSpeed + sp.phase));
        drawSpark(ctx, sp.x, sp.y, sp.radius, twAlpha);
      }

      // 2. Render and update Floating Glowing Hearts
      for (let i = 0; i < hearts.length; i++) {
        const h = hearts[i];
        if (!prefersReducedMotion) {
          h.y -= h.speedY * speedMult;
          h.x += Math.sin(time * h.swaySpeed + h.phase) * h.swayAmount * speedMult;
          h.rotation += h.rotSpeed * speedMult;

          // Recycle when floated off-screen
          if (h.y < -50) {
            h.y = height + 30;
            h.x = Math.random() * width;
          }
        }

        const pulseAlpha = h.baseAlpha * (0.8 + 0.2 * Math.sin(time * h.pulseSpeed + h.phase));
        drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.palette, pulseAlpha, h.blur);
      }

      // 3. Render and update Drifting Rose Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        if (!prefersReducedMotion) {
          p.y += p.speedY * speedMult;
          p.x += (p.speedX + Math.sin(time * 0.02 + i)) * speedMult;
          p.rotation += p.rotSpeed * speedMult;
          p.wobble += p.wobbleSpeed * speedMult;

          // Recycle when dropped below bottom
          if (p.y > height + 30) {
            p.y = -30;
            p.x = Math.random() * width;
          }
        }
        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.wobble, p.alpha);
      }

      // 4. Render and update Interactive Heart Burst Particles
      const bursts = burstParticlesRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.95; // air resistance
        b.vy *= 0.95;
        b.alpha -= b.decay;
        b.rotation += b.rotSpeed;

        if (b.type === 'heart') {
          drawHeart(ctx, b.x, b.y, b.size, b.rotation, b.palette, b.alpha, 16);
        } else if (b.type === 'petal') {
          drawPetal(ctx, b.x, b.y, b.size, b.rotation, b.wobble, b.alpha);
        } else {
          drawSpark(ctx, b.x, b.y, b.size, b.alpha);
        }

        if (b.alpha <= 0) {
          bursts.splice(i, 1);
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [prefersReducedMotion]);

  // Trigger Burst Effect when `isBursting` changes to true
  useEffect(() => {
    if (!isBursting) return;

    const originX = burstOrigin?.x || window.innerWidth / 2;
    const originY = burstOrigin?.y || window.innerHeight * 0.85;

    const burstColors = [
      { fill: '#FF2E63', glow: '#FF2E63', stroke: '#FFF0F5' },
      { fill: '#F5D061', glow: '#F5D061', stroke: '#FFFBEA' },
      { fill: '#FF6B8B', glow: '#FF6B8B', stroke: '#FFFFFF' },
      { fill: '#E62238', glow: '#FF3366', stroke: '#FFE4E8' },
      { fill: '#FF85A1', glow: '#FF85A1', stroke: '#FFFFFF' },
    ];

    const newParticles = [];

    // 40 Bursting Hearts
    for (let i = 0; i < 42; i++) {
      const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.3;
      const speed = 4 + Math.random() * 9;
      newParticles.push({
        type: 'heart',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // slightly upward bias
        size: 16 + Math.random() * 18,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.012,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        palette: burstColors[i % burstColors.length],
      });
    }

    // 50 Bursting Golden Sparks
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 11;
      newParticles.push({
        type: 'spark',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        rotation: 0,
        rotSpeed: 0,
      });
    }

    // 16 Bursting Rose Petals
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      newParticles.push({
        type: 'petal',
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 14 + Math.random() * 14,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    burstParticlesRef.current = newParticles;
  }, [isBursting, burstOrigin]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ display: 'block' }}
    />
  );
}

