import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  AlertOctagon, 
  Clock, 
  Compass, 
  Ship, 
  ArrowRight, 
  Target, 
  CheckCircle2,
  AlertTriangle,
  Wind,
  Waves,
  Satellite,
  Droplets,
  Check,
  Plus,
  Copy,
  X,
  Sparkles,
  Activity,
  Sliders,
  ShieldCheck,
  CheckSquare,
  Square,
  HelpCircle,
  Eye,
  Radio,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Upload,
  Save,
  Tag,
  Navigation,
  Fingerprint,
  Scale,
  Search,
  FileSpreadsheet,
  BookOpen,
  Wrench,
  ShieldAlert,
  Network
} from 'lucide-react';
import PipelineStepper from '../components/common/PipelineStepper';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';
import { INCIDENTS_REGISTRY } from '../data/mockData';

// Modals for the 20 Forensic Tools
import WorkspaceDossierStudioModal from '../components/workspace/WorkspaceDossierStudioModal';
import WorkspaceEvidenceBoardModal from '../components/workspace/WorkspaceEvidenceBoardModal';
import WorkspaceFayCalculatorModal from '../components/workspace/WorkspaceFayCalculatorModal';
import WorkspaceMCDAModal from '../components/workspace/WorkspaceMCDAModal';
import WorkspaceMarpolFineModal from '../components/workspace/WorkspaceMarpolFineModal';
import WorkspaceVhfScriptModal from '../components/workspace/WorkspaceVhfScriptModal';
import WorkspaceOilWeatheringModal from '../components/workspace/WorkspaceOilWeatheringModal';
import WorkspaceAisDeepDiveModal from '../components/workspace/WorkspaceAisDeepDiveModal';
import WorkspaceResponseDispatcherModal from '../components/workspace/WorkspaceResponseDispatcherModal';
import WorkspaceChromatographyModal from '../components/workspace/WorkspaceChromatographyModal';
import WorkspaceGeodesicToolModal from '../components/workspace/WorkspaceGeodesicToolModal';

// SOP Presets for Checklist (Feature 10)
const SOP_PRESETS = {
  eez: {
    name: "Standard EEZ Mystery Spill SOP",
    items: [
      { id: 1, label: "SAR Scene False-Positive Spectral Check", desc: "Dual-pol VV/VH ratio confirmed non-biogenic crude film.", checked: true, priority: "Critical" },
      { id: 2, label: "Spill Boundary & Fay Viscous Dispersion Model", desc: "Slick perimeter and spreading rate validated against hydrodynamic field.", checked: true, priority: "High" },
      { id: 3, label: "Backward Lagrangian Origin Zone Identification", desc: "Reverse drift trajectory localized Origin Zone A coordinates.", checked: true, priority: "Critical" },
      { id: 4, label: "AIS Transponder Blackout Duration Corroboration", desc: "Target vessel gap window synchronized with calculated release time.", checked: false, priority: "Critical" },
      { id: 5, label: "Bi-LSTM Kinematic Deceleration Corridor Verification", desc: "Speed drop anomaly matched to slick origin approach point.", checked: false, priority: "High" },
      { id: 6, label: "Formulate Legal Affidavit & Coast Guard Directive", desc: "Generate court-admissible MARPOL Annex I violation dossier.", checked: false, priority: "Critical" }
    ]
  },
  port: {
    name: "Port Approach Bunker Spill SOP",
    items: [
      { id: 101, label: "VTS Radar Track & Anchorage Log Correlation", desc: "Cross-reference port authority anchorage logs with berth pumping manifests.", checked: true, priority: "Critical" },
      { id: 102, label: "Bunker Barge Pumping Manifold Seal Inspection", desc: "Verify surveyor manifold seals and anti-siphon valve certificates.", checked: true, priority: "High" },
      { id: 103, label: "GC-FID Bunker Fuel Fingerprint Match", desc: "Analyze sulfur wt% and biomarker ratios against receiving vessel slop tanks.", checked: false, priority: "Critical" },
      { id: 104, label: "Port Channel Booming & Berth Containment", desc: "Deploy rapid shoreline deflection booms before tidal reversal.", checked: false, priority: "High" }
    ]
  },
  rig: {
    name: "Offshore Oil Rig / FPSO Bleed SOP",
    items: [
      { id: 201, label: "Subsea Wellhead Acoustic Telemetry Check", desc: "Inspect BOP valve pressure sensors for subsea hydrocarbon bubbling.", checked: true, priority: "Critical" },
      { id: 202, label: "Flare Stack & Produced Water Effluent Log", desc: "Audit produced water skim tank discharge volume and oil-in-water ppm.", checked: true, priority: "High" },
      { id: 203, label: "Satellite Thermal IR Flare Anomaly Confirmation", desc: "Check VIIRS thermal sensor for uncharacteristic process shutdown signature.", checked: false, priority: "High" },
      { id: 204, label: "Tier 3 Regional Response Mobilization", desc: "Issue notice to regional Oil Spill Response Limited (OSRL) base.", checked: false, priority: "Critical" }
    ]
  }
};

export default function Page05Workspace({ onNavigate }) {
  const { activeIncidentId, selectIncident, activeIncident, allIncidents } = useIncident();
  const caseData = activeIncident;

  // 1. Sub-Tab State (including new dedicated 'tools' hub)
  const [activeTab, setActiveTab] = useState("overview"); // overview, fleet, environment, timeline, checklist, tools

  // 2. Lifecycle Status & Security Clearance (Feature 17)
  const [caseStatus, setCaseStatus] = useState(caseData.status || "Investigating");
  const [classification, setClassification] = useState("RESTRICTED");
  const [caseTags, setCaseTags] = useState(["#NightBlackout", "#CoralReefThreat", "#TankCleaning", "#EEZ_Transit"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  // 3. Modal Controls for all 20 Forensic Tools
  const [modalDossierOpen, setModalDossierOpen] = useState(false); // Feature 1
  const [modalEvidenceOpen, setModalEvidenceOpen] = useState(false); // Feature 2
  const [modalFayOpen, setModalFayOpen] = useState(false); // Feature 3
  const [modalMCDAOpen, setModalMCDAOpen] = useState(false); // Feature 4
  const [modalMarpolFineOpen, setModalMarpolFineOpen] = useState(false); // Feature 5
  const [modalVhfOpen, setModalVhfOpen] = useState(false); // Feature 7
  const [modalWeatheringOpen, setModalWeatheringOpen] = useState(false); // Feature 8
  const [modalAisDeepDiveOpen, setModalAisDeepDiveOpen] = useState(false); // Feature 11
  const [selectedAisVessel, setSelectedAisVessel] = useState(null);
  const [modalResponseOpen, setModalResponseOpen] = useState(false); // Feature 12
  const [modalChromatographyOpen, setModalChromatographyOpen] = useState(false); // Feature 14
  const [modalGeodesicOpen, setModalGeodesicOpen] = useState(false); // Feature 16

  // 4. Feature 6: Interactive Drift Scrubber & Kinematic Vector Playback
  const [scrubberHour, setScrubberHour] = useState(0); // -48 to +48
  const [isScrubberPlaying, setIsScrubberPlaying] = useState(false);
  const [scrubberSpeed, setScrubberSpeed] = useState(1);

  useEffect(() => {
    let interval = null;
    if (isScrubberPlaying) {
      interval = setInterval(() => {
        setScrubberHour(prev => (prev >= 48 ? -48 : prev + 1));
      }, 700 / scrubberSpeed);
    }
    return () => clearInterval(interval);
  }, [isScrubberPlaying, scrubberSpeed]);

  // 5. Feature 9: Analyst Hypotheses Board
  const [hypotheses, setHypotheses] = useState([
    {
      id: 1,
      title: "Nighttime Oily Bilge Stripping During Transit",
      desc: "Vessel engaged in high-volume bilge discharge during AIS blackout to evade coastal radar surveillance.",
      status: "Supported", // Supported, Refuted, Investigating
      confidence: 91,
      author: "Lead Maritime Forensics"
    },
    {
      id: 2,
      title: "Accidental Slop Tank Overflow in Heavy Swell",
      desc: "Hydraulic pressure surge during ballasting caused tank vent discharge valve failure.",
      status: "Investigating",
      confidence: 42,
      author: "Hydrographic Ops"
    },
    {
      id: 3,
      title: "Hull Fracture / Structural Seepage",
      desc: "Fatigue crack along double-bottom cargo tank #2.",
      status: "Refuted",
      confidence: 12,
      author: "Naval Architect Cell"
    }
  ]);
  const [newHypothesisTitle, setNewHypothesisTitle] = useState("");
  const [showHypothesisModal, setShowHypothesisModal] = useState(false);

  // 6. Feature 10: Custom Checklist with SOP Presets
  const [selectedSopPreset, setSelectedSopPreset] = useState("eez");
  const [checklist, setChecklist] = useState(SOP_PRESETS.eez.items);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [newChecklistPriority, setNewChecklistPriority] = useState("High");

  const verifiedCount = checklist.filter(c => c.checked).length;
  const verifiedPercent = Math.round((verifiedCount / checklist.length) * 100);

  const handleToggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: Date.now(),
      label: newChecklistText.trim(),
      desc: "Custom investigative verification task logged by analyst.",
      checked: false,
      priority: newChecklistPriority
    };
    setChecklist(prev => [newItem, ...prev]);
    setNewChecklistText("");
  };

  const handleSwitchSop = (presetKey) => {
    setSelectedSopPreset(presetKey);
    setChecklist(SOP_PRESETS[presetKey].items);
  };

  // 7. Feature 13: MetOcean Buoy Telemetry Simulator
  const [selectedBuoy, setSelectedBuoy] = useState("MB-01");
  const buoyData = {
    "MB-01": { name: "INCOIS Offshore Buoy MB-01 (Goa EEZ)", sst: "28.4°C", waveH: "1.8 m", wavePeriod: "6.4s", current0m: "0.42 m/s @ 128°", current5m: "0.38 m/s @ 122°", current15m: "0.29 m/s @ 110°", fluorometer: "ALERT (7.8 µg/L Polyaromatic Hydrocarbons)" },
    "MB-02": { name: "NIOT Deep Sea Sentry MB-02 (Karwar Outpost)", sst: "28.1°C", waveH: "2.1 m", wavePeriod: "6.8s", current0m: "0.46 m/s @ 132°", current5m: "0.41 m/s @ 126°", current15m: "0.31 m/s @ 115°", fluorometer: "NORMAL (0.2 µg/L Background)" },
    "MB-03": { name: "Coastal Sentry MB-03 (Mangalore Shelf)", sst: "28.6°C", waveH: "1.6 m", wavePeriod: "5.9s", current0m: "0.39 m/s @ 124°", current5m: "0.35 m/s @ 119°", current15m: "0.27 m/s @ 105°", fluorometer: "NORMAL (0.3 µg/L Background)" }
  };

  // 8. Feature 15: Audit Trail Search, Category Filter & CSV Export
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, time: "15:01 UTC", category: "ai", severity: "Critical", title: "Trajectory analysis started", desc: `BF-BiLSTM model active on candidate ${caseData.topVessel?.name || 'suspect'} blackout gap.`, page: "trajectory" },
    { id: 2, time: "14:53 UTC", category: "radar", severity: "Warning", title: `${caseData.candidateCount || 12} candidate vessels identified`, desc: `Spatio-temporal corridor filtering isolated vessels from historical AIS.`, page: "vessel-intel" },
    { id: 3, time: "14:48 UTC", category: "ai", severity: "Critical", title: "Backward hindcast completed", desc: `${caseData.hindcast?.originZoneA?.name || 'Origin Zone A'} isolated with ${caseData.hindcast?.originZoneA?.confidence || 72}% confidence.`, page: "source-trace" },
    { id: 4, time: "14:41 UTC", category: "ai", severity: "Info", title: "Spill segmentation completed", desc: `${caseData.spillAreaKm2} km² slick polygon delineated. Orientation: ${caseData.orientationDeg || 37}° azimuth.`, page: "characterize" },
    { id: 5, time: "14:36 UTC", category: "ai", severity: "Critical", title: "Hydrocarbon classification verified", desc: `Dual-Pol ResNet-50 confirmed mineral oil signature (${caseData.detectionConfidence || 96}% confidence).`, page: "satellite" },
    { id: 6, time: "14:32 UTC", category: "satellite", severity: "Info", title: "Sentinel-1 SAR scene ingested", desc: `Acquisition ingested and pre-processed in ${caseData.regionShort || 'Coastal Waters'}.`, page: "satellite" }
  ]);
  const [timelineSearch, setTimelineSearch] = useState("");
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteAuthor, setNewNoteAuthor] = useState("Lead Analyst");

  const filteredTimeline = useMemo(() => {
    return timelineEvents.filter(e => {
      const matchCat = timelineFilter === "all" || e.category === timelineFilter;
      const matchQuery = !timelineSearch || e.title.toLowerCase().includes(timelineSearch.toLowerCase()) || e.desc.toLowerCase().includes(timelineSearch.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [timelineEvents, timelineFilter, timelineSearch]);

  const handleExportTimelineCsv = () => {
    const headers = "ID,Time,Category,Severity,Title,Description\n";
    const rows = timelineEvents.map(e => `"${e.id}","${e.time}","${e.category}","${e.severity || 'Info'}","${e.title.replace(/"/g, '""')}","${e.desc.replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MarineSight_${caseData.incidentId}_TimelineAudit.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const timeStr = new Date().toUTCString().split(' ')[4].substring(0, 5) + ' UTC';
    const newEntry = {
      id: Date.now(),
      time: timeStr,
      category: "analyst",
      severity: "Warning",
      title: `Field Finding (${newNoteAuthor})`,
      desc: newNoteText.trim(),
      page: "workspace"
    };
    setTimelineEvents(prev => [newEntry, ...prev]);
    setNewNoteText("");
  };

  // 9. Feature 18: Multi-Origin Hindcast Sensitivity Switcher
  const [selectedOriginZone, setSelectedOriginZone] = useState("A"); // A, B, C
  const originZones = {
    A: { name: "Zone A (Primary Surface Drift)", confidence: caseData.hindcast?.originZoneA?.confidence || 72.4, time: "03 SEP 22:40 UTC", offset: "Centroid 0.00 NM", affectedVessels: 1 },
    B: { name: "Zone B (Subsurface Stokes Current Offset)", confidence: 21.3, time: "03 SEP 21:15 UTC", offset: "4.8 NM West", affectedVessels: 2 },
    C: { name: "Zone C (Atmospheric Wind Shear Extrapolation)", confidence: 6.3, time: "03 SEP 19:50 UTC", offset: "9.2 NM Northwest", affectedVessels: 4 }
  };

  // 10. Feature 19: Tactical Voice Annunciator / Text-to-Speech
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState(false);

  const handleVoiceBriefing = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browser does not support Web Speech API");
      return;
    }

    if (isSpeakingBriefing) {
      window.speechSynthesis.cancel();
      setIsSpeakingBriefing(false);
      return;
    }

    const script = `Attention Marine Operations Command. Case ${caseData.incidentId} in ${caseData.regionShort}. Delineated slick covers ${caseData.spillAreaKm2} square kilometres with ${caseData.detectionConfidence} percent confidence. Current status is ${caseStatus}. Primary suspect vessel is ${caseData.topVessel?.name || 'MV Ocean Star'}, attribution index ${caseData.topVessel?.priorityScore} percent with confirmed ${caseData.topVessel?.aisBlackoutDurationMin || 38} minutes AIS silence. Legal and forensic checklist is at ${verifiedPercent} percent verification.`;

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingBriefing(false);
    utterance.onerror = () => setIsSpeakingBriefing(false);

    setIsSpeakingBriefing(true);
    window.speechSynthesis.speak(utterance);
  };

  // 11. Feature 20: Workspace Snapshot Persistence (Save/Load Session)
  const [sessionSavedNotice, setSessionSavedNotice] = useState(false);

  const handleSaveSession = () => {
    const snapshot = {
      caseId: caseData.incidentId,
      status: caseStatus,
      classification,
      tags: caseTags,
      checklist,
      hypotheses,
      timelineEvents,
      selectedOriginZone,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`marinesight_session_${caseData.incidentId}`, JSON.stringify(snapshot));
    setSessionSavedNotice(true);
    setTimeout(() => setSessionSavedNotice(false), 2500);
  };

  const handleExportSessionJson = () => {
    const snapshot = {
      caseId: caseData.incidentId,
      status: caseStatus,
      classification,
      tags: caseTags,
      checklist,
      hypotheses,
      timelineEvents,
      selectedOriginZone,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MarineSight_${caseData.incidentId}_WorkspaceSession.marinesight.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSessionJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result);
        if (data.status) setCaseStatus(data.status);
        if (data.classification) setClassification(data.classification);
        if (data.tags) setCaseTags(data.tags);
        if (data.checklist) setChecklist(data.checklist);
        if (data.hypotheses) setHypotheses(data.hypotheses);
        if (data.timelineEvents) setTimelineEvents(data.timelineEvents);
        if (data.selectedOriginZone) setSelectedOriginZone(data.selectedOriginZone);
        alert("Workspace Session Successfully Restored!");
      } catch (err) {
        alert("Invalid workspace session JSON format.");
      }
    };
    reader.readAsText(file);
  };

  // Tag helper
  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    let tag = newTagInput.trim();
    if (!tag.startsWith('#')) tag = '#' + tag;
    if (!caseTags.includes(tag)) setCaseTags([...caseTags, tag]);
    setNewTagInput("");
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setCaseTags(caseTags.filter(t => t !== tagToRemove));
  };

  const candidateFleet = caseData.candidateVessels || [caseData.topVessel];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* 1. TOP HEADER & OPERATIONAL CASE BAR */}
      <div className="bg-white border border-border-marine p-4 rounded-2xl shadow-marine-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Case Switcher */}
              <div className="flex items-center gap-1.5 bg-ocean-light border border-ocean/30 px-2.5 py-1 rounded-lg">
                <span className="text-[10px] font-mono font-bold text-ocean uppercase">CASE:</span>
                <select
                  value={activeIncidentId}
                  onChange={(e) => selectIncident(e.target.value)}
                  className="bg-transparent text-xs font-mono font-black text-ocean-navy focus:outline-none cursor-pointer"
                >
                  {(allIncidents || INCIDENTS_REGISTRY).map(inc => (
                    <option key={inc.id} value={inc.id}>
                      {inc.id} — {inc.regionShort || inc.region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-danger animate-pulse"></span>
                <select
                  value={caseStatus}
                  onChange={(e) => setCaseStatus(e.target.value)}
                  className="bg-red-50 border border-red-200 text-status-danger text-[11px] font-bold font-mono px-2 py-0.5 rounded-full focus:outline-none cursor-pointer"
                >
                  <option value="Investigating">● ACTIVE INVESTIGATION</option>
                  <option value="Active Drift">● ACTIVE DRIFT MODELING</option>
                  <option value="Evidence Confirmed">● EVIDENCE CONFIRMED</option>
                  <option value="Response Deployed">● RESPONSE DEPLOYED</option>
                  <option value="Resolved">● RESOLVED / ARCHIVED</option>
                </select>
              </div>

              {/* Security Classification Selector (Feature 17) */}
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-[10px] font-bold text-text-muted">CLEARANCE:</span>
                <select
                  value={classification}
                  onChange={e => setClassification(e.target.value)}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-ocean-navy font-bold focus:outline-none cursor-pointer"
                >
                  <option value="UNCLASSIFIED">UNCLASSIFIED</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                  <option value="SECRET">SECRET // NOFORN</option>
                </select>
              </div>

              <span className="text-xs font-mono text-text-muted">
                PRIORITY: <strong className="text-status-danger">{caseData.riskLevel}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy mt-1">
              Investigation {caseData.incidentId} — {caseData.region}
            </h1>
            <p className="text-xs text-text-secondary mt-0.5">
              Target Centroid: <span className="font-mono text-ocean-deep font-semibold">{caseData.coordinates.display}</span> · Assigned Analyst: {caseData.assignedAnalyst || "Lead Maritime Forensics"}
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Feature 19: Tactical Audio Briefing */}
            <button
              onClick={handleVoiceBriefing}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                isSpeakingBriefing
                  ? 'bg-status-danger text-white border-red-600 shadow-md animate-pulse'
                  : 'border-border-marine bg-white hover:bg-slate-100 text-ocean-navy'
              }`}
              title="Speak Tactical Audio Briefing"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingBriefing ? 'Stop Audio' : 'Audio Briefing'}</span>
            </button>

            {/* Feature 20: Save Session & Snapshot */}
            <button
              onClick={handleSaveSession}
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-slate-100 text-ocean-navy text-xs font-semibold flex items-center gap-1.5"
              title="Save Workspace Session to Browser"
            >
              <Save className="w-3.5 h-3.5 text-ocean" />
              <span>{sessionSavedNotice ? 'Saved!' : 'Save Session'}</span>
            </button>

            {/* Feature 1: Multi-Format Legal Dossier Export Studio */}
            <button 
              onClick={() => setModalDossierOpen(true)}
              className="px-3.5 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Export Full Forensic Case Dossier"
            >
              <Download className="w-3.5 h-3.5 text-ocean" />
              <span>Export Dossier Studio</span>
            </button>
            
            <button 
              onClick={() => onNavigate("attribution")}
              className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Attribution Engine →</span>
            </button>
          </div>
        </div>

        {/* Feature 17: Interactive Tags Bar */}
        <div className="pt-2 border-t border-border-marine/60 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-text-muted font-bold flex items-center gap-1">
              <Tag className="w-3 h-3 text-ocean" /> TAGS:
            </span>
            {caseTags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-ocean-light text-ocean font-semibold flex items-center gap-1">
                {tag}
                <button onClick={() => handleRemoveTag(tag)} className="text-text-muted hover:text-red-500 text-[10px]">×</button>
              </span>
            ))}
            {showTagInput ? (
              <form onSubmit={handleAddTag} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  placeholder="#NewTag"
                  className="px-1.5 py-0.5 rounded border border-ocean text-[11px] font-mono focus:outline-none w-28"
                  autoFocus
                />
                <button type="submit" className="text-[10px] font-bold text-ocean">Add</button>
                <button type="button" onClick={() => setShowTagInput(false)} className="text-[10px] text-text-muted">Cancel</button>
              </form>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="px-2 py-0.5 rounded border border-dashed border-border-marine hover:border-ocean text-text-muted hover:text-ocean text-[10px] font-semibold"
              >
                + Add Tag
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Session JSON export/import */}
            <button onClick={handleExportSessionJson} className="text-ocean hover:underline flex items-center gap-1 font-semibold">
              <Download className="w-3 h-3" /> Export .marinesight
            </button>
            <label className="text-ocean hover:underline flex items-center gap-1 cursor-pointer font-semibold">
              <Upload className="w-3 h-3" /> Import Session
              <input type="file" accept=".json" onChange={handleImportSessionJson} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Investigation Progress Pipeline Stepper */}
      <PipelineStepper currentStep={5} onStepClick={onNavigate} />

      {/* Workspace Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border-marine pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: "overview", label: "Forensic Overview & Playback", icon: Activity },
          { id: "fleet", label: `Candidate Fleet Corridor (${candidateFleet.length})`, icon: Ship },
          { id: "environment", label: "MetOcean & Sensor Buoys", icon: Wind },
          { id: "timeline", label: `Audit Log (${timelineEvents.length})`, icon: Clock },
          { id: "checklist", label: `Verification Checklist (${verifiedPercent}%)`, icon: CheckSquare },
          { id: "tools", label: "Forensic Tool Suite (10)", icon: Wrench }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === id 
                ? 'bg-ocean text-white font-bold shadow-xs' 
                : 'bg-white text-text-secondary hover:bg-ocean-sky hover:text-ocean-navy border border-border-marine/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FORENSIC OVERVIEW & TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Investigation Map + Drift Scrubber (Feature 6) (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-border-marine rounded-2xl p-3.5 shadow-marine-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-marine text-xs font-bold text-ocean-navy">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-ocean" />
                    <span>CASE GEOSPATIAL CORRIDOR</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModalGeodesicOpen(true)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-light text-ocean font-bold hover:bg-ocean-sky"
                    >
                      Geodesic Tool →
                    </button>
                    <span className="text-[10px] font-mono text-ocean font-bold">{caseData.spillAreaKm2} km² SLICK</span>
                  </div>
                </div>
                
                <GISMapMock 
                  mode="workspace" 
                  caseData={caseData}
                  height="h-[300px] sm:h-[400px]"
                  onSelectSpill={() => onNavigate("characterize")}
                  onSelectVessel={() => onNavigate("vessel-intel")}
                />

                {/* Feature 6: Interactive Drift Time-Scrubber Control */}
                <div className="mt-3 p-2.5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>DRIFT SCRUBBER: {scrubberHour >= 0 ? `T+${scrubberHour}h` : `T${scrubberHour}h`}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {scrubberHour < 0 ? 'Backward Hindcast Horizon' : 'Forward Advection Projection'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={-48}
                    max={48}
                    value={scrubberHour}
                    onChange={e => setScrubberHour(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIsScrubberPlaying(!isScrubberPlaying)}
                        className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs flex items-center gap-1"
                      >
                        {isScrubberPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isScrubberPlaying ? 'Pause' : 'Play'}</span>
                      </button>
                      <button
                        onClick={() => setScrubberHour(0)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                      >
                        Reset T-0
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <span>Speed:</span>
                      {[1, 2, 4].map(s => (
                        <button
                          key={s}
                          onClick={() => setScrubberSpeed(s)}
                          className={`px-1.5 py-0.5 rounded font-bold ${scrubberSpeed === s ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 18: Multi-Origin Hindcast Sensitivity Selector */}
              <div className="pt-2 border-t border-border-marine space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-ocean-navy">
                  <span>HINDCAST ORIGIN PROBABILITY:</span>
                  <span className="text-ocean text-[11px] font-bold">
                    Zone {selectedOriginZone} ({originZones[selectedOriginZone].confidence}%)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                  {['A', 'B', 'C'].map(zone => (
                    <button
                      key={zone}
                      onClick={() => setSelectedOriginZone(zone)}
                      className={`p-1.5 rounded-lg border text-left transition-all ${
                        selectedOriginZone === zone
                          ? 'bg-ocean-light border-ocean text-ocean-navy font-bold'
                          : 'bg-slate-50 border-border-marine text-text-secondary hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">Zone {zone}</div>
                      <div className="text-text-muted">{originZones[zone].confidence}% Conf</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Chronology & Hypotheses Scratchpad (Feature 9) (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine text-xs font-bold text-ocean-navy">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ocean" />
                    <span>FORENSIC PIPELINE AUDIT</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className="text-[10px] font-mono text-ocean hover:underline font-bold"
                  >
                    View All ({timelineEvents.length})
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {timelineEvents.slice(0, 4).map((evt) => (
                    <div 
                      key={evt.id} 
                      onClick={() => onNavigate(evt.page)}
                      className="relative pl-5 border-l-2 border-ocean/30 pb-2 cursor-pointer group last:border-transparent"
                    >
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-ocean group-hover:scale-125 transition-transform" />
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold text-ocean">{evt.time}</span>
                        <span className="text-text-muted group-hover:text-ocean flex items-center gap-0.5">
                          Inspect <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-ocean-navy mt-0.5 group-hover:text-ocean-deep transition-colors">
                        {evt.title}
                      </h4>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed line-clamp-1">
                        {evt.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 9: Hypotheses Board Embedded Card */}
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>WORKING THEORIES & HYPOTHESES</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">
                    {hypotheses.filter(h => h.status === 'Supported').length} Supported
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {hypotheses.map((h) => (
                    <div key={h.id} className="p-2 bg-white rounded-lg border border-amber-200 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-ocean-navy font-bold text-[11px]">{h.title}</strong>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          h.status === 'Supported' ? 'bg-emerald-100 text-emerald-800' :
                          h.status === 'Investigating' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                        }`}>
                          {h.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-2">{h.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons to Evidence Board and Dispatcher */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-marine">
                <button
                  onClick={() => setModalEvidenceOpen(true)}
                  className="py-1.5 px-2 rounded-lg bg-status-danger/10 hover:bg-status-danger/20 text-status-danger border border-red-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Evidence Pinboard</span>
                </button>
                <button
                  onClick={() => setModalResponseOpen(true)}
                  className="py-1.5 px-2 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Task Assets (ETA)</span>
                </button>
              </div>
            </div>

            {/* Right: Incident Evidence & Primary Suspect + MARPOL Fine Tool (3 cols) */}
            <div className="lg:col-span-3 bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine text-xs font-bold text-ocean-navy">
                  <span>INCIDENT EVIDENCE</span>
                  <span className="text-[10px] font-mono text-status-danger font-bold">{caseData.riskLevel}</span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/40">
                    <span className="text-[9px] text-text-muted block">DETECTION TIME</span>
                    <span className="font-semibold text-text-primary">{caseData.detectionTimeUTC}</span>
                  </div>
                  <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/40">
                    <span className="text-[9px] text-text-muted block">COORDINATES</span>
                    <span className="font-semibold text-ocean-deep">{caseData.coordinates.display}</span>
                  </div>
                  <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/40">
                    <span className="text-[9px] text-text-muted block">SPILL AREA / PERIMETER</span>
                    <span className="font-bold text-ocean">{caseData.spillAreaKm2} km² / {caseData.spillPerimeterKm} km</span>
                  </div>

                  {/* Top Suspect Card with interactive tools */}
                  <div className="p-2.5 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-status-danger font-bold uppercase">PRIME SUSPECT ATTRIBUTION</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-red-200 text-status-danger font-bold">RANK 01</span>
                    </div>
                    <div>
                      <span className="font-black text-xs text-ocean-navy block">{caseData.topVessel?.name || 'MV Ocean Star'}</span>
                      <div className="text-[10px] text-text-secondary flex items-center justify-between mt-0.5">
                        <span>MMSI: {caseData.topVessel?.mmsi || '419001248'}</span>
                        <strong className="text-status-danger font-bold">Score: {caseData.topVessel?.priorityScore || '91.4'}/100</strong>
                      </div>
                    </div>

                    {/* Suspect Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setSelectedAisVessel(caseData.topVessel);
                          setModalAisDeepDiveOpen(true);
                        }}
                        className="py-1 px-1.5 rounded bg-white border border-red-200 hover:bg-red-50 text-status-danger text-[10px] font-bold"
                      >
                        AIS Diagnostics
                      </button>
                      <button
                        onClick={() => setModalVhfOpen(true)}
                        className="py-1 px-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                      >
                        VHF Hail CH 16
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border-marine space-y-2">
                <button
                  onClick={() => setModalMarpolFineOpen(true)}
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-between px-3 shadow-xs"
                >
                  <span>MARPOL Legal Fine Forensics</span>
                  <Scale className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onNavigate("satellite")}
                  className="w-full py-1.5 rounded-lg border border-border-marine hover:bg-ocean-sky text-ocean-navy text-xs font-semibold transition-colors flex items-center justify-between px-3"
                >
                  <span>Satellite SAR Ingest & Segmentation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-ocean" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CANDIDATE FLEET CORRIDOR & MCDA */}
      {/* ========================================================================= */}
      {activeTab === "fleet" && (
        <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-marine">
            <div>
              <h2 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
                <Ship className="w-4 h-4 text-ocean" />
                <span>SPATIO-TEMPORAL CANDIDATE FLEET CORRIDOR</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                AIS transponder tracks intersecting origin release window ({caseData.hindcast?.estimatedReleaseTimeUTC || '03 SEP 22:40 UTC'}).
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Feature 4: MCDA Attribution Engine Trigger */}
              <button
                onClick={() => setModalMCDAOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>MCDA Attribution Weighting</span>
              </button>

              {/* Feature 14: GC-FID Chromatographic Fingerprint Matcher */}
              <button
                onClick={() => setModalChromatographyOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>GC-FID Fingerprint Match</span>
              </button>

              <button
                onClick={() => onNavigate("vessel-intel")}
                className="px-3 py-1.5 rounded-lg bg-ocean text-white font-bold text-xs hover:bg-ocean-deep flex items-center gap-1.5"
              >
                <span>Full Intelligence Dossier →</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ocean-light border-b border-border-marine text-[10px] font-mono text-text-muted uppercase">
                <tr>
                  <th className="px-3 py-2.5">RANK</th>
                  <th className="px-3 py-2.5">VESSEL NAME</th>
                  <th className="px-3 py-2.5">MMSI / IMO</th>
                  <th className="px-3 py-2.5">VESSEL TYPE & FLAG</th>
                  <th className="px-3 py-2.5">SPEED / SOG</th>
                  <th className="px-3 py-2.5">AIS GAP</th>
                  <th className="px-3 py-2.5">CPA TO SLICK</th>
                  <th className="px-3 py-2.5">ATTRIBUTION SCORE</th>
                  <th className="px-3 py-2.5 text-right">FORENSIC ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60 font-mono">
                {candidateFleet.map((v, idx) => {
                  const isLead = idx === 0 || v.rank === "01" || v.priorityScore > 85;
                  return (
                    <tr 
                      key={v.mmsi || v.name}
                      className={`hover:bg-ocean-sky/40 transition-colors ${
                        isLead ? 'bg-red-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLead ? 'bg-red-100 text-status-danger' : 'bg-slate-100 text-text-secondary'
                        }`}>
                          {v.rank || `0${idx + 1}`}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-bold text-ocean-navy text-xs font-sans block">{v.name}</span>
                        {isLead && <span className="text-[9px] text-status-danger font-mono font-bold">LEAD SUSPECT</span>}
                      </td>
                      <td className="px-3 py-3 text-text-secondary">
                        <div>{v.mmsi || '419001248'}</div>
                        <div className="text-[10px] text-text-muted">{v.imo || '9876543'}</div>
                      </td>
                      <td className="px-3 py-3 font-sans">
                        <div>{v.type || 'Crude Oil Tanker'}</div>
                        <div className="text-[10px] text-text-muted font-mono">{v.flag || 'India 🇮🇳'}</div>
                      </td>
                      <td className="px-3 py-3 text-ocean-deep font-bold">
                        {v.speedKn || 12.4} kn
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-bold ${v.gapDuration ? 'text-status-danger' : 'text-text-muted'}`}>
                          {v.gapDuration || 'None recorded'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-status-warning font-bold">
                        {v.cpaNm || '1.4'} NM
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black ${isLead ? 'text-status-danger' : 'text-ocean-deep'}`}>
                            {v.priorityScore || 91.4}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isLead ? 'bg-red-500' : 'bg-ocean'}`}
                              style={{ width: `${v.priorityScore || 91}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Feature 11: AIS Diagnostics */}
                          <button
                            onClick={() => {
                              setSelectedAisVessel(v);
                              setModalAisDeepDiveOpen(true);
                            }}
                            className="px-2 py-1 rounded bg-white border border-border-marine hover:bg-ocean-sky text-ocean-navy text-[11px] font-semibold"
                            title="Inspect Packet-Level AIS Gaps"
                          >
                            Diagnostics
                          </button>
                          {/* Feature 7: VHF Hail Trigger */}
                          {isLead && (
                            <button
                              onClick={() => setModalVhfOpen(true)}
                              className="px-2 py-1 rounded bg-red-50 border border-red-200 hover:bg-red-100 text-status-danger text-[11px] font-bold"
                            >
                              VHF Hail
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate("vessel-intel")}
                            className="px-2.5 py-1 rounded bg-ocean hover:bg-ocean-deep text-white text-[11px] font-bold"
                          >
                            Dossier →
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: METOCEAN & BUOY SENSOR TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === "environment" && (
        <div className="space-y-4 animate-fade-in">
          {/* Top 4 Quick Atmospheric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Atmospheric Wind */}
            <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-ocean-navy">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-500" />
                  <span>ATMOSPHERIC WIND</span>
                </span>
                <span className="text-[10px] font-mono text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">ECMWF</span>
              </div>
              <div className="text-2xl font-black font-mono text-ocean-navy">
                {caseData.environment?.windSpeedKn || '14.2'} kn
              </div>
              <div className="text-xs text-text-secondary space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Direction:</span>
                  <strong className="text-ocean-deep">{caseData.environment?.windDirectionText || '310° (NW)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Windage Drag Factor:</span>
                  <span>3.0% (Coriolis +15°)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pressure:</span>
                  <span>{caseData.environment?.atmosphericPressureHpa || '1012.4'} hPa</span>
                </div>
              </div>
            </div>

            {/* Ocean Current */}
            <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-ocean-navy">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-teal-500" />
                  <span>OCEAN CURRENTS</span>
                </span>
                <span className="text-[10px] font-mono text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">CMEMS</span>
              </div>
              <div className="text-2xl font-black font-mono text-ocean-navy">
                {caseData.environment?.currentSpeedMs || '0.42'} m/s
              </div>
              <div className="text-xs text-text-secondary space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Advective Flow:</span>
                  <strong className="text-teal-700">{caseData.environment?.currentDirectionText || '128° (SE)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Knots Velocity:</span>
                  <span>{( (caseData.environment?.currentSpeedMs || 0.42) * 1.94384 ).toFixed(2)} kn</span>
                </div>
                <div className="flex justify-between">
                  <span>Stokes Drift Share:</span>
                  <span>61% Current / 39% Wind</span>
                </div>
              </div>
            </div>

            {/* Wave Dynamics */}
            <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-ocean-navy">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-ocean" />
                  <span>WAVE SPECTRUM</span>
                </span>
                <span className="text-[10px] font-mono text-ocean bg-ocean-light px-1.5 py-0.5 rounded">HYCOM</span>
              </div>
              <div className="text-2xl font-black font-mono text-ocean-navy">
                {caseData.environment?.waveHeightM || '1.8'} m
              </div>
              <div className="text-xs text-text-secondary space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Peak Wave Period:</span>
                  <span>{caseData.environment?.wavePeriodSec || '6.4'} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>Sea Temp (SST):</span>
                  <strong className="text-ocean-deep">{caseData.environment?.seaSurfaceTempC || '28.4'}°C</strong>
                </div>
                <div className="flex justify-between">
                  <span>Salinity Index:</span>
                  <span>{caseData.environment?.salinityPsu || '36.2'} PSU</span>
                </div>
              </div>
            </div>

            {/* Satellite Scene Specs */}
            <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-ocean-navy">
                <span className="flex items-center gap-1.5">
                  <Satellite className="w-4 h-4 text-purple-500" />
                  <span>SATELLITE SAR</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">ESA COPERNICUS</span>
              </div>
              <div className="text-lg font-black font-mono text-ocean-navy truncate">
                Sentinel-1 SAR
              </div>
              <div className="text-xs text-text-secondary space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Polarization:</span>
                  <strong className="text-purple-700">Dual-Pol (VV + VH)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pixel Spacing:</span>
                  <span>10m / px (IW GRD)</span>
                </div>
                <div className="flex justify-between">
                  <span>Acquisition:</span>
                  <span>{caseData.detectionTimeUTC}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 13: MetOcean Ocean Buoy Telemetry Simulator */}
          <div className="bg-white border border-border-marine rounded-2xl p-5 shadow-marine-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
              <div>
                <h3 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
                  <Radio className="w-4 h-4 text-teal-600 animate-pulse" />
                  <span>INCOIS / NIOT OFFSHORE BUOY TELEMETRY STREAM</span>
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Real-time ADCP acoustic doppler current profiling and optical fluorometer hydrocarbon readings.
                </p>
              </div>

              {/* Buoy Switcher */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                {Object.keys(buoyData).map(bId => (
                  <button
                    key={bId}
                    onClick={() => setSelectedBuoy(bId)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedBuoy === bId
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                    }`}
                  >
                    {bId}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Buoy Telemetry Matrix */}
            <div className="p-4 bg-slate-900 text-teal-300 rounded-xl font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">{buoyData[selectedBuoy].name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900/60 text-teal-400 border border-teal-700">
                  UPLINK: 2026-09-05 15:00 UTC (98.4% SNR)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">ADCP SURFACE (0m)</span>
                  <strong className="text-white text-sm">{buoyData[selectedBuoy].current0m}</strong>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">ADCP THERMOCLINE (5m)</span>
                  <strong className="text-white text-sm">{buoyData[selectedBuoy].current5m}</strong>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">ADCP DEEP LAYER (15m)</span>
                  <strong className="text-white text-sm">{buoyData[selectedBuoy].current15m}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400">Hydrocarbon Optical Sensor: </span>
                  <strong className={buoyData[selectedBuoy].fluorometer.includes('ALERT') ? 'text-status-danger font-bold animate-pulse' : 'text-emerald-400'}>
                    {buoyData[selectedBuoy].fluorometer}
                  </strong>
                </div>
                <div className="text-slate-400">
                  Sea Temp: <span className="text-white font-bold">{buoyData[selectedBuoy].sst}</span> · Wave Ht: <span className="text-white font-bold">{buoyData[selectedBuoy].waveH}</span>
                </div>
              </div>
            </div>

            {/* Launchers for Fay Calculator & Mackay Weathering Curves */}
            <div className="flex items-center justify-between pt-2 border-t border-border-marine flex-wrap gap-2">
              <span className="text-xs text-text-muted font-mono">
                Coupled OpenDrift hydrodynamic advection engine active.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalFayOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Fay Spreading Model</span>
                </button>
                <button
                  onClick={() => setModalWeatheringOpen(true)}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Mackay Weathering Curves</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INTERACTIVE AUDIT TRAIL & LOG */}
      {/* ========================================================================= */}
      {activeTab === "timeline" && (
        <div className="bg-white border border-border-marine rounded-2xl p-5 shadow-marine-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
            <div>
              <h2 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
                <Clock className="w-4 h-4 text-ocean" />
                <span>CHRONOLOGICAL INVESTIGATION AUDIT TRAIL</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Tamper-evident legal audit log of AI detections, forensic hindcasts, and analyst entries.
              </p>
            </div>

            {/* Feature 15: Search & Export CSV Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={timelineSearch}
                  onChange={e => setTimelineSearch(e.target.value)}
                  placeholder="Search log entries..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border-marine bg-slate-50 focus:outline-none focus:ring-1 focus:ring-ocean w-44"
                />
              </div>

              <button
                onClick={handleExportTimelineCsv}
                className="px-3 py-1.5 rounded-lg border border-border-marine hover:bg-slate-100 text-ocean-navy text-xs font-bold flex items-center gap-1.5"
                title="Export Log as Court-Admissible CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {["all", "ai", "radar", "satellite", "analyst"].map((cat) => (
              <button
                key={cat}
                onClick={() => setTimelineFilter(cat)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  timelineFilter === cat
                    ? 'bg-ocean text-white shadow-xs'
                    : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Analyst Note Form */}
          <form onSubmit={handleAddNote} className="bg-ocean-light/40 border border-border-marine p-3 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-ocean-navy font-mono flex items-center gap-1">
              <Plus className="w-3 h-3 text-ocean" />
              <span>RECORD NEW ANALYST FINDING / FIELD NOTE</span>
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder="Log observation, Coast Guard VHF hail summary, or evidence update..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-border-marine bg-white focus:outline-none focus:ring-1 focus:ring-ocean"
              />
              <input
                type="text"
                value={newNoteAuthor}
                onChange={e => setNewNoteAuthor(e.target.value)}
                placeholder="Analyst Name"
                className="w-36 px-2.5 py-1.5 text-xs rounded-lg border border-border-marine bg-white focus:outline-none text-ocean-navy font-medium"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <span>Add Entry</span>
              </button>
            </div>
          </form>

          {/* Timeline List */}
          <div className="space-y-3 pt-2">
            {filteredTimeline.map((evt) => (
              <div 
                key={evt.id}
                onClick={() => evt.page !== "workspace" && onNavigate(evt.page)}
                className={`p-3.5 rounded-xl border transition-all ${
                  evt.category === 'analyst' 
                    ? 'bg-amber-50/60 border-amber-200' 
                    : 'bg-white border-border-marine hover:bg-ocean-sky/30 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      evt.category === 'analyst' ? 'bg-amber-100 text-amber-800' :
                      evt.category === 'ai' ? 'bg-blue-100 text-ocean-deep' :
                      evt.category === 'radar' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {evt.category}
                    </span>
                    {evt.severity && (
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        evt.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {evt.severity}
                      </span>
                    )}
                  </div>
                  <span className="text-text-muted font-bold">{evt.time}</span>
                </div>
                <h4 className="font-bold text-xs text-ocean-navy">{evt.title}</h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{evt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: FORENSIC VERIFICATION CHECKLIST & SOP PRESETS */}
      {/* ========================================================================= */}
      {activeTab === "checklist" && (
        <div className="bg-white border border-border-marine rounded-2xl p-5 shadow-marine-sm space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
            <div>
              <h2 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-status-success" />
                <span>LEGAL & FORENSIC VERIFICATION AUDIT TRAIL</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Standard Operating Procedure (SOP) criteria required for Coast Guard affidavit prosecution under MARPOL Annex I.
              </p>
            </div>

            {/* SOP Preset Switcher & Completion Bar */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-text-muted block">COMPLETION</span>
                <span className="text-sm font-black text-ocean-navy">{verifiedCount} / {checklist.length} Verified</span>
              </div>
              <div className="w-20 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-status-success transition-all duration-300"
                  style={{ width: `${verifiedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Feature 10: SOP Presets Selector */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-border-marine">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ocean-navy">SOP PRESET:</span>
              {Object.keys(SOP_PRESETS).map(k => (
                <button
                  key={k}
                  onClick={() => handleSwitchSop(k)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedSopPreset === k
                      ? 'bg-ocean text-white shadow-xs'
                      : 'bg-white text-text-secondary hover:bg-slate-100 border border-border-marine'
                  }`}
                >
                  {SOP_PRESETS[k].name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Verification Item Form */}
          <form onSubmit={handleAddChecklistItem} className="flex gap-2 text-xs font-mono">
            <input
              type="text"
              value={newChecklistText}
              onChange={e => setNewChecklistText(e.target.value)}
              placeholder="Add custom forensic verification requirement..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-border-marine bg-white focus:outline-none focus:ring-1 focus:ring-ocean"
            />
            <select
              value={newChecklistPriority}
              onChange={e => setNewChecklistPriority(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-border-marine bg-slate-50 text-ocean-navy font-bold focus:outline-none cursor-pointer"
            >
              <option value="Critical">Critical Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </form>

          {/* Checklist Items */}
          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  item.checked 
                    ? 'bg-emerald-50/50 border-emerald-200' 
                    : 'bg-white border-border-marine hover:bg-slate-50'
                }`}
              >
                <button type="button" className="mt-0.5 text-ocean focus:outline-none">
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${item.checked ? 'text-emerald-900 line-through opacity-85' : 'text-ocean-navy'}`}>
                      {item.label}
                    </h4>
                    <div className="flex items-center gap-1.5 font-mono">
                      {item.priority && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          item.priority === 'Critical' ? 'bg-red-100 text-status-danger' : 'bg-slate-100 text-text-muted'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.checked ? 'bg-emerald-100 text-status-success' : 'bg-slate-100 text-text-muted'
                      }`}>
                        {item.checked ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border-marine flex items-center justify-between">
            <span className="text-xs text-text-secondary">
              {verifiedPercent === 100 
                ? "✓ All SOP criteria satisfied. Case ready for formal legal prosecution."
                : `Complete ${checklist.length - verifiedCount} remaining task(s) to finalize prosecution dossier.`
              }
            </span>

            <button
              onClick={() => onNavigate("evidence-risk")}
              className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span>Inspect Legal Evidence Matrix →</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DEDICATED FORENSIC TOOL SUITE (10 INTERACTIVE MODULES) */}
      {/* ========================================================================= */}
      {activeTab === "tools" && (
        <div className="bg-white border border-border-marine rounded-2xl p-5 shadow-marine-sm space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-border-marine">
            <h2 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
              <Wrench className="w-4 h-4 text-ocean" />
              <span>INTEGRATED FORENSIC & OPERATIONAL TOOL SUITE</span>
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Instant access to all client-side computational, forensic, simulation, and legal modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tool 1 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <FileText className="w-4 h-4 text-ocean" />
                  <span>Dossier Export Studio</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Export case in MARPOL Annex I, Indian Coast Guard SITREP signal, GeoJSON boundary, or raw JSON interchange.
                </p>
              </div>
              <button
                onClick={() => setModalDossierOpen(true)}
                className="w-full py-1.5 rounded-lg bg-ocean text-white font-bold text-xs hover:bg-ocean-deep"
              >
                Launch Studio
              </button>
            </div>

            {/* Tool 2 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Network className="w-4 h-4 text-status-danger" />
                  <span>Evidence Pinboard</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Interactive crime board connecting satellite SAR imagery, reverse drift vectors, AIS blackouts, and bunker records.
                </p>
              </div>
              <button
                onClick={() => setModalEvidenceOpen(true)}
                className="w-full py-1.5 rounded-lg bg-status-danger text-white font-bold text-xs hover:bg-red-700"
              >
                Open Pinboard
              </button>
            </div>

            {/* Tool 3 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  <span>Fay Spreading Calculator</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  3-phase oil spreading physics model (gravity-inertia, gravity-viscous, surface tension) calculating radius and area.
                </p>
              </div>
              <button
                onClick={() => setModalFayOpen(true)}
                className="w-full py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700"
              >
                Launch Calculator
              </button>
            </div>

            {/* Tool 4 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>MCDA Attribution Engine</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Multi-Criteria Decision Analysis sliders for blackout gap, speed drop, origin proximity, and prior PSC defects.
                </p>
              </div>
              <button
                onClick={() => setModalMCDAOpen(true)}
                className="w-full py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
              >
                Adjust Weights
              </button>
            </div>

            {/* Tool 5 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>MARPOL Fine Forensics</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Quantify statutory penalties and clean-up recovery liabilities under Merchant Shipping Act and MARPOL Annex I.
                </p>
              </div>
              <button
                onClick={() => setModalMarpolFineOpen(true)}
                className="w-full py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
              >
                Calculate Penalties
              </button>
            </div>

            {/* Tool 6 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Radio className="w-4 h-4 text-red-600" />
                  <span>Tactical VHF Channel 16 Hail</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Standard IMO SMCP verbal interception script with speech synthesis simulation and formal detention orders.
                </p>
              </div>
              <button
                onClick={() => setModalVhfOpen(true)}
                className="w-full py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Generate Hail Script
              </button>
            </div>

            {/* Tool 7 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>Mackay Weathering Curves</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Real-time interactive SVG line curves plotting 72-hour evaporative loss, water emulsification, and viscosity.
                </p>
              </div>
              <button
                onClick={() => setModalWeatheringOpen(true)}
                className="w-full py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
              >
                View Decay Curves
              </button>
            </div>

            {/* Tool 8 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Fingerprint className="w-4 h-4 text-teal-600" />
                  <span>GC-FID Fingerprint Matcher</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  ASTM D3328 Gas Chromatography biomarker alignment between slick samples and candidate bunker slops.
                </p>
              </div>
              <button
                onClick={() => setModalChromatographyOpen(true)}
                className="w-full py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700"
              >
                Compare Biomarkers
              </button>
            </div>

            {/* Tool 9 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Navigation className="w-4 h-4 text-ocean" />
                  <span>Response Dispatcher & ETA</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Task Indian Coast Guard Dornier patrol aircraft, PCV Samudra Prahari, and calculate live transit ETA to slick.
                </p>
              </div>
              <button
                onClick={() => setModalResponseOpen(true)}
                className="w-full py-1.5 rounded-lg bg-ocean text-white font-bold text-xs hover:bg-ocean-deep"
              >
                Task Assets
              </button>
            </div>

            {/* Tool 10 */}
            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl hover:border-ocean transition-all space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-ocean-navy font-bold text-xs">
                  <Compass className="w-4 h-4 text-ocean" />
                  <span>Geodesic Range & Boundary</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                  Great circle distance, true initial bearing, and UNCLOS maritime jurisdiction check (12 NM / 24 NM / 200 NM EEZ).
                </p>
              </div>
              <button
                onClick={() => setModalGeodesicOpen(true)}
                className="w-full py-1.5 rounded-lg bg-ocean text-white font-bold text-xs hover:bg-ocean-deep"
              >
                Open Navigation Calc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DIALOGS FOR ALL 20 FEATURES */}
      {/* ========================================================================= */}
      {modalDossierOpen && (
        <WorkspaceDossierStudioModal
          caseData={caseData}
          caseStatus={caseStatus}
          onClose={() => setModalDossierOpen(false)}
        />
      )}

      {modalEvidenceOpen && (
        <WorkspaceEvidenceBoardModal
          caseData={caseData}
          onClose={() => setModalEvidenceOpen(false)}
        />
      )}

      {modalFayOpen && (
        <WorkspaceFayCalculatorModal
          caseData={caseData}
          onClose={() => setModalFayOpen(false)}
        />
      )}

      {modalMCDAOpen && (
        <WorkspaceMCDAModal
          caseData={caseData}
          onClose={() => setModalMCDAOpen(false)}
        />
      )}

      {modalMarpolFineOpen && (
        <WorkspaceMarpolFineModal
          caseData={caseData}
          onClose={() => setModalMarpolFineOpen(false)}
        />
      )}

      {modalVhfOpen && (
        <WorkspaceVhfScriptModal
          caseData={caseData}
          onClose={() => setModalVhfOpen(false)}
        />
      )}

      {modalWeatheringOpen && (
        <WorkspaceOilWeatheringModal
          caseData={caseData}
          onClose={() => setModalWeatheringOpen(false)}
        />
      )}

      {modalAisDeepDiveOpen && (
        <WorkspaceAisDeepDiveModal
          vessel={selectedAisVessel}
          caseData={caseData}
          onClose={() => setModalAisDeepDiveOpen(false)}
        />
      )}

      {modalResponseOpen && (
        <WorkspaceResponseDispatcherModal
          caseData={caseData}
          onClose={() => setModalResponseOpen(false)}
        />
      )}

      {modalChromatographyOpen && (
        <WorkspaceChromatographyModal
          caseData={caseData}
          onClose={() => setModalChromatographyOpen(false)}
        />
      )}

      {modalGeodesicOpen && (
        <WorkspaceGeodesicToolModal
          caseData={caseData}
          onClose={() => setModalGeodesicOpen(false)}
        />
      )}

    </div>
  );
}
