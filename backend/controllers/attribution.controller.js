import { dataStore } from '../models/dataStore.js';
import { AttributionEngine } from '../services/attributionEngine.js';

export const AttributionController = {
  getRankings(req, res) {
    const candidates = dataStore.getAllVessels();
    const result = AttributionEngine.computeAttributionRanking(candidates);
    res.json({
      success: true,
      data: result
    });
  },

  recalculate(req, res) {
    const { weights } = req.body || {};
    const candidates = dataStore.getAllVessels();
    const result = AttributionEngine.computeAttributionRanking(candidates, weights);
    res.json({
      success: true,
      data: result
    });
  }
};

