import React, { useState } from 'react';
import { Target, Radio, AlertTriangle, Crosshair, CheckCircle, Search, ShieldAlert } from 'lucide-react';

export default function DarkVesselMatrix({ activeIncident, onFocusLocation }) {
  const centerLat = activeIncident?.coordinates?.lat || 14.8214;
  const centerLng = activeIncident?.coordinates?.lng || 68.2108;

  const [targets, setTargets] = useState([
    {
      id: "DARK-TGT-084",
      classification: "Uncooperative Tanker Hull",
      lat: centerLat - 0.14,
      lng: centerLng - 0.21,
      rcsDbm2: 38.4,
      estimatedLengthM: 184,
      estimatedBeamM: 32,
      estimatedSpeedKn: 11.8,
      estimatedHeadingDeg: 282,
      sarMatchConfidence: 89,
      aisStatus: "OFFLINE / SILENT",
      firstSeen: "14:18 UTC",
      distanceToOriginNm: 3.8
    },
    {
      id: "DARK-TGT-091",
      classification: "Medium Cargo Vessel",
      lat: centerLat + 0.28,
      lng: centerLng + 0.35,
      rcsDbm2: 24.2,
      estimatedLengthM: 112,
      estimatedBeamM: 18,
      estimatedSpeedKn: 8.4,
      estimatedHeadingDeg: 145,
      sarMatchConfidence: 34,
      aisStatus: "INTERMITTENT TRANSPONDER",
      firstSeen: "13:52 UTC",
      distanceToOriginNm: 18.2
    }
  ]);

  const [correlatingId, setCorrelatingId] = useState(null);

  const handleCorrelate = (id) => {
    setCorrelatingId(id);
    setTimeout(() => {
      setCorrelatingId(null);
      setTargets(prev => prev.map(t => t.id === id ? { ...t, sarMatchConfidence: Math.min(96, t.sarMatchConfidence + 4) } : t));
    }, 1200);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-status-danger" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">DARK TARGET & SAR CORRELATION</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-status-danger border border-red-200 font-bold">
          {targets.length} NON-AIS RETURNS
        </span>
      </div>

      <p className="text-[11px] text-text-secondary leading-snug">
        Radar Cross Section (RCS) surface echoes detected by Sentinel-1 SAR and coastal radar operating without active AIS transponders:
      </p>

      {/* Target Cards */}
      <div className="space-y-2">
        {targets.map((tgt) => (
          <div
            key={tgt.id}
            className="p-2.5 rounded-xl border border-red-200 bg-red-50/40 space-y-2 text-xs font-mono"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-ocean-navy">{tgt.id}</span>
                <span className="text-[10px] text-status-danger ml-2 font-bold">{tgt.classification}</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-status-danger font-bold text-[9px]">
                {tgt.aisStatus}
              </span>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-3 gap-1.5 bg-white/80 p-2 rounded-lg border border-red-100 text-[10px]">
              <div>
                <span className="text-text-muted block text-[8.5px]">RCS ECHO</span>
                <span className="font-bold text-ocean-navy">{tgt.rcsDbm2} dBm²</span>
              </div>
              <div>
                <span className="text-text-muted block text-[8.5px]">EST. HULL</span>
                <span className="font-bold text-ocean-navy">{tgt.estimatedLengthM}m × {tgt.estimatedBeamM}m</span>
              </div>
              <div>
                <span className="text-text-muted block text-[8.5px]">SPEED / COURSE</span>
                <span className="font-bold text-ocean-navy">{tgt.estimatedSpeedKn} kn · {tgt.estimatedHeadingDeg}°</span>
              </div>
            </div>

            {/* SAR Correlation Confidence Bar */}
            <div>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <span className="text-text-muted">SAR Spatiotemporal Match:</span>
                <span className="font-bold text-status-danger">{tgt.sarMatchConfidence}% Probability</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  style={{ width: `${tgt.sarMatchConfidence}%` }}
                  className={`h-full ${tgt.sarMatchConfidence > 75 ? 'bg-status-danger' : 'bg-status-warning'}`}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-red-200/50 text-[10px]">
              <button
                onClick={() => onFocusLocation && onFocusLocation({ lat: tgt.lat, lng: tgt.lng, zoom: 10, id: tgt.id })}
                className="text-ocean hover:underline font-bold flex items-center gap-1"
              >
                <Crosshair className="w-3 h-3" />
                <span>Lock Radar Echo</span>
              </button>

              <button
                onClick={() => handleCorrelate(tgt.id)}
                disabled={correlatingId === tgt.id}
                className="px-2 py-0.5 rounded bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1 transition-all"
              >
                <Search className="w-2.5 h-2.5" />
                <span>{correlatingId === tgt.id ? "Analyzing..." : "Correlate SAR"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

