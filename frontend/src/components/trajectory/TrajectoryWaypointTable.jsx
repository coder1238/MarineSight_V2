import React, { useState, useMemo } from 'react';
import { Table, Search, Filter, Download, AlertTriangle, CheckCircle2, ChevronDown, Radio } from 'lucide-react';
import { TELEMETRY_POINTS } from './trajectoryData';

export default function TrajectoryWaypointTable({ currentPointIndex, onSelectPoint }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPoints = useMemo(() => {
    return TELEMETRY_POINTS.filter((p) => {
      const matchesSearch = 
        p.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.anomaly.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (filterStatus === "all") return true;
      if (filterStatus === "observed") return p.status === "observed";
      if (filterStatus === "gap") return p.status === "reconstructed" || p.status === "blackout_start" || p.status === "blackout_end" || p.status === "spill_intersection";
      if (filterStatus === "forecast") return p.status === "forecast";
      if (filterStatus === "anomaly") return p.anomaly !== "none" && p.anomaly !== "predicted_track";
      return true;
    });
  }, [searchQuery, filterStatus]);

  const handleExportCsv = () => {
    const headers = ["Index", "Timestamp_UTC", "Latitude", "Longitude", "SOG_kn", "COG_deg", "ROT_deg_min", "Accel_mps2", "Source", "Status", "Anomaly"];
    const rows = TELEMETRY_POINTS.map(p => [
      p.index,
      `"${p.time}"`,
      p.lat,
      p.lng,
      p.sog,
      p.cog,
      p.rot,
      p.acc,
      `"${p.source}"`,
      `"${p.status}"`,
      `"${p.anomaly}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AIS_Trajectory_Telemetry_Forensics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Chronological Waypoint Telemetry Log
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-sky text-ocean font-bold">
            {filteredPoints.length} Points Filtered
          </span>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Court CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 font-mono text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by UTC timestamp, radar source, or anomaly flag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-ocean-light/50 border border-border-marine rounded-xl text-ocean-navy placeholder-text-muted text-xs focus:outline-none focus:ring-1 focus:ring-ocean"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Points" },
            { id: "observed", label: "Observed AIS" },
            { id: "gap", label: "Blackout Gap" },
            { id: "anomaly", label: "Anomalies Only" },
            { id: "forecast", label: "RNN Forecast" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-ocean text-white'
                  : 'bg-ocean-light border border-border-marine text-text-secondary hover:text-ocean-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="max-h-72 overflow-y-auto border border-border-marine rounded-xl">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="sticky top-0 bg-ocean-light border-b border-border-marine text-text-secondary text-[10px]">
            <tr>
              <th className="py-2 px-2.5 font-bold">#</th>
              <th className="py-2 px-2.5 font-bold">TIME (UTC)</th>
              <th className="py-2 px-2.5 font-bold">POSITION</th>
              <th className="py-2 px-2.5 font-bold">SOG</th>
              <th className="py-2 px-2.5 font-bold">COG</th>
              <th className="py-2 px-2.5 font-bold">ROT</th>
              <th className="py-2 px-2.5 font-bold">SOURCE</th>
              <th className="py-2 px-2.5 font-bold">ANOMALY FLAG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {filteredPoints.map((p) => {
              const isSelected = p.index - 1 === currentPointIndex;
              const isGap = p.status === "reconstructed" || p.status === "blackout_start" || p.status === "blackout_end" || p.status === "spill_intersection";
              return (
                <tr
                  key={p.index}
                  onClick={() => onSelectPoint(p.index - 1)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-ocean-sky font-bold text-ocean-navy ring-1 ring-inset ring-ocean/40'
                      : isGap
                        ? 'bg-red-50/20 hover:bg-red-50/40'
                        : 'hover:bg-ocean-light/50'
                  }`}
                >
                  <td className="py-1.5 px-2.5 text-text-muted">{p.index}</td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap text-ocean-navy font-bold">{p.time}</td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap text-text-secondary">
                    {p.lat.toFixed(3)}°N, {p.lng.toFixed(3)}°E
                  </td>
                  <td className={`py-1.5 px-2.5 whitespace-nowrap font-bold ${p.sog < 6 ? 'text-status-danger' : 'text-text-primary'}`}>
                    {p.sog} kn
                  </td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap text-text-secondary">{p.cog}°</td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap text-text-secondary">{p.rot}°/m</td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap text-[10px] text-ocean">{p.source}</td>
                  <td className="py-1.5 px-2.5 whitespace-nowrap">
                    {p.anomaly !== "none" ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        p.anomaly.includes("spill") || p.anomaly.includes("shutoff")
                          ? 'bg-red-50 text-status-danger border-red-200'
                          : 'bg-amber-50 text-status-warning border-amber-200'
                      }`}>
                        {p.anomaly.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <span className="text-text-muted text-[10px]">Normal</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

