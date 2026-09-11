import React, { useState, useEffect } from 'react';
import { Droplet, Info, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

export const BONN_TIERS = [
  { code: 1, name: 'Sheen', thicknessUm: '0.04 – 0.15 µm', nominalM3PerKm2: 0.1, color: 'bg-slate-300 text-slate-800' },
  { code: 2, name: 'Rainbow', thicknessUm: '0.15 – 1.0 µm', nominalM3PerKm2: 0.3, color: 'bg-indigo-300 text-indigo-900' },
  { code: 3, name: 'Metallic', thicknessUm: '1.0 – 5.0 µm', nominalM3PerKm2: 2.5, color: 'bg-amber-300 text-amber-900' },
  { code: 4, name: 'Discontinuous True Oil', thicknessUm: '50 – 200 µm', nominalM3PerKm2: 100, color: 'bg-amber-700 text-amber-50' },
  { code: 5, name: 'Continuous Heavy Crude', thicknessUm: '> 200 µm', nominalM3PerKm2: 250, color: 'bg-stone-900 text-stone-100' },
];

export default function ReportBonnVolumeCalculator({ spillAreaKm2, onUpdateMetrics, onLogAudit }) {
  // Percent distribution across 5 tiers (sum = 100%)
  const [distribution, setDistribution] = useState({
    t1: 40, // 40% sheen
    t2: 25, // 25% rainbow
    t3: 20, // 20% metallic
    t4: 12, // 12% discontinuous
    t5: 3   // 3% heavy core
  });

  const [weatheringLossPct, setWeatheringLossPct] = useState(24); // 24% evaporated/dispersed

  const calculateVolume = () => {
    const area = spillAreaKm2 || 14.7;
    // Volume in m3 for each tier: (Area * % / 100) * nominalM3PerKm2
    const v1 = (area * (distribution.t1 / 100)) * 0.1;
    const v2 = (area * (distribution.t2 / 100)) * 0.3;
    const v3 = (area * (distribution.t3 / 100)) * 2.5;
    const v4 = (area * (distribution.t4 / 100)) * 100;
    const v5 = (area * (distribution.t5 / 100)) * 250;

    const rawVolumeM3 = v1 + v2 + v3 + v4 + v5;
    // Remaining volume on surface after weathering
    const surfaceVolumeM3 = rawVolumeM3 * (1 - weatheringLossPct / 100);
    // Density of crude ~ 0.88 metric tonnes / m3
    const volumeTonnes = Math.round(surfaceVolumeM3 * 0.88);
    const volumeBarrels = Math.round(surfaceVolumeM3 * 6.2898);

    return {
      rawVolumeM3: Math.round(rawVolumeM3),
      surfaceVolumeM3: Math.round(surfaceVolumeM3),
      volumeTonnes,
      volumeBarrels
    };
  };

  const metrics = calculateVolume();

  useEffect(() => {
    if (onUpdateMetrics) {
      onUpdateMetrics(metrics);
    }
  }, [distribution, weatheringLossPct, spillAreaKm2]);

  const handleSliderChange = (key, val) => {
    const num = parseInt(val, 10);
    setDistribution(prev => ({ ...prev, [key]: num }));
  };

  const resetBonnPreset = (preset) => {
    if (preset === 'heavy') {
      setDistribution({ t1: 15, t2: 15, t3: 20, t4: 30, t5: 20 });
    } else if (preset === 'light') {
      setDistribution({ t1: 65, t2: 25, t3: 8, t4: 2, t5: 0 });
    } else {
      setDistribution({ t1: 40, t2: 25, t3: 20, t4: 12, t5: 3 });
    }
    if (onLogAudit) onLogAudit(`Reset Bonn agreement volume profile to: ${preset}`);
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Bonn Agreement Oil Appearance Code (BAOAC) Volume Estimation
            </h4>
            <p className="text-[10px] text-text-muted">
              Standard IMO/Bonn protocol estimating release tonnage from satellite radar backscatter thickness.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-text-muted">Preset:</span>
          <button
            onClick={() => resetBonnPreset('light')}
            className="px-2 py-0.5 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20"
          >
            Sheen
          </button>
          <button
            onClick={() => resetBonnPreset('standard')}
            className="px-2 py-0.5 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20"
          >
            Mixed (Default)
          </button>
          <button
            onClick={() => resetBonnPreset('heavy')}
            className="px-2 py-0.5 rounded bg-ocean-light hover:bg-ocean/10 text-[10px] font-mono font-bold text-ocean border border-ocean/20"
          >
            Heavy Sludge
          </button>
        </div>
      </div>

      {/* Volumetric Output Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Surface Metric Tonnes</span>
          <span className="text-xl font-extrabold text-status-danger">{metrics.volumeTonnes.toLocaleString()} MT</span>
          <span className="text-[9px] text-text-muted block">Crude ρ = 0.88 t/m³</span>
        </div>
        <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Estimated Barrels (bbl)</span>
          <span className="text-xl font-extrabold text-ocean-deep">{metrics.volumeBarrels.toLocaleString()} bbl</span>
          <span className="text-[9px] text-text-muted block">~42 US gal/bbl</span>
        </div>
        <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Net Volume (m³)</span>
          <span className="text-xl font-extrabold text-ocean-navy">{metrics.surfaceVolumeM3.toLocaleString()} m³</span>
          <span className="text-[9px] text-text-muted block">Post-weathering remaining</span>
        </div>
        <div className="p-3 bg-ocean-light/60 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted uppercase block">Weathering Dispersion</span>
          <span className="text-xl font-extrabold text-amber-600">-{weatheringLossPct}%</span>
          <span className="text-[9px] text-text-muted block">Evap + emulsification</span>
        </div>
      </div>

      {/* Visual Composition Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
          <span>Slick Thickness Distribution across {spillAreaKm2 || 14.7} km²</span>
          <span>Bonn Code 1 to 5</span>
        </div>
        <div className="h-4 w-full rounded-full overflow-hidden flex border border-border-marine">
          <div style={{ width: `${distribution.t1}%` }} className="bg-slate-300" title={`Code 1 Sheen: ${distribution.t1}%`} />
          <div style={{ width: `${distribution.t2}%` }} className="bg-indigo-400" title={`Code 2 Rainbow: ${distribution.t2}%`} />
          <div style={{ width: `${distribution.t3}%` }} className="bg-amber-400" title={`Code 3 Metallic: ${distribution.t3}%`} />
          <div style={{ width: `${distribution.t4}%` }} className="bg-amber-700" title={`Code 4 True Oil: ${distribution.t4}%`} />
          <div style={{ width: `${distribution.t5}%` }} className="bg-stone-900" title={`Code 5 Heavy Crude: ${distribution.t5}%`} />
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-700 font-bold">Code 4+5 (Heavy Oil Core & Emulsion)</span>
            <span className="text-status-danger font-bold">{distribution.t4 + distribution.t5}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={distribution.t4}
            onChange={(e) => handleSliderChange('t4', e.target.value)}
            className="w-full accent-amber-700 cursor-pointer"
          />
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between text-[11px]">
            <span className="text-text-secondary font-bold">Weathering Loss (40h elapsed evaporation)</span>
            <span className="text-amber-700 font-bold">{weatheringLossPct}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            value={weatheringLossPct}
            onChange={(e) => setWeatheringLossPct(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

