import React, { useState } from 'react';
import { Filter, Palette, Check, RefreshCw } from 'lucide-react';

export const COLORMAP_PRESETS = [
  { id: "grayscale", label: "Grayscale SAR (Raw)", preview: "from-black via-slate-500 to-white", filterCss: "grayscale(100%)" },
  { id: "viridis", label: "Viridis (Thermal)", preview: "from-[#440154] via-[#21908C] to-[#FDE725]", filterCss: "hue-rotate(240deg) saturate(220%) contrast(120%)" },
  { id: "plasma", label: "Plasma (High Contrast)", preview: "from-[#0d0887] via-[#cc4778] to-[#f0f921]", filterCss: "hue-rotate(280deg) saturate(260%) contrast(130%)" },
  { id: "magma", label: "Magma (IR Heat)", preview: "from-[#000004] via-[#b73779] to-[#fcffa4]", filterCss: "sepia(70%) hue-rotate(310deg) saturate(200%)" },
  { id: "turbo", label: "Turbo (Doppler Rainbow)", preview: "from-[#30123b] via-[#28bbec] to-[#a2fc3c]", filterCss: "hue-rotate(180deg) saturate(250%) contrast(115%)" },
  { id: "radar-green", label: "Tactical Night Vision", preview: "from-black via-[#006622] to-[#39FF14]", filterCss: "sepia(100%) hue-rotate(85deg) saturate(350%) contrast(140%)" },
  { id: "oceanic-cyan", label: "SAR Backscatter Cyan", preview: "from-[#05111B] via-[#087EA4] to-[#00E5FF]", filterCss: "sepia(80%) hue-rotate(150deg) saturate(280%) contrast(125%)" }
];

export const SPECKLE_FILTERS = [
  { id: "none", name: "None (Raw Speckle)", enl: 1.0, speckleIndex: 0.52, desc: "Unfiltered radar backscatter with Rayleigh multiplicative speckle noise." },
  { id: "lee", name: "Lee Despeckle (Adaptive)", enl: 4.8, speckleIndex: 0.22, desc: "Minimizes multiplicative speckle while preserving sharp linear slick boundaries." },
  { id: "frost", name: "Frost Exponential Filter", enl: 5.6, speckleIndex: 0.18, desc: "Exponentially damped filter optimal for high-gradient oil-water interfaces." },
  { id: "gamma-map", name: "Gamma-MAP Filter", enl: 6.2, speckleIndex: 0.15, desc: "Bayesian Maximum A Posteriori estimator tailored for Gamma-distributed SAR intensity." },
  { id: "sobel", name: "Sobel Edge Delineator", enl: 2.1, speckleIndex: 0.40, desc: "Computes 2D spatial gradient magnitude to detect steep slick damping perimeters." },
  { id: "median", name: "Median Smoothing (5×5)", enl: 3.9, speckleIndex: 0.26, desc: "Rank-order non-linear filter eliminating isolated bright ship spikes and impulsive noise." },
  { id: "otsu", name: "Otsu Adaptive Binarizer", enl: 8.5, speckleIndex: 0.08, desc: "Optimal intra-class variance thresholding separating dark hydrocarbon from sea clutter." }
];

export default function SarSpatialFilterPanel({
  activeFilter,
  setActiveFilter,
  filterStrength,
  setFilterStrength,
  activeColormap,
  setActiveColormap,
  onReset
}) {
  const [kernelSize, setKernelSize] = useState(5);
  const currentFilterMeta = SPECKLE_FILTERS.find(f => f.id === activeFilter) || SPECKLE_FILTERS[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 1 & 14 · SAR Speckle Filters & Thermal Colormaps
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-mono text-text-muted hover:text-ocean flex items-center gap-1 transition-colors"
          title="Reset filters to standard raw"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Speckle Filter Selector */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
          <span className="text-text-muted font-bold">DESPECKLING ALGORITHM</span>
          <span className="text-ocean font-bold">ENL: {currentFilterMeta.enl} · Speckle: {currentFilterMeta.speckleIndex}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
          {SPECKLE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-lg text-left transition-all border ${
                activeFilter === f.id
                  ? 'bg-ocean text-white font-bold border-ocean shadow-sm'
                  : 'bg-ocean-light/50 hover:bg-ocean-sky border-border-marine/50 text-text-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-[11px]">{f.name.split(' ')[0]}</span>
                {activeFilter === f.id && <Check className="w-3 h-3 flex-shrink-0" />}
              </div>
              <span className={`text-[9px] block ${activeFilter === f.id ? 'text-white/80' : 'text-text-muted'}`}>
                ENL {f.enl}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[10px] font-mono text-text-muted leading-tight bg-ocean-light/30 p-1.5 rounded border border-border-marine/30">
          <span className="font-bold text-ocean-navy">{currentFilterMeta.name}:</span> {currentFilterMeta.desc}
        </p>
      </div>

      {/* Filter Parameters: Kernel & Intensity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>FILTER INTENSITY / GAIN</span>
            <span className="text-ocean font-bold">{filterStrength}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filterStrength}
            onChange={(e) => setFilterStrength(parseInt(e.target.value))}
            className="w-full h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>KERNEL WINDOW SIZE</span>
            <span className="text-ocean font-bold">{kernelSize} × {kernelSize} px</span>
          </div>
          <div className="flex gap-1.5">
            {[3, 5, 7, 9].map((k) => (
              <button
                key={k}
                onClick={() => setKernelSize(k)}
                className={`flex-1 py-1 rounded text-[11px] font-bold border transition-all ${
                  kernelSize === k
                    ? 'bg-ocean-navy text-white border-ocean-navy'
                    : 'bg-white hover:bg-slate-100 border-border-marine text-text-secondary'
                }`}
              >
                {k}×{k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colormap LUT Presets (Feature 14) */}
      <div className="pt-2 border-t border-border-marine">
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <span className="text-text-muted font-bold flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-ocean" />
            <span>THERMAL / LUT COLORMAP PALETTES</span>
          </span>
          <span className="text-[10px] text-ocean-bright font-bold uppercase">{activeColormap}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {COLORMAP_PRESETS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveColormap(c.id)}
              className={`p-1.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                activeColormap === c.id
                  ? 'border-ocean ring-2 ring-ocean/30 bg-ocean-sky/40'
                  : 'border-border-marine/60 hover:border-ocean/50 bg-white'
              }`}
            >
              <div className={`h-3.5 w-full rounded bg-gradient-to-r ${c.preview} border border-black/10`} />
              <span className="text-[9.5px] font-mono text-ocean-navy truncate font-medium">{c.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

