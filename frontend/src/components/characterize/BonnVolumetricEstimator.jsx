import React, { useState, useMemo } from 'react';
import { Layers, Sliders, Info, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const BONN_CODES = [
  {
    code: 1,
    name: "Sheen (Silvery / Grey)",
    thicknessMin: 0.04,
    thicknessNom: 0.15,
    thicknessMax: 0.30,
    unit: "µm",
    color: "#E2E8F0",
    textColor: "#334155",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-300",
    description: "Barely visible silvery sheen reflecting light"
  },
  {
    code: 2,
    name: "Rainbow Sheen",
    thicknessMin: 0.30,
    thicknessNom: 2.0,
    thicknessMax: 5.0,
    unit: "µm",
    color: "#FDE047",
    textColor: "#854D0E",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
    description: "Multi-colored interference fringe band"
  },
  {
    code: 3,
    name: "Metallic Sheen",
    thicknessMin: 5.0,
    thicknessNom: 25.0,
    thicknessMax: 50.0,
    unit: "µm",
    color: "#94A3B8",
    textColor: "#1E293B",
    badgeBg: "bg-slate-200 text-slate-800 border-slate-400",
    description: "True color masked by intense metallic reflection"
  },
  {
    code: 4,
    name: "Discontinuous True Oil",
    thicknessMin: 50.0,
    thicknessNom: 100.0,
    thicknessMax: 200.0,
    unit: "µm",
    color: "#78350F",
    textColor: "#FEF3C7",
    badgeBg: "bg-amber-900 text-amber-100 border-amber-800",
    description: "Brown to black dark patches separated by sheen"
  },
  {
    code: 5,
    name: "Continuous True Oil",
    thicknessMin: 200.0,
    thicknessNom: 350.0,
    thicknessMax: 600.0,
    unit: "µm",
    color: "#0F172A",
    textColor: "#F8FAFC",
    badgeBg: "bg-slate-900 text-white border-slate-700",
    description: "Deep black, thick continuous emulsion core"
  }
];

export const BONN_PRESETS = {
  standard: { label: "Standard Weathered (Default)", distribution: [35, 25, 15, 15, 10] },
  freshSheen: { label: "Fresh Light Sheen (Spreading)", distribution: [55, 30, 10, 5, 0] },
  heavyCore: { label: "Heavy Core Discharge (Crude)", distribution: [15, 15, 20, 25, 25] },
  dispersed: { label: "Dispersed / Aged Sheen", distribution: [50, 35, 10, 5, 0] }
};

export default function BonnVolumetricEstimator({ totalAreaKm2 = 14.7, oilDensityKgM3 = 890 }) {
  // Distribution percentages for codes 1 to 5 (sum to 100)
  const [percentages, setPercentages] = useState([35, 25, 15, 15, 10]);
  const [activePreset, setActivePreset] = useState("standard");

  const handlePercentageChange = (index, newVal) => {
    setActivePreset("custom");
    const val = Math.max(0, Math.min(100, Number(newVal) || 0));
    setPercentages(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  const applyPreset = (key) => {
    if (BONN_PRESETS[key]) {
      setPercentages([...BONN_PRESETS[key].distribution]);
      setActivePreset(key);
    }
  };

  const normalizeTo100 = () => {
    const sum = percentages.reduce((a, b) => a + b, 0);
    if (sum === 0) {
      setPercentages([20, 20, 20, 20, 20]);
      return;
    }
    const normalized = percentages.map(p => Math.round((p / sum) * 100));
    // adjust rounding error to exactly 100
    const currentSum = normalized.reduce((a, b) => a + b, 0);
    normalized[0] += (100 - currentSum);
    setPercentages(normalized);
  };

  // Calculations
  const calculations = useMemo(() => {
    const sumPerc = percentages.reduce((a, b) => a + b, 0) || 1;
    let minVolM3 = 0;
    let nomVolM3 = 0;
    let maxVolM3 = 0;

    const breakdown = BONN_CODES.map((item, idx) => {
      const frac = (percentages[idx] || 0) / sumPerc;
      const subAreaKm2 = totalAreaKm2 * frac;
      const subAreaM2 = subAreaKm2 * 1_000_000;

      // Vol = Area (m2) * thickness (m)
      const minV = subAreaM2 * (item.thicknessMin * 1e-6);
      const nomV = subAreaM2 * (item.thicknessNom * 1e-6);
      const maxV = subAreaM2 * (item.thicknessMax * 1e-6);

      minVolM3 += minV;
      nomVolM3 += nomV;
      maxVolM3 += maxV;

      return {
        ...item,
        percentage: ((frac * 100).toFixed(1)),
        subAreaKm2: subAreaKm2.toFixed(2),
        nomVolM3: nomV.toFixed(1),
        nomBarrels: (nomV * 6.2898).toFixed(0)
      };
    });

    const nomBarrels = nomVolM3 * 6.2898;
    const nomMassTonnes = (nomVolM3 * oilDensityKgM3) / 1000;
    const minMassTonnes = (minVolM3 * oilDensityKgM3) / 1000;
    const maxMassTonnes = (maxVolM3 * oilDensityKgM3) / 1000;

    return {
      breakdown,
      minVolM3: Math.round(minVolM3),
      nomVolM3: Math.round(nomVolM3),
      maxVolM3: Math.round(maxVolM3),
      nomBarrels: Math.round(nomBarrels),
      minBarrels: Math.round(minVolM3 * 6.2898),
      maxBarrels: Math.round(maxVolM3 * 6.2898),
      nomMassTonnes: Math.round(nomMassTonnes),
      minMassTonnes: Math.round(minMassTonnes),
      maxMassTonnes: Math.round(maxMassTonnes),
      sumPercentage: sumPerc
    };
  }, [percentages, totalAreaKm2, oilDensityKgM3]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ocean" />
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Bonn Agreement Oil Appearance Code (BAOAC) Volume Profiler
            </h3>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            International statutory standard for airborne & satellite thickness classification and volumetric estimation.
          </p>
        </div>

        {/* Presets & Normalize Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(BONN_PRESETS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                activePreset === key 
                  ? 'bg-ocean text-white font-bold' 
                  : 'bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine'
              }`}
            >
              {key === 'standard' ? 'Standard' : key === 'freshSheen' ? 'Sheen' : key === 'heavyCore' ? 'Heavy Core' : 'Dispersed'}
            </button>
          ))}
          <button
            onClick={normalizeTo100}
            title="Normalize percentages to sum to 100%"
            className="p-1 rounded bg-ocean-light hover:bg-ocean-sky text-ocean border border-border-marine text-[10px] flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="font-mono text-[10px]">100%</span>
          </button>
        </div>
      </div>

      {/* Volumetric Results Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-ocean-light to-white border border-border-marine">
          <span className="text-[9px] text-text-muted block uppercase">Nominal Spill Volume</span>
          <span className="text-base sm:text-lg font-extrabold text-ocean-deep">
            {calculations.nomVolM3.toLocaleString()} <span className="text-xs font-semibold">m³</span>
          </span>
          <span className="text-[9px] text-text-muted block">
            [{calculations.minVolM3.toLocaleString()} – {calculations.maxVolM3.toLocaleString()} m³]
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-gradient-to-br from-ocean-light to-white border border-border-marine">
          <span className="text-[9px] text-text-muted block uppercase">Standard Barrels</span>
          <span className="text-base sm:text-lg font-extrabold text-text-primary">
            {calculations.nomBarrels.toLocaleString()} <span className="text-xs font-semibold">bbl</span>
          </span>
          <span className="text-[9px] text-text-muted block">
            [{calculations.minBarrels.toLocaleString()} – {calculations.maxBarrels.toLocaleString()} bbl]
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-gradient-to-br from-ocean-light to-white border border-border-marine">
          <span className="text-[9px] text-text-muted block uppercase">Estimated Oil Mass</span>
          <span className="text-base sm:text-lg font-extrabold text-status-warning">
            {calculations.nomMassTonnes.toLocaleString()} <span className="text-xs font-semibold">MT</span>
          </span>
          <span className="text-[9px] text-text-muted block">
            @ {oilDensityKgM3} kg/m³ density
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-gradient-to-br from-ocean-light to-white border border-border-marine">
          <span className="text-[9px] text-text-muted block uppercase">Core Heavy Oil (Code 4+5)</span>
          <span className="text-base sm:text-lg font-extrabold text-status-danger">
            {(((percentages[3] + percentages[4]) / calculations.sumPercentage) * 100).toFixed(0)}%
          </span>
          <span className="text-[9px] text-text-muted block">
            Primary skimming target
          </span>
        </div>
      </div>

      {/* Visual Color Bar Stack */}
      <div>
        <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-1">
          <span>THICKNESS DISTRIBUTION COMPOSITE</span>
          <span>Sum: {percentages.reduce((a,b)=>a+b,0)}%</span>
        </div>
        <div className="h-3.5 w-full rounded-lg overflow-hidden flex border border-border-marine shadow-inner">
          {calculations.breakdown.map((item) => (
            <div
              key={item.code}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color
              }}
              title={`Code ${item.code} (${item.name}): ${item.percentage}% | ${item.nomVolM3} m³`}
              className="h-full transition-all duration-300 relative group cursor-pointer border-r border-black/10 last:border-none"
            />
          ))}
        </div>
      </div>

      {/* Interactive Code Breakdown Sliders Table */}
      <div className="space-y-2">
        {calculations.breakdown.map((item, idx) => (
          <div 
            key={item.code} 
            className="p-2 rounded-xl bg-ocean-light/60 hover:bg-ocean-light border border-border-marine/60 transition-colors text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${item.badgeBg}`}>
                  CODE {item.code}
                </span>
                <span className="font-semibold text-ocean-navy text-[11px]">{item.name}</span>
                <span className="text-[10px] text-text-muted font-mono">
                  ({item.thicknessMin} – {item.thicknessMax} {item.unit})
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-text-muted">
                  Area: <strong className="text-ocean-navy">{item.subAreaKm2} km²</strong>
                </span>
                <span className="text-text-muted">
                  Vol: <strong className="text-ocean-deep">{item.nomVolM3} m³</strong>
                </span>
                <span className="font-bold text-ocean-navy min-w-[42px] text-right">
                  {percentages[idx]}%
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={percentages[idx]}
                onChange={(e) => handlePercentageChange(idx, e.target.value)}
                className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

