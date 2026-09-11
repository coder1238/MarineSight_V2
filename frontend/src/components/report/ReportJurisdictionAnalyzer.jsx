import React from 'react';
import { Compass, Globe, Anchor, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';

export default function ReportJurisdictionAnalyzer({ caseData }) {
  // Distance from baseline calculation (simulated from coordinates)
  const distFromCoastNm = 42.5;
  const isEEZ = distFromCoastNm > 12 && distFromCoastNm <= 200;
  const isTerritorial = distFromCoastNm <= 12;

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Maritime Jurisdiction & International Convention Analysis
            </h4>
            <p className="text-[10px] text-text-muted">
              Statutory sovereignty boundaries, boarding rights, and treaty applicability under UNCLOS 1982.
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-mono font-bold self-start sm:self-auto">
          INDIAN EXCLUSIVE ECONOMIC ZONE (EEZ)
        </span>
      </div>

      {/* Jurisdiction KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Distance to Baseline</span>
          <span className="text-lg font-bold text-ocean-deep">{distFromCoastNm} nm</span>
          <span className="text-[9px] text-text-muted block">Offshore Western Seaboard</span>
        </div>
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Sovereign Zone</span>
          <span className="text-lg font-bold text-teal-700">EEZ (200 nm Zone)</span>
          <span className="text-[9px] text-text-muted block">UNCLOS Article 56</span>
        </div>
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Enforcement Power</span>
          <span className="text-lg font-bold text-ocean-navy">Full Coastal Right</span>
          <span className="text-[9px] text-text-muted block">UNCLOS Article 220(3)</span>
        </div>
        <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Compensation Fund</span>
          <span className="text-lg font-bold text-status-success">1992 CLC & IOPC</span>
          <span className="text-[9px] text-text-muted block">Tier 2/3 Cap: 203M SDR</span>
        </div>
      </div>

      {/* Applicable Treaties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-mono">
        <div className="p-3 bg-ocean-light/30 border border-border-marine rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-ocean-navy text-[11px]">
            <Scale className="w-3.5 h-3.5 text-ocean" />
            <span>UNCLOS 1982 (Article 220 - Enforcement by Coastal States)</span>
          </div>
          <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
            Where there is clear objective evidence that a vessel navigating in the EEZ has committed a violation resulting in a discharge causing major damage, the coastal state may cause proceedings, including detention of the vessel.
          </p>
        </div>

        <div className="p-3 bg-ocean-light/30 border border-border-marine rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-ocean-navy text-[11px]">
            <Anchor className="w-3.5 h-3.5 text-ocean" />
            <span>Indian Coast Guard Act, 1978 (Section 14)</span>
          </div>
          <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
            Statutory duty to take such measures as are necessary of the preservation and protection of maritime environment and to prevent and control marine pollution in the maritime zones of India.
          </p>
        </div>
      </div>
    </div>
  );
}

