import { useEffect, useRef, useState } from "react";

function getResponsiveHeight() {
  const w = window.innerWidth;
  if (w < 480) return 280;
  if (w < 768) return 360;
  if (w < 1024) return 440;
  return 520;
}

export default function ArtSilkThreadsSection({ height }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(
    () => height ?? getResponsiveHeight()
  );

  // =====================================
  // RESPONSIVE HEIGHT
  // =====================================
  useEffect(() => {
    if (height != null) return; // caller controls height — skip

    const onResize = () => setCanvasHeight(getResponsiveHeight());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [height]);

  // =====================================
  // SCROLL REVEAL (Intersection Observer)
  // =====================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 } // slightly earlier trigger on small screens
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // =====================================
  // CANVAS ANIMATION
  // =====================================
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    let width, heightPx;
    let animationId;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = container.offsetWidth;
      heightPx = container.offsetHeight;

      // HiDPI / retina support
      canvas.width = width * dpr;
      canvas.height = heightPx * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${heightPx}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // -------------------------
    // COLORS
    // -------------------------
    const THREAD = [38, 79, 171];
    const PARTICLE = [
      Math.max(THREAD[0] - 40, 0),
      Math.max(THREAD[1] - 40, 0),
      Math.max(THREAD[2] - 40, 0),
    ];

    // -------------------------
    // RESPONSIVE SETTINGS
    // -------------------------
    const isMobile = () => width < 480;
    const isTablet = () => width >= 480 && width < 1024;

    const LAYERS = 9;
    const BREATH_SPEED = 0.004;

    const particles = [];
    for (let i = 0; i < LAYERS; i++) {
      particles[i] = [];
      const count = 2 + Math.floor(Math.random() * 3);
      for (let p = 0; p < count; p++) {
        particles[i].push({
          progress: Math.random(),
          speed: 0.00005 + Math.random() * 0.00025,
          size: 1.2 + Math.random() * 3.5,
        });
      }
    }

    function wave(x, centerY, baseAmp, phase, breathe, freq) {
      return centerY + Math.sin(x * freq + phase) * (baseAmp + breathe);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, heightPx);

      const centerY = heightPx / 2;

      // Scale amplitude so threads fit within the visible height
      const ampScale = isMobile() ? 0.45 : isTablet() ? 0.65 : 1;
      // Higher frequency on narrow screens so pattern is still visible
      const freqScale = isMobile() ? 1.6 : isTablet() ? 1.25 : 1;

      for (let i = 0; i < LAYERS; i++) {
        const spread = i - LAYERS / 2;

        const baseAmplitude = (80 + Math.abs(spread) * 10) * ampScale;
        const frequency = 0.0045 * freqScale;
        const phase = spread * 0.45;
        const breathing = Math.sin(time + i * 0.7) * 16 * ampScale;

        const opacity = 0.25 + (1 - Math.abs(spread) / LAYERS) * 0.45;

        // -------- THREAD --------
        ctx.beginPath();

        for (let x = 0; x <= width; x++) {
          const y = wave(x, centerY, baseAmplitude, phase, breathing, frequency);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(${THREAD[0]}, ${THREAD[1]}, ${THREAD[2]}, ${opacity})`;
        ctx.lineWidth = Math.abs(spread) < 2 ? (isMobile() ? 2.5 : 4) : (isMobile() ? 1.5 : 2.4);
        ctx.stroke();

        // -------- PARTICLES --------
        particles[i].forEach((pt) => {
          pt.progress += pt.speed;
          if (pt.progress > 1) pt.progress = 0;

          const x = pt.progress * width;
          const y = wave(x, centerY, baseAmplitude, phase, breathing, frequency);

          const size = isMobile() ? pt.size * 0.7 : pt.size;

          const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 1.2);
          glow.addColorStop(0, `rgba(${PARTICLE[0]}, ${PARTICLE[1]}, ${PARTICLE[2]}, 0.8)`);
          glow.addColorStop(1, `rgba(${PARTICLE[0]}, ${PARTICLE[1]}, ${PARTICLE[2]}, 0)`);

          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      time += BREATH_SPEED;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // =====================================
  // RENDER
  // =====================================
  return (
    <section
      ref={containerRef}
      style={{
        width: "100%",
        height: `${canvasHeight}px`,
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0px) scale(1)"
          : "translateY(60px) scale(0.96)",
        transition:
          "opacity 1.2s ease-out, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
        }}
      />
    </section>
  );
}