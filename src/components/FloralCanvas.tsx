import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spinSpeed: number;
  opacity: number;
  color: string;
}

export default function FloralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const getPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
    let pixelRatio = getPixelRatio();
    let width = window.innerWidth;
    let height = window.innerHeight;

    const sizeCanvas = () => {
      pixelRatio = getPixelRatio();
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    sizeCanvas();

    const petals: Petal[] = [];
    const colors = [
      'rgba(244, 63, 94, 0.25)', // rose
      'rgba(251, 113, 133, 0.2)', // light rose
      'rgba(252, 165, 185, 0.15)', // bright pink-ish
      'rgba(253, 224, 71, 0.15)', // soft yellow blossoms
      'rgba(241, 116, 175, 0.2)', // orchid
    ];

    // Spawns petals
    const createPetal = (fromBottom = false): Petal => {
      const size = Math.random() * 12 + 6;
      return {
        x: Math.random() * width,
        y: fromBottom ? height + 20 : Math.random() * -100 - 20,
        size,
        speedY: Math.random() * 0.8 + 0.4 + (fromBottom ? -1.2 : 0),
        speedX: Math.random() * 1.5 - 0.75,
        angle: Math.random() * 360,
        spinSpeed: (Math.random() * 0.02 - 0.01) * Math.PI,
        opacity: Math.random() * 0.5 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Populate initially
    const initialPetalCount = window.innerWidth < 640 ? 24 : 45;
    const maxPetalCount = window.innerWidth < 640 ? 70 : 120;

    for (let i = 0; i < initialPetalCount; i++) {
      petals.push(createPetal());
    }

    // Capture scrolling to trigger extra petals
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      if (diff > 5 && petals.length < maxPetalCount) {
        // burst from bottom/top based on scroll direction
        for (let i = 0; i < Math.min(Math.floor(diff / 10), 4); i++) {
          petals.push(createPetal(currentScrollY > lastScrollY));
        }
      }
      lastScrollY = currentScrollY;
    };

    // Mouse interactive pushing
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Handle Resize
    const handleResize = () => {
      sizeCanvas();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Paint loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        // Apply wind physics
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.005) * 0.2; // organic oscillation sway
        p.angle += p.spinSpeed;

        // Interaction with mouse wind bubble
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          const pushX = (dx / dist) * force * 1.5;
          const pushY = (dy / dist) * force * 1.5;
          p.x += pushX;
          p.y += pushY;
        }

        // Draw individual flower petal as beautiful organic ellipse
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        
        // Classic cherry petal curve (double bezier curves)
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size, -p.size, -p.size * 1.5, p.size * 0.5, 0, p.size * 1.2);
        ctx.bezierCurveTo(p.size * 1.5, p.size * 0.5, p.size, -p.size, 0, 0);
        
        ctx.fill();
        
        // Add a subtle petal crease vein
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.8;
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(0, p.size * 0.6, 0, p.size * 1.0);
        ctx.stroke();

        ctx.restore();

        // Recycle petals that drift out
        if (p.y > height + 25 || p.x < -25 || p.x > width + 25) {
          petals[i] = createPetal();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="falling-floral-canvas"
      className="fixed inset-0 pointer-events-none z-10 select-none motion-reduce:hidden"
    />
  );
}
