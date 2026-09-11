import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Lock 
} from 'lucide-react';

const AGENCIES = [
  { id: 'ICG', name: 'Indian Coast Guard MRCC (Mumbai / Goa)', role: 'Lead Combat Agency (NOS-DCP)', defaultChecked: true },
  { id: 'DGS', name: 'Directorate General of Shipping', role: 'Flag State & Port State Authority', defaultChecked: true },
  { id: 'PCB', name: 'Goa State Pollution Control Board', role: 'Environmental Compliance & Water Sampling', defaultChecked: true },
  { id: 'MPT', name: 'Mormugao Port Trust (Harbor Master)', role: 'Navigational Traffic & Berthing Clearance', defaultChecked: true },
  { id: 'NAV', name: 'Indian Navy (Western Naval Command)', role: 'Air Support & Offshore Patrol', defaultChecked: false },
  { id: 'NDMA', name: 'National Disaster Management Authority', role: 'Inter-State Crisis Coordination', defaultChecked: false }
];

export default function MultiAgencyBroadcaster({ caseData }) {
  const [selectedAgencies, setSelectedAgencies] = useState(
    AGENCIES.filter(a => a.defaultChecked).map(a => a.id)
  );
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [lastTransmission, setLastTransmission] = useState(null);

  const toggleAgency = (id) => {
    setSelectedAgencies(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleTransmit = () => {
    if (selectedAgencies.length === 0) return;
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      const fakeHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setLastTransmission({
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        hash: fakeHash,
        agencyCount: selectedAgencies.length
      });
    }, 1200);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Multi-Agency Dispatch Broadcaster & SitRep Hub
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                SECURE C4I NETWORK
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Synchronize operational situation reports (SITREP) with maritime authorities.
            </p>
          </div>
        </div>

        {lastTransmission && (
          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-status-success border border-emerald-200 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>DISPATCHED AT {lastTransmission.time}</span>
          </div>
        )}
      </div>

      {/* Target Agency Checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {AGENCIES.map(a => {
          const isChecked = selectedAgencies.includes(a.id);
          return (
            <label
              key={a.id}
              onClick={() => toggleAgency(a.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                isChecked
                  ? 'bg-ocean-light/50 border-ocean ring-1 ring-ocean/30'
                  : 'bg-white border-border-marine hover:bg-ocean-light/20 opacity-70'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}} // Handled by label click
                className="mt-0.5 rounded border-border-marine text-ocean focus:ring-ocean accent-ocean"
              />
              <div>
                <span className="font-bold text-ocean-navy block text-xs">{a.name}</span>
                <span className="text-[10px] text-text-secondary font-sans leading-tight block mt-0.5">{a.role}</span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Broadcast Summary & CTA */}
      <div className="bg-ocean-light/30 border border-border-marine rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-ocean" />
            <span className="font-bold text-ocean-navy text-[11px]">
              SHA-256 Digital Signature Encryption Active
            </span>
          </div>
          <span className="text-[10px] text-text-secondary block">
            Broadcasting to {selectedAgencies.length} agencies: IAP directives, GIS shapefiles, and skimmer telemetry.
          </span>
          {lastTransmission && (
            <span className="text-[9px] text-text-muted font-mono block">
              Cryptographic Receipt: {lastTransmission.hash}
            </span>
          )}
        </div>

        <button
          onClick={handleTransmit}
          disabled={isTransmitting || selectedAgencies.length === 0}
          className="py-2 px-4 rounded-xl bg-ocean hover:bg-ocean-deep disabled:opacity-50 text-white font-bold text-xs shadow-marine-sm transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
        >
          {isTransmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Transmitting Secure Packet...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Transmit SitRep Broadcast</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

