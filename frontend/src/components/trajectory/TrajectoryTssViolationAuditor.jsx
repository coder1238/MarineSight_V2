import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Compass, FileCheck, Scale } from 'lucide-react';

export const TSS_VIOLATIONS = [
  {
    rule: "COLREGs Rule 10(b)(i)",
    title: "Failure to Proceed in Designated Traffic Lane",
    severity: "CRITICAL",
    detail: "Vessel departed outbound lane 284° heading and cut across into the Inshore Traffic Zone (ITZ) without prior VTS clearance.",
    penalty: "Class A Maritime Infraction (Up to $250,000 fine + vessel detention)"
  },
  {
    rule: "COLREGs Rule 10(c)",
    title: "Improper Lane Crossing Angle",
    severity: "HIGH",
    detail: "Crossed inbound traffic boundary at an acute angle of 42° instead of the mandated 90° right angle.",
    penalty: "Statutory Negligence Citation under Port State Control"
  },
  {
    rule: "COLREGs Rule 10(h)",
    title: "Unauthorized Loitering in Separation Zone",
    severity: "CRITICAL",
    detail: "Decelerated from 12.8 kn to 4.2 kn and remained in the buffer zone for 38 minutes without broadcasting a PAN-PAN or MAYDAY.",
    penalty: "Failure to Maintain Safe Navigation & Environmental Endangerment"
  }
];

export default function TrajectoryTssViolationAuditor() {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            TSS (Traffic Separation Scheme) Lane Violation & COLREGs Audit
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-danger font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          ● 3 STATUTORY INFRACTIONS DETECTED
        </span>
      </div>

      {/* Violations List */}
      <div className="space-y-2 font-mono text-xs">
        {TSS_VIOLATIONS.map((v, idx) => (
          <div key={idx} className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-status-danger text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-status-danger" />
                {v.rule}: {v.title}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-status-danger border border-red-200">
                {v.severity}
              </span>
            </div>
            <p className="text-[10px] text-text-secondary font-sans leading-tight">
              {v.detail}
            </p>
            <div className="pt-1 text-[9px] text-ocean flex items-center gap-1">
              <span className="font-bold">Statutory Consequence:</span>
              <span>{v.penalty}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

