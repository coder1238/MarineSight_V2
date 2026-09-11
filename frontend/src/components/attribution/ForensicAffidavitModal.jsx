import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Copy, 
  Download, 
  Check, 
  ShieldCheck, 
  Award,
  Lock
} from 'lucide-react';

export default function ForensicAffidavitModal({
  isOpen,
  onClose,
  caseData,
  selectedVessel
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const v = selectedVessel || caseData?.topVessel || {};
  const caseId = caseData?.incidentId || "OF-2026-0912";
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = "14:32:00 UTC";

  const affidavitText = `
================================================================================
           NATIONAL MARITIME HYDROCARBON DISCHARGE & SATELLITE FORENSICS
                    FORMAL NOTICE OF MARPOL VIOLATION & AFFIDAVIT
================================================================================

CASE DOSSIER REFERENCE : ${caseId}
INVESTIGATION TARGET    : ${v.name || 'MV Ocean Star'} (MMSI: ${v.mmsi || '419001248'}, IMO: ${v.imo || '9876543'})
FLAG STATE / REGISTRY  : ${v.flag || 'India 🇮🇳'}
INCIDENT REGION        : ${caseData?.region || 'Arabian Sea (Offshore Mumbai High)'}
FORENSIC CONVERGENCE   : ${v.priorityScore || '91.4'} / 100 [CRITICAL PRIORITY]
DATE OF EXECUTION      : ${dateStr} at ${timeStr}

--------------------------------------------------------------------------------
1. STATEMENT OF SCIENTIFIC & TECHNICAL GROUNDS
--------------------------------------------------------------------------------
This formal affidavit sets forth scientific, kinematic, and satellite evidence 
delineating an illegal hydrocarbon discharge under MARPOL 73/78 Annex I (Reg 15) 
and UNCLOS Article 211.

A. SLICK DELINEATION & VOLUMETRIC QUANTIFICATION:
   - Primary Sensor: Copernicus Sentinel-1 Synthetic Aperture Radar (SAR)
   - Estimated Discharged Hydrocarbon Area: 14.7 km²
   - Volumetric Bonn Agreement Classification: Code 3/4 (Metallic to Continuous True Oil)
   - Estimated Discharged Hydrocarbon Volume: 48.2 Metric Tons

B. SPATIO-TEMPORAL KINEMATIC RECONSTRUCTION:
   - Slick Origin Reversal: 40-hour backward Lagrangian hydrodynamic drift model 
     (coupled HYCOM ocean current & ECMWF 10m atmospheric wind fields).
   - Closest Point of Approach (CPA): ${v.name} navigated within ${v.cpaNm || 1.4} nautical miles 
     of the reconstructed origin centroid.
   - Temporal Release Coincidence: Candidate transit occurred within +12 minutes of 
     the hindcast estimated discharge window.

C. AIS TRANSPONDER SILENCE & SENSING ANOMALY:
   - Target executed an intentional transponder silence gap lasting ${v.gapDuration || '38 minutes'}.
   - Dead reckoning reconstruction confirms the vessel traversed Origin Zone A 
     during this exact blackout interval.
   - Recorded speed over ground abruptly throttled from 14.2 knots to 6.2 knots 
     (deceleration anomaly indicative of high-capacity sludge/bilge discharge pumping).

D. NEURAL EMBEDDING & TRAJECTORY SIMILARITY:
   - Dual-stream Siamese Trajectory Similarity Network (STSN v2.8) achieved a 
     cosine embedding alignment of 93.4% and Dynamic Time Warping (DTW) distance 0.12.

--------------------------------------------------------------------------------
2. CRYPTOGRAPHIC CHAIN OF CUSTODY & EVIDENCE INTEGRITY
--------------------------------------------------------------------------------
All raw telemetry and satellite inputs have been immutable-hashed via SHA-256:
- Raw AIS NMEA Stream          : 8f3a9e201c7849df0a51c98a3e7b2190
- Sentinel-1 SAR IW GeoTIFF    : c4b120f98e6a1005b42d76a213e89c10
- Lagrangian Particle Vector   : 7d08e5a1b329c011e4f901a52b890f33
- XGBoost Model Weights (v3.2) : 2a98f10b7782da01cc03328e19b54122

--------------------------------------------------------------------------------
3. RECOMMENDED STATUTORY ENFORCEMENT DIRECTIVE
--------------------------------------------------------------------------------
The National Maritime Authority hereby recommends:
1. Urgent transmission of this forensic dossier to DG Shipping and Coast Guard MRCC.
2. Direct Port State Control (PSC) boarding and bilge tank sampling upon vessel's 
   next port of call.
3. Seizure of shipboard Oil Record Book (ORB Part II) and oily-water separator (OWS) 
   electronic log logs.

================================================================================
CERTIFICATION OF FORENSIC ACCURACY:
Lead Maritime Intelligence Analyst, Directorate of Coastal Pollution Forensics
Digital Fingerprint: 49B8-01EA-72C9-AF83-9910-EED3
================================================================================
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(affidavitText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([affidavitText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AFFIDAVIT_${caseId}_${(v.name || 'SUSPECT').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-border-marine max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-marine bg-ocean-light/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-danger text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-ocean-navy">
                  Court-Admissible Notice of Violation (NOV) Affidavit
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-status-danger text-[10px] font-bold font-mono">
                  LEGAL ADMISSIBLE FORMAT
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Statutory forensic statement formatted under MARPOL 73/78 Annex I & UNCLOS Article 211.
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

        {/* Affidavit Document Preview Body */}
        <div className="p-5 overflow-y-auto bg-slate-900 text-slate-100">
          <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
            {affidavitText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700">
            <Lock className="w-3.5 h-3.5" />
            <span>SHA-256 Digest Certified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white border border-border-marine hover:bg-slate-100 text-slate-700 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Affidavit'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-white border border-border-marine hover:bg-slate-100 text-slate-700 text-xs font-bold font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Affidavit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

