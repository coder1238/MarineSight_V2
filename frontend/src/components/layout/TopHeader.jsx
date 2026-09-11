import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  RefreshCw, 
  Bell, 
  HelpCircle, 
  User, 
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  AlertOctagon,
  Globe,
  Compass,
  Menu
} from 'lucide-react';
import { useIncident } from '../../context/IncidentContext';

export default function TopHeader({ currentPage, setCurrentPage, onSearch, onToggleMobileMenu }) {
  const { activeIncidentId, activeIncident, selectIncident, allIncidents } = useIncident();
  const [utcTime, setUtcTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPageSwitcher, setShowPageSwitcher] = useState(false);
  const [showRegionSwitcher, setShowRegionSwitcher] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pageNames = {
    "landing": "01 · Public Landing & Overview",
    "command-center": "02 · Maritime Intelligence Command Center",
    "live-monitor": "03 · Live Ocean Monitor (Real-time GIS)",
    "incidents": "04 · Marine Incidents & Investigation Registry",
    "workspace": `05 · Investigation Workspace (${activeIncidentId})`,
    "satellite": "06 · Satellite Intelligence & SAR Spill Detection",
    "characterize": "07 · Oil Spill Morphological Profiling",
    "simulation": "08 · Oil Drift Simulation & Hydrodynamics",
    "source-trace": "09 · Probable Spill Origin (Backward Hindcast)",
    "vessel-intel": `10 · Vessel Intelligence Dossier (${activeIncident?.topVessel?.name || 'Vessel'})`,
    "trajectory": "11 · AIS Trajectory Reconstruction & Anomaly",
    "attribution": "12 · Trajectory Similarity & XGBoost Attribution",
    "evidence-risk": "13 · Multi-Evidence Fusion & Ecological Risk",
    "response-plan": "14 · Emergency Response Planner & Booms",
    "report-system": "15 · Investigation Report & System Intelligence"
  };

  const notifications = [
    { title: "NEW SPILL DETECTED", time: "14:42 UTC", desc: `${activeIncident.spillAreaKm2} km² slick in ${activeIncident.region}.`, type: "critical", page: "satellite" },
    { title: "AIS ANOMALY FLAGGED", time: "14:39 UTC", desc: `${activeIncident.topVessel?.name} transponder blackout (${activeIncident.topVessel?.aisBlackoutDurationMin || 38} min duration).`, type: "warning", page: "trajectory" },
    { title: "HINDCAST COMPLETED", time: "14:35 UTC", desc: `Origin Zone A identified with ${activeIncident.hindcast?.originZoneA?.confidence || 72}% confidence.`, type: "info", page: "source-trace" },
  ];

  return (
    <header className="bg-white border-b border-border-marine px-3 sm:px-4 py-2 flex items-center justify-between sticky top-0 z-40 shadow-marine-sm w-full">
      {/* Left: Mobile Hamburger, Breadcrumbs, Region Selector & Quick Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 -ml-1 text-ocean-navy hover:text-ocean active:scale-95 bg-ocean-light/80 hover:bg-ocean-sky border border-border-marine rounded-xl transition-all flex items-center justify-center shrink-0 shadow-xs"
          title="Open Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-ocean" />
        </button>

        {/* Responsive Breadcrumbs */}
        <div className="flex items-center text-xs text-text-secondary min-w-0">
          <span className="font-semibold text-ocean-navy hidden xs:inline">MarineSight</span>
          <span className="mx-1 text-border-marine font-bold hidden xs:inline">/</span>
          <button 
            onClick={() => setCurrentPage("workspace")} 
            className="hover:text-ocean transition-colors font-mono font-bold text-ocean-deep truncate max-w-[85px] sm:max-w-none"
          >
            {activeIncidentId}
          </button>
          <span className="mx-1 text-border-marine font-bold hidden sm:inline">/</span>
          <span className="text-ocean font-medium truncate max-w-[120px] md:max-w-[200px] lg:max-w-none hidden sm:inline">
            {pageNames[currentPage] || currentPage}
          </span>
        </div>

        {/* Dynamic Maritime Region & Scenario Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRegionSwitcher(!showRegionSwitcher);
              setShowPageSwitcher(false);
            }}
            className="flex items-center gap-1 sm:gap-1.5 bg-ocean-navy text-white px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all hover:bg-ocean shadow-sm"
            title="Switch Maritime Simulation Region"
          >
            <span>{activeIncident?.flagEmoji || "🇮🇳"}</span>
            <span className="hidden md:inline">{activeIncident?.regionShort || "Arabian Sea"}</span>
            <span className="text-[10px] text-[#00E5FF] font-bold">({activeIncident?.spillAreaKm2} km²)</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {showRegionSwitcher && (
            <div className="absolute left-0 mt-1.5 w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-border-marine rounded-xl shadow-marine-lg py-1.5 z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border-marine flex items-center justify-between">
                <span>SIMULATION REGIONS (6 SCENARIOS)</span>
                <Globe className="w-3 h-3 text-ocean" />
              </div>
              {allIncidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => {
                    selectIncident(inc.id);
                    setShowRegionSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-ocean-sky flex items-center justify-between transition-colors border-b border-border-marine/40 last:border-b-0 ${
                    activeIncidentId === inc.id ? 'bg-ocean-sky/60 font-bold text-ocean-deep' : 'text-text-primary'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <span>{inc.flagEmoji}</span>
                      <span className="font-bold text-ocean-navy">{inc.regionShort}</span>
                      <span className="text-[10px] text-text-muted">({inc.id})</span>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Slick: <strong className="text-ocean font-mono">{inc.areaKm2} km²</strong> · Suspect: {inc.topCandidate}
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border ${inc.riskColor}`}>
                    {inc.risk}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Page Jump Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowPageSwitcher(!showPageSwitcher);
              setShowRegionSwitcher(false);
            }}
            className="flex items-center gap-1 bg-ocean-sky/70 hover:bg-ocean-sky border border-ocean/20 text-ocean-deep px-2 py-1 rounded text-xs font-medium transition-all"
            title="Jump to Page"
          >
            <span className="hidden sm:inline">Jump Page</span>
            <span className="sm:hidden font-mono font-bold text-[10px]">Pg</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showPageSwitcher && (
            <div className="absolute left-0 mt-1.5 w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-border-marine rounded-lg shadow-marine-lg py-1.5 z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border-marine">
                All 15 Application Pages
              </div>
              {Object.entries(pageNames).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentPage(id);
                    setShowPageSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-ocean-sky flex items-center justify-between transition-colors ${
                    currentPage === id ? 'text-ocean font-bold bg-ocean-sky/50' : 'text-text-primary'
                  }`}
                >
                  <span className="truncate">{label}</span>
                  {currentPage === id && <span className="w-1.5 h-1.5 rounded-full bg-ocean"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearch) onSearch(searchQuery);
            }}
            placeholder="Search vessel, MMSI, IMO, coordinates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border-marine bg-ocean-light/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-ocean focus:border-ocean text-text-primary placeholder:text-text-muted transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Telemetry, Sync, Alerts, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* UTC Clock */}
        <div className="flex items-center gap-1.5 bg-ocean-light border border-border-marine px-2 sm:px-2.5 py-1 rounded text-xs font-mono text-ocean-deep font-semibold">
          <Clock className="w-3.5 h-3.5 text-ocean" />
          <span className="hidden xs:inline">{utcTime || "14:45:00 UTC"}</span>
          <span className="xs:hidden">{utcTime ? utcTime.split(' ')[0] : '14:45'}</span>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-50 text-status-success border border-emerald-200 px-2 py-1 rounded font-medium">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
          <span>SYNCED</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg border border-border-marine hover:bg-ocean-sky text-text-secondary hover:text-ocean relative transition-colors"
            title="Active Intelligence Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-danger text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white border border-border-marine rounded-lg shadow-marine-lg p-2 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border-marine px-1">
                <span className="font-bold text-xs text-ocean-navy">Live Forensic Alerts</span>
                <span className="text-[10px] text-text-muted">3 Unread</span>
              </div>
              <div className="space-y-1.5">
                {notifications.map((n, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setCurrentPage(n.page);
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded bg-ocean-light/60 hover:bg-ocean-sky cursor-pointer border border-border-marine/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className={n.type === 'critical' ? 'text-status-danger' : n.type === 'warning' ? 'text-status-warning' : 'text-ocean'}>
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-border-marine">
          <div className="w-7 h-7 rounded-full bg-ocean text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
            EV
          </div>
          <div className="hidden xl:block text-left text-xs leading-tight">
            <p className="font-semibold text-ocean-navy">Dr. E. Vance</p>
            <p className="text-[10px] text-text-muted font-mono">Chief Forensics</p>
          </div>
        </div>
      </div>
    </header>
  );
}
