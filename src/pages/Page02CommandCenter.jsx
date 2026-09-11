import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertOctagon, 
  Activity, 
  Waves, 
  Ship, 
  ShieldAlert, 
  ArrowUpRight, 
  Compass, 
  Clock, 
  TrendingUp,
  Filter,
  CheckCircle2,
  ExternalLink,
  Globe,
  Radio,
  Volume2,
  VolumeX,
  Copy,
  FileText,
  Send,
  Navigation,
  Plane,
  Anchor,
  Search,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  X,
  Printer,
  Crosshair
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';

// Web Audio API Maritime Siren & Squelch Synthesizer (100% Client-Side)
class MaritimeSoundSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenInterval = null;
    this.isSirenPlaying = false;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startSiren() {
    try {
      this.init();
      if (!this.audioCtx || this.isSirenPlaying) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();

      let high = false;
      this.sirenInterval = setInterval(() => {
        if (!this.audioCtx || !osc) return;
        const targetFreq = high ? 440 : 660;
        osc.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.12);
        high = !high;
      }, 500);

      this.sirenOsc = osc;
      this.sirenGain = gain;
      this.isSirenPlaying = true;
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  }

  stopSiren() {
    try {
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      if (this.sirenOsc) {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
        this.sirenOsc = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
      this.isSirenPlaying = false;
    } catch (e) {
      console.warn("Audio stop error:", e);
    }
  }

  playVhfRadioChirp() {
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1250, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Radio chirp error:", e);
    }
  }
}

const soundSynth = new MaritimeSoundSynthesizer();

export default function Page02CommandCenter({ onNavigate }) {
  const { activeIncidentId, activeIncident, selectIncident, allIncidents } = useIncident();

  // 1. Tactical MARSEC Readiness Level (1 = Normal, 2 = Heightened Intercept, 3 = Emergency Spill Response)
  const [marsecLevel, setMarsecLevel] = useState(3);
  const [isSirenActive, setIsSirenActive] = useState(false);

  // 2. Modals state
  const [showNavtexModal, setShowNavtexModal] = useState(false);
  const [showSitrepModal, setShowSitrepModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // 3. NAVTEX Broadcast simulator state
  const [navtexTransmitting, setNavtexTransmitting] = useState(false);
  const [navtexTransmitted, setNavtexTransmitted] = useState(false);

  // 4. Mission Chronometer & Satellite pass countdown
  const [elapsedSeconds, setElapsedSeconds] = useState(138240); // ~38.4 hours in seconds
  const [nextPassSeconds, setNextPassSeconds] = useState(9840); // 2h 44m countdown

  useEffect(() => {
    const clockTimer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setNextPassSeconds(prev => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  const formatChronometer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  const formatCountdown = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 5. Sound toggle effect
  const toggleSiren = () => {
    if (isSirenActive) {
      soundSynth.stopSiren();
      setIsSirenActive(false);
    } else {
      soundSynth.startSiren();
      setIsSirenActive(true);
    }
  };

  useEffect(() => {
    return () => {
      soundSynth.stopSiren();
    };
  }, []);

  // 6. GIS Tactical Overlay Toggles
  const [tacticalOverlays, setTacticalOverlays] = useState({
    vessels: true,
    aisTracks: true,
    oilSpills: true,
    windVectors: true,
    currentVectors: true,
    sourceZone: true,
    riskZones: true,
    coastalRadar: true,
    exclusionRing: true,
    ecoSanctuary: true
  });

  const toggleOverlay = (key) => {
    setTacticalOverlays(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 7. Coast Guard Quick Response Asset Intercept HUD State
  const [responderAssets, setResponderAssets] = useState([
    {
      id: 'ICGS-SAMARTH',
      name: 'ICGS Samarth',
      type: 'Offshore Patrol Vessel',
      icon: Ship,
      base: 'Goa Coast Guard Sector',
      speedKn: 24,
      distanceNm: 18.4,
      etaMin: 46,
      status: 'Standby',
      fuelPercent: 88,
      equipment: 'Side-Sweep Oil Skimmer + 400m Booms'
    },
    {
      id: 'DORNIER-750',
      name: 'Dornier 228 (CG-750)',
      type: 'Maritime Recon Aircraft',
      icon: Plane,
      base: 'INS Hansa / Dabolim',
      speedKn: 190,
      distanceNm: 62.1,
      etaMin: 20,
      status: 'Standby',
      fuelPercent: 74,
      equipment: 'SLAR Radar + FLIR Optical Pod'
    },
    {
      id: 'BARGE-OSR-02',
      name: 'Pollution Skimmer OSR-02',
      type: 'Heavy Skimmer Barge',
      icon: Anchor,
      base: 'Mormugao Port Trust',
      speedKn: 10,
      distanceNm: 36.8,
      etaMin: 220,
      status: 'Standby',
      fuelPercent: 95,
      equipment: 'Weir Skimmers & 1200T Sump Storage'
    }
  ]);

  const handleScrambleAsset = (assetId) => {
    soundSynth.playVhfRadioChirp();
    setResponderAssets(prev => prev.map(asset => {
      if (asset.id === assetId) {
        const nextStatus = asset.status === 'Standby' ? 'Intercepting' : asset.status === 'Intercepting' ? 'On Station' : 'Standby';
        return { ...asset, status: nextStatus };
      }
      return asset;
    }));
  };

  // 8. Regional Scenario Search & Risk Filter
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [scenarioFilter, setScenarioFilter] = useState('ALL');

  const filteredIncidents = useMemo(() => {
    return allIncidents.filter(inc => {
      const matchesText = inc.regionShort.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
                          inc.id.toLowerCase().includes(scenarioSearch.toLowerCase()) ||
                          inc.topCandidate.toLowerCase().includes(scenarioSearch.toLowerCase());
      const matchesFilter = scenarioFilter === 'ALL' || inc.risk.toUpperCase() === scenarioFilter;
      return matchesText && matchesFilter;
    });
  }, [allIncidents, scenarioSearch, scenarioFilter]);

  // 9. Live Event Stream with Auto-Simulation & Category Filter
  const [eventCategoryFilter, setEventCategoryFilter] = useState('ALL');
  const [isAutoStreamActive, setIsAutoStreamActive] = useState(true);

  const initialLiveEvents = [
    { id: 1, time: "14:42 UTC", text: `Active spill detected (${activeIncident.internalId}, ${activeIncident.spillAreaKm2} km² in ${activeIncident.regionShort})`, badge: "DETECTION", type: "critical", category: "CRITICAL" },
    { id: 2, time: "14:39 UTC", text: `AIS blackout interval flagged (${activeIncident.topVessel?.name}, ${activeIncident.topVessel?.aisBlackoutDurationMin} min duration)`, badge: "ANOMALY", type: "warning", category: "ANOMALY" },
    { id: 3, time: "14:35 UTC", text: `Backward Lagrangian hindcast completed (${activeIncident.hindcast?.originZoneA?.name} 72.4% confidence)`, badge: "HINDCAST", type: "info", category: "HINDCAST" },
    { id: 4, time: "14:31 UTC", text: `Vessel speed drop detected (${activeIncident.topVessel?.speedDropKn} anomaly during dark window)`, badge: "KINEMATICS", type: "warning", category: "ANOMALY" },
    { id: 5, time: "14:26 UTC", text: `Sentinel-1 C-band SAR radar imagery ingested (Level-1 GRD 20m pixel)`, badge: "ORBITAL", type: "info", category: "SENSOR" },
  ];

  const [liveEvents, setLiveEvents] = useState(initialLiveEvents);

  // Periodic simulated live stream feed generator
  useEffect(() => {
    if (!isAutoStreamActive) return;

    const streamTemplates = [
      { text: `AIS transponder ping verified for ${activeIncident.topVessel?.name || 'suspect vessel'} via coastal receiver.`, badge: "AIS TELEMETRY", type: "info", category: "ANOMALY" },
      { text: `Hydrodynamic drift calculation updated: Surface current vector ${activeIncident.environment?.currentSpeedMs} m/s towards ${activeIncident.environment?.currentDirectionText}.`, badge: "DRIFT MODEL", type: "info", category: "HINDCAST" },
      { text: `VHF Channel 16 maritime security advisory acknowledgement received from nearby commercial vessels.`, badge: "COMMS", type: "info", category: "DISPATCH" },
      { text: `SAR synthetic aperture dark patch segmentation updated: Perimeter ${activeIncident.spillPerimeterKm || 22.4} km.`, badge: "SEGMENTATION", type: "critical", category: "CRITICAL" },
      { text: `Coast Guard MRCC Mumbai synchronizing sector boundary coordinates with Pollution Response Unit.`, badge: "INTERCEPT", type: "warning", category: "DISPATCH" }
    ];

    const interval = setInterval(() => {
      const randomEvt = streamTemplates[Math.floor(Math.random() * streamTemplates.length)];
      const nowUtc = new Date().toISOString().substring(11, 16) + " UTC";
      setLiveEvents(prev => [
        {
          id: Date.now(),
          time: nowUtc,
          text: randomEvt.text,
          badge: randomEvt.badge,
          type: randomEvt.type,
          category: randomEvt.category
        },
        ...prev.slice(0, 19)
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, [isAutoStreamActive, activeIncident]);

  const filteredLiveEvents = useMemo(() => {
    if (eventCategoryFilter === 'ALL') return liveEvents;
    return liveEvents.filter(e => e.category === eventCategoryFilter);
  }, [liveEvents, eventCategoryFilter]);

  // 10. NAVTEX Broadcast Message Generator
  const navtexMessageText = useMemo(() => {
    return `NAVTEX EMERGENCY MARITIME WARNING // MRCC-IN-${activeIncident.internalId || '0921'}
ISSUED: ${new Date().toUTCString()}
SUBJ: HYDROCARBON SPILL & NAVIGATIONAL RESTRICTION ZONE
LOCATION: ${activeIncident.coordinates?.display || '14.8214°N 68.2108°E'} (${activeIncident.region})
AFFECTED SURFACE AREA: ${activeIncident.spillAreaKm2} SQ KM
EXCLUSION RADIUS: 5.0 NAUTICAL MILES ENCIRCLING INCIDENT CENTROID

ALL VESSELS IN TRANSIT ARE DIRECTED:
1. MAINTAIN CONTINUOUS RADIO WATCH ON VHF CH 16 / MF 2182 KHZ.
2. AVOID SURFACE DISCHARGE INTERCEPTION CONVERGENCE.
3. REPORT ANY DETECTED OILY SHEEN OR BLACK WATER WAKE TO MARITIME RESCUE COORDINATION CENTRE.
4. COMMERCIAL TRAFFIC REDUCE SPEED TO <8 KNOTS WITHIN 10 NM.

ISSUED BY: COAST GUARD MARITIME POLICING & ENVIRONMENTAL PROTECTION DIVISION.
// MARITIME SAFETY INFORMATION (MSI) MESSAGE ENDS //`;
  }, [activeIncident]);

  // 11. Situation Report (SITREP) Generator
  const sitrepReportText = useMemo(() => {
    return `================================================================================
CLASSIFIED // SITUATION REPORT (SITREP) - SENSITIVE MARITIME INVESTIGATION
MARINESIGHT FORENSIC DISCHARGE & VESSEL ATTRIBUTION PLATFORM
DATE/TIME: ${new Date().toUTCString()}
INCIDENT ID: ${activeIncident.incidentId} (${activeIncident.internalId})
REGIONAL SECTOR: ${activeIncident.region}
COORDINATES: ${activeIncident.coordinates?.display}
--------------------------------------------------------------------------------
1. CURRENT THREAT POSTURE
   - MARSEC READINESS LEVEL: ${marsecLevel} (${marsecLevel === 3 ? 'CRITICAL POLLUTION ACTIVE' : marsecLevel === 2 ? 'HEIGHTENED INTERCEPT' : 'NORMAL PATROL'})
   - SPILL SURFACE AREA: ${activeIncident.spillAreaKm2} km²
   - ESTIMATED SLICK PERIMETER: ${activeIncident.spillPerimeterKm || 22.4} km
   - DETECTION METHOD: Sentinel-1 C-SAR Radar / Level-1 GRD (Confidence: ${activeIncident.detectionConfidence || 96.8}%)
   - ESTIMATED DRIFT AGE: ${activeIncident.estimatedAgeHours || 38.4} hours

2. SUSPECT VESSEL FORENSIC ATTRIBUTION
   - LEAD SUSPECT: ${activeIncident.topVessel?.name || 'MV Star Atlantic'}
   - ATTRIBUTION PRIORITY SCORE: ${activeIncident.topVessel?.priorityScore || 91.4} / 100
   - FLAG STATE / REGISTRY: ${activeIncident.topVessel?.flag || 'Panama'} (IMO: ${activeIncident.topVessel?.imo || 9876543})
   - ANOMALOUS DARK AIS WINDOW: ${activeIncident.topVessel?.aisBlackoutDurationMin || 142} minutes
   - RECONSTRUCTED SPEED DROP: ${activeIncident.topVessel?.speedDropKn || '14.2 kn -> 4.8 kn'}

3. COUPLED METOCEAN ENVIRONMENT
   - SEA SURFACE CURRENT: ${activeIncident.environment?.currentSpeedMs} m/s (Heading: ${activeIncident.environment?.currentDirectionText})
   - PREVAILING SURFACE WIND: ${activeIncident.environment?.windSpeedKn} knots (Heading: ${activeIncident.environment?.windDirectionText})
   - PREDICTED SHORELINE CONVERGENCE: Projected within 48 to 72 hours
   - NEAREST ECOLOGICAL SANCTUARY: Mangrove & Coral Biosphere (Distance: ~36.5 NM)

4. ASSET DISPATCH STATUS
${responderAssets.map(a => `   - ${a.name} [${a.type}]: ${a.status.toUpperCase()} (ETA: ${a.etaMin}m | Base: ${a.base})`).join('\n')}

RECOMMENDED IMMEDIATE ACTION:
- Maintain containment boom curtain around southeastern slick leading edge.
- Dispatch Coast Guard boarding party to execute fuel-oil bunker sampling for chemical fingerprint verification.
================================================================================`;
  }, [activeIncident, marsecLevel, responderAssets]);

  const handleTransmitNavtex = () => {
    soundSynth.playVhfRadioChirp();
    setNavtexTransmitting(true);
    setTimeout(() => {
      setNavtexTransmitting(false);
      setNavtexTransmitted(true);
      const nowUtc = new Date().toISOString().substring(11, 16) + " UTC";
      setLiveEvents(prev => [
        {
          id: Date.now(),
          time: nowUtc,
          text: `Emergency NAVTEX VHF Broadcast 0921 transmitted to all vessels in ${activeIncident.regionShort} EEZ.`,
          badge: "NAVTEX",
          type: "critical",
          category: "DISPATCH"
        },
        ...prev
      ]);
    }, 1800);
  };

  const copyToClipboard = (text, label) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2500);
    }
  };

  const kpiCards = [
    { title: "ACTIVE REGIONS", value: `${allIncidents.length}`, change: "6 live maritime zones", alert: false, color: "text-ocean-deep" },
    { title: "CURRENT SLICK AREA", value: `${activeIncident.spillAreaKm2} km²`, change: `${activeIncident.regionShort}`, alert: true, color: "text-status-danger" },
    { title: "VESSELS MONITORED", value: `${activeIncident.candidateCount * 120 + 380}`, change: "AIS + SAR sync", alert: false, color: "text-ocean" },
    { title: "LEAD ATTRIBUTION", value: `${activeIncident.topVessel?.priorityScore || 91.4}/100`, change: activeIncident.topVessel?.name, alert: true, color: "text-status-warning" },
    { title: "HINDCAST ORIGIN", value: `${activeIncident.hindcast?.originZoneA?.confidence || 72.4}%`, change: "Zone A converged", alert: false, color: "text-ocean-bright" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Top Banner & Header with Mission Chronometer & MARSEC Readiness */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight flex items-center gap-2">
              <span>Maritime Intelligence Command Center</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
              REAL GIS ACTIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-ocean-sky text-ocean-deep border border-ocean/20 text-[10px] font-bold font-mono">
              ORBITAL PASS: {formatCountdown(nextPassSeconds)}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Tactical situational awareness, orbital SAR hydrocarbon segmentation, and Coast Guard rapid attribution coordination.
          </p>
        </div>

        {/* Tactical Controls: MARSEC Level, Audio Siren, SITREP, NAVTEX */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* MARSEC Level Selector */}
          <div className="flex items-center bg-ocean-light border border-border-marine rounded-xl p-1 shadow-inner">
            <span className="text-[10px] font-mono font-bold text-text-muted px-2 uppercase">MARSEC</span>
            <button
              onClick={() => setMarsecLevel(1)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                marsecLevel === 1 ? 'bg-emerald-600 text-white shadow-sm' : 'text-text-secondary hover:text-ocean-navy'
              }`}
            >
              LVL 1
            </button>
            <button
              onClick={() => setMarsecLevel(2)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                marsecLevel === 2 ? 'bg-amber-500 text-white shadow-sm' : 'text-text-secondary hover:text-ocean-navy'
              }`}
            >
              LVL 2
            </button>
            <button
              onClick={() => setMarsecLevel(3)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                marsecLevel === 3 ? 'bg-status-danger text-white shadow-sm ring-1 ring-red-400' : 'text-text-secondary hover:text-ocean-navy'
              }`}
            >
              LVL 3
            </button>
          </div>

          {/* Web Audio Acoustic Siren Toggle */}
          <button
            onClick={toggleSiren}
            title={isSirenActive ? "Silence Tactical Siren" : "Arm Acoustic Siren"}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              isSirenActive
                ? 'bg-red-500 text-white border-red-600 shadow-radar-glow animate-pulse'
                : 'bg-white text-text-secondary border-border-marine hover:border-ocean hover:text-ocean'
            }`}
          >
            {isSirenActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isSirenActive ? "SIREN ARMED" : "AUDIO ALERT"}</span>
          </button>

          {/* Emergency NAVTEX Broadcast Trigger */}
          <button
            onClick={() => setShowNavtexModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-marine-sm transition-all flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>NAVTEX Alert</span>
          </button>

          {/* Quick SITREP Generator Trigger */}
          <button
            onClick={() => setShowSitrepModal(true)}
            className="px-3 py-1.5 rounded-xl bg-ocean-deep hover:bg-ocean-navy text-white text-xs font-bold shadow-marine-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>SITREP</span>
          </button>

          {/* Open Case Details Button */}
          <button 
            onClick={() => onNavigate("workspace")}
            className="px-3 py-1.5 rounded-xl bg-ocean hover:bg-ocean-hover text-white text-xs font-bold shadow-marine-sm transition-all flex items-center gap-1.5"
          >
            <span>Case {activeIncidentId}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MARSEC Emergency Warning Banner (Shows when MARSEC is 3) */}
      {marsecLevel === 3 && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-xl p-2.5 text-white flex flex-wrap items-center justify-between gap-3 shadow-marine-md">
          <div className="flex items-center gap-2 text-xs font-bold font-mono">
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span className="tracking-wide">MARSEC LEVEL 3 // EMERGENCY HYDROCARBON CONTAINMENT ACTIVE</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
              T+ {formatChronometer(elapsedSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/90 text-[11px]">
              Zone: <strong>{activeIncident.region}</strong> | Suspect: <strong>{activeIncident.topVessel?.name}</strong>
            </span>
            <button
              onClick={() => onNavigate("response-plan")}
              className="bg-white text-status-danger px-2.5 py-1 rounded-lg font-bold text-[11px] hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <span>Deploy Booms</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="p-3.5 bg-white border border-border-marine rounded-xl shadow-marine-sm flex flex-col justify-between hover:border-ocean/40 transition-all">
            <span className="text-[10px] font-bold text-text-muted font-mono uppercase tracking-wider">
              {kpi.title}
            </span>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${kpi.color}`}>
              {kpi.value}
            </div>
            <span className="text-[10px] text-text-secondary mt-1 font-medium truncate">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid: GIS Viewport (Col 8) + Right Panel (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Operational Canvas & Responder Dock (Col 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col">
            
            {/* GIS Canvas Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-border-marine text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ocean-navy">Operational Surface GIS Canvas</span>
                <span className="text-[10px] font-mono text-ocean-deep bg-ocean-sky/60 px-2 py-0.5 rounded border border-ocean/30 font-semibold flex items-center gap-1">
                  <span>{activeIncident.flagEmoji}</span>
                  <span>{activeIncident.region} · {activeIncident.coordinates?.display}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-text-muted">
                  Perimeter: <strong className="text-ocean-navy">{activeIncident.spillPerimeterKm || 22.4} km</strong>
                </span>
                <button 
                  onClick={() => onNavigate("live-monitor")}
                  className="text-xs text-ocean hover:text-ocean-deep font-semibold flex items-center gap-1"
                >
                  <span>Full Monitor</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tactical Layer Quick-Toggle Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-2 border-b border-border-marine/60 text-[11px] font-mono bg-ocean-light/40 p-1.5 rounded-lg overflow-x-auto">
              <span className="text-[10px] text-text-muted font-bold px-1 uppercase flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                <span>Layers:</span>
              </span>
              
              <button
                onClick={() => toggleOverlay('vessels')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.vessels ? 'bg-ocean text-white border-ocean' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Vessels & AIS
              </button>

              <button
                onClick={() => toggleOverlay('oilSpills')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.oilSpills ? 'bg-status-danger text-white border-status-danger' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Spill Polygon
              </button>

              <button
                onClick={() => toggleOverlay('windVectors')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.windVectors ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Wind Vector
              </button>

              <button
                onClick={() => toggleOverlay('currentVectors')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.currentVectors ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Current Streamlines
              </button>

              <button
                onClick={() => toggleOverlay('sourceZone')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.sourceZone ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Origin Zone A
              </button>

              <button
                onClick={() => toggleOverlay('exclusionRing')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.exclusionRing ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                5 NM Exclusion
              </button>

              <button
                onClick={() => toggleOverlay('ecoSanctuary')}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold transition-all ${
                  tacticalOverlays.ecoSanctuary ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                }`}
              >
                Eco Sanctuary
              </button>
            </div>

            {/* Map Viewport */}
            <div className="flex-1 relative isolate z-0">
              <GISMapMock 
                mode="general" 
                caseData={activeIncident}
                activeLayers={tacticalOverlays}
                height="h-[340px] sm:h-[460px]"
                onSelectSpill={() => onNavigate("workspace")}
                onSelectVessel={() => onNavigate("vessel-intel")}
              />
            </div>

            {/* Bottom Analytics Strip inside map container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-3 border-t border-border-marine text-xs">
              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted font-mono block">OIL SPILL DETECTION</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-ocean-navy font-mono">{activeIncident.spillAreaKm2} km²</span>
                  <span className="text-[10px] text-status-danger font-semibold">● {activeIncident.riskLevel}</span>
                </div>
                <div className="h-4 flex items-end gap-1 mt-1">
                  <span className="w-2 h-1 bg-ocean/40 rounded-sm"></span>
                  <span className="w-2 h-1.5 bg-ocean/40 rounded-sm"></span>
                  <span className="w-2 h-2 bg-ocean/60 rounded-sm"></span>
                  <span className="w-2 h-2.5 bg-ocean/60 rounded-sm"></span>
                  <span className="w-2 h-3.5 bg-ocean rounded-sm"></span>
                  <span className="w-2 h-4 bg-status-danger rounded-sm animate-pulse"></span>
                </div>
              </div>

              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted font-mono block">VESSEL CORRIDOR DENSITY</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-ocean-navy font-mono">{activeIncident.candidateCount} Tracked</span>
                  <span className="text-[10px] text-status-warning font-semibold">1 Suspect Flagged</span>
                </div>
                <div className="w-full bg-border-marine/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-ocean h-full w-3/4"></div>
                </div>
              </div>

              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted font-mono block">COUPLED HYDRODYNAMICS</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-bold text-ocean-deep font-mono">{activeIncident.environment?.currentSpeedMs} m/s</span>
                  <span className="text-[10px] text-text-muted font-semibold">{activeIncident.environment?.currentDirectionText}</span>
                </div>
                <div className="w-full bg-border-marine/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-ocean-deep h-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Coast Guard Intercept & Fast Response Readiness HUD */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-ocean" />
                <h3 className="font-bold text-xs text-ocean-navy">COAST GUARD RAPID RESPONSE & INTERCEPT DOCK</h3>
              </div>
              <span className="text-[10px] font-mono text-ocean-deep font-bold bg-ocean-sky px-2 py-0.5 rounded border border-ocean/20">
                3 Tactical Units Assigned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {responderAssets.map((asset) => {
                const IconComponent = asset.icon;
                const isDispatched = asset.status === 'Intercepting' || asset.status === 'On Station';
                return (
                  <div 
                    key={asset.id} 
                    className={`p-3 rounded-xl border transition-all ${
                      isDispatched 
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/50' 
                        : 'bg-ocean-light/50 border-border-marine hover:border-ocean/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isDispatched ? 'bg-amber-500 text-white' : 'bg-ocean-sky text-ocean'}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold font-mono text-ocean-navy text-xs leading-tight">{asset.name}</div>
                          <div className="text-[10px] text-text-muted">{asset.type}</div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        asset.status === 'On Station' ? 'bg-emerald-100 text-emerald-700' :
                        asset.status === 'Intercepting' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {asset.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-border-marine/60 text-[11px] font-mono space-y-1">
                      <div className="flex justify-between text-text-secondary">
                        <span>Distance to Slick:</span>
                        <strong className="text-ocean-navy">{asset.distanceNm} NM</strong>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Transit Speed:</span>
                        <span className="text-text-primary">{asset.speedKn} knots</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Intercept ETA:</span>
                        <strong className="text-status-danger">{asset.etaMin} min</strong>
                      </div>
                      <div className="text-[9px] text-text-muted truncate pt-1">
                        Equip: {asset.equipment}
                      </div>
                    </div>

                    <button
                      onClick={() => handleScrambleAsset(asset.id)}
                      className={`w-full mt-2.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
                        asset.status === 'Standby'
                          ? 'bg-ocean hover:bg-ocean-deep text-white shadow-marine-sm'
                          : asset.status === 'Intercepting'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      <span>{asset.status === 'Standby' ? 'Scramble Intercept' : asset.status === 'Intercepting' ? 'Confirm On Station' : 'Reset Standby'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Intelligence & Incident Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Regional Scenarios List & Search Filter */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-status-danger" />
                <h3 className="font-bold text-xs text-ocean-navy">REGIONAL SCENARIOS</h3>
              </div>
              <span className="text-[10px] font-mono text-ocean font-bold">
                {filteredIncidents.length} / {allIncidents.length} Active
              </span>
            </div>

            {/* Search and Risk Level Filter Chips */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search region, vessel, ID..."
                  value={scenarioSearch}
                  onChange={(e) => setScenarioSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 rounded-lg border border-border-marine text-xs bg-ocean-light/50 focus:outline-none focus:border-ocean text-ocean-navy"
                />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
                {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map(level => (
                  <button
                    key={level}
                    onClick={() => setScenarioFilter(level)}
                    className={`px-2 py-0.5 rounded-full border transition-all ${
                      scenarioFilter === level 
                        ? 'bg-ocean text-white border-ocean font-bold' 
                        : 'bg-white text-text-secondary border-border-marine hover:border-ocean/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Incidents List Container */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-0.5">
              {filteredIncidents.map((inc) => (
                <div 
                  key={inc.id}
                  onClick={() => selectIncident(inc.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    inc.id === activeIncidentId 
                      ? 'bg-ocean-sky/60 border-ocean shadow-sm ring-1 ring-ocean/30' 
                      : 'bg-ocean-light/40 border-border-marine hover:bg-ocean-sky/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold font-mono text-ocean-navy flex items-center gap-1.5">
                      <span>{inc.flagEmoji}</span>
                      <span>{inc.regionShort}</span>
                      <span className="text-[10px] text-text-muted font-normal">({inc.id})</span>
                    </span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded-full border ${inc.riskColor}`}>
                      {inc.risk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-text-secondary">
                    <span>Target: <strong>{inc.topCandidate}</strong></span>
                    <span className="font-mono font-semibold text-ocean-deep">{inc.areaKm2} km²</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-text-muted font-mono">
                    <span>Conf: {inc.confidence}%</span>
                    <span className="text-ocean font-semibold hover:underline">
                      {inc.id === activeIncidentId ? '● Active Region' : 'Select Region →'}
                    </span>
                  </div>
                </div>
              ))}
              {filteredIncidents.length === 0 && (
                <div className="text-center py-4 text-xs text-text-muted">
                  No regional scenarios matched your search filter.
                </div>
              )}
            </div>
          </div>

          {/* Live Real-time Event Feed & Streaming Simulator */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-ocean" />
                <h3 className="font-bold text-xs text-ocean-navy">SURVEILLANCE EVENT FEED</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoStreamActive(!isAutoStreamActive)}
                  title={isAutoStreamActive ? "Pause Auto Stream" : "Resume Auto Stream"}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border flex items-center gap-1 font-bold ${
                    isAutoStreamActive ? 'bg-emerald-50 text-status-success border-emerald-200' : 'bg-slate-100 text-text-muted border-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isAutoStreamActive ? 'bg-status-success animate-ping' : 'bg-slate-400'}`}></span>
                  <span>{isAutoStreamActive ? 'LIVE' : 'PAUSED'}</span>
                </button>
              </div>
            </div>

            {/* Event Category Filter Buttons */}
            <div className="flex items-center gap-1 text-[10px] font-mono pb-2 overflow-x-auto">
              {['ALL', 'CRITICAL', 'ANOMALY', 'HINDCAST', 'DISPATCH'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setEventCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-md border text-[9px] transition-all ${
                    eventCategoryFilter === cat
                      ? 'bg-ocean text-white border-ocean font-bold'
                      : 'bg-white text-text-secondary border-border-marine hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Feed Event Items */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-0.5">
              {filteredLiveEvents.map((evt) => (
                <div key={evt.id} className="flex items-start gap-2 text-xs hover:bg-ocean-light/40 p-1 rounded-lg transition-all">
                  <span className="font-mono text-[9px] text-text-muted whitespace-nowrap mt-0.5">
                    {evt.time}
                  </span>
                  <div className="flex-1">
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold mr-1.5 inline-block ${
                      evt.type === 'critical' ? 'bg-red-100 text-status-danger' : 
                      evt.type === 'warning' ? 'bg-amber-100 text-status-warning' : 
                      'bg-blue-100 text-ocean'
                    }`}>
                      {evt.badge}
                    </span>
                    <span className="text-text-primary text-[11px] leading-tight">
                      {evt.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: EMERGENCY NAVTEX / VHF CH 16 BROADCAST SIMULATOR */}
      {showNavtexModal && (
        <div className="fixed inset-0 bg-ocean-navy/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border-marine shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-marine pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-ocean-navy">
                    VHF Channel 16 & NAVTEX Broadcast Dispatcher
                  </h3>
                  <p className="text-xs text-text-secondary">
                    International Maritime Organization (IMO) Standard Navigation Safety Warning
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setShowNavtexModal(false); setNavtexTransmitted(false); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Area Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-ocean-light p-3 rounded-xl border border-border-marine">
              <div>
                <span className="text-text-muted text-[10px] block">FREQUENCY</span>
                <strong className="text-ocean-navy">VHF CH 16 / 518 kHz</strong>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">SECTOR</span>
                <strong className="text-ocean-navy">{activeIncident.regionShort}</strong>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">COORDINATES</span>
                <strong className="text-ocean-navy">{activeIncident.coordinates?.display}</strong>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">RESTRICTION</span>
                <strong className="text-status-danger">5.0 NM Safety Zone</strong>
              </div>
            </div>

            {/* NAVTEX Message Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold font-mono text-ocean-navy flex items-center justify-between">
                <span>NAVTEX TELETYPE MESSAGE PAYLOAD</span>
                <span className="text-[10px] text-text-muted font-normal">Ready for radio modulation</span>
              </label>
              <pre className="p-3.5 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                {navtexMessageText}
              </pre>
            </div>

            {/* Transmission confirmation message */}
            {navtexTransmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-status-success font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-success" />
                <span>NAVTEX warning successfully modulated and broadcast across maritime band (34 coastal AIS stations acknowledge reception).</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-marine">
              <button
                onClick={() => copyToClipboard(navtexMessageText, 'navtex')}
                className="px-3.5 py-2 rounded-xl border border-border-marine hover:bg-slate-50 text-xs font-bold text-ocean-navy flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4 text-ocean" />
                <span>{copySuccess === 'navtex' ? 'Copied to Clipboard!' : 'Copy Teletype Text'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNavtexModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  disabled={navtexTransmitting}
                  onClick={handleTransmitNavtex}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-marine-md flex items-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{navtexTransmitting ? 'Transmitting Radio Signal...' : 'Simulate VHF / NAVTEX Transmission'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SITUATION REPORT (SITREP) GENERATOR */}
      {showSitrepModal && (
        <div className="fixed inset-0 bg-ocean-navy/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-border-marine shadow-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border-marine pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-ocean-navy text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-ocean-navy">
                    Executive Maritime Situation Report (SITREP)
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Standardized Indian Coast Guard & DG Shipping Case Briefing Document
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSitrepModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SITREP Preview Area */}
            <div className="flex-1 overflow-y-auto bg-ocean-light/60 p-4 rounded-xl border border-border-marine">
              <pre className="font-mono text-xs text-ocean-navy whitespace-pre-wrap leading-relaxed">
                {sitrepReportText}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-marine">
              <button
                onClick={() => copyToClipboard(sitrepReportText, 'sitrep')}
                className="px-3.5 py-2 rounded-xl border border-border-marine hover:bg-slate-50 text-xs font-bold text-ocean-navy flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4 text-ocean" />
                <span>{copySuccess === 'sitrep' ? 'SITREP Copied!' : 'Copy SITREP Text'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="px-3.5 py-2 rounded-xl border border-border-marine hover:bg-slate-50 text-xs font-bold text-ocean-navy flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-4 h-4 text-ocean" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => {
                    setShowSitrepModal(false);
                    onNavigate("report-system");
                  }}
                  className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-sm flex items-center gap-1.5"
                >
                  <span>Open Full Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
