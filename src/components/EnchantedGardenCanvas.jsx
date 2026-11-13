import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * EnchantedGardenCanvas
 * High-performance 2D Canvas rendering:
 * 1. Bioluminescent Fireflies (sinusoidal flight, soft glowing amber & emerald halos)
 * 2. Drifting Garden Petals (fluttering rose, violet, and gold petals)
 * 3. Fluttering Ethereal Butterflies (flapping wings along smooth bezier flight paths)
 * 4. All-Flower Wish Bloom Burst (when "Make a Wish" transition is triggered)
 */
export default function EnchantedGardenCanvas({ isWishTriggered }) {
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

    const isMobile = width < 768;
    const fireflyCount = isMobile ? 24 : 42;
    const petalCount = isMobile ? 18 : 32;
    const butterflyCount = isMobile ? 3 : 5;

    // Firefly color palettes: Warm Gold, Emerald Mint, Lavender Moonlight
    const fireflyColors = [
      { fill: '#FFE8A3', glow: 'rgba(255, 232, 163, 0.8)' },
      { fill: '#80E27E', glow: 'rgba(128, 226, 126, 0.8)' },
      { fill: '#FFD54F', glow: 'rgba(255, 213, 79, 0.8)' },
      { fill: '#E1BEE7', glow: 'rgba(225, 190, 231, 0.7)' },
      { fill: '#FFF9C4', glow: 'rgba(255, 249, 196, 0.85)' }
    ];

    // 1. Initialize Bioluminescent Fireflies
    const fireflies = Array.from({ length: fireflyCount }, (_, i) => {
      const palette = fireflyColors[i % fireflyColors.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 3.5,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.45,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayAmount: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        palette
      };
    });

    // 2. Initialize Drifting Floral Petals (Rose, Violet, Gold)
    const petalColors = [
      { top: '#FF6B9D', bottom: '#880E4F' },
      { top: '#BA68C8', bottom: '#4A148C' },
      { top: '#FFE082', bottom: '#FF8F00' },
      { top: '#F48FB1', bottom: '#AD1457' }
    ];

    const petals = Array.from({ length: petalCount }, (_, i) => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 9 + Math.random() * 14,
        speedY: 0.35 + Math.random() * 0.7,
        speedX: 0.2 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.025 + Math.random() * 0.02,
        alpha: 0.5 + Math.random() * 0.4,
        colors: petalColors[i % petalColors.length]
      };
    });

    // 3. Initialize Fluttering Butterflies
    const butterflyWings = ['#BA68C8', '#FF6B9D', '#64B5F6', '#81C784'];
    const butterflies = Array.from({ length: butterflyCount }, (_, i) => {
      return {
        x: Math.random() * width,
        y: 80 + Math.random() * (height * 0.65),
        targetX: Math.random() * width,
        targetY: 80 + Math.random() * (height * 0.65),
        speed: 1.2 + Math.random() * 1.0,
        wingPhase: Math.random() * Math.PI * 2,
        wingSpeed: 0.18 + Math.random() * 0.08,
        size: 14 + Math.random() * 8,
        color: butterflyWings[i % butterflyWings.length],
        turnAngle: 0
      };
    });

    function drawPetal(ctx, x, y, size, rotation, wobble, colors, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(Math.cos(wobble), 1);
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const grad = ctx.createLinearGradient(0, -size, 0, size);
      grad.addColorStop(0, colors.top);
      grad.addColorStop(1, colors.bottom);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.8, size * 0.45, 0, size);
      ctx.bezierCurveTo(-size * 0.8, size * 0.45, -size * 0.7, -size * 0.5, 0, -size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawFirefly(ctx, x, y, radius, palette, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = radius * 3 + 8;
      ctx.fillStyle = palette.fill;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawButterfly(ctx, b) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.turnAngle);
      const wingScale = Math.sin(b.wingPhase);

      // Shadow glow
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;

      // Left wing
      ctx.save();
      ctx.scale(wingScale, 1);
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.6, -b.size * 0.3, b.size * 0.65, b.size * 0.45, -0.3, 0, Math.PI * 2);
      ctx.ellipse(-b.size * 0.5, b.size * 0.3, b.size * 0.45, b.size * 0.35, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.scale(-wingScale, 1);
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.ellipse(-b.size * 0.6, -b.size * 0.3, b.size * 0.65, b.size * 0.45, -0.3, 0, Math.PI * 2);
      ctx.ellipse(-b.size * 0.5, b.size * 0.3, b.size * 0.45, b.size * 0.35, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Slender body
      ctx.fillStyle = '#1B0024';
      ctx.beginPath();
      ctx.ellipse(0, 0, 2, b.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trailing fairy sparkle
      ctx.shadowColor = '#FFE8A3';
      ctx.fillStyle = '#FFF8E1';
      ctx.beginPath();
      ctx.arc(0, b.size * 0.8, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    let time = 0;
    let isHidden = false;

    const handleVisibility = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (isHidden) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;
      const speedMult = prefersReducedMotion ? 0.2 : 1;

      // 1. Fireflies
      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];
        if (!prefersReducedMotion) {
          f.x += f.speedX * speedMult + Math.sin(time * f.swaySpeed + f.phase) * 0.4;
          f.y += f.speedY * speedMult + Math.cos(time * f.swaySpeed + f.phase) * 0.4;

          if (f.x < -20) f.x = width + 20;
          if (f.x > width + 20) f.x = -20;
          if (f.y < -20) f.y = height + 20;
          if (f.y > height + 20) f.y = -20;
        }
        const alpha = 0.4 + 0.55 * Math.sin(time * f.pulseSpeed + f.phase);
        drawFirefly(ctx, f.x, f.y, f.size, f.palette, alpha);
      }

      // 2. Drifting Petals
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        if (!prefersReducedMotion) {
          p.y += p.speedY * speedMult;
          p.x += (p.speedX + Math.sin(time * 0.02 + i)) * speedMult;
          p.rotation += p.rotSpeed * speedMult;
          p.wobble += p.wobbleSpeed * speedMult;

          if (p.y > height + 30) {
            p.y = -30;
            p.x = Math.random() * width;
          }
        }
        drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.wobble, p.colors, p.alpha);
      }

      // 3. Butterflies
      for (let i = 0; i < butterflies.length; i++) {
        const b = butterflies[i];
        if (!prefersReducedMotion) {
          const dx = b.targetX - b.x;
          const dy = b.targetY - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 40) {
            b.targetX = Math.random() * width;
            b.targetY = 60 + Math.random() * (height * 0.65);
          } else {
            b.turnAngle = Math.atan2(dy, dx) + Math.PI / 2;
            b.x += (dx / dist) * b.speed * speedMult;
            b.y += (dy / dist) * b.speed * speedMult;
          }
          b.wingPhase += b.wingSpeed;
        }
        drawButterfly(ctx, b);
      }

      // 4. Wish Trigger Burst Particles
      const bursts = burstParticlesRef.current;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const bp = bursts[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.96;
        bp.vy *= 0.96;
        bp.alpha -= bp.decay;
        bp.rotation += bp.rotSpeed;

        if (bp.type === 'firefly') {
          drawFirefly(ctx, bp.x, bp.y, bp.size, bp.palette, bp.alpha);
        } else {
          drawPetal(ctx, bp.x, bp.y, bp.size, bp.rotation, bp.wobble, bp.colors, bp.alpha);
        }

        if (bp.alpha <= 0) {
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

  // When wish is triggered, release a majestic swarm of fireflies and swirling petals
  useEffect(() => {
    if (!isWishTriggered) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const burstParticles = [];

    const fireflyColors = [
      { fill: '#FFE8A3', glow: '#FFE8A3' },
      { fill: '#80E27E', glow: '#80E27E' },
      { fill: '#FF6B9D', glow: '#FF6B9D' },
      { fill: '#BA68C8', glow: '#BA68C8' }
    ];

    const petalColors = [
      { top: '#FF6B9D', bottom: '#880E4F' },
      { top: '#FFE082', bottom: '#FF8F00' },
      { top: '#BA68C8', bottom: '#4A148C' }
    ];

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      burstParticles.push({
        type: 'firefly',
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 3 + Math.random() * 4,
        palette: fireflyColors[i % fireflyColors.length],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.01
      });
    }

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      burstParticles.push({
        type: 'petal',
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 12 + Math.random() * 12,
        colors: petalColors[i % petalColors.length],
        alpha: 1,
        decay: 0.01 + Math.random() * 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        wobble: Math.random() * Math.PI * 2
      });
    }

    burstParticlesRef.current = burstParticles;
  }, [isWishTriggered]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ display: 'block' }}
    />
  );
}

