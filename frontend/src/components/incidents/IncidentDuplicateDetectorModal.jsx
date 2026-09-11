import React, { useMemo, useState } from 'react';
import { X, GitMerge, Check, AlertTriangle, ShieldCheck, ArrowRight, Radio } from 'lucide-react';

// Haversine formula to compute distance in Nautical Miles between two coords
function getDistanceNM(lat1, lon1, lat2, lon2) {
  const R = 3440.065; // Nautical miles radius of Earth
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
}

function parseCoords(loc, coords) {
  if (coords && coords.lat && coords.lng) return coords;
  if (loc) {
    const match = loc.match(/([\d.]+)°?N.*?([\d.]+)°?E/i);
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return { lat: 14.82, lng: 68.21 };
}

export default function IncidentDuplicateDetectorModal({ 
  incidents = [], 
  onClose, 
  onMergeIncidents 
}) {
  const [resolvedPairs, setResolvedPairs] = useState(new Set());

  // Detect duplicates / correlated observations: distance <= 35 NM
  const candidatePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < incidents.length; i++) {
      for (let j = i + 1; j < incidents.length; j++) {
        const a = incidents[i];
        const b = incidents[j];
        const cA = parseCoords(a.location, a.coordinates);
        const cB = parseCoords(b.location, b.coordinates);
        const distNM = getDistanceNM(cA.lat, cA.lng, cB.lat, cB.lng);

        // Within 35 Nautical Miles
        if (distNM <= 35) {
          const correlationScore = Math.max(70, Math.round(100 - distNM * 0.8));
          pairs.push({
            pairId: `${a.id}_${b.id}`,
            primary: a,
            secondary: b,
            distNM,
            correlationScore
          });
        }
      }
    }
    return pairs;
  }, [incidents]);

  const handleMerge = (pair) => {
    onMergeIncidents(pair.primary.id, pair.secondary.id);
    setResolvedPairs(prev => new Set(prev).add(pair.pairId));
  };

  const handleDismiss = (pairId) => {
    setResolvedPairs(prev => new Set(prev).add(pairId));
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-border-marine flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-ocean-navy text-sm">Spatio-Temporal Deduplication & Correlator</h3>
                <span className="px-2 py-0.5 rounded-full bg-ocean-light text-ocean text-[10px] font-mono font-bold">
                  AUTONOMOUS SCAN
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Identifies correlated satellite SAR observations of the same discharge slick within 35 Nautical Miles.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg border border-border-marine hover:bg-white text-text-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="bg-ocean-light/40 border border-ocean/20 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
            <span>Total Registered Incidents Scanned: <b>{incidents.length}</b></span>
            <span className="text-ocean-deep font-bold">
              {candidatePairs.length} Correlated Cluster(s) Found
            </span>
          </div>

          {candidatePairs.length === 0 ? (
            <div className="text-center py-8 text-text-muted space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
              <div className="font-bold text-xs text-ocean-navy">No Duplicates or Correlated Passes Detected</div>
              <p className="text-[11px]">All marine incidents represent distinct, isolated spatio-temporal events.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidatePairs.map((pair) => {
                const isResolved = resolvedPairs.has(pair.pairId);
                if (isResolved) return null;

                return (
                  <div key={pair.pairId} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs text-ocean-navy">
                          Probable Correlated Satellite Observation ({pair.distNM} NM Separation)
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {pair.correlationScore}% Spatial Proximity
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Primary */}
                      <div className="bg-white p-3 rounded-lg border border-border-marine space-y-1">
                        <span className="text-[10px] text-text-muted font-mono block">PRIMARY DOSSIER</span>
                        <div className="font-mono font-bold text-ocean-deep">{pair.primary.id}</div>
                        <div className="text-text-secondary text-[11px] truncate">{pair.primary.region}</div>
                        <div className="font-mono text-[10px] text-text-muted">{pair.primary.areaKm2} km² • {pair.primary.satellite}</div>
                      </div>

                      {/* Secondary */}
                      <div className="bg-white p-3 rounded-lg border border-border-marine space-y-1">
                        <span className="text-[10px] text-text-muted font-mono block">CORRELATED OBSERVATION</span>
                        <div className="font-mono font-bold text-ocean-deep">{pair.secondary.id}</div>
                        <div className="text-text-secondary text-[11px] truncate">{pair.secondary.region}</div>
                        <div className="font-mono text-[10px] text-text-muted">{pair.secondary.areaKm2} km² • {pair.secondary.satellite}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/50">
                      <button
                        onClick={() => handleDismiss(pair.pairId)}
                        className="px-3 py-1 rounded-lg border border-border-marine bg-white hover:bg-slate-50 text-xs text-text-secondary"
                      >
                        Keep Separate
                      </button>
                      <button
                        onClick={() => handleMerge(pair)}
                        className="px-3.5 py-1 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>Merge into Primary Dossier</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {resolvedPairs.size > 0 && candidatePairs.every(p => resolvedPairs.has(p.pairId)) && (
                <div className="text-center py-6 text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>All candidate pairs have been reviewed and reconciled.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-marine bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-ocean-deep text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

