import React, { useState } from 'react';
import { Cpu, Sliders, CheckCircle2, AlertCircle, Sparkles, RefreshCw, BarChart3 } from 'lucide-react';
import { INTERPOLATION_MODELS } from './trajectoryData';

export default function TrajectoryModelTuner({ 
  selectedModelId, 
  onSelectModel,
  onRecalibrate
}) {
  const [hiddenUnits, setHiddenUnits] = useState(128);
  const [driftFactorAlpha, setDriftFactorAlpha] = useState(0.03);
  const [timeStepSec, setTimeStepSec] = useState(60);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const activeModel = INTERPOLATION_MODELS.find(m => m.id === selectedModelId) || INTERPOLATION_MODELS[0];

  const handleRecalibrateClick = () => {
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsRecalibrating(false);
      if (onRecalibrate) onRecalibrate({ hiddenUnits, driftFactorAlpha, timeStepSec });
    }, 600);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Bi-LSTM Neural Gap Interpolation & Multi-Model Benchmark
          </h3>
        </div>
        <button
          onClick={handleRecalibrateClick}
          disabled={isRecalibrating}
          className="px-3 py-1 rounded-lg bg-ocean-light hover:bg-ocean-sky border border-border-marine text-ocean-navy text-xs font-mono font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3 h-3 text-ocean ${isRecalibrating ? 'animate-spin' : ''}`} />
          <span>{isRecalibrating ? 'Recalibrating...' : 'Recalibrate Weights'}</span>
        </button>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {INTERPOLATION_MODELS.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <button
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`p-2.5 rounded-xl border text-left transition-all font-mono ${
                isSelected
                  ? 'border-ocean bg-ocean-sky/40 shadow-xs ring-1 ring-ocean/30'
                  : 'border-border-marine bg-white hover:border-ocean/40 hover:bg-ocean-light/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-ocean-navy truncate">{model.name.split('+')[0]}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-ocean shrink-0" />}
              </div>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-text-muted text-[9px]">CONFIDENCE</span>
                <span className={`font-bold ${model.confidence > 90 ? 'text-status-success' : 'text-status-warning'}`}>
                  {model.confidence}%
                </span>
              </div>
              <div className="flex items-baseline justify-between text-[11px] mt-0.5">
                <span className="text-text-muted text-[9px]">MEAN RMSE</span>
                <span className="font-bold text-text-primary">±{model.meanRmseNm} nm</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Hyperparameters Slider Panel */}
      <div className="p-3 bg-ocean-light rounded-xl border border-border-marine space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-ocean uppercase flex items-center gap-1">
            <Sliders className="w-3 h-3" />
            Neural Hyperparameters & Ocean Coupling
          </span>
          <span className="text-[9px] text-text-muted">
            Architecture: {activeModel.type}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Slider 1: BiLSTM Units */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Hidden LSTM Units:</span>
              <span className="font-bold text-ocean-navy">{hiddenUnits} units</span>
            </div>
            <input 
              type="range"
              min="32"
              max="256"
              step="32"
              value={hiddenUnits}
              onChange={(e) => setHiddenUnits(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>32 (Light)</span>
              <span>128 (Nominal)</span>
              <span>256 (Deep)</span>
            </div>
          </div>

          {/* Slider 2: Ocean Drift Factor */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Drift Coupling (α):</span>
              <span className="font-bold text-ocean-navy">{(driftFactorAlpha * 100).toFixed(1)}%</span>
            </div>
            <input 
              type="range"
              min="0.01"
              max="0.08"
              step="0.005"
              value={driftFactorAlpha}
              onChange={(e) => setDriftFactorAlpha(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>1.0% (Calm)</span>
              <span>3.0% (Stokes)</span>
              <span>8.0% (Gale)</span>
            </div>
          </div>

          {/* Slider 3: Temporal Granularity */}
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Temporal Step (Δt):</span>
              <span className="font-bold text-ocean-navy">{timeStepSec}s</span>
            </div>
            <input 
              type="range"
              min="30"
              max="180"
              step="30"
              value={timeStepSec}
              onChange={(e) => setTimeStepSec(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>30s (Fine)</span>
              <span>60s (Standard)</span>
              <span>180s (Coarse)</span>
            </div>
          </div>
        </div>

        {/* Model Recommendation Badge */}
        <div className="pt-2 border-t border-border-marine/60 flex items-center justify-between text-[10px]">
          <span className="text-text-muted">Forensic Legal Standard:</span>
          <span className="font-bold text-ocean bg-white px-2 py-0.5 rounded border border-border-marine">
            {activeModel.recommendation}
          </span>
        </div>
      </div>
    </div>
  );
}

