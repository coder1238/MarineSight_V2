import { 
  CASE_OF_2026_0912, 
  INCIDENTS_REGISTRY, 
  CANDIDATE_VESSELS, 
  AI_MODELS, 
  SYSTEM_HEALTH 
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchWithFallback(url, options = {}, fallbackData = null) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    console.warn(`[API Fallback] ${url} failed, using cached mock data:`, err.message);
    return fallbackData;
  }
}

export const api = {
  // System Health
  async getHealth() {
    return fetchWithFallback('/health', {}, SYSTEM_HEALTH);
  },

  // AI Models
  async getAiModels() {
    return fetchWithFallback('/system/models', {}, AI_MODELS);
  },

  // Incidents
  async getIncidents(query = {}) {
    const params = new URLSearchParams(query).toString();
    const url = `/incidents${params ? `?${params}` : ''}`;
    return fetchWithFallback(url, {}, INCIDENTS_REGISTRY);
  },

  async getIncidentById(id) {
    return fetchWithFallback(`/incidents/${id}`, {}, CASE_OF_2026_0912);
  },

  async createIncident(incidentData) {
    try {
      const res = await fetch(`${BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData)
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Failed to POST incident, creating locally:", err);
      return { id: `OF-2026-${Math.floor(Math.random() * 9000)}`, ...incidentData };
    }
  },

  async updateIncident(id, updates) {
    try {
      const res = await fetch(`${BASE_URL}/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Failed to PATCH incident, returning updates:", err);
      return updates;
    }
  },

  // Vessels
  async getVessels() {
    return fetchWithFallback('/vessels', {}, CANDIDATE_VESSELS);
  },

  async getVesselTracks(mmsi) {
    return fetchWithFallback(`/vessels/${mmsi}/tracks`, {}, null);
  },

  // Simulation
  async runSimulation(params) {
    try {
      const res = await fetch(`${BASE_URL}/simulation/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const json = await res.json();
      return json.result;
    } catch (err) {
      console.warn("Simulation run failed on backend:", err);
      return null;
    }
  },

  // Attribution
  async getAttributionRankings() {
    return fetchWithFallback('/attribution/ranking', {}, { rankings: CANDIDATE_VESSELS });
  },

  async recalculateAttribution(weights) {
    try {
      const res = await fetch(`${BASE_URL}/attribution/recalculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights })
      });
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn("Attribution recalculate failed:", err);
      return null;
    }
  },

  // Evidence Ledger
  async getEvidence(incidentId = "OF-2026-0912") {
    return fetchWithFallback(`/evidence/${incidentId}`, {}, []);
  },

  // Response Plan
  async getResponsePlan(incidentId = "OF-2026-0912") {
    return fetchWithFallback(`/response-plan/${incidentId}`, {}, null);
  },

  // Dossier Report
  async getDossier(incidentId = "OF-2026-0912") {
    return fetchWithFallback(`/reports/${incidentId}/dossier`, {}, null);
  },

  // Satellite & Roboflow AI
  async getSatelliteScenes() {
    return fetchWithFallback('/satellite/scenes', {}, []);
  },

  async getSatelliteSceneAnalysis(id) {
    return fetchWithFallback(`/satellite/scenes/${id}`, {}, null);
  },

  async segmentOilSpill(payload = {}) {
    try {
      const res = await fetch(`${BASE_URL}/satellite/segment/oil-spill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn("Roboflow oil spill segmentation failed:", err);
      return null;
    }
  },

  async segmentVessels(payload = {}) {
    try {
      const res = await fetch(`${BASE_URL}/satellite/segment/vessel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn("Roboflow vessel segmentation failed:", err);
      return null;
    }
  },

  async runSatelliteAiPipeline(payload = {}) {
    try {
      const res = await fetch(`${BASE_URL}/satellite/segment/pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn("Roboflow pipeline run failed:", err);
      return null;
    }
  },

  // MarineSight Satellite AI Segmentation Endpoint (Pure Node.js Roboflow pipeline)
  async segmentWithPythonOpenCV(payload = {}) {
    return this.runSatelliteAiPipeline(payload);
  },

  // Maps Configuration
  async getMapsConfig() {
    return fetchWithFallback('/maps/config', {}, {
      apiKeyProvided: false,
      demoMapId: "DEMO_MAP_ID",
      attributionId: "gmp_git_agentskills_v1",
      defaultCenter: { lat: 14.8214, lng: 68.2108 }
    });
  }
};

