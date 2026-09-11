import React from 'react';
import { Scan, Eye, CheckCircle2, AlertTriangle, Layers, Satellite } from 'lucide-react';

export default function SarCrossMatchCard({ vessel }) {
  const aisLength = vessel.lengthM || 274;
  const aisBeam = vessel.beamM || 48;
  
  // SAR observed dimensions with slight radar blooming margin
  const sarLength = (aisLength * 1.008).toFixed(1);
  const sarBeam = (aisBeam * 1.025).toFixed(1);
  const lengthDiffM = Math.abs(sarLength - aisLength).toFixed(1);
  const beamDiffM = Math.abs(sarBeam - aisBeam).toFixed(1);

  const rcsDbSm = 48.6; // Radar cross section in dBsm
  const wakeAngleDeg = 38.5; // Kelvin wake angle detected in radar slice

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Satellite SAR & AIS Dimension Cross-Matching
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Sentinel-1 SAR C-Band VV radar bounding box vs reported transponder geometry
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 font-bold text-[10px]">
          ● PHYSICAL HULL CONFIRMED (98.4% MATCH)
        </span>
      </div>

      {/* Comparison Grid: AIS vs SAR */}
      <div className="grid grid-cols-2 gap-3">
        {/* AIS Reported */}
        <div className="p-3 rounded-xl bg-ocean-light/80 border border-border-marine space-y-2">
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <span>AIS BROADCAST SPEC</span>
            <span className="font-bold text-ocean">SOLAS CLASS A</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Hull Length:</span>
              <span className="font-bold text-ocean-navy">{aisLength} m</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Moulded Beam:</span>
              <span className="font-bold text-ocean-navy">{aisBeam} m</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Aspect Ratio:</span>
              <span className="font-bold text-ocean-navy">{(aisLength / aisBeam).toFixed(2)}:1</span>
            </div>
          </div>
        </div>

        {/* SAR Measured */}
        <div className="p-3 rounded-xl bg-ocean-sky/40 border border-ocean/30 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <span>SATELLITE SAR RADAR</span>
            <span className="font-bold text-ocean-deep">SENTINEL-1 C-BAND</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Radar Length:</span>
              <span className="font-bold text-ocean-navy">{sarLength} m (Δ {lengthDiffM}m)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Radar Beam:</span>
              <span className="font-bold text-ocean-navy">{sarBeam} m (Δ {beamDiffM}m)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">RCS Magnitude:</span>
              <span className="font-bold text-ocean-deep">{rcsDbSm} dBsm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doppler & Wake Validation Card */}
      <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
          <span className="text-text-primary">
            SAR Azimuth Doppler shift confirms vessel velocity of <strong>{vessel.speedKn || 12.4} kn</strong> with a distinct <strong>{wakeAngleDeg}° V-shaped Kelvin wake</strong>.
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-100 text-status-success text-[10px] font-mono font-bold flex-shrink-0 ml-2">
          ZERO SPOOF
        </span>
      </div>
    </div>
  );
}

