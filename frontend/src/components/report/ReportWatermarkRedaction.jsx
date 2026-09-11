import React from 'react';
import { ShieldAlert, Eye, EyeOff, Lock, Stamp, Award } from 'lucide-react';

export const CLASSIFICATION_LEVELS = [
  { id: 'CRITICAL / CONFIDENTIAL', color: 'text-red-700 bg-red-50 border-red-200', tag: 'CRITICAL' },
  { id: 'RESTRICTED LAW ENFORCEMENT', color: 'text-blue-700 bg-blue-50 border-blue-200', tag: 'RESTRICTED' },
  { id: 'OFFICIAL USE ONLY', color: 'text-amber-700 bg-amber-50 border-amber-200', tag: 'OFFICIAL' },
  { id: 'SECRET // NOFORN', color: 'text-purple-700 bg-purple-50 border-purple-200', tag: 'SECRET' },
  { id: 'PUBLIC / UNCLASSIFIED', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', tag: 'PUBLIC' },
];

export const WATERMARK_PRESETS = [
  'CONFIDENTIAL',
  'COURT EVIDENCE - ADMISSIBLE',
  'RESTRICTED - LAW ENFORCEMENT',
  'OFFICIAL MARITIME DOSSIER',
  'DRAFT - PENDING VERIFICATION',
  'EXERCISED SIMULATION ONLY',
  'NONE'
];

export function RedactedText({ text, isRedacted, customPlaceholder = '[REDACTED // LAW-ENF]' }) {
  if (!isRedacted) return <span>{text}</span>;
  return (
    <span 
      className="bg-gray-900 text-gray-300 px-1 py-0.5 rounded font-mono text-[10px] tracking-wider select-none inline-block border border-gray-700"
      title="Sensitive information redacted for public/inter-agency disclosure"
    >
      {customPlaceholder}
    </span>
  );
}

export default function ReportWatermarkRedaction({
  classification,
  onSetClassification,
  watermark,
  onSetWatermark,
  isRedacted,
  onToggleRedaction,
  onLogAudit
}) {
  const handleClassificationChange = (e) => {
    const val = e.target.value;
    onSetClassification(val);
    if (onLogAudit) onLogAudit(`Changed clearance classification to: ${val}`);
  };

  const handleWatermarkChange = (e) => {
    const val = e.target.value;
    onSetWatermark(val);
    if (onLogAudit) onLogAudit(`Updated document watermark stamp to: ${val}`);
  };

  const handleRedactionToggle = () => {
    const nextState = !isRedacted;
    onToggleRedaction(nextState);
    if (onLogAudit) onLogAudit(`Turned forensic redaction mode ${nextState ? 'ON' : 'OFF'}`);
  };

  const currentLevel = CLASSIFICATION_LEVELS.find(l => l.id === classification) || CLASSIFICATION_LEVELS[0];

  return (
    <div className="bg-white border border-border-marine rounded-xl p-3 shadow-marine-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Classification Selector */}
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-ocean" />
          <span className="text-[10px] font-mono uppercase text-text-muted font-bold">Clearance:</span>
          <select
            value={classification}
            onChange={handleClassificationChange}
            className={`font-mono text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none transition-all cursor-pointer ${currentLevel.color}`}
          >
            {CLASSIFICATION_LEVELS.map(level => (
              <option key={level.id} value={level.id}>
                {level.id}
              </option>
            ))}
          </select>
        </div>

        {/* Watermark Selector */}
        <div className="flex items-center gap-1.5">
          <Stamp className="w-3.5 h-3.5 text-ocean" />
          <span className="text-[10px] font-mono uppercase text-text-muted font-bold">Watermark:</span>
          <select
            value={watermark}
            onChange={handleWatermarkChange}
            className="font-mono text-xs bg-ocean-light border border-border-marine text-ocean-navy px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
          >
            {WATERMARK_PRESETS.map(w => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Redaction Mode Switcher */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        <button
          onClick={handleRedactionToggle}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isRedacted
              ? 'bg-gray-900 border-gray-800 text-emerald-400 hover:bg-black'
              : 'bg-white border-border-marine text-ocean-navy hover:bg-ocean-sky'
          }`}
          title="Toggle Redaction Mode to obscure sensitive vessel IMO/MMSI, radar IDs and officer cryptographic credentials"
        >
          {isRedacted ? <Lock className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-ocean" />}
          <span>Redaction Mode: {isRedacted ? 'ACTIVE (REDACTED)' : 'OFF (UNMASKED)'}</span>
        </button>
      </div>
    </div>
  );
}

