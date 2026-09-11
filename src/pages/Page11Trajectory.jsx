import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Clock, 
  Activity, 
  AlertTriangle, 
  Compass, 
  ArrowRight, 
  ShieldAlert,
  CheckCircle2,
  FileText,
  Layers,
  Cpu,
  Radio,
  Target,
  Scale,
  Volume2,
  Table,
  Sliders
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';

// Import all 20 Trajectory Forensic Intelligence Subcomponents
import { SUSPECT_VESSELS, TELEMETRY_POINTS } from '../components/trajectory/trajectoryData';
import TrajectoryVesselSelector from '../components/trajectory/TrajectoryVesselSelector';
import TrajectoryTimePlayback from '../components/trajectory/TrajectoryTimePlayback';
import TrajectoryModelTuner from '../components/trajectory/TrajectoryModelTuner';
import TrajectoryForecastSimulator from '../components/trajectory/TrajectoryForecastSimulator';
import TrajectoryBlackoutInspector from '../components/trajectory/TrajectoryBlackoutInspector';
import TrajectoryKinematicsChart from '../components/trajectory/TrajectoryKinematicsChart';
import TrajectoryCpaCalculator from '../components/trajectory/TrajectoryCpaCalculator';
import TrajectorySpoofingDetector from '../components/trajectory/TrajectorySpoofingDetector';
import TrajectorySarAlignment from '../components/trajectory/TrajectorySarAlignment';
import TrajectoryWaypointTable from '../components/trajectory/TrajectoryWaypointTable';
import TrajectoryDischargeEstimator from '../components/trajectory/TrajectoryDischargeEstimator';
import TrajectoryTssViolationAuditor from '../components/trajectory/TrajectoryTssViolationAuditor';
import TrajectoryMetOceanDrift from '../components/trajectory/TrajectoryMetOceanDrift';
import TrajectoryDossierModal from '../components/trajectory/TrajectoryDossierModal';
import TrajectoryMonteCarloEllipses from '../components/trajectory/TrajectoryMonteCarloEllipses';
import TrajectoryFleetBenchmark from '../components/trajectory/TrajectoryFleetBenchmark';
import TrajectorySensitivityWorkbench from '../components/trajectory/TrajectorySensitivityWorkbench';
import TrajectoryVoiceAnnunciator from '../components/trajectory/TrajectoryVoiceAnnunciator';
import TrajectoryWhatIfSandbox from '../components/trajectory/TrajectoryWhatIfSandbox';

export default function Page11Trajectory({ onNavigate }) {
  const { activeIncident } = useIncident();
  const caseData = activeIncident;

  // Selected Suspect Vessel State
  const [selectedVesselId, setSelectedVesselId] = useState("v1");
  const [showGhostOverlay, setShowGhostOverlay] = useState(false);

  // Time Playback Scrubber State
  const [currentPointIndex, setCurrentPointIndex] = useState(12); // Default to Spill Intersection (Point 13)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState("1x");

  // Model & Horizon Tuning State
  const [selectedModelId, setSelectedModelId] = useState("bilstm");
  const [selectedHorizon, setSelectedHorizon] = useState("1h");

  // Active Forensic Sub-Tab State
  const [activeForensicTab, setActiveForensicTab] = useState("models"); // "models", "sensors", "cpa", "legal", "telemetry"

  // Court Dossier Modal State
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Map Layer Filter Toggles
  const [mapLayers, setMapLayers] = useState({
    observedAis: true,
    blackoutGap: true,
    bilstmRecon: true,
    forecastCone: true,
    spillZone: true,
    tssLanes: true,
    territorialWaters: true
  });

  const selectedVessel = SUSPECT_VESSELS.find(v => v.id === selectedVesselId) || SUSPECT_VESSELS[0];

  // Auto-advance playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const speedMs = playSpeed === "10x" ? 300 : playSpeed === "5x" ? 600 : playSpeed === "2x" ? 1000 : 1800;
    const interval = setInterval(() => {
      setCurrentPointIndex((prev) => {
        if (prev >= TELEMETRY_POINTS.length - 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const toggleMapLayer = (key) => {
    setMapLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-2 border-b border-border-marine/70">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              AIS Trajectory Reconstruction & Neural Anomaly Forensics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono">
              ● BF-BiLSTM CONVERGED
            </span>
            <span className="px-2 py-0.5 rounded-full bg-ocean-sky text-ocean border border-ocean/20 text-[10px] font-bold font-mono">
              20 FORENSIC MODULES ACTIVE
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Bidirectional LSTM gap interpolation for unobserved transponder blackout periods and recurrent trajectory forecasting for {selectedVessel.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Feature 15: Court Evidentiary Dossier Generator Button */}
          <button
            onClick={() => setIsDossierOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-ocean" />
            <span>Generate Court Dossier</span>
          </button>

          {/* Navigation to next pipeline stage */}
          <button
            onClick={() => onNavigate("attribution")}
            className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-2 transition-all"
          >
            <span>Proceed to Vessel Attribution Ranking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Quantitative Reconstruction Badges Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono text-xs">
          <span className="text-[10px] text-text-muted block">TOTAL AIS POINTS</span>
          <span className="text-xl font-bold text-ocean-navy">2,481 Messages</span>
          <span className="text-[10px] text-text-muted block">Recorded in transit corridor</span>
        </div>
        <div className="p-3.5 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono text-xs">
          <span className="text-[10px] text-text-muted block">BLACKOUT DURATION</span>
          <span className="text-xl font-bold text-status-danger">{selectedVessel.blackoutDurationMin} Minutes</span>
          <span className="text-[10px] text-status-danger font-medium block">{selectedVessel.missingPings} Missing transponder pings</span>
        </div>
        <div className="p-3.5 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono text-xs">
          <span className="text-[10px] text-text-muted block">RECONSTRUCTION CONFIDENCE</span>
          <span className="text-xl font-bold text-status-success">{selectedVessel.reconstructionConfidence}%</span>
          <span className="text-[10px] text-text-muted block">Mean error: ±{selectedVessel.meanErrorNm} nm</span>
        </div>
        <div className="p-3.5 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono text-xs">
          <span className="text-[10px] text-text-muted block">ANOMALY SCORE</span>
          <span className={`text-xl font-bold ${selectedVessel.riskScore >= 80 ? 'text-status-danger' : selectedVessel.riskScore >= 50 ? 'text-status-warning' : 'text-status-success'}`}>
            {selectedVessel.riskScore} / 100
          </span>
          <span className="text-[10px] text-status-warning font-semibold block">High Risk Behavioral Signature</span>
        </div>
      </div>

      {/* Feature 1: Candidate Suspect Vessel Switcher */}
      <TrajectoryVesselSelector 
        selectedVesselId={selectedVesselId}
        onSelectVessel={setSelectedVesselId}
        showGhostOverlay={showGhostOverlay}
        onToggleGhostOverlay={setShowGhostOverlay}
      />

      {/* Feature 2: Time-Warp 4D Trajectory Scrubber & Player */}
      <TrajectoryTimePlayback 
        currentPointIndex={currentPointIndex}
        onPointChange={setCurrentPointIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        playSpeed={playSpeed}
        onChangeSpeed={setPlaySpeed}
      />

      {/* Main Grid: Multi-Layer Trajectory Map (Feature 10) + Kinematics Chart (Feature 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Interactive GIS Real Map with Layer Filter Controls (Feature 10) */}
        <div className="lg:col-span-7 bg-white border border-border-marine rounded-2xl p-3.5 shadow-marine-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-border-marine text-xs font-bold text-ocean-navy gap-2">
              <div className="flex items-center gap-2">
                <span>MULTI-LAYER TRAJECTORY MAPPING ({caseData.region})</span>
                <span className="text-[10px] font-mono text-ocean bg-ocean-sky px-1.5 py-0.5 rounded font-bold">
                  BF-BiLSTM v4.1
                </span>
              </div>
              <span className="text-[10px] font-mono text-text-muted">
                Track for: {selectedVessel.name} ({selectedVessel.flag})
              </span>
            </div>

            {/* Feature 10: Interactive Floating Layer Controls */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-2 border-b border-border-marine/50 text-[10px] font-mono">
              <span className="text-text-muted flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3 text-ocean" />
                Layers:
              </span>
              {[
                { key: 'observedAis', label: 'Observed AIS', color: 'bg-[#8295A3]' },
                { key: 'blackoutGap', label: 'Blackout Gap (38m)', color: 'bg-[#D9534F]' },
                { key: 'bilstmRecon', label: 'Bi-LSTM Recon', color: 'bg-[#00E5FF]' },
                { key: 'forecastCone', label: 'RNN Forecast', color: 'bg-[#1597C7]' },
                { key: 'spillZone', label: 'Spill Zone A', color: 'bg-[#78350F]' },
                { key: 'tssLanes', label: 'TSS Fairway', color: 'bg-[#087EA4]' }
              ].map(lyr => (
                <button
                  key={lyr.key}
                  onClick={() => toggleMapLayer(lyr.key)}
                  className={`px-2 py-0.5 rounded-full border text-[9px] flex items-center gap-1 transition-all ${
                    mapLayers[lyr.key]
                      ? 'bg-white border-ocean text-ocean-navy font-bold shadow-xs'
                      : 'bg-ocean-light/50 border-border-marine text-text-muted opacity-60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${lyr.color}`}></span>
                  <span>{lyr.label}</span>
                </button>
              ))}
            </div>

            {/* GIS Real Map */}
            <GISMapMock 
              mode="trajectory" 
              caseData={caseData}
              height="h-[320px] sm:h-[430px]"
            />
          </div>

          {/* Map Legend Footer */}
          <div className="pt-2 border-t border-border-marine flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <div className="flex flex-wrap items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#8295A3]"></span> Observed AIS
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#D9534F] border-b border-dashed"></span> Missing Gap (38m)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#00E5FF]"></span> Bi-LSTM Recon
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#1597C7] border-b border-dotted"></span> RNN Forecast
              </span>
            </div>
            <span className="text-ocean font-bold text-[10px]">
              CPA: {selectedVessel.spillCpaNm} nm from Slick Origin
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Feature 6 Kinematics Chart + Vessel Anomaly Progress Bars */}
        <div className="lg:col-span-5 space-y-4">
          {/* Feature 6: Kinematics Chart */}
          <TrajectoryKinematicsChart 
            currentPointIndex={currentPointIndex}
            onPointChange={setCurrentPointIndex}
          />

          {/* Anomaly Decomposition */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase">Kinematic Anomaly Breakdown</span>
              <span className="text-[10px] font-bold text-status-danger px-2 py-0.5 rounded bg-red-50 border border-red-200">
                SCORE: {selectedVessel.riskScore} / 100
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-status-danger font-bold">AIS Transponder Silence</span>
                  <span className="font-bold">{selectedVessel.blackoutDurationMin > 0 ? '95%' : '0%'}</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div 
                    className="bg-status-danger h-full transition-all duration-500" 
                    style={{ width: `${selectedVessel.blackoutDurationMin > 0 ? 95 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-status-warning font-bold">Abrupt Kinematic Deceleration (-{selectedVessel.speedDropPercent}%)</span>
                  <span className="font-bold">{selectedVessel.speedDropPercent > 50 ? '89%' : '20%'}</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div 
                    className="bg-status-warning h-full transition-all duration-500" 
                    style={{ width: `${selectedVessel.speedDropPercent > 50 ? 89 : 20}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-ocean font-bold">Course Deviation (Off-Lane)</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div className="bg-ocean h-full w-[84%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-text-secondary">Loitering / Drifting Signature</span>
                  <span className="font-bold">80%</span>
                </div>
                <div className="h-1.5 w-full bg-ocean-light rounded-full overflow-hidden">
                  <div className="bg-ocean-deep h-full w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Deep-Dive Workbenches Tab Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border-marine pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-ocean" />
            <h2 className="text-sm font-extrabold text-ocean-navy uppercase tracking-wider font-mono">
              Specialized Forensic Intelligence Workbenches
            </h2>
          </div>
          <span className="text-[10px] font-mono text-text-muted">
            All 20 features computed live in browser
          </span>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
          {[
            { id: "models", label: "1. Neural Gap & Forecast", icon: Cpu, count: "Features 3, 4, 16" },
            { id: "sensors", label: "2. Blackout & Sensors", icon: Radio, count: "Features 5, 8, 9" },
            { id: "cpa", label: "3. Spill CPA & Discharge", icon: Target, count: "Features 7, 12, 14" },
            { id: "legal", label: "4. Legal & Defense Audit", icon: Scale, count: "Features 13, 17, 20" },
            { id: "telemetry", label: "5. Telemetry & Audio Brief", icon: Table, count: "Features 11, 18, 19" }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeForensicTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveForensicTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-ocean text-white border-ocean shadow-marine-sm'
                    : 'bg-white border-border-marine text-text-secondary hover:text-ocean-navy hover:bg-ocean-light'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-normal ${
                  isActive ? 'bg-white/20 text-white' : 'bg-ocean-light text-ocean'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Neural Gap Models, Forecast, and Monte Carlo Uncertainty */}
        {activeForensicTab === "models" && (
          <div className="space-y-4">
            {/* Feature 3: Bi-LSTM Neural Gap Interpolation Tuner */}
            <TrajectoryModelTuner 
              selectedModelId={selectedModelId}
              onSelectModel={setSelectedModelId}
            />

            {/* Feature 4: Multi-Horizon Predictor Simulator */}
            <TrajectoryForecastSimulator 
              onSelectHorizon={setSelectedHorizon}
            />

            {/* Feature 16: Monte Carlo Spatial Uncertainty Ellipses */}
            <TrajectoryMonteCarloEllipses />
          </div>
        )}

        {/* Tab 2: Blackout Forensic, GNSS Spoofing, and SAR Kelvin Wake */}
        {activeForensicTab === "sensors" && (
          <div className="space-y-4">
            {/* Feature 5: AIS Blackout Deep-Dive */}
            <TrajectoryBlackoutInspector vesselId={selectedVesselId} />

            {/* Feature 8: AIS Spoofing & GNSS Sentry */}
            <TrajectorySpoofingDetector />

            {/* Feature 9: SAR Satellite & Kelvin Wake Alignment */}
            <TrajectorySarAlignment />
          </div>
        )}

        {/* Tab 3: Spill CPA, MARPOL Discharge Volume, and MetOcean Drift Envelope */}
        {activeForensicTab === "cpa" && (
          <div className="space-y-4">
            {/* Feature 7: Spill Origin CPA Calculator */}
            <TrajectoryCpaCalculator caseData={caseData} />

            {/* Feature 12: Bonn / MARPOL Discharge Volume & Rate Estimator */}
            <TrajectoryDischargeEstimator />

            {/* Feature 14: MetOcean Drift Vector Envelope & Propulsion Proof */}
            <TrajectoryMetOceanDrift caseData={caseData} />
          </div>
        )}

        {/* Tab 4: TSS Lane Violation, Sister Vessel Benchmark, and What-If Counterfactual */}
        {activeForensicTab === "legal" && (
          <div className="space-y-4">
            {/* Feature 13: TSS Lane Violation Auditor */}
            <TrajectoryTssViolationAuditor />

            {/* Feature 17: Sister Vessel Corridor Benchmark */}
            <TrajectoryFleetBenchmark />

            {/* Feature 20: Counterfactual What-If Defense Sandbox */}
            <TrajectoryWhatIfSandbox />
          </div>
        )}

        {/* Tab 5: Waypoint Telemetry Log, Custom Sensitivity Workbench, and Tactical Voice Annunciator */}
        {activeForensicTab === "telemetry" && (
          <div className="space-y-4">
            {/* Feature 11: Waypoint Telemetry Table with Search & CSV Export */}
            <TrajectoryWaypointTable 
              currentPointIndex={currentPointIndex}
              onSelectPoint={setCurrentPointIndex}
            />

            {/* Feature 18: Custom Sensitivity Workbench */}
            <TrajectorySensitivityWorkbench />

            {/* Feature 19: Tactical Voice Annunciator */}
            <TrajectoryVoiceAnnunciator vesselId={selectedVesselId} />
          </div>
        )}
      </div>

      {/* Feature 15: Court Evidentiary Dossier Modal */}
      <TrajectoryDossierModal 
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        vesselId={selectedVesselId}
      />
    </div>
  );
}
