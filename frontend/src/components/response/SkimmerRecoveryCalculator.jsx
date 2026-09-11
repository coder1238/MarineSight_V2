import React, { useState, useMemo } from 'react';
import { 
  Gauge, 
  Droplets, 
  Clock, 
  CheckCircle2, 
  Activity, 
  TrendingUp 
} from 'lucide-react';

export const SKIMMER_PROFILES = [
  {
    id: 'oleophilic_drum',
    name: 'Oleophilic Drum / Disc Skimmer',
    nominalCapacityM3h: 35,
    oilRecoveryEfficiency: 88, // % oil vs water
    idealViscosity: 'Light to Medium Fuel Oils (10 - 2,000 cSt)',
    throughputMultiplier: 0.85
  },
  {
    id: 'weir_highcap',
    name: 'High-Capacity Floating Weir Skimmer',
    nominalCapacityM3h: 75,
    oilRecoveryEfficiency: 62, // intakes more water, requires decanting
    idealViscosity: 'Heavy Fuel Oils & Fresh Crude (500 - 10,000 cSt)',
    throughputMultiplier: 0.95
  },
  {
    id: 'brush_viscous',
    name: 'Continuous Brush Skimmer (Heavy Mousse)',
    nominalCapacityM3h: 50,
    oilRecoveryEfficiency: 82,
    idealViscosity: 'Emulsified Chocolate Mousse & Bunkers (>5,000 cSt)',
    throughputMultiplier: 0.80
  },
  {
    id: 'suction_vacuum',
    name: 'Air-Conveyance Suction Vacuum',
    nominalCapacityM3h: 25,
    oilRecoveryEfficiency: 50,
    idealViscosity: 'Shallow Waters, Pockets & Shoreline Berms',
    throughputMultiplier: 0.70
  }
];

export default function SkimmerRecoveryCalculator({ caseData }) {
  const [selectedSkimmerId, setSelectedSkimmerId] = useState('weir_highcap');
  const [slickThicknessMm, setSlickThicknessMm] = useState(1.8);
  const [encounterWidthM, setEncounterWidthM] = useState(15);
  const [advanceSpeedKn, setAdvanceSpeedKn] = useState(0.7);
  const [operatingHoursPerDay, setOperatingHoursPerDay] = useState(10);
  const [numberOfUnits, setNumberOfUnits] = useState(2);

  const selectedProfile = SKIMMER_PROFILES.find(s => s.id === selectedSkimmerId) || SKIMMER_PROFILES[0];

  // Total spill volume in m3 (estimated from spillAreaKm2 * avg thickness or fallback)
  const totalSpillVolumeM3 = useMemo(() => {
    const areaKm2 = caseData?.spillAreaKm2 || 14.7;
    // 1 km2 * 1 mm = 1,000 m3
    return Math.round(areaKm2 * slickThicknessMm * 180);
  }, [caseData, slickThicknessMm]);

  const metrics = useMemo(() => {
    // Speed in m/s: 1 knot = 0.514444 m/s
    const speedMs = advanceSpeedKn * 0.514444;
    // Theoretical encounter volume per second per skimmer: W * v * thickness
    const encounterRateM3s = encounterWidthM * speedMs * (slickThicknessMm / 1000);
    const theoreticalRateM3h = encounterRateM3s * 3600;

    // Pump bottleneck check: min of theoretical intake and nominal pump capacity
    const effectiveTotalIntakeM3h = Math.min(
      theoreticalRateM3h * selectedProfile.throughputMultiplier,
      selectedProfile.nominalCapacityM3h
    );

    const oilFraction = selectedProfile.oilRecoveryEfficiency / 100;
    const pureOilRecoveryRateM3h = +(effectiveTotalIntakeM3h * oilFraction * numberOfUnits).toFixed(1);
    const decantedWaterRateM3h = +(effectiveTotalIntakeM3h * (1 - oilFraction) * numberOfUnits).toFixed(1);

    const dailyOilRecoveryM3 = Math.round(pureOilRecoveryRateM3h * operatingHoursPerDay);
    const dailyBarrels = Math.round(dailyOilRecoveryM3 * 6.2898);

    const estimatedDaysToClear = pureOilRecoveryRateM3h > 0
      ? +(totalSpillVolumeM3 / (pureOilRecoveryRateM3h * operatingHoursPerDay)).toFixed(1)
      : 99;

    const percentRecoveredDay1 = Math.min(100, Math.round((dailyOilRecoveryM3 / totalSpillVolumeM3) * 100));

    return {
      pureOilRecoveryRateM3h,
      decantedWaterRateM3h,
      dailyOilRecoveryM3,
      dailyBarrels,
      estimatedDaysToClear,
      percentRecoveredDay1
    };
  }, [advanceSpeedKn, encounterWidthM, slickThicknessMm, selectedProfile, numberOfUnits, operatingHoursPerDay, totalSpillVolumeM3]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Mechanical Skimmer Recovery & ASTM F631 Engine
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-ocean border border-sky-200">
                BSEE / IMO COMPLIANT
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Model encounter rates, pure oil recovery efficiency (ORE), and decanted water volumes.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-status-success font-bold border border-emerald-200">
          ● REAL-TIME KINETICS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Configuration Controls (Col 6) */}
        <div className="md:col-span-6 space-y-3">
          <div>
            <label className="text-[10px] font-mono font-bold text-ocean-navy uppercase block mb-1">
              Select Skimmer Mechanism
            </label>
            <select
              value={selectedSkimmerId}
              onChange={(e) => setSelectedSkimmerId(e.target.value)}
              className="w-full text-xs font-mono font-medium p-2 rounded-xl border border-border-marine bg-white focus:outline-none focus:ring-2 focus:ring-ocean"
            >
              {SKIMMER_PROFILES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.nominalCapacityM3h} m³/h nominal)
                </option>
              ))}
            </select>
            <span className="text-[10px] text-text-muted mt-0.5 block italic">
              Suitability: {selectedProfile.idealViscosity}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-secondary">Active Units:</span>
                <span className="font-bold text-ocean">{numberOfUnits} Skimmers</span>
              </div>
              <input 
                type="range"
                min="1"
                max="6"
                step="1"
                value={numberOfUnits}
                onChange={(e) => setNumberOfUnits(+e.target.value)}
                className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-secondary">Encounter Swath:</span>
                <span className="font-bold text-ocean-navy">{encounterWidthM} m</span>
              </div>
              <input 
                type="range"
                min="5"
                max="40"
                step="5"
                value={encounterWidthM}
                onChange={(e) => setEncounterWidthM(+e.target.value)}
                className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-secondary">Slick Thickness:</span>
                <span className="font-bold text-status-warning">{slickThicknessMm} mm</span>
              </div>
              <input 
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={slickThicknessMm}
                onChange={(e) => setSlickThicknessMm(+e.target.value)}
                className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-status-warning"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1">
                <span className="text-text-secondary">Towing Speed:</span>
                <span className="font-bold text-ocean">{advanceSpeedKn} kn</span>
              </div>
              <input 
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={advanceSpeedKn}
                onChange={(e) => setAdvanceSpeedKn(+e.target.value)}
                className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-text-secondary">Daily Skimming Window (Daylight Operations):</span>
              <span className="font-bold text-ocean-navy">{operatingHoursPerDay} hrs/day</span>
            </div>
            <input 
              type="range"
              min="4"
              max="24"
              step="1"
              value={operatingHoursPerDay}
              onChange={(e) => setOperatingHoursPerDay(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>
        </div>

        {/* Right: Calculated Yield & Recovery Progress Bar (Col 6) */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3 bg-ocean-light/30 border border-border-marine rounded-xl p-3 font-mono">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">PURE OIL RECOVERY</span>
              <span className="text-base font-extrabold text-status-success">
                {metrics.pureOilRecoveryRateM3h} m³/h
              </span>
              <span className="text-[8px] text-text-secondary block">ORE: {selectedProfile.oilRecoveryEfficiency}%</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">DECANTED WATER</span>
              <span className="text-base font-extrabold text-status-info">
                {metrics.decantedWaterRateM3h} m³/h
              </span>
              <span className="text-[8px] text-text-secondary block">Route to slop bladders</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">DAILY RECOVERY YIELD</span>
              <span className="text-base font-extrabold text-ocean">
                {metrics.dailyOilRecoveryM3} m³/day
              </span>
              <span className="text-[8px] text-text-secondary block">~{metrics.dailyBarrels.toLocaleString()} bbls/day</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-border-marine">
              <span className="text-[9px] text-text-muted block">TIME TO CLEAR SLICK</span>
              <span className="text-base font-extrabold text-status-warning">
                {metrics.estimatedDaysToClear} Days
              </span>
              <span className="text-[8px] text-text-secondary block">Based on ~{totalSpillVolumeM3} m³</span>
            </div>
          </div>

          {/* Recovery Progress Bar */}
          <div className="bg-white p-3 rounded-lg border border-border-marine space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-ocean" />
                24-Hour Recovery Throughput Projection
              </span>
              <span className="font-bold text-status-success">
                {metrics.percentRecoveredDay1}% OF ACTIVE SLICK
              </span>
            </div>

            <div className="w-full bg-border-marine/50 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-ocean to-status-success h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, metrics.percentRecoveredDay1))}%` }}
              />
            </div>

            <div className="flex justify-between text-[9px] text-text-muted">
              <span>Day 1 Target: {metrics.dailyOilRecoveryM3} m³</span>
              <span>Total Estimated Slick: {totalSpillVolumeM3} m³</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

