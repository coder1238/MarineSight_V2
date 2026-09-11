import React, { useState } from 'react';
import { AlertOctagon, Info, CheckCircle2 } from 'lucide-react';

export const RISK_ITEMS = [
  { id: "R1", name: "Mangrove Estuary Oil Smothering", likelihood: 5, consequence: 5, color: "bg-red-500", desc: "Zuari/Mandovi creek tide influx will trap thick emulsion in mangrove root systems." },
  { id: "R2", name: "Commercial Fishery Suspension", likelihood: 5, consequence: 4, color: "bg-red-500", desc: "Complete ban on artisanal and trawler fishing across 40 nm coastal strip." },
  { id: "R3", name: "Courtroom AIS Admissibility Challenge", likelihood: 2, consequence: 4, color: "bg-amber-500", desc: "Defense may contest AIS silence gap without physical fuel oil chromatography." },
  { id: "R4", name: "Tourist Beach Tarry Residue Influx", likelihood: 4, consequence: 3, color: "bg-amber-500", desc: "Colva & Benaulim beach contamination impacting resort revenues." },
  { id: "R5", name: "Mormugao Port Approach Blockage", likelihood: 3, consequence: 4, color: "bg-amber-500", desc: "Bulk ore carrier vessel diversion fees if harbor fairway is boomed." },
  { id: "R6", name: "Secondary Tanker Discharge Recidivism", likelihood: 1, consequence: 5, color: "bg-amber-500", desc: "Additional bilge discharge along international shipping corridor." }
];

export default function RiskHeatmapGrid() {
  const [selectedItem, setSelectedItem] = useState(RISK_ITEMS[0]);

  // Likelihood: 5 down to 1
  const likelihoods = [
    { level: 5, label: "5 - Almost Certain" },
    { level: 4, label: "4 - Likely" },
    { level: 3, label: "3 - Possible" },
    { level: 2, label: "2 - Unlikely" },
    { level: 1, label: "1 - Rare" }
  ];

  // Consequence: 1 up to 5
  const consequences = [
    { level: 1, label: "1 - Insignificant" },
    { level: 2, label: "2 - Minor" },
    { level: 3, label: "3 - Moderate" },
    { level: 4, label: "4 - Major" },
    { level: 5, label: "5 - Catastrophic" }
  ];

  const getCellSeverity = (l, c) => {
    const score = l * c;
    if (score >= 16) return "bg-red-100 text-status-danger border-red-200 hover:bg-red-200";
    if (score >= 10) return "bg-amber-100 text-status-warning border-amber-200 hover:bg-amber-200";
    if (score >= 5) return "bg-blue-50 text-ocean border-blue-200 hover:bg-blue-100";
    return "bg-emerald-50 text-status-success border-emerald-200 hover:bg-emerald-100";
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            5×5 Likelihood vs. Consequence Risk Heatmap Matrix
          </h3>
        </div>
        <span className="text-[11px] text-text-muted">
          ISO 31010 Maritime Risk Assessment Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Heatmap Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="text-[10px] text-text-muted font-bold uppercase text-center">
            CONSEQUENCE SEVERITY →
          </div>
          <div className="space-y-1">
            {likelihoods.map((l) => (
              <div key={l.level} className="flex items-center gap-1">
                <span className="w-20 text-[9px] text-text-secondary truncate text-right font-bold pr-1">
                  {l.label}
                </span>
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {consequences.map((c) => {
                    const matchedItems = RISK_ITEMS.filter(
                      (item) => item.likelihood === l.level && item.consequence === c.level
                    );
                    const cellClass = getCellSeverity(l.level, c.level);

                    return (
                      <div
                        key={c.level}
                        className={`h-11 rounded-lg border p-1 flex flex-wrap items-center justify-center gap-1 transition-all cursor-pointer ${cellClass}`}
                      >
                        {matchedItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="px-1 py-0.5 rounded bg-ocean-navy text-white text-[9px] font-bold shadow hover:scale-110 transition-transform"
                            title={item.name}
                          >
                            {item.id}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pl-20 text-[9px] text-text-muted font-bold uppercase pt-1">
            <span>1 Insignif.</span>
            <span>2 Minor</span>
            <span>3 Moderate</span>
            <span>4 Major</span>
            <span>5 Catastr.</span>
          </div>
        </div>

        {/* Selected Risk Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-ocean-light/50 border border-border-marine rounded-xl p-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border-marine pb-2">
              <span className="text-[10px] text-text-muted font-bold uppercase">RISK DETAIL INSPECTION</span>
              <span className="px-2 py-0.5 rounded bg-ocean-navy text-white text-[10px] font-bold">
                {selectedItem.id}
              </span>
            </div>

            <h4 className="text-xs font-extrabold text-ocean-navy">{selectedItem.name}</h4>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              {selectedItem.desc}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="bg-white p-2 rounded border border-border-marine">
                <span className="text-text-muted block">LIKELIHOOD:</span>
                <span className="text-status-danger font-bold">{selectedItem.likelihood} / 5</span>
              </div>
              <div className="bg-white p-2 rounded border border-border-marine">
                <span className="text-text-muted block">CONSEQUENCE:</span>
                <span className="text-status-danger font-bold">{selectedItem.consequence} / 5</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border-marine text-[10px] text-text-muted flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-ocean flex-shrink-0" />
            <span>Click any ID tag in the 5×5 matrix to inspect operational risk impact.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

