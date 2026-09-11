import React, { useState, useMemo, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Waves, 
  Wind, 
  Compass, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  ShieldAlert,
  Ship,
  Eye,
  EyeOff,
  FastForward,
  Activity,
  Gauge,
  Layers,
  Sparkles,
  Droplets,
  Table,
  Radio,
  Volume2,
  VolumeX,
  SplitSquareVertical,
  Crosshair,
  Download,
  AlertTriangle
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';
import { getFullSimulationPhysicsState } from '../utils/simulationPhysics';
import SimulationFeatureDrawer from '../components/simulation/SimulationFeatureDrawer';
import {
  OIL_ASSAYS,
  BEAUFORT_PRESETS,
  generateMilestonesComparison,
  playTacticalPing,
  speakVoiceAdvisory
} from '../utils/simulationExtendedPhysics';

export default function Page08Simulation({ onNavigate }) {
  const { 
    activeIncident, 
    activeTimestamp, 
    setActiveTimestamp, 
    isPlaying, 
    setIsPlaying,
    playSpeed,
    setPlaySpeed,
    simulationTimestamps
  } = useIncident();

  const caseData = activeIncident;
  const [simMode, setSimMode] = useState("forward"); // "forward" | "backward"
  const [duration, setDuration] = useState("72h");

  // Physics Simulation Controls
  const [windagePercent, setWindagePercent] = useState(3.0); // 1.0% to 5.0%
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0); // 0.5x to 2.0x
  const [particleDensity, setParticleDensity] = useState(1500); // 500, 1500, 3000, 5000

  // Display Layer Toggles
  const [layerToggles, setLayerToggles] = useState({
    windVectors: true,
    currentVectors: true,
    vessels: true,
    particles: true,
    oilSpills: true
  });

  const toggleSimLayer = (key) => {
    setLayerToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const timestamps = simulationTimestamps || ["T+0", "T+6", "T+12", "T+24", "T+48", "T+72"];

  // Continuous floating simulation hour (0.0 to 72.0)
  const [simHour, setSimHour] = useState(72.0);

  // Extended Feature States (20 Frontend Features)
  const [selectedAssay, setSelectedAssay] = useState(OIL_ASSAYS.arabian_light);
  const [activeBeaufort, setActiveBeaufort] = useState(BEAUFORT_PRESETS[1]);
  const [virtualBooms, setVirtualBooms] = useState([]);
  const [dispersantActive, setDispersantActive] = useState(false);
  const [monteCarloData, setMonteCarloData] = useState(null);
  const [showMonteCarloOnMap, setShowMonteCarloOnMap] = useState(true);
  const [deployedFleet, setDeployedFleet] = useState([]);
  const [vocHazardZone, setVocHazardZone] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [sandboxCoordinates, setSandboxCoordinates] = useState(null);
  const [showMilestoneTable, setShowMilestoneTable] = useState(false);

  // Sync simHour when milestone activeTimestamp changes
  useEffect(() => {
    const hours = { "T+0": 0, "T+6": 6, "T+12": 12, "T+24": 24, "T+48": 48, "T+72": 72 }[activeTimestamp];
    if (hours !== undefined && Math.abs(hours - simHour) > 1.5) {
      setSimHour(hours);
    }
  }, [activeTimestamp]);

  // High-frequency animation loop when isPlaying is true (smooth continuous fluid movement)
  useEffect(() => {
    if (!isPlaying) return;

    const stepPerHour = playSpeed === "25x" ? 1.8 : playSpeed === "10x" ? 0.9 : playSpeed === "5x" ? 0.45 : 0.2;
    const intervalMs = 60; // Smooth ~16fps animation rate

    const timer = setInterval(() => {
      setSimHour((prev) => {
        let next = prev + stepPerHour;
        if (next > 72.0) next = 0.0;
        return +next.toFixed(1);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed]);

  // Step controls
  const handleStepPrev = () => {
    if (isAudioEnabled) playTacticalPing("click");
    setSimHour(prev => Math.max(0, +(prev - 3.0).toFixed(1)));
  };

  const handleStepNext = () => {
    if (isAudioEnabled) playTacticalPing("click");
    setSimHour(prev => Math.min(72, +(prev + 3.0).toFixed(1)));
  };

  // Jump to milestone
  const handleJumpToMilestone = (milestoneKey) => {
    if (isAudioEnabled) playTacticalPing("radar");
    const hrs = { "T+0": 0, "T+6": 6, "T+12": 12, "T+24": 24, "T+48": 48, "T+72": 72 }[milestoneKey] || 0;
    setSimHour(hrs);
    setActiveTimestamp(milestoneKey);
  };

  // Compute live multi-physics simulation state using continuous simHour & extended options
  const simPhysics = useMemo(() => {
    return getFullSimulationPhysicsState(caseData, simHour, {
      windageRatio: windagePercent / 100,
      currentMultiplier: currentMultiplier,
      particleCount: particleDensity,
      oilAssay: selectedAssay,
      environmentalOverrides: activeBeaufort ? {
        windSpeedKn: activeBeaufort.windSpeedKn,
        currentSpeedKn: activeBeaufort.currentSpeedKn
      } : null,
      coordinatesOverride: sandboxCoordinates
    });
  }, [caseData, simHour, windagePercent, currentMultiplier, particleDensity, selectedAssay, activeBeaufort, sandboxCoordinates]);

  // Generate milestone comparison matrix
  const milestonesComparison = useMemo(() => {
    return generateMilestonesComparison(caseData, (c, t) => getFullSimulationPhysicsState(c, t, {
      windageRatio: windagePercent / 100,
      currentMultiplier: currentMultiplier,
      particleCount: 500,
      oilAssay: selectedAssay,
      environmentalOverrides: activeBeaufort ? {
        windSpeedKn: activeBeaufort.windSpeedKn,
        currentSpeedKn: activeBeaufort.currentSpeedKn
      } : null,
      coordinatesOverride: sandboxCoordinates
    }));
  }, [caseData, windagePercent, currentMultiplier, selectedAssay, activeBeaufort, sandboxCoordinates]);

  const handleApplySandboxScenario = (sandboxParams) => {
    setSandboxCoordinates({
      lat: sandboxParams.lat,
      lng: sandboxParams.lng
    });
    alert(`Custom Scenario Applied: Release at ${sandboxParams.lat}°N, ${sandboxParams.lng}°E (${sandboxParams.volumeBbls.toLocaleString()} bbls). Simulation recalculating.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Oil Drift Simulation & Hydrodynamics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono uppercase">
              ● {particleDensity.toLocaleString()} LAGRANGIAN PARTICLES
            </span>
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold font-mono">
              ECMWF + CMEMS COUPLED
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold font-mono">
              {selectedAssay.name.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold font-mono">
              BEAUFORT {activeBeaufort?.scale || 4}
            </span>
            {virtualBooms.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold font-mono">
                BOOMS: {virtualBooms.length} DEPLOYED
              </span>
            )}
            {dispersantActive && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-bold font-mono">
                DISPERSANT: SORTIE ACTIVE
              </span>
            )}
            {isCompareMode && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold font-mono animate-pulse">
                A/B SCENARIO SPLIT
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Coupled multi-physics advection, ADIOS3 weathering, virtual countermeasure mitigation, and Monte Carlo ensemble forecasting for Incident {caseData.incidentId} ({caseData.region}).
          </p>
        </div>

        {/* Mode & Action Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowMilestoneTable(!showMilestoneTable)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showMilestoneTable ? 'bg-ocean text-white border-ocean' : 'bg-white border-border-marine text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Milestone Matrix</span>
          </button>

          <div className="flex items-center bg-white border border-border-marine p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setSimMode("forward")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simMode === "forward" ? 'bg-ocean text-white shadow-sm' : 'text-text-secondary hover:bg-ocean-sky'
              }`}
            >
              ▶ Forward Drift Forecast
            </button>
            <button
              onClick={() => {
                setSimMode("backward");
                onNavigate("source-trace");
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                simMode === "backward" ? 'bg-ocean text-white shadow-sm' : 'text-text-secondary hover:bg-ocean-sky'
              }`}
            >
              ◀ Backward Hindcast (Origin)
            </button>
          </div>
        </div>
      </div>

      {/* Physics Engine Parameter Customizer Toolbar */}
      <div className="bg-white border border-border-marine p-3 rounded-2xl shadow-marine-sm flex flex-col gap-2.5 text-xs font-mono">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left: Interactive Physics Sliders */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Windage Slider */}
            <div className="flex items-center gap-2 bg-ocean-light/50 px-2.5 py-1 rounded-lg border border-border-marine/50">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span className="text-[10px] text-text-muted font-bold">WINDAGE DRAG:</span>
              <input 
                type="range" 
                min="1.0" 
                max="5.0" 
                step="0.1" 
                value={windagePercent}
                onChange={(e) => setWindagePercent(parseFloat(e.target.value))}
                className="w-20 h-1.5 accent-ocean cursor-pointer"
              />
              <span className="font-bold text-ocean-deep text-xs w-9 text-right">{windagePercent.toFixed(1)}%</span>
            </div>

            {/* Current Multiplier Slider */}
            <div className="flex items-center gap-2 bg-ocean-light/50 px-2.5 py-1 rounded-lg border border-border-marine/50">
              <Waves className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[10px] text-text-muted font-bold">CURRENT VELOCITY:</span>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={currentMultiplier}
                onChange={(e) => setCurrentMultiplier(parseFloat(e.target.value))}
                className="w-20 h-1.5 accent-ocean cursor-pointer"
              />
              <span className="font-bold text-ocean-deep text-xs w-9 text-right">{currentMultiplier.toFixed(1)}x</span>
            </div>

            {/* Particle Density Selector */}
            <div className="flex items-center gap-1.5 bg-ocean-light/50 px-2.5 py-1 rounded-lg border border-border-marine/50">
              <span className="text-[10px] text-text-muted font-bold">PARTICLES:</span>
              {[500, 1500, 3000, 5000].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => {
                    if (isAudioEnabled) playTacticalPing("click");
                    setParticleDensity(cnt);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    particleDensity === cnt 
                      ? 'bg-ocean text-white shadow-xs' 
                      : 'text-text-secondary hover:bg-ocean-sky'
                  }`}
                >
                  {cnt >= 1000 ? `${cnt / 1000}k` : cnt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Layer Toggles for Physics Overlays */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => toggleSimLayer('windVectors')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                layerToggles.windVectors 
                  ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                  : 'bg-slate-100 text-slate-400 line-through'
              }`}
            >
              <Wind className="w-3 h-3" />
              <span>Air Drift (Wind)</span>
            </button>

            <button
              onClick={() => toggleSimLayer('currentVectors')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                layerToggles.currentVectors 
                  ? 'bg-teal-100 text-teal-800 border border-teal-300' 
                  : 'bg-slate-100 text-slate-400 line-through'
              }`}
            >
              <Waves className="w-3 h-3" />
              <span>Currents (CMEMS)</span>
            </button>

            <button
              onClick={() => toggleSimLayer('vessels')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                layerToggles.vessels 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                  : 'bg-slate-100 text-slate-400 line-through'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Vessel Wakes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Simulation Map (68%) + Results Panel (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Map (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-marine text-xs font-bold text-ocean-navy flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span>PARTICLE DRIFT VIEWPORT ({caseData.region})</span>
                <span className="text-[10px] font-mono text-ocean bg-ocean-sky px-1.5 py-0.5 rounded">
                  Heading: {simPhysics.advection.headingDeg.toFixed(0)}° @ {simPhysics.advection.speedKn.toFixed(2)} kn
                </span>
                {isCompareMode && (
                  <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                    Comparing Baseline vs Mitigated
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-ocean">
                Centroid: {simPhysics.centroid.lat}°N, {simPhysics.centroid.lng}°E • {activeTimestamp}
              </span>
            </div>

            <GISMapMock 
              mode="simulation" 
              caseData={caseData}
              simulationTimestamp={simPhysics.timestampKey}
              simulationState={simPhysics}
              activeLayers={layerToggles}
              height="h-[340px] sm:h-[460px]"
              monteCarloEnsemble={showMonteCarloOnMap ? monteCarloData : null}
              virtualBooms={virtualBooms}
              deployedFleet={deployedFleet}
              vocHazardZone={vocHazardZone}
            />
          </div>

          {/* Bottom Timeline Scrubber & Speed Controls */}
          <div className="mt-3 pt-3 border-t border-border-marine">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              {/* Play / Step / Reset Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepPrev}
                  className="w-7 h-7 rounded-lg bg-ocean-light text-ocean-deep hover:bg-ocean-sky flex items-center justify-center font-bold text-xs"
                  title="Step Backward -3h"
                >
                  ◀
                </button>
                <button
                  onClick={() => {
                    if (isAudioEnabled) playTacticalPing("click");
                    setIsPlaying(!isPlaying);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title={isPlaying ? "Pause Simulation" : "Play Continuous Drift Movement"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={handleStepNext}
                  className="w-7 h-7 rounded-lg bg-ocean-light text-ocean-deep hover:bg-ocean-sky flex items-center justify-center font-bold text-xs"
                  title="Step Forward +3h"
                >
                  ▶
                </button>
                <button
                  onClick={() => {
                    if (isAudioEnabled) playTacticalPing("click");
                    setSimHour(0);
                    setActiveTimestamp("T+0");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-border-marine text-text-secondary hover:bg-ocean-sky font-semibold text-xs flex items-center gap-1"
                  title="Reset drift to T+0h release"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset T+0</span>
                </button>
              </div>

              {/* Speed Multiplier */}
              <div className="flex items-center gap-1 bg-white border border-border-marine rounded-lg p-0.5 text-xs font-mono">
                <span className="text-[10px] text-text-muted px-1.5">Speed:</span>
                {["1x", "5x", "10x", "25x"].map(spd => (
                  <button
                    key={spd}
                    onClick={() => {
                      if (isAudioEnabled) playTacticalPing("click");
                      setPlaySpeed(spd);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      playSpeed === spd 
                        ? 'bg-ocean text-white shadow-xs' 
                        : 'bg-ocean-light hover:bg-ocean-sky text-text-secondary'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>

              <span className="font-bold text-ocean font-mono text-xs">
                +{simHour.toFixed(1)}h Elapsed (T+{Math.round(simHour)}h)
              </span>
            </div>

            {/* Continuous Smooth Animation Progress Slider */}
            <div className="my-2.5 px-1 bg-ocean-light/40 p-2 rounded-xl border border-border-marine/50">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-text-muted font-semibold">HYDRODYNAMIC DRIFT PROGRESS:</span>
                <span className="font-bold text-ocean-deep">
                  T+{simHour.toFixed(1)}h · Traveled +{simPhysics.centroid.distanceNm} nm
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="72" 
                step="0.1" 
                value={simHour} 
                onChange={(e) => handleManualScrub(parseFloat(e.target.value))}
                className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-ocean shadow-xs"
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted mt-1">
                <span>0.0h (Spill Release)</span>
                <span className="text-ocean font-bold">Advection: {simPhysics.advection.speedKn.toFixed(2)} kn @ {simPhysics.advection.headingDeg.toFixed(0)}°</span>
                <span>72.0h (Max Spread)</span>
              </div>
            </div>

            {/* Timeline Milestone Step Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
              {timestamps.map((t) => {
                const milestoneHour = { "T+0": 0, "T+6": 6, "T+12": 12, "T+24": 24, "T+48": 48, "T+72": 72 }[t] || 0;
                const isCurrent = Math.abs(simHour - milestoneHour) < 3.0;
                return (
                  <button
                    key={t}
                    onClick={() => handleJumpToMilestone(t)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center ${
                      isCurrent 
                        ? 'bg-ocean text-white shadow-marine-sm ring-2 ring-ocean/40 scale-[1.02]' 
                        : 'bg-ocean-light hover:bg-ocean-sky text-text-secondary'
                    }`}
                  >
                    <span>{t}</span>
                    <span className={`text-[9px] font-normal ${isCurrent ? 'text-white/80' : 'text-text-muted'}`}>
                      +{milestoneHour}h
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Results Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Kinematics Card */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase">Trajectory Kinematics</span>
              <span className="text-[10px] font-mono text-status-warning font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-status-warning animate-ping"></span>
                ACTIVE ADVECTION
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">ORIGIN COORDINATES (T+0)</span>
                <span className="font-bold text-text-primary">
                  {sandboxCoordinates ? `${sandboxCoordinates.lat}°N, ${sandboxCoordinates.lng}°E (Override)` : (caseData.coordinates?.display || "14.82°N, 68.21°E")}
                </span>
              </div>
              <div className="p-2 bg-ocean-sky/40 rounded border border-ocean/30">
                <span className="text-[9px] text-ocean-deep font-bold block">CURRENT CENTROID ({activeTimestamp})</span>
                <span className="font-bold text-ocean-deep">
                  {simPhysics.centroid.lat}°N, {simPhysics.centroid.lng}°E (+{simPhysics.centroid.distanceNm} nm)
                </span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] text-text-muted block">EXPANDING SLICK AREA</span>
                  <span className="text-[9px] text-status-warning font-bold">+{(simPhysics.morph.areaKm2 - caseData.spillAreaKm2).toFixed(1)} km² spread</span>
                </div>
                <span className="font-bold text-status-warning text-sm">
                  {simPhysics.morph.areaKm2} km² · {simPhysics.morph.perimeterKm} km Perimeter
                </span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-text-muted block">NET TRANSPORT VECTOR</span>
                  <span className="font-bold text-ocean-navy">{simPhysics.advection.speedKn.toFixed(2)} kn · {simPhysics.advection.headingDeg.toFixed(0)}°</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-text-muted block">EST. TIME TO LANDFALL</span>
                  <span className="font-bold text-status-danger">{Math.max(12, 74 - simPhysics.hoursElapsed)}h Window</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Vessel Proximity Radar */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase">Lead Vessel Watch</span>
              <span className="text-[10px] font-bold text-status-danger">
                CPA: {simPhysics.distToLeadVesselNm} nm
              </span>
            </div>

            <div className="p-2.5 bg-red-50/50 border border-status-danger/30 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-ocean-navy flex items-center gap-1.5">
                  <Ship className="w-3.5 h-3.5 text-status-danger" />
                  {simPhysics.leadVessel?.name || "MV Ocean Star"}
                </span>
                <span className="text-status-danger">{simPhysics.leadVessel?.priorityScore || 91.4}/100</span>
              </div>
              <div className="flex justify-between text-[11px] text-text-secondary">
                <span>Speed at {activeTimestamp}:</span>
                <span className="font-bold text-ocean-navy">{simPhysics.leadVessel?.dynamicSpeedKn || 12.4} kn</span>
              </div>
              <div className="flex justify-between text-[11px] text-text-secondary">
                <span>Course Heading:</span>
                <span className="font-bold text-ocean-navy">{simPhysics.leadVessel?.dynamicHeadingDeg || 284}°</span>
              </div>
              <div className="flex justify-between text-[11px] text-text-secondary">
                <span>Distance to Spill:</span>
                <span className="font-bold text-status-danger">{simPhysics.distToLeadVesselNm} nm</span>
              </div>
            </div>
          </div>

          {/* ADIOS3 Weathering & Degradation Fate */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase">ADIOS3 Weathering Fate</span>
              <span className="text-[10px] text-text-muted">Viscosity: {simPhysics.weathering.viscosityCst} cSt</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-text-secondary">Emulsified Water-in-Oil:</span>
                  <span className="font-bold text-ocean-deep">{simPhysics.weathering.emulsified}%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div style={{ width: `${simPhysics.weathering.emulsified}%` }} className="bg-ocean-deep h-full transition-all"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-text-secondary">Evaporated Light Fractions:</span>
                  <span className="font-bold text-text-primary">{simPhysics.weathering.evaporated}%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div style={{ width: `${simPhysics.weathering.evaporated}%` }} className="bg-text-secondary h-full transition-all"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-text-secondary">Remaining Heavy Surface Slick:</span>
                  <span className="font-bold text-status-danger">{simPhysics.weathering.surface}%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div style={{ width: `${simPhysics.weathering.surface}%` }} className="bg-status-danger h-full transition-all"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-text-secondary">Natural Column Dispersion:</span>
                  <span className="font-bold text-text-muted">{simPhysics.weathering.dispersed}%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div style={{ width: `${simPhysics.weathering.dispersed}%` }} className="bg-text-muted h-full transition-all"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate("source-trace")}
            className="w-full py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all shadow-marine-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to Origin Source Trace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feature 10: Multi-Milestone Comparative Table & Delta Inspector */}
      {showMilestoneTable && (
        <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
            <span className="font-bold text-ocean-navy flex items-center gap-2">
              <Table className="w-4 h-4 text-ocean" />
              Feature 10: Multi-Milestone Trajectory Comparative Matrix (T+0 to T+72)
            </span>
            <span className="text-[10px] text-text-muted">Click any milestone to jump simulation timeline</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ocean-light/70 text-ocean-navy text-[11px] border-b border-border-marine">
                  <th className="p-2">Milestone</th>
                  <th className="p-2">Centroid Lat/Lng</th>
                  <th className="p-2">Total Drift (NM)</th>
                  <th className="p-2">Slick Area (km²)</th>
                  <th className="p-2">Evaporated</th>
                  <th className="p-2">Emulsified</th>
                  <th className="p-2">Remaining Surface</th>
                  <th className="p-2">Viscosity</th>
                  <th className="p-2">Lead Vessel CPA</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {milestonesComparison.map((m) => {
                  const isCurrent = Math.abs(simHour - m.hours) < 3.0;
                  return (
                    <tr
                      key={m.key}
                      onClick={() => handleJumpToMilestone(m.key)}
                      className={`border-b border-border-marine/50 cursor-pointer transition-colors text-[11px] ${
                        isCurrent ? 'bg-ocean-sky/40 font-bold text-ocean-deep' : 'hover:bg-ocean-light/40'
                      }`}
                    >
                      <td className="p-2 flex items-center gap-1.5">
                        {isCurrent && <span className="w-2 h-2 rounded-full bg-ocean"></span>}
                        <span>{m.key} (+{m.hours}h)</span>
                      </td>
                      <td className="p-2">{m.lat}°N, {m.lng}°E</td>
                      <td className="p-2">+{m.distNm} NM</td>
                      <td className="p-2">{m.areaKm2} km²</td>
                      <td className="p-2">{m.evaporated}%</td>
                      <td className="p-2 text-ocean-deep">{m.emulsified}%</td>
                      <td className="p-2 text-status-danger">{m.surface}%</td>
                      <td className="p-2">{m.viscosityCst} cSt</td>
                      <td className="p-2 text-status-danger">{m.distToLeadVesselNm} NM</td>
                      <td className="p-2">
                        <button className="px-2 py-0.5 rounded bg-ocean text-white text-[10px]">
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 20 Detailed Features Drawer Component */}
      <SimulationFeatureDrawer 
        caseData={caseData}
        simPhysics={simPhysics}
        simHour={simHour}
        selectedAssay={selectedAssay}
        setSelectedAssay={setSelectedAssay}
        activeBeaufort={activeBeaufort}
        setActiveBeaufort={setActiveBeaufort}
        virtualBooms={virtualBooms}
        setVirtualBooms={setVirtualBooms}
        dispersantActive={dispersantActive}
        setDispersantActive={setDispersantActive}
        monteCarloData={monteCarloData}
        setMonteCarloData={setMonteCarloData}
        showMonteCarloOnMap={showMonteCarloOnMap}
        setShowMonteCarloOnMap={setShowMonteCarloOnMap}
        deployedFleet={deployedFleet}
        setDeployedFleet={setDeployedFleet}
        vocHazardZone={vocHazardZone}
        setVocHazardZone={setVocHazardZone}
        isAudioEnabled={isAudioEnabled}
        setIsAudioEnabled={setIsAudioEnabled}
        onJumpToMilestone={handleJumpToMilestone}
        onApplySandboxScenario={handleApplySandboxScenario}
        isCompareMode={isCompareMode}
        setIsCompareMode={setIsCompareMode}
      />
    </div>
  );
}
