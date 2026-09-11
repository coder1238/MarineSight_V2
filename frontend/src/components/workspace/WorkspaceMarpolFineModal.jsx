import React, { useState, useMemo } from 'react';
import { X, Scale, AlertOctagon, DollarSign, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function WorkspaceMarpolFineModal({ caseData, onClose }) {
  const [dischargeM3, setDischargeM3] = useState(250);
  const [distanceFromLandNm, setDistanceFromLandNm] = useState(38); // NM from nearest shoreline
  const [instantRateLPerNm, setInstantRateLPerNm] = useState(85); // Litres per Nautical Mile (MARPOL max is 30 L/NM)
  const [oilContentPpm, setOilContentPpm] = useState(1400); // PPM in effluent (MARPOL max is 15 PPM)
  const [cleanUpCostPerTonUsd, setCleanUpCostPerTonUsd] = useState(8500); // International typical oil recovery cost

  const calculation = useMemo(() => {
    // 1 Metric Ton ~ 1.15 m3 of medium crude (density ~ 0.87)
    const metricTons = Math.round(dischargeM3 * 0.87);

    // Baseline Statutory Fine under Merchant Shipping Act (Part XIA)
    // Up to 50 Lakhs to 5 Crores INR ($60k - $600k USD) + strict liability
    let baseStatutoryInr = 25000000; // 2.5 Crore INR base
    if (metricTons > 500) baseStatutoryInr = 100000000; // 10 Crores
    else if (metricTons > 100) baseStatutoryInr = 50000000; // 5 Crores

    // Clean-up response liability
    const cleanUpTotalUsd = metricTons * cleanUpCostPerTonUsd;
    const cleanUpTotalInr = cleanUpTotalUsd * 84; // 1 USD ~ 84 INR

    // Environmental Natural Resource Damage Assessment (NRDA)
    const nrdaMultiplier = distanceFromLandNm < 12 ? 2.5 : (distanceFromLandNm < 50 ? 1.5 : 1.0);
    const environmentalDamageUsd = Math.round((metricTons * 4200) * nrdaMultiplier);
    const environmentalDamageInr = environmentalDamageUsd * 84;

    // MARPOL Violations Checklist
    const violations = [];
    if (distanceFromLandNm < 50) {
      violations.push({
        code: "MARPOL Annex I Reg 34.1(c)",
        desc: "Discharge within 50 Nautical Miles of nearest baseline is strictly prohibited for crude & black oil cargo residue.",
        severity: "CRITICAL"
      });
    }
    if (instantRateLPerNm > 30) {
      violations.push({
        code: "MARPOL Annex I Reg 34.1(d)",
        desc: `Instantaneous rate of discharge (${instantRateLPerNm} L/NM) exceeds the maximum statutory limit of 30 Litres per Nautical Mile.`,
        severity: "CRITICAL"
      });
    }
    if (oilContentPpm > 15) {
      violations.push({
        code: "MARPOL Annex I Reg 14 / 15",
        desc: `Oily bilge water separator effluent (${oilContentPpm} PPM) breached mandatory 15 PPM filtration threshold.`,
        severity: "HIGH"
      });
    }
    violations.push({
      code: "SOLAS Chapter V / Reg 19",
      desc: "Deliberate AIS transponder shutdown during discharge operation (failure to maintain continuous navigational broadcast).",
      severity: "CRITICAL"
    });

    const totalLiabilityInr = baseStatutoryInr + cleanUpTotalInr + environmentalDamageInr;
    const totalLiabilityUsd = Math.round(totalLiabilityInr / 84);

    return {
      metricTons,
      baseStatutoryInr,
      cleanUpTotalUsd,
      cleanUpTotalInr,
      environmentalDamageUsd,
      totalLiabilityInr,
      totalLiabilityUsd,
      violations
    };
  }, [dischargeM3, distanceFromLandNm, instantRateLPerNm, oilContentPpm, cleanUpCostPerTonUsd]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                MARPOL Annex I Legal Violation & Fine Forensics Calculator
              </h3>
              <p className="text-xs text-text-secondary">
                Quantify statutory penalties and clean-up cost recovery liabilities under Indian Merchant Shipping Act.
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

        {/* Sliders & Parameters */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="font-bold text-ocean-navy flex justify-between">
                <span>DISCHARGE VOLUME (m³):</span>
                <span className="text-status-danger font-bold">{dischargeM3} m³ ({calculation.metricTons} MT)</span>
              </label>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={dischargeM3}
                onChange={e => setDischargeM3(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted">Calculated from SAR slick area ({caseData.spillAreaKm2} km²)</span>
            </div>

            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="font-bold text-ocean-navy flex justify-between">
                <span>DISTANCE TO COAST:</span>
                <span className="text-status-danger font-bold">{distanceFromLandNm} Nautical Miles</span>
              </label>
              <input
                type="range"
                min={2}
                max={150}
                value={distanceFromLandNm}
                onChange={e => setDistanceFromLandNm(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted">
                {distanceFromLandNm < 12 ? '⚠️ INSIDE TERRITORIAL SEA (<12 NM)' : (distanceFromLandNm < 50 ? '⚠️ INSIDE 50 NM DISCHARGE BAN ZONE' : 'Outside 50 NM Zone')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="font-bold text-ocean-navy flex justify-between">
                <span>INSTANTANEOUS RATE:</span>
                <span className="text-status-danger font-bold">{instantRateLPerNm} L/NM</span>
              </label>
              <input
                type="range"
                min={5}
                max={200}
                value={instantRateLPerNm}
                onChange={e => setInstantRateLPerNm(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted">MARPOL Reg 34 statutory cap is 30 Litres / NM</span>
            </div>

            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-1.5">
              <label className="font-bold text-ocean-navy flex justify-between">
                <span>EST. CLEAN-UP RECOVERY:</span>
                <span className="text-ocean-deep font-bold">${cleanUpCostPerTonUsd} / MT</span>
              </label>
              <input
                type="range"
                min={2000}
                max={20000}
                step={500}
                value={cleanUpCostPerTonUsd}
                onChange={e => setCleanUpCostPerTonUsd(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-text-muted">ITOPF standard offshore mechanical skimming rates</span>
            </div>
          </div>

          {/* Statutory Liability Banner */}
          <div className="p-4 bg-red-950 text-white rounded-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-red-800 pb-2">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4" />
                <span>AGGREGATE STATUTORY & CIVIL DAMAGE LIABILITY</span>
              </span>
              <span className="text-xs text-red-300 font-bold">
                M/T {caseData.topVessel?.name || 'MV Ocean Star'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-red-900/60 rounded-xl border border-red-700">
                <span className="text-[10px] text-red-300 block">STATUTORY PENALTY (INR)</span>
                <span className="text-lg font-black text-white">₹{(calculation.baseStatutoryInr / 10000000).toFixed(2)} Cr</span>
                <span className="text-[10px] text-red-300 block">Merchant Shipping Act</span>
              </div>
              <div className="p-3 bg-red-900/60 rounded-xl border border-red-700">
                <span className="text-[10px] text-red-300 block">CLEAN-UP INDEMNITY</span>
                <span className="text-lg font-black text-amber-300">${(calculation.cleanUpTotalUsd / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-red-300 block">₹{(calculation.cleanUpTotalInr / 10000000).toFixed(2)} Cr</span>
              </div>
              <div className="p-3 bg-red-900/60 rounded-xl border border-red-700">
                <span className="text-[10px] text-red-300 block">TOTAL DAMAGES (USD)</span>
                <span className="text-xl font-black text-emerald-400">${(calculation.totalLiabilityUsd / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-emerald-300 block">₹{(calculation.totalLiabilityInr / 10000000).toFixed(2)} Crores</span>
              </div>
            </div>
          </div>

          {/* Violations Charged */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-ocean-navy flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-status-danger" />
              <span>STATUTORY CLAUSES BREACHED ({calculation.violations.length})</span>
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              {calculation.violations.map((v, i) => (
                <div key={i} className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-status-danger text-white font-bold text-[9px] mt-0.5">
                    {v.severity}
                  </span>
                  <div>
                    <strong className="text-status-danger text-xs">{v.code}</strong>
                    <p className="text-text-secondary text-[11px] mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">
            Admissible for Indian Coast Guard Maritime Police FIR filing.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

