import React from 'react';
import { Clock, ShieldAlert, Crosshair, Target } from 'lucide-react';

export default function CpaTimelineChart({
  estimatedHour = 40,
  currentHour = 40
}) {
  // Suspect vessel closest approach tracks in time window [T-48h to T-32h]
  const timelineTracks = [
    {
      name: "MV OCEAN STAR",
      color: "#E11D48", // rose-600
      cpaHour: 39.5,
      cpaDistance: 1.4,
      darkGapStart: 38.0,
      darkGapEnd: 42.5,
      points: [
        { hour: 46, dist: 18.2 },
        { hour: 43, dist: 8.5 },
        { hour: 39.5, dist: 1.4 },
        { hour: 36, dist: 9.2 },
        { hour: 32, dist: 22.0 }
      ]
    },
    {
      name: "MT HORIZON GLORY",
      color: "#F59E0B", // amber-500
      cpaHour: 41.2,
      cpaDistance: 3.8,
      darkGapStart: 40.5,
      darkGapEnd: 42.6,
      points: [
        { hour: 48, dist: 24.0 },
        { hour: 44, dist: 12.0 },
        { hour: 41.2, dist: 3.8 },
        { hour: 37, dist: 15.0 },
        { hour: 33, dist: 28.0 }
      ]
    },
    {
      name: "AL-JABER TANKER",
      color: "#8B5CF6", // purple-500
      cpaHour: 42.5,
      cpaDistance: 6.4,
      darkGapStart: 41.0,
      darkGapEnd: 44.2,
      points: [
        { hour: 47, dist: 20.0 },
        { hour: 42.5, dist: 6.4 },
        { hour: 38, dist: 16.5 },
        { hour: 34, dist: 30.0 }
      ]
    }
  ];

  // SVG coordinate transformation:
  // X: 48h (left, 40px) to 32h (right, 460px)
  const minHour = 32;
  const maxHour = 48;
  const svgWidth = 500;
  const svgHeight = 160;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 25;

  const getX = (hour) => {
    // Invert because hours ago: 48h ago is left, 32h ago is right
    const norm = (maxHour - hour) / (maxHour - minHour);
    return padLeft + norm * (svgWidth - padLeft - padRight);
  };

  const getY = (distNm) => {
    const maxDist = 30; // nautical miles
    const norm = Math.min(distNm, maxDist) / maxDist;
    return padTop + norm * (svgHeight - padTop - padBottom);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-ocean" />
          <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
            Temporal Vessel Proximity & CPA Intersection Timeline
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-rose-600 inline-block"></span>
            <span>MV OCEAN STAR</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span>
            <span>MT HORIZON GLORY</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-purple-500 inline-block"></span>
            <span>AL-JABER TANKER</span>
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-40">
          {/* Background Grid Lines */}
          {[5, 10, 20].map((dist) => {
            const y = getY(dist);
            return (
              <g key={dist}>
                <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="#E2E8F0" strokeDasharray="3,3" />
                <text x={padLeft - 5} y={y + 3} textAnchor="end" fontSize="9" fill="#94A3B8" fontFamily="monospace">
                  {dist} NM
                </text>
              </g>
            );
          })}

          {/* Uncertainty Envelope Zone A boundary band (< 4.2 NM) */}
          <rect
            x={padLeft}
            y={padTop}
            width={svgWidth - padLeft - padRight}
            height={getY(4.2) - padTop}
            fill="#0284C7"
            fillOpacity="0.08"
          />
          <text x={svgWidth - padRight - 5} y={getY(4.2) - 4} textAnchor="end" fontSize="8" fill="#0284C7" fontFamily="monospace" fontWeight="bold">
            ZONE A RADIUS (4.2 NM)
          </text>

          {/* Estimated Discharge Window band (T-42h to T-38h) */}
          <rect
            x={getX(42)}
            y={padTop}
            width={getX(38) - getX(42)}
            height={svgHeight - padTop - padBottom}
            fill="#F59E0B"
            fillOpacity="0.12"
          />

          {/* Time axis ticks */}
          {[48, 44, 40, 36, 32].map((h) => {
            const x = getX(h);
            return (
              <g key={h}>
                <line x1={x} y1={svgHeight - padBottom} x2={x} y2={svgHeight - padBottom + 4} stroke="#94A3B8" />
                <text x={x} y={svgHeight - 10} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="monospace">
                  T-{h}h
                </text>
              </g>
            );
          })}

          {/* Lines for each vessel */}
          {timelineTracks.map((v) => {
            const pathData = v.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.hour)} ${getY(p.dist)}`).join(' ');
            return (
              <g key={v.name}>
                {/* AIS Dark Gap Segment along the bottom */}
                <line
                  x1={getX(v.darkGapEnd)}
                  y1={svgHeight - padBottom - 2}
                  x2={getX(v.darkGapStart)}
                  y2={svgHeight - padBottom - 2}
                  stroke={v.color}
                  strokeWidth="3"
                  strokeDasharray="2,2"
                />

                {/* Track Line */}
                <path d={pathData} fill="none" stroke={v.color} strokeWidth="2.2" strokeLinecap="round" />

                {/* Closest Point of Approach marker */}
                <circle cx={getX(v.cpaHour)} cy={getY(v.cpaDistance)} r="4" fill={v.color} stroke="#FFFFFF" strokeWidth="1.5" />
                <text
                  x={getX(v.cpaHour)}
                  y={getY(v.cpaDistance) - 6}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill={v.color}
                  fontFamily="monospace"
                >
                  {v.cpaDistance} NM
                </text>
              </g>
            );
          })}

          {/* Current Scrubber Time Marker */}
          {currentHour >= minHour && currentHour <= maxHour && (
            <g>
              <line
                x1={getX(currentHour)}
                y1={padTop}
                x2={getX(currentHour)}
                y2={svgHeight - padBottom}
                stroke="#087EA4"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
              <circle cx={getX(currentHour)} cy={padTop} r="3" fill="#087EA4" />
            </g>
          )}
        </svg>
      </div>
      <div className="flex items-center justify-between text-[10px] text-text-secondary font-mono pt-1">
        <span>● Shaded Amber: Primary Release Window (T-42h to T-38h)</span>
        <span>● Shaded Blue: Inside Origin Zone A (&lt; 4.2 NM)</span>
        <span>● Dashed bars at base: AIS Transmission Dark Gaps</span>
      </div>
    </div>
  );
}

