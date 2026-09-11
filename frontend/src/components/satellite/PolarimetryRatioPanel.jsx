import React from 'react';
import { Radio, Zap, Info, ShieldCheck, Activity } from 'lucide-react';

export default function PolarimetryRatioPanel({
  polarizationMode = "vv-vh",
  setPolarizationMode,
  sigmaVV = -19.4,
  sigmaVH = -27.8
}) {
  const ratioLinear = Math.pow(10, (sigmaVV - sigmaVH) / 10).toFixed(2);
  const deltaDb = (sigmaVV - sigmaVH).toFixed(1);
  const entropy = (0.38 + (Math.abs(sigmaVV) / 50) * 0.4).toFixed(2);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 2 · Dual-Polarization & VV/VH Ratio Decomposition
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean-deep px-2 py-0.5 rounded font-bold border border-border-marine">
          C-Band (5.405 GHz)
        </span>
      </div>

      {/* Polarization Mode Selector */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { id: "vv", label: "VV (Co-Pol)", sub: "Bragg Surface Roughness", val: `${sigmaVV} dB` },
          { id: "vh", label: "VH (Cross-Pol)", sub: "Volume & Dark Targets", val: `${sigmaVH} dB` },
          { id: "vv-vh", label: "VV / VH Ratio", sub: "Depolarization Index", val: `+${deltaDb} dB` }
        ].map((pol) => (
          <button
            key={pol.id}
            onClick={() => setPolarizationMode(pol.id)}
            className={`p-2 rounded-xl text-left border transition-all ${
              polarizationMode === pol.id
                ? 'bg-ocean text-white border-ocean shadow-sm'
                : 'bg-ocean-light/40 hover:bg-ocean-sky border-border-marine text-text-secondary'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px]">{pol.label}</span>
              <span className={`text-[10px] font-bold ${polarizationMode === pol.id ? 'text-cyan-200' : 'text-ocean'}`}>
                {pol.val}
              </span>
            </div>
            <span className={`text-[9.5px] block truncate ${polarizationMode === pol.id ? 'text-white/80' : 'text-text-muted'}`}>
              {pol.sub}
            </span>
          </button>
        ))}
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">CO-POL SIGMA-0 (VV)</span>
          <span className="text-sm font-bold text-ocean-navy">{sigmaVV} dB</span>
          <span className="text-[9px] text-text-secondary block">Damped: -11.2 dB drop</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">CROSS-POL (VH)</span>
          <span className="text-sm font-bold text-ocean-navy">{sigmaVH} dB</span>
          <span className="text-[9px] text-text-secondary block">NESZ Margin: +6.4 dB</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">CO/CROSS RATIO</span>
          <span className="text-sm font-bold text-status-success">+{deltaDb} dB ({ratioLinear}×)</span>
          <span className="text-[9px] text-text-secondary block">Mineral Film Signature</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">POLARIMETRIC ENTROPY (H)</span>
          <span className="text-sm font-bold text-ocean">{entropy}</span>
          <span className="text-[9px] text-text-secondary block">Low entropy specular</span>
        </div>
      </div>

      {/* Physics Explanation Banner */}
      <div className="p-2 rounded-xl bg-ocean-sky/40 border border-ocean/20 text-[10.5px] text-ocean-deep flex items-start gap-2">
        <Activity className="w-3.5 h-3.5 text-ocean flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Surface Film Damping:</span> Crude oils suppress ocean capillary gravity waves (wavelength ~3-5 cm), drastically reducing Bragg backscatter in VV polarization. The <span className="font-bold text-ocean-navy">VV/VH ratio &gt; 8.0 dB</span> confirms mineral oil rather than natural biogenic sheen.
        </p>
      </div>
    </div>
  );
}

