import React from 'react';
import { Search, Filter, ArrowUpDown, X, Scale, FileText, PlusCircle } from 'lucide-react';

export default function VesselSearchBar({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedRisk,
  setSelectedRisk,
  sortBy,
  setSortBy,
  onResetFilters,
  totalCount,
  filteredCount,
  onOpenCompare,
  onOpenDossier,
  onOpenAddVessel
}) {
  const vesselTypes = ["All Types", "Crude Oil Tanker", "Chemical Tanker", "Container Ship", "Bulk Carrier", "General Cargo"];
  const riskLevels = ["All Statuses", "HIGH PRIORITY", "UNDER REVIEW", "MODERATE", "CLEARED"];

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'All Types' || selectedRisk !== 'All Statuses' || sortBy !== 'priority';

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Top Search Line & Action Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate vessels by name, MMSI, IMO, flag or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-ocean-light border border-border-marine rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-ocean/40 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Compare, Dossier, Add Lookup */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={onOpenCompare}
            className="px-3 py-2 rounded-xl bg-ocean-sky border border-ocean/30 text-ocean-deep hover:bg-ocean/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Compare two suspect vessels side-by-side"
          >
            <Scale className="w-3.5 h-3.5 text-ocean" />
            <span>Compare Ships</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="px-3 py-2 rounded-xl bg-ocean-navy text-white hover:bg-ocean-navy/90 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Generate & print intelligence dossier"
          >
            <FileText className="w-3.5 h-3.5 text-ocean-bright" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={onOpenAddVessel}
            className="px-3 py-2 rounded-xl bg-white border border-border-marine text-text-primary hover:bg-ocean-light text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Look up and inject custom MMSI into suspect roster"
          >
            <PlusCircle className="w-3.5 h-3.5 text-status-success" />
            <span>Lookup MMSI</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Type, Risk, Sorting, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Vessel Type Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-ocean-light border border-border-marine rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-ocean"
            >
              {vesselTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-2.5 py-1.5 bg-ocean-light border border-border-marine rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-ocean"
          >
            {riskLevels.map((risk) => (
              <option key={risk} value={risk}>{risk}</option>
            ))}
          </select>

          {/* Sorting */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-ocean-light border border-border-marine rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-ocean"
            >
              <option value="priority">Sort: Priority Score (High → Low)</option>
              <option value="cpa">Sort: Proximity CPA (Closest First)</option>
              <option value="speed">Sort: Speed (Fastest First)</option>
              <option value="gap">Sort: Blackout Duration</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2 py-1 text-status-danger hover:bg-red-50 rounded-lg transition-colors font-medium text-[11px] flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Counter Badge */}
        <div className="text-[11px] text-text-secondary font-mono">
          Showing <span className="font-bold text-ocean-navy">{filteredCount}</span> of <span className="font-bold text-ocean-navy">{totalCount}</span> targets
        </div>
      </div>
    </div>
  );
}

