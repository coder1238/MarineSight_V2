import React, { useState } from 'react';
import { Cpu, ChevronDown, ChevronUp, Radio, Satellite, Info, Shield } from 'lucide-react';

export default function SarSensorTelemetryDossier({
  sceneId = "S1A_IW_GRDH_1SDV_20260912T003015_042819_051C8E",
  constellation = "Sentinel-1A"
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const telemetryFields = [
    { label: "SPACE CRAFT MISSION", value: constellation, code: "ESA_S1A" },
    { label: "INSTRUMENT / BAND", value: "C-SAR (5.405 GHz / λ=5.55 cm)", code: "C_BAND" },
    { label: "BEAM ACQUISITION MODE", value: "Interferometric Wide (IW TOPSAR)", code: "IW_GRDH" },
    { label: "PRODUCT TYPE / LEVEL", value: "Level-1 GRDH (Ground Range Detected High)", code: "L1_GRDH" },
    { label: "POLARIZATION CHANNELS", value: "Dual Co/Cross Pol: VV + VH", code: "1SDV" },
    { label: "LOOK DIRECTION / PASS", value: "Right-Looking / Descending Node", code: "DESCENDING" },
    { label: "INCIDENCE ANGLE RANGE", value: "29.1° (Near Range) to 46.0° (Far Range)", code: "INC_ANGLE" },
    { label: "GROUND PIXEL SPACING", value: "10.0 m × 10.0 m (Range × Azimuth)", code: "PIXEL_10M" },
    { label: "EQUIVALENT LOOKS (ENL)", value: "4.9 Looks (Multilook 5×1)", code: "ENL_4.9" },
    { label: "NOISE EQUIV. SIGMA ZERO", value: "NESZ: -22.4 dB (Sub-swath IW2)", code: "NESZ_SPEC" },
    { label: "ABSOLUTE ORBIT / CYCLE", value: "Orbit 42819 / Cycle 178 / Track 114", code: "ORBIT_114" },
    { label: "DOPPLER CENTROID FREQ", value: "-142.6 Hz (Azimuth Steering Active)", code: "DOPPLER_HZ" }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 11 · ESA SAFE &amp; CEOS Sensor Metadata Dossier
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-ocean font-bold flex items-center gap-1 hover:underline"
        >
          <span>{isExpanded ? "Collapse Specs" : "View Full Telemetry"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Primary Badge Row */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-ocean-light text-ocean-navy font-bold text-[10.5px]">
            {sceneId.substring(0, 24)}...
          </span>
          <span className="text-[10px] text-text-muted">L1 Calibrated &amp; Terrain Corrected</span>
        </div>
        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          ESA Validated SAFE Manifest
        </span>
      </div>

      {/* Collapsible Telemetry Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-border-marine text-xs animate-fade-in">
          {telemetryFields.map((field, idx) => (
            <div key={idx} className="p-2 bg-ocean-light/40 rounded-lg border border-border-marine/40">
              <span className="text-[9px] text-text-muted block font-bold">{field.label}</span>
              <span className="text-[11px] font-bold text-ocean-navy block truncate mt-0.5">{field.value}</span>
              <span className="text-[8.5px] text-text-muted block font-mono">CODE: {field.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

