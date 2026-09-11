import React, { useState } from 'react';
import { Layers, AlertTriangle, ShieldAlert, CheckCircle2, Droplets, Wrench } from 'lucide-react';

export default function VesselTankOwsCard({ vessel }) {
  const [selectedTank, setSelectedTank] = useState('slopPort');
  const isHighPriority = vessel.status === "HIGH PRIORITY" || vessel.rank === "01";

  const tanks = {
    cargo1: { name: "Cargo Tank No. 1 (Center)", capacity: "24,500 m³", level: "85%", type: "Arabian Light Crude", status: "Secure" },
    cargo2: { name: "Cargo Tank No. 2 (Center)", capacity: "28,000 m³", level: "82%", type: "Arabian Light Crude", status: "Secure" },
    slopPort: { name: "Slop Tank Port (Aft)", capacity: "3,200 m³", level: isHighPriority ? "38% (Sudden Drop)" : "72%", type: "Oily Residues / Wash Water", status: isHighPriority ? "Unlogged Loss" : "Nominal" },
    slopStbd: { name: "Slop Tank Starboard", capacity: "3,200 m³", level: "74%", type: "Oily Wash Slops", status: "Nominal" },
    bilgeWell: { name: "Engine Room Bilge Wells", capacity: "450 m³", level: isHighPriority ? "12% (Emptied)" : "68%", type: "Oily Bilge Water", status: isHighPriority ? "Suspect Pump-Out" : "Nominal" },
  };

  const active = tanks[selectedTank] || tanks.slopPort;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Tank Architecture & Oily Water Separator (OWS) Inspector
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Internal hold schematic, slop tank telemetry, and overboard discharge valve forensics
            </p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          isHighPriority ? 'bg-red-50 text-status-danger border border-red-200 animate-pulse' : 'bg-emerald-50 text-status-success'
        }`}>
          {isHighPriority ? '● OWS TAMPER ANOMALY DETECTED' : '● VALVES SEALED & COMPLIANT'}
        </span>
      </div>

      {/* Interactive Tank Selector Strip */}
      <div className="grid grid-cols-5 gap-1.5 text-[10px]">
        {Object.entries(tanks).map(([key, t]) => {
          const isSelected = selectedTank === key;
          const isAnomalous = t.status.includes('Drop') || t.status.includes('Pump-Out') || t.status.includes('Loss');
          return (
            <button
              key={key}
              onClick={() => setSelectedTank(key)}
              className={`p-2 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-ocean-navy text-white border-ocean-navy shadow-sm'
                  : 'bg-ocean-light border-border-marine hover:bg-white text-text-primary'
              }`}
            >
              <span className="block truncate font-bold text-[9px]">{key.toUpperCase()}</span>
              <span className={`text-[10px] block font-extrabold ${isSelected ? 'text-ocean-bright' : isAnomalous ? 'text-status-danger' : 'text-ocean-deep'}`}>
                {t.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Tank Details Card */}
      <div className="p-3 bg-ocean-light/80 rounded-xl border border-border-marine grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <span className="text-[9px] text-text-muted block">SELECTED COMPARTMENT</span>
          <span className="font-bold text-ocean-navy text-[11px] block">{active.name}</span>
        </div>
        <div>
          <span className="text-[9px] text-text-muted block">TOTAL CAPACITY</span>
          <span className="font-bold text-text-primary text-[11px] block">{active.capacity}</span>
        </div>
        <div>
          <span className="text-[9px] text-text-muted block">CONTAINED LIQUID</span>
          <span className="font-bold text-text-primary text-[11px] block">{active.type}</span>
        </div>
        <div>
          <span className="text-[9px] text-text-muted block">AUDIT INTEGRITY</span>
          <span className={`font-bold text-[11px] block ${active.status.includes('Drop') || active.status.includes('Pump') ? 'text-status-danger' : 'text-status-success'}`}>
            {active.status}
          </span>
        </div>
      </div>

      {/* Bilge Separator (OWS 15-PPM) & Overboard Valve Forensic Card */}
      <div className="p-3.5 bg-red-50/50 border border-status-danger/30 rounded-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-status-danger flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            MARPOL OWS 15-PPM MONITOR & OVERBOARD VALVE AUDIT
          </span>
          <span className="text-[10px] font-bold text-status-danger font-mono">
            {isHighPriority ? 'DISCHARGE BREACH: 184 PPM (LIMIT: 15 PPM)' : 'NOMINAL: 4 PPM'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
          <div className="p-2 bg-white rounded-lg border border-red-200">
            <span className="text-text-muted block">3-WAY SOLENOID VALVE:</span>
            <span className={`font-bold block ${isHighPriority ? 'text-status-danger' : 'text-status-success'}`}>
              {isHighPriority ? 'OPEN TO OVERBOARD (UNLOCKED)' : 'CLOSED / RECIRCULATING'}
            </span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-red-200">
            <span className="text-text-muted block">ODMCS OIL LOG RECORDER:</span>
            <span className={`font-bold block ${isHighPriority ? 'text-status-danger' : 'text-status-success'}`}>
              {isHighPriority ? 'DATA GAP CONCURRING WITH AIS' : 'CONTINUOUS LOGGING'}
            </span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-red-200">
            <span className="text-text-muted block">MAGIC PIPE / BYPASS INSPECTION:</span>
            <span className={`font-bold block ${isHighPriority ? 'text-status-danger' : 'text-status-success'}`}>
              {isHighPriority ? 'SUSPECT FLANGE WEAR DETECTED' : 'SEALS INTACT'}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-text-secondary font-sans leading-relaxed">
          {isHighPriority
            ? 'Forensic telemetry reveals that Slop Tank Port and Engine Room Bilge wells experienced unlogged ullage drops coinciding with the 38-minute AIS transponder blackout, with OWS alarm sensors recording oil contents over 12x the legal 15 ppm limit.'
            : 'All bilge water separator sensors and overboard discharge diversion valves report zero abnormal activations with seals authenticated by Port State Control.'}
        </p>
      </div>
    </div>
  );
}

