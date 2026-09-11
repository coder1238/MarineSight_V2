import React, { useState, useMemo, useEffect } from 'react';
import { 
  Compass, 
  Target, 
  Clock, 
  Wind, 
  Waves, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Ship,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Droplets,
  FileText,
  Edit3,
  Download,
  AlertTriangle,
  Anchor,
  Crosshair,
  MapPin,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BarChart2,
  Share2
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';

// Modular Feature Components
import SourceTraceScrubber from '../components/sourceTrace/SourceTraceScrubber';
import HydrodynamicTuningPanel from '../components/sourceTrace/HydrodynamicTuningPanel';
import SuspectVesselsTable from '../components/sourceTrace/SuspectVesselsTable';
import CpaTimelineChart from '../components/sourceTrace/CpaTimelineChart';
import WeatheringBackCalcCard from '../components/sourceTrace/WeatheringBackCalcCard';
import MonteCarloCloudModal from '../components/sourceTrace/MonteCarloCloudModal';
import ForensicChecklistModal from '../components/sourceTrace/ForensicChecklistModal';
import InvestigatorNotesDrawer from '../components/sourceTrace/InvestigatorNotesDrawer';
import ForensicDossierModal from '../components/sourceTrace/ForensicDossierModal';

export default function Page09SourceTrace({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident;

  // 1. Backward Scrubber & Playback State
  const [currentHour, setCurrentHour] = useState(40.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState("5x");

  // 2. Active Zone Selection (Zone A, B, C, or Custom D)
  const [selectedZone, setSelectedZone] = useState("zoneA");

  // 3. Scenario Comparator State (Baseline, High-Drift, Calm-Leeway)
  const [activeScenario, setActiveScenario] = useState("baseline");

  // 4. Hydrodynamic Tuning Parameters
  const [tuningParams, setTuningParams] = useState({
    windage: 3.2,
    currentMultiplier: 1.0,
    ekmanAngle: 3,
    stokesWeight: 2
  });

  // 5. Oceanographic Model Ensemble
  const [activeOceanModel, setActiveOceanModel] = useState("cmems");

  // 6. Selected Suspect Vessel
  const [selectedVessel, setSelectedVessel] = useState(null);

  // 7. Modals State
  const [isMonteCarloOpen, setIsMonteCarloOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // 8. Map Layer Switchboard
  const [mapLayers, setMapLayers] = useState({
    sourceZone: true,
    aisTracks: true,
    vessels: true,
    windVectors: true,
    currentVectors: true,
    particles: false,
    rangeRings: true
  });

  // 9. Active Tab in Bottom Workspace (Vessels vs Timeline vs Infrastructure vs Weathering)
  const [activeTab, setActiveTab] = useState("vessels"); // "vessels" | "cpa-timeline" | "weathering" | "infrastructure"

  // Base hindcast data
  const baseHindcast = caseData.hindcast || {
    originZoneA: { 
      name: "ZONE A (Primary Target)",
      coordinates: "14.6521°N, 67.9015°E", 
      lat: 14.6521, 
      lng: 67.9015, 
      confidence: 72.4,
      radiusKm: 4.2,
      depthM: 2140
    },
    originZoneB: { 
      name: "ZONE B (Secondary)",
      coordinates: "14.7180°N, 67.7540°E", 
      lat: 14.7180, 
      lng: 67.7540, 
      confidence: 18.1,
      radiusKm: 6.8,
      depthM: 2280
    },
    originZoneC: { 
      name: "ZONE C (Dispersed)",
      coordinates: "14.5800°N, 68.0400°E", 
      lat: 14.5800, 
      lng: 68.0400, 
      confidence: 9.5,
      radiusKm: 8.5,
      depthM: 1980
    },
    backwardDurationHours: 40.0,
    estimatedReleaseTimeUTC: "03 SEP 2026, 22:40 UTC",
    uncertaintyRadiusKm: 8.7,
    currentContribution: 61,
    windContribution: 39,
    reverseTrack: [
      { lat: 14.8214, lng: 68.2108 },
      { lat: 14.7850, lng: 68.1300 },
      { lat: 14.7400, lng: 68.0450 },
      { lat: 14.6950, lng: 67.9600 },
      { lat: 14.6521, lng: 67.9015 }
    ]
  };

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying) return;
    const stepPerHour = playSpeed === "10x" ? 1.0 : playSpeed === "5x" ? 0.5 : 0.2;
    const intervalMs = 100;

    const timer = setInterval(() => {
      setCurrentHour((prev) => {
        let next = prev + stepPerHour;
        if (next > 72.0) next = 0.0;
        return +next.toFixed(1);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed]);

  // Recalculate dynamic hindcast based on tuning parameters and active scenario
  const dynamicHindcast = useMemo(() => {
    const mult = tuningParams.currentMultiplier;
    const windEffect = (tuningParams.windage - 3.2) * 0.02;
    const scenarioOffsetLat = activeScenario === 'high-drift' ? -0.04 : activeScenario === 'calm' ? 0.03 : 0;
    const scenarioOffsetLng = activeScenario === 'high-drift' ? -0.06 : activeScenario === 'calm' ? 0.04 : 0;

    const baseLatA = baseHindcast.originZoneA.lat || 14.6521;
    const baseLngA = baseHindcast.originZoneA.lng || 67.9015;

    const tunedLatA = baseLatA + (1.0 - mult) * 0.05 + windEffect + scenarioOffsetLat;
    const tunedLngA = baseLngA + (1.0 - mult) * 0.08 + windEffect * 1.5 + scenarioOffsetLng;

    const uncertainty = +(baseHindcast.uncertaintyRadiusKm * mult * (tuningParams.windage / 3.0)).toFixed(1);

    // Compute progress ratio along reverse track (0 at T-0h to 1 at T-40h)
    const norm = Math.min(1.0, currentHour / 40.0);
    const startLat = caseData.coordinates?.lat || 14.8214;
    const startLng = caseData.coordinates?.lng || 68.2108;

    const currentSlickLat = startLat + (tunedLatA - startLat) * norm;
    const currentSlickLng = startLng + (tunedLngA - startLng) * norm;

    return {
      ...baseHindcast,
      uncertaintyRadiusKm: uncertainty,
      originZoneA: {
        ...baseHindcast.originZoneA,
        lat: tunedLatA,
        lng: tunedLngA,
        coordinates: `${tunedLatA.toFixed(4)}°N, ${tunedLngA.toFixed(4)}°E`
      },
      currentSlickAtScrubber: {
        lat: currentSlickLat,
        lng: currentSlickLng,
        coordinates: `${currentSlickLat.toFixed(4)}°N, ${currentSlickLng.toFixed(4)}°E`
      },
      reverseTrack: [
        { lat: startLat, lng: startLng },
        { lat: startLat + (tunedLatA - startLat) * 0.25, lng: startLng + (tunedLngA - startLng) * 0.25 },
        { lat: startLat + (tunedLatA - startLat) * 0.5, lng: startLng + (tunedLngA - startLng) * 0.5 },
        { lat: startLat + (tunedLatA - startLat) * 0.75, lng: startLng + (tunedLngA - startLng) * 0.75 },
        { lat: tunedLatA, lng: tunedLngA }
      ]
    };
  }, [baseHindcast, tuningParams, activeScenario, currentHour, caseData]);

  // Pass dynamic caseData to map
  const augmentedCaseData = useMemo(() => {
    return {
      ...caseData,
      hindcast: dynamicHindcast
    };
  }, [caseData, dynamicHindcast]);

  // Offshore infrastructure data (Feature 11)
  const offshoreAssets = [
    {
      name: "Mumbai High North Platform",
      type: "Offshore Production Complex",
      operator: "ONGC",
      lat: 19.42,
      lng: 71.33,
      distanceNm: 182,
      status: "NOMINAL",
      leakRisk: "Ruled Out (>180 NM Upstream)"
    },
    {
      name: "Western Offshore Trunk Pipeline",
      type: "Subsea Crude Pipeline (30-inch)",
      operator: "Western Offshore Oil Corp",
      lat: 15.20,
      lng: 69.10,
      distanceNm: 42,
      status: "VERIFIED INTACT",
      leakRisk: "Ruled Out (Pressure Monitored)"
    },
    {
      name: "South Bassein Gas Gathering Platform",
      type: "Gas Processing Platform",
      operator: "ONGC",
      lat: 18.98,
      lng: 72.10,
      distanceNm: 156,
      status: "NOMINAL",
      leakRisk: "Ruled Out (Dry Gas Reservoir)"
    }
  ];

  // Environmental time series values along reverse drift path (Feature 12)
  const envTimeSeries = [
    { step: "T-0h (Now)", wind: "12 kn SW", current: "0.58 m/s", wave: "2.1 m", temp: "28.4°C" },
    { step: "T-12h", wind: "14 kn SW", current: "0.60 m/s", wave: "2.3 m", temp: "28.2°C" },
    { step: "T-24h", wind: "16 kn WSW", current: "0.62 m/s", wave: "2.5 m", temp: "28.0°C" },
    { step: "T-36h", wind: "18 kn WSW", current: "0.64 m/s", wave: "2.7 m", temp: "27.8°C" },
    { step: "T-40h (Release)", wind: "19 kn SW", current: "0.65 m/s", wave: "2.8 m", temp: "27.7°C" },
    { step: "T-48h", wind: "17 kn SW", current: "0.61 m/s", wave: "2.6 m", temp: "27.9°C" }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* 1. Header & Top Command Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Probable Spill Origin (Backward Hindcast)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              REVERSAL CONVERGED (91.0% ENSEMBLE)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-ocean-sky/40 text-ocean-deep border border-ocean/30 text-[10px] font-bold font-mono">
              CASE {caseData.id || "OF-2026-0912"}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Lagrangian hydrodynamic time-reversal coupled with Copernicus CMEMS ocean currents, ECMWF windage, and historical AIS transponder telemetry.
          </p>
        </div>

        {/* Action Tools: Monte Carlo, Checklist, Notes, Dossier */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsMonteCarloOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Launch Monte Carlo stochastic particle dispersal simulator"
          >
            <Sparkles className="w-3.5 h-3.5 text-ocean" />
            <span>Monte Carlo Cloud</span>
          </button>

          <button
            onClick={() => setIsChecklistOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Open MARPOL Annex I Forensic Compliance Checklist"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>MARPOL Audit (8)</span>
          </button>

          <button
            onClick={() => setIsNotesOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Investigator Case Notes & Annotations"
          >
            <Edit3 className="w-3.5 h-3.5 text-ocean-deep" />
            <span>Case Log</span>
          </button>

          <button
            onClick={() => setIsDossierOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-marine-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. Backward Time-Scrubber & Playback Bar (Feature 1) */}
      <SourceTraceScrubber
        currentHour={currentHour}
        maxHours={72}
        isPlaying={isPlaying}
        playSpeed={playSpeed}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSpeedChange={(speed) => setPlaySpeed(speed)}
        onHourChange={(hour) => setCurrentHour(hour)}
        onReset={() => {
          setCurrentHour(0);
          setIsPlaying(false);
        }}
        estimatedSpillHour={40}
      />

      {/* 3. Main Operational Grid: Map & Controls (Col 8) + Forensic Origin Analysis (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Col 8): Map Viewport & On-Map Layer Switches */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm space-y-3">
            {/* Map Header with Scenario Switcher & Layer Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ocean-navy font-mono">
                  BACKWARD LAGRANGIAN TRAJECTORY ({caseData.region || "ARABIAN SEA"})
                </span>
                <span className="text-[10px] font-mono text-ocean bg-ocean-sky/40 px-2 py-0.5 rounded border border-ocean/30 font-bold">
                  {activeOceanModel.toUpperCase()} ENSEMBLE
                </span>
              </div>

              {/* Multi-Scenario Comparator (Feature 18) */}
              <div className="flex flex-wrap items-center gap-1 bg-ocean-light rounded-xl p-0.5 border border-border-marine text-[10px] font-mono font-bold">
                <span className="text-text-muted px-1.5 hidden sm:inline">Scenario:</span>
                {[
                  { id: "baseline", label: "Baseline" },
                  { id: "high-drift", label: "Monsoon Surge (+25%)" },
                  { id: "calm", label: "Calm Leeway (-20%)" }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenario(sc.id)}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      activeScenario === sc.id
                        ? 'bg-white text-ocean shadow-xs'
                        : 'text-text-muted hover:text-ocean-navy'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <GISMapMock 
              mode="source-trace" 
              caseData={augmentedCaseData}
              height="h-[340px] sm:h-[460px]"
              activeLayers={mapLayers}
              onSelectVessel={(vessel) => {
                setSelectedVessel(vessel);
                if (onNavigate) onNavigate("vessel-intel");
              }}
            />

            {/* Quick Map Layer Toggles (Feature 15) */}
            <div className="pt-2 border-t border-border-marine flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono">
              <div className="flex items-center gap-3 text-text-secondary flex-wrap">
                <span className="font-bold text-ocean-navy">Layers:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapLayers.sourceZone}
                    onChange={(e) => setMapLayers({ ...mapLayers, sourceZone: e.target.checked })}
                    className="accent-ocean rounded"
                  />
                  <span>Origin Centroids & Radii</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapLayers.aisTracks}
                    onChange={(e) => setMapLayers({ ...mapLayers, aisTracks: e.target.checked })}
                    className="accent-ocean rounded"
                  />
                  <span>AIS Tracks & Gap</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapLayers.windVectors}
                    onChange={(e) => setMapLayers({ ...mapLayers, windVectors: e.target.checked })}
                    className="accent-ocean rounded"
                  />
                  <span>Wind Barbs</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mapLayers.currentVectors}
                    onChange={(e) => setMapLayers({ ...mapLayers, currentVectors: e.target.checked })}
                    className="accent-ocean rounded"
                  />
                  <span>Current Vectors</span>
                </label>
              </div>

              {/* Cursor/Interpolated Position at Current Scrubber Hour */}
              <div className="text-[10px] font-mono text-ocean-deep bg-ocean-sky/30 px-2 py-0.5 rounded border border-ocean/20 font-bold">
                Position @ T-{currentHour.toFixed(1)}h: {dynamicHindcast.currentSlickAtScrubber.coordinates}
              </div>
            </div>

            {/* 3 Metric Mini-Cards */}
            <div className="pt-2 border-t border-border-marine grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
                <span className="text-text-muted text-[9px] block">OBSERVED SLICK (T-0)</span>
                <span className="font-bold text-ocean-navy">{caseData.coordinates?.display || "14.8214°N, 68.2108°E"}</span>
                <span className="text-[9px] text-text-secondary block mt-0.5">Sentinel-1 SAR Detection</span>
              </div>
              <div className="p-2.5 bg-ocean-sky/50 rounded-xl border border-ocean/40">
                <span className="text-ocean-deep text-[9px] font-bold block">PRIMARY ORIGIN (ZONE A)</span>
                <span className="font-bold text-ocean">{dynamicHindcast.originZoneA.coordinates}</span>
                <span className="text-[9px] text-ocean-deep block mt-0.5">Confidence: {dynamicHindcast.originZoneA.confidence}%</span>
              </div>
              <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
                <span className="text-text-muted text-[9px] block">UNCERTAINTY ENVELOPE</span>
                <span className="font-bold text-text-primary">±{dynamicHindcast.uncertaintyRadiusKm} km Radius</span>
                <span className="text-[9px] text-text-secondary block mt-0.5">
                  {(dynamicHindcast.uncertaintyRadiusKm / 1.852).toFixed(1)} Nautical Miles
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Forcing Time-Series Matrix (Feature 12) */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-ocean" />
                <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
                  Environmental Forcing Time-Series along Reverse Path
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted">Copernicus CMEMS & ECMWF IFS 0.1°</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 font-mono text-xs">
              {envTimeSeries.map((ts, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl border text-center ${
                    ts.step.includes("Release")
                      ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                      : 'bg-ocean-light/30 border-border-marine/60'
                  }`}
                >
                  <span className="text-[9px] font-bold block text-text-muted">{ts.step}</span>
                  <div className="text-[11px] font-extrabold text-ocean-navy mt-0.5">{ts.wind}</div>
                  <div className="text-[10px] text-ocean-deep">{ts.current}</div>
                  <div className="text-[9px] text-text-secondary mt-0.5">Hs: {ts.wave}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Col 4): Diagnostic Clusters & Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Probable Source Clusters & Multi-Zone Inspector (Feature 3) */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-ocean" />
                <span className="font-bold text-xs text-ocean-navy uppercase">Probable Source Zones</span>
              </div>
              <span className="text-[10px] font-mono text-ocean font-bold">HINDCAST CLUSTERS</span>
            </div>

            <div className="space-y-2">
              {/* Zone A (Primary) */}
              <div
                onClick={() => setSelectedZone('zoneA')}
                className={`p-3 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  selectedZone === 'zoneA'
                    ? 'border-ocean bg-ocean-sky/40 shadow-sm'
                    : 'border-border-marine bg-ocean-light/20 hover:bg-ocean-light/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean-deep flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-ocean animate-ping"></span>
                    ZONE A (Primary Target)
                  </span>
                  <span className="text-sm font-extrabold text-ocean">{dynamicHindcast.originZoneA.confidence}%</span>
                </div>
                <div className="text-[11px] text-text-secondary mt-1">
                  Centroid: <strong className="text-ocean-navy">{dynamicHindcast.originZoneA.coordinates}</strong>
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Bathymetry: Depth 2,140m · International Shipping Lane
                </div>
                {selectedZone === 'zoneA' && (
                  <div className="mt-2 pt-2 border-t border-ocean/20 text-[10px] text-ocean-deep font-sans flex items-center justify-between">
                    <span>EEZ Jurisdiction: Indian EEZ (178 NM)</span>
                    <span className="font-bold">UNCLOS Art. 211</span>
                  </div>
                )}
              </div>

              {/* Zone B (Secondary) */}
              <div
                onClick={() => setSelectedZone('zoneB')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  selectedZone === 'zoneB'
                    ? 'border-ocean bg-ocean-sky/40 shadow-sm'
                    : 'border-border-marine bg-ocean-light/20 hover:bg-ocean-light/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">ZONE B (Secondary)</span>
                  <span className="font-bold text-text-secondary">{dynamicHindcast.originZoneB.confidence}%</span>
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Centroid: {dynamicHindcast.originZoneB.coordinates} · Depth 2,280m
                </div>
              </div>

              {/* Zone C (Marginal) */}
              <div
                onClick={() => setSelectedZone('zoneC')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer font-mono text-xs ${
                  selectedZone === 'zoneC'
                    ? 'border-ocean bg-ocean-sky/40 shadow-sm'
                    : 'border-border-marine bg-ocean-light/20 hover:bg-ocean-light/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">ZONE C (Dispersed)</span>
                  <span className="font-bold text-text-secondary">{dynamicHindcast.originZoneC.confidence}%</span>
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Centroid: {dynamicHindcast.originZoneC.coordinates} · Depth 1,980m
                </div>
              </div>
            </div>
          </div>

          {/* Hydrodynamic Tuning & Multi-Model Engine (Feature 4 & Feature 8) */}
          <HydrodynamicTuningPanel
            params={tuningParams}
            onChange={(newParams) => setTuningParams(newParams)}
            onReset={() => {
              setTuningParams({
                windage: 3.2,
                currentMultiplier: 1.0,
                ekmanAngle: 3,
                stokesWeight: 2
              });
              setActiveScenario('baseline');
            }}
            activeModel={activeOceanModel}
            onModelChange={(modelId) => setActiveOceanModel(modelId)}
          />

          {/* Temporal Estimation & Nocturnal Card */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs space-y-3">
            <span className="font-bold text-xs text-ocean-navy uppercase block pb-2 border-b border-border-marine">
              Temporal Estimation & Solar Aspect
            </span>

            <div className="space-y-2">
              <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">ESTIMATED DISCHARGE TIME</span>
                <span className="font-bold text-text-primary text-sm">
                  {dynamicHindcast.estimatedReleaseTimeUTC}
                </span>
                <span className="text-[9px] text-text-secondary block mt-0.5">
                  Window: T-42h to T-38h (95% Gaussian Confidence)
                </span>
              </div>
              <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/40 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-text-muted block">INTEGRATION DURATION</span>
                  <span className="font-bold text-ocean-deep">{dynamicHindcast.backwardDurationHours} Hours Elapsed</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-ocean-sky/40 text-ocean-deep text-[10px] font-bold">
                  Runge-Kutta 4th
                </span>
              </div>
            </div>
          </div>

          {/* Range Rings & Bearing Tool (Feature 10) */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs space-y-2">
            <span className="font-bold text-xs text-ocean-navy uppercase block pb-1 border-b border-border-marine">
              Maritime Range & Coastal Distances
            </span>
            <div className="space-y-1 text-[11px] text-text-secondary">
              <div className="flex justify-between">
                <span>Distance to Ratnagiri Coast:</span>
                <strong className="text-ocean-navy">178 NM (330 km)</strong>
              </div>
              <div className="flex justify-between">
                <span>Territorial Sea (12 NM Limit):</span>
                <strong className="text-emerald-700">Outside (Deep Sea)</strong>
              </div>
              <div className="flex justify-between">
                <span>Contiguous Zone (24 NM Limit):</span>
                <strong className="text-emerald-700">Outside</strong>
              </div>
              <div className="flex justify-between">
                <span>EEZ Boundary (200 NM Limit):</span>
                <strong className="text-ocean-deep">Inside Indian EEZ</strong>
              </div>
              <div className="flex justify-between">
                <span>Reverse Drift Vector Heading:</span>
                <strong className="text-ocean-navy">244° WSW (Drift Bearing)</strong>
              </div>
            </div>
          </div>

          {/* Quick Action Button to Vessel Intel */}
          <button
            onClick={() => onNavigate && onNavigate("vessel-intel")}
            className="w-full py-3 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all shadow-marine-sm flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Historical AIS (142 Vessels)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Tabbed Forensic Workspace (Features 5, 6, 7, 9, 11, 13, 16) */}
      <div className="space-y-3">
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-border-marine pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vessels')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vessels'
                ? 'bg-ocean text-white shadow-sm'
                : 'text-text-secondary hover:text-ocean-navy hover:bg-ocean-light'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>AIS Correlated Suspects (6)</span>
          </button>

          <button
            onClick={() => setActiveTab('cpa-timeline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cpa-timeline'
                ? 'bg-ocean text-white shadow-sm'
                : 'text-text-secondary hover:text-ocean-navy hover:bg-ocean-light'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Temporal CPA Timeline Chart</span>
          </button>

          <button
            onClick={() => setActiveTab('weathering')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'weathering'
                ? 'bg-ocean text-white shadow-sm'
                : 'text-text-secondary hover:text-ocean-navy hover:bg-ocean-light'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Backward Weathering & Volume Back-Calc</span>
          </button>

          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'infrastructure'
                ? 'bg-ocean text-white shadow-sm'
                : 'text-text-secondary hover:text-ocean-navy hover:bg-ocean-light'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>Offshore Infrastructure & Subsea Pipelines</span>
          </button>
        </div>

        {/* Tab 1: Suspect Vessels Table */}
        {activeTab === 'vessels' && (
          <SuspectVesselsTable
            selectedVesselId={selectedVessel?.id}
            onSelectVessel={(v) => setSelectedVessel(v)}
            onNavigateToIntel={(v) => {
              setSelectedVessel(v);
              if (onNavigate) onNavigate("vessel-intel");
            }}
          />
        )}

        {/* Tab 2: Temporal CPA Timeline Chart */}
        {activeTab === 'cpa-timeline' && (
          <CpaTimelineChart
            estimatedHour={40}
            currentHour={currentHour}
          />
        )}

        {/* Tab 3: Weathering Back-Calculation & Nocturnal Calculator */}
        {activeTab === 'weathering' && (
          <WeatheringBackCalcCard
            observedVolumeM3={caseData.spillMetrics?.volumeM3 || 450}
            slickThicknessMm={0.05}
            slickAgeHours={40.0}
          />
        )}

        {/* Tab 4: Offshore Infrastructure & Pipelines Proximity */}
        {activeTab === 'infrastructure' && (
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-ocean" />
                <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
                  Subsea Pipeline & Offshore Platform Exclusion Audit
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                FIXED INFRASTRUCTURE LEAKS EXONERATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              {offshoreAssets.map((asset, idx) => (
                <div key={idx} className="p-3 bg-ocean-light/30 border border-border-marine/60 rounded-xl space-y-1">
                  <div className="font-bold text-ocean-navy text-xs">{asset.name}</div>
                  <div className="text-[10px] text-text-secondary">{asset.type} · {asset.operator}</div>
                  <div className="text-[11px] text-ocean-deep font-bold pt-1">Distance: {asset.distanceNm} NM</div>
                  <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1 font-bold">
                    {asset.leakRisk}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-text-secondary font-sans leading-relaxed pt-1">
              <strong>Forensic Conclusion:</strong> Nearest fixed production platform is over 156 NM away; nearest subsea trunkline exhibits zero pressure drop anomalies. Illicit mobile vessel discharge confirmed as single-point source.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <MonteCarloCloudModal
        isOpen={isMonteCarloOpen}
        onClose={() => setIsMonteCarloOpen(false)}
        centroidCoord={dynamicHindcast.originZoneA.coordinates}
        uncertaintyRadiusKm={dynamicHindcast.uncertaintyRadiusKm}
      />

      <ForensicChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        vesselName={selectedVessel?.name || caseData.topVessel?.name || "MV OCEAN STAR"}
      />

      <InvestigatorNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        incidentId={caseData.id || "OF-2026-0912"}
      />

      <ForensicDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        caseData={caseData}
        hindcastData={dynamicHindcast}
        suspectVessel={selectedVessel || caseData.topVessel}
        tuningParams={tuningParams}
      />
    </div>
  );
}
