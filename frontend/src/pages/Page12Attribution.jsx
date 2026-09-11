import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  ShieldCheck, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  HelpCircle,
  FileText,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Scale,
  Zap,
  Download,
  Share2,
  Copy,
  Search,
  Filter,
  Lock,
  RefreshCw,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Ship,
  Award,
  Check,
  Tag,
  Save,
  Layers,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useIncident } from '../context/IncidentContext';
import { CANDIDATE_VESSELS } from '../data/mockData';
import AttributionMap from '../components/attribution/AttributionMap';
import MCDASimulatorModal from '../components/attribution/MCDASimulatorModal';
import VesselCompareModal from '../components/attribution/VesselCompareModal';
import WhatIfSimulatorModal from '../components/attribution/WhatIfSimulatorModal';
import ForensicAffidavitModal from '../components/attribution/ForensicAffidavitModal';

export default function Page12Attribution({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident;
  const initialCandidates = caseData.candidateVessels || CANDIDATE_VESSELS;

  // Active Selected Suspect Vessel
  const [selectedVessel, setSelectedVessel] = useState(() => initialCandidates[0] || caseData.topVessel);

  // Sync when active incident changes
  useEffect(() => {
    const list = caseData.candidateVessels || CANDIDATE_VESSELS;
    setSelectedVessel(list[0] || caseData.topVessel);
  }, [caseData.incidentId]);

  // Modals state
  const [isMcdaOpen, setIsMcdaOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isAffidavitOpen, setIsAffidavitOpen] = useState(false);

  // Feature 1: MCDA Weights State
  const [mcdaWeights, setMcdaWeights] = useState({
    spatial: 25,
    temporal: 20,
    trajectory: 25,
    gap: 20,
    risk: 10
  });

  // Feature 3: Time Scrubber & Kinematic Playback Controller State (T-36h to T-0h)
  const [scrubHour, setScrubHour] = useState(0); // 0 (now) to -36 (start)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);

  // Timer loop for time scrubber playback
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setScrubHour(prev => {
          if (prev >= 0) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(0, prev + 1);
        });
      }, 800 / playSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeed]);

  // Feature 8: Funnel Active Filter Stage
  const [activeFunnelStage, setActiveFunnelStage] = useState(null); // null = all, or 0, 1, 2, 3, 4

  // Feature 14: Search, Filters & Sorting Roster State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('ALL'); // 'ALL', 'CRITICAL', 'REVIEW', 'LOW'
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'TANKER', 'CARGO'
  const [sortBy, setSortBy] = useState('priorityScore'); // 'priorityScore', 'cpaNm', 'aisGapScore', 'trajectoryMatch'
  const [sortOrder, setSortOrder] = useState('desc');

  // Feature 18: Chain of Custody Integrity State
  const [isIntegrityVerified, setIsIntegrityVerified] = useState(true);
  const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);

  // Feature 20: Analyst Notebook & Recommendations (LocalStorage)
  const storageKey = `marine_attribution_notes_${caseData.incidentId || 'default'}`;
  const [analystNotes, setAnalystNotes] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || 
        "Preliminary review: Target vessel transponder silence strongly correlates with reverse hydrodynamic origin cone. Recommend immediate notification to DG Shipping and PSC boarding at port of destination.";
    } catch {
      return "";
    }
  });
  const [selectedTags, setSelectedTags] = useState(['#HighRisk', '#DarkActivity', '#IMO-Referral']);
  const [formalRecommendation, setFormalRecommendation] = useState('MRCC');
  const [notesSavedTime, setNotesSavedTime] = useState('Just now');
  const [shareToast, setShareToast] = useState(false);

  // Active sub-tab for inspection panels
  const [activeInspectorTab, setActiveInspectorTab] = useState('SHAP'); // 'SHAP', 'SIAMESE', 'DARK_AIS', 'REGISTRY', 'RADAR_RCS', 'CHEMICAL', 'AUDIT'

  // Dynamic candidate roster with MCDA weights applied
  const candidateList = useMemo(() => {
    const list = initialCandidates;
    const totalW = mcdaWeights.spatial + mcdaWeights.temporal + mcdaWeights.trajectory + mcdaWeights.gap + mcdaWeights.risk;
    const norm = totalW > 0 ? totalW : 100;
    const wS = mcdaWeights.spatial / norm;
    const wT = mcdaWeights.temporal / norm;
    const wTr = mcdaWeights.trajectory / norm;
    const wG = mcdaWeights.gap / norm;
    const wR = mcdaWeights.risk / norm;

    return list.map((c) => {
      const dynamicScore = Number(
        ((c.spatialMatch || 80) * wS + 
         (c.temporalMatch || 75) * wT + 
         (c.trajectoryMatch || 70) * wTr + 
         (c.aisGapScore || 50) * wG + 
         (c.behaviorMatch || 65) * wR).toFixed(1)
      );
      return {
        ...c,
        dynamicScore
      };
    });
  }, [initialCandidates, mcdaWeights]);

  // Filtered & Sorted Candidates
  const filteredCandidates = useMemo(() => {
    return candidateList.filter((c) => {
      // Funnel Stage Filter
      if (activeFunnelStage === 4 && c.dynamicScore < 60) return false;
      if (activeFunnelStage === 3 && (c.trajectoryMatch || 0) < 65) return false;
      if (activeFunnelStage === 2 && (c.temporalMatch || 0) < 60) return false;
      if (activeFunnelStage === 1 && (c.spatialMatch || 0) < 60) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchMmsi = c.mmsi?.includes(q);
        const matchType = c.type?.toLowerCase().includes(q);
        const matchFlag = c.flag?.toLowerCase().includes(q);
        if (!matchName && !matchMmsi && !matchType && !matchFlag) return false;
      }

      // Priority Tier
      if (filterTier === 'CRITICAL' && c.dynamicScore < 80) return false;
      if (filterTier === 'REVIEW' && (c.dynamicScore < 60 || c.dynamicScore >= 80)) return false;
      if (filterTier === 'LOW' && c.dynamicScore >= 60) return false;

      // Vessel Type
      if (filterType === 'TANKER' && !c.type?.toLowerCase().includes('tanker')) return false;
      if (filterType === 'CARGO' && c.type?.toLowerCase().includes('tanker')) return false;

      return true;
    }).sort((a, b) => {
      let valA = a[sortBy] ?? a.dynamicScore;
      let valB = b[sortBy] ?? b.dynamicScore;
      if (sortBy === 'cpaNm') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [candidateList, activeFunnelStage, searchQuery, filterTier, filterType, sortBy, sortOrder]);

  const leadVessel = candidateList[0] || selectedVessel || {};

  // Funnel Stages Data
  const funnelStages = [
    { id: 0, label: "Historical AIS Ingest", count: "142 vessels", desc: "Corridor ingest", threshold: "Full corridor" },
    { id: 1, label: "Spatial Corridor Buffer", count: "37 vessels", desc: "Within 25 nm buffer", threshold: "CPA < 25 NM" },
    { id: 2, label: "Temporal Overlap Window", count: "19 vessels", desc: "±4h release window", threshold: "Delta t < 4h" },
    { id: 3, label: "Trajectory DTW Match", count: "12 candidates", desc: "Siamese similarity", threshold: "DTW < 0.35" },
    { id: 4, label: "High-Priority Roster", count: `${candidateList.filter(c => c.dynamicScore > 60).length} priority`, desc: "Score > 60/100", highlight: true, threshold: "Score > 60" },
  ];

  // Save Analyst Notes to LocalStorage
  const handleSaveNotes = () => {
    try {
      localStorage.setItem(storageKey, analystNotes);
      setNotesSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Export JSON GIS data
  const handleExportJson = () => {
    const exportData = {
      caseId: caseData.incidentId,
      region: caseData.region,
      exportTimestamp: new Date().toISOString(),
      leadVessel,
      weights: mcdaWeights,
      candidates: filteredCandidates,
      scrubTimeline: { currentHour: scrubHour }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATTRIBUTION_${caseData.incidentId}_FORENSIC.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV candidate roster
  const handleExportCsv = () => {
    const headers = ["Rank", "Name", "MMSI", "IMO", "Type", "Flag", "PriorityScore", "DynamicScore", "CPA_NM", "AisGapScore", "TrajectoryMatch"];
    const rows = filteredCandidates.map(c => [
      c.rank,
      `"${c.name}"`,
      c.mmsi,
      c.imo || 'N/A',
      `"${c.type}"`,
      `"${c.flag}"`,
      c.priorityScore,
      c.dynamicScore,
      c.cpaNm || 1.4,
      c.aisGapScore,
      c.trajectoryMatch
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATTRIBUTION_CANDIDATES_${caseData.incidentId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share link handler
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Verify Audit Log Hashes
  const handleVerifyHashes = () => {
    setVerifyingIntegrity(true);
    setTimeout(() => {
      setVerifyingIntegrity(false);
      setIsIntegrityVerified(true);
    }, 600);
  };

  // Calculate current simulated kinematic position along scrub timeline
  const isInsideDarkZone = scrubHour >= -20 && scrubHour <= -14;
  const currentSpeed = isInsideDarkZone ? 6.2 : 14.2;
  const currentDistance = Math.abs(scrubHour + 14) * 0.9 + 1.4;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* 1. Header & Primary Action Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Vessel Attribution Intelligence & Priority Ranking
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono">
              ● ATTRIBUTION CONVERGED
            </span>
            <span className="px-2 py-0.5 rounded-full bg-ocean-sky text-ocean-deep text-[10px] font-bold font-mono">
              CASE {caseData.incidentId} · {caseData.region}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Coupled Siamese Trajectory Similarity Networks (STSN), XGBoost Gradient Boosted Trees, and Hindcast Reverse Lagrangian Tracking.
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Feature 1: MCDA Simulator Trigger */}
          <button
            onClick={() => setIsMcdaOpen(true)}
            className="px-3 py-2 rounded-xl bg-white border border-border-marine hover:border-ocean hover:bg-ocean-sky/20 text-ocean-navy text-xs font-bold font-mono flex items-center gap-1.5 shadow-marine-sm transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-ocean" />
            <span>MCDA Weights</span>
          </button>

          {/* Feature 7: Compare Vessels Trigger */}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-2 rounded-xl bg-white border border-border-marine hover:border-ocean hover:bg-ocean-sky/20 text-ocean-navy text-xs font-bold font-mono flex items-center gap-1.5 shadow-marine-sm transition-all"
          >
            <Scale className="w-3.5 h-3.5 text-ocean" />
            <span>Compare</span>
          </button>

          {/* Feature 10: What-If Sandbox Trigger */}
          <button
            onClick={() => setIsWhatIfOpen(true)}
            className="px-3 py-2 rounded-xl bg-white border border-border-marine hover:border-ocean hover:bg-ocean-sky/20 text-ocean-navy text-xs font-bold font-mono flex items-center gap-1.5 shadow-marine-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>What-If Sandbox</span>
          </button>

          {/* Feature 15: Formal Affidavit Trigger */}
          <button
            onClick={() => setIsAffidavitOpen(true)}
            className="px-3 py-2 rounded-xl bg-status-danger/10 border border-status-danger/30 hover:bg-status-danger text-status-danger hover:text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Affidavit</span>
          </button>

          {/* Next Page Navigation */}
          <button
            onClick={() => onNavigate("evidence-risk")}
            className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-1.5 transition-all"
          >
            <span>Evidence Fusion & Risk Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mandatory Legal Forensic Disclaimer Banner with Share/Export Quick Actions */}
      <div className="bg-ocean-sky/60 border border-ocean/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ocean-navy">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-ocean-deep font-mono">
                Analytical Forensic Disclaimer
              </span>
              <span className="text-[10px] text-text-muted">· MARPOL 73/78 Annex I Admissibility Standard</span>
            </div>
            <p className="text-[11px] leading-relaxed text-text-secondary mt-0.5">
              Analytical ranking indicates candidate vessels warranting priority administrative subpoena based on available spatio-temporal telemetry. Does not constitute judicial conviction prior to flag-state port state control physical sampling.
            </p>
          </div>
        </div>

        {/* Feature 19: Export / Share Quick Bar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExportJson}
            title="Export GIS GeoJSON / JSON"
            className="px-2.5 py-1.5 rounded-lg bg-white border border-border-marine hover:bg-slate-100 text-[10px] font-mono font-bold flex items-center gap-1 text-slate-700 transition-colors"
          >
            <Download className="w-3 h-3 text-ocean" />
            <span>JSON</span>
          </button>
          <button
            onClick={handleExportCsv}
            title="Export Candidates CSV Roster"
            className="px-2.5 py-1.5 rounded-lg bg-white border border-border-marine hover:bg-slate-100 text-[10px] font-mono font-bold flex items-center gap-1 text-slate-700 transition-colors"
          >
            <Download className="w-3 h-3 text-ocean" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleShareLink}
            title="Copy Direct Link to Dossier"
            className="px-2.5 py-1.5 rounded-lg bg-white border border-border-marine hover:bg-slate-100 text-[10px] font-mono font-bold flex items-center gap-1 text-slate-700 transition-colors relative"
          >
            <Share2 className="w-3 h-3 text-ocean" />
            <span>{shareToast ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Feature 8: Section A - Interactive Multi-Stage Candidate Funnel Filtering */}
      <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted font-mono uppercase">
              Multi-Stage Spatio-Temporal Candidate Funnel
            </span>
            <span className="text-[10px] text-ocean font-mono font-bold">
              (Click any stage to filter candidate roster)
            </span>
          </div>
          {activeFunnelStage !== null && (
            <button
              onClick={() => setActiveFunnelStage(null)}
              className="text-[10px] text-ocean hover:underline font-mono font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Funnel Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {funnelStages.map((stg) => {
            const isSelected = activeFunnelStage === stg.id;
            return (
              <button 
                key={stg.id}
                onClick={() => setActiveFunnelStage(isSelected ? null : stg.id)}
                className={`p-3 rounded-xl border text-center font-mono text-left transition-all ${
                  isSelected 
                    ? 'ring-2 ring-ocean bg-ocean-sky/40 border-ocean text-ocean-deep shadow-sm'
                    : stg.highlight 
                    ? 'bg-red-50/70 border-red-200 text-status-danger hover:border-red-300' 
                    : 'bg-ocean-light/50 border-border-marine text-ocean-navy hover:border-ocean/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted block">{stg.label}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/70 border text-slate-600 font-mono">
                    {stg.threshold}
                  </span>
                </div>
                <span className="text-base font-extrabold mt-1 block">{stg.count}</span>
                <span className="text-[10px] text-text-muted font-sans mt-0.5 block">{stg.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature 2 & 3: Interactive Forensic Map + Kinematic Time-Scrubber Controller */}
      <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-ocean" />
            <h2 className="text-xs font-bold text-ocean-navy uppercase font-mono">
              Spatial Forensic Trajectory Corroboration & Origin Zone
            </h2>
            <span className="text-[10px] font-mono text-text-muted">
              Target: <strong className="text-ocean-deep">{selectedVessel?.name || leadVessel.name}</strong>
            </span>
          </div>

          {/* Real-time telemetry indicators at scrubbed time */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-text-muted">
              Timeline: <strong className="text-ocean-navy">{scrubHour === 0 ? 'T-0h (Now)' : `T${scrubHour}h`}</strong>
            </span>
            <span className="text-text-muted">
              SOG: <strong className="text-ocean-deep">{currentSpeed.toFixed(1)} kn</strong>
            </span>
            <span className="text-text-muted">
              CPA: <strong className="text-status-danger">{currentDistance.toFixed(1)} NM</strong>
            </span>
            {isInsideDarkZone ? (
              <span className="px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold text-[10px] animate-pulse">
                ⚠️ AIS SILENCE GAP
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                ● AIS NOMINAL
              </span>
            )}
          </div>
        </div>

        {/* Feature 2: Attribution Map */}
        <AttributionMap 
          caseData={caseData} 
          selectedVessel={selectedVessel || leadVessel} 
          scrubHour={scrubHour}
          height="h-[300px] sm:h-[380px]"
        />

        {/* Feature 3: Time Scrubber & Kinematic Playback Controller */}
        <div className="p-3 bg-ocean-light/50 border border-border-marine rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Play / Pause / Step Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white shadow-sm transition-colors"
              title={isPlaying ? "Pause Timeline" : "Play Timeline"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setScrubHour(-36)}
              className="p-2 rounded-xl bg-white border border-border-marine hover:bg-slate-100 text-slate-700 transition-colors"
              title="Reset to T-36h"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Playback speed buttons */}
            <div className="flex items-center gap-1 bg-white border border-border-marine rounded-xl p-1 text-[10px] font-mono font-bold">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaySpeed(spd)}
                  className={`px-1.5 py-0.5 rounded-lg transition-colors ${
                    playSpeed === spd ? 'bg-ocean text-white' : 'text-slate-600 hover:text-ocean'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Timeline Range Slider */}
          <div className="flex-1 w-full max-w-xl mx-0 sm:mx-2">
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
              <span>T-36h (Hindcast Ingest)</span>
              <span className="font-bold text-ocean-deep">
                T{scrubHour}h ({Math.abs(scrubHour)} hours prior to detection)
              </span>
              <span>T-0h (SAR Detection)</span>
            </div>
            <input
              type="range"
              min="-36"
              max="0"
              step="1"
              value={scrubHour}
              onChange={(e) => setScrubHour(Number(e.target.value))}
              className="w-full accent-ocean cursor-pointer"
            />
          </div>

          {/* Quick Jump to Anomaly Event */}
          <button
            onClick={() => setScrubHour(-14)}
            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-status-danger text-[10px] font-mono font-bold flex items-center gap-1 flex-shrink-0 transition-colors"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Jump to Blackout</span>
          </button>
        </div>
      </div>

      {/* 4. Deep Forensic Inspector Workbenches (Multi-Tabbed) */}
      <div className="bg-white border border-border-marine rounded-2xl p-4 sm:p-5 shadow-marine-sm space-y-4">
        {/* Tab Selector Bar */}
        <div className="flex items-center gap-2 border-b border-border-marine pb-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'SHAP', label: 'SHAP Waterfall Analysis' },
            { id: 'SIAMESE', label: 'Siamese Trajectory Similarity' },
            { id: 'PSC', label: 'Port State Control & Flag Risk' },
            { id: 'RADAR', label: '6-Axis Forensic Spider' },
            { id: 'ACCUSATION', label: 'Accusatory Matrix & Chain' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInspectorTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeInspectorTab === tab.id
                  ? 'bg-ocean text-white shadow-xs'
                  : 'text-text-secondary hover:bg-ocean-sky hover:text-ocean-deep'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Feature 4 - SHAP Feature Contribution Waterfall */}
        {activeInspectorTab === 'SHAP' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-ocean-navy uppercase font-mono">
                  SHAP (SHapley Additive exPlanations) Feature Attribution
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Mathematical feature contribution vector explaining why {selectedVessel?.name || leadVessel.name} received an XGBoost attribution score of {selectedVessel?.dynamicScore || leadVessel.priorityScore}.
                </p>
              </div>
              <div className="text-left sm:text-right font-mono">
                <span className="text-[10px] text-text-muted block">BASE VALUE E[f(x)]</span>
                <span className="text-xs font-bold text-slate-600">45.0 pts (Corridor Prior)</span>
              </div>
            </div>

            {/* Waterfall Breakdown Rows */}
            <div className="space-y-2.5 font-mono text-xs">
              {[
                { name: "Spatial CPA Distance < 1.5 NM", value: "+24.6 pts", pct: 24.6, desc: "Proximity to backward Lagrangian centroid", positive: true },
                { name: "AIS Transponder Silence Gap (38 min)", value: "+19.2 pts", pct: 19.2, desc: "Deliberate transmission blackout over origin corridor", positive: true },
                { name: "Siamese Trajectory DTW Curvature Match", value: "+16.4 pts", pct: 16.4, desc: "High geometric curve congruence (DTW: 0.12)", positive: true },
                { name: "Kinematic Speed Deceleration Anomaly", value: "+12.8 pts", pct: 12.8, desc: "Speed trough down to 6.2 kn in origin zone", positive: true },
                { name: "Vessel Cargo Class (Crude Tanker)", value: "+8.5 pts", pct: 8.5, desc: "High discharge capability vs container/dry bulk", positive: true },
                { name: "Meteo Clutter & Wave Attenuation Penalty", value: "-5.1 pts", pct: 5.1, desc: "WaveWatch III sea surface backscatter adjustment", positive: false },
              ].map((feat, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-border-marine rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="w-full sm:w-1/3">
                    <span className="font-bold text-ocean-navy block text-[11px]">{feat.name}</span>
                    <span className="text-[9px] text-text-muted font-sans block">{feat.desc}</span>
                  </div>

                  <div className="w-full sm:flex-1 flex items-center gap-2">
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      {feat.positive ? (
                        <div 
                          className="bg-status-danger h-full rounded-full" 
                          style={{ width: `${(feat.pct / 30) * 100}%` }}
                        />
                      ) : (
                        <div 
                          className="bg-emerald-500 h-full rounded-full ml-auto" 
                          style={{ width: `${(feat.pct / 30) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-24 text-left sm:text-right">
                    <span className={`font-extrabold text-xs ${feat.positive ? 'text-status-danger' : 'text-emerald-600'}`}>
                      {feat.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature 16: Bayesian Credible Interval Gauge */}
            <div className="p-3 bg-ocean-sky/40 border border-ocean/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] font-bold text-ocean-deep uppercase block">
                  Bayesian Credible Interval & Uncertainty Quantification
                </span>
                <span className="text-[11px] text-text-secondary">
                  95% Credible Interval: <strong>87.2% — 94.8%</strong> (Posterior Standard Deviation: ±1.8%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  p &lt; 0.001 (STATISTICALLY ROBUST)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Feature 5 - Siamese Trajectory Similarity Network (STSN) */}
        {activeInspectorTab === 'SIAMESE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-3 font-mono text-xs">
              <div className="p-3 bg-ocean-sky/40 border border-ocean/30 rounded-xl">
                <div className="flex justify-between items-baseline">
                  <span className="text-ocean-deep font-bold">Overall Trajectory Embedding Similarity:</span>
                  <span className="text-xl font-extrabold text-ocean">93.4%</span>
                </div>
                <div className="h-2 w-full bg-white rounded-full overflow-hidden mt-1.5">
                  <div className="bg-ocean h-full w-[93.4%]"></div>
                </div>
              </div>

              <div className="space-y-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-border-marine">
                <div className="flex justify-between py-1 border-b border-border-marine/50">
                  <span className="text-text-secondary">Discrete Fréchet Metric:</span>
                  <span className="font-bold text-ocean-deep">1.4 NM (94.0% Match)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-marine/50">
                  <span className="text-text-secondary">Dynamic Time Warping (DTW):</span>
                  <span className="font-bold text-ocean-deep">0.12 Distance (88.0% Match)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-marine/50">
                  <span className="text-text-secondary">Mahalanobis Spatio-Temporal:</span>
                  <span className="font-bold text-ocean-deep">1.82 σ (91.0% Match)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Sinuosity & Curvature Alignment:</span>
                  <span className="font-bold text-ocean-deep">0.04 rad Deviation</span>
                </div>
              </div>

              <p className="text-[10px] text-text-muted font-sans leading-relaxed">
                Architecture: Dual-Stream Bidirectional GRU with Mahalanobis Distance Metric trained on 14,000+ maritime AIS trajectories and Copernicus satellite imagery.
              </p>
            </div>

            {/* SVG Visual Comparison Curve */}
            <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-4 text-white flex flex-col justify-between">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">● Reconstructed AIS Track</span>
                <span className="text-red-400 font-bold">-- Hindcast Oil Drift Envelope</span>
              </div>

              {/* Simplified SVG Trajectory overlay */}
              <div className="my-3 h-36 w-full flex items-center justify-center">
                <svg viewBox="0 0 300 120" className="w-full h-full">
                  {/* Confidence corridor */}
                  <path d="M 20 90 Q 90 70 150 50 T 280 20 L 280 35 Q 210 65 150 65 T 20 105 Z" fill="rgba(0,229,255,0.15)" />
                  {/* Hindcast line */}
                  <path d="M 20 95 Q 90 75 150 55 T 280 25" fill="none" stroke="#FF3B30" strokeWidth="2" strokeDasharray="5,5" />
                  {/* Vessel Track */}
                  <path d="M 20 98 Q 95 72 152 53 T 280 23" fill="none" stroke="#00E5FF" strokeWidth="3" />
                  {/* Discharge point marker */}
                  <circle cx="152" cy="53" r="5" fill="#FF3B30" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="162" y="50" fill="#FF3B30" fontSize="9" fontFamily="monospace">ORIGIN ZONE A</text>
                </svg>
              </div>

              <div className="flex justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-2">
                <span>Start: 14.80°N, 68.80°E</span>
                <span className="text-emerald-400 font-bold">Residual Error: &lt; 0.18 NM</span>
                <span>End: 15.40°N, 69.50°E</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Feature 6 - AIS Dark Activity & Spoofing Analyzer */}
        {activeInspectorTab === 'DARK_AIS' && (
          <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Silence Duration</span>
                <span className="text-xl font-extrabold text-status-danger mt-1 block">38 Minutes</span>
                <span className="text-[9px] text-status-danger font-bold mt-0.5 block">14:02 UTC — 14:40 UTC</span>
              </div>
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">Coastal Receiver Line-of-Sight</span>
                <span className="text-xl font-extrabold text-ocean-navy mt-1 block">100% Coverage</span>
                <span className="text-[9px] text-emerald-600 font-bold mt-0.5 block">Rules out shadow dropouts</span>
              </div>
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">Dead Reckoning Speed</span>
                <span className="text-xl font-extrabold text-ocean mt-1 block">14.2 kn</span>
                <span className="text-[9px] text-text-secondary mt-0.5 block">vs 12.1 kn reported prior</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Intentional Switch-Off Probability</span>
                <span className="text-xl font-extrabold text-amber-700 mt-1 block">94.8%</span>
                <span className="text-[9px] text-amber-700 font-bold mt-0.5 block">High deliberate confidence</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-border-marine rounded-2xl space-y-2">
              <span className="text-xs font-bold text-ocean-navy uppercase">
                Transponder Disconnection Forensic Summary
              </span>
              <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
                Target <strong>{selectedVessel?.name || leadVessel.name}</strong> ceased class-A AIS transmission at <strong>14:02:11 UTC</strong> at coordinate 15.08°N, 69.05°E and resumed transmission at <strong>14:40:24 UTC</strong> at 15.22°N, 69.31°E. Inspection of coastal terrestrial receiver signal logs (Goa MRCC and Ratnagiri coastal radars) demonstrates unbroken radio line-of-sight throughout this interval, eliminating atmospheric ducting or physical terrain shadowing as causes.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Feature 17 - Kinematic Deceleration & Engine Load Anomaly Graph */}
        {activeInspectorTab === 'KINEMATICS' && (
          <div className="space-y-3 animate-in fade-in duration-200 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-ocean-navy uppercase">
                  Vessel Speed Over Ground (SOG) & Engine Load Profile
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5 font-sans">
                  Anomalous speed deceleration trough recorded precisely while traversing Origin Zone A.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold text-[10px]">
                DECELERATION TROUGH: 6.2 kn
              </span>
            </div>

            {/* SVG Speed Timeline Chart */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white">
              <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                <span>10:00 UTC (Nominal Cruise)</span>
                <span className="text-red-400 font-bold">14:15 UTC (Origin Passage & Speed Trough)</span>
                <span>18:00 UTC (Full Ahead)</span>
              </div>
              <div className="h-32 w-full flex items-center justify-center">
                <svg viewBox="0 0 400 100" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  {/* Origin zone shaded corridor */}
                  <rect x="160" y="10" width="80" height="80" fill="rgba(239,68,68,0.2)" />
                  <text x="168" y="25" fill="#EF4444" fontSize="8" fontFamily="monospace">ORIGIN PASSAGE</text>

                  {/* SOG curve */}
                  <path 
                    d="M 10 25 L 80 24 L 140 28 L 180 82 L 220 80 L 260 26 L 380 25" 
                    fill="none" 
                    stroke="#00E5FF" 
                    strokeWidth="3" 
                  />
                  {/* Trough Marker */}
                  <circle cx="200" cy="81" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="210" y="85" fill="#FFFFFF" fontSize="8" fontFamily="monospace">6.2 kn (Pumping speed)</text>
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 border-t border-white/10 pt-1.5">
                <span>Cruising SOG: 14.8 kn</span>
                <span className="text-amber-300">RPM Drop: -42% (Auxiliary generator transfer)</span>
                <span>Resumed SOG: 14.5 kn</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Feature 9 - SAR Radar Cross Section (RCS) Backscatter Fit */}
        {activeInspectorTab === 'RADAR_RCS' && (
          <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">SAR Detected Length × Beam</span>
                <span className="text-base font-extrabold text-ocean-navy mt-1 block">278m × 49m</span>
                <span className="text-[9px] text-text-secondary mt-0.5 block">Sentinel-1 GRD 10m pixel</span>
              </div>
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">AIS Registered Dimensions</span>
                <span className="text-base font-extrabold text-ocean-navy mt-1 block">274m × 48m</span>
                <span className="text-[9px] text-text-secondary mt-0.5 block">Declared IMO Specification</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Dimensional Congruence</span>
                <span className="text-base font-extrabold text-emerald-700 mt-1 block">98.2% Match</span>
                <span className="text-[9px] text-emerald-600 font-bold mt-0.5 block">Confirms target vessel class</span>
              </div>
            </div>

            <div className="p-4 bg-ocean-sky/40 border border-ocean/30 rounded-xl text-[11px] font-sans text-ocean-navy leading-relaxed">
              <strong>Doppler Centroid Velocity Validation:</strong> Satellite azimuth phase shift analysis yields a Doppler-derived ground speed of <strong>12.3 knots</strong> at image acquisition timestamp (14:32 UTC), corroborating the vessel’s kinematic speed state during the period of AIS transponder silence.
            </div>
          </div>
        )}

        {/* Tab 6: Feature 12 - Vessel Registry Dossier & Owner / P&I Club Intelligence */}
        {activeInspectorTab === 'REGISTRY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-200 font-mono text-xs">
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
              <span className="text-[10px] text-text-muted block">Beneficial Owner</span>
              <span className="font-bold text-ocean-navy mt-1 block">Ocean Crest Maritime Corp</span>
              <span className="text-[10px] text-text-secondary">Monrovia, Liberia</span>
            </div>
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
              <span className="text-[10px] text-text-muted block">P&I Club Insurer</span>
              <span className="font-bold text-ocean-navy mt-1 block">Gard P&I (Norway)</span>
              <span className="text-[10px] text-emerald-600 font-bold">Active Blue Card 2026</span>
            </div>
            <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
              <span className="text-[10px] text-text-muted block">Classification Society</span>
              <span className="font-bold text-ocean-navy mt-1 block">DNV (Det Norske Veritas)</span>
              <span className="text-[10px] text-text-secondary">Class 1A Tanker ESP</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-[10px] text-text-muted block">PSC Deficiency History</span>
              <span className="font-bold text-status-danger mt-1 block">2 Deficiencies (2024)</span>
              <span className="text-[10px] text-status-danger">MARPOL Annex I filtering</span>
            </div>
          </div>
        )}

        {/* Tab 7: Feature 11 - MARPOL Annex I Statutory Penalty & Impact Calculator */}
        {activeInspectorTab === 'PENALTY' && (
          <div className="space-y-3 animate-in fade-in duration-200 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">Estimated Discharged Volume</span>
                <span className="text-xl font-extrabold text-ocean mt-1 block">48.2 Metric Tons</span>
                <span className="text-[9px] text-text-secondary">Bonn Agreement Code 3/4</span>
              </div>
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">Jurisdictional Zone</span>
                <span className="text-xl font-extrabold text-ocean-navy mt-1 block">Exclusive Economic Zone</span>
                <span className="text-[9px] text-text-secondary">UNCLOS Article 211 Authority</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Calculated Statutory Fine</span>
                <span className="text-xl font-extrabold text-status-danger mt-1 block">$2,880,000 USD</span>
                <span className="text-[9px] text-status-danger font-bold">+ Response cleanup restitution</span>
              </div>
            </div>
            <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
              Assessment based on the International Convention on Civil Liability for Bunker Oil Pollution Damage and Indian Merchant Shipping Act Section 356 (Prevention of Pollution of the Sea by Oil).
            </p>
          </div>
        )}

        {/* Tab 8: Feature 13 - Chemical Fingerprint & Hydrocarbon Biomarker Match */}
        {activeInspectorTab === 'CHEMICAL' && (
          <div className="space-y-3 animate-in fade-in duration-200 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl">
                <span className="text-[10px] text-text-muted block">Cargo Manifest Type</span>
                <span className="font-bold text-ocean-navy mt-1 block">Arabian Heavy Crude</span>
                <span className="text-[9px] text-text-secondary">API Gravity 27.9°</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Biomarker Ratio (Hopanes C30/C29)</span>
                <span className="text-base font-extrabold text-emerald-700 mt-1 block">94.2% Match</span>
                <span className="text-[9px] text-emerald-600 font-bold">High chemical similarity</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-text-muted block">Fluorescence & PAH Index</span>
                <span className="text-base font-extrabold text-emerald-700 mt-1 block">91.8% Match</span>
                <span className="text-[9px] text-emerald-600 font-bold">Polycyclic hydrocarbon match</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Feature 18 - Chain of Custody & Cryptographic Hash Audit Log */}
        {activeInspectorTab === 'AUDIT' && (
          <div className="space-y-3 animate-in fade-in duration-200 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border-marine">
              <span className="font-bold text-ocean-navy uppercase">
                Cryptographic Evidence Chain of Custody (SHA-256)
              </span>
              <button
                onClick={handleVerifyHashes}
                disabled={verifyingIntegrity}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-1 border border-emerald-200 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${verifyingIntegrity ? 'animate-spin' : ''}`} />
                <span>{verifyingIntegrity ? 'Verifying Digests...' : 'Verify Cryptographic Integrity'}</span>
              </button>
            </div>

            <div className="border border-border-marine rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-ocean-light text-[9px] text-text-muted uppercase">
                  <tr>
                    <th className="px-3 py-2">FORENSIC ARTIFACT</th>
                    <th className="px-3 py-2">SOURCE</th>
                    <th className="px-3 py-2">SHA-256 CHECKSUM</th>
                    <th className="px-3 py-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-marine/50">
                  {[
                    { name: "Raw Terrestrial AIS Stream", src: "Goa MRCC Receiver NMEA", hash: "8f3a9e201c7849df0a51c98a3e7b2190" },
                    { name: "Copernicus Sentinel-1 IW GeoTIFF", src: "ESA SciHub Level-1 GRD", hash: "c4b120f98e6a1005b42d76a213e89c10" },
                    { name: "Lagrangian Backward Drift Particles", src: "HYCOM + ECMWF Reanalysis", hash: "7d08e5a1b329c011e4f901a52b890f33" },
                    { name: "STSN Deep GRU Weights (v2.8)", src: "PyTorch Model Registry", hash: "2a98f10b7782da01cc03328e19b54122" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-bold text-ocean-navy">{row.name}</td>
                      <td className="px-3 py-2 text-text-secondary">{row.src}</td>
                      <td className="px-3 py-2 text-slate-500">{row.hash}</td>
                      <td className="px-3 py-2 text-right">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                          ✓ VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Feature 14: Candidate Vessels Live Search, Filter & Multi-Sort Toolbar */}
      <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-ocean-navy uppercase font-mono block">
              XGBoost Candidate Vessel Attribution Ranking Table
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              Showing {filteredCandidates.length} of {candidateList.length} candidate vessels evaluated
            </span>
          </div>

          {/* Search, Filter & Sort Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, MMSI, flag..."
                className="pl-8 pr-3 py-1.5 bg-ocean-light/50 border border-border-marine rounded-xl text-xs font-mono focus:outline-none focus:border-ocean text-ocean-navy placeholder:text-text-muted w-48 sm:w-56"
              />
            </div>

            {/* Priority Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-2.5 py-1.5 bg-ocean-light/50 border border-border-marine rounded-xl text-xs font-mono font-bold text-ocean-navy focus:outline-none focus:border-ocean"
            >
              <option value="ALL">All Tiers</option>
              <option value="CRITICAL">Critical (&gt; 80)</option>
              <option value="REVIEW">Review (60-80)</option>
              <option value="LOW">Low (&lt; 60)</option>
            </select>

            {/* Vessel Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-ocean-light/50 border border-border-marine rounded-xl text-xs font-mono font-bold text-ocean-navy focus:outline-none focus:border-ocean"
            >
              <option value="ALL">All Types</option>
              <option value="TANKER">Tankers Only</option>
              <option value="CARGO">Cargo / Container</option>
            </select>

            {/* Sort Column */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-ocean-light/50 border border-border-marine rounded-xl text-xs font-mono font-bold text-ocean-navy focus:outline-none focus:border-ocean"
            >
              <option value="priorityScore">Priority Score</option>
              <option value="cpaNm">Closest Proximity (CPA)</option>
              <option value="aisGapScore">AIS Silence Gap</option>
              <option value="trajectoryMatch">Trajectory Match</option>
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-xl bg-ocean-light/50 border border-border-marine text-ocean-navy hover:bg-ocean-sky/20 transition-colors"
              title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
            >
              <TrendingDown className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-ocean-light border-b border-border-marine text-[9px] text-text-muted uppercase">
              <tr>
                <th className="px-3 py-2.5">RANK</th>
                <th className="px-3 py-2.5">VESSEL IDENTIFIER</th>
                <th className="px-3 py-2.5">SPATIAL (CPA)</th>
                <th className="px-3 py-2.5">TEMPORAL</th>
                <th className="px-3 py-2.5">TRAJECTORY</th>
                <th className="px-3 py-2.5">AIS GAP</th>
                <th className="px-3 py-2.5">MCDA SCORE</th>
                <th className="px-3 py-2.5 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-marine/50">
              {filteredCandidates.map((v) => {
                const isSelected = (selectedVessel?.mmsi || leadVessel.mmsi) === v.mmsi;
                return (
                  <tr 
                    key={v.mmsi} 
                    onClick={() => setSelectedVessel(v)}
                    className={`hover:bg-ocean-sky/30 cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-ocean-sky/40 border-l-4 border-l-ocean font-semibold' 
                        : v.rank === '01' 
                        ? 'bg-red-50/40' 
                        : ''
                    }`}
                  >
                    <td className="px-3 py-3 font-bold text-ocean-navy">
                      <div className="flex items-center gap-1">
                        {v.rank === '01' && <Award className="w-3.5 h-3.5 text-status-danger" />}
                        <span>#{v.rank}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-bold text-ocean-navy">{v.name}</div>
                      <div className="text-[9px] text-text-muted">
                        {v.flag} · {v.type} · MMSI: {v.mmsi}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">
                      {v.spatialMatch}% <span className="text-[10px] text-text-muted font-sans">({v.cpaNm || 1.4} NM)</span>
                    </td>
                    <td className="px-3 py-3 text-text-secondary">{v.temporalMatch}%</td>
                    <td className="px-3 py-3 text-text-secondary">{v.trajectoryMatch}%</td>
                    <td className="px-3 py-3">
                      <span className={v.aisGapScore > 80 ? 'text-status-danger font-bold' : 'text-text-muted'}>
                        {v.gapDuration || `${v.aisGapScore} pts`}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.dynamicScore > 80 
                          ? 'bg-status-danger text-white' 
                          : v.dynamicScore > 60 
                          ? 'bg-amber-100 text-status-warning' 
                          : 'bg-slate-100 text-text-muted'
                      }`}>
                        {v.dynamicScore} / 100
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVessel(v);
                          setActiveInspectorTab('SHAP');
                        }}
                        className="px-2.5 py-1 rounded text-[10px] bg-ocean hover:bg-ocean-deep text-white font-bold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Lead Vessel Forensic Conclusion Footnote */}
        <div className="pt-2 border-t border-border-marine flex flex-col sm:flex-row sm:items-center justify-between text-xs text-text-secondary gap-1">
          <span>
            Primary Driver for <strong>{selectedVessel?.name || leadVessel.name}</strong>: Transponder silence gap ({selectedVessel?.gapDuration || '38 min'}) coincident with Origin Zone A passage.
          </span>
          <span className="font-bold text-status-danger font-mono">
            Convergence Priority: {selectedVessel?.dynamicScore || leadVessel.priorityScore} / 100
          </span>
        </div>
      </div>

      {/* Feature 20: Forensic Analyst Notebook, Tags & Recommendation Logger */}
      <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-ocean" />
            <h2 className="text-xs font-bold text-ocean-navy uppercase font-mono">
              Forensic Analyst Case Log & Official Enforcement Directive
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span>Last Saved: <strong className="text-emerald-700">{notesSavedTime}</strong></span>
          </div>
        </div>

        {/* Case Tags Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-muted font-mono uppercase">Case Tags:</span>
          {['#HighRisk', '#DarkActivity', '#IMO-Referral', '#UrgentInterception', '#Bonn-Code4', '#BiomarkerMatched'].map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-colors ${
                  isSelected 
                    ? 'bg-ocean text-white border-ocean' 
                    : 'bg-slate-50 border-border-marine text-slate-600 hover:bg-ocean-sky/20'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Official Statutory Recommendation Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            formalRecommendation === 'MRCC' ? 'bg-red-50 border-red-300 text-status-danger font-bold' : 'bg-slate-50 border-border-marine text-slate-700'
          }`}>
            <input 
              type="radio" 
              name="directive" 
              value="MRCC" 
              checked={formalRecommendation === 'MRCC'} 
              onChange={() => setFormalRecommendation('MRCC')}
              className="mr-2"
            />
            <span>1. Alert Coast Guard MRCC for Interception</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            formalRecommendation === 'PSC' ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-slate-50 border-border-marine text-slate-700'
          }`}>
            <input 
              type="radio" 
              name="directive" 
              value="PSC" 
              checked={formalRecommendation === 'PSC'} 
              onChange={() => setFormalRecommendation('PSC')}
              className="mr-2"
            />
            <span>2. Direct PSC Bilge Sampling at Next Port</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            formalRecommendation === 'WATCH' ? 'bg-ocean-sky/50 border-ocean/40 text-ocean-deep font-bold' : 'bg-slate-50 border-border-marine text-slate-700'
          }`}>
            <input 
              type="radio" 
              name="directive" 
              value="WATCH" 
              checked={formalRecommendation === 'WATCH'} 
              onChange={() => setFormalRecommendation('WATCH')}
              className="mr-2"
            />
            <span>3. Maintain Satellite Radar Surveillance</span>
          </label>
        </div>

        {/* Freeform Analyst Notes & Save Button */}
        <div className="space-y-2">
          <textarea
            rows="3"
            value={analystNotes}
            onChange={(e) => setAnalystNotes(e.target.value)}
            placeholder="Record forensic investigator findings, cross-referenced satellite observations, or subpoena directives..."
            className="w-full p-3 bg-ocean-light/30 border border-border-marine rounded-xl text-xs font-mono text-ocean-navy focus:outline-none focus:border-ocean placeholder:text-text-muted"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold font-mono shadow-marine-sm flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Investigator Notes (LocalStorage)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MCDASimulatorModal
        isOpen={isMcdaOpen}
        onClose={() => setIsMcdaOpen(false)}
        candidateList={candidateList}
        currentWeights={mcdaWeights}
        onApplyWeights={(newWeights) => setMcdaWeights(newWeights)}
      />

      <VesselCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        candidateList={candidateList}
        initialVessel1={selectedVessel || leadVessel}
        initialVessel2={candidateList[1] || candidateList[0]}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        selectedVessel={selectedVessel || leadVessel}
        caseData={caseData}
      />

      <ForensicAffidavitModal
        isOpen={isAffidavitOpen}
        onClose={() => setIsAffidavitOpen(false)}
        caseData={caseData}
        selectedVessel={selectedVessel || leadVessel}
      />
    </div>
  );
}
