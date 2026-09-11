import React, { useState, useMemo } from 'react';
import { Compass, Wind, Waves, Clock, AlertTriangle, Play, RefreshCw, Zap } from 'lucide-react';

export default function HydrodynamicCalculator({ distanceToShorelineNm = 14.2 }) {
  const [windSpeedKts, setWindSpeedKts] = useState(22); // knots
  const [currentSpeedMs, setCurrentSpeedMs] = useState(1.1); // m/s
  const [tidePhase, setTidePhase] = useState("flood"); // 'flood', 'ebb', 'slack'
  const [activeScenario, setActiveScenario] = useState("monsoon");

  // Physics calculation
  const { driftSpeedKts, ttiHours, riskTier } = useMemo(() => {
    // 3.5% wind drift factor + 100% current factor + tide modifier
    const tideFactor = tidePhase === "flood" ? 1.25 : tidePhase === "ebb" ? 0.75 : 1.0;
    const currentKts = currentSpeedMs * 1.94384; // m/s to knots
    const windComponent = windSpeedKts * 0.035;
    const totalDriftKts = (windComponent + currentKts) * tideFactor;

    const safeDriftKts = Math.max(0.1, totalDriftKts);
    const hours = distanceToShorelineNm / safeDriftKts;

    let tier = "GUARDED";
    if (hours < 8) tier = "CRITICAL";
    else if (hours < 18) tier = "HIGH";
    else if (hours < 30) tier = "MODERATE";

    return {
      driftSpeedKts: safeDriftKts.toFixed(2),
      ttiHours: hours.toFixed(1),
      riskTier: tier
    };
  }, [windSpeedKts, currentSpeedMs, tidePhase, distanceToShorelineNm]);

  const setScenarioPreset = (scenario) => {
    setActiveScenario(scenario);
    if (scenario === "monsoon") {
      setWindSpeedKts(32);
      setCurrentSpeedMs(1.6);
      setTidePhase("flood");
    } else if (scenario === "neap") {
      setWindSpeedKts(8);
      setCurrentSpeedMs(0.3);
      setTidePhase("slack");
    } else if (scenario === "cyclonic") {
      setWindSpeedKts(45);
      setCurrentSpeedMs(2.4);
      setTidePhase("flood");
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Title & Scenario Mode Selector (Feature 16) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase">
            Hydrodynamic Drift & Time-to-Impact (TTI) Calculator
          </h3>
        </div>

        {/* Dual Scenario Comparative Toggle */}
        <div className="flex items-center gap-1 bg-ocean-light p-1 rounded-xl border border-border-marine">
          <span className="text-[10px] text-text-muted px-1.5 font-bold uppercase">Scenario:</span>
          <button
            onClick={() => setScenarioPreset("monsoon")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              activeScenario === "monsoon" ? "bg-status-danger text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Worst-Case Monsoon
          </button>
          <button
            onClick={() => setScenarioPreset("neap")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              activeScenario === "neap" ? "bg-status-success text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Best-Case Neap Tide
          </button>
          <button
            onClick={() => setScenarioPreset("cyclonic")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              activeScenario === "cyclonic" ? "bg-purple-600 text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Cyclonic Surge
          </button>
        </div>
      </div>

      {/* Sliders Grid (Feature 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Wind Speed */}
        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ocean-navy font-semibold">
              <Wind className="w-3.5 h-3.5 text-ocean" /> Wind Velocity
            </span>
            <span className="text-ocean font-bold">{windSpeedKts} kts</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={windSpeedKts}
            onChange={(e) => {
              setActiveScenario("custom");
              setWindSpeedKts(parseInt(e.target.value, 10));
            }}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted">
            <span>0 Calm</span>
            <span>25 Gale</span>
            <span>50 Storm</span>
          </div>
        </div>

        {/* Current Speed */}
        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ocean-navy font-semibold">
              <Waves className="w-3.5 h-3.5 text-ocean" /> Ocean Current
            </span>
            <span className="text-ocean font-bold">{currentSpeedMs.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={currentSpeedMs}
            onChange={(e) => {
              setActiveScenario("custom");
              setCurrentSpeedMs(parseFloat(e.target.value));
            }}
            className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean"
          />
          <div className="flex justify-between text-[9px] text-text-muted">
            <span>0.1 m/s (Slack)</span>
            <span>1.5 m/s</span>
            <span>3.0 m/s (Toroidal)</span>
          </div>
        </div>

        {/* Tide Stage */}
        <div className="p-2.5 rounded-xl bg-ocean-light/50 border border-border-marine space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="flex items-center gap-1 text-ocean-navy font-semibold">
              <Compass className="w-3.5 h-3.5 text-ocean" /> Tidal Phase
            </span>
            <span className="text-ocean font-bold uppercase">{tidePhase}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 pt-1">
            {['flood', 'ebb', 'slack'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveScenario("custom");
                  setTidePhase(t);
                }}
                className={`py-1 rounded text-[10px] font-bold uppercase transition-all ${
                  tidePhase === t ? "bg-ocean text-white" : "bg-white border border-border-marine text-text-secondary hover:bg-ocean-sky"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TTI Live Output Card */}
      <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
        riskTier === 'CRITICAL' ? 'bg-red-50 border-red-200 text-status-danger' : riskTier === 'HIGH' ? 'bg-amber-50 border-amber-200 text-status-warning' : 'bg-emerald-50 border-emerald-200 text-status-success'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider block">
              Estimated Time-to-Shoreline-Impact (TTI)
            </span>
            <span className="text-lg sm:text-xl font-extrabold font-mono">
              {ttiHours} Hours <span className="text-xs font-normal opacity-80 font-sans">({driftSpeedKts} kts shoreline vector)</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold block uppercase">CONTAINMENT URGENCY:</span>
          <span className="text-sm font-extrabold px-2 py-0.5 rounded bg-white shadow-sm inline-block mt-0.5">
            ● {riskTier} PRIORITY RESPONSE
          </span>
        </div>
      </div>
    </div>
  );
}

