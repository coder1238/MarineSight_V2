import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Wind, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

export default function InSituBurnAdvisor({ caseData }) {
  const [thicknessMm, setThicknessMm] = useState(2.8);
  const [waterContentPercent, setWaterContentPercent] = useState(18);
  const [windKnots, setWindKnots] = useState(11);
  const [distanceToShoreNm, setDistanceToShoreNm] = useState(14);
  const [igniterFlareType, setIgniterFlareType] = useState('heli_torch');

  const assessment = useMemo(() => {
    const isThicknessOk = thicknessMm >= 2.0;
    const isEmulsionOk = waterContentPercent < 25;
    const isWindOk = windKnots <= 15;
    const isDistanceOk = distanceToShoreNm >= 10;

    const allPassed = isThicknessOk && isEmulsionOk && isWindOk && isDistanceOk;

    let status = 'APPROVED FOR IN-SITU COMBUSTION';
    let statusColor = 'bg-emerald-50 text-status-success border-emerald-300';
    let icon = CheckCircle2;
    let feedback = 'Optimal burn conditions. High unweathered volatile fraction will yield ~92% volumetric elimination.';

    if (!isThicknessOk) {
      status = 'IGNITION INFEASIBLE: SLICK TOO THIN';
      statusColor = 'bg-red-50 text-status-danger border-red-300';
      icon = XCircle;
      feedback = 'Slick thickness is <2.0mm. Heat loss to seawater will quench flame before self-sustaining combustion initiates.';
    } else if (!isEmulsionOk) {
      status = 'COMBUSTION INHIBITED: EXCESS WATER EMULSION';
      statusColor = 'bg-red-50 text-status-danger border-red-300';
      icon = XCircle;
      feedback = 'Water-in-oil emulsion exceeds 25%. Steam generation prevents volatile hydrocarbon vapor flash point ignition.';
    } else if (!isWindOk) {
      status = 'HAZARDOUS: HIGH WIND GUSTS';
      statusColor = 'bg-amber-50 text-status-warning border-amber-300';
      icon = AlertTriangle;
      feedback = 'Wind exceeds 15 knots. Fire boom towing stability compromised and flame detachment risk is elevated.';
    } else if (!isDistanceOk) {
      status = 'RESTRICTED: COASTAL SMOKE PLUME EXCLUSION';
      statusColor = 'bg-amber-50 text-status-warning border-amber-300';
      icon = AlertTriangle;
      feedback = 'Distance to shore is <10 NM. Downwind particulate soot (PM2.5) will impact coastal human settlements.';
    }

    // Burn rate: typically ~2.0 mm/min or ~50 m3/hr inside 150m fire boom pocket
    const burnRateM3h = 45;
    const fireBoomRequiredM = 300;
    const smokePlumeExclusionNm = +(windKnots * 0.45).toFixed(1);

    return {
      allPassed,
      status,
      statusColor,
      icon,
      feedback,
      burnRateM3h,
      fireBoomRequiredM,
      smokePlumeExclusionNm,
      isThicknessOk,
      isEmulsionOk,
      isWindOk,
      isDistanceOk
    };
  }, [thicknessMm, waterContentPercent, windKnots, distanceToShoreNm]);

  const StatusIcon = assessment.icon;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-danger/10 text-status-danger">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              In-Situ Burning (ISB) Feasibility & Smoke Safety Window
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-status-danger border border-red-200">
                NRT / ASTM F1788
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Evaluate thermal flash parameters, emulsion limits, and downwind PM2.5 exclusion boundaries.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-status-danger font-bold">
          92% REMOVAL POTENTIAL
        </span>
      </div>

      {/* Status Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-3 ${assessment.statusColor}`}>
        <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-extrabold font-mono uppercase tracking-wide block">
            {assessment.status}
          </span>
          <p className="text-[11px] mt-0.5 leading-relaxed font-sans">
            {assessment.feedback}
          </p>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 space-y-3 font-mono">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Contained Thickness (Min 2.0 mm):</span>
              <span className={`font-bold ${assessment.isThicknessOk ? 'text-status-success' : 'text-status-danger'}`}>
                {thicknessMm} mm {assessment.isThicknessOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={thicknessMm}
              onChange={(e) => setThicknessMm(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Water Emulsification (Max 25%):</span>
              <span className={`font-bold ${assessment.isEmulsionOk ? 'text-status-success' : 'text-status-danger'}`}>
                {waterContentPercent}% H2O {assessment.isEmulsionOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="5"
              max="60"
              step="1"
              value={waterContentPercent}
              onChange={(e) => setWaterContentPercent(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-status-warning"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Wind Speed (Max 15 kn):</span>
              <span className={`font-bold ${assessment.isWindOk ? 'text-status-success' : 'text-status-danger'}`}>
                {windKnots} kn {assessment.isWindOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="2"
              max="25"
              step="1"
              value={windKnots}
              onChange={(e) => setWindKnots(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Distance to Populated Shore (Min 10 NM):</span>
              <span className={`font-bold ${assessment.isDistanceOk ? 'text-status-success' : 'text-status-danger'}`}>
                {distanceToShoreNm} NM {assessment.isDistanceOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="2"
              max="30"
              step="1"
              value={distanceToShoreNm}
              onChange={(e) => setDistanceToShoreNm(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>
        </div>

        {/* Output Metrics */}
        <div className="md:col-span-6 bg-ocean-light/30 border border-border-marine rounded-xl p-3.5 flex flex-col justify-between space-y-3 font-mono">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">BURN ELIMINATION RATE</span>
              <span className="text-base font-extrabold text-status-danger">
                ~{assessment.burnRateM3h} m³/h
              </span>
              <span className="text-[8px] text-text-secondary block">92% efficiency in pocket</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">FIRE BOOM REQUIREMENT</span>
              <span className="text-base font-extrabold text-ocean-navy">
                {assessment.fireBoomRequiredM} meters
              </span>
              <span className="text-[8px] text-text-secondary block">Refractory ceramic core</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">DOWNWIND SMOKE BUFFER</span>
              <span className="text-base font-extrabold text-status-warning">
                {assessment.smokePlumeExclusionNm} NM
              </span>
              <span className="text-[8px] text-text-secondary block">PM2.5 atmospheric radius</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">IGNITER SYSTEM</span>
              <span className="text-xs font-bold text-ocean block mt-1">
                Helitorch / Pyro-gel Flare
              </span>
              <span className="text-[8px] text-text-secondary block">Air-dropped delivery</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white border border-border-marine text-[10px] text-text-secondary font-sans flex items-center justify-between">
            <span>Air Quality Monitoring Team:</span>
            <span className="font-bold font-mono text-ocean">Drone Aeroqual Series 500 En-Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}

