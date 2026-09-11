import React, { useState, useMemo } from 'react';
import { Compass, Wind, Waves, Thermometer, Sun, Moon, RefreshCw } from 'lucide-react';

export default function VectorShearCompassHUD({ 
  baseWindSpeedKn = 14.2,
  baseWindDirDeg = 310,
  baseCurrentSpeedMs = 0.42,
  baseCurrentDirDeg = 128,
  spillOrientationDeg = 37,
  sstC = 28.4
}) {
  const [windSpeed, setWindSpeed] = useState(baseWindSpeedKn);
  const [windDir, setWindDir] = useState(baseWindDirDeg);
  const [currentSpeed, setCurrentSpeed] = useState(baseCurrentSpeedMs);
  const [currentDir, setCurrentDir] = useState(baseCurrentDirDeg);
  const [thermalMode, setThermalMode] = useState("day"); // "day" or "night"

  // Calculate Net Drift and Shear Angle
  const calculations = useMemo(() => {
    // Wind blowing direction = from + 180
    const windBlowingTo = (windDir + 180) % 360;
    // Current direction
    const currentHeading = currentDir % 360;

    // Angle difference
    let shearAngle = Math.abs(windBlowingTo - currentHeading);
    if (shearAngle > 180) shearAngle = 360 - shearAngle;

    // Coriolis deflection angle (Northern Hemisphere ~ 18 deg to right of wind)
    const coriolisDeflection = 18.5;
    const projectedNetDriftAzimuth = (windBlowingTo + coriolisDeflection) % 360;

    // Stokes Drift (approx 1.6% of wind speed in m/s)
    const windMs = windSpeed * 0.514444;
    const stokesMs = +(windMs * 0.016).toFixed(2);

    // Thermal delta: Day = solar heating (+1.8C), Night = radiative cooling (-0.9C)
    const deltaT = thermalMode === "day" ? +1.8 : -0.9;
    const slickTempC = +(sstC + deltaT).toFixed(1);

    return {
      windBlowingTo: Math.round(windBlowingTo),
      currentHeading: Math.round(currentHeading),
      shearAngle: Math.round(shearAngle),
      projectedNetDriftAzimuth: Math.round(projectedNetDriftAzimuth),
      stokesMs,
      deltaT,
      slickTempC
    };
  }, [windSpeed, windDir, currentSpeed, currentDir, thermalMode, sstC]);

  const resetValues = () => {
    setWindSpeed(baseWindSpeedKn);
    setWindDir(baseWindDirDeg);
    setCurrentSpeed(baseCurrentSpeedMs);
    setCurrentDir(baseCurrentDirDeg);
  };

  // Compass SVG Coordinates (center: 100, 100, radius: 75)
  const cx = 100;
  const cy = 100;
  const r = 70;

  const getCoord = (deg, length) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad)
    };
  };

  const windEnd = getCoord(calculations.windBlowingTo, r * 0.85);
  const currentEnd = getCoord(calculations.currentHeading, r * 0.75);
  const slickEnd1 = getCoord(spillOrientationDeg, r * 0.9);
  const slickEnd2 = getCoord(spillOrientationDeg + 180, r * 0.9);
  const netDriftEnd = getCoord(calculations.projectedNetDriftAzimuth, r * 0.95);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Vector Shear & Coriolis Alignment HUD
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setThermalMode(thermalMode === "day" ? "night" : "day")}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors ${
              thermalMode === "day"
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-slate-900 text-sky-200 border-slate-700"
            }`}
          >
            {thermalMode === "day" ? <Sun className="w-3 h-3 text-amber-600" /> : <Moon className="w-3 h-3 text-sky-300" />}
            <span>IR: {thermalMode.toUpperCase()} (ΔT {calculations.deltaT > 0 ? `+${calculations.deltaT}` : calculations.deltaT}°C)</span>
          </button>
          <button
            onClick={resetValues}
            title="Reset to recorded incident state"
            className="p-1 rounded bg-ocean-light hover:bg-ocean-sky text-ocean border border-border-marine text-[10px]"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Compass Visualizer (Left) + Vector Analytics & Sliders (Right) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Compass Visualizer (Col 5) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 bg-slate-900 rounded-xl">
          <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible select-none">
            {/* Compass Rings */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r={r * 0.65} fill="none" stroke="#1E293B" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={r * 0.35} fill="none" stroke="#1E293B" />
            <circle cx={cx} cy={cy} r="3" fill="#38BDF8" />

            {/* Cardinals */}
            <text x={cx} y={cy - r - 6} textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">N</text>
            <text x={cx + r + 8} y={cy + 3} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">E</text>
            <text x={cx} y={cy + r + 11} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">S</text>
            <text x={cx - r - 8} y={cy + 3} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">W</text>

            {/* Spill Orientation Axis Line (Purple) */}
            <line x1={slickEnd1.x} y1={slickEnd1.y} x2={slickEnd2.x} y2={slickEnd2.y} stroke="#C084FC" strokeWidth="2.5" strokeDasharray="4 2" />

            {/* Wind Vector (Cyan Arrow) */}
            <line x1={cx} y1={cy} x2={windEnd.x} y2={windEnd.y} stroke="#00E5FF" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx={windEnd.x} cy={windEnd.y} r="2.5" fill="#00E5FF" />

            {/* Current Vector (Green Arrow) */}
            <line x1={cx} y1={cy} x2={currentEnd.x} y2={currentEnd.y} stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx={currentEnd.x} cy={currentEnd.y} r="2.5" fill="#10B981" />

            {/* Projected Net Drift (Amber Arrow) */}
            <line x1={cx} y1={cy} x2={netDriftEnd.x} y2={netDriftEnd.y} stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={netDriftEnd.x} cy={netDriftEnd.y} r="3" fill="#F59E0B" />
          </svg>

          {/* Compass Legend */}
          <div className="flex flex-wrap gap-2 text-[9px] font-mono text-slate-300 mt-2 justify-center">
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#00E5FF] inline-block" />
              <span>Wind {calculations.windBlowingTo}°</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#10B981] inline-block" />
              <span>Current {calculations.currentHeading}°</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 bg-[#F59E0B] inline-block" />
              <span>Net Drift {calculations.projectedNetDriftAzimuth}°</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-0.5 border-b border-dashed border-[#C084FC] inline-block" />
              <span>Slick Axis {spillOrientationDeg}°</span>
            </span>
          </div>
        </div>

        {/* Vector Analytics & What-if Sliders (Col 7) */}
        <div className="sm:col-span-7 space-y-2.5 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">WIND-CURRENT SHEAR</span>
              <span className="text-sm font-extrabold text-ocean-deep">{calculations.shearAngle}° Delta</span>
              <span className="text-[9px] text-text-muted block">Stokes Drift: {calculations.stokesMs} m/s</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">CORIOLIS DEFLECTION</span>
              <span className="text-sm font-extrabold text-status-warning">+18.5° (Right)</span>
              <span className="text-[9px] text-text-muted block">Northern Hemisphere</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">SEA TEMPERATURE</span>
              <span className="text-sm font-extrabold text-text-primary">{sstC}°C Ambient</span>
              <span className="text-[9px] text-text-muted block">Salinity: 36.2 PSU</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">SLICK IR TEMPERATURE</span>
              <span className="text-sm font-extrabold text-status-danger">{calculations.slickTempC}°C</span>
              <span className="text-[9px] text-text-muted block">ΔT: {calculations.deltaT > 0 ? `+${calculations.deltaT}` : calculations.deltaT}°C Contrast</span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-text-muted">WIND VELOCITY:</span>
              <span className="font-bold text-ocean-navy">{windSpeed} kn ({windDir}° Heading)</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="40" 
              step="0.5" 
              value={windSpeed} 
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
            />

            <div className="flex justify-between items-center text-[10px] pt-1">
              <span className="text-text-muted">OCEAN CURRENT SPEED:</span>
              <span className="font-bold text-ocean-navy">{currentSpeed} m/s ({currentDir}° Heading)</span>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="2.0" 
              step="0.05" 
              value={currentSpeed} 
              onChange={(e) => setCurrentSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

