import { useEffect, useRef } from "react";

/**
 * PyroEffect
 * Real stage-pyro style: two dense, continuous vertical fountains shoot
 * up from the bottom-left and bottom-right corners with teal/white sparks
 * and a teal base flash, matching a real wrestling-entrance pyro column.
 * Once the fountain finishes firing, a soft teal fog bank
 * lingers on screen and slowly dissolves, like real stage haze settling.
 * Fires once on mount, runs for ~1.4s fountain + ~4s lingering fog, then
 * cleans itself up.
 *
 * Usage: just drop <PyroEffect /> anywhere in Home.jsx (it renders a
 * fixed, full-screen, pointer-events:none canvas on top of everything).
 */
const PyroEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    const flashes = [];
    const smokePuffs = [];
    const hazeParticles = [];
    const lingeringFog = [];
    let fogSpawned = false;

    const rand = (min, max) => Math.random() * (max - min) + min;

    // Sparks cool from a white-hot core to deep teal as they rise
    // and slow down — real pyro sparks change color as they lose heat.
    const hotColors = ["255,255,255", "255,250,240", "245,225,255"];
    const coolColors = ["36,177,177", "36,177,177", "0,121,121", "0,121,121"];

    // Two emitters (bottom-left, bottom-right). Each fires a tight,
    // continuous vertical fountain for `emitDuration` ms, then the
    // remaining particles fall/fade naturally.
    const emitters = [
      { x: 40, y: height - 12, active: true },
      { x: width - 40, y: height - 12, active: true },
    ];

    const emitDuration = 1400; // ms of continuous fountain
    const fountainHeight = Math.min(height * 0.55, 340);

    function emitParticle(emitter) {
      // Narrow upward stream with slight horizontal jitter, like a real
      // vertical fountain rather than a wide bursting cone
      const speed = rand(fountainHeight / 32, fountainHeight / 22);
      particles.push({
        x: emitter.x + rand(-3, 3),
        y: emitter.y,
        vx: rand(-0.5, 0.5),
        vy: -speed,
        life: 0,
        maxLife: rand(55, 90),
        size: rand(1, 2.8),
        hot: hotColors[Math.floor(rand(0, hotColors.length))],
        cool: coolColors[Math.floor(rand(0, coolColors.length))],
        gravity: rand(0.16, 0.24),
        drag: rand(0.988, 0.996),
        wobblePhase: rand(0, Math.PI * 2),
        wobbleSpeed: rand(0.15, 0.35),
        turbulence: rand(-0.012, 0.012),
      });
    }

    function emitHaze(emitter) {
      // Faint drifting smoke/mist that rises slowly around the column,
      // like the haze visible around a real pyro fountain
      hazeParticles.push({
        x: emitter.x + rand(-14, 14),
        y: height - rand(4, 40),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.55, -0.3),
        life: 0,
        maxLife: rand(70, 120),
        radius: rand(18, 34),
        growth: rand(0.25, 0.5),
      });
    }

    function spawnFlash(emitter) {
      flashes.push({
        x: emitter.x,
        y: emitter.y,
        life: 0,
        maxLife: 14,
        maxRadius: rand(34, 46),
        flicker: rand(0.75, 1),
      });
      // Soft teal smoke glow that lingers at the base
      smokePuffs.push({
        x: emitter.x,
        y: emitter.y,
        life: 0,
        maxLife: emitDuration / 16,
        maxRadius: rand(50, 65),
      });
    }

    spawnFlash(emitters[0]);
    spawnFlash(emitters[1]);

    let rafId;
    let elapsed = 0;
    let lastFlashRefresh = 0;
    let lastTime = performance.now();

    function frame(now) {
      const dt = now - lastTime;
      lastTime = now;
      elapsed += dt;

      ctx.clearRect(0, 0, width, height);

      // Keep emitting a dense, tight stream while the fountain is "on"
      if (elapsed < emitDuration) {
        emitters.forEach((emitter) => {
          for (let i = 0; i < 14; i++) emitParticle(emitter);
          if (Math.random() < 0.7) emitHaze(emitter);
        });
        // periodically refresh the base flash so it keeps glowing
        if (elapsed - lastFlashRefresh > 90) {
          lastFlashRefresh = elapsed;
          spawnFlash(emitters[0]);
          spawnFlash(emitters[1]);
        }
      }

      // Once the fountain stops firing, leave a lingering fog bank behind
      // that slowly drifts and dissolves, like real stage haze settling
      if (elapsed >= emitDuration && !fogSpawned) {
        fogSpawned = true;
        emitters.forEach((emitter) => {
          const puffCount = 9;
          for (let i = 0; i < puffCount; i++) {
            lingeringFog.push({
              x: emitter.x + rand(-60, 160) * (emitter.x < width / 2 ? 1 : -1),
              y: height - rand(10, 90),
              vx: rand(-0.12, 0.12),
              vy: rand(-0.08, -0.02),
              life: 0,
              maxLife: rand(220, 340),
              radius: rand(60, 130),
              growth: rand(0.15, 0.3),
              maxAlpha: rand(0.08, 0.16),
            });
          }
        });
      }

      // Ambient light spill: soft, wide teal glow cast on the area
      // around each fountain, like real pyro lighting up its surroundings
      const ambientProgress = Math.min(elapsed / 260, 1);
      const ambientFade = elapsed > emitDuration
        ? Math.max(0, 1 - (elapsed - emitDuration) / 700)
        : ambientProgress;
      if (ambientFade > 0) {
        ctx.globalCompositeOperation = "screen";
        emitters.forEach((emitter) => {
          const glowRadius = Math.min(width * 0.32, 320);
          const gradient = ctx.createRadialGradient(
            emitter.x, height * 0.65, 0,
            emitter.x, height * 0.65, glowRadius
          );
          gradient.addColorStop(0, `rgba(36, 177, 177, ${0.16 * ambientFade})`);
          gradient.addColorStop(0.5, `rgba(0, 121, 121, ${0.08 * ambientFade})`);
          gradient.addColorStop(1, "rgba(0, 121, 121, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(emitter.x, height * 0.65, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalCompositeOperation = "source-over";
      }

      // Lingering fog bank left behind after the fountain stops
      for (let i = lingeringFog.length - 1; i >= 0; i--) {
        const g = lingeringFog[i];
        g.life++;
        const progress = g.life / g.maxLife;
        if (progress >= 1) {
          lingeringFog.splice(i, 1);
          continue;
        }
        g.x += g.vx;
        g.y += g.vy;
        const radius = g.radius + g.growth * g.life;
        // fades in quickly, lingers, then fades out slowly
        const fadeIn = Math.min(g.life / 20, 1);
        const fadeOut = 1 - progress;
        const alpha = g.maxAlpha * fadeIn * fadeOut;
        const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, radius);
        gradient.addColorStop(0, `rgba(36, 177, 177, ${alpha})`);
        gradient.addColorStop(0.6, `rgba(0, 121, 121, ${alpha * 0.6})`);
        gradient.addColorStop(1, "rgba(0, 121, 121, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(g.x, g.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Rising haze/mist around the column
      for (let i = hazeParticles.length - 1; i >= 0; i--) {
        const h = hazeParticles[i];
        h.life++;
        const progress = h.life / h.maxLife;
        if (progress >= 1) {
          hazeParticles.splice(i, 1);
          continue;
        }
        h.x += h.vx;
        h.y += h.vy;
        h.vy *= 0.995;
        const radius = h.radius + h.growth * h.life;
        const alpha = (1 - progress) * 0.14;
        const gradient = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, radius);
        gradient.addColorStop(0, `rgba(36, 177, 177, ${alpha})`);
        gradient.addColorStop(1, "rgba(0, 121, 121, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(h.x, h.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Base smoke glow (soft, teal, lingers under the column)
      for (let i = smokePuffs.length - 1; i >= 0; i--) {
        const s = smokePuffs[i];
        s.life++;
        const progress = s.life / s.maxLife;
        if (progress >= 1) {
          smokePuffs.splice(i, 1);
          continue;
        }
        const radius = s.maxRadius;
        const alpha = (1 - progress) * 0.35;
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius);
        gradient.addColorStop(0, `rgba(36, 177, 177, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(36, 177, 177, ${alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(0, 121, 121, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bright nozzle flash (with a slight camera-like flicker)
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life++;
        const progress = f.life / f.maxLife;
        if (progress >= 1) {
          flashes.splice(i, 1);
          continue;
        }
        const radius = f.maxRadius * (0.4 + progress * 0.6);
        const alpha = (1 - progress) * f.flicker;
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius);
        gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(0.35, `rgba(36, 177, 177, ${alpha * 0.8})`);
        gradient.addColorStop(0.7, `rgba(36, 177, 177, ${alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(36, 177, 177, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw + update sparks (tight fountain column, cooling color + twinkle)
      ctx.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Turbulence makes the column feel alive instead of perfectly straight
        p.vx += p.turbulence;
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx + Math.sin(p.life * p.wobbleSpeed + p.wobblePhase) * 0.15;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        // Cool from hot (white) to teal as the spark ages
        const color = lifeRatio < 0.35 ? p.hot : p.cool;
        const twinkle = 0.75 + 0.25 * Math.sin(p.life * p.wobbleSpeed * 3 + p.wobblePhase);
        const alpha = (1 - lifeRatio) * twinkle;
        const size = p.size * (1 - lifeRatio * 0.3);

        // Glow core
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Short trailing streak (sparks falling through the column)
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color},${alpha * 0.5})`;
        ctx.lineWidth = size * 0.55;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 0.8);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";

      const stillEmitting = elapsed < emitDuration;
      const stillVisible =
        particles.length > 0 ||
        flashes.length > 0 ||
        smokePuffs.length > 0 ||
        hazeParticles.length > 0 ||
        lingeringFog.length > 0;
      if (stillEmitting || stillVisible) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pyro-effect-canvas"
      aria-hidden="true"
    />
  );
};

export default PyroEffect;