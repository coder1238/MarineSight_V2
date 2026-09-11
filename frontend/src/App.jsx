import React, { useState, useEffect, useCallback } from 'react';
import { IncidentProvider } from './context/IncidentContext';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';

// All 15 Pages
import Page01Landing from './pages/Page01Landing';
import Page02CommandCenter from './pages/Page02CommandCenter';
import Page03LiveMonitor from './pages/Page03LiveMonitor';
import Page04Incidents from './pages/Page04Incidents';
import Page05Workspace from './pages/Page05Workspace';
import Page06Satellite from './pages/Page06Satellite';
import Page07Characterize from './pages/Page07Characterize';
import Page08Simulation from './pages/Page08Simulation';
import Page09SourceTrace from './pages/Page09SourceTrace';
import Page10VesselIntel from './pages/Page10VesselIntel';
import Page11Trajectory from './pages/Page11Trajectory';
import Page12Attribution from './pages/Page12Attribution';
import Page13EvidenceRisk from './pages/Page13EvidenceRisk';
import Page14ResponsePlan from './pages/Page14ResponsePlan';
import Page15ReportSystem from './pages/Page15ReportSystem';

const VALID_PAGES = [
  "landing",
  "command-center",
  "live-monitor",
  "incidents",
  "workspace",
  "satellite",
  "characterize",
  "simulation",
  "source-trace",
  "vessel-intel",
  "trajectory",
  "attribution",
  "evidence-risk",
  "response-plan",
  "report-system"
];

function getPageFromUrl() {
  if (typeof window === 'undefined') return 'command-center';

  // 1. Support Hash URL (e.g. #/incidents or #incidents)
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (VALID_PAGES.includes(hash)) return hash;

  // 2. Support HTML5 Pathname (e.g. /incidents or /workspace)
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').trim().toLowerCase();
  if (VALID_PAGES.includes(path)) return path;
  if (path === '' || path === 'landing') return 'landing';

  return 'command-center';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Navigate to page and sync browser address bar URL
  const navigateTo = useCallback((pageId) => {
    const targetPage = VALID_PAGES.includes(pageId) ? pageId : 'command-center';
    setCurrentPage(targetPage);
    setMobileSidebarOpen(false);

    const targetPath = targetPage === 'landing' ? '/' : `/${targetPage}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: targetPage }, '', targetPath);
    }
  }, []);

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const page = getPageFromUrl();
      setCurrentPage(page);
      setMobileSidebarOpen(false);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Ensure initial URL reflects current page
    const initialPage = getPageFromUrl();
    const initialPath = initialPage === 'landing' ? '/' : `/${initialPage}`;
    if (window.location.pathname !== initialPath && !window.location.hash) {
      window.history.replaceState({ page: initialPage }, '', initialPath);
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleGlobalSearch = (query) => {
    const q = query.toLowerCase().trim();
    if (q.includes("star") || q.includes("vessel") || q.includes("419001248") || q.includes("9876543")) {
      navigateTo("vessel-intel");
    } else if (q.includes("incident") || q.includes("0912") || q.includes("0921") || q.includes("spill")) {
      navigateTo("workspace");
    } else if (q.includes("satellite") || q.includes("sar") || q.includes("sentinel")) {
      navigateTo("satellite");
    } else if (q.includes("drift") || q.includes("simulation")) {
      navigateTo("simulation");
    } else if (q.includes("report") || q.includes("dossier")) {
      navigateTo("report-system");
    } else if (q.includes("monitor") || q.includes("live")) {
      navigateTo("live-monitor");
    } else {
      navigateTo("command-center");
    }
  };

  // Render dedicated full-screen layout for landing page
  if (currentPage === "landing") {
    return (
      <IncidentProvider>
        <div className="min-h-screen bg-ocean-light">
          <Page01Landing onNavigate={navigateTo} />
        </div>
      </IncidentProvider>
    );
  }

  // Render standard command platform application shell for all other 14 operational pages
  return (
    <IncidentProvider>
      <div className="flex min-h-screen bg-ocean-light relative overflow-x-hidden">
        {/* Navigation Sidebar (Desktop sticky + Mobile slide-over drawer) */}
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={navigateTo} 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
          {/* Top Header */}
          <TopHeader 
            currentPage={currentPage} 
            setCurrentPage={navigateTo}
            onSearch={handleGlobalSearch}
            onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* Dynamic Page Container */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
            {currentPage === "command-center" && <Page02CommandCenter onNavigate={navigateTo} />}
            {currentPage === "live-monitor" && <Page03LiveMonitor onNavigate={navigateTo} />}
            {currentPage === "incidents" && <Page04Incidents onNavigate={navigateTo} />}
            {currentPage === "workspace" && <Page05Workspace onNavigate={navigateTo} />}
            {currentPage === "satellite" && <Page06Satellite onNavigate={navigateTo} />}
            {currentPage === "characterize" && <Page07Characterize onNavigate={navigateTo} />}
            {currentPage === "simulation" && <Page08Simulation onNavigate={navigateTo} />}
            {currentPage === "source-trace" && <Page09SourceTrace onNavigate={navigateTo} />}
            {currentPage === "vessel-intel" && <Page10VesselIntel onNavigate={navigateTo} />}
            {currentPage === "trajectory" && <Page11Trajectory onNavigate={navigateTo} />}
            {currentPage === "attribution" && <Page12Attribution onNavigate={navigateTo} />}
            {currentPage === "evidence-risk" && <Page13EvidenceRisk onNavigate={navigateTo} />}
            {currentPage === "response-plan" && <Page14ResponsePlan onNavigate={navigateTo} />}
            {currentPage === "report-system" && <Page15ReportSystem onNavigate={navigateTo} />}
          </main>
        </div>
      </div>
    </IncidentProvider>
  );
}
