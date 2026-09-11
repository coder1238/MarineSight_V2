import { RoboflowService } from '../services/roboflowService.js';

export const SatelliteController = {
  getScenes(req, res) {
    const scenes = [
      {
        id: "S1A_IW_GRDH_1SDV_20260905T143210",
        name: "Arabian Sea Hydrocarbon Event (Offshore Goa)",
        constellation: "Sentinel-1A SAR",
        mode: "IW (Interferometric Wide)",
        polarization: "VV + VH",
        acquisitionTime: "2026-09-05T14:32:10Z",
        resolutionM: 10,
        swathCoverageKm2: 45000,
        incidenceAngleDeg: 34.2,
        orbitAccuracy: "Precise Orbit Ephemerides (POE)",
        detectedSpills: ["OF-2026-0912"],
        detectedVesselsCount: 3,
        bounds: [
          { lat: 15.6, lng: 67.2 },
          { lat: 15.8, lng: 73.2 },
          { lat: 14.1, lng: 73.5 },
          { lat: 13.9, lng: 67.5 }
        ]
      },
      {
        id: "S1B_IW_GRDH_1SDV_20260903T081500",
        name: "Bay of Bengal Commercial Corridor Scene",
        constellation: "Sentinel-1B SAR",
        mode: "IW (Interferometric Wide)",
        polarization: "VV + VH",
        acquisitionTime: "2026-09-03T08:15:00Z",
        resolutionM: 10,
        swathCoverageKm2: 42000,
        detectedSpills: ["OF-2026-0918"],
        detectedVesselsCount: 2
      },
      {
        id: "S2B_MSI_LEVEL2A_20260905T061520",
        name: "Sentinel-2 MSI Optical Cloud-Free Mosaic",
        constellation: "Sentinel-2B Optical",
        mode: "MSI 13-Band",
        cloudCoverPercent: 4.2,
        acquisitionTime: "2026-09-05T06:15:20Z",
        resolutionM: 10,
        detectedSpills: ["OF-2026-0912"]
      }
    ];

    res.json({ success: true, count: scenes.length, data: scenes });
  },

  getSceneAnalysis(req, res) {
    const { id } = req.params;
    res.json({
      success: true,
      sceneId: id,
      speckleFilter: "Refined Lee 7x7",
      cfarThreshold: "Constant False Alarm Rate (Pfa = 1e-6)",
      spillDetection: {
        segmentedAreaKm2: 14.7,
        perimeterKm: 22.4,
        darkSpotContrastDb: -8.4,
        hydrocarbonProbability: 0.968
      },
      sarVessels: [
        { id: "T1", lengthM: 282, rcsDbm2: 48.2, pos: { lat: 14.782, lng: 68.181 }, aisCorrelation: "MV Ocean Star (MMSI: 419001248)", highPriority: true },
        { id: "T2", lengthM: 185, rcsDbm2: 38.6, pos: { lat: 14.945, lng: 68.340 }, aisCorrelation: "Uncorrelated SAR Contact", highPriority: false },
        { id: "T3", lengthM: 94, rcsDbm2: 24.1, pos: { lat: 14.620, lng: 68.090 }, aisCorrelation: "Commercial Fishing Trawler", highPriority: false }
      ]
    });
  },

  // Roboflow Oil Spill Segmentation
  async segmentOilSpill(req, res) {
    const { imageBase64, image, imageUrl, imagePath } = req.body || {};
    const result = await RoboflowService.segmentOilSpill({ 
      imageBase64: imageBase64 || image, 
      imageUrl, 
      imagePath 
    });
    res.json(result);
  },

  // Roboflow Vessel Segmentation Workflow
  async segmentVessels(req, res) {
    const { imageBase64, imageUrl } = req.body || {};
    const result = await RoboflowService.segmentVessels({ imageBase64, imageUrl });
    res.json(result);
  },

  // Roboflow Unified Ingestion Pipeline
  async runPipeline(req, res) {
    const { imageBase64, imageUrl, sceneId } = req.body || {};
    const result = await RoboflowService.runPipeline({ imageBase64, imageUrl, sceneId });
    res.json(result);
  },

  // Pure Node.js Roboflow Pipeline Handler (Direct native execution, no Python backend required)
  async segmentPythonOpenCV(req, res) {
    const payload = req.body || {};
    const result = await RoboflowService.runPipeline(payload);
    res.json(result);
  }
};

