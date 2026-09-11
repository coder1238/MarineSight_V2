import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  FileText,
  Activity,
  MapPin,
  Eye,
  Compass,
  Waves,
  Wind,
  Trash2,
  CheckCheck,
  Satellite,
  Ship,
  Sparkles,
  Star,
  SlidersHorizontal,
  Layers,
  Table as TableIcon,
  Map as MapIcon,
  Maximize2,
  Printer,
  Calculator,
  GitMerge,
  UploadCloud,
  RotateCcw,
  Shield,
  Tag,
  Radio,
  Info,
  ChevronDown,
  Droplets,
  AlertOctagon,
  Scale
} from 'lucide-react';
import { INCIDENTS_REGISTRY } from '../data/mockData';
import { api } from '../services/api';
import { useIncident } from '../context/IncidentContext';

// Import our 6 forensic intelligence subcomponents
import IncidentMiniMap, { MPA_ZONES } from '../components/incidents/IncidentMiniMap';
import IncidentCompareModal from '../components/incidents/IncidentCompareModal';
import IncidentForensicCalculatorModal from '../components/incidents/IncidentForensicCalculatorModal';
import IncidentDriftPreviewModal from '../components/incidents/IncidentDriftPreviewModal';
import IncidentDossierPrintModal from '../components/incidents/IncidentDossierPrintModal';
import IncidentImportModal from '../components/incidents/IncidentImportModal';
import IncidentDuplicateDetectorModal from '../components/incidents/IncidentDuplicateDetectorModal';

// Storage keys
const STORAGE_INCIDENTS_KEY = 'marinesight_incidents_registry_v2';
const STORAGE_STARRED_KEY = 'marinesight_starred_incidents_v2';
const STORAGE_NOTES_KEY = 'marinesight_incident_notes_v2';

// Predefined default tags
const DEFAULT_TAG_OPTIONS = [
  "#DarkFleet", 
  "#BunkerSpill", 
  "#AIS-Spoofing", 
  "#MarineSanctuary", 
  "#NightDischarge", 
  "#BallastFlush", 
  "#CoralReefAlert",
  "#HeavyCrude"
];

// Helper to determine Eco-Vulnerability to Marine Protected Areas
function getEcoVulnerability(loc, coords) {
  let lat = 14.82, lng = 68.21;
  if (coords && coords.lat) { lat = coords.lat; lng = coords.lng; }
  else if (loc) {
    const match = loc.match(/([\d.]+)°?N.*?([\d.]+)°?E/i);
    if (match) { lat = parseFloat(match[1]); lng = parseFloat(match[2]); }
  }
  for (const mpa of MPA_ZONES) {
    const dLat = (lat - mpa.lat) * 111;
    const dLng = (lng - mpa.lng) * 111 * Math.cos((lat * Math.PI) / 180);
    const distKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
    if (distKm <= mpa.radiusKm + 45) {
      return { mpaName: mpa.name, distKm, type: mpa.type };
    }
  }
  return null;
}

// Initial default tags for sample data
const DEFAULT_TAGS_MAP = {
  "OF-2026-0912": ["#DarkFleet", "#BunkerSpill", "#NightDischarge"],
  "OF-2026-0918": ["#BallastFlush", "#HeavyCrude"],
  "OF-2026-0925": ["#MarineSanctuary", "#BunkerSpill"],
  "OF-2026-0922": ["#CoralReefAlert", "#AIS-Spoofing"],
  "OF-2026-0930": ["#DarkFleet", "#HeavyCrude"],
  "OF-2026-0909": ["#MarineSanctuary"]
};

export default function Page04Incidents({ onNavigate }) {
  const { activeIncidentId, selectIncident } = useIncident();

  // 1. Data State with LocalStorage Persistence
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INCIDENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not parse saved incidents from localStorage", e);
    }
    // Augment default registry with initial tags
    return INCIDENTS_REGISTRY.map(inc => ({
      ...inc,
      tags: DEFAULT_TAGS_MAP[inc.id] || ["#BunkerSpill"]
    }));
  });

  // Starred Bookmarks State
  const [starredIds, setStarredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STARRED_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set(["OF-2026-0912"]);
    } catch {
      return new Set(["OF-2026-0912"]);
    }
  });

  // Analyst Notes State (Incident ID -> Array of Notes)
  const [analystNotes, setAnalystNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      return saved ? JSON.parse(saved) : {
        "OF-2026-0912": [
          { time: "05 Sep 15:10 UTC", author: "Dr. E. Vance", text: "Sentinel-1 SAR interferometric pass verified high reflectance attenuation consistent with IFO 380 bunker." },
          { time: "05 Sep 16:45 UTC", author: "MRCC Duty Officer", text: "Coast Guard Dornier-228 CG791 alerted for aerial SLAR verification pass." }
        ]
      };
    } catch {
      return {};
    }
  });
  const [newNoteText, setNewNoteText] = useState("");

  // Sync incidents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INCIDENTS_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.warn("Failed to persist incidents to localStorage", e);
    }
  }, [incidents]);

  // Sync starred to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STARRED_KEY, JSON.stringify(Array.from(starredIds)));
    } catch (e) {
      console.warn("Failed to persist starred to localStorage", e);
    }
  }, [starredIds]);

  // Sync notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(analystNotes));
    } catch (e) {
      console.warn("Failed to persist notes to localStorage", e);
    }
  }, [analystNotes]);

  // 2. View Mode State: 'table' | 'split' | 'map'
  const [viewMode, setViewMode] = useState("split");

  // 3. Quick Inline Edit Mode State
  const [isQuickEditMode, setIsQuickEditMode] = useState(false);

  // 4. Filter & Search State
  const [activeTab, setActiveTab] = useState("all"); // all, investigating, active, resolved, starred
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");

  // Advanced Filter Drawer State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(50);
  const [minConfidence, setMinConfidence] = useState(50);
  const [satelliteFilter, setSatelliteFilter] = useState("all");

  // Column Visibility & Density Controls
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [rowDensity, setRowDensity] = useState("comfortable"); // 'comfortable' | 'compact'
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    time: true,
    location: true,
    area: true,
    confidence: true,
    vessels: true,
    risk: true,
    status: true,
    tags: true,
    actions: true
  });

  // 5. Sorting & Pagination State
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 6. Selection & Batch State
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 7. Modals & Drawers State
  const [isCreating, setIsCreating] = useState(false);
  const [inspectingIncident, setInspectingIncident] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [calculatorIncident, setCalculatorIncident] = useState(null);
  const [driftPreviewIncident, setDriftPreviewIncident] = useState(null);
  const [printDossierIncident, setPrintDossierIncident] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDuplicateDetectorOpen, setIsDuplicateDetectorOpen] = useState(false);
  const [vesselHoverIncident, setVesselHoverIncident] = useState(null);

  // Form Data for New Manual Case
  const [formData, setFormData] = useState({
    title: "",
    region: "Arabian Sea",
    coordinates: "14.82°N, 68.21°E",
    spillAreaKm2: "12.4",
    perimeterKm: "18.2",
    riskLevel: "CRITICAL",
    confidence: "96.5",
    status: "Investigating",
    satellite: "Sentinel-1 SAR",
    topCandidate: "M/V Unknown Vessel",
    vesselsCount: 6,
    tags: ["#BunkerSpill"]
  });

  // Simulated Live SAR Acquisition Satellite Passes (Real-time countdown ticker)
  const [tickerSecs, setTickerSecs] = useState(4820); // ~1h 20m
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerSecs(prev => (prev > 0 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTicker = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, riskFilter, regionFilter, selectedTagFilter, minArea, maxArea, minConfidence, satelliteFilter]);

  // Dynamic Regions List
  const availableRegions = useMemo(() => {
    const set = new Set();
    incidents.forEach(inc => {
      if (inc.regionShort) set.add(inc.regionShort);
      else if (inc.region) set.add(inc.region.split('(')[0].trim());
    });
    return Array.from(set);
  }, [incidents]);

  // Dynamic Unique Tags List
  const availableTags = useMemo(() => {
    const set = new Set();
    incidents.forEach(inc => {
      if (Array.isArray(inc.tags)) {
        inc.tags.forEach(t => set.add(t));
      }
    });
    return Array.from(set);
  }, [incidents]);

  // Aggregate Forensic Metrics for KPI Bar
  const metrics = useMemo(() => {
    const total = incidents.length;
    const investigating = incidents.filter(i => (i.status || "").toLowerCase().includes("investigat")).length;
    const critical = incidents.filter(i => (i.risk || i.riskLevel || "").toUpperCase() === "CRITICAL").length;
    const activeDrift = incidents.filter(i => (i.status || "").toLowerCase().includes("drift") || (i.status || "").toLowerCase().includes("active")).length;
    const resolved = incidents.filter(i => (i.status || "").toLowerCase().includes("resolved") || (i.status || "").toLowerCase().includes("closed")).length;
    const starred = incidents.filter(i => starredIds.has(i.id)).length;

    // Cumulative surface area & estimated metric tons
    const totalAreaKm2 = incidents.reduce((acc, i) => acc + (i.areaKm2 || i.spillAreaKm2 || 0), 0).toFixed(1);
    const estTotalTons = Math.round(parseFloat(totalAreaKm2) * 14.5);
    const avgConfidence = total > 0 ? (incidents.reduce((acc, i) => acc + (i.confidence || i.detectionConfidence || 0), 0) / total).toFixed(1) : 0;

    return { total, investigating, critical, activeDrift, resolved, starred, totalAreaKm2, estTotalTons, avgConfidence };
  }, [incidents, starredIds]);

  // Status Tabs
  const tabs = [
    { id: "all", label: "All Incidents", count: incidents.length },
    { id: "investigating", label: "Under Investigation", count: metrics.investigating },
    { id: "active", label: "Active Drift", count: metrics.activeDrift },
    { id: "resolved", label: "Resolved", count: metrics.resolved },
    { id: "starred", label: "Starred Only", count: metrics.starred }
  ];

  // Filtering Engine
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // 1. Tab Filter
      const status = (inc.status || "").toLowerCase();
      if (activeTab === "investigating" && !status.includes("investigat")) return false;
      if (activeTab === "active" && !status.includes("drift") && !status.includes("active")) return false;
      if (activeTab === "resolved" && !status.includes("resolved") && !status.includes("closed")) return false;
      if (activeTab === "starred" && !starredIds.has(inc.id)) return false;

      // 2. Search Query
      const candidateName = inc.topCandidate || inc.topVessel?.name || "";
      const id = inc.id || "";
      const region = inc.region || "";
      const satellite = inc.satellite || "";
      const query = searchQuery.toLowerCase();

      const matchesSearch = !query || 
        id.toLowerCase().includes(query) ||
        region.toLowerCase().includes(query) ||
        candidateName.toLowerCase().includes(query) ||
        satellite.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 3. Risk Filter
      const risk = (inc.risk || inc.riskLevel || "").toLowerCase();
      if (riskFilter !== "all" && risk !== riskFilter.toLowerCase()) return false;

      // 4. Region Filter
      if (regionFilter !== "all") {
        const reg = (inc.regionShort || inc.region || "").toLowerCase();
        if (!reg.includes(regionFilter.toLowerCase())) return false;
      }

      // 5. Tag Filter
      if (selectedTagFilter !== "all") {
        if (!Array.isArray(inc.tags) || !inc.tags.includes(selectedTagFilter)) return false;
      }

      // 6. Advanced Area Slider Filter
      const area = inc.areaKm2 || inc.spillAreaKm2 || 0;
      if (area < minArea || area > maxArea) return false;

      // 7. Advanced Confidence Filter
      const conf = inc.confidence || inc.detectionConfidence || 0;
      if (conf < minConfidence) return false;

      // 8. Advanced Satellite Sensor Filter
      if (satelliteFilter !== "all") {
        const sat = (inc.satellite || "").toLowerCase();
        if (!sat.includes(satelliteFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [
    incidents, 
    activeTab, 
    searchQuery, 
    riskFilter, 
    regionFilter, 
    selectedTagFilter, 
    starredIds, 
    minArea, 
    maxArea, 
    minConfidence, 
    satelliteFilter
  ]);

  // Sorting Engine
  const sortedIncidents = useMemo(() => {
    const list = [...filteredIncidents];
    if (!sortConfig.key) return list;

    list.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'areaKm2') {
        aVal = a.areaKm2 || a.spillAreaKm2 || 0;
        bVal = b.areaKm2 || b.spillAreaKm2 || 0;
      } else if (sortConfig.key === 'confidence') {
        aVal = a.confidence || a.detectionConfidence || 0;
        bVal = b.confidence || b.detectionConfidence || 0;
      } else if (sortConfig.key === 'vessels') {
        aVal = a.vesselsCount ?? a.candidateCount ?? 0;
        bVal = b.vesselsCount ?? b.candidateCount ?? 0;
      } else if (sortConfig.key === 'risk') {
        const rank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aVal = rank[(a.risk || a.riskLevel || '').toUpperCase()] || 0;
        bVal = rank[(b.risk || b.riskLevel || '').toUpperCase()] || 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [filteredIncidents, sortConfig]);

  // Pagination Calculations
  const totalItems = sortedIncidents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedIncidents = sortedIncidents.slice(startIndex, endIndex);

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedIncidents.map(i => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bookmark / Star handler
  const handleToggleStar = (id, e) => {
    e.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Inline edit handlers
  const handleInlineStatusChange = (id, newStatus, e) => {
    e.stopPropagation();
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const handleInlineRiskChange = (id, newRisk, e) => {
    e.stopPropagation();
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, risk: newRisk } : i));
  };

  // Add Tag to Incident
  const handleAddTagToIncident = (incidentId, newTag) => {
    if (!newTag) return;
    const tagFormatted = newTag.startsWith('#') ? newTag : `#${newTag}`;
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        const existing = Array.isArray(i.tags) ? i.tags : [];
        if (!existing.includes(tagFormatted)) {
          return { ...i, tags: [...existing, tagFormatted] };
        }
      }
      return i;
    }));
    if (inspectingIncident && inspectingIncident.id === incidentId) {
      setInspectingIncident(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagFormatted]
      }));
    }
  };

  // Remove Tag from Incident
  const handleRemoveTag = (incidentId, tagToRemove, e) => {
    if (e) e.stopPropagation();
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId && Array.isArray(i.tags)) {
        return { ...i, tags: i.tags.filter(t => t !== tagToRemove) };
      }
      return i;
    }));
    if (inspectingIncident && inspectingIncident.id === incidentId) {
      setInspectingIncident(prev => ({
        ...prev,
        tags: (prev.tags || []).filter(t => t !== tagToRemove)
      }));
    }
  };

  // Batch Status Update
  const handleBatchStatusUpdate = (newStatus) => {
    if (selectedIds.size === 0) return;
    setIncidents(prev => prev.map(inc => {
      if (selectedIds.has(inc.id)) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));
    setSelectedIds(new Set());
  };

  // Batch Risk Update
  const handleBatchRiskUpdate = (newRisk) => {
    if (selectedIds.size === 0) return;
    setIncidents(prev => prev.map(inc => {
      if (selectedIds.has(inc.id)) {
        return { ...inc, risk: newRisk };
      }
      return inc;
    }));
    setSelectedIds(new Set());
  };

  // Batch Delete
  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected incident(s) from registry?`)) return;
    setIncidents(prev => prev.filter(inc => !selectedIds.has(inc.id)));
    setSelectedIds(new Set());
  };

  // Batch Add Tag
  const handleBatchAddTag = (tag) => {
    if (selectedIds.size === 0) return;
    setIncidents(prev => prev.map(inc => {
      if (selectedIds.has(inc.id)) {
        const existing = inc.tags || [];
        return { ...inc, tags: existing.includes(tag) ? existing : [...existing, tag] };
      }
      return inc;
    }));
  };

  // Export Registry to CSV
  const handleExportCSV = () => {
    const listToExport = selectedIds.size > 0 
      ? incidents.filter(i => selectedIds.has(i.id))
      : sortedIncidents;

    const headers = ["Incident ID", "Detection Time (UTC)", "Region", "Coordinates", "Area (km2)", "Perimeter (km)", "AI Confidence (%)", "Vessels Tracked", "Risk Level", "Status", "Satellite Sensor", "Lead Suspect", "Tags"];
    
    const rows = listToExport.map(i => [
      `"${i.id}"`,
      `"${i.time || i.detectionTimeUTC || ''}"`,
      `"${i.region || i.regionShort || ''}"`,
      `"${i.location || (i.coordinates ? `${i.coordinates.lat}, ${i.coordinates.lng}` : '')}"`,
      i.areaKm2 || i.spillAreaKm2 || 0,
      i.perimeterKm || i.spillPerimeterKm || 0,
      i.confidence || i.detectionConfidence || 0,
      i.vesselsCount ?? i.candidateCount ?? 0,
      `"${i.risk || i.riskLevel || 'HIGH'}"`,
      `"${i.status || 'Investigating'}"`,
      `"${i.satellite || 'Sentinel-1 SAR'}"`,
      `"${i.topCandidate || i.topVessel?.name || 'Unknown'}"`,
      `"${(i.tags || []).join('; ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marinesight_incidents_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to GIS GeoJSON
  const handleExportGeoJSON = () => {
    const listToExport = selectedIds.size > 0 
      ? incidents.filter(i => selectedIds.has(i.id))
      : sortedIncidents;

    const featureCollection = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: listToExport.map(inc => {
        let lat = 14.82, lng = 68.21;
        if (inc.coordinates && inc.coordinates.lat) {
          lat = inc.coordinates.lat;
          lng = inc.coordinates.lng;
        } else if (inc.location) {
          const match = inc.location.match(/([\d.]+)°?N.*?([\d.]+)°?E/i);
          if (match) {
            lat = parseFloat(match[1]);
            lng = parseFloat(match[2]);
          }
        }
        return {
          type: "Feature",
          properties: {
            id: inc.id,
            region: inc.region,
            areaKm2: inc.areaKm2 || inc.spillAreaKm2 || 0,
            confidence: inc.confidence || 95,
            risk: inc.risk || "HIGH",
            status: inc.status || "Investigating",
            satellite: inc.satellite || "Sentinel-1 SAR",
            suspect: inc.topCandidate || "Unknown",
            tags: inc.tags || []
          },
          geometry: {
            type: "Point",
            coordinates: [lng, lat]
          }
        };
      })
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(featureCollection, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `marinesight_gis_dossiers_${new Date().toISOString().substring(0, 10)}.geojson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import Handler from Modal
  const handleImportIncidents = (newItems) => {
    setIncidents(prev => [...newItems, ...prev]);
  };

  // Merge Handler from Duplicate Detector Modal
  const handleMergeIncidents = (primaryId, secondaryId) => {
    setIncidents(prev => {
      const primary = prev.find(i => i.id === primaryId);
      const secondary = prev.find(i => i.id === secondaryId);
      if (!primary || !secondary) return prev;

      const mergedArea = +((primary.areaKm2 || 0) + (secondary.areaKm2 || 0) * 0.4).toFixed(1);
      const mergedTags = Array.from(new Set([...(primary.tags || []), ...(secondary.tags || []), "#MergedObservation"]));

      return prev.map(inc => {
        if (inc.id === primaryId) {
          return {
            ...inc,
            areaKm2: mergedArea,
            tags: mergedTags,
            confidence: Math.max(inc.confidence || 90, secondary.confidence || 90)
          };
        }
        return inc;
      }).filter(inc => inc.id !== secondaryId);
    });
  };

  // Factory Reset to defaults
  const handleFactoryReset = () => {
    if (!window.confirm("Reset incidents registry back to factory demo state? All local edits will be cleared.")) return;
    localStorage.removeItem(STORAGE_INCIDENTS_KEY);
    localStorage.removeItem(STORAGE_STARRED_KEY);
    localStorage.removeItem(STORAGE_NOTES_KEY);
    setIncidents(INCIDENTS_REGISTRY.map(inc => ({
      ...inc,
      tags: DEFAULT_TAGS_MAP[inc.id] || ["#BunkerSpill"]
    })));
    setStarredIds(new Set(["OF-2026-0912"]));
    setSelectedIds(new Set());
  };

  // Create New Manual Case
  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newId = `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`;
    const newIncident = {
      id: newId,
      internalId: `INC-${Math.floor(Math.random() * 899 + 100)}`,
      time: new Date().toUTCString().split(' ').slice(1, 5).join(' ') + ' UTC',
      location: formData.coordinates,
      region: `${formData.region} (Maritime EEZ)`,
      regionShort: formData.region,
      flagEmoji: formData.region.includes("Mannar") ? "🇱🇰" : "🇮🇳",
      areaKm2: parseFloat(formData.spillAreaKm2) || 12.4,
      perimeterKm: parseFloat(formData.perimeterKm) || 18.2,
      confidence: parseFloat(formData.confidence) || 96.5,
      vesselsCount: parseInt(formData.vesselsCount) || 4,
      risk: formData.riskLevel,
      status: formData.status,
      satellite: formData.satellite,
      topCandidate: formData.topCandidate,
      tags: formData.tags || ["#BunkerSpill"]
    };

    setIncidents(prev => [newIncident, ...prev]);
    selectIncident(newId);
    setIsCreating(false);
    setFormData({
      title: "",
      region: "Arabian Sea",
      coordinates: "14.82°N, 68.21°E",
      spillAreaKm2: "12.4",
      perimeterKm: "18.2",
      riskLevel: "CRITICAL",
      confidence: "96.5",
      status: "Investigating",
      satellite: "Sentinel-1 SAR",
      topCandidate: "M/V Unknown Vessel",
      vesselsCount: 6,
      tags: ["#BunkerSpill"]
    });
  };

  // Add Analyst Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !inspectingIncident) return;
    const note = {
      time: new Date().toUTCString().slice(5, 22) + " UTC",
      author: "Analyst Duty Station",
      text: newNoteText.trim()
    };
    setAnalystNotes(prev => ({
      ...prev,
      [inspectingIncident.id]: [...(prev[inspectingIncident.id] || []), note]
    }));
    setNewNoteText("");
  };

  // Reset Filters
  const handleResetFilters = () => {
    setActiveTab("all");
    setSearchQuery("");
    setRiskFilter("all");
    setRegionFilter("all");
    setSelectedTagFilter("all");
    setMinArea(0);
    setMaxArea(50);
    setMinConfidence(50);
    setSatelliteFilter("all");
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* 1. Real-time Simulated SAR Satellite Acquisition Ticker */}
      <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl border border-cyan-900/60 shadow-marine-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 text-cyan-400 shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wider uppercase">SAR CONSTELLATION DOWNLINK:</span>
          </div>
          <span className="text-white/80 text-[11px] truncate">
            Sentinel-1A (Ascending Pass 142) over Arabian Sea scheduled in <strong className="text-cyan-300 font-bold">{formatTicker(tickerSecs)}</strong> • NOAA-20 Nighttime VIIRS sync: Active
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[10px] text-white/60">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>AIS FEED: 100% NOMINAL</span>
          </span>
          <button
            onClick={() => setIsDuplicateDetectorOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 underline font-bold flex items-center gap-1"
          >
            <GitMerge className="w-3 h-3" />
            <span>Scan Spatio-Temporal Duplicates</span>
          </button>
        </div>
      </div>

      {/* 2. Header Bar with Operational Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-ocean-navy tracking-tight">
              Marine Incidents & Investigation Registry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-ocean-light text-ocean border border-ocean/20 text-[10px] font-mono font-bold">
              {incidents.length} REGISTERED DOSSIERS
            </span>
            {isQuickEditMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold animate-pulse">
                INLINE EDIT MODE ON
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Forensic multi-spectral hydrocarbon discharge registry with coupled hydrodynamic drift tracking, Bonn classification, and AIS attribution.
          </p>
        </div>

        {/* View Switchers & Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle: Table, Split, Map */}
          <div className="flex items-center rounded-xl border border-border-marine p-0.5 bg-slate-100 font-mono text-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === "table" ? 'bg-white text-ocean-deep shadow-xs font-bold' : 'text-text-muted hover:text-ocean-navy'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === "split" ? 'bg-white text-ocean-deep shadow-xs font-bold' : 'text-text-muted hover:text-ocean-navy'
              }`}
              title="Split Tactical Radar & Table View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Radar</span>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === "map" ? 'bg-white text-ocean-deep shadow-xs font-bold' : 'text-text-muted hover:text-ocean-navy'
              }`}
              title="Tactical Radar Map Only"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>

          {/* Quick Edit Mode Toggle */}
          <button
            onClick={() => setIsQuickEditMode(!isQuickEditMode)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isQuickEditMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white border-border-marine hover:bg-slate-50 text-text-secondary'
            }`}
            title="Toggle Inline Quick Edit Mode for status and risk"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isQuickEditMode ? 'Exit Quick Edit' : 'Quick Edit'}</span>
          </button>

          {/* Compare Button (Active when >= 2 selected) */}
          <button
            onClick={() => setIsCompareOpen(true)}
            disabled={selectedIds.size < 2 || selectedIds.size > 4}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedIds.size >= 2 && selectedIds.size <= 4
                ? 'bg-ocean-deep text-white shadow-marine-sm hover:scale-[1.02]'
                : 'bg-slate-100 text-text-muted border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title="Select 2 to 4 incidents to open comparison matrix"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({selectedIds.size})</span>
          </button>

          {/* Import GIS / CSV */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-marine-sm transition-colors"
            title="Import GeoJSON / JSON / CSV files into registry"
          >
            <UploadCloud className="w-3.5 h-3.5 text-ocean" />
            <span>Import</span>
          </button>

          {/* Export Dropdown Options */}
          <div className="relative group">
            <button 
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-xs font-semibold flex items-center gap-1.5 shadow-marine-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-ocean" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-white border border-border-marine rounded-xl shadow-xl py-1 hidden group-hover:block z-40 text-xs">
              <button
                onClick={handleExportCSV}
                className="w-full px-3 py-1.5 text-left hover:bg-ocean-sky text-ocean-navy flex items-center gap-2"
              >
                <span>Export CSV Spreadsheet</span>
              </button>
              <button
                onClick={handleExportGeoJSON}
                className="w-full px-3 py-1.5 text-left hover:bg-ocean-sky text-ocean-navy flex items-center gap-2"
              >
                <span>Export GIS GeoJSON</span>
              </button>
            </div>
          </div>

          {/* Register New Manual Case */}
          <button 
            onClick={() => setIsCreating(true)}
            className="px-3.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-marine-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Manual Case</span>
          </button>
        </div>
      </div>

      {/* 3. Fullscreen Tactical Radar Map View (Renders in 'map' view mode only) */}
      {viewMode === "map" && (
        <IncidentMiniMap
          incidents={filteredIncidents}
          activeIncidentId={activeIncidentId}
          onSelectIncident={(id) => selectIncident(id)}
          onInspectIncident={(inc) => setInspectingIncident(inc)}
        />
      )}

      {/* 4. Dynamic Analytical Metrics & Aggregate Threat Footprint Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div 
          onClick={() => { setActiveTab("investigating"); setRiskFilter("all"); }}
          className={`p-3 bg-white border rounded-xl shadow-marine-sm cursor-pointer transition-all hover:border-ocean ${
            activeTab === "investigating" ? 'border-ocean ring-2 ring-ocean/20 bg-ocean-light/20' : 'border-border-marine'
          }`}
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Active Inquiries</span>
          <div className="text-xl font-extrabold font-mono text-ocean-deep mt-0.5">
            {metrics.investigating} Cases
          </div>
          <span className="text-[10px] text-ocean font-medium flex items-center gap-1 mt-0.5">
            <Activity className="w-2.5 h-2.5" /> Drift modeled
          </span>
        </div>

        <div 
          onClick={() => { setRiskFilter("critical"); setActiveTab("all"); }}
          className={`p-3 bg-white border rounded-xl shadow-marine-sm cursor-pointer transition-all hover:border-red-400 ${
            riskFilter === "critical" ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20' : 'border-border-marine'
          }`}
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Tier 3 Critical</span>
          <div className="text-xl font-extrabold font-mono text-status-danger mt-0.5">
            {metrics.critical} Alerts
          </div>
          <span className="text-[10px] text-status-danger font-medium flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-2.5 h-2.5" /> High priority
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab("active"); setRiskFilter("all"); }}
          className={`p-3 bg-white border rounded-xl shadow-marine-sm cursor-pointer transition-all hover:border-amber-400 ${
            activeTab === "active" ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/20' : 'border-border-marine'
          }`}
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Spill Footprint</span>
          <div className="text-xl font-extrabold font-mono text-status-warning mt-0.5">
            {metrics.totalAreaKm2} km²
          </div>
          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
            <Waves className="w-2.5 h-2.5" /> Surface footprint
          </span>
        </div>

        <div 
          onClick={() => { setCalculatorIncident(incidents[0]); }}
          className="p-3 bg-white border border-border-marine rounded-xl shadow-marine-sm cursor-pointer hover:border-ocean transition-all"
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Est. Oil at Sea</span>
          <div className="text-xl font-extrabold font-mono text-slate-800 mt-0.5">
            ~{metrics.estTotalTons} MT
          </div>
          <span className="text-[10px] text-ocean font-medium flex items-center gap-1 mt-0.5">
            <Calculator className="w-2.5 h-2.5" /> Open Calculator
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab("starred"); }}
          className={`p-3 bg-white border rounded-xl shadow-marine-sm cursor-pointer transition-all hover:border-amber-400 ${
            activeTab === "starred" ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50/20' : 'border-border-marine'
          }`}
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Starred Bookmarks</span>
          <div className="text-xl font-extrabold font-mono text-amber-500 mt-0.5 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{metrics.starred}</span>
          </div>
          <span className="text-[10px] text-text-secondary font-medium mt-0.5 block">
            Analyst watchlist
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab("resolved"); setRiskFilter("all"); }}
          className={`p-3 bg-white border rounded-xl shadow-marine-sm cursor-pointer transition-all hover:border-emerald-400 ${
            activeTab === "resolved" ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/20' : 'border-border-marine'
          }`}
        >
          <span className="text-[9px] font-bold text-text-muted font-mono uppercase">Resolved Dossiers</span>
          <div className="text-xl font-extrabold font-mono text-status-success mt-0.5">
            {metrics.resolved} Closed
          </div>
          <span className="text-[10px] text-status-success font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" /> Archived
          </span>
        </div>
      </div>

      {/* 5. Filter & Search Toolbar with Tags & Advanced Filter Drawer */}
      <div className="bg-white border border-border-marine rounded-2xl p-3.5 shadow-marine-sm space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center justify-between border-b border-border-marine pb-2 gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'bg-ocean text-white font-bold shadow-sm' 
                    : 'text-text-secondary hover:text-ocean-deep hover:bg-ocean-sky'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-ocean-sky text-ocean-deep'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters || minArea > 0 || maxArea < 50 || minConfidence > 50 || satelliteFilter !== 'all'
                  ? 'bg-ocean-light text-ocean border-ocean/40 font-bold'
                  : 'border-border-marine text-text-secondary hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Multi-Filters</span>
            </button>

            {/* Column Visibility & Density Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className="p-1.5 rounded-lg border border-border-marine hover:bg-slate-50 text-text-secondary"
                title="Configure Columns and Row Density"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              {showColumnSettings && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-border-marine rounded-xl shadow-2xl p-3 z-40 space-y-2.5 text-xs animate-fade-in">
                  <div className="flex items-center justify-between border-b border-border-marine pb-1.5 font-bold text-ocean-navy">
                    <span>Table View Settings</span>
                    <button onClick={() => setShowColumnSettings(false)} className="text-text-muted hover:text-text-primary">
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div>
                    <span className="font-semibold text-text-muted text-[10px] uppercase font-mono block mb-1">Row Density:</span>
                    <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                      <button
                        onClick={() => setRowDensity("comfortable")}
                        className={`py-1 rounded border ${rowDensity === 'comfortable' ? 'bg-ocean text-white font-bold' : 'border-border-marine'}`}
                      >
                        Comfortable
                      </button>
                      <button
                        onClick={() => setRowDensity("compact")}
                        className={`py-1 rounded border ${rowDensity === 'compact' ? 'bg-ocean text-white font-bold' : 'border-border-marine'}`}
                      >
                        Compact
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-text-muted text-[10px] uppercase font-mono block mb-1">Visible Columns:</span>
                    <div className="space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto">
                      {Object.keys(visibleColumns).map((col) => (
                        <label key={col} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col]}
                            onChange={(e) => setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })}
                            className="rounded text-ocean focus:ring-ocean"
                          />
                          <span className="capitalize">{col}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search & Selectors Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Region, Candidate Vessel, Satellite, or Tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border-marine bg-ocean-light/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-ocean text-text-primary placeholder:text-text-muted font-mono"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-ocean-navy"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Risk Filter */}
            <select 
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-border-marine bg-white rounded-lg px-2.5 py-1.5 text-text-secondary font-medium focus:outline-none focus:border-ocean text-xs"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>

            {/* Region Filter */}
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="border border-border-marine bg-white rounded-lg px-2.5 py-1.5 text-text-secondary font-medium focus:outline-none focus:border-ocean text-xs"
            >
              <option value="all">All Regions ({availableRegions.length})</option>
              {availableRegions.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

            {/* Reset Filters */}
            {(activeTab !== 'all' || searchQuery || riskFilter !== 'all' || regionFilter !== 'all' || selectedTagFilter !== 'all' || minArea > 0 || maxArea < 50 || minConfidence > 50 || satelliteFilter !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 rounded-lg border border-border-marine bg-slate-50 hover:bg-slate-100 text-text-secondary font-bold text-xs flex items-center gap-1"
                title="Reset all active search and filter constraints"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 6. Tag Filter Chips Bar */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px] font-mono">
          <span className="text-text-muted text-[10px] uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-ocean" /> Forensic Tags:
          </span>
          <button
            onClick={() => setSelectedTagFilter("all")}
            className={`px-2 py-0.5 rounded-md border text-[10px] transition-colors ${
              selectedTagFilter === "all" ? 'bg-ocean text-white font-bold border-ocean' : 'bg-slate-50 border-border-marine text-text-secondary hover:bg-slate-100'
            }`}
          >
            All Tags
          </button>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? "all" : tag)}
              className={`px-2 py-0.5 rounded-md border text-[10px] transition-colors whitespace-nowrap ${
                selectedTagFilter === tag 
                  ? 'bg-cyan-700 text-white font-bold border-cyan-800 shadow-xs' 
                  : 'bg-slate-50 border-border-marine text-text-secondary hover:bg-ocean-sky'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 7. Advanced Multi-Dimensional Filter Drawer */}
        {showAdvancedFilters && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-border-marine grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-fade-in">
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="font-semibold text-ocean-navy">Slick Surface Area:</span>
                <span className="font-bold text-ocean">{minArea} - {maxArea} km²</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={maxArea}
                  onChange={(e) => setMaxArea(parseFloat(e.target.value))}
                  className="w-full accent-ocean"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="font-semibold text-ocean-navy">Min. AI Confidence:</span>
                <span className="font-bold text-status-success">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                className="w-full accent-ocean"
              />
            </div>

            <div>
              <span className="font-semibold text-ocean-navy block mb-1 font-mono">Satellite Sensor:</span>
              <select
                value={satelliteFilter}
                onChange={(e) => setSatelliteFilter(e.target.value)}
                className="w-full px-2 py-1 bg-white border border-border-marine rounded-lg text-xs"
              >
                <option value="all">All Satellite Sensors</option>
                <option value="sentinel-1">Sentinel-1 SAR C-Band</option>
                <option value="sentinel-2">Sentinel-2 Optical MSI</option>
                <option value="landsat">Landsat-8 OLI/TIRS</option>
                <option value="modis">MODIS Thermal</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 8. Floating Batch Operations Super-Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-ocean-deep text-white px-4 py-2.5 rounded-xl shadow-marine-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-bold">{selectedIds.size} dossier(s) selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Compare */}
            {selectedIds.size >= 2 && selectedIds.size <= 4 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 font-bold transition-colors flex items-center gap-1"
              >
                <Scale className="w-3 h-3" />
                <span>Compare Selected</span>
              </button>
            )}

            {/* Bulk Status */}
            <button
              onClick={() => handleBatchStatusUpdate("Resolved")}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 font-bold transition-colors"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => handleBatchStatusUpdate("Investigating")}
              className="px-2.5 py-1 rounded-md bg-ocean hover:bg-ocean-sky/30 font-bold transition-colors"
            >
              Mark Investigating
            </button>

            {/* Bulk Risk */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBatchRiskUpdate(e.target.value);
                  e.target.value = "";
                }
              }}
              className="bg-white/20 border border-white/30 rounded px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="" className="text-slate-900">Set Risk...</option>
              <option value="CRITICAL" className="text-slate-900">CRITICAL</option>
              <option value="HIGH" className="text-slate-900">HIGH</option>
              <option value="MEDIUM" className="text-slate-900">MEDIUM</option>
              <option value="LOW" className="text-slate-900">LOW</option>
            </select>

            {/* Bulk Tag */}
            <button
              onClick={() => {
                const tag = prompt("Enter tag to apply to selected dossiers (e.g. #DarkFleet):");
                if (tag) handleBatchAddTag(tag.startsWith('#') ? tag : `#${tag}`);
              }}
              className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 font-bold transition-colors flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              <span>Add Tag</span>
            </button>

            {/* Bulk Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 font-bold transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>

            {/* Bulk Export GeoJSON */}
            <button
              onClick={handleExportGeoJSON}
              className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 font-bold transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span>GeoJSON</span>
            </button>

            {/* Delete */}
            <button
              onClick={handleBatchDelete}
              className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 font-bold transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-white/70 hover:text-white ml-2 text-xs underline"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 9. Dual Split Radar Console (viewMode === 'split') */}
      {viewMode === "split" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start animate-fade-in">
          {/* Left Column: Interactive Tactical Radar Console (6 cols) */}
          <div className="xl:col-span-6 xl:sticky xl:top-3 space-y-3">
            <IncidentMiniMap
              incidents={filteredIncidents}
              activeIncidentId={activeIncidentId}
              onSelectIncident={(id) => selectIncident(id)}
              onInspectIncident={(inc) => setInspectingIncident(inc)}
              compact={true}
            />
          </div>

          {/* Right Column: Synchronized Incident Dossiers Stream & Live Controls (6 cols) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="bg-white border border-border-marine rounded-2xl shadow-marine-sm p-3.5 space-y-3">
              {/* Split Header */}
              <div className="flex items-center justify-between border-b border-border-marine pb-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-black text-ocean-navy uppercase tracking-wider text-xs">
                    Radar Linked Dossier Feed
                  </span>
                  <span className="px-2 py-0.2 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300 text-[10px] font-bold">
                    {filteredIncidents.length} IN SECTOR
                  </span>
                </div>
                {activeIncidentId && (
                  <div className="flex items-center gap-1 text-[11px] text-cyan-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                    <span>LOCK: {activeIncidentId}</span>
                  </div>
                )}
              </div>

              {/* Synchronized Cards Feed */}
              <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                {paginatedIncidents.length === 0 ? (
                  <div className="text-center py-8 text-text-muted font-mono text-xs">
                    <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2 opacity-60" />
                    <div>No incidents match current sector filters.</div>
                    <button onClick={handleResetFilters} className="mt-2 text-ocean underline font-bold">
                      Clear filters
                    </button>
                  </div>
                ) : (
                  paginatedIncidents.map((inc) => {
                    const isSelected = selectedIds.has(inc.id);
                    const isCurrentActive = inc.id === activeIncidentId;
                    const isStarred = starredIds.has(inc.id);
                    const ecoVuln = getEcoVulnerability(inc.location, inc.coordinates);
                    const isDarkFleet = Array.isArray(inc.tags) && inc.tags.includes("#DarkFleet");

                    return (
                      <div
                        key={inc.id}
                        onClick={() => selectIncident(inc.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isCurrentActive
                            ? 'bg-gradient-to-r from-cyan-500/10 via-ocean-light/30 to-white border-cyan-400 ring-2 ring-cyan-400/20 shadow-marine-sm'
                            : 'bg-white border-border-marine hover:border-ocean/40 hover:bg-slate-50'
                        }`}
                      >
                        {/* Top Line: Star, ID, Region, Risk */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleToggleStar(inc.id, e)}
                              className="text-text-muted hover:text-amber-500 p-0.5"
                              title={isStarred ? "Starred" : "Star"}
                            >
                              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-500' : 'opacity-40'}`} />
                            </button>
                            <span className="font-mono font-black text-sm text-ocean-deep flex items-center gap-1">
                              {isCurrentActive && (
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                              )}
                              <span>{inc.id}</span>
                            </span>
                            <span className="text-[11px] text-text-muted font-mono truncate max-w-[140px]">
                              {inc.regionShort || inc.region}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              (inc.risk || inc.riskLevel) === 'CRITICAL'
                                ? 'bg-red-50 text-status-danger border-red-200'
                                : 'bg-amber-50 text-status-warning border-amber-200'
                            }`}>
                              {inc.risk || inc.riskLevel || 'HIGH'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-medium ${
                              (inc.status || "").toLowerCase().includes("resolved")
                                ? 'bg-emerald-50 text-status-success'
                                : 'bg-blue-50 text-ocean-deep'
                            }`}>
                              {inc.status || "Investigating"}
                            </span>
                          </div>
                        </div>

                        {/* Mid Row: Metrics & Lead Suspect */}
                        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-border-marine/50 text-[11px] font-mono">
                          <div>
                            <span className="text-[9px] text-text-muted block">AREA</span>
                            <span className="font-bold text-ocean-deep">{inc.areaKm2 || inc.spillAreaKm2 || 0} km²</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-text-muted block">AI CONFIDENCE</span>
                            <span className="font-bold text-status-success">{inc.confidence || 95}%</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-text-muted block">TIME (UTC)</span>
                            <span className="text-text-secondary text-[10px] truncate block">{inc.time || "14:32 UTC"}</span>
                          </div>
                        </div>

                        {/* Lead Candidate & Badges */}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
                          <div className="flex items-center gap-1 text-ocean-navy font-semibold">
                            <Ship className="w-3 h-3 text-red-500" />
                            <span className="text-slate-800 font-bold truncate max-w-[150px]">
                              {inc.topCandidate || "MV Ocean Star"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {ecoVuln && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] flex items-center gap-0.5">
                                <Shield className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{ecoVuln.distKm}km to {ecoVuln.mpaName.split(' ')[0]}</span>
                              </span>
                            )}
                            {isDarkFleet && (
                              <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200 text-[8px] font-bold">
                                DARK FLEET
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Forensic Tool Actions */}
                        <div className="mt-2.5 pt-2 border-t border-border-marine/40 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setDriftPreviewIncident(inc)}
                              className="p-1 rounded border border-border-marine hover:bg-ocean-sky text-ocean"
                              title="Run Drift Particle Simulation"
                            >
                              <Waves className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setCalculatorIncident(inc)}
                              className="p-1 rounded border border-border-marine hover:bg-ocean-sky text-ocean"
                              title="Bonn Severity Calculator"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setPrintDossierIncident(inc)}
                              className="p-1 rounded border border-border-marine hover:bg-ocean-sky text-ocean"
                              title="Print Official Dossier"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInspectingIncident(inc)}
                              className="p-1 rounded border border-border-marine hover:bg-ocean-sky text-ocean"
                              title="Inspect Detailed Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              selectIncident(inc.id);
                              onNavigate("workspace");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs font-mono flex items-center gap-1 shadow-xs"
                          >
                            <span>Workspace</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Split Feed Pagination Footer */}
              <div className="p-2 border-t border-border-marine bg-slate-50 rounded-xl flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>Page {currentPage} of {totalPages} ({totalItems} cases)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-0.5 border border-border-marine rounded bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    ‹ Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-0.5 border border-border-marine rounded bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Classic Incidents Table (Renders in 'table' view mode only) */}
      {viewMode === "table" && (
        <div className="bg-white border border-border-marine rounded-2xl shadow-marine-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ocean-light border-b border-border-marine text-[10px] font-mono text-text-muted uppercase">
                <tr>
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={paginatedIncidents.length > 0 && paginatedIncidents.every(i => selectedIds.has(i.id))}
                      onChange={handleSelectAll}
                      className="rounded border-border-marine text-ocean focus:ring-ocean"
                    />
                  </th>
                  <th className="px-2 py-3 w-8 text-center">⭐</th>
                  
                  {visibleColumns.id && (
                    <th 
                      onClick={() => handleSort('id')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>INCIDENT ID</span>
                        {sortConfig.key === 'id' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.time && (
                    <th 
                      onClick={() => handleSort('time')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>DETECTION TIME</span>
                        {sortConfig.key === 'time' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.location && (
                    <th className="px-3 py-3">COORDINATES & ECO-RADAR</th>
                  )}

                  {visibleColumns.area && (
                    <th 
                      onClick={() => handleSort('areaKm2')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>AREA (KM²)</span>
                        {sortConfig.key === 'areaKm2' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.confidence && (
                    <th 
                      onClick={() => handleSort('confidence')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>CONFIDENCE</span>
                        {sortConfig.key === 'confidence' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.vessels && (
                    <th 
                      onClick={() => handleSort('vessels')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>VESSELS & ANOMALY</span>
                        {sortConfig.key === 'vessels' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.risk && (
                    <th 
                      onClick={() => handleSort('risk')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>RISK LEVEL</span>
                        {sortConfig.key === 'risk' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.status && (
                    <th 
                      onClick={() => handleSort('status')} 
                      className="px-3 py-3 cursor-pointer hover:text-ocean-deep select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span>STATUS</span>
                        {sortConfig.key === 'status' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-ocean" /> : <ArrowDown className="w-3 h-3 text-ocean" />
                        ) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.tags && (
                    <th className="px-3 py-3">FORENSIC TAGS</th>
                  )}

                  {visibleColumns.actions && (
                    <th className="px-3 py-3 text-right">FORENSIC TOOLS</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60">
                {paginatedIncidents.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-4 py-8 text-center text-text-muted font-mono">
                      <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2 opacity-60" />
                      <div>No marine incidents found matching the selected filter criteria.</div>
                      <button 
                        onClick={handleResetFilters}
                        className="mt-2 text-ocean font-bold underline hover:text-ocean-deep text-xs"
                      >
                        Clear all filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedIncidents.map((inc) => {
                    const isSelected = selectedIds.has(inc.id);
                    const isCurrentActive = inc.id === activeIncidentId;
                    const isStarred = starredIds.has(inc.id);
                    const ecoVuln = getEcoVulnerability(inc.location, inc.coordinates);
                    const isDarkFleet = Array.isArray(inc.tags) && inc.tags.includes("#DarkFleet");

                    const cellPy = rowDensity === "compact" ? "py-1.5" : "py-3";

                    return (
                      <tr 
                        key={inc.id}
                        onClick={() => selectIncident(inc.id)}
                        className={`hover:bg-ocean-sky/40 transition-colors cursor-pointer ${
                          isCurrentActive ? 'bg-ocean-sky/40 font-semibold border-l-4 border-l-ocean' : ''
                        } ${isSelected ? 'bg-ocean-sky/30' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className={`px-3 ${cellPy}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(inc.id, e)}
                            className="rounded border-border-marine text-ocean focus:ring-ocean"
                          />
                        </td>

                        {/* Star / Bookmark */}
                        <td className={`px-2 ${cellPy} text-center`} onClick={(e) => handleToggleStar(inc.id, e)}>
                          <button 
                            className="text-text-muted hover:text-amber-500 transition-colors p-1"
                            title={isStarred ? "Remove from Starred Watchlist" : "Star Dossier"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-500' : 'opacity-40'}`} />
                          </button>
                        </td>

                        {/* Incident ID */}
                        {visibleColumns.id && (
                          <td className={`px-3 ${cellPy} font-mono font-bold text-ocean-deep`}>
                            <div className="flex items-center gap-1.5">
                              {isCurrentActive && (
                                <span className="w-2 h-2 rounded-full bg-ocean animate-ping" title="Active Incident in Session"></span>
                              )}
                              <span>{inc.id}</span>
                            </div>
                            {inc.internalId && (
                              <div className="text-[9px] font-normal text-text-muted font-mono">{inc.internalId}</div>
                            )}
                          </td>
                        )}

                        {/* Detection Time */}
                        {visibleColumns.time && (
                          <td className={`px-3 ${cellPy} font-mono text-text-secondary whitespace-nowrap`}>
                            {inc.time || inc.detectionTimeUTC}
                          </td>
                        )}

                        {/* Coordinates & Eco-Radar */}
                        {visibleColumns.location && (
                          <td className={`px-3 ${cellPy}`}>
                            <div className="font-mono text-[11px] text-ocean-navy flex items-center gap-1">
                              <span>{inc.flagEmoji || "🇮🇳"}</span>
                              <span>{inc.location || (inc.coordinates ? `${inc.coordinates.lat?.toFixed(2)}°N, ${inc.coordinates.lng?.toFixed(2)}°E` : "14.82°N, 68.21°E")}</span>
                            </div>
                            <div className="text-[10px] text-text-muted truncate max-w-[180px]">{inc.region}</div>
                            
                            {/* Eco-Vulnerability Alert Badge if close to an MPA */}
                            {ecoVuln && (
                              <div className="mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono">
                                <Shield className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{ecoVuln.distKm}km to {ecoVuln.mpaName.split(' ')[0]}</span>
                              </div>
                            )}
                          </td>
                        )}

                        {/* Area */}
                        {visibleColumns.area && (
                          <td className={`px-3 ${cellPy} font-mono text-ocean-deep font-bold`}>
                            {(inc.areaKm2 || inc.spillAreaKm2 || 0)} km²
                          </td>
                        )}

                        {/* Confidence */}
                        {visibleColumns.confidence && (
                          <td className={`px-3 ${cellPy} font-mono text-status-success font-bold`}>
                            {inc.confidence || inc.detectionConfidence || 95}%
                          </td>
                        )}

                        {/* Vessels & AIS Anomaly */}
                        {visibleColumns.vessels && (
                          <td className={`px-3 ${cellPy} font-mono text-text-secondary relative`}>
                            <div 
                              onMouseEnter={() => setVesselHoverIncident(inc)}
                              onMouseLeave={() => setVesselHoverIncident(null)}
                              className="cursor-help"
                            >
                              <div className="flex items-center gap-1">
                                <span>{inc.vesselsCount ?? inc.candidateCount ?? 4} vessels</span>
                                <Info className="w-3 h-3 text-text-muted opacity-60" />
                              </div>
                              {inc.topCandidate && (
                                <div className="text-[9px] text-ocean font-sans truncate max-w-[120px]" title={inc.topCandidate}>
                                  Top: {inc.topCandidate}
                                </div>
                              )}
                              {isDarkFleet && (
                                <span className="inline-block mt-0.5 px-1 py-0.2 rounded bg-red-100 text-red-700 border border-red-200 text-[8px] font-mono font-bold">
                                  AIS GAP ANOMALY
                                </span>
                              )}
                            </div>

                            {/* Hover Popover Roster */}
                            {vesselHoverIncident?.id === inc.id && (
                              <div className="absolute left-0 bottom-full mb-1 w-64 bg-slate-900 text-white rounded-xl shadow-2xl p-3 z-50 text-xs border border-cyan-800/60 pointer-events-none animate-fade-in font-sans">
                                <div className="font-bold text-cyan-300 font-mono text-[11px] pb-1 border-b border-white/10 flex items-center justify-between">
                                  <span>SUSPECT AIS CORRIDOR ROSTER</span>
                                  <span>{inc.vesselsCount || 4} TARGETS</span>
                                </div>
                                <div className="mt-2 space-y-1.5 text-[11px]">
                                  <div className="flex justify-between items-center bg-white/10 p-1.5 rounded">
                                    <div>
                                      <div className="font-bold text-white">{inc.topCandidate || "MV Ocean Star"}</div>
                                      <div className="text-[9px] text-white/60 font-mono">MMSI: 419001248 • Tanker</div>
                                    </div>
                                    <span className="font-mono font-bold text-red-400">89% Anomaly</span>
                                  </div>
                                  <div className="flex justify-between items-center text-white/70 px-1 font-mono text-[10px]">
                                    <span>2. M/V Coral Leader</span>
                                    <span>42% match</span>
                                  </div>
                                  <div className="flex justify-between items-center text-white/70 px-1 font-mono text-[10px]">
                                    <span>3. Al-Baraka (Bulk)</span>
                                    <span>18% match</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        )}

                        {/* Risk Level */}
                        {visibleColumns.risk && (
                          <td className={`px-3 ${cellPy}`}>
                            {isQuickEditMode ? (
                              <select
                                value={inc.risk || inc.riskLevel || "HIGH"}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleInlineRiskChange(inc.id, e.target.value, e)}
                                className="border border-border-marine rounded px-1.5 py-0.5 text-[10px] font-bold font-mono bg-white text-ocean-navy"
                              >
                                <option value="CRITICAL">CRITICAL</option>
                                <option value="HIGH">HIGH</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="LOW">LOW</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                                (inc.risk || inc.riskLevel) === 'CRITICAL' 
                                  ? 'text-status-danger bg-red-50 border-red-200' 
                                  : (inc.risk || inc.riskLevel) === 'HIGH' 
                                  ? 'text-status-warning bg-amber-50 border-amber-200' 
                                  : 'text-status-info bg-blue-50 border-blue-200'
                              }`}>
                                {inc.risk || inc.riskLevel || 'HIGH'}
                              </span>
                            )}
                          </td>
                        )}

                        {/* Status */}
                        {visibleColumns.status && (
                          <td className={`px-3 ${cellPy}`}>
                            {isQuickEditMode ? (
                              <select
                                value={inc.status || "Investigating"}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleInlineStatusChange(inc.id, e.target.value, e)}
                                className="border border-border-marine rounded px-1.5 py-0.5 text-[10px] font-bold font-mono bg-white text-ocean-deep"
                              >
                                <option value="Investigating">Investigating</option>
                                <option value="Active Drift">Active Drift</option>
                                <option value="Monitoring">Monitoring</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            ) : (
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                (inc.status || "").toLowerCase().includes("resolved")
                                  ? 'bg-emerald-50 text-status-success border border-emerald-200'
                                  : (inc.status || "").toLowerCase().includes("investigat")
                                  ? 'bg-blue-50 text-ocean-deep border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {inc.status || "Investigating"}
                              </span>
                            )}
                          </td>
                        )}

                        {/* Tags */}
                        {visibleColumns.tags && (
                          <td className={`px-3 ${cellPy}`}>
                            <div className="flex flex-wrap gap-1 max-w-[160px]">
                              {(inc.tags || []).map(t => (
                                <span 
                                  key={t}
                                  className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-mono"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}

                        {/* Actions */}
                        {visibleColumns.actions && (
                          <td className={`px-3 ${cellPy} text-right`}>
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              {/* Quick Drift Simulation Preview */}
                              <button
                                onClick={() => setDriftPreviewIncident(inc)}
                                className="p-1 rounded-md border border-border-marine hover:bg-ocean-sky text-ocean"
                                title="Run In-Browser Drift Particle Simulation"
                              >
                                <Waves className="w-3.5 h-3.5" />
                              </button>

                              {/* Bonn Calculator Quick Access */}
                              <button
                                onClick={() => setCalculatorIncident(inc)}
                                className="p-1 rounded-md border border-border-marine hover:bg-ocean-sky text-ocean"
                                title="Open Bonn Severity & Volume Calculator"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                              </button>

                              {/* Printable Dossier Briefing */}
                              <button
                                onClick={() => setPrintDossierIncident(inc)}
                                className="p-1 rounded-md border border-border-marine hover:bg-ocean-sky text-ocean"
                                title="Generate Coast Guard / DG Shipping Official Dossier"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* Inspect Drawer */}
                              <button
                                onClick={() => setInspectingIncident(inc)}
                                className="p-1 rounded-md border border-border-marine hover:bg-ocean-sky text-ocean"
                                title="Inspect Detailed Dossier"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Workspace Navigation */}
                              <button
                                onClick={() => {
                                  selectIncident(inc.id);
                                  onNavigate("workspace");
                                }}
                                className="px-2.5 py-1 rounded-md bg-ocean text-white hover:bg-ocean-deep text-xs font-bold transition-all shadow-xs"
                              >
                                Workspace →
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Working Pagination & Local Reset */}
          <div className="p-3 border-t border-border-marine bg-ocean-light/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted font-mono">
            <div className="flex items-center gap-3">
              <span>
                Showing <b className="text-ocean-navy">{totalItems > 0 ? startIndex + 1 : 0}</b> to <b className="text-ocean-navy">{endIndex}</b> of <b className="text-ocean-navy">{totalItems}</b> incidents
              </span>

              <button
                onClick={handleFactoryReset}
                className="text-text-muted hover:text-red-600 text-[10px] underline ml-2"
                title="Reset to demo state"
              >
                Reset Demo Registry
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 mr-2 text-[11px]">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-border-marine rounded px-1.5 py-0.5 text-ocean-navy"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 border border-border-marine rounded-lg bg-white hover:bg-ocean-sky disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-ocean text-white shadow-xs'
                      : 'bg-white border border-border-marine text-ocean-navy hover:bg-ocean-sky'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 border border-border-marine rounded-lg bg-white hover:bg-ocean-sky disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Modals Integrations */}

      {/* Side-by-side Comparator Modal */}
      {isCompareOpen && (
        <IncidentCompareModal
          incidents={incidents.filter(i => selectedIds.has(i.id))}
          onClose={() => setIsCompareOpen(false)}
          onSelectIncident={(id) => selectIncident(id)}
          onNavigate={onNavigate}
        />
      )}

      {/* Bonn Agreement & ITOPF Severity Calculator Modal */}
      {calculatorIncident && (
        <IncidentForensicCalculatorModal
          incident={calculatorIncident}
          onClose={() => setCalculatorIncident(null)}
          onApplyCalculations={({ calculatedVolumeM3, calculatedTons, calculatedTier }) => {
            setIncidents(prev => prev.map(i => i.id === calculatorIncident.id ? {
              ...i,
              estimatedVolumeM3: calculatedVolumeM3,
              estimatedTons: calculatedTons,
              risk: calculatedTier.includes("3") ? "CRITICAL" : i.risk
            } : i));
          }}
        />
      )}

      {/* In-browser Drift Simulation Preview Canvas Modal */}
      {driftPreviewIncident && (
        <IncidentDriftPreviewModal
          incident={driftPreviewIncident}
          onClose={() => setDriftPreviewIncident(null)}
          onOpenFullSimulation={() => {
            selectIncident(driftPreviewIncident.id);
            onNavigate("simulation");
          }}
        />
      )}

      {/* Official Coast Guard Dossier Print Modal */}
      {printDossierIncident && (
        <IncidentDossierPrintModal
          incident={printDossierIncident}
          onClose={() => setPrintDossierIncident(null)}
        />
      )}

      {/* GIS GeoJSON & CSV Import Modal */}
      {isImportOpen && (
        <IncidentImportModal
          onClose={() => setIsImportOpen(false)}
          onImportIncidents={handleImportIncidents}
        />
      )}

      {/* Spatio-temporal Duplicate Detector & Merge Modal */}
      {isDuplicateDetectorOpen && (
        <IncidentDuplicateDetectorModal
          incidents={incidents}
          onClose={() => setIsDuplicateDetectorOpen(false)}
          onMergeIncidents={handleMergeIncidents}
        />
      )}

      {/* New Manual Incident Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCase} className="bg-white rounded-2xl p-6 max-w-lg w-full border border-border-marine shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2.5 border-b border-border-marine">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-ocean" />
                <h3 className="font-bold text-ocean-navy text-sm">Register New Hydrocarbon Incident</h3>
              </div>
              <button type="button" onClick={() => setIsCreating(false)} className="text-text-muted hover:text-text-primary p-1 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-text-secondary block mb-1">Incident Title / Descriptor *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sikka Anchorage Heavy Bunker Discharge"
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean/40"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Maritime Region</label>
                <select
                  value={formData.region}
                  onChange={e => {
                    const reg = e.target.value;
                    let coords = "14.82°N, 68.21°E";
                    if (reg === "Bay of Bengal") coords = "17.45°N, 83.85°E";
                    else if (reg === "Gulf of Kutch") coords = "22.52°N, 69.18°E";
                    else if (reg === "Gulf of Mannar") coords = "09.18°N, 79.32°E";
                    else if (reg === "Strait of Malacca") coords = "06.85°N, 93.95°E";
                    else if (reg === "Laccadive Sea") coords = "08.35°N, 73.15°E";
                    setFormData({ ...formData, region: reg, coordinates: coords });
                  }}
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none"
                >
                  <option value="Arabian Sea">Arabian Sea</option>
                  <option value="Bay of Bengal">Bay of Bengal</option>
                  <option value="Gulf of Kutch">Gulf of Kutch</option>
                  <option value="Gulf of Mannar">Gulf of Mannar</option>
                  <option value="Strait of Malacca">Strait of Malacca</option>
                  <option value="Laccadive Sea">Laccadive Sea</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Coordinates (Lat, Lng)</label>
                <input
                  type="text"
                  required
                  value={formData.coordinates}
                  onChange={e => setFormData({ ...formData, coordinates: e.target.value })}
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean/40 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Estimated Slick Area (km²)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.spillAreaKm2}
                  onChange={e => setFormData({ ...formData, spillAreaKm2: e.target.value })}
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Initial Risk Level</label>
                <select
                  value={formData.riskLevel}
                  onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none font-bold text-ocean-navy"
                >
                  <option value="CRITICAL">CRITICAL (Tier 3)</option>
                  <option value="HIGH">HIGH (Tier 2)</option>
                  <option value="MEDIUM">MEDIUM (Tier 1)</option>
                  <option value="LOW">LOW (Minor Sheen)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Satellite Sensor</label>
                <select
                  value={formData.satellite}
                  onChange={e => setFormData({ ...formData, satellite: e.target.value })}
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none"
                >
                  <option value="Sentinel-1 SAR">Sentinel-1 SAR (Dual-Pol VV/VH)</option>
                  <option value="Sentinel-2 MSI">Sentinel-2 MSI (Multispectral)</option>
                  <option value="Landsat-8">Landsat-8 OLI/TIRS</option>
                  <option value="MODIS Aqua/Terra">MODIS Thermal Infrared</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Lead Suspect Vessel (Optional)</label>
                <input
                  type="text"
                  value={formData.topCandidate}
                  onChange={e => setFormData({ ...formData, topCandidate: e.target.value })}
                  placeholder="e.g. M/V Ocean Star"
                  className="w-full px-3 py-2 border border-border-marine rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-marine">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)} 
                className="px-3.5 py-1.5 rounded-lg border border-border-marine text-xs text-text-secondary hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 rounded-lg bg-ocean text-white font-bold text-xs hover:bg-ocean-deep shadow-sm transition-all"
              >
                Register & Initialize Case
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 11. Incident Quick Detail Inspection Slide-Over Drawer with Interactive Timeline & Notes */}
      {inspectingIncident && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between border-l border-border-marine">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border-marine">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-ocean-navy">{inspectingIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold border ${
                      (inspectingIncident.risk || inspectingIncident.riskLevel) === 'CRITICAL'
                        ? 'text-status-danger bg-red-50 border-red-200'
                        : 'text-status-warning bg-amber-50 border-amber-200'
                    }`}>
                      {inspectingIncident.risk || inspectingIncident.riskLevel}
                    </span>
                    <button
                      onClick={(e) => handleToggleStar(inspectingIncident.id, e)}
                      className="p-1 text-text-muted hover:text-amber-500"
                    >
                      <Star className={`w-4 h-4 ${starredIds.has(inspectingIncident.id) ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{inspectingIncident.region}</div>
                </div>

                <button 
                  onClick={() => setInspectingIncident(null)}
                  className="p-1 rounded-lg hover:bg-ocean-sky text-text-muted hover:text-ocean-navy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Switcher */}
              <div className="bg-ocean-light/50 p-2.5 rounded-xl border border-border-marine flex items-center justify-between text-xs">
                <span className="font-bold text-ocean-navy">Case Lifecycle:</span>
                <select
                  value={inspectingIncident.status || "Investigating"}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setIncidents(prev => prev.map(i => i.id === inspectingIncident.id ? { ...i, status: newStatus } : i));
                    setInspectingIncident(prev => ({ ...prev, status: newStatus }));
                  }}
                  className="bg-white border border-border-marine rounded-lg px-2 py-1 text-xs font-bold text-ocean-deep focus:outline-none"
                >
                  <option value="Investigating">Investigating</option>
                  <option value="Active Drift">Active Drift</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Forensic Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-text-muted block">SPILL AREA</span>
                  <span className="font-bold text-ocean-deep text-sm">{inspectingIncident.areaKm2 || inspectingIncident.spillAreaKm2} km²</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-text-muted block">AI CONFIDENCE</span>
                  <span className="font-bold text-status-success text-sm">{inspectingIncident.confidence || inspectingIncident.detectionConfidence}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-text-muted block">DETECTION TIME</span>
                  <span className="font-bold text-ocean-navy text-xs">{inspectingIncident.time || inspectingIncident.detectionTimeUTC}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[9px] text-text-muted block">COORDINATES</span>
                  <span className="font-bold text-ocean-navy text-xs">{inspectingIncident.location || "14.82°N, 68.21°E"}</span>
                </div>
              </div>

              {/* Tags Editor */}
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ocean-navy flex items-center gap-1 font-mono text-xs">
                    <Tag className="w-3 h-3 text-ocean" />
                    <span>Forensic Classification Tags</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(inspectingIncident.tags || []).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-white text-ocean-deep border border-ocean/20 font-mono text-[10px] flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={(e) => handleRemoveTag(inspectingIncident.id, tag, e)}
                        className="hover:text-red-500 ml-0.5 text-text-muted"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <select
                    id="newTagSelect"
                    className="flex-1 bg-white border border-border-marine rounded px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTagToIncident(inspectingIncident.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="" disabled>+ Add Classification Tag...</option>
                    {DEFAULT_TAG_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chronological Forensic Investigation Lifecycle Timeline */}
              <div className="p-3 bg-ocean-light/30 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
                <div className="font-bold text-ocean-navy flex items-center gap-1 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-ocean" />
                  <span>INVESTIGATION MILESTONES TIMELINE</span>
                </div>

                <div className="space-y-2 relative pl-4 before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-ocean/30">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[14px] top-1"></div>
                    <div className="text-[10px] text-text-muted">T-00:00:00</div>
                    <div className="font-semibold text-ocean-navy">Satellite SAR Acquisition ({inspectingIncident.satellite || "Sentinel-1 SAR"})</div>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 absolute -left-[14px] top-1"></div>
                    <div className="text-[10px] text-text-muted">T+00:15:30</div>
                    <div className="font-semibold text-ocean-navy">Deep Learning Roboflow Segmentation ({inspectingIncident.confidence || 96.5}% conf.)</div>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-amber-500 absolute -left-[14px] top-1"></div>
                    <div className="text-[10px] text-text-muted">T+00:42:00</div>
                    <div className="font-semibold text-ocean-navy">AIS Trajectory Backtrack & Anomaly Filter</div>
                  </div>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-ocean absolute -left-[14px] top-1"></div>
                    <div className="text-[10px] text-text-muted">T+01:10:00</div>
                    <div className="font-semibold text-ocean-navy">Coast Guard District Command Alert Dispatched</div>
                  </div>
                </div>
              </div>

              {/* Analyst Field Notes Notebook */}
              <div className="p-3 bg-slate-50 border border-border-marine rounded-xl space-y-2 text-xs">
                <div className="font-bold text-ocean-navy flex items-center justify-between">
                  <span className="flex items-center gap-1 font-mono text-xs">
                    <FileText className="w-3.5 h-3.5 text-ocean" />
                    <span>Analyst Field Notes ({analystNotes[inspectingIncident.id]?.length || 0})</span>
                  </span>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {(analystNotes[inspectingIncident.id] || []).length === 0 ? (
                    <div className="text-text-muted text-[11px] italic py-1">No notes recorded yet.</div>
                  ) : (
                    (analystNotes[inspectingIncident.id] || []).map((n, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-border-marine text-[11px]">
                        <div className="flex justify-between text-[9px] text-text-muted font-mono mb-0.5">
                          <strong>{n.author}</strong>
                          <span>{n.time}</span>
                        </div>
                        <p className="text-slate-800 leading-snug">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-1 pt-1">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add an analyst annotation..."
                    className="flex-1 px-2.5 py-1 text-xs border border-border-marine rounded-lg bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-ocean hover:bg-ocean-deep text-white rounded-lg font-bold text-xs"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-border-marine space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCalculatorIncident(inspectingIncident)}
                  className="py-1.5 px-2 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Calculator className="w-3 h-3 text-ocean" />
                  <span>Bonn Calc</span>
                </button>
                <button
                  onClick={() => setPrintDossierIncident(inspectingIncident)}
                  className="py-1.5 px-2 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy font-bold text-xs flex items-center justify-center gap-1"
                >
                  <Printer className="w-3 h-3 text-ocean" />
                  <span>Print Dossier</span>
                </button>
              </div>

              <button
                onClick={() => {
                  selectIncident(inspectingIncident.id);
                  onNavigate("workspace");
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-ocean to-ocean-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.01] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Investigation Workspace →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
