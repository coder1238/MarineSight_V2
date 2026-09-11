import React, { useState } from 'react';
import { DollarSign, Scale, AlertTriangle, ShieldAlert, FileText, Info } from 'lucide-react';

export default function MarpolFineCalculatorCard({ vessel }) {
  const [dischargeVolumeLiters, setDischargeVolumeLiters] = useState(8500); // 500 to 50,000 Liters
  const [hydrocarbonType, setHydrocarbonType] = useState('crude'); // 'crude', 'bilge', 'hfo', 'diesel'
  const [distanceFromLandNm, setDistanceFromLandNm] = useState(14); // nm

  // Severity multipliers
  const oilFactors = {
    crude: { name: "Crude Oil (Heavy Petroleum)", factor: 1.8, ppm: "10,000+ ppm" },
    hfo: { name: "Heavy Fuel Oil (HFO Sludge)", factor: 2.2, ppm: "50,000+ ppm" },
    bilge: { name: "Untreated Bilge Slops", factor: 1.2, ppm: "1,500 ppm" },
    diesel: { name: "Marine Gas Oil / Diesel", factor: 1.4, ppm: "800 ppm" },
  };

  const volumeM3 = (dischargeVolumeLiters / 1000).toFixed(2);
  const volumeBarrels = (dischargeVolumeLiters / 158.987).toFixed(1);

  // Fine calculation: Base fine + volume penalty * oil factor + territorial water multiplier
  const isInsideTerritorial = distanceFromLandNm <= 12;
  const territorialMultiplier = isInsideTerritorial ? 2.5 : 1.2;
  const currentOil = oilFactors[hydrocarbonType];

  const estimatedCleanupUsd = Math.round(volumeBarrels * 4200 * currentOil.factor);
  const statutoryFineUsd = Math.round(150000 + (dischargeVolumeLiters * 35 * territorialMultiplier * currentOil.factor));
  const totalLiabilityUsd = estimatedCleanupUsd + statutoryFineUsd;
  const totalLiabilityInrCr = ((totalLiabilityUsd * 84) / 10000000).toFixed(2); // In Crores INR

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-status-danger border border-red-200">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              MARPOL Annex I Violation & Judicial Fine Estimator
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Statutory penalty matrix under IMO MARPOL 73/78 & UNCLOS Art. 211
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-status-danger border border-red-200 font-bold text-[10px]">
          ● CRIMINAL OFFENSE LEVEL 4
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-ocean-light/70 rounded-xl border border-border-marine">
        {/* Discharge Volume Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">DISCHARGE VOLUME</span>
            <span className="font-bold text-status-danger">
              {dischargeVolumeLiters.toLocaleString()} L ({volumeM3} m³)
            </span>
          </div>
          <input
            type="range"
            min="500"
            max="35000"
            step="500"
            value={dischargeVolumeLiters}
            onChange={(e) => setDischargeVolumeLiters(parseInt(e.target.value))}
            className="w-full accent-status-danger h-1.5 bg-white rounded appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-text-muted block">~{volumeBarrels} US Barrels</span>
        </div>

        {/* Oil Type Selector */}
        <div className="space-y-1">
          <span className="text-[10px] text-text-muted block">HYDROCARBON CLASS</span>
          <select
            value={hydrocarbonType}
            onChange={(e) => setHydrocarbonType(e.target.value)}
            className="w-full p-1.5 bg-white border border-border-marine rounded-lg text-xs font-bold text-ocean-navy focus:outline-none"
          >
            <option value="crude">Crude Oil (Heavy Petroleum)</option>
            <option value="hfo">Heavy Fuel Oil (HFO Sludge)</option>
            <option value="bilge">Untreated Bilge Slops</option>
            <option value="diesel">Marine Gas Oil (MGO)</option>
          </select>
          <span className="text-[9px] text-text-muted block">Est. Sheen: {currentOil.ppm}</span>
        </div>

        {/* Distance from Baseline Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">DISTANCE FROM SHORE</span>
            <span className={`font-bold ${isInsideTerritorial ? 'text-status-danger' : 'text-ocean-deep'}`}>
              {distanceFromLandNm} nm {isInsideTerritorial ? '(Territorial)' : '(EEZ Zone)'}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="60"
            step="1"
            value={distanceFromLandNm}
            onChange={(e) => setDistanceFromLandNm(parseInt(e.target.value))}
            className="w-full accent-ocean h-1.5 bg-white rounded appearance-none cursor-pointer"
          />
          <span className="text-[9px] text-text-muted block">
            {isInsideTerritorial ? 'Strict liability territory (<= 12 nm)' : 'Special Area limits (<= 50 nm)'}
          </span>
        </div>
      </div>

      {/* Penalty Output Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">CLEANUP COSTS (ITOPF)</span>
          <span className="text-sm font-bold text-ocean-navy mt-0.5 block">
            ${(estimatedCleanupUsd / 1000).toFixed(0)}k USD
          </span>
          <span className="text-[9px] text-text-muted">Mechanical containment</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">STATUTORY COURT FINE</span>
          <span className="text-sm font-bold text-status-danger mt-0.5 block">
            ${(statutoryFineUsd / 1000).toFixed(0)}k USD
          </span>
          <span className="text-[9px] text-text-muted">Merchant Shipping Act 1958</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">TOTAL CIVIL LIABILITY</span>
          <span className="text-base font-extrabold text-status-danger mt-0.5 block">
            ${(totalLiabilityUsd / 1000000).toFixed(2)}M USD
          </span>
          <span className="text-[9px] text-text-muted">~₹{totalLiabilityInrCr} Crores INR</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">VESSEL DETENTION RISK</span>
          <span className="text-sm font-bold text-status-danger mt-0.5 block">
            IMMEDIATE ARREST
          </span>
          <span className="text-[9px] text-text-muted">Admiralty warrant issued</span>
        </div>
      </div>

      {/* MARPOL Rules Reference Footer */}
      <div className="p-2.5 rounded-xl bg-red-50/50 border border-status-danger/20 text-text-secondary text-[10px] font-sans flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-status-danger flex-shrink-0 mt-0.5" />
        <span>
          <strong>MARPOL Reg 15.2 Breach:</strong> Any discharge into the sea of oily mixture having an oil content exceeding 15 parts per million (ppm) within 50 nautical miles from land constitutes a criminal violation under international maritime law.
        </span>
      </div>
    </div>
  );
}

