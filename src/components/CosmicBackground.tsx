import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      baseAlpha: number;
    }

    const starCount = Math.floor(Math.min(180, (width * height) / 9000));
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      baseAlpha: Math.random() * 0.5 + 0.2
    }));

    // Aquatic light particles (slow upward drift)
    interface HydroParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      color: string;
      alpha: number;
    }

    const hydroColors = [
      'rgba(6, 182, 212, ',   // cyan
      'rgba(14, 165, 233, ',  // sky
      'rgba(20, 184, 166, ',  // teal
      'rgba(56, 189, 248, '   // electric cyan
    ];

    const hydroParticles: HydroParticle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      color: hydroColors[Math.floor(Math.random() * hydroColors.length)],
      alpha: Math.random() * 0.5 + 0.2
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Deep space ocean gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040812');
      bgGrad.addColorStop(0.5, '#060f1e');
      bgGrad.addColorStop(1, '#03070f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient radial cyan / teal clouds
      const ambient1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.25,
        10,
        width * 0.2,
        height * 0.25,
        width * 0.45
      );
      ambient1.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
      ambient1.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = ambient1;
      ctx.fillRect(0, 0, width, height);

      const ambient2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        10,
        width * 0.8,
        height * 0.7,
        width * 0.4
      );
      ambient2.addColorStop(0, 'rgba(20, 184, 166, 0.05)');
      ambient2.addColorStop(1, 'rgba(20, 184, 166, 0)');
      ctx.fillStyle = ambient2;
      ctx.fillRect(0, 0, width, height);

      // Render Stars
      stars.forEach((star) => {
        const twinkle = Math.sin(frame * star.twinkleSpeed) * 0.3;
        const currentAlpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${currentAlpha})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
        ctx.shadowBlur = star.radius > 1 ? 4 : 0;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Render Hydro Particles
      hydroParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
