import React, { useState } from 'react';
import { X, Network, Link2, ShieldCheck, AlertTriangle, Eye, Compass, Satellite, Ship, Clock, CheckCircle2, FileSearch } from 'lucide-react';

export default function WorkspaceEvidenceBoardModal({ caseData, onClose }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterConfidence, setFilterConfidence] = useState('all');

  const nodes = [
    {
      id: 'sar',
      label: 'SAR Satellite Anomaly',
      sub: 'Sentinel-1 Dual-Pol VV/VH',
      category: 'satellite',
      certainty: 'Definitive',
      color: 'border-purple-400 bg-purple-50 text-purple-900',
      icon: Satellite,
      x: 15,
      y: 20,
      details: `Normalized radar cross-section backscatter damping: -24.2 dB. Dark patch delineation: ${caseData.spillAreaKm2} km² with 96.8% mineral oil probability.`
    },
    {
      id: 'hindcast',
      label: 'Backward Lagrangian Drift',
      sub: 'OpenDrift + CMEMS Currents',
      category: 'physics',
      certainty: 'Corroborating',
      color: 'border-blue-400 bg-blue-50 text-blue-900',
      icon: Compass,
      x: 48,
      y: 18,
      details: `Backward advection tracked slick mass 40 hours reverse time. Isolated Origin Zone A at 22:40 UTC with 72.4% statistical confidence.`
    },
    {
      id: 'blackout',
      label: 'AIS Silence Window',
      sub: 'Class-A Transponder Offline',
      category: 'ais',
      certainty: 'Definitive',
      color: 'border-red-400 bg-red-50 text-red-900',
      icon: Clock,
      x: 82,
      y: 25,
      details: `Target ${caseData.topVessel?.name || 'MV Ocean Star'} transponder ceased broadcast from 22:24 to 23:02 UTC (38 min gap) exactly while crossing origin sector.`
    },
    {
      id: 'speed_drop',
      label: 'SOG Kinematic Deceleration',
      sub: 'Speed Anomaly Analysis',
      category: 'kinematics',
      certainty: 'Corroborating',
      color: 'border-amber-400 bg-amber-50 text-amber-900',
      icon: Ship,
      x: 30,
      y: 65,
      details: `Vessel decelerated sharply from 13.2 kn to 3.8 kn over 2.4 nautical miles. Characteristic profile of slow-speed oily bilge tank stripping or slop disposal.`
    },
    {
      id: 'cpa',
      label: 'Closest Point of Approach',
      sub: 'CPA: 1.4 NM from Centroid',
      category: 'spatial',
      certainty: 'Definitive',
      color: 'border-emerald-400 bg-emerald-50 text-emerald-900',
      icon: Link2,
      x: 65,
      y: 68,
      details: `Spatial corridor reconstruction places vessel inside the oil slick envelope at estimated release time T-38.4 hours.`
    },
    {
      id: 'psc',
      label: 'Paris/Indian MoU PSC History',
      sub: 'Oily Water Separator Deficiencies',
      category: 'registry',
      certainty: 'Circumstantial',
      color: 'border-slate-400 bg-slate-50 text-slate-900',
      icon: FileSearch,
      x: 50,
      y: 92,
      details: `Port State Control audit in Singapore (March 2026) logged MARPOL Annex I 15ppm bilge alarm sensor bypass calibration defect.`
    }
  ];

  const links = [
    { from: 'sar', to: 'hindcast', label: 'Reverse Advection Vector' },
    { from: 'hindcast', to: 'blackout', label: 'Spatio-Temporal Intersection' },
    { from: 'blackout', to: 'speed_drop', label: 'Concurrent Deceleration' },
    { from: 'speed_drop', to: 'cpa', label: 'Physical Corridor Enclosure' },
    { from: 'cpa', to: 'psc', label: 'Corroborates Prior History' },
    { from: 'sar', to: 'cpa', label: 'Slick Envelope Overlap' }
  ];

  const filteredNodes = nodes.filter(n => {
    if (filterConfidence === 'all') return true;
    return n.certainty.toLowerCase() === filterConfidence.toLowerCase();
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-danger text-white shadow-sm">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Forensic Evidence Pinboard & Suspect Link Matrix
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold">
                  PROSECUTION EVIDENTIARY CHAIN
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Corroborate multi-source data threads linking {caseData.topVessel?.name || 'suspect vessel'} to the illegal discharge.
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

        {/* Filter Bar */}
        <div className="px-4 py-2.5 border-b border-border-marine bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-muted font-mono font-bold text-[11px]">EVIDENCE TIER:</span>
            {['all', 'Definitive', 'Corroborating', 'Circumstantial'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterConfidence(tier)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                  filterConfidence === tier
                    ? 'bg-ocean-navy text-white shadow-xs'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-ocean-deep font-semibold">
            {filteredNodes.length} Active Nodes Linked · 6 Corroboration Edges
          </div>
        </div>

        {/* Interactive Crime Pinboard Area */}
        <div className="relative flex-1 bg-slate-900 p-6 overflow-hidden min-h-[380px]">
          {/* Subtle corkboard / grid background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link, idx) => {
              const fromNode = nodes.find(n => n.id === link.from);
              const toNode = nodes.find(n => n.id === link.to);
              if (!fromNode || !toNode) return null;
              return (
                <g key={idx}>
                  <line
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="opacity-70 animate-pulse"
                  />
                </g>
              );
            })}
          </svg>

          {/* Pin Nodes */}
          {filteredNodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                className={`absolute cursor-pointer transition-all duration-200 z-10 ${
                  isSelected ? 'scale-110 ring-4 ring-red-400/80 shadow-2xl' : 'hover:scale-105'
                }`}
              >
                {/* Red pushpin head */}
                <div className="w-3.5 h-3.5 bg-red-600 rounded-full mx-auto -mb-1 shadow-md border-2 border-white ring-1 ring-red-800" />
                <div className={`p-2.5 rounded-xl border-2 shadow-lg w-48 text-left backdrop-blur-md ${node.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-white/80">
                      {node.certainty}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs leading-tight">{node.label}</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">{node.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Detail Drawer / Inspection footer */}
        <div className="p-4 border-t border-border-marine bg-white min-h-[90px] flex items-center justify-between">
          {selectedNode ? (
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ocean-light text-ocean">
                  EVIDENCE ID: {selectedNode.id.toUpperCase()}
                </span>
                <strong className="text-xs text-ocean-navy font-bold">{selectedNode.label}</strong>
                <span className="text-[10px] font-mono text-text-muted">({selectedNode.certainty} Evidence)</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-mono">
                {selectedNode.details}
              </p>
            </div>
          ) : (
            <div className="text-xs text-text-muted font-mono flex items-center gap-2">
              <Eye className="w-4 h-4 text-ocean" />
              <span>Click on any evidence pushpin to inspect forensic chain-of-custody details.</span>
            </div>
          )}

          <button
            onClick={() => setSelectedNode(null)}
            className="px-3 py-1.5 rounded-lg border border-border-marine text-xs text-text-secondary hover:bg-slate-100 font-mono"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}

