import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Map as MapIcon, 
  Satellite, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Navigation,
  Anchor,
  Radio
} from 'lucide-react';

export default function AttributionMap({ 
  caseData, 
  selectedVessel, 
  scrubHour = 0, // 0 (now) to -36 (hindcast start)
  height = "h-[420px]"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlayGroupRef = useRef(null);
  const scrubberMarkerRef = useRef(null);
  const [mapType, setMapType] = useState('nautical'); // 'nautical', 'satellite', 'osm'
  const [mapReady, setMapReady] = useState(false);

  const [layers, setLayers] = useState({
    originZone: true,
    vesselTrack: true,
    blackoutGap: true,
    rangeRings: true,
    driftParticles: true
  });

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  // Fallback lat/lng
  const centerLat = caseData?.slickCoordinates?.[0] || caseData?.lat || 15.1200;
  const centerLng = caseData?.slickCoordinates?.[1] || caseData?.lng || 69.1500;

  // Initialize Leaflet
  useEffect(() => {
    let map = null;
    let timer = null;

    function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (typeof window === 'undefined' || !window.L) {
        timer = setTimeout(initLeaflet, 150);
        return;
      }
      const L = window.L;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 9,
          zoomControl: false,
          attributionControl: false
        });

        const overlayGroup = L.layerGroup().addTo(map);
        overlayGroupRef.current = overlayGroup;

        const tileUrl = mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : mapType === 'osm'
          ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

        L.tileLayer(tileUrl, { maxZoom: 18, subdomains: 'abc' }).addTo(map);

        if (mapType === 'nautical') {
          L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            maxZoom: 18,
            opacity: 0.8
          }).addTo(map);
        }

        mapInstanceRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.error("AttributionMap init error:", err);
      }
    }

    initLeaflet();

    return () => {
      if (timer) clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapType, centerLat, centerLng]);

  // Render vector layers
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !overlayGroupRef.current || !window.L) return;
    const L = window.L;
    const overlayGroup = overlayGroupRef.current;
    overlayGroup.clearLayers();

    // 1. Origin Zone A (Ellipse / Polygon)
    if (layers.originZone) {
      const originCircle = L.circle([centerLat, centerLng], {
        radius: 3500, // 3.5 km
        color: '#FF3B30',
        fillColor: '#FF3B30',
        fillOpacity: 0.18,
        weight: 2,
        dashArray: '4, 4'
      }).addTo(overlayGroup);

      originCircle.bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #0B2942;">
          <strong style="color: #FF3B30; font-size: 12px;">★ SLICK ORIGIN ZONE A</strong><br/>
          <span>Coordinates: ${centerLat.toFixed(4)}°N, ${centerLng.toFixed(4)}°E</span><br/>
          <span>Hindcast Release Window: T-14h ± 2h</span><br/>
          <span>Estimated Spill Volume: 48.2 Metric Tons</span>
        </div>
      `);

      // Backward drift track from observed spill centroid to origin
      const driftPath = [
        [centerLat + 0.12, centerLng + 0.16],
        [centerLat + 0.07, centerLng + 0.09],
        [centerLat, centerLng]
      ];
      L.polyline(driftPath, {
        color: '#00E5FF',
        weight: 2.5,
        dashArray: '6, 6',
        opacity: 0.9
      }).addTo(overlayGroup).bindTooltip("Backward Hydrodynamic Drift Reversal (40h)", { sticky: true });
    }

    // 2. Range Rings
    if (layers.rangeRings) {
      [5, 15, 25].forEach((nm) => {
        const meters = nm * 1852;
        L.circle([centerLat, centerLng], {
          radius: meters,
          color: '#38BDF8',
          fill: false,
          weight: 1,
          opacity: 0.35,
          dashArray: '2, 6'
        }).addTo(overlayGroup);

        L.marker([centerLat + (nm * 0.0166), centerLng], {
          icon: L.divIcon({
            className: 'range-label',
            html: `<div style="font-family: monospace; font-size: 9px; color: #38BDF8; background: rgba(11,41,66,0.7); padding: 1px 4px; border-radius: 4px;">${nm} NM BUFFER</div>`,
            iconSize: [60, 14],
            iconAnchor: [30, 7]
          })
        }).addTo(overlayGroup);
      });
    }

    // 3. Suspect Vessel Track & AIS Blackout Gap
    const v = selectedVessel || caseData?.topVessel || {};
    const baseLat = v.pos?.lat || centerLat;
    const baseLng = v.pos?.lng || centerLng;

    // Generate multi-waypoint reconstructed track
    const preGapTrack = [
      [baseLat - 0.28, baseLng - 0.35],
      [baseLat - 0.18, baseLng - 0.22],
      [baseLat - 0.08, baseLng - 0.10]
    ];
    // Gap Corridor passing through Origin Zone
    const gapTrack = [
      [baseLat - 0.08, baseLng - 0.10],
      [centerLat + 0.01, centerLng + 0.02],
      [baseLat + 0.06, baseLng + 0.09]
    ];
    // Post reconnect track
    const postGapTrack = [
      [baseLat + 0.06, baseLng + 0.09],
      [baseLat + 0.16, baseLng + 0.20],
      [baseLat + 0.24, baseLng + 0.31]
    ];

    if (layers.vesselTrack) {
      // Normal AIS track segments
      L.polyline(preGapTrack, { color: '#087EA4', weight: 3.5, opacity: 0.85 }).addTo(overlayGroup);
      L.polyline(postGapTrack, { color: '#087EA4', weight: 3.5, opacity: 0.85 }).addTo(overlayGroup);

      // Waypoint pings
      [...preGapTrack, ...postGapTrack].forEach((pt, i) => {
        L.circleMarker(pt, {
          radius: 3.5,
          color: '#FFFFFF',
          fillColor: '#087EA4',
          fillOpacity: 1,
          weight: 1.5
        }).addTo(overlayGroup).bindTooltip(`AIS Ping #${i + 1}`, { sticky: true });
      });
    }

    // Blackout Gap Corridor
    if (layers.blackoutGap) {
      L.polyline(gapTrack, {
        color: '#FF3B30',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.95
      }).addTo(overlayGroup).bindTooltip("⚠️ AIS SILENCE GAP (38 min, Dead Reckoning)", { sticky: true });

      // Closest Point of Approach (CPA) Marker
      const cpaPt = [centerLat + 0.01, centerLng + 0.02];
      const cpaIcon = L.divIcon({
        className: 'cpa-marker',
        html: `
          <div style="background: #FF3B30; color: white; border: 2px solid white; border-radius: 9999px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 0 12px rgba(255,59,48,0.8);">
            !
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker(cpaPt, { icon: cpaIcon }).addTo(overlayGroup).bindPopup(`
        <div style="font-family: monospace; font-size: 11px; color: #0B2942;">
          <strong style="color: #FF3B30;">⚠️ CLOSEST POINT OF APPROACH (CPA)</strong><br/>
          <span>Target: <strong>${v.name || 'Suspect Vessel'}</strong></span><br/>
          <span>Distance to Origin: <strong>1.4 NM</strong></span><br/>
          <span>Time Offset: <strong>+12 min from release</strong></span><br/>
          <span>Speed Trough: <strong>6.2 kn (Deceleration Anomaly)</strong></span>
        </div>
      `);
    }

    // 4. Drift Particles (Lagrangian)
    if (layers.driftParticles) {
      const particleOffsets = [
        [0.02, 0.03], [-0.01, 0.04], [0.03, -0.02], [-0.02, -0.03],
        [0.05, 0.08], [0.08, 0.12], [0.10, 0.14]
      ];
      particleOffsets.forEach(([dLat, dLng]) => {
        L.circleMarker([centerLat + dLat, centerLng + dLng], {
          radius: 2,
          color: '#00E5FF',
          fillColor: '#00E5FF',
          fillOpacity: 0.6,
          weight: 0
        }).addTo(overlayGroup);
      });
    }

    // 5. Scrubber vessel position marker based on scrubHour (0 to -36)
    const fullTrack = [...preGapTrack, ...gapTrack, ...postGapTrack];
    const normalizedProgress = Math.max(0, Math.min(1, (36 + scrubHour) / 36));
    const targetIdx = Math.min(fullTrack.length - 1, Math.floor(normalizedProgress * (fullTrack.length - 1)));
    const activePt = fullTrack[targetIdx];

    if (activePt) {
      const isInsideGap = targetIdx >= preGapTrack.length && targetIdx < (preGapTrack.length + gapTrack.length);
      const shipIcon = L.divIcon({
        className: 'scrubber-vessel',
        html: `
          <div style="
            background: ${isInsideGap ? '#FF3B30' : '#087EA4'}; 
            color: #FFFFFF; 
            border: 2px solid #FFFFFF; 
            border-radius: 8px; 
            padding: 2px 6px; 
            font-family: monospace; 
            font-size: 10px; 
            font-weight: bold; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.5); 
            display: flex; 
            align-items: center; 
            gap: 4px;
            white-space: nowrap;
          ">
            <span>🚢 ${v.name || 'Suspect'}</span>
            ${isInsideGap ? '<span style="background: #FFEBEB; color: #D9534F; padding: 0 3px; border-radius: 4px; font-size: 8px;">DARK</span>' : ''}
          </div>
        `,
        iconSize: [120, 26],
        iconAnchor: [60, 13]
      });

      scrubberMarkerRef.current = L.marker(activePt, { icon: shipIcon, zIndexOffset: 1000 }).addTo(overlayGroup);
    }

  }, [mapReady, layers, selectedVessel, scrubHour, centerLat, centerLng]);

  return (
    <div className={`relative ${height} w-full rounded-2xl overflow-hidden border border-border-marine shadow-marine-sm bg-slate-900 isolate z-0`}>
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full relative z-0" />

      {/* Top Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-ocean-navy/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg text-white">
        <button
          onClick={() => setMapType('nautical')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            mapType === 'nautical' ? 'bg-ocean text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          Nautical
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            mapType === 'satellite' ? 'bg-ocean text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setMapType('osm')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            mapType === 'osm' ? 'bg-ocean text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          OSM
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          title="Zoom In"
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          title="Zoom Out"
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.setView([centerLat, centerLng], 9)}
          title="Center on Slick Origin"
          className="p-1 hover:bg-white/10 rounded-md transition-colors text-ocean-sky"
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Layer Visibility Quick Toggles (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 bg-ocean-navy/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shadow-lg text-[10px] font-mono text-white">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mr-1">LAYERS:</span>
        <button
          onClick={() => toggleLayer('originZone')}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all ${
            layers.originZone ? 'bg-red-500/30 border-red-400 text-red-300' : 'bg-white/5 border-transparent text-slate-400'
          }`}
        >
          <span>Origin Zone A</span>
        </button>
        <button
          onClick={() => toggleLayer('vesselTrack')}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all ${
            layers.vesselTrack ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300' : 'bg-white/5 border-transparent text-slate-400'
          }`}
        >
          <span>AIS Track</span>
        </button>
        <button
          onClick={() => toggleLayer('blackoutGap')}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all ${
            layers.blackoutGap ? 'bg-amber-500/30 border-amber-400 text-amber-300' : 'bg-white/5 border-transparent text-slate-400'
          }`}
        >
          <span>Silence Gap (38m)</span>
        </button>
        <button
          onClick={() => toggleLayer('rangeRings')}
          className={`px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all ${
            layers.rangeRings ? 'bg-blue-500/30 border-blue-400 text-blue-300' : 'bg-white/5 border-transparent text-slate-400'
          }`}
        >
          <span>Range Rings</span>
        </button>
      </div>

      {/* Origin Proximity Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-10 bg-ocean-navy/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg text-white font-mono flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        <div className="text-[10px]">
          <span className="text-slate-400">Target CPA:</span>{' '}
          <strong className="text-red-400">1.4 NM from Origin</strong> ·{' '}
          <span className="text-slate-400">Track Δt:</span>{' '}
          <strong className="text-emerald-400">+12m Coincidence</strong>
        </div>
      </div>
    </div>
  );
}

