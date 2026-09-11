import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';

const INITIAL_MILESTONES = [
  {
    id: 'm1',
    time: 'T+00h',
    phase: 'Detection & Activation',
    title: 'Emergency Response Activation & ICP Standup',
    status: 'Completed',
    desc: 'Automated satellite SAR detection verified. Incident Command Post (ICP) established at MRCC Mumbai / Goa.',
    keyAction: 'Issue Tier 2 NOS-DCP alert, task SAR constellation'
  },
  {
    id: 'm2',
    time: 'T+03h',
    phase: 'Reconnaissance',
    title: 'Dornier 228 Airborne SLAR & FLIR Survey',
    status: 'Completed',
    desc: 'Confirmed slick perimeter: 22.4 km, area: 14.7 km². Thermal centroid mapped at 14.82°N, 68.21°E.',
    keyAction: 'Transmit real-time GIS shapefiles to response vessels'
  },
  {
    id: 'm3',
    time: 'T+06h',
    phase: 'Flotilla On-Scene',
    title: 'ICGS Samudra Prahari & Skimmer Strike Arrival',
    status: 'Active',
    desc: 'Response vessels enter containment sector; initiate dynamic U-boom towing formation.',
    keyAction: 'Position weir skimmer in thickest emulsified pocket'
  },
  {
    id: 'm4',
    time: 'T+12h',
    phase: 'Deflection Shield',
    title: 'Zuari River Estuary Curtain Boom Anchoring',
    status: 'Pending',
    desc: 'Anchor 2.4 km heavy ocean barrier with 54 Danforth moorings to deflect slick away from mangrove nurseries.',
    keyAction: 'Verify normal current velocity <0.75 kn'
  },
  {
    id: 'm5',
    time: 'T+24h',
    phase: 'Full Recovery',
    title: 'Peak Mechanical Skimming & Waste Decanting',
    status: 'Pending',
    desc: 'Operate dual weir skimmers at 75 m³/h; transfer oily water mixture to 200 m³ floating storage bladders.',
    keyAction: 'Transfer hazardous slop to Mormugao port vacuum trucks'
  },
  {
    id: 'm6',
    time: 'T+48h',
    phase: 'Shoreline Shield',
    title: 'Shoreline Defense Confirmation & Sorbent Sweep',
    status: 'Pending',
    desc: 'Inspect intertidal zones at Galgibaga & Anjuna. Zero onshore stranding confirmed via drone infrared sweep.',
    keyAction: 'Conduct water column hydrocarbon sampling'
  },
  {
    id: 'm7',
    time: 'T+72h',
    phase: 'Demobilization',
    title: 'Post-Spill Remediation & Flotilla Demob',
    status: 'Pending',
    desc: 'Recover booms, clean equipment with biodegradable wash, finalize forensic legal dossier for prosecution.',
    keyAction: 'Submit final report to DG Shipping & MoEFCC'
  }
];

export default function ResponseTimelineTracker() {
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('m3');

  const toggleMilestoneStatus = (id) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const next = m.status === 'Completed' ? 'Active' : m.status === 'Active' ? 'Pending' : 'Completed';
        return { ...m, status: next };
      }
      return m;
    }));
  };

  const selected = milestones.find(m => m.id === selectedMilestoneId) || milestones[0];
  const completedCount = milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Incident Action Timeline & 72-Hour Milestone Tracker
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                {completedCount}/{milestones.length} PHASES
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Chronological operational milestones from first alarm to post-action demobilization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted font-bold">PROGRESS:</span>
          <span className="text-xs font-mono font-extrabold text-status-success">{progressPercent}%</span>
        </div>
      </div>

      {/* Horizontal Milestone Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        {milestones.map((m) => {
          const isSelected = m.id === selectedMilestoneId;
          const isDone = m.status === 'Completed';
          const isActive = m.status === 'Active';

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMilestoneId(m.id)}
              className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-ocean ring-2 ring-ocean/30 bg-ocean-light/50'
                  : 'border-border-marine hover:bg-ocean-light/20 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-extrabold text-ocean-navy">{m.time}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-status-success shrink-0" />
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 text-text-muted shrink-0" />
                  )}
                </div>
                <div className="text-[9px] font-mono uppercase text-text-muted mt-0.5 truncate">
                  {m.phase}
                </div>
              </div>

              <div className="mt-2">
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full block text-center truncate ${
                  isDone 
                    ? 'bg-emerald-100 text-status-success' 
                    : isActive 
                    ? 'bg-amber-100 text-status-warning' 
                    : 'bg-gray-100 text-text-muted'
                }`}>
                  {m.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Milestone Inspection Card */}
      <div className="p-3.5 bg-ocean-light/30 border border-border-marine rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-ocean text-white text-[10px] font-bold">
              {selected.time}
            </span>
            <h4 className="text-xs font-bold text-ocean-navy">{selected.title}</h4>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
              selected.status === 'Completed' ? 'bg-emerald-50 text-status-success border-emerald-300' :
              selected.status === 'Active' ? 'bg-amber-50 text-status-warning border-amber-300' : 'bg-gray-50 text-text-muted border-gray-300'
            }`}>
              {selected.status}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
            {selected.desc}
          </p>
          <div className="text-[10px] text-ocean-navy pt-1 font-mono">
            <strong>Key Tactical Deliverable:</strong> {selected.keyAction}
          </div>
        </div>

        <button
          onClick={() => toggleMilestoneStatus(selected.id)}
          className="py-1.5 px-3 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-mono font-bold shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          Toggle Status
        </button>
      </div>
    </div>
  );
}

