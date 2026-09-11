import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sliders, 
  RotateCcw, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Award, 
  Info,
  Sparkles
} from 'lucide-react';

const PRESETS = [
  {
    name: "Default Forensic (XGBoost)",
    desc: "Calibrated balance based on 500+ historical MARPOL spills",
    weights: { spatial: 25, temporal: 20, trajectory: 25, gap: 20, risk: 10 }
  },
  {
    name: "Dark Vessel Bias (Anti-Spoofing)",
    desc: "Prioritizes deliberate transponder silence and dead reckoning gaps",
    weights: { spatial: 15, temporal: 15, trajectory: 15, gap: 40, risk: 15 }
  },
  {
    name: "Trajectory-First (DTW Dominant)",
    desc: "Focuses on Siamese curve and hydrodynamic drift reversal match",
    weights: { spatial: 15, temporal: 10, trajectory: 45, gap: 15, risk: 15 }
  },
  {
    name: "Strict Proximity (CPA Bias)",
    desc: "Heavily penalizes closest point of approach within origin buffer",
    weights: { spatial: 45, temporal: 25, trajectory: 10, gap: 10, risk: 10 }
  }
];

export default function MCDASimulatorModal({
  isOpen,
  onClose,
  candidateList,
  currentWeights,
  onApplyWeights
}) {
  const [weights, setWeights] = useState(currentWeights || {
    spatial: 25,
    temporal: 20,
    trajectory: 25,
    gap: 20,
    risk: 10
  });

  if (!isOpen) return null;

  const totalWeight = weights.spatial + weights.temporal + weights.trajectory + weights.gap + weights.risk;

  // Calculate dynamic scores and re-ranking
  const reRankedCandidates = useMemo(() => {
    if (!candidateList || candidateList.length === 0) return [];
    
    // Normalize weights to sum to 1
    const norm = totalWeight > 0 ? totalWeight : 100;
    const wS = weights.spatial / norm;
    const wT = weights.temporal / norm;
    const wTr = weights.trajectory / norm;
    const wG = weights.gap / norm;
    const wR = weights.risk / norm;

    const scored = candidateList.map((c) => {
      const spatialScore = c.spatialMatch || 80;
      const temporalScore = c.temporalMatch || 75;
      const trajectoryScore = c.trajectoryMatch || 70;
      const gapScore = c.aisGapScore || 50;
      const riskScore = c.behaviorMatch || 65;

      const dynamicScore = Number(
        (spatialScore * wS + temporalScore * wT + trajectoryScore * wTr + gapScore * wG + riskScore * wR).toFixed(1)
      );

      const baselineScore = Number(c.priorityScore || 50);
      const delta = Number((dynamicScore - baselineScore).toFixed(1));

      return {
        ...c,
        dynamicScore,
        delta
      };
    });

    // Sort descending by dynamicScore
    scored.sort((a, b) => b.dynamicScore - a.dynamicScore);

    return scored.map((item, idx) => ({
      ...item,
      newRank: String(idx + 1).padStart(2, '0'),
      rankDiff: (parseInt(item.rank, 10) || 1) - (idx + 1)
    }));
  }, [candidateList, weights, totalWeight]);

  const handleSliderChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: Number(val) }));
  };

  const applyPreset = (preset) => {
    setWeights(preset.weights);
  };

  const handleApply = () => {
    if (onApplyWeights) {
      onApplyWeights(weights, reRankedCandidates);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-border-marine max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-marine bg-ocean-light/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-ocean-navy">
                  Multi-Criteria Decision Analysis (MCDA) Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-ocean/10 text-ocean text-[10px] font-bold font-mono">
                  ANALYTICAL ENGINE
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Adjust multi-evidence weighting factors in real-time to simulate decision thresholds and identify ranking sensitivities.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-ocean-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Preset Buttons */}
          <div>
            <span className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider block mb-2">
              QUICK STRATEGIC PRESETS:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="text-left p-3 rounded-xl border border-border-marine hover:border-ocean hover:bg-ocean-sky/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ocean-navy group-hover:text-ocean">
                      {p.name}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-ocean opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 leading-snug">
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="bg-ocean-light/40 border border-border-marine rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <span className="text-xs font-bold text-ocean-navy uppercase font-mono">
                Evidence Weight Distribution
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  totalWeight === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  Total: {totalWeight}% {totalWeight === 100 ? '✓ (Normalized)' : '(Will Auto-Normalize)'}
                </span>
                <button
                  onClick={() => setWeights({ spatial: 25, temporal: 20, trajectory: 25, gap: 20, risk: 10 })}
                  className="text-[10px] text-ocean hover:underline flex items-center gap-1 font-mono font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              {/* Spatial Slider */}
              <div className="bg-white p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">Spatial Proximity</span>
                  <span className="font-extrabold text-ocean text-sm">{weights.spatial}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.spatial}
                  onChange={(e) => handleSliderChange('spatial', e.target.value)}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">Closest Point of Approach (CPA) buffer</span>
              </div>

              {/* Temporal Slider */}
              <div className="bg-white p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">Temporal Alignment</span>
                  <span className="font-extrabold text-ocean text-sm">{weights.temporal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.temporal}
                  onChange={(e) => handleSliderChange('temporal', e.target.value)}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">Hindcast discharge release window</span>
              </div>

              {/* Trajectory Similarity Slider */}
              <div className="bg-white p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">STSN Trajectory Match</span>
                  <span className="font-extrabold text-ocean text-sm">{weights.trajectory}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.trajectory}
                  onChange={(e) => handleSliderChange('trajectory', e.target.value)}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">Dynamic Time Warping curve similarity</span>
              </div>

              {/* AIS Silence Gap Slider */}
              <div className="bg-white p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-status-danger">AIS Transponder Silence</span>
                  <span className="font-extrabold text-status-danger text-sm">{weights.gap}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.gap}
                  onChange={(e) => handleSliderChange('gap', e.target.value)}
                  className="w-full accent-status-danger cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">Dead reckoning blackout gap over origin</span>
              </div>

              {/* Risk & Infractions Slider */}
              <div className="bg-white p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-ocean-navy">Kinematic / Flag Risk</span>
                  <span className="font-extrabold text-ocean text-sm">{weights.risk}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={weights.risk}
                  onChange={(e) => handleSliderChange('risk', e.target.value)}
                  className="w-full accent-ocean cursor-pointer"
                />
                <span className="text-[10px] text-text-muted font-sans mt-1 block">Deceleration trough & PSC record</span>
              </div>
            </div>
          </div>

          {/* Dynamic Re-Ranking Live Results Table */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-ocean-navy uppercase font-mono">
                Simulated Candidate Priority Roster
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                {reRankedCandidates.length} Candidates Evaluated
              </span>
            </div>

            <div className="border border-border-marine rounded-2xl overflow-hidden shadow-marine-sm">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-ocean-light border-b border-border-marine text-[9px] text-text-muted uppercase">
                  <tr>
                    <th className="px-3 py-2.5">NEW RANK</th>
                    <th className="px-3 py-2.5">VESSEL</th>
                    <th className="px-3 py-2.5">BASE SCORE</th>
                    <th className="px-3 py-2.5">SIMULATED SCORE</th>
                    <th className="px-3 py-2.5">DELTA</th>
                    <th className="px-3 py-2.5">RANK SHIFT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-marine/60">
                  {reRankedCandidates.map((c) => (
                    <tr 
                      key={c.mmsi} 
                      className={`hover:bg-ocean-sky/20 transition-colors ${
                        c.newRank === '01' ? 'bg-red-50/50 font-semibold' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 font-bold text-ocean-navy">
                        <div className="flex items-center gap-1.5">
                          {c.newRank === '01' && <Award className="w-4 h-4 text-status-danger" />}
                          <span>#{c.newRank}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-bold text-ocean-navy">{c.name}</div>
                        <div className="text-[9px] text-text-muted">{c.type} · MMSI {c.mmsi}</div>
                      </td>
                      <td className="px-3 py-2.5 text-text-secondary">{c.priorityScore}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.dynamicScore > 80 
                            ? 'bg-status-danger text-white' 
                            : c.dynamicScore > 65 
                            ? 'bg-amber-100 text-status-warning' 
                            : 'bg-slate-100 text-text-muted'
                        }`}>
                          {c.dynamicScore}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`flex items-center gap-0.5 font-bold ${
                          c.delta > 0 ? 'text-emerald-600' : c.delta < 0 ? 'text-status-danger' : 'text-slate-400'
                        }`}>
                          {c.delta > 0 ? `+${c.delta}` : c.delta}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {c.rankDiff > 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            <TrendingUp className="w-3 h-3" /> +{c.rankDiff}
                          </span>
                        ) : c.rankDiff < 0 ? (
                          <span className="inline-flex items-center gap-0.5 text-status-danger font-bold bg-red-50 px-1.5 py-0.5 rounded">
                            <TrendingDown className="w-3 h-3" /> {c.rankDiff}
                          </span>
                        ) : (
                          <span className="text-slate-400">— Stable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-text-secondary">
            Simulated ranking applies to this session until reset.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Simulated Weights to Roster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

