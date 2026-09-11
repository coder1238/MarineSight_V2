import React, { useState } from 'react';
import { Compass, Ship, Navigation, AlertTriangle, ArrowUpRight, Zap } from 'lucide-react';

export default function DarkVesselWakeTracer({
  vessel = {
    id: "T1",
    name: "Pacific Horizon (Dark AIS)",
    lengthM: 274,
    heading: 284,
    pos: "14.821°N, 68.210°E"
  },
  onProjectTrajectory
}) {
  const [wakeWavelengthM, setWakeWavelengthM] = useState(48); // meters between transverse wake crests
  const [kelvinAngle, setKelvinAngle] = useState(19.5); // classic Kelvin wake angle is 19°28' = 19.47°

  // Physics calculation: Deep water gravity wave phase velocity:
  // v = sqrt( (g * lambda) / (2 * pi) ) in m/s
  // 1 m/s = 1.94384 knots
  const g = 9.80665;
  const speedMs = Math.sqrt((g * wakeWavelengthM) / (2 * Math.PI));
  const speedKnots = (speedMs * 1.94384).toFixed(1);
  const dischargeDistanceKm = 4.6;
  const timeSinceDischargeMin = Math.round((dischargeDistanceKm / (speedMs * 3.6 / 1000)) * 60);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 8 · Dark Vessel Kelvin Wake & Trajectory Tracer
          </h3>
        </div>
        <span className="text-[10px] bg-red-50 text-status-danger border border-red-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>Suspect Wake Correlation</span>
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">CALCULATED SPEED</span>
          <span className="text-base font-bold text-ocean-navy">{speedKnots} knots</span>
          <span className="text-[9px] text-text-secondary block">({speedMs.toFixed(1)} m/s)</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">KELVIN HALF-ANGLE</span>
          <span className="text-base font-bold text-ocean">{kelvinAngle}&deg;</span>
          <span className="text-[9px] text-text-secondary block">Theoretical 19.47&deg;</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">WAKE WAVELENGTH (&lambda;)</span>
          <span className="text-base font-bold text-text-primary">{wakeWavelengthM} meters</span>
          <span className="text-[9px] text-text-secondary block">SAR Cross-Swath</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">EST. DISCHARGE LAG</span>
          <span className="text-base font-bold text-status-danger">~{timeSinceDischargeMin} mins ago</span>
          <span className="text-[9px] text-text-secondary block">Distance: {dischargeDistanceKm} km</span>
        </div>
      </div>

      {/* Interactive Wake Slider */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-border-marine text-xs space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-text-muted font-bold">SAR TRANSVERSE WAKE WAVELENGTH (&lambda;)</span>
          <span className="text-ocean font-bold">{wakeWavelengthM}m &rarr; {speedKnots} kts</span>
        </div>
        <input
          type="range"
          min="15"
          max="95"
          value={wakeWavelengthM}
          onChange={(e) => setWakeWavelengthM(parseInt(e.target.value))}
          className="w-full h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-text-muted">
          <span>Slow (15m ~ 9.4 kts)</span>
          <span>Cruising (48m ~ 16.8 kts)</span>
          <span>Flank Speed (95m ~ 23.6 kts)</span>
        </div>
      </div>

      {/* Trajectory Backtrack Projection */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-ocean-sky/40 border border-ocean/20 text-xs text-ocean-deep">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ocean flex-shrink-0" />
          <span className="text-[11px]">
            Backtrack ray tracing projects trajectory inverse to heading {vessel.heading}&deg; ({vessel.heading - 180}&deg;) intersecting Slick Centroid.
          </span>
        </div>
        <button
          onClick={onProjectTrajectory}
          className="px-2.5 py-1 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-[10.5px] flex items-center gap-1 transition-all flex-shrink-0 ml-2"
        >
          <span>Plot Vector</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

