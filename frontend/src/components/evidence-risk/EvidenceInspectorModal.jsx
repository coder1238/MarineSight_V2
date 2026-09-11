import React from 'react';
import { X, ShieldAlert, Cpu, Download, CheckCircle2, Radio, Satellite, Compass } from 'lucide-react';

export default function EvidenceInspectorModal({ evidence, onClose }) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-border-marine rounded-2xl shadow-marine-lg max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-ocean-light border-b border-border-marine">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-text-muted uppercase">FORENSIC TELEMETRY INSPECTOR</span>
              <h3 className="text-base font-extrabold text-ocean-navy">{evidence.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ocean-sky text-text-secondary hover:text-ocean-navy transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs font-mono">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <span className="text-[10px] text-text-muted block">CONFIDENCE</span>
              <span className="text-sm font-extrabold text-status-success">{evidence.conf}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <span className="text-[10px] text-text-muted block">EVIDENCE WEIGHT</span>
              <span className="text-sm font-extrabold text-ocean">{evidence.weight}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <span className="text-[10px] text-text-muted block">STRENGTH</span>
              <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded inline-block mt-0.5 ${
                evidence.strength === 'VERY HIGH' ? 'bg-red-100 text-status-danger' : 'bg-amber-100 text-status-warning'
              }`}>
                {evidence.strength}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine">
              <span className="text-[10px] text-text-muted block">SENSOR SOURCE</span>
              <span className="text-xs font-bold text-ocean-navy truncate block mt-0.5">{evidence.source}</span>
            </div>
          </div>

          {/* Finding Narrative */}
          <div className="p-3 rounded-xl bg-ocean-sky/30 border border-ocean/20">
            <span className="text-[10px] text-ocean-deep font-bold uppercase block mb-1">
              Forensic Finding Description
            </span>
            <p className="text-ocean-navy font-sans text-xs leading-relaxed">
              {evidence.findingNarrative || evidence.value}
            </p>
          </div>

          {/* Raw Sensor Telemetry / Hex Dump */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-text-muted uppercase font-bold flex items-center justify-between">
              <span>Raw NMEA / Sensor Payload Dump</span>
              <span className="text-status-success font-normal">ISO 17025 Certified Stream</span>
            </span>
            <div className="bg-ocean-navy text-ocean-bright p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-ocean/40 shadow-inner">
              <p className="text-text-muted">// Telemetry frame ingest: 2026-09-12T04:31:08.412Z</p>
              <p>{"!AIVDM,1,1,,B,177KQJ5000G?tOH`rRF1r?wv0<00,0*5B"}</p>
              <p>SIG_RADAR_SIGMA0: -18.42 dB | CO-POL_VV: 0.941 | CROSS-POL_VH: 0.218</p>
              <p>DOPPLER_CENTROID_SHIFT: +41.8 Hz | ORBIT_ABS: 41829 | SUB_SWATH: IW2</p>
              <p>LAT: 15.1200° N | LNG: 69.1500° E | SOG: 12.4 kts | COG: 284.0°</p>
              <p className="text-emerald-400">HASH: SHA256: 3c9b74...98a21f [PASS - UNALTERED]</p>
            </div>
          </div>

          {/* Forensic Audit Compliance */}
          <div className="border border-border-marine rounded-xl p-3 bg-white space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ocean-navy font-bold">Forensic Verification Status:</span>
              <span className="text-status-success font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Admissible in Court of Maritime Arbitration
              </span>
            </div>
            <p className="text-[11px] text-text-secondary font-sans">
              Corroborated by independent radar backscatter anomaly from Sentinel-1 constellation and AIS message stream cross-checked against MRCC Mumbai land stations.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-ocean-light border-t border-border-marine flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">
            CASE REF: <strong>IN-GOA-2026-0912</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Downloaded Forensic Certificate for "${evidence.name}"`);
              }}
              className="px-3 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Forensic Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-border-marine hover:bg-white text-ocean-navy text-xs font-bold font-mono"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
