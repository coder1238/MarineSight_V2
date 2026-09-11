import React, { useState, useMemo } from 'react';
import { 
  Anchor, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Info, 
  Gauge, 
  Maximize2,
  ShieldCheck
} from 'lucide-react';

export const BOOM_TYPES = [
  {
    id: 'ocean_curtain',
    name: 'Heavy Ocean Curtain Boom (1200mm)',
    freeboardMm: 450,
    skirtMm: 750,
    tensionRatingKn: 120,
    recommendedFor: 'Offshore deepwater containment & heavy chop waves',
    costPerMeterUsd: 85
  },
  {
    id: 'shore_sealing',
    name: 'Shoreline Inflatable Tidal Barrier',
    freeboardMm: 300,
    skirtMm: 400,
    tensionRatingKn: 65,
    recommendedFor: 'Intertidal mudflats, estuaries & sandy shoreline',
    costPerMeterUsd: 60
  },
  {
    id: 'pneumatic_bubble',
    name: 'Submerged Pneumatic Bubble Barrier',
    freeboardMm: 0,
    skirtMm: 1200,
    tensionRatingKn: 200,
    recommendedFor: 'Harbor entrance non-obstructive vessel navigation',
    costPerMeterUsd: 140
  },
  {
    id: 'fire_resistant',
    name: 'Ceramic-Core Fire Boom (ISB)',
    freeboardMm: 350,
    skirtMm: 650,
    tensionRatingKn: 150,
    recommendedFor: 'In-situ controlled burning operations >1000°C',
    costPerMeterUsd: 220
  }
];

export default function BoomCalculator({ onAddVirtualBoom, caseData }) {
  const [selectedBoomId, setSelectedBoomId] = useState('ocean_curtain');
  const [openingWidthM, setOpeningWidthM] = useState(1200);
  const [deflectionAngleDeg, setDeflectionAngleDeg] = useState(30);
  const [currentSpeedKn, setCurrentSpeedKn] = useState(caseData?.environment?.currentSpeedMs ? +(caseData.environment.currentSpeedMs * 1.94384).toFixed(1) : 0.9);
  const [safetyMargin, setSafetyMargin] = useState(1.2);
  const [deployedNotification, setDeployedNotification] = useState(false);

  const selectedBoom = BOOM_TYPES.find(b => b.id === selectedBoomId) || BOOM_TYPES[0];

  const calculations = useMemo(() => {
    const rad = (deflectionAngleDeg * Math.PI) / 180;
    const sinTheta = Math.max(0.15, Math.sin(rad));
    
    // Normal velocity component to the boom
    const normalVelocityKn = currentSpeedKn * sinTheta;
    const isEntrainmentRisk = normalVelocityKn > 0.75; // 0.75 knots critical threshold for oil bypass

    // Theoretical length needed to cover opening width W at angle theta
    const nominalLengthM = openingWidthM / sinTheta;
    const totalBoomLengthM = Math.round(nominalLengthM * safetyMargin);
    
    // Anchors needed every 45 meters + 2 terminal moorings
    const anchorsCount = Math.ceil(totalBoomLengthM / 45) + 2;

    // Tow/Mooring boats needed
    const towBoatsCount = Math.max(2, Math.ceil(totalBoomLengthM / 800));

    // Tension pull force (approx hydrodynamic drag)
    const hydrodynamicDragKn = Math.round(0.015 * totalBoomLengthM * Math.pow(normalVelocityKn, 1.8));

    const totalCostUsd = totalBoomLengthM * selectedBoom.costPerMeterUsd;

    return {
      normalVelocityKn: +normalVelocityKn.toFixed(2),
      isEntrainmentRisk,
      totalBoomLengthM,
      anchorsCount,
      towBoatsCount,
      hydrodynamicDragKn,
      totalCostUsd
    };
  }, [openingWidthM, deflectionAngleDeg, currentSpeedKn, safetyMargin, selectedBoom]);

  const handleDeployToMap = () => {
    if (onAddVirtualBoom) {
      const centerLat = caseData?.coordinates?.lat || 14.8214;
      const centerLng = caseData?.coordinates?.lng || 68.2108;
      
      const rad = (deflectionAngleDeg * Math.PI) / 180;
      const spanDeg = (calculations.totalBoomLengthM / 1000) / 111; // rough degree span

      const startLat = centerLat - (spanDeg / 2) * Math.cos(rad);
      const startLng = centerLng - (spanDeg / 2) * Math.sin(rad);
      const endLat = centerLat + (spanDeg / 2) * Math.cos(rad);
      const endLng = centerLng + (spanDeg / 2) * Math.sin(rad);

      const virtualBoom = {
        id: `VB-${Date.now().toString().slice(-4)}`,
        label: `${selectedBoom.name.split(' ')[0]} Barrier (${calculations.totalBoomLengthM}m)`,
        coords: [
          [+startLat.toFixed(4), +startLng.toFixed(4)],
          [+endLat.toFixed(4), +endLng.toFixed(4)]
        ],
        lengthM: calculations.totalBoomLengthM,
        efficiency: calculations.isEntrainmentRisk ? 58 : 94,
        status: calculations.isEntrainmentRisk ? 'Marginal Velocity' : 'Optimal Barrier',
        holdingCapacityBbls: Math.round(calculations.totalBoomLengthM * 3.4)
      };

      onAddVirtualBoom(virtualBoom);
      setDeployedNotification(true);
      setTimeout(() => setDeployedNotification(false), 3000);
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-warning/10 text-status-warning">
            <Anchor className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Tactical Boom Barrier & Moorings Calculator
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                USCG / IMO STANDARD
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Calculate hydrodynamically stable containment lengths, anchor spacing, and underflow limits.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ocean-light text-ocean font-bold">
          ASTM F1523
        </span>
      </div>

      {/* Grid: Inputs & Live Physics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Inputs (Col 6) */}
        <div className="md:col-span-6 space-y-3">
          {/* Boom Model Selection */}
          <div>
            <label className="text-[10px] font-mono font-bold text-ocean-navy uppercase block mb-1">
              Select Boom Architecture
            </label>
            <select
              value={selectedBoomId}
              onChange={(e) => setSelectedBoomId(e.target.value)}
              className="w-full text-xs font-mono font-medium p-2 rounded-xl border border-border-marine bg-white focus:outline-none focus:ring-2 focus:ring-ocean"
            >
              {BOOM_TYPES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (${b.costPerMeterUsd}/m)
                </option>
              ))}
            </select>
            <span className="text-[10px] text-text-muted mt-0.5 block italic">
              {selectedBoom.recommendedFor}
            </span>
          </div>

          {/* Opening Width Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-text-secondary">Containment Corridor Width (W):</span>
              <span className="font-bold text-ocean">{openingWidthM} m</span>
            </div>
            <input 
              type="range"
              min="200"
              max="3000"
              step="50"
              value={openingWidthM}
              onChange={(e) => setOpeningWidthM(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>

          {/* Deflection Angle Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-text-secondary">Deflection Chevron Angle (θ):</span>
              <span className="font-bold text-ocean-navy">{deflectionAngleDeg}°</span>
            </div>
            <input 
              type="range"
              min="15"
              max="60"
              step="5"
              value={deflectionAngleDeg}
              onChange={(e) => setDeflectionAngleDeg(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
            <div className="flex justify-between text-[9px] text-text-muted mt-0.5 font-mono">
              <span>15° (Low Drag / High Flow)</span>
              <span>45° (Standard)</span>
              <span>60° (Heavy Drag)</span>
            </div>
          </div>

          {/* Current Speed Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-text-secondary">Ambient Surface Current (V):</span>
              <span className="font-bold text-status-info">{currentSpeedKn} knots</span>
            </div>
            <input 
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={currentSpeedKn}
              onChange={(e) => setCurrentSpeedKn(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-status-info"
            />
          </div>
        </div>

        {/* Right Computed Metrics & Velocity Warning (Col 6) */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3 bg-ocean-light/30 border border-border-marine rounded-xl p-3">
          {/* Normal Velocity Check Alert */}
          <div className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
            calculations.isEntrainmentRisk
              ? 'bg-red-50 border-red-200 text-status-danger'
              : 'bg-emerald-50 border-emerald-200 text-status-success'
          }`}>
            {calculations.isEntrainmentRisk ? (
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-bold font-mono text-[11px] block">
                {calculations.isEntrainmentRisk
                  ? `CRITICAL: Normal Velocity ${calculations.normalVelocityKn} kn > 0.75 kn threshold!`
                  : `HYDRODYNAMIC PASS: Normal Velocity ${calculations.normalVelocityKn} kn < 0.75 kn.`}
              </span>
              <span className="text-[10px] opacity-90 block mt-0.5">
                {calculations.isEntrainmentRisk
                  ? 'Oil droplets will escape beneath skirt via underflow entrainment. Reduce deflection angle θ!'
                  : 'Boom will successfully hold and deflect slick into skimmer pocket without vortex drain.'}
              </span>
            </div>
          </div>

          {/* Computed Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">TOTAL BOOM LENGTH</span>
              <span className="text-sm font-extrabold text-ocean-navy">
                {calculations.totalBoomLengthM} m
              </span>
              <span className="text-[8px] text-text-secondary block">w/ {safetyMargin}x safety factor</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">MOORING ANCHORS</span>
              <span className="text-sm font-extrabold text-status-warning">
                {calculations.anchorsCount} Anchors
              </span>
              <span className="text-[8px] text-text-secondary block">50kg Danforth @ 45m</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">TOW / PATROL BOATS</span>
              <span className="text-sm font-extrabold text-ocean">
                {calculations.towBoatsCount} Cutters
              </span>
              <span className="text-[8px] text-text-secondary block">Stationary hold & sweep</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">ESTIMATED ASSET COST</span>
              <span className="text-sm font-extrabold text-text-primary">
                ${calculations.totalCostUsd.toLocaleString()}
              </span>
              <span className="text-[8px] text-text-secondary block">Hardware & deployment</span>
            </div>
          </div>

          {/* Action Deploy Button */}
          <button
            onClick={handleDeployToMap}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-marine-sm ${
              deployedNotification
                ? 'bg-status-success text-white'
                : 'bg-ocean hover:bg-ocean-deep text-white'
            }`}
          >
            {deployedNotification ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Virtual Boom Added to GIS Tactical Map!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Deploy Calculated Boom to Live Map</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

