import React, { useState, useMemo } from 'react';
import { Activity, MoveHorizontal, Crosshair, HelpCircle, Layers } from 'lucide-react';

export default function TransectProfileCaliper({
  transectLengthM = 3200,
  spillConfidence = 96.4
}) {
  const [profileAngle, setProfileAngle] = useState(45); // degrees
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate 25 sample points along the transect line showing the characteristic SAR backscatter "trough"
  const transectData = useMemo(() => {
    const points = [];
    const numPoints = 30;
    for (let i = 0; i < numPoints; i++) {
      const dist = Math.round((i / (numPoints - 1)) * transectLengthM);
      const norm = i / (numPoints - 1);
      // Bell-shaped trough in the center representing oil slick backscatter damping
      const centerDist = Math.abs(norm - 0.52);
      const isOil = centerDist < 0.28;
      let db = -8.5; // ambient clean sea backscatter in dB
      if (isOil) {
        // Deep damping trough down to -23.5 dB
        const depth = (1 - (centerDist / 0.28)) * 14.8;
        db -= depth;
        // Minor speckle perturbation
        db += (Math.sin(i * 3.7) * 0.8);
      } else {
        db += (Math.cos(i * 2.1) * 1.2);
      }
      points.push({
        index: i,
        distM: dist,
        db: +db.toFixed(1),
        isOil: isOil
      });
    }
    return points;
  }, [transectLengthM]);

  const minDb = -26;
  const maxDb = -5;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 4 · Cross-Section Radar Caliper (Transect Backscatter Profile)
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-50 text-status-success border border-emerald-200 px-2 py-0.5 rounded font-bold">
          Damping: -14.8 dB
        </span>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-text-muted text-[11px] font-bold">TRANSECT VECTOR:</span>
          <span className="text-ocean-navy font-bold">L = {transectLengthM}m ({profileAngle}&deg; Bearing)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">AZIMUTH:</span>
          <input
            type="range"
            min="0"
            max="180"
            value={profileAngle}
            onChange={(e) => setProfileAngle(parseInt(e.target.value))}
            className="w-24 h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
          />
          <span className="text-[11px] text-ocean font-bold">{profileAngle}&deg;</span>
        </div>
      </div>

      {/* Interactive SVG Chart of Backscatter Profile */}
      <div className="relative h-44 w-full bg-[#05111B] rounded-xl p-2 border border-border-marine overflow-hidden select-none">
        {/* dB Axis lines */}
        <div className="absolute inset-y-2 left-2 flex flex-col justify-between text-[9px] text-slate-400 font-mono pointer-events-none">
          <span>-6 dB (Clean Sea)</span>
          <span>-12 dB (Sheen Boundary)</span>
          <span>-18 dB (Core Plume)</span>
          <span>-24 dB (Heavy Crude)</span>
        </div>

        <svg viewBox="0 0 600 160" className="w-full h-full pl-16 pr-4 pt-2 pb-6" preserveAspectRatio="none">
          <defs>
            <linearGradient id="transectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="20" x2="600" y2="20" stroke="#1597C7" strokeOpacity="0.15" strokeDasharray="4,4" />
          <line x1="0" y1="60" x2="600" y2="60" stroke="#1597C7" strokeOpacity="0.15" strokeDasharray="4,4" />
          <line x1="0" y1="100" x2="600" y2="100" stroke="#1597C7" strokeOpacity="0.15" strokeDasharray="4,4" />
          <line x1="0" y1="140" x2="600" y2="140" stroke="#1597C7" strokeOpacity="0.15" strokeDasharray="4,4" />

          {/* Shaded Area */}
          <polygon
            points={`0,150 ${transectData.map((d, i) => {
              const x = (i / (transectData.length - 1)) * 600;
              const y = 150 - ((d.db - minDb) / (maxDb - minDb)) * 130;
              return `${x},${y}`;
            }).join(" ")} 600,150`}
            fill="url(#transectGrad)"
          />

          {/* Polyline Path */}
          <polyline
            points={transectData.map((d, i) => {
              const x = (i / (transectData.length - 1)) * 600;
              const y = 150 - ((d.db - minDb) / (maxDb - minDb)) * 130;
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="2.5"
          />

          {/* Data Points */}
          {transectData.map((d, i) => {
            const x = (i / (transectData.length - 1)) * 600;
            const y = 150 - ((d.db - minDb) / (maxDb - minDb)) * 130;
            const isSelected = hoveredIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5 : d.isOil ? 3 : 2}
                  fill={d.isOil ? "#FF3B30" : "#00E5FF"}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-3 right-3 bg-[#0B2942]/95 border border-cyan-400 px-3 py-1.5 rounded-lg text-[11px] text-white shadow-lg pointer-events-none">
            <span className="font-bold text-cyan-300">Offset: {transectData[hoveredIndex].distM}m</span>
            <span className="mx-2">·</span>
            <span className={transectData[hoveredIndex].isOil ? 'text-status-danger font-bold' : 'text-slate-300'}>
              &sigma;&sup0;: {transectData[hoveredIndex].db} dB ({transectData[hoveredIndex].isOil ? 'In Oil Plume' : 'Clean Water'})
            </span>
          </div>
        )}
      </div>

      {/* Summary statistics */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">PEAK DAMPING RATIO</span>
          <span className="text-sm font-bold text-ocean">14.8 dB (30.2×)</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">SLICK APERTURE WIDTH</span>
          <span className="text-sm font-bold text-ocean-navy">1,792 meters</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">BOUNDARY EDGE GRADIENT</span>
          <span className="text-sm font-bold text-status-success">0.024 dB/m</span>
        </div>
      </div>
    </div>
  );
}

