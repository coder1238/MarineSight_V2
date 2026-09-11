import { NativeRouter } from '../router.js';
import { IncidentsController } from '../controllers/incidents.controller.js';
import { VesselsController } from '../controllers/vessels.controller.js';
import { SatelliteController } from '../controllers/satellite.controller.js';
import { CharacterizationController } from '../controllers/characterization.controller.js';
import { SimulationController } from '../controllers/simulation.controller.js';
import { AttributionController } from '../controllers/attribution.controller.js';
import { EvidenceController } from '../controllers/evidence.controller.js';
import { ResponseController } from '../controllers/response.controller.js';
import { ReportsController } from '../controllers/reports.controller.js';
import { SystemController } from '../controllers/system.controller.js';
import { MapsController } from '../controllers/maps.controller.js';
import { eventStream } from '../services/eventStream.js';

export function createApiRouter() {
  const router = new NativeRouter();

  // System & Health
  router.get('/api/health', SystemController.getHealth);
  router.get('/api/system/health', SystemController.getHealth);
  router.get('/api/system/models', SystemController.getAiModels);

  // Incidents
  router.get('/api/incidents', IncidentsController.getAll);
  router.post('/api/incidents', IncidentsController.create);
  router.get('/api/incidents/:id', IncidentsController.getById);
  router.patch('/api/incidents/:id', IncidentsController.update);

  // Vessels & AIS Tracks
  router.get('/api/vessels', VesselsController.getAll);
  router.get('/api/vessels/:mmsi', VesselsController.getByMmsi);
  router.get('/api/vessels/:mmsi/tracks', VesselsController.getTracks);
  router.post('/api/vessels/:mmsi/cpa', VesselsController.calculateCpaToTarget);

  // Satellite & SAR Scenes
  // Satellite & SAR Scenes + Roboflow AI Models
  router.get('/api/satellite/scenes', SatelliteController.getScenes);
  router.get('/api/satellite/scenes/:id', SatelliteController.getSceneAnalysis);
  router.post('/api/satellite/segment/oil-spill', SatelliteController.segmentOilSpill);
  router.post('/api/satellite/segment/vessel', SatelliteController.segmentVessels);
  router.post('/api/satellite/segment/pipeline', SatelliteController.runPipeline);
  router.post('/api/satellite/segment/python-opencv', SatelliteController.segmentPythonOpenCV);

  // Spill Characterization & Weathering
  router.post('/api/characterize/calculate', CharacterizationController.calculate);

  // Lagrangian Drift Simulation (Hindcast & Forecast)
  router.post('/api/simulation/run', SimulationController.run);

  // Attribution & Ranking
  router.get('/api/attribution/ranking', AttributionController.getRankings);
  router.post('/api/attribution/recalculate', AttributionController.recalculate);

  // Evidence Ledger & Chain of Custody
  router.get('/api/evidence/:incidentId', EvidenceController.getLedger);
  router.post('/api/evidence/:incidentId/items', EvidenceController.addItem);

  // Response Plan & Containment Booms
  router.get('/api/response-plan/:incidentId', ResponseController.getPlan);
  router.post('/api/response-plan/:incidentId/booms', ResponseController.deployBoom);

  // Forensic Dossier Report
  router.get('/api/reports/:incidentId/dossier', ReportsController.getDossier);

  // Real Google Maps Configuration & Layers
  router.get('/api/maps/config', MapsController.getConfig);
  router.get('/api/maps/layers/:type', MapsController.getGeoLayers);

  // Real-Time Live Server-Sent Events (SSE)
  router.get('/api/live/stream', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    eventStream.addClient(res);
  });

  return router;
}

