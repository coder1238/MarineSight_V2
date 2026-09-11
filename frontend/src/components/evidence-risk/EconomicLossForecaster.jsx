import React, { useState, useMemo } from 'react';
import { IndianRupee, DollarSign, TrendingDown, Ship, AlertCircle, FileText } from 'lucide-react';

export default function EconomicLossForecaster() {
  const [impactedAreaNm2, setImpactedAreaNm2] = useState(48); // nm²
  const [closureDays, setClosureDays] = useState(14); // days
  const [affectedTrawlers, setAffectedTrawlers] = useState(120); // boats
  const [currency, setCurrency] = useState("INR"); // INR or USD

  // Financial model calculations
  const { fisheryLoss, portDemurrage, cleanupCost, totalClaim } = useMemo(() => {
    // Approx daily artisanal + mechanised catch loss per boat: ₹12,500 / day
    const fisheryInr = affectedTrawlers * closureDays * 12500;
    // Port fairway disruption / delays: ₹8,00,000 / day
    const portInr = (closureDays * 0.4) * 800000;
    // Offshore containment, boom linear meter deployment, skimmer operational charters: ₹65,000 per nm² per day
    const cleanupInr = impactedAreaNm2 * 65000 * Math.min(closureDays, 10);

    const totalInr = fisheryLossInr => fisheryInr + portInr + cleanupInr;
    const grandTotalInr = fisheryInr + portInr + cleanupInr;

    const rateUsd = 84.2; // INR per USD

    if (currency === "USD") {
      return {
        fisheryLoss: (fisheryInr / rateUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        portDemurrage: (portInr / rateUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        cleanupCost: (cleanupInr / rateUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        totalClaim: (grandTotalInr / rateUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
        inrCrores: (grandTotalInr / 10000000).toFixed(2)
      };
    }

    return {
      fisheryLoss: `₹ ${(fisheryInr / 100000).toFixed(2)} Lakhs`,
      portDemurrage: `₹ ${(portInr / 100000).toFixed(2)} Lakhs`,
      cleanupCost: `₹ ${(cleanupInr / 100000).toFixed(2)} Lakhs`,
      totalClaim: `₹ ${(grandTotalInr / 10000000).toFixed(2)} Crores`,
      inrCrores: (grandTotalInr / 10000000).toFixed(2)
    };
  }, [impactedAreaNm2, closureDays, affectedTrawlers, currency]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header & Currency Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-status-warning" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Economic Impact & IOPC Damage Compensation Forecaster
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-ocean-light p-1 rounded-xl border border-border-marine">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currency === "INR" ? "bg-ocean text-white shadow-sm" : "text-text-secondary"
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currency === "USD" ? "bg-ocean text-white shadow-sm" : "text-text-secondary"
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-ocean-navy font-semibold">Impacted Marine Zone</span>
            <span className="text-ocean font-bold">{impactedAreaNm2} nm²</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={impactedAreaNm2}
            onChange={(e) => setImpactedAreaNm2(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <span className="text-[9px] text-text-muted block text-right">Coverage buffer</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-ocean-navy font-semibold">Fishery Closure Window</span>
            <span className="text-ocean font-bold">{closureDays} Days</span>
          </div>
          <input
            type="range"
            min="3"
            max="60"
            value={closureDays}
            onChange={(e) => setClosureDays(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <span className="text-[9px] text-text-muted block text-right">No-take moratorium</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-ocean-navy font-semibold">Active Registered Fleet</span>
            <span className="text-ocean font-bold">{affectedTrawlers} Vessels</span>
          </div>
          <input
            type="range"
            min="10"
            max="350"
            step="10"
            value={affectedTrawlers}
            onChange={(e) => setAffectedTrawlers(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <span className="text-[9px] text-text-muted block text-right">Artisanal + gillnetters</span>
        </div>
      </div>

      {/* Financial Liability Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[10px] text-amber-800 uppercase block font-bold">Fishermen Compensation</span>
          <span className="text-xs font-extrabold text-amber-900 mt-1 block">{fisheryLoss}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
          <span className="text-[10px] text-blue-800 uppercase block font-bold">Port & Fairway Demurrage</span>
          <span className="text-xs font-extrabold text-blue-900 mt-1 block">{portDemurrage}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
          <span className="text-[10px] text-indigo-800 uppercase block font-bold">Containment & Skimming</span>
          <span className="text-xs font-extrabold text-indigo-900 mt-1 block">{cleanupCost}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
          <span className="text-[10px] text-red-800 uppercase block font-bold">Total IOPC Claim Liability</span>
          <span className="text-sm font-extrabold text-status-danger mt-1 block">{totalClaim}</span>
        </div>
      </div>
    </div>
  );
}

