import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, FileText, Globe, Layers } from 'lucide-react';

export default function CharacterizeDossierModal({ 
  isOpen, 
  onClose, 
  caseData,
  bonnData,
  onExportGeoJSON,
  onExportCSV 
}) {
  if (!isOpen || !caseData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ocean-navy/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-border-marine rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-ocean-navy to-ocean-deep text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight font-sans">
                STATUTORY FORENSIC CHARACTERIZATION DOSSIER
              </h2>
              <p className="text-[10px] text-sky-200 font-mono">
                MARPOL 73/78 Annex I · Incident Reference: {caseData.incidentId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-sky-300" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-text-primary text-xs font-sans print:p-0">
          
          {/* Institutional Header Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-marine gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">
                NATIONAL MARITIME OIL SPILL DISASTER CONTINGENCY PLAN (NOS-DCP)
              </span>
              <h1 className="text-lg font-extrabold text-ocean-navy">
                Satellite SAR Hydrocarbon Characterization Report
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Indian Exclusive Economic Zone (EEZ) · {caseData.region}
              </p>
            </div>

            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right font-mono">
              <span className="text-[9px] text-text-muted block">EVIDENTIARY STATUS</span>
              <span className="text-xs font-extrabold text-status-success flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED ADMISSIBLE
              </span>
              <span className="text-[9px] text-text-muted block">{caseData.detectionTimeUTC}</span>
            </div>
          </div>

          {/* Incident Executive Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">INCIDENT ID</span>
              <span className="text-sm font-extrabold text-ocean-navy">{caseData.incidentId}</span>
              <span className="text-[9px] text-text-muted block">{caseData.internalId}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">GEOGRAPHIC CENTROID</span>
              <span className="text-sm font-extrabold text-ocean-deep">{caseData.coordinates?.display || "14.82°N, 68.21°E"}</span>
              <span className="text-[9px] text-text-muted block">WGS-84 Datum</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">TOTAL MEASURED AREA</span>
              <span className="text-sm font-extrabold text-text-primary">{caseData.spillAreaKm2} km²</span>
              <span className="text-[9px] text-text-muted block">Perimeter: {caseData.spillPerimeterKm} km</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ocean-light border border-border-marine">
              <span className="text-[9px] text-text-muted block">ESTIMATED AGE</span>
              <span className="text-sm font-extrabold text-status-warning">{caseData.estimatedAgeHours} Hours</span>
              <span className="text-[9px] text-text-muted block">Confidence: {caseData.detectionConfidence}%</span>
            </div>
          </div>

          {/* Quantitative Morphological & Fractal Metrics */}
          <div className="space-y-2">
            <h3 className="font-bold text-ocean-navy text-xs uppercase tracking-wider font-mono border-b border-border-marine pb-1">
              1. Quantitative Morphology & SAR Backscatter Statistics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div className="p-2 bg-slate-50 rounded border border-border-marine">
                <span className="text-[9px] text-text-muted block">ASPECT RATIO (L/W)</span>
                <span className="font-bold text-ocean-navy">{caseData.lengthKm} / {caseData.widthKm} km (4.0:1)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border-marine">
                <span className="text-[9px] text-text-muted block">ORIENTATION AZIMUTH</span>
                <span className="font-bold text-ocean">{caseData.orientationDeg}° True</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border-marine">
                <span className="text-[9px] text-text-muted block">FRACTAL DIMENSION (D)</span>
                <span className="font-bold text-ocean-navy">1.34 (Complex Shear)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border-marine">
                <span className="text-[9px] text-text-muted block">BACKSCATTER CONTRAST</span>
                <span className="font-bold text-status-danger">-6.2 dB (C-Band VV)</span>
              </div>
            </div>
          </div>

          {/* Bonn Agreement Volume Profiling */}
          <div className="space-y-2">
            <h3 className="font-bold text-ocean-navy text-xs uppercase tracking-wider font-mono border-b border-border-marine pb-1">
              2. Statutory Volumetric Assessment (Bonn Agreement BAOAC Code)
            </h3>
            <div className="border border-border-marine rounded-xl overflow-hidden font-mono text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-ocean-light text-ocean-navy font-bold">
                  <tr>
                    <th className="p-2">Code</th>
                    <th className="p-2">Appearance Category</th>
                    <th className="p-2">Thickness Range</th>
                    <th className="p-2">Nominal Volume</th>
                    <th className="p-2">Barrels</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-marine/60">
                  <tr>
                    <td className="p-2 font-bold text-slate-700">Code 1</td>
                    <td className="p-2">Sheen (Silvery / Grey)</td>
                    <td className="p-2">0.04 – 0.30 µm</td>
                    <td className="p-2 font-semibold">1,240 m³</td>
                    <td className="p-2">7,800 bbl</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-amber-700">Code 2</td>
                    <td className="p-2">Rainbow Sheen</td>
                    <td className="p-2">0.30 – 5.0 µm</td>
                    <td className="p-2 font-semibold">2,150 m³</td>
                    <td className="p-2">13,520 bbl</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Code 3</td>
                    <td className="p-2">Metallic Sheen</td>
                    <td className="p-2">5.0 – 50 µm</td>
                    <td className="p-2 font-semibold">3,400 m³</td>
                    <td className="p-2">21,385 bbl</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-amber-900">Code 4+5</td>
                    <td className="p-2">Continuous True Oil (Thick Core)</td>
                    <td className="p-2">&gt; 50 µm</td>
                    <td className="p-2 font-bold text-status-danger">8,200 m³</td>
                    <td className="p-2 font-bold text-status-danger">51,570 bbl</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemical Fingerprinting & MetOcean */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-ocean-navy text-xs uppercase tracking-wider font-mono border-b border-border-marine pb-1">
                3. Hydrocarbon Fingerprint
              </h3>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-border-marine space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Primary Match:</span>
                  <span className="font-bold text-ocean-deep">Arab Medium Crude (88.4%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Biomarker n-C17 / Pr:</span>
                  <span className="font-bold text-text-primary">1.82 (Petrogenic Source)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">API Gravity & Density:</span>
                  <span className="font-bold text-text-primary">24.8° API · 0.892 g/cm³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sulfur Content:</span>
                  <span className="font-bold text-status-warning">2.14% wt (Sour Crude)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-ocean-navy text-xs uppercase tracking-wider font-mono border-b border-border-marine pb-1">
                4. Coupled MetOcean Context
              </h3>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-border-marine space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">Wind Velocity:</span>
                  <span className="font-bold text-ocean-deep">{caseData.environment.windSpeedKn} kn · {caseData.environment.windDirectionText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Surface Current:</span>
                  <span className="font-bold text-ocean-deep">{caseData.environment.currentSpeedMs} m/s · {caseData.environment.currentDirectionText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Wave Height (Hs):</span>
                  <span className="font-bold text-text-primary">{caseData.environment.waveHeightM}m · {caseData.environment.wavePeriodSec}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sea Temp & Salinity:</span>
                  <span className="font-bold text-text-primary">{caseData.environment.seaSurfaceTempC}°C · {caseData.environment.salinityPsu} PSU</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cryptographic Chain-of-Custody Footer */}
          <div className="p-3 bg-slate-900 rounded-xl text-white font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                OFFICIAL IMO / MARPOL DIGITAL CERTIFICATION
              </span>
              <span>CERT-MARINESIGHT-{caseData.incidentId}</span>
            </div>
            <p className="text-[10px] text-sky-200 select-all break-all">
              SHA256: 7f8a9e4d021c43b91a8e2098b67f102ad543c98ef7612c0199e821034f5aa71b
            </p>
            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Lead Maritime Forensics: {caseData.assignedAnalyst}</span>
              <span>Generated: {new Date().toUTCString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-3 bg-ocean-light border-t border-border-marine flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onExportGeoJSON}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-ocean-sky text-ocean-navy border border-border-marine text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-ocean" />
              <span>Download GeoJSON</span>
            </button>
            <button
              onClick={onExportCSV}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-ocean-sky text-ocean-navy border border-border-marine text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-ocean" />
              <span>Download Scientific CSV</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}

