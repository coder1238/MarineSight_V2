import React, { useState } from 'react';
import { X, Sparkles, Activity, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';

export default function WorkspaceChromatographyModal({ caseData, onClose }) {
  const [selectedVesselSample, setSelectedVesselSample] = useState('mv-ocean-star');

  // Biomarker ratios
  const sampleProfiles = {
    'slick-surface': {
      name: "Slick Sea Surface Sample (SAR Centroid)",
      pristanePhytane: 1.14,
      c17Pristane: 1.82,
      c18Phytane: 1.65,
      c29HopaneRatio: 0.84,
      sulfurPct: 2.38,
      apiGravity: 31.4
    },
    'mv-ocean-star': {
      name: "MV Ocean Star (Engine Slop Tank #3)",
      pristanePhytane: 1.16,
      c17Pristane: 1.85,
      c18Phytane: 1.63,
      c29HopaneRatio: 0.85,
      sulfurPct: 2.41,
      apiGravity: 31.2,
      matchConfidence: 97.4,
      isMatch: true
    },
    'mt-sea-sovereign': {
      name: "MT Sea Sovereign (Cargo Residue Slop)",
      pristanePhytane: 0.72,
      c17Pristane: 2.40,
      c18Phytane: 0.95,
      c29HopaneRatio: 1.25,
      sulfurPct: 0.85,
      apiGravity: 38.6,
      matchConfidence: 41.2,
      isMatch: false
    },
    'mv-nord-atlantic': {
      name: "MV Nord Atlantic (HFO Fuel Bunker)",
      pristanePhytane: 1.68,
      c17Pristane: 1.10,
      c18Phytane: 2.15,
      c29HopaneRatio: 0.42,
      sulfurPct: 3.10,
      apiGravity: 22.1,
      matchConfidence: 33.7,
      isMatch: false
    }
  };

  const slick = sampleProfiles['slick-surface'];
  const suspect = sampleProfiles[selectedVesselSample];

  // Alkane distribution peaks (n-C12 to n-C30)
  const alkanes = ['C12', 'C14', 'C16', 'C17', 'Pr', 'C18', 'Ph', 'C20', 'C22', 'C24', 'C26', 'C28', 'C30'];
  const slickHeights = [15, 28, 52, 78, 64, 72, 58, 48, 38, 30, 22, 16, 9];
  const suspectHeights = selectedVesselSample === 'mv-ocean-star' 
    ? [14, 27, 54, 76, 65, 71, 59, 47, 39, 29, 23, 15, 10]
    : [35, 45, 60, 42, 30, 40, 25, 65, 55, 45, 35, 25, 15];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-sm">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Hydrocarbon GC-FID Fingerprint Matcher
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                  ASTM D3328 FORENSIC PROTOCOL
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Gas Chromatography & flame ionization biomarker alignment between sea surface slick and bunker samples.
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

        {/* Suspect Sample Selector */}
        <div className="p-4 border-b border-border-marine bg-white flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-text-muted font-bold">COMPARE SUSPECT SAMPLE:</span>
            <select
              value={selectedVesselSample}
              onChange={e => setSelectedVesselSample(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-ocean-light text-ocean-navy font-bold focus:outline-none cursor-pointer"
            >
              <option value="mv-ocean-star">MV Ocean Star (Engine Slop Tank #3)</option>
              <option value="mt-sea-sovereign">MT Sea Sovereign (Cargo Residue)</option>
              <option value="mv-nord-atlantic">MV Nord Atlantic (Bunker Fuel)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
              suspect.isMatch ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-status-danger border border-red-200'
            }`}>
              {suspect.isMatch ? `✓ POSITIVE BIOMARKER MATCH (${suspect.matchConfidence}%)` : `✕ MISMATCH (${suspect.matchConfidence}%)`}
            </span>
          </div>
        </div>

        {/* GC-FID Spectral Peak Visualizer */}
        <div className="p-4 bg-slate-950 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Slick Sample (Surface)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {suspect.name}
              </span>
            </div>
            <span>Retention Time Window (Minutes)</span>
          </div>

          {/* Bar / Peak Comparison Chart */}
          <div className="h-44 flex items-end justify-between gap-2 px-4 pt-4 border-b border-slate-800">
            {alkanes.map((label, idx) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  {/* Slick bar */}
                  <div
                    style={{ height: `${slickHeights[idx]}%` }}
                    className="w-2.5 bg-sky-400 rounded-t-sm transition-all duration-300"
                    title={`Slick ${label}: ${slickHeights[idx]}%`}
                  />
                  {/* Suspect bar */}
                  <div
                    style={{ height: `${suspectHeights[idx]}%` }}
                    className={`w-2.5 rounded-t-sm transition-all duration-300 ${
                      suspect.isMatch ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    title={`Suspect ${label}: ${suspectHeights[idx]}%`}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Ratio Table */}
        <div className="p-4 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-[10px] text-text-muted uppercase border-b border-border-marine">
              <tr>
                <th className="px-3 py-2">BIOMARKER RATIO</th>
                <th className="px-3 py-2">SLICK SAMPLE</th>
                <th className="px-3 py-2">SUSPECT VESSEL</th>
                <th className="px-3 py-2">VARIANCE</th>
                <th className="px-3 py-2">CORROBORATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-marine/60">
              <tr>
                <td className="px-3 py-2.5 font-bold text-ocean-navy">Pristane / Phytane (Pr/Ph)</td>
                <td className="px-3 py-2.5 text-sky-700 font-bold">{slick.pristanePhytane}</td>
                <td className="px-3 py-2.5 text-amber-700 font-bold">{suspect.pristanePhytane}</td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.pristanePhytane - suspect.pristanePhytane).toFixed(2)}
                </td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.pristanePhytane - suspect.pristanePhytane) < 0.05 ? (
                    <span className="text-emerald-600 font-bold">✓ IDENTICAL</span>
                  ) : (
                    <span className="text-red-500 font-bold">✕ DEVIANT</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-ocean-navy">n-C17 / Pristane</td>
                <td className="px-3 py-2.5 text-sky-700 font-bold">{slick.c17Pristane}</td>
                <td className="px-3 py-2.5 text-amber-700 font-bold">{suspect.c17Pristane}</td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.c17Pristane - suspect.c17Pristane).toFixed(2)}
                </td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.c17Pristane - suspect.c17Pristane) < 0.1 ? (
                    <span className="text-emerald-600 font-bold">✓ IDENTICAL</span>
                  ) : (
                    <span className="text-red-500 font-bold">✕ DEVIANT</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-ocean-navy">C29/C30 Hopane Index</td>
                <td className="px-3 py-2.5 text-sky-700 font-bold">{slick.c29HopaneRatio}</td>
                <td className="px-3 py-2.5 text-amber-700 font-bold">{suspect.c29HopaneRatio}</td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.c29HopaneRatio - suspect.c29HopaneRatio).toFixed(2)}
                </td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.c29HopaneRatio - suspect.c29HopaneRatio) < 0.05 ? (
                    <span className="text-emerald-600 font-bold">✓ IDENTICAL</span>
                  ) : (
                    <span className="text-red-500 font-bold">✕ DEVIANT</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-ocean-navy">Sulfur Content (% wt)</td>
                <td className="px-3 py-2.5 text-sky-700 font-bold">{slick.sulfurPct}%</td>
                <td className="px-3 py-2.5 text-amber-700 font-bold">{suspect.sulfurPct}%</td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.sulfurPct - suspect.sulfurPct).toFixed(2)}%
                </td>
                <td className="px-3 py-2.5">
                  {Math.abs(slick.sulfurPct - suspect.sulfurPct) < 0.1 ? (
                    <span className="text-emerald-600 font-bold">✓ IDENTICAL</span>
                  ) : (
                    <span className="text-red-500 font-bold">✕ DEVIANT</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            ASTM D3328-06 Standard Test Methods for Comparison of Waterborne Petroleum Oils.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
          >
            Close Fingerprint Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

