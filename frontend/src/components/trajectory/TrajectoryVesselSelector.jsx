import React from 'react';
import { Ship, ShieldAlert, CheckCircle2, ChevronRight, Eye, Layers } from 'lucide-react';
import { SUSPECT_VESSELS } from './trajectoryData';

export default function TrajectoryVesselSelector({ 
  selectedVesselId, 
  onSelectVessel, 
  showGhostOverlay, 
  onToggleGhostOverlay 
}) {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-ocean" />
          <h2 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Candidate Suspect Vessel Selector & Multi-Track Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-text-secondary">
            <input 
              type="checkbox" 
              checked={showGhostOverlay} 
              onChange={(e) => onToggleGhostOverlay(e.target.checked)}
              className="rounded text-ocean focus:ring-ocean w-3.5 h-3.5"
            />
            <span className="font-mono text-[11px] flex items-center gap-1">
              <Layers className="w-3 h-3 text-ocean" />
              Ghost Overlay All 4 Tracks
            </span>
          </label>
        </div>
      </div>

      {/* Grid of Candidate Vessels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SUSPECT_VESSELS.map((v) => {
          const isSelected = v.id === selectedVesselId;
          return (
            <div
              key={v.id}
              onClick={() => onSelectVessel(v.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-ocean bg-ocean-sky/40 shadow-marine-md ring-1 ring-ocean/30'
                  : 'border-border-marine bg-white hover:border-ocean/50 hover:bg-ocean-light/30'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-ocean-navy tracking-tight">{v.name}</span>
                    {v.id === "v1" && (
                      <span className="w-2 h-2 rounded-full bg-status-danger animate-ping"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted font-mono block">
                    MMSI: {v.mmsi} · {v.flag}
                  </span>
                </div>
                <span 
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono border ${
                    v.riskScore >= 80 
                      ? 'bg-red-50 text-status-danger border-red-200' 
                      : v.riskScore >= 50 
                        ? 'bg-amber-50 text-status-warning border-amber-200' 
                        : 'bg-emerald-50 text-status-success border-emerald-200'
                  }`}
                >
                  {v.riskScore}/100
                </span>
              </div>

              {/* Type and Cargo */}
              <p className="text-[10px] text-text-secondary truncate mb-2">
                {v.type} ({Math.round(v.dwt / 1000)}k DWT)
              </p>

              {/* Micro Metrics Strip */}
              <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-border-marine/60 text-[10px] font-mono">
                <div className="bg-white/80 p-1 rounded border border-border-marine/40">
                  <span className="text-[8px] text-text-muted block">GAP DURATION</span>
                  <span className={`font-bold ${v.blackoutDurationMin > 0 ? 'text-status-danger' : 'text-text-primary'}`}>
                    {v.blackoutDurationMin > 0 ? `${v.blackoutDurationMin}m` : 'None'}
                  </span>
                </div>
                <div className="bg-white/80 p-1 rounded border border-border-marine/40">
                  <span className="text-[8px] text-text-muted block">SPIL CPA</span>
                  <span className={`font-bold ${v.spillCpaNm <= 2 ? 'text-status-danger' : 'text-text-primary'}`}>
                    {v.spillCpaNm} nm
                  </span>
                </div>
                <div className="bg-white/80 p-1 rounded border border-border-marine/40">
                  <span className="text-[8px] text-text-muted block">SPEED DROP</span>
                  <span className={`font-bold ${v.speedDropPercent > 50 ? 'text-status-danger' : 'text-text-primary'}`}>
                    -{v.speedDropPercent}%
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ocean" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

