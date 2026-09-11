import React, { useState } from 'react';
import { Download, FileCode, Globe, FileText, Check, ShieldAlert } from 'lucide-react';

export default function ForensicDataExporter({
  oilSpills = [],
  sarVessels = [],
  activeConstellation = "s1",
  coordinates = { lat: 14.8214, lng: 68.2108 }
}) {
  const [copiedFormat, setCopiedFormat] = useState(null);

  // 1. Generate standard GeoJSON FeatureCollection
  const generateGeoJson = () => {
    const features = [];

    // Add oil spills
    oilSpills.forEach((s) => {
      const coords = (s.points || []).map(p => [
        +(coordinates.lng + (p.x - 500) * 0.0007).toFixed(5),
        +(coordinates.lat - (p.y - 300) * 0.0007).toFixed(5)
      ]);
      // Close polygon ring if open
      if (coords.length > 0 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
        coords.push([...coords[0]]);
      }

      features.push({
        type: "Feature",
        id: s.id,
        properties: {
          feature_type: "hydrocarbon_oil_spill",
          confidence_pct: s.confidence,
          area_km2: s.areaKm2,
          perimeter_km: s.perimeterKm,
          hydrocarbon_type: s.hydrocarbonType,
          satellite_source: activeConstellation.toUpperCase(),
          timestamp_utc: new Date().toISOString()
        },
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        }
      });
    });

    // Add vessels
    sarVessels.forEach((v) => {
      const cx = v.canvasPos?.x || 500;
      const cy = v.canvasPos?.y || 300;
      features.push({
        type: "Feature",
        id: v.id,
        properties: {
          feature_type: "sar_vessel_contact",
          vessel_length_m: v.lengthM,
          ais_correlation: v.corr,
          confidence_pct: v.conf,
          rcs_db: v.rcs,
          high_priority_suspect: v.highPriority
        },
        geometry: {
          type: "Point",
          coordinates: [
            +(coordinates.lng + (cx - 500) * 0.0007).toFixed(5),
            +(coordinates.lat - (cy - 300) * 0.0007).toFixed(5)
          ]
        }
      });
    });

    return JSON.stringify({
      type: "FeatureCollection",
      name: `MarineSight_SAR_Dossier_${Date.now()}`,
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
      },
      features
    }, null, 2);
  };

  // 2. Generate Google Earth KML
  const generateKml = () => {
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>MarineSight Satellite Delineation</name>
    <description>SAR Synthetic Aperture Radar Oil Spill &amp; Vessel Contacts</description>
    <Style id="slickStyle">
      <PolyStyle>
        <color>7f00e5ff</color>
        <outline>1</outline>
      </PolyStyle>
      <LineStyle>
        <color>ff00e5ff</color>
        <width>2.5</width>
      </LineStyle>
    </Style>
`;

    oilSpills.forEach((s) => {
      const coordsStr = (s.points || []).map(p => {
        const lng = +(coordinates.lng + (p.x - 500) * 0.0007).toFixed(5);
        const lat = +(coordinates.lat - (p.y - 300) * 0.0007).toFixed(5);
        return `${lng},${lat},0`;
      }).join(" ");

      kmlContent += `    <Placemark>
      <name>${s.id} (${s.areaKm2} km²)</name>
      <description>Confidence: ${s.confidence}% | Type: ${s.hydrocarbonType}</description>
      <styleUrl>#slickStyle</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordsStr}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>\n`;
    });

    kmlContent += `  </Document>\n</kml>`;
    return kmlContent;
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 10 · Forensic GIS Data & Evidence Exporter
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean px-2 py-0.5 rounded font-bold border border-border-marine">
          OGC & RFC 7946 Standard
        </span>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <button
          onClick={() => downloadFile(generateGeoJson(), `marinesight_spill_delineation_${Date.now()}.geojson`, 'application/geo+json')}
          className="p-3 bg-ocean-light/40 hover:bg-ocean-sky border border-border-marine rounded-xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-ocean group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-bold text-ocean-navy block text-[11px]">Export GeoJSON</span>
              <span className="text-[9.5px] text-text-muted">RFC 7946 Polygons</span>
            </div>
          </div>
          <Download className="w-3.5 h-3.5 text-ocean" />
        </button>

        <button
          onClick={() => downloadFile(generateKml(), `marinesight_spill_${Date.now()}.kml`, 'application/vnd.google-earth.kml+xml')}
          className="p-3 bg-ocean-light/40 hover:bg-ocean-sky border border-border-marine rounded-xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-ocean group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-bold text-ocean-navy block text-[11px]">Export KML</span>
              <span className="text-[9.5px] text-text-muted">Google Earth Layer</span>
            </div>
          </div>
          <Download className="w-3.5 h-3.5 text-ocean" />
        </button>

        <button
          onClick={() => {
            const geojson = generateGeoJson();
            navigator.clipboard.writeText(geojson);
            setCopiedFormat('geojson');
            setTimeout(() => setCopiedFormat(null), 2500);
          }}
          className="p-3 bg-ocean-light/40 hover:bg-ocean-sky border border-border-marine rounded-xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-ocean group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="font-bold text-ocean-navy block text-[11px]">Copy Raw GeoJSON</span>
              <span className="text-[9.5px] text-text-muted">To System Clipboard</span>
            </div>
          </div>
          {copiedFormat === 'geojson' ? <Check className="w-4 h-4 text-status-success" /> : <Download className="w-3.5 h-3.5 text-ocean" />}
        </button>
      </div>

      <div className="p-2 rounded-xl bg-slate-50 border border-border-marine/50 text-[10.5px] text-text-muted flex items-center justify-between">
        <span>Includes {oilSpills.length} delineated spill polygon(s) &amp; {sarVessels.length} vessel contact point(s).</span>
        <span className="font-bold text-ocean-navy">WGS84 EPSG:4326</span>
      </div>
    </div>
  );
}

