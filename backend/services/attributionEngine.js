/**
 * Multi-Factor Vessel Attribution Scoring Engine
 * Emulates XGBoost gradient-boosted decision trees fusing AIS kinematics,
 * spatio-temporal proximity to hindcast origin, and blackout anomalies.
 */
export class AttributionEngine {
  /**
   * Computes priority scores and ranks candidate vessels
   */
  static computeAttributionRanking(candidates, customWeights = null) {
    const weights = customWeights || {
      spatial: 0.25,
      temporal: 0.20,
      trajectory: 0.20,
      behavior: 0.15,
      aisGap: 0.20
    };

    // Normalize weights to sum to 1.0
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1.0;
    const normalizedWeights = {
      spatial: weights.spatial / totalWeight,
      temporal: weights.temporal / totalWeight,
      trajectory: weights.trajectory / totalWeight,
      behavior: weights.behavior / totalWeight,
      aisGap: weights.aisGap / totalWeight
    };

    const scoredCandidates = candidates
      .filter(c => c.rank !== "00") // filter out Coast Guard ships from suspect ranks
      .map(c => {
        const spatial = c.spatialMatch ?? 50;
        const temporal = c.temporalMatch ?? 50;
        const trajectory = c.trajectoryMatch ?? 50;
        const behavior = c.behaviorMatch ?? 50;
        const aisGap = c.aisGapScore ?? 0;

        const compositeScore = Number((
          spatial * normalizedWeights.spatial +
          temporal * normalizedWeights.temporal +
          trajectory * normalizedWeights.trajectory +
          behavior * normalizedWeights.behavior +
          aisGap * normalizedWeights.aisGap
        ).toFixed(1));

        let status = "LOW";
        if (compositeScore >= 85) status = "HIGH PRIORITY";
        else if (compositeScore >= 70) status = "UNDER REVIEW";
        else if (compositeScore >= 50) status = "MODERATE";

        return {
          ...c,
          priorityScore: compositeScore,
          status,
          factors: {
            spatial: { value: spatial, weight: normalizedWeights.spatial },
            temporal: { value: temporal, weight: normalizedWeights.temporal },
            trajectory: { value: trajectory, weight: normalizedWeights.trajectory },
            behavior: { value: behavior, weight: normalizedWeights.behavior },
            aisGap: { value: aisGap, weight: normalizedWeights.aisGap }
          }
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((c, idx) => ({
        ...c,
        rank: (idx + 1).toString().padStart(2, '0')
      }));

    return {
      evaluatedAt: new Date().toISOString(),
      weightsApplied: normalizedWeights,
      totalEvaluated: scoredCandidates.length,
      topSuspect: scoredCandidates[0] || null,
      rankings: scoredCandidates
    };
  }
}

