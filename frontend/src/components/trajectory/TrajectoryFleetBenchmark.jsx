import React from 'react';
import { BarChart2, TrendingUp, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FLEET_BENCHMARK } from './trajectoryData';

export default function TrajectoryFleetBenchmark() {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Sister Vessel & Historical Fleet Behavioral Benchmark (12-Mo Baseline)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-danger font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          ● OUTLIER Z-SCORE: {FLEET_BENCHMARK.zScore}σ
        </span>
      </div>

      {/* 4 Quantitative Benchmark Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">CORRIDOR SAMPLE POOL</span>
          <span className="text-xl font-bold text-ocean-navy mt-0.5 block">{FLEET_BENCHMARK.totalVessels} Vessels</span>
          <span className="text-[9px] text-text-secondary block">Aframax / Suezmax Class</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">MEAN TRANSIT SPEED</span>
          <span className="text-xl font-bold text-ocean mt-0.5 block">{FLEET_BENCHMARK.meanSpeedKn} kn</span>
          <span className="text-[9px] text-text-secondary block">Std Dev: ±{FLEET_BENCHMARK.stdDevSpeedKn} kn</span>
        </div>

        <div className="p-3 bg-red-50/40 border border-red-100 rounded-xl">
          <span className="text-[9px] text-text-muted block">SUSPECT LOITERING SPEED</span>
          <span className="text-xl font-bold text-status-danger mt-0.5 block">{FLEET_BENCHMARK.suspectSpeedDuringBlackoutKn} kn</span>
          <span className="text-[9px] text-status-danger font-semibold block">{FLEET_BENCHMARK.percentile}</span>
        </div>

        <div className="p-3 bg-ocean-light border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">BLACKOUT INCIDENCE</span>
          <span className="text-sm font-bold text-ocean-navy mt-0.5 block">0.08% Rate</span>
          <span className="text-[9px] text-text-secondary block">1 in 1,200 voyages</span>
        </div>
      </div>

      {/* Visual Gaussian Normal Distribution Curve Representation */}
      <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-ocean uppercase block">
          Corridor Speed Distribution & Suspect Position:
        </span>

        <div className="relative h-16 w-full flex items-end">
          {/* Gaussian Bars Mock */}
          {[2, 4, 8, 16, 28, 45, 68, 92, 120, 140, 148, 130, 95, 60, 30, 12, 5, 1].map((cnt, i) => {
            const hPct = (cnt / 148) * 100;
            return (
              <div key={i} className="flex-1 px-0.5 h-full flex items-end">
                <div 
                  className="w-full bg-ocean/30 rounded-t hover:bg-ocean/50 transition-colors"
                  style={{ height: `${hPct}%` }}
                ></div>
              </div>
            );
          })}

          {/* Suspect Indicator Arrow */}
          <div className="absolute left-[8%] top-0 flex flex-col items-center">
            <span className="text-[9px] font-bold text-status-danger bg-red-50 px-1 rounded border border-red-200">
              3.8 kn (SUSPECT)
            </span>
            <div className="w-0.5 h-7 bg-status-danger"></div>
          </div>

          {/* Mean Indicator Arrow */}
          <div className="absolute left-[58%] top-0 flex flex-col items-center">
            <span className="text-[9px] font-bold text-ocean bg-white px-1 rounded border border-ocean/30">
              μ = 13.1 kn
            </span>
            <div className="w-0.5 h-7 bg-ocean"></div>
          </div>
        </div>

        <div className="flex justify-between text-[8px] text-text-muted pt-1 border-t border-border-marine/50">
          <span>0 kn</span>
          <span>4 kn</span>
          <span>8 kn</span>
          <span>12 kn</span>
          <span>16 kn</span>
          <span>20 kn</span>
        </div>
      </div>
    </div>
  );
}

