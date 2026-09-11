import React, { useState } from 'react';
import { Maximize2, Minimize2, Crosshair, ZoomIn, ZoomOut, RotateCcw, Shield, Radio, Activity } from 'lucide-react';

export default function TacticalC2FullscreenModal({
  isOpen,
  onClose,
  children,
  sceneTitle = "Sentinel-1A SAR TOPSAR IW Delineation",
  coordinates = "14.8214°N, 68.2108°E"
}) {
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#030B12] text-white flex flex-col font-mono animate-fade-in select-none">
      {/* Tactical Top Bar */}
      <div className="px-6 py-3 border-b border-cyan-500/30 bg-[#071624] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center">
            <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-cyan-300 tracking-wider uppercase">
                TACTICAL MARITIME C2 SATELLITE HUD
              </h2>
              <span className="px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                CLASSIFICATION: UNCLASSIFIED // MARITIME DOMAIN AWARENESS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Target Scene: {sceneTitle} · Geolocation: {coordinates}
            </p>
          </div>
        </div>

        {/* Tactical Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#05111B] border border-cyan-500/30 p-1 rounded-xl text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 25))}
              className="p-1.5 hover:bg-cyan-900/50 rounded text-cyan-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] text-cyan-300 font-bold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(250, prev + 25))}
              className="p-1.5 hover:bg-cyan-900/50 rounded text-cyan-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 hover:bg-cyan-900/50 rounded text-slate-400 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/50 rounded-xl text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>EXIT C2 HUD</span>
          </button>
        </div>
      </div>

      {/* Main Fullscreen Viewer Canvas Container */}
      <div className="relative flex-1 bg-[#02070D] flex items-center justify-center overflow-hidden">
        {/* Military HUD Reticle Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 1000 600" preserveAspectRatio="none">
          {/* Corner Framing Brackets */}
          <path d="M 20 50 L 20 20 L 50 20" stroke="#00E5FF" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 980 50 L 980 20 L 950 20" stroke="#00E5FF" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 20 550 L 20 580 L 50 580" stroke="#00E5FF" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M 980 550 L 980 580 L 950 580" stroke="#00E5FF" strokeWidth="2" fill="none" opacity="0.6" />

          {/* Central Crosshairs */}
          <circle cx="500" cy="300" r="180" fill="none" stroke="#00E5FF" strokeWidth="1" strokeDasharray="6,8" opacity="0.3" />
          <circle cx="500" cy="300" r="320" fill="none" stroke="#00E5FF" strokeWidth="0.8" strokeDasharray="4,10" opacity="0.2" />
          <line x1="500" y1="20" x2="500" y2="580" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.25" />
          <line x1="20" y1="300" x2="980" y2="300" stroke="#00E5FF" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.25" />
        </svg>

        {/* Embedded Children / Canvas with Zoom Transform */}
        <div
          className="w-full h-full transition-transform duration-200 flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {children}
        </div>

        {/* Floating Telemetry Box */}
        <div className="absolute bottom-4 left-6 bg-[#071624]/90 backdrop-blur-md border border-cyan-500/40 p-3 rounded-xl text-xs z-30 space-y-1">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME SATELLITE RADAR INTERFEROMETRY</span>
          </div>
          <div className="text-[11px] text-slate-300 flex gap-4">
            <span>AZIMUTH: 284°</span>
            <span>INCIDENCE: 34.8°</span>
            <span>GROUND RANGE: 10M/PX</span>
            <span>PRF: 1650 Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
}

