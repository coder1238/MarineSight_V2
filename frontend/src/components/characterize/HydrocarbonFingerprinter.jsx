import React, { useState } from 'react';
import { Flame, Activity, ShieldCheck, Dna, Info, Compass } from 'lucide-react';

export default function HydrocarbonFingerprinter() {
  const [selectedCrudeCandidate, setSelectedCrudeCandidate] = useState("arab-medium");

  const biomarkerRatios = [
    { label: "n-C17 / Pristane", value: "1.82", reference: "1.75 - 1.95 (Crude)", status: "Petrogenic Match" },
    { label: "n-C18 / Phytane", value: "1.46", reference: "1.30 - 1.60 (Marine)", status: "Suboxic Source" },
    { label: "Pristane / Phytane", value: "1.15", reference: "1.0 - 1.3 (Anoxic)", status: "Marine Kerogen" },
    { label: "Carbon Preference Index (CPI)", value: "1.02", reference: "1.00 ± 0.05", status: "Petroleum Origin" }
  ];

  const candidates = [
    { id: "arab-medium", name: "Arab Medium (Saudi Aramco)", match: 88.4, api: 24.8, sulfur: "2.14%", density: 0.892 },
    { id: "kuwait-export", name: "Kuwait Export Crude (KEC)", match: 76.2, api: 30.2, sulfur: "2.52%", density: 0.875 },
    { id: "basrah-heavy", name: "Basrah Heavy (SOMO Iraq)", match: 68.9, api: 23.5, sulfur: "3.80%", density: 0.912 },
    { id: "bunker-c", name: "Heavy Fuel Oil (HFO-380 / Bunker)", match: 42.1, api: 14.2, sulfur: "3.20%", density: 0.965 }
  ];

  // GC-MS Simulated Chromatogram Peaks (n-alkanes C12 to C30 + Pristane + Phytane)
  const chromatogramPeaks = [
    { name: "C12", height: 18, x: 25 },
    { name: "C14", height: 35, x: 50 },
    { name: "C15", height: 50, x: 75 },
    { name: "C16", height: 65, x: 100 },
    { name: "Pr", height: 52, x: 118, isIso: true },
    { name: "C17", height: 95, x: 125 },
    { name: "Ph", height: 48, x: 143, isIso: true },
    { name: "C18", height: 70, x: 150 },
    { name: "C20", height: 60, x: 180 },
    { name: "C22", height: 48, x: 210 },
    { name: "C24", height: 38, x: 240 },
    { name: "C26", height: 28, x: 270 },
    { name: "C28", height: 20, x: 300 },
    { name: "C30", height: 12, x: 330 }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Chemical Hydrocarbon Typing & GC-MS Biomarker Fingerprinter
          </h3>
        </div>
        <span className="text-[10px] font-mono text-ocean font-semibold">
          EPA Method 8270D (SIM Mode)
        </span>
      </div>

      {/* GC-MS Chromatogram Graphic */}
      <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>SIMULATED GC-MS CHROMATOGRAM (m/z 57, 85: ALKANES & ISOPRENOIDS)</span>
          <span className="text-amber-400">Pr/Ph = 1.15</span>
        </div>

        <svg viewBox="0 0 360 110" className="w-full h-24 overflow-visible select-none">
          {/* Baseline */}
          <line x1="15" y1="95" x2="350" y2="95" stroke="#475569" strokeWidth="1.5" />
          {/* Background hump representing UCM (Unresolved Complex Mixture from weathering) */}
          <path 
            d="M 25 95 Q 160 55 330 95 Z" 
            fill="rgba(244, 166, 42, 0.18)" 
          />

          {/* Chromatogram Peaks */}
          {chromatogramPeaks.map((peak, idx) => (
            <g key={peak.name}>
              <line 
                x1={peak.x} 
                y1="95" 
                x2={peak.x} 
                y2={95 - peak.height * 0.75} 
                stroke={peak.isIso ? "#38BDF8" : "#F8FAFC"} 
                strokeWidth={peak.isIso ? "2" : "1.5"} 
              />
              <text 
                x={peak.x} 
                y={95 - peak.height * 0.75 - 4} 
                textAnchor="middle" 
                fontSize="7" 
                fontFamily="monospace"
                fill={peak.isIso ? "#38BDF8" : "#94A3B8"}
                fontWeight={peak.isIso ? "bold" : "normal"}
              >
                {peak.name}
              </text>
            </g>
          ))}
        </svg>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800">
          <span>Elution Time (Minutes) →</span>
          <span className="text-slate-300">Shaded: Weathered UCM Hump</span>
        </div>
      </div>

      {/* Biomarker Diagnostic Ratios Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        {biomarkerRatios.map(ratio => (
          <div key={ratio.label} className="p-2 bg-ocean-light rounded-lg border border-border-marine">
            <span className="text-[9px] text-text-muted block truncate">{ratio.label}</span>
            <span className="text-base font-extrabold text-ocean-deep">{ratio.value}</span>
            <span className="text-[9px] text-status-success font-semibold block">{ratio.status}</span>
          </div>
        ))}
      </div>

      {/* Matching Crude Candidates */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono text-text-muted uppercase block">
          CRUDE OIL LIBRARY MATCH PROBABILITY (LLOYD'S / SINTEF SPEC)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {candidates.map(cand => (
            <div 
              key={cand.id} 
              onClick={() => setSelectedCrudeCandidate(cand.id)}
              className={`p-2 rounded-xl border cursor-pointer transition-all ${
                selectedCrudeCandidate === cand.id 
                  ? 'bg-ocean-light border-ocean shadow-marine-sm' 
                  : 'bg-white hover:bg-ocean-light/50 border-border-marine'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-ocean-navy text-xs truncate">{cand.name}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  cand.match > 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {cand.match}% Match
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary">
                <span>API: {cand.api}°</span>
                <span>Sulfur: {cand.sulfur}</span>
                <span>Density: {cand.density} g/cm³</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

