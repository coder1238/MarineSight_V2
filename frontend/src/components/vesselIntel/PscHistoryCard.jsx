import React, { useState } from 'react';
import { ClipboardList, AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, History } from 'lucide-react';

export default function PscHistoryCard({ vessel }) {
  const isHighPriority = vessel.status === "HIGH PRIORITY" || vessel.rank === "01";

  const pscRecords = [
    {
      date: "14 JUN 2026",
      port: "Port of Singapore 🇸🇬",
      authority: "Tokyo MoU",
      type: "Initial & Expanded PSC",
      deficiencies: isHighPriority ? 4 : 1,
      detained: false,
      marpolIssue: isHighPriority ? "Code 14108: 15 ppm bilge alarm sensor calibration expired" : "None",
      status: isHighPriority ? "warning" : "clear"
    },
    {
      date: "22 JAN 2026",
      port: "Rotterdam 🇳🇱",
      authority: "Paris MoU",
      type: "Standard Safety Inspection",
      deficiencies: isHighPriority ? 6 : 0,
      detained: isHighPriority ? true : false,
      marpolIssue: isHighPriority ? "Code 14104: Oil filtering equipment valve bypass seal damaged" : "None",
      status: isHighPriority ? "danger" : "clear"
    },
    {
      date: "09 OCT 2025",
      port: "Fujairah 🇦🇪",
      authority: "Indian Ocean MoU",
      type: "Bunkering & MARPOL Audit",
      deficiencies: 2,
      detained: false,
      marpolIssue: "Code 14115: Oil Record Book Part I entry discrepancies",
      status: "warning"
    },
  ];

  const totalDeficiencies = pscRecords.reduce((acc, r) => acc + r.deficiencies, 0);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Port State Control (PSC) Inspection Dossier
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Tokyo MoU, Paris MoU & Indian Ocean MoU safety deficiency history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">PSC TARGET FACTOR:</span>
          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
            isHighPriority ? 'bg-red-50 text-status-danger border border-red-200' : 'bg-emerald-50 text-status-success'
          }`}>
            {isHighPriority ? 'HIGH RISK (TF: 84)' : 'LOW RISK (TF: 18)'}
          </span>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">TOTAL DEFICIENCIES</span>
          <span className={`text-base font-bold mt-0.5 block ${totalDeficiencies > 5 ? 'text-status-danger' : 'text-ocean-navy'}`}>
            {totalDeficiencies} Recorded
          </span>
          <span className="text-[9px] text-text-muted">Last 24-month window</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">HISTORICAL DETENTIONS</span>
          <span className={`text-base font-bold mt-0.5 block ${isHighPriority ? 'text-status-danger' : 'text-status-success'}`}>
            {isHighPriority ? '1 Detention (Rotterdam)' : '0 Detentions'}
          </span>
          <span className="text-[9px] text-text-muted">Port State order</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">MARPOL ANNEX I CITATIONS</span>
          <span className={`text-base font-bold mt-0.5 block ${isHighPriority ? 'text-status-danger' : 'text-status-warning'}`}>
            {isHighPriority ? '3 Citations' : '1 Minor Citation'}
          </span>
          <span className="text-[9px] text-text-muted">Pollution prevention</span>
        </div>
      </div>

      {/* Detailed Inspections Table */}
      <div className="space-y-2">
        {pscRecords.map((rec, i) => (
          <div
            key={i}
            className="p-3 bg-ocean-light/50 border border-border-marine/70 rounded-xl space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ocean-navy">{rec.port}</span>
                <span className="text-[10px] text-text-muted">({rec.authority})</span>
              </div>
              <span className="text-[10px] text-text-muted">{rec.date}</span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-text-secondary font-sans">{rec.type}</span>
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  rec.deficiencies > 3 ? 'bg-red-100 text-status-danger' : 'bg-ocean-sky text-ocean-deep'
                }`}>
                  {rec.deficiencies} Deficiencies
                </span>
                {rec.detained && (
                  <span className="px-1.5 py-0.5 rounded bg-status-danger text-white font-bold">
                    VESSEL DETAINED
                  </span>
                )}
              </div>
            </div>

            {rec.marpolIssue !== "None" && (
              <div className="text-[10px] text-status-danger bg-red-50/80 p-1.5 rounded border border-red-200 flex items-start gap-1.5">
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="font-sans font-medium">{rec.marpolIssue}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

