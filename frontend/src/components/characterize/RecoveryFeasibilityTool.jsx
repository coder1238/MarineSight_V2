import React, { useState, useMemo } from 'react';
import { Anchor, ShieldCheck, Clock, Check, Copy, AlertTriangle, Ship, Zap } from 'lucide-react';

export default function RecoveryFeasibilityTool({ 
  caseData,
  totalAreaKm2 = 14.7,
  coreFraction = 0.38,
  viscosityCst = 3200 
}) {
  const [swathWidthM, setSwathWidthM] = useState(120);
  const [towingSpeedKn, setTowingSpeedKn] = useState(1.0);
  const [skimmerPumpCapM3h, setSkimmerPumpCapM3h] = useState(80);
  const [copiedHash, setCopiedHash] = useState(false);

  // Recovery logistics calculations
  const logistics = useMemo(() => {
    // Towing speed in m/s (1 kn ~ 0.514 m/s)
    const speedMs = towingSpeedKn * 0.514444;
    // Core slick thickness average in meters (approx 150 um)
    const thicknessM = 150e-6;

    // Encounter Rate: E_R = swath (m) * speed (m/s) * thickness (m) * 3600 (s/hr)
    const encounterRateM3h = +(swathWidthM * speedMs * thicknessM * 3600).toFixed(1);
    const encounterRateBblh = +(encounterRateM3h * 6.2898).toFixed(1);

    // Thick core volume in m3 (approx coreFraction of total area * 100um)
    const coreVolM3 = totalAreaKm2 * 1e6 * coreFraction * 120e-6;

    // Operational recovery time
    const effectiveRecoveryRate = Math.min(encounterRateM3h, skimmerPumpCapM3h);
    const hoursToRecover = +(coreVolM3 / (effectiveRecoveryRate || 1)).toFixed(1);

    // Dispersant feasibility
    const isDispersantViable = viscosityCst < 10000;
    const dispersantWindowHours = Math.max(0, +((10000 - viscosityCst) / 240).toFixed(1));

    return {
      encounterRateM3h,
      encounterRateBblh,
      coreVolM3: Math.round(coreVolM3),
      hoursToRecover,
      isDispersantViable,
      dispersantWindowHours
    };
  }, [swathWidthM, towingSpeedKn, skimmerPumpCapM3h, totalAreaKm2, coreFraction, viscosityCst]);

  // Deterministic Mock SHA-256 Digest for forensic evidence
  const forensicHash = useMemo(() => {
    const raw = `${caseData?.incidentId || 'OF-2026-0912'}_${totalAreaKm2}_${caseData?.coordinates?.display || '14.82N'}_MARPOL_ANNEX_I`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `SHA256: 7f8a9e${hex}c43b91a8e2098b67f102ad543c98ef76`;
  }, [caseData, totalAreaKm2]);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(forensicHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Anchor className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Operational Response Logistics & Forensic Integrity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-success font-semibold">
          Tier 2 Response Modeling
        </span>
      </div>

      {/* Dispersant Window of Opportunity Banner */}
      <div className={`p-3 rounded-xl border font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        logistics.isDispersantViable 
          ? 'bg-emerald-50 border-emerald-200 text-status-success' 
          : 'bg-red-50 border-red-200 text-status-danger'
      }`}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <div>
            <span className="font-bold block">
              {logistics.isDispersantViable ? "DISPERSANT APPLICATION VIABLE" : "DISPERSANT WINDOW EXPIRED"}
            </span>
            <span className="text-[10px] text-text-secondary">
              Viscosity: {viscosityCst.toLocaleString()} cSt (Max Treatable: 10,000 cSt)
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold block">
            {logistics.dispersantWindowHours} Hours Remaining
          </span>
          <span className="text-[10px] text-text-secondary">Type III Concentrate (1:25 DOR)</span>
        </div>
      </div>

      {/* Mechanical Skimming Logistics Inputs & Outputs */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-[10px] text-text-muted uppercase block">
          MECHANICAL BOOM & SKIMMER ENCOUNTER RATE (ER = W × V × T)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine">
          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>BOOM SWATH WIDTH</span>
              <span className="font-bold text-ocean-navy">{swathWidthM} Meters</span>
            </div>
            <input 
              type="range"
              min="50"
              max="250"
              step="10"
              value={swathWidthM}
              onChange={(e) => setSwathWidthM(Number(e.target.value))}
              className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>TOWING SPEED</span>
              <span className="font-bold text-ocean-navy">{towingSpeedKn} Knots</span>
            </div>
            <input 
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={towingSpeedKn}
              onChange={(e) => setTowingSpeedKn(Number(e.target.value))}
              className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-text-muted mb-1">
              <span>SKIMMER CAPACITY</span>
              <span className="font-bold text-ocean-navy">{skimmerPumpCapM3h} m³/hr</span>
            </div>
            <input 
              type="range"
              min="20"
              max="200"
              step="10"
              value={skimmerPumpCapM3h}
              onChange={(e) => setSkimmerPumpCapM3h(Number(e.target.value))}
              className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
            />
          </div>
        </div>

        {/* Calculated Logistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
            <span className="text-[9px] text-text-muted block">ENCOUNTER RATE</span>
            <span className="text-base font-extrabold text-ocean-deep">{logistics.encounterRateM3h} m³/h</span>
            <span className="text-[9px] text-text-muted block">{logistics.encounterRateBblh} bbl/hr</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
            <span className="text-[9px] text-text-muted block">CORE TARGET VOLUME</span>
            <span className="text-base font-extrabold text-text-primary">{logistics.coreVolM3} m³</span>
            <span className="text-[9px] text-text-muted block">38% Heavy Emulsion</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
            <span className="text-[9px] text-text-muted block">RECOVERY DURATION</span>
            <span className="text-base font-extrabold text-status-warning">{logistics.hoursToRecover} Hours</span>
            <span className="text-[9px] text-text-muted block">Single Skimmer Pair</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine">
            <span className="text-[9px] text-text-muted block">RECOMMENDED FLEET</span>
            <span className="text-base font-extrabold text-ocean-navy">2 VOSS + 1 Tug</span>
            <span className="text-[9px] text-text-muted block">RO-BOOM 1500 Array</span>
          </div>
        </div>
      </div>

      {/* Forensic Chain of Custody Stamp */}
      <div className="p-2.5 bg-slate-900 rounded-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-slate-400 block">IMO MARPOL ANNEX I FORENSIC DIGEST</span>
            <span className="text-[11px] text-sky-300 font-bold truncate block select-all">
              {forensicHash}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyHash}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] flex items-center gap-1.5 shrink-0 transition-colors"
        >
          {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-sky-400" />}
          <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
        </button>
      </div>
    </div>
  );
}

