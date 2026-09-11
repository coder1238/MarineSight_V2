import React from 'react';
import { 
  Sliders, 
  Ship, 
  Anchor, 
  Droplets, 
  Flame 
} from 'lucide-react';

export const RESPONSE_STRATEGIES = [
  {
    id: 'alpha',
    name: 'Strategy Alpha',
    title: 'Offshore Mechanical Containment & Skimming',
    focus: 'Primary offshore interception using heavy ocean booms and high-capacity weir skimmers before oil reaches nearshore shelf.',
    icon: Ship,
    accent: 'border-ocean text-ocean bg-ocean/5',
    activeBadge: 'bg-ocean text-white',
    boomRequirementKm: 3.2,
    vesselsMobilized: 4,
    recoveryTargetRateM3Hr: 45,
    projectedCostUsd: 145000,
    containmentEfficiency: '85%'
  },
  {
    id: 'beta',
    name: 'Strategy Beta',
    title: 'Estuary & Mangrove Shoreline Deflection Shield',
    focus: 'Defensive booming across Zuari and Karwar estuaries to deflect drifting slick into sacrificial collection pockets.',
    icon: Anchor,
    accent: 'border-status-warning text-status-warning bg-amber-50/50',
    activeBadge: 'bg-status-warning text-white',
    boomRequirementKm: 5.6,
    vesselsMobilized: 5,
    recoveryTargetRateM3Hr: 30,
    projectedCostUsd: 185000,
    containmentEfficiency: '92%'
  },
  {
    id: 'gamma',
    name: 'Strategy Gamma',
    title: 'Deepwater Aerial Dispersant Dissipation',
    focus: 'Apply Type-3 chemical dispersant concentrate via Dornier aircraft sorties to rapidly dissipate slick in waters >25m depth.',
    icon: Droplets,
    accent: 'border-status-info text-status-info bg-sky-50/50',
    activeBadge: 'bg-status-info text-white',
    boomRequirementKm: 1.2,
    vesselsMobilized: 2,
    recoveryTargetRateM3Hr: 70,
    projectedCostUsd: 120000,
    containmentEfficiency: '78%'
  },
  {
    id: 'delta',
    name: 'Strategy Delta',
    title: 'In-Situ Controlled Combustion (ISB)',
    focus: 'Confine thick unweathered slick sections with fire booms for controlled ignition to eliminate volume with zero shore impact.',
    icon: Flame,
    accent: 'border-status-danger text-status-danger bg-red-50/50',
    activeBadge: 'bg-status-danger text-white',
    boomRequirementKm: 1.8,
    vesselsMobilized: 3,
    recoveryTargetRateM3Hr: 90,
    projectedCostUsd: 160000,
    containmentEfficiency: '88%'
  }
];

export default function StrategyScenarioBar({ activeStrategy, onSelectStrategy }) {
  const current = RESPONSE_STRATEGIES.find(s => s.id === activeStrategy) || RESPONSE_STRATEGIES[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Tactical Strategy Scenario Presets
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                4 PRESETS
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Instant 'What-If' tactical re-allocation of booms, vessels, recovery targets, and budget.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-text-muted">ACTIVE STRATEGY:</span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-ocean text-white uppercase">
            {current.name}
          </span>
        </div>
      </div>

      {/* 4 Strategy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {RESPONSE_STRATEGIES.map((strat) => {
          const Icon = strat.icon;
          const isSelected = strat.id === activeStrategy;

          return (
            <button
              key={strat.id}
              onClick={() => onSelectStrategy(strat.id)}
              className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `border-ocean ring-2 ring-ocean/30 bg-ocean-light/40 shadow-marine-sm`
                  : 'border-border-marine hover:border-ocean/50 bg-white hover:bg-ocean-light/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-ocean' : 'text-text-muted'}`} />
                    <span className="text-[11px] font-mono font-bold text-ocean-navy uppercase">
                      {strat.name}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-ocean text-white">
                      SELECTED
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-ocean-navy leading-snug line-clamp-1">
                  {strat.title}
                </h4>
                <p className="text-[10px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                  {strat.focus}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border-marine/50 grid grid-cols-2 gap-1 text-[9px] font-mono text-text-muted">
                <div>
                  <span className="block text-[8px] text-text-muted">BOOM REQ.</span>
                  <span className="font-bold text-ocean-navy">{strat.boomRequirementKm} km</span>
                </div>
                <div>
                  <span className="block text-[8px] text-text-muted">EFFICIENCY</span>
                  <span className="font-bold text-status-success">{strat.containmentEfficiency}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

