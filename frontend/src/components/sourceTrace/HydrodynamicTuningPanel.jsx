import React from 'react';
import { Sliders, RotateCcw, Wind, Waves, Compass, Layers, Info } from 'lucide-react';

export default function HydrodynamicTuningPanel({
  params,
  onChange,
  onReset,
  activeModel,
  onModelChange
}) {
  const models = [
    { id: "cmems", name: "Copernicus CMEMS", desc: "Global Ocean 1/12° Physics Analysis", agreement: 94 },
    { id: "hycom", name: "NOAA HYCOM", desc: "Global 0.08° Ocean Circulation", agreement: 88 },
    { id: "mercator", name: "Mercator Ocean", desc: "PSY4V3 Operational High-Res", agreement: 91 }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-ocean" />
          <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
            Hydrodynamic Forcing & Drift Sensitivity
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] font-mono font-bold text-ocean hover:text-ocean-deep"
          title="Reset to default hindcast parameters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Oceanographic Model Selector */}
      <div>
        <label className="text-[11px] font-bold text-ocean-navy flex items-center justify-between mb-1.5">
          <span>Oceanographic Ensemble Dataset</span>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Ensemble Consensus: 91.0%
          </span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {models.map((m) => {
            const isSelected = activeModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModelChange(m.id)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-ocean bg-ocean-sky/40 shadow-sm'
                    : 'border-border-marine bg-ocean-light/30 hover:bg-ocean-light'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold block truncate ${isSelected ? 'text-ocean-navy' : 'text-text-secondary'}`}>
                    {m.name}
                  </span>
                </div>
                <div className="text-[9px] text-text-muted mt-0.5">{m.agreement}% Match</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensitivity Sliders */}
      <div className="space-y-3 pt-1">
        {/* Windage Leeway Factor */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-ocean" />
              <span>Windage Leeway Factor</span>
            </span>
            <span className="font-mono font-bold text-ocean-navy">{params.windage.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={5.0}
            step={0.1}
            value={params.windage}
            onChange={(e) => onChange({ ...params, windage: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted font-mono mt-0.5">
            <span>1.0% (Dense/Submerged)</span>
            <span>3.2% (Typical Crude)</span>
            <span>5.0% (Light Sheen)</span>
          </div>
        </div>

        {/* Current Multiplier */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-ocean-deep" />
              <span>Ocean Current Multiplier</span>
            </span>
            <span className="font-mono font-bold text-ocean-navy">{params.currentMultiplier.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.8}
            step={0.05}
            value={params.currentMultiplier}
            onChange={(e) => onChange({ ...params, currentMultiplier: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted font-mono mt-0.5">
            <span>0.5x (Slack Tide)</span>
            <span>1.0x (Standard CMEMS)</span>
            <span>1.8x (Monsoon Surge)</span>
          </div>
        </div>

        {/* Ekman Deflection Angle */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekman Deflection Angle</span>
            </span>
            <span className="font-mono font-bold text-ocean-navy">{params.ekmanAngle > 0 ? `+${params.ekmanAngle}°` : `${params.ekmanAngle}°`}</span>
          </div>
          <input
            type="range"
            min={-15}
            max={15}
            step={1}
            value={params.ekmanAngle}
            onChange={(e) => onChange({ ...params, ekmanAngle: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted font-mono mt-0.5">
            <span>-15° (Left Deflect)</span>
            <span>0° (Downwind)</span>
            <span>+15° (Right Coriolis)</span>
          </div>
        </div>

        {/* Stokes Drift Wave Factor */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Wave Stokes Drift Weighting</span>
            </span>
            <span className="font-mono font-bold text-ocean-navy">{params.stokesWeight}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={params.stokesWeight}
            onChange={(e) => onChange({ ...params, stokesWeight: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted font-mono mt-0.5">
            <span>0% (Calm Sea)</span>
            <span>5% (Moderate Swell)</span>
            <span>15% (Rough Seas)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

