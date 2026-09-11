import React, { useState } from 'react';
import { Flame, Droplet, Wind, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

export default function ChemicalWeatheringModel() {
  const [seaTempC, setSeaTempC] = useState(28); // Celsius
  const [elapsedHours, setElapsedHours] = useState(24); // Hours
  const [oilType, setOilType] = useState("heavy_fuel"); // 'crude', 'heavy_fuel', 'diesel'

  // Weathering formulas (Mackay & McAuliffe weathering approximation)
  const isDiesel = oilType === "diesel";
  const isCrude = oilType === "crude";

  // Evaporation rate increases with temperature, time, and lighter oil
  const evapBase = isDiesel ? 0.65 : isCrude ? 0.38 : 0.22;
  const tempFactor = (seaTempC - 20) * 0.012;
  const timeFactor = Math.min(1.0, Math.log10(elapsedHours + 1) / 1.5);
  const evaporationPercent = Math.min(85, Math.round((evapBase + tempFactor) * timeFactor * 100));

  // Emulsification ('chocolate mousse' water-in-oil uptake)
  const emulsificationPercent = isDiesel ? 5 : Math.min(75, Math.round(18 * Math.log(elapsedHours + 2)));

  // Natural dispersion
  const dispersionPercent = Math.min(30, Math.round(8 + elapsedHours * 0.4));

  // VOC safety radius downwind
  const vocRadiusKm = (evaporationPercent > 30 ? 3.4 : 1.8).toFixed(1);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Chemical Weathering & Toxic VOC Dispersion Model (Mackay Engine)
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-ocean-light p-1 rounded-xl border border-border-marine text-[10px]">
          <span className="text-text-muted px-1 font-bold">OIL CLASS:</span>
          {['heavy_fuel', 'crude', 'diesel'].map((t) => (
            <button
              key={t}
              onClick={() => setOilType(t)}
              className={`px-2 py-0.5 rounded font-bold uppercase transition-all ${
                oilType === t ? "bg-ocean text-white shadow-sm" : "text-text-secondary"
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ocean-navy font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-ocean" /> Sea Surface Temperature
            </span>
            <span className="text-ocean font-bold">{seaTempC} °C</span>
          </div>
          <input
            type="range"
            min="15"
            max="35"
            value={seaTempC}
            onChange={(e) => setSeaTempC(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ocean-navy font-semibold">
              <Wind className="w-3.5 h-3.5 text-ocean" /> Weathering Exposure Age
            </span>
            <span className="text-ocean font-bold">T+{elapsedHours} Hours</span>
          </div>
          <input
            type="range"
            min="1"
            max="72"
            value={elapsedHours}
            onChange={(e) => setElapsedHours(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>
      </div>

      {/* Weathering Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-border-marine">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text-muted">Atmospheric Evaporation</span>
            <span className="text-ocean font-extrabold">{evaporationPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-ocean h-full" style={{ width: `${evaporationPercent}%` }}></div>
          </div>
          <span className="text-[9px] text-text-muted mt-1 block">Light fraction loss</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-border-marine">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text-muted">Water-in-Oil Emulsification</span>
            <span className="text-amber-600 font-extrabold">{emulsificationPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${emulsificationPercent}%` }}></div>
          </div>
          <span className="text-[9px] text-text-muted mt-1 block">Chocolate mousse formation</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-border-marine">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-text-muted">Water Column Dispersion</span>
            <span className="text-status-success font-extrabold">{dispersionPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="bg-status-success h-full" style={{ width: `${dispersionPercent}%` }}></div>
          </div>
          <span className="text-[9px] text-text-muted mt-1 block">Wave energy entrainment</span>
        </div>
      </div>

      {/* VOC Inhalation Hazard Card */}
      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-4 h-4 text-status-warning flex-shrink-0" />
          <span>
            Downwind VOC Inhalation Safety Perimeter: <strong>{vocRadiusKm} km downwind</strong>
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
          Full Face Respirators Required
        </span>
      </div>
    </div>
  );
}

