import React, { useState } from 'react';
import { HelpCircle, Compass, Fuel, Clock, CheckCircle2, AlertOctagon, Scale } from 'lucide-react';

export const WHAT_IF_HYPOTHESES = [
  {
    id: "north_bypass",
    title: "Hypothesis A: Northern Deep-Water Fairway Bypass",
    desc: "Vessel claims it steered 8 nautical miles north to avoid fishing traffic, bypassing Spill Zone A entirely.",
    distanceDeltaNm: "+9.4 nm",
    extraFuelTons: "+3.8 MT",
    etaDeltaMin: "+42 min",
    feasibilityScore: 12,
    verdict: "REFUTED BY RADAR",
    verdictColor: "text-status-danger bg-red-50 border-red-200",
    reason: "Goa Coastal Radar Station (Station #04) maintained continuous 12nm radar paint that confirms vessel stayed in southern sector."
  },
  {
    id: "maintain_speed",
    title: "Hypothesis B: Steady 13.2 kn Transit Without Deceleration",
    desc: "Defense argues vessel never dropped speed to 4.2 kn and that AIS transponder simply failed due to fuse blown.",
    distanceDeltaNm: "+0.0 nm",
    extraFuelTons: "-1.2 MT",
    etaDeltaMin: "-38 min",
    feasibilityScore: 6,
    verdict: "REFUTED BY TIME-DISTANCE MATH",
    verdictColor: "text-status-danger bg-red-50 border-red-200",
    reason: "If vessel maintained 13.2 kn, it would have arrived at 23:02 re-emergence point at 22:38, creating an irreconcilable 24-minute spatial teleportation gap."
  },
  {
    id: "tidal_loiter",
    title: "Hypothesis C: Temporary Drift Due to Adverse Tidal Current",
    desc: "Claim that strong 4-knot opposing tide forced vessel to drop speed and drift.",
    distanceDeltaNm: "-1.8 nm",
    extraFuelTons: "-0.5 MT",
    etaDeltaMin: "+18 min",
    feasibilityScore: 18,
    verdict: "REFUTED BY CMEMS OCEAN DATA",
    verdictColor: "text-status-danger bg-red-50 border-red-200",
    reason: "CMEMS and INCOIS hydrographic buoys recorded tidal current of only 0.42 m/s (0.8 kn) flowing southeast, rendering this claim physically impossible."
  }
];

export default function TrajectoryWhatIfSandbox() {
  const [selectedHypothesisId, setSelectedHypothesisId] = useState("north_bypass");

  const activeHypothesis = WHAT_IF_HYPOTHESES.find(h => h.id === selectedHypothesisId) || WHAT_IF_HYPOTHESES[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Counterfactual "What-If" Defense Sandbox
          </h3>
        </div>
        <span className="text-[10px] font-mono text-ocean font-bold bg-ocean-sky px-2 py-0.5 rounded border border-ocean/20">
          LEGAL DEFENSE REFUTATION ENGINE
        </span>
      </div>

      {/* Hypothesis Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
        {WHAT_IF_HYPOTHESES.map((h) => {
          const isSelected = h.id === selectedHypothesisId;
          return (
            <button
              key={h.id}
              onClick={() => setSelectedHypothesisId(h.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-ocean-sky border-ocean text-ocean-navy shadow-xs ring-1 ring-ocean/30'
                  : 'bg-ocean-light/50 border-border-marine text-text-secondary hover:bg-white hover:border-ocean/40'
              }`}
            >
              <span className="text-[11px] font-bold block text-ocean-navy mb-0.5 truncate">{h.title.split(':')[0]}</span>
              <span className="text-[9px] text-text-muted block line-clamp-2 font-sans">{h.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Active Hypothesis Analysis & Verdict */}
      <div className="p-3 bg-ocean-light rounded-xl border border-border-marine space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-ocean-navy text-[11px] uppercase">
            {activeHypothesis.title}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${activeHypothesis.verdictColor}`}>
            ● {activeHypothesis.verdict}
          </span>
        </div>

        {/* 3 Kinematic Penalties */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-2 bg-white rounded-lg border border-border-marine">
            <span className="text-text-muted block text-[9px]">DISTANCE PENALTY</span>
            <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">{activeHypothesis.distanceDeltaNm}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-border-marine">
            <span className="text-text-muted block text-[9px]">EXTRA BUNKER FUEL</span>
            <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">{activeHypothesis.extraFuelTons}</span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-border-marine">
            <span className="text-text-muted block text-[9px]">VOYAGE TIME DELAY</span>
            <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">{activeHypothesis.etaDeltaMin}</span>
          </div>
        </div>

        {/* Forensic Refutation Reason */}
        <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-status-danger text-[11px] flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 shrink-0 text-status-danger mt-0.5" />
          <p className="font-sans leading-tight">
            <strong>Forensic Refutation:</strong> {activeHypothesis.reason}
          </p>
        </div>
      </div>
    </div>
  );
}

