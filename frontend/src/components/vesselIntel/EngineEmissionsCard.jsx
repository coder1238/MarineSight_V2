import React, { useState } from 'react';
import { Gauge, Flame, Wind, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EngineEmissionsCard({ vessel }) {
  const [fuelType, setFuelType] = useState('VLSFO'); // VLSFO (0.50% S) vs HFO (3.5% S with Scrubber) vs MGO (0.10% S)
  
  const speed = vessel.speedKn || 12.4;
  // Fuel consumption scales with the cube of speed (Admiralty coefficient law)
  const speedRatio = speed / 14.0;
  const baseBurnTonnesPerDay = Math.max(8, (38 * Math.pow(speedRatio, 3)).toFixed(1));
  const co2PerHour = (baseBurnTonnesPerDay * 3.114 / 24).toFixed(2);
  
  const sulfurMultiplier = fuelType === 'HFO' ? 7.0 : fuelType === 'VLSFO' ? 1.0 : 0.2;
  const soxKgPerHour = (baseBurnTonnesPerDay * 20 * sulfurMultiplier / 24).toFixed(1);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Marine Propulsion Plant & MARPOL Annex VI Emissions
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Main engine telemetry, bunker fuel grade, and real-time exhaust flux
            </p>
          </div>
        </div>

        {/* Fuel Type Selector */}
        <div className="flex items-center gap-1">
          {['VLSFO (0.5% S)', 'HFO (3.5% S)', 'MGO (0.1% S)'].map((f) => {
            const code = f.split(' ')[0];
            return (
              <button
                key={code}
                onClick={() => setFuelType(code)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  fuelType === code 
                    ? 'bg-ocean text-white' 
                    : 'bg-ocean-light text-text-muted hover:bg-ocean-sky'
                }`}
              >
                {code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engine Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">MAIN ENGINE MODEL</span>
          <span className="text-xs font-bold text-ocean-navy mt-0.5 block truncate">
            MAN B&W 6S70ME-C
          </span>
          <span className="text-[9px] text-text-muted">19,620 kW MCR @ 91 RPM</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">DAILY FUEL BURN</span>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {baseBurnTonnesPerDay} MT / Day
          </span>
          <span className="text-[9px] text-text-muted">At {speed} kn transit</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">EST. CO2 PLUME RATE</span>
          <span className="text-base font-bold text-text-primary mt-0.5 block">
            {co2PerHour} MT / hr
          </span>
          <span className="text-[9px] text-text-muted">CII Carbon Intensity</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">SOX EMISSIONS</span>
          <span className={`text-base font-bold mt-0.5 block ${fuelType === 'HFO' ? 'text-status-danger' : 'text-ocean-deep'}`}>
            {soxKgPerHour} kg / hr
          </span>
          <span className="text-[9px] text-text-muted">Annex VI Reg.14 Limit</span>
        </div>
      </div>

      {/* Scrubber & Fuel Audit Box */}
      <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-ocean" />
          <span className="text-text-primary font-mono text-xs">
            <strong>Exhaust Gas Cleaning System (EGCS):</strong> Hybrid Open/Closed Loop Scrubber certified under IMO MEPC.259(68)
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-100 text-status-success text-[10px] font-mono font-bold">
          ANNEX VI TIER II
        </span>
      </div>
    </div>
  );
}

