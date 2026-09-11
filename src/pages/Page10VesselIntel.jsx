import React, { useState, useEffect, useMemo } from 'react';
import { 
  Ship, 
  Search, 
  Target, 
  Compass, 
  AlertTriangle, 
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  Radio,
  FileText,
  Scale
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';
import { CANDIDATE_VESSELS } from '../data/mockData';

// 20 Detailed Frontend Forensic Components
import VesselSearchBar from '../components/vesselIntel/VesselSearchBar';
import WatchlistSentryBanner from '../components/vesselIntel/WatchlistSentryBanner';
import TelemetryPlaybackBar from '../components/vesselIntel/TelemetryPlaybackBar';
import RangeRingCpaCard from '../components/vesselIntel/RangeRingCpaCard';
import AISTransponderCard from '../components/vesselIntel/AISTransponderCard';
import DarkVesselSpoofCard from '../components/vesselIntel/DarkVesselSpoofCard';
import MarpolFineCalculatorCard from '../components/vesselIntel/MarpolFineCalculatorCard';
import VesselTankOwsCard from '../components/vesselIntel/VesselTankOwsCard';
import PscHistoryCard from '../components/vesselIntel/PscHistoryCard';
import FleetOwnershipCard from '../components/vesselIntel/FleetOwnershipCard';
import MetOceanCorrelatorCard from '../components/vesselIntel/MetOceanCorrelatorCard';
import InvestigatorLogbookCard from '../components/vesselIntel/InvestigatorLogbookCard';
import MpaGeofenceRadarCard from '../components/vesselIntel/MpaGeofenceRadarCard';
import SarCrossMatchCard from '../components/vesselIntel/SarCrossMatchCard';
import EngineEmissionsCard from '../components/vesselIntel/EngineEmissionsCard';
import TacticalVhfRadioCard from '../components/vesselIntel/TacticalVhfRadioCard';
import HullDraftGaugeCard from '../components/vesselIntel/HullDraftGaugeCard';
import VesselCompareModal from '../components/vesselIntel/VesselCompareModal';
import VesselDossierPrintModal from '../components/vesselIntel/VesselDossierPrintModal';
import VesselLookupAddModal from '../components/vesselIntel/VesselLookupAddModal';

export default function Page10VesselIntel({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident;
  
  // Master candidate vessels list (allows injecting new vessels via lookup modal)
  const [candidateList, setCandidateList] = useState(() => {
    return caseData.candidateVessels || CANDIDATE_VESSELS;
  });

  const [selectedVessel, setSelectedVessel] = useState(() => {
    return caseData.topVessel || candidateList[0];
  });

  // Sync candidateList & selectedVessel when active incident changes
  useEffect(() => {
    const list = caseData.candidateVessels || CANDIDATE_VESSELS;
    setCandidateList(list);
    setSelectedVessel(caseData.topVessel || list[0]);
  }, [caseData.incidentId]);

  // Search, Filter & Sort State (Feature 1)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedRisk, setSelectedRisk] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('priority');

  // Active Forensic Domain Tab
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'signals', 'marpol', 'corporate', 'tactical'

  // Modals state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isAddVesselOpen, setIsAddVesselOpen] = useState(false);

  // Watchlist state (stored in localStorage) (Feature 19)
  const [watchlistedMmsis, setWatchlistedMmsis] = useState(() => {
    try {
      const saved = localStorage.getItem('marinesight_watchlist');
      return saved ? JSON.parse(saved) : ['419001248'];
    } catch(e) {
      return ['419001248'];
    }
  });

  const toggleWatchlist = (mmsi) => {
    setWatchlistedMmsis((prev) => {
      const next = prev.includes(mmsi) ? prev.filter(id => id !== mmsi) : [...prev, mmsi];
      try {
        localStorage.setItem('marinesight_watchlist', JSON.stringify(next));
      } catch(e) {}
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedRisk('All Statuses');
    setSortBy('priority');
  };

  const handleAddVessel = (newVessel) => {
    setCandidateList(prev => [newVessel, ...prev]);
    setSelectedVessel(newVessel);
  };

  // Filter & sort logic
  const filteredCandidates = useMemo(() => {
    return candidateList.filter((v) => {
      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText = 
          v.name.toLowerCase().includes(q) ||
          (v.mmsi && v.mmsi.includes(q)) ||
          (v.imo && v.imo.includes(q)) ||
          (v.flag && v.flag.toLowerCase().includes(q)) ||
          (v.destination && v.destination.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Vessel Type filter
      if (selectedType !== 'All Types') {
        if (!v.type || !v.type.toLowerCase().includes(selectedType.toLowerCase().split(' ')[0])) {
          return false;
        }
      }

      // Risk Status filter
      if (selectedRisk !== 'All Statuses') {
        if (!v.status || v.status.toUpperCase() !== selectedRisk.toUpperCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') return (b.priorityScore || 0) - (a.priorityScore || 0);
      if (sortBy === 'cpa') return (a.cpaNm || 99) - (b.cpaNm || 99);
      if (sortBy === 'speed') return (b.speedKn || 0) - (a.speedKn || 0);
      if (sortBy === 'gap') {
        const gapA = parseInt(a.gapDuration) || 0;
        const gapB = parseInt(b.gapDuration) || 0;
        return gapB - gapA;
      }
      return 0;
    });
  }, [candidateList, searchQuery, selectedType, selectedRisk, sortBy]);

  const isCurrentWatchlisted = watchlistedMmsis.includes(selectedVessel?.mmsi);

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* 1. Header Bar with Priority Badge & Trajectory Jump */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Vessel Intelligence & Forensics Dossier
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-status-danger/10 text-status-danger border border-status-danger/30 text-[10px] font-bold font-mono">
              ● PRIORITY TARGET IDENTIFIED ({caseData.region})
            </span>
            <span className="px-2 py-0.5 rounded-full bg-ocean-sky text-ocean-deep border border-ocean/20 text-[10px] font-bold font-mono">
              20 FORENSIC AUDIT ENGINES ACTIVE
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Spatio-temporal AIS correlation, range rings proximity, transponder integrity, and multi-agency maritime intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("trajectory")}
            className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-1.5 transition-all"
          >
            <span>Analyze Trajectory (Bi-LSTM)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Feature 19: Emergency Interception Watchlist Banner */}
      <WatchlistSentryBanner 
        vessel={selectedVessel}
        isWatchlisted={isCurrentWatchlisted}
        onToggleWatchlist={() => toggleWatchlist(selectedVessel.mmsi)}
      />

      {/* 3. Feature 1: Multi-Filter Search & Action Bar */}
      <VesselSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedRisk={selectedRisk}
        setSelectedRisk={setSelectedRisk}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={handleResetFilters}
        totalCount={candidateList.length}
        filteredCount={filteredCandidates.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenAddVessel={() => setIsAddVesselOpen(true)}
      />

      {/* 4. Candidate Vessels Quick Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filteredCandidates.length === 0 ? (
          <div className="p-3 text-xs text-text-muted font-mono">
            No vessels match the current filter criteria. Click "Reset" in the search bar.
          </div>
        ) : (
          filteredCandidates.map((v) => {
            const isSelected = selectedVessel.mmsi === v.mmsi;
            const isWatchlisted = watchlistedMmsis.includes(v.mmsi);
            return (
              <button
                key={v.mmsi}
                onClick={() => setSelectedVessel(v)}
                className={`px-3 py-2 rounded-xl border text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-white border-status-danger/40 text-status-danger shadow-marine-sm font-bold ring-2 ring-red-100'
                    : 'bg-white border-border-marine text-text-secondary hover:bg-ocean-sky'
                }`}
              >
                {isWatchlisted && <span className="w-2 h-2 rounded-full bg-status-danger animate-ping inline-block" />}
                <span>{v.rank}. {v.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-ocean-sky text-ocean-deep">
                  Score: {v.priorityScore}
                </span>
                <span className="text-[9px] text-text-muted">
                  CPA: {v.cpaNm || 1.4}nm
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* 5. Main Top Grid: Range Rings Map (7 cols) + Identity & Telemetry Dossier (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Map & Range Ring Customizer (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-marine text-xs font-bold text-ocean-navy">
                <span className="font-mono">PROXIMITY RANGE RINGS & CORRIDOR TRACK ({caseData.region})</span>
                <span className="text-[10px] font-mono text-status-danger font-bold">
                  CPA: {selectedVessel.cpaNm || 1.4} nm
                </span>
              </div>
              <GISMapMock 
                mode="vessel-intel" 
                caseData={caseData}
                height="h-[320px] sm:h-[430px]"
              />
            </div>

            <div className="mt-3 pt-3 border-t border-border-marine grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 bg-ocean-light rounded border border-border-marine/50">
                <span className="text-text-muted text-[9px] block">CLOSEST POINT OF APPROACH</span>
                <span className="font-bold text-status-danger">{selectedVessel.cpaNm || 1.4} nm (22:42 UTC)</span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/50">
                <span className="text-text-muted text-[9px] block">AIS BLACKOUT DURATION</span>
                <span className="font-bold text-status-danger">{selectedVessel.gapDuration || "38 min"} Silence</span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/50">
                <span className="text-text-muted text-[9px] block">CURRENT SPEED / COG</span>
                <span className="font-bold text-ocean-navy">{selectedVessel.speedKn || 12.4} kn · {selectedVessel.heading || 284}° Heading</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Range Ring & CPA Kinematic Customizer */}
          <RangeRingCpaCard vessel={selectedVessel} caseData={caseData} />
        </div>

        {/* Right: Vessel Telemetry Dossier & Hull Waterline (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Identity Card */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex items-start justify-between pb-2 mb-3 border-b border-border-marine">
              <div>
                <span className="text-[10px] font-mono text-text-muted uppercase font-bold">Selected Target Profile</span>
                <h3 className="text-base font-extrabold text-ocean-navy mt-0.5">{selectedVessel.name}</h3>
                <p className="text-[11px] text-text-secondary font-mono">
                  {selectedVessel.type} · Flag: {selectedVessel.flag}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-50 text-status-danger border border-red-200 text-[10px] font-bold font-mono">
                ● {selectedVessel.status}
              </span>
            </div>

            {/* Vessel Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">MMSI NUMBER</span>
                <span className="font-bold text-ocean-deep">{selectedVessel.mmsi}</span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">IMO NUMBER</span>
                <span className="font-bold text-text-primary">{selectedVessel.imo}</span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">LENGTH / BEAM</span>
                <span className="font-bold text-text-primary">{selectedVessel.lengthM}m / {selectedVessel.beamM}m</span>
              </div>
              <div className="p-2 bg-ocean-light rounded border border-border-marine/40">
                <span className="text-[9px] text-text-muted block">DESTINATION & ETA</span>
                <span className="font-bold text-ocean">{selectedVessel.destination || "Singapore (ETA: 14 SEP)"}</span>
              </div>
            </div>
          </div>

          {/* Speed & Course Anomaly Chart Widget */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase">Speed Profile (24h Timeline)</span>
              <span className="text-[10px] font-bold text-status-danger">ANOMALOUS DROP: 3.8 kn</span>
            </div>

            <p className="text-[11px] text-text-secondary mb-2 font-sans">
              Sharp unlogged deceleration coinciding with origin Zone A transit and transponder blackout:
            </p>

            {/* Simulated Speed Line Chart */}
            <div className="h-24 w-full bg-ocean-light/70 rounded-lg p-2 border border-border-marine flex items-end justify-between gap-1 relative overflow-hidden">
              <span className="absolute top-1 left-2 text-[9px] text-text-muted">14 kn</span>
              <span className="absolute bottom-1 left-2 text-[9px] text-text-muted">0 kn</span>

              {/* Data points */}
              {[13.2, 13.1, 13.0, 12.8, 12.4, 8.5, 4.2, 3.8, 4.0, 8.2, 12.2, 12.4].map((spd, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div 
                    style={{ height: `${(spd / 15) * 100}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      spd <= 4.2 ? 'bg-status-danger' : 'bg-ocean'
                    }`}
                  />
                  <span className="text-[8px] text-text-muted mt-0.5">{idx * 2}h</span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
              <span>Cruising: 13.2 kn</span>
              <span className="text-status-danger font-bold">Blackout Trough: 3.8 kn</span>
              <span>Resumed: 12.4 kn</span>
            </div>
          </div>

          {/* Feature 20: 2.5D Hull Waterline, Draft & Trim Gauges */}
          <HullDraftGaugeCard vessel={selectedVessel} />

          {/* Attribution Score Pill */}
          <div className="p-3.5 rounded-xl border border-status-danger/40 bg-red-50/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-status-danger font-mono uppercase block">
                Investigation Priority Score
              </span>
              <span className="text-2xl font-extrabold text-status-danger font-mono">
                {selectedVessel.priorityScore} / 100
              </span>
            </div>
            <button
              onClick={() => onNavigate("attribution")}
              className="px-4 py-2 bg-ocean hover:bg-ocean-deep text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>View Attribution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Feature 4: 24-Hour Telemetry Playback Scrubbing Bar */}
      <TelemetryPlaybackBar vessel={selectedVessel} />

      {/* 7. Forensic Domain Explorer Tabs Bar */}
      <div className="bg-white border border-border-marine rounded-2xl p-2 shadow-marine-sm flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All 20 Forensics Ensembles', icon: Sparkles },
            { id: 'signals', label: 'AIS & Signal Forensics', icon: Radio },
            { id: 'marpol', label: 'MARPOL & Hull Tanks', icon: Scale },
            { id: 'corporate', label: 'Corporate & Regs', icon: FileText },
            { id: 'tactical', label: 'Tactical & Comms', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-ocean-navy text-white shadow-sm'
                    : 'text-text-secondary hover:bg-ocean-light hover:text-text-primary'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ocean-bright' : 'text-text-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-text-secondary hidden md:block px-2">
          Target: <strong className="text-ocean-navy">{selectedVessel.name}</strong>
        </div>
      </div>

      {/* 8. Detailed Forensic Audit Cards Grid (Features 2, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16) */}
      <div className="space-y-5">
        {/* Section A: AIS & Signal Integrity (Features 2 & 5) */}
        {(activeTab === 'all' || activeTab === 'signals') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AISTransponderCard vessel={selectedVessel} />
            <DarkVesselSpoofCard vessel={selectedVessel} />
          </div>
        )}

        {/* Section B: MARPOL Law, Tanks & Emissions (Features 7, 8 & 15) */}
        {(activeTab === 'all' || activeTab === 'marpol') && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <MarpolFineCalculatorCard vessel={selectedVessel} />
              <VesselTankOwsCard vessel={selectedVessel} />
            </div>
            <EngineEmissionsCard vessel={selectedVessel} />
          </div>
        )}

        {/* Section C: Corporate, Fleet & Inspection Regs (Features 9, 10, 13 & 14) */}
        {(activeTab === 'all' || activeTab === 'corporate') && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PscHistoryCard vessel={selectedVessel} />
              <FleetOwnershipCard vessel={selectedVessel} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <MpaGeofenceRadarCard vessel={selectedVessel} />
              <SarCrossMatchCard vessel={selectedVessel} />
            </div>
          </div>
        )}

        {/* Section D: MetOcean, Tactical Radio & Investigator Logbook (Features 11, 12 & 16) */}
        {(activeTab === 'all' || activeTab === 'tactical') && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <MetOceanCorrelatorCard vessel={selectedVessel} caseData={caseData} />
              <TacticalVhfRadioCard vessel={selectedVessel} />
            </div>
            <InvestigatorLogbookCard vessel={selectedVessel} />
          </div>
        )}
      </div>

      {/* 9. Modals (Features 6, 17 & 18) */}
      <VesselCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        candidateList={candidateList}
        defaultVesselA={selectedVessel}
      />

      <VesselDossierPrintModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        vessel={selectedVessel}
        caseData={caseData}
      />

      <VesselLookupAddModal
        isOpen={isAddVesselOpen}
        onClose={() => setIsAddVesselOpen(false)}
        onAddVessel={handleAddVessel}
        existingCount={candidateList.length}
      />
    </div>
  );
}
