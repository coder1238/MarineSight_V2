import { config } from '../config/index.js';
import { NAUTICAL_MAP_STYLES } from '../config/nauticalStyles.js';
import { dataStore } from '../models/dataStore.js';

export const MapsController = {
  getConfig(req, res) {
    res.json({
      success: true,
      apiKeyProvided: Boolean(config.googleMapsApiKey),
      apiKey: config.googleMapsApiKey || "",
      demoMapId: "DEMO_MAP_ID",
      attributionId: config.attributionId,
      defaultCenter: config.defaultCoordinates,
      defaultZoom: 8,
      nauticalStyles: NAUTICAL_MAP_STYLES
    });
  },

  getGeoLayers(req, res) {
    const { type = 'all' } = req.params;
    const incident = dataStore.incidents[0];
    const topVessel = dataStore.vessels[0];

    const geoData = {
      spill: {
        id: incident.id,
        name: "Oil Slick INC-0921",
        areaKm2: incident.spillAreaKm2,
        center: incident.coordinates,
        polygon: incident.polygon
      },
      originZoneA: {
        name: "Zone A Hindcast Origin (72.4%)",
        center: { lat: 14.6521, lng: 67.9015 },
        radiusKm: 4.2
      },
      vessels: dataStore.vessels.map(v => ({
        mmsi: v.mmsi,
        name: v.name,
        type: v.type,
        currentPos: v.currentPos,
        speedKn: v.currentSpeedKn,
        headingDeg: v.headingDeg,
        priorityScore: v.priorityScore,
        flag: v.flag
      })),
      tracks: topVessel.tracks,
      marineProtectedAreas: [
        {
          name: "Netrani Island Coral Sanctuary",
          polygon: [
            { lat: 14.01, lng: 74.30 },
            { lat: 14.04, lng: 74.35 },
            { lat: 13.98, lng: 74.38 },
            { lat: 13.96, lng: 74.32 }
          ],
          riskLevel: "CRITICAL"
        }
      ],
      eezCoastlineBoundary: [
        { lat: 15.6, lng: 73.6 },
        { lat: 15.4, lng: 73.8 },
        { lat: 15.0, lng: 74.0 },
        { lat: 14.7, lng: 74.1 },
        { lat: 14.3, lng: 74.3 }
      ]
    };

    res.json({
      success: true,
      data: type === 'all' ? geoData : geoData[type] || null
    });
  }
};

