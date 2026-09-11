import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  Radio, 
  Shield, 
  AlertTriangle, 
  Maximize2, 
  Crosshair, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Eye,
  Ship,
  Waves,
  Wind
} from 'lucide-react';

// Indian Ocean Maritime EEZ Sectors with projection bounding boxes
export const SECTORS = [
  { id: "ALL", name: "All EEZ Sectors", minLat: 4, maxLat: 26, minLng: 65, maxLng: 98 },
  { id: "ARABIAN", name: "Arabian Sea (West)", minLat: 8, maxLat: 22, minLng: 66, maxLng: 77 },
  { id: "BENGAL", name: "Bay of Bengal (East)", minLat: 10, maxLat: 23, minLng: 79, maxLng: 92 },
  { id: "KUTCH", name: "Gulf of Kutch (North)", minLat: 20.5, maxLat: 24.5, minLng: 67, maxLng: 72 },
  { id: "MALACCA", name: "Great Nicobar / Malacca", minLat: 4.5, maxLat: 12, minLng: 90, maxLng: 98 }
];

export const MPA_ZONES = [
  { name: "Gulf of Kutch Marine National Park", lat: 22.48, lng: 69.30, radiusKm: 45, type: "Coral & Mangrove Sanctuary" },
  { name: "Gulf of Mannar Biosphere Reserve", lat: 9.15, lng: 79.25, radiusKm: 60, type: "Coral Reefs & Dugong Habitat" },
  { name: "Sundarbans Mangrove Delta", lat: 21.80, lng: 88.90, radiusKm: 75, type: "Tidal Mangrove Biosphere" },
  { name: "Lakshadweep Coral Atolls", lat: 10.56, lng: 72.64, radiusKm: 55, type: "Atoll Reef Ecosystem" },
  { name: "Great Nicobar Biosphere", lat: 7.00, lng: 93.80, radiusKm: 65, type: "Deep Pelagic Biosphere" }
];

// Major Indian Naval Command / Coast Guard MRCC base reference points
const NAVAL_BASES = [
  { name: "MRCC Mumbai", lat: 18.92, lng: 72.83, code: "BOM" },
  { name: "MRCC Kochi", lat: 9.96, lng: 76.24, code: "COK" },
  { name: "MRCC Chennai", lat: 13.08, lng: 80.28, code: "MAA" },
  { name: "MRCC Port Blair", lat: 11.66, lng: 92.73, code: "IXZ" }
];

function projectCoord(lat, lng, sector, width = 720, height = 480) {
  const { minLat, maxLat, minLng, maxLng } = sector;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
  return { 
    x: Math.max(15, Math.min(width - 15, x)), 
    y: Math.max(15, Math.min(height - 15, y)) 
  };
}

function unprojectCoord(x, y, sector, width = 720, height = 480) {
  const { minLat, maxLat, minLng, maxLng } = sector;
  const lng = minLng + (x / width) * (maxLng - minLng);
  const lat = minLat + ((height - y) / height) * (maxLat - minLat);
  return { lat: +lat.toFixed(2), lng: +lng.toFixed(2) };
}

export default function IncidentMiniMap({ 
  incidents = [], 
  activeIncidentId, 
  onSelectIncident, 
  onInspectIncident,
  compact = false
}) {
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [hoveredIncident, setHoveredIncident] = useState(null);
  const [showEcoZones, setShowEcoZones] = useState(true);
  const [showShippingLanes, setShowShippingLanes] = useState(true);
  const [showRadarSweep, setShowRadarSweep] = useState(true);
  const [cursorCoords, setCursorCoords] = useState(null);
  const svgRef = useRef(null);

  const mapWidth = 720;
  const mapHeight = compact ? 420 : 480;

  // Active or hovered incident for target HUD
  const spotlightIncident = incidents.find(i => i.id === activeIncidentId) || hoveredIncident || incidents[0];

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (mapWidth / rect.width);
    const y = (e.clientY - rect.top) * (mapHeight / rect.height);
    const coords = unprojectCoord(x, y, selectedSector, mapWidth, mapHeight);
    setCursorCoords(coords);
  };

  const handleMouseLeave = () => {
    setCursorCoords(null);
    setHoveredIncident(null);
  };

  // Coastal land paths projected for the active sector
  const indiaCoastPath = "M 95,85 L 140,110 L 150,150 L 140,185 L 148,220 L 165,270 L 195,330 L 250,385 L 260,395 L 285,360 L 320,310 L 375,250 L 430,200 L 485,150 L 510,135 L 530,120";
  const sriLankaPath = "M 295,385 C 315,380 325,405 315,420 C 300,430 285,410 295,385 Z";

  // Center coordinates for radar rings
  const radarCenterX = mapWidth * 0.42;
  const radarCenterY = mapHeight * 0.54;

  return (
    <div className="bg-slate-950 rounded-2xl border border-cyan-900/60 text-white relative overflow-hidden shadow-2xl flex flex-col isolate z-0">
      {/* 1. Tactical Radar Header & Sector Toolbar */}
      <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-cyan-900/40 flex flex-wrap items-center justify-between gap-2.5 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-cyan-300 tracking-wider uppercase flex items-center gap-1.5">
                <span>Tactical Maritime Radar Console</span>
              </h3>
              <span className="px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono animate-pulse">
                SWEEP ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-white/60 font-mono flex items-center gap-2">
              <span>SECTOR: <b>{selectedSector.name}</b></span>
              <span>•</span>
              <span>TARGETS: <b className="text-cyan-300">{incidents.length} IN EEZ</b></span>
            </div>
          </div>
        </div>

        {/* Sector Quick-Switcher Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
          {SECTORS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec)}
              className={`px-2 py-1 rounded-md border transition-all whitespace-nowrap ${
                selectedSector.id === sec.id
                  ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold shadow-xs'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {sec.id}
            </button>
          ))}
        </div>

        {/* Map Layers Toggles */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setShowRadarSweep(!showRadarSweep)}
            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1 transition-colors ${
              showRadarSweep ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-white/40 border-white/10'
            }`}
            title="Toggle Rotating Radar Beam"
          >
            <Radio className="w-3 h-3" />
            <span>Sweep</span>
          </button>

          <button
            onClick={() => setShowEcoZones(!showEcoZones)}
            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1 transition-colors ${
              showEcoZones ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-white/40 border-white/10'
            }`}
            title="Toggle Marine Protected Sanctuary Zones"
          >
            <Shield className="w-3 h-3" />
            <span>MPAs</span>
          </button>

          <button
            onClick={() => setShowShippingLanes(!showShippingLanes)}
            className={`px-2 py-1 rounded-md border text-[10px] flex items-center gap-1 transition-colors ${
              showShippingLanes ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-white/40 border-white/10'
            }`}
            title="Toggle Major Tanker Corridors"
          >
            <Navigation className="w-3 h-3" />
            <span>Lanes</span>
          </button>
        </div>
      </div>

      {/* 2. Radar Canvas & SVG Viewport */}
      <div className="relative w-full overflow-hidden bg-slate-950 flex-1 min-h-[360px]">
        <svg 
          ref={svgRef}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
          className="w-full h-full select-none cursor-crosshair block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Deep ocean radar gradient */}
            <linearGradient id="radarOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#040d1a" />
              <stop offset="50%" stopColor="#081b33" />
              <stop offset="100%" stopColor="#030a14" />
            </linearGradient>

            {/* Tactical grid pattern */}
            <pattern id="radarGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="0.8" />
            </pattern>

            {/* Radial glow for radar center */}
            <radialGradient id="centerRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            {/* Rotating Radar Sweep Cone */}
            <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Ocean Base */}
          <rect width={mapWidth} height={mapHeight} fill="url(#radarOceanGrad)" />
          <rect width={mapWidth} height={mapHeight} fill="url(#radarGrid)" />

          {/* Range Rings with Nautical Mile markings */}
          <circle cx={radarCenterX} cy={radarCenterY} r="75" fill="none" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="1" strokeDasharray="3,3" />
          <text x={radarCenterX + 78} y={radarCenterY - 4} fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.6">50 NM</text>

          <circle cx={radarCenterX} cy={radarCenterY} r="150" fill="none" stroke="rgba(6, 182, 212, 0.14)" strokeWidth="1" strokeDasharray="4,4" />
          <text x={radarCenterX + 153} y={radarCenterY - 4} fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.6">100 NM</text>

          <circle cx={radarCenterX} cy={radarCenterY} r="225" fill="none" stroke="rgba(6, 182, 212, 0.10)" strokeWidth="1" strokeDasharray="5,5" />
          <text x={radarCenterX + 228} y={radarCenterY - 4} fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.6">150 NM</text>

          <circle cx={radarCenterX} cy={radarCenterY} r="300" fill="none" stroke="rgba(6, 182, 212, 0.07)" strokeWidth="1" />
          <text x={radarCenterX + 303} y={radarCenterY - 4} fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.6">200 NM EEZ</text>

          {/* Crosshair Axes centered on naval station */}
          <line x1={radarCenterX} y1="10" x2={radarCenterX} y2={mapHeight - 10} stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="6,6" />
          <line x1="10" y1={radarCenterY} x2={mapWidth - 10} y2={radarCenterY} stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="6,6" />

          {/* Cardinal Bearing Labels */}
          <text x={radarCenterX - 10} y="22" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">000° N</text>
          <text x={mapWidth - 45} y={radarCenterY - 4} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">090° E</text>
          <text x={radarCenterX - 10} y={mapHeight - 15} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">180° S</text>
          <text x="14" y={radarCenterY - 4} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">270° W</text>

          {/* Coastline Geometry */}
          <path
            d={indiaCoastPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d={indiaCoastPath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          <path
            d={sriLankaPath}
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="1.5"
            opacity="0.8"
          />

          {/* Indian Maritime EEZ Limit (200 NM Outer Boundary) */}
          <path
            d="M 60,110 Q 110,230 180,360 Q 250,430 330,420 Q 420,310 470,200 Q 520,130 550,110"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="1.2"
            strokeDasharray="6,4"
            opacity="0.35"
          />
          <text x="70" y="130" fill="#0ea5e9" fontSize="8" fontFamily="monospace" opacity="0.5">
            INDIAN MARITIME EEZ OUTER BOUNDARY (UNCLOS)
          </text>

          {/* Shipping Lanes & Corridors */}
          {showShippingLanes && (
            <g opacity="0.45">
              <path
                d="M 660,390 L 400,395 L 290,410 L 150,320 L 70,200"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="5,5"
              />
              <text x="470" y="385" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                SIX DEGREE CHANNEL / GREAT NICOBAR
              </text>
              <text x="80" y="270" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                ARABIAN SEA TANKER HIGHWAY
              </text>
            </g>
          )}

          {/* Marine Protected Areas (MPAs) */}
          {showEcoZones && MPA_ZONES.map((mpa, idx) => {
            const pos = projectCoord(mpa.lat, mpa.lng, selectedSector, mapWidth, mapHeight);
            return (
              <g key={idx}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  fill="rgba(16, 185, 129, 0.12)"
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle cx={pos.x} cy={pos.y} r="3" fill="#10b981" />
                <text
                  x={pos.x + 8}
                  y={pos.y + 3}
                  fill="#34d399"
                  fontSize="8"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {mpa.name.split(' ')[0]} MPA
                </text>
              </g>
            );
          })}

          {/* Naval MRCC Base Stations */}
          {NAVAL_BASES.map((b, idx) => {
            const pos = projectCoord(b.lat, b.lng, selectedSector, mapWidth, mapHeight);
            return (
              <g key={idx}>
                <rect x={pos.x - 3} y={pos.y - 3} width="6" height="6" fill="#38bdf8" />
                <text x={pos.x + 6} y={pos.y + 3} fill="#7dd3fc" fontSize="8" fontFamily="monospace" opacity="0.8">
                  {b.name}
                </text>
              </g>
            );
          })}

          {/* 3. Authentic Continuous Rotating Radar Sweep Beam */}
          {showRadarSweep && (
            <g style={{ transformOrigin: `${radarCenterX}px ${radarCenterY}px` }} className="animate-spin-radar">
              {/* Radar Sweep Wedge */}
              <path
                d={`M ${radarCenterX} ${radarCenterY} L ${radarCenterX + 320} ${radarCenterY - 80} A 320 320 0 0 1 ${radarCenterX + 320} ${radarCenterY} Z`}
                fill="url(#sweepGradient)"
              />
              {/* Leading beam line */}
              <line
                x1={radarCenterX}
                y1={radarCenterY}
                x2={radarCenterX + 320}
                y2={radarCenterY}
                stroke="#06b6d4"
                strokeWidth="1.5"
                opacity="0.8"
              />
            </g>
          )}

          {/* 4. Incident Target Markers with Target Reticles */}
          {incidents.map((inc) => {
            let lat = 14.82, lng = 68.21;
            if (inc.coordinates && inc.coordinates.lat) {
              lat = inc.coordinates.lat;
              lng = inc.coordinates.lng;
            } else if (inc.location) {
              const match = inc.location.match(/([\d.]+)°?N.*?([\d.]+)°?E/i);
              if (match) {
                lat = parseFloat(match[1]);
                lng = parseFloat(match[2]);
              }
            }

            const pos = projectCoord(lat, lng, selectedSector, mapWidth, mapHeight);
            const isSelected = inc.id === activeIncidentId;
            const isHovered = hoveredIncident?.id === inc.id;
            const risk = (inc.risk || inc.riskLevel || "HIGH").toUpperCase();

            let markerColor = "#f59e0b"; // HIGH amber
            let glowColor = "rgba(245, 158, 11, 0.4)";
            if (risk === "CRITICAL") {
              markerColor = "#ef4444"; // CRITICAL red
              glowColor = "rgba(239, 68, 68, 0.5)";
            } else if (risk === "LOW") {
              markerColor = "#38bdf8";
              glowColor = "rgba(56, 189, 248, 0.4)";
            }

            return (
              <g
                key={inc.id}
                className="cursor-pointer"
                onClick={() => {
                  onSelectIncident(inc.id);
                  if (onInspectIncident) onInspectIncident(inc);
                }}
                onMouseEnter={() => setHoveredIncident(inc)}
                onMouseLeave={() => setHoveredIncident(null)}
              >
                {/* Active Tracking Reticle [ + ] */}
                {isSelected && (
                  <g>
                    {/* Reticle brackets */}
                    <path
                      d={`M ${pos.x - 14} ${pos.y - 8} L ${pos.x - 14} ${pos.y - 14} L ${pos.x - 8} ${pos.y - 14}`}
                      fill="none" stroke="#22d3ee" strokeWidth="1.8"
                    />
                    <path
                      d={`M ${pos.x + 8} ${pos.y - 14} L ${pos.x + 14} ${pos.y - 14} L ${pos.x + 14} ${pos.y - 8}`}
                      fill="none" stroke="#22d3ee" strokeWidth="1.8"
                    />
                    <path
                      d={`M ${pos.x - 14} ${pos.y + 8} L ${pos.x - 14} ${pos.y + 14} L ${pos.x - 8} ${pos.y + 14}`}
                      fill="none" stroke="#22d3ee" strokeWidth="1.8"
                    />
                    <path
                      d={`M ${pos.x + 8} ${pos.y + 14} L ${pos.x + 14} ${pos.y + 14} L ${pos.x + 14} ${pos.y + 8}`}
                      fill="none" stroke="#22d3ee" strokeWidth="1.8"
                    />
                    {/* Pulsing ring */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="22"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      opacity="0.5"
                      className="animate-ping origin-center"
                      style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                    />
                  </g>
                )}

                {/* Outer halo */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? "14" : isHovered ? "12" : "8"}
                  fill={glowColor}
                  stroke={markerColor}
                  strokeWidth={isSelected ? "2" : "1.2"}
                />

                {/* Core dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? "5" : "3.5"}
                  fill={isSelected ? "#ffffff" : markerColor}
                />

                {/* Target ID Label */}
                <text
                  x={pos.x + 10}
                  y={pos.y + 3}
                  fill={isSelected ? "#38bdf8" : "#ffffff"}
                  fontSize={isSelected ? "10" : "8"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="monospace"
                  opacity={isSelected || isHovered ? 1 : 0.8}
                >
                  {inc.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 5. Live Cursor Coordinates HUD */}
        {cursorCoords && (
          <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-lg px-2.5 py-1 text-[10px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none">
            <Crosshair className="w-3 h-3 text-cyan-400 animate-spin-slow" />
            <span>RADAR RETICLE: <b>{cursorCoords.lat}°N, {cursorCoords.lng}°E</b></span>
          </div>
        )}

        {/* 6. Active Target Spotlight HUD Panel (Floating in Bottom-Right) */}
        {spotlightIncident && (
          <div className="absolute bottom-2 right-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-xl p-3 text-xs max-w-xs w-full shadow-2xl space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-mono font-black text-cyan-300 text-xs">TARGET: {spotlightIncident.id}</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                (spotlightIncident.risk || spotlightIncident.riskLevel) === 'CRITICAL' ? 'bg-red-900/60 text-red-300 border border-red-500/40' : 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
              }`}>
                {spotlightIncident.risk || spotlightIncident.riskLevel || 'HIGH'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/80">
              <div>
                <span className="text-[9px] text-white/50 block">SURFACE FOOTPRINT</span>
                <span className="font-bold text-white text-sm">{spotlightIncident.areaKm2 || spotlightIncident.spillAreaKm2 || 14.7} km²</span>
              </div>
              <div>
                <span className="text-[9px] text-white/50 block">AI CONFIDENCE</span>
                <span className="font-bold text-emerald-400 text-sm">{spotlightIncident.confidence || 96.5}%</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-white/50 block">ATTRIBUTED VESSEL</span>
                <span className="font-bold text-cyan-200 truncate block">
                  🚢 {spotlightIncident.topCandidate || spotlightIncident.topVessel?.name || 'MV Ocean Star'}
                </span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onSelectIncident(spotlightIncident.id)}
                className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-mono font-bold text-[10px] transition-colors"
              >
                Track in Session
              </button>
              <button
                onClick={() => {
                  onSelectIncident(spotlightIncident.id);
                  if (onInspectIncident) onInspectIncident(spotlightIncident);
                }}
                className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[10px]"
              >
                Open Full Dossier →
              </button>
            </div>
          </div>
        )}

        {/* 7. Bottom Left Threat Legend */}
        <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] font-mono flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-red-400">Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-amber-400">High</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-300">Med/Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
