import { SimulationEngine } from '../services/simulationEngine.js';
import { dataStore } from '../models/dataStore.js';

export const SimulationController = {
  run(req, res) {
    const {
      incidentId = "OF-2026-0912",
      type = "hindcast", // 'hindcast' | 'forecast'
      durationHours = 40,
      particleCount = 50,
      customEnvironment
    } = req.body || {};

    const incident = dataStore.getIncidentById(incidentId);
    const originLat = incident?.coordinates?.lat || 14.8214;
    const originLng = incident?.coordinates?.lng || 68.2108;
    const env = customEnvironment || incident?.environment || {
      windSpeedKn: 14.2,
      windDirectionDeg: 310,
      currentSpeedMs: 0.42,
      currentDirectionDeg: 128
    };

    const simResult = SimulationEngine.runDriftSimulation({
      type,
      originLat,
      originLng,
      durationHours: Number(durationHours) || 40,
      particleCount: Number(particleCount) || 50,
      environment: env
    });

    res.json({
      success: true,
      incidentId,
      result: simResult
    });
  }
};

