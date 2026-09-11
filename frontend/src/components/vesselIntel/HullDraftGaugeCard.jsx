import React, { useState } from 'react';
import { Anchor, ShieldCheck, Compass, Gauge, Droplet, ArrowDownUp } from 'lucide-react';

export default function HullDraftGaugeCard({ vessel }) {
  const [loadCondition, setLoadCondition] = useState('laden'); // 'laden' vs 'ballast'

  const scantlingDraftM = 16.2;
  const forwardDraftM = loadCondition === 'laden' ? 14.8 : 6.2;
  const aftDraftM = loadCondition === 'laden' ? 15.6 : 8.1;
  const meanDraftM = ((forwardDraftM + aftDraftM) / 2).toFixed(2);
  const trimM = (aftDraftM - forwardDraftM).toFixed(2);
  const displacementTonnes = loadCondition === 'laden' ? 154200 : 42800;

  // Waterline height percent relative to 18m freeboard depth
  const waterlinePct = Math.min(90, Math.max(20, (meanDraftM / 18.0) * 100));

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean">
            <Anchor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Hydrodynamic Draft, Waterline & Displacement Gauges
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Hull submersion, trim by stern, and ballast water convention compliance
            </p>
          </div>
        </div>

        {/* Load Condition Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLoadCondition('laden')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
              loadCondition === 'laden' 
                ? 'bg-ocean text-white' 
                : 'bg-ocean-light text-text-muted hover:bg-ocean-sky'
            }`}
          >
            Laden Cargo
          </button>
          <button
            onClick={() => setLoadCondition('ballast')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
              loadCondition === 'ballast' 
                ? 'bg-ocean text-white' 
                : 'bg-ocean-light text-text-muted hover:bg-ocean-sky'
            }`}
          >
            In Ballast
          </button>
        </div>
      </div>

      {/* Visual Hull Waterline Profile */}
      <div className="p-3 bg-ocean-light/70 rounded-xl border border-border-marine space-y-2">
        <div className="flex items-center justify-between text-[10px] text-text-secondary">
          <span>HULL WATERLINE PROFILE (PLIMSOLL MARK SUMMER LINE)</span>
          <span className="font-bold text-ocean-navy">{meanDraftM}m Mean Submersion</span>
        </div>

        {/* Diagram */}
        <div className="h-16 w-full bg-gradient-to-b from-sky-100 to-ocean-light rounded-lg relative overflow-hidden border border-border-marine flex items-end">
          {/* Water level fill */}
          <div 
            style={{ height: `${waterlinePct}%` }}
            className="w-full bg-gradient-to-t from-ocean-deep/90 to-ocean/70 relative transition-all duration-500"
          >
            {/* Waterline dashed line */}
            <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-status-danger flex items-center justify-between px-2 text-[9px] text-white font-bold">
              <span>BOW: {forwardDraftM}m</span>
              <span>SUMMER LOAD LINE (S): 16.2m</span>
              <span>STERN: {aftDraftM}m</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-text-muted">
          <span>Forward Perpendicular (FP)</span>
          <span className="text-ocean-deep font-bold">Trim by Stern: {trimM} m</span>
          <span>After Perpendicular (AP)</span>
        </div>
      </div>

      {/* Draft Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">MEAN DRAFT (TM)</span>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {meanDraftM} m
          </span>
          <span className="text-[9px] text-text-muted">Under-keel clear: 18.4m</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">DISPLACEMENT</span>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {displacementTonnes.toLocaleString()} MT
          </span>
          <span className="text-[9px] text-text-muted">{loadCondition.toUpperCase()} status</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">HULL LIST / HEEL</span>
          <span className="text-base font-bold text-text-primary mt-0.5 block">
            0.2° Stbd
          </span>
          <span className="text-[9px] text-text-muted">Within stability limits</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">BWM CONVENTION</span>
          <span className="text-base font-bold text-status-success mt-0.5 block">
            D-2 COMPLIANT
          </span>
          <span className="text-[9px] text-text-muted">Electro-chlorination</span>
        </div>
      </div>
    </div>
  );
}

