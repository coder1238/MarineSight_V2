import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Sliders, 
  PieChart 
} from 'lucide-react';

export default function ResponseBudgetEstimator() {
  const [durationDays, setDurationDays] = useState(3);
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'
  const exchangeRate = 83.5;

  const costBreakdown = useMemo(() => {
    const vesselCharterUsd = 18000 * durationDays; // PCV Flagship
    const skimmerBargesUsd = 13000 * durationDays; // 2 Skimmers
    const aerialReconUsd = (3200 * 4) * durationDays; // 4 flight hours / day
    const boomProcurementUsd = 2400 * 45; // Fixed capital hardware for 2.4km
    const personnelWagesUsd = 48 * 450 * durationDays; // 48 crew @ $450/day
    const dispersantConsumablesUsd = 28500; // Fixed chemical consumables
    const wasteDisposalHazUsd = 3500 * durationDays; // Hazardous transport & tipping

    const totalUsd = vesselCharterUsd + skimmerBargesUsd + aerialReconUsd + boomProcurementUsd + personnelWagesUsd + dispersantConsumablesUsd + wasteDisposalHazUsd;
    const insuredRecoveryUsd = Math.round(totalUsd * 0.88); // 88% recoverable from vessel P&I insurer

    return {
      vesselCharterUsd,
      skimmerBargesUsd,
      aerialReconUsd,
      boomProcurementUsd,
      personnelWagesUsd,
      dispersantConsumablesUsd,
      wasteDisposalHazUsd,
      totalUsd,
      insuredRecoveryUsd
    };
  }, [durationDays]);

  const formatCost = (valUsd) => {
    if (currency === 'INR') {
      const valInr = valUsd * exchangeRate;
      return `₹${(valInr / 100000).toFixed(1)} Lakhs`;
    }
    return `$${valUsd.toLocaleString()}`;
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-status-success">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Incident Budget & IOPC Claims Cost Estimator
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-status-success border border-emerald-200">
                1992 CLC / FUND CONVENTION
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Real-time financial expenditure modeling and P&I club maritime pollution insurance claim projections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
              currency === 'USD' ? 'bg-ocean text-white border-ocean' : 'bg-white text-text-secondary border-border-marine'
            }`}
          >
            USD ($)
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
              currency === 'INR' ? 'bg-ocean text-white border-ocean' : 'bg-white text-text-secondary border-border-marine'
            }`}
          >
            INR (₹)
          </button>
        </div>
      </div>

      {/* Duration Slider */}
      <div className="bg-ocean-light/30 p-3 rounded-xl border border-border-marine">
        <div className="flex justify-between text-xs font-mono mb-1">
          <span className="text-text-secondary">Emergency Response Campaign Duration:</span>
          <span className="font-extrabold text-ocean-navy">{durationDays} Operational Days</span>
        </div>
        <input 
          type="range"
          min="1"
          max="14"
          step="1"
          value={durationDays}
          onChange={(e) => setDurationDays(+e.target.value)}
          className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
        />
        <div className="flex justify-between text-[9px] text-text-muted mt-0.5 font-mono">
          <span>Day 1 (Initial Strike)</span>
          <span>Day 7 (Stabilization)</span>
          <span>Day 14 (Full Demobilization)</span>
        </div>
      </div>

      {/* Itemized Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">FLAGSHIP PCV CHARTER</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.vesselCharterUsd)}</span>
          <span className="text-[8px] text-text-secondary block">ICGS Samudra Prahari</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">SKIMMER BARGES (x2)</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.skimmerBargesUsd)}</span>
          <span className="text-[8px] text-text-secondary block">Weir Recovery Flotilla</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">AERIAL RECON FLIGHTS</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.aerialReconUsd)}</span>
          <span className="text-[8px] text-text-secondary block">Dornier 228 Sorties</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">BOOMS & ANCHORAGES</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.boomProcurementUsd)}</span>
          <span className="text-[8px] text-text-secondary block">2.4 km Barrier Hardware</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">SPECIALIST WAGES (48)</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.personnelWagesUsd)}</span>
          <span className="text-[8px] text-text-secondary block">HAZWOPER Hazard Rates</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">DISPERSANT CHEMICALS</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.dispersantConsumablesUsd)}</span>
          <span className="text-[8px] text-text-secondary block">Dasic NS Stockpile</span>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted block">HAZARDOUS WASTE TIPPING</span>
          <span className="text-sm font-extrabold text-ocean-navy">{formatCost(costBreakdown.wasteDisposalHazUsd)}</span>
          <span className="text-[8px] text-text-secondary block">Decanting & Incineration</span>
        </div>

        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-300">
          <span className="text-[9px] text-emerald-800 font-bold block">P&I CLUB CLAIM COVER</span>
          <span className="text-sm font-extrabold text-status-success">{formatCost(costBreakdown.insuredRecoveryUsd)}</span>
          <span className="text-[8px] text-emerald-700 block">88% Polluter-Pays Recovery</span>
        </div>
      </div>

      {/* Summary Total Banner */}
      <div className="p-3 bg-ocean text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
        <div>
          <span className="text-[10px] text-ocean-sky uppercase block">ESTIMATED TOTAL RESPONSE EXPENDITURE</span>
          <span className="text-lg font-black">{formatCost(costBreakdown.totalUsd)}</span>
        </div>
        <div className="text-right text-[10px] text-ocean-sky">
          <span>Standard Claim Dossier Reference: <strong>IOPC-IND-2026-081</strong></span>
          <span className="block mt-0.5">Statutory Cap: $450 Million (1992 Protocol)</span>
        </div>
      </div>
    </div>
  );
}

