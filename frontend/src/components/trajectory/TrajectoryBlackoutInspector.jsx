import React from 'react';
import { ShieldAlert, Radio, AlertOctagon, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { SUSPECT_VESSELS } from './trajectoryData';

export default function TrajectoryBlackoutInspector({ vesselId = "v1" }) {
  const vessel = SUSPECT_VESSELS.find(v => v.id === vesselId) || SUSPECT_VESSELS[0];

  const blackoutFactors = [
    { label: "Intentional Transponder Power Shutoff", prob: 94, risk: "CRITICAL", desc: "Abrupt DC supply disconnection to Class A transponder unit" },
    { label: "RF Cable / Antenna Coaxial Shielding", prob: 18, risk: "LOW", desc: "No VSWR impedance alarm recorded prior to silence" },
    { label: "Tropospheric Propagation Ducting Fade", prob: 6, risk: "NEGLIGIBLE", desc: "Adjacent 24 vessels experienced zero signal degradation" },
    { label: "VHF Interference / Channel 87B Congestion", prob: 4, risk: "NEGLIGIBLE", desc: "VHF time slots were <22% occupied across Sector 4" }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            AIS Blackout & Transponder Silence Forensic Deep-Dive
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-danger font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          ● DELIBERATE TAMPERING PROBABILITY: 94%
        </span>
      </div>

      {/* 4 Quantitative Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
          <span className="text-[9px] text-text-muted block">TRANSPONDER SILENCE</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">{vessel.blackoutDurationMin} Minutes</span>
          <span className="text-[9px] text-text-secondary block">22:24 UTC → 23:02 UTC</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">MISSING ITU-R PINGS</span>
          <span className="text-xl font-bold text-ocean-navy mt-0.5 block">{vessel.missingPings} Messages</span>
          <span className="text-[9px] text-text-secondary block">Mandated every 10 sec</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">DARK DISTANCE TRANSITED</span>
          <span className="text-xl font-bold text-ocean mt-0.5 block">2.41 nm</span>
          <span className="text-[9px] text-text-secondary block">Average 3.81 kn speed</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">LEGAL COMPLIANCE</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">NON-COMPLIANT</span>
          <span className="text-[9px] text-status-danger block">SOLAS V/19.2.4 Violation</span>
        </div>
      </div>

      {/* Forensic Causal Factor Probabilities */}
      <div className="space-y-2.5 font-mono text-xs">
        <span className="text-[10px] font-bold text-ocean-navy uppercase block pb-1 border-b border-border-marine">
          Hypothesis Probability Decomposition:
        </span>

        {blackoutFactors.map((f, idx) => (
          <div key={idx} className="p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-ocean-navy">{f.label}</span>
              <span className={`font-bold ${f.prob > 50 ? 'text-status-danger' : 'text-text-muted'}`}>
                {f.prob}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full ${f.prob > 50 ? 'bg-status-danger' : 'bg-ocean'}`}
                style={{ width: `${f.prob}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-text-secondary font-sans leading-tight">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

