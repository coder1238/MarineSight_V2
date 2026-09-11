import React, { useState, useMemo } from 'react';
import { 
  Ship, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Anchor, 
  Compass, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function SuspectVesselsTable({
  vessels = [],
  selectedVesselId,
  onSelectVessel,
  onNavigateToIntel
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSuspicion, setFilterSuspicion] = useState('all'); // 'all', 'high', 'foc'
  const [sortBy, setSortBy] = useState('suspicion'); // 'suspicion', 'cpa', 'darkgap'

  // Default rich mock vessels if none provided
  const candidateVessels = useMemo(() => {
    if (vessels && vessels.length > 0) return vessels;
    return [
      {
        id: "vessel-1",
        name: "MV OCEAN STAR",
        mmsi: "419001248",
        imo: "9876543",
        type: "Crude Oil Tanker (VLCC)",
        flag: "India",
        flagEmoji: "🇮🇳",
        isFoc: false,
        cpaDistanceNm: 1.4,
        cpaTimestamp: "T-39.5h (03 Sep 22:15 UTC)",
        speedInZoneKn: 6.2, // normal cruise 14.5
        normalSpeedKn: 14.2,
        speedDropPercent: 56,
        darkGapHours: 4.5,
        headingDeg: 284,
        suspicionScore: 94,
        status: "PRIMARY SUSPECT",
        anomalies: ["AIS Signal Blackout", "Speed Drop >50%", "Sharp Course Deviation", "Nighttime Transit"]
      },
      {
        id: "vessel-2",
        name: "MT HORIZON GLORY",
        mmsi: "354128000",
        imo: "9451122",
        type: "Chemical/Oil Products Tanker",
        flag: "Panama",
        flagEmoji: "🇵🇦",
        isFoc: true,
        cpaDistanceNm: 3.8,
        cpaTimestamp: "T-41.2h (03 Sep 20:30 UTC)",
        speedInZoneKn: 8.1,
        normalSpeedKn: 13.0,
        speedDropPercent: 37,
        darkGapHours: 2.1,
        headingDeg: 142,
        suspicionScore: 78,
        status: "ELEVATED CONCERN",
        anomalies: ["Flag of Convenience", "Speed Deceleration", "AIS Intermittent"]
      },
      {
        id: "vessel-3",
        name: "STENA POLARIS",
        mmsi: "636019988",
        imo: "9317987",
        type: "Product Tanker (MR2)",
        flag: "Liberia",
        flagEmoji: "🇱🇷",
        isFoc: true,
        cpaDistanceNm: 5.6,
        cpaTimestamp: "T-37.8h (04 Sep 00:10 UTC)",
        speedInZoneKn: 12.0,
        normalSpeedKn: 13.5,
        speedDropPercent: 11,
        darkGapHours: 0.8,
        headingDeg: 310,
        suspicionScore: 61,
        status: "MONITORED",
        anomalies: ["Flag of Convenience", "Minor Course Alteration"]
      },
      {
        id: "vessel-4",
        name: "BALTIC MARINER",
        mmsi: "538008891",
        imo: "9612345",
        type: "Capesize Bulk Carrier",
        flag: "Marshall Islands",
        flagEmoji: "🇲🇭",
        isFoc: true,
        cpaDistanceNm: 7.2,
        cpaTimestamp: "T-44.0h (03 Sep 17:45 UTC)",
        speedInZoneKn: 11.8,
        normalSpeedKn: 12.1,
        speedDropPercent: 2,
        darkGapHours: 0.0,
        headingDeg: 175,
        suspicionScore: 35,
        status: "LOW PROBABILITY",
        anomalies: ["Bulk Cargo Type Inconsistent"]
      },
      {
        id: "vessel-5",
        name: "MSC ARIANE",
        mmsi: "255806000",
        imo: "9781234",
        type: "Ultra Large Container Vessel",
        flag: "Portugal",
        flagEmoji: "🇵🇹",
        isFoc: false,
        cpaDistanceNm: 8.9,
        cpaTimestamp: "T-35.0h (04 Sep 03:00 UTC)",
        speedInZoneKn: 19.4,
        normalSpeedKn: 19.5,
        speedDropPercent: 0,
        darkGapHours: 0.0,
        headingDeg: 295,
        suspicionScore: 18,
        status: "EXONERATED",
        anomalies: ["Transit High Speed", "Continuous AIS"]
      },
      {
        id: "vessel-6",
        name: "AL-JABER TANKER",
        mmsi: "470992000",
        imo: "9218811",
        type: "Bunkering Tanker",
        flag: "UAE",
        flagEmoji: "🇦🇪",
        isFoc: false,
        cpaDistanceNm: 6.4,
        cpaTimestamp: "T-42.5h (03 Sep 19:15 UTC)",
        speedInZoneKn: 7.5,
        normalSpeedKn: 11.0,
        speedDropPercent: 31,
        darkGapHours: 3.2,
        headingDeg: 45,
        suspicionScore: 72,
        status: "ELEVATED CONCERN",
        anomalies: ["Loitering Pattern", "AIS Dark Gap 3.2h"]
      }
    ];
  }, [vessels]);

  const filteredVessels = useMemo(() => {
    return candidateVessels.filter(v => {
      const q = searchQuery.toLowerCase();
      const matchQuery = !q || 
        v.name.toLowerCase().includes(q) || 
        v.mmsi.includes(q) || 
        v.imo.includes(q) ||
        v.flag.toLowerCase().includes(q);

      if (!matchQuery) return false;

      if (filterSuspicion === 'high') return v.suspicionScore >= 70;
      if (filterSuspicion === 'foc') return v.isFoc;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'suspicion') return b.suspicionScore - a.suspicionScore;
      if (sortBy === 'cpa') return a.cpaDistanceNm - b.cpaDistanceNm;
      if (sortBy === 'darkgap') return b.darkGapHours - a.darkGapHours;
      return 0;
    });
  }, [candidateVessels, searchQuery, filterSuspicion, sortBy]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-ocean" />
          <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
            AIS Correlated Vessels in Origin Envelope ({filteredVessels.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search vessel, MMSI, IMO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs border border-border-marine rounded-xl bg-ocean-light/40 focus:outline-none focus:border-ocean text-ocean-navy w-44"
            />
          </div>

          {/* Quick Filter */}
          <div className="flex items-center bg-ocean-light rounded-xl p-0.5 border border-border-marine text-[11px] font-bold">
            <button
              onClick={() => setFilterSuspicion('all')}
              className={`px-2 py-0.5 rounded-lg transition-all ${filterSuspicion === 'all' ? 'bg-white text-ocean shadow-xs' : 'text-text-muted'}`}
            >
              All ({candidateVessels.length})
            </button>
            <button
              onClick={() => setFilterSuspicion('high')}
              className={`px-2 py-0.5 rounded-lg transition-all ${filterSuspicion === 'high' ? 'bg-white text-rose-600 shadow-xs' : 'text-text-muted'}`}
            >
              High Suspicion
            </button>
            <button
              onClick={() => setFilterSuspicion('foc')}
              className={`px-2 py-0.5 rounded-lg transition-all ${filterSuspicion === 'foc' ? 'bg-white text-amber-600 shadow-xs' : 'text-text-muted'}`}
            >
              FOC Flags
            </button>
          </div>
        </div>
      </div>

      {/* Vessels List / Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-border-marine text-text-muted text-[10px] uppercase">
              <th className="pb-2 font-bold">Vessel / Identifier</th>
              <th className="pb-2 font-bold">Closest Approach (CPA)</th>
              <th className="pb-2 font-bold">Speed Anomaly</th>
              <th className="pb-2 font-bold">AIS Dark Gap</th>
              <th className="pb-2 font-bold">Forensic Anomalies</th>
              <th className="pb-2 font-bold text-right">Suspicion Index</th>
              <th className="pb-2 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {filteredVessels.map((v) => {
              const isSelected = selectedVesselId === v.id;
              const isHigh = v.suspicionScore >= 80;
              const isMedium = v.suspicionScore >= 50 && v.suspicionScore < 80;

              return (
                <tr
                  key={v.id}
                  onClick={() => onSelectVessel && onSelectVessel(v)}
                  className={`hover:bg-ocean-light/60 transition-colors cursor-pointer ${
                    isSelected ? 'bg-ocean-sky/40 border-l-4 border-l-ocean' : ''
                  }`}
                >
                  {/* Vessel Name & MMSI */}
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-1.5 font-sans font-bold text-ocean-navy text-xs">
                      <span>{v.flagEmoji}</span>
                      <span>{v.name}</span>
                      {v.isFoc && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          FOC
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      MMSI: {v.mmsi} · IMO: {v.imo} · {v.type}
                    </div>
                  </td>

                  {/* CPA */}
                  <td className="py-2.5 pr-2">
                    <div className="font-bold text-ocean-deep">{v.cpaDistanceNm} NM</div>
                    <div className="text-[10px] text-text-muted">{v.cpaTimestamp}</div>
                  </td>

                  {/* Speed Anomaly */}
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-ocean-navy">{v.speedInZoneKn} kn</span>
                      {v.speedDropPercent > 25 ? (
                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                          -{v.speedDropPercent}% drop
                        </span>
                      ) : (
                        <span className="text-[9px] text-text-muted font-normal">
                          (norm {v.normalSpeedKn})
                        </span>
                      )}
                    </div>
                  </td>

                  {/* AIS Dark Gap */}
                  <td className="py-2.5 pr-2">
                    {v.darkGapHours > 0 ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Clock className="w-3 h-3" />
                        {v.darkGapHours}h Gap
                      </span>
                    ) : (
                      <span className="text-text-muted text-[10px]">Continuous</span>
                    )}
                  </td>

                  {/* Anomalies Badges */}
                  <td className="py-2.5 pr-2">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {v.anomalies.map((anom, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap"
                        >
                          {anom}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Suspicion Score */}
                  <td className="py-2.5 pr-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${v.suspicionScore}%` }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-extrabold ${
                          isHigh ? 'text-rose-600' : isMedium ? 'text-amber-600' : 'text-slate-500'
                        }`}
                      >
                        {v.suspicionScore}%
                      </span>
                    </div>
                    <span className="text-[9px] text-text-muted block">{v.status}</span>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 text-right font-sans">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToIntel && onNavigateToIntel(v);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-ocean/10 hover:bg-ocean text-ocean hover:text-white text-[11px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3 h-3" />
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
