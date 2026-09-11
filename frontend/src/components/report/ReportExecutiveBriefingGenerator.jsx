import React, { useState } from 'react';
import { Sparkles, Copy, Check, UserCheck, Shield, BookOpen, Radio } from 'lucide-react';

export default function ReportExecutiveBriefingGenerator({ caseData, bonnMetrics, penaltyMetrics, onLogAudit }) {
  const [selectedRole, setSelectedRole] = useState('commandant');
  const [copied, setCopied] = useState(false);

  const vessel = caseData.topVessel;

  const generateBriefing = (role) => {
    switch (role) {
      case 'commandant':
        return `[TACTICAL SITUATION REPORT - COAST GUARD COMMANDANT]
SITUATION: Active hydrocarbon slick detected by Sentinel-1 SAR at ${caseData.coordinates.display} covering ${caseData.spillAreaKm2} km² (${bonnMetrics?.volumeTonnes || 420} MT estimated).
TARGET ATTRIBUTION: Tanker ${vessel.name} (MMSI: ${vessel.mmsi}) designated Rank #1 target with priority score ${vessel.priorityScore}/100 following ${vessel.aisGapMinutes || 38}-minute AIS blackout directly traversing the release centroid.
DIRECTIVE:
1. Mobilize ICGS Samudra Prahari and fast patrol vessels for immediate visual intercept and water sampling.
2. Deploy Zuari Estuary curtain boom barriers to seal sensitive mangrove spawning habitats.
3. Alert Regional Headquarters (West) to issue intercept vector and board upon outer anchorage entry.`;

      case 'magistrate':
        return `[FORENSIC EVIDENCE MEMORANDUM - JUDICIAL PROSECUTION]
IN RE: Environmental Offense under Section 356 of Indian Merchant Shipping Act 1958 & Environment Protection Act 1986.
EVIDENCE SUMMARY:
- Exhibit A: Sentinel-1A SAR C-Band VV radar backscatter proving mineral crude dampening of -22.4 dB.
- Exhibit B: 40-hour Lagrangian particle hindcast converging with 72.4% certainty on Zone A coordinates.
- Exhibit C: Bi-LSTM reconstructed transponder trajectory confirming vessel ${vessel.name} was within 1.4 nm of origin during unannounced AIS silence.
STATUTORY DEMAND:
Issue show-cause detention order and mandate ₹${penaltyMetrics?.fineCrore || 8.4} Crore escrow security bond under Port State Control authority.`;

      case 'media':
        return `[PRESS COMMUNIQUE - OFFICIAL PUBLIC STATEMENT]
NEW DELHI / GOA — Maritime environmental monitoring systems have detected an offshore mineral oil sheen measuring approximately ${caseData.spillAreaKm2} square kilometers in the Arabian Sea, approximately 42 nautical miles off the coast.
Coast Guard pollution response teams have been activated with ocean containment booms and aerial surveillance assets. High-priority candidate vessels identified through automated trajectory systems are being subjected to Port State Control verification. There is no immediate risk to coastal tourist beaches or public fisheries. Regular updates will follow.`;

      case 'psc':
        return `[PORT STATE CONTROL DETENTION NOTICE - HARBOUR MASTER]
TO: Master and Chief Engineer, MV ${vessel.name} [IMO: ${vessel.imo || '9241189'}]
RE: Mandatory Environmental Inspection & Vessel Detention Warning.
You are hereby notified that pursuant to MARPOL 73/78 Annex I Regulation 15 and Indian M.S. Act Section 356, your vessel is subject to mandatory inspection upon anchoring.
REQUIRED UPON BOARDING:
1. Oil Record Book (Part I & II) original hardcopies.
2. Bilge water separator electronic data logger and 15ppm overboard diversion valve tamper seals.
3. Voyage Data Recorder (VDR) backup for period 03 SEP 20:00 to 04 SEP 04:00 UTC.`;

      default:
        return '';
    }
  };

  const briefingText = generateBriefing(selectedRole);

  const handleCopy = () => {
    navigator.clipboard.writeText(briefingText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onLogAudit) onLogAudit(`Copied executive briefing [${selectedRole.toUpperCase()}] to clipboard`);
    });
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Role-Based Executive Briefing Generator
            </h4>
            <p className="text-[10px] text-text-muted">
              Auto-generates tailored situational digests tailored for commandants, legal magistrates, media, or PSC.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-ocean" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Briefing'}</span>
        </button>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'commandant', label: 'Coast Guard Commandant', icon: Shield },
          { id: 'magistrate', label: 'Judicial Magistrate', icon: BookOpen },
          { id: 'psc', label: 'Port State Control', icon: UserCheck },
          { id: 'media', label: 'Press & Public Media', icon: Radio },
        ].map(r => {
          const Icon = r.icon;
          const active = selectedRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRole(r.id);
                if (onLogAudit) onLogAudit(`Generated executive briefing for: ${r.label}`);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                active
                  ? 'bg-ocean text-white shadow-sm'
                  : 'bg-ocean-light text-text-secondary hover:bg-ocean/10 hover:text-ocean'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Briefing Output Text Box */}
      <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-inner">
        {briefingText}
      </div>
    </div>
  );
}

