import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck,
  Percent,
  Layers
} from 'lucide-react';

const INITIAL_ESI_SECTORS = [
  {
    id: 'SEC-01',
    name: 'Zuari River Estuary & Mangrove Reserve',
    esiScore: 10,
    habitat: 'Dense Mangrove Forest & Mudflats',
    priority: 'Tier 1 (Critical)',
    priorityBadge: 'bg-red-100 text-status-danger border-red-200',
    threatDistanceKm: 12.4,
    recommendedTactic: 'Double-layered Exclusion Curtain Booming across river mouth',
    status: 'Booms Anchored',
    lengthKm: 3.4
  },
  {
    id: 'SEC-02',
    name: 'Galgibaga Olive Ridley Nesting Beach',
    esiScore: 9,
    habitat: 'Fine-grained Sand & Marine Turtle Sanctuary',
    priority: 'Tier 1 (Critical)',
    priorityBadge: 'bg-red-100 text-status-danger border-red-200',
    threatDistanceKm: 18.2,
    recommendedTactic: 'Deflection Chevron Booming into offshore collection skimmer',
    status: 'Unshielded',
    lengthKm: 4.8
  },
  {
    id: 'SEC-03',
    name: 'Grande Island Coral Reefs & Dive Banks',
    esiScore: 9,
    habitat: 'Submerged Hard Corals & Sea-Grass Beds',
    priority: 'Tier 1 (Critical)',
    priorityBadge: 'bg-red-100 text-status-danger border-red-200',
    threatDistanceKm: 14.1,
    recommendedTactic: 'Offshore pneumatic bubble barrier + No-Dispersant Zone',
    status: 'Booms Anchored',
    lengthKm: 2.1
  },
  {
    id: 'SEC-04',
    name: 'Betul Estuary Brackish Fish Hatcheries',
    esiScore: 8,
    habitat: 'Sheltered Tidal Channels & Aquaculture Ponds',
    priority: 'Tier 2 (High)',
    priorityBadge: 'bg-amber-100 text-status-warning border-amber-200',
    threatDistanceKm: 22.5,
    recommendedTactic: 'Shore-sealing inflatable boom & Sorbent sweep rolls',
    status: 'Sorbents Deployed',
    lengthKm: 2.9
  },
  {
    id: 'SEC-05',
    name: 'Anjuna Rocky Intertidal Basin',
    esiScore: 6,
    habitat: 'Exposed Rocky Platforms & Tidal Pools',
    priority: 'Tier 2 (High)',
    priorityBadge: 'bg-amber-100 text-status-warning border-amber-200',
    threatDistanceKm: 26.0,
    recommendedTactic: 'Nearshore skimmer sweeps, high-pressure low-temp wash prep',
    status: 'Unshielded',
    lengthKm: 5.2
  },
  {
    id: 'SEC-06',
    name: 'Mormugao Port Shipping Channel & Breakwaters',
    esiScore: 2,
    habitat: 'Industrial Concrete Riprap & Bulkhead Piers',
    priority: 'Tier 3 (Moderate)',
    priorityBadge: 'bg-gray-100 text-text-secondary border-gray-200',
    threatDistanceKm: 8.5,
    recommendedTactic: 'Harbor gate deflection & vacuum recovery trucks',
    status: 'Secured',
    lengthKm: 1.8
  }
];

export const STATUS_TYPES = [
  { label: 'Unshielded', color: 'bg-red-50 text-status-danger border-red-200' },
  { label: 'Booms Anchored', color: 'bg-blue-50 text-ocean border-blue-200' },
  { label: 'Sorbents Deployed', color: 'bg-amber-50 text-status-warning border-amber-200' },
  { label: 'Secured', color: 'bg-emerald-50 text-status-success border-emerald-200' }
];

export default function ShorelineEsiMatrix() {
  const [sectors, setSectors] = useState(INITIAL_ESI_SECTORS);

  const stats = useMemo(() => {
    const totalCount = sectors.length;
    const protectedCount = sectors.filter(s => s.status === 'Booms Anchored' || s.status === 'Secured').length;
    const partiallyProtected = sectors.filter(s => s.status === 'Sorbents Deployed').length;
    const unprotectedCount = sectors.filter(s => s.status === 'Unshielded').length;
    const coveragePercent = Math.round(((protectedCount + (partiallyProtected * 0.5)) / totalCount) * 100);

    const totalProtectedKm = sectors
      .filter(s => s.status !== 'Unshielded')
      .reduce((sum, s) => sum + s.lengthKm, 0)
      .toFixed(1);

    return {
      totalCount,
      protectedCount,
      unprotectedCount,
      coveragePercent,
      totalProtectedKm
    };
  }, [sectors]);

  const toggleSectorStatus = (id, currentStatus) => {
    const sequence = ['Unshielded', 'Booms Anchored', 'Sorbents Deployed', 'Secured'];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];

    setSectors(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  const handleShieldAll = () => {
    setSectors(prev => prev.map(s => ({ ...s, status: 'Booms Anchored' })));
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-danger/10 text-status-danger">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Environmental Sensitivity Index (ESI) Shoreline Matrix
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-status-danger border border-red-200">
                NOAA / MOEFCC STANDARD
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Classified coastal habitat vulnerability rankings, deflection priorities, and protective shield status.
            </p>
          </div>
        </div>

        <button
          onClick={handleShieldAll}
          className="py-1 px-2.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[10px] font-mono font-bold shadow-sm transition-all"
        >
          Quick Deploy: Shield All Tier 1
        </button>
      </div>

      {/* Progress & KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="bg-ocean-light/40 p-2.5 rounded-xl border border-border-marine flex items-center justify-between">
          <div>
            <span className="text-[9px] text-text-muted block">PROTECTED SHORE</span>
            <span className="text-base font-extrabold text-status-success">{stats.totalProtectedKm} km</span>
          </div>
          <span className="text-[10px] font-bold text-text-secondary">of 20.2 km</span>
        </div>

        <div className="bg-ocean-light/40 p-2.5 rounded-xl border border-border-marine flex items-center justify-between">
          <div>
            <span className="text-[9px] text-text-muted block">CRITICAL UNPROTECTED</span>
            <span className={`text-base font-extrabold ${stats.unprotectedCount > 0 ? 'text-status-danger' : 'text-status-success'}`}>
              {stats.unprotectedCount} Sectors
            </span>
          </div>
          <AlertTriangle className={`w-4 h-4 ${stats.unprotectedCount > 0 ? 'text-status-danger' : 'text-status-success'}`} />
        </div>

        <div className="sm:col-span-2 bg-ocean-light/40 p-2.5 rounded-xl border border-border-marine flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-ocean-navy uppercase">Total Ecological Defense Coverage</span>
            <span className="font-bold text-ocean">{stats.coveragePercent}% Secured</span>
          </div>
          <div className="w-full bg-border-marine/60 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                stats.coveragePercent >= 80 ? 'bg-status-success' : stats.coveragePercent >= 50 ? 'bg-status-warning' : 'bg-status-danger'
              }`}
              style={{ width: `${stats.coveragePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Shoreline Sectors Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase bg-ocean-light/50 text-text-secondary border-y border-border-marine">
            <tr>
              <th className="py-2 px-2.5">Coastal Sector / Habitat</th>
              <th className="py-2 px-2 text-center">ESI Rank</th>
              <th className="py-2 px-2">Priority Tier</th>
              <th className="py-2 px-2">Recommended Defensive Strategy</th>
              <th className="py-2 px-2 text-right">Defense Status (Click to Toggle)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {sectors.map((sec) => {
              const currentStatusObj = STATUS_TYPES.find(s => s.label === sec.status) || STATUS_TYPES[0];
              return (
                <tr key={sec.id} className="hover:bg-ocean-light/20 transition-colors">
                  <td className="py-2.5 px-2.5">
                    <div className="font-bold text-ocean-navy text-xs">{sec.name}</div>
                    <span className="text-[10px] text-text-secondary font-sans">{sec.habitat} ({sec.lengthKm} km)</span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-md font-mono font-extrabold text-[11px] ${
                      sec.esiScore >= 9 ? 'bg-red-500 text-white' : sec.esiScore >= 7 ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      ESI {sec.esiScore}
                    </span>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${sec.priorityBadge}`}>
                      {sec.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-[11px] text-text-primary font-sans max-w-xs">
                    {sec.recommendedTactic}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={() => toggleSectorStatus(sec.id, sec.status)}
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all hover:scale-105 active:scale-95 shadow-sm ${currentStatusObj.color}`}
                    >
                      ● {sec.status}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

