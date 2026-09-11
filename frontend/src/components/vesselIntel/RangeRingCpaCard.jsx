import React, { useState } from 'react';
import { Target, Compass, Navigation, AlertCircle, Eye, ShieldAlert } from 'lucide-react';

export default function RangeRingCpaCard({ vessel, caseData }) {
  const [tacticalRingNm, setTacticalRingNm] = useState(5.0);
  const [exclusionRingNm, setExclusionRingNm] = useState(2.0);
  const [showRadarSweep, setShowRadarSweep] = useState(true);

  const cpaNm = vessel.cpaNm || 1.4;
  const isInsideExclusion = cpaNm <= exclusionRingNm;
  const isInsideTactical = cpaNm <= tacticalRingNm;

  // Relative bearing calculation
  const relBearingDeg = 246; // bearing from slick centroid to vessel
  const relativeVelocityKn = Math.abs(vessel.speedKn ? (vessel.speedKn * 0.85).toFixed(1) : 10.5);
  const tcpaMinutes = Math.round((cpaNm / Math.max(1, vessel.speedKn || 12)) * 60);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean border border-ocean/30">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Range Rings & CPA Proximity Simulator
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Closest Point of Approach kinematics relative to slick origin
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRadarSweep(!showRadarSweep)}
          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
            showRadarSweep 
              ? 'bg-ocean text-white border-ocean'
              : 'bg-white text-text-muted border-border-marine hover:bg-ocean-light'
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Radar Sweep {showRadarSweep ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* CPA & TCPA Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">MINIMUM CPA DISTANCE</span>
          <span className={`text-base font-bold mt-0.5 block ${cpaNm <= 2.0 ? 'text-status-danger' : 'text-status-warning'}`}>
            {cpaNm} nm
          </span>
          <span className="text-[9px] text-text-muted">{(cpaNm * 1.852).toFixed(2)} km offset</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">TIME TO CPA (TCPA)</span>
          <span className="text-base font-bold text-ocean-navy mt-0.5 block">
            {tcpaMinutes} Min
          </span>
          <span className="text-[9px] text-text-muted">Past intersection event</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">RELATIVE BEARING</span>
          <span className="text-base font-bold text-ocean-deep mt-0.5 block">
            {relBearingDeg}° True
          </span>
          <span className="text-[9px] text-text-muted">Azimuth from spill core</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">CLOSURE SPEED</span>
          <span className="text-base font-bold text-text-primary mt-0.5 block">
            {relativeVelocityKn} kn
          </span>
          <span className="text-[9px] text-text-muted">Kinematic vector</span>
        </div>
      </div>

      {/* Interactive Range Ring Sliders */}
      <div className="space-y-2.5 p-3 bg-ocean-light/70 rounded-xl border border-border-marine">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-text-primary font-bold">Adjust Range Ring Radii</span>
          <span className="text-[10px] text-text-muted font-sans">Updates boundary zones on tactical GIS overlay</span>
        </div>

        {/* Exclusion Zone Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-status-danger font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-danger inline-block" />
              Critical Exclusion Zone
            </span>
            <span className="font-bold text-status-danger">{exclusionRingNm.toFixed(1)} NM</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.5"
            value={exclusionRingNm}
            onChange={(e) => setExclusionRingNm(parseFloat(e.target.value))}
            className="w-full accent-status-danger h-1.5 bg-white rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Tactical Perimeter Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-status-warning font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-warning inline-block" />
              Tactical Surveillance Perimeter
            </span>
            <span className="font-bold text-status-warning">{tacticalRingNm.toFixed(1)} NM</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="15.0"
            step="1.0"
            value={tacticalRingNm}
            onChange={(e) => setTacticalRingNm(parseFloat(e.target.value))}
            className="w-full accent-status-warning h-1.5 bg-white rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Proximity Breach Status */}
      <div className="flex items-center justify-between p-2.5 rounded-xl border text-[11px] font-sans">
        <div className="flex items-center gap-2">
          {isInsideExclusion ? (
            <ShieldAlert className="w-4 h-4 text-status-danger" />
          ) : isInsideTactical ? (
            <AlertCircle className="w-4 h-4 text-status-warning" />
          ) : (
            <Navigation className="w-4 h-4 text-status-success" />
          )}
          <span className="font-mono text-xs font-bold text-text-primary">
            STATUS: {isInsideExclusion ? 'BREACHED CRITICAL EXCLUSION ZONE' : isInsideTactical ? 'WITHIN TACTICAL CORRIDOR' : 'OUTSIDE PROXIMITY RINGS'}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
          isInsideExclusion ? 'bg-red-100 text-status-danger' : isInsideTactical ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-status-success'
        }`}>
          {isInsideExclusion ? 'SEVERITY: ALPHA' : isInsideTactical ? 'SEVERITY: BRAVO' : 'SEVERITY: CLEAR'}
        </span>
      </div>
    </div>
  );
}

