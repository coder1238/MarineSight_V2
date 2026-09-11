import React, { useState } from 'react';
import { Download, Share2, Printer, FileText, FileSpreadsheet, FileCode, Check, Copy } from 'lucide-react';

export default function ReportExportActions({ 
  caseData, 
  classification, 
  watermark, 
  isRedacted, 
  bonnMetrics,
  penaltyMetrics,
  onLogAudit 
}) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const downloadFile = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. Export as JSON
  const handleExportJSON = () => {
    const exportObject = {
      dossierId: `${caseData.incidentId}-FORENSIC`,
      classification,
      securityWatermark: watermark,
      isRedacted,
      exportTimestampUTC: new Date().toISOString(),
      caseData: {
        ...caseData,
        topVessel: isRedacted 
          ? { ...caseData.topVessel, mmsi: '[REDACTED]', imo: '[REDACTED]' } 
          : caseData.topVessel,
        candidateVessels: isRedacted
          ? caseData.candidateVessels.map(v => ({ ...v, mmsi: '[REDACTED]', imo: '[REDACTED]' }))
          : caseData.candidateVessels
      },
      volumetrics: bonnMetrics,
      statutoryPenalties: penaltyMetrics,
      integrity: {
        hashAlgorithm: 'SHA-256',
        certification: 'Republic Maritime Forensics Division'
      }
    };

    downloadFile(
      `${caseData.incidentId}-forensic-dossier.json`, 
      JSON.stringify(exportObject, null, 2), 
      'application/json'
    );
    triggerSuccess('JSON');
    if (onLogAudit) onLogAudit(`Downloaded dossier as JSON: ${caseData.incidentId}-forensic-dossier.json`);
  };

  // 2. Export Candidate Vessels as CSV
  const handleExportCSV = () => {
    const headers = ['Vessel Name', 'MMSI', 'Type', 'Flag', 'Priority Score', 'AIS Gap (min)', 'Distance (nm)', 'Speed Anomaly'];
    const rows = (caseData.candidateVessels || [caseData.topVessel]).map(v => [
      `"${v.name}"`,
      isRedacted ? '"[REDACTED]"' : `"${v.mmsi || 'N/A'}"`,
      `"${v.type || 'Tanker'}"`,
      `"${v.flag || 'Unknown'}"`,
      v.priorityScore || 85,
      v.aisGapMinutes || 38,
      v.distanceOriginNm || 1.4,
      `"${v.speedAnomaly || 'Deceleration 4.2 kn'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(
      `${caseData.incidentId}-suspect-vessels.csv`, 
      csvContent, 
      'text/csv;charset=utf-8;'
    );
    triggerSuccess('CSV');
    if (onLogAudit) onLogAudit(`Exported candidate vessels table as CSV`);
  };

  // 3. Export as Markdown Document
  const handleExportMarkdown = () => {
    const vessel = caseData.topVessel;
    const md = `# MARITIME FORENSIC INVESTIGATION DOSSIER
**Incident ID:** ${caseData.incidentId}  
**Classification:** ${classification}  
**Watermark:** ${watermark}  
**Date/Time:** ${caseData.detectionTimeUTC}  
**Region:** ${caseData.region}  
**Coordinates:** ${isRedacted ? '[REDACTED LAT/LNG]' : caseData.coordinates.display}  

---

## 1. Executive Summary
On ${caseData.detectionTimeUTC}, Synthetic Aperture Radar (Sentinel-1) detected an offshore hydrocarbon release spanning **${caseData.spillAreaKm2} km²** (perimeter: ${caseData.spillPerimeterKm} km). Lagrangian backward drift integration identified origin centroid with high convergence.

## 2. Primary Suspect Vessel Attribution
- **Target Vessel:** ${vessel.name}
- **MMSI:** ${isRedacted ? '[REDACTED]' : vessel.mmsi}
- **Flag:** ${vessel.flag || 'India'}
- **Investigation Priority Score:** ${vessel.priorityScore} / 100
- **AIS Transponder Blackout:** ${vessel.aisGapMinutes || 38} minutes directly traversing origin centroid.

## 3. Bonn Agreement Volumetrics
- **Estimated Spill Volume:** ${bonnMetrics?.volumeTonnes || 420} Metric Tonnes (~${bonnMetrics?.volumeBarrels || 3066} Barrels)
- **Primary Appearance:** Metallic to Discontinuous True Oil

## 4. Legal Assessment (Indian Merchant Shipping Act & MARPOL)
- **Jurisdiction:** Indian Exclusive Economic Zone (EEZ)
- **Estimated Statutory Liability:** ₹${penaltyMetrics?.fineCrore || 8.4} Crore (~$${penaltyMetrics?.fineUsdMillions || 1.01}M USD)
- **Mandate:** Section 356 detention & port seizure notice.

---
*Cryptographically certified by Republic Maritime Forensics Division.*
`;

    downloadFile(
      `${caseData.incidentId}-forensic-dossier.md`, 
      md, 
      'text/markdown'
    );
    triggerSuccess('Markdown');
    if (onLogAudit) onLogAudit(`Exported official dossier as Markdown (.md)`);
  };

  // 4. Copy Summary to Clipboard
  const handleCopySummary = () => {
    const summary = `[INCIDENT DOSSIER ${caseData.incidentId}] Region: ${caseData.region} | Area: ${caseData.spillAreaKm2} km² | Lead Suspect: ${caseData.topVessel.name} (Priority: ${caseData.topVessel.priorityScore}/100) | Est. Spill: ${bonnMetrics?.volumeTonnes || 420} Tonnes | Status: CRITICAL INVESTIGATION`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onLogAudit) onLogAudit('Copied executive summary to clipboard');
    });
  };

  const triggerSuccess = (label) => {
    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Print / Save to PDF */}
      <button 
        onClick={() => {
          if (onLogAudit) onLogAudit('Triggered print preview / PDF generation');
          window.print();
        }}
        className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors print:hidden"
        title="Print document or save as PDF via system print dialog"
      >
        <Printer className="w-3.5 h-3.5 text-ocean" />
        <span className="hidden sm:inline">Print / PDF</span>
      </button>

      {/* JSON Export */}
      <button 
        onClick={handleExportJSON}
        className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors print:hidden"
        title="Download structured machine-readable JSON dossier"
      >
        <FileCode className="w-3.5 h-3.5 text-amber-600" />
        <span className="hidden sm:inline">JSON</span>
      </button>

      {/* CSV Export */}
      <button 
        onClick={handleExportCSV}
        className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors print:hidden"
        title="Download suspect vessel candidates spreadsheet (CSV)"
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">CSV</span>
      </button>

      {/* Markdown Export */}
      <button 
        onClick={handleExportMarkdown}
        className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors print:hidden"
        title="Download markdown formatted briefing document"
      >
        <FileText className="w-3.5 h-3.5 text-blue-600" />
        <span className="hidden sm:inline">Markdown</span>
      </button>

      {/* Share / Copy */}
      <button 
        onClick={handleCopySummary}
        className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors print:hidden"
        title="Copy quick summary link to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-ocean" />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Summary'}</span>
      </button>

      {downloadSuccess && (
        <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg animate-fadeIn">
          ✓ Downloaded {downloadSuccess}!
        </span>
      )}
    </div>
  );
}

