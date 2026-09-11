import React, { useState, useMemo } from 'react';
import { Compass, Wind, Waves, Play, Pause, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SpillDriftForecaster({
  spillCentroid = { x: 500, y: 300 },
  onUpdateDriftPath
}) {
  const [forecastHours, setForecastHours] = useState(24); // 6, 12, 24, 48
  const [currentSpeedKts, setCurrentSpeedKts] = useState(1.4);
  const [currentDirDeg, setCurrentDirDeg] = useState(115); // ESE direction
  const [windSpeedMs, setWindSpeedMs] = useState(6.5);
  const [windDirDeg, setWindDirDeg] = useState(240); // WSW wind blowing towards ENE (60 deg)
  const [isPlaying, setIsPlaying] = useState(false);

  // Physics drift calculation (Standard IMO/NOAA oil spill drift rule):
  // Drift Vector = 100% Ocean Current Vector + 3.0% - 3.5% Wind Vector with 15° Coriolis deflection
  const driftVectors = useMemo(() => {
    // Current component in km/h: 1 knot = 1.852 km/h
    const currentKmh = currentSpeedKts * 1.852;
    const currentRad = (currentDirDeg * Math.PI) / 180;
    const curVx = currentKmh * Math.sin(currentRad);
    const curVy = -currentKmh * Math.cos(currentRad);

    // Wind component: 3.2% of wind speed in km/h with 15 deg Coriolis deflection to the right (Northern hemisphere)
    const windKmh = windSpeedMs * 3.6;
    const windBlowToDeg = (windDirDeg + 180 + 15) % 360;
    const windRad = (windBlowToDeg * Math.PI) / 180;
    const windVx = (0.032 * windKmh) * Math.sin(windRad);
    const windVy = -(0.032 * windKmh) * Math.cos(windRad);

    const totalVx = curVx + windVx;
    const totalVy = curVy + windVy;
    const netSpeedKmh = Math.sqrt(totalVx * totalVx + totalVy * totalVy);
    let netBearing = Math.round((Math.atan2(totalVx, -totalVy) * 180) / Math.PI);
    if (netBearing < 0) netBearing += 360;

    // Build timeline waypoints: T0, T+6h, T+12h, T+24h, T+48h
    const waypoints = [0, 6, 12, 24, 48].map((hrs) => {
      const distKm = +(netSpeedKmh * hrs).toFixed(1);
      // Canvas coordinates scale (1 km ~ 41.6 px)
      const pxOffset = distKm * 18;
      const x = Math.round(spillCentroid.x + pxOffset * Math.sin((netBearing * Math.PI) / 180));
      const y = Math.round(spillCentroid.y - pxOffset * Math.cos((netBearing * Math.PI) / 180));

      return {
        hours: hrs,
        distKm,
        x: Math.max(20, Math.min(980, x)),
        y: Math.max(20, Math.min(580, y))
      };
    });

    return {
      netSpeedKmh: +netSpeedKmh.toFixed(1),
      netSpeedKts: +(netSpeedKmh / 1.852).toFixed(1),
      netBearing,
      waypoints
    };
  }, [currentSpeedKts, currentDirDeg, windSpeedMs, windDirDeg, spillCentroid]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 20 · Interactive Lagrangian Spill Drift Quick-Forecaster
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean px-2 py-0.5 rounded font-bold border border-border-marine">
          Net Drift: {driftVectors.netSpeedKts} kts ({driftVectors.netBearing}&deg;)
        </span>
      </div>

      {/* Forecast Horizon Selector */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted font-bold text-[11px]">DRIFT TRAJECTORY HORIZON:</span>
        <div className="flex gap-1.5">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setForecastHours(h)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                forecastHours === h
                  ? 'bg-ocean text-white border-ocean shadow-sm'
                  : 'bg-ocean-light/40 hover:bg-ocean-sky border-border-marine text-text-secondary'
              }`}
            >
              +{h} Hours
            </button>
          ))}
        </div>
      </div>

      {/* Trajectory Waypoints Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {driftVectors.waypoints.filter(w => w.hours > 0 && w.hours <= forecastHours).map((wp) => (
          <div key={wp.hours} className="p-2 bg-ocean-light/40 rounded-xl border border-border-marine/40 text-center">
            <span className="text-[9.5px] text-text-muted block font-bold">T + {wp.hours} HOURS</span>
            <span className="text-sm font-bold text-ocean-navy">{wp.distKm} km</span>
            <span className="text-[8.5px] text-text-secondary block">Offset: {wp.x}, {wp.y}px</span>
          </div>
        ))}
      </div>

      {/* Physics Sliders (Ocean Current & Wind) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-ocean" />
              <span>OCEAN CURRENT SPEED</span>
            </span>
            <span className="text-ocean font-bold">{currentSpeedKts} kts ({currentDirDeg}&deg;)</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.5"
            step="0.1"
            value={currentSpeedKts}
            onChange={(e) => setCurrentSpeedKts(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-ocean" />
              <span>WIND DEFLECTION (3.2%)</span>
            </span>
            <span className="text-ocean font-bold">{windSpeedMs} m/s ({windDirDeg}&deg;)</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="16.0"
            step="0.5"
            value={windSpeedMs}
            onChange={(e) => setWindSpeedMs(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

