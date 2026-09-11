import React, { useState } from 'react';
import { Target, Compass, Clock, ShieldAlert, CheckCircle2, Sliders, MapPin } from 'lucide-react';

export default function TrajectoryCpaCalculator({ caseData }) {
  const [slickRadiusNm, setSlickRadiusNm] = useState(2.2);
  const [backtrackToleranceMin, setBacktrackToleranceMin] = useState(25);

  const baseDistance = 1.4; // nm
  const intersectionTime = "22:42 UTC";
  const temporalWindowStart = "22:35 UTC";
  const temporalWindowEnd = "22:49 UTC";

  // Dynamic calculation based on user sliders
  const isDirectHit = baseDistance <= slickRadiusNm;
  const matchProbability = Math.min(99.2, Math.max(50, 96.4 - (baseDistance / slickRadiusNm) * 8 + (backtrackToleranceMin / 25) * 3));

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Spill Origin Intersection & Closest Point of Approach (CPA)
          </h3>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
          isDirectHit 
            ? 'bg-red-50 text-status-danger border-red-200' 
            : 'bg-amber-50 text-status-warning border-amber-200'
        }`}>
          {isDirectHit ? '● SPATIAL INTERSECTION VERIFIED' : '○ NEAR-MISS CONVERGENCE'}
        </span>
      </div>

      {/* 4 Calculation Outputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">MINIMUM CPA DISTANCE</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">{baseDistance} nm</span>
          <span className="text-[9px] text-text-secondary block">To Slick Zone A Centroid</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">INTERSECTION TIMESTAMP</span>
          <span className="text-xl font-bold text-ocean-navy mt-0.5 block">{intersectionTime}</span>
          <span className="text-[9px] text-text-secondary block">Window: {temporalWindowStart} - {temporalWindowEnd}</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">DISCHARGE PROBABILITY</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">{matchProbability.toFixed(1)}%</span>
          <span className="text-[9px] text-status-success font-semibold block">Extremely High Confidence</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">SLICK PASS-THROUGH</span>
          <span className="text-xl font-bold text-ocean mt-0.5 block">14.2 km Trail</span>
          <span className="text-[9px] text-text-secondary block">Collinear with 218° heading</span>
        </div>
      </div>

      {/* Interactive Tolerance Calibration */}
      <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-ocean uppercase flex items-center gap-1">
          <Sliders className="w-3 h-3" />
          Forensic Intersection Tolerance Thresholds:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Slick Origin Radius (Rn):</span>
              <span className="font-bold text-ocean-navy">{slickRadiusNm.toFixed(1)} nm</span>
            </div>
            <input 
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={slickRadiusNm}
              onChange={(e) => setSlickRadiusNm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>1.0 nm (Core)</span>
              <span>2.2 nm (Nominal)</span>
              <span>5.0 nm (Outer Sheen)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Backtrack Drift Uncertainty:</span>
              <span className="font-bold text-ocean-navy">±{backtrackToleranceMin} min</span>
            </div>
            <input 
              type="range"
              min="10"
              max="60"
              step="5"
              value={backtrackToleranceMin}
              onChange={(e) => setBacktrackToleranceMin(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>±10 min</span>
              <span>±25 min</span>
              <span>±60 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

