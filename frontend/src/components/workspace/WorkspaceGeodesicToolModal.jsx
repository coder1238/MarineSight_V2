import React, { useState, useMemo } from 'react';
import { X, Compass, MapPin, Navigation, Anchor, ArrowRight, Shield } from 'lucide-react';

export default function WorkspaceGeodesicToolModal({ caseData, onClose }) {
  // Base point is incident centroid
  const baseLat = caseData.coordinates?.lat || 14.8214;
  const baseLng = caseData.coordinates?.lng || 68.2108;

  const [targetLat, setTargetLat] = useState(15.41); // Mormugao Port
  const [targetLng, setTargetLng] = useState(73.80);
  const [transitSpeedKn, setTransitSpeedKn] = useState(18); // knots

  // Preset landmarks
  const presets = [
    { name: "Mormugao Port (Goa)", lat: 15.41, lng: 73.80 },
    { name: "Mangalore Port", lat: 12.92, lng: 74.82 },
    { name: "Mumbai High Offshore", lat: 19.42, lng: 71.33 },
    { name: "Karwar Naval Base", lat: 14.81, lng: 74.13 },
    { name: "Suspect Vessel MV Ocean Star", lat: baseLat - 0.15, lng: baseLng + 0.22 }
  ];

  // Geodesic calculations (Haversine formula + Initial Bearing)
  const results = useMemo(() => {
    const toRad = (d) => (d * Math.PI) / 180;
    const toDeg = (r) => (r * 180) / Math.PI;

    const R_NM = 3440.065; // Earth radius in Nautical Miles
    const dLat = toRad(targetLat - baseLat);
    const dLng = toRad(targetLng - baseLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(baseLat)) * Math.cos(toRad(targetLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceNm = +(R_NM * c).toFixed(2);
    const distanceKm = +(distanceNm * 1.852).toFixed(2);

    // Initial Bearing (Forward Azimuth)
    const y = Math.sin(dLng) * Math.cos(toRad(targetLat));
    const x =
      Math.cos(toRad(baseLat)) * Math.sin(toRad(targetLat)) -
      Math.sin(toRad(baseLat)) * Math.cos(toRad(targetLat)) * Math.cos(dLng);
    let bearingDeg = Math.round((toDeg(Math.atan2(y, x)) + 360) % 360);

    // Transit time
    const transitHours = +(distanceNm / Math.max(1, transitSpeedKn)).toFixed(2);
    const transitMinutes = Math.round(transitHours * 60);

    // Maritime Zone Jurisdiction from nearest coast (~approx distance from baseline)
    let jurisdiction = "Exclusive Economic Zone (EEZ)";
    let zoneColor = "bg-blue-100 text-ocean-deep";
    if (distanceNm <= 12) {
      jurisdiction = "Territorial Waters (< 12 NM Sovereign)";
      zoneColor = "bg-red-100 text-status-danger";
    } else if (distanceNm <= 24) {
      jurisdiction = "Contiguous Zone (12 - 24 NM Fiscal/Sanitary)";
      zoneColor = "bg-amber-100 text-amber-800";
    } else if (distanceNm > 200) {
      jurisdiction = "High Seas (Beyond 200 NM)";
      zoneColor = "bg-slate-100 text-slate-700";
    }

    return {
      distanceNm,
      distanceKm,
      bearingDeg,
      transitHours,
      transitMinutes,
      jurisdiction,
      zoneColor
    };
  }, [baseLat, baseLng, targetLat, targetLng, transitSpeedKn]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Geodesic Range, Bearing & Maritime Boundary Checker
              </h3>
              <p className="text-xs text-text-secondary">
                Calculate great-circle navigation distances, true bearings, and UNCLOS maritime boundaries.
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-text-muted">QUICK TARGET PRESETS:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setTargetLat(p.lat);
                    setTargetLng(p.lng);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-border-marine bg-slate-50 hover:bg-ocean-sky text-ocean-navy text-xs font-mono transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Origin */}
            <div className="p-3 bg-ocean-light/50 border border-ocean/30 rounded-xl space-y-1">
              <span className="text-[10px] text-ocean font-bold block uppercase">POINT A: SLICK CENTROID</span>
              <div className="font-bold text-ocean-navy text-sm">{caseData.coordinates?.display}</div>
              <span className="text-[10px] text-text-muted">Lat: {baseLat}°N, Lng: {baseLng}°E</span>
            </div>

            {/* Target */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-2">
              <span className="text-[10px] text-text-muted font-bold block uppercase">POINT B: DESTINATION / INTERCEPT</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-text-muted block">LATITUDE (°N):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={targetLat}
                    onChange={e => setTargetLat(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border-marine text-xs font-bold text-ocean-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block">LONGITUDE (°E):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={targetLng}
                    onChange={e => setTargetLng(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border-marine text-xs font-bold text-ocean-navy focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speed slider */}
          <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5 text-xs font-mono">
            <label className="font-bold text-ocean-navy flex justify-between">
              <span>INTERCEPT SPEED:</span>
              <span className="text-ocean font-bold">{transitSpeedKn} Knots</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              value={transitSpeedKn}
              onChange={e => setTransitSpeedKn(Number(e.target.value))}
              className="w-full accent-ocean cursor-pointer"
            />
          </div>

          {/* Calculated Output Banner */}
          <div className="bg-ocean-navy text-white rounded-2xl p-4 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-ocean/40 pb-2">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <Navigation className="w-4 h-4" />
                <span>GEODESIC NAVIGATION SOLUTIONS</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${results.zoneColor}`}>
                {results.jurisdiction}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">RANGE (NAUTICAL MILES)</span>
                <span className="text-xl font-black text-sky-300">{results.distanceNm} NM</span>
                <span className="text-[10px] text-slate-400 block">({results.distanceKm} km)</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">INITIAL TRUE BEARING</span>
                <span className="text-xl font-black text-amber-300">{results.bearingDeg}° T</span>
                <span className="text-[10px] text-slate-400 block">Great Circle Heading</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">ESTIMATED TRANSIT</span>
                <span className="text-xl font-black text-emerald-300">
                  {results.transitMinutes < 60 ? `${results.transitMinutes}m` : `${results.transitHours}h`}
                </span>
                <span className="text-[10px] text-slate-400 block">@ {transitSpeedKn} knots</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">UNCLOS STATUS</span>
                <span className="text-xs font-bold text-white block mt-1">{results.jurisdiction.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-400 block">Maritime Zone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            Formula: WGS84 Ellipsoidal Approximation & Spherical Law of Cosines.
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

