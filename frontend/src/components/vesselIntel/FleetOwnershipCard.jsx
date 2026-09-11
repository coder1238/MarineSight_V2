import React from 'react';
import { Building2, Globe, Shield, FileCheck, Network, AlertCircle, ExternalLink } from 'lucide-react';

export default function FleetOwnershipCard({ vessel }) {
  const isHighPriority = vessel.status === "HIGH PRIORITY" || vessel.rank === "01";

  const corporateHierarchy = [
    {
      role: "Beneficial Owner (Ultimate Parent)",
      entity: isHighPriority ? "Helios Marine Holdings Corp (Cyprus)" : "Global Maritime Group Ltd",
      jurisdiction: isHighPriority ? "Limassol, Cyprus 🇨🇾" : "Tokyo, Japan 🇯🇵",
      transparency: isHighPriority ? "Opaque (Nominee Directors)" : "Publicly Listed",
      status: isHighPriority ? "warning" : "clear"
    },
    {
      role: "Registered Owner (Single-Ship SPV)",
      entity: `${vessel.name} Shipping Corp Ltd`,
      jurisdiction: "Majuro, Marshall Islands 🇲🇭",
      transparency: "Offshore Shell Company",
      status: isHighPriority ? "warning" : "clear"
    },
    {
      role: "Commercial Operator / Pool",
      entity: "Arabian Sea Tanker Pool Alliance",
      jurisdiction: "Dubai / Athens 🇦🇪 🇬🇷",
      transparency: "Spot Market Charter",
      status: "clear"
    },
    {
      role: "Technical & ISM Manager",
      entity: "Vanguard Marine Shipmanagement Pte Ltd",
      jurisdiction: "Singapore 🇸🇬 (DOC No: DOC-2024-SG)",
      transparency: "ISO 14001 / ISM Certified",
      status: "clear"
    },
    {
      role: "Protection & Indemnity (P&I) Insurer",
      entity: "Gard P&I Club (Norway)",
      jurisdiction: "Arendal, Norway 🇳🇴",
      transparency: "COFR Oil Pollution Cover: $1.0 Billion",
      status: "clear"
    }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Fleet Ownership & Corporate Shell Entity Graph
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Beneficial ownership tiering, offshore registry, and P&I pollution insurance audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">BENEFICIAL TRANSPARENCY:</span>
          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
            isHighPriority ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-status-success'
          }`}>
            {isHighPriority ? 'OPAQUE (TIER 3)' : 'HIGH (TIER 1)'}
          </span>
        </div>
      </div>

      {/* Corporate Hierarchy Tree */}
      <div className="space-y-2">
        {corporateHierarchy.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl border border-border-marine/70 bg-ocean-light/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] text-text-muted uppercase font-bold block">
                {idx + 1}. {item.role}
              </span>
              <span className="text-xs font-bold text-ocean-navy block">
                {item.entity}
              </span>
              <span className="text-[10px] text-text-secondary font-sans">
                Jurisdiction: {item.jurisdiction}
              </span>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-[10px] text-text-muted block">COMPLIANCE / STATUS</span>
              <span className={`text-[10px] font-bold ${
                item.status === 'warning' ? 'text-status-warning' : 'text-ocean-deep'
              }`}>
                {item.transparency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Insurance & CLC Liability Certificate Card */}
      <div className="p-3 bg-ocean-light/80 rounded-xl border border-border-marine flex items-center justify-between text-[11px] font-sans">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-status-success" />
          <span className="font-mono text-text-primary text-xs">
            <strong>IMO CLC 1992 Certificate:</strong> Valid until 20 Feb 2027 (Underwritten by International Group of P&I Clubs)
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-100 text-status-success text-[10px] font-mono font-bold">
          SOLVENT COVER
        </span>
      </div>
    </div>
  );
}

