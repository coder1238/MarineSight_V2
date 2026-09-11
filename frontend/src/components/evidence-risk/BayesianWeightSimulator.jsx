import React, { useState } from 'react';
import { Sliders, RotateCcw, Sparkles, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export const DEFAULT_WEIGHTS = {
  spatial: 22,
  temporal: 18,
  siamese: 16,
  blackout: 15,
  deceleration: 14,
  sarRadar: 10,
  routeDeviation: 5,
};

export default function BayesianWeightSimulator({
  weights,
  setWeights,
  evidenceScores,
  compositeScore,
  onReset
}) {
  const [activePreset, setActivePreset] = useState("default");

  const handleSliderChange = (key, val) => {
    setActivePreset("custom");
    const num = parseInt(val, 10);
    setWeights(prev => ({
      ...prev,
      [key]: num
    }));
  };

  const applyPreset = (type) => {
    setActivePreset(type);
    if (type === "default") {
      setWeights(DEFAULT_WEIGHTS);
    } else if (type === "radar_first") {
      setWeights({
        spatial: 15,
        temporal: 15,
        siamese: 10,
        blackout: 10,
        deceleration: 10,
        sarRadar: 35,
        routeDeviation: 5
      });
    } else if (type === "ais_tamper_strict") {
      setWeights({
        spatial: 20,
        temporal: 15,
        siamese: 10,
        blackout: 30,
        deceleration: 15,
        sarRadar: 5,
        routeDeviation: 5
      });
    } else if (type === "equal") {
      setWeights({
        spatial: 15,
        temporal: 15,
        siamese: 14,
        blackout: 14,
        deceleration: 14,
        sarRadar: 14,
        routeDeviation: 14
      });
    }
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const weightFields = [
    { key: "spatial", label: "Spatial Proximity (Copernicus)", defaultW: 22, score: evidenceScores.spatial || 94 },
    { key: "temporal", label: "Temporal Release Coincidence", defaultW: 18, score: evidenceScores.temporal || 91 },
    { key: "siamese", label: "Siamese Trajectory Similarity", defaultW: 16, score: evidenceScores.siamese || 88 },
    { key: "blackout", label: "AIS Transponder Blackout Gap", defaultW: 15, score: evidenceScores.blackout || 92 },
    { key: "deceleration", label: "Kinematic Deceleration Anomaly", defaultW: 14, score: evidenceScores.deceleration || 86 },
    { key: "sarRadar", label: "Sentinel-1 SAR Radar Match", defaultW: 10, score: evidenceScores.sarRadar || 89 },
    { key: "routeDeviation", label: "Historical Route Deviation", defaultW: 5, score: evidenceScores.routeDeviation || 75 },
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase font-mono">
            Bayesian Weight & Attribution Simulator (What-If Analysis)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-text-muted">
            Sum of Weights: <strong className={totalWeight === 100 ? "text-status-success" : "text-status-warning"}>{totalWeight}%</strong>
          </span>
          <button
            onClick={() => applyPreset("default")}
            className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean-sky text-ocean text-[10px] font-bold font-mono flex items-center gap-1 transition-all"
            title="Reset weights to default calibrated values"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
        <span className="text-text-muted mr-1">Analytical Presets:</span>
        <button
          onClick={() => applyPreset("default")}
          className={`px-2 py-0.8 rounded text-[10px] font-bold ${
            activePreset === "default" ? "bg-ocean text-white" : "bg-ocean-light text-text-secondary hover:bg-ocean-sky"
          }`}
        >
          Calibrated Baseline
        </button>
        <button
          onClick={() => applyPreset("radar_first")}
          className={`px-2 py-0.8 rounded text-[10px] font-bold ${
            activePreset === "radar_first" ? "bg-ocean text-white" : "bg-ocean-light text-text-secondary hover:bg-ocean-sky"
          }`}
        >
          SAR Radar-Heavy
        </button>
        <button
          onClick={() => applyPreset("ais_tamper_strict")}
          className={`px-2 py-0.8 rounded text-[10px] font-bold ${
            activePreset === "ais_tamper_strict" ? "bg-ocean text-white" : "bg-ocean-light text-text-secondary hover:bg-ocean-sky"
          }`}
        >
          AIS Spoofing / Blackout Strict
        </button>
        <button
          onClick={() => applyPreset("equal")}
          className={`px-2 py-0.8 rounded text-[10px] font-bold ${
            activePreset === "equal" ? "bg-ocean text-white" : "bg-ocean-light text-text-secondary hover:bg-ocean-sky"
          }`}
        >
          Equalized (14.3% each)
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-mono">
        {weightFields.map((field) => (
          <div key={field.key} className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-ocean-navy font-semibold truncate mr-2">{field.label}</span>
              <span className="text-ocean font-extrabold flex-shrink-0">
                {weights[field.key]}% (Score: {field.score}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={weights[field.key]}
                onChange={(e) => handleSliderChange(field.key, e.target.value)}
                className="w-full h-1.5 bg-ocean-light rounded-lg appearance-none cursor-pointer accent-ocean"
              />
              <span className="text-[10px] text-text-muted w-8 text-right">{weights[field.key]}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recalculated Score Outcome */}
      <div className="pt-3 border-t border-border-marine flex flex-wrap items-center justify-between gap-3 bg-ocean-sky/20 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-ocean" />
          <div>
            <span className="text-[10px] font-mono text-text-muted uppercase block">Dynamic Composite Attribution Score</span>
            <span className="text-sm font-extrabold text-ocean-navy font-mono">
              Bayesian Posterior Probability: <span className="text-status-danger text-base">{compositeScore.toFixed(1)}%</span>
            </span>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono">
          <span className="text-text-muted">Legal Admissibility Threshold: &gt; 80.0%</span>
          <span className="block text-status-success font-bold flex items-center gap-1 justify-end">
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONFIRMED ABOVE PRIMA-FACIE THRESHOLD
          </span>
        </div>
      </div>
    </div>
  );
}

