import React, { useState } from 'react';
import { Compass, Navigation, Shield, Anchor, AlertTriangle, ArrowRight, Zap, Flag } from 'lucide-react';

export const FORECAST_HORIZONS = [
  { id: "15m", label: "T+15m", prob: 98.4, lat: 14.656, lng: 68.961, speedKn: 13.5, heading: 286, coneWidthNm: 0.12 },
  { id: "30m", label: "T+30m", prob: 94.1, lat: 14.612, lng: 69.177, speedKn: 13.5, heading: 286, coneWidthNm: 0.28 },
  { id: "1h",  label: "T+1h",  prob: 89.5, lat: 14.524, lng: 69.609, speedKn: 13.4, heading: 287, coneWidthNm: 0.65 },
  { id: "2h",  label: "T+2h",  prob: 82.3, lat: 14.348, lng: 70.473, speedKn: 13.4, heading: 287, coneWidthNm: 1.40 },
  { id: "6h",  label: "T+6h",  prob: 71.0, lat: 13.644, lng: 73.929, speedKn: 13.2, heading: 288, coneWidthNm: 3.80 },
  { id: "12h", label: "T+12h", prob: 59.2, lat: 12.588, lng: 79.113, speedKn: 13.0, heading: 290, coneWidthNm: 8.50 }
];

export const SCENARIOS = [
  { id: "nominal", name: "Nominal Channel Course", desc: "Maintains standard transit corridor toward Vadinar", modifier: "1.0x" },
  { id: "evasive", name: "Evasive High-Speed Dash", desc: "Max throttle 15.5 kn to clear Indian EEZ", modifier: "1.25x speed" },
  { id: "drifting", name: "Dead Ship Unpowered Drift", desc: "Main engine shut down; drifting with 0.42 m/s current", modifier: "0.8 kn drift" },
  { id: "international", name: "Breakout to High Seas", desc: "Sharp turn west 260° to exit Indian jurisdiction", modifier: "Course 260°" }
];

export default function TrajectoryForecastSimulator({ onSelectHorizon }) {
  const [selectedHorizonId, setSelectedHorizonId] = useState("1h");
  const [selectedScenarioId, setSelectedScenarioId] = useState("nominal");

  const currentHorizon = FORECAST_HORIZONS.find(h => h.id === selectedHorizonId) || FORECAST_HORIZONS[2];
  const currentScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleSelect = (id) => {
    setSelectedHorizonId(id);
    if (onSelectHorizon) onSelectHorizon(id);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Multi-Horizon Trajectory Predictor & Kinematic Forecast Simulator
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-success font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          ● RNN AUTO-REGRESSIVE ENGINE
        </span>
      </div>

      {/* Prediction Horizon Selector */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 font-mono">
        {FORECAST_HORIZONS.map((h) => {
          const isSelected = h.id === selectedHorizonId;
          return (
            <button
              key={h.id}
              onClick={() => handleSelect(h.id)}
              className={`p-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-ocean text-white border-ocean shadow-marine-sm ring-1 ring-ocean/40'
                  : 'bg-ocean-light/60 border-border-marine text-ocean-navy hover:bg-white hover:border-ocean/40'
              }`}
            >
              <span className="text-[11px] font-bold block">{h.label}</span>
              <span className={`text-[9px] block ${isSelected ? 'text-ocean-sky' : 'text-text-muted'}`}>
                {h.prob}% Conf.
              </span>
            </button>
          );
        })}
      </div>

      {/* Scenario Mode Switcher */}
      <div className="p-3 bg-ocean-light rounded-xl border border-border-marine space-y-2 font-mono text-xs">
        <span className="text-[10px] font-bold text-ocean-navy uppercase block">
          Strategic Navigation Scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-ocean shadow-xs ring-1 ring-ocean/30'
                    : 'bg-white/60 border-border-marine hover:bg-white hover:border-ocean/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-ocean-navy">{sc.name}</span>
                  <span className="text-[9px] text-ocean bg-ocean-sky px-1.5 py-0.2 rounded font-bold">
                    {sc.modifier}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary mt-0.5 font-sans leading-tight">
                  {sc.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projected Interception & EEZ Boundaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
        <div className="p-2.5 bg-white border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">PROJECTED COORD ({currentHorizon.label})</span>
          <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">
            {currentHorizon.lat.toFixed(3)}°N, {currentHorizon.lng.toFixed(3)}°E
          </span>
          <span className="text-[9px] text-ocean block mt-0.5">
            Uncertainty Cone: ±{currentHorizon.coneWidthNm} nm
          </span>
        </div>

        <div className="p-2.5 bg-white border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">ETA TO 200nm EEZ EXIT</span>
          <span className="font-bold text-status-warning text-[11px] block mt-0.5">
            T+8h 45m (07:15 UTC)
          </span>
          <span className="text-[9px] text-text-muted block mt-0.5">
            Distance to High Seas: 114 nm
          </span>
        </div>

        <div className="p-2.5 bg-white border border-border-marine rounded-xl">
          <span className="text-[9px] text-text-muted block">NEAREST PORT OF REFUGE</span>
          <span className="font-bold text-ocean text-[11px] block mt-0.5">
            Mormugao Port (Goa)
          </span>
          <span className="text-[9px] text-text-muted block mt-0.5">
            Bearing 092° · Range 64.2 nm
          </span>
        </div>
      </div>
    </div>
  );
}

