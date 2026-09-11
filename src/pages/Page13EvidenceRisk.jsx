import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Fish, 
  Anchor, 
  ArrowRight, 
  CheckCircle2, 
  Download,
  AlertTriangle,
  Compass,
  Sliders,
  Scale,
  Clock,
  Send,
  Printer,
  Sparkles,
  LayoutDashboard,
  FileCheck
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';
import { CANDIDATE_VESSELS } from '../data/mockData';

// 20 Modular Frontend Feature Components
import VesselSelectorBar from '../components/evidence-risk/VesselSelectorBar';
import BayesianWeightSimulator, { DEFAULT_WEIGHTS } from '../components/evidence-risk/BayesianWeightSimulator';
import ChainOfCustodyLedger from '../components/evidence-risk/ChainOfCustodyLedger';
import EvidenceInspectorModal from '../components/evidence-risk/EvidenceInspectorModal';
import EcologicalRiskSection from '../components/evidence-risk/EcologicalRiskSection';
import HydrodynamicCalculator from '../components/evidence-risk/HydrodynamicCalculator';
import RiskHeatmapGrid from '../components/evidence-risk/RiskHeatmapGrid';
import EconomicLossForecaster from '../components/evidence-risk/EconomicLossForecaster';
import GISLayerControls from '../components/evidence-risk/GISLayerControls';
import ForensicTimelineBar from '../components/evidence-risk/ForensicTimelineBar';
import ChemicalWeatheringModel from '../components/evidence-risk/ChemicalWeatheringModel';
import CustomEvidenceModal from '../components/evidence-risk/CustomEvidenceModal';
import EvidenceMatrixSection from '../components/evidence-risk/EvidenceMatrixSection';
import LegalAdmissibilityChecklist from '../components/evidence-risk/LegalAdmissibilityChecklist';
import AgencyDispatchSimulator from '../components/evidence-risk/AgencyDispatchSimulator';
import ExecutiveBriefingTray from '../components/evidence-risk/ExecutiveBriefingTray';

export default function Page13EvidenceRisk({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident || {};
  const candidates = caseData.candidateVessels || CANDIDATE_VESSELS || [];

  // Active view tab
  const [activeViewTab, setActiveViewTab] = useState("all"); // 'all', 'forensics', 'ecological', 'action'

  // Feature 1: Suspect Vessel Selection
  const [selectedVessel, setSelectedVessel] = useState(() => {
    return caseData.topVessel || candidates[0] || {
      name: "MV Ocean Star",
      mmsi: "419001248",
      priorityScore: 91.4,
      flag: "India 🇮🇳",
      type: "Crude Oil Tanker"
    };
  });

  // Feature 2: Bayesian Weight Adjuster
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // Evidence Rows state (supports Feature 14 custom findings)
  const initialEvidenceRows = useMemo(() => [
    { 
      name: "Spatial Proximity to Origin", 
      value: `${selectedVessel.cpaNm || 1.4} nm from Origin Centroid Zone`, 
      strength: "VERY HIGH", 
      conf: selectedVessel.spatialMatch || 94, 
      weight: `${weights.spatial}%`, 
      source: "Copernicus Sentinel + AIS",
      findingNarrative: "Spatial distance minimization algorithm establishes vessel track intersected within 1.4 nm of backward-hindcasted spill origin."
    },
    { 
      name: "Temporal Release Coincidence", 
      value: "Transit coincident with discharge window (±22 min)", 
      strength: "VERY HIGH", 
      conf: selectedVessel.temporalMatch || 91, 
      weight: `${weights.temporal}%`, 
      source: "Hindcast Model",
      findingNarrative: "Temporal release window calculation indicates vessel transited past origin point at 04:12 UTC, directly coinciding with slick formation."
    },
    { 
      name: "Siamese Trajectory Similarity", 
      value: `${selectedVessel.trajectoryMatch || 88}% curve alignment (DTW score)`, 
      strength: "HIGH", 
      conf: selectedVessel.trajectoryMatch || 88, 
      weight: `${weights.siamese}%`, 
      source: "Siamese STSN v2.8",
      findingNarrative: "Siamese Spatio-Temporal Neural Network calculated a 93.4% geodesic trajectory similarity against historical illegal discharge signatures."
    },
    { 
      name: "AIS Transponder Blackout", 
      value: `Deliberate silence gap (${selectedVessel.gapDuration || '38 min'})`, 
      strength: "VERY HIGH", 
      conf: selectedVessel.aisGapScore || 92, 
      weight: `${weights.blackout}%`, 
      source: "Terrestrial Coastal AIS",
      findingNarrative: "Complete VHF radio silence observed across 38 minutes between waypoints Alpha and Bravo with no corresponding weather degradation."
    },
    { 
      name: "Kinematic Deceleration Anomaly", 
      value: "Anomalous speed trough (12.4 kts → 6.8 kts)", 
      strength: "HIGH", 
      conf: selectedVessel.behaviorMatch || 86, 
      weight: `${weights.deceleration}%`, 
      source: "Kinematic Anomaly Model",
      findingNarrative: "Sudden uncommanded speed reduction detected on calm sea, consistent with slow-speed ballast de-oiling operations."
    },
    { 
      name: "SAR Radar Target Match", 
      value: "Sentinel-1 radar signature matches hull dimensions", 
      strength: "HIGH", 
      conf: 89, 
      weight: `${weights.sarRadar}%`, 
      source: "Sentinel-1 SAR C-Band",
      findingNarrative: "Radar cross-section backscatter (VV/VH polarization) correlates with 274m crude oil carrier hull length."
    },
    { 
      name: "Historical Route Deviation", 
      value: "Corridor boundary deviation outside TSS fairway", 
      strength: "MODERATE", 
      conf: 75, 
      weight: `${weights.routeDeviation}%`, 
      source: "Historical Route DB",
      findingNarrative: "Vessel departed 4.2 nm eastward from standard maritime Traffic Separation Scheme (TSS) route."
    },
  ], [selectedVessel, weights]);

  const [evidenceRows, setEvidenceRows] = useState(initialEvidenceRows);

  // Update rows when selected vessel or weights change
  React.useEffect(() => {
    setEvidenceRows(prev => {
      // Keep any custom findings added by the user
      const customItems = prev.filter(r => r.isCustom);
      return [...initialEvidenceRows, ...customItems];
    });
  }, [initialEvidenceRows]);

  // Dynamic Bayesian Composite Score
  const compositeAttributionScore = useMemo(() => {
    const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalW === 0) return 0;

    const weightedSum =
      (weights.spatial * (selectedVessel.spatialMatch || 94)) +
      (weights.temporal * (selectedVessel.temporalMatch || 91)) +
      (weights.siamese * (selectedVessel.trajectoryMatch || 88)) +
      (weights.blackout * (selectedVessel.aisGapScore || 92)) +
      (weights.deceleration * (selectedVessel.behaviorMatch || 86)) +
      (weights.sarRadar * 89) +
      (weights.routeDeviation * 75);

    return weightedSum / totalW;
  }, [weights, selectedVessel]);

  // Feature 4: Evidence Inspector Modal State
  const [inspectingEvidence, setInspectingEvidence] = useState(null);

  // Feature 14: Custom Evidence Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Feature 20: Executive Pinned Items
  const [pinnedItems, setPinnedItems] = useState([
    "AIS Transponder Blackout",
    "Spatial Proximity to Origin"
  ]);

  const togglePinItem = (name) => {
    setPinnedItems(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Feature 11: GIS Layers
  const [gisLayers, setGisLayers] = useState({
    slickExtent: true,
    aisBreadcrumbs: true,
    esiShoreline: true,
    marineSanctuary: true,
    shippingFairway: false,
    virtualBooms: true
  });

  const toggleGisLayer = (key) => {
    setGisLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddCustomEvidence = (newEvidence) => {
    setEvidenceRows(prev => [newEvidence, ...prev]);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-border-marine p-4 rounded-2xl shadow-marine-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Evidence Fusion & Environmental Risk Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-status-danger/10 text-status-danger border border-status-danger/30 text-[10px] font-bold font-mono">
              ● CRITICAL ECOLOGICAL VULNERABILITY ({caseData.region || "Goa Coast"})
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Multimodal scientific provenance, SHA-256 cryptographic audit chain, and predictive ecological sensitivity modeling for Incident {caseData.incidentId || "OF-2026-0912"}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("response-plan")}
            className="px-4 py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-2 transition-all"
          >
            <span>Proceed to Emergency Response Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top-Level Module Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-ocean-light/80 p-2 rounded-2xl border border-border-marine text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <button
            onClick={() => setActiveViewTab("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === "all" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:bg-white/60"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>All 20 Command Modules</span>
          </button>
          <button
            onClick={() => setActiveViewTab("forensics")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === "forensics" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:bg-white/60"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Forensic Provenance & Legal Admissibility</span>
          </button>
          <button
            onClick={() => setActiveViewTab("ecological")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === "ecological" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:bg-white/60"
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Shoreline ESI & Hydrodynamic Drift</span>
          </button>
          <button
            onClick={() => setActiveViewTab("action")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === "action" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:bg-white/60"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Inter-Agency Alerts & Executive Dossier</span>
          </button>
        </div>

        <div className="text-[11px] text-text-muted hidden md:block">
          Case Ref: <strong className="text-ocean-navy">{caseData.incidentId || "OF-2026-0912"}</strong>
        </div>
      </div>

      {/* 3. Candidate Vessel Switcher & Sensor Sync Banner (Features 1 & 19) */}
      <VesselSelectorBar
        vessels={candidates}
        selectedVessel={selectedVessel}
        onSelectVessel={setSelectedVessel}
      />

      {/* 4. Executive Briefing & Export Tray (Features 20 & 17) */}
      <ExecutiveBriefingTray
        pinnedItems={pinnedItems}
        onRemovePin={(name) => setPinnedItems(prev => prev.filter(n => n !== name))}
        onClearPins={() => setPinnedItems([])}
        vesselName={selectedVessel.name}
        incidentId={caseData.incidentId || "OF-2026-0912"}
        compositeScore={compositeAttributionScore}
      />

      {/* 5. Main Content Grid */}
      {(activeViewTab === "all" || activeViewTab === "forensics") && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Evidence Matrix with Search, Filter, Sort & Pinning (Features 15, 20) */}
            <div className="lg:col-span-7">
              <EvidenceMatrixSection
                evidenceRows={evidenceRows}
                selectedVessel={selectedVessel}
                onInspectEvidence={setInspectingEvidence}
                pinnedIds={pinnedItems}
                onTogglePin={togglePinItem}
                onOpenCustomModal={() => setIsCustomModalOpen(true)}
              />
            </div>

            {/* Right: Interactive Bayesian Weight & Attribution Simulator (Feature 2) */}
            <div className="lg:col-span-5">
              <BayesianWeightSimulator
                weights={weights}
                setWeights={setWeights}
                evidenceScores={{
                  spatial: selectedVessel.spatialMatch || 94,
                  temporal: selectedVessel.temporalMatch || 91,
                  siamese: selectedVessel.trajectoryMatch || 88,
                  blackout: selectedVessel.aisGapScore || 92,
                  deceleration: selectedVessel.behaviorMatch || 86,
                  sarRadar: 89,
                  routeDeviation: 75
                }}
                compositeScore={compositeAttributionScore}
                onReset={() => setWeights(DEFAULT_WEIGHTS)}
              />
            </div>
          </div>

          {/* Cryptographic Chain-of-Custody & Evidence Tamper Verification (Feature 3) */}
          <ChainOfCustodyLedger />

          {/* Legal Admissibility & MARPOL Annex I Checklist (Feature 8) */}
          <LegalAdmissibilityChecklist />
        </div>
      )}

      {(activeViewTab === "all" || activeViewTab === "ecological") && (
        <div className="space-y-5">
          {/* GIS Map with Dynamic Layer Controls (Feature 11) */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-text-muted font-mono uppercase">
                  HIGH-RESOLUTION ECOLOGICAL RISK GIS VIEWPORT
                </span>
                <h3 className="text-sm font-extrabold text-ocean-navy mt-0.5">
                  {caseData.region || "Goa Coast"} Vulnerable Habitat Zones & Marine Sanctuaries
                </h3>
              </div>
              <span className="text-xs font-mono text-status-warning font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                OVERALL RISK SCORE: 78 / 100
              </span>
            </div>

            {/* Layer Control Bar (Feature 11) */}
            <GISLayerControls
              layers={gisLayers}
              onToggleLayer={toggleGisLayer}
            />

            {/* Real Interactive Map View */}
            <div className="rounded-xl overflow-hidden border border-border-marine">
              <GISMapMock
                mode="evidence-risk"
                caseData={caseData}
                height="h-[340px]"
              />
            </div>
          </div>

          {/* Shoreline Sensitivity ESI & Species Vulnerability Matrix (Features 5 & 7) */}
          <EcologicalRiskSection />

          {/* Hydrodynamic Drift & TTI Calculator + Dual Scenario Simulator (Features 6 & 16) */}
          <HydrodynamicCalculator distanceToShorelineNm={14.2} />

          {/* Chemical Weathering & VOC Dispersion Model (Feature 13) */}
          <ChemicalWeatheringModel />
        </div>
      )}

      {(activeViewTab === "all" || activeViewTab === "action") && (
        <div className="space-y-5">
          {/* Forensic Event Timeline & AIS Blackout Gap Visualizer (Feature 12) */}
          <ForensicTimelineBar />

          {/* 5x5 Likelihood vs Consequence Risk Heatmap Matrix (Feature 9) */}
          <RiskHeatmapGrid />

          {/* Economic Impact & Fishery Closure Loss Forecaster (Feature 10) */}
          <EconomicLossForecaster />

          {/* Multi-Agency Alert Dispatch Simulator (Feature 18) */}
          <AgencyDispatchSimulator
            incidentId={caseData.incidentId || "OF-2026-0912"}
            vesselName={selectedVessel.name}
          />
        </div>
      )}

      {/* Modals */}
      {/* Feature 4: Evidence Deep-Dive Inspector Modal */}
      <EvidenceInspectorModal
        evidence={inspectingEvidence}
        onClose={() => setInspectingEvidence(null)}
      />

      {/* Feature 14: Custom Evidence Ingestion Modal */}
      <CustomEvidenceModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddEvidence={handleAddCustomEvidence}
      />
    </div>
  );
}
