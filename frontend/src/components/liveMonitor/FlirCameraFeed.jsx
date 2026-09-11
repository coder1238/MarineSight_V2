import React, { useState, useEffect, useRef } from 'react';
import { Camera, Eye, Crosshair, ZoomIn, Sun, Moon, Flame, Zap, Maximize2, ShieldAlert, Sparkles, Download } from 'lucide-react';

export default function FlirCameraFeed({ selectedVessel, activeIncident, simHour = 15.0 }) {
  const canvasRef = useRef(null);
  const [cameraMode, setCameraMode] = useState("FLIR_WHITE"); // "DAY_EO", "FLIR_WHITE", "FLIR_BLACK", "NVG"
  const [zoomLevel, setZoomLevel] = useState(4); // 1, 4, 10, 25
  const [laserRanging, setLaserRanging] = useState(true);
  const [gimbalAzimuth, setGimbalAzimuth] = useState(284);
  const [gimbalElevation, setGimbalElevation] = useState(-14.2);
  const [flashSnapshot, setFlashSnapshot] = useState(false);

  const vesselName = selectedVessel?.name || activeIncident?.topVessel?.name || "M/V OCEAN STAR";
  const mmsi = selectedVessel?.mmsi || activeIncident?.topVessel?.mmsi || "419001248";
  const speed = selectedVessel?.speedKn || selectedVessel?.dynamicSpeedKn || 12.4;

  // Render Tactical Canvas Stream
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let time = 0;
    const render = () => {
      time += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Color Palettes
      let bgColor, shipColor, deckColor, wakeColor, oilColor, reticleColor, exhaustColor;

      if (cameraMode === "DAY_EO") {
        bgColor = "#1E3A8A"; // Deep Ocean Blue
        shipColor = "#334155"; // Dark Slate Hull
        deckColor = "#94A3B8";
        wakeColor = "rgba(255, 255, 255, 0.4)";
        oilColor = "rgba(40, 30, 20, 0.75)";
        reticleColor = "#00E5FF";
        exhaustColor = "rgba(200, 200, 200, 0.3)";
      } else if (cameraMode === "FLIR_WHITE") {
        bgColor = "#111827"; // Dark background (cool sea)
        shipColor = "#6B7280"; // Neutral grey
        deckColor = "#9CA3AF";
        wakeColor = "rgba(209, 213, 219, 0.25)";
        oilColor = "rgba(10, 10, 15, 0.9)"; // Oil appears dark cool anomaly
        reticleColor = "#FFFFFF";
        exhaustColor = "rgba(255, 255, 255, 0.95)"; // Hot exhaust glow
      } else if (cameraMode === "FLIR_BLACK") {
        bgColor = "#E5E7EB"; // Light background
        shipColor = "#374151"; // Dark grey
        deckColor = "#1F2937";
        wakeColor = "rgba(75, 85, 99, 0.25)";
        oilColor = "rgba(250, 250, 250, 0.9)";
        reticleColor = "#000000";
        exhaustColor = "rgba(0, 0, 0, 0.95)";
      } else {
        // NVG Green Phosphor
        bgColor = "#04260E";
        shipColor = "#15803D";
        deckColor = "#22C55E";
        wakeColor = "rgba(74, 222, 128, 0.3)";
        oilColor = "rgba(2, 44, 15, 0.85)";
        reticleColor = "#4ADE80";
        exhaustColor = "rgba(187, 247, 208, 0.9)";
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // Sea wave ripples
      ctx.strokeStyle = wakeColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const y = (h * 0.35 + i * 25 + (time * 12) % 30);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(w * 0.3, y - 5, w * 0.7, y + 5, w, y);
        ctx.stroke();
      }

      // Trailing Oil Slick Wake from stern
      ctx.fillStyle = oilColor;
      ctx.beginPath();
      const sternX = w * 0.32;
      const sternY = h * 0.52;
      ctx.moveTo(sternX, sternY);
      ctx.lineTo(sternX - 160 * (zoomLevel / 4), sternY - 25);
      ctx.lineTo(sternX - 220 * (zoomLevel / 4), sternY + 30);
      ctx.lineTo(sternX, sternY + 12);
      ctx.closePath();
      ctx.fill();

      // Vessel Hull Rendering (Side-Quarter Perspective)
      const cx = w * 0.52;
      const cy = h * 0.52;
      const scale = (zoomLevel / 4) * 0.95;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Main Hull
      ctx.fillStyle = shipColor;
      ctx.beginPath();
      ctx.moveTo(-110, 10);
      ctx.lineTo(95, 10);
      ctx.lineTo(130, -5);
      ctx.lineTo(85, -15);
      ctx.lineTo(-100, -15);
      ctx.lineTo(-115, -5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = reticleColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Superstructure / Deckhouse & Bridge
      ctx.fillStyle = deckColor;
      ctx.fillRect(-85, -42, 45, 27);
      ctx.strokeRect(-85, -42, 45, 27);

      // Radar Mast
      ctx.strokeStyle = reticleColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-65, -42);
      ctx.lineTo(-65, -62);
      ctx.stroke();

      // Rotating Radar Scanner
      const radarAngle = (time * 4) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(-65 - Math.cos(radarAngle) * 12, -62);
      ctx.lineTo(-65 + Math.cos(radarAngle) * 12, -62);
      ctx.stroke();

      // Cargo Deck Pipelines (Tanker Structure)
      ctx.fillStyle = shipColor;
      for (let bx = -30; bx < 80; bx += 22) {
        ctx.fillRect(bx, -22, 16, 7);
      }

      // Hot Thermal Funnel Engine Exhaust (Glowing in Thermal Mode)
      if (cameraMode === "FLIR_WHITE" || cameraMode === "FLIR_BLACK") {
        ctx.fillStyle = exhaustColor;
        ctx.beginPath();
        ctx.arc(-55, -45, 8 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Plume
        ctx.fillStyle = exhaustColor;
        ctx.beginPath();
        ctx.moveTo(-58, -48);
        ctx.lineTo(-75 - Math.sin(time * 2) * 5, -70);
        ctx.lineTo(-60, -72);
        ctx.lineTo(-52, -48);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // NVG Noise Grain Overlay
      if (cameraMode === "NVG") {
        ctx.fillStyle = "rgba(74, 222, 128, 0.08)";
        for (let i = 0; i < 400; i++) {
          const rx = Math.random() * w;
          const ry = Math.random() * h;
          ctx.fillRect(rx, ry, 1.5, 1.5);
        }
      }

      // Tactical Reticle Crosshairs & Optical HUD
      ctx.strokeStyle = reticleColor;
      ctx.lineWidth = 1;

      // Center crosshairs
      const midX = w / 2;
      const midY = h / 2;
      const reticleSize = 24;

      ctx.beginPath();
      ctx.moveTo(midX - reticleSize, midY);
      ctx.lineTo(midX - 6, midY);
      ctx.moveTo(midX + 6, midY);
      ctx.lineTo(midX + reticleSize, midY);
      ctx.moveTo(midX, midY - reticleSize);
      ctx.lineTo(midX, midY - 6);
      ctx.moveTo(midX, midY + 6);
      ctx.lineTo(midX, midY + reticleSize);
      ctx.stroke();

      // Target Lock Box
      const boxW = 120 * (zoomLevel / 4);
      const boxH = 65 * (zoomLevel / 4);
      ctx.strokeRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH);

      // Corner ticks
      const tick = 6;
      ctx.strokeRect(midX - boxW / 2 - tick, midY - boxH / 2 - tick, tick, tick);
      ctx.strokeRect(midX + boxW / 2, midY - boxH / 2 - tick, tick, tick);
      ctx.strokeRect(midX - boxW / 2 - tick, midY + boxH / 2, tick, tick);
      ctx.strokeRect(midX + boxW / 2, midY + boxH / 2, tick, tick);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [cameraMode, zoomLevel, selectedVessel]);

  const handleCaptureSnapshot = () => {
    setFlashSnapshot(true);
    setTimeout(() => setFlashSnapshot(false), 300);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `EOIR_RECON_${mmsi}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-ocean" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">AIRBORNE EO/IR FLIR FEED</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-status-danger font-bold">REC · 1080P GIMBAL</span>
        </div>
      </div>

      {/* Screen Mode Selectors */}
      <div className="flex items-center gap-1 bg-ocean-light/50 p-1 rounded-xl border border-border-marine text-[10px] font-mono font-bold">
        {[
          { id: "FLIR_WHITE", label: "FLIR W-HOT", icon: Flame },
          { id: "FLIR_BLACK", label: "FLIR B-HOT", icon: Zap },
          { id: "DAY_EO", label: "DAYLIGHT EO", icon: Sun },
          { id: "NVG", label: "GEN-3 NVG", icon: Moon }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCameraMode(id)}
            className={`flex-1 py-1 px-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              cameraMode === id 
                ? 'bg-ocean text-white shadow-xs' 
                : 'text-text-secondary hover:bg-white/80'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Virtual Gimbal HUD Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-border-marine bg-black shadow-inner">
        <canvas
          ref={canvasRef}
          width={420}
          height={210}
          className="w-full h-auto block"
        />

        {/* Shutter Snapshot Flash */}
        {flashSnapshot && (
          <div className="absolute inset-0 bg-white opacity-80 transition-opacity duration-300"></div>
        )}

        {/* Top HUD Overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-white/90 drop-shadow-md">
          <div className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20">
            <span>TARGET: {vesselName}</span> · <span>MMSI {mmsi}</span>
          </div>
          <div className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20 text-emerald-400 font-bold">
            LOCK: OPTICAL TRACK
          </div>
        </div>

        {/* Bottom HUD Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-white/90 drop-shadow-md">
          <div className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20">
            <span>AZ: {gimbalAzimuth}°</span> · <span>EL: {gimbalElevation}°</span> · <span>LRF: 2,420 m</span>
          </div>
          <div className="bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20 text-amber-300 font-bold">
            ZOOM: {zoomLevel}x
          </div>
        </div>
      </div>

      {/* Zoom and Gimbal Controls */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1 font-mono">
          <span className="text-[10px] text-text-muted font-bold mr-1">OPTICAL:</span>
          {[1, 4, 10, 25].map((z) => (
            <button
              key={z}
              onClick={() => setZoomLevel(z)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                zoomLevel === z ? 'bg-ocean text-white' : 'bg-slate-100 text-ocean-navy hover:bg-ocean-sky'
              }`}
            >
              {z}x
            </button>
          ))}
        </div>

        <button
          onClick={handleCaptureSnapshot}
          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-ocean hover:text-white text-ocean-navy text-[10px] font-mono font-bold flex items-center gap-1 border border-border-marine transition-all"
          title="Save High-Res Reconnaissance Screenshot"
        >
          <Download className="w-3 h-3" />
          <span>Save Frame</span>
        </button>
      </div>

      <div className="pt-1.5 border-t border-border-marine/50 text-[9px] font-mono text-text-muted flex items-center justify-between">
        <span>SENSOR: L3HARRIS WESCAM MX-15 EO/IR</span>
        <span className="text-status-success font-semibold">THERMAL SIGNATURE +12.4°C ΔT</span>
      </div>
    </div>
  );
}

