import React, { useState } from 'react';
import { Eye, Layers, Sun, Activity, Sparkles } from 'lucide-react';

export const OPTICAL_INDICES = [
  {
    id: "ndwi",
    name: "NDWI (Water Contrast Index)",
    formula: "(B03_Green - B08_NIR) / (B03_Green + B08_NIR)",
    range: "+0.2 to +0.8",
    currentVal: "+0.64",
    desc: "Suppresses background sea water while isolating floating emulsion slicks."
  },
  {
    id: "fai",
    name: "FAI (Floating Algae Index)",
    formula: "R_NIR - [R_RED + (R_SWIR - R_RED) * (λ_NIR - λ_RED)/(λ_SWIR - λ_RED)]",
    range: "-0.05 to +0.25",
    currentVal: "-0.02 (Negative = Hydrocarbon)",
    desc: "Differentiates true petroleum slicks (negative FAI) from sargassum / biogenic algae blooms (positive FAI)."
  },
  {
    id: "false-color",
    name: "False Color Infrared (B8-B4-B3)",
    formula: "Red: NIR (B8), Green: Red (B4), Blue: Green (B3)",
    range: "Composite RGB",
    currentVal: "Active RGB Composite",
    desc: "Enhances chlorophyll absorption and specular reflectance of surface sheen."
  },
  {
    id: "swir-ratio",
    name: "SWIR Heavy Crude Ratio",
    formula: "B11_SWIR1 / B12_SWIR2 (1610nm / 2190nm)",
    range: "1.1 to 2.4",
    currentVal: "1.84",
    desc: "C-H vibration absorption at 1.73 µm and 2.3 µm marks weathered heavy crude."
  }
];

export default function OpticalSpectralIndexPanel({
  activeOpticalIndex = "ndwi",
  setActiveOpticalIndex,
  onApplyIndex
}) {
  const currentIndex = OPTICAL_INDICES.find(i => i.id === activeOpticalIndex) || OPTICAL_INDICES[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 12 · Multispectral Optical Band Calculator (Sentinel-2 MSI)
          </h3>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
          13 Bands (443nm - 2190nm)
        </span>
      </div>

      {/* Index Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {OPTICAL_INDICES.map((idx) => (
          <button
            key={idx.id}
            onClick={() => {
              setActiveOpticalIndex(idx.id);
              if (onApplyIndex) onApplyIndex(idx.id);
            }}
            className={`p-2 rounded-xl text-left border transition-all ${
              activeOpticalIndex === idx.id
                ? 'bg-ocean text-white border-ocean shadow-sm'
                : 'bg-ocean-light/40 hover:bg-ocean-sky border-border-marine text-text-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] truncate">{idx.name.split(' ')[0]}</span>
              <span className={`text-[9px] font-bold ${activeOpticalIndex === idx.id ? 'text-amber-200' : 'text-ocean'}`}>
                {idx.currentVal.split(' ')[0]}
              </span>
            </div>
            <span className={`text-[9px] block truncate mt-0.5 ${activeOpticalIndex === idx.id ? 'text-white/80' : 'text-text-muted'}`}>
              {idx.name}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Index Formula & Meaning */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-border-marine text-xs space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ocean-navy font-bold">{currentIndex.name}</span>
          <span className="text-ocean font-bold">Calculated: {currentIndex.currentVal}</span>
        </div>
        <p className="text-[10px] text-text-muted">
          <span className="font-bold text-ocean-deep">Formula:</span> {currentIndex.formula}
        </p>
        <p className="text-[10px] text-text-secondary">
          {currentIndex.desc}
        </p>
      </div>
    </div>
  );
}

