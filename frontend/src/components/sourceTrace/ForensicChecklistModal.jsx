import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertCircle, X, Download, FileText, Check } from 'lucide-react';

export default function ForensicChecklistModal({ isOpen, onClose, vesselName = "MV OCEAN STAR" }) {
  const [items, setItems] = useState([
    {
      id: 1,
      category: "AIS & Radar Telemetry",
      title: "AIS Dark Gap Correlated to Spill Centroid",
      desc: "Vessel transponder silent for 4.5 hours within 2.0 NM of Zone A centroid during estimated release window.",
      status: "fail", // "pass", "fail", "inconclusive"
      marpolRef: "SOLAS Reg V/19.2",
      notes: "Dark gap initiated at 20:15 UTC and restored at 00:45 UTC."
    },
    {
      id: 2,
      category: "Navigation Anomaly",
      title: "Unscheduled Speed Deceleration in Open Water",
      desc: "Speed dropped from standard 14.2 kn cruising speed to 6.2 kn in international shipping lane.",
      status: "fail",
      marpolRef: "COLREGS Rule 6",
      notes: "Slowing down is consistent with uncontrolled bunker tank overflow or bilge pumping."
    },
    {
      id: 3,
      category: "Engine Room Telemetry",
      title: "Oil Record Book (Part I - Machinery Space) Verification",
      desc: "Audit entries for sludge tank disposal, bilge water holding tank capacity, and oily water separator.",
      status: "inconclusive",
      marpolRef: "MARPOL Annex I Reg 17",
      notes: "Port State Control inspection required upon arrival at Mumbai anchorage."
    },
    {
      id: 4,
      category: "Discharge Criteria",
      title: "15 PPM Oily-Water Separator Discharge Limiting",
      desc: "Discharge exceeded permissible 15 ppm limit and was conducted within special coastal area.",
      status: "fail",
      marpolRef: "MARPOL Annex I Reg 15",
      notes: "Bonn code 3/4 continuous slick confirms gross crude/sludge content well beyond 15 ppm."
    },
    {
      id: 5,
      category: "Satellite & SAR",
      title: "Sentinel-1 SAR Slick Morphology Alignment",
      desc: "Radar backscatter depression plume geometry aligns linearly with suspect vessel vector track.",
      status: "pass",
      marpolRef: "ESA SAR Evidence",
      notes: "Plume tail orientation matches vessel heading 284°."
    },
    {
      id: 6,
      category: "Hydrocarbon Fingerprinting",
      title: "Gas Chromatography-Mass Spectrometry (GC-MS) Matching",
      desc: "Biomarker ratio (Hopanes/Steranes C30/C29) matching vessel tank samples vs. open sea slick.",
      status: "inconclusive",
      marpolRef: "ASTM D3415 Standard",
      notes: "Coast Guard sampling intercept team dispatched to collect physical slick samples."
    },
    {
      id: 7,
      category: "Operational Log",
      title: "Nighttime Dark Period Execution",
      desc: "Discharge timing coincides with peak nocturnal stealth hours (03:12 IST) minimizing visual detection.",
      status: "fail",
      marpolRef: "Forensic Intent Analysis",
      notes: "Indicates deliberate bypass of daylight aerial surveillance patrol."
    },
    {
      id: 8,
      category: "Jurisdiction",
      title: "Exclusive Economic Zone (EEZ) Enforcement Authority",
      desc: "Event occurred at 14.65°N, 67.90°E (Indian EEZ, 178 NM from Ratnagiri Coast).",
      status: "pass",
      marpolRef: "UNCLOS Art. 211 / Coast Guard Act",
      notes: "Full Indian Coast Guard statutory jurisdiction for interdiction and detention."
    }
  ]);

  if (!isOpen) return null;

  const toggleStatus = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextStatus = item.status === 'pass' ? 'fail' : item.status === 'fail' ? 'inconclusive' : 'pass';
      return { ...item, status: nextStatus };
    }));
  };

  const updateNotes = (id, newNotes) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notes: newNotes } : item));
  };

  const failCount = items.filter(i => i.status === 'fail').length;
  const passCount = items.filter(i => i.status === 'pass').length;
  const inconclCount = items.filter(i => i.status === 'inconclusive').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-xs">
      <div className="bg-white border border-border-marine rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-ocean-navy text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">MARPOL Annex I Forensic Compliance Checklist</h3>
              <p className="text-[11px] text-slate-300 font-mono">Target Subject: {vesselName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Stat Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-border-marine flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-ocean-navy">EVIDENCE AUDIT SCORE:</span>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
              {failCount} Violations Flagged
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              {passCount} Verified Grounds
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
              {inconclCount} Pending Physical Sampling
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-border-marine/50 flex-1">
          {items.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-ocean font-bold uppercase">{item.category}</span>
                    <span className="text-[9px] font-mono text-text-muted">[{item.marpolRef}]</span>
                  </div>
                  <h4 className="text-xs font-bold text-ocean-navy mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-text-secondary mt-0.5">{item.desc}</p>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    item.status === 'fail'
                      ? 'bg-rose-50 text-rose-700 border border-rose-300'
                      : item.status === 'pass'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  {item.status === 'fail' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                  {item.status === 'pass' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {item.status === 'inconclusive' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{item.status === 'fail' ? 'VIOLATION' : item.status === 'pass' ? 'VERIFIED' : 'PENDING'}</span>
                </button>
              </div>

              {/* Editable Notes */}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] text-text-muted font-mono font-bold">Investigator Note:</span>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateNotes(item.id, e.target.value)}
                  className="flex-1 text-[11px] font-mono text-text-secondary bg-ocean-light/40 border border-border-marine rounded px-2 py-0.5 focus:outline-none focus:border-ocean"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-border-marine flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">
            Click badge on right to toggle status (VIOLATION / VERIFIED / PENDING)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all"
          >
            Save & Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
}

