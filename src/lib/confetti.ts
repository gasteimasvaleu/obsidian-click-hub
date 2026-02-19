import confetti from 'canvas-confetti';

// Confetti básico (Quiz com score alto)
export const fireBasicConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// Confetti de celebração completa (Memory Game, Puzzle completo)
export const fireCompleteConfetti = () => {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#00ff66', '#00ffcc', '#66ff00']
    });
    
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#00ff66', '#00ffcc', '#66ff00']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Confetti de conquista intermediária (cada palavra encontrada no WordSearch)
export const fireMiniConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 40,
    origin: { y: 0.7 },
    colors: ['#00ff66', '#00ffcc'],
    startVelocity: 25,
    gravity: 1.2
  });
};

// Confetti arco-íris (para score perfeito)
export const fireRainbowConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};
