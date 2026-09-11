import React, { useState } from 'react';
import { Clock, Radio, Satellite, AlertTriangle, Ship, CheckCircle2, ShieldAlert } from 'lucide-react';

export const TIMELINE_EVENTS = [
  { id: "e1", time: "T-12.0h", label: "Corridor Ingress", type: "AIS_PING", desc: "Vessel entered EEZ corridor at standard cruise 14.2 kts.", severity: "normal" },
  { id: "e2", time: "T-4.2h", label: "AIS Blackout Commenced", type: "TRANSPONDER_OFF", desc: "Transponder transmission ceased. No VHF carrier signal on CH 87B/88B.", severity: "danger", alert: "38 min Blackout Gap" },
  { id: "e3", time: "T-3.8h", label: "Estimated Discharge Event", type: "DISCHARGE", desc: "Siamese back-trajectory backward drift converges at lat 14.821° N, lng 68.210° E.", severity: "critical", alert: "Origin Centroid" },
  { id: "e4", time: "T-3.5h", label: "Kinematic Speed Drop", type: "DECELERATION", desc: "Doppler radar & terrestrial track indicates deceleration to 6.8 kts.", severity: "warning" },
  { id: "e5", time: "T-3.2h", label: "AIS Transponder Restored", type: "AIS_RECONNECT", desc: "Signal resumed with anomalous clock offset. Position jumped 4.8 nm.", severity: "danger" },
  { id: "e6", time: "T+0.0h", label: "Sentinel-1 SAR Detection", type: "SATELLITE_PASS", desc: "SAR C-Band radar overpass confirmed 18.4 km² dark radiometric slick.", severity: "success" },
  { id: "e7", time: "T+14.2h", label: "Shoreline Interception", type: "PREDICTED_IMPACT", desc: "Projected beaching on Cabo de Rama mangrove creek if uncontained.", severity: "warning" }
];

export default function ForensicTimelineBar() {
  const [selectedEvent, setSelectedEvent] = useState(TIMELINE_EVENTS[1]); // default to blackout

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Forensic Event Timeline & AIS Blackout Gap Analysis
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-red-100 text-status-danger text-[10px] font-bold border border-red-200">
          ● ANOMALOUS 38-MINUTE SILENCE WINDOW DETECTED
        </span>
      </div>

      {/* Horizontal Timeline Track */}
      <div className="relative pt-2 pb-4 overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Connecting Line */}
          <div className="h-1 w-full bg-ocean-light rounded-full relative top-4 z-0"></div>

          {/* Timeline Nodes */}
          <div className="flex justify-between relative z-10">
            {TIMELINE_EVENTS.map((ev) => {
              const isSelected = selectedEvent.id === ev.id;
              const isDanger = ev.severity === "danger" || ev.severity === "critical";

              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className="flex flex-col items-center text-center group focus:outline-none"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? "bg-ocean-navy text-white border-ocean ring-4 ring-ocean/20 scale-110"
                        : isDanger
                        ? "bg-red-50 text-status-danger border-status-danger group-hover:scale-105"
                        : "bg-white text-ocean border-border-marine group-hover:border-ocean"
                    }`}
                  >
                    {ev.type === "TRANSPONDER_OFF" ? (
                      <Radio className="w-3.5 h-3.5 text-status-danger animate-pulse" />
                    ) : ev.type === "SATELLITE_PASS" ? (
                      <Satellite className="w-3.5 h-3.5" />
                    ) : (
                      <Ship className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-ocean-navy mt-1.5">{ev.time}</span>
                  <span className="text-[9px] text-text-muted truncate max-w-[80px] block">{ev.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Event Card */}
      <div className="p-3 bg-ocean-sky/20 border border-ocean/20 rounded-xl flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.2 rounded bg-ocean-navy text-white text-[10px] font-bold">
              {selectedEvent.time}
            </span>
            <h4 className="text-xs font-extrabold text-ocean-navy">{selectedEvent.label}</h4>
            {selectedEvent.alert && (
              <span className="px-1.5 py-0.2 rounded bg-red-100 text-status-danger text-[9px] font-bold">
                {selectedEvent.alert}
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
            {selectedEvent.desc}
          </p>
        </div>

        <div className="text-right text-[10px] text-text-muted">
          <span>EVENT CLASSIFICATION:</span>
          <span className="block font-bold text-ocean">{selectedEvent.type}</span>
        </div>
      </div>
    </div>
  );
}

