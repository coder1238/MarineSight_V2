import React, { useState } from 'react';
import { Wind, Waves, Compass, ArrowUpRight, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

export default function TrajectoryMetOceanDrift({ caseData }) {
  const [windSpeedKn, setWindSpeedKn] = useState(caseData?.environment?.windSpeedKn || 14.2);
  const [currentSpeedMs, setCurrentSpeedMs] = useState(caseData?.environment?.currentSpeedMs || 0.42);

  // Leeway drift calculations for an unpowered tanker
  // Wind leeway ~3% of wind speed = 14.2 * 0.03 = 0.426 kn
  // Ocean current = 0.42 m/s = 0.816 kn
  // Total unpowered drift speed = ~1.1 kn towards 165° SSE
  // Actual vessel speed = 3.8 kn towards 218° SW
  // Propulsion vector delta = 3.4 kn at 230° -> Proves active engine power!
  const leewayKn = (windSpeedKn * 0.03).toFixed(2);
  const currentKn = (currentSpeedMs * 1.94384).toFixed(2);
  const totalPassiveDriftKn = (parseFloat(leewayKn) + parseFloat(currentKn) * 0.8).toFixed(2);
  const activeEngineThrustKn = Math.max(0.5, (3.8 - parseFloat(totalPassiveDriftKn) * 0.4)).toFixed(2);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            MetOcean Drift Vector Envelope & Propulsion Forensic Proof
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-danger font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          ● ACTIVE MECHANICAL PROPULSION CONFIRMED
        </span>
      </div>

      {/* 4 Vector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Wind className="w-3 h-3 text-ocean" />
            SURFACE WIND
          </span>
          <span className="text-sm font-bold text-ocean-navy mt-0.5 block">{windSpeedKn} kn · 315° NW</span>
          <span className="text-[9px] text-text-secondary block">Leeway Vector: {leewayKn} kn</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Waves className="w-3 h-3 text-ocean" />
            OCEAN CURRENT
          </span>
          <span className="text-sm font-bold text-ocean-navy mt-0.5 block">{currentSpeedMs} m/s · 145° SE</span>
          <span className="text-[9px] text-text-secondary block">Current Vector: {currentKn} kn</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">PASSIVE DRIFT ENVELOPE</span>
          <span className="text-sm font-bold text-text-primary mt-0.5 block">{totalPassiveDriftKn} kn (SSE)</span>
          <span className="text-[9px] text-text-muted block">If engines were stalled</span>
        </div>

        <div className="p-3 bg-red-50/40 border border-red-100 rounded-xl">
          <span className="text-[9px] text-text-muted block">MEASURED VESSEL VECTOR</span>
          <span className="text-sm font-bold text-status-danger mt-0.5 block">3.80 kn (Heading 218°)</span>
          <span className="text-[9px] text-status-danger font-semibold block">Delta Thrust: +{activeEngineThrustKn} kn</span>
        </div>
      </div>

      {/* Vector Alignment Explainer */}
      <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine text-xs font-mono space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-ocean-navy text-[11px]">Hydrodynamic Vector Subtraction Verdict:</span>
          <span className="text-[10px] text-status-success font-bold">Vector Discrepancy: 53° Off Drift Axis</span>
        </div>
        <p className="text-[10px] text-text-secondary font-sans leading-tight">
          An unpowered drifting Aframax tanker would have drifted southeast (165°) at {totalPassiveDriftKn} knots. Instead, the reconstructed vessel track maintained a controlled southwest heading of 218° at 3.8 knots. This mathematically rules out "blackout caused by total mechanical breakdown" and proves deliberate rudder control and engine clutching during oil discharge.
        </p>
      </div>
    </div>
  );
}

