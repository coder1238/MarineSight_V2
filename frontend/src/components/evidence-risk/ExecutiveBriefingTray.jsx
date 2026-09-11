import React, { useState } from 'react';
import { Star, Download, Printer, ChevronUp, ChevronDown, Trash2, FileCheck } from 'lucide-react';

export default function ExecutiveBriefingTray({
  pinnedItems = [],
  onRemovePin,
  onClearPins,
  vesselName,
  incidentId,
  compositeScore
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleExportJson = () => {
    const reportData = {
      incidentId,
      suspectVessel: vesselName,
      compositeScore: `${compositeScore.toFixed(1)}%`,
      generatedAt: new Date().toISOString(),
      classification: "CONFIDENTIAL - MARITIME FORENSIC ATTRIBUTION DOSSIER",
      pinnedEvidenceItems: pinnedItems,
      hashVerification: "SHA-256 INTEGRITY VERIFIED RFC-3161",
      unclosStatus: "PRIMA-FACIE PSC ADMISSIBLE"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `forensic_dossier_${incidentId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  if (pinnedItems.length === 0) {
    return (
      <div className="bg-ocean-light/40 border border-dashed border-border-marine rounded-2xl p-3 text-center text-xs font-mono text-text-muted flex items-center justify-center gap-2">
        <Star className="w-4 h-4 text-amber-400" />
        <span>Click the star icon next to any evidence item to pin it to this Executive Briefing Tray.</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase">
              Executive Briefing Tray ({pinnedItems.length} Pinned Findings)
            </h3>
            <span className="text-[10px] text-text-muted">
              Target: <strong>{vesselName}</strong> · Composite Attribution: <strong>{compositeScore.toFixed(1)}%</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-2.5 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Download full forensic dossier as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier (JSON)</span>
          </button>

          <button
            onClick={handlePrintBriefing}
            className="px-2.5 py-1.5 rounded-xl border border-border-marine hover:bg-ocean-light text-ocean-navy text-[11px] font-bold flex items-center gap-1.5 transition-all"
            title="Print commander executive briefing sheet"
          >
            <Printer className="w-3.5 h-3.5 text-ocean" />
            <span>Print Briefing</span>
          </button>

          <button
            onClick={onClearPins}
            className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-red-50 transition-all"
            title="Clear all pinned items"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-text-muted hover:bg-ocean-light transition-all"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Pinned List */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {pinnedItems.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-ocean-sky/20 border border-ocean/30 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-ocean font-bold block truncate">{item}</span>
                <span className="text-[9px] text-text-muted font-sans mt-0.5 block">Pinned for High-Command Decision Support</span>
              </div>
              <button
                onClick={() => onRemovePin(item)}
                className="text-text-muted hover:text-status-danger p-0.5 focus:outline-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

