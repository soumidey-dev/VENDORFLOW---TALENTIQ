import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  theme?: 'dark' | 'light';
  variant?: 'hero' | 'full' | 'subtle';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  theme = 'dark',
  variant = 'full'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDark = theme === 'dark';

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

    // Particle/Node setup
    const particleCount = variant === 'hero' ? 45 : 30;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }> = [];

    const colorsDark = ['#10b981', '#14b8a6', '#6366f1', '#3b82f6'];
    const colorsLight = ['#059669', '#0d9488', '#4f46e5', '#2563eb'];

    for (let i = 0; i < particleCount; i++) {
      const palette = isDark ? colorsDark : colorsLight;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    let scanLineY = 0;
    const scanSpeed = 1.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      const gridSize = 60;
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(15, 23, 42, 0.03)';

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw animated AI Audit scanning beam
      scanLineY = (scanLineY + scanSpeed) % (height + 200);
      const gradient = ctx.createLinearGradient(0, scanLineY - 60, 0, scanLineY);
      const scanColorStart = isDark ? 'rgba(16, 185, 129, 0)' : 'rgba(16, 185, 129, 0)';
      const scanColorEnd = isDark ? 'rgba(16, 185, 129, 0.07)' : 'rgba(16, 185, 129, 0.08)';
      gradient.addColorStop(0, scanColorStart);
      gradient.addColorStop(1, scanColorEnd);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanLineY - 60, width, 60);

      ctx.beginPath();
      ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      // Render & connect particles/nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        p.alpha = Math.max(0.1, Math.min(0.6, p.alpha));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 130) * 0.15;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, variant]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Canvas for animated particles and AI scan beam */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Ambient Morphing Glowing Orbs */}
      <div 
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] opacity-40 animate-pulse pointer-events-none ${
          isDark ? 'bg-emerald-500/20' : 'bg-emerald-300/30'
        }`}
        style={{ animationDuration: '8s' }}
      />
      <div 
        className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-[150px] opacity-35 animate-pulse pointer-events-none ${
          isDark ? 'bg-indigo-600/20' : 'bg-indigo-300/30'
        }`}
        style={{ animationDuration: '12s' }}
      />
      <div 
        className={`absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full blur-[140px] opacity-30 animate-pulse pointer-events-none ${
          isDark ? 'bg-teal-500/20' : 'bg-teal-300/20'
        }`}
        style={{ animationDuration: '10s' }}
      />
    </div>
  );
};
