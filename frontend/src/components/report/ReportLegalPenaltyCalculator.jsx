import React, { useState, useEffect } from 'react';
import { Scale, AlertTriangle, ShieldCheck, FileCheck, DollarSign } from 'lucide-react';

export default function ReportLegalPenaltyCalculator({ bonnTonnes, onUpdatePenalties, onLogAudit }) {
  const [intent, setIntent] = useState('deliberate'); // 'deliberate' | 'negligent' | 'accidental'
  const [vesselGT, setVesselGT] = useState(45000); // Gross Tonnage
  const [inProtectedZone, setInProtectedZone] = useState(true); // Near marine reserve / EEZ sensitive area

  const calculatePenalties = () => {
    const tonnes = bonnTonnes || 420;
    
    // Base rate per tonne: ₹1.2 Lakh (~$1,440) per metric tonne for cleanup
    let baseRemediationInrLakh = tonnes * 1.2;
    
    // Intent multiplier
    let intentMultiplier = intent === 'deliberate' ? 2.5 : (intent === 'negligent' ? 1.5 : 1.0);
    
    // Protected zone multiplier
    let zoneMultiplier = inProtectedZone ? 1.8 : 1.0;

    // Statutory statutory penalty under Indian Merchant Shipping Act Part XIA (Sec 356):
    // Up to ₹10 Crore for deliberate discharge without reporting, plus daily recurring fines
    let statutoryFineCrore = intent === 'deliberate' ? 10.0 : (intent === 'negligent' ? 5.0 : 1.5);

    // Total environmental remediation escrow bond
    let totalRemediationCrore = (baseRemediationInrLakh * intentMultiplier * zoneMultiplier) / 100;
    let grandTotalCrore = parseFloat((statutoryFineCrore + totalRemediationCrore).toFixed(2));
    let grandTotalUsd = parseFloat((grandTotalCrore / 8.35).toFixed(2)); // Approx 1 USD = 83.5 INR

    return {
      statutoryFineCrore,
      remediationBondCrore: parseFloat(totalRemediationCrore.toFixed(2)),
      fineCrore: grandTotalCrore,
      fineUsdMillions: grandTotalUsd,
      detentionMandatory: intent !== 'accidental',
      masterArrestWarrant: intent === 'deliberate'
    };
  };

  const penaltyMetrics = calculatePenalties();

  useEffect(() => {
    if (onUpdatePenalties) {
      onUpdatePenalties(penaltyMetrics);
    }
  }, [intent, vesselGT, inProtectedZone, bonnTonnes]);

  const handleIntentChange = (e) => {
    const val = e.target.value;
    setIntent(val);
    if (onLogAudit) onLogAudit(`Updated legal assessment intent to: ${val}`);
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-status-danger">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Statutory Liability & Environmental Penalty Forecaster
            </h4>
            <p className="text-[10px] text-text-muted">
              Computed under Indian Merchant Shipping Act 1958 Sec 356 & MARPOL 73/78 Annex I Reg 15.
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-red-50 text-status-danger border border-red-200 text-[10px] font-mono font-bold self-start sm:self-auto">
          {penaltyMetrics.detentionMandatory ? '● MANDATORY SEIZURE MANDATE' : '○ CIVIL ARBITRATION'}
        </span>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-red-50/50 rounded-xl border border-red-200">
          <span className="text-[10px] text-red-700 uppercase block font-bold">Total Estimated Liability</span>
          <span className="text-xl font-extrabold text-red-900">₹{penaltyMetrics.fineCrore} Cr</span>
          <span className="text-[9px] text-red-600 block">~${penaltyMetrics.fineUsdMillions}M USD</span>
        </div>
        <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Statutory Fine (M.S. Act)</span>
          <span className="text-xl font-extrabold text-ocean-navy">₹{penaltyMetrics.statutoryFineCrore} Cr</span>
          <span className="text-[9px] text-text-muted block">Direct penalty to State</span>
        </div>
        <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Remediation Escrow Bond</span>
          <span className="text-xl font-extrabold text-ocean-deep">₹{penaltyMetrics.remediationBondCrore} Cr</span>
          <span className="text-[9px] text-text-muted block">Mandatory cleanup bond</span>
        </div>
        <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Enforcement Directive</span>
          <span className={`text-xs font-extrabold block mt-1 ${penaltyMetrics.masterArrestWarrant ? 'text-status-danger' : 'text-amber-600'}`}>
            {penaltyMetrics.masterArrestWarrant ? 'PSC VESSEL SEIZURE + ARREST' : 'PORT DETENTION ONLY'}
          </span>
          <span className="text-[9px] text-text-muted block">Coast Guard Warrant</span>
        </div>
      </div>

      {/* Interactive Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
        <div>
          <label className="block text-[10px] uppercase text-text-muted font-bold mb-1">
            Attributed Discharge Intent
          </label>
          <select
            value={intent}
            onChange={handleIntentChange}
            className="w-full bg-ocean-light border border-border-marine rounded-lg p-2 font-mono text-xs text-ocean-navy font-bold focus:outline-none"
          >
            <option value="deliberate">Deliberate Bilge/Sludge Decanting (2.5x Punitive)</option>
            <option value="negligent">Negligent Ballast Transfer (1.5x Multiplier)</option>
            <option value="accidental">Accidental Structural / Hull Leak (1.0x)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase text-text-muted font-bold mb-1">
            Vessel Gross Tonnage (GT): {vesselGT.toLocaleString()}
          </label>
          <input
            type="range"
            min="5000"
            max="120000"
            step="5000"
            value={vesselGT}
            onChange={(e) => setVesselGT(parseInt(e.target.value, 10))}
            className="w-full accent-ocean cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-center gap-2 pt-4 sm:pt-0">
          <label className="text-[11px] text-ocean-navy font-bold flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inProtectedZone}
              onChange={(e) => {
                setInProtectedZone(e.target.checked);
                if (onLogAudit) onLogAudit(`Toggled ecologically sensitive zone multiplier`);
              }}
              className="w-4 h-4 rounded text-ocean accent-ocean cursor-pointer"
            />
            <span>Sensitive Marine Reserve (1.8x)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

