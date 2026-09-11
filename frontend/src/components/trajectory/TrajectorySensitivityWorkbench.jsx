import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function TrajectorySensitivityWorkbench({ onScoreRecalculated }) {
  const [blackoutThresholdMin, setBlackoutThresholdMin] = useState(15);
  const [decelThresholdPercent, setDecelThresholdPercent] = useState(30);
  const [rotJerkThreshold, setRotJerkThreshold] = useState(4.0);
  const [cpaThresholdNm, setCpaThresholdNm] = useState(2.0);

  // Dynamic Composite Score Calculation
  // Nominal: 87
  const baseScore = 87;
  // If user tightens threshold (lower min), score goes up
  const blackoutImpact = (20 - blackoutThresholdMin) * 0.4;
  const decelImpact = (40 - decelThresholdPercent) * 0.3;
  const cpaImpact = (cpaThresholdNm - 1.5) * 4.0;
  const computedScore = Math.min(99, Math.max(40, Math.round(baseScore + blackoutImpact + decelImpact + cpaImpact)));

  const handleReset = () => {
    setBlackoutThresholdMin(15);
    setDecelThresholdPercent(30);
    setRotJerkThreshold(4.0);
    setCpaThresholdNm(2.0);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Custom Anomaly Sensitivity Calibration Workbench
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-status-warning border border-amber-200">
            COMPOSITE SCORE: {computedScore} / 100
          </span>
          <button
            onClick={handleReset}
            title="Reset to Factory Defaults"
            className="p-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-light text-text-secondary text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Interactive Calibration Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {/* Slider 1: Blackout Time */}
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-secondary">Blackout Alarm Trigger:</span>
            <span className="font-bold text-ocean-navy">{blackoutThresholdMin} min</span>
          </div>
          <input 
            type="range"
            min="5"
            max="60"
            step="5"
            value={blackoutThresholdMin}
            onChange={(e) => setBlackoutThresholdMin(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
            <span>5m (Strict)</span>
            <span>15m</span>
            <span>60m (Relaxed)</span>
          </div>
        </div>

        {/* Slider 2: Decel % */}
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-secondary">Decel Drop Sensitivity:</span>
            <span className="font-bold text-ocean-navy">-{decelThresholdPercent}%</span>
          </div>
          <input 
            type="range"
            min="15"
            max="75"
            step="5"
            value={decelThresholdPercent}
            onChange={(e) => setDecelThresholdPercent(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
            <span>-15% (Hair-trigger)</span>
            <span>-30%</span>
            <span>-75% (Only Severe)</span>
          </div>
        </div>

        {/* Slider 3: ROT Jerk */}
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-secondary">ROT Maneuver Jerk:</span>
            <span className="font-bold text-ocean-navy">{rotJerkThreshold.toFixed(1)}°/m</span>
          </div>
          <input 
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={rotJerkThreshold}
            onChange={(e) => setRotJerkThreshold(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
            <span>1.0°/m</span>
            <span>4.0°/m</span>
            <span>10.0°/m</span>
          </div>
        </div>

        {/* Slider 4: CPA Threshold */}
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-secondary">Spill Zone Proximity:</span>
            <span className="font-bold text-ocean-navy">{cpaThresholdNm.toFixed(1)} nm</span>
          </div>
          <input 
            type="range"
            min="0.5"
            max="5.0"
            step="0.5"
            value={cpaThresholdNm}
            onChange={(e) => setCpaThresholdNm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
            <span>0.5 nm</span>
            <span>2.0 nm</span>
            <span>5.0 nm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

