import React from 'react';
import { X, Printer, Shield, FileCheck, CheckCircle2, Download, AlertTriangle, Hash, Scale } from 'lucide-react';
import { SUSPECT_VESSELS } from './trajectoryData';

export default function TrajectoryDossierModal({ isOpen, onClose, vesselId = "v1" }) {
  if (!isOpen) return null;

  const vessel = SUSPECT_VESSELS.find(v => v.id === vesselId) || SUSPECT_VESSELS[0];
  const reportDate = new Date().toISOString().slice(0, 10);
  const sha256Hash = "8f4a2b91c0e3d74a6b29f0e1d5823ca8719db4567ef21a44c9b0e12f389a071d";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-border-marine max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-ocean-navy text-white p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-ocean-bright" />
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wider uppercase">
                Maritime Forensic Evidence Dossier (ISO/IEC 27037 Compliant)
              </h2>
              <span className="text-[10px] text-ocean-sky font-mono">
                Document Ref: MARINESIGHT-AIS-EVID-2026-0912-TRJ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-ocean hover:bg-ocean-bright text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ocean-sky hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-6 space-y-5 text-xs text-text-primary print:p-0 print:space-y-4">
          {/* Official Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-ocean-navy pb-3">
            <div>
              <h1 className="text-base font-extrabold text-ocean-navy uppercase tracking-tight">
                INDIAN COAST GUARD & DG SHIPPING
              </h1>
              <span className="text-[11px] text-text-secondary font-mono block">
                NATIONAL MARITIME SPILL SURVEILLANCE & AIS FORENSICS COMMAND
              </span>
            </div>
            <div className="text-right font-mono text-[10px] text-text-muted">
              <div>Date: {reportDate}</div>
              <div>Classification: RESTRICTED / EVIDENTIARY</div>
            </div>
          </div>

          {/* Suspect Vessel Target Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">VESSEL NAME</span>
              <span className="font-bold text-ocean-navy">{vessel.name}</span>
            </div>
            <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">MMSI / IMO</span>
              <span className="font-bold text-ocean-navy">{vessel.mmsi} / {vessel.imo}</span>
            </div>
            <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">FLAG / TYPE</span>
              <span className="font-bold text-ocean-navy">{vessel.flag} · {vessel.type.split('(')[0]}</span>
            </div>
            <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">GROSS TONNAGE</span>
              <span className="font-bold text-ocean-navy">{vessel.dwt.toLocaleString()} DWT</span>
            </div>
          </div>

          {/* Forensic Finding Summary */}
          <div className="border border-border-marine rounded-xl p-3.5 space-y-2 font-mono">
            <h3 className="text-xs font-bold text-ocean-navy uppercase flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-ocean" />
              Primary Evidentiary Determinations
            </h3>
            <ul className="space-y-1.5 text-[11px] list-disc list-inside text-text-secondary">
              <li>
                <strong className="text-ocean-navy">Deliberate AIS Blackout:</strong> Vessel transponder was disabled for 38 minutes between 22:24 UTC and 23:02 UTC with 174 missing Class A transmissions.
              </li>
              <li>
                <strong className="text-ocean-navy">Neural Trajectory Convergence:</strong> Bi-LSTM gap reconstruction with ocean current drift placed vessel at 1.4 nm from the spill centroid at 22:42 UTC (94.2% confidence).
              </li>
              <li>
                <strong className="text-ocean-navy">Satellite SAR Verification:</strong> Sentinel-1B C-SAR Kelvin wake measurement confirmed a wake-inferred speed of 3.75 kn at 22:38 UTC, perfectly matching neural reconstruction.
              </li>
              <li>
                <strong className="text-ocean-navy">Kinematic Anomaly:</strong> Vessel executed an abrupt -67% deceleration from 12.8 kn to 4.2 kn prior to transponder shutoff, characteristic of overboard bilge pumping operations.
              </li>
            </ul>
          </div>

          {/* Cryptographic Hash Block */}
          <div className="p-3 bg-ocean-navy text-ocean-sky rounded-xl font-mono text-[10px] space-y-1">
            <div className="flex items-center justify-between text-text-muted">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-ocean" />
                Cryptographic Telemetry Evidence Hash (SHA-256):
              </span>
              <span className="text-status-success font-bold">CHAIN OF CUSTODY VERIFIED</span>
            </div>
            <code className="block text-emerald-400 font-bold select-all break-all">
              {sha256Hash}
            </code>
          </div>

          {/* Officer Signature Block */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-marine font-mono text-[10px]">
            <div>
              <span className="text-text-muted block">INVESTIGATING FORENSIC OFFICER:</span>
              <span className="font-bold text-ocean-navy block mt-1">Cmdr. A. K. Sharma, Indian Coast Guard</span>
              <span className="text-text-secondary block">Maritime Intelligence Bureau</span>
            </div>
            <div className="text-right">
              <span className="text-text-muted block">CHIEF TECHNICAL CERTIFIER:</span>
              <span className="font-bold text-ocean-navy block mt-1">MarineSight AI Forensic System v4.1</span>
              <span className="text-status-success font-bold block">Digital Signature Cryptographically Valid</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-ocean-light p-3 border-t border-border-marine flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-mono font-bold transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

