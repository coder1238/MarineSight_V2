import React from 'react';
import { AlertTriangle, ShieldCheck, Fish, Trees, Waves, Clock } from 'lucide-react';

export default function ReportEnvironmentalSensitivity({ caseData }) {
  const habitats = [
    {
      name: 'Zuari Estuary & Chorao Mangrove Sanctuary',
      type: 'Tidal Mangrove & Spawning Zone',
      distKm: 28.4,
      etaHours: 18.2,
      threatLevel: 'HIGH',
      defensiveBooms: '2.4 km Curtain Booms Mobilized',
      icon: Trees,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      name: 'Netrani Island Coral Reef Ecosystem',
      type: 'Fringing Coral Reef & Pelagic Nursery',
      distKm: 34.1,
      etaHours: 26.5,
      threatLevel: 'MEDIUM-HIGH',
      defensiveBooms: 'Dispersant exclusion zone enforced',
      icon: Waves,
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      name: 'Galgibaga & Morjim Turtle Nesting Beaches',
      type: 'Olive Ridley Critical Nesting Shoreline',
      distKm: 42.0,
      etaHours: 36.0,
      threatLevel: 'MONITORED',
      defensiveBooms: 'Beach cleanup teams on 1-hr standby',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      name: 'Goa Coastal Artisanal Trawler Grounds',
      type: 'Benthic Demersal Fish & Shrimp Fishery',
      distKm: 18.2,
      etaHours: 11.4,
      threatLevel: 'CRITICAL',
      defensiveBooms: 'NAVTEX navigational safety warning issued',
      icon: Fish,
      color: 'text-status-danger bg-red-50 border-red-200'
    }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Fish className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Ecological Sensitivity Index (ESI) & Shoreline Vulnerability
            </h4>
            <p className="text-[10px] text-text-muted">
              Projected impact vectors against marine reserves, breeding estuaries, and coastal fisheries.
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold self-start sm:self-auto">
          TIER-2 REGIONAL THREAT
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {habitats.map((h, idx) => {
          const Icon = h.icon;
          return (
            <div key={idx} className="p-3 bg-ocean-light/40 border border-border-marine rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-ocean" />
                  <span className="font-bold text-ocean-navy text-[11px]">{h.name}</span>
                </div>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${h.color}`}>
                  {h.threatLevel}
                </span>
              </div>

              <div className="text-[10px] text-text-secondary font-sans">
                {h.type}
              </div>

              <div className="pt-1.5 border-t border-border-marine/50 flex items-center justify-between text-[10px] text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ocean" />
                  Distance: <strong>{h.distKm} km</strong> (ETA: <strong>{h.etaHours}h</strong>)
                </span>
                <span className="text-ocean font-semibold text-[9px]">
                  {h.defensiveBooms}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

