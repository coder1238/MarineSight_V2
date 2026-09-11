import React, { useState } from 'react';
import { X, Radio, AlertTriangle, ShieldAlert, Activity, WifiOff, Clock, Compass, CheckCircle2 } from 'lucide-react';

export default function WorkspaceAisDeepDiveModal({ vessel, caseData, onClose }) {
  const target = vessel || caseData.topVessel || {
    name: "MV Ocean Star",
    mmsi: "419001248",
    imo: "9876543",
    flag: "India 🇮🇳",
    type: "Crude Oil Tanker",
    speedKn: 12.4,
    gapDuration: "38 min"
  };

  const [activeDiagnosticTab, setActiveDiagnosticTab] = useState('timeline');

  const aisPackets = [
    { time: "22:18:12 UTC", type: "Msg 1 (Position)", sog: "13.2 kn", cog: "142°", draught: "14.2 m", status: "NORMAL", signalDb: -82 },
    { time: "22:21:45 UTC", type: "Msg 1 (Position)", sog: "12.8 kn", cog: "140°", draught: "14.2 m", status: "NORMAL", signalDb: -84 },
    { time: "22:24:10 UTC", type: "Msg 3 (Position)", sog: "11.4 kn", cog: "138°", draught: "14.2 m", status: "LAST_HEARD", signalDb: -91 },
    { time: "22:24:11 - 23:02:08 UTC", type: "TRANSPONDER SILENCE", sog: "EST. 3.8 kn", cog: "EST. 135°", draught: "UNKNOWN", status: "ANOMALY_BLACKOUT", signalDb: -999 },
    { time: "23:02:09 UTC", type: "Msg 1 (Position)", sog: "4.1 kn", cog: "136°", draught: "13.8 m", status: "RECONNECTED", signalDb: -85 },
    { time: "23:05:30 UTC", type: "Msg 5 (Static)", sog: "7.6 kn", cog: "139°", draught: "13.8 m", status: "DRAUGHT_ANOMALY", signalDb: -83 }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-danger text-white shadow-sm">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Dark Ship AIS Anomaly Deep-Dive Diagnostics
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold">
                  SOLAS V/19 VIOLATION
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Packet-level analysis of {target.name} (MMSI: {target.mmsi}) during origin sector transit.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anomaly Highlight Cards */}
        <div className="p-4 border-b border-border-marine bg-red-50/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-white border border-red-200 rounded-xl">
            <span className="text-[10px] text-status-danger font-bold block uppercase">BLACKOUT GAP</span>
            <strong className="text-sm text-ocean-navy">37m 58s Duration</strong>
            <span className="text-[10px] text-text-muted block mt-0.5">22:24:10 → 23:02:08 UTC</span>
          </div>

          <div className="p-2.5 bg-white border border-red-200 rounded-xl">
            <span className="text-[10px] text-status-danger font-bold block uppercase">DECELERATION DELTA</span>
            <strong className="text-sm text-ocean-navy">13.2 kn → 3.8 kn</strong>
            <span className="text-[10px] text-text-muted block mt-0.5">Speed loss: 71.2% over slick zone</span>
          </div>

          <div className="p-2.5 bg-white border border-red-200 rounded-xl">
            <span className="text-[10px] text-status-danger font-bold block uppercase">DRAUGHT DISCREPANCY</span>
            <strong className="text-sm text-ocean-navy">14.2 m → 13.8 m (-0.4m)</strong>
            <span className="text-[10px] text-text-muted block mt-0.5">Corresponds to liquid cargo discharge</span>
          </div>
        </div>

        {/* Packet Telemetry Table */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-mono font-bold text-ocean-navy mb-2 flex items-center justify-between">
            <span>SATELLITE & TERRESTRIAL AIS RECEIVER LOG</span>
            <span className="text-[10px] text-text-muted font-normal">Receiver: Indian Coast Guard Coastal Radar Chain (Goa Hub)</span>
          </h4>

          <div className="border border-border-marine rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-[10px] text-text-muted uppercase border-b border-border-marine">
                <tr>
                  <th className="px-3 py-2">TIMESTAMP</th>
                  <th className="px-3 py-2">MESSAGE TYPE</th>
                  <th className="px-3 py-2">SPEED (SOG)</th>
                  <th className="px-3 py-2">COURSE (COG)</th>
                  <th className="px-3 py-2">DRAUGHT</th>
                  <th className="px-3 py-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60">
                {aisPackets.map((pkt, i) => {
                  const isAnomaly = pkt.status === 'ANOMALY_BLACKOUT';
                  return (
                    <tr key={i} className={isAnomaly ? 'bg-red-50 font-bold' : 'hover:bg-slate-50'}>
                      <td className="px-3 py-2.5 text-ocean-navy">{pkt.time}</td>
                      <td className="px-3 py-2.5 text-text-secondary">{pkt.type}</td>
                      <td className={`px-3 py-2.5 ${isAnomaly ? 'text-status-danger' : 'text-ocean-deep font-bold'}`}>{pkt.sog}</td>
                      <td className="px-3 py-2.5">{pkt.cog}</td>
                      <td className="px-3 py-2.5">{pkt.draught}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          pkt.status === 'ANOMALY_BLACKOUT' ? 'bg-status-danger text-white' :
                          pkt.status === 'DRAUGHT_ANOMALY' ? 'bg-amber-100 text-amber-800' :
                          pkt.status === 'RECONNECTED' ? 'bg-blue-100 text-ocean' : 'bg-emerald-100 text-status-success'
                        }`}>
                          {pkt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-mono text-text-muted">
            Dead-reckoning track deviation: 99.4% confidence deliberate transponder switch-off.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}

