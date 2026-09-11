import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Compass, Waves, Activity, FastForward, Clock } from 'lucide-react';

export default function IncidentDriftPreviewModal({ 
  incident, 
  onClose,
  onOpenFullSimulation
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [simHour, setSimHour] = useState(0); // 0 to 72 hours
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const initialArea = incident?.areaKm2 || incident?.spillAreaKm2 || 14.7;
  const windSpeed = 14.2;
  const windDirDeg = 310; // NW
  const currentSpeed = 0.42;
  const currentDirDeg = 128; // SE

  // Generate 80 deterministic Lagrangian particles around center
  const particles = useRef(
    Array.from({ length: 90 }, (_, i) => {
      const angle = (i * 137.5) * (Math.PI / 180);
      const dist = Math.sqrt((i + 1) / 90) * 25;
      return {
        baseX: dist * Math.cos(angle),
        baseY: dist * Math.sin(angle) * 0.7,
        randomSpeedFactor: 0.8 + Math.random() * 0.4,
        diffusionAngle: Math.random() * Math.PI * 2
      };
    })
  );

  // Weathering percentages function of simulated elapsed hours
  const weathering = {
    evaporated: Math.min(30, +(10 + simHour * 0.28).toFixed(1)),
    emulsified: Math.min(45, +(8 + simHour * 0.48).toFixed(1)),
    dispersed: Math.min(15, +(3 + simHour * 0.15).toFixed(1)),
    surface: Math.max(10, +(100 - (10 + simHour * 0.28) - (8 + simHour * 0.48) - (3 + simHour * 0.15)).toFixed(1))
  };

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        setSimHour((prev) => {
          const next = prev + delta * 2 * playbackSpeed;
          if (next >= 72) {
            return 0; // loop or clamp
          }
          return next;
        });
      }

      // Draw frame on canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0a192f';
        ctx.fillRect(0, 0, width, height);

        // Draw tactical bathymetry grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Center origin coordinates
        const originX = width * 0.25;
        const originY = height * 0.35;

        // Drift vector (SE drift direction)
        // Current pushes SE (128°), Wind blows from 310° towards 130°
        const driftAngleRad = (130 * Math.PI) / 180;
        const driftDistance = simHour * 3.2; // pixels per hour
        const currentCenterX = originX + driftDistance * Math.sin(driftAngleRad);
        const currentCenterY = originY - driftDistance * Math.cos(driftAngleRad);

        // Draw drift trajectory track line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(currentCenterX, currentCenterY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Origin marker (Discharge Point)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.beginPath();
        ctx.arc(originX, originY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.font = '10px monospace';
        ctx.fillText('DISCHARGE (T+0)', originX - 35, originY - 10);

        // Draw Lagrangian Particles
        const expansionFactor = 1 + (simHour / 72) * 2.2;
        particles.current.forEach((p) => {
          const px = currentCenterX + p.baseX * expansionFactor + Math.sin(p.diffusionAngle) * (simHour * 0.4);
          const py = currentCenterY + p.baseY * expansionFactor + Math.cos(p.diffusionAngle) * (simHour * 0.4);

          // Density color from core (dark brown/black) to edge (sheen cyan)
          const rad = 2.5 + Math.random() * 1.5;
          ctx.fillStyle = p.randomSpeedFactor > 1.0 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.85)';
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        });

        // Current centroid pulse
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(currentCenterX, currentCenterY, 8 + Math.sin(time * 0.005) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`CENTROID (T+${Math.round(simHour)}h)`, currentCenterX + 12, currentCenterY + 4);

        // Environmental Vector Compass in top-right corner
        const compX = width - 60;
        const compY = 55;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(compX, compY, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Wind Vector (Cyan)
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(compX, compY);
        ctx.lineTo(compX + 22 * Math.sin(driftAngleRad), compY - 22 * Math.cos(driftAngleRad));
        ctx.stroke();

        ctx.fillStyle = '#06b6d4';
        ctx.font = '9px monospace';
        ctx.fillText('DRIFT 130°', compX - 25, compY + 40);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, playbackSpeed, simHour]);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-border-marine flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-ocean-navy text-sm">
                  Rapid Drift Trajectory Quick-Preview
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-ocean-light text-ocean text-[10px] font-mono font-bold">
                  {incident?.id || "OF-2026-0912"}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Coupled atmospheric-oceanic Lagrangian forward particle dispersion (T+0 to T+72h).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border-marine hover:bg-white text-text-muted hover:text-ocean-navy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-slate-950">
          <canvas
            ref={canvasRef}
            width={700}
            height={360}
            className="w-full h-[320px] sm:h-[360px] block"
          />

          {/* Current Elapsed Badge overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulated Horizon: <strong className="text-cyan-300">T+{Math.round(simHour)}h</strong> / 72h</span>
          </div>

          {/* Area & Expansion Stats */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-mono text-white/80 space-x-3">
            <span>Area: <b className="text-amber-400">{(initialArea * (1 + simHour * 0.012)).toFixed(1)} km²</b></span>
            <span>Est. Drift Velocity: <b className="text-cyan-400">1.25 kn SE</b></span>
          </div>
        </div>

        {/* Interactive Controls & Weathering */}
        <div className="p-4 bg-slate-50 space-y-3">
          {/* Time Scrub Slider */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-ocean hover:bg-ocean-deep text-white transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { setSimHour(0); setIsPlaying(true); }}
              className="p-2 rounded-lg border border-border-marine hover:bg-white text-text-muted hover:text-ocean-navy"
              title="Reset Horizon"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="72"
                step="0.5"
                value={simHour}
                onChange={(e) => {
                  setSimHour(parseFloat(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-ocean"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted mt-0.5">
                <span>T+0 (Detection)</span>
                <span>T+24h</span>
                <span>T+48h</span>
                <span>T+72h (Forecast Horizon)</span>
              </div>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center rounded-lg border border-border-marine overflow-hidden bg-white text-xs font-mono">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 font-bold ${
                    playbackSpeed === spd ? 'bg-ocean text-white' : 'text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Weathering Bar */}
          <div className="bg-white p-3 rounded-xl border border-border-marine space-y-1.5 text-xs">
            <div className="flex justify-between text-text-secondary font-mono text-[11px]">
              <span className="font-bold text-ocean-navy">Real-time Weathering & Mass Balance:</span>
              <span>Surface Oil Remaining: <b>{weathering.surface}%</b></span>
            </div>

            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100">
              <div style={{ width: `${weathering.surface}%` }} className="bg-red-500" title={`Surface: ${weathering.surface}%`} />
              <div style={{ width: `${weathering.emulsified}%` }} className="bg-amber-500" title={`Emulsified: ${weathering.emulsified}%`} />
              <div style={{ width: `${weathering.evaporated}%` }} className="bg-cyan-400" title={`Evaporated: ${weathering.evaporated}%`} />
              <div style={{ width: `${weathering.dispersed}%` }} className="bg-blue-600" title={`Dispersed: ${weathering.dispersed}%`} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-text-muted pt-1">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500"></span> Surface ({weathering.surface}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500"></span> Emulsified ({weathering.emulsified}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400"></span> Evaporated ({weathering.evaporated}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-600"></span> Dispersed ({weathering.dispersed}%)</span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-text-muted font-mono">
              Hydrodynamic vectors: Wind 14.2 kn NW • Current 0.42 m/s SE
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-border-marine text-xs text-text-secondary hover:bg-white"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenFullSimulation) onOpenFullSimulation();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Open Full Simulation Engine →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

