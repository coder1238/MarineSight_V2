import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Wind, 
  Waves, 
  Thermometer, 
  Activity, 
  Compass, 
  ArrowRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Sliders,
  Maximize2,
  Sparkles,
  Globe,
  Satellite,
  Info,
  ChevronDown,
  ShieldAlert,
  Flame,
  Search,
  Eye,
  Crosshair,
  Printer,
  Grid
} from 'lucide-react';
import GISMapMock from '../components/gis/GISMapMock';
import { useIncident } from '../context/IncidentContext';
import { INCIDENTS_REGISTRY } from '../data/mockData';

// Modular Feature Components
import BonnVolumetricEstimator from '../components/characterize/BonnVolumetricEstimator';
import TransectProfileViewer from '../components/characterize/TransectProfileViewer';
import GlcmDeepInspector from '../components/characterize/GlcmDeepInspector';
import WeatheringKineticsEngine from '../components/characterize/WeatheringKineticsEngine';
import PolarimetryLookalikePanel from '../components/characterize/PolarimetryLookalikePanel';
import HydrocarbonFingerprinter from '../components/characterize/HydrocarbonFingerprinter';
import VectorShearCompassHUD from '../components/characterize/VectorShearCompassHUD';
import RecoveryFeasibilityTool from '../components/characterize/RecoveryFeasibilityTool';
import CharacterizeDossierModal from '../components/characterize/CharacterizeDossierModal';

export default function Page07Characterize({ onNavigate }) {
  const { activeIncident, selectIncident, allIncidents } = useIncident();
  const caseData = activeIncident;

  // Active Scientific Tab: "radar-glcm", "weathering", "hydrocarbon-lookalike", "sensor-vector", "recovery-forensic"
  const [activeTab, setActiveTab] = useState("radar-glcm");

  // Multi-Constellation Satellite Sensor Switcher: "s1-cband", "alos-lband", "terrasar-xband", "s2-msi"
  const [selectedSensor, setSelectedSensor] = useState("s1-cband");

  // Morphology Comparison Mode on Viewport: "primary", "dispersion", "core-heatmap"
  const [viewportMode, setViewportMode] = useState("primary");

  // Interactive Caliper & Buffer toggles
  const [showContainmentBuffer, setShowContainmentBuffer] = useState(false);
  const [showFractalGrid, setShowFractalGrid] = useState(false);

  // Radar Spider Chart Dynamic Sensitivity Factors
  const [radarSensitivity, setRadarSensitivity] = useState(1.0);
  const [radarBenchmark, setRadarBenchmark] = useState("observed"); // "observed", "heavy-crude", "biogenic"

  // Forensic Dossier Modal
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Sensor specifications dictionary
  const SENSORS = {
    "s1-cband": {
      name: "Sentinel-1 C-Band SAR",
      frequency: "5.405 GHz (C-Band)",
      polarization: "VV + VH Dual-Pol",
      resolution: "10m × 10m (IW GRDH)",
      contrastDb: "-6.2 dB",
      advantage: "High sensitivity to short capillary wave damping; continuous global coverage."
    },
    "alos-lband": {
      name: "ALOS-2 PALSAR-2 L-Band",
      frequency: "1.236 GHz (L-Band)",
      polarization: "Quad-Pol (HH+HV+VH+VV)",
      resolution: "6m × 6m (High-Res Strip)",
      contrastDb: "-4.1 dB",
      advantage: "Penetrates ocean spray; ideal for thick weathered emulsion core mapping."
    },
    "terrasar-xband": {
      name: "TerraSAR-X X-Band SAR",
      frequency: "9.65 GHz (X-Band)",
      polarization: "VV Single-Pol",
      resolution: "3m × 3m (StripMap)",
      contrastDb: "-8.5 dB",
      advantage: "Ultra-crisp boundary resolution for fractal complexity and perimeter tortuosity."
    },
    "s2-msi": {
      name: "Sentinel-2 MSI Optical Slick Index",
      frequency: "SWIR / NIR / Red Bands",
      polarization: "Optical Multispectral",
      resolution: "10m (B2, B3, B4, B8)",
      contrastDb: "+0.28 Index",
      advantage: "Discriminates thick emulsion from thin rainbow sheen via solar glitter reflection."
    }
  };

  // Sub-Slick Patch Fragmentation & Core Cluster Decomposition
  const subPatches = useMemo(() => {
    const totalArea = caseData.spillAreaKm2 || 14.7;
    const baseLat = caseData.coordinates?.lat || 14.8214;
    const baseLng = caseData.coordinates?.lng || 68.2108;

    return [
      {
        id: "PATCH-C1",
        label: "Primary Emulsion Core",
        type: "Continuous Heavy Emulsion",
        areaKm2: +(totalArea * 0.38).toFixed(2),
        fractionPct: 38,
        bonnCode: "Code 5",
        thicknessUm: "320 µm",
        coords: `${(baseLat + 0.012).toFixed(3)}°N, ${(baseLng + 0.015).toFixed(3)}°E`,
        priority: "CRITICAL RECOVERY",
        priorityColor: "bg-red-100 text-status-danger border-red-200"
      },
      {
        id: "PATCH-C2",
        label: "Secondary Viscous Patch",
        type: "Discontinuous True Oil",
        areaKm2: +(totalArea * 0.24).toFixed(2),
        fractionPct: 24,
        bonnCode: "Code 4",
        thicknessUm: "120 µm",
        coords: `${(baseLat - 0.008).toFixed(3)}°N, ${(baseLng - 0.011).toFixed(3)}°E`,
        priority: "HIGH PRIORITY",
        priorityColor: "bg-amber-100 text-amber-800 border-amber-200"
      },
      {
        id: "PATCH-S1",
        label: "Leading Sheen Front",
        type: "Rainbow Interference Sheen",
        areaKm2: +(totalArea * 0.22).toFixed(2),
        fractionPct: 22,
        bonnCode: "Code 2",
        thicknessUm: "2.5 µm",
        coords: `${(baseLat + 0.024).toFixed(3)}°N, ${(baseLng + 0.038).toFixed(3)}°E`,
        priority: "MONITORING",
        priorityColor: "bg-sky-100 text-ocean-deep border-sky-200"
      },
      {
        id: "PATCH-S2",
        label: "Trailing Feather Sheen",
        type: "Silvery Sheen (Evaporating)",
        areaKm2: +(totalArea * 0.16).toFixed(2),
        fractionPct: 16,
        bonnCode: "Code 1",
        thicknessUm: "0.15 µm",
        coords: `${(baseLat - 0.021).toFixed(3)}°N, ${(baseLng - 0.025).toFixed(3)}°E`,
        priority: "NATURAL DISPERSION",
        priorityColor: "bg-slate-100 text-slate-700 border-slate-200"
      }
    ];
  }, [caseData]);

  // Dynamic Radar Chart Coordinates (6 dimensions)
  const radarData = useMemo(() => {
    // 6 Dimensions: Contrast, Elongation, Complexity, Homogeneity, Fragmentation, Polarimetric Dampening
    let base = [92, 88, 84, 78, 65, 86];

    if (radarBenchmark === "heavy-crude") {
      base = [96, 75, 70, 85, 45, 92];
    } else if (radarBenchmark === "biogenic") {
      base = [45, 60, 42, 90, 82, 35];
    }

    const scaled = base.map(val => Math.min(100, Math.max(10, Math.round(val * radarSensitivity))));
    
    // Convert 6 values to polygon points on a 240x220 canvas, center (120, 110), maxRadius 85
    const cx = 120;
    const cy = 110;
    const maxR = 80;

    const points = scaled.map((val, idx) => {
      const angle = (idx * 60 - 90) * (Math.PI / 180);
      const r = (val / 100) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    return {
      points,
      values: scaled
    };
  }, [radarBenchmark, radarSensitivity]);

  // Client-Side GeoJSON Exporter
  const handleExportGeoJSON = () => {
    const geojson = {
      type: "FeatureCollection",
      metadata: {
        incidentId: caseData.incidentId,
        region: caseData.region,
        generatedAt: new Date().toISOString(),
        classification: "IMO MARPOL 73/78 Annex I Forensic Profile",
        analyst: caseData.assignedAnalyst
      },
      features: [
        {
          type: "Feature",
          id: `slick-macro-${caseData.incidentId}`,
          properties: {
            category: "Macro Morphological Slick Boundary",
            areaKm2: caseData.spillAreaKm2,
            perimeterKm: caseData.spillPerimeterKm,
            orientationAzimuthDeg: caseData.orientationDeg,
            aspectRatio: `${caseData.lengthKm}:${caseData.widthKm}`,
            fractalDimension: 1.34,
            detectionConfidence: caseData.detectionConfidence,
            primaryBonnCode: "Code 5 (Continuous True Oil)"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              (caseData.geoCoordinates || [
                { lat: 14.848, lng: 68.175 },
                { lat: 14.862, lng: 68.205 },
                { lat: 14.858, lng: 68.232 },
                { lat: 14.841, lng: 68.254 },
                { lat: 14.815, lng: 68.249 },
                { lat: 14.795, lng: 68.236 },
                { lat: 14.801, lng: 68.205 },
                { lat: 14.809, lng: 68.188 },
                { lat: 14.829, lng: 68.171 }
              ]).map(pt => [pt.lng, pt.lat])
            ]
          }
        },
        ...subPatches.map(patch => ({
          type: "Feature",
          id: patch.id,
          properties: {
            category: "Decomposed Sub-Patch Cluster",
            name: patch.label,
            type: patch.type,
            areaKm2: patch.areaKm2,
            bonnCode: patch.bonnCode,
            thickness: patch.thicknessUm,
            priority: patch.priority
          },
          geometry: {
            type: "Point",
            coordinates: [caseData.coordinates?.lng || 68.2108, caseData.coordinates?.lat || 14.8214]
          }
        }))
      ]
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morphology_${caseData.incidentId}_geojson.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Client-Side Scientific CSV Exporter
  const handleExportCSV = () => {
    const headers = ["Category", "Parameter", "Measured Value", "Unit", "Methodology / Standard"];
    const rows = [
      ["Metadata", "Incident Reference", caseData.incidentId, "", "INCOIS Registry"],
      ["Metadata", "Geographic Zone", caseData.region, "", "Indian EEZ"],
      ["Metadata", "Detection Timestamp", caseData.detectionTimeUTC, "UTC", "Sentinel-1 SAR Overpass"],
      ["Geometry", "Slick Area", caseData.spillAreaKm2, "km²", "SAR C-Band Segmentation"],
      ["Geometry", "Slick Perimeter", caseData.spillPerimeterKm, "km", "OpenCV Polygonal Approximation"],
      ["Geometry", "Major Axis Length", caseData.lengthKm, "km", "PCA Principal Direction"],
      ["Geometry", "Minor Axis Width", caseData.widthKm, "km", "Orthogonal Extent"],
      ["Geometry", "Morphological Orientation", caseData.orientationDeg, "Degrees True", "Azimuth Decomposition"],
      ["Geometry", "Compactness Factor", caseData.compactness, "Ratio", "Isoperimetric Quotient (4πA/P²)"],
      ["Geometry", "Fractal Dimension (D)", "1.34", "Dimensionless", "Richardson Box-Counting Plot"],
      ["Texture", "GLCM Contrast", "0.34", "Index", "Haralick Spatial Dependency Matrix"],
      ["Texture", "GLCM Homogeneity", "0.81", "IDM", "Inverse Difference Moment"],
      ["Texture", "GLCM Entropy", "2.18", "Shannons", "Joint Spatial Probability"],
      ["Texture", "Dual-Pol Damping (Δσ⁰_VV)", "-6.2", "dB", "Capillary-Gravity Wave Suppression"],
      ["Volumetrics", "Bonn Code 1 Sheen Area", (caseData.spillAreaKm2 * 0.35).toFixed(2), "km²", "BAOAC Color Index"],
      ["Volumetrics", "Bonn Code 4+5 Heavy Core", (caseData.spillAreaKm2 * 0.25).toFixed(2), "km²", "Thick Viscous Emulsion"],
      ["Chemical", "Likely Crude Origin", "Arab Medium Crude", "Grade", "GC-MS Biomarker Pr/Ph Matching"],
      ["Chemical", "API Gravity", "24.8", "Degrees API", "Hydrometer Density Correlation"],
      ["MetOcean", "Wind Velocity", caseData.environment?.windSpeedKn, "knots", "ECMWF ERA5 Atmospheric Model"],
      ["MetOcean", "Surface Current", caseData.environment?.currentSpeedMs, "m/s", "CMEMS In-Situ Doppler Radar"],
      ["MetOcean", "Significant Wave Height (Hs)", caseData.environment?.waveHeightM, "meters", "WaveWatch III Marine Forecast"],
      ["MetOcean", "Sea Surface Temp", caseData.environment?.seaSurfaceTempC, "°C", "NOAA High-Res OISST"]
    ];

    const csvContent = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morphology_dataset_${caseData.incidentId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Top Header & Regional Incident Selector Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-border-marine">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Oil Spill Characterization & Morphology Studio
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold font-mono">
              ● STATUTORY PROFILE VERIFIED
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Quantitative morphology, Bonn Agreement volumetric quantification, GLCM texture decomposition, and coupled weathering forensics.
          </p>
        </div>

        {/* Action Controls & Region Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Incident Case Dropdown Switcher */}
          <div className="relative">
            <select
              value={caseData.incidentId}
              onChange={(e) => selectIncident(e.target.value)}
              aria-label="Select Maritime Incident Region"
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold font-mono shadow-marine-sm cursor-pointer transition-colors focus:ring-2 focus:ring-ocean focus:outline-none"
            >
              {allIncidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.flagEmoji} {inc.regionShort} ({inc.id})
                </option>
              ))}
            </select>
          </div>

          {/* Export GeoJSON Button */}
          <button
            onClick={handleExportGeoJSON}
            title="Export GeoJSON FeatureCollection with Bonn Code geometry"
            className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-ocean" />
            <span className="hidden sm:inline">GeoJSON</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export comprehensive scientific CSV metrics"
            className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-ocean" />
            <span className="hidden sm:inline">CSV Profile</span>
          </button>

          {/* View Forensic Dossier Modal Button */}
          <button
            onClick={() => setShowDossierModal(true)}
            className="px-3 py-1.5 rounded-lg border border-ocean/30 bg-ocean-light hover:bg-ocean-sky text-ocean-deep text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-ocean" />
            <span>Forensic Dossier</span>
          </button>

          {/* Run Drift Simulation Button */}
          <button
            onClick={() => onNavigate("simulation")}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold shadow-marine-md flex items-center gap-1.5 transition-all"
          >
            <span>Run Drift Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 6 Geometric Metrics Strip with Interactive Tooltips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>MEASURED AREA</span>
            <span className="text-[9px] text-ocean font-bold">A</span>
          </div>
          <span className="text-lg font-extrabold text-ocean-deep">{caseData.spillAreaKm2} km²</span>
          <span className="text-[9px] text-text-muted block">±0.4 km² uncertainty</span>
        </div>

        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>PERIMETER</span>
            <span className="text-[9px] text-ocean font-bold">P</span>
          </div>
          <span className="text-lg font-extrabold text-ocean-deep">{caseData.spillPerimeterKm} km</span>
          <span className="text-[9px] text-text-muted block">Fractal D: 1.34</span>
        </div>

        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>LENGTH / WIDTH</span>
            <span className="text-[9px] text-ocean font-bold">L/W</span>
          </div>
          <span className="text-lg font-extrabold text-text-primary">{caseData.lengthKm} / {caseData.widthKm} km</span>
          <span className="text-[9px] text-text-muted block">Aspect: 4.0:1 (Elongated)</span>
        </div>

        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>ORIENTATION</span>
            <span className="text-[9px] text-ocean font-bold">θ</span>
          </div>
          <span className="text-lg font-extrabold text-ocean">{caseData.orientationDeg}° Azimuth</span>
          <span className="text-[9px] text-text-muted block">Aligned with current shear</span>
        </div>

        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>ESTIMATED AGE</span>
            <span className="text-[9px] text-status-warning font-bold">Δt</span>
          </div>
          <span className="text-lg font-extrabold text-status-warning">{caseData.estimatedAgeHours}h</span>
          <span className="text-[9px] text-text-muted block">Weathering: Emulsified</span>
        </div>

        <div className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm font-mono hover:border-ocean/60 transition-colors">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>CONFIDENCE</span>
            <span className="text-[9px] text-status-success font-bold">p</span>
          </div>
          <span className="text-lg font-extrabold text-status-success">{caseData.detectionConfidence}%</span>
          <span className="text-[9px] text-text-muted block">Mineral Crude Oil</span>
        </div>
      </div>

      {/* Main Grid: Spatial Viewport & Tools (Left 6.5 cols) + Scientific Analytics Studio (Right 5.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Spatial GIS Viewport, Spatial Ruler, Bonn Volume, Transect, Sub-Patches */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Spatial GIS Viewport Container */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-ocean animate-ping" />
                <h2 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
                  Morphological Boundary GIS Viewport · {caseData.region}
                </h2>
              </div>
              <span className="text-[10px] font-mono text-ocean font-bold">
                {caseData.coordinates?.display || "14.82°N, 68.21°E"}
              </span>
            </div>

            {/* Viewport Action Controls (Buffer, Grid, Evolution Toggle) */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 bg-ocean-light p-0.5 rounded-lg border border-border-marine">
                <button
                  onClick={() => setViewportMode("primary")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    viewportMode === "primary" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
                  }`}
                >
                  Primary SAR
                </button>
                <button
                  onClick={() => setViewportMode("dispersion")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    viewportMode === "dispersion" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
                  }`}
                >
                  Dispersion Envelope
                </button>
                <button
                  onClick={() => setViewportMode("core-heatmap")}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    viewportMode === "core-heatmap" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
                  }`}
                >
                  Core Heatmap
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowContainmentBuffer(!showContainmentBuffer)}
                  className={`px-2 py-1 rounded text-[10px] border flex items-center gap-1 transition-colors ${
                    showContainmentBuffer 
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold' 
                      : 'bg-white hover:bg-ocean-light text-text-secondary border-border-marine'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>500m Buffer Envelope</span>
                </button>

                <button
                  onClick={() => setShowFractalGrid(!showFractalGrid)}
                  className={`px-2 py-1 rounded text-[10px] border flex items-center gap-1 transition-colors ${
                    showFractalGrid 
                      ? 'bg-ocean text-white border-ocean font-bold' 
                      : 'bg-white hover:bg-ocean-light text-text-secondary border-border-marine'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  <span>Fractal Grid (100m)</span>
                </button>
              </div>
            </div>

            {/* Interactive GIS Map Viewport */}
            <div className="relative rounded-xl overflow-hidden border border-border-marine">
              <GISMapMock 
                mode="characterize" 
                caseData={caseData}
                height="h-[380px]"
              />

              {/* Viewport Overlay HUD Badge */}
              <div className="absolute top-2 left-2 z-10 bg-ocean-navy/85 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-[10px] font-mono border border-white/10 space-y-0.5 pointer-events-none">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <Crosshair className="w-3 h-3" />
                  <span>CALIPER HUD ACTIVE</span>
                </div>
                <div>Aspect Ratio: 4.0:1 · Orientation: {caseData.orientationDeg}°</div>
                {showContainmentBuffer && <div className="text-amber-400">● 500m Containment Buffer Enabled</div>}
                {showFractalGrid && <div className="text-emerald-400">● Richardson Grid ε = 100m</div>}
              </div>
            </div>

            {/* Compactness & Core Fraction Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1">
              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-text-muted text-[9px] block uppercase">Compactness Factor</span>
                <span className="font-extrabold text-ocean-navy text-sm">{caseData.compactness}</span>
                <span className="text-[9px] text-text-secondary block">Elongated Shear Pattern</span>
              </div>
              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-text-muted text-[9px] block uppercase">Thick Core Fraction</span>
                <span className="font-extrabold text-status-danger text-sm">38% Heavy Sheen</span>
                <span className="text-[9px] text-text-secondary block">5.58 km² Dense Emulsion</span>
              </div>
              <div className="bg-ocean-light p-2.5 rounded-xl border border-border-marine">
                <span className="text-text-muted text-[9px] block uppercase">Tail Dispersion</span>
                <span className="font-extrabold text-status-warning text-sm">62% Thin Film</span>
                <span className="text-[9px] text-text-secondary block">Spreading Sheen Tail</span>
              </div>
            </div>
          </div>

          {/* Bonn Agreement BAOAC Volumetric Profiler */}
          <BonnVolumetricEstimator 
            totalAreaKm2={caseData.spillAreaKm2} 
            oilDensityKgM3={890}
          />

          {/* Morphological Transect Cross-Section Profiler */}
          <TransectProfileViewer 
            lengthKm={caseData.lengthKm}
            widthKm={caseData.widthKm}
            centerCoords={caseData.coordinates?.display}
          />

          {/* Sub-Slick Patch Fragmentation & Core Cluster Decomposition */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-ocean" />
                <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
                  Morphological Patch Decomposition & Core Cluster Separation
                </h3>
              </div>
              <span className="text-[10px] font-mono text-ocean font-semibold">
                4 Identified Sub-Patches
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-ocean-light text-ocean-navy border-b border-border-marine text-[10px] uppercase">
                    <th className="p-2">Patch ID</th>
                    <th className="p-2">Morphological Class</th>
                    <th className="p-2">Area</th>
                    <th className="p-2">Bonn Code</th>
                    <th className="p-2">Thickness</th>
                    <th className="p-2">Recovery Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-marine/60">
                  {subPatches.map(patch => (
                    <tr key={patch.id} className="hover:bg-ocean-light/40 transition-colors">
                      <td className="p-2 font-bold text-ocean-navy">{patch.id}</td>
                      <td className="p-2 font-semibold text-text-primary">{patch.label}</td>
                      <td className="p-2 text-ocean-deep font-bold">{patch.areaKm2} km² ({patch.fractionPct}%)</td>
                      <td className="p-2">
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 border border-slate-300 font-bold">
                          {patch.bonnCode}
                        </span>
                      </td>
                      <td className="p-2 text-text-primary">{patch.thicknessUm}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${patch.priorityColor}`}>
                          {patch.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Tabbed Scientific Forensics & Environmental Studio (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Scientific Tab Navigation Bar */}
          <div className="bg-white border border-border-marine rounded-2xl p-2 shadow-marine-sm">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 font-mono text-[10px]">
              <button
                onClick={() => setActiveTab("radar-glcm")}
                className={`p-2 rounded-xl text-center font-bold transition-all ${
                  activeTab === "radar-glcm" 
                    ? "bg-ocean text-white shadow-marine-sm" 
                    : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine/50"
                }`}
              >
                SAR & Texture
              </button>
              <button
                onClick={() => setActiveTab("weathering")}
                className={`p-2 rounded-xl text-center font-bold transition-all ${
                  activeTab === "weathering" 
                    ? "bg-ocean text-white shadow-marine-sm" 
                    : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine/50"
                }`}
              >
                Weathering
              </button>
              <button
                onClick={() => setActiveTab("hydrocarbon-lookalike")}
                className={`p-2 rounded-xl text-center font-bold transition-all ${
                  activeTab === "hydrocarbon-lookalike" 
                    ? "bg-ocean text-white shadow-marine-sm" 
                    : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine/50"
                }`}
              >
                Fingerprint
              </button>
              <button
                onClick={() => setActiveTab("sensor-vector")}
                className={`p-2 rounded-xl text-center font-bold transition-all ${
                  activeTab === "sensor-vector" 
                    ? "bg-ocean text-white shadow-marine-sm" 
                    : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine/50"
                }`}
              >
                Vector & Sensors
              </button>
              <button
                onClick={() => setActiveTab("recovery-forensic")}
                className={`p-2 rounded-xl text-center font-bold transition-all ${
                  activeTab === "recovery-forensic" 
                    ? "bg-ocean text-white shadow-marine-sm" 
                    : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine/50"
                }`}
              >
                Response Logistics
              </button>
            </div>
          </div>

          {/* TAB CONTENT 1: SAR & TEXTURE (Radar Chart + GLCM Deep Inspector) */}
          {activeTab === "radar-glcm" && (
            <div className="space-y-4">
              {/* Dynamic Interactive 6-Axis Radar Spider Chart */}
              <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-ocean" />
                    <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
                      Interactive 6-Axis Radar Signature
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {["observed", "heavy-crude", "biogenic"].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setRadarBenchmark(mode)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          radarBenchmark === mode
                            ? "bg-ocean text-white font-bold"
                            : "bg-ocean-light hover:bg-ocean-sky text-ocean-navy border border-border-marine"
                        }`}
                      >
                        {mode === "observed" ? "Observed" : mode === "heavy-crude" ? "Crude Ref" : "Biogenic Ref"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG 6-Axis Radar Graphic */}
                <div className="flex items-center justify-center my-2 select-none">
                  <svg width="250" height="220" viewBox="0 0 240 220" className="overflow-visible max-w-full h-auto">
                    {/* Concentric 6-gons */}
                    <polygon points="120,30 189,70 189,150 120,190 51,150 51,70" fill="none" stroke="#D9EAF0" strokeWidth="1" />
                    <polygon points="120,50 169,78 169,138 120,166 71,138 71,78" fill="none" stroke="#D9EAF0" strokeWidth="1" />
                    <polygon points="120,70 149,87 149,127 120,144 91,127 91,87" fill="none" stroke="#D9EAF0" strokeWidth="1" />

                    {/* Spoke Lines */}
                    <line x1="120" y1="110" x2="120" y2="30" stroke="#CBD5E1" strokeDasharray="2 2" />
                    <line x1="120" y1="110" x2="189" y2="70" stroke="#CBD5E1" strokeDasharray="2 2" />
                    <line x1="120" y1="110" x2="189" y2="150" stroke="#CBD5E1" strokeDasharray="2 2" />
                    <line x1="120" y1="110" x2="120" y2="190" stroke="#CBD5E1" strokeDasharray="2 2" />
                    <line x1="120" y1="110" x2="51" y2="150" stroke="#CBD5E1" strokeDasharray="2 2" />
                    <line x1="120" y1="110" x2="51" y2="70" stroke="#CBD5E1" strokeDasharray="2 2" />

                    {/* Filled Characteristic Polygon */}
                    <polygon 
                      points={radarData.points} 
                      fill="rgba(8, 126, 164, 0.35)" 
                      stroke="#087EA4" 
                      strokeWidth="2.2" 
                    />

                    {/* Spoke End Indicator Dots */}
                    {radarData.points.split(' ').map((pt, i) => {
                      const [px, py] = pt.split(',');
                      return <circle key={i} cx={px} cy={py} r="3" fill="#087EA4" stroke="#FFFFFF" strokeWidth="1" />;
                    })}

                    {/* Labels */}
                    <text x="120" y="20" textAnchor="middle" fill="#0B2942" fontSize="9" fontFamily="monospace" fontWeight="bold">Contrast {radarData.values[0]}%</text>
                    <text x="198" y="70" fill="#0B2942" fontSize="9" fontFamily="monospace">Elongation {radarData.values[1]}%</text>
                    <text x="198" y="155" fill="#0B2942" fontSize="9" fontFamily="monospace">Complexity {radarData.values[2]}%</text>
                    <text x="120" y="206" textAnchor="middle" fill="#0B2942" fontSize="9" fontFamily="monospace">Damping {radarData.values[5]}%</text>
                    <text x="42" y="155" textAnchor="end" fill="#0B2942" fontSize="9" fontFamily="monospace">Frag. {radarData.values[4]}%</text>
                    <text x="42" y="70" textAnchor="end" fill="#0B2942" fontSize="9" fontFamily="monospace">Homogen. {radarData.values[3]}%</text>
                  </svg>
                </div>

                {/* Sensitivity Slider */}
                <div className="flex items-center gap-3 pt-2 border-t border-border-marine text-xs font-mono">
                  <span className="text-[10px] text-text-muted whitespace-nowrap">MODEL SENSITIVITY:</span>
                  <input
                    type="range"
                    min="0.6"
                    max="1.4"
                    step="0.05"
                    value={radarSensitivity}
                    onChange={(e) => setRadarSensitivity(Number(e.target.value))}
                    className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
                  />
                  <span className="text-[11px] font-bold text-ocean-navy min-w-[32px] text-right">
                    {radarSensitivity.toFixed(2)}×
                  </span>
                </div>
              </div>

              {/* GLCM Texture Deep Inspector */}
              <GlcmDeepInspector />
            </div>
          )}

          {/* TAB CONTENT 2: WEATHERING KINETICS */}
          {activeTab === "weathering" && (
            <div className="space-y-4">
              <WeatheringKineticsEngine 
                initialAgeHours={caseData.estimatedAgeHours}
                windSpeedKn={caseData.environment.windSpeedKn}
                seaTempC={caseData.environment.seaSurfaceTempC}
                waveHeightM={caseData.environment.waveHeightM}
              />
            </div>
          )}

          {/* TAB CONTENT 3: HYDROCARBON & LOOK-ALIKE */}
          {activeTab === "hydrocarbon-lookalike" && (
            <div className="space-y-4">
              <PolarimetryLookalikePanel 
                windSpeedKn={caseData.environment.windSpeedKn}
                confidence={caseData.detectionConfidence}
              />
              <HydrocarbonFingerprinter />
            </div>
          )}

          {/* TAB CONTENT 4: SENSORS & VECTOR COMPASS HUD */}
          {activeTab === "sensor-vector" && (
            <div className="space-y-4">
              {/* Multi-Constellation Satellite Switcher */}
              <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-ocean" />
                    <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
                      Multi-Constellation Satellite Sensor Spectrum Switcher
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-status-success font-semibold">
                    {SENSORS[selectedSensor].frequency}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {Object.entries(SENSORS).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSensor(key)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs ${
                        selectedSensor === key
                          ? "bg-ocean-light border-ocean shadow-marine-sm"
                          : "bg-white hover:bg-ocean-light/50 border-border-marine"
                      }`}
                    >
                      <span className="font-bold text-ocean-navy block text-[11px] truncate">{s.name}</span>
                      <span className="text-[10px] font-mono text-text-muted block truncate">{s.resolution}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Sensor Detailed Specs Card */}
                <div className="p-3 bg-ocean-light/70 rounded-xl border border-border-marine space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Sensor Band & Pol:</span>
                    <span className="font-bold text-ocean-navy">{SENSORS[selectedSensor].polarization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">SAR Backscatter Contrast:</span>
                    <span className="font-bold text-status-danger">{SENSORS[selectedSensor].contrastDb}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary pt-1 border-t border-border-marine font-sans">
                    <strong>Forensic Utility:</strong> {SENSORS[selectedSensor].advantage}
                  </p>
                </div>
              </div>

              {/* Vector Shear & Coriolis Alignment HUD */}
              <VectorShearCompassHUD 
                baseWindSpeedKn={caseData.environment.windSpeedKn}
                baseWindDirDeg={caseData.environment.windDirectionDeg}
                baseCurrentSpeedMs={caseData.environment.currentSpeedMs}
                baseCurrentDirDeg={caseData.environment.currentDirectionDeg}
                spillOrientationDeg={caseData.orientationDeg}
                sstC={caseData.environment.seaSurfaceTempC}
              />
            </div>
          )}

          {/* TAB CONTENT 5: RESPONSE LOGISTICS & FORENSIC CHECKSUM */}
          {activeTab === "recovery-forensic" && (
            <div className="space-y-4">
              <RecoveryFeasibilityTool 
                caseData={caseData}
                totalAreaKm2={caseData.spillAreaKm2}
                coreFraction={0.38}
                viscosityCst={3800}
              />
            </div>
          )}

          {/* Persistent Coupled Environmental Context Card */}
          <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border-marine">
              <span className="font-bold text-xs text-ocean-navy uppercase tracking-wider">
                Coupled MetOcean Context (Live ECMWF & CMEMS)
              </span>
              <span className="text-[10px] font-mono text-status-success font-semibold">
                ● Synchronized
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-ocean-light rounded-lg border border-border-marine/40">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-ocean" />
                  <span>Wind Velocity & Heading:</span>
                </div>
                <span className="font-bold text-ocean-deep">
                  {caseData.environment.windSpeedKn} kn · {caseData.environment.windDirectionText}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-ocean-light rounded-lg border border-border-marine/40">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-ocean" />
                  <span>Surface Ocean Current:</span>
                </div>
                <span className="font-bold text-ocean-deep">
                  {caseData.environment.currentSpeedMs} m/s · {caseData.environment.currentDirectionText}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-ocean-light rounded-lg border border-border-marine/40">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-ocean" />
                  <span>Significant Wave Height:</span>
                </div>
                <span className="font-bold text-text-primary">
                  {caseData.environment.waveHeightM}m (Hs) · {caseData.environment.wavePeriodSec}s
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-ocean-light rounded-lg border border-border-marine/40">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-ocean" />
                  <span>Sea Surface Temp & Salinity:</span>
                </div>
                <span className="font-bold text-text-primary">
                  {caseData.environment.seaSurfaceTempC}°C · {caseData.environment.salinityPsu} PSU
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Forensic Dossier Modal */}
      <CharacterizeDossierModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        caseData={caseData}
        onExportGeoJSON={handleExportGeoJSON}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
}
