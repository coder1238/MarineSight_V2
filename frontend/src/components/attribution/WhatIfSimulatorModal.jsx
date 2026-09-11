import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  TrendingDown, 
  Zap,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export default function WhatIfSimulatorModal({
  isOpen,
  onClose,
  selectedVessel,
  caseData
}) {
  const v = selectedVessel || caseData?.topVessel || {
    name: "MV Ocean Star",
    priorityScore: 91.4,
    aisGapScore: 92,
    spatialMatch: 94,
    temporalMatch: 91,
    trajectoryMatch: 88
  };

  // Counterfactual scenario state
  const [hasAisGap, setHasAisGap] = useState(true);
  const [hasDeceleration, setHasDeceleration] = useState(true);
  const [timeOffsetHours, setTimeOffsetHours] = useState(0); // -4 to +4 hours
  const [currentSpeedDeltaKn, setCurrentSpeedDeltaKn] = useState(0); // -1.0 to +1.0 kn
  const [vesselTypeRisk, setVesselTypeRisk] = useState('Crude Oil Tanker');

  if (!isOpen) return null;

  // Compute counterfactual score dynamically
  const baseScore = Number(v.priorityScore || 91.4);

  // Penalties or adjustments
  let simulatedScore = baseScore;

  if (!hasAisGap) {
    simulatedScore -= 24.5; // Loss of transponder blackout evidence
  }
  if (!hasDeceleration) {
    simulatedScore -= 12.8; // Loss of kinematic speed trough anomaly
  }
  if (timeOffsetHours !== 0) {
    simulatedScore -= Math.abs(timeOffsetHours) * 4.2; // Temporal mismatch
  }
  if (currentSpeedDeltaKn !== 0) {
    simulatedScore -= Math.abs(currentSpeedDeltaKn) * 6.5; // Drift hindcast misalignment
  }
  if (vesselTypeRisk === 'Container Ship') {
    simulatedScore -= 14.0;
  } else if (vesselTypeRisk === 'Bulk Carrier') {
    simulatedScore -= 8.5;
  }

  simulatedScore = Math.max(15, Math.min(99, Number(simulatedScore.toFixed(1))));
  const scoreDelta = Number((simulatedScore - baseScore).toFixed(1));

  const resetAll = () => {
    setHasAisGap(true);
    setHasDeceleration(true);
    setTimeOffsetHours(0);
    setCurrentSpeedDeltaKn(0);
    setVesselTypeRisk('Crude Oil Tanker');
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-border-marine max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-marine bg-ocean-light/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-ocean-navy">
                  Counterfactual "What-If" Forensic Sandbox
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-ocean/10 text-ocean text-[10px] font-bold font-mono">
                  SENSITIVITY ANALYSIS
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Stress-test evidence weight by altering physical conditions, transponder behaviors, and hydrodynamic drift.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-ocean-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Comparison Score Banner */}
          <div className="grid grid-cols-3 gap-3 bg-ocean-light/40 border border-border-marine rounded-2xl p-4 text-center font-mono">
            <div className="bg-white p-3 rounded-xl border border-border-marine">
              <span className="text-[10px] text-text-muted uppercase block">Actual Evidence Score</span>
              <span className="text-2xl font-extrabold text-status-danger mt-1 block">{baseScore}</span>
              <span className="text-[10px] text-status-danger font-bold mt-0.5 block">CONVERGED FORENSIC</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-border-marine">
              <span className="text-[10px] text-text-muted uppercase block">Counterfactual Score</span>
              <span className="text-2xl font-extrabold text-ocean mt-1 block">{simulatedScore}</span>
              <span className="text-[10px] text-text-secondary mt-0.5 block">SIMULATED SCENARIO</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-border-marine">
              <span className="text-[10px] text-text-muted uppercase block">Attribution Delta</span>
              <span className={`text-2xl font-extrabold mt-1 block ${
                scoreDelta < 0 ? 'text-emerald-600' : scoreDelta > 0 ? 'text-status-danger' : 'text-slate-500'
              }`}>
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
              </span>
              <span className="text-[10px] text-text-muted mt-0.5 block">Points Differential</span>
            </div>
          </div>

          {/* Interactive Condition Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <span className="text-xs font-bold text-ocean-navy uppercase font-mono">
                Counterfactual Variables
              </span>
              <button
                onClick={resetAll}
                className="text-[11px] text-ocean hover:underline flex items-center gap-1 font-mono font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Variables
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Variable 1: AIS Silence Gap */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-ocean-sky/20 rounded-xl border border-border-marine transition-colors">
                <div>
                  <span className="font-bold text-ocean-navy block">1. AIS Transponder Silence over Slick Corridor</span>
                  <span className="text-[10px] text-text-muted font-sans block">
                    {hasAisGap ? "Actual: 38-minute dead reckoning silence gap detected" : "Counterfactual: Continuous 3-second terrestrial AIS reporting"}
                  </span>
                </div>
                <button
                  onClick={() => setHasAisGap(!hasAisGap)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    hasAisGap 
                      ? 'bg-status-danger text-white shadow-sm' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {hasAisGap ? 'Silence Active (Gap)' : 'Continuous AIS'}
                </button>
              </div>

              {/* Variable 2: Deceleration Anomaly */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-ocean-sky/20 rounded-xl border border-border-marine transition-colors">
                <div>
                  <span className="font-bold text-ocean-navy block">2. Speed Deceleration Anomaly in Origin Zone A</span>
                  <span className="text-[10px] text-text-muted font-sans block">
                    {hasDeceleration ? "Actual: Vessel throttled down from 14.2 kn to 6.2 kn for 45 min" : "Counterfactual: Maintained steady cruising speed (14.2 kn)"}
                  </span>
                </div>
                <button
                  onClick={() => setHasDeceleration(!hasDeceleration)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    hasDeceleration 
                      ? 'bg-status-danger text-white shadow-sm' 
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {hasDeceleration ? 'Deceleration Trough' : 'Constant Speed'}
                </button>
              </div>

              {/* Variable 3: Temporal Release Coincidence Offset */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">3. Oil Discharge Release Time Offset:</span>
                  <span className="font-bold text-ocean">
                    {timeOffsetHours === 0 ? "0h (Coincident)" : `${timeOffsetHours > 0 ? '+' : ''}${timeOffsetHours} Hours`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={timeOffsetHours}
                  onChange={(e) => setTimeOffsetHours(Number(e.target.value))}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">
                  Simulates what would happen if the oil hindcast origin was released earlier or later in time.
                </span>
              </div>

              {/* Variable 4: Ocean Current Speed Perturbation */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">4. HYCOM Surface Current Speed Drift Rate:</span>
                  <span className="font-bold text-ocean">
                    {currentSpeedDeltaKn === 0 ? "Nominal (0.0 kn delta)" : `${currentSpeedDeltaKn > 0 ? '+' : ''}${currentSpeedDeltaKn} kn`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.2"
                  value={currentSpeedDeltaKn}
                  onChange={(e) => setCurrentSpeedDeltaKn(Number(e.target.value))}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">
                  Alters the backward Lagrangian drift trajectory trajectory cone by shifting ocean current speeds.
                </span>
              </div>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="p-4 rounded-2xl bg-ocean-sky/40 border border-ocean/30 text-xs font-mono text-ocean-navy">
            <span className="font-bold uppercase tracking-wider text-[10px] text-ocean-deep block">
              FORENSIC COUNTERFACTUAL INTERPRETATION:
            </span>
            <p className="text-[11px] leading-relaxed mt-1 font-sans text-text-secondary">
              If <strong>{v.name}</strong> had not engaged in transponder silence and had maintained uniform cruising speed, its attribution priority would fall by <strong>{Math.abs(scoreDelta)} points</strong> into the <strong>{simulatedScore > 65 ? 'Under Review' : 'Low Priority'}</strong> tier. This demonstrates that the <strong>AIS blackout corridor over Origin Zone A is the mathematically pivotal piece of incriminating evidence</strong>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md transition-all"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}

