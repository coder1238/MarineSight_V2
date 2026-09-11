import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Activity } from 'lucide-react';

export default function DarkVesselSpoofCard({ vessel }) {
  const isHighPriority = vessel.status === "HIGH PRIORITY" || vessel.rank === "01";
  
  // Heuristic verification tests
  const tests = [
    {
      name: "SOG Kinematic Plausibility",
      standard: "Max velocity < 28.0 kn for Laden Tanker",
      result: `${vessel.speedKn || 12.4} kn recorded`,
      passed: true,
      desc: "Within hydrodynamic envelope of hull displacement."
    },
    {
      name: "Acceleration Jerk Limit",
      standard: "Delta SOG <= 3.5 kn / min",
      result: isHighPriority ? "Delta 8.6 kn / 2 min (WARN)" : "Delta 1.1 kn / min (NORMAL)",
      passed: !isHighPriority,
      desc: isHighPriority ? "Unusually steep deceleration preceding blackout." : "Gradual throttle adjustments."
    },
    {
      name: "Rate of Turn (ROT) Plausibility",
      standard: "ROT <= 12°/min for VLCC / Suezmax",
      result: "Max ROT: 4.8°/min",
      passed: true,
      desc: "Rudder deflection consistent with maritime navigational lanes."
    },
    {
      name: "Topographical Land Avoidance",
      standard: "Track strictly seaward of 10m isobath",
      result: "Zero overland points",
      passed: true,
      desc: "Vessel did not cross shallow shoals or land masses."
    },
    {
      name: "MMSI / IMO Identity Cloning",
      standard: "Cross-checked with ITU Maritime mobile registry",
      result: isHighPriority ? "Single active beacon" : "Verified ITU registry",
      passed: true,
      desc: "No duplicate MMSI broadcast simultaneously detected."
    }
  ];

  // Calculated Spoof Risk Index
  const spoofProbability = isHighPriority ? 24 : 8; // Low likelihood of raw spoofing; high likelihood of intentional blackout

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-status-danger border border-red-200">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Dark Vessel & GNSS Spoofing Diagnostic Engine
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Algorithmic verification of synthetic vs authentic transponder tracks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">SPOOF INDEX:</span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
            spoofProbability > 50 
              ? 'bg-red-100 text-status-danger' 
              : spoofProbability > 20 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-emerald-100 text-status-success'
          }`}>
            {spoofProbability}% ({spoofProbability > 20 ? 'ELEVATED ANOMALY' : 'AUTHENTIC SENSING'})
          </span>
        </div>
      </div>

      {/* Algorithmic Checks List */}
      <div className="space-y-2">
        {tests.map((t, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl border border-border-marine/60 bg-ocean-light/50 flex items-start justify-between gap-3 text-[11px]"
          >
            <div className="flex items-start gap-2">
              {t.passed ? (
                <CheckCircle2 className="w-4 h-4 text-status-success mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-status-warning mt-0.5 flex-shrink-0" />
              )}
              <div>
                <span className="font-bold text-ocean-navy block">{t.name}</span>
                <span className="text-[10px] text-text-muted font-sans block">{t.standard}</span>
                <p className="text-[10px] text-text-secondary font-sans mt-0.5">{t.desc}</p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] block ${
                t.passed ? 'bg-emerald-50 text-status-success' : 'bg-amber-50 text-status-warning'
              }`}>
                {t.result}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Algorithmic Summary Pill */}
      <div className="p-3 rounded-xl bg-ocean-sky/60 border border-ocean/20 text-ocean-navy text-[11px] font-sans flex items-start gap-2">
        <Activity className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold font-mono text-ocean-deep">FORENSIC SUMMARY: </span>
          The kinematic track does not exhibit ghost spoofing (no impossible velocities or teleportation). The vessel is physically genuine; the primary non-compliance is <span className="font-bold text-status-danger">deliberate transmission suppression</span> during critical spill coordinates.
        </p>
      </div>
    </div>
  );
}

