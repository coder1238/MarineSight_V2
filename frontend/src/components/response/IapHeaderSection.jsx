import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Tag, 
  Plus, 
  X,
  Edit2,
  Check
} from 'lucide-react';

export const DEFAULT_OBJECTIVES = [
  "Defend Zuari Estuary & Mangrove nursery via 2.4 km heavy curtain boom deployment",
  "Deploy ICGS Samudra Prahari and weir skimmer flotilla to intercept high-density slick centroid",
  "Transmit forensic attribution dossier & AIS trajectory telemetry to Coast Guard MRCC",
  "Pre-position oiled wildlife collection teams at Galgibaga beach sector"
];

export default function IapHeaderSection({ caseData, onAuthorize, isAuthorized }) {
  const [operationalPeriod, setOperationalPeriod] = useState('OP-01 (Day 1: 06:00 - 18:00 IST)');
  const [incidentCommander, setIncidentCommander] = useState('DIG R. Sharma, PTM (CG Western Command)');
  const [safetyOfficer, setSafetyOfficer] = useState('Capt. K. Menon (HAZWOPER Lead)');
  const [operationsChief, setOperationsChief] = useState('Cmdr. S. Verma (Marine Logistics)');
  const [objectives, setObjectives] = useState(DEFAULT_OBJECTIVES);
  const [newObjective, setNewObjective] = useState('');
  const [showAddObj, setShowAddObj] = useState(false);

  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective('');
    setShowAddObj(false);
  };

  const handleRemoveObjective = (idx) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 sm:p-5 shadow-marine-sm space-y-4">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-ocean text-white font-mono text-[10px] font-bold">
              ICS FORM 201 / 202
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-ocean-navy tracking-tight font-sans">
              Incident Action Plan (IAP) — {caseData?.incidentId || 'OF-2026-0912'}
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              isAuthorized 
                ? 'bg-emerald-50 text-status-success border-emerald-300' 
                : 'bg-amber-50 text-status-warning border-amber-300'
            }`}>
              {isAuthorized ? '● SIGNED & AUTHORIZED' : '● DRAFT IN REVIEW'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Target Sector: <span className="font-semibold text-ocean-navy">{caseData?.region || 'Arabian Sea'}</span> | Classification: <span className="font-semibold text-status-danger">{caseData?.riskLevel || 'CRITICAL'} Hydrocarbon Discharge</span>
          </p>
        </div>

        {/* Operational Period Selector */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase text-text-muted block">OPERATIONAL PERIOD</span>
            <select
              value={operationalPeriod}
              onChange={(e) => setOperationalPeriod(e.target.value)}
              className="text-xs font-mono font-bold text-ocean-navy p-1.5 rounded-lg border border-border-marine bg-ocean-light/50 focus:outline-none focus:ring-1 focus:ring-ocean"
            >
              <option value="OP-01 (Day 1: 06:00 - 18:00 IST)">OP-01 (Day 1: 06:00 - 18:00 IST)</option>
              <option value="OP-02 (Day 1 Night: 18:00 - 06:00 IST)">OP-02 (Day 1 Night: 18:00 - 06:00 IST)</option>
              <option value="OP-03 (Day 2: 06:00 - 18:00 IST)">OP-03 (Day 2: 06:00 - 18:00 IST)</option>
              <option value="OP-04 (Demobilization & Remediation)">OP-04 (Demobilization & Remediation)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident Command Structure Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">INCIDENT COMMANDER (IC)</span>
          <span className="font-bold text-ocean-navy text-xs block truncate mt-0.5">{incidentCommander}</span>
          <span className="text-[9px] text-text-secondary block">Command Post Alpha (MRCC)</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">SAFETY OFFICER</span>
          <span className="font-bold text-status-warning text-xs block truncate mt-0.5">{safetyOfficer}</span>
          <span className="text-[9px] text-text-secondary block">HAZWOPER & Gas Sniffer Lead</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">OPERATIONS SECTION CHIEF</span>
          <span className="font-bold text-ocean text-xs block truncate mt-0.5">{operationsChief}</span>
          <span className="text-[9px] text-text-secondary block">Tactical Skimming & Booms</span>
        </div>
      </div>

      {/* Operational Objectives (ICS-202) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-ocean-navy uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-ocean" />
            Core Operational Period Objectives (ICS Form 202)
          </span>
          <button
            onClick={() => setShowAddObj(!showAddObj)}
            className="text-[10px] font-mono font-bold text-ocean hover:text-ocean-deep flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Objective
          </button>
        </div>

        {showAddObj && (
          <form onSubmit={handleAddObjective} className="flex gap-2 mb-2">
            <input 
              type="text"
              placeholder="e.g. Conduct second pass aerial drone FLIR sweep..."
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              className="flex-1 text-xs p-2 rounded-xl border border-border-marine focus:outline-none focus:ring-2 focus:ring-ocean"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-ocean text-white text-xs font-bold font-mono"
            >
              Save
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {objectives.map((obj, idx) => (
            <div 
              key={idx}
              className="p-2.5 rounded-xl border border-border-marine bg-white flex items-start justify-between gap-2 text-xs group"
            >
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-ocean text-[11px] mt-0.5">#{idx + 1}</span>
                <span className="text-text-primary text-[11px] leading-relaxed">{obj}</span>
              </div>
              <button
                onClick={() => handleRemoveObjective(idx)}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-danger transition-opacity p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

