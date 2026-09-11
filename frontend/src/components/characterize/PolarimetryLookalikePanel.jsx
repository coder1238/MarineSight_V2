import React, { useState } from 'react';
import { Radio, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Layers, Zap } from 'lucide-react';

export default function PolarimetryLookalikePanel({ windSpeedKn = 14.2, confidence = 96.8 }) {
  const [activeTab, setActiveTab] = useState("lookalike"); // "lookalike" or "polarimetry"

  const lookalikes = [
    {
      name: "True Mineral Hydrocarbon",
      probability: 91.8,
      status: "CONFIRMED",
      color: "bg-emerald-500",
      description: "Thick oil slick with strong capillary-gravity wave damping in C-band."
    },
    {
      name: "Biogenic Surfactant (Fish Oil/Bloom)",
      probability: 4.2,
      status: "RULED OUT",
      color: "bg-slate-400",
      description: "Monomolecular film. Ruled out by high VV/VH damping ratio (>5.8 dB)."
    },
    {
      name: "Low-Wind Calm Sea Patch (<3 m/s)",
      probability: 2.1,
      status: "RULED OUT",
      color: "bg-slate-400",
      description: `Ambient wind is ${windSpeedKn} kn (>3 m/s threshold). Damping is localized.`
    },
    {
      name: "Oceanic Internal Waves",
      probability: 1.1,
      status: "RULED OUT",
      color: "bg-slate-400",
      description: "Lacks alternating bright/dark periodic crest-trough modulation."
    },
    {
      name: "Rain Cell Downburst / Wind Shadow",
      probability: 0.8,
      status: "RULED OUT",
      color: "bg-slate-400",
      description: "No atmospheric rain ring attenuation or squall front observed."
    }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            SAR Polarimetry & False-Positive Neural Discriminator
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-ocean-light p-0.5 rounded-lg border border-border-marine">
          <button
            onClick={() => setActiveTab("lookalike")}
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
              activeTab === "lookalike"
                ? "bg-ocean text-white shadow-sm"
                : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Look-Alike Discriminator
          </button>
          <button
            onClick={() => setActiveTab("polarimetry")}
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
              activeTab === "polarimetry"
                ? "bg-ocean text-white shadow-sm"
                : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Dual-Pol VV/VH
          </button>
        </div>
      </div>

      {activeTab === "lookalike" ? (
        /* Look-Alike Discriminator Tab */
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <div>
                <span className="font-bold text-status-success block">MINERAL HYDROCARBON POSITIVE</span>
                <span className="text-[10px] text-text-secondary">Bayesian Multi-Class Neural Discriminator Model</span>
              </div>
            </div>
            <span className="text-base font-extrabold text-status-success">91.8%</span>
          </div>

          {/* Probability Bars */}
          <div className="space-y-2">
            {lookalikes.map((item, idx) => (
              <div key={item.name} className="p-2 rounded-xl bg-ocean-light/50 border border-border-marine/60 text-xs">
                <div className="flex items-center justify-between font-mono mb-1">
                  <div className="flex items-center gap-1.5">
                    {idx === 0 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="font-semibold text-ocean-navy text-[11px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                    <span className="font-bold text-ocean-navy w-10 text-right">{item.probability}%</span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-border-marine rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full ${item.color} rounded-full`} 
                    style={{ width: `${item.probability}%` }}
                  />
                </div>
                <p className="text-[10px] text-text-muted font-mono">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Dual-Pol Polarimetry Tab */
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">CO-POL σ⁰_VV</span>
              <span className="text-sm font-extrabold text-ocean-deep">-24.6 dB</span>
              <span className="text-[9px] text-status-danger block">Δσ⁰: -6.2 dB (Sea: -18.4)</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">CROSS-POL σ⁰_VH</span>
              <span className="text-sm font-extrabold text-text-primary">-29.9 dB</span>
              <span className="text-[9px] text-status-danger block">Δσ⁰: -3.8 dB (Sea: -26.1)</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">POL-RATIO (VV/VH)</span>
              <span className="text-sm font-extrabold text-ocean">+5.3 dB</span>
              <span className="text-[9px] text-text-muted block">Bragg Damping Ratio</span>
            </div>

            <div className="p-2 rounded-lg bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">CLOUDE ENTROPY (H)</span>
              <span className="text-sm font-extrabold text-status-warning">0.38</span>
              <span className="text-[9px] text-text-muted block">Low Entropy Surface</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span>POLARIMETRIC SCATTERING MECHANISM</span>
              <span className="text-ocean-bright">MEAN ALPHA: 22.4°</span>
            </div>

            <div className="text-[10px] text-slate-300 leading-relaxed font-sans">
              Strong suppression of short gravity-capillary surface waves (wavelength ~ 5.6 cm) confirms a visco-elastic slick boundary. Bragg scattering is attenuated by <strong className="text-white">6.2 dB</strong> in VV channel with cross-channel depolarization consistent with crude hydrocarbon films rather than plant/algal monomolecular surfactants.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

