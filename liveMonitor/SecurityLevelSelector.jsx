import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Shield, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function SecurityLevelSelector({ level = "ISPS_2", onSelectLevel }) {
  const [showChecklist, setShowChecklist] = useState(false);

  const levels = {
    "ISPS_1": {
      label: "ISPS LEVEL 1",
      badge: "bg-emerald-50 text-status-success border-emerald-300",
      posture: "Normal Baseline Surveillance",
      sop: [
        "Continuous 360° X-band coastal radar sweep active",
        "Passive AIS transponder reception and track logging",
        "VHF Marine Channel 16 / 70 DSC automated listening watch"
      ]
    },
    "ISPS_2": {
      label: "ISPS LEVEL 2",
      badge: "bg-amber-50 text-status-warning border-amber-300",
      posture: "Heightened Security & Gap Tracking",
      sop: [
        "Kinematic filter armed for dark vessels and AIS blackout gaps",
        "Mandatory verbal VHF radio identification for high-priority targets",
        "Notice of Marine Pollution Anomaly forwarded to Coast Guard MRCC",
        "High-readiness standby for Fast Patrol Vessel (FPV) interceptors"
      ]
    },
    "ISPS_3": {
      label: "ISPS LEVEL 3",
      badge: "bg-red-50 text-status-danger border-red-300",
      posture: "Tactical Interception & Containment",
      sop: [
        "Tactical boarding and seizure directive authorized under MARPOL",
        "Fast patrol cutter interception vector engaged with blue flashing strobes",
        "Containment booms and oil recovery skimmers dispatched to slick coordinates",
        "Port State Control pre-detention alert issued to destination harbor"
      ]
    }
  };

  const current = levels[level] || levels["ISPS_2"];

  return (
    <div className="relative z-30">
      <div className="flex items-center gap-1 bg-white border border-border-marine p-0.5 rounded-xl shadow-marine-sm text-xs font-mono">
        {Object.entries(levels).map(([k, cfg]) => {
          const active = level === k;
          return (
            <button
              key={k}
              onClick={() => onSelectLevel(k)}
              className={`px-2 py-1 rounded-lg font-bold transition-all text-[10px] flex items-center gap-1 ${
                active 
                  ? k === 'ISPS_3' 
                    ? 'bg-status-danger text-white shadow-xs' 
                    : k === 'ISPS_2' 
                    ? 'bg-status-warning text-white shadow-xs' 
                    : 'bg-status-success text-white shadow-xs'
                  : 'text-text-secondary hover:bg-ocean-sky/60'
              }`}
            >
              {k === 'ISPS_3' ? <ShieldAlert className="w-3 h-3" /> : k === 'ISPS_2' ? <Shield className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              <span>{cfg.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="px-1.5 py-1 text-ocean hover:text-ocean-deep hover:bg-ocean-sky rounded-lg transition-colors ml-0.5"
          title="View Standing Operating Procedures (SOP)"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dropdown SOP Checklist */}
      {showChecklist && (
        <div className="absolute top-9 right-0 w-80 bg-white border border-border-marine rounded-2xl shadow-marine-lg p-3 z-[600] animate-fade-in text-xs font-sans">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-border-marine">
            <div className="flex items-center gap-1.5 font-bold text-ocean-navy text-xs">
              <Shield className="w-3.5 h-3.5 text-ocean" />
              <span>{current.label} SOP PROTOCOL</span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full border ${current.badge}`}>
              {current.posture}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-text-muted uppercase block">
              Authorized Operational Directives:
            </span>
            {current.sop.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-ocean-navy leading-tight">
                <CheckCircle className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowChecklist(false)}
            className="w-full mt-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-text-secondary text-[11px] font-semibold text-center"
          >
            Dismiss Directives
          </button>
        </div>
      )}
    </div>
  );
}

