import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DossierExportSuite({
  caseData,
  activeStrategy,
  isAuthorized,
  onAuthorize,
  virtualBooms = []
}) {
  const [copiedSitRep, setCopiedSitRep] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  const handleExportJson = () => {
    const payload = {
      incidentId: caseData?.incidentId || 'OF-2026-0912',
      region: caseData?.region || 'Arabian Sea',
      timestamp: new Date().toISOString(),
      activeStrategy,
      authorizationStatus: isAuthorized ? 'AUTHORIZED' : 'DRAFT',
      coordinates: caseData?.coordinates,
      spillAreaKm2: caseData?.spillAreaKm2,
      virtualBooms,
      generatedBy: 'MARINESIGHT Tactical Decision Support System',
      statutoryReference: 'NOS-DCP Tier 2 Contingency Protocol'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IAP_${caseData?.incidentId || 'OF-2026-0912'}_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('IAP Dossier JSON downloaded successfully.');
    setTimeout(() => setExportNotice(''), 3000);
  };

  const handleCopySitrep = () => {
    const sitrep = `
[MARINESIGHT SITUATION REPORT (SITREP)]
INCIDENT ID: ${caseData?.incidentId || 'OF-2026-0912'}
LOCATION: ${caseData?.coordinates?.display || '14.82°N, 68.21°E'} (${caseData?.region || 'Arabian Sea'})
SPILL AREA: ${caseData?.spillAreaKm2 || 14.7} km² | PERIMETER: ${caseData?.spillPerimeterKm || 22.4} km
RISK LEVEL: ${caseData?.riskLevel || 'CRITICAL'}
ACTIVE STRATEGY: ${activeStrategy.toUpperCase()}
RESPONSE ASSETS: 4 Cutters Mobilized, 2.4 km Heavy Ocean Boom Deployed
STATUS: ${isAuthorized ? 'AUTHORIZATION APPROVED & TRANSMITTED' : 'DRAFT IN REVIEW'}
AUTHORIZED BY: DIG R. Sharma, Incident Commander (MRCC Mumbai)
TIMESTAMP: ${new Date().toUTCString()}
`.trim();

    navigator.clipboard.writeText(sitrep).then(() => {
      setCopiedSitRep(true);
      setTimeout(() => setCopiedSitRep(false), 3000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignAuthorization = () => {
    if (onAuthorize) onAuthorize();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Dossier Generation, Authorization & Export Suite
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-status-success border border-emerald-200">
                ICS FORM 201/204 READY
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Formalize command approvals, generate forensic JSON packets, and print incident action dossiers.
            </p>
          </div>
        </div>

        {exportNotice && (
          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-status-success border border-emerald-200 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
        <button
          onClick={handleSignAuthorization}
          className={`p-3 rounded-xl border font-bold flex flex-col justify-between text-left transition-all shadow-sm ${
            isAuthorized
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400/50'
              : 'bg-ocean hover:bg-ocean-deep text-white border-ocean-navy'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Lock className="w-4 h-4" />
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
          </div>
          <div>
            <span className="block text-xs uppercase">
              {isAuthorized ? 'Formal Approval Sealed' : 'Sign & Authorize IAP'}
            </span>
            <span className="block text-[9px] opacity-90 font-sans mt-0.5">
              {isAuthorized ? 'Signed by Incident Commander' : 'Cryptographic IC Signature'}
            </span>
          </div>
        </button>

        <button
          onClick={handleExportJson}
          className="p-3 rounded-xl border border-border-marine bg-white hover:bg-ocean-light/40 text-ocean-navy font-bold flex flex-col justify-between text-left transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-2 text-ocean">
            <Download className="w-4 h-4" />
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-ocean-light border border-border-marine">JSON</span>
          </div>
          <div>
            <span className="block text-xs uppercase">Export Full IAP Packet</span>
            <span className="block text-[9px] text-text-secondary font-sans mt-0.5">Machine-readable JSON dossier</span>
          </div>
        </button>

        <button
          onClick={handleCopySitrep}
          className="p-3 rounded-xl border border-border-marine bg-white hover:bg-ocean-light/40 text-ocean-navy font-bold flex flex-col justify-between text-left transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-2 text-ocean">
            {copiedSitRep ? <Check className="w-4 h-4 text-status-success" /> : <Copy className="w-4 h-4" />}
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-ocean-light border border-border-marine">SITREP</span>
          </div>
          <div>
            <span className="block text-xs uppercase">
              {copiedSitRep ? 'SitRep Copied!' : 'Copy SitRep to Clipboard'}
            </span>
            <span className="block text-[9px] text-text-secondary font-sans mt-0.5">Instant radio / email briefing</span>
          </div>
        </button>

        <button
          onClick={handlePrint}
          className="p-3 rounded-xl border border-border-marine bg-white hover:bg-ocean-light/40 text-ocean-navy font-bold flex flex-col justify-between text-left transition-all shadow-sm"
        >
          <div className="flex items-center justify-between mb-2 text-ocean">
            <Printer className="w-4 h-4" />
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-ocean-light border border-border-marine">PDF</span>
          </div>
          <div>
            <span className="block text-xs uppercase">Print Incident Briefing</span>
            <span className="block text-[9px] text-text-secondary font-sans mt-0.5">Printer & PDF format</span>
          </div>
        </button>
      </div>
    </div>
  );
}

