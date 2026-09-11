import React from 'react';
import { Ship, Radio, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Cpu, Wifi } from 'lucide-react';

export default function VesselSelectorBar({
  vessels = [],
  selectedVessel,
  onSelectVessel,
  sensorSync = { status: "OPTIMAL", driftMs: 14, spoofingRisk: "NONE (0.02%)", satellitesLocked: 18 }
}) {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Top Bar: Sensor Synchronization & GPS Anti-Spoofing Status (Feature 19) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border-marine text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-success"></span>
          </span>
          <span className="font-bold text-ocean-navy uppercase">GNSS / AIS SENSOR TELEMETRY SYNC:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-status-success font-bold text-[10px] border border-emerald-200">
            {sensorSync.status} ({sensorSync.driftMs}ms jitter)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <Cpu className="w-3.5 h-3.5 text-ocean" />
            <span>Cryptographic Satellites: <strong className="text-ocean-navy">{sensorSync.satellitesLocked} Constellation Feeds</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary">
            <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
            <span>GPS Spoofing Threat: <strong className="text-status-success">{sensorSync.spoofingRisk}</strong></span>
          </div>
        </div>
      </div>

      {/* Candidate Vessel Switcher (Feature 1) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-ocean" />
            <span className="text-xs font-bold text-ocean-navy uppercase font-mono">
              Attribution Target Selector ({vessels.length} Candidate Vessels in Corridor)
            </span>
          </div>
          <span className="text-[11px] text-text-muted font-mono">
            Click to re-target Forensic Evidence Matrix & Risk Scoring
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {vessels.map((v, idx) => {
            const isSelected = selectedVessel?.mmsi === v.mmsi;
            const score = v.priorityScore || 85;
            return (
              <button
                key={v.mmsi || idx}
                onClick={() => onSelectVessel(v)}
                className={`text-left p-2.5 rounded-xl border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-ocean-sky/40 border-ocean ring-2 ring-ocean/30 shadow-marine-sm'
                    : 'bg-white hover:bg-ocean-light/50 border-border-marine hover:border-ocean/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-text-muted">#{idx + 1}</span>
                      <h4 className="text-xs font-extrabold text-ocean-navy truncate">{v.name}</h4>
                    </div>
                    <p className="text-[10px] text-text-secondary font-mono mt-0.5">
                      MMSI: {v.mmsi} · {v.type || "Tanker"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-[9px] font-mono text-text-muted uppercase block">Score</span>
                    <span className={`text-xs font-mono font-extrabold ${
                      score >= 85 ? 'text-status-danger' : score >= 70 ? 'text-status-warning' : 'text-status-success'
                    }`}>
                      {score}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-border-marine/60">
                  <span className="text-text-muted">{v.flag || "Flagged"}</span>
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                    score >= 85 ? 'bg-red-50 text-status-danger' : score >= 70 ? 'bg-amber-50 text-status-warning' : 'bg-slate-100 text-text-secondary'
                  }`}>
                    {v.status || (score >= 85 ? "HIGH SUSPECT" : "EVALUATING")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

