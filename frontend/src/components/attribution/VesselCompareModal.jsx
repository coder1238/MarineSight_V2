import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Ship, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  FileText,
  ArrowRight
} from 'lucide-react';

export default function VesselCompareModal({
  isOpen,
  onClose,
  candidateList,
  initialVessel1,
  initialVessel2
}) {
  const [vessel1Mmsi, setVessel1Mmsi] = useState(initialVessel1?.mmsi || candidateList[0]?.mmsi);
  const [vessel2Mmsi, setVessel2Mmsi] = useState(initialVessel2?.mmsi || candidateList[1]?.mmsi || candidateList[0]?.mmsi);

  if (!isOpen) return null;

  const v1 = candidateList.find(c => c.mmsi === vessel1Mmsi) || candidateList[0];
  const v2 = candidateList.find(c => c.mmsi === vessel2Mmsi) || candidateList[1] || candidateList[0];

  const comparisonMetrics = [
    {
      label: "Attribution Priority Score",
      val1: `${v1.priorityScore} / 100`,
      val2: `${v2.priorityScore} / 100`,
      better: v1.priorityScore > v2.priorityScore ? 1 : 2,
      danger: true
    },
    {
      label: "Priority Tier & Status",
      val1: v1.status,
      val2: v2.status,
      badge: true
    },
    {
      label: "Vessel Type & Flag",
      val1: `${v1.type} (${v1.flag})`,
      val2: `${v2.type} (${v2.flag})`
    },
    {
      label: "MMSI / IMO Registry",
      val1: `${v1.mmsi} / ${v1.imo || '9876543'}`,
      val2: `${v2.mmsi} / ${v2.imo || '9641120'}`
    },
    {
      label: "Dimensions (Length × Beam)",
      val1: `${v1.lengthM || 274}m × ${v1.beamM || 48}m`,
      val2: `${v2.lengthM || 182}m × ${v2.beamM || 32}m`
    },
    {
      label: "Distance to Slick Origin (CPA)",
      val1: `${v1.cpaNm || 1.4} NM`,
      val2: `${v2.cpaNm || 4.8} NM`,
      better: (v1.cpaNm || 1.4) < (v2.cpaNm || 4.8) ? 1 : 2,
      danger: true
    },
    {
      label: "AIS Transponder Silence Gap",
      val1: v1.gapDuration || "38 min",
      val2: v2.gapDuration || "14 min",
      better: v1.aisGapScore > v2.aisGapScore ? 1 : 2,
      danger: true
    },
    {
      label: "AIS Transponder Gap Score",
      val1: `${v1.aisGapScore} / 100`,
      val2: `${v2.aisGapScore} / 100`,
      better: v1.aisGapScore > v2.aisGapScore ? 1 : 2,
      danger: true
    },
    {
      label: "Siamese Trajectory Similarity (DTW)",
      val1: `${v1.trajectoryMatch}%`,
      val2: `${v2.trajectoryMatch}%`,
      better: v1.trajectoryMatch > v2.trajectoryMatch ? 1 : 2
    },
    {
      label: "Spatial Corridor Match",
      val1: `${v1.spatialMatch}%`,
      val2: `${v2.spatialMatch}%`,
      better: v1.spatialMatch > v2.spatialMatch ? 1 : 2
    },
    {
      label: "Temporal Coincidence",
      val1: `${v1.temporalMatch}%`,
      val2: `${v2.temporalMatch}%`,
      better: v1.temporalMatch > v2.temporalMatch ? 1 : 2
    },
    {
      label: "Kinematic Deceleration Anomaly",
      val1: v1.rank === '01' ? "Detected (14.2 kn → 6.2 kn)" : "Nominal Cruising",
      val2: v2.rank === '01' ? "Detected (14.2 kn → 6.2 kn)" : "Nominal Cruising",
      danger: v1.rank === '01' ? 1 : 0
    },
    {
      label: "SAR Radar Cross Section (RCS) Fit",
      val1: v1.rank === '01' ? "98.2% Match (278m target)" : "82.4% Match",
      val2: v2.rank === '01' ? "98.2% Match (278m target)" : "76.1% Match"
    },
    {
      label: "Registered P&I Club / Insurer",
      val1: v1.rank === '01' ? "Gard P&I (Norway)" : "Britannia Steam Ship",
      val2: v2.rank === '01' ? "Gard P&I (Norway)" : "UK P&I Club"
    },
    {
      label: "Prior MARPOL Deficiencies (PSC)",
      val1: v1.rank === '01' ? "2 Deficiencies (Annex I, 2024)" : "Clean Record (0 Deficiencies)",
      val2: v2.rank === '01' ? "2 Deficiencies (Annex I, 2024)" : "Clean Record (0 Deficiencies)",
      danger: v1.rank === '01' ? 1 : 0
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-border-marine max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-marine bg-ocean-light/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-ocean-navy">
                  Side-by-Side Candidate Vessel Comparison Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-ocean/10 text-ocean text-[10px] font-bold font-mono">
                  COMPARATIVE FORENSICS
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Direct cross-examination of kinematic parameters, transponder silences, and neural evidence scores.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-ocean-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vessel Selectors Bar */}
        <div className="p-4 bg-ocean-sky/30 border-b border-border-marine grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-text-muted font-mono uppercase block mb-1">
              Target Candidate A:
            </label>
            <select
              value={vessel1Mmsi}
              onChange={(e) => setVessel1Mmsi(e.target.value)}
              className="w-full bg-white border border-border-marine rounded-xl px-3 py-2 text-xs font-mono font-bold text-ocean-navy focus:outline-none focus:border-ocean"
            >
              {candidateList.map(c => (
                <option key={c.mmsi} value={c.mmsi}>
                  #{c.rank} · {c.name} ({c.type}) — Priority {c.priorityScore}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted font-mono uppercase block mb-1">
              Target Candidate B:
            </label>
            <select
              value={vessel2Mmsi}
              onChange={(e) => setVessel2Mmsi(e.target.value)}
              className="w-full bg-white border border-border-marine rounded-xl px-3 py-2 text-xs font-mono font-bold text-ocean-navy focus:outline-none focus:border-ocean"
            >
              {candidateList.map(c => (
                <option key={c.mmsi} value={c.mmsi}>
                  #{c.rank} · {c.name} ({c.type}) — Priority {c.priorityScore}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table Body */}
        <div className="p-5 overflow-y-auto">
          <div className="border border-border-marine rounded-2xl overflow-hidden shadow-marine-sm">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-ocean-light border-b border-border-marine text-[10px] text-ocean-navy font-bold uppercase">
                <tr>
                  <th className="px-4 py-3 w-1/3">FORENSIC PARAMETER</th>
                  <th className="px-4 py-3 w-1/3 bg-ocean-sky/40 border-r border-border-marine">
                    {v1.name} (#{v1.rank})
                  </th>
                  <th className="px-4 py-3 w-1/3 bg-ocean-sky/20">
                    {v2.name} (#{v2.rank})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60">
                {comparisonMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-text-secondary">
                      {row.label}
                    </td>

                    {/* Vessel 1 Value */}
                    <td className={`px-4 py-2.5 border-r border-border-marine ${
                      row.better === 1 && row.danger ? 'bg-red-50 text-status-danger font-extrabold' :
                      row.better === 1 ? 'bg-ocean-sky/30 text-ocean-deep font-bold' : 'text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span>{row.val1}</span>
                        {row.better === 1 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-status-danger font-bold uppercase">
                            Suspect Factor
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Vessel 2 Value */}
                    <td className={`px-4 py-2.5 ${
                      row.better === 2 && row.danger ? 'bg-red-50 text-status-danger font-extrabold' :
                      row.better === 2 ? 'bg-ocean-sky/30 text-ocean-deep font-bold' : 'text-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span>{row.val2}</span>
                        {row.better === 2 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-status-danger font-bold uppercase">
                            Suspect Factor
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Differential Conclusion Card */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs font-mono text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] block">
                ANALYTICAL DIFFERENTIAL CONCLUSION:
              </span>
              <p className="text-[11px] leading-relaxed mt-0.5 font-sans">
                <strong>{v1.name}</strong> exhibits <strong>{(v1.priorityScore - v2.priorityScore).toFixed(1)} points higher priority</strong> than <strong>{v2.name}</strong>. The principal discriminant is <strong>{v1.name}’s 38-minute AIS silence gap</strong> precisely coincident with the oil origin corridor, corroborated by a <strong>6.2-knot speed deceleration anomaly</strong> and 1.4 NM closest proximity.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md transition-all"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}

