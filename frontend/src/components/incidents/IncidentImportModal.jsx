import React, { useState } from 'react';
import { X, UploadCloud, FileCheck, AlertCircle, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IncidentImportModal({ onClose, onImportIncidents }) {
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sample GeoJSON test fixture
  const sampleGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
          region: "Arabian Sea (Kochi Approach)",
          time: new Date().toUTCString().slice(5, 22) + " UTC",
          areaKm2: 15.3,
          perimeterKm: 21.0,
          confidence: 97.2,
          risk: "CRITICAL",
          status: "Investigating",
          satellite: "Sentinel-1 SAR",
          topCandidate: "M/V Amber Glory",
          vesselsCount: 7
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[75.8, 9.9], [76.1, 9.9], [76.1, 10.1], [75.8, 10.1], [75.8, 9.9]]]
        }
      },
      {
        type: "Feature",
        properties: {
          id: `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
          region: "Bay of Bengal (Chennai Coastal)",
          time: new Date().toUTCString().slice(5, 22) + " UTC",
          areaKm2: 7.8,
          perimeterKm: 12.5,
          confidence: 93.8,
          risk: "HIGH",
          status: "Active Drift",
          satellite: "Sentinel-2 MSI",
          topCandidate: "Cosco Prosperity",
          vesselsCount: 4
        },
        geometry: {
          type: "Polygon",
          coordinates: [[[80.4, 13.0], [80.7, 13.0], [80.7, 13.3], [80.4, 13.3], [80.4, 13.0]]]
        }
      }
    ]
  };

  const parseFileContent = (content, name) => {
    setErrorMsg("");
    try {
      if (name.endsWith('.geojson') || name.endsWith('.json')) {
        const json = JSON.parse(content);
        let items = [];

        if (json.type === "FeatureCollection" && Array.isArray(json.features)) {
          items = json.features.map((f, i) => {
            const p = f.properties || {};
            let coordsDisplay = "14.82°N, 68.21°E";
            if (f.geometry && f.geometry.coordinates && f.geometry.coordinates[0] && f.geometry.coordinates[0][0]) {
              const [lng, lat] = f.geometry.coordinates[0][0];
              coordsDisplay = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
            }
            return {
              id: p.id || `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
              time: p.time || new Date().toUTCString().slice(5, 22) + " UTC",
              location: coordsDisplay,
              region: p.region || "Indian EEZ Maritime Corridor",
              areaKm2: parseFloat(p.areaKm2 || p.spillAreaKm2) || 10.5,
              perimeterKm: parseFloat(p.perimeterKm || p.spillPerimeterKm) || 16.0,
              confidence: parseFloat(p.confidence || p.detectionConfidence) || 94.0,
              risk: (p.risk || p.riskLevel || "HIGH").toUpperCase(),
              status: p.status || "Investigating",
              satellite: p.satellite || "Sentinel-1 SAR",
              topCandidate: p.topCandidate || "Unknown Vessel",
              vesselsCount: parseInt(p.vesselsCount) || 5,
              flagEmoji: "🇮🇳"
            };
          });
        } else if (Array.isArray(json)) {
          items = json.map(item => ({
            ...item,
            id: item.id || `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
            areaKm2: parseFloat(item.areaKm2) || 10.0,
            confidence: parseFloat(item.confidence) || 90.0,
            flagEmoji: item.flagEmoji || "🇮🇳"
          }));
        } else {
          throw new Error("Invalid GeoJSON/JSON structure. Expected FeatureCollection or Array.");
        }

        setParsedData(items);
        setFileName(name);
      } else if (name.endsWith('.csv')) {
        // Simple CSV parser
        const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("CSV file contains no data rows.");
        const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim().toLowerCase());
        
        const items = lines.slice(1).map((line, idx) => {
          const parts = line.split(',').map(p => p.replace(/["']/g, '').trim());
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = parts[i];
          });
          return {
            id: obj.id || `OF-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
            time: obj.time || new Date().toUTCString().slice(5, 22) + " UTC",
            location: obj.coordinates || obj.location || "14.82°N, 68.21°E",
            region: obj.region || "Arabian Sea",
            areaKm2: parseFloat(obj.area || obj.areakm2) || 12.0,
            perimeterKm: parseFloat(obj.perimeter || obj.perimeterkm) || 18.0,
            confidence: parseFloat(obj.confidence) || 95.0,
            risk: (obj.risk || "HIGH").toUpperCase(),
            status: obj.status || "Investigating",
            satellite: obj.satellite || "Sentinel-1 SAR",
            topCandidate: obj.candidate || obj.topcandidate || "M/V Unidentified",
            vesselsCount: parseInt(obj.vessels) || 4,
            flagEmoji: "🇮🇳"
          };
        });
        setParsedData(items);
        setFileName(name);
      } else {
        throw new Error("Unsupported format. Please upload .geojson, .json, or .csv file.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to parse file.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      parseFileContent(event.target.result, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    parseFileContent(JSON.stringify(sampleGeoJSON, null, 2), "sample_coastal_surveillance.geojson");
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0) return;
    onImportIncidents(parsedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-border-marine flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-sm">Import Incidents to Forensic Registry</h3>
              <p className="text-xs text-text-muted">Upload GIS GeoJSON polygons, JSON dossiers, or CSV detection logs.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg border border-border-marine hover:bg-white text-text-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="p-5 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => parseFileContent(ev.target.result, file.name);
                reader.readAsText(file);
              }
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              dragActive ? 'border-ocean bg-ocean-light/30' : 'border-border-marine hover:border-ocean/60 bg-slate-50'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-ocean mx-auto mb-2 opacity-80" />
            <div className="text-xs font-semibold text-ocean-navy">
              Drag & Drop your GIS file here, or{' '}
              <label className="text-ocean underline cursor-pointer hover:text-ocean-deep">
                Browse
                <input type="file" accept=".geojson,.json,.csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <p className="text-[11px] text-text-muted mt-1">Supports GeoJSON (.geojson), JSON (.json), and CSV (.csv)</p>
          </div>

          {/* Quick Sample Button */}
          <div className="flex items-center justify-between bg-ocean-light/40 border border-ocean/20 p-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-ocean-deep font-medium">
              <FileCode className="w-4 h-4 text-ocean" />
              <span>Don't have a file ready? Test with synthetic radar observation:</span>
            </div>
            <button
              onClick={handleLoadSample}
              className="px-3 py-1 rounded-lg bg-white border border-ocean/30 text-ocean hover:bg-ocean hover:text-white font-bold text-xs transition-colors"
            >
              Load Sample GeoJSON
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-status-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ocean-navy font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Parsed {parsedData.length} valid incident(s) from {fileName}</span>
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-border-marine rounded-xl overflow-hidden">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-text-muted font-mono uppercase text-[9px]">
                    <tr>
                      <th className="p-2">ID</th>
                      <th className="p-2">Region</th>
                      <th className="p-2">Area</th>
                      <th className="p-2">Risk</th>
                      <th className="p-2">Candidate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-marine font-mono">
                    {parsedData.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-ocean-deep">{d.id}</td>
                        <td className="p-2 font-sans truncate max-w-[120px]">{d.region}</td>
                        <td className="p-2">{d.areaKm2} km²</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            d.risk === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {d.risk}
                          </span>
                        </td>
                        <td className="p-2 truncate max-w-[120px]">{d.topCandidate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-marine bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-border-marine text-xs text-text-secondary hover:bg-white"
          >
            Cancel
          </button>
          <button
            disabled={parsedData.length === 0}
            onClick={handleConfirmImport}
            className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-sm transition-all"
          >
            Import {parsedData.length} Dossiers into Registry
          </button>
        </div>
      </div>
    </div>
  );
}

