import React, { useState, useMemo } from 'react';
import { Activity, Crosshair, ChevronRight, Compass, Maximize2, Zap } from 'lucide-react';

export default function TransectProfileViewer({ 
  lengthKm = 8.4, 
  widthKm = 2.1, 
  centerCoords = "14.82°N, 68.21°E" 
}) {
  const [activeAxis, setActiveAxis] = useState("major"); // "major" or "minor"
  const [scrubberPercent, setScrubberPercent] = useState(48); // 0 to 100%

  const totalDistKm = activeAxis === "major" ? lengthKm : widthKm;

  // Generate 25 sample points along the chosen transect
  const points = useMemo(() => {
    const pts = [];
    const count = 30;
    const centerPeakPct = activeAxis === "major" ? 46 : 50;

    for (let i = 0; i <= count; i++) {
      const pct = (i / count) * 100;
      const dist = (i / count) * totalDistKm;
      // Gaussian distribution for thickness peak
      const distFromPeak = Math.abs(pct - centerPeakPct);
      const sigma = activeAxis === "major" ? 18 : 22;
      const normalizedPeak = Math.exp(-0.5 * Math.pow(distFromPeak / sigma, 2));

      // Thickness in micrometers: baseline sheen 0.15um, peak ~320um
      const thicknessUm = +(0.15 + normalizedPeak * 315 + (Math.sin(i * 1.5) * 4)).toFixed(1);
      // SAR backscatter attenuation: water = 0dB, heavy dampening up to -7.4 dB
      const dampeningDb = -(0.5 + normalizedPeak * 6.8 + (Math.cos(i * 1.2) * 0.2)).toFixed(1);

      pts.push({
        idx: i,
        percent: pct,
        distKm: +dist.toFixed(2),
        thicknessUm: Math.max(0.1, thicknessUm),
        dampeningDb: +dampeningDb
      });
    }
    return pts;
  }, [activeAxis, totalDistKm]);

  // Current interpolated values at scrubber position
  const currentStat = useMemo(() => {
    const dist = (scrubberPercent / 100) * totalDistKm;
    // Find nearest point
    const nearest = points.reduce((prev, curr) => 
      Math.abs(curr.percent - scrubberPercent) < Math.abs(prev.percent - scrubberPercent) ? curr : prev
    , points[0]);

    return {
      distanceKm: dist.toFixed(2),
      thicknessUm: nearest.thicknessUm,
      dampeningDb: nearest.dampeningDb,
      classLabel: nearest.thicknessUm > 200 ? "Continuous Heavy Emulsion (Bonn 5)" :
                  nearest.thicknessUm > 50  ? "Discontinuous True Oil (Bonn 4)" :
                  nearest.thicknessUm > 5   ? "Metallic Sheen (Bonn 3)" : "Rainbow / Sheen (Bonn 1-2)"
    };
  }, [scrubberPercent, totalDistKm, points]);

  // SVG Chart path generation
  const width = 540;
  const height = 150;
  const padding = { top: 20, right: 30, bottom: 25, left: 45 };
  const graphW = width - padding.left - padding.right;
  const graphH = height - padding.top - padding.bottom;

  const maxThickness = 350;
  const minDb = -8.0;

  const thicknessPath = points.map((p, i) => {
    const x = padding.left + (p.percent / 100) * graphW;
    const y = padding.top + graphH - (p.thicknessUm / maxThickness) * graphH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const thicknessArea = `${thicknessPath} L ${padding.left + graphW} ${padding.top + graphH} L ${padding.left} ${padding.top + graphH} Z`;

  const dbPath = points.map((p, i) => {
    const x = padding.left + (p.percent / 100) * graphW;
    // minDb is -8, 0 is at the top
    const y = padding.top + (Math.abs(p.dampeningDb) / Math.abs(minDb)) * graphH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const scrubberX = padding.left + (scrubberPercent / 100) * graphW;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Top Title & Axis Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Morphological Transect Cross-Section Profiler
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-ocean-light p-0.5 rounded-lg border border-border-marine">
          <button
            onClick={() => setActiveAxis("major")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
              activeAxis === "major" 
                ? "bg-ocean text-white shadow-sm" 
                : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Major Axis A → B ({lengthKm} km)
          </button>
          <button
            onClick={() => setActiveAxis("minor")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
              activeAxis === "minor" 
                ? "bg-ocean text-white shadow-sm" 
                : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Transverse C → D ({widthKm} km)
          </button>
        </div>
      </div>

      {/* Real-time Metric Readout Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-ocean-light/70 border border-border-marine">
          <span className="text-[9px] text-text-muted block">TRANSECT POSITION</span>
          <span className="font-bold text-ocean-deep">
            {currentStat.distanceKm} km <span className="text-[10px] text-text-muted">({scrubberPercent}%)</span>
          </span>
        </div>

        <div className="p-2 rounded-lg bg-ocean-light/70 border border-border-marine">
          <span className="text-[9px] text-text-muted block">OIL THICKNESS</span>
          <span className="font-bold text-status-danger">
            {currentStat.thicknessUm} µm
          </span>
        </div>

        <div className="p-2 rounded-lg bg-ocean-light/70 border border-border-marine">
          <span className="text-[9px] text-text-muted block">SAR BACKSCATTER (Δσ⁰)</span>
          <span className="font-bold text-ocean">
            {currentStat.dampeningDb} dB
          </span>
        </div>

        <div className="p-2 rounded-lg bg-ocean-light/70 border border-border-marine">
          <span className="text-[9px] text-text-muted block">MORPHOLOGY CODE</span>
          <span className="font-bold text-ocean-navy truncate block" title={currentStat.classLabel}>
            {currentStat.classLabel}
          </span>
        </div>
      </div>

      {/* Interactive Profile Graph */}
      <div className="relative border border-border-marine rounded-xl p-2 bg-gradient-to-b from-white to-ocean-light/30">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          <line x1={padding.left} y1={padding.top} x2={padding.left + graphW} y2={padding.top} stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1={padding.left} y1={padding.top + graphH * 0.5} x2={padding.left + graphW} y2={padding.top + graphH * 0.5} stroke="#E2E8F0" strokeDasharray="3 3" />
          <line x1={padding.left} y1={padding.top + graphH} x2={padding.left + graphW} y2={padding.top + graphH} stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Shaded Area for Thickness */}
          <path d={thicknessArea} fill="rgba(8, 126, 164, 0.15)" />

          {/* Thickness Profile Curve (Blue) */}
          <path d={thicknessPath} fill="none" stroke="#087EA4" strokeWidth="2.5" strokeLinecap="round" />

          {/* SAR Backscatter Attenuation Curve (Amber dashed) */}
          <path d={dbPath} fill="none" stroke="#F4A62A" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />

          {/* Y Axis Labels (Left: Thickness) */}
          <text x={padding.left - 6} y={padding.top + 4} textAnchor="end" fill="#087EA4" fontSize="8" fontFamily="monospace" fontWeight="bold">350µm</text>
          <text x={padding.left - 6} y={padding.top + graphH * 0.5 + 3} textAnchor="end" fill="#087EA4" fontSize="8" fontFamily="monospace">175µm</text>
          <text x={padding.left - 6} y={padding.top + graphH} textAnchor="end" fill="#087EA4" fontSize="8" fontFamily="monospace">0µm</text>

          {/* Y Axis Labels (Right: dB) */}
          <text x={padding.left + graphW + 6} y={padding.top + 4} textAnchor="start" fill="#F4A62A" fontSize="8" fontFamily="monospace">0 dB</text>
          <text x={padding.left + graphW + 6} y={padding.top + graphH} textAnchor="start" fill="#F4A62A" fontSize="8" fontFamily="monospace">-8 dB</text>

          {/* X Axis Labels */}
          <text x={padding.left} y={padding.top + graphH + 15} textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">0 km (A)</text>
          <text x={padding.left + graphW * 0.5} y={padding.top + graphH + 15} textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">{ (totalDistKm * 0.5).toFixed(1) } km</text>
          <text x={padding.left + graphW} y={padding.top + graphH + 15} textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="monospace">{totalDistKm} km (B)</text>

          {/* Scrubber Vertical Line */}
          <line 
            x1={scrubberX} 
            y1={padding.top} 
            x2={scrubberX} 
            y2={padding.top + graphH} 
            stroke="#DC2626" 
            strokeWidth="2" 
            strokeDasharray="2 2" 
          />
          <circle 
            cx={scrubberX} 
            cy={padding.top + graphH - (currentStat.thicknessUm / maxThickness) * graphH} 
            r="4" 
            fill="#DC2626" 
            stroke="#FFFFFF" 
            strokeWidth="1.5" 
          />
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-border-marine text-[10px] font-mono text-text-secondary">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 bg-[#087EA4] rounded inline-block" />
              <span>Oil Thickness Profile (µm)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1 border-b-2 border-dashed border-[#F4A62A] inline-block" />
              <span>SAR Backscatter Attenuation (dB)</span>
            </span>
          </div>
          <span className="text-status-danger font-semibold">● Active Caliper Point</span>
        </div>
      </div>

      {/* Scrubbing Range Slider */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">DRAG CALIPER:</span>
        <input 
          type="range"
          min="0"
          max="100"
          step="1"
          value={scrubberPercent}
          onChange={(e) => setScrubberPercent(Number(e.target.value))}
          className="w-full h-2 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
        />
        <span className="text-[11px] font-mono font-bold text-ocean-navy min-w-[36px] text-right">
          {scrubberPercent}%
        </span>
      </div>
    </div>
  );
}

