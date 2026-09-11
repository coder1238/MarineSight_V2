import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, MapPin, Eye, Bell } from 'lucide-react';

function calculateDistanceNm(lat1, lon1, lat2, lon2) {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

export default function GeofenceSentryCard({ activeIncident, selectedVessel, onFocusZone, onTriggerAlert }) {
  const centerLat = activeIncident?.coordinates?.lat || 14.8214;
  const centerLng = activeIncident?.coordinates?.lng || 68.2108;

  const targetLat = selectedVessel?.currentPos?.lat || selectedVessel?.pos?.lat || centerLat + 0.12;
  const targetLng = selectedVessel?.currentPos?.lng || selectedVessel?.pos?.lng || centerLng + 0.18;

  const zones = [
    {
      id: "GEOFENCE-01",
      name: "Goa Marine Biosphere Sanctuary (MPA)",
      type: "Ecological Marine Reserve",
      lat: centerLat - 0.18,
      lng: centerLng + 0.35,
      radiusNm: 8.0,
      criticality: "HIGH VULNERABILITY",
      jurisdiction: "State Maritime Board"
    },
    {
      id: "GEOFENCE-02",
      name: "International TSS Shipping Corridor",
      type: "Traffic Separation Scheme",
      lat: centerLat + 0.05,
      lng: centerLng + 0.08,
      radiusNm: 6.5,
      criticality: "NAV HAZARD",
      jurisdiction: "IMO TSS Rule 10"
    },
    {
      id: "GEOFENCE-03",
      name: "Offshore SPM Terminal 500m Exclusion",
      type: "Petroleum Platform Security",
      lat: centerLat + 0.32,
      lng: centerLng + 0.45,
      radiusNm: 3.2,
      criticality: "RESTRICTED 500M",
      jurisdiction: "Port Authority"
    }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-status-danger" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">GEOFENCE & MPA SENTRY</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-300 font-bold">
          3 ZONES ARMED
        </span>
      </div>

      <p className="text-[11px] text-text-secondary leading-snug">
        Automated spatial perimeter watchdog monitoring sensitive coastal biospheres and restricted maritime corridors:
      </p>

      <div className="space-y-2">
        {zones.map((z) => {
          const distVessel = calculateDistanceNm(targetLat, targetLng, z.lat, z.lng);
          const distSlick = calculateDistanceNm(centerLat, centerLng, z.lat, z.lng);
          const minDistance = Math.min(distVessel, distSlick);
          const isBreach = minDistance <= z.radiusNm;
          const isWarning = minDistance <= z.radiusNm + 4.0;

          return (
            <div
              key={z.id}
              className={`p-2.5 rounded-xl border transition-all ${
                isBreach 
                  ? 'bg-red-50/80 border-red-300 shadow-sm' 
                  : isWarning 
                  ? 'bg-amber-50/60 border-amber-200' 
                  : 'bg-slate-50/80 border-border-marine'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-ocean-navy flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-ocean" />
                  <span>{z.name}</span>
                </span>
                <span className={`px-1.5 py-0.2 rounded font-bold ${
                  isBreach 
                    ? 'bg-red-200 text-status-danger animate-pulse' 
                    : isWarning 
                    ? 'bg-amber-200 text-status-warning' 
                    : 'bg-emerald-100 text-status-success'
                }`}>
                  {isBreach ? 'BREACH DETECTED' : isWarning ? 'PROXIMITY WARNING' : 'SECURE'}
                </span>
              </div>

              <div className="text-[10px] text-text-muted mt-0.5">
                {z.type} · Jurisdiction: {z.jurisdiction}
              </div>

              {/* Spatial Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-1.5 border-t border-border-marine/50 text-[10px] font-mono">
                <div className="bg-white/80 p-1.5 rounded-lg border border-border-marine">
                  <span className="text-text-muted block text-[9px]">DISTANCE TO SLICK</span>
                  <span className={`font-bold ${distSlick < 5 ? 'text-status-danger' : 'text-ocean-navy'}`}>
                    {distSlick} NM
                  </span>
                  <span className="text-text-muted text-[9px] block">Buffer: {z.radiusNm} NM</span>
                </div>

                <div className="bg-white/80 p-1.5 rounded-lg border border-border-marine">
                  <span className="text-text-muted block text-[9px]">TARGET CPA TO ZONE</span>
                  <span className={`font-bold ${distVessel < 5 ? 'text-status-danger' : 'text-ocean-navy'}`}>
                    {distVessel} NM
                  </span>
                  <span className="text-text-muted text-[9px] block">
                    {selectedVessel?.name?.substring(0, 10) || 'Target'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex items-center justify-between pt-1 border-t border-border-marine/40 text-[10px]">
                <button
                  onClick={() => onFocusZone && onFocusZone({ lat: z.lat, lng: z.lng, zoom: 10, id: z.id })}
                  className="text-ocean hover:underline font-bold flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect on GIS Map</span>
                </button>

                {isWarning && onTriggerAlert && (
                  <button
                    onClick={() => onTriggerAlert(z)}
                    className="px-2 py-0.5 rounded bg-red-100 text-status-danger hover:bg-red-200 font-bold flex items-center gap-0.5"
                  >
                    <Bell className="w-2.5 h-2.5" />
                    <span>Raise Geofence Alert</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

