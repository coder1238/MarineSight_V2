import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Compass, MapPin, Anchor, Fish } from 'lucide-react';

export default function MpaGeofenceRadarCard({ vessel }) {
  const isHighPriority = vessel.status === "HIGH PRIORITY" || vessel.rank === "01";

  const geofenceZones = [
    {
      name: "Sovereign Territorial Sea (12 NM Limit)",
      type: "Territorial Waters",
      distanceNm: isHighPriority ? 6.4 : 18.2,
      breached: isHighPriority,
      jurisdiction: "UNCLOS Coastal State Law"
    },
    {
      name: "Coral Reef Sanctuary & Pelagic Breeding Ground",
      type: "Ecological Sanctuary (MPA)",
      distanceNm: isHighPriority ? 1.8 : 14.5,
      breached: isHighPriority,
      jurisdiction: "Wildlife Protection Act 1972"
    },
    {
      name: "Exclusive Economic Zone (EEZ 200 NM)",
      type: "Maritime Economic Zone",
      distanceNm: 0.0,
      breached: true,
      jurisdiction: "National Maritime Jurisdiction"
    },
    {
      name: "High-Density Artisanal Fishery Cluster",
      type: "Fisheries Protected Basin",
      distanceNm: isHighPriority ? 3.2 : 9.8,
      breached: false,
      jurisdiction: "Department of Fisheries"
    }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-status-danger border border-red-200">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Marine Protected Area (MPA) & Territorial Geofence Radar
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Boundary proximity sentry across ecologically sensitive marine ecosystems
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
          isHighPriority ? 'bg-red-100 text-status-danger' : 'bg-emerald-100 text-status-success'
        }`}>
          {isHighPriority ? '● MPA BUFFER BREACHED' : '● SAFE CLEARANCE'}
        </span>
      </div>

      {/* Geofence Zones List */}
      <div className="space-y-2">
        {geofenceZones.map((zone, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl border border-border-marine/60 bg-ocean-light/40 flex items-center justify-between text-[11px]"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-ocean" />
                <span className="font-bold text-ocean-navy">{zone.name}</span>
              </div>
              <span className="text-[10px] text-text-muted font-sans block pl-4">
                Classification: {zone.type} · {zone.jurisdiction}
              </span>
            </div>

            <div className="text-right flex-shrink-0">
              <span className={`text-xs font-bold block ${zone.breached ? 'text-status-danger' : 'text-ocean-deep'}`}>
                {zone.distanceNm === 0 ? 'INSIDE ZONE' : `${zone.distanceNm} nm away`}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase inline-block ${
                zone.breached ? 'bg-red-100 text-status-danger' : 'bg-emerald-100 text-status-success'
              }`}>
                {zone.breached ? 'ALERT: BREACH' : 'SECURE'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

