import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Rewind,
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Crosshair, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Radio, 
  CheckCircle, 
  Bell, 
  Search, 
  Compass, 
  Navigation, 
  Ship, 
  Wind, 
  Activity, 
  X, 
  Send, 
  Anchor, 
  RefreshCw, 
  Sliders, 
  Check, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  ExternalLink, 
  ShieldCheck, 
  Clock,
  Copy,
  Waves,
  Target,
  CheckCheck,
  ListFilter,
  Camera,
  FileText,
  Droplets,
  SlidersHorizontal,
  Tag,
  Gauge
} from 'lucide-react';
import GISRealMap from '../components/gis/GISRealMap';
import { useIncident } from '../context/IncidentContext';
import { getFullSimulationPhysicsState } from '../utils/simulationPhysics';

// New Advanced Frontend-Only Modular Components
import EblVrmModal from '../components/liveMonitor/EblVrmModal';
import MetOceanBuoyCard from '../components/liveMonitor/MetOceanBuoyCard';
import GeofenceSentryCard from '../components/liveMonitor/GeofenceSentryCard';
import FlirCameraFeed from '../components/liveMonitor/FlirCameraFeed';
import SecurityLevelSelector from '../components/liveMonitor/SecurityLevelSelector';
import DeckLogbookDrawer from '../components/liveMonitor/DeckLogbookDrawer';
import OilWeatheringGauge from '../components/liveMonitor/OilWeatheringGauge';
import DarkVesselMatrix from '../components/liveMonitor/DarkVesselMatrix';
import TacticalVoiceAnnunciator, { announceVoiceMessage } from '../components/liveMonitor/TacticalVoiceAnnunciator';

export default function Page03LiveMonitor({ onNavigate }) {
  const { activeIncident } = useIncident();

  // 1. Smooth Continuous Simulation Engine State
  const [simHour, setSimHour] = useState(15.0); // 0.0 to 24.0h, default 15.0h = 15:00 UTC (NOW)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState("1x"); // "0.5x", "1x", "2x", "5x"
  const [muted, setMuted] = useState(false);
  const [liveUtcClock, setLiveUtcClock] = useState('');

  // 2. Tactical Layer Toggles
  const [activeLayers, setActiveLayers] = useState({
    satellite: false,
    oilSpills: true,
    vessels: true,
    aisTracks: true,
    coastalRadar: true,
    windVectors: true,
    currentVectors: true,
    particles: false,
    riskZones: false
  });

  // 3. Tactical Navigation & Security Level
  const [eblModalOpen, setEblModalOpen] = useState(false);
  const [securityLevel, setSecurityLevel] = useState("ISPS_2");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(1.0);

  // 4. Right Column Tab Dock
  // Tabs: "hud" (HUD & Alerts), "flir" (Airborne FLIR), "metocean" (Buoy MetOcean), "geofence" (MPA Sentry), "weathering" (Oil Weathering), "dark" (Dark Targets), "logbook" (Deck Log)
  const [activeRightTab, setActiveRightTab] = useState("hud");

  // 5. Target Inspection & Fleet State
  const [selectedVessel, setSelectedVessel] = useState(activeIncident?.topVessel || null);
  const [focusLocation, setFocusLocation] = useState(null);
  const [interceptorDispatched, setInterceptorDispatched] = useState(false);
  const [interceptorEtaSec, setInterceptorEtaSec] = useState(1365); // ~22 mins
  const [vhfDialogOpen, setVhfDialogOpen] = useState(false);
  const [vhfTransmitting, setVhfTransmitting] = useState(false);
  const [vhfHistory, setVhfHistory] = useState([
    { sender: "MRCC COASTAL", time: "14:52 UTC", text: "SECURITÉ SECURITÉ - All vessels in Sector 4 report sea surface anomalies." },
    { sender: "M/V OCEAN STAR", time: "14:54 UTC", text: "MRCC, this is Ocean Star. Copy transmission. Transit normal, heading 284° at 12.4 kn." }
  ]);

  // 6. Fleet Filtering & Tactical Tagging
  const [vesselSearch, setVesselSearch] = useState("");
  const [vesselTypeFilter, setVesselTypeFilter] = useState("ALL");
  const [vesselMinSpeed, setVesselMinSpeed] = useState(0);
  const [tacticalTags, setTacticalTags] = useState({
    "419001248": "SUSPECT",
    "352001890": "SHADOW"
  });

  // 7. Watchkeeper Deck Logbook State
  const [deckLogs, setDeckLogs] = useState([
    {
      time: "14:32 UTC",
      category: "SAR DETECTION",
      officer: "Satellite Ground Link",
      text: `Sentinel-1 SAR scene flagged anomalous slick (14.7 km²) in Sector 4.`
    },
    {
      time: "14:48 UTC",
      category: "KINEMATICS",
      officer: "Automated Kinematic Sentry",
      text: `AIS blackout gap (38 min) flagged on M/V Ocean Star during origin transit.`
    },
    {
      time: "15:00 UTC",
      category: "VTS RADAR",
      officer: "Watch Officer",
      text: `Coastal VTS Radar active. ISPS Security Level set to Level 2 (Heightened Surveillance).`
    }
  ]);

  const addDeckLog = (entry) => {
    setDeckLogs(prev => [
      {
        time: entry.time || new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC',
        category: entry.category || "OPERATIONAL",
        officer: entry.officer || "Duty Surveillance Officer",
        text: entry.text
      },
      ...prev
    ]);
  };

  // 8. Alert Center State
  const [alertFilter, setAlertFilter] = useState("ALL"); // ALL, UNACKNOWLEDGED, CRITICAL, HIGH, MEDIUM, LOW
  const [alertSearch, setAlertSearch] = useState("");
  const [alerts, setAlerts] = useState([
    {
      id: "ALT-01",
      severity: "CRITICAL",
      badgeColor: "bg-red-50 text-status-danger border-red-200",
      title: "Potential Oil Spill Detected",
      desc: `Sentinel-1 SAR scene flagged ${activeIncident?.spillAreaKm2 || 42.8} km² slick in ${activeIncident?.regionShort || 'West Coast'}.`,
      target: "workspace",
      lat: activeIncident?.coordinates?.lat || 14.8214,
      lng: activeIncident?.coordinates?.lng || 68.2108,
      acknowledged: false,
      timestamp: "14:48 UTC"
    },
    {
      id: "ALT-02",
      severity: "HIGH",
      badgeColor: "bg-amber-50 text-status-warning border-amber-200",
      title: "AIS Communication Blackout Gap",
      desc: `Target ${activeIncident?.topVessel?.name || 'MV Ocean Star'} silent for ${activeIncident?.topVessel?.aisBlackoutDurationMin || 38} min during origin transit.`,
      target: "trajectory",
      lat: (activeIncident?.coordinates?.lat || 14.8214) + 0.12,
      lng: (activeIncident?.coordinates?.lng || 68.2108) + 0.18,
      acknowledged: false,
      timestamp: "14:55 UTC"
    },
    {
      id: "ALT-03",
      severity: "HIGH",
      badgeColor: "bg-amber-50 text-status-warning border-amber-200",
      title: "Unidentified Non-AIS Radar Echo",
      desc: `High RCS (~38 dBm²) surface echo detected 4.6 NM southwest of slick without AIS transponder transmission.`,
      target: "vessel-intel",
      lat: (activeIncident?.coordinates?.lat || 14.8214) - 0.15,
      lng: (activeIncident?.coordinates?.lng || 68.2108) - 0.22,
      acknowledged: false,
      timestamp: "15:01 UTC"
    },
    {
      id: "ALT-04",
      severity: "MEDIUM",
      badgeColor: "bg-blue-50 text-status-info border-blue-200",
      title: "Unusual Vessel Deceleration",
      desc: `Kinematic speed dropped precipitously to ${activeIncident?.topVessel?.speedDropKn?.split('→')[1] || '3.8 kn'} in spill vicinity.`,
      target: "vessel-intel",
      lat: (activeIncident?.coordinates?.lat || 14.8214) + 0.08,
      lng: (activeIncident?.coordinates?.lng || 68.2108) + 0.28,
      acknowledged: false,
      timestamp: "14:32 UTC"
    },
    {
      id: "ALT-05",
      severity: "LOW",
      badgeColor: "bg-slate-50 text-text-secondary border-slate-200",
      title: "Coastal Landfall Threat Window",
      desc: `Lagrangian particle trajectory indicates potential landfall window in 48-64h along sensitive shoreline.`,
      target: "simulation",
      lat: (activeIncident?.coordinates?.lat || 14.8214) - 0.05,
      lng: (activeIncident?.coordinates?.lng || 68.2108) + 0.45,
      acknowledged: true,
      timestamp: "13:15 UTC"
    }
  ]);

  // 9. Streaming NMEA Telemetry Console
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [telemetryPaused, setTelemetryPaused] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [telemetryLogs, setTelemetryLogs] = useState([
    { id: 1, mmsi: "419001248", raw: "!AIVDM,1,1,,B,13aEO:0P00PD2w?M>4A00?v>2<0,0*26", decoded: `MMSI: 419001248 | SOG: 12.4 kn | COG: 284° | STATUS: UNDERWAY` },
    { id: 2, mmsi: "352001890", raw: "!AIVDM,1,1,,A,15N8>b001n8e=sTM6n:rV4<00800,0*79", decoded: "MMSI: 352001890 | SOG: 11.2 kn | COG: 045° | STATUS: UNDERWAY" },
    { id: 3, mmsi: "RADAR", raw: "!AIVDM,1,1,,B,402=62iuiw33a2<Gk11@00000000,0*34", decoded: "RADAR BASE: COASTAL VTS | TARGETS TRACKED: 48 | SWEEP: 360°" }
  ]);
  const [packetCount, setPacketCount] = useState(2847);

  // Timeline Milestones
  const timelineMilestones = [
    { hour: 0, label: "00:00 UTC", simKey: "T+0", tag: "Baseline Transit" },
    { hour: 6, label: "06:00 UTC", simKey: "T+6", tag: "SAR Satellite Pass" },
    { hour: 12, label: "12:00 UTC", simKey: "T+12", tag: "AIS Gap Detected" },
    { hour: 15, label: "15:00 UTC (NOW)", simKey: "T+15", tag: "Active Slick Intercept" },
    { hour: 18, label: "18:00 UTC", simKey: "T+18", tag: "Forecast Drift Window" },
    { hour: 24, label: "24:00 UTC", simKey: "T+24", tag: "Landfall Forecast" }
  ];

  // Check if we are in live mode (around 15:00 UTC)
  const isLiveMode = Math.abs(simHour - 15.0) < 0.25;

  // Web Audio Synthesizer for Tactical Feedback
  const playSound = (type = 'ping') => {
    if (muted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'ping') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'ack') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
      } else if (type === 'radio') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch (e) {
      // Handled silently
    }
  };

  // Real-Time UTC Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utcString = now.toUTCString().split(' ')[4] + ' UTC';
      setLiveUtcClock(utcString);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Interceptor Countdown Timer
  useEffect(() => {
    if (!interceptorDispatched) return;
    const interval = setInterval(() => {
      setInterceptorEtaSec((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [interceptorDispatched]);

  // Compute Multi-Physics Simulation State with Smooth Continuous simHour
  const simPhysics = useMemo(() => {
    return getFullSimulationPhysicsState(activeIncident, simHour, {
      windageRatio: 0.03,
      currentMultiplier: 1.0,
      particleCount: 220
    });
  }, [activeIncident, simHour]);

  // High-Performance Smooth 60 FPS requestAnimationFrame Simulation Playback Loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animFrameId;

    const speedRates = {
      "0.5x": 0.15,
      "1x": 0.45,
      "2x": 1.2,
      "5x": 3.0
    };

    const loop = (currentTime) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const rate = speedRates[playSpeed] || 0.45;

      setSimHour((prev) => {
        let next = prev + dt * rate;
        if (next >= 24) {
          next = 0;
        }
        return next;
      });

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isPlaying, playSpeed]);

  // Streaming NMEA Generator
  useEffect(() => {
    if (telemetryPaused) return;

    const streamInterval = setInterval(() => {
      setPacketCount(p => p + 1);
      const mmsiList = ["419001248", "352001890", "636019822", "477218900"];
      const randMmsi = mmsiList[Math.floor(Math.random() * mmsiList.length)];
      const randSpeed = (10 + Math.random() * 4).toFixed(1);
      const randCog = Math.floor(Math.random() * 360);
      const randRaw = `!AIVDM,1,1,,${Math.random() > 0.5 ? 'A' : 'B'},${Math.random().toString(36).substring(2, 15).toUpperCase()},0*${Math.floor(Math.random() * 89 + 10)}`;

      setTelemetryLogs(prev => [
        {
          id: Date.now(),
          mmsi: randMmsi,
          raw: randRaw,
          decoded: `MMSI: ${randMmsi} | SOG: ${randSpeed} kn | COG: ${randCog}° | TIME: ${new Date().toISOString().substring(11, 19)}Z`
        },
        ...prev.slice(0, 24)
      ]);
    }, 2400);

    return () => clearInterval(streamInterval);
  }, [telemetryPaused]);

  // Filter Alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesFilter = 
      alertFilter === "ALL" || 
      (alertFilter === "UNACKNOWLEDGED" && !a.acknowledged) ||
      a.severity === alertFilter;
    const matchesSearch = alertSearch === "" || 
      a.title.toLowerCase().includes(alertSearch.toLowerCase()) || 
      a.desc.toLowerCase().includes(alertSearch.toLowerCase()) ||
      a.id.toLowerCase().includes(alertSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeAlertCount = alerts.filter(a => !a.acknowledged).length;

  // Format continuous simHour into "HH:MM UTC" and "T+XX.Xh"
  const formatSimTime = (h) => {
    const wholeHours = Math.floor(h);
    const minutes = Math.floor((h - wholeHours) * 60);
    const hh = String(wholeHours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm} UTC (T+${h.toFixed(1)}h)`;
  };

  // Actions
  const handleAlertClick = (alt) => {
    setFocusLocation({
      lat: alt.lat,
      lng: alt.lng,
      zoom: 10,
      id: alt.id,
      ping: true
    });
    if (activeIncident?.topVessel) {
      setSelectedVessel(activeIncident.topVessel);
    }
    playSound('ping');
  };

  const handleAcknowledgeAlert = (id, e) => {
    if (e) e.stopPropagation();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
    playSound('ack');
    addDeckLog({
      category: "ALERT ACK",
      text: `Watchstander acknowledged alert [${id}].`
    });
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    playSound('ack');
    addDeckLog({
      category: "ALERT ACK ALL",
      text: `All pending tactical alerts acknowledged by watch officer.`
    });
  };

  const handleSimulateNewAnomaly = () => {
    const anomalyTypes = [
      {
        title: "Abrupt Course Alteration (42° Turn)",
        desc: "Automated kinematic filter flagged rapid heading change non-compliant with standard TSS traffic lanes.",
        severity: "HIGH",
        badgeColor: "bg-amber-50 text-status-warning border-amber-200"
      },
      {
        title: "Dark Vessel Rendezvous Detected",
        desc: "Two surface radar returns remained within 120m for 18 min without AIS transponder broadcasting.",
        severity: "CRITICAL",
        badgeColor: "bg-red-50 text-status-danger border-red-200"
      },
      {
        title: "Excessive Engine Thermal Emission",
        desc: "MODIS thermal IR band detected elevated surface temperature wake signature matching illegal discharge.",
        severity: "MEDIUM",
        badgeColor: "bg-blue-50 text-status-info border-blue-200"
      }
    ];

    const pick = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    const newLat = +( (activeIncident?.coordinates?.lat || 14.8214) + (Math.random() * 0.3 - 0.15) ).toFixed(4);
    const newLng = +( (activeIncident?.coordinates?.lng || 68.2108) + (Math.random() * 0.3 - 0.15) ).toFixed(4);
    const newId = `ALT-${Math.floor(Math.random() * 90 + 10)}`;

    const newAlert = {
      id: newId,
      severity: pick.severity,
      badgeColor: pick.badgeColor,
      title: pick.title,
      desc: pick.desc,
      target: "vessel-intel",
      lat: newLat,
      lng: newLng,
      acknowledged: false,
      timestamp: new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC'
    };

    setAlerts(prev => [newAlert, ...prev]);
    setFocusLocation({ lat: newLat, lng: newLng, zoom: 10, id: newId, ping: true });
    playSound('alert');

    announceVoiceMessage(`Warning: New anomaly detected. ${pick.title}`, voiceEnabled, voiceVolume);
    addDeckLog({
      category: "ANOMALY INJECTION",
      text: `[${newId}] ${pick.title}: ${pick.desc} (${newLat}°N, ${newLng}°E)`
    });
  };

  const handleSelectVesselTarget = (vessel) => {
    setSelectedVessel(vessel);
    const pos = vessel.currentPos || vessel.pos || { lat: 14.8214, lng: 68.2108 };
    setFocusLocation({ lat: pos.lat, lng: pos.lng, zoom: 9, id: vessel.mmsi, ping: true });
    playSound('ping');
  };

  const handleDispatchInterceptor = () => {
    setInterceptorDispatched(true);
    setInterceptorEtaSec(1365);
    playSound('alert');

    announceVoiceMessage("Coast Guard Fast Patrol Interceptor ICGS Varaha dispatched for tactical boarding.", voiceEnabled, voiceVolume);
    addDeckLog({
      category: "INTERCEPTOR LAUNCH",
      text: `Fast Patrol Cutter ICGS VARAHA (FPV 242) dispatched to intercept target ${selectedVessel?.name || 'MV OCEAN STAR'}. ETA 22 min @ 34.2 kn.`
    });
  };

  const handleRecallInterceptor = () => {
    setInterceptorDispatched(false);
    playSound('ack');

    announceVoiceMessage("Interceptor mission aborted. ICGS Varaha returning to coastal patrol station.", voiceEnabled, voiceVolume);
    addDeckLog({
      category: "INTERCEPTOR RECALL",
      text: `ICGS VARAHA recalled by duty watchstander. Interception vector disengaged.`
    });
  };

  // VHF Radio Standard Hail Templates
  const vhfPresets = [
    { 
      label: "Master Identification", 
      text: "SECURITÉ: Target vessel in Sector 4, state your vessel name, port of registry, and intention." 
    },
    { 
      label: "Pollution Inquiry", 
      text: "Coast Guard VTS: Radar flags dark sheen wake trailing your stern. Confirm status of all bilge manifolds." 
    },
    { 
      label: "Boarding Directive", 
      text: "URGENT DIRECTIVE: Maintain steerageway on course 284°. Interceptor ICGS VARAHA is inbound for tactical boarding." 
    }
  ];

  const transmitVhfMessage = (text) => {
    if (!text || !text.trim()) return;
    const timeStr = new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC';
    setVhfHistory(prev => [
      ...prev,
      { sender: "SURVEILLANCE OFFICER", time: timeStr, text: text.trim() }
    ]);
    setVhfTransmitting(true);
    playSound('radio');

    addDeckLog({
      category: "VHF TX CH-16",
      text: `Outbound hail: "${text.trim()}"`
    });

    // Realistic Captain Reply Simulation
    setTimeout(() => {
      setVhfTransmitting(false);
      const vesselName = selectedVessel?.name || activeIncident?.topVessel?.name || "M/V TARGET";
      let replyText = `Surveillance Station, this is Master of ${vesselName}. We acknowledge reception on Channel 16. Current steerageway 284° at 12.4 kn. Bilge overboard valves are locked and sealed as per MARPOL regulations.`;
      
      if (text.toLowerCase().includes("boarding")) {
        replyText = `MRCC, this is Master of ${vesselName}. Understood directive. We are maintaining minimum steerageway and will rig the pilot ladder on port side for Coast Guard boarding party.`;
      } else if (text.toLowerCase().includes("pollution") || text.toLowerCase().includes("sheen")) {
        replyText = `Coast Guard Station, Master of ${vesselName}. We report negative discharge on our instruments. Engine room logs are open for your boarding officers' verification.`;
      }

      setVhfHistory(prev => [
        ...prev,
        { 
          sender: vesselName, 
          time: new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC', 
          text: replyText 
        }
      ]);
      playSound('ping');

      addDeckLog({
        category: "VHF RX CH-16",
        text: `Inbound from Master ${vesselName}: "${replyText}"`
      });
    }, 2200);
  };

  const handleSendCustomVhf = (e) => {
    e.preventDefault();
    const input = e.target.elements.vhfMsg;
    if (!input.value.trim()) return;
    transmitVhfMessage(input.value);
    input.value = '';
  };

  const handleCopyNmea = (raw, id) => {
    navigator.clipboard.writeText(raw);
    setCopiedId(id);
    playSound('ack');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSelectSecurityLevel = (lvl) => {
    setSecurityLevel(lvl);
    playSound('ack');
    announceVoiceMessage(`Operational Security Posture updated to ${lvl.replace('_', ' ')}.`, voiceEnabled, voiceVolume);
    addDeckLog({
      category: "SECURITY LEVEL",
      text: `Watch officer transitioned security posture to ${lvl.replace('_', ' ')}.`
    });
  };

  const handleGeofenceAlert = (zone) => {
    const newId = `ALT-${Math.floor(Math.random() * 90 + 10)}`;
    const newAlert = {
      id: newId,
      severity: "CRITICAL",
      badgeColor: "bg-red-50 text-status-danger border-red-200",
      title: `Geofence Threat: ${zone.name}`,
      desc: `Target proximity threat to ${zone.name} within buffer radius. Immediate containment required.`,
      target: "response-plan",
      lat: zone.lat,
      lng: zone.lng,
      acknowledged: false,
      timestamp: new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC'
    };

    setAlerts(prev => [newAlert, ...prev]);
    playSound('alert');
    announceVoiceMessage(`Warning: Sensitive marine reserve breach proximity detected in ${zone.name}.`, voiceEnabled, voiceVolume);
    addDeckLog({
      category: "GEOFENCE BREACH",
      text: `Proximity breach raised for ${zone.name} (${zone.criticality}).`
    });
  };

  // Candidate vessels for fleet directory with filtering & tagging
  const rawFleet = activeIncident?.candidateVessels || [activeIncident?.topVessel];
  const candidateFleet = useMemo(() => {
    return rawFleet.filter((v) => {
      if (!v) return false;
      const matchesSearch = 
        !vesselSearch.trim() || 
        v.name?.toLowerCase().includes(vesselSearch.toLowerCase()) || 
        v.mmsi?.includes(vesselSearch) ||
        v.imo?.includes(vesselSearch);

      const matchesType = 
        vesselTypeFilter === "ALL" ||
        v.type?.toUpperCase().includes(vesselTypeFilter);

      const speed = v.speedKn || v.dynamicSpeedKn || 12;
      const matchesSpeed = speed >= vesselMinSpeed;

      return matchesSearch && matchesType && matchesSpeed;
    });
  }, [rawFleet, vesselSearch, vesselTypeFilter, vesselMinSpeed]);

  const handleSetVesselTag = (mmsi, tag, e) => {
    if (e) e.stopPropagation();
    setTacticalTags(prev => ({
      ...prev,
      [mmsi]: prev[mmsi] === tag ? undefined : tag
    }));
    playSound('ack');
    addDeckLog({
      category: "TACTICAL TAG",
      text: `Vessel MMSI ${mmsi} tagged as [${tag}].`
    });
  };

  return (
    <div className="p-3 sm:p-5 space-y-3 flex flex-col min-h-[calc(100vh-65px)] overflow-y-auto lg:h-[calc(100vh-65px)] lg:overflow-hidden bg-background-light font-sans">
      
      {/* Top Header & Tactical Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-border-marine/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-black text-ocean-navy tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-ocean animate-pulse" />
              Live Ocean Surveillance Monitor
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono flex items-center gap-1.5 transition-colors ${
              isLiveMode 
                ? 'bg-emerald-50 text-status-success border-emerald-300 shadow-sm'
                : 'bg-amber-50 text-status-warning border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
              <span>{isLiveMode ? `● ${activeIncident?.regionShort?.toUpperCase() || 'ARABIAN SEA'} LIVE STREAM` : '● HISTORICAL / FORECAST SCRUB'}</span>
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time AIS transponder stream coupled with Sentinel-1 SAR imagery, Coastal VTS Radar, and CMEMS hydrodynamic advection.
          </p>
        </div>

        {/* Tactical Controls & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Security Level Selector */}
          <SecurityLevelSelector 
            level={securityLevel} 
            onSelectLevel={handleSelectSecurityLevel} 
          />

          {/* EBL / VRM Navigation Fix Tool Button */}
          <button
            onClick={() => setEblModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-white border border-border-marine text-ocean-navy text-xs font-mono font-bold hover:bg-ocean-sky flex items-center gap-1.5 shadow-marine-sm transition-all"
            title="Open Interactive EBL / VRM Range & Bearing Tool"
          >
            <Compass className="w-3.5 h-3.5 text-ocean" />
            <span>EBL / VRM Tool</span>
          </button>

          {/* Voice Annunciator Audio */}
          <TacticalVoiceAnnunciator 
            voiceEnabled={voiceEnabled} 
            setVoiceEnabled={setVoiceEnabled}
            voiceVolume={voiceVolume}
            setVoiceVolume={setVoiceVolume}
          />

          {/* UTC Clock Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-border-marine text-xs font-mono font-bold text-ocean-navy shadow-marine-sm">
            <Clock className="w-3.5 h-3.5 text-ocean" />
            <span>{liveUtcClock || '15:00:00 UTC'}</span>
          </div>

          {/* Audio Sonar Mute Button */}
          <button 
            onClick={() => {
              setMuted(!muted);
              if (muted) playSound('ping');
            }}
            className={`p-1.5 rounded-lg border flex items-center gap-1 text-xs font-medium transition-all ${
              muted 
                ? 'bg-slate-100 border-border-marine text-text-muted hover:bg-slate-200' 
                : 'bg-ocean-light border-ocean/40 text-ocean hover:bg-ocean/10'
            }`}
            title={muted ? "Unmute Tactical Sonar Audio" : "Mute Tactical Sonar Audio"}
          >
            {muted ? <VolumeX className="w-4 h-4 text-text-muted" /> : <Volume2 className="w-4 h-4 text-ocean" />}
            <span className="text-[10px] font-mono hidden sm:inline">{muted ? "MUTED" : "SONAR"}</span>
          </button>

          {/* Simulate Anomaly Button */}
          <button
            onClick={handleSimulateNewAnomaly}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-ocean to-ocean-deep hover:from-ocean-deep hover:to-ocean-navy text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
            title="Inject simulated radar/AIS anomaly"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulate Anomaly</span>
          </button>
        </div>
      </div>

      {/* Main Tactical Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* Left / Center Map Section (Col 8 or 9) */}
        <div className="lg:col-span-8 xl:col-span-8 bg-white border border-border-marine rounded-2xl p-2.5 shadow-marine-sm flex flex-col min-h-0 relative overflow-hidden">
          
          {/* Tactical Layer Dock (Clean Docked Bar, never clashing with map HUD) */}
          <div className="flex items-center justify-between bg-ocean-light/50 border border-border-marine/70 rounded-xl px-2.5 py-1.5 mb-2 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              <span className="text-[10px] font-mono text-ocean-navy font-bold flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-ocean" />
                <span>LAYERS:</span>
              </span>
              {[
                { key: "vessels", label: "AIS Fleet", icon: Ship },
                { key: "oilSpills", label: "Oil Slick", icon: ShieldAlert },
                { key: "coastalRadar", label: "Radar Rings", icon: Radio },
                { key: "windVectors", label: "Air Drift", icon: Wind },
                { key: "currentVectors", label: "Ocean Current", icon: Waves },
                { key: "particles", label: "Particles", icon: Crosshair },
                { key: "aisTracks", label: "Tracks", icon: Navigation },
                { key: "riskZones", label: "MPA Risk", icon: AlertTriangle }
              ].map(({ key, label, icon: Icon }) => {
                const active = activeLayers[key];
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
                      playSound('ack');
                    }}
                    className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all text-[11px] whitespace-nowrap font-medium ${
                      active 
                        ? 'bg-ocean text-white font-bold shadow-xs' 
                        : 'bg-white text-text-secondary hover:bg-ocean-sky/60 border border-border-marine/50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Status / Reset Centroid */}
            <button
              onClick={() => {
                const centerLat = activeIncident?.coordinates?.lat || 14.8214;
                const centerLng = activeIncident?.coordinates?.lng || 68.2108;
                setFocusLocation({ lat: centerLat, lng: centerLng, zoom: 8 });
                playSound('ping');
              }}
              className="px-2 py-0.5 rounded-md bg-white border border-border-marine text-ocean-navy text-[10px] font-mono font-bold hover:bg-ocean-sky flex items-center gap-1 shrink-0 ml-2"
              title="Center Map on Active Slick"
            >
              <Target className="w-3 h-3 text-ocean" />
              <span>Slick Center</span>
            </button>
          </div>

          {/* Leaflet Real GIS Map */}
          <div className="h-[380px] sm:h-[480px] lg:h-full lg:flex-1 min-h-[360px] rounded-xl overflow-hidden border border-border-marine/60 relative">
            <GISRealMap 
              mode="live" 
              caseData={activeIncident}
              activeLayers={activeLayers}
              simulationState={simPhysics}
              simulationTimestamp={`T+${simHour.toFixed(1)}h`}
              interceptorData={{
                dispatched: interceptorDispatched,
                etaSec: interceptorEtaSec,
                targetVessel: selectedVessel || activeIncident?.topVessel
              }}
              focusLocation={focusLocation}
              alerts={alerts}
              onSelectAlert={(alt) => handleAlertClick(alt)}
              height="h-full"
              onSelectSpill={() => onNavigate("workspace")}
              onSelectVessel={(vessel) => handleSelectVesselTarget(vessel)}
            />
          </div>

          {/* Bottom Surveillance Timeline Controls with Smooth Playback */}
          <div className="mt-2.5 pt-2 border-t border-border-marine bg-white flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              
              {/* Playback Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    playSound('ack');
                  }}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-sm transition-all ${
                    isPlaying 
                      ? 'bg-amber-600 text-white hover:bg-amber-700 animate-pulse' 
                      : 'bg-ocean text-white hover:bg-ocean-deep'
                  }`}
                  title={isPlaying ? "Pause Smooth Playback" : "Resume Smooth 60 FPS Playback"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>

                <button 
                  onClick={() => {
                    setSimHour(prev => Math.max(0, prev - 1.0));
                    playSound('ack');
                  }}
                  className="w-7 h-7 rounded-lg border border-border-marine text-ocean-navy flex items-center justify-center hover:bg-ocean-sky transition-colors"
                  title="Step Backward -1h"
                >
                  <Rewind className="w-3 h-3" />
                </button>

                <button 
                  onClick={() => {
                    setSimHour(prev => Math.min(24.0, prev + 1.0));
                    playSound('ack');
                  }}
                  className="w-7 h-7 rounded-lg border border-border-marine text-ocean-navy flex items-center justify-center hover:bg-ocean-sky transition-colors"
                  title="Step Forward +1h"
                >
                  <FastForward className="w-3 h-3" />
                </button>

                <button 
                  onClick={() => {
                    setSimHour(0);
                    playSound('ack');
                  }}
                  className="w-7 h-7 rounded-lg border border-border-marine text-ocean-navy flex items-center justify-center hover:bg-ocean-sky transition-colors"
                  title="Reset to 00:00 UTC (T+0)"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                {/* Speed Multiplier Buttons */}
                <div className="flex items-center gap-0.5 bg-ocean-light border border-border-marine rounded-md p-0.5 ml-1">
                  {["0.5x", "1x", "2x", "5x"].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setPlaySpeed(spd);
                        playSound('ack');
                      }}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors ${
                        playSpeed === spd ? 'bg-ocean text-white' : 'text-text-muted hover:text-ocean'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>

                {/* Return to Live Button */}
                {!isLiveMode && (
                  <button
                    onClick={() => {
                      setSimHour(15.0);
                      playSound('ping');
                    }}
                    className="ml-2 px-2.5 py-0.5 text-[10px] rounded-lg font-bold bg-emerald-100 text-status-success border border-emerald-300 hover:bg-emerald-200 flex items-center gap-1 shadow-xs transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>● RETURN TO LIVE (15:00 UTC)</span>
                  </button>
                )}
              </div>

              {/* Time Display Badge */}
              <div className="text-ocean-deep font-semibold text-xs flex items-center gap-2">
                <span className="text-text-muted hidden sm:inline font-sans">Simulated Time:</span>
                <span className="font-bold text-ocean font-mono px-2.5 py-0.5 bg-ocean-light rounded-lg border border-ocean/20 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-ocean" />
                  <span>{formatSimTime(simHour)}</span>
                  <span className="text-text-muted text-[10px]">
                    · Slick +{simPhysics?.centroid?.distanceNm || 0} NM
                  </span>
                </span>
              </div>
            </div>

            {/* Continuous Smooth Scrubber Slider */}
            <div className="flex items-center justify-between relative px-1 py-1">
              <input
                type="range"
                min="0"
                max="24"
                step="0.05"
                value={simHour}
                onChange={(e) => {
                  setSimHour(parseFloat(e.target.value));
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
              />
            </div>
            
            {/* Timeline Milestones Preset Buttons */}
            <div className="flex justify-between text-[9px] font-mono text-text-muted px-1">
              {timelineMilestones.map((m) => {
                const isSelected = Math.abs(simHour - m.hour) < 0.3;
                return (
                  <button
                    key={m.hour}
                    onClick={() => {
                      setSimHour(m.hour);
                      playSound('ping');
                    }}
                    className={`hover:text-ocean transition-all px-1.5 py-0.5 rounded ${
                      isSelected 
                        ? 'text-ocean font-black bg-ocean-light border border-ocean/30 scale-105' 
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <span>{m.label.replace(' (NOW)', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Streaming NMEA Telemetry Toggle */}
            <div className="pt-1.5 border-t border-border-marine/40 flex items-center justify-between text-[10px] font-mono text-text-muted">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTelemetryOpen(!telemetryOpen)}
                  className="flex items-center gap-1 text-ocean hover:underline font-bold"
                >
                  <Terminal className="w-3 h-3" />
                  <span>{telemetryOpen ? "Hide Live AIS NMEA Stream" : `Live AIS Stream (${packetCount.toLocaleString()} pkts)`}</span>
                  {telemetryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                
                {telemetryOpen && (
                  <button
                    onClick={() => setTelemetryPaused(!telemetryPaused)}
                    className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200"
                  >
                    {telemetryPaused ? "Resume Feed" : "Pause Feed"}
                  </button>
                )}
              </div>

              <span className="text-status-success flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>CH-16 / 70 DSC RX ACTIVE (156.800 MHz)</span>
              </span>
            </div>

            {/* Expandable NMEA Console */}
            {telemetryOpen && (
              <div className="bg-[#0B2032] border border-border-marine text-[#00E5FF] p-2.5 rounded-xl font-mono text-[10px] max-h-32 overflow-y-auto space-y-1">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10 text-[9px] text-slate-400">
                  <span>RAW NMEA 0183 SENTENCE</span>
                  <span>DECODED MARITIME KINEMATICS</span>
                </div>
                {telemetryLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-2 border-b border-white/5 pb-0.5 group">
                    <div className="flex items-center gap-1 truncate max-w-[260px]">
                      <button
                        onClick={() => handleCopyNmea(log.raw, log.id)}
                        className="opacity-40 group-hover:opacity-100 hover:text-white transition-opacity"
                        title="Copy Raw NMEA"
                      >
                        {copiedId === log.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                      <span className="text-slate-400 truncate">{log.raw}</span>
                    </div>
                    <span className="text-emerald-300 font-bold truncate text-[9.5px]">{log.decoded}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Multi-Tab Tactical Command Center (Col 4) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-2 min-h-0">
          
          {/* Tactical Module Tab Dock Bar */}
          <div className="bg-white border border-border-marine p-1 rounded-2xl shadow-marine-sm flex items-center gap-1 overflow-x-auto text-[11px] font-mono font-bold">
            {[
              { id: "hud", label: "HUD & Fleet", icon: Ship },
              { id: "flir", label: "EO/IR FLIR", icon: Camera },
              { id: "metocean", label: "MetOcean", icon: Waves },
              { id: "geofence", label: "Geofence", icon: ShieldAlert },
              { id: "weathering", label: "Weathering", icon: Droplets },
              { id: "dark", label: "Dark SAR", icon: Radio },
              { id: "logbook", label: "Deck Log", icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveRightTab(id);
                  playSound('ack');
                }}
                className={`py-1 px-2 rounded-xl flex items-center gap-1 whitespace-nowrap transition-all ${
                  activeRightTab === id
                    ? 'bg-ocean text-white shadow-xs'
                    : 'text-text-secondary hover:bg-ocean-sky/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-0.5 space-y-2">
            
            {/* TAB 1: HUD & FLEET DIRECTORY & MARITIME ALERTS */}
            {activeRightTab === "hud" && (
              <>
                {/* Target Inspection HUD Drawer */}
                {selectedVessel ? (
                  <div className="bg-white border-2 border-ocean rounded-2xl p-3 shadow-marine-md flex flex-col gap-2.5 animate-fade-in relative">
                    <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
                      <div className="flex items-center gap-1.5">
                        <Ship className="w-4 h-4 text-ocean" />
                        <h3 className="font-bold text-xs text-ocean-navy uppercase">TARGET TACTICAL HUD</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedVessel(null)}
                        className="p-1 rounded-md hover:bg-ocean-sky text-text-muted hover:text-ocean-navy"
                        title="Switch to Fleet Overview"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Vessel Main Info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-ocean-navy">{selectedVessel.name || 'Unknown Vessel'}</span>
                          {tacticalTags[selectedVessel.mmsi] && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                              {tacticalTags[selectedVessel.mmsi]}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          selectedVessel.rank === "01" || selectedVessel.priorityScore > 85
                            ? 'bg-red-100 text-status-danger'
                            : 'bg-amber-100 text-status-warning'
                        }`}>
                          PRIORITY {selectedVessel.priorityScore || 91}%
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-text-muted mt-0.5 flex items-center justify-between">
                        <span>MMSI: {selectedVessel.mmsi || '419001248'}</span>
                        <span>IMO: {selectedVessel.imo || '9876543'}</span>
                      </div>
                    </div>

                    {/* Kinematic Telemetry Card */}
                    <div className="grid grid-cols-2 gap-1.5 bg-ocean-light/50 p-2 rounded-xl text-[10px] font-mono">
                      <div>
                        <span className="text-text-muted block text-[9px]">SOG / SPEED</span>
                        <span className="font-bold text-ocean-navy">{selectedVessel.dynamicSpeedKn || selectedVessel.speedKn || 12.4} kn</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[9px]">COG / HEADING</span>
                        <span className="font-bold text-ocean-navy">{selectedVessel.dynamicHeadingDeg || selectedVessel.heading || 284}° Azimuth</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[9px]">AIS GAP</span>
                        <span className="font-bold text-status-danger">{selectedVessel.gapDuration || '38 min silent'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted block text-[9px]">CPA TO SLICK</span>
                        <span className="font-bold text-status-warning">{selectedVessel.cpaNm || 1.4} NM</span>
                      </div>
                    </div>

                    {/* Quick Tactical Tag Assignment */}
                    <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 border border-border-marine text-[10px] font-mono">
                      <span className="text-text-muted font-bold flex items-center gap-1">
                        <Tag className="w-3 h-3 text-ocean" />
                        <span>TACTICAL TAG:</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {["SUSPECT", "SHADOW", "CLEARED"].map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => handleSetVesselTag(selectedVessel.mmsi, tag, e)}
                            className={`px-1.5 py-0.5 rounded font-bold transition-all ${
                              tacticalTags[selectedVessel.mmsi] === tag 
                                ? 'bg-ocean text-white shadow-xs' 
                                : 'bg-white border border-border-marine text-text-secondary hover:bg-ocean-sky'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Coast Guard Interceptor Dispatch Status */}
                    {interceptorDispatched && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-status-success text-[10px] font-mono animate-fade-in">
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            <span>ICGS VARAHA (FPV 242)</span>
                          </span>
                          <span>ETA: {Math.floor(interceptorEtaSec / 60)}m {interceptorEtaSec % 60}s</span>
                        </div>
                        <div className="text-[9px] text-text-secondary mt-1 flex items-center justify-between">
                          <span>Speed: 34.2 kn · Bearing: 322°</span>
                          <button
                            onClick={handleRecallInterceptor}
                            className="text-red-600 hover:underline font-bold"
                          >
                            Recall Interceptor
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-1.5 pt-1">
                      {!interceptorDispatched ? (
                        <button
                          onClick={handleDispatchInterceptor}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-status-danger hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Dispatch Coast Guard Interceptor</span>
                        </button>
                      ) : (
                        <div className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Interception Vector Engaged (Live on Map)</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setVhfDialogOpen(!vhfDialogOpen)}
                          className="py-1 px-2 rounded-lg border border-ocean/40 bg-ocean-light hover:bg-ocean-sky text-ocean font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <Radio className="w-3 h-3" />
                          <span>VHF Ch 16 Hail</span>
                        </button>

                        <button
                          onClick={() => onNavigate("vessel-intel")}
                          className="py-1 px-2 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Full Intel Dossier</span>
                        </button>
                      </div>
                    </div>

                    {/* VHF Radio Interrogation Dialogue Box */}
                    {vhfDialogOpen && (
                      <div className="mt-1 pt-2 border-t border-border-marine bg-slate-50 p-2 rounded-xl text-[10px] space-y-1.5 animate-fade-in">
                        <div className="font-bold text-ocean-navy flex items-center justify-between text-[10px]">
                          <span className="flex items-center gap-1">
                            <Radio className="w-3 h-3 text-ocean" />
                            <span>VHF CH 16 MARINE TRANSCEIVER</span>
                          </span>
                          <span className="text-status-success font-mono font-bold">156.800 MHz TX</span>
                        </div>
                        
                        {/* Preset Hails */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono text-text-muted uppercase">Tactical Hail Presets:</span>
                          <div className="grid grid-cols-1 gap-1">
                            {vhfPresets.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => transmitVhfMessage(preset.text)}
                                disabled={vhfTransmitting}
                                className="text-left px-2 py-1 rounded bg-white hover:bg-ocean-sky border border-border-marine text-[9px] font-medium text-ocean-navy truncate transition-colors"
                              >
                                ▶ {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Radio Conversation Log */}
                        <div className="max-h-24 overflow-y-auto space-y-1 font-mono text-[9px] bg-white p-1.5 rounded border border-border-marine">
                          {vhfHistory.map((h, i) => (
                            <div key={i} className="leading-tight">
                              <span className="text-ocean font-bold">[{h.time}] {h.sender}: </span>
                              <span className="text-ocean-navy">{h.text}</span>
                            </div>
                          ))}
                          {vhfTransmitting && (
                            <div className="text-amber-600 italic animate-pulse font-bold">
                              Carrier transmitting on 156.800 MHz... awaiting reply...
                            </div>
                          )}
                        </div>

                        {/* Custom Hail Input */}
                        <form onSubmit={handleSendCustomVhf} className="flex gap-1">
                          <input
                            name="vhfMsg"
                            type="text"
                            placeholder="Type custom hail to master..."
                            className="flex-1 px-2 py-1 text-[10px] rounded border border-border-marine bg-white focus:outline-none focus:border-ocean"
                          />
                          <button
                            type="submit"
                            disabled={vhfTransmitting}
                            className="px-2 py-1 bg-ocean hover:bg-ocean-deep text-white font-bold rounded flex items-center justify-center disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fleet Radar Directory (Enhanced with Search, Type Filter & Speed Range) */
                  <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
                      <div className="flex items-center gap-1.5">
                        <Ship className="w-4 h-4 text-ocean" />
                        <h3 className="font-bold text-xs text-ocean-navy uppercase">ACTIVE CANDIDATE FLEET</h3>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-ocean-sky text-ocean font-bold">
                        {candidateFleet.length} Filtered
                      </span>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Search className="w-3 h-3 text-text-muted absolute left-2 top-2" />
                        <input
                          type="text"
                          placeholder="Filter fleet by vessel name or MMSI..."
                          value={vesselSearch}
                          onChange={(e) => setVesselSearch(e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-[10px] rounded-lg border border-border-marine bg-ocean-light/30 focus:outline-none focus:border-ocean"
                        />
                      </div>

                      {/* Vessel Type Pills */}
                      <div className="flex items-center gap-1 overflow-x-auto text-[9px] font-mono font-bold">
                        {["ALL", "TANKER", "CARGO", "CONTAINER", "FISHING"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setVesselTypeFilter(type)}
                            className={`px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${
                              vesselTypeFilter === type 
                                ? 'bg-ocean text-white' 
                                : 'bg-slate-100 text-text-secondary hover:bg-ocean-sky'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      {/* Min Speed Slider */}
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-text-muted pt-0.5">
                        <span>MIN SOG: {vesselMinSpeed} kn</span>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={vesselMinSpeed}
                          onChange={(e) => setVesselMinSpeed(parseInt(e.target.value))}
                          className="w-24 h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-ocean"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {candidateFleet.length === 0 ? (
                        <div className="p-3 text-center text-text-muted text-xs font-mono">
                          No vessels match filter criteria.
                        </div>
                      ) : (
                        candidateFleet.map((v) => {
                          const isLead = v.rank === "01" || v.priorityScore > 85;
                          const tag = tacticalTags[v.mmsi];
                          return (
                            <div
                              key={v.mmsi || v.name}
                              onClick={() => handleSelectVesselTarget(v)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isLead 
                                  ? 'bg-red-50/50 border-red-200 hover:bg-red-50' 
                                  : 'bg-ocean-light/30 border-border-marine hover:bg-ocean-sky/40'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-ocean-navy">{v.name}</span>
                                  {isLead && (
                                    <span className="text-[9px] font-mono px-1 rounded bg-red-100 text-status-danger font-bold">
                                      SUSPECT
                                    </span>
                                  )}
                                  {tag && (
                                    <span className="text-[9px] font-mono px-1 rounded bg-amber-100 text-amber-900 font-bold">
                                      {tag}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-mono text-text-muted mt-0.5">
                                  {v.type || 'Vessel'} · MMSI: {v.mmsi} · {v.speedKn || 12} kn · {v.heading || 284}°
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectVesselTarget(v);
                                }}
                                className="px-2 py-1 rounded bg-ocean hover:bg-ocean-deep text-white font-bold text-[10px] flex items-center gap-1"
                              >
                                <Target className="w-3 h-3" />
                                <span>Lock</span>
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Live Maritime Alerts Panel */}
                <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col min-h-0 overflow-hidden">
                  {/* Header & Filter Bar */}
                  <div className="pb-2 mb-2 border-b border-border-marine flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-status-danger" />
                        <h3 className="font-bold text-xs text-ocean-navy uppercase">LIVE MARITIME ALERTS</h3>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleAcknowledgeAll}
                          className="text-[10px] font-mono text-ocean hover:underline font-bold flex items-center gap-0.5"
                          title="Mark all current alerts as acknowledged"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Ack All</span>
                        </button>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-status-danger font-bold">
                          {activeAlertCount} Pending
                        </span>
                      </div>
                    </div>

                    {/* Search Alert */}
                    <div className="relative">
                      <Search className="w-3 h-3 text-text-muted absolute left-2.5 top-2" />
                      <input
                        type="text"
                        placeholder="Filter alerts by keyword or ID..."
                        value={alertSearch}
                        onChange={(e) => setAlertSearch(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 text-[11px] rounded-lg border border-border-marine bg-ocean-light/30 focus:outline-none focus:border-ocean"
                      />
                    </div>

                    {/* Severity Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono">
                      {["ALL", "UNACKNOWLEDGED", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => {
                            setAlertFilter(lvl);
                            playSound('ack');
                          }}
                          className={`px-1.5 py-0.5 rounded font-bold transition-colors whitespace-nowrap ${
                            alertFilter === lvl 
                              ? 'bg-ocean text-white shadow-xs' 
                              : 'bg-ocean-sky/40 text-text-secondary hover:bg-ocean-sky'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable Alerts List */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                    {filteredAlerts.length === 0 ? (
                      <div className="p-4 text-center text-text-muted text-xs font-mono">
                        No alerts match current filter criteria.
                      </div>
                    ) : (
                      filteredAlerts.map((alt) => (
                        <div 
                          key={alt.id}
                          onClick={() => handleAlertClick(alt)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            alt.acknowledged 
                              ? 'bg-slate-50/70 border-slate-200 opacity-70' 
                              : 'bg-ocean-light/40 border-border-marine hover:bg-ocean-sky/40 hover:border-ocean/40'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className={`px-1.5 py-0.2 rounded-full font-bold border ${alt.badgeColor}`}>
                              {alt.severity}
                            </span>
                            <div className="flex items-center gap-1 text-text-muted">
                              <span>{alt.timestamp}</span>
                              <span>·</span>
                              <span>{alt.id}</span>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-ocean-navy mt-0.5 leading-tight flex items-center justify-between">
                            <span>{alt.title}</span>
                            <span className="text-[9px] font-mono text-ocean font-normal">
                              ({alt.lat.toFixed(2)}°N, {alt.lng.toFixed(2)}°E)
                            </span>
                          </h4>
                          
                          <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                            {alt.desc}
                          </p>

                          {/* Interactive Alert Actions */}
                          <div className="mt-2 pt-1.5 border-t border-border-marine/40 flex items-center justify-between text-[10px]">
                            <button
                              onClick={(e) => handleAcknowledgeAlert(alt.id, e)}
                              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors ${
                                alt.acknowledged 
                                  ? 'bg-emerald-100 text-status-success font-bold' 
                                  : 'bg-white border border-border-marine text-text-secondary hover:bg-emerald-50 hover:text-status-success'
                              }`}
                            >
                              <Check className="w-2.5 h-2.5" />
                              <span>{alt.acknowledged ? "Acknowledged" : "Acknowledge"}</span>
                            </button>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate(alt.target);
                              }}
                              className="text-ocean font-bold hover:underline flex items-center gap-1"
                            >
                              <span>Investigate Module</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: AIRBORNE EO/IR FLIR RECONNAISSANCE GIMBAL FEED */}
            {activeRightTab === "flir" && (
              <FlirCameraFeed 
                selectedVessel={selectedVessel} 
                activeIncident={activeIncident}
                simHour={simHour}
              />
            )}

            {/* TAB 3: REAL-TIME METOCEAN BUOY TELEMETRY */}
            {activeRightTab === "metocean" && (
              <MetOceanBuoyCard 
                activeIncident={activeIncident}
                simHour={simHour}
              />
            )}

            {/* TAB 4: GEOFENCE & MPA SENTRY */}
            {activeRightTab === "geofence" && (
              <GeofenceSentryCard 
                activeIncident={activeIncident}
                selectedVessel={selectedVessel}
                onFocusZone={(z) => setFocusLocation({ lat: z.lat, lng: z.lng, zoom: 10, id: z.id, ping: true })}
                onTriggerAlert={handleGeofenceAlert}
              />
            )}

            {/* TAB 5: HYDROCARBON WEATHERING & MASS BALANCE */}
            {activeRightTab === "weathering" && (
              <OilWeatheringGauge 
                activeIncident={activeIncident}
                simHour={simHour}
              />
            )}

            {/* TAB 6: DARK TARGET & SAR SATELLITE CORRELATION */}
            {activeRightTab === "dark" && (
              <DarkVesselMatrix 
                activeIncident={activeIncident}
                onFocusLocation={(pos) => setFocusLocation({ lat: pos.lat, lng: pos.lng, zoom: 10, id: pos.id, ping: true })}
              />
            )}

            {/* TAB 7: WATCHKEEPER DECK LOGBOOK & SITREP EXPORTER */}
            {activeRightTab === "logbook" && (
              <DeckLogbookDrawer 
                logs={deckLogs}
                onAddLog={addDeckLog}
                activeIncident={activeIncident}
                selectedVessel={selectedVessel}
                securityLevel={securityLevel}
              />
            )}

          </div>

          {/* Footer Status */}
          <div className="pt-1.5 border-t border-border-marine text-[10px] text-text-muted font-mono flex items-center justify-between">
            <span className="truncate max-w-[170px]">
              {activeIncident?.regionShort?.toUpperCase() || 'COASTAL'} VTS RADAR
            </span>
            <span className="text-status-success font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% RADAR SWEEP</span>
            </span>
          </div>
        </div>

      </div>

      {/* EBL / VRM Tactical Navigation Calculator Modal */}
      <EblVrmModal 
        isOpen={eblModalOpen}
        onClose={() => setEblModalOpen(false)}
        selectedVessel={selectedVessel}
        activeIncident={activeIncident}
        onLogEntry={addDeckLog}
      />

    </div>
  );
}
