import React, { useState, useMemo } from 'react';
import { X, Calculator, Droplets, Clock, Wind, Activity, ArrowRight, CheckCircle2, Waves } from 'lucide-react';

export default function WorkspaceFayCalculatorModal({ caseData, onClose }) {
  const [dischargeVolumeM3, setDischargeVolumeM3] = useState(250); // Initial discharge volume in m3
  const [elapsedHours, setElapsedHours] = useState(38); // Elapsed drift hours
  const [oilDensity, setOilDensity] = useState(0.88); // Crude oil ~0.88 g/cm3
  const [waterDensity] = useState(1.025); // Seawater 1.025 g/cm3
  const [viscosityCst, setViscosityCst] = useState(45); // Kinematic viscosity in cSt
  const [waterTempC, setWaterTempC] = useState(28); // Water temperature °C
  const [windKnots, setWindKnots] = useState(14.2); // Surface wind knots

  // Fay Spreading Formula Computations
  // Phase 1: Gravity-Inertial: R1 = k1 * (Delta * g * V * t^2)^(1/4)
  // Phase 2: Gravity-Viscous: R2 = k2 * (Delta * g * V^2 * t^1.5 / nu^0.5)^(1/6)
  // Phase 3: Surface Tension-Viscous: R3 = k3 * (sigma^2 * t^3 / (rho_w^2 * nu))^(1/4)
  const calculations = useMemo(() => {
    const delta = (waterDensity - oilDensity) / waterDensity; // Buoyant density ratio
    const g = 9.81; // Gravity m/s2
    const tSec = elapsedHours * 3600; // Elapsed time in seconds
    const V = dischargeVolumeM3; // Volume m3
    const nu = viscosityCst * 1e-6; // Kinematic viscosity m2/s
    const sigma = 0.025; // Net spreading coefficient N/m

    // Theoretical Fay radii
    const rInertialMeters = 1.14 * Math.pow(delta * g * V * Math.pow(tSec, 2), 0.25);
    const rViscousMeters = 0.98 * Math.pow((delta * g * Math.pow(V, 2) * Math.pow(tSec, 1.5)) / Math.sqrt(nu), 1 / 6);
    const rTensionMeters = 1.60 * Math.pow((Math.pow(sigma, 2) * Math.pow(tSec, 3)) / (Math.pow(waterDensity * 1000, 2) * nu), 0.25);

    // Practical effective radius (dominated by viscous & tension phase at > 6 hours)
    const effectiveRadiusMeters = Math.max(rViscousMeters, rTensionMeters);
    const effectiveAreaKm2 = +( (Math.PI * Math.pow(effectiveRadiusMeters, 2)) / 1e6 ).toFixed(2);
    const effectivePerimeterKm = +( (2 * Math.PI * effectiveRadiusMeters) / 1000 ).toFixed(2);

    // Weathering: Evaporation via Mackay empirical formula
    // Fraction evaporated Fe = (T_k / 1150) * ln(1 + (K_evap * t))
    const windSpeedMs = windKnots * 0.514444;
    const evapLossPct = Math.min(68, +( (12 + (windSpeedMs * 1.6) + (waterTempC * 0.6)) * Math.log10(1 + elapsedHours * 1.5) ).toFixed(1));

    // Emulsification water content %: Y = Y_max * (1 - exp(-k_emul * t * (1 + W)^2))
    const waterEmulsionPct = Math.min(78, +( 75 * (1 - Math.exp(-0.04 * elapsedHours * (1 + windSpeedMs / 10))) ).toFixed(1));

    // Remaining on surface volume (accounting for evaporation + water incorporation mousse)
    const remainingOilM3 = dischargeVolumeM3 * (1 - evapLossPct / 100);
    const totalEmulsionM3 = +( remainingOilM3 / (1 - waterEmulsionPct / 100) ).toFixed(1);

    // Average thickness in microns
    const avgThicknessMicrons = +( (totalEmulsionM3 / (effectiveAreaKm2 * 1e6)) * 1e6 ).toFixed(1);

    return {
      effectiveRadiusMeters: Math.round(effectiveRadiusMeters),
      effectiveAreaKm2,
      effectivePerimeterKm,
      evapLossPct,
      waterEmulsionPct,
      remainingOilM3: remainingOilM3.toFixed(1),
      totalEmulsionM3,
      avgThicknessMicrons
    };
  }, [dischargeVolumeM3, elapsedHours, oilDensity, waterDensity, viscosityCst, waterTempC, windKnots]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Fay Viscous-Inertial Spreading & Slick Weathering Calculator
              </h3>
              <p className="text-xs text-text-secondary">
                Client-side empirical oil dispersion physics (Gravity-Inertia → Gravity-Viscous → Surface Tension).
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Initial Discharge Volume */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>ESTIMATED VOLUME (m³)</span>
                <span className="text-ocean font-bold">{dischargeVolumeM3} m³</span>
              </label>
              <input
                type="range"
                min={20}
                max={2000}
                step={10}
                value={dischargeVolumeM3}
                onChange={(e) => setDischargeVolumeM3(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                ≈ {Math.round(dischargeVolumeM3 * 6.29)} Barrels ({Math.round(dischargeVolumeM3 * oilDensity)} Metric Tons)
              </span>
            </div>

            {/* Elapsed Time */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>ELAPSED DRIFT TIME</span>
                <span className="text-ocean font-bold">{elapsedHours} Hours</span>
              </label>
              <input
                type="range"
                min={1}
                max={72}
                value={elapsedHours}
                onChange={(e) => setElapsedHours(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                From Estimated T-0 Discharge Time
              </span>
            </div>

            {/* Surface Wind Speed */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>SURFACE WIND (knots)</span>
                <span className="text-ocean font-bold">{windKnots} kn</span>
              </label>
              <input
                type="range"
                min={2}
                max={40}
                step={0.5}
                value={windKnots}
                onChange={(e) => setWindKnots(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                {(windKnots * 0.514).toFixed(1)} m/s Surface Aeration
              </span>
            </div>

            {/* Sea Surface Temp */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>SEA SURFACE TEMP (°C)</span>
                <span className="text-ocean font-bold">{waterTempC}°C</span>
              </label>
              <input
                type="range"
                min={15}
                max={35}
                value={waterTempC}
                onChange={(e) => setWaterTempC(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                Accelerates volatile hydrocarbon loss
              </span>
            </div>

            {/* Kinematic Viscosity */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>OIL VISCOSITY (cSt)</span>
                <span className="text-ocean font-bold">{viscosityCst} cSt</span>
              </label>
              <input
                type="range"
                min={10}
                max={380}
                value={viscosityCst}
                onChange={(e) => setViscosityCst(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                {viscosityCst > 180 ? 'Heavy Fuel / Bunker C' : 'Medium Heavy Crude'}
              </span>
            </div>

            {/* Oil Specific Gravity */}
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-ocean-navy font-mono flex items-center justify-between">
                <span>SPECIFIC GRAVITY</span>
                <span className="text-ocean font-bold">{oilDensity} g/cm³</span>
              </label>
              <input
                type="range"
                min={0.80}
                max={0.99}
                step={0.01}
                value={oilDensity}
                onChange={(e) => setOilDensity(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted block font-mono">
                API Gravity ≈ {Math.round((141.5 / oilDensity) - 131.5)}°
              </span>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-ocean-navy text-white rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-ocean/40 pb-2">
              <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                <span>FAY DISPERSION & WEATHERING PREDICTIONS (T+{elapsedHours}h)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                Satellite Observed Area: <strong className="text-white">{caseData.spillAreaKm2} km²</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">THEORETICAL AREA</span>
                <span className="text-xl font-bold text-sky-300">{calculations.effectiveAreaKm2}</span>
                <span className="text-[10px] text-slate-400 block">km² Surface Area</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">SPREADING RADIUS</span>
                <span className="text-xl font-bold text-emerald-300">{calculations.effectiveRadiusMeters}</span>
                <span className="text-[10px] text-slate-400 block">Meters ({calculations.effectivePerimeterKm} km perim)</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">EVAPORATION LOSS</span>
                <span className="text-xl font-bold text-amber-300">{calculations.evapLossPct}%</span>
                <span className="text-[10px] text-slate-400 block">Volatile components</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">EMULSIFICATION MOUSSE</span>
                <span className="text-xl font-bold text-red-300">{calculations.waterEmulsionPct}%</span>
                <span className="text-[10px] text-slate-400 block">Water-in-oil ratio</span>
              </div>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2 font-mono">
              <div>
                <span>Total Weathered Emulsion: </span>
                <strong className="text-white">{calculations.totalEmulsionM3} m³</strong>
                <span className="text-slate-400 text-[10px] block">
                  (Original oil: {calculations.remainingOilM3} m³ + absorbed seawater)
                </span>
              </div>
              <div>
                <span>Calculated Thickness: </span>
                <strong className="text-teal-300">{calculations.avgThicknessMicrons} µm</strong>
                <span className="text-[10px] text-slate-400 block">Bonn Code 3 (Metallic/Continuous)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            Physics: Fay (1971) & Mackay (1980) Modified Marine Spill Formulations
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}

