"use client";
import { useEffect, useRef } from "react";

export default function NeonBackground({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particlesArray = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: `rgba(${150 + Math.random() * 100}, 
                   ${50 + Math.random() * 200}, 
                   ${200 + Math.random() * 50}, 
                   ${Math.random() * 0.6})`
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particlesArray.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        
        p.x += p.speedX;
        p.y += p.speedY;


        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

    
      <div className="absolute inset-0 bg-gradient-to-br from-[#16004b] via-[#090a33] to-[#001428] animate-gradient-wave opacity-90" />

     
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/20 blur-[160px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-400/20 blur-[160px] rounded-full animate-pulse-slower" />

      <div className="pointer-events-none absolute inset-0 animate-sparkle-layer"></div>


      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 2 }}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
