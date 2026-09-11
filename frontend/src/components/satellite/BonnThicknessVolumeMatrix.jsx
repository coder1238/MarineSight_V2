import React, { useState, useMemo } from 'react';
import { Droplet, BarChart2, Info, CheckCircle, Calculator } from 'lucide-react';

export const BONN_CODES = [
  { code: 1, name: "Sheen (Silver/Grey)", minThickUm: 0.04, maxThickUm: 0.10, defaultThickUm: 0.07, color: "#94A3B8", text: "text-slate-500", desc: "Barely visible silvery sheen under reflection" },
  { code: 2, name: "Rainbow Sheen", minThickUm: 0.10, maxThickUm: 5.00, defaultThickUm: 0.30, color: "#F59E0B", text: "text-amber-500", desc: "Prismatic color bands caused by thin film light interference" },
  { code: 3, name: "Metallic Sheen", minThickUm: 5.00, maxThickUm: 50.00, defaultThickUm: 15.0, color: "#0284C7", text: "text-sky-600", desc: "Reflects true color of sea with dull metallic cast" },
  { code: 4, name: "Discontinuous True Oil", minThickUm: 50.00, maxThickUm: 200.00, defaultThickUm: 100.0, color: "#B91C1C", text: "text-rose-700", desc: "Dark brown/black patches broken by thin metallic sheen" },
  { code: 5, name: "Continuous Heavy Emulsion", minThickUm: 200.00, maxThickUm: 1000.00, defaultThickUm: 350.0, color: "#1E1B4B", text: "text-indigo-950", desc: "Chocolate mousse viscous emulsion layer >200 µm" }
];

export default function BonnThicknessVolumeMatrix({
  totalAreaKm2 = 14.7,
  oilDensityGcm3 = 0.88 // Heavy crude specific gravity
}) {
  // Area percentages for each code (defaults to typical spreading profile)
  const [coverageShares, setCoverageShares] = useState({
    1: 45, // Sheen covers 45% of area
    2: 30, // Rainbow covers 30%
    3: 15, // Metallic covers 15%
    4: 7,  // Discontinuous covers 7%
    5: 3   // Heavy emulsion covers 3%
  });

  const handleShareChange = (code, val) => {
    setCoverageShares(prev => ({
      ...prev,
      [code]: Math.max(0, Math.min(100, val))
    }));
  };

  // Calculations per Bonn Agreement standard volumetric formula:
  // Volume (m^3) = Area (m^2) * Thickness (m)
  // 1 km^2 = 1,000,000 m^2; 1 µm = 10^-6 m
  // So Area (km^2) * Thickness (µm) = Volume (m^3)! Exactly 1:1!
  const calculations = useMemo(() => {
    let totalVolumeM3 = 0;
    const tierBreakdown = BONN_CODES.map((tier) => {
      const sharePct = coverageShares[tier.code] || 0;
      const tierAreaKm2 = (totalAreaKm2 * (sharePct / 100));
      const volumeM3 = tierAreaKm2 * tier.defaultThickUm;
      totalVolumeM3 += volumeM3;
      const metricTons = volumeM3 * oilDensityGcm3;
      const barrels = volumeM3 * 6.2898;

      return {
        ...tier,
        sharePct,
        tierAreaKm2: +tierAreaKm2.toFixed(2),
        volumeM3: +volumeM3.toFixed(1),
        metricTons: +metricTons.toFixed(1),
        barrels: Math.round(barrels)
      };
    });

    const totalTons = +(totalVolumeM3 * oilDensityGcm3).toFixed(1);
    const totalBarrels = Math.round(totalVolumeM3 * 6.2898);

    return {
      tierBreakdown,
      totalVolumeM3: +totalVolumeM3.toFixed(1),
      totalTons,
      totalBarrels
    };
  }, [totalAreaKm2, coverageShares, oilDensityGcm3]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Droplet className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 5 · Bonn Agreement Thickness & Volume Estimator
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean-navy px-2 py-0.5 rounded font-bold border border-border-marine">
          Bonn Code (BAOAC 2012)
        </span>
      </div>

      {/* High-Level Volumetric Totals */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">TOTAL ESTIMATED VOLUME</span>
          <span className="text-base font-bold text-ocean">{calculations.totalVolumeM3.toLocaleString()} m&sup3;</span>
        </div>
        <div className="p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">MASS EQUIVALENT</span>
          <span className="text-base font-bold text-ocean-navy">{calculations.totalTons.toLocaleString()} Metric Tons</span>
        </div>
        <div className="p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">CRUDE BARRELS (bbl)</span>
          <span className="text-base font-bold text-status-warning">{calculations.totalBarrels.toLocaleString()} bbl</span>
        </div>
      </div>

      {/* Layer Stack Horizontal Visualizer */}
      <div className="space-y-1">
        <div className="text-[10px] text-text-muted flex justify-between">
          <span>SURFACE AREA DISTRIBUTION BY BONN CODE</span>
          <span>Total Delineated: {totalAreaKm2} km&sup2;</span>
        </div>
        <div className="h-4 w-full rounded-lg overflow-hidden flex border border-border-marine">
          {calculations.tierBreakdown.map((t) => (
            <div
              key={t.code}
              style={{ width: `${t.sharePct}%`, backgroundColor: t.color }}
              title={`Bonn ${t.code}: ${t.sharePct}% (${t.tierAreaKm2} km²)`}
              className="h-full transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Interactive 5-Tier Bonn Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border-marine text-[10px] text-text-muted">
              <th className="pb-1">BONN TIER</th>
              <th className="pb-1">THICKNESS</th>
              <th className="pb-1 text-center">COVERAGE %</th>
              <th className="pb-1 text-right">AREA (km&sup2;)</th>
              <th className="pb-1 text-right">VOLUME (m&sup3;)</th>
              <th className="pb-1 text-right">BARRELS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/40 text-[11px]">
            {calculations.tierBreakdown.map((t) => (
              <tr key={t.code} className="hover:bg-ocean-light/30 transition-colors">
                <td className="py-1.5 flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="truncate">{t.name}</span>
                </td>
                <td className="py-1.5 text-text-secondary">{t.defaultThickUm} &micro;m</td>
                <td className="py-1.5 text-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={t.sharePct}
                    onChange={(e) => handleShareChange(t.code, parseInt(e.target.value) || 0)}
                    className="w-12 text-center py-0.5 rounded border border-border-marine bg-white text-ocean-navy font-bold text-xs"
                  />
                  <span className="text-[10px] text-text-muted ml-0.5">%</span>
                </td>
                <td className="py-1.5 text-right font-semibold">{t.tierAreaKm2}</td>
                <td className="py-1.5 text-right font-bold text-ocean">{t.volumeM3.toLocaleString()}</td>
                <td className="py-1.5 text-right text-text-primary font-semibold">{t.barrels.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

