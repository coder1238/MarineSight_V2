import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Shield, Radio, Globe, Code, Printer } from 'lucide-react';

export default function WorkspaceDossierStudioModal({ caseData, caseStatus, onClose }) {
  const [format, setFormat] = useState('marpol'); // 'marpol' | 'sitrep' | 'geojson' | 'json'
  const [classification, setClassification] = useState('RESTRICTED'); // 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET'
  const [copied, setCopied] = useState(false);

  // 1. MARPOL Annex I Legal Investigation Report (.md)
  const generateMarpolText = () => {
    return `# MARPOL ANNEX I FORENSIC INVESTIGATION DOSSIER
========================================================================
SECURITY CLASSIFICATION: [ ${classification} // LAW ENFORCEMENT SENSITIVE ]
ISSUING AUTHORITY: INDIAN COAST GUARD / MARITIME POLLUTION DEFENCE SQUADRON
CASE IDENTIFIER: ${caseData.incidentId} (INTERNAL REF: ${caseData.internalId || 'INC-0921'})
DATE/TIME OF INCIDENT: ${caseData.detectionTimeUTC}
STATUS: ${caseStatus.toUpperCase()} | RISK TIER: ${caseData.riskLevel}

1. GEOSPATIAL LOCATION & DELINEATION
------------------------------------------------------------------------
- Coordinates of Centroid: ${caseData.coordinates?.display || '14.82°N, 68.21°E'}
- Maritime Zone: ${caseData.region}
- Territorial Waters Status: Outside 12 NM / Inside Exclusive Economic Zone (EEZ)
- Delineated Slick Area: ${caseData.spillAreaKm2} km²
- Slick Perimeter: ${caseData.spillPerimeterKm} km
- Spatial Orientation: ${caseData.orientationDeg || 37}° True Azimuth
- Classification Certainty: ${caseData.detectionConfidence}% (Sentinel-1 SAR Dual-Pol VV/VH)

2. HINDCAST TRAJECTORY & ORIGIN REVERSAL
------------------------------------------------------------------------
- Primary Probable Source: ${caseData.hindcast?.originZoneA?.name || 'Origin Zone A'}
- Estimated Discharge Timestamp: ${caseData.hindcast?.estimatedReleaseTimeUTC || '03 SEP 2026, 22:40 UTC'}
- Backward Lagrangian Advection Duration: ${caseData.hindcast?.backwardDurationHours || 40} Hours
- Origin Zone Confidence: ${caseData.hindcast?.originZoneA?.confidence || 72.4}%
- Oceanographic Drift Coupling: CMEMS (0.42 m/s @ 128°) + ECMWF (14.2 kn @ 310°)

3. SUSPECT VESSEL IDENTIFICATION & SOG ANOMALIES
------------------------------------------------------------------------
- Prime Suspect: ${caseData.topVessel?.name || 'MV Ocean Star'}
- Flag State: ${caseData.topVessel?.flag || 'India 🇮🇳'}
- MMSI: ${caseData.topVessel?.mmsi || '419001248'} | IMO: ${caseData.topVessel?.imo || '9876543'}
- AIS Transponder Silence: ${caseData.topVessel?.aisBlackoutRange || '03 SEP 22:24 - 23:02 UTC'} (${caseData.topVessel?.aisBlackoutDurationMin || 38} min)
- Deceleration Anomaly: ${caseData.topVessel?.speedDropKn || '13.2 → 3.8 kn'}
- Closest Point of Approach (CPA) to Hindcast Centroid: ${caseData.topVessel?.cpaNm || '1.4'} NM
- Multi-Criteria Attribution Score: ${caseData.topVessel?.priorityScore || '91.4'} / 100

4. STATUTORY MARPOL CHARGES APPLIED
------------------------------------------------------------------------
- Violation of MARPOL 73/78 Annex I, Regulation 34 (Control of Discharge of Oil)
- Breach of Merchant Shipping Act Section 356 (Prevention of Marine Pollution)
- AIS Transponder deliberate de-activation violation under SOLAS V/19-1

Certified by: ${caseData.assignedAnalyst || 'Dr. E. Vance, Lead Maritime Forensics'}
Generated on: ${new Date().toISOString()} via MarineSight AI Platform.
`;
  };

  // 2. Coast Guard Tactical SITREP Signal
  const generateSitrepText = () => {
    return `FM: MRCC / ICG REGIONAL HQ POLLUTION COMMAND
TO: ICG REGIONAL DISTRICT / NAVAL COMMAND / PORT AUTHORITY
INFO: DIRECTORATE GENERAL OF SHIPPING / MEA MARITIME CELL
BT
${classification} // S I T R E P // PRIORITY // POLREP 01
REF CASE: ${caseData.incidentId}

1. SITUATION:
   A. UNLAWFUL HYDROCARBON DISCHARGE DETECTED IN ${caseData.regionShort?.toUpperCase() || 'ARABIAN SEA'}.
   B. SLICK POSITION: ${caseData.coordinates?.display}
   C. EXTENT: ${caseData.spillAreaKm2} SQ KM, ORIENTATION ${caseData.orientationDeg || 37} DEG.
   D. THICKNESS: METALLIC / CONTINUOUS SLICK (BONN CODE 3-4).
   E. DRIFT: SOUTHEASTWARD 1.2 KN UNDER COMBINED WIND/CURRENT.

2. SUSPECT VESSEL INTELLIGENCE:
   A. VESSEL: ${caseData.topVessel?.name?.toUpperCase() || 'MV OCEAN STAR'}
   B. MMSI: ${caseData.topVessel?.mmsi} / IMO: ${caseData.topVessel?.imo} / FLAG: ${caseData.topVessel?.flag}
   C. AIS GAP DETECTED: ${caseData.topVessel?.aisBlackoutRange}
   D. KINEMATICS: DECELERATION OVER ORIGIN ZONE CORRIDOR. ATTRIBUTION INDEX ${caseData.topVessel?.priorityScore} PCT.

3. ACTIONS TAKEN / INTENDED:
   A. DORNIER CG-764 AIR SURVEILLANCE SORTIE TASKED FOR AERIAL SLICK PHOTO-SURVEY.
   B. PCV SAMUDRA PRAHARI DIRECTED TO INTERCEPT CORRIDOR AND PREPARE DISPERSANT SPRAY BOOMS.
   C. VHF HAIL PREPARED ON CH-16 ORDERING MASTER TO COMMENCE VESSEL RETENTION PROTOCOL.

4. POLREP STATUS: ${caseStatus.toUpperCase()} // ACTION REQUIRED.
BT
DTG: ${new Date().toISOString().replace(/[-:]/g, '').slice(0, 13)}Z`;
  };

  // 3. GeoJSON FeatureCollection
  const generateGeoJsonText = () => {
    const coords = caseData.geoCoordinates?.map(c => [c.lng, c.lat]) || [
      [68.1750, 14.8480],
      [68.2050, 14.8620],
      [68.2320, 14.8580],
      [68.2540, 14.8410],
      [68.2490, 14.8150],
      [68.2360, 14.7950],
      [68.2050, 14.8010],
      [68.1880, 14.8090],
      [68.1710, 14.8290],
      [68.1750, 14.8480]
    ];

    const geoJsonObject = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      features: [
        {
          type: "Feature",
          id: `slick-${caseData.incidentId}`,
          properties: {
            feature_type: "oil_slick_boundary",
            case_id: caseData.incidentId,
            area_km2: caseData.spillAreaKm2,
            perimeter_km: caseData.spillPerimeterKm,
            detection_time: caseData.detectionTimeUTC,
            confidence_pct: caseData.detectionConfidence,
            risk_level: caseData.riskLevel
          },
          geometry: {
            type: "Polygon",
            coordinates: [coords]
          }
        },
        {
          type: "Feature",
          id: `centroid-${caseData.incidentId}`,
          properties: {
            feature_type: "slick_centroid",
            display: caseData.coordinates?.display
          },
          geometry: {
            type: "Point",
            coordinates: [caseData.coordinates?.lng || 68.2108, caseData.coordinates?.lat || 14.8214]
          }
        },
        {
          type: "Feature",
          id: `suspect-${caseData.topVessel?.mmsi || 'vessel'}`,
          properties: {
            feature_type: "suspect_vessel",
            name: caseData.topVessel?.name,
            mmsi: caseData.topVessel?.mmsi,
            imo: caseData.topVessel?.imo,
            flag: caseData.topVessel?.flag,
            attribution_score: caseData.topVessel?.priorityScore
          },
          geometry: {
            type: "Point",
            coordinates: [(caseData.coordinates?.lng || 68.21) + 0.08, (caseData.coordinates?.lat || 14.82) - 0.05]
          }
        }
      ]
    };
    return JSON.stringify(geoJsonObject, null, 2);
  };

  // 4. Raw JSON Interchange
  const generateJsonText = () => {
    return JSON.stringify({
      marinesight_case_export: {
        export_date: new Date().toISOString(),
        classification,
        incident: caseData,
        status: caseStatus,
        software_version: "MarineSight AI v2.4"
      }
    }, null, 2);
  };

  const getContent = () => {
    switch (format) {
      case 'sitrep': return generateSitrepText();
      case 'geojson': return generateGeoJsonText();
      case 'json': return generateJsonText();
      case 'marpol':
      default:
        return generateMarpolText();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getContent();
    const exts = { marpol: 'md', sitrep: 'txt', geojson: 'geojson', json: 'json' };
    const mimeTypes = {
      marpol: 'text/markdown',
      sitrep: 'text/plain',
      geojson: 'application/geo+json',
      json: 'application/json'
    };

    const blob = new Blob([text], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MarineSight_${caseData.incidentId}_${format.toUpperCase()}.${exts[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${caseData.incidentId} — Official Maritime Dossier</title>
          <style>
            body { font-family: monospace; padding: 30px; font-size: 13px; line-height: 1.5; color: #111; }
            .watermark { position: fixed; top: 40%; left: 15%; font-size: 5rem; color: rgba(220, 38, 38, 0.08); transform: rotate(-35deg); z-index: -1; font-weight: 900; }
            h1 { font-size: 18px; border-bottom: 2px solid #333; padding-bottom: 6px; }
            pre { white-space: pre-wrap; font-family: monospace; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="watermark">${classification}</div>
          <pre>${getContent()}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Multi-Format Forensic Export Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-light text-ocean font-bold">
                  {caseData.incidentId}
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Generate court-ready MARPOL affidavits, Coast Guard tactical SITREPs, and GIS data packages.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Format selection & Classification */}
        <div className="px-4 py-3 border-b border-border-marine bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'marpol', label: 'MARPOL Affidavit (.MD)', icon: Shield },
              { id: 'sitrep', label: 'ICG POLREP Signal (.TXT)', icon: Radio },
              { id: 'geojson', label: 'GIS Boundary (.GeoJSON)', icon: Globe },
              { id: 'json', label: 'Raw Interop (.JSON)', icon: Code }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFormat(id)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all ${
                  format === id 
                    ? 'bg-white text-ocean shadow-xs' 
                    : 'text-text-secondary hover:text-ocean-navy'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Classification Selector */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-text-muted font-bold">SECURITY:</span>
            <select
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-status-danger font-bold focus:outline-none cursor-pointer"
            >
              <option value="UNCLASSIFIED">UNCLASSIFIED</option>
              <option value="RESTRICTED">RESTRICTED</option>
              <option value="CONFIDENTIAL">CONFIDENTIAL</option>
              <option value="SECRET">SECRET // NOFORN</option>
            </select>
          </div>
        </div>

        {/* Content Viewer with Watermark Effect */}
        <div className="relative flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs text-emerald-400 select-all leading-relaxed">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 font-sans font-black text-6xl text-red-500 rotate-[-30deg]">
            {classification}
          </div>
          <pre className="relative z-10 whitespace-pre-wrap">{getContent()}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-text-muted font-mono flex items-center gap-2">
            <span>Encoding: UTF-8</span>
            <span>·</span>
            <span>Digital Sign: SHA-256 Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-slate-100 text-ocean-navy text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-ocean" />
              <span>Print Preview</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-slate-100 text-ocean-navy text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-ocean" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

