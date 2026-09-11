import React, { useState } from 'react';
import { Compass, Crosshair, Navigation, X, Clock, Target, ArrowRight, Check, MapPin, Gauge } from 'lucide-react';

function calculateDistanceNm(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Earth radius in NM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

function calculateBearingDeg(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  return Math.round(brng);
}

export default function EblVrmModal({ isOpen, onClose, selectedVessel, activeIncident, onLogEntry }) {
  if (!isOpen) return null;

  const slickCenter = activeIncident?.coordinates || { lat: 14.8214, lng: 68.2108 };
  const vesselPos = selectedVessel?.currentPos || selectedVessel?.pos || { lat: 14.88, lng: 68.32 };
  const radarStation = { lat: slickCenter.lat - 0.2, lng: slickCenter.lng + 0.6, name: "Coastal VTS Radar" };

  const [originType, setOriginType] = useState("vessel");
  const [targetType, setTargetType] = useState("slick");
  const [calcSpeedKn, setCalcSpeedKn] = useState(selectedVessel?.speedKn || 12.4);
  const [logged, setLogged] = useState(false);

  const getCoords = (type) => {
    if (type === "vessel") return { lat: vesselPos.lat, lng: vesselPos.lng, name: selectedVessel?.name || "Target Vessel" };
    if (type === "slick") return { lat: slickCenter.lat, lng: slickCenter.lng, name: "Oil Slick Centroid" };
    if (type === "radar") return { lat: radarStation.lat, lng: radarStation.lng, name: "Coastal Radar Station" };
    if (type === "interceptor") return { lat: radarStation.lat - 0.05, lng: radarStation.lng - 0.05, name: "ICGS VARAHA" };
    return { lat: slickCenter.lat, lng: slickCenter.lng, name: "Reference Point" };
  };

  const p1 = getCoords(originType);
  const p2 = getCoords(targetType);

  const distNm = calculateDistanceNm(p1.lat, p1.lng, p2.lat, p2.lng);
  const distKm = +(distNm * 1.852).toFixed(2);
  const trueBearing = calculateBearingDeg(p1.lat, p1.lng, p2.lat, p2.lng);
  const reciprocalBearing = (trueBearing + 180) % 360;

  const timeHours = calcSpeedKn > 0 ? distNm / calcSpeedKn : 0;
  const timeHoursInt = Math.floor(timeHours);
  const timeMinutes = Math.round((timeHours - timeHoursInt) * 60);

  const handleLog = () => {
    if (onLogEntry) {
      onLogEntry({
        type: "EBL_VRM",
        text: `EBL/VRM Nav Fix: ${p1.name} → ${p2.name}: Dist ${distNm} NM (${distKm} km), Brg ${String(trueBearing).padStart(3, '0')}°T / Reciprocal ${String(reciprocalBearing).padStart(3, '0')}°T. ETE ${timeHoursInt}h ${timeMinutes}m @ ${calcSpeedKn} kn.`
      });
      setLogged(true);
      setTimeout(() => setLogged(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ocean-navy/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border-2 border-ocean rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-ocean-navy via-[#0A2E4E] to-ocean px-4 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00E5FF]" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Tactical EBL / VRM Navigation Calculator</h3>
              <p className="text-[10px] text-[#A5E3F7] font-mono">Electronic Bearing Line & Variable Range Marker</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Origin & Target Selector */}
          <div className="grid grid-cols-2 gap-3">
            {/* Origin */}
            <div className="space-y-1.5 p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <label className="text-[10px] font-mono font-bold text-ocean-navy flex items-center gap-1">
                <MapPin className="w-3 h-3 text-ocean" />
                <span>ORIGIN (POINT A)</span>
              </label>
              <select
                value={originType}
                onChange={(e) => setOriginType(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 rounded-lg border border-border-marine bg-white focus:outline-none focus:border-ocean"
              >
                <option value="vessel">Target Vessel ({selectedVessel?.name?.substring(0, 14) || 'Vessel'})</option>
                <option value="slick">Oil Slick Centroid</option>
                <option value="radar">Coastal Radar Station</option>
                <option value="interceptor">ICGS VARAHA Patrol</option>
              </select>
              <div className="text-[10px] font-mono text-text-muted">
                Lat: {p1.lat.toFixed(4)}°, Lng: {p1.lng.toFixed(4)}°
              </div>
            </div>

            {/* Target */}
            <div className="space-y-1.5 p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <label className="text-[10px] font-mono font-bold text-ocean-navy flex items-center gap-1">
                <Target className="w-3 h-3 text-status-danger" />
                <span>TARGET (POINT B)</span>
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full text-xs font-semibold p-1.5 rounded-lg border border-border-marine bg-white focus:outline-none focus:border-ocean"
              >
                <option value="slick">Oil Slick Centroid</option>
                <option value="vessel">Target Vessel ({selectedVessel?.name?.substring(0, 14) || 'Vessel'})</option>
                <option value="radar">Coastal Radar Station</option>
                <option value="interceptor">ICGS VARAHA Patrol</option>
              </select>
              <div className="text-[10px] font-mono text-text-muted">
                Lat: {p2.lat.toFixed(4)}°, Lng: {p2.lng.toFixed(4)}°
              </div>
            </div>
          </div>

          {/* Tactical Telemetry Metrics Display */}
          <div className="grid grid-cols-3 gap-2 bg-[#0B2032] p-3 rounded-xl text-white font-mono">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[9px] text-[#00E5FF] block">RANGE (VRM)</span>
              <span className="text-base font-black text-white">{distNm}</span>
              <span className="text-[10px] text-slate-300 ml-1">NM</span>
              <div className="text-[9px] text-slate-400 mt-0.5">({distKm} km)</div>
            </div>

            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[9px] text-amber-300 block">BEARING (EBL)</span>
              <span className="text-base font-black text-white">{String(trueBearing).padStart(3, '0')}°</span>
              <span className="text-[10px] text-amber-300 ml-1">True</span>
              <div className="text-[9px] text-slate-400 mt-0.5">Recip: {String(reciprocalBearing).padStart(3, '0')}°</div>
            </div>

            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[9px] text-emerald-400 block">EST. TRANSIT</span>
              <span className="text-base font-black text-white">{timeHoursInt}h {timeMinutes}m</span>
              <div className="text-[9px] text-slate-400 mt-0.5">@ {calcSpeedKn} kn</div>
            </div>
          </div>

          {/* Speed Adjuster */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-ocean-sky/40 border border-border-marine text-xs">
            <span className="font-semibold text-ocean-navy flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-ocean" />
              <span>Speed Over Ground (SOG):</span>
            </span>
            <div className="flex items-center gap-1.5">
              {[8, 12.4, 20, 34.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setCalcSpeedKn(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                    calcSpeedKn === spd ? 'bg-ocean text-white' : 'bg-white text-ocean-navy border border-border-marine hover:bg-ocean-sky'
                  }`}
                >
                  {spd} kn
                </button>
              ))}
            </div>
          </div>

          {/* Vector Direction Graphic */}
          <div className="p-2 rounded-xl bg-slate-50 border border-border-marine flex items-center justify-between text-[11px] font-mono text-ocean-navy">
            <span className="font-bold truncate max-w-[120px]">{p1.name}</span>
            <div className="flex items-center gap-1 text-ocean font-bold">
              <span>───────</span>
              <span>{trueBearing}° ({distNm} NM)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold truncate max-w-[120px]">{p2.name}</span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-marine">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border-marine text-text-secondary hover:bg-slate-100 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleLog}
              disabled={logged}
              className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              {logged ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Navigation className="w-3.5 h-3.5" />}
              <span>{logged ? "Logged to Watchbook" : "Log Navigation Fix"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

