import React, { useState } from 'react';
import { Ship, Target, AlertTriangle, CheckCircle2, ChevronRight, ShieldAlert } from 'lucide-react';
import { RedactedText } from './ReportWatermarkRedaction';

export default function ReportVesselComparisonMatrix({ 
  caseData, 
  selectedVessel, 
  onSelectLeadVessel, 
  isRedacted, 
  onLogAudit 
}) {
  const vessels = caseData.candidateVessels || [caseData.topVessel];
  const [filterQuery, setFilterQuery] = useState('');

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (v.type && v.type.toLowerCase().includes(filterQuery.toLowerCase())) ||
    (v.flag && v.flag.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const handleSelect = (v) => {
    onSelectLeadVessel(v);
    if (onLogAudit) onLogAudit(`Designated ${v.name} as primary suspect candidate`);
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-status-danger">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Suspect Vessel Candidate Funnel & Attribution Matrix
            </h4>
            <p className="text-[10px] text-text-muted">
              XGBoost 24-feature scoring comparing spatial-temporal convergence with Lagrangian hindcast.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter candidates..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="px-2.5 py-1 text-xs font-mono bg-ocean-light border border-border-marine rounded-lg focus:outline-none w-44"
          />
        </div>
      </div>

      {/* Comparative Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="bg-ocean-light/70 border-b border-border-marine text-[10px] text-text-muted uppercase tracking-wider">
              <th className="p-2.5">Candidate Vessel</th>
              <th className="p-2.5">MMSI / Flag</th>
              <th className="p-2.5">Priority Score</th>
              <th className="p-2.5">AIS Gap (min)</th>
              <th className="p-2.5">Dist. to Origin</th>
              <th className="p-2.5">Speed Anomaly</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/50">
            {filteredVessels.map((v, idx) => {
              const isLead = (selectedVessel?.name || caseData.topVessel?.name) === v.name;
              const score = v.priorityScore || 85;

              return (
                <tr 
                  key={v.name || idx}
                  className={`transition-colors ${
                    isLead ? 'bg-red-50/50 font-semibold' : 'hover:bg-ocean-light/40'
                  }`}
                >
                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <Ship className={`w-3.5 h-3.5 ${isLead ? 'text-status-danger' : 'text-ocean'}`} />
                      <span className="text-ocean-navy font-bold text-xs">{v.name}</span>
                      {isLead && (
                        <span className="px-1.5 py-0.2 rounded bg-status-danger text-white text-[9px] font-bold">
                          RANK #1 TARGET
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-text-muted">{v.type || 'Crude Oil Tanker'} · {v.dwt ? `${v.dwt} DWT` : '115,000 DWT'}</span>
                  </td>

                  <td className="p-2.5 text-text-secondary text-[11px]">
                    <div>{isRedacted ? <RedactedText text={v.mmsi} isRedacted={true} customPlaceholder="[REDACTED]" /> : (v.mmsi || '419001248')}</div>
                    <span className="text-[10px] text-text-muted">{v.flag || 'Panama (FOC)'}</span>
                  </td>

                  <td className="p-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${score >= 85 ? 'text-status-danger' : 'text-amber-600'}`}>
                        {score}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${score >= 85 ? 'bg-status-danger' : 'bg-amber-500'}`} 
                          style={{ width: `${score}%` }} 
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-2.5 text-text-secondary text-[11px]">
                    <span className={v.aisGapMinutes > 20 ? 'text-status-danger font-bold' : ''}>
                      {v.aisGapMinutes || 38} min
                    </span>
                    <span className="block text-[9px] text-text-muted">174 pkts lost</span>
                  </td>

                  <td className="p-2.5 text-text-secondary text-[11px]">
                    <span>{v.distanceOriginNm || 1.4} nm</span>
                    <span className="block text-[9px] text-emerald-600 font-semibold">Direct Cross</span>
                  </td>

                  <td className="p-2.5 text-text-secondary text-[11px]">
                    <span className="text-amber-700">{v.speedAnomaly || '-4.2 kn drop'}</span>
                    <span className="block text-[9px] text-text-muted">Engine idle pattern</span>
                  </td>

                  <td className="p-2.5 text-right">
                    {isLead ? (
                      <span className="px-2 py-1 rounded bg-red-100 text-status-danger text-[10px] font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Lead Target
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSelect(v)}
                        className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean text-ocean hover:text-white border border-ocean/20 text-[10px] font-bold transition-all"
                      >
                        Set as Lead
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

