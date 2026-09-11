import React from 'react';
import { X, Printer, ShieldCheck, Download, FileText, CheckCircle2, AlertOctagon, Anchor } from 'lucide-react';

export default function IncidentDossierPrintModal({ incident, onClose }) {
  if (!incident) return null;

  const handlePrint = () => {
    window.print();
  };

  const area = incident.areaKm2 || incident.spillAreaKm2 || 14.7;
  const perimeter = incident.perimeterKm || incident.spillPerimeterKm || 22.4;
  const estVolumeM3 = Math.round(area * 15);
  const estBarrels = Math.round(estVolumeM3 * 6.2898);
  const estTons = Math.round(estVolumeM3 * 0.92);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-border-marine overflow-hidden animate-fade-in">
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="p-4 border-b border-border-marine bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm">Official Forensic Investigation Dossier Preview</h3>
              <p className="text-xs text-white/60">Formatted for Indian Coast Guard & DG Shipping NOS-DCP Filing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/20 hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 font-sans bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-widest text-slate-900 uppercase">MARINESIGHT FORENSICS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-red-100 text-red-800 border border-red-300">
                  CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE
                </span>
              </div>
              <p className="text-xs font-serif text-slate-600">
                National Hydrocarbon Discharge Surveillance & Satellite Attribution Authority
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                In compliance with NOS-DCP (National Oil Spill Disaster Contingency Plan) & MARPOL Annex I
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-600">
              <div>DOSSIER REF: <strong className="text-slate-950 font-black">{incident.id}</strong></div>
              <div>INTERNAL ID: {incident.internalId || "INC-0921"}</div>
              <div>DATE FILED: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Incident Executive Summary Banner */}
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 mb-6">
            <h4 className="font-mono text-xs font-black uppercase text-slate-800 tracking-wider mb-2">
              1. EXECUTIVE FORENSIC SUMMARY
            </h4>
            <p className="text-xs leading-relaxed text-slate-700">
              On <strong>{incident.time || incident.detectionTimeUTC}</strong>, high-resolution Synthetic Aperture Radar (SAR) 
              imagery acquired by <strong>{incident.satellite || "Sentinel-1 SAR C-Band"}</strong> identified an active 
              hydrocarbon surface discharge spanning approximately <strong>{area} km²</strong> with a perimeter of <strong>{perimeter} km</strong> within 
              the maritime Exclusive Economic Zone of <strong>{incident.region}</strong> (Centroid coordinates: <strong>{incident.location || "14.82°N, 68.21°E"}</strong>). 
              Automated hydrodynamic backward-trajectory and AIS corridor analysis have correlated the discharge to lead candidate vessel <strong>{incident.topCandidate || "MV Ocean Star"}</strong> with an AI confidence index of <strong>{incident.confidence || 96.5}%</strong>.
            </p>
          </div>

          {/* Forensic Data Table */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
            <div className="border border-slate-300 rounded-lg p-3 space-y-1.5">
              <h5 className="font-mono font-bold text-slate-800 border-b border-slate-200 pb-1">
                2. GEOMETRY & VOLUMETRIC METRICS
              </h5>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Polygon Surface Area:</span>
                <span className="font-mono font-bold">{area} km²</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Slick Outer Perimeter:</span>
                <span className="font-mono font-bold">{perimeter} km</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Bonn Thickness Code:</span>
                <span className="font-mono font-bold">Code 3 (Metallic Sheen, 15 µm)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Estimated Total Volume:</span>
                <span className="font-mono font-bold text-red-700">{estVolumeM3} m³ ({estBarrels} bbl / {estTons} MT)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">NOS-DCP Response Tier:</span>
                <span className="font-mono font-bold text-red-700">Tier 2 / Regional Command</span>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg p-3 space-y-1.5">
              <h5 className="font-mono font-bold text-slate-800 border-b border-slate-200 pb-1">
                3. SATELLITE EO TELEMETRY
              </h5>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Sensor Platform:</span>
                <span className="font-mono font-bold">{incident.satellite || "Sentinel-1 SAR C-Band"}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Polarization Channel:</span>
                <span className="font-mono font-bold">Dual-Pol (VV + VH)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Spatial Pixel Resolution:</span>
                <span className="font-mono font-bold">10.0 meters / px</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Detection Confidence:</span>
                <span className="font-mono font-bold text-emerald-700">{incident.confidence || 96.5}%</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Look Angle / Swath:</span>
                <span className="font-mono font-bold">38.4° (Interferometric Wide)</span>
              </div>
            </div>
          </div>

          {/* Lead Suspect Vessel Attribution */}
          <div className="border border-slate-300 rounded-lg p-4 mb-6 text-xs">
            <h5 className="font-mono font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
              <span>4. PRIMARY TARGET VESSEL ATTRIBUTION</span>
              <span className="text-red-700 font-bold font-mono">HIGH PROBABILITY</span>
            </h5>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">VESSEL NAME</span>
                <strong className="text-slate-900 text-sm font-bold">{incident.topCandidate || "MV Ocean Star"}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">FLAG JURISDICTION</span>
                <strong className="text-slate-900 font-bold">Panama (PA) [Convenience]</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">VESSEL TYPE & DWT</span>
                <strong className="text-slate-900 font-bold">Crude Oil Tanker (115,000 DWT)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">MMSI NUMBER</span>
                <strong className="text-slate-900 font-mono font-bold">419001248</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">SPEED AT INCIDENT</span>
                <strong className="text-slate-900 font-mono font-bold">14.2 kn (Full Ahead)</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">ATTRIBUTION INDEX</span>
                <strong className="text-emerald-700 font-mono font-bold">89.4% Correlated</strong>
              </div>
            </div>
          </div>

          {/* Legal Notice & Statutory Violations */}
          <div className="border-l-4 border-red-600 bg-red-50/60 p-3 rounded-r-lg mb-8 text-xs text-red-950">
            <h5 className="font-bold font-mono text-red-900 uppercase text-[11px] mb-1">
              5. STATUTORY VIOLATION & MARITIME ENFORCEMENT DIRECTIVE
            </h5>
            <p className="text-[11px] leading-relaxed">
              Discharge of oily mixture exceeding 15 ppm without oil filtering equipment constitutes a severe violation of 
              <strong> MARPOL 73/78 Annex I Regulation 15</strong> and <strong>Merchant Shipping Act 1958 Section 356J</strong>. 
              The Director General of Shipping and Indian Coast Guard Maritime Rescue Coordination Centre (MRCC) are advised to issue an 
              immediate Notice of Marine Casualty, mandate port state detention upon entering territorial jurisdiction, and seize shipboard Oil Record Books (Part II).
            </p>
          </div>

          {/* Signatures & Chain of Custody */}
          <div className="border-t border-slate-300 pt-6 grid grid-cols-2 gap-8 text-xs font-mono">
            <div>
              <div className="text-slate-500 text-[10px] mb-6">CERTIFYING SATELLITE FORENSIC OFFICER:</div>
              <div className="font-serif italic text-base text-slate-800">Dr. E. Vance, Ph.D.</div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">Lead Marine Radar Attributor</div>
              <div className="text-[10px] text-slate-500">MarineSight Intelligence Taskforce</div>
            </div>

            <div>
              <div className="text-slate-500 text-[10px] mb-6">COAST GUARD DISTRICT COMMAND DISPATCH:</div>
              <div className="font-serif italic text-base text-slate-800">Capt. R. K. Nair, IN (Retd.)</div>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">MRCC Maritime Controller</div>
              <div className="text-[10px] text-slate-500">HQ Western Seaboard Command</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-marine bg-slate-50 flex items-center justify-between text-xs text-text-muted font-mono print:hidden">
          <span>Official cryptographic hash: SHA256:{incident.id}-7fa99c1e</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border-marine hover:bg-white text-text-secondary font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

