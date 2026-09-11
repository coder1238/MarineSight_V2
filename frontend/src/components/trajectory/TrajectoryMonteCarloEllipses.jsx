import React, { useState } from 'react';
import { Target, Sliders, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function TrajectoryMonteCarloEllipses() {
  const [gdopNoise, setGdopNoise] = useState(1.8);
  const [turbulenceFactor, setTurbulenceFactor] = useState(0.25);
  const [simIterations, setSimIterations] = useState(1000);

  // Covariance calculation
  const sigma1RadiusNm = (0.18 * (gdopNoise / 1.8) * (1 + turbulenceFactor)).toFixed(2);
  const sigma2RadiusNm = (parseFloat(sigma1RadiusNm) * 2.0).toFixed(2);
  const sigma3RadiusNm = (parseFloat(sigma1RadiusNm) * 3.0).toFixed(2);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Monte Carlo Spatial Uncertainty Ellipses (1σ / 2σ / 3σ)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-ocean font-bold bg-ocean-sky px-2 py-0.5 rounded border border-ocean/20">
          N = {simIterations} SIMULATION RUNS
        </span>
      </div>

      {/* 3 Sigma Envelopes Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-muted">1-SIGMA (68.2% CONF.)</span>
            <span className="text-[9px] font-bold text-status-success">CORE</span>
          </div>
          <span className="text-lg font-bold text-status-success mt-0.5 block">±{sigma1RadiusNm} nm</span>
          <span className="text-[9px] text-text-secondary block">Spatial Error Semi-Major Axis</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-muted">2-SIGMA (95.4% CONF.)</span>
            <span className="text-[9px] font-bold text-ocean">STANDARD</span>
          </div>
          <span className="text-lg font-bold text-ocean mt-0.5 block">±{sigma2RadiusNm} nm</span>
          <span className="text-[9px] text-text-secondary block">Court Legal Defense Boundary</span>
        </div>

        <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-muted">3-SIGMA (99.7% CONF.)</span>
            <span className="text-[9px] font-bold text-status-warning">OUTER</span>
          </div>
          <span className="text-lg font-bold text-status-warning mt-0.5 block">±{sigma3RadiusNm} nm</span>
          <span className="text-[9px] text-text-secondary block">Maximum Physical Drift Dispersion</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-ocean uppercase flex items-center gap-1">
          <Sliders className="w-3 h-3" />
          Covariance Noise & Dispersion Factors:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Geometric Dilution (GDOP):</span>
              <span className="font-bold text-ocean-navy">{gdopNoise}</span>
            </div>
            <input 
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={gdopNoise}
              onChange={(e) => setGdopNoise(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>1.0 (Optimal Constellation)</span>
              <span>1.8 (Nominal)</span>
              <span>4.0 (Poor Geometry)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-text-secondary">Eddy Turbulence Multiplier:</span>
              <span className="font-bold text-ocean-navy">{(turbulenceFactor * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range"
              min="0.05"
              max="0.80"
              step="0.05"
              value={turbulenceFactor}
              onChange={(e) => setTurbulenceFactor(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[8px] text-text-muted mt-0.5">
              <span>5% (Laminar)</span>
              <span>25% (Monsoon Swell)</span>
              <span>80% (Cyclonic)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

