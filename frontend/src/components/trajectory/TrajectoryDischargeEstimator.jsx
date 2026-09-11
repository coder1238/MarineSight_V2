import React, { useState } from 'react';
import { Droplet, AlertOctagon, Scale, ShieldAlert, Sliders, Info, Flame } from 'lucide-react';
import { DISCHARGE_ESTIMATE } from './trajectoryData';

export default function TrajectoryDischargeEstimator() {
  const [thicknessUm, setThicknessUm] = useState(0.85); // micrometers

  // Volume = Area * thickness
  // Area = 14.2 km * 0.38 km = 5.396 km2 = 5,396,000 m2
  const areaM2 = 5396000;
  const volumeM3 = (areaM2 * (thicknessUm * 1e-6)).toFixed(2);
  const volumeLiters = Math.round(volumeM3 * 1000);
  const metricTons = (volumeM3 * 0.89).toFixed(2);
  const rateLpm = (volumeLiters / 38).toFixed(1);
  const rateM3h = (volumeM3 / (38 / 60)).toFixed(2);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Droplet className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Bonn Agreement / MARPOL Bilge Discharge Rate Estimator
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-danger font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          ● MARPOL ANNEX I VIOLATION
        </span>
      </div>

      {/* 4 Quantitative Output Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-red-50/40 border border-red-100 rounded-xl">
          <span className="text-[9px] text-text-muted block">TOTAL ESTIMATED RELEASE</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">{volumeLiters.toLocaleString()} L</span>
          <span className="text-[9px] text-text-secondary block">~{metricTons} Metric Tons</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">DISCHARGE FLOW RATE</span>
          <span className="text-xl font-bold text-ocean-navy mt-0.5 block">{rateLpm} L/min</span>
          <span className="text-[9px] text-text-secondary block">{rateM3h} m³/hour</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">PUMP HARDWARE CORRELATION</span>
          <span className="text-sm font-bold text-ocean-navy mt-0.5 block">OWS Overboard Bypass</span>
          <span className="text-[9px] text-text-secondary block">Rated 5 - 10 m³/h capacity</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">LEGAL CONCENTRATION</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">4,200x LIMIT</span>
          <span className="text-[9px] text-status-danger block">Allowed: 15 ppm limit</span>
        </div>
      </div>

      {/* Thickness Interactive Slider */}
      <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-ocean uppercase flex items-center gap-1">
            <Sliders className="w-3 h-3" />
            Bonn Appearance Thickness Calibration:
          </span>
          <span className="text-[9px] text-text-muted">
            Code 2 (Rainbow) to Code 3 (Metallic)
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-secondary">Effective Mean Thickness (t):</span>
            <span className="font-bold text-ocean-navy">{thicknessUm} µm</span>
          </div>
          <input 
            type="range"
            min="0.10"
            max="3.00"
            step="0.05"
            value={thicknessUm}
            onChange={(e) => setThicknessUm(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[8px] text-text-muted">
            <span>0.10 µm (Silvery Sheen)</span>
            <span>0.85 µm (Calibrated Radar)</span>
            <span>3.00 µm (Heavy Metallic)</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs flex items-start gap-2">
        <Scale className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="text-[11px] leading-tight">
          <span className="font-bold text-amber-400">Forensic Admissibility Note:</span> The required discharge rate of {rateLpm} L/min aligns with the ship's 10 m³/h bilge stripping pump at 72% throttle, refuting claims of passive fuel tank seepage.
        </p>
      </div>
    </div>
  );
}

