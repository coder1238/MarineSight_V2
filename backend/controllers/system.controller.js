import os from 'node:os';
import { dataStore } from '../models/dataStore.js';

export const SystemController = {
  getHealth(req, res) {
    const memTotal = os.totalmem() / (1024 * 1024 * 1024);
    const memFree = os.freemem() / (1024 * 1024 * 1024);
    const memUsed = memTotal - memFree;

    res.json({
      success: true,
      status: "HEALTHY",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        cpus: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || "Intel/AMD Processor",
        loadAvg: os.loadavg(),
        memoryTotalGb: Number(memTotal.toFixed(1)),
        memoryUsedGb: Number(memUsed.toFixed(1))
      },
      modelsActive: 10,
      activeIncidents: dataStore.incidents.length,
      monitoredVessels: 8421,
      telemetryIngestionRate: "1.4k msg/sec",
      apiLatencyMs: 24
    });
  },

  getAiModels(req, res) {
    res.json({
      success: true,
      count: dataStore.aiModels.length,
      data: dataStore.aiModels
    });
  }
};

