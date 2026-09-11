import React, { useState, useMemo } from 'react';
import { X, TrendingUp, Thermometer, Wind, Droplets, Waves, CheckCircle2 } from 'lucide-react';

export default function WorkspaceOilWeatheringModal({ caseData, onClose }) {
  const [seaTempC, setSeaTempC] = useState(28);
  const [windKnots, setWindKnots] = useState(14.2);
  const [hoverHour, setHoverHour] = useState(null);

  // Generate 72-hour decay curve data points
  const curveData = useMemo(() => {
    const points = [];
    const windMs = windKnots * 0.514444;

    for (let h = 0; h <= 72; h += 2) {
      // 1. Evaporation %: Mackay formulation
      const evap = Math.min(68, Math.round((14 + windMs * 1.5 + seaTempC * 0.5) * Math.log10(1 + h * 1.8)));

      // 2. Emulsification (Water-in-oil water cut %): Mousse formation
      const emul = Math.min(78, Math.round(76 * (1 - Math.exp(-0.035 * h * (1 + windMs / 8)))));

      // 3. Natural Dispersion %: Breaking waves entrainment
      const disp = Math.min(35, Math.round(1.2 * Math.pow(windMs, 1.4) * (h / 72)));

      // 4. Kinematic Viscosity increase multiplier (mousse becomes extremely thick)
      // Mooney equation for emulsion viscosity: eta = eta_0 * exp(2.5 * emul / (1 - 0.65 * emul))
      const viscMultiplier = +(Math.exp((2.5 * (emul / 100)) / (1 - 0.65 * (emul / 100)))).toFixed(1);

      points.push({
        hour: h,
        evap,
        emul,
        disp,
        viscMultiplier
      });
    }
    return points;
  }, [seaTempC, windKnots]);

  const activePoint = hoverHour !== null ? curveData.find(p => p.hour === hoverHour) : curveData[Math.floor(curveData.length / 2)];

  // SVG dimensions
  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const xScale = (h) => padding.left + (h / 72) * (width - padding.left - padding.right);
  const yScale = (pct) => height - padding.bottom - (pct / 100) * (height - padding.top - padding.bottom);

  // Generate SVG path strings
  const evapPath = curveData.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${xScale(p.hour)} ${yScale(p.evap)}`, '');
  const emulPath = curveData.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${xScale(p.hour)} ${yScale(p.emul)}`, '');
  const dispPath = curveData.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${xScale(p.hour)} ${yScale(p.disp)}`, '');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Mackay 72-Hour Weathering & Emulsification Dynamics
              </h3>
              <p className="text-xs text-text-secondary">
                Physical loss & emulsification mousse progression under coupled environmental forcing.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Environmental Controls */}
        <div className="p-4 border-b border-border-marine bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1">
            <label className="font-bold text-ocean-navy flex justify-between">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-rose-500" /> Sea Surface Temp:</span>
              <strong className="text-rose-600 font-bold">{seaTempC}°C</strong>
            </label>
            <input
              type="range"
              min={12}
              max={36}
              value={seaTempC}
              onChange={e => setSeaTempC(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1">
            <label className="font-bold text-ocean-navy flex justify-between">
              <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-sky-500" /> Wind Velocity:</span>
              <strong className="text-sky-600 font-bold">{windKnots} kn</strong>
            </label>
            <input
              type="range"
              min={2}
              max={40}
              step={0.5}
              value={windKnots}
              onChange={e => setWindKnots(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="p-4 bg-slate-950 flex flex-col items-center">
          <div className="flex items-center justify-between w-full text-xs font-mono mb-2 text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Evaporation Loss (%)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Emulsification Water-Cut (%)
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Natural Dispersion (%)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Hover curve to inspect hour</span>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(val => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={yScale(val)}
                    x2={width - padding.right}
                    y2={yScale(val)}
                    stroke="#334155"
                    strokeDasharray="2 2"
                  />
                  <text x={padding.left - 8} y={yScale(val) + 3} fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="monospace">
                    {val}%
                  </text>
                </g>
              ))}

              {/* X Axis labels */}
              {[0, 12, 24, 36, 48, 60, 72].map(h => (
                <g key={h}>
                  <line
                    x1={xScale(h)}
                    y1={height - padding.bottom}
                    x2={xScale(h)}
                    y2={height - padding.bottom + 4}
                    stroke="#64748b"
                  />
                  <text x={xScale(h)} y={height - padding.bottom + 14} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    T+{h}h
                  </text>
                </g>
              ))}

              {/* Curves */}
              <path d={evapPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <path d={emulPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              <path d={dispPath} fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4 2" />

              {/* Hover indicator */}
              {activePoint && (
                <g>
                  <line
                    x1={xScale(activePoint.hour)}
                    y1={padding.top}
                    x2={xScale(activePoint.hour)}
                    y2={height - padding.bottom}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle cx={xScale(activePoint.hour)} cy={yScale(activePoint.evap)} r="4" fill="#f59e0b" stroke="#ffffff" />
                  <circle cx={xScale(activePoint.hour)} cy={yScale(activePoint.emul)} r="4" fill="#f43f5e" stroke="#ffffff" />
                  <circle cx={xScale(activePoint.hour)} cy={yScale(activePoint.disp)} r="4" fill="#2dd4bf" stroke="#ffffff" />
                </g>
              )}

              {/* Transparent hover capture rects */}
              {curveData.map(p => (
                <rect
                  key={p.hour}
                  x={xScale(p.hour) - 8}
                  y={padding.top}
                  width="16"
                  height={height - padding.top - padding.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverHour(p.hour)}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Hover Snapshot Banner */}
        {activePoint && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">TIME ELAPSED</span>
              <strong className="text-base text-white">T+{activePoint.hour} Hours</strong>
            </div>
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">EVAPORATION</span>
              <strong className="text-base text-amber-400">{activePoint.evap}% lost</strong>
            </div>
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">WATER EMULSION</span>
              <strong className="text-base text-rose-400">{activePoint.emul}% mousse</strong>
            </div>
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">VISCOSITY MULTIPLIER</span>
              <strong className="text-base text-teal-400">{activePoint.viscMultiplier}× baseline</strong>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            Formulation: Mackay (1980) + Fingas (1995) Hydrocarbon Weathering Matrices.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

