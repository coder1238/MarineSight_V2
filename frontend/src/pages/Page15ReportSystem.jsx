import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer, 
  Cpu, 
  Database, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Target, 
  Compass, 
  Ship,
  ExternalLink,
  Layers,
  History,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Sparkles,
  Scale,
  Droplet,
  Globe,
  SlidersHorizontal,
  Lock,
  EyeOff
} from 'lucide-react';
import ModelStatusCard from '../components/common/ModelStatusCard';
import { 
  CASE_OF_2026_0912, 
  REGIONAL_CASES_MAP,
  AI_MODELS, 
  DATA_SOURCES, 
  SYSTEM_HEALTH 
} from '../data/mockData';

// Modular Report Components (20 Features)
import ReportIncidentSwitcher from '../components/report/ReportIncidentSwitcher';
import ReportSectionCustomizer, { DEFAULT_SECTIONS } from '../components/report/ReportSectionCustomizer';
import ReportWatermarkRedaction, { RedactedText } from '../components/report/ReportWatermarkRedaction';
import ReportExportActions from '../components/report/ReportExportActions';
import ReportCryptoSigner from '../components/report/ReportCryptoSigner';
import ReportBonnVolumeCalculator from '../components/report/ReportBonnVolumeCalculator';
import ReportLegalPenaltyCalculator from '../components/report/ReportLegalPenaltyCalculator';
import ReportRadarContourCanvas from '../components/report/ReportRadarContourCanvas';
import ReportCustodyTimeline from '../components/report/ReportCustodyTimeline';
import ReportVesselComparisonMatrix from '../components/report/ReportVesselComparisonMatrix';
import ReportInvestigatorNotes from '../components/report/ReportInvestigatorNotes';
import ReportJurisdictionAnalyzer from '../components/report/ReportJurisdictionAnalyzer';
import ReportExecutiveBriefingGenerator from '../components/report/ReportExecutiveBriefingGenerator';
import ReportModelBenchmarkRunner from '../components/report/ReportModelBenchmarkRunner';
import ReportDataSourcesStreamer from '../components/report/ReportDataSourcesStreamer';
import ReportEnvironmentalSensitivity from '../components/report/ReportEnvironmentalSensitivity';
import ReportAuditTrailDrawer from '../components/report/ReportAuditTrailDrawer';

export default function Page15ReportSystem({ onNavigate }) {
  // State: Tabs & Navigation
  const [activeTab, setActiveTab] = useState("report"); // "report" | "evidence" | "models" | "sources" | "health"
  
  // Feature 1: Multi-Incident Switcher
  const [selectedCaseId, setSelectedCaseId] = useState("OF-2026-0912");
  const caseData = REGIONAL_CASES_MAP[selectedCaseId] || CASE_OF_2026_0912;

  // Feature 11: Lead target vessel selection
  const [selectedVessel, setSelectedVessel] = useState(caseData.topVessel);
  const activeVessel = selectedVessel?.name ? selectedVessel : caseData.topVessel;

  // Feature 2: Section Customization & Order
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  // Features 3 & 4: Clearance Classification, Watermark & Redaction
  const [classification, setClassification] = useState("CRITICAL / CONFIDENTIAL");
  const [watermark, setWatermark] = useState("CONFIDENTIAL");
  const [isRedacted, setIsRedacted] = useState(false);

  // Feature 7 & 8: Calculated metrics shared between Bonn & Penalties & Exporter
  const [bonnMetrics, setBonnMetrics] = useState({ volumeTonnes: 420, volumeBarrels: 3066, surfaceVolumeM3: 477 });
  const [penaltyMetrics, setPenaltyMetrics] = useState({ fineCrore: 8.4, fineUsdMillions: 1.01 });

  // Feature 17: Search & Filter Matrix
  const [searchFilter, setSearchFilter] = useState("");

  // Feature 19: Command Center Fullscreen Briefing Mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Feature 20: Forensic Session Audit Log
  const [auditLogs, setAuditLogs] = useState(() => [
    { timestamp: new Date().toLocaleTimeString(), action: `Opened Investigation Dossier for ${selectedCaseId}` }
  ]);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);

  const logAudit = (action) => {
    setAuditLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), action }, ...prev]);
  };

  // Sync selected vessel when case changes
  const handleSelectCase = (id) => {
    setSelectedCaseId(id);
    const c = REGIONAL_CASES_MAP[id] || CASE_OF_2026_0912;
    setSelectedVessel(c.topVessel);
  };

  // Filtered AI Models for Tab 3
  const filteredModels = AI_MODELS.filter(m => 
    m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.architecture.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.purpose.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.id.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className={`transition-all ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 overflow-y-auto p-4 sm:p-8 text-slate-100' : 'p-4 sm:p-6 space-y-5'}`}>
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isFullscreen ? 'text-white' : 'text-ocean-navy'}`}>
              Forensic Investigation Dossier & System Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono">
              ● DOSSIER VERIFIED
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Official multi-evidence forensic report for Incident {caseData.incidentId} ({caseData.regionShort || caseData.region}), 10-model operational matrix, and data ingestion telemetry.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Feature 5: Multi-Format Exporter */}
          <ReportExportActions 
            caseData={caseData} 
            classification={classification} 
            watermark={watermark} 
            isRedacted={isRedacted}
            bonnMetrics={bonnMetrics}
            penaltyMetrics={penaltyMetrics}
            onLogAudit={logAudit}
          />

          {/* Feature 20: Audit Trail Button */}
          <button
            onClick={() => setIsAuditDrawerOpen(true)}
            className="px-3 py-2 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            title="Open forensic action audit trail"
          >
            <History className="w-3.5 h-3.5 text-ocean" />
            <span className="hidden sm:inline">Audit ({auditLogs.length})</span>
          </button>

          {/* Feature 19: Fullscreen Theater Toggle */}
          <button
            onClick={() => {
              const next = !isFullscreen;
              setIsFullscreen(next);
              logAudit(`Toggled command center presentation mode: ${next ? 'ON' : 'OFF'}`);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
              isFullscreen 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-amber-400' 
                : 'border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy'
            }`}
            title="Toggle high-contrast fullscreen presentation mode for briefing projectors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-ocean" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Theater' : 'Briefing Mode'}</span>
          </button>
        </div>
      </div>

      {/* Feature 1: Multi-Incident Case Switcher (Print: Hidden) */}
      <div className="print:hidden">
        <ReportIncidentSwitcher 
          selectedCaseId={selectedCaseId} 
          onSelectCase={handleSelectCase} 
          onLogAudit={logAudit}
        />
      </div>

      {/* Features 3 & 4: Clearance Classification, Watermark Stamp & Redaction Mode (Print: Hidden) */}
      <div className="print:hidden">
        <ReportWatermarkRedaction 
          classification={classification}
          onSetClassification={setClassification}
          watermark={watermark}
          onSetWatermark={setWatermark}
          isRedacted={isRedacted}
          onToggleRedaction={setIsRedacted}
          onLogAudit={logAudit}
        />
      </div>

      {/* Navigation Tabs Switcher (Print: Hidden) */}
      <div className="bg-white border border-border-marine p-1.5 rounded-2xl shadow-marine-sm flex items-center gap-2 overflow-x-auto print:hidden">
        {[
          { id: "report", label: "FORENSIC REPORT DOSSIER", icon: FileText },
          { id: "evidence", label: "EVIDENCE & CHAIN OF CUSTODY", icon: ShieldCheck },
          { id: "models", label: "AI MODEL MATRIX (10 MODELS)", icon: Cpu },
          { id: "sources", label: "DATA SOURCES (7)", icon: Database },
          { id: "health", label: "SYSTEM & GPU HEALTH", icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                logAudit(`Switched view to tab: ${tab.label}`);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-ocean text-white shadow-sm' 
                  : 'text-text-secondary hover:text-ocean-deep hover:bg-ocean-sky'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FORMAL FORENSIC REPORT DOSSIER */}
      {/* ========================================================================= */}
      {activeTab === "report" && (
        <div className="space-y-4">
          {/* Feature 2: Modular Section Customizer & Order Drawer (Print: Hidden) */}
          <div className="print:hidden">
            <ReportSectionCustomizer 
              sections={sections} 
              onUpdateSections={setSections} 
              onLogAudit={logAudit}
            />
          </div>

          {/* Official Document Container with Watermark Overlay */}
          <div className="relative bg-white border border-border-marine rounded-2xl p-4 sm:p-8 shadow-marine-sm space-y-6 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
            
            {/* Watermark Overlay Stamp */}
            {watermark !== 'NONE' && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.035] select-none z-0">
                <div className="text-6xl sm:text-8xl font-black font-mono tracking-widest text-ocean-navy uppercase transform -rotate-45 whitespace-nowrap">
                  {watermark}
                </div>
              </div>
            )}

            <div className="relative z-10 space-y-6">
              {/* Document Header */}
              <div className="border-b-2 border-ocean-navy pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-ocean uppercase tracking-widest font-bold block">
                    OFFICIAL MARITIME ENVIRONMENTAL ENFORCEMENT DOSSIER
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ocean-navy mt-1">
                    Marine Oil Spill Forensic Investigation Report
                  </h2>
                  <p className="text-xs text-text-secondary font-mono mt-0.5">
                    Case ID: {caseData.incidentId} · Registration: Republic Maritime Forensics Division
                  </p>
                </div>
                <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine text-right font-mono text-xs">
                  <span className="text-text-muted text-[10px] block">SECURITY CLASSIFICATION</span>
                  <span className="font-bold text-status-danger">{classification}</span>
                  <span className="text-text-secondary block text-[10px] mt-0.5">{caseData.detectionTimeUTC}</span>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="p-3 bg-ocean-sky/40 border border-ocean/30 rounded-xl text-xs text-text-secondary leading-relaxed font-sans">
                <strong>LEGAL NOTICE:</strong> This document contains technical and scientific evidence compiled through automated satellite SAR, hydrodynamic drift hindcast, and machine learning telemetry correlation. Analytical priority ranking indicates candidate vessels requiring investigation by maritime law enforcement under the Indian Merchant Shipping Act (Part XIA) and UNCLOS 1982.
              </div>

              {/* Dynamic Modular Sections Rendering based on Customizer Order & Visibility */}
              {sections.map(section => {
                if (!section.visible) return null;

                switch (section.id) {
                  // Section 1: Executive Summary
                  case 'summary':
                    return (
                      <div key={section.id} className="space-y-3">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed font-sans">
                          On <strong>{caseData.detectionTimeUTC}</strong>, an orbital Synthetic Aperture Radar (SAR) acquisition from Sentinel-1A delineated a substantial mineral hydrocarbon release spanning <strong>{caseData.spillAreaKm2} km²</strong> with a perimeter of <strong>{caseData.spillPerimeterKm || 22.4} km</strong> centered at <strong>
                            {isRedacted ? <RedactedText text={caseData.coordinates.display} isRedacted={true} customPlaceholder="[REDACTED COORDINATES]" /> : caseData.coordinates.display}
                          </strong> in {caseData.region}.
                        </p>
                        <p className="text-xs text-text-secondary leading-relaxed font-sans">
                          Coupled backward hydrodynamic hindcast integration (40.0 hours elapsed) converged on a high-confidence release origin at <strong>Zone A (72.4% confidence)</strong>. Spatio-temporal filtering across candidate corridor vessels isolated crude oil tanker <strong>{activeVessel.name} (MMSI: {isRedacted ? <RedactedText text={activeVessel.mmsi} isRedacted={true} customPlaceholder="[REDACTED]" /> : (activeVessel.mmsi || '419001248')})</strong> as the primary candidate, with an <strong>Investigation Priority Score of {activeVessel.priorityScore || 91.4} / 100</strong> driven by a {activeVessel.aisGapMinutes || 38}-minute unannounced AIS transponder blackout directly traversing the release origin centroid.
                        </p>

                        {/* Feature 14: Role-Based Executive Briefing Generator */}
                        <ReportExecutiveBriefingGenerator 
                          caseData={{ ...caseData, topVessel: activeVessel }}
                          bonnMetrics={bonnMetrics}
                          penaltyMetrics={penaltyMetrics}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  // Section 2: Key Telemetry Summary Matrix
                  case 'telemetry':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                          <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
                            <span className="text-[10px] text-text-muted block">DETECTED AREA</span>
                            <span className="font-bold text-ocean-deep text-sm">{caseData.spillAreaKm2} km²</span>
                          </div>
                          <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
                            <span className="text-[10px] text-text-muted block">HINDCAST ORIGIN</span>
                            <span className="font-bold text-ocean-deep text-sm">Zone A (72.4%)</span>
                          </div>
                          <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
                            <span className="text-[10px] text-text-muted block">LEAD CANDIDATE</span>
                            <span className="font-bold text-status-danger text-sm">{activeVessel.name}</span>
                          </div>
                          <div className="p-2.5 bg-ocean-light rounded-lg border border-border-marine">
                            <span className="text-[10px] text-text-muted block">PRIORITY SCORE</span>
                            <span className="font-bold text-status-danger text-sm">{activeVessel.priorityScore || 91.4} / 100</span>
                          </div>
                        </div>
                      </div>
                    );

                  // Section 3: Feature 9 - Interactive Radar & Contour SVG Canvas
                  case 'radar_canvas':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportRadarContourCanvas 
                          caseData={{ ...caseData, topVessel: activeVessel }}
                          isRedacted={isRedacted}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  // Section 4: Feature 7 - Bonn Agreement Spill Volumetrics
                  case 'bonn_volume':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportBonnVolumeCalculator 
                          spillAreaKm2={caseData.spillAreaKm2}
                          onUpdateMetrics={setBonnMetrics}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  // Section 5: Feature 11 - Candidate Vessel Funnel & Attribution
                  case 'vessels':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportVesselComparisonMatrix 
                          caseData={caseData}
                          selectedVessel={activeVessel}
                          onSelectLeadVessel={setSelectedVessel}
                          isRedacted={isRedacted}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  // Section 6: Feature 13 - Maritime Jurisdiction & Treaties
                  case 'jurisdiction':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportJurisdictionAnalyzer caseData={caseData} />
                      </div>
                    );

                  // Section 7: Feature 8 - Statutory Liabilities & Environmental Bonds
                  case 'penalties':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportLegalPenaltyCalculator 
                          bonnTonnes={bonnMetrics.volumeTonnes}
                          onUpdatePenalties={setPenaltyMetrics}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  // Section 8: Feature 18 - Marine Habitat Threat Matrix
                  case 'environment':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ReportEnvironmentalSensitivity caseData={caseData} />
                      </div>
                    );

                  // Section 9: Priority Recommendations & Directives
                  case 'recommendations':
                    return (
                      <div key={section.id} className="space-y-2">
                        <h3 className="text-xs font-bold font-mono text-ocean uppercase tracking-wider border-b border-border-marine pb-1">
                          {section.title}
                        </h3>
                        <ul className="text-xs text-text-secondary space-y-1.5 list-disc pl-4 font-sans">
                          <li>Deploy 2.4 km ocean curtain containment booms across coastal estuarine inlets to defend sensitive mangrove spawning habitats.</li>
                          <li>Mobilize Pollution Control Vessel <em>ICGS Samudra Prahari</em> for high-capacity surface oleophilic skimming operations.</li>
                          <li>Issue formal Section 356 detention notice to Master of <strong>{activeVessel.name}</strong> and notify flag state maritime administration.</li>
                          <li>Freeze vessel voyage data recorder (VDR) and impound oil record books for forensic chemistry gas-chromatography matching.</li>
                        </ul>
                      </div>
                    );

                  // Section 10: Features 6 & 12 - Cryptographic Signatures & Field Notes
                  case 'signatures':
                    return (
                      <div key={section.id} className="space-y-4 pt-2">
                        {/* Feature 12: Investigator Annotations & Notes */}
                        <ReportInvestigatorNotes 
                          incidentId={caseData.incidentId}
                          onLogAudit={logAudit}
                        />

                        {/* Feature 6: Cryptographic SHA-256 Signer & Tamper-Proof Seal */}
                        <ReportCryptoSigner 
                          caseData={{ ...caseData, topVessel: activeVessel }}
                          isRedacted={isRedacted}
                          onLogAudit={logAudit}
                        />
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EVIDENCE AUDIT MATRIX & CHAIN OF CUSTODY */}
      {/* ========================================================================= */}
      {activeTab === "evidence" && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Feature 10: Section 65B Chain of Custody Timeline & Event Appender */}
          <ReportCustodyTimeline 
            incidentId={caseData.incidentId}
            isRedacted={isRedacted}
            onLogAudit={logAudit}
          />

          {/* Technical Evidence Breakdown */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy font-mono uppercase">
                Technical Evidence Registry & Scientific Cross-Checks
              </span>
              <span className="text-[10px] font-mono text-ocean font-bold">CASE: {caseData.incidentId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
                <h4 className="font-bold text-ocean-deep text-xs uppercase">1. Satellite Radar Backscatter (Sentinel-1)</h4>
                <p className="text-[11px] text-text-secondary font-sans">Dual-polarization VV/VH backscatter profile exhibits -22.4 dB capillary wave dampening characteristic of crude hydrocarbons.</p>
                <div className="text-[10px] text-text-muted">Sensor: C-SAR · Resolution: 10m/px · Scene: S1A_IW_GRDH_1SDV</div>
              </div>
              <div className="p-4 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
                <h4 className="font-bold text-ocean-deep text-xs uppercase">2. Lagrangian Reverse Drift Hindcast</h4>
                <p className="text-[11px] text-text-secondary font-sans">40-hour backward dispersion with OpenDrift/GNOME engine shows 72.4% cluster convergence at {caseData.coordinates.display}.</p>
                <div className="text-[10px] text-text-muted">Coupled: HYCOM 1/12° currents (61%) + ECMWF 10m winds (39%)</div>
              </div>
              <div className="p-4 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
                <h4 className="font-bold text-ocean-deep text-xs uppercase">3. Bi-LSTM Trajectory Reconstruction</h4>
                <p className="text-[11px] text-text-secondary font-sans">Resolves {activeVessel.aisGapMinutes || 38}-minute AIS silence (174 missing messages) directly across the hindcast origin zone with ±0.18 nm precision.</p>
                <div className="text-[10px] text-text-muted">Target: {activeVessel.name} · MMSI: {isRedacted ? '[REDACTED]' : activeVessel.mmsi}</div>
              </div>
              <div className="p-4 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
                <h4 className="font-bold text-ocean-deep text-xs uppercase">4. XGBoost Multi-Feature Attribution</h4>
                <p className="text-[11px] text-text-secondary font-sans">Fuses 24 kinematic and environmental features into a {activeVessel.priorityScore || 91.4}/100 Investigation Priority Score for {activeVessel.name}.</p>
                <div className="text-[10px] text-text-muted">Rank #1 Target · Funnel filtered from 142 vessels</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AI MODEL MATRIX (10 MODELS) & BENCHMARK DIAGNOSTICS */}
      {/* ========================================================================= */}
      {activeTab === "models" && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Feature 15: Live AI Models Diagnostic & Benchmark Runner */}
          <ReportModelBenchmarkRunner 
            models={AI_MODELS} 
            onLogAudit={logAudit}
          />

          {/* Search bar for models (Feature 17) */}
          <div className="flex items-center justify-between bg-white border border-border-marine p-3 rounded-xl gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ocean absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models by name, architecture (ResNet, U-Net, Bi-LSTM, XGBoost), or task..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-ocean-light border border-border-marine rounded-lg focus:outline-none"
              />
            </div>
            <span className="text-xs font-mono font-bold text-text-muted shrink-0">
              Showing {filteredModels.length} of 10 Models
            </span>
          </div>

          {/* Grid of Model Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredModels.map((model) => (
              <ModelStatusCard 
                key={model.id} 
                model={model} 
                onInspect={() => {
                  logAudit(`Inspected AI model ${model.id} (${model.name})`);
                  if (model.id === "M01" || model.id === "M02" || model.id === "M03") onNavigate("satellite");
                  else if (model.id === "M04") onNavigate("simulation");
                  else if (model.id === "M05" || model.id === "M06" || model.id === "M07") onNavigate("trajectory");
                  else if (model.id === "M08" || model.id === "M09") onNavigate("attribution");
                  else if (model.id === "M10") onNavigate("evidence-risk");
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DATA SOURCES & LIVE TELEMETRY STREAMING */}
      {/* ========================================================================= */}
      {activeTab === "sources" && (
        <div className="space-y-4 max-w-5xl mx-auto">
          {/* Feature 16: Live Data Sources Streaming Telemetry Simulator */}
          <ReportDataSourcesStreamer 
            sources={DATA_SOURCES} 
            onLogAudit={logAudit}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SYSTEM HEALTH & GPU TELEMETRY */}
      {/* ========================================================================= */}
      {activeTab === "health" && (
        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy font-mono uppercase">
                Infrastructure Health & Compute Allocation
              </span>
              <span className="text-[10px] font-mono text-status-success font-bold">● ALL SYSTEMS HEALTHY</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted block">API LATENCY</span>
                <span className="text-2xl font-bold text-status-success">{SYSTEM_HEALTH.apiLatencyMs} ms</span>
                <span className="text-[9px] text-text-muted block">Sub-50ms SLA met</span>
              </div>
              <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted block">GPU UTILIZATION</span>
                <span className="text-2xl font-bold text-ocean">{SYSTEM_HEALTH.gpuUtilization}%</span>
                <span className="text-[9px] text-text-muted block truncate">{SYSTEM_HEALTH.gpuName}</span>
              </div>
              <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted block">CPU WORKLOAD</span>
                <span className="text-2xl font-bold text-ocean-deep">{SYSTEM_HEALTH.cpuUtilization}%</span>
                <span className="text-[9px] text-text-muted block truncate">{SYSTEM_HEALTH.cpuName}</span>
              </div>
              <div className="p-3 bg-ocean-light rounded-xl border border-border-marine">
                <span className="text-[10px] text-text-muted block">MEMORY / STORAGE</span>
                <span className="text-2xl font-bold text-text-primary">{SYSTEM_HEALTH.memoryUsedGb}/{SYSTEM_HEALTH.memoryTotalGb} GB</span>
                <span className="text-[9px] text-text-muted block">{SYSTEM_HEALTH.storageUsedTb} TB Archive Used</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 20: Session Audit Log Drawer */}
      <ReportAuditTrailDrawer 
        logs={auditLogs}
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        onClearLogs={() => {
          setAuditLogs([]);
          logAudit('Cleared session audit log');
        }}
      />
    </div>
  );
}
