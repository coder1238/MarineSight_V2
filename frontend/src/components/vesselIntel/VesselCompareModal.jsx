import React, { useState } from 'react';
import { X, Scale, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function VesselCompareModal({ isOpen, onClose, candidateList, defaultVesselA }) {
  const [vesselAId, setVesselAId] = useState(defaultVesselA?.mmsi || candidateList[0]?.mmsi);
  const [vesselBId, setVesselBId] = useState(candidateList[1]?.mmsi || candidateList[0]?.mmsi);

  if (!isOpen) return null;

  const vesselA = candidateList.find(v => v.mmsi === vesselAId) || candidateList[0];
  const vesselB = candidateList.find(v => v.mmsi === vesselBId) || candidateList[1] || candidateList[0];

  const metrics = [
    { label: "Investigation Priority Score", key: "priorityScore", unit: "/100", higherRisk: "higher" },
    { label: "Closest Point of Approach (CPA)", key: "cpaNm", unit: "nm", higherRisk: "lower" },
    { label: "Blackout Duration", key: "gapDuration", unit: "", higherRisk: "custom" },
    { label: "Spatial Proximity Match", key: "spatialMatch", unit: "%", higherRisk: "higher" },
    { label: "Temporal Overlap Match", key: "temporalMatch", unit: "%", higherRisk: "higher" },
    { label: "Trajectory Drift Alignment", key: "trajectoryMatch", unit: "%", higherRisk: "higher" },
    { label: "Deceleration / Behavior Anomaly", key: "behaviorMatch", unit: "%", higherRisk: "higher" },
    { label: "AIS Gap Suspicion Score", key: "aisGapScore", unit: "%", higherRisk: "higher" },
    { label: "Current Speed", key: "speedKn", unit: "kn", higherRisk: "neutral" },
    { label: "Vessel Length", key: "lengthM", unit: "m", higherRisk: "neutral" },
    { label: "Vessel Beam", key: "beamM", unit: "m", higherRisk: "neutral" },
  ];

  const getMetricValue = (vessel, key) => {
    if (!vessel) return 'N/A';
    if (key === 'cpaNm') return vessel.cpaNm !== undefined ? vessel.cpaNm : 1.4;
    if (key === 'gapDuration') return vessel.gapDuration || "None";
    return vessel[key] !== undefined ? vessel[key] : 'N/A';
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-border-marine rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-ocean-light border-b border-border-marine flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-ocean text-white rounded-xl shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-ocean-navy">
                Suspect Vessel Comparative Forensic Matrix
              </h2>
              <p className="text-xs text-text-secondary">
                Head-to-head multi-attribute correlation and risk ranking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vessel Selector Dropdowns Header */}
        <div className="p-4 grid grid-cols-2 gap-4 bg-ocean-sky/40 border-b border-border-marine">
          {/* Ship A Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-text-muted uppercase font-bold block">
              TARGET VESSEL ALPHA
            </label>
            <select
              value={vesselAId}
              onChange={(e) => setVesselAId(e.target.value)}
              className="w-full p-2.5 bg-white border border-border-marine rounded-xl text-xs font-bold text-ocean-navy focus:ring-2 focus:ring-ocean"
            >
              {candidateList.map(v => (
                <option key={v.mmsi} value={v.mmsi}>
                  {v.rank}. {v.name} ({v.type}) — MMSI {v.mmsi}
                </option>
              ))}
            </select>
            <div className="text-[11px] font-mono text-text-secondary">
              {vesselA.flag} · Flag State | Status: <span className="font-bold text-status-danger">{vesselA.status}</span>
            </div>
          </div>

          {/* Ship B Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-text-muted uppercase font-bold block">
              TARGET VESSEL BRAVO
            </label>
            <select
              value={vesselBId}
              onChange={(e) => setVesselBId(e.target.value)}
              className="w-full p-2.5 bg-white border border-border-marine rounded-xl text-xs font-bold text-ocean-navy focus:ring-2 focus:ring-ocean"
            >
              {candidateList.map(v => (
                <option key={v.mmsi} value={v.mmsi}>
                  {v.rank}. {v.name} ({v.type}) — MMSI {v.mmsi}
                </option>
              ))}
            </select>
            <div className="text-[11px] font-mono text-text-secondary">
              {vesselB.flag} · Flag State | Status: <span className="font-bold text-status-warning">{vesselB.status}</span>
            </div>
          </div>
        </div>

        {/* Comparative Table Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-border-marine/60 font-mono text-xs">
          {metrics.map((m, idx) => {
            const valA = getMetricValue(vesselA, m.key);
            const valB = getMetricValue(vesselB, m.key);
            const numA = typeof valA === 'number' ? valA : parseFloat(valA) || 0;
            const numB = typeof valB === 'number' ? valB : parseFloat(valB) || 0;

            const isAHigher = numA > numB;
            const isBHigher = numB > numA;
            const delta = Math.abs(numA - numB).toFixed(1);

            return (
              <div key={idx} className="py-2.5 grid grid-cols-12 items-center hover:bg-ocean-light/40 rounded-lg px-2 transition-colors">
                {/* Vessel A Value */}
                <div className="col-span-4 text-left">
                  <span className={`text-xs font-bold ${
                    m.key === 'priorityScore' && numA >= 80 ? 'text-status-danger text-sm' : 'text-ocean-navy'
                  }`}>
                    {valA} {m.unit}
                  </span>
                  {m.higherRisk === "higher" && isAHigher && numA !== numB && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-status-danger font-semibold">
                      +{delta}
                    </span>
                  )}
                </div>

                {/* Metric Label (Center) */}
                <div className="col-span-4 text-center font-sans text-[11px] font-semibold text-text-secondary">
                  {m.label}
                </div>

                {/* Vessel B Value */}
                <div className="col-span-4 text-right">
                  {m.higherRisk === "higher" && isBHigher && numA !== numB && (
                    <span className="mr-1 text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-status-danger font-semibold">
                      +{delta}
                    </span>
                  )}
                  <span className={`text-xs font-bold ${
                    m.key === 'priorityScore' && numB >= 80 ? 'text-status-danger text-sm' : 'text-ocean-navy'
                  }`}>
                    {valB} {m.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Verdict */}
        <div className="p-4 bg-ocean-light border-t border-border-marine flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-status-danger" />
            <span className="font-mono text-text-primary text-[11px]">
              LEAD FORENSIC SUSPECT: <strong className="text-status-danger font-bold">{vesselA.priorityScore >= vesselB.priorityScore ? vesselA.name : vesselB.name}</strong> (Higher Correlation by {Math.abs((vesselA.priorityScore || 91) - (vesselB.priorityScore || 76)).toFixed(1)} pts)
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-ocean-navy text-white rounded-xl font-bold hover:bg-ocean-deep transition-colors text-xs shadow-sm"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}

