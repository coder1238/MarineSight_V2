import React from 'react';
import { 
  Radar, 
  Activity, 
  AlertTriangle, 
  FolderKanban, 
  Satellite, 
  Layers, 
  Waves, 
  Compass, 
  Ship, 
  GitBranch, 
  Target, 
  ShieldAlert, 
  LifeBuoy, 
  FileText, 
  Database, 
  Cpu, 
  ChevronLeft, 
  ChevronRight,
  Home,
  X
} from 'lucide-react';

import MarineSightLogo from '../common/MarineSightLogo';

export default function Sidebar({ 
  currentPage, 
  setCurrentPage, 
  collapsed, 
  setCollapsed,
  mobileOpen = false,
  setMobileOpen
}) {
  const navSections = [
    {
      title: "OPERATIONS",
      items: [
        { id: "command-center", label: "Overview", icon: Radar, pageNum: "02" },
        { id: "live-monitor", label: "Live Monitor", icon: Activity, pageNum: "03" },
        { id: "incidents", label: "Incidents", icon: AlertTriangle, pageNum: "04" },
        { id: "workspace", label: "Investigation Hub", icon: FolderKanban, pageNum: "05" },
      ]
    },
    {
      title: "ANALYSIS",
      items: [
        { id: "satellite", label: "Satellite SAR", icon: Satellite, pageNum: "06" },
        { id: "characterize", label: "Spill Profiling", icon: Layers, pageNum: "07" },
        { id: "simulation", label: "Drift Simulation", icon: Waves, pageNum: "08" },
        { id: "source-trace", label: "Source Hindcast", icon: Compass, pageNum: "09" },
        { id: "vessel-intel", label: "Vessel Intelligence", icon: Ship, pageNum: "10" },
        { id: "trajectory", label: "Trajectory Analysis", icon: GitBranch, pageNum: "11" },
        { id: "attribution", label: "Attribution Score", icon: Target, pageNum: "12" },
      ]
    },
    {
      title: "RESPONSE",
      items: [
        { id: "evidence-risk", label: "Risk Assessment", icon: ShieldAlert, pageNum: "13" },
        { id: "response-plan", label: "Response Planning", icon: LifeBuoy, pageNum: "14" },
        { id: "report-system", label: "Forensic Report", icon: FileText, pageNum: "15" },
      ]
    },
    {
      title: "PLATFORM",
      items: [
        { id: "landing", label: "Product Landing", icon: Home, pageNum: "01" },
      ]
    }
  ];

  const handleNavClick = (pageId, e) => {
    e.preventDefault();
    setCurrentPage(pageId);
    if (setMobileOpen) setMobileOpen(false);
  };

  // Lock background body scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen && setMobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  // Touch swipe-to-close gesture on mobile drawer
  const touchStartXRef = React.useRef(null);
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartXRef.current;
    if (diff < -50) {
      if (setMobileOpen) setMobileOpen(false);
      touchStartXRef.current = null;
    }
  };
  const handleTouchEnd = () => {
    touchStartXRef.current = null;
  };

  return (
    <>
      {/* Mobile Drawer Backdrop: Clean neutral dimming without blurring or coloring the drawer */}
      <div 
        onClick={() => setMobileOpen && setMobileOpen(false)}
        style={{ zIndex: 9990 }}
        className={`fixed inset-0 bg-black/40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      />

      {/* Desktop spacer to reserve space in flex layout for fixed sidebar */}
      <div 
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Container: Fixed on both mobile and desktop so it NEVER moves on scroll */}
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ zIndex: mobileOpen ? 9999 : 30 }}
        className={`
          bg-white/95 backdrop-blur-xl border-r border-border-marine/90 flex flex-col select-none shadow-marine-sm
          fixed inset-y-0 left-0 h-screen
          w-72 max-w-[85vw] lg:max-w-none
          ${collapsed ? 'lg:w-16' : 'lg:w-64'}
          transform transition-transform duration-300 ease-in-out lg:transition-[width]
          ${mobileOpen ? 'translate-x-0 shadow-2xl ring-1 ring-black/10' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Platform Sidebar Navigation"
      >
        {/* Brand Header */}
        <div className={`border-b border-border-marine min-h-[64px] bg-white/90 backdrop-blur-md flex items-center ${
          collapsed ? 'lg:flex-col lg:justify-center lg:py-2.5 lg:px-1' : 'p-3 justify-between'
        }`}>
          {/* Expanded view (Desktop) & Full view (Mobile) */}
          <div className={`items-center justify-between w-full min-w-0 ${collapsed ? 'lg:hidden flex' : 'flex'}`}>
            <a 
              href="/"
              onClick={(e) => handleNavClick("landing", e)} 
              className="flex items-center gap-2 text-left focus:outline-none overflow-hidden cursor-pointer flex-1 min-w-0"
              title="MarineSight Platform"
            >
              <MarineSightLogo collapsed={false} />
            </a>

            {/* Desktop Collapse Toggle (Visible when expanded) */}
            <button 
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex text-text-muted hover:text-ocean p-1.5 rounded-md hover:bg-ocean-sky transition-colors shrink-0 ml-1"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="lg:hidden text-text-muted hover:text-ocean-navy p-2 rounded-xl bg-ocean-light hover:bg-ocean-sky active:scale-95 transition-all shrink-0 ml-2"
              title="Close Menu"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-ocean-navy" />
            </button>
          </div>

          {/* Desktop Collapsed View: Centered 40x40 Logo Mark + Expand Arrow */}
          {collapsed && (
            <div className="hidden lg:flex flex-col items-center justify-center w-full gap-1">
              <a
                href="/"
                onClick={(e) => handleNavClick("landing", e)}
                className="focus:outline-none flex items-center justify-center cursor-pointer group"
                title="MarineSight Platform (Click to open landing, or click arrow below to expand)"
              >
                <MarineSightLogo collapsed={true} />
              </a>
              <button 
                onClick={() => setCollapsed(false)}
                className="text-text-muted hover:text-ocean p-1 rounded-md hover:bg-ocean-sky transition-colors flex items-center justify-center"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto overscroll-contain py-3 px-2 space-y-5">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <h2 className={`px-3 text-[10px] font-bold text-text-muted tracking-wider uppercase mb-1.5 ${collapsed ? 'lg:hidden' : ''}`}>
                {sec.title}
              </h2>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`/${item.id}`}
                      onClick={(e) => handleNavClick(item.id, e)}
                      title={collapsed ? `${item.pageNum} - ${item.label}` : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-ocean text-white shadow-marine-sm font-semibold' 
                          : 'text-text-secondary hover:text-ocean-deep hover:bg-ocean-sky'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-ocean'}`} />
                      <span className={`truncate flex-1 text-left flex items-center justify-between ${collapsed ? 'lg:hidden' : ''}`}>
                        <span>{item.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-ocean-sky text-ocean-deep'}`}>
                          {item.pageNum}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Status Pill */}
        <div className="p-3 border-t border-border-marine bg-ocean-light/60">
          <div className={`flex items-center justify-between text-[11px] ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
              <span className="text-text-secondary font-medium">Sentinel-1 Ingest</span>
            </div>
            <span className="font-mono text-ocean text-[10px] font-semibold">LIVE</span>
          </div>
          {collapsed && (
            <div className="hidden lg:flex justify-center" title="Systems Online">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success"></span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
