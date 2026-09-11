import { dataStore } from '../models/dataStore.js';

export const ResponseController = {
  getPlan(req, res) {
    const { incidentId } = req.params;
    const plan = dataStore.getResponsePlan(incidentId);
    res.json({
      success: true,
      incidentId,
      data: plan
    });
  },

  deployBoom(req, res) {
    const body = req.body || {};
    const newBoom = dataStore.addContainmentBoom(body);
    res.status(201).json({
      success: true,
      data: newBoom
    });
  }
};

