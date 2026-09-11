import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Square, 
  AlertTriangle, 
  Award, 
  FileCheck 
} from 'lucide-react';

const INITIAL_CRITERIA = [
  { id: 'c1', label: 'Initial Flash Notification sent to Coast Guard MRCC within 2 hours', section: 'NOS-DCP Sec 3.1', checked: true },
  { id: 'c2', label: 'Tier 2 Response Level formally declared and logged in Command Log', section: 'NOS-DCP Sec 4.2', checked: true },
  { id: 'c3', label: 'Numerical Lagrangian trajectory forward simulation run initialized', section: 'IMO Tier-2 Protocol', checked: true },
  { id: 'c4', label: 'Shoreline Protection Priorities aligned with NOAA / MOEFCC ESI map', section: 'ESI Guidelines 2020', checked: true },
  { id: 'c5', label: 'Chemical Dispersant NEBA pre-authorization cleared with SPCB', section: 'MARPOL Annex I / SPCB', checked: true },
  { id: 'c6', label: 'ICS-201 Incident Briefing form compiled and Incident Commander assigned', section: 'Disaster Mgmt Act 2005', checked: true },
  { id: 'c7', label: 'Hazardous waste transfer manifests compliant with CPCB 2016 rules', section: 'CPCB Haz-Waste Rules', checked: false },
  { id: 'c8', label: 'Daily SITREP transmitted to Directorate General of Shipping', section: 'Merchant Shipping Act', checked: false }
];

export default function NosDcpComplianceChecklist() {
  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);

  const toggleCriterion = (id) => {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const stats = useMemo(() => {
    const checkedCount = criteria.filter(c => c.checked).length;
    const totalCount = criteria.length;
    const score = Math.round((checkedCount / totalCount) * 100);

    let statusText = 'FULL STATUTORY COMPLIANCE';
    let statusColor = 'bg-emerald-50 text-status-success border-emerald-300';
    if (score < 75) {
      statusText = 'NON-COMPLIANT: MANDATORY ACTION REQUIRED';
      statusColor = 'bg-red-50 text-status-danger border-red-300';
    } else if (score < 100) {
      statusText = 'CONDITIONAL CLEARANCE: 2 ITEMS PENDING';
      statusColor = 'bg-amber-50 text-status-warning border-amber-300';
    }

    return { checkedCount, totalCount, score, statusText, statusColor };
  }, [criteria]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-success/10 text-status-success">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              NOS-DCP & MARPOL Statutory Compliance Auditor
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-status-success border border-emerald-200">
                {stats.score}% AUDIT SCORE
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Statutory verification against National Oil Spill Disaster Contingency Plan (NOS-DCP) criteria.
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${stats.statusColor}`}>
          ● {stats.statusText}
        </span>
      </div>

      {/* Progress Ring / Bar */}
      <div className="w-full bg-border-marine/50 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-ocean to-status-success rounded-full transition-all duration-500"
          style={{ width: `${stats.score}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {criteria.map((c) => (
          <div
            key={c.id}
            onClick={() => toggleCriterion(c.id)}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
              c.checked 
                ? 'bg-emerald-50/40 border-emerald-200 text-ocean-navy' 
                : 'bg-white border-border-marine text-text-muted hover:bg-ocean-light/20'
            }`}
          >
            <button type="button" className="mt-0.5 shrink-0">
              {c.checked ? (
                <CheckCircle2 className="w-4 h-4 text-status-success" />
              ) : (
                <Square className="w-4 h-4 text-text-muted" />
              )}
            </button>
            <div>
              <span className={`font-medium block leading-snug ${c.checked ? 'text-ocean-navy' : 'text-text-secondary'}`}>
                {c.label}
              </span>
              <span className="text-[9px] font-mono text-text-muted mt-0.5 block">
                Authority Ref: {c.section}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

