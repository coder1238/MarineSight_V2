import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Star, Eye, PlusCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function EvidenceMatrixSection({
  evidenceRows,
  selectedVessel,
  onInspectEvidence,
  pinnedIds,
  onTogglePin,
  onOpenCustomModal
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStrength, setSelectedStrength] = useState("ALL");
  const [selectedSource, setSelectedSource] = useState("ALL");
  const [sortField, setSortField] = useState("weight"); // 'weight', 'conf', 'name'
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter & sort logic (Feature 15)
  const filteredRows = useMemo(() => {
    return evidenceRows
      .filter((row) => {
        const matchesQuery =
          row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.source.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStrength =
          selectedStrength === "ALL" || row.strength === selectedStrength;

        const matchesSource =
          selectedSource === "ALL" || row.source.toLowerCase().includes(selectedSource.toLowerCase());

        return matchesQuery && matchesStrength && matchesSource;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === "weight") {
          valA = parseInt(a.weight, 10) || 0;
          valB = parseInt(b.weight, 10) || 0;
        }

        if (sortOrder === "asc") {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [evidenceRows, searchQuery, selectedStrength, selectedSource, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm flex flex-col justify-between font-mono text-xs">
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between pb-2.5 mb-3 border-b border-border-marine gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase">EVIDENCE PROVENANCE MATRIX</span>
              <span className="px-1.5 py-0.2 rounded bg-ocean-sky text-ocean text-[9px] font-bold">
                {filteredRows.length} Items
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-ocean-navy mt-0.5">
              {selectedVessel.name} · MMSI {selectedVessel.mmsi}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCustomModal}
              className="px-2.5 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Finding</span>
            </button>
            <div className="text-right pl-2 border-l border-border-marine">
              <span className="text-[9px] text-text-muted block">SUSPECT SCORE</span>
              <span className="text-lg font-extrabold text-status-danger">
                {selectedVessel.priorityScore || 91} / 100
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar (Feature 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
          {/* Search Query */}
          <div className="sm:col-span-5 relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search evidence finding, radar, AIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy placeholder-text-muted focus:outline-none focus:border-ocean"
            />
          </div>

          {/* Strength Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedStrength}
              onChange={(e) => setSelectedStrength(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
            >
              <option value="ALL">All Strengths</option>
              <option value="VERY HIGH">VERY HIGH</option>
              <option value="HIGH">HIGH</option>
              <option value="MODERATE">MODERATE</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
            >
              <option value="ALL">All Sources</option>
              <option value="Copernicus">Copernicus</option>
              <option value="AIS">AIS Telemetry</option>
              <option value="SAR">Sentinel SAR</option>
              <option value="Siamese">Siamese Model</option>
            </select>
          </div>
        </div>

        {/* Evidence Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ocean-light border-b border-border-marine text-[9px] text-text-muted uppercase">
              <tr>
                <th className="px-2 py-2 w-8 text-center">PIN</th>
                <th 
                  onClick={() => toggleSort("name")}
                  className="px-2 py-2 cursor-pointer hover:text-ocean-navy select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>EVIDENCE ITEM</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-2 py-2">FINDING DETAIL</th>
                <th className="px-2 py-2">STRENGTH</th>
                <th 
                  onClick={() => toggleSort("conf")}
                  className="px-2 py-2 cursor-pointer hover:text-ocean-navy select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>CONF</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort("weight")}
                  className="px-2 py-2 text-right cursor-pointer hover:text-ocean-navy select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>WEIGHT</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-2 py-2 text-center">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-marine/50">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-text-muted">
                    No forensic evidence items match the search query.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, i) => {
                  const isPinned = pinnedIds.includes(row.name);
                  return (
                    <tr 
                      key={row.name || i} 
                      className="hover:bg-ocean-sky/30 transition-colors group cursor-pointer"
                      onClick={() => onInspectEvidence(row)}
                    >
                      {/* Pin Button (Feature 20) */}
                      <td className="px-2 py-2 text-center" onClick={(e) => { e.stopPropagation(); onTogglePin(row.name); }}>
                        <button className="text-amber-400 hover:scale-125 transition-transform focus:outline-none">
                          <Star className={`w-3.5 h-3.5 ${isPinned ? "fill-amber-400 text-amber-500" : "text-slate-300 hover:text-amber-400"}`} />
                        </button>
                      </td>

                      <td className="px-2 py-2 font-bold text-ocean-navy">
                        <div className="flex items-center gap-1">
                          <span>{row.name}</span>
                          {row.isCustom && (
                            <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-700 text-[8px] font-bold">CUSTOM</span>
                          )}
                        </div>
                        <span className="text-[9px] text-text-muted block font-normal">{row.source}</span>
                      </td>

                      <td className="px-2 py-2 text-[11px] text-text-secondary max-w-xs truncate">
                        {row.value}
                      </td>

                      <td className="px-2 py-2">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          row.strength === 'VERY HIGH'
                            ? 'bg-red-100 text-status-danger'
                            : row.strength === 'HIGH'
                            ? 'bg-amber-100 text-status-warning'
                            : 'bg-slate-100 text-text-secondary'
                        }`}>
                          {row.strength}
                        </span>
                      </td>

                      <td className="px-2 py-2 text-status-success font-bold">
                        {row.conf}%
                      </td>

                      <td className="px-2 py-2 text-right font-bold text-ocean">
                        {row.weight}
                      </td>

                      <td className="px-2 py-2 text-center" onClick={(e) => { e.stopPropagation(); onInspectEvidence(row); }}>
                        <span className="p-1 rounded hover:bg-ocean-sky text-ocean inline-flex items-center">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Provenance */}
      <div className="mt-3 pt-2.5 border-t border-border-marine flex flex-wrap items-center justify-between text-[11px] font-mono text-text-muted gap-2">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-ocean" />
          MULTIMODAL FUSION: SENTINEL-1 + AIS + CMEMS + XGBOOST + STSN v2.8
        </span>
        <span className="text-status-success font-bold">
          100% CRYPTOGRAPHICALLY AUDITABLE
        </span>
      </div>
    </div>
  );
}

