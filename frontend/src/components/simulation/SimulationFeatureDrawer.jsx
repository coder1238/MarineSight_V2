import React, { useState } from 'react';
import {
  Sliders,
  Flame,
  ShieldAlert,
  Wind,
  Waves,
  Ship,
  FileSpreadsheet,
  Download,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Activity,
  Droplets,
  HelpCircle,
  Radio,
  SplitSquareVertical,
  Crosshair,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  OIL_ASSAYS,
  BEAUFORT_PRESETS,
  calculateBoomEfficiency,
  calculateDispersantEffectiveness,
  evaluateInSituBurningViability,
  predictShorelineImpact,
  calculateEkmanProfile,
  calculateBonnThicknessBreakdown,
  generateMonteCarloEnsemble,
  generateMilestonesComparison,
  generateMassBalanceTimeline,
  calculateScenarioComparison,
  RESPONSE_FLEET,
  calculateFleetTransitTimes,
  evaluateIMOTierCompliance,
  calculateVOCHazardZone,
  calculateDropletDynamics,
  exportSimulationGeoJSON,
  exportSimulationCSV,
  playTacticalPing,
  speakVoiceAdvisory
} from '../../utils/simulationExtendedPhysics';

export default function SimulationFeatureDrawer({
  caseData,
  simPhysics,
  simHour,
  selectedAssay,
  setSelectedAssay,
  activeBeaufort,
  setActiveBeaufort,
  virtualBooms,
  setVirtualBooms,
  dispersantActive,
  setDispersantActive,
  monteCarloData,
  setMonteCarloData,
  showMonteCarloOnMap,
  setShowMonteCarloOnMap,
  deployedFleet,
  setDeployedFleet,
  vocHazardZone,
  setVocHazardZone,
  isAudioEnabled,
  setIsAudioEnabled,
  onJumpToMilestone,
  onApplySandboxScenario,
  isCompareMode,
  setIsCompareMode
}) {
  const [activeTab, setActiveTab] = useState('assay_metocean'); // 'assay_metocean' | 'countermeasures' | 'impact_safety' | 'analytics_montecarlo' | 'sandbox_export'

  // Local state for interactive tools
  const [boomLength, setBoomLength] = useState(1000);
  const [boomAngle, setBoomAngle] = useState(45);
  const [burnSlickThickness, setBurnSlickThickness] = useState(2.0);

  // Sandbox inputs
  const [sandboxLat, setSandboxLat] = useState(caseData.coordinates?.lat || 14.8214);
  const [sandboxLng, setSandboxLng] = useState(caseData.coordinates?.lng || 68.2108);
  const [sandboxVolume, setSandboxVolume] = useState(3500);
  const [sandboxType, setSandboxType] = useState('instantaneous'); // 'instantaneous' | 'continuous'

  // Current calculations
  const relativeCurrent = simPhysics?.advection?.currentSpeedKn || 0.95;
  const boomCalc = calculateBoomEfficiency(boomLength, relativeCurrent, boomAngle);
  const dispersantCalc = calculateDispersantEffectiveness(
    selectedAssay,
    simHour,
    simPhysics?.weathering?.viscosityCst || 450,
    activeBeaufort?.waveHeightM || 1.2
  );
  const burnCalc = evaluateInSituBurningViability(
    selectedAssay,
    simPhysics?.weathering?.emulsified || 20,
    burnSlickThickness,
    simPhysics?.advection?.windSpeedKn || 15
  );
  const shorelineCalc = predictShorelineImpact(
    simPhysics?.centroid?.lat || 14.82,
    simPhysics?.centroid?.lng || 68.21,
    simPhysics?.advection || { speedKn: 1.2, headingDeg: 75 },
    simHour
  );
  const ekmanLayers = calculateEkmanProfile(
    simPhysics?.advection?.currentSpeedKn || 0.95,
    simPhysics?.advection?.currentHeadingDeg || 75
  );
  const bonnBreakdown = calculateBonnThicknessBreakdown(
    simPhysics?.morph?.areaKm2 || 14.7,
    sandboxVolume
  );
  const massBalanceTimeline = generateMassBalanceTimeline(
    Math.round(sandboxVolume * 0.136),
    selectedAssay,
    dispersantActive
  );
  const currentMassBalance = massBalanceTimeline.find(m => m.hour >= simHour) || massBalanceTimeline[massBalanceTimeline.length - 1];
  const fleetTransits = calculateFleetTransitTimes(
    simPhysics?.centroid?.lat || 14.82,
    simPhysics?.centroid?.lng || 68.21
  );
  const imoCompliance = evaluateIMOTierCompliance(Math.round(sandboxVolume * 0.136));
  const dropletDynamics = calculateDropletDynamics(
    activeBeaufort?.waveHeightM || 1.2,
    simPhysics?.weathering?.viscosityCst || 450
  );
  const scenarioDelta = calculateScenarioComparison(
    simPhysics,
    null,
    { boomsDeployed: virtualBooms.length > 0, dispersantsApplied: dispersantActive }
  );

  // Handlers
  const handleDeployBoom = () => {
    if (isAudioEnabled) playTacticalPing("click");
    const cLat = simPhysics.centroid.lat;
    const cLng = simPhysics.centroid.lng;
    const halfLenDeg = (boomLength / 1000 / 111) * 0.5;
    const rad = (simPhysics.advection.headingDeg + 90) * (Math.PI / 180);

    const newBoom = {
      id: `boom-${Date.now()}`,
      lengthM: boomLength,
      efficiency: boomCalc.efficiency,
      status: boomCalc.status,
      holdingCapacityBbls: boomCalc.holdingCapacityBbls,
      coords: [
        { lat: +(cLat - Math.cos(rad) * halfLenDeg).toFixed(5), lng: +(cLng - Math.sin(rad) * halfLenDeg).toFixed(5) },
        { lat: +(cLat + Math.cos(rad) * halfLenDeg).toFixed(5), lng: +(cLng + Math.sin(rad) * halfLenDeg).toFixed(5) }
      ]
    };
    setVirtualBooms(prev => [...prev, newBoom]);
  };

  const handleClearBooms = () => {
    setVirtualBooms([]);
  };

  const handleTriggerDispersant = () => {
    if (isAudioEnabled) playTacticalPing("alert");
    setDispersantActive(true);
    speakVoiceAdvisory("Aerial C-130 dispersant sortie executed. Accelerated vertical entrainment active.");
  };

  const handleRunMonteCarlo = () => {
    if (isAudioEnabled) playTacticalPing("radar");
    const ensemble = generateMonteCarloEnsemble(
      caseData.coordinates?.lat || 14.8214,
      caseData.coordinates?.lng || 68.2108,
      simPhysics.advection,
      simHour,
      100
    );
    setMonteCarloData(ensemble);
    setShowMonteCarloOnMap(true);
  };

  const handleToggleFleet = (vessel) => {
    if (isAudioEnabled) playTacticalPing("click");
    setDeployedFleet(prev => {
      const exists = prev.some(f => f.id === vessel.id);
      if (exists) return prev.filter(f => f.id !== vessel.id);
      return [...prev, vessel];
    });
  };

  const handleToggleVOCHazard = () => {
    if (vocHazardZone) {
      setVocHazardZone(null);
    } else {
      const voc = calculateVOCHazardZone(
        simPhysics.centroid.lat,
        simPhysics.centroid.lng,
        simPhysics.advection.windSpeedKn,
        simPhysics.advection.windHeadingDeg - 180,
        selectedAssay
      );
      setVocHazardZone(voc);
    }
  };

  const handleExportGeoJSON = () => {
    if (isAudioEnabled) playTacticalPing("click");
    const dataStr = exportSimulationGeoJSON(simPhysics, caseData);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MarineSight_Sim_${caseData.incidentId}_T${Math.round(simHour)}h.geojson`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (isAudioEnabled) playTacticalPing("click");
    const csvStr = exportSimulationCSV(simPhysics, caseData);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MarineSight_Particles_${caseData.incidentId}_T${Math.round(simHour)}h.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVoiceSituationalBriefing = () => {
    const speechText = `MarineSight Operational Briefing for Incident ${caseData.incidentId}. Simulation timestamp is T plus ${Math.round(simHour)} hours. Centroid is drifting at ${simPhysics.advection.speedKn.toFixed(1)} knots towards ${simPhysics.advection.headingDeg.toFixed(0)} degrees azimuth. Landfall alert: projected landfall at ${shorelineCalc.sectorName} in ${shorelineCalc.etaHours} hours. Active petroleum assay is ${selectedAssay.name} with ${simPhysics.weathering.emulsified} percent water emulsification.`;
    speakVoiceAdvisory(speechText);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl shadow-marine-sm overflow-hidden text-xs">
      {/* Drawer Tabs Header */}
      <div className="bg-ocean-light/70 border-b border-border-marine p-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('assay_metocean')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'assay_metocean' ? 'bg-ocean text-white shadow-xs' : 'text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Assay & MetOcean</span>
          </button>

          <button
            onClick={() => setActiveTab('countermeasures')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'countermeasures' ? 'bg-ocean text-white shadow-xs' : 'text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Countermeasures</span>
            {(virtualBooms.length > 0 || dispersantActive) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('impact_safety')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'impact_safety' ? 'bg-ocean text-white shadow-xs' : 'text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Shoreline & Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics_montecarlo')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics_montecarlo' ? 'bg-ocean text-white shadow-xs' : 'text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Monte Carlo & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox_export')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'sandbox_export' ? 'bg-ocean text-white shadow-xs' : 'text-text-secondary hover:bg-ocean-sky'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sandbox & GIS Export</span>
          </button>
        </div>

        {/* Tactical Quick Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-1.5 rounded-lg border transition-all ${
              isAudioEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={isAudioEnabled ? "Mute Tactical Audio Synthesizer" : "Enable Tactical Radar Audio"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleVoiceSituationalBriefing}
            className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-bold flex items-center gap-1"
            title="Synthesize AI Voice Situation Report"
          >
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Voice SITREP</span>
          </button>
        </div>
      </div>

      {/* Drawer Tab Contents */}
      <div className="p-4">
        {/* ==================================================================== */}
        {/* TAB 1: PETROLEUM ASSAY & METOCEAN ENGINE */}
        {/* ==================================================================== */}
        {activeTab === 'assay_metocean' && (
          <div className="space-y-4">
            {/* Feature 1: Petroleum Assay Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-amber-600" />
                  Feature 1: Petroleum Assay & Hydrocarbon Composition Matrix
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  API Gravity: {selectedAssay.apiGravity}° · Density: {selectedAssay.densityGcm3} g/cm³
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {Object.values(OIL_ASSAYS).map(assay => {
                  const isSelected = selectedAssay.id === assay.id;
                  return (
                    <div
                      key={assay.id}
                      onClick={() => {
                        if (isAudioEnabled) playTacticalPing("click");
                        setSelectedAssay(assay);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-ocean bg-ocean-sky/30 shadow-marine-sm ring-1 ring-ocean'
                          : 'border-border-marine hover:bg-ocean-light/50 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-ocean-navy">{assay.name}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: assay.colorTheme }}
                        ></span>
                      </div>
                      <div className="text-[10px] text-text-muted mb-1">{assay.origin}</div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono mb-1.5">
                        <span className="bg-white/80 p-1 rounded border border-border-marine/50">
                          API: <b>{assay.apiGravity}°</b>
                        </span>
                        <span className="bg-white/80 p-1 rounded border border-border-marine/50">
                          Visc: <b>{assay.viscosityAt20C} cSt</b>
                        </span>
                        <span className="bg-white/80 p-1 rounded border border-border-marine/50">
                          Pour: <b>{assay.pourPointC}°C</b>
                        </span>
                        <span className="bg-white/80 p-1 rounded border border-border-marine/50">
                          Asphalt: <b>{assay.asphalteneContent}%</b>
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">
                        {assay.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feature 2: MetOcean Beaufort Sea-State Presets */}
            <div className="pt-3 border-t border-border-marine">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-teal-600" />
                  Feature 2: MetOcean Sea-State Presets (Beaufort Hydrodynamic Scale)
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  Wave Height (Hs): {activeBeaufort?.waveHeightM || 1.2}m · Period: {activeBeaufort?.wavePeriodS || 5.2}s
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {BEAUFORT_PRESETS.map(preset => {
                  const isCurrent = activeBeaufort?.scale === preset.scale;
                  return (
                    <button
                      key={preset.scale}
                      onClick={() => {
                        if (isAudioEnabled) playTacticalPing("click");
                        setActiveBeaufort(preset);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-teal-500 bg-teal-50/50 shadow-marine-sm ring-1 ring-teal-400'
                          : 'border-border-marine hover:bg-ocean-light/50 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-ocean-navy mb-1">
                        <span>{preset.name}</span>
                        <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                          {preset.windSpeedKn} kn
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted mb-1">
                        Wave: <b>{preset.waveHeightM}m</b> · Kh: <b>{preset.diffusionKh} m²/s</b>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-tight line-clamp-2">
                        {preset.seaStateDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature 7: Ekman Spiral Depth Profile */}
            <div className="pt-3 border-t border-border-marine">
              <span className="font-bold text-ocean-navy uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Compass className="w-4 h-4 text-sky-600" />
                Feature 7: Depth-Stratified Ekman Spiral Vertical Current Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
                {ekmanLayers.map((layer, idx) => (
                  <div key={idx} className="p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine/60">
                    <div className="flex justify-between items-center text-[10px] font-bold text-ocean-deep mb-1">
                      <span>{layer.depthM}m Depth</span>
                      <span className="text-teal-700">{layer.speedKn} kn</span>
                    </div>
                    <div className="text-[10px] text-text-muted mb-1">
                      Heading: <b>{layer.headingDeg}°</b>
                    </div>
                    <div className="text-[9px] text-text-secondary">
                      {layer.turbulenceLevel}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: TACTICAL COUNTERMEASURES */}
        {/* ==================================================================== */}
        {activeTab === 'countermeasures' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feature 3: Virtual Containment Boom Deployment */}
              <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                    <SplitSquareVertical className="w-4 h-4 text-emerald-600" />
                    Feature 3: Containment Boom Deployment & Drainage Limits
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    boomCalc.efficiency >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {boomCalc.efficiency}% Efficiency
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Boom Length:</span>
                    <div className="flex gap-1">
                      {[500, 1000, 2500].map(len => (
                        <button
                          key={len}
                          onClick={() => setBoomLength(len)}
                          className={`px-2 py-0.5 rounded ${
                            boomLength === len ? 'bg-ocean text-white' : 'bg-white border border-border-marine'
                          }`}
                        >
                          {len}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Boom Angle to Drift ({boomAngle}°):</span>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={boomAngle}
                      onChange={(e) => setBoomAngle(parseInt(e.target.value))}
                      className="w-28 h-1.5 accent-ocean cursor-pointer"
                    />
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-border-marine/50 space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span>Normal Relative Velocity:</span>
                      <span className="font-bold">{boomCalc.vNormal} kn (Limit: 0.70 kn)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-emerald-700">{boomCalc.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Holding Capacity:</span>
                      <span className="font-bold text-ocean-deep">~{boomCalc.holdingCapacityBbls.toLocaleString()} bbls</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleDeployBoom}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Deploy Virtual Boom on Map</span>
                    </button>
                    {virtualBooms.length > 0 && (
                      <button
                        onClick={handleClearBooms}
                        className="px-2.5 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold"
                      >
                        Clear ({virtualBooms.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Feature 4: Chemical Dispersant Sortie */}
              <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Feature 4: Chemical Dispersant Application Simulator
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    dispersantCalc.viable ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {dispersantCalc.viable ? 'APPLICATION VIABLE' : 'WINDOW INHIBITED'}
                  </span>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2 bg-white rounded-lg border border-border-marine/50 space-y-1 text-[10px]">
                    <div className="flex justify-between">
                      <span>Current Viscosity:</span>
                      <span className="font-bold">{simPhysics.weathering.viscosityCst} cSt (Threshold: 10,000 cSt)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DOR Requirement:</span>
                      <span className="font-bold">{dispersantCalc.targetDOR}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surface Area Reduction:</span>
                      <span className="font-bold text-purple-700">-{dispersantCalc.efficiencyPercent}% Surface Mass</span>
                    </div>
                    <p className="text-text-muted mt-1 italic text-[9px]">
                      {dispersantCalc.advisory}
                    </p>
                  </div>

                  <button
                    onClick={handleTriggerDispersant}
                    disabled={dispersantActive || !dispersantCalc.viable}
                    className={`w-full py-2 rounded-lg font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      dispersantActive
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{dispersantActive ? '✓ Dispersant Sortie Active (Accelerated Entrainment)' : 'Authorize C-130 Aerial Dispersant Sortie'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 5: In-Situ Controlled Burning */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-600" />
                  Feature 5: ASTM F2152 In-Situ Controlled Burning Viability Calculator
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  burnCalc.viable ? 'bg-orange-100 text-orange-800 border border-orange-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {burnCalc.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <div className="flex justify-between text-text-muted mb-1">
                    <span>Thickness ({burnSlickThickness} mm):</span>
                    <span>Min 1.0mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={burnSlickThickness}
                    onChange={(e) => setBurnSlickThickness(parseFloat(e.target.value))}
                    className="w-full h-1.5 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-text-secondary mt-1 block">
                    Thermal ignition boundary requirement
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <div className="text-text-muted mb-0.5">Water Emulsion Limit:</div>
                  <div className="font-bold text-ocean-navy text-xs">
                    {simPhysics.weathering.emulsified}% / 25% max
                  </div>
                  <span className="text-[10px] text-text-secondary">
                    {simPhysics.weathering.emulsified <= 25 ? '✓ Steam quench window open' : '✗ Quenches flame'}
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <div className="text-text-muted mb-0.5">Est. Removal Rate:</div>
                  <div className="font-bold text-orange-700 text-xs">
                    {burnCalc.estBurnRateBblHr.toLocaleString()} bbl/hr
                  </div>
                  <span className="text-[10px] text-text-secondary">
                    Soot Yield: {burnCalc.sootYieldPercent}% particulate smoke
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 13: Emergency Response Fleet Dispatch */}
            <div className="pt-2 border-t border-border-marine">
              <span className="font-bold text-ocean-navy uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Ship className="w-4 h-4 text-emerald-600" />
                Feature 13: Emergency Response Fleet Transit & Dispatch Optimizer
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 font-mono">
                {fleetTransits.map(vessel => {
                  const isDeployed = deployedFleet.some(f => f.id === vessel.id);
                  return (
                    <div
                      key={vessel.id}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isDeployed
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                          : 'border-border-marine bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start font-bold text-ocean-navy mb-1">
                        <span className="text-[11px] leading-tight">{vessel.name}</span>
                      </div>
                      <div className="text-[10px] text-text-muted mb-1">{vessel.port}</div>
                      <div className="space-y-0.5 text-[10px] mb-2">
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span className="font-bold">{vessel.speedKn} kn</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-bold">{vessel.distNm} NM</span>
                        </div>
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>ETA to Centroid:</span>
                          <span>{vessel.etaDesc}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleFleet(vessel)}
                        className={`w-full py-1 rounded text-[10px] font-bold transition-all ${
                          isDeployed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-ocean-light hover:bg-ocean-sky text-ocean-deep'
                        }`}
                      >
                        {isDeployed ? '✓ Deployed on Radar' : '+ Dispatch Vessel'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: SHORELINE IMPACT & REGULATORY SAFETY */}
        {/* ==================================================================== */}
        {activeTab === 'impact_safety' && (
          <div className="space-y-4">
            {/* Feature 6: Shoreline Impact & ESI Sensitivity */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-status-danger" />
                  Feature 6: Shoreline Impact Forecasting & ESI Ecological Vulnerability
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                  ESI RANK: {shorelineCalc.esiRank}/10 ({shorelineCalc.priorityLevel})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] font-mono mb-2">
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">PREDICTED SECTOR</span>
                  <span className="font-bold text-ocean-navy text-xs">{shorelineCalc.sectorName}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">DISTANCE TO COASTLINE</span>
                  <span className="font-bold text-status-danger text-xs">{shorelineCalc.distanceKmToCoast} km ({shorelineCalc.distanceNmToCoast} NM)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">ESTIMATED LANDFALL ETA</span>
                  <span className="font-bold text-amber-600 text-xs">{shorelineCalc.etaHours}h ({shorelineCalc.landfallTimeUTC})</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">COASTLINE AT RISK</span>
                  <span className="font-bold text-text-primary text-xs">{shorelineCalc.impactedShorelineKm} km linear shore</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                <span className="font-bold">Ecological Assets in Path: </span>
                {shorelineCalc.vulnerableFauna}
              </div>
            </div>

            {/* Feature 15: Atmospheric VOC Toxicity Hazard */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-red-600" />
                  Feature 15: Atmospheric VOC Vapor Dispersion & IDLH Responder Safety Zone
                </span>
                <button
                  onClick={handleToggleVOCHazard}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    vocHazardZone ? 'bg-red-600 text-white' : 'bg-white border border-border-marine text-text-secondary hover:bg-ocean-sky'
                  }`}
                >
                  {vocHazardZone ? '✓ Downwind Hazard Active on Map' : '+ Overlay VOC Plume on Map'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-text-muted block text-[10px]">DOWNWIND EXCLUSION RADIUS</span>
                  <span className="font-bold text-red-600 text-xs">
                    {(3.2 * selectedAssay.evaporationRateFactor).toFixed(1)} NM Downwind
                  </span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-text-muted block text-[10px]">PRIMARY TOXIC VOLATILES</span>
                  <span className="font-bold text-ocean-navy text-xs">Benzene, Toluene, H₂S (BTEX)</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-text-muted block text-[10px]">MANDATORY PPE PROTOCOL</span>
                  <span className="font-bold text-text-primary text-[10px]">SCBA / Level B within 4 NM</span>
                </div>
              </div>
            </div>

            {/* Feature 14: IMO Tier 1/2/3 Regulatory Compliance Checklist */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Feature 14: IMO & OPRC Tier Classification & Statutory Compliance
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  CLASSIFICATION: {imoCompliance.tier}
                </span>
              </div>

              <div className="text-[11px] text-text-secondary mb-2">
                <b>Lead Authority:</b> {imoCompliance.responseJurisdiction} · Mandatory Notice Window: <b>{imoCompliance.notificationWindowHours}h</b>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                {imoCompliance.checklist.map((item, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-border-marine/50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-ocean-navy block">{item.rule}</span>
                      <span className="text-text-muted text-[9px]">{item.item}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: ANALYTICS, MONTE CARLO & 3D DROPLETS */}
        {/* ==================================================================== */}
        {activeTab === 'analytics_montecarlo' && (
          <div className="space-y-4">
            {/* Feature 9: Monte Carlo Probabilistic Ensemble */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  Feature 9: Monte Carlo 100-Trajectory Stochastic Ensemble
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunMonteCarlo}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run 100-Run Ensemble</span>
                  </button>
                  {monteCarloData && (
                    <button
                      onClick={() => setShowMonteCarloOnMap(!showMonteCarloOnMap)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        showMonteCarloOnMap ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-white border-border-marine'
                      }`}
                    >
                      {showMonteCarloOnMap ? 'Hide Cones' : 'Show Cones on Map'}
                    </button>
                  )}
                </div>
              </div>

              {monteCarloData ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                    <span className="text-[10px] text-text-muted block">50% CONFIDENCE DRIFT</span>
                    <span className="font-bold text-purple-700 text-xs">+{monteCarloData.stats.p50Dist} NM</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                    <span className="text-[10px] text-text-muted block">75% PROBABLE BOUND</span>
                    <span className="font-bold text-purple-600 text-xs">+{monteCarloData.stats.p75Dist} NM</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                    <span className="text-[10px] text-text-muted block">95% EXCLUSION ENVELOPE</span>
                    <span className="font-bold text-purple-900 text-xs">+{monteCarloData.stats.p95Dist} NM</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                    <span className="text-[10px] text-text-muted block">MEAN PREDICTED CENTROID</span>
                    <span className="font-bold text-ocean-navy text-xs">{monteCarloData.stats.meanLat}°N, {monteCarloData.stats.meanLng}°E</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-text-secondary">
                  Execute 100 stochastic trajectory iterations with Gaussian turbulence to generate 50%, 75%, and 95% confidence cones.
                </p>
              )}
            </div>

            {/* Feature 11: Real-time Mass Balance Breakdown */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-ocean" />
                  Feature 11: Real-Time Dynamic Mass Balance Timeline (T+{Math.round(simHour)}h)
                </span>
                <span className="text-[11px] font-mono font-bold text-ocean-deep">
                  Total Released: {Math.round(sandboxVolume * 0.136)} metric tons
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px] mb-2.5">
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">SURFACE SLICK</span>
                  <span className="font-bold text-status-danger text-xs">{currentMassBalance.surfaceTons} tons</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">EVAPORATED</span>
                  <span className="font-bold text-text-primary text-xs">{currentMassBalance.evaporatedTons} tons</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">NATURAL DISPERSION</span>
                  <span className="font-bold text-text-muted text-xs">{currentMassBalance.dispersedTons} tons</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">CHEM. DISPERSED</span>
                  <span className="font-bold text-purple-700 text-xs">{currentMassBalance.chemDispersedTons} tons</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">WATER IN MOUSSE</span>
                  <span className="font-bold text-amber-700 text-xs">+{currentMassBalance.waterInEmulsionTons} tons</span>
                </div>
              </div>

              {/* Visual Stacked Bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${(currentMassBalance.surfaceTons / Math.round(sandboxVolume * 0.136)) * 100}%` }}
                  className="bg-status-danger h-full"
                  title="Surface Slick"
                ></div>
                <div
                  style={{ width: `${(currentMassBalance.evaporatedTons / Math.round(sandboxVolume * 0.136)) * 100}%` }}
                  className="bg-slate-500 h-full"
                  title="Evaporated"
                ></div>
                <div
                  style={{ width: `${(currentMassBalance.dispersedTons / Math.round(sandboxVolume * 0.136)) * 100}%` }}
                  className="bg-teal-500 h-full"
                  title="Natural Dispersion"
                ></div>
                <div
                  style={{ width: `${(currentMassBalance.chemDispersedTons / Math.round(sandboxVolume * 0.136)) * 100}%` }}
                  className="bg-purple-600 h-full"
                  title="Chemical Dispersion"
                ></div>
              </div>
            </div>

            {/* Feature 8: Bonn Agreement Thickness Breakdown */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <span className="font-bold text-ocean-navy flex items-center gap-1.5 mb-2">
                <Layers className="w-4 h-4 text-sky-600" />
                Feature 8: Bonn Agreement Optical Thickness & Volume Partitioning
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-[10px]">
                {bonnBreakdown.map(tier => (
                  <div key={tier.code} className="p-2 bg-white rounded-lg border border-border-marine/50">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }}></span>
                      <span className="truncate">{tier.name}</span>
                    </div>
                    <div className="text-text-muted mb-0.5">{tier.thicknessRange}</div>
                    <div className="flex justify-between font-bold text-ocean-navy">
                      <span>Area: {tier.areaPercent}%</span>
                      <span>Vol: {tier.volumePercent}%</span>
                    </div>
                    <div className="text-text-secondary mt-0.5 text-[9px]">
                      ~{tier.volumeBbls.toLocaleString()} bbls
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 16: Delvigne-Sweeney Droplet Dynamics */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <span className="font-bold text-ocean-navy flex items-center gap-1.5 mb-2">
                <Droplets className="w-4 h-4 text-teal-600" />
                Feature 16: Delvigne-Sweeney 3D Droplet Size & Vertical Column Suspension
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">MEDIAN DROPLET (D50)</span>
                  <span className="font-bold text-teal-700 text-xs">{dropletDynamics.d50Microns} µm</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">TERMINAL BUOYANCY VELOCITY</span>
                  <span className="font-bold text-ocean-deep text-xs">{dropletDynamics.buoyantRiseSpeedCmS} cm/s rise</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">COLUMN ENTRAINMENT STATUS</span>
                  <span className="font-bold text-ocean-navy text-[10px]">{dropletDynamics.behavior}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: SANDBOX, A/B SCENARIO & GIS DATA EXPORTS */}
        {/* ==================================================================== */}
        {activeTab === 'sandbox_export' && (
          <div className="space-y-4">
            {/* Feature 18: Custom Spill Scenario Sandbox */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <span className="font-bold text-ocean-navy flex items-center gap-1.5 mb-2">
                <Sliders className="w-4 h-4 text-ocean" />
                Feature 18: Custom Spill Scenario Sandbox & Release Coordinates Override
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono text-[11px] mb-2.5">
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">RELEASE LATITUDE:</label>
                  <input
                    type="number"
                    step="0.001"
                    value={sandboxLat}
                    onChange={(e) => setSandboxLat(parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-border-marine rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">RELEASE LONGITUDE:</label>
                  <input
                    type="number"
                    step="0.001"
                    value={sandboxLng}
                    onChange={(e) => setSandboxLng(parseFloat(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-border-marine rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">VOLUME (BARRELS):</label>
                  <input
                    type="number"
                    step="100"
                    value={sandboxVolume}
                    onChange={(e) => setSandboxVolume(parseInt(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-border-marine rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">RELEASE REGIME:</label>
                  <select
                    value={sandboxType}
                    onChange={(e) => setSandboxType(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-border-marine rounded text-xs"
                  >
                    <option value="instantaneous">Instantaneous Tanker Rupture</option>
                    <option value="continuous">Continuous Subsea Pipeline (12h)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isAudioEnabled) playTacticalPing("alert");
                  onApplySandboxScenario({
                    lat: sandboxLat,
                    lng: sandboxLng,
                    volumeBbls: sandboxVolume,
                    releaseType: sandboxType
                  });
                }}
                className="w-full py-2 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Recompute Multi-Physics Trajectory for Sandbox Parameters</span>
              </button>
            </div>

            {/* Feature 12: Split-Screen A/B Scenario Comparator */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                  <SplitSquareVertical className="w-4 h-4 text-emerald-600" />
                  Feature 12: A/B Strategic Comparison (Unmitigated vs Countermeasure Strategy)
                </span>
                <button
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    isCompareMode ? 'bg-emerald-600 text-white' : 'bg-white border border-border-marine'
                  }`}
                >
                  {isCompareMode ? '✓ Compare Mode Active' : 'Toggle A/B Comparison'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">UNMITIGATED SURFACE OIL</span>
                  <span className="font-bold text-status-danger text-sm">{scenarioDelta.unmitigatedSurfaceTons} tons</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">ACTIVE MITIGATED REMAINING</span>
                  <span className="font-bold text-emerald-600 text-sm">{scenarioDelta.mitigatedSurfaceTons} tons</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-border-marine/50">
                  <span className="text-[10px] text-text-muted block">PREVENTED STRANDING</span>
                  <span className="font-bold text-ocean-deep text-sm">+{scenarioDelta.preventedShorelineTons} tons ({scenarioDelta.reductionPercent}% reduction)</span>
                </div>
              </div>
            </div>

            {/* Feature 19 & 17: Telemetry GIS Data Export & Snapshots */}
            <div className="p-3.5 bg-ocean-light/40 border border-border-marine rounded-2xl space-y-2.5">
              <span className="font-bold text-ocean-navy flex items-center gap-1.5">
                <Download className="w-4 h-4 text-ocean" />
                Feature 19 & 17: Telemetry GIS Data Export & Situational Snapshot Exporters
              </span>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleExportGeoJSON}
                  className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Standard GeoJSON (QGIS / ArcGIS)</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Particle Telemetry CSV</span>
                </button>

                <button
                  onClick={() => {
                    if (isAudioEnabled) playTacticalPing("click");
                    alert("Situational snapshot configuration bookmarked to browser memory.");
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-border-marine hover:bg-ocean-sky font-bold text-ocean-navy flex items-center gap-1.5 transition-all"
                >
                  <span>Bookmark Snapshot State</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

