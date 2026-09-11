import React, { useState, useMemo } from 'react';
import { Clock, Droplets, Wind, Waves, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

export default function WeatheringKineticsEngine({ 
  initialAgeHours = 38.4,
  windSpeedKn = 14.2,
  seaTempC = 28.4,
  waveHeightM = 1.8 
}) {
  const [elapsedHours, setElapsedHours] = useState(Math.round(initialAgeHours));

  // Compute weathering curve points from 0 to 72 hours
  const curvePoints = useMemo(() => {
    const pts = [];
    const maxH = 72;
    // Environmental driving factors
    const windEffect = windSpeedKn / 15;
    const tempEffect = 1 + (seaTempC - 20) * 0.025;
    const waveDispEffect = Math.max(0.5, waveHeightM / 1.5);

    for (let t = 0; t <= maxH; t += 2) {
      // 1. Evaporation: logarithmic saturation
      const evapMax = 36 * tempEffect;
      const evap = +(Math.min(evapMax, Math.log(1 + t * 0.6 * windEffect) * 8.2)).toFixed(1);

      // 2. Emulsification (Water uptake): S-curve saturation
      const emulMax = 68;
      const emul = +(emulMax / (1 + Math.exp(-0.14 * (t - 14 * (1 / windEffect))))).toFixed(1);

      // 3. Dispersion (entrainment in water column): linear-saturating
      const dispMax = 22 * waveDispEffect;
      const disp = +(Math.min(dispMax, t * 0.28 * waveDispEffect)).toFixed(1);

      // 4. Remaining floating surface mass fraction
      const surface = +(Math.max(12, 100 - evap - disp)).toFixed(1);

      // 5. Kinematic Viscosity (cSt): Mooney equation exponential growth
      // fresh ~ 25 cSt, climbs up to 14,000+ cSt as mousse forms
      const viscBase = 25;
      const viscGrowth = viscBase * Math.exp(evap * 0.08) * Math.pow(1 + (emul / 100) * 2.2, 3.5);
      const viscosityCst = Math.round(Math.min(18000, viscGrowth));

      pts.push({
        hours: t,
        evap: Number(evap),
        emul: Number(emul),
        disp: Number(disp),
        surface: Number(surface),
        viscosityCst
      });
    }
    return pts;
  }, [windSpeedKn, seaTempC, waveHeightM]);

  // Current interpolated values at the scrubbed hours
  const currentValues = useMemo(() => {
    const nearest = curvePoints.reduce((prev, curr) => 
      Math.abs(curr.hours - elapsedHours) < Math.abs(prev.hours - elapsedHours) ? curr : prev
    , curvePoints[0]);

    let stateStage = "Fresh Fluid Discharge";
    let stateColor = "text-status-info bg-sky-50 border-sky-200";
    if (elapsedHours > 40 || nearest.emul > 50) {
      stateStage = "Viscous Emulsion ('Chocolate Mousse')";
      stateColor = "text-status-danger bg-red-50 border-red-200";
    } else if (elapsedHours > 16 || nearest.evap > 20) {
      stateStage = "Weathered Emulsifying Slick";
      stateColor = "text-status-warning bg-amber-50 border-amber-200";
    } else if (elapsedHours > 6) {
      stateStage = "Active Volatile Evaporation";
      stateColor = "text-ocean-deep bg-cyan-50 border-cyan-200";
    }

    return {
      ...nearest,
      stateStage,
      stateColor
    };
  }, [elapsedHours, curvePoints]);

  // SVG Chart rendering
  const width = 500;
  const height = 140;
  const pad = { top: 15, right: 30, bottom: 20, left: 35 };
  const graphW = width - pad.left - pad.right;
  const graphH = height - pad.top - pad.bottom;

  const getX = (h) => pad.left + (h / 72) * graphW;
  const getYPct = (pct) => pad.top + graphH - (pct / 100) * graphH;

  const evapPath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hours)} ${getYPct(p.evap)}`).join(' ');
  const emulPath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hours)} ${getYPct(p.emul)}`).join(' ');
  const dispPath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hours)} ${getYPct(p.disp)}`).join(' ');
  const surfPath = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hours)} ${getYPct(p.surface)}`).join(' ');

  const scrubberX = getX(elapsedHours);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Weathering Kinetics & Aging Timeline (ADIOS2 Coupling)
          </h3>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${currentValues.stateColor}`}>
          ● {currentValues.stateStage}
        </span>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
          <span className="text-[9px] text-text-muted block">ELAPSED TIME</span>
          <span className="font-extrabold text-ocean-deep text-sm">{elapsedHours} Hours</span>
          <span className="text-[9px] text-text-muted block">{(elapsedHours / 24).toFixed(1)} Days post-spill</span>
        </div>

        <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
          <span className="text-[9px] text-text-muted block">EVAPORATED</span>
          <span className="font-extrabold text-status-warning text-sm">{currentValues.evap}%</span>
          <span className="text-[9px] text-text-muted block">Volatile alkanes lost</span>
        </div>

        <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
          <span className="text-[9px] text-text-muted block">EMULSIFIED WATER</span>
          <span className="font-extrabold text-status-danger text-sm">{currentValues.emul}%</span>
          <span className="text-[9px] text-text-muted block">Water-in-oil mousse</span>
        </div>

        <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
          <span className="text-[9px] text-text-muted block">DISPERSED</span>
          <span className="font-extrabold text-status-info text-sm">{currentValues.disp}%</span>
          <span className="text-[9px] text-text-muted block">Entrained column</span>
        </div>

        <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
          <span className="text-[9px] text-text-muted block">VISCOSITY (cSt)</span>
          <span className="font-extrabold text-ocean-navy text-sm">
            {currentValues.viscosityCst.toLocaleString()}
          </span>
          <span className="text-[9px] text-text-muted block">
            {currentValues.viscosityCst > 10000 ? "Solid tar state" : "Pumpable slick"}
          </span>
        </div>
      </div>

      {/* SVG Weathering Multi-Curve Graph */}
      <div className="border border-border-marine rounded-xl p-2 bg-slate-900 text-white relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid */}
          <line x1={pad.left} y1={pad.top} x2={pad.left + graphW} y2={pad.top} stroke="#334155" strokeDasharray="3 3" />
          <line x1={pad.left} y1={pad.top + graphH * 0.5} x2={pad.left + graphW} y2={pad.top + graphH * 0.5} stroke="#334155" strokeDasharray="3 3" />
          <line x1={pad.left} y1={pad.top + graphH} x2={pad.left + graphW} y2={pad.top + graphH} stroke="#475569" strokeWidth="1.5" />

          {/* Curves */}
          <path d={surfPath} fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          <path d={emulPath} fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          <path d={evapPath} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 2" />
          <path d={dispPath} fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2" />

          {/* Y Axis Labels */}
          <text x={pad.left - 5} y={pad.top + 4} textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">100%</text>
          <text x={pad.left - 5} y={pad.top + graphH * 0.5 + 3} textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">50%</text>
          <text x={pad.left - 5} y={pad.top + graphH} textAnchor="end" fill="#94A3B8" fontSize="8" fontFamily="monospace">0%</text>

          {/* X Axis Labels */}
          <text x={pad.left} y={pad.top + graphH + 14} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">T+0h</text>
          <text x={getX(24)} y={pad.top + graphH + 14} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">T+24h</text>
          <text x={getX(48)} y={pad.top + graphH + 14} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">T+48h</text>
          <text x={getX(72)} y={pad.top + graphH + 14} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">T+72h</text>

          {/* Scrubber Line */}
          <line 
            x1={scrubberX} 
            y1={pad.top} 
            x2={scrubberX} 
            y2={pad.top + graphH} 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
            strokeDasharray="3 2"
          />
          <circle cx={scrubberX} cy={getYPct(currentValues.surface)} r="3.5" fill="#38BDF8" stroke="#FFFFFF" />
          <circle cx={scrubberX} cy={getYPct(currentValues.emul)} r="3.5" fill="#EF4444" stroke="#FFFFFF" />
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-[#38BDF8] rounded inline-block" />
              <span>Surface Slick (Mass %)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-[#EF4444] rounded inline-block" />
              <span>Emulsified Water (%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 border-b-2 border-dashed border-[#F59E0B] inline-block" />
              <span>Evaporated (%)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 border-b-2 border-dotted border-[#10B981] inline-block" />
              <span>Dispersed (%)</span>
            </span>
          </div>
          <span className="text-white font-bold">● T+{elapsedHours}h Scrubber</span>
        </div>
      </div>

      {/* Scrubbing Range Slider & Quick Snaps */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">SIMULATE AGING:</span>
          <input 
            type="range"
            min="0"
            max="72"
            step="1"
            value={elapsedHours}
            onChange={(e) => setElapsedHours(Number(e.target.value))}
            className="w-full h-2 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <span className="text-xs font-mono font-bold text-ocean-navy min-w-[40px] text-right">
            {elapsedHours}h
          </span>
        </div>

        <div className="flex items-center gap-1.5 justify-end">
          {[0, 6, 12, 24, 38, 48, 72].map(h => (
            <button
              key={h}
              onClick={() => setElapsedHours(h)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                elapsedHours === h 
                  ? 'bg-ocean text-white font-bold border-ocean' 
                  : 'bg-ocean-light hover:bg-ocean-sky text-ocean-navy border-border-marine'
              }`}
            >
              {h === 0 ? 'T+0' : `+${h}h`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

