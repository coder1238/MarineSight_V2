import React, { useState, useMemo } from 'react';
import { X, Sliders, Award, RotateCcw, TrendingUp, Ship, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function WorkspaceMCDAModal({ caseData, onClose }) {
  // MCDA Criteria Weights (Default sum to 100%)
  const [weights, setWeights] = useState({
    blackout: 30,      // AIS blackout gap duration
    speedDrop: 25,     // SOG kinematic deceleration anomaly
    distanceOrigin: 20,// Proximity to hindcast Origin Zone A
    pscHistory: 15,    // Prior MARPOL Annex I deficiencies
    flagRisk: 10       // Flag of Convenience / High-risk registry
  });

  const resetWeights = () => {
    setWeights({
      blackout: 30,
      speedDrop: 25,
      distanceOrigin: 20,
      pscHistory: 15,
      flagRisk: 10
    });
  };

  const handleWeightChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: Number(val) }));
  };

  // Base raw scores for candidate vessels
  const candidateFleet = useMemo(() => {
    return (caseData.candidateVessels || [
      caseData.topVessel,
      { name: "MT Sea Sovereign", mmsi: "538009821", imo: "9451234", type: "Chemical Tanker", flag: "Panama 🇵🇦", speedKn: 14.1, gapDuration: "12 min", cpaNm: "3.8", priorityScore: 68.2 },
      { name: "MV Nord Atlantic", mmsi: "211456789", imo: "9312345", type: "Bulk Carrier", flag: "Liberia 🇱🇷", speedKn: 11.8, gapDuration: "None", cpaNm: "5.2", priorityScore: 42.1 },
      { name: "MT Coastal Pioneer", mmsi: "419002341", imo: "9567890", type: "Bunker Barge", flag: "India 🇮🇳", speedKn: 8.4, gapDuration: "4 min", cpaNm: "7.1", priorityScore: 31.5 }
    ]).map((v, i) => {
      // Raw scores 0 - 100 for each criteria
      let rawBlackout = v.gapDuration && v.gapDuration !== 'None' ? (parseInt(v.gapDuration) > 30 ? 95 : 65) : 10;
      let rawSpeed = v.mmsi === caseData.topVessel?.mmsi ? 92 : (v.speedKn < 10 ? 60 : 25);
      let rawDistance = Math.max(10, Math.round(100 - (parseFloat(v.cpaNm || 4) * 15)));
      let rawPsc = v.flag?.includes('Panama') || v.flag?.includes('Liberia') ? 75 : (v.mmsi === caseData.topVessel?.mmsi ? 85 : 20);
      let rawFlag = v.flag?.includes('Panama') || v.flag?.includes('Liberia') ? 80 : 30;

      return {
        ...v,
        rawBlackout,
        rawSpeed,
        rawDistance,
        rawPsc,
        rawFlag,
        originalRank: i + 1
      };
    });
  }, [caseData]);

  // Recalculate weighted scores and rank
  const rankedFleet = useMemo(() => {
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;

    const scored = candidateFleet.map(v => {
      const weightedScore = +(
        (v.rawBlackout * weights.blackout +
         v.rawSpeed * weights.speedDrop +
         v.rawDistance * weights.distanceOrigin +
         v.rawPsc * weights.pscHistory +
         v.rawFlag * weights.flagRisk) / totalWeight
      ).toFixed(1);

      return {
        ...v,
        calculatedScore: weightedScore
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.calculatedScore - a.calculatedScore);

    return scored.map((v, idx) => ({
      ...v,
      newRank: idx + 1,
      rankDelta: v.originalRank - (idx + 1)
    }));
  }, [candidateFleet, weights]);

  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Multi-Criteria Decision Analysis (MCDA) Attribution Engine
              </h3>
              <p className="text-xs text-text-secondary">
                Adjust forensic weighting factors to dynamically re-evaluate and stress-test suspect vessel ranking.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Sliders Box */}
          <div className="bg-slate-50 border border-border-marine rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-ocean-navy uppercase">
                CRITERIA WEIGHT CONFIGURATION
              </span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold ${totalWeightSum === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  Sum: {totalWeightSum}% {totalWeightSum !== 100 && '(Normalized automatically)'}
                </span>
                <button
                  onClick={resetWeights}
                  className="text-xs text-ocean hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-white border border-border-marine rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-ocean-navy">
                  <span>AIS Blackout Gap:</span>
                  <span className="text-purple-600">{weights.blackout}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.blackout}
                  onChange={e => handleWeightChange('blackout', e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-white border border-border-marine rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-ocean-navy">
                  <span>Kinematic Speed Drop:</span>
                  <span className="text-purple-600">{weights.speedDrop}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.speedDrop}
                  onChange={e => handleWeightChange('speedDrop', e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-white border border-border-marine rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-ocean-navy">
                  <span>Distance to Hindcast Origin:</span>
                  <span className="text-purple-600">{weights.distanceOrigin}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.distanceOrigin}
                  onChange={e => handleWeightChange('distanceOrigin', e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-white border border-border-marine rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-ocean-navy">
                  <span>Prior PSC Deficiencies:</span>
                  <span className="text-purple-600">{weights.pscHistory}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.pscHistory}
                  onChange={e => handleWeightChange('pscHistory', e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="p-2.5 bg-white border border-border-marine rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-ocean-navy">
                  <span>Flag of Convenience Risk:</span>
                  <span className="text-purple-600">{weights.flagRisk}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={weights.flagRisk}
                  onChange={e => handleWeightChange('flagRisk', e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Ranked Results Table */}
          <div className="border border-border-marine rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-ocean-navy text-white p-3 flex items-center justify-between text-xs font-mono">
              <span className="font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>DYNAMIC RE-RANKED ATTRIBUTION CORRIDOR</span>
              </span>
              <span className="text-slate-300 text-[11px]">
                Target: {rankedFleet[0]?.name} is Rank #1
              </span>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 border-b border-border-marine text-[10px] text-text-muted uppercase">
                <tr>
                  <th className="px-3 py-2.5">RANK</th>
                  <th className="px-3 py-2.5">VESSEL</th>
                  <th className="px-3 py-2.5">FLAG</th>
                  <th className="px-3 py-2.5">RAW BLACKOUT</th>
                  <th className="px-3 py-2.5">RAW SOG DROP</th>
                  <th className="px-3 py-2.5">HINDCAST PROX</th>
                  <th className="px-3 py-2.5">MCDA SCORE</th>
                  <th className="px-3 py-2.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60">
                {rankedFleet.map((v) => {
                  const isTop = v.newRank === 1;
                  return (
                    <tr key={v.mmsi || v.name} className={isTop ? 'bg-red-50/70 font-semibold' : 'hover:bg-slate-50'}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isTop ? 'bg-status-danger text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            #{v.newRank}
                          </span>
                          {v.rankDelta !== 0 && (
                            <span className={`text-[10px] font-bold ${v.rankDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {v.rankDelta > 0 ? `▲+${v.rankDelta}` : `▼${v.rankDelta}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-sans">
                        <strong className="text-ocean-navy text-xs block">{v.name}</strong>
                        <span className="text-[10px] text-text-muted font-mono">MMSI: {v.mmsi}</span>
                      </td>
                      <td className="px-3 py-3 font-sans text-text-secondary">{v.flag}</td>
                      <td className="px-3 py-3">{v.rawBlackout} / 100</td>
                      <td className="px-3 py-3">{v.rawSpeed} / 100</td>
                      <td className="px-3 py-3">{v.rawDistance} / 100</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <strong className={`text-xs ${isTop ? 'text-status-danger' : 'text-ocean-deep'}`}>
                            {v.calculatedScore}%
                          </strong>
                          <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isTop ? 'bg-red-500' : 'bg-ocean'}`}
                              style={{ width: `${v.calculatedScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-sans">
                        {isTop ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold text-[10px]">
                            PRIMARY SUSPECT
                          </span>
                        ) : (
                          <span className="text-text-muted text-[10px]">Secondary</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-text-muted font-mono">
            MCDA Algorithm: Weighted Linear Combination (WLC) with normalized criteria scaling.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

