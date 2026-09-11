import React from 'react';
import { X, ArrowRight, Check, AlertTriangle, ShieldAlert, Satellite, Ship, Compass, Waves, DollarSign, Download } from 'lucide-react';

export default function IncidentCompareModal({ 
  incidents = [], 
  onClose, 
  onSelectIncident, 
  onNavigate 
}) {
  if (!incidents || incidents.length === 0) return null;

  // Comparison metrics rows
  const getVolumeEst = (areaKm2) => {
    // Average 15 micron slick thickness => ~15 m3 per km2 => ~94 barrels per km2
    const volM3 = ((areaKm2 || 10) * 15).toFixed(1);
    const barrels = Math.round(volM3 * 6.2898);
    return `${barrels.toLocaleString()} bbl (${volM3} m³)`;
  };

  const getCostEst = (areaKm2) => {
    // ITOPF cost index ~$4,500 per metric ton
    const tons = (areaKm2 || 10) * 13;
    const cost = Math.round(tons * 4500);
    return `$${(cost / 1000).toFixed(0)}k USD`;
  };

  const getTier = (areaKm2) => {
    if ((areaKm2 || 0) > 15) return "Tier 3 (National Disaster / NOS-DCP)";
    if ((areaKm2 || 0) > 5) return "Tier 2 (Regional Response / Coast Guard)";
    return "Tier 1 (Port / Local Facility)";
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-border-marine overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-ocean-navy">
                  Comparative Maritime Forensic Matrix
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-ocean-light text-ocean text-[10px] font-mono font-bold">
                  {incidents.length} CASES COMPARED
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Side-by-side analytical assessment of hydrocarbon discharges, satellite SAR telemetry, and attribution targets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border-marine hover:bg-white text-text-muted hover:text-ocean-navy transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border-marine">
                <th className="py-3 px-4 font-mono text-[10px] uppercase text-text-muted w-1/4">Forensic Parameter</th>
                {incidents.map((inc) => (
                  <th key={inc.id} className="py-3 px-4 w-1/3">
                    <div className="font-mono font-black text-sm text-ocean-deep flex items-center gap-1.5">
                      <span>{inc.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                        (inc.risk || inc.riskLevel) === 'CRITICAL' 
                          ? 'bg-red-50 text-status-danger border-red-200' 
                          : 'bg-amber-50 text-status-warning border-amber-200'
                      }`}>
                        {inc.risk || inc.riskLevel || 'HIGH'}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-muted font-normal mt-0.5 truncate max-w-[200px]">
                      {inc.region}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-marine/50">
              {/* Region & Time */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Detection Timestamp</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-ocean-navy">
                    {inc.time || inc.detectionTimeUTC || '05 SEP 2026, 14:32 UTC'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Coordinates & Flag</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-ocean-navy">
                    {inc.flagEmoji || "🇮🇳"} {inc.location || (inc.coordinates ? `${inc.coordinates.lat}°N, ${inc.coordinates.lng}°E` : '14.82°N, 68.21°E')}
                  </td>
                ))}
              </tr>

              {/* Surface Geometry */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Estimated Slick Area</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-ocean-deep font-bold text-sm">
                    {inc.areaKm2 || inc.spillAreaKm2 || 0} km²
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Slick Perimeter</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-ocean-navy">
                    {inc.perimeterKm || inc.spillPerimeterKm || 18.2} km
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Est. Hydrocarbon Volume</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-amber-700 font-semibold">
                    {getVolumeEst(inc.areaKm2 || inc.spillAreaKm2)}
                  </td>
                ))}
              </tr>

              {/* AI & Detection Sensor */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">AI Confidence Score</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-status-success font-bold">
                    {inc.confidence || inc.detectionConfidence || 95}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Earth Observation Sensor</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 text-ocean-navy font-medium">
                    <span className="flex items-center gap-1">
                      <Satellite className="w-3.5 h-3.5 text-ocean" />
                      {inc.satellite || 'Sentinel-1 SAR C-Band'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Vessel Intelligence */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">AIS Candidate Vessels</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono text-ocean-navy">
                    {inc.vesselsCount || inc.candidateCount || 4} vessels in corridor
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Lead Suspect Vessel</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 text-status-danger font-bold">
                    <span className="flex items-center gap-1">
                      <Ship className="w-3.5 h-3.5" />
                      {inc.topCandidate || inc.topVessel?.name || 'MV Ocean Star'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Environmental Response */}
              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Response Classification</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 text-ocean-navy font-mono text-[11px]">
                    {getTier(inc.areaKm2 || inc.spillAreaKm2)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-2.5 px-4 font-semibold text-text-secondary bg-slate-50/60">Est. Cleanup Liability</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-2.5 px-4 font-mono font-bold text-slate-700">
                    {getCostEst(inc.areaKm2 || inc.spillAreaKm2)}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="py-3 px-4 font-semibold text-text-secondary bg-slate-50/60">Direct Case Action</td>
                {incidents.map((inc) => (
                  <td key={inc.id} className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectIncident(inc.id);
                          onClose();
                          onNavigate("live-monitor");
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs shadow-xs"
                      >
                        Live GIS
                      </button>
                      <button
                        onClick={() => {
                          onSelectIncident(inc.id);
                          onClose();
                          onNavigate("workspace");
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-border-marine hover:bg-ocean-sky text-ocean-navy font-bold text-xs"
                      >
                        Workspace →
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-marine bg-slate-50 flex items-center justify-between text-xs text-text-muted font-mono">
          <span>Comparative calculations grounded on ITOPF technical papers & Bonn Agreement standards.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean-deep text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

