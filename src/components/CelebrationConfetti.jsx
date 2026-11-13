import confetti from 'canvas-confetti';

export function triggerCelebrationConfetti() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  // Custom colors: Champagne, Rose, Burgundy, Gold
  const colors = ['#F3D8C4', '#D98BA9', '#591D35', '#FFF8F5', '#FFD700', '#E293B3'];

  // Initial burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: colors,
    shapes: ['circle', 'square'],
    scalar: 1.1
  });

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}

export function triggerGentleStars() {
  confetti({
    particleCount: 35,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#F3D8C4', '#D98BA9', '#FFF8F5'],
    ticks: 200,
    gravity: 0.8,
    scalar: 0.9
  });
}

