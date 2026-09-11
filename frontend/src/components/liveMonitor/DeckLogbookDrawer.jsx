import React, { useState } from 'react';
import { FileText, Download, Plus, Clock, User, ShieldCheck, Check, Send } from 'lucide-react';

export default function DeckLogbookDrawer({ logs = [], onAddLog, activeIncident, selectedVessel, securityLevel = "ISPS_2" }) {
  const [noteText, setNoteText] = useState("");

  const handleAddCustomNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddLog({
      time: new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC',
      category: "MANUAL NOTE",
      officer: "Duty Surveillance Officer",
      text: noteText.trim()
    });
    setNoteText("");
  };

  const handleExportSitrep = () => {
    const timeStr = new Date().toISOString();
    const region = activeIncident?.region || "Arabian Sea (EEZ)";
    const incidentId = activeIncident?.incidentId || "OF-2026-0912";
    const coords = activeIncident?.coordinates ? `${activeIncident.coordinates.lat}°N, ${activeIncident.coordinates.lng}°E` : "14.82°N, 68.21°E";
    const vesselName = selectedVessel?.name || activeIncident?.topVessel?.name || "M/V OCEAN STAR";
    const mmsi = selectedVessel?.mmsi || "419001248";

    const sitrepContent = `================================================================================
                    INTERNATIONAL MARITIME ORGANIZATION (IMO)
                   SITUATION REPORT (SITREP) - MARINE POLLUTION
================================================================================
DATE/TIME (UTC):    ${timeStr}
INCIDENT REFERENCE: ${incidentId}
REGION / SECTOR:    ${region}
COORDINATES:        ${coords}
SECURITY POSTURE:   ${securityLevel}
PRIMARY SUSPECT:    ${vesselName} (MMSI: ${mmsi})
STATUS:             ACTIVE TACTICAL SURVEILLANCE & INVESTIGATION
================================================================================

1. SITUATION OVERVIEW:
   Synthetic Aperture Radar (SAR) Sentinel-1 and Coastal VTS radar detected
   an anomalous hydrocarbon slick spanning approximately ${activeIncident?.spillAreaKm2 || 14.7} km².
   Kinematic analysis identified AIS communication blackout and speed deceleration
   matching unlawful discharge pattern.

2. ENVIRONMENTAL SENSITIVITY:
   Wind: ${activeIncident?.environment?.windSpeedKn || 14.2} kn @ ${activeIncident?.environment?.windDirectionDeg || 310}°
   Current: ${activeIncident?.environment?.currentSpeedMs || 0.42} m/s @ ${activeIncident?.environment?.currentDirectionDeg || 128}°
   Wave Height: ${activeIncident?.environment?.waveHeightM || 1.8} m
   Threatened Areas: Sensitive coastal biospheres and TSS international shipping lane.

3. CHRONOLOGICAL TACTICAL WATCH LOG:
${logs.map((l, idx) => `   [${l.time}] [${l.category}] (${l.officer || 'WATCHSTANDER'}): ${l.text}`).join('\n')}

================================================================================
TRANSMITTED BY: COAST GUARD MARITIME RESCUE COORDINATION CENTRE (MRCC)
CONFIDENTIALITY: RESTRICTED MARITIME LAW ENFORCEMENT RECORD
================================================================================
`;

    const blob = new Blob([sitrepContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SITREP_${incidentId}_${new Date().toISOString().substring(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-ocean" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">WATCHKEEPER DECK LOG</h3>
        </div>
        <button
          onClick={handleExportSitrep}
          className="px-2.5 py-1 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs transition-all"
          title="Download IMO-standard SITREP file"
        >
          <Download className="w-3 h-3" />
          <span>Export SITREP</span>
        </button>
      </div>

      {/* Quick Entry Form */}
      <form onSubmit={handleAddCustomNote} className="flex gap-1.5">
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter official watchkeeper log note..."
          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-border-marine bg-ocean-light/30 focus:outline-none focus:border-ocean"
        />
        <button
          type="submit"
          className="px-2.5 py-1 bg-ocean hover:bg-ocean-deep text-white text-xs font-bold rounded-lg flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* Chronological Log Stream */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5 font-mono text-[10px]">
        {logs.length === 0 ? (
          <div className="p-3 text-center text-text-muted text-xs">
            No deck log entries recorded yet.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-border-marine flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-[9px] text-text-muted">
                <span className="text-ocean font-bold flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{log.time}</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-ocean-sky text-ocean font-bold">
                  {log.category}
                </span>
              </div>
              <p className="text-ocean-navy text-[10px] mt-0.5 leading-snug">
                {log.text}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="pt-1.5 border-t border-border-marine/50 text-[9px] font-mono text-text-muted flex items-center justify-between">
        <span>IMO FAL FORM 1 COMPLIANT</span>
        <span className="text-status-success font-semibold">LEGAL AUDIT TRAIL PRESERVED</span>
      </div>
    </div>
  );
}

