import React, { useState, useMemo } from 'react';
import { 
  Radar, 
  Satellite, 
  Ship, 
  Waves, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Compass, 
  FileText, 
  Cpu,
  Layers, 
  Database, 
  Radio, 
  Clock, 
  Zap, 
  MapPin, 
  ExternalLink, 
  Shield, 
  Eye, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  Scale, 
  Wind, 
  Anchor, 
  Droplet, 
  BarChart3, 
  AlertCircle,
  AlertTriangle,
  Search,
  Sliders,
  Download,
  RefreshCw,
  Play,
  FileCheck,
  Server,
  Terminal,
  LifeBuoy,
  BookOpen,
  HelpCircle,
  CheckSquare,
  Globe,
  Crosshair,
  Flame,
  Thermometer,
  Gauge,
  Menu,
  X
} from 'lucide-react';
import { AI_MODELS, INCIDENTS_REGISTRY, CANDIDATE_VESSELS } from '../data/mockData';
import { useIncident } from '../context/IncidentContext';
import MarineSightLogo from '../components/common/MarineSightLogo';

export default function Page01Landing({ onNavigate }) {
  const { selectIncident } = useIncident();

  // 1. Regional Corridors Tab State (6 Strategic Indian EEZ Corridors)
  const [activeCorridorId, setActiveCorridorId] = useState("OF-2026-0912");

  // 2. AI Models Category Filter
  const [modelCategory, setModelCategory] = useState("all");

  // 3. 7-Step Workflow Selected Step for Interactive Inspection
  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);

  // 4. Weathering Simulator State
  const [weatheringOilType, setWeatheringOilType] = useState("crude");
  const [weatheringHours, setWeatheringHours] = useState(24);
  const [weatheringTemp, setWeatheringTemp] = useState(28);
  const [weatheringWind, setWeatheringWind] = useState(14);

  // 5. Active FAQ Accordion Index
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // 6. Hero Telemetry View Tab
  const [heroTab, setHeroTab] = useState("sar");

  // 7. Mobile Navbar Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 6 Core Forensic Capabilities
  const capabilities = [
    {
      title: "Satellite SAR Oil Spill Detection",
      icon: Satellite,
      page: "satellite",
      tag: "Sentinel-1 / 2 GRD",
      desc: "Synthetic aperture radar ingestion with Dual-Pol VV/VH ratio analysis and sub-pixel Attention U-Net slick segmentation."
    },
    {
      title: "Terrestrial & Satellite AIS Intelligence",
      icon: Ship,
      page: "vessel-intel",
      tag: "MMSI / IMO Tracking",
      desc: "Real-time streaming transponder decoding, historical track synthesis, and SAR dark-vessel backscatter detection."
    },
    {
      title: "Hydrodynamic Drift & Hindcast",
      icon: Waves,
      page: "source-trace",
      tag: "CMEMS + HYCOM",
      desc: "Coupled Lagrangian hydrodynamic reverse origin tracking and 72-hour forward coastal threat dispersion physics."
    },
    {
      title: "Bi-LSTM Trajectory Reconstruction",
      icon: Compass,
      page: "trajectory",
      tag: "Deep Kinematics",
      desc: "Bidirectional LSTM gap interpolation recovering suspicious AIS transponder blackout windows and abrupt course deviations."
    },
    {
      title: "Evidence Fusion & Vessel Attribution",
      icon: Target,
      page: "attribution",
      tag: "XGBoost Ranking",
      desc: "Siamese trajectory similarity network establishing court-admissible Investigation Priority Scores for lead suspects."
    },
    {
      title: "Environmental Risk & Response",
      icon: ShieldCheck,
      page: "response-plan",
      tag: "MARPOL Containment",
      desc: "Automated coastal vulnerability mapping, marine protected area buffering, and tactical containment boom optimization."
    }
  ];

  // 7-Step Forensic Investigation Lifecycle
  const workflowSteps = [
    { 
      num: "01", 
      name: "Detect", 
      tech: "Sentinel-1 SAR VV/VH", 
      desc: "Spaceborne radar dark-formation acquisition and biogenic lookalike suppression.", 
      page: "satellite",
      inputData: "Sentinel-1 C-Band GRD Level-1 (VV & VH polarizations)",
      engine: "Attention U-Net Deep Semantic Segmenter (96.8% precision)",
      formula: "σ⁰_VV < -21.4 dB ∧ (σ⁰_VV / σ⁰_VH) > 8.2 dB",
      deliverable: "Binary Slick Mask GeoJSON & Polygon Centroid Coordinates"
    },
    { 
      num: "02", 
      name: "Characterize", 
      tech: "Attention U-Net & Fay", 
      desc: "Morphology, area, perimeter, thickness, and Fay viscous-surface tension spreading.", 
      page: "characterize",
      inputData: "Segmented SAR binary raster & Bonn Agreement color classification",
      engine: "GLCM Texture Decomposition & Mackay Viscous Regimes",
      formula: "r(t) = k_f · (Δρ / ρ_w)^(1/3) · V^(1/3) · t^(1/4)",
      deliverable: "Spill Thickness Profile, Bonn Volume Estimate (MT), GLCM Contrast"
    },
    { 
      num: "03", 
      name: "Reverse Trace", 
      tech: "Lagrangian Hindcast", 
      desc: "4th-order Runge-Kutta advection reverse-tracking oceanic currents to discharge origin.", 
      page: "source-trace",
      inputData: "CMEMS 0.083° Currents, NOAA GFS 10m Wind Stress, CODAR HF Radar",
      engine: "Coupled Lagrangian Particle Reverse Advection Engine",
      formula: "dx/dt = - [U_current(x,t) + 0.031 · U_wind(x,t) + U_stokes(x,t)]",
      deliverable: "Probabilistic Origin Zone A Envelope & Discharge Window [T-42h to T-36h]"
    },
    { 
      num: "04", 
      name: "Reconstruct", 
      tech: "Bi-LSTM Interpolation", 
      desc: "Recovers transponder blackout gaps, phantom tracks, and speed decelerations.", 
      page: "trajectory",
      inputData: "Raw AIVDM NMEA transponder logs from coastal DGLL & Spire satellite",
      engine: "Bidirectional Long Short-Term Memory (Bi-LSTM) Kinematic Interpolator",
      formula: "h_t = [LSTM_fwd(x_t), LSTM_bwd(x_t)] → P(lat, lng, SOG, COG)",
      deliverable: "Reconstructed Continuous Vessel Trajectories & Gap Flagging"
    },
    { 
      num: "05", 
      name: "Attribute", 
      tech: "Siamese + XGBoost", 
      desc: "Ranks candidate tankers by analytical priority and multi-factor liability.", 
      page: "attribution",
      inputData: "Vessel trajectories, Origin Zone A polygon, Port State Control history",
      engine: "Multi-Criteria Decision Analysis (MCDA) + Siamese Embedding",
      formula: "IPS = 0.30·S_dist + 0.25·S_kin + 0.20·S_hist + 0.15·S_cargo + 0.10·S_age",
      deliverable: "Court-Admissible Investigation Priority Ranking & Accusatory Matrix"
    },
    { 
      num: "06", 
      name: "Predict Drift", 
      tech: "OpenDrift Coupled", 
      desc: "72-hour forward shoreline impact forecast and weathering decay curves.", 
      page: "simulation",
      inputData: "Calibrated spill location, oil fraction distillation curves, MetOcean forecast",
      engine: "OpenDrift Coupled Oceanic-Atmospheric Dispersion Simulator",
      formula: "dM/dt = - K_evap · M_0 · exp(-α · T) - K_disp · (U_wind)^2",
      deliverable: "72h Hourly Shoreline Threat Probability & Critical Coastal Buffers"
    },
    { 
      num: "07", 
      name: "Contain & Respond", 
      tech: "Tactical Response Plan", 
      desc: "Coast Guard interceptor dispatch, boom geometry layout, and skimmer allocation.", 
      page: "response-plan",
      inputData: "Spill trajectory vector, Coast Guard vessel stations, Sensitive MPA zones",
      engine: "Linear Programming Resource Allocation & J-Sweep Boom Optimization",
      formula: "min Σ (TransitTime_i + DeploymentCost_i) s.t. ContainmentCapacity ≥ SpillVolume",
      deliverable: "Actionable Operational Response Order & Fast Patrol Vessel Waypoints"
    }
  ];

  // 6 Strategic Regional Corridors in Indian EEZ
  const regionalCorridors = [
    {
      id: "OF-2026-0912",
      name: "Arabian Sea Corridor",
      subtext: "Offshore Goa / Karnataka EEZ",
      coords: "14.82°N, 68.21°E",
      areaKm2: 14.7,
      risk: "CRITICAL",
      topVessel: "MV Ocean Star (VLCC)",
      flag: "🇮🇳 India",
      sensor: "Sentinel-1 SAR C-Band",
      oilType: "Heavy Crude Oil (API 29.4°)",
      estVolume: "420 MT (3,150 bbls)",
      hindcastHours: "40h Reverse Hindcast",
      priorityScore: "91.4%",
      driftVector: "1.2 kn @ 135° SE Current",
      blackoutDuration: "38 min intentional AIS blackout",
      shorelineThreat: "Projected Landfall in 74h (Goa Marine Coast)",
      evidenceHash: "SHA-256 e8f12...49a1",
      description: "Major offshore tanker lane discharge with a 38-minute intentional AIS transponder blackout during origin transit."
    },
    {
      id: "OF-2026-0918",
      name: "Bay of Bengal Corridor",
      subtext: "Visakhapatnam / Paradip Approach",
      coords: "17.45°N, 83.85°E",
      areaKm2: 8.2,
      risk: "HIGH",
      topVessel: "Golden Apex (Chemical Tanker)",
      flag: "🇮🇳 India",
      sensor: "Sentinel-1 SAR VV/VH",
      oilType: "Chemical Slops & NLS Cargo Wash",
      estVolume: "180 MT (1,320 bbls)",
      hindcastHours: "24h Reverse Hindcast",
      priorityScore: "88.7%",
      driftVector: "0.9 kn @ 295° NW Current",
      blackoutDuration: "45 min low-rate transponder ping",
      shorelineThreat: "Landfall in 36h (AP Olive Ridley Turtle Habitats)",
      evidenceHash: "SHA-256 a1b94...3c82",
      description: "Illegal tank-cleaning discharge drifting northwest toward ecologically sensitive coastal turtle nesting grounds."
    },
    {
      id: "OF-2026-0925",
      name: "Gulf of Kutch Corridor",
      subtext: "Sikka / Kandla Oil Terminals",
      coords: "22.52°N, 69.18°E",
      areaKm2: 11.3,
      risk: "CRITICAL",
      topVessel: "Al-Baraka (Crude Carrier)",
      flag: "🇮🇳 India",
      sensor: "Sentinel-1 SAR C-Band",
      oilType: "Kuwait Heavy Export Crude",
      estVolume: "310 MT (2,280 bbls)",
      hindcastHours: "18h Reverse Hindcast",
      priorityScore: "94.2%",
      driftVector: "1.6 kn @ 045° NE Tidal Drift",
      blackoutDuration: "28 min blackout near SPM buoy",
      shorelineThreat: "Landfall in 14h (Marine National Park Coral Sanctuary)",
      evidenceHash: "SHA-256 79de2...990f",
      description: "High-density crude oil slick near refinery offshore single-point mooring (SPM) buoy anchorages."
    },
    {
      id: "OF-2026-0922",
      name: "Gulf of Mannar & Palk Strait",
      subtext: "Rameswaram Coral Biosphere",
      coords: "09.18°N, 79.32°E",
      areaKm2: 4.6,
      risk: "HIGH",
      topVessel: "Lanka Pioneer (Bulk Carrier)",
      flag: "🇱🇰 Sri Lanka",
      sensor: "Sentinel-2 MSI Optical",
      oilType: "Low Sulfur Marine Gas Oil (MGO)",
      estVolume: "95 MT (710 bbls)",
      hindcastHours: "32h Reverse Hindcast",
      priorityScore: "86.1%",
      driftVector: "0.7 kn @ 210° SW Current",
      blackoutDuration: "Course deviation without transponder ping drop",
      shorelineThreat: "Threat to Dugong Seagrass & Coral Reefs (48h)",
      evidenceHash: "SHA-256 3f281...cb5e",
      description: "Bunker fuel discharge threatening sensitive marine national park coral reefs and dugong seagrass habitats."
    },
    {
      id: "OF-2026-0930",
      name: "Strait of Malacca (Six Degree Channel)",
      subtext: "Great Nicobar International Shipping Lane",
      coords: "06.85°N, 93.95°E",
      areaKm2: 19.8,
      risk: "CRITICAL",
      topVessel: "Pacific Vanguard (ULCC)",
      flag: "🇮🇳 India",
      sensor: "Sentinel-1 SAR C-Band",
      oilType: "Heavy Crude Sludge / Wash",
      estVolume: "680 MT (5,030 bbls)",
      hindcastHours: "48h Reverse Hindcast",
      priorityScore: "93.8%",
      driftVector: "2.1 kn @ 095° E Current",
      blackoutDuration: "52 min dark vessel gap recorded by coastal radar",
      shorelineThreat: "Deep oceanic dispersion across Great Nicobar Biosphere",
      evidenceHash: "SHA-256 bb902...71e4",
      description: "Massive 19.8 km² slick in the world's busiest chokepoint; non-AIS dark vessel echo detected by coastal radar."
    },
    {
      id: "OF-2026-0909",
      name: "Laccadive Sea Corridor",
      subtext: "Minicoy Nine Degree Channel",
      coords: "08.35°N, 73.15°E",
      areaKm2: 6.5,
      risk: "MEDIUM",
      topVessel: "Poseidon Trader (Container)",
      flag: "🇮🇳 India",
      sensor: "Landsat-8 OLI/TIRS",
      oilType: "Machinery Bilge & Oily Water",
      estVolume: "120 MT (890 bbls)",
      hindcastHours: "14h Reverse Hindcast",
      priorityScore: "79.5%",
      driftVector: "1.1 kn @ 110° ESE Current",
      blackoutDuration: "19 min speed drop during nighttime passage",
      shorelineThreat: "Dispersing east towards Lakshadweep Atolls (88h)",
      evidenceHash: "SHA-256 50cc1...34a0",
      description: "Dispersed hydrocarbon sheen wake identified along east-west trans-oceanic container shipping route."
    }
  ];

  const activeCorridor = regionalCorridors.find(c => c.id === activeCorridorId) || regionalCorridors[0];

  // Filtered AI Models
  const filteredAiModels = AI_MODELS.filter(m => {
    if (modelCategory === "all") return true;
    if (modelCategory === "vision") return m.id === "M01" || m.id === "M02" || m.id === "M03" || m.id === "M04";
    if (modelCategory === "kinematics") return m.id === "M05" || m.id === "M06" || m.id === "M07";
    if (modelCategory === "hydro") return m.id === "M08" || m.id === "M09" || m.id === "M10";
    return true;
  });

  // Handle Launching a Regional Case
  const handleLaunchCorridorCase = (caseId, targetPage = "workspace") => {
    selectIncident(caseId);
    onNavigate(targetPage);
  };

  // Weathering Calculator Dynamic Calculations
  const calculatedWeathering = useMemo(() => {
    const hours = weatheringHours;
    const tempFactor = (weatheringTemp - 15) / 20; // 0 at 15C, 1 at 35C
    const windFactor = weatheringWind / 25; // scaling for wind

    let baseEvapRate = 0.25;
    let maxEmulsion = 65;
    let baseDisp = 0.12;

    if (weatheringOilType === "crude") {
      baseEvapRate = 0.28;
      maxEmulsion = 68;
    } else if (weatheringOilType === "light") {
      baseEvapRate = 0.46;
      maxEmulsion = 42;
    } else if (weatheringOilType === "mgo") {
      baseEvapRate = 0.58;
      maxEmulsion = 15;
    } else if (weatheringOilType === "slops") {
      baseEvapRate = 0.18;
      maxEmulsion = 52;
    }

    // Evaporation %
    const evap = Math.min(85, Math.round((baseEvapRate * (1 + tempFactor * 0.4) * (1 - Math.exp(-hours / 18))) * 100));
    // Emulsification %
    const emuls = Math.min(maxEmulsion, Math.round((maxEmulsion / 100 * (1 - Math.exp(-hours / 24)) * (0.6 + windFactor * 0.4)) * 100));
    // Dispersion %
    const disp = Math.min(30, Math.round((baseDisp * windFactor * (hours / 36)) * 100));
    // Remaining on surface %
    const surface = Math.max(5, 100 - evap - disp);
    // Viscosity in cP
    const viscosity = Math.round(180 * Math.exp(0.045 * hours) * (1 + emuls / 25));

    return { evap, emuls, disp, surface, viscosity };
  }, [weatheringOilType, weatheringHours, weatheringTemp, weatheringWind]);

  // All 15 Platform Operational Modules
  const platformModules = [
    { num: "01", name: "Landing Operations Hub", page: "landing", cat: "Portal", icon: Radio, desc: "Mission briefing, regional surveillance readiness, and executive system status." },
    { num: "02", name: "Strategic Command Center", page: "command-center", cat: "Surveillance", icon: Activity, desc: "High-level EEZ situational awareness, live radar telemetry, and threat matrices." },
    { num: "03", name: "Live Tactical GIS Monitor", page: "live-monitor", cat: "Surveillance", icon: Globe, desc: "Real-time vessel tracking, FLIR feeds, dark vessel matrix, and metocean buoys." },
    { num: "04", name: "National Incidents Registry", page: "incidents", cat: "Surveillance", icon: Layers, desc: "Centralized archive of verified discharges, risk classifications, and case files." },
    { num: "05", name: "Unified Investigation Workspace", page: "workspace", cat: "Core Hub", icon: Crosshair, desc: "Analyst command workbench integrating GIS, sensor fusion, and live timeline bars." },
    { num: "06", name: "Satellite SAR Ingest & Filter", page: "satellite", cat: "Sensors", icon: Satellite, desc: "Copernicus Sentinel-1/2 ingestion, VV/VH polarimetry, and lookalike suppression." },
    { num: "07", name: "Spill Characterization Engine", page: "characterize", cat: "Forensics", icon: Droplet, desc: "Morphometry, GLCM texture analysis, Fay spreading, and Bonn volume calculation." },
    { num: "08", name: "Drift Simulation & Weathering", page: "simulation", cat: "Physics", icon: Waves, desc: "72-hour forward Lagrangian particle dispersion and chemical weathering kinetics." },
    { num: "09", name: "Reverse Lagrangian Source Trace", page: "source-trace", cat: "Physics", icon: Compass, desc: "Backward Runge-Kutta hydrodynamic hindcasting pinpointing Origin Zone A." },
    { num: "10", name: "Suspect Vessel Intelligence", page: "vessel-intel", cat: "Vessels", icon: Ship, desc: "IMO/MMSI dossier, historical route logs, flag state risk, and PSC inspection records." },
    { num: "11", name: "Bi-LSTM Trajectory Interpolator", page: "trajectory", cat: "Kinematics", icon: Zap, desc: "Reconstructing intentional AIS transponder gaps, speed drops, and course shifts." },
    { num: "12", name: "Forensic Vessel Attribution", page: "attribution", cat: "Attribution", icon: Target, desc: "Siamese similarity network and XGBoost ranking candidate vessels for liability." },
    { num: "13", name: "Legal Evidence & Risk Matrix", page: "evidence-risk", cat: "Legal", icon: Scale, desc: "Bayesian probability weights, ecological risk indices, and Merkle ledger integrity." },
    { num: "14", name: "Tactical Containment Response", page: "response-plan", cat: "Operations", icon: ShieldCheck, desc: "Coast Guard interceptor dispatch, J-Sweep boom geometry, and skimmer staging." },
    { num: "15", name: "Court Dossier & Report Export", page: "report-system", cat: "Legal", icon: FileText, desc: "Automated court-ready PDF/A affidavit compilation under Indian Evidence Act 65B." }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: "How does MarineSight reliably distinguish mineral oil spills from natural biogenic lookalikes?",
      a: "MarineSight combines dual-polarization Sentinel-1 SAR C-Band radar (VV/VH backscatter damping ratio) with Gray-Level Co-occurrence Matrix (GLCM) texture metrics and a fine-tuned ResNet-50 lookalike classifier. Natural biogenic slicks (such as algal blooms or fish oils) exhibit distinct elastance gradients, higher entropy, and disperse rapidly under wind speeds exceeding 3 m/s, whereas heavy hydrocarbons maintain high surface tension dampening across VV backscatter (< -22 dB) with sharp non-convoluted boundaries."
    },
    {
      q: "What methodology is used to attribute a spill if a suspect vessel deliberately turns off its AIS transponder?",
      a: "When a vessel shuts down its Class-A AIS transponder (creating a 'dark vessel' gap), MarineSight activates its Bidirectional Long Short-Term Memory (Bi-LSTM) kinematic interpolator. It cross-references coastal HF radar / DGLL VTS raw echoes, calculates kinematic feasibility envelopes between the last known ping and recovery ping, evaluates draft changes, and correlates the vessel's calculated time-space path against the backward hydrodynamic Origin Zone A."
    },
    {
      q: "How does the Lagrangian backward hindcasting engine account for complex ocean currents and Stokes drift?",
      a: "The reverse advection engine solves the 4th-Order Runge-Kutta numerical differential equation step-by-step backwards in time. It couples Copernicus Marine Service (CMEMS) 0.083° global ocean velocity vectors, INCOIS coastal CODAR high-frequency radar surface currents, and NOAA GFS 10-meter wind stress vectors incorporating a calibrated 3.1% windage factor and wave-induced Stokes drift. Monte Carlo particle ensembles (5,000 particles) establish 95% confidence Origin Zone A polygons."
    },
    {
      q: "Are the affidavits and dossiers generated by MarineSight admissible in Indian courts and the National Green Tribunal?",
      a: "Yes. MarineSight was designed from the ground up to comply with Section 65B of the Indian Evidence Act (1872) and MARPOL 73/78 Annex I guidelines. Every raw satellite granule, decoded NMEA AIS message packet, hydrodynamic computation run, and analyst markup is stamped with a SHA-256 cryptographic hash anchored into an immutable chain-of-custody audit log, ensuring complete digital non-repudiation."
    },
    {
      q: "Can the platform predict shoreline impact and optimize Coast Guard containment equipment in real time?",
      a: "Yes. Once an active slick is delineated, the Forward Drift Module runs an accelerated 72-hour coupled OpenDrift simulation with local shoreline bathymetry and Environmental Sensitivity Index (ESI) mapping. It identifies projected coastal impact zones, evaluates mangrove and coral sanctuary vulnerability, and generates optimal tactical boom layouts (J-Sweep, U-Sweep) with staging coordinates for Indian Coast Guard Fast Patrol Vessels."
    },
    {
      q: "What satellite sensors and revisit rates does MarineSight support?",
      a: "The system actively ingests Sentinel-1A and Sentinel-1B C-band SAR (all-weather day/night 10m GSD), Sentinel-2 MSI multispectral imagery (10m bands for optical confirmation), Landsat-8/9 OLI-2/TIRS-2, and commercial synthetic aperture radar (TerraSAR-X, ICEYE, and Capella Space) via automated STAC and Copernicus API integrations, yielding comprehensive coverage across the 2.37 million km² Indian EEZ."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-ocean-sky selection:text-ocean-deep font-sans">
      
      {/* SECTION 1: GLOBAL MARITIME TACTICAL HEADER & LIVE INCIDENT ALERT RIBBON */}
      <section className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-marine shadow-xs">
        {/* Emergency Alert Ribbon */}
        <div className="bg-ocean-navy text-white px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-danger opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-danger"></span>
            </span>
            <span className="font-bold text-red-400 uppercase tracking-wide">ACTIVE EEZ MARITIME ALERT:</span>
            <span className="text-slate-200 truncate hidden sm:inline">
              Case OF-2026-0912 · 14.7 km² Heavy Crude Slick Detected Offshore Goa (14.82°N, 68.21°E) · T-40h Lagrangian Source Trace Running
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-300 font-mono whitespace-nowrap pl-2">
            <span className="hidden md:inline">SURVEILLANCE MODE: DEFCON-3</span>
            <span className="text-emerald-400 font-bold">● AIS RX ONLINE</span>
            <button 
              onClick={() => handleLaunchCorridorCase("OF-2026-0912", "workspace")}
              className="px-2 py-0.5 rounded bg-ocean hover:bg-ocean-deep text-white font-bold text-[10px] transition-all"
            >
              Inspect Case
            </button>
          </div>
        </div>

        {/* Primary Navigation Bar */}
        <nav className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MarineSightLogo showTagline={false} />
            <div className="hidden lg:block border-l border-border-marine pl-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-status-success text-[10px] font-mono font-bold">
                  ● LIVE RADAR & SAR INGEST
                </span>
                <span className="text-[10px] font-mono text-text-muted">INDIAN EEZ 2.37M KM²</span>
              </div>
              <p className="text-[11px] text-text-muted">
                National Autonomous Oil Spill Forensics & AIS Attribution Platform
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold">
            <button 
              onClick={() => onNavigate("live-monitor")}
              className="px-3 py-1.5 rounded-lg text-ocean-navy hover:text-ocean hover:bg-ocean-sky transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-ocean" />
              <span className="hidden md:inline">Live Monitor</span>
            </button>
            
            <button 
              onClick={() => onNavigate("incidents")}
              className="px-3 py-1.5 rounded-lg text-ocean-navy hover:text-ocean hover:bg-ocean-sky transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-ocean" />
              <span className="hidden md:inline">Registry</span>
            </button>

            <button 
              onClick={() => onNavigate("command-center")}
              className="px-3 py-1.5 rounded-lg text-ocean-navy hover:text-ocean hover:bg-ocean-sky transition-colors hidden md:block"
            >
              Command Portal
            </button>

            <button 
              onClick={() => onNavigate("workspace")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white font-bold shadow-marine-sm transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-ocean-navy hover:bg-ocean-sky rounded-lg transition-colors"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Expandable Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-border-marine px-4 py-3 space-y-2 text-xs font-semibold animate-fade-in shadow-marine-md">
            <button 
              onClick={() => { onNavigate("command-center"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-ocean-navy hover:bg-ocean-sky flex items-center justify-between"
            >
              <span>Command Center</span>
              <span className="font-mono text-[10px] text-ocean">02</span>
            </button>
            <button 
              onClick={() => { onNavigate("live-monitor"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-ocean-navy hover:bg-ocean-sky flex items-center justify-between"
            >
              <span>Live Ocean Monitor</span>
              <span className="font-mono text-[10px] text-ocean">03</span>
            </button>
            <button 
              onClick={() => { onNavigate("incidents"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-ocean-navy hover:bg-ocean-sky flex items-center justify-between"
            >
              <span>Incidents Registry</span>
              <span className="font-mono text-[10px] text-ocean">04</span>
            </button>
            <button 
              onClick={() => { onNavigate("workspace"); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-ocean-navy hover:bg-ocean-sky flex items-center justify-between"
            >
              <span>Investigation Hub</span>
              <span className="font-mono text-[10px] text-ocean">05</span>
            </button>
            <div className="pt-2 border-t border-border-marine flex items-center justify-between text-[11px] text-text-muted">
              <span>SAR Constellation: LIVE</span>
              <span className="text-status-success font-bold font-mono">● ONLINE</span>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: HERO OPERATIONS HUB & MULTI-SENSOR FORENSIC HOLOGRAPHIC HUD */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6 bg-gradient-to-b from-ocean-light via-white to-ocean-light/30 border-b border-border-marine">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Government & Research Grade Badge */}
          <div className="inline-flex items-center gap-2 bg-ocean-sky/80 border border-ocean/30 px-4 py-1.5 rounded-full text-xs font-bold text-ocean-deep mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
            <span>INTELLIGENCE-GRADE MARINE FORENSICS · SMART INDIA HACKATHON 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ocean-navy tracking-tight leading-tight max-w-4xl mx-auto">
            AUTONOMOUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-ocean-bright">OIL SPILL FORENSICS</span> & VESSEL ATTRIBUTION
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Delineate illegal hydrocarbon discharges from Sentinel-1 SAR imagery, reconstruct hydrodynamic drift backwards in time to pinpoint Origin Zone A, and formulate court-admissible AIS vessel attribution affidavits under international MARPOL and Indian Evidence Act standards.
          </p>

          {/* Action CTAs */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate("workspace")}
              className="px-6 py-3 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-sm font-bold shadow-marine-md transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              <Crosshair className="w-4 h-4 text-sky-200" />
              <span>Launch Investigation Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onNavigate("live-monitor")}
              className="px-6 py-3 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-sm font-bold shadow-marine-sm transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-ocean" />
              <span>Open Live GIS Monitor</span>
            </button>

            <button
              onClick={() => onNavigate("incidents")}
              className="px-5 py-3 rounded-xl border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-sm font-semibold transition-all"
            >
              Browse 6 EEZ Cases
            </button>
          </div>

          {/* Interactive Multi-Sensor Tactical Telemetry Showcase Card */}
          <div className="mt-12 max-w-5xl mx-auto bg-[#071E30] p-4 sm:p-6 rounded-3xl shadow-2xl border border-border-marine/50 text-left relative overflow-hidden">
            
            {/* Top Tactical Status Bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs font-mono text-white/90 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-white tracking-wide">OPERATIONAL FORENSIC DOSSIER · CASE OF-2026-0912</span>
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/60 text-red-300 font-bold text-[10px]">
                  CRITICAL INCIDENT
                </span>
              </div>

              {/* HUD Sub-tabs */}
              <div className="flex items-center gap-2 text-[11px]">
                <button 
                  onClick={() => setHeroTab("sar")}
                  className={`px-2.5 py-1 rounded font-mono transition-all ${heroTab === 'sar' ? 'bg-[#00E5FF] text-black font-bold' : 'bg-white/10 text-slate-300 hover:text-white'}`}
                >
                  SAR Delineation
                </button>
                <button 
                  onClick={() => setHeroTab("hindcast")}
                  className={`px-2.5 py-1 rounded font-mono transition-all ${heroTab === 'hindcast' ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-slate-300 hover:text-white'}`}
                >
                  Lagrangian Hindcast
                </button>
                <button 
                  onClick={() => setHeroTab("attribution")}
                  className={`px-2.5 py-1 rounded font-mono transition-all ${heroTab === 'attribution' ? 'bg-rose-500 text-white font-bold' : 'bg-white/10 text-slate-300 hover:text-white'}`}
                >
                  Vessel Attribution
                </button>
              </div>
            </div>

            {/* Tri-Sensor Multi-Domain Forensic Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: SAR Spaceborne Delineation */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${heroTab === 'sar' ? 'bg-[#0E2E46] border-[#00E5FF]' : 'bg-[#0B2538] border-white/10'}`}>
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#00E5FF] font-bold flex items-center gap-1.5">
                      <Satellite className="w-3.5 h-3.5 text-[#00E5FF]" />
                      SAR RADAR DELINEATION
                    </span>
                    <span className="text-slate-400">10m Res</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-[#051522] rounded-xl border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delineated Area:</span>
                      <span className="text-white font-bold">14.72 km² (Perim: 28.4 km)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Segmentation:</span>
                      <span className="text-emerald-400 font-bold">Attention U-Net (96.8%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Polarization:</span>
                      <span className="text-white">Dual-Pol VV/VH (8.4 dB)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volume Estimate:</span>
                      <span className="text-amber-400 font-bold">~420 Metric Tons</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Continuous dark formation trailing 128° SE. Biogenic false-positive filter applied; wind speed 4.2 m/s confirms surface tension damping.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate("satellite")}
                  className="mt-2 text-xs font-bold text-[#00E5FF] hover:text-white flex items-center gap-1 group pt-2 border-t border-white/10"
                >
                  <span>Inspect SAR Decompositions</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: Coupled Hydrodynamic Reverse Hindcast */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${heroTab === 'hindcast' ? 'bg-[#0E2E46] border-amber-400' : 'bg-[#0B2538] border-white/10'}`}>
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-amber-400" />
                      DRIFT & ORIGIN HINDCAST
                    </span>
                    <span className="text-slate-400">T-40h Runge-Kutta</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-[#051522] rounded-xl border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Origin Zone:</span>
                      <span className="text-amber-300 font-bold">Zone A (14.821°N, 68.211°E)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Drift Vector:</span>
                      <span className="text-white font-bold">1.2 kn @ 135° SE Current</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Windage Factor:</span>
                      <span className="text-white">3.1% Stokes Drift</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Shoreline Threat:</span>
                      <span className="text-red-400 font-bold">74h Landfall (Goa Coast)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Coupled CMEMS hydrodynamic hindcast converges 5,000 backward particles to a single transit lane point at T-38h with 1.8 NM circular error.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate("source-trace")}
                  className="mt-2 text-xs font-bold text-amber-400 hover:text-white flex items-center gap-1 group pt-2 border-t border-white/10"
                >
                  <span>Trace Lagrangian Origins</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 3: AIS Kinematics & Vessel Attribution */}
              <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${heroTab === 'attribution' ? 'bg-[#0E2E46] border-rose-400' : 'bg-[#0B2538] border-white/10'}`}>
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-rose-400" />
                      VESSEL ATTRIBUTION
                    </span>
                    <span className="text-emerald-400 font-bold">91.4% Priority</span>
                  </div>

                  <div className="mt-3 p-2.5 bg-[#051522] rounded-xl border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Suspect:</span>
                      <span className="text-rose-300 font-bold">MV Ocean Star (VLCC)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IMO / MMSI:</span>
                      <span className="text-white">IMO 9418201 · Flag: India</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AIS Transponder Gap:</span>
                      <span className="text-rose-400 font-bold">38 min Intentional Blackout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kinematic Shift:</span>
                      <span className="text-amber-400">13.2 kn → 3.8 kn in Zone A</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    Bi-LSTM interpolation recovered transponder blackout window. Spatial intersection with Origin Zone A during speed drop establishes prime liability.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate("attribution")}
                  className="mt-2 text-xs font-bold text-rose-400 hover:text-white flex items-center gap-1 group pt-2 border-t border-white/10"
                >
                  <span>View Court-Admissible Dossier</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Tactical Action Bar */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Forensic Chain-of-Custody Verified
                </span>
                <span className="hidden md:inline">|</span>
                <span className="hidden md:inline text-slate-400">
                  MARPOL Annex I & UNCLOS 211 Formatted
                </span>
                <span className="hidden md:inline">|</span>
                <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
                  SHA-256: 4b29f0...c9a1
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={() => onNavigate("live-monitor")}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Real-Time GIS View</span>
                </button>

                <button
                  onClick={() => onNavigate("workspace")}
                  className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Open Full Case Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: KEY OPERATIONAL SURVEILLANCE METRICS & NATIONAL EEZ READINESS */}
      <section className="py-12 bg-white border-b border-border-marine px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-marine pb-4">
            <div>
              <span className="text-xs font-bold text-ocean font-mono tracking-wider uppercase">Section 03 · National Readiness</span>
              <h2 className="text-xl sm:text-2xl font-black text-ocean-navy mt-0.5">Maritime EEZ Surveillance Statistics</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              <span>Updated Live · Continuous 24/7 Satellite Telemetry</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-center">
            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean-deep font-mono">14,280+</div>
              <p className="text-xs text-text-secondary font-bold mt-1">Satellite Scenes</p>
              <span className="text-[10px] text-ocean font-mono mt-0.5 block">Sentinel-1, 2, Landsat-9</span>
            </div>

            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean-deep font-mono">4,390+</div>
              <p className="text-xs text-text-secondary font-bold mt-1">Slicks Classified</p>
              <span className="text-[10px] text-status-success font-mono mt-0.5 block">96.8% Precision Rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean-deep font-mono">8,940+</div>
              <p className="text-xs text-text-secondary font-bold mt-1">Vessels Tracked</p>
              <span className="text-[10px] text-ocean font-mono mt-0.5 block">AIS Class-A & VTS RX</span>
            </div>

            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean-deep font-mono">2.37M</div>
              <p className="text-xs text-text-secondary font-bold mt-1">km² Indian EEZ</p>
              <span className="text-[10px] text-ocean font-mono mt-0.5 block">Full Coastal Coverage</span>
            </div>

            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean font-mono">&lt; 1.2s</div>
              <p className="text-xs text-text-secondary font-bold mt-1">Inference Latency</p>
              <span className="text-[10px] text-status-success font-mono mt-0.5 block">Edge Accelerated</span>
            </div>

            <div className="p-4 rounded-2xl bg-ocean-light/50 border border-border-marine/60 shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-ocean-deep font-mono">100%</div>
              <p className="text-xs text-text-secondary font-bold mt-1">Merkle Proofs</p>
              <span className="text-[10px] text-status-success font-mono mt-0.5 block">Evidence Act 65B</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 7-STEP FORENSIC INVESTIGATION LIFECYCLE (WITH INTERACTIVE INSPECTOR) */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-ocean-light/20 to-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 04 · Investigation Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              The Seven-Step Forensic Attribution Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Select any stage in the forensic pipeline to inspect the underlying machine learning models, physics engines, and court-admissible deliverables.
            </p>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {workflowSteps.map((step, idx) => (
              <div 
                key={step.num}
                onClick={() => setActiveWorkflowIndex(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group shadow-xs ${
                  activeWorkflowIndex === idx
                    ? 'bg-ocean text-white border-ocean-deep shadow-marine-md scale-[1.03]'
                    : 'bg-white border-border-marine hover:border-ocean hover:bg-ocean-sky/40 text-ocean-navy'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono">
                    <span className={`text-xs font-black ${activeWorkflowIndex === idx ? 'text-white' : 'text-ocean'}`}>
                      {step.num}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${activeWorkflowIndex === idx ? 'text-white' : 'text-text-muted group-hover:text-ocean'}`} />
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold mt-1.5 ${activeWorkflowIndex === idx ? 'text-white' : 'text-ocean-navy'}`}>
                    {step.name}
                  </h4>
                  <span className={`text-[10px] font-mono block mt-0.5 ${activeWorkflowIndex === idx ? 'text-sky-100' : 'text-ocean-deep font-semibold'}`}>
                    {step.tech}
                  </span>
                </div>
                <div className={`mt-3 text-[9px] font-mono uppercase tracking-wider font-bold ${activeWorkflowIndex === idx ? 'text-white/80' : 'text-ocean'}`}>
                  {activeWorkflowIndex === idx ? 'Active Step' : 'Click to Inspect'}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Inspector Panel for Selected Workflow Step */}
          {(() => {
            const currentStep = workflowSteps[activeWorkflowIndex];
            return (
              <div className="bg-white border-2 border-ocean/30 rounded-3xl p-5 sm:p-7 shadow-marine-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-ocean text-white font-mono font-bold text-xs">
                      PHASE {currentStep.num} OF 07
                    </span>
                    <h3 className="text-xl font-black text-ocean-navy">
                      {currentStep.name} · {currentStep.tech}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {currentStep.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine/60">
                      <span className="text-[10px] text-text-muted uppercase font-bold block">Input Data Source</span>
                      <span className="font-semibold text-ocean-navy">{currentStep.inputData}</span>
                    </div>
                    <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine/60">
                      <span className="text-[10px] text-text-muted uppercase font-bold block">Algorithm / Engine</span>
                      <span className="font-semibold text-ocean-deep">{currentStep.engine}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0B2538] text-white rounded-xl font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>MATHEMATICAL FORMULATION</span>
                      <span className="text-emerald-400 font-bold">Deterministic</span>
                    </div>
                    <p className="text-[#00E5FF] font-semibold text-[11px] sm:text-xs">
                      {currentStep.formula}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => onNavigate(currentStep.page)}
                      className="px-5 py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                    >
                      <span>Launch Phase Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono text-text-muted">
                      Target Deliverable: <strong className="text-ocean-navy">{currentStep.deliverable}</strong>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-ocean-sky/40 border border-ocean/20 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-ocean uppercase font-mono tracking-wider">
                    Pipeline Output Deliverable
                  </h4>
                  <div className="p-3.5 bg-white rounded-xl border border-border-marine shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-status-success text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-status-success" />
                      <span>Admissible Forensic Evidence</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {currentStep.deliverable}. Automated verification runs across dual spatial indexing grids (H3 hex-bins & R-tree) ensuring zero latency in inter-agency exchange.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary">
                    <span>Audit Status: Passed Sec 65B</span>
                    <span className="text-ocean font-bold">ISO/IEC 27037 Compliant</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SECTION 5: 6 STRATEGIC REGIONAL CORRIDORS SHOWCASE (INDIAN EEZ) */}
      <section className="py-16 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 05 · Regional Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              6 Strategic Indian EEZ Maritime Corridors
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Explore active satellite forensic cases across Arabian Sea, Bay of Bengal, Gulf of Kutch, Gulf of Mannar, Strait of Malacca, and Laccadive Sea.
            </p>
          </div>

          {/* Corridor Selection Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {regionalCorridors.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCorridorId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCorridorId === c.id
                    ? 'bg-ocean text-white shadow-marine-sm scale-105'
                    : 'bg-white border border-border-marine text-ocean-navy hover:bg-ocean-sky'
                }`}
              >
                <span>{c.name.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Featured Corridor Showcase Card */}
          <div className="bg-white border-2 border-ocean/30 rounded-3xl p-5 sm:p-7 shadow-marine-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fade-in">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-status-danger font-mono font-bold text-[10px]">
                  {activeCorridor.risk} TIER INCIDENT
                </span>
                <span className="text-xs font-mono text-ocean-deep font-bold">{activeCorridor.id}</span>
                <span className="text-xs font-mono text-text-muted">· {activeCorridor.coords}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-ocean-navy">
                {activeCorridor.name} — {activeCorridor.subtext}
              </h3>

              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {activeCorridor.description}
              </p>

              {/* Corridor Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">DETECTED AREA</span>
                  <span className="font-bold text-ocean-navy">{activeCorridor.areaKm2} km²</span>
                </div>
                <div className="p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">PRIMARY SENSOR</span>
                  <span className="font-bold text-ocean-deep truncate block">{activeCorridor.sensor.split(' ')[0]}</span>
                </div>
                <div className="p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">LEAD SUSPECT</span>
                  <span className="font-bold text-status-danger truncate block">{activeCorridor.topVessel.split('(')[0]}</span>
                </div>
                <div className="p-2.5 bg-ocean-light/60 rounded-xl border border-border-marine/50">
                  <span className="text-[9px] text-text-muted block">FLAG STATE</span>
                  <span className="font-bold text-ocean-navy truncate block">{activeCorridor.flag}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleLaunchCorridorCase(activeCorridor.id, "workspace")}
                  className="px-5 py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <span>Open Investigation ({activeCorridor.id})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleLaunchCorridorCase(activeCorridor.id, "live-monitor")}
                  className="px-4 py-2.5 rounded-xl border border-border-marine hover:bg-ocean-sky text-ocean-navy text-xs font-bold transition-colors"
                >
                  Monitor on Live Map
                </button>
              </div>
            </div>

            {/* High-Fidelity Forensic Telemetry Dossier for Active Corridor */}
            <div className="lg:col-span-5 bg-[#0B2538] p-4 sm:p-5 rounded-2xl border border-border-marine/40 text-white font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  RADAR & SATELLITE TELEMETRY
                </span>
                <span className="text-slate-400">{activeCorridor.coords}</span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-[#051522] rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Hydrocarbon Classification:</span>
                  <span className="text-[#00E5FF] font-bold">{activeCorridor.oilType}</span>
                </div>

                <div className="p-2 bg-[#051522] rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Estimated Total Volume:</span>
                  <span className="text-amber-300 font-bold">{activeCorridor.estVolume}</span>
                </div>

                <div className="p-2 bg-[#051522] rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Hydrodynamic Drift:</span>
                  <span className="text-white">{activeCorridor.driftVector}</span>
                </div>

                <div className="p-2 bg-[#051522] rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">AIS Kinematics:</span>
                  <span className="text-red-300 font-bold">{activeCorridor.blackoutDuration}</span>
                </div>

                <div className="p-2 bg-[#051522] rounded-lg border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Ecological Shore Threat:</span>
                  <span className="text-rose-400 font-bold">{activeCorridor.shorelineThreat}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Chain of Custody: <strong className="text-white font-mono">{activeCorridor.evidenceHash}</strong></span>
                <span className="text-emerald-400 font-bold">Attribution: {activeCorridor.priorityScore}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: MULTI-SENSOR SPACEBORNE & TERRESTRIAL INGESTION ARCHITECTURE */}
      <section className="py-16 px-4 sm:px-6 bg-ocean-light/30 border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 06 · Sensory Backbone</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Multi-Source Ingestion & Sensor Fusion Architecture
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Synthesizing orbital radar satellites, terrestrial transponders, coastal radar, and numerical ocean models into a unified intelligence pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-border-marine shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-ocean flex items-center justify-center font-bold">
                <Satellite className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Spaceborne SAR Constellation</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Automated Copernicus Open Access Hub polling for Sentinel-1 C-Band SAR (IW Mode, 250km swath) with all-weather, day-and-night sea surface penetration.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean font-bold">
                10m GSD · VV/VH Dual-Pol
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-border-marine shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-status-success flex items-center justify-center font-bold">
                <Ship className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Terrestrial & Satellite AIS</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Ingests 8,900+ simultaneous Class-A vessel transponders via DGLL coastal VTS antennas and satellite constellation feeds with AIVDM stream parsing.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-status-success font-bold">
                156.025 - 162.025 MHz RX
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-border-marine shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-status-warning flex items-center justify-center font-bold">
                <Waves className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">MetOcean & Current Dynamics</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                INCOIS Coastal Ocean Dynamics Applications Radar (CODAR) coupled with CMEMS 0.083° global currents and NOAA GFS 10m wind stress vectors.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-status-warning font-bold">
                4th-Order Runge-Kutta Advection
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-border-marine shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Evidence Hash & Legal Integrity</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every satellite granule, raw AIS message packet, and backward trajectory calculation is stamped with SHA-256 cryptographic signatures.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-purple-600 font-bold">
                Indian Evidence Act Sec 65B
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: COMPLETE 15-MODULE OPERATIONAL COMMAND SUITE DIRECTORY */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 07 · Operational Suite</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              15 Integrated Command & Forensics Subsystems
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              A comprehensive national maritime intelligence architecture. Click any operational module to jump straight to its specialized console.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {platformModules.map((mod) => {
              const ModIcon = mod.icon;
              return (
                <div
                  key={mod.num}
                  onClick={() => onNavigate(mod.page)}
                  className="p-4 rounded-2xl bg-white border border-border-marine hover:border-ocean hover:shadow-marine-sm transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
                      <span className="text-ocean">{mod.num}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-ocean-light text-ocean-deep border border-ocean/20">
                        {mod.cat}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-ocean-sky text-ocean group-hover:bg-ocean group-hover:text-white transition-colors">
                        <ModIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-ocean-navy group-hover:text-ocean transition-colors">
                        {mod.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border-marine/50 flex items-center justify-between text-[10px] font-mono text-ocean font-bold">
                    <span>Open Module</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: NEURAL NETWORK & MACHINE LEARNING MODEL ZOO (10 MODELS BENCHMARK) */}
      <section className="py-20 px-4 sm:px-6 bg-ocean-light/20 border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 08 · Neural Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              10 Specialized AI & Hydrodynamic Models
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Every stage of the investigation runs specialized neural networks and hydrodynamic equations.
            </p>
          </div>

          {/* Model Category Tabs */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: "all", label: "All 10 Models" },
              { id: "vision", label: "Computer Vision & SAR" },
              { id: "kinematics", label: "Kinematic AIS LSTM" },
              { id: "hydro", label: "Hydrodynamic Drift & Weathering" }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setModelCategory(id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  modelCategory === id
                    ? 'bg-ocean text-white shadow-xs'
                    : 'bg-white border border-border-marine text-text-secondary hover:bg-ocean-sky'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {filteredAiModels.map((model) => (
              <div 
                key={model.id} 
                className="p-4 bg-white border border-border-marine rounded-2xl shadow-marine-sm flex flex-col justify-between hover:border-ocean transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5">
                    <span className="text-ocean">{model.id}</span>
                    <span className="text-status-success flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>{model.status}</span>
                    </span>
                  </div>

                  <h5 className="text-xs font-black text-ocean-navy leading-tight">{model.name}</h5>
                  <p className="text-[10px] text-ocean-deep font-mono font-semibold mt-1">{model.architecture}</p>
                  <p className="text-[10px] text-text-muted mt-1.5 line-clamp-2">{model.purpose}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-border-marine/50 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-text-muted">Inference: {model.latencySec}s</span>
                  <span className="font-bold text-status-success">{model.confidence}% Conf</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: DARK VESSEL & ILLICIT AIS KINEMATIC ANOMALY DETECTION ENGINE */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 09 · Kinematic Forensics</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Dark Vessel & Illicit AIS Kinematic Detection
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Unmasking deliberate transponder disconnections, speed drops, course deviations, and draught tampering across the Indian maritime domain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-ocean-light/50 border border-border-marine space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-status-danger flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ocean-navy">Intentional AIS Blackouts</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tankers attempting covert ballast washing frequently disable Class-A transponders in international waters. MarineSight detects ping drops, correlates with coastal radar dark echoes, and initiates Bi-LSTM dead reckoning.
              </p>
              <div className="p-3 bg-white rounded-xl border border-border-marine text-[11px] font-mono space-y-1">
                <div className="text-text-muted">Typical Blackout Window:</div>
                <div className="text-status-danger font-bold">25 to 65 min during 01:00 - 04:00 UTC</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-ocean-light/50 border border-border-marine space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-status-warning flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ocean-navy">Discharge Deceleration Signatures</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Pumping oily slops or machinery bilge requires auxiliary generator power and reduces cruising speed from standard 13.5 knots to 3–5 knots. MarineSight flags abrupt speed-over-ground anomalies in sensitive corridors.
              </p>
              <div className="p-3 bg-white rounded-xl border border-border-marine text-[11px] font-mono space-y-1">
                <div className="text-text-muted">Kinematic Anomaly Flag:</div>
                <div className="text-amber-600 font-bold">ΔSOG &gt; 65% drop inside Origin Zone A</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-ocean-light/50 border border-border-marine space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-status-success flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ocean-navy">Bi-LSTM Gap Interpolation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                A 2-layer Bidirectional LSTM neural network trained on millions of Indian Ocean AIS historical tracks predicts the precise trajectory taken during blackout windows with sub-mile spatial precision.
              </p>
              <div className="p-3 bg-white rounded-xl border border-border-marine text-[11px] font-mono space-y-1">
                <div className="text-text-muted">Kinematic Recovery:</div>
                <div className="text-status-success font-bold">94.8% Path Reconstruction Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: HYDRODYNAMIC DRIFT & BACKWARD LAGRANGIAN HINDCAST PHYSICS */}
      <section className="py-20 px-4 sm:px-6 bg-[#071927] text-white border-b border-border-marine/30">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase font-mono">Section 10 · Ocean Physics</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              Hydrodynamic Drift & Backward Lagrangian Hindcast
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Coupling 4th-Order Runge-Kutta numerical integration with real-time ocean current velocity fields and Stokes drift physics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 bg-[#051422] rounded-2xl border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[#00E5FF]">
                  <span className="font-bold">4TH-ORDER RUNGE-KUTTA BACKWARD ADVECTION</span>
                  <span className="text-slate-400">Δt = 300s</span>
                </div>
                <div className="text-amber-300 text-sm font-bold">
                  x(t - Δt) = x(t) - (Δt / 6) · [k₁ + 2k₂ + 2k₃ + k₄]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Where velocity vector incorporates CMEMS depth-averaged geostrophic currents, CODAR HF surface Doppler velocity, and a 3.1% windage Stokes drift vector.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">MONTE CARLO ENSEMBLE</span>
                  <span className="text-white font-bold">5,000 Backward Particles</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">SPATIAL CONVERGENCE</span>
                  <span className="text-emerald-400 font-bold">1.8 NM Radius Envelope</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">WINDAGE FACTOR</span>
                  <span className="text-amber-300 font-bold">3.1% Stokes Drift Velocity</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-slate-400 text-[10px] block">HINDCAST REACH</span>
                  <span className="text-white font-bold">Up to T-72 Hours Backwards</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate("source-trace")}
                className="px-5 py-2.5 rounded-xl bg-ocean hover:bg-ocean-bright text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>Launch Reverse Hindcast Solver</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="lg:col-span-5 bg-[#0A1F33] p-5 rounded-2xl border border-white/10 space-y-3 font-mono text-xs">
              <h4 className="text-xs font-bold text-[#00E5FF] uppercase">
                Probabilistic Origin Zones
              </h4>
              <div className="p-3 bg-[#04101A] rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Zone A (95% Confidence):</span>
                  <span>14.821°N, 68.211°E</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Highest particle density convergence; exactly intersects MV Ocean Star at T-38h.
                </p>
              </div>
              <div className="p-3 bg-[#04101A] rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between text-amber-300 font-bold">
                  <span>Zone B (80% Confidence):</span>
                  <span>14.845°N, 68.240°E</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Secondary windage divergence envelope under shifting sea breeze regime.
                </p>
              </div>
              <div className="p-3 bg-[#04101A] rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between text-slate-300 font-bold">
                  <span>Zone C (50% Outer Shell):</span>
                  <span>14.890°N, 68.290°E</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Maximum dispersion boundary considering boundary layer turbulence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: INTERACTIVE HYDROCARBON WEATHERING KINETICS SIMULATOR */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 11 · Live Interactive Simulator</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Hydrocarbon Weathering Kinetics Simulator
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Adjust crude oil type, elapsed drift hours, sea temperature, and wind speed to dynamically simulate evaporation, emulsification, and surface slick decay.
            </p>
          </div>

          <div className="bg-ocean-light/40 border-2 border-ocean/20 rounded-3xl p-6 sm:p-8 shadow-marine-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Simulator Controls */}
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-sm font-bold text-ocean-navy flex items-center gap-2">
                <Sliders className="w-4 h-4 text-ocean" />
                <span>Environmental & Chemical Parameters</span>
              </h3>

              {/* Oil Type Selector */}
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">
                  Hydrocarbon Classification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "crude", label: "Heavy Crude", desc: "API 29°" },
                    { id: "light", label: "Arabian Light", desc: "API 34°" },
                    { id: "mgo", label: "Marine Gas Oil", desc: "Distillate" },
                    { id: "slops", label: "Chemical Slops", desc: "Tank Wash" }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setWeatheringOilType(t.id)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs ${
                        weatheringOilType === t.id
                          ? 'bg-ocean text-white border-ocean-deep shadow-xs'
                          : 'bg-white border-border-marine text-ocean-navy hover:bg-ocean-sky'
                      }`}
                    >
                      <span className="font-bold block">{t.label}</span>
                      <span className={`text-[10px] block ${weatheringOilType === t.id ? 'text-sky-100' : 'text-text-muted'}`}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elapsed Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ocean-navy">Elapsed Weathering Time:</span>
                  <span className="font-bold text-ocean">{weatheringHours} Hours (T+{weatheringHours}h)</span>
                </div>
                <input 
                  type="range" 
                  min="6" 
                  max="72" 
                  step="6"
                  value={weatheringHours}
                  onChange={(e) => setWeatheringHours(Number(e.target.value))}
                  className="w-full accent-ocean cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-mono">
                  <span>T+6h</span>
                  <span>T+24h</span>
                  <span>T+48h</span>
                  <span>T+72h</span>
                </div>
              </div>

              {/* Sea Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ocean-navy">Sea Surface Temperature:</span>
                  <span className="font-bold text-ocean">{weatheringTemp}°C</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="35" 
                  step="1"
                  value={weatheringTemp}
                  onChange={(e) => setWeatheringTemp(Number(e.target.value))}
                  className="w-full accent-ocean cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-mono">
                  <span>15°C (Cool Sea)</span>
                  <span>28°C (Equatorial)</span>
                  <span>35°C (Shallow Bay)</span>
                </div>
              </div>

              {/* Wind Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ocean-navy">Surface Wind Speed:</span>
                  <span className="font-bold text-ocean">{weatheringWind} Knots</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="1"
                  value={weatheringWind}
                  onChange={(e) => setWeatheringWind(Number(e.target.value))}
                  className="w-full accent-ocean cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-mono">
                  <span>5 kn (Gentle)</span>
                  <span>15 kn (Moderate)</span>
                  <span>30 kn (Rough Wave Break)</span>
                </div>
              </div>
            </div>

            {/* Live Weathering Kinetics Output */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-border-marine shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border-marine">
                  <span className="text-xs font-bold text-ocean font-mono uppercase">Calculated Mass Fraction</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-status-success px-2 py-0.5 rounded font-bold">
                    Mackay Kinetics
                  </span>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3 mt-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Evaporation Loss:</span>
                      <span className="font-bold text-ocean">{calculatedWeathering.evap}%</span>
                    </div>
                    <div className="w-full bg-ocean-light h-2 rounded-full overflow-hidden">
                      <div className="bg-ocean h-full transition-all duration-300" style={{ width: `${calculatedWeathering.evap}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Water-in-Oil Emulsification:</span>
                      <span className="font-bold text-amber-600">{calculatedWeathering.emuls}%</span>
                    </div>
                    <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
                      <div className="bg-status-warning h-full transition-all duration-300" style={{ width: `${calculatedWeathering.emuls}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Natural Subsea Dispersion:</span>
                      <span className="font-bold text-emerald-600">{calculatedWeathering.disp}%</span>
                    </div>
                    <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
                      <div className="bg-status-success h-full transition-all duration-300" style={{ width: `${calculatedWeathering.disp}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Active Surface Slick Residue:</span>
                      <span className="font-bold text-rose-600">{calculatedWeathering.surface}%</span>
                    </div>
                    <div className="w-full bg-rose-50 h-2 rounded-full overflow-hidden">
                      <div className="bg-status-danger h-full transition-all duration-300" style={{ width: `${calculatedWeathering.surface}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-ocean-light/70 rounded-xl border border-border-marine flex items-center justify-between text-xs font-mono">
                  <span className="text-text-secondary">Estimated Kinematic Viscosity:</span>
                  <span className="font-bold text-ocean-deep text-sm">{calculatedWeathering.viscosity} cP</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border-marine flex items-center justify-between">
                <span className="text-[11px] text-text-muted">Physics module: OpenDrift Coupled</span>
                <button
                  onClick={() => onNavigate("simulation")}
                  className="text-xs font-bold text-ocean hover:text-ocean-deep flex items-center gap-1"
                >
                  <span>Open Full Drift Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 12: BAYESIAN ATTRIBUTION SCORING & EVIDENCE FUSION ENGINE (MCDA) */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 12 · Attribution Analytics</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Bayesian Evidence Fusion & Vessel Ranking
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Combining spatial-temporal proximity, AIS transponder blackout gaps, speed drops, and historical Port State Control records.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Scoring Breakdown Criteria */}
            <div className="lg:col-span-5 bg-ocean-light/40 p-6 rounded-3xl border border-border-marine space-y-4">
              <h3 className="text-sm font-bold text-ocean-navy uppercase font-mono tracking-wide">
                Investigation Priority Score (IPS) Weights
              </h3>
              
              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 bg-white rounded-xl border border-border-marine flex justify-between items-center">
                  <span>Spatial-Temporal Intersection</span>
                  <span className="font-bold text-ocean">30% Weight</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-marine flex justify-between items-center">
                  <span>Kinematic AIS Anomaly / Speed Drop</span>
                  <span className="font-bold text-ocean">25% Weight</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-marine flex justify-between items-center">
                  <span>Vessel Type & Historic MARPOL Record</span>
                  <span className="font-bold text-ocean">20% Weight</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-marine flex justify-between items-center">
                  <span>Oil Type & Cargo Compatibility</span>
                  <span className="font-bold text-ocean">15% Weight</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-border-marine flex justify-between items-center">
                  <span>Weathering Age Concurrence</span>
                  <span className="font-bold text-ocean">10% Weight</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate("attribution")}
                className="w-full py-2.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Launch Attribution Classifier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Suspect Candidate Ranking Table */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-border-marine p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-marine">
                <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono">
                  Candidate Vessel Ranking · Case OF-2026-0912
                </h4>
                <span className="text-[10px] font-mono text-status-danger font-bold">
                  1 PRIME SUSPECT IDENTIFIED
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-ocean-navy text-sm">
                      <span>1. MV Ocean Star (VLCC)</span>
                      <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px]">91.4% PRIORITY</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 font-sans">
                      IMO 9418201 · Flag: India · 38 min AIS Blackout · Speed dropped from 13.2 to 3.8 kn inside Zone A
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("vessel-intel")}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    Dossier
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-ocean-light/50 border border-border-marine flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-ocean-navy text-sm">
                      <span>2. Golden Apex (Chemical Carrier)</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px]">54.2% PRIORITY</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 font-sans">
                      IMO 9821405 · Flag: Panama · 4.8 NM off Origin Zone A · Continuous transponder signal maintained
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("vessel-intel")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-border-marine hover:bg-ocean-sky text-ocean-navy text-xs font-bold"
                  >
                    Inspect
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-ocean-light/50 border border-border-marine flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-ocean-navy text-sm">
                      <span>3. Nordic Stream (Crude Tanker)</span>
                      <span className="px-2 py-0.5 rounded bg-slate-400 text-white text-[10px]">31.8% PRIORITY</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-1 font-sans">
                      IMO 9310924 · Flag: Liberia · Transit completed 14 hours prior to estimated discharge epoch
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("vessel-intel")}
                    className="px-3 py-1.5 rounded-lg bg-white border border-border-marine hover:bg-ocean-sky text-ocean-navy text-xs font-bold"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 13: COURT-ADMISSIBLE MARITIME LEGAL FRAMEWORK & PROSECUTION STANDARDS */}
      <section className="py-16 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 13 · Legal Admissibility</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Court-Admissible Legal Standards & Prosecution Compliance
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Bridging spaceborne detection and international maritime environmental law with unassailable digital forensics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-ocean font-bold">
                <Scale className="w-4 h-4 text-ocean" />
                <span>MARPOL 73/78 ANNEX I & REGULATION 34</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Calculates instantaneous discharge rates exceeding 30 liters per nautical mile and 15 ppm effluent thresholds for machinery bilge and tanker ballast tank washings in accordance with IMO standards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-ocean font-bold">
                <Shield className="w-4 h-4 text-ocean" />
                <span>UNCLOS ARTICLE 194 & 211 ENFORCEMENT</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Empowers coastal state jurisdiction across territorial waters (12 NM) and the Exclusive Economic Zone (200 NM) to detain violating flag vessels and petition international maritime tribunals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-ocean font-bold">
                <FileText className="w-4 h-4 text-ocean" />
                <span>INDIAN EVIDENCE ACT SEC 65B AUDIT</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Cryptographic SHA-256 hashing of raw Sentinel-1 SAR scenes and NMEA AIS transponder logs guarantees tamper-proof chain of custody, ensuring admissibility in National Green Tribunal proceedings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: COASTAL ECOLOGICAL SENSITIVITY INDEX (ESI) & MPA PROTECTION */}
      <section className="py-16 px-4 sm:px-6 bg-ocean-light/30 border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 14 · Ecological Sensitivity</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Indian Coastal Ecological Vulnerability Index
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Automated Environmental Sensitivity Index (ESI) mapping and marine protected area buffering along India's 7,516 km coastline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 bg-white rounded-2xl border border-border-marine space-y-3 shadow-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-ocean-navy text-sm">Western Seabed (Goa & Malvan)</span>
                <span className="text-status-danger font-mono text-[10px] px-2 py-0.5 bg-red-50 rounded">ESI Tier 1 (Critical)</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Coral reefs, mangrove estuaries, and tourism coastline. 4,200m offshore containment boom pre-staged with Fast Patrol Vessel ICGS Varaha.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean">
                Buffer Zone: 25 NM Radius
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-border-marine space-y-3 shadow-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-ocean-navy text-sm">Eastern Seabed (Gahirmatha & Vizag)</span>
                <span className="text-status-warning font-mono text-[10px] px-2 py-0.5 bg-amber-50 rounded">ESI Tier 2 (High)</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                Olive Ridley sea turtle mass nesting grounds and mangrove sanctuaries. High-capacity disc skimmers deployed to deflect northwestward drift.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean">
                Buffer Zone: 18 NM Radius
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-border-marine space-y-3 shadow-xs">
              <div className="flex justify-between items-center font-bold">
                <span className="text-ocean-navy text-sm">Southern Gulf of Mannar Biosphere</span>
                <span className="text-status-danger font-mono text-[10px] px-2 py-0.5 bg-red-50 rounded">ESI Tier 1 (Critical)</span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                UNESCO Biosphere Reserve with endemic Dugong habitats and fragile fringing coral reefs. Specialized sorbent booms and chemical dispersant ban in effect.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean">
                Buffer Zone: 30 NM Zero-Discharge
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 15: EMERGENCY RESPONSE TACTICAL OPTIMIZATION & ASSET DEPLOYMENT */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 15 · Tactical Containment</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Emergency Response Optimization & Asset Staging
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Automated resource allocation for Indian Coast Guard Fast Patrol Vessels, containment boom sweeps, and aerial dispersants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-3">
              <div className="w-9 h-9 rounded-xl bg-ocean-sky text-ocean flex items-center justify-center font-bold">
                <Ship className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Coast Guard Interceptors</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Fast Patrol Vessels (FPV) dispatched along intercept headings to apprehend violators before leaving Indian EEZ boundaries.
              </p>
              <span className="text-[10px] font-mono text-ocean font-bold block">32 Knot Intercept Speed</span>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-status-warning flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Containment Boom Sweeps</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Automated J-Sweep and U-Sweep configuration calculating optimum apex angle to avoid hydrocarbon vortex entrainment.
              </p>
              <span className="text-[10px] font-mono text-status-warning font-bold block">2,400m Staged at Karwar</span>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-status-success flex items-center justify-center font-bold">
                <Droplet className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Dynamic Skimmer Allocation</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Brush and disc oleophilic skimming units matched with oil viscosity profiles to maximize cubic meter per hour recovery.
              </p>
              <span className="text-[10px] font-mono text-status-success font-bold block">180 m³/h Recovery Rate</span>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Aerial Dispersant Sorties</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Dornier-228 aircraft spray path calculations conforming to NEBA (Net Environmental Benefit Analysis) toxicity guidelines.
              </p>
              <span className="text-[10px] font-mono text-purple-600 font-bold block">5 NM Offshore Threshold</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate("response-plan")}
              className="px-6 py-3 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-sm transition-all inline-flex items-center gap-2"
            >
              <span>Launch Tactical Response Plan Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 16: AUTOMATED FORENSIC DOSSIER & LEGAL AFFIDAVIT GENERATOR PREVIEW */}
      <section className="py-20 px-4 sm:px-6 bg-ocean-light/30 border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 16 · Court Evidence</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Automated Forensic Affidavit Dossier Preview
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Generated court-ready digital affidavit compiled for Coast Guard Admiralty filings and National Green Tribunal proceedings.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white border-2 border-border-marine rounded-3xl p-6 sm:p-8 shadow-marine-md font-mono text-xs space-y-5">
            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b border-border-marine pb-4 flex-wrap gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-text-muted">REPUBLIC OF INDIA · MARITIME ENVIRONMENTAL ENFORCEMENT</span>
                <h4 className="text-sm font-black text-ocean-navy">
                  FORENSIC OIL SPILL INCIDENT AFFIDAVIT · CERTIFICATE SEC 65B
                </h4>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-ocean-light text-ocean-deep font-bold text-[10px] border border-ocean/20">
                  SHA-256 VERIFIED
                </span>
              </div>
            </div>

            {/* Dossier Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
              <div className="p-3 bg-ocean-light/40 rounded-xl space-y-1.5">
                <div className="text-text-muted">Incident Reference:</div>
                <div className="font-bold text-ocean-navy">OF-2026-0912 (Arabian Sea Corridor)</div>
                <div className="text-text-muted">Detection Time:</div>
                <div className="text-ocean-deep">05 SEP 2026, 14:32:10 UTC</div>
              </div>

              <div className="p-3 bg-ocean-light/40 rounded-xl space-y-1.5">
                <div className="text-text-muted">Primary Suspect Vessel:</div>
                <div className="font-bold text-status-danger">MV Ocean Star (VLCC, IMO 9418201)</div>
                <div className="text-text-muted">Attribution Priority Score:</div>
                <div className="text-status-success font-bold">91.4% (Tier-1 Liability)</div>
              </div>
            </div>

            <div className="p-4 bg-[#0B2538] text-white rounded-xl space-y-2 text-[11px]">
              <div className="flex justify-between text-[#00E5FF] font-bold">
                <span>CHAIN OF CUSTODY AUDIT LOG</span>
                <span>MERKLE ROOT HASH</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Sentinel-1 SAR scene S1A_IW_GRDH_1SDV_20260905 and DGLL VTS transponder packet stream verified against root hash <strong className="text-white">e8f12d847c0b891a4e23901bce49a1</strong>.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
              <span className="text-[11px] text-text-muted">
                Digital Sign-Off: <strong>Dr. E. Vance (Lead Maritime Forensics Analyst)</strong>
              </span>
              <button
                onClick={() => onNavigate("report-system")}
                className="px-4 py-2 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Official PDF/A Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 17: PLATFORM TECHNOLOGY STACK & HIGH-PERFORMANCE ARCHITECTURE */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 17 · Engineering Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Platform Technology Stack & Performance
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Engineered with modern reactive edge architecture, high-performance geospatial engines, and distributed ML inference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-2 text-xs">
              <div className="font-bold text-ocean font-mono text-[10px] uppercase">Frontend & GIS UI</div>
              <h4 className="font-bold text-ocean-navy text-sm">React 18 & Vite</h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                High-refresh GIS mapping with Tailwind CSS, Lucide icons, Canvas 2D overlay rendering, and sub-16ms interactive responsiveness.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-2 text-xs">
              <div className="font-bold text-ocean font-mono text-[10px] uppercase">Deep Learning</div>
              <h4 className="font-bold text-ocean-navy text-sm">PyTorch & TensorRT</h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Attention U-Net slick segmenter, ResNet-50 lookalike filter, and 2-layer Bi-LSTM trajectory gap interpolator.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-2 text-xs">
              <div className="font-bold text-ocean font-mono text-[10px] uppercase">Ocean Solvers</div>
              <h4 className="font-bold text-ocean-navy text-sm">OpenDrift & GNOME</h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                4th-Order Runge-Kutta numerical advection with CMEMS 0.083° oceanic velocity vectors and NOAA GFS winds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-2 text-xs">
              <div className="font-bold text-ocean font-mono text-[10px] uppercase">Geospatial Processing</div>
              <h4 className="font-bold text-ocean-navy text-sm">GDAL & GeoTIFF</h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                SAR radiometry calibration, speckle Lee filtering, H3 spatial hex-bin indexing, and STAC API satellite querying.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-ocean-light/40 border border-border-marine space-y-2 text-xs">
              <div className="font-bold text-ocean font-mono text-[10px] uppercase">Security & Integrity</div>
              <h4 className="font-bold text-ocean-navy text-sm">SHA-256 Merkle</h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                Cryptographic immutable audit chain conforming to Indian Evidence Act Section 65B electronic record standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 18: OPERATIONAL CASE STUDIES & HISTORICAL BENCHMARK VALIDATION */}
      <section className="py-20 px-4 sm:px-6 bg-ocean-light/20 border-b border-border-marine">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 18 · Benchmark Validation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Operational Case Studies & Real-World Validation
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Validating platform accuracy against historical maritime pollution incidents and controlled satellite calibration passes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-border-marine shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ocean font-bold">CASE STUDY 01</span>
                <span className="text-status-success font-bold">98.4% MATCH</span>
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Ennore Port Bunker Fuel Incident</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Simulated against historical Chennai collision discharge. MarineSight forward drift solver forecasted shoreline landfall at Marina Beach within 42 minutes of actual reported beaching.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean-deep">
                Lagrangian Drift Concurrence: 98.4%
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border-marine shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ocean font-bold">CASE STUDY 02</span>
                <span className="text-status-success font-bold">14 MIN ATTRIBUTION</span>
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Bombay High Offshore De-sludging</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Illegal night tank-washing detected in offshore Mumbai oilfields. The Bi-LSTM interpolator unmasked a 42-minute AIS blackout by matching dark coastal radar echoes.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean-deep">
                Suspect Identified in 14.2 Minutes
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border-marine shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-ocean font-bold">CASE STUDY 03</span>
                <span className="text-status-success font-bold">0 FALSE ALARMS</span>
              </div>
              <h4 className="text-sm font-bold text-ocean-navy">Six Degree Channel Chokepoint</h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Massive 19.8 km² slick in the Great Nicobar international lane. The multi-polarization ratio successfully rejected adjacent low-wind calm water and biogenic algal bloom lookalikes.
              </p>
              <div className="pt-2 border-t border-border-marine/50 text-[10px] font-mono text-ocean-deep">
                100% Biogenic Lookalike Rejection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 19: COMMAND FAQ & TECHNICAL KNOWLEDGE BASE (INTERACTIVE ACCORDION) */}
      <section className="py-20 px-4 sm:px-6 bg-white border-b border-border-marine">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-ocean tracking-wider uppercase font-mono">Section 19 · Technical Knowledge Base</span>
            <h2 className="text-2xl sm:text-3xl font-black text-ocean-navy mt-1.5">
              Frequently Asked Technical Questions
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-2">
              Everything you need to know about MarineSight satellite resolution, hydrodynamic physics, and legal evidence standards.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-border-marine bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-ocean-light/30 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-ocean-navy">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-ocean flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-text-secondary leading-relaxed border-t border-border-marine/50 pt-3 bg-ocean-light/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 20: COMMAND OPERATIONS DISPATCH & INSTITUTIONAL FOOTER */}
      <footer className="py-16 px-4 sm:px-6 bg-[#071927] text-white text-xs border-t border-border-marine/30">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Emergency Alert Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-ocean-deep/90 via-ocean/80 to-[#071927] border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                OPERATIONAL COMMAND READINESS
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Initiate National Maritime Spill Forensic Investigation
              </h3>
              <p className="text-xs text-slate-200">
                Direct integration with DG Shipping, Indian Coast Guard, INCOIS, and Copernicus Sentinel Hub.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("workspace")}
                className="px-5 py-3 rounded-xl bg-white text-ocean-navy hover:bg-ocean-sky text-xs font-bold shadow-md transition-all whitespace-nowrap"
              >
                Start Investigation
              </button>
              <button
                onClick={() => onNavigate("live-monitor")}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all whitespace-nowrap"
              >
                Live Map
              </button>
            </div>
          </div>

          {/* Top Heartbeat Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs font-mono">
            <MarineSightLogo variant="dark" />

            {/* System Status Indicators */}
            <div className="flex items-center gap-3 flex-wrap text-[10px]">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ESA COPERNICUS: CONNECTED</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>COASTAL RADAR VTS: 48 NM ACTIVE</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>AIS CH-16/70 DSC: 156.8 MHz RX</span>
              </span>
            </div>
          </div>

          {/* Sitemap Columns for All 15 Operational Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[11px]">
            <div>
              <h5 className="font-bold text-white uppercase mb-2 font-mono text-ocean-bright">Surveillance Hub</h5>
              <ul className="space-y-1.5 text-white/70">
                <li><button onClick={() => onNavigate("landing")} className="hover:text-white">01 · Landing Operations Hub</button></li>
                <li><button onClick={() => onNavigate("command-center")} className="hover:text-white">02 · Strategic Command Center</button></li>
                <li><button onClick={() => onNavigate("live-monitor")} className="hover:text-white">03 · Live Tactical GIS Monitor</button></li>
                <li><button onClick={() => onNavigate("incidents")} className="hover:text-white">04 · National Incidents Registry</button></li>
                <li><button onClick={() => onNavigate("workspace")} className="hover:text-white">05 · Investigation Workbench</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2 font-mono text-ocean-bright">Sensor & Vision</h5>
              <ul className="space-y-1.5 text-white/70">
                <li><button onClick={() => onNavigate("satellite")} className="hover:text-white">06 · Satellite SAR Ingest</button></li>
                <li><button onClick={() => onNavigate("characterize")} className="hover:text-white">07 · Spill Characterization</button></li>
                <li><button onClick={() => onNavigate("source-trace")} className="hover:text-white">09 · Backward Hindcast</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2 font-mono text-ocean-bright">Vessel Intelligence</h5>
              <ul className="space-y-1.5 text-white/70">
                <li><button onClick={() => onNavigate("vessel-intel")} className="hover:text-white">10 · Vessel Intel Dossier</button></li>
                <li><button onClick={() => onNavigate("trajectory")} className="hover:text-white">11 · Trajectory Bi-LSTM</button></li>
                <li><button onClick={() => onNavigate("attribution")} className="hover:text-white">12 · Forensic Attribution</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase mb-2 font-mono text-ocean-bright">Risk & Legal</h5>
              <ul className="space-y-1.5 text-white/70">
                <li><button onClick={() => onNavigate("simulation")} className="hover:text-white">08 · Drift Simulation</button></li>
                <li><button onClick={() => onNavigate("evidence-risk")} className="hover:text-white">13 · Legal Evidence Risk</button></li>
                <li><button onClick={() => onNavigate("response-plan")} className="hover:text-white">14 · Containment Response</button></li>
                <li><button onClick={() => onNavigate("report-system")} className="hover:text-white">15 · Dossier Generator</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-white/50 text-[10px] gap-2">
            <p>© 2026 MarineSight Platform · Smart India Hackathon (SIH 2026) Maritime Environmental Intelligence.</p>
            <p>Compatible with Sentinel-1/2 Copernicus, DGLL Coastal AIS, and NOAA GNOME.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
