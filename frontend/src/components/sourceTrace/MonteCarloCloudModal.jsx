import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Sliders, X, RotateCcw, Activity } from 'lucide-react';

export default function MonteCarloCloudModal({
  isOpen,
  onClose,
  centroidCoord = "14.6521°N, 67.9015°E",
  uncertaintyRadiusKm = 8.7
}) {
  const canvasRef = useRef(null);
  const [particleCount, setParticleCount] = useState(200);
  const [diffusionKh, setDiffusionKh] = useState(15); // m2/s turbulent diffusion
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width * 0.45;
    const centerY = height * 0.52;

    // Generate particle positions around backward trajectory
    // slick detected at (width * 0.8, height * 0.3) drifting back to (centerX, centerY)
    const startX = width * 0.78;
    const startY = height * 0.32;

    class Particle {
      constructor(idx) {
        this.reset(idx);
      }
      reset(idx) {
        this.progress = Math.random(); // 0 to 1 along reverse path
        this.spread = (Math.random() - 0.5);
        this.speed = 0.002 + Math.random() * 0.003;
        this.baseKh = diffusionKh * (0.8 + Math.random() * 0.4);
        this.colorAlpha = 0.35 + Math.random() * 0.45;
        this.size = 1.8 + Math.random() * 2.2;
      }
      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
      }
      draw(context) {
        // Linear path from detection to origin
        const currentPathX = startX + (centerX - startX) * this.progress;
        const currentPathY = startY + (centerY - startY) * this.progress;

        // Spread increases with progress (backward in time)
        const coneRadius = 5 + (this.progress * 65) * (diffusionKh / 15);
        const randAngle = this.spread * Math.PI * 2;
        const px = currentPathX + Math.cos(randAngle) * (coneRadius * Math.abs(this.spread));
        const py = currentPathY + Math.sin(randAngle) * (coneRadius * 0.65 * Math.abs(this.spread));

        context.beginPath();
        context.arc(px, py, this.size, 0, Math.PI * 2);
        // Color shifts from cyan (T-0 detection) to amber/red (T-40h origin release)
        const r = Math.floor(20 + this.progress * 220);
        const g = Math.floor(140 + (1 - this.progress) * 90);
        const b = Math.floor(230 * (1 - this.progress * 0.6));
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.colorAlpha})`;
        context.fill();
      }
    }

    const particles = Array.from({ length: particleCount }, (_, i) => new Particle(i));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background grid
      ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Uncertainty Cone Envelope (dashed cyan)
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(centerX + 70 * (diffusionKh / 15), centerY - 45 * (diffusionKh / 15));
      ctx.arc(centerX, centerY, 65 * (diffusionKh / 15), -0.6, 2.2);
      ctx.lineTo(startX, startY);
      ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw reverse track line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = "rgba(2, 132, 199, 0.8)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw origin zone ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 45, 30, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244, 63, 94, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(244, 63, 94, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Detection slick marker
      ctx.beginPath();
      ctx.arc(startX, startY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#0284C7";
      ctx.fill();
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 10px monospace";
      ctx.fillText("SLICK DETECTED (T-0h)", startX - 50, startY - 12);

      // Origin centroid marker
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#E11D48";
      ctx.fill();
      ctx.fillStyle = "#E11D48";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`ZONE A ORIGIN (${centroidCoord})`, centerX - 90, centerY + 24);

      // Render all particles
      particles.forEach(p => {
        if (isSimulating) p.update();
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, particleCount, diffusionKh, isSimulating, centroidCoord]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-xs">
      <div className="bg-white border border-border-marine rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-ocean-navy text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ocean-sky" />
            <div>
              <h3 className="font-bold text-sm">Monte Carlo Stochastic Backward Particle Dispersion</h3>
              <p className="text-[11px] text-slate-300 font-mono">
                Lagrangian Random-Walk Simulation · {particleCount} Particles · ±{uncertaintyRadiusKm} km Envelope
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="p-4 bg-slate-900 flex justify-center items-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={280}
            className="w-full h-64 rounded-xl border border-slate-700 bg-slate-950 shadow-inner"
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t border-border-marine space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Particle Density */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-text-secondary">Simulated Particles:</span>
                <span className="font-bold text-ocean-navy">{particleCount} Particles</span>
              </div>
              <div className="flex gap-2">
                {[100, 200, 400, 800].map((count) => (
                  <button
                    key={count}
                    onClick={() => setParticleCount(count)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                      particleCount === count
                        ? 'bg-ocean text-white border-ocean'
                        : 'bg-ocean-light/40 text-text-secondary border-border-marine hover:bg-ocean-light'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Turbulence Diffusion Kh */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-text-secondary">Turbulent Diffusion (Kh):</span>
                <span className="font-bold text-ocean-navy">{diffusionKh} m²/s</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                step={2}
                value={diffusionKh}
                onChange={(e) => setDiffusionKh(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
              />
              <div className="flex justify-between text-[9px] text-text-muted font-mono mt-0.5">
                <span>5 (Low Turb.)</span>
                <span>15 (Open Ocean)</span>
                <span>40 (Monsoon Wave Breaking)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-border-marine flex items-center justify-between">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-xs font-mono font-bold text-ocean-navy"
          >
            {isSimulating ? 'Freeze Particles' : 'Resume Random-Walk'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

