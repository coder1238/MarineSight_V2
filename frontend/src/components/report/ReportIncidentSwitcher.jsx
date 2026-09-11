import React from 'react';
import { REGIONAL_CASES_MAP } from '../../data/mockData';
import { AlertCircle, ChevronDown, MapPin, Calendar, Ship } from 'lucide-react';

export default function ReportIncidentSwitcher({ selectedCaseId, onSelectCase, onLogAudit }) {
  const caseEntries = Object.entries(REGIONAL_CASES_MAP);

  const handleChange = (e) => {
    const newId = e.target.value;
    onSelectCase(newId);
    if (onLogAudit) {
      onLogAudit(`Incident switched to ${newId} (${REGIONAL_CASES_MAP[newId]?.regionShort || newId})`);
    }
  };

  const currentCase = REGIONAL_CASES_MAP[selectedCaseId] || caseEntries[0][1];

  return (
    <div className="bg-white border border-border-marine rounded-xl p-3 shadow-marine-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-ocean/10 border border-ocean/20 flex items-center justify-center text-ocean font-bold text-xs">
          {currentCase.flagEmoji || '🇮🇳'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-ocean tracking-wider">Active Incident Case</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold font-mono">
              STATUS: {currentCase.status || 'ACTIVE INVESTIGATION'}
            </span>
          </div>
          <div className="text-xs font-bold text-ocean-navy flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-ocean" />
            <span>{currentCase.region}</span>
            <span className="text-text-muted font-mono font-normal">({currentCase.incidentId})</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto">
        <label className="text-[10px] font-mono uppercase text-text-muted hidden sm:inline whitespace-nowrap">
          Switch Regional Case:
        </label>
        <div className="relative flex-1 md:w-64">
          <select
            value={selectedCaseId}
            onChange={handleChange}
            className="w-full appearance-none bg-ocean-light/70 hover:bg-ocean-light border border-border-marine rounded-lg py-1.5 pl-2.5 pr-8 text-xs font-bold text-ocean-navy focus:outline-none focus:ring-1 focus:ring-ocean transition-all cursor-pointer font-mono"
          >
            {caseEntries.map(([id, c]) => (
              <option key={id} value={id}>
                {id} · {c.regionShort || c.region} ({c.spillAreaKm2} km²)
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-ocean absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

