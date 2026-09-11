import React from 'react';
import { CloudRain, Wind, Waves, Thermometer, Compass, Timer, Sparkles } from 'lucide-react';

export default function MetOceanCorrelatorCard({ vessel, caseData }) {
  const env = caseData?.environment || {
    windSpeedKn: 14.2,
    windDirectionDeg: 310,
    waveHeightM: 1.8,
    wavePeriodSec: 6.4,
    seaSurfaceTempC: 28.4,
    currentSpeedMs: 0.42
  };

  // Kelvin wake persistence formula based on wind speed & hull displacement
  // Stronger wind dissipates capillary waves faster
  const wakePersistenceHours = Math.max(1.2, (24 / (env.windSpeedKn || 14.2)) * 1.8).toFixed(1);
  const beaufortScale = env.windSpeedKn < 1 ? 0 : env.windSpeedKn <= 3 ? 1 : env.windSpeedKn <= 6 ? 2 : env.windSpeedKn <= 10 ? 3 : env.windSpeedKn <= 16 ? 4 : 5;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              MetOcean Dynamics & Kelvin Wake Correlator
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Coupled atmospheric boundary layer & radar surface roughness at vessel fix
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-ocean-sky text-ocean-deep font-bold text-[10px]">
          BEAUFORT FORCE {beaufortScale}
        </span>
      </div>

      {/* Grid of Weather Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-[9px] text-text-muted">
            <span>SURFACE WIND</span>
            <Wind className="w-3 h-3 text-ocean" />
          </div>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {env.windSpeedKn} kn
          </span>
          <span className="text-[9px] text-text-muted">{env.windDirectionDeg || 310}° NW Azimuth</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-[9px] text-text-muted">
            <span>SIGNIFICANT WAVE</span>
            <Waves className="w-3 h-3 text-ocean-deep" />
          </div>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {env.waveHeightM} m (Hs)
          </span>
          <span className="text-[9px] text-text-muted">Period: {env.wavePeriodSec} sec</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-[9px] text-text-muted">
            <span>SEA SURFACE TEMP</span>
            <Thermometer className="w-3 h-3 text-status-warning" />
          </div>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {env.seaSurfaceTempC}°C
          </span>
          <span className="text-[9px] text-text-muted">High evaporation rate</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-[9px] text-text-muted">
            <span>OCEAN CURRENT</span>
            <Compass className="w-3 h-3 text-text-primary" />
          </div>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {env.currentSpeedMs} m/s
          </span>
          <span className="text-[9px] text-text-muted">128° (SE) Advection</span>
        </div>
      </div>

      {/* Wake Persistence & SAR Radar Detectability Box */}
      <div className="p-3 bg-ocean-light/80 rounded-xl border border-border-marine space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-ocean-navy flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-ocean" />
            RADAR KELVIN WAKE PERSISTENCE WINDOW
          </span>
          <span className="font-bold text-ocean-deep text-sm">{wakePersistenceHours} Hours</span>
        </div>

        <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
          At {env.windSpeedKn} knots wind velocity, the capillary-gravity waves dampened by the vessel's surfactant wash and stern vortex maintain low radar backscatter for approximately <strong>{wakePersistenceHours} hours</strong>, matching the Sentinel-1 SAR acquisition timestamp over transit coordinates.
        </p>
      </div>
    </div>
  );
}

