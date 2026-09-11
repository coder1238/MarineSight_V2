import React from 'react';
import { Ship, Crosshair, AlertTriangle, ArrowRight, ShieldAlert, Navigation } from 'lucide-react';

export default function VesselSlickProximityRadar({
  sarVessels = [],
  primarySpillCentroid = { x: 500, y: 300 },
  onFocusVessel
}) {
  // Compute distance and bearing from each vessel to the spill centroid
  const vesselProximities = sarVessels.map((v, i) => {
    const vx = v.canvasPos?.x || (500 + i * 80);
    const vy = v.canvasPos?.y || (300 + i * 50);
    const dx = vx - primarySpillCentroid.x;
    const dy = vy - primarySpillCentroid.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const distKm = +(distPx * 0.024).toFixed(2); // 1 px ~ 24 meters
    let bearing = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
    if (bearing < 0) bearing += 360;

    // Estimated drift intercept time at 1.2 knot ocean drift speed
    const interceptHrs = +(distKm / (1.2 * 1.852)).toFixed(1);

    const isSuspect = v.highPriority || i === 0 || distKm < 5.0;

    return {
      ...v,
      distKm,
      bearing,
      interceptHrs,
      isSuspect
    };
  });

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 15 · Vessel-to-Slick Proximity Radar &amp; Intercept Matrix
          </h3>
        </div>
        <span className="text-[10px] bg-red-50 text-status-danger border border-red-200 px-2 py-0.5 rounded font-bold">
          {vesselProximities.filter(v => v.isSuspect).length} Vessel(s) in Hazard Zone (&lt; 10 km)
        </span>
      </div>

      {/* Proximity List */}
      <div className="space-y-2">
        {vesselProximities.map((vp) => (
          <div
            key={vp.id}
            onClick={() => onFocusVessel && onFocusVessel(vp)}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
              vp.isSuspect
                ? 'border-red-300 bg-red-50/40 hover:bg-red-50'
                : 'border-border-marine bg-ocean-light/20 hover:bg-ocean-light/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                vp.isSuspect ? 'bg-red-100 text-status-danger' : 'bg-ocean-light text-ocean-navy'
              }`}>
                {vp.id}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-ocean-navy text-[11px]">{vp.corr || 'Vessel Contact'}</span>
                  {vp.isSuspect && (
                    <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                      SUSPECT
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-secondary mt-0.5">
                  Length: {vp.length} · Conf: {vp.conf}% · Pos: {vp.pos}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className={`text-sm font-bold block ${vp.isSuspect ? 'text-status-danger' : 'text-ocean'}`}>
                {vp.distKm} km
              </span>
              <span className="text-[9px] text-text-muted block">
                Bearing {vp.bearing}&deg; · {vp.interceptHrs}h lag
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

