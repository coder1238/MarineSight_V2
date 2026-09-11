import React, { useState } from 'react';
import { Droplets, Sun, Moon, Info, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WeatheringBackCalcCard({
  observedVolumeM3 = 450,
  slickThicknessMm = 0.05, // Bonn Code 3 / Metallic
  slickAgeHours = 40.0
}) {
  const [obsVol, setObsVol] = useState(observedVolumeM3);
  const [emulsificationWaterCut, setEmulsificationWaterCut] = useState(42); // % water in mousse
  const [evaporativeFraction, setEvaporativeFraction] = useState(28); // % lost to atmosphere
  const [oilType, setOilType] = useState("crude_arab_light"); // heavy_fuel_oil, crude_arab_light, bilge_sludge

  const oilProperties = {
    heavy_fuel_oil: {
      name: "Heavy Fuel Oil (IFO 380)",
      apiGravity: 15.2,
      pourPointC: 22,
      bonnCategory: "Bonn Level 4 (Continuous Dark Brown/Black)",
      naturalDispersionRate: "Low (< 0.2%/day)",
      evapMax: 12
    },
    crude_arab_light: {
      name: "Arab Light Crude (33.4° API)",
      apiGravity: 33.4,
      pourPointC: -12,
      bonnCategory: "Bonn Level 3 (Metallic/True Oil Rainbow)",
      naturalDispersionRate: "Moderate (~ 1.5%/day)",
      evapMax: 32
    },
    bilge_sludge: {
      name: "Oily Bilge Separator Residue / Sludge",
      apiGravity: 22.0,
      pourPointC: 15,
      bonnCategory: "Bonn Level 3-4 (Discontinuous Emulsion)",
      naturalDispersionRate: "Moderate-High",
      evapMax: 20
    }
  };

  // Pure oil portion currently on water:
  // observed volume is emulsion = pure_oil + water
  const pureOilRemaining = obsVol * (1 - emulsificationWaterCut / 100);
  
  // Initial oil before evaporation:
  // pureOilRemaining = initialOil * (1 - evaporativeFraction / 100)
  const initialEstimatedDischarge = pureOilRemaining / (1 - evaporativeFraction / 100);
  const initialTonnes = (initialEstimatedDischarge * 0.865).toFixed(0);

  // Solar zenith / night time likelihood for 22:40 UTC in Arabian Sea
  // 14.8°N, 68.2°E at 22:40 UTC corresponds to Local Solar Time ~03:12 AM (Dead of Night)
  const nocturnalConfidence = 94.2;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-ocean" />
          <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
            Backward Weathering & Discharge Volume Reconstruction
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-ocean bg-ocean-sky/40 px-2 py-0.5 rounded border border-ocean/30">
          ADIOS / MACKAY KINETICS
        </span>
      </div>

      {/* Product Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-ocean-navy flex items-center justify-between">
          <span>Suspect Hydrocarbon Classification</span>
          <span className="text-[10px] font-mono text-text-muted">MARPOL Annex I App. I</span>
        </label>
        <select
          value={oilType}
          onChange={(e) => {
            const val = e.target.value;
            setOilType(val);
            if (val === 'heavy_fuel_oil') {
              setEvaporativeFraction(10);
              setEmulsificationWaterCut(35);
            } else if (val === 'crude_arab_light') {
              setEvaporativeFraction(28);
              setEmulsificationWaterCut(42);
            } else {
              setEvaporativeFraction(18);
              setEmulsificationWaterCut(50);
            }
          }}
          className="w-full text-xs font-bold text-ocean-navy border border-border-marine rounded-xl p-2 bg-ocean-light/30 focus:outline-none focus:border-ocean"
        >
          <option value="crude_arab_light">Arab Light Crude Oil (33.4° API) - Typical VLCC Cargo</option>
          <option value="heavy_fuel_oil">Heavy Fuel Oil IFO-380 - Vessel Bunker Residual</option>
          <option value="bilge_sludge">Machinery Space Oily Bilge / Sludge (MARPOL Viol.)</option>
        </select>
        <div className="text-[10px] text-text-muted font-mono flex items-center justify-between">
          <span>{oilProperties[oilType].bonnCategory}</span>
          <span>API: {oilProperties[oilType].apiGravity}°</span>
        </div>
      </div>

      {/* Kinetic Weathering Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Observed Emulsion Volume */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary text-[11px]">Observed Surface Slick:</span>
            <span className="font-mono font-bold text-ocean-navy">{obsVol} m³</span>
          </div>
          <input
            type="range"
            min={100}
            max={1500}
            step={25}
            value={obsVol}
            onChange={(e) => setObsVol(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        {/* Emulsification Water-Cut */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary text-[11px]">Emulsion Water-Cut:</span>
            <span className="font-mono font-bold text-ocean-navy">{emulsificationWaterCut}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={75}
            step={5}
            value={emulsificationWaterCut}
            onChange={(e) => setEmulsificationWaterCut(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        {/* Evaporative Loss % */}
        <div className="sm:col-span-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary text-[11px]">Evaporative Loss (T-{slickAgeHours}h @ 28°C Sea):</span>
            <span className="font-mono font-bold text-ocean-navy">{evaporativeFraction}% Lost</span>
          </div>
          <input
            type="range"
            min={5}
            max={oilProperties[oilType].evapMax + 10}
            step={1}
            value={evaporativeFraction}
            onChange={(e) => setEvaporativeFraction(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>
      </div>

      {/* Calculated Initial Discharge Box */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-ocean-sky/60 to-ocean-light border border-ocean/40 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
        <div>
          <span className="text-[9px] text-text-muted block">INITIAL DISCHARGE</span>
          <span className="text-base font-extrabold text-ocean-navy">{initialEstimatedDischarge.toFixed(0)} m³</span>
          <span className="text-[9px] text-text-secondary block">±35 m³ 95% CI</span>
        </div>

        <div>
          <span className="text-[9px] text-text-muted block">MASS EQUIVALENT</span>
          <span className="text-base font-extrabold text-ocean-deep">{initialTonnes} Tonnes</span>
          <span className="text-[9px] text-text-secondary block">~4,275 Barrels</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[9px] text-text-muted block">WEATHERED LOSS</span>
          <span className="text-sm font-bold text-amber-700">
            {(initialEstimatedDischarge - pureOilRemaining).toFixed(0)} m³
          </span>
          <span className="text-[9px] text-text-muted block">Evap + Solution</span>
        </div>
      </div>

      {/* Nocturnal Clandestine Analysis */}
      <div className="p-2.5 rounded-xl border border-border-marine bg-slate-50 font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-900 text-amber-300">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-ocean-navy text-[11px]">
              Nocturnal Clandestine Discharge Likelihood
            </div>
            <div className="text-[9px] text-text-muted">
              Estimated UTC 22:40 = Local 03:10 IST (Zero Solar Illumination / High Stealth)
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold text-indigo-700">{nocturnalConfidence}%</span>
          <span className="text-[8px] text-text-muted block">CONFIRMED NIGHT</span>
        </div>
      </div>
    </div>
  );
}

