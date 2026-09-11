import React, { useState } from 'react';
import { Scale, CheckSquare, Square, ShieldCheck, AlertCircle, FileCheck2, Info } from 'lucide-react';

export const INITIAL_CHECKLIST = [
  { id: "c1", title: "Cryptographic Chain of Custody Verified", statute: "Indian Evidence Act Sec 65B", met: true, desc: "SHA-256 digital signatures unbroken from raw sensor ingest to court dossier." },
  { id: "c2", title: "Sentinel-1 SAR Radiometric Calibration Certified", statute: "ISO 17025 Quality Spec", met: true, desc: "Sigma-naught radar backscatter calibrated with ESA ground transponder." },
  { id: "c3", title: "AIS Time Synchronization Cross-Checked", statute: "IALA Guideline G1128", met: true, desc: "Dual terrestrial coastal AIS receivers (Goa + Karwar) validated zero clock drift." },
  { id: "c4", title: "Hydrodynamic Hindcast Uncertainty Circle < 1.0 nm", statute: "IMO MEPC.1/Circ.879", met: true, desc: "Monte Carlo 100-particle hindcast confirms 94.2% convergence with vessel track." },
  { id: "c5", title: "Exclusion of Neighboring Commercial Transits", statute: "UNCLOS Article 217", met: true, desc: "All 18 corridor vessels vetted; zero alternative candidates within 12 nm of origin." },
  { id: "c6", title: "Expert Witness Analytical Affidavit Endorsed", statute: "MARPOL Annex I Reg 15", met: false, desc: "Formal endorsement pending Principal Officer, Mercantile Marine Department (MMD)." }
];

export default function LegalAdmissibilityChecklist() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  const toggleCheck = (id) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, met: !item.met } : item)
    );
  };

  const metCount = checklist.filter(c => c.met).length;
  const score = Math.round((metCount / checklist.length) * 100);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Legal Admissibility & MARPOL Annex I Compliance Auditor
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Admissibility Index:</span>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
            score >= 80 ? "bg-emerald-100 text-status-success border border-emerald-200" : "bg-amber-100 text-status-warning border border-amber-200"
          }`}>
            {score}% ({metCount}/{checklist.length} CRITERIA MET)
          </span>
        </div>
      </div>

      {/* Compliance Banner */}
      <div className="flex items-center justify-between bg-ocean-sky/40 border border-ocean/30 rounded-xl p-2.5">
        <div className="flex items-center gap-2 text-ocean-navy">
          <ShieldCheck className="w-4 h-4 text-ocean flex-shrink-0" />
          <span className="font-bold">
            {score >= 80 ? "PRIMA-FACIE ADMISSIBLE FOR PORT STATE DETENTION (PSC)" : "REQUIRES FURTHER SENSOR CORROBORATION"}
          </span>
        </div>
        <span className="text-[10px] text-text-muted">
          UNCLOS Art. 217 Enforcement Protocol
        </span>
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
              item.met
                ? "bg-white border-border-marine hover:border-ocean/40"
                : "bg-slate-50 border-slate-200 opacity-75"
            }`}
          >
            <button className="mt-0.5 text-ocean focus:outline-none flex-shrink-0">
              {item.met ? (
                <CheckSquare className="w-4 h-4 text-status-success" />
              ) : (
                <Square className="w-4 h-4 text-text-muted" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs truncate ${item.met ? "text-ocean-navy" : "text-text-secondary"}`}>
                  {item.title}
                </span>
                <span className="text-[9px] text-text-muted font-mono flex-shrink-0 ml-1">
                  {item.statute}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary font-sans mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

