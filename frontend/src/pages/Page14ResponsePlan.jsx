import React, { useState, useMemo } from 'react';
import { 
  LifeBuoy, 
  ShieldAlert, 
  Ship, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  Send,
  Download,
  Layers,
  Anchor,
  Sliders,
  Gauge,
  Droplets,
  Flame,
  Wind,
  Users,
  Truck,
  DollarSign,
  Heart,
  Radio,
  Award,
  Sparkles,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';

// 20 Frontend Response Plan Features
import StrategyScenarioBar from '../components/response/StrategyScenarioBar';
import BoomCalculator from '../components/response/BoomCalculator';
import SkimmerRecoveryCalculator from '../components/response/SkimmerRecoveryCalculator';
import VesselFleetDispatchBoard from '../components/response/VesselFleetDispatchBoard';
import ShorelineEsiMatrix from '../components/response/ShorelineEsiMatrix';
import DispersantAdvisor from '../components/response/DispersantAdvisor';
import InSituBurnAdvisor from '../components/response/InSituBurnAdvisor';
import IapHeaderSection from '../components/response/IapHeaderSection';
import Ics204TaskDirectives from '../components/response/Ics204TaskDirectives';
import MetoceanSafetyMatrix from '../components/response/MetoceanSafetyMatrix';
import ResponseTimelineTracker from '../components/response/ResponseTimelineTracker';
import StrikeTeamRoster from '../components/response/StrikeTeamRoster';
import OilyWasteLogistics from '../components/response/OilyWasteLogistics';
import ResponseBudgetEstimator from '../components/response/ResponseBudgetEstimator';
import WildlifeRescueModule from '../components/response/WildlifeRescueModule';
import MultiAgencyBroadcaster from '../components/response/MultiAgencyBroadcaster';
import NosDcpComplianceChecklist from '../components/response/NosDcpComplianceChecklist';
import OperationalRadioLog from '../components/response/OperationalRadioLog';
import TacticalGisOverlayControls from '../components/response/TacticalGisOverlayControls';
import DossierExportSuite from '../components/response/DossierExportSuite';

export default function Page14ResponsePlan({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident;

  // Active tactical strategy (Feature 1)
  const [activeStrategy, setActiveStrategy] = useState('alpha');

  // Authorization state (Feature 8, 20)
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Virtual booms staged onto GIS Map (Feature 2, 19)
  const [virtualBooms, setVirtualBooms] = useState([]);

  // Active layers for GIS Map (Feature 19)
  const [activeLayers, setActiveLayers] = useState({
    booms: true,
    vessels: true,
    oilSpills: true,
    windVectors: true,
    riskZones: true
  });
  const [mapType, setMapType] = useState('nautical');

  // Domain Tab Navigation
  const [activeTab, setActiveTab] = useState('tactical_command'); // 'tactical_command', 'calculators', 'ecology', 'logistics', 'comms_audit', 'all'

  // Add virtual boom to map callback
  const handleAddVirtualBoom = (newBoom) => {
    setVirtualBooms(prev => [...prev, newBoom]);
  };

  const handleResetVirtualBooms = () => {
    setVirtualBooms([]);
  };

  const handleToggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const tabs = [
    { id: 'tactical_command', label: '1. Tactical Map & Fleet Command', icon: Ship, badge: 'CORE' },
    { id: 'calculators', label: '2. Containment & Physics Calculators', icon: Gauge, badge: 'ASTM/IMO' },
    { id: 'ecology', label: '3. Shoreline & Ecological Defense', icon: ShieldAlert, badge: 'ESI 1-10' },
    { id: 'logistics', label: '4. Logistics, Personnel & Budget', icon: Users, badge: 'IOPC' },
    { id: 'comms_audit', label: '5. C4I Dispatch & Statutory Audit', icon: Radio, badge: 'NOS-DCP' },
    { id: 'all', label: '★ Unified Master Command View (All 20 Features)', icon: Sparkles, badge: 'EXPANDED' }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-[1700px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-border-marine rounded-2xl p-4 sm:p-5 shadow-marine-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-ocean-navy tracking-tight">
              Emergency Response Planner & Tactical Containment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono">
              ● DECISION SUPPORT ACTIVE
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-ocean-light text-ocean border border-border-marine text-[10px] font-bold font-mono">
              TIER 2 MOBILIZATION
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 max-w-4xl leading-relaxed">
            Autonomous multi-agency decision support system integrating hydrodynamic containment boom calculations, 
            ASTM F631 mechanical recovery rates, vessel fleet dispatch, ESI coastal sensitivity matrices, and C4I SitRep broadcasts 
            for Incident <strong className="text-ocean-navy">{caseData.incidentId}</strong> ({caseData.region}).
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
          <button
            onClick={() => onNavigate("report-system")}
            className="px-4 py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Final Forensic Report & Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature 8: Incident Action Plan Header & ICS-201 Operational Period Manager */}
      <IapHeaderSection 
        caseData={caseData} 
        isAuthorized={isAuthorized}
        onAuthorize={() => setIsAuthorized(true)}
      />

      {/* Feature 1: Tactical Strategy Preset Switcher (What-If Scenarios) */}
      <StrategyScenarioBar 
        activeStrategy={activeStrategy}
        onSelectStrategy={setActiveStrategy}
      />

      {/* Domain Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-ocean-light/50 border border-border-marine rounded-xl font-mono text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                isActive
                  ? 'bg-ocean-navy text-white shadow-sm'
                  : 'text-text-secondary hover:text-ocean hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ocean'}`} />
              <span>{tab.label}</span>
              <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-ocean-light text-text-muted border border-border-marine'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: TACTICAL MAP & FLEET COMMAND (Features 19, Map, 4, 9)
         ========================================================================= */}
      {(activeTab === 'tactical_command' || activeTab === 'all') && (
        <div className="space-y-5">
          {/* Main Map + Side Directives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Interactive Tactical GIS Map (Col 7) */}
            <div className="lg:col-span-7 bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-marine text-xs font-bold text-ocean-navy font-mono">
                  <div className="flex items-center gap-2">
                    <span>TACTICAL BOOM PLACEMENT & STAGING HUD ({caseData.regionShort || caseData.region})</span>
                    {virtualBooms.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px]">
                        +{virtualBooms.length} VIRTUAL BOOMS
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-status-warning font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse" />
                    CONTAINMENT ACTIVE
                  </span>
                </div>

                {/* Feature 19: Tactical GIS Overlay Controls */}
                <div className="mb-2">
                  <TacticalGisOverlayControls
                    activeLayers={activeLayers}
                    onToggleLayer={handleToggleLayer}
                    mapType={mapType}
                    onChangeMapType={setMapType}
                    virtualBoomsCount={virtualBooms.length}
                    onResetVirtualBooms={handleResetVirtualBooms}
                  />
                </div>

                <div className="rounded-xl overflow-hidden border border-border-marine">
                  <GISMapMock 
                    mode="response-plan" 
                    caseData={caseData}
                    height="h-[340px] sm:h-[460px]"
                    virtualBooms={virtualBooms}
                    activeLayers={activeLayers}
                    initialMapType={mapType}
                  />
                </div>
              </div>

              {/* Real-time Fleet & Barrier Metrics Strip */}
              <div className="pt-2 border-t border-border-marine grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/60">
                  <span className="text-text-muted text-[9px] block">RESPONSE VESSELS</span>
                  <span className="font-bold text-ocean text-xs">4 Cutters Mobilized</span>
                </div>
                <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/60">
                  <span className="text-text-muted text-[9px] block">ACTIVE BOOMS</span>
                  <span className="font-bold text-status-warning text-xs">
                    {(2.4 + virtualBooms.reduce((acc, b) => acc + (b.lengthM / 1000), 0)).toFixed(1)} km Barrier
                  </span>
                </div>
                <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/60">
                  <span className="text-text-muted text-[9px] block">AIRCRAFT PATROL</span>
                  <span className="font-bold text-purple-700 text-xs">1 Dornier 228 (CG-751)</span>
                </div>
                <div className="p-2 bg-ocean-light rounded-xl border border-border-marine/60">
                  <span className="text-text-muted text-[9px] block">HAZWOPER CREW</span>
                  <span className="font-bold text-status-success text-xs">48 Specialists</span>
                </div>
              </div>
            </div>

            {/* Right: Feature 9: ICS-204 Tactical Work Directives (Col 5) */}
            <div className="lg:col-span-5">
              <Ics204TaskDirectives />
            </div>
          </div>

          {/* Feature 4: Vessel Fleet Staging & Interactive Dispatch Board */}
          <VesselFleetDispatchBoard />
        </div>
      )}

      {/* =========================================================================
          TAB 2: CONTAINMENT & RECOVERY CALCULATORS (Features 2, 3, 6, 7, 10)
         ========================================================================= */}
      {(activeTab === 'calculators' || activeTab === 'all') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Feature 2: Boom Barrier & Mooring Calculator */}
            <BoomCalculator 
              caseData={caseData} 
              onAddVirtualBoom={handleAddVirtualBoom}
            />

            {/* Feature 3: Skimmer Recovery Capacity & ASTM F631 Estimator */}
            <SkimmerRecoveryCalculator 
              caseData={caseData}
            />
          </div>

          {/* Feature 10: MetOcean Limits & Weather Go/No-Go Matrix */}
          <MetoceanSafetyMatrix 
            caseData={caseData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Feature 6: Chemical Dispersant Feasibility Advisor (NEBA / SIMA) */}
            <DispersantAdvisor 
              caseData={caseData}
            />

            {/* Feature 7: In-Situ Burning (ISB) Feasibility & Smoke Safety Window */}
            <InSituBurnAdvisor 
              caseData={caseData}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SHORELINE & ECOLOGICAL DEFENSE (Features 5, 15)
         ========================================================================= */}
      {(activeTab === 'ecology' || activeTab === 'all') && (
        <div className="space-y-5">
          {/* Feature 5: Environmental Sensitivity Index (ESI) Coastal Protection Matrix */}
          <ShorelineEsiMatrix />

          {/* Feature 15: Wildlife Rescue & Ecological Rehab Module */}
          <WildlifeRescueModule />
        </div>
      )}

      {/* =========================================================================
          TAB 4: LOGISTICS, PERSONNEL & BUDGET (Features 12, 13, 14, 11)
         ========================================================================= */}
      {(activeTab === 'logistics' || activeTab === 'all') && (
        <div className="space-y-5">
          {/* Feature 11: Chronological Action Timeline & 72-Hour Milestone Tracker */}
          <ResponseTimelineTracker />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Feature 12: Emergency Personnel & HAZWOPER Strike Team Roster */}
            <StrikeTeamRoster />

            {/* Feature 13: Oily Waste Storage & Temporary Logistics Planner */}
            <OilyWasteLogistics />
          </div>

          {/* Feature 14: Incident Budget & Response Cost Estimator */}
          <ResponseBudgetEstimator />
        </div>
      )}

      {/* =========================================================================
          TAB 5: C4I DISPATCH, COMPLIANCE & EXPORT (Features 16, 17, 18, 20)
         ========================================================================= */}
      {(activeTab === 'comms_audit' || activeTab === 'all') && (
        <div className="space-y-5">
          {/* Feature 16: Multi-Agency Dispatch Broadcaster & SitRep Hub */}
          <MultiAgencyBroadcaster 
            caseData={caseData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Feature 17: NOS-DCP & MARPOL Statutory Compliance Auditor */}
            <NosDcpComplianceChecklist />

            {/* Feature 18: Operational Radio Communications Logbook */}
            <OperationalRadioLog />
          </div>

          {/* Feature 20: Dossier Generation, Authorization & Export Suite */}
          <DossierExportSuite 
            caseData={caseData}
            activeStrategy={activeStrategy}
            isAuthorized={isAuthorized}
            onAuthorize={() => setIsAuthorized(true)}
            virtualBooms={virtualBooms}
          />
        </div>
      )}
    </div>
  );
}
