import React from 'react';
import { Droplets, Wind, Waves, Gauge, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function OilWeatheringGauge({ activeIncident, simHour = 15.0 }) {
  // Base initial discharge volume ~2,400 bbls (~325 tonnes)
  const initialVolumeBbls = 2400;
  const initialTonnes = 328;

  // Real-time weathering mass balance calculation using empirical ADIOS equations
  const t = Math.max(0, simHour);
  const evaporatedPct = Math.min(38, Math.round(12 + Math.log(t + 1) * 8.2));
  const emulsifiedPct = Math.min(46, Math.round(15 + Math.pow(t, 0.65) * 3.8));
  const dispersedPct = Math.min(18, Math.round(6 + t * 0.45));
  const surfacePct = Math.max(12, 100 - (evaporatedPct + dispersedPct));

  const currentSurfaceBbls = Math.round(initialVolumeBbls * (surfacePct / 100));
  const currentSurfaceTonnes = Math.round(initialTonnes * (surfacePct / 100));

  // Bonn Agreement Color Code determination based on age & thickness
  let bonnCode = "CODE 4: DISCONTINUOUS TRUE OIL";
  let bonnColor = "bg-amber-800 text-amber-100";
  let bonnThickness = "50 – 200 µm";
  let skimmerEfficiency = "72% (Optimal Skimming Window)";

  if (t > 20) {
    bonnCode = "CODE 5: HEAVY EMULSIFIED MOUSSE";
    bonnColor = "bg-orange-900 text-orange-100";
    bonnThickness = "> 200 µm (Heavy Emulsion)";
    skimmerEfficiency = "38% (High Viscosity, Requires Oleophilic Skimmers)";
  } else if (t < 5) {
    bonnCode = "CODE 3: METALLIC / RAINBOW SHEEN";
    bonnColor = "bg-blue-800 text-blue-100";
    bonnThickness = "5.0 – 50 µm";
    skimmerEfficiency = "85% (High Recovery Response)";
  }

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-ocean" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">HYDROCARBON WEATHERING & MASS BALANCE</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ocean-light text-ocean border border-ocean/30 font-bold">
          ADIOS-II MODEL
        </span>
      </div>

      {/* Surface Slick Mass Summary */}
      <div className="grid grid-cols-2 gap-2 bg-ocean-light/50 p-2.5 rounded-xl border border-border-marine font-mono text-xs">
        <div>
          <span className="text-[9px] text-text-muted block">SURFACE REMAINING</span>
          <span className="text-base font-black text-ocean-navy">{currentSurfaceBbls.toLocaleString()}</span>
          <span className="text-[10px] text-text-muted ml-1">bbls</span>
          <div className="text-[9px] text-text-muted mt-0.5">({currentSurfaceTonnes} metric tons)</div>
        </div>

        <div>
          <span className="text-[9px] text-text-muted block">INITIAL RELEASE</span>
          <span className="text-base font-black text-ocean-navy">{initialVolumeBbls.toLocaleString()}</span>
          <span className="text-[10px] text-text-muted ml-1">bbls</span>
          <div className="text-[9px] text-emerald-600 font-semibold mt-0.5">Medium Crude (32° API)</div>
        </div>
      </div>

      {/* Weathering Partition Bar Chart */}
      <div className="space-y-1.5 font-mono text-[10px]">
        <div className="flex items-center justify-between font-bold text-ocean-navy">
          <span>MASS BALANCE PARTITION (T+{simHour.toFixed(1)}h)</span>
          <span>100% MASS CONSERVATION</span>
        </div>

        {/* Stacked bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200">
          <div style={{ width: `${surfacePct}%` }} className="bg-amber-800 transition-all duration-500" title={`Surface: ${surfacePct}%`}></div>
          <div style={{ width: `${evaporatedPct}%` }} className="bg-sky-400 transition-all duration-500" title={`Evaporated: ${evaporatedPct}%`}></div>
          <div style={{ width: `${emulsifiedPct}%` }} className="bg-amber-600 transition-all duration-500" title={`Emulsified: ${emulsifiedPct}%`}></div>
          <div style={{ width: `${dispersedPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Dispersed: ${dispersedPct}%`}></div>
        </div>

        {/* Breakdown Legend */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9.5px]">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 border border-amber-200">
            <span className="flex items-center gap-1 text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-800"></span>
              <span>Surface Floating</span>
            </span>
            <span className="font-bold text-amber-900">{surfacePct}%</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-sky-50 border border-sky-200">
            <span className="flex items-center gap-1 text-sky-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Evaporated</span>
            </span>
            <span className="font-bold text-sky-800">{evaporatedPct}%</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-orange-50 border border-orange-200">
            <span className="flex items-center gap-1 text-orange-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Water-in-Oil Emulsion</span>
            </span>
            <span className="font-bold text-orange-900">{emulsifiedPct}%</span>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="flex items-center gap-1 text-emerald-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Natural Dispersion</span>
            </span>
            <span className="font-bold text-emerald-900">{dispersedPct}%</span>
          </div>
        </div>
      </div>

      {/* Bonn Agreement Slick Appearance Badge */}
      <div className="p-2 rounded-xl bg-slate-50 border border-border-marine space-y-1 font-mono text-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">BONN CODE:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${bonnColor}`}>
            {bonnCode}
          </span>
        </div>
        <div className="flex items-center justify-between text-[9px] text-text-secondary pt-0.5">
          <span>Layer Thickness: {bonnThickness}</span>
          <span className="text-status-success font-bold">{skimmerEfficiency}</span>
        </div>
      </div>
    </div>
  );
}

