import React, { useState } from 'react';
import { Columns, Eye, Calendar, Sparkles, AlertTriangle, ArrowLeftRight } from 'lucide-react';

export default function MultiTemporalSwipeCompare({
  isOpen,
  onClose,
  currentImage,
  baselineImage = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1000&q=80"
}) {
  const [swipePosition, setSwipePosition] = useState(50); // 0 to 100%
  const [diffThreshold, setDiffThreshold] = useState(3.5); // dB threshold for change detection
  const [showDiffMask, setShowDiffMask] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-mono">
      <div className="bg-white border border-border-marine rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-marine flex items-center justify-between bg-ocean-light/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ocean/10 border border-ocean/30 flex items-center justify-center">
              <Columns className="w-4 h-4 text-ocean" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ocean-navy uppercase tracking-wide">
                Feature 3 · Multi-Temporal SAR Change Detection & Swipe-Compare
              </h2>
              <p className="text-[11px] text-text-muted">
                Differential backscatter analysis (Sentinel-1 SAR IW): Baseline (T - 7 Days) vs Crisis Observation (T - 0 Days)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-xl border border-border-marine hover:bg-slate-100 font-bold text-text-secondary"
          >
            ✕ Close
          </button>
        </div>

        {/* Comparison Viewer Toolbar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-border-marine flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="text-text-muted font-bold">LEFT:</span>
              <span className="text-ocean-navy font-bold">Baseline Pre-Spill (2026-09-05)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-text-muted font-bold">RIGHT:</span>
              <span className="text-status-danger font-bold">Crisis Incident Scene (2026-09-12)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-ocean-navy">
              <input
                type="checkbox"
                checked={showDiffMask}
                onChange={(e) => setShowDiffMask(e.target.checked)}
                className="accent-ocean rounded"
              />
              <span>Highlight Negative Delta Mask (&Delta;&sigma;&sup0; &lt; -3.5 dB)</span>
            </label>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-text-muted">Split:</span>
              <span className="font-bold text-ocean">{swipePosition}%</span>
            </div>
          </div>
        </div>

        {/* Swipe Canvas Area */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-[#071724] select-none overflow-hidden">
          {/* Baseline Image (Full Background) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={baselineImage}
              alt="Pre-Spill Baseline SAR"
              className="w-full h-full object-cover filter contrast-125 grayscale"
            />
            {/* Baseline Tag */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-white text-[11px] z-10">
              📅 Baseline: T - 7 Days (Clean Sea Surface)
            </div>
          </div>

          {/* Crisis Image (Clipped to Swipe Position) */}
          <div
            className="absolute inset-0 h-full overflow-hidden transition-none border-r-2 border-cyan-400 shadow-2xl"
            style={{ width: `${swipePosition}%` }}
          >
            <div className="absolute inset-0 w-full h-full" style={{ width: '100vw', maxWidth: '1024px' }}>
              <img
                src={currentImage || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=80"}
                alt="Crisis Incident SAR"
                className="w-full h-full object-cover filter contrast-130 brightness-90"
              />
              {showDiffMask && (
                <div className="absolute inset-0 bg-red-600/20 mix-blend-color-burn pointer-events-none">
                  <div className="absolute top-1/3 left-1/4 w-72 h-44 rounded-full bg-red-500/40 blur-xl"></div>
                </div>
              )}
            </div>
            {/* Crisis Tag */}
            <div className="absolute top-4 right-4 bg-red-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-red-500/40 text-red-300 text-[11px] z-10">
              ⚠️ Crisis: T - 0 Days (Slick Damping Observed)
            </div>
          </div>

          {/* Interactive Drag Handle Divider */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-20 flex items-center justify-center shadow-lg"
            style={{ left: `${swipePosition}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-[#0B2545] border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-xl">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* Native Slider Overlay for direct drag */}
          <input
            type="range"
            min="0"
            max="100"
            value={swipePosition}
            onChange={(e) => setSwipePosition(parseInt(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
          />
        </div>

        {/* Footer Statistics */}
        <div className="px-6 py-3 border-t border-border-marine bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
            <span className="text-[9px] text-text-muted block">BASELINE MEAN &sigma;&sup0;</span>
            <span className="text-sm font-bold text-ocean-navy">-8.2 dB</span>
            <span className="text-[9.5px] text-text-secondary block">Normal Capillary Roughness</span>
          </div>
          <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
            <span className="text-[9px] text-text-muted block">CRISIS ANOMALY MEAN &sigma;&sup0;</span>
            <span className="text-sm font-bold text-status-danger">-22.4 dB</span>
            <span className="text-[9.5px] text-text-secondary block">Severe Wave Damping</span>
          </div>
          <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
            <span className="text-[9px] text-text-muted block">MAX ATTENUATION (&Delta;&sigma;&sup0;)</span>
            <span className="text-sm font-bold text-ocean">-14.2 dB</span>
            <span className="text-[9.5px] text-status-success font-bold block">P &lt; 0.0001 (Definite Anomaly)</span>
          </div>
          <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
            <span className="text-[9px] text-text-muted block">CORRELATION FACTOR</span>
            <span className="text-sm font-bold text-ocean-navy">0.14</span>
            <span className="text-[9.5px] text-text-secondary block">Statistically novel feature</span>
          </div>
        </div>
      </div>
    </div>
  );
}

