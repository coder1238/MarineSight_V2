import React, { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Compass, Wind, Navigation, Crosshair } from 'lucide-react';
import { RedactedText } from './ReportWatermarkRedaction';

export default function ReportRadarContourCanvas({ caseData, isRedacted, onLogAudit }) {
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState({
    slickPolygon: true,
    hindcastCone: true,
    aisTrack: true,
    driftVectors: true,
    gridOverlay: true
  });
  const [hoverCoord, setHoverCoord] = useState(null);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.7, Math.min(2.2, prev + delta)));
  };

  // Convert geo-coordinates to SVG coordinates relative to center
  const centerLat = caseData.coordinates.lat || 14.82;
  const centerLng = caseData.coordinates.lng || 68.21;
  const scaleFactor = 1600 * zoom;

  const projectPoint = (lat, lng) => {
    const x = 300 + (lng - centerLng) * scaleFactor;
    const y = 200 - (lat - centerLat) * scaleFactor;
    return { x, y };
  };

  // Build polygon path from geoCoordinates
  const coords = caseData.geoCoordinates || [
    { lat: 14.8480, lng: 68.1750 },
    { lat: 14.8620, lng: 68.2050 },
    { lat: 14.8580, lng: 68.2320 },
    { lat: 14.8410, lng: 68.2540 },
    { lat: 14.8150, lng: 68.2490 },
    { lat: 14.7950, lng: 68.2360 },
    { lat: 14.8010, lng: 68.2050 },
    { lat: 14.8090, lng: 68.1880 },
    { lat: 14.8290, lng: 68.1710 }
  ];

  const polygonSvgPoints = coords.map(c => {
    const pt = projectPoint(c.lat, c.lng);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Origin point
  const originPt = projectPoint(centerLat - 0.08, centerLng - 0.15);
  // Centroid point
  const centroidPt = projectPoint(centerLat, centerLng);
  // Vessel point
  const vesselPt = projectPoint(centerLat - 0.06, centerLng - 0.12);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const lng = (centerLng + (px - 300) / scaleFactor).toFixed(4);
    const lat = (centerLat - (py - 200) / scaleFactor).toFixed(4);
    setHoverCoord({ lat, lng });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-marine-md">
      {/* Header bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            SAR C-Band VV Radar Backscatter & Drift Reversal Vector Field
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 text-[10px]">
            SENTINEL-1A · 10m/px GRD
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1 hover:bg-slate-700 text-slate-300 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] text-slate-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1 hover:bg-slate-700 text-slate-300 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="bg-slate-900/50 px-3 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
        <span className="text-slate-400 text-[10px] uppercase">Layers:</span>
        <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.slickPolygon}
            onChange={() => toggleLayer('slickPolygon')}
            className="w-3 h-3 rounded accent-emerald-500 cursor-pointer"
          />
          <span className="text-emerald-400">SAR Slick (-22.4dB)</span>
        </label>
        <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.hindcastCone}
            onChange={() => toggleLayer('hindcastCone')}
            className="w-3 h-3 rounded accent-amber-500 cursor-pointer"
          />
          <span className="text-amber-400">Hindcast Origin Cone (Zone A)</span>
        </label>
        <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.aisTrack}
            onChange={() => toggleLayer('aisTrack')}
            className="w-3 h-3 rounded accent-red-500 cursor-pointer"
          />
          <span className="text-red-400">Vessel Track & Blackout Gap</span>
        </label>
        <label className="flex items-center gap-1 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={layers.driftVectors}
            onChange={() => toggleLayer('driftVectors')}
            className="w-3 h-3 rounded accent-cyan-500 cursor-pointer"
          />
          <span className="text-cyan-400">Current & Wind Vectors</span>
        </label>
      </div>

      {/* Interactive SVG Radar Display */}
      <div className="relative w-full h-80 bg-slate-950 cursor-crosshair overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverCoord(null)}>
        <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Dark oil slick gradient */}
            <radialGradient id="slickGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
            </radialGradient>
            <linearGradient id="hindcastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Radar range rings */}
          {layers.gridOverlay && (
            <g stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" fill="none">
              <circle cx="300" cy="200" r="60" />
              <circle cx="300" cy="200" r="120" />
              <circle cx="300" cy="200" r="180" />
              <circle cx="300" cy="200" r="240" />
              <line x1="60" y1="200" x2="540" y2="200" />
              <line x1="300" y1="20" x2="300" y2="380" />
            </g>
          )}

          {/* Hindcast Dispersion Cone */}
          {layers.hindcastCone && (
            <g>
              <polygon
                points={`${centroidPt.x},${centroidPt.y} ${originPt.x - 45},${originPt.y + 35} ${originPt.x + 45},${originPt.y - 35}`}
                fill="url(#hindcastGradient)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx={originPt.x} cy={originPt.y} r="8" fill="#f59e0b" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="2" />
              <text x={originPt.x + 12} y={originPt.y + 4} fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Zone A (Origin Centroid - 72.4%)
              </text>
            </g>
          )}

          {/* Oil Slick Polygon */}
          {layers.slickPolygon && (
            <g>
              <polygon
                points={polygonSvgPoints}
                fill="url(#slickGlow)"
                stroke="#10b981"
                strokeWidth="2"
                className="animate-pulse"
              />
              <circle cx={centroidPt.x} cy={centroidPt.y} r="4" fill="#34d399" />
              <text x={centroidPt.x + 8} y={centroidPt.y - 6} fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Spill Delineation ({caseData.spillAreaKm2} km²)
              </text>
            </g>
          )}

          {/* Vessel AIS Track & Gap */}
          {layers.aisTrack && (
            <g>
              {/* Pre-gap path */}
              <line x1={originPt.x - 90} y1={originPt.y + 70} x2={originPt.x - 20} y2={originPt.y + 15} stroke="#3b82f6" strokeWidth="2" />
              {/* Dark Blackout AIS Gap */}
              <line x1={originPt.x - 20} y1={originPt.y + 15} x2={vesselPt.x + 20} y2={vesselPt.y - 15} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" />
              {/* Post-gap path */}
              <line x1={vesselPt.x + 20} y1={vesselPt.y - 15} x2={vesselPt.x + 80} y2={vesselPt.y - 60} stroke="#3b82f6" strokeWidth="2" />
              
              {/* Current Vessel Position */}
              <circle cx={vesselPt.x} cy={vesselPt.y} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <text x={vesselPt.x + 10} y={vesselPt.y - 8} fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                {caseData.topVessel.name} [MMSI: {isRedacted ? '[REDACTED]' : caseData.topVessel.mmsi}]
              </text>
              <text x={originPt.x - 30} y={originPt.y + 30} fill="#f87171" fontSize="9" fontFamily="monospace">
                ⚠️ 38m AIS Silence Gap
              </text>
            </g>
          )}

          {/* Drift Vectors (Current & Wind) */}
          {layers.driftVectors && (
            <g>
              {/* Current Vector */}
              <g transform="translate(480, 70)">
                <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
                <line x1="0" y1="0" x2="14" y2="18" stroke="#38bdf8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                <text x="-22" y="-34" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  HYCOM Current
                </text>
                <text x="-16" y="42" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  0.42 m/s · 128°
                </text>
              </g>

              {/* Wind Vector */}
              <g transform="translate(545, 70)">
                <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <line x1="0" y1="0" x2="-14" y2="14" stroke="#fbbf24" strokeWidth="2.5" />
                <text x="-18" y="-34" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  ECMWF Wind
                </text>
                <text x="-16" y="42" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  14.2 kn · NW
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Live Coordinate Overlay */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 rounded px-2 py-1 font-mono text-[10px] text-slate-300 flex items-center gap-3">
          <span>Crosshair: {hoverCoord ? `${hoverCoord.lat}°N, ${hoverCoord.lng}°E` : `${centerLat}°N, ${centerLng}°E`}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">Projection: WGS-84 / Mercator</span>
        </div>
      </div>
    </div>
  );
}

