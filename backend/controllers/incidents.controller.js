import { dataStore } from '../models/dataStore.js';
import { eventStream } from '../services/eventStream.js';

export const IncidentsController = {
  getAll(req, res) {
    const query = req.query || {};
    const incidents = dataStore.getAllIncidents(query);
    res.json({
      success: true,
      count: incidents.length,
      data: incidents
    });
  },

  getById(req, res) {
    const { id } = req.params;
    const incident = dataStore.getIncidentById(id);
    if (!incident) {
      return res.status(404).json({ success: false, error: `Incident ${id} not found` });
    }
    res.json({ success: true, data: incident });
  },

  create(req, res) {
    const body = req.body || {};
    const newInc = dataStore.createIncident(body);
    eventStream.broadcast('incident_created', newInc);
    res.status(201).json({ success: true, data: newInc });
  },

  update(req, res) {
    const { id } = req.params;
    const body = req.body || {};
    const updated = dataStore.updateIncident(id, body);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Incident ${id} not found` });
    }
    eventStream.broadcast('incident_updated', updated);
    res.json({ success: true, data: updated });
  }
};

