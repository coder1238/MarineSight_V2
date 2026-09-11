import React, { useState, useMemo } from 'react';
import { X, Calculator, ShieldCheck, AlertTriangle, Droplets, Wind, Thermometer, Compass, Anchor, FileCheck2, Scale } from 'lucide-react';

const BONN_CODES = [
  { code: 1, name: "Silvery / Grey Sheen", thicknessMicrons: 0.1, minThick: 0.04, maxThick: 0.30, lPerKm2: 100, desc: "Barely visible optical reflection on water surface." },
  { code: 2, name: "Rainbow Sheen", thicknessMicrons: 1.5, minThick: 0.30, maxThick: 5.0, lPerKm2: 1500, desc: "Characteristic prism colored rainbow reflection." },
  { code: 3, name: "Metallic Sheen", thicknessMicrons: 15.0, minThick: 5.0, maxThick: 50.0, lPerKm2: 15000, desc: "Reflects metallic surface tint of the true oil color." },
  { code: 4, name: "Discontinuous True Oil", thicknessMicrons: 100.0, minThick: 50.0, maxThick: 200.0, lPerKm2: 100000, desc: "Dark patches interspersed with metallic/rainbow sheen." },
  { code: 5, name: "Continuous True Oil", thicknessMicrons: 250.0, minThick: 200.0, maxThick: 400.0, lPerKm2: 250000, desc: "Heavy continuous black/brown slick emulsion layer." }
];

const OIL_TYPES = [
  { id: "bunker", name: "Heavy Bunker C / IFO 380", density: 0.98, apiGravity: 12.5, persistence: "High", dispersibility: "Low / Mechanical Skim Preferred" },
  { id: "crude", name: "Crude Oil (Bombay High / Arabian Light)", density: 0.86, apiGravity: 33.0, persistence: "Medium-High", dispersibility: "High (Within 48h)" },
  { id: "diesel", name: "Marine Gasoil / Light Diesel (MDO)", density: 0.83, apiGravity: 38.0, persistence: "Low / High Evaporation", dispersibility: "Natural Dispersion" }
];

export default function IncidentForensicCalculatorModal({ 
  incident, 
  onClose, 
  onApplyCalculations 
}) {
  const [areaKm2, setAreaKm2] = useState(incident?.areaKm2 || incident?.spillAreaKm2 || 14.7);
  const [coveragePct, setCoveragePct] = useState(85);
  const [bonnCode, setBonnCode] = useState(3); // Default Metallic
  const [selectedOilType, setSelectedOilType] = useState("bunker");
  const [windKnots, setWindKnots] = useState(14);
  const [seaTempC, setSeaTempC] = useState(28);

  // Dynamic calculations
  const results = useMemo(() => {
    const selectedBonn = BONN_CODES.find(b => b.code === bonnCode) || BONN_CODES[2];
    const oil = OIL_TYPES.find(o => o.id === selectedOilType) || OIL_TYPES[0];

    // Effective slick area considering coverage percentage
    const effectiveAreaKm2 = (areaKm2 * (coveragePct / 100));

    // Volume in m3: thickness in microns * 10^-6 m * area in m2 (1 km2 = 10^6 m2)
    // => thickness in microns * area in km2 = m3
    const volumeM3 = +(effectiveAreaKm2 * selectedBonn.thicknessMicrons).toFixed(2);
    
    // Barrels: 1 m3 ~ 6.2898 US barrels
    const volumeBarrels = Math.round(volumeM3 * 6.2898);

    // Metric Tons: volumeM3 * density
    const metricTons = +(volumeM3 * oil.density).toFixed(1);

    // Containment boom required (perimeter + 20% anchoring slack)
    const estPerimeterKm = +(Math.sqrt(areaKm2) * 4.2).toFixed(1);
    const boomMetersNeeded = Math.round(estPerimeterKm * 1000 * 0.35); // 35% of perimeter for diversionary containment

    // Skimmer throughput needed (assuming 48h daylight response window)
    const skimmerM3PerHr = +(volumeM3 / 36).toFixed(1);

    // Tier Classification (NOS-DCP & ITOPF)
    let tier = "Tier 1";
    let tierDesc = "Local Port / Facility Response (Under 50 MT)";
    let tierColor = "text-status-info bg-blue-50 border-blue-200";
    if (metricTons > 500) {
      tier = "Tier 3";
      tierDesc = "National Maritime Disaster (Over 500 MT) - Mobilize NOS-DCP & Naval Coast Guard";
      tierColor = "text-status-danger bg-red-50 border-red-200";
    } else if (metricTons > 50) {
      tier = "Tier 2";
      tierDesc = "Regional Maritime Response (50 - 500 MT) - State Pollution Control & Coast Guard District";
      tierColor = "text-status-warning bg-amber-50 border-amber-200";
    }

    // Dispersant Feasibility
    let dispersantFeasible = true;
    let dispersantReason = "Favorable water temperature (>20°C) and moderate sea state suitable for Type II/III dispersants.";
    if (selectedOilType === "bunker" && selectedBonn.code >= 4) {
      dispersantFeasible = false;
      dispersantReason = "High viscosity (>10,000 cSt) of emulsified bunker limits chemical dispersant efficacy. Mechanical recovery required.";
    } else if (windKnots < 5) {
      dispersantReason = "Low mixing energy due to light wind. Mechanical skimming or propeller wash agitation recommended.";
    }

    return {
      effectiveAreaKm2: effectiveAreaKm2.toFixed(2),
      volumeM3,
      volumeBarrels,
      metricTons,
      boomMetersNeeded,
      skimmerM3PerHr,
      tier,
      tierDesc,
      tierColor,
      dispersantFeasible,
      dispersantReason,
      oil
    };
  }, [areaKm2, coveragePct, bonnCode, selectedOilType, windKnots, seaTempC]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-border-marine overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ocean-navy">
                  Forensic Spill Volume & Response Tier Calculator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-ocean-light text-ocean text-[10px] font-mono font-bold">
                  BONN AGREEMENT & ITOPF
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Standardized maritime quantification of hydrocarbon volume, containment logistics, and MARPOL liability.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border-marine hover:bg-white text-text-muted hover:text-ocean-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid: Left Controls, Right Analytical Results */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Controls Column (5 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-border-marine space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ocean-navy font-mono flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-ocean" />
                <span>1. Slick Geometry & Sensor Area</span>
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-semibold text-text-secondary">Measured Polygon Footprint:</label>
                  <span className="font-mono font-bold text-ocean-deep">{areaKm2} km²</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.1"
                  value={areaKm2}
                  onChange={(e) => setAreaKm2(parseFloat(e.target.value))}
                  className="w-full accent-ocean"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label className="font-semibold text-text-secondary">Surface Patchiness / Coverage:</label>
                  <span className="font-mono font-bold text-ocean-deep">{coveragePct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={coveragePct}
                  onChange={(e) => setCoveragePct(parseInt(e.target.value))}
                  className="w-full accent-ocean"
                />
              </div>
            </div>

            {/* Bonn Agreement Thickness Selector */}
            <div className="bg-slate-50 p-4 rounded-xl border border-border-marine space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ocean-navy font-mono flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-ocean" />
                <span>2. Bonn Agreement Oil Appearance Code</span>
              </h3>

              <div className="space-y-1.5">
                {BONN_CODES.map((item) => (
                  <label
                    key={item.code}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      bonnCode === item.code
                        ? 'bg-ocean-light/50 border-ocean ring-1 ring-ocean/30'
                        : 'bg-white border-border-marine hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bonnCode"
                      checked={bonnCode === item.code}
                      onChange={() => setBonnCode(item.code)}
                      className="mt-0.5 text-ocean focus:ring-ocean"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ocean-navy font-mono">
                          Code {item.code}: {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">
                          ~{item.thicknessMicrons} µm ({item.lPerKm2.toLocaleString()} L/km²)
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Environmental & Fuel Conditions */}
            <div className="bg-slate-50 p-4 rounded-xl border border-border-marine space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ocean-navy font-mono flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-ocean" />
                <span>3. Hydrocarbon Classification</span>
              </h3>

              <select
                value={selectedOilType}
                onChange={(e) => setSelectedOilType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border-marine bg-white font-semibold text-ocean-navy focus:outline-none"
              >
                {OIL_TYPES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} (Density: {o.density} t/m³)
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <label className="text-text-muted block mb-1 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5" /> Wind Speed:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={windKnots}
                      onChange={(e) => setWindKnots(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1 rounded border border-border-marine font-mono text-xs"
                    />
                    <span className="text-text-muted text-[11px]">kts</span>
                  </div>
                </div>

                <div>
                  <label className="text-text-muted block mb-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" /> Sea Temp:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={seaTempC}
                      onChange={(e) => setSeaTempC(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1 rounded border border-border-marine font-mono text-xs"
                    />
                    <span className="text-text-muted text-[11px]">°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytical Calculation Output (7 cols) */}
          <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Quantified Volume KPI Cards */}
              <div className="bg-gradient-to-br from-ocean-deep to-slate-900 text-white p-5 rounded-2xl border border-cyan-900/50 shadow-marine-md space-y-3">
                <span className="text-[10px] font-mono uppercase text-cyan-300 tracking-wider">
                  ESTIMATED HYDROCARBON SPILL QUANTITY
                </span>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10">
                  <div>
                    <div className="text-[10px] text-white/60 font-mono">VOLUME (M³)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
                      {results.volumeM3.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-white/60 font-mono">BARRELS (BBL)</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400 mt-0.5">
                      {results.volumeBarrels.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-white/60 font-mono">METRIC TONS</div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-0.5">
                      {results.metricTons.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-white/70 pt-2 border-t border-white/10 flex items-center justify-between font-mono">
                  <span>Effective Slick Area: <b>{results.effectiveAreaKm2} km²</b></span>
                  <span>Specific Gravity: <b>{results.oil.density}</b></span>
                </div>
              </div>

              {/* Response Tier Assessment */}
              <div className={`p-4 rounded-xl border ${results.tierColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider">
                    NATIONAL CONTINGENCY CLASSIFICATION
                  </span>
                  <span className="font-mono font-black text-sm">{results.tier}</span>
                </div>
                <p className="text-xs mt-1 font-medium">{results.tierDesc}</p>
              </div>

              {/* Resource Requirements Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-border-marine space-y-2.5 text-xs">
                <h4 className="font-bold text-ocean-navy flex items-center gap-1.5 font-mono text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Logistical Containment Mobilization Assets</span>
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-border-marine/50">
                    <span className="text-text-secondary">Containment Booms Required:</span>
                    <span className="font-mono font-bold text-ocean-navy">~{results.boomMetersNeeded.toLocaleString()} meters</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-marine/50">
                    <span className="text-text-secondary">Min. Skimmer Recovery Rate:</span>
                    <span className="font-mono font-bold text-ocean-navy">{results.skimmerM3PerHr} m³/hr continuous</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-marine/50">
                    <span className="text-text-secondary">Dispersant Suitability:</span>
                    <span className={`font-bold ${results.dispersantFeasible ? 'text-status-success' : 'text-status-danger'}`}>
                      {results.dispersantFeasible ? 'Feasible (Type II/III)' : 'Not Recommended'}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
                    {results.dispersantReason}
                  </div>
                </div>
              </div>

              {/* Legal Liability Reference */}
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Statutory Penalties (Merchant Shipping Act Sec 356J)</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Unreported deliberate discharge in EEZ carries mandatory seizure of suspect vessel, environmental remediation bonds up to ₹10 Crore ($1.2M USD), and master detainment.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-border-marine flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border-marine text-xs text-text-secondary hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onApplyCalculations) {
                    onApplyCalculations({
                      calculatedVolumeM3: results.volumeM3,
                      calculatedTons: results.metricTons,
                      calculatedTier: results.tier
                    });
                  }
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs shadow-sm transition-all"
              >
                Apply to Case Dossier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

