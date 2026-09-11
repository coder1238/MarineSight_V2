import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, AlertTriangle, Radio, Shield, Building2 } from 'lucide-react';

export const AGENCIES = [
  { id: "icg", name: "Indian Coast Guard (MRCC Mumbai)", role: "Maritime Interception & Spill Booming", channel: "SATCOM Encrypted Channel 16", status: "READY" },
  { id: "dg_shipping", name: "Directorate General of Shipping", role: "Port State Detention & Flag Notice", channel: "AP-MARPOL Direct Teletype", status: "READY" },
  { id: "spcb", name: "State Pollution Control Board (Goa)", role: "Shoreline Environmental Monitoring", channel: "State Emergency Operations Center", status: "READY" },
  { id: "port_trust", name: "Mormugao Port Authority", role: "Harbor Traffic & Fairway Protection", channel: "VTS Port Control VHF CH 12", status: "READY" }
];

export default function AgencyDispatchSimulator({ incidentId, vesselName }) {
  const [agencies, setAgencies] = useState(AGENCIES);
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchedTime, setLastDispatchedTime] = useState(null);

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setAgencies(prev =>
        prev.map(a => ({ ...a, status: "DISPATCHED_ACKNOWLEDGED" }))
      );
      setIsDispatching(false);
      setLastDispatchedTime(new Date().toLocaleTimeString() + " IST");
    }, 1100);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Multi-Agency Forensic Dossier Dispatch Simulator
          </h3>
        </div>

        <button
          onClick={handleDispatch}
          disabled={isDispatching}
          className="px-3 py-1.5 rounded-xl bg-status-danger hover:bg-red-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Radio className={`w-3.5 h-3.5 ${isDispatching ? "animate-spin" : ""}`} />
          <span>{isDispatching ? "Broadcasting Encrypted Packet..." : "Broadcast Alert to All 4 Agencies"}</span>
        </button>
      </div>

      {lastDispatchedTime && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-status-success text-[11px]">
          <span className="font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> ALL 4 INTER-AGENCY NODES CONFIRMED RECEIPT & DECRYPTED
          </span>
          <span className="text-text-muted text-[10px]">Timestamp: {lastDispatchedTime}</span>
        </div>
      )}

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {agencies.map((agency) => (
          <div key={agency.id} className="p-3 rounded-xl bg-ocean-light/50 border border-border-marine flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Building2 className="w-3.5 h-3.5 text-ocean" />
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  agency.status.includes("ACKNOWLEDGED") ? "bg-emerald-100 text-status-success" : "bg-slate-100 text-text-muted"
                }`}>
                  {agency.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-ocean-navy mt-1">{agency.name}</h4>
              <p className="text-[10px] text-text-secondary font-sans">{agency.role}</p>
            </div>

            <div className="mt-2 pt-2 border-t border-border-marine/70 text-[9px] text-text-muted">
              <span>Channel: {agency.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

