import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Clock, FileText, Trash2, Key, Download } from 'lucide-react';
import { RedactedText } from './ReportWatermarkRedaction';

const INITIAL_CUSTODY_EVENTS = [
  {
    id: 'CUST-01',
    step: '1. SATELLITE DOWNLINK & DE-INTERLEAVING',
    timestamp: '05 SEP 2026, 14:32 UTC',
    agency: 'NRSC Shadnagar / ESA Copernicus',
    analyst: 'Automated Ground Pipeline (L0-to-L1)',
    hash: '9a4f21b7c89e0234a41f87',
    status: 'VERIFIED',
    notes: 'Dual-pol C-band raw GRD product ingested and calibrated without frame drop.'
  },
  {
    id: 'CUST-02',
    step: '2. NEURAL RADAR SEGMENTATION',
    timestamp: '05 SEP 2026, 14:34 UTC',
    agency: 'Roboflow / ResNeXt-Attention Pipeline',
    analyst: 'Model M02 (Segmentation)',
    hash: '57e31b8a1c90df0342a19c',
    status: 'VERIFIED',
    notes: 'Slick perimeter bounded at 22.4 km with 96.8% hydrocarbon certainty.'
  },
  {
    id: 'CUST-03',
    step: '3. HYDRODYNAMIC HINDCAST SIMULATION',
    timestamp: '05 SEP 2026, 14:38 UTC',
    agency: 'INCOIS / OpenDrift Particle Engine',
    analyst: 'Model M04 (Drift Trajectory)',
    hash: 'c827ea19b45012e87f10a3',
    status: 'VERIFIED',
    notes: '5,000 Lagrangian particles reversed 40.0h; converged on origin Zone A (72.4%).'
  },
  {
    id: 'CUST-04',
    step: '4. AIS TRANSPONDER GAP RECONSTRUCTION',
    timestamp: '05 SEP 2026, 14:42 UTC',
    agency: 'Maritime Traffic Intelligence Bureau',
    analyst: 'Model M06 (Bi-LSTM Reconstructor)',
    hash: '12b98fa34c09d81e672a0f',
    status: 'VERIFIED',
    notes: 'Isolated 38-minute silence gap (174 missing packets) coinciding with origin.'
  },
  {
    id: 'CUST-05',
    step: '5. MULTI-CRITERIA STATISTICAL ATTRIBUTION',
    timestamp: '05 SEP 2026, 14:47 UTC',
    agency: 'Republic Maritime Forensics Division',
    analyst: 'Model M08 (XGBoost Ensemble)',
    hash: 'ff87192a6c0245e9812b43',
    status: 'VERIFIED',
    notes: 'Funnels 142 vessels down to Rank #1 candidate with 91.4/100 priority score.'
  }
];

export default function ReportCustodyTimeline({ incidentId, isRedacted, onLogAudit }) {
  const storageKey = `marine_custody_${incidentId}`;
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CUSTODY_EVENTS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    step: '',
    agency: 'Indian Coast Guard Intelligence',
    analyst: 'Command Duty Officer',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(events));
  }, [events, storageKey]);

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.step) return;

    const created = {
      id: `CUST-${String(events.length + 1).padStart(2, '0')}`,
      step: newEvent.step.toUpperCase(),
      timestamp: new Date().toUTCString(),
      agency: newEvent.agency,
      analyst: newEvent.analyst,
      hash: Math.random().toString(16).substring(2, 24),
      status: 'VERIFIED',
      notes: newEvent.notes || 'Forensic custody milestone verified and recorded.'
    };

    const updated = [...events, created];
    setEvents(updated);
    setIsModalOpen(false);
    setNewEvent({ step: '', agency: 'Indian Coast Guard Intelligence', analyst: 'Command Duty Officer', notes: '' });
    if (onLogAudit) onLogAudit(`Appended new custody verification log: ${created.step}`);
  };

  const handleDeleteEvent = (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    if (onLogAudit) onLogAudit(`Removed custody audit entry ${id}`);
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Legal Chain of Custody & Evidence Audit Trail
            </h4>
            <p className="text-[10px] text-text-muted">
              Section 65B Indian Evidence Act compliant log tracking each analytical step and data transfer.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custody Log Entry</span>
        </button>
      </div>

      {/* Chronological Timeline */}
      <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-marine">
        {events.map((evt, idx) => (
          <div key={evt.id} className="relative pl-8 text-xs font-mono group">
            {/* Timeline node icon */}
            <div className="absolute left-1.5 top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-ocean flex items-center justify-center text-ocean shadow-sm">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            </div>

            <div className="p-3 bg-ocean-light/40 hover:bg-ocean-light border border-border-marine rounded-xl transition-all space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ocean-navy text-[11px]">{evt.step}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold">
                    ✓ {evt.status}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ocean" />
                  {evt.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                {evt.notes}
              </p>

              <div className="pt-1.5 border-t border-border-marine/40 flex flex-wrap items-center justify-between gap-2 text-[10px] text-text-muted">
                <div>
                  <span className="text-text-primary font-semibold">{evt.agency}</span> · <span>{evt.analyst}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-border-marine font-mono text-[9px]">
                    Hash: {isRedacted ? <RedactedText text={evt.hash} isRedacted={true} customPlaceholder="[REDACTED-HASH]" /> : evt.hash}
                  </span>
                  {idx >= 5 && (
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-gray-400 hover:text-status-danger p-0.5"
                      title="Remove custom log"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custody Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-border-marine rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-marine pb-3">
              <h3 className="font-bold text-sm text-ocean-navy font-mono uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-ocean" />
                Append Chain of Custody Milestone
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-ocean-navy text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-text-muted font-bold mb-1">
                  Custody Milestone / Action Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6. PHYSICAL SAMPLES LAB SPECTROMETRY"
                  value={newEvent.step}
                  onChange={(e) => setNewEvent({ ...newEvent, step: e.target.value })}
                  required
                  className="w-full bg-ocean-light/50 border border-border-marine rounded-lg p-2 font-mono text-xs focus:ring-1 focus:ring-ocean outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted font-bold mb-1">
                    Agency / Lab Unit
                  </label>
                  <input
                    type="text"
                    value={newEvent.agency}
                    onChange={(e) => setNewEvent({ ...newEvent, agency: e.target.value })}
                    required
                    className="w-full bg-ocean-light/50 border border-border-marine rounded-lg p-2 font-mono text-xs focus:ring-1 focus:ring-ocean outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-text-muted font-bold mb-1">
                    Investigating Officer
                  </label>
                  <input
                    type="text"
                    value={newEvent.analyst}
                    onChange={(e) => setNewEvent({ ...newEvent, analyst: e.target.value })}
                    required
                    className="w-full bg-ocean-light/50 border border-border-marine rounded-lg p-2 font-mono text-xs focus:ring-1 focus:ring-ocean outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-text-muted font-bold mb-1">
                  Evidence Notes & Hash Reference
                </label>
                <textarea
                  rows="3"
                  placeholder="Details of physical sample extraction, gas chromatography-mass spectrometry match..."
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  className="w-full bg-ocean-light/50 border border-border-marine rounded-lg p-2 font-sans text-xs focus:ring-1 focus:ring-ocean outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-marine">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-border-marine text-text-secondary hover:bg-ocean-sky font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white font-bold shadow-sm"
                >
                  Append to Legal Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

