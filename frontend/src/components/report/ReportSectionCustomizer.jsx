import React, { useState } from 'react';
import { SlidersHorizontal, Eye, EyeOff, ArrowUp, ArrowDown, RotateCcw, CheckSquare, Sparkles } from 'lucide-react';

export const DEFAULT_SECTIONS = [
  { id: 'summary', title: '1. Executive Summary', visible: true },
  { id: 'telemetry', title: '2. Forensic Telemetry & Metrics', visible: true },
  { id: 'radar_canvas', title: '3. Satellite Radar Contour & Drift Vectors', visible: true },
  { id: 'bonn_volume', title: '4. Bonn Agreement Spill Volumetric Assessment', visible: true },
  { id: 'vessels', title: '5. Suspect Candidate Attribution Funnel', visible: true },
  { id: 'jurisdiction', title: '6. Maritime Jurisdiction & Applicable Treaties', visible: true },
  { id: 'penalties', title: '7. Statutory Liabilities & Environmental Bonds', visible: true },
  { id: 'environment', title: '8. Marine Habitat Threat Matrix', visible: true },
  { id: 'recommendations', title: '9. Priority Intercept & Response Directives', visible: true },
  { id: 'signatures', title: '10. Cryptographic Chain of Custody & Signatures', visible: true },
];

export default function ReportSectionCustomizer({ sections, onUpdateSections, onLogAudit }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = (id) => {
    const updated = sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
    onUpdateSections(updated);
    if (onLogAudit) onLogAudit(`Toggled section visibility: ${id}`);
  };

  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onUpdateSections(updated);
    if (onLogAudit) onLogAudit(`Reordered section ${temp.title}`);
  };

  const applyPreset = (presetName) => {
    let updated;
    if (presetName === 'executive') {
      updated = sections.map(s => ({
        ...s,
        visible: ['summary', 'telemetry', 'vessels', 'recommendations', 'signatures'].includes(s.id)
      }));
    } else if (presetName === 'technical') {
      updated = sections.map(s => ({
        ...s,
        visible: ['summary', 'telemetry', 'radar_canvas', 'bonn_volume', 'vessels', 'signatures'].includes(s.id)
      }));
    } else if (presetName === 'legal') {
      updated = sections.map(s => ({
        ...s,
        visible: ['summary', 'vessels', 'jurisdiction', 'penalties', 'signatures'].includes(s.id)
      }));
    } else {
      updated = DEFAULT_SECTIONS;
    }
    onUpdateSections(updated);
    if (onLogAudit) onLogAudit(`Applied dossier section preset: ${presetName}`);
  };

  const activeCount = sections.filter(s => s.visible).length;

  return (
    <div className="bg-white border border-border-marine rounded-xl p-3 shadow-marine-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-xs font-bold text-ocean-navy hover:text-ocean transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-ocean" />
            <span>Customize Dossier Sections ({activeCount}/{sections.length} Active)</span>
          </button>
          <span className="text-[10px] text-text-muted hidden sm:inline">| Reorder & tailor sections for court, press, or operational briefing</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-text-muted hidden md:inline">Presets:</span>
          <button
            onClick={() => applyPreset('all')}
            className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20 transition-all"
          >
            Full
          </button>
          <button
            onClick={() => applyPreset('executive')}
            className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20 transition-all"
          >
            Exec
          </button>
          <button
            onClick={() => applyPreset('legal')}
            className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20 transition-all"
          >
            Legal
          </button>
          <button
            onClick={() => applyPreset('technical')}
            className="px-2 py-1 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20 transition-all"
          >
            SAR
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-1 rounded bg-ocean text-white text-[10px] font-bold shadow-sm transition-all ml-1"
          >
            {isOpen ? 'Close' : 'Adjust'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border-marine grid grid-cols-1 md:grid-cols-2 gap-2 animate-fadeIn">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-2 rounded-lg border flex items-center justify-between text-xs transition-all ${
                section.visible
                  ? 'bg-ocean-light/50 border-ocean/30 text-ocean-navy'
                  : 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <button
                  onClick={() => toggleVisibility(section.id)}
                  className="p-1 rounded hover:bg-white text-ocean transition-all"
                  title={section.visible ? 'Hide section' : 'Show section'}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                <span className="font-mono text-[11px] font-medium truncate">{section.title}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, -1)}
                  className="p-1 rounded hover:bg-white text-ocean-navy disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, 1)}
                  className="p-1 rounded hover:bg-white text-ocean-navy disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

