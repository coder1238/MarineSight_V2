import React, { useState } from 'react';
import { Activity, Gauge, Navigation, RotateCcw, AlertTriangle } from 'lucide-react';
import { TELEMETRY_POINTS } from './trajectoryData';

export default function TrajectoryKinematicsChart({ 
  currentPointIndex, 
  onPointChange 
}) {
  const [activeMetric, setActiveMetric] = useState("sog"); // "sog", "cog", "rot", "acc"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const points = TELEMETRY_POINTS.slice(0, 24); // Show the transit and blackout segments
  const total = points.length;

  // Chart dimensions
  const svgWidth = 600;
  const svgHeight = 180;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 28;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Metric value range
  let minVal = 0;
  let maxVal = 16;
  let unit = "kn";
  let label = "Speed Over Ground";
  let lineColor = "#087EA4";

  if (activeMetric === "cog") {
    minVal = 200;
    maxVal = 300;
    unit = "°";
    label = "Course Over Ground";
    lineColor = "#1597C7";
  } else if (activeMetric === "rot") {
    minVal = -10;
    maxVal = 10;
    unit = "°/m";
    label = "Rate of Turn";
    lineColor = "#F4A62A";
  } else if (activeMetric === "acc") {
    minVal = -1.2;
    maxVal = 1.0;
    unit = "m/s²";
    label = "Longitudinal Accel.";
    lineColor = "#D9534F";
  }

  // Generate SVG coordinates
  const coords = points.map((p, i) => {
    const x = padLeft + (i / (total - 1)) * chartW;
    const val = p[activeMetric];
    const normalized = (val - minVal) / (maxVal - minVal);
    const clampedNorm = Math.max(0, Math.min(1, normalized));
    const y = padTop + chartH - clampedNorm * chartH;
    return { x, y, val, p, i };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  // Area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${padTop + chartH} L ${coords[0].x} ${padTop + chartH} Z`;

  // Blackout indices: 7 to 17
  const blackoutStartX = coords[7]?.x || 0;
  const blackoutEndX = coords[17]?.x || 0;

  const displayPoint = hoveredIndex !== null ? points[hoveredIndex] : points[currentPointIndex] || points[0];
  const displayCoord = coords[hoveredIndex !== null ? hoveredIndex : currentPointIndex] || coords[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Kinematic Telemetry & Deceleration Forensics
          </h3>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-ocean-light rounded-lg border border-border-marine p-0.5 text-[10px] font-mono">
          {[
            { id: "sog", label: "SOG (Speed)" },
            { id: "cog", label: "COG (Course)" },
            { id: "rot", label: "ROT (Turn)" },
            { id: "acc", label: "Accel (Jerk)" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id)}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeMetric === tab.id
                  ? 'bg-ocean text-white shadow-xs'
                  : 'text-text-secondary hover:text-ocean-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full bg-ocean-light/40 rounded-xl border border-border-marine/70 p-2 overflow-hidden select-none">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-44 cursor-crosshair"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Shaded Red Zone for AIS Blackout Gap */}
          <rect 
            x={blackoutStartX} 
            y={padTop} 
            width={blackoutEndX - blackoutStartX} 
            height={chartH} 
            fill="rgba(217, 83, 79, 0.12)" 
          />
          <line 
            x1={blackoutStartX} 
            y1={padTop} 
            x2={blackoutStartX} 
            y2={padTop + chartH} 
            stroke="#D9534F" 
            strokeDasharray="3,3" 
            strokeWidth="1.5" 
          />
          <line 
            x1={blackoutEndX} 
            y1={padTop} 
            x2={blackoutEndX} 
            y2={padTop + chartH} 
            stroke="#D9534F" 
            strokeDasharray="3,3" 
            strokeWidth="1.5" 
          />
          <text 
            x={(blackoutStartX + blackoutEndX) / 2} 
            y={padTop + 14} 
            textAnchor="middle" 
            fill="#D9534F" 
            fontSize="9" 
            fontFamily="monospace" 
            fontWeight="bold"
          >
            38m AIS BLACKOUT ZONE
          </text>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padTop + chartH - pct * chartH;
            const val = minVal + pct * (maxVal - minVal);
            return (
              <g key={i}>
                <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="#D9EAF0" strokeWidth="1" strokeDasharray="2,2" />
                <text x={padLeft - 6} y={y + 3} textAnchor="end" fill="#8295A3" fontSize="8" fontFamily="monospace">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill={`${lineColor}15`} />

          {/* Telemetry Line */}
          <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Active / Scrubber Head Line */}
          {displayCoord && (
            <g>
              <line 
                x1={displayCoord.x} 
                y1={padTop} 
                x2={displayCoord.x} 
                y2={padTop + chartH} 
                stroke="#0B2942" 
                strokeWidth="1.5" 
                strokeDasharray="2,2" 
              />
              <circle 
                cx={displayCoord.x} 
                cy={displayCoord.y} 
                r="4.5" 
                fill="#FFFFFF" 
                stroke={lineColor} 
                strokeWidth="2.5" 
              />
            </g>
          )}

          {/* Hover / Click triggers */}
          {coords.map((c, i) => (
            <rect
              key={i}
              x={c.x - (chartW / total) / 2}
              y={padTop}
              width={chartW / total}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onClick={() => onPointChange(i)}
            />
          ))}

          {/* X-axis labels */}
          <text x={padLeft} y={svgHeight - 8} fill="#8295A3" fontSize="8" fontFamily="monospace">22:00 UTC</text>
          <text x={blackoutStartX} y={svgHeight - 8} fill="#D9534F" fontSize="8" fontFamily="monospace" fontWeight="bold">22:24</text>
          <text x={blackoutEndX} y={svgHeight - 8} fill="#D9534F" fontSize="8" fontFamily="monospace" fontWeight="bold">23:02</text>
          <text x={padLeft + chartW} y={svgHeight - 8} textAnchor="end" fill="#8295A3" fontSize="8" fontFamily="monospace">23:45 UTC</text>
        </svg>

        {/* Current Point Floating Tooltip */}
        <div className="flex items-center justify-between text-[11px] font-mono px-2 pt-1 border-t border-border-marine/50">
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-[10px]">Selected Timestamp:</span>
            <span className="font-bold text-ocean-navy">{displayPoint.time}</span>
            <span className="text-text-muted">|</span>
            <span className="text-text-muted text-[10px]">{label}:</span>
            <span className="font-bold text-ocean">{displayPoint[activeMetric]} {unit}</span>
          </div>

          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-text-muted">Anomaly:</span>
            <span className={`font-bold ${displayPoint.anomaly !== 'none' ? 'text-status-danger' : 'text-status-success'}`}>
              {displayPoint.anomaly.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

