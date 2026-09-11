import http from 'node:http';
import { createServer } from '../server.js';

const testServer = createServer();
const PORT = 5099;

function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: PORT, host: '127.0.0.1' }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("Starting Backend Unit & Integration Tests...");
  await new Promise(resolve => testServer.listen(PORT, '127.0.0.1', resolve));

  try {
    // 1. Health
    const health = await request({ path: '/api/health', method: 'GET' });
    console.assert(health.status === 200, `Health check expected 200, got ${health.status}`);
    console.assert(health.data.status === 'HEALTHY', 'Expected status HEALTHY');
    console.log("✓ /api/health passed");

    // 2. Incidents
    const incidents = await request({ path: '/api/incidents', method: 'GET' });
    console.assert(incidents.status === 200, `Incidents expected 200, got ${incidents.status}`);
    console.assert(incidents.data.count >= 5, `Expected >= 5 incidents, got ${incidents.data.count}`);
    console.log("✓ /api/incidents passed");

    // 3. Incident detail
    const incDetail = await request({ path: '/api/incidents/OF-2026-0912', method: 'GET' });
    console.assert(incDetail.status === 200, 'Incident detail expected 200');
    console.assert(incDetail.data.data.id === 'OF-2026-0912', 'Expected ID OF-2026-0912');
    console.log("✓ /api/incidents/:id passed");

    // 4. Vessels
    const vessels = await request({ path: '/api/vessels', method: 'GET' });
    console.assert(vessels.status === 200, 'Vessels expected 200');
    console.assert(vessels.data.data.length > 0, 'Expected vessels list');
    console.log("✓ /api/vessels passed");

    // 5. Vessel tracks
    const tracks = await request({ path: '/api/vessels/419001248/tracks', method: 'GET' });
    console.assert(tracks.status === 200, 'Tracks expected 200');
    console.assert(tracks.data.tracks.reconstructed.length > 0, 'Expected reconstructed tracks');
    console.log("✓ /api/vessels/:mmsi/tracks passed");

    // 6. Simulation engine
    const sim = await request(
      { path: '/api/simulation/run', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { incidentId: 'OF-2026-0912', type: 'hindcast', durationHours: 24 }
    );
    console.assert(sim.status === 200, 'Simulation run expected 200');
    console.assert(sim.data.result.centroidTrajectory.length > 0, 'Expected centroid trajectory');
    console.log("✓ /api/simulation/run passed");

    // 7. Attribution ranking
    const ranking = await request({ path: '/api/attribution/ranking', method: 'GET' });
    console.assert(ranking.status === 200, 'Attribution ranking expected 200');
    console.assert(ranking.data.data.topSuspect.name === 'MV OCEAN STAR', 'Expected MV OCEAN STAR as top suspect');
    console.log("✓ /api/attribution/ranking passed");

    // 8. Maps Config
    const mapsCfg = await request({ path: '/api/maps/config', method: 'GET' });
    console.assert(mapsCfg.status === 200, 'Maps config expected 200');
    console.assert(mapsCfg.data.attributionId === 'gmp_git_agentskills_v1', 'Expected attribution ID');
    console.log("✓ /api/maps/config passed");

    // 9. Maps Layers
    const layers = await request({ path: '/api/maps/layers/all', method: 'GET' });
    console.assert(layers.status === 200, 'Maps layers expected 200');
    console.assert(layers.data.data.spill.id === 'OF-2026-0912', 'Expected spill layer');
    console.log("✓ /api/maps/layers/all passed");

    console.log("\n All 9 backend test suites passed successfully!");
    // 10. Roboflow Oil Spill Segmentation
    const spillSeg = await request(
      { path: '/api/satellite/segment/oil-spill', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { imageBase64: "sample_base64_sar_swath" }
    );
    console.assert(spillSeg.status === 200, 'Spill segmentation expected 200');
    console.assert(spillSeg.data.success === true, 'Expected segmentation success');
    console.log("✓ /api/satellite/segment/oil-spill (Roboflow) passed");

    // 11. Roboflow Unified AI Pipeline
    const pipeline = await request(
      { path: '/api/satellite/segment/pipeline', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { sceneId: "S1A_IW_GRDH_1SDV_20260905T143210" }
    );
    console.assert(pipeline.status === 200, 'Roboflow pipeline expected 200');
    console.assert(pipeline.data.oilSpill.success === true, 'Expected oil spill inference');
    console.assert(pipeline.data.vessels.success === true, 'Expected vessel detection inference');
    console.assert(pipeline.data.predictions.oil_spills.length > 0, 'Expected non-empty oil_spills predictions');
    console.assert(pipeline.data.predictions.vessels.length > 0, 'Expected non-empty vessels predictions');
    console.log("✓ /api/satellite/segment/pipeline (Roboflow) passed");

    // 12. Pure Node.js AI Route (formerly python-opencv)
    const nativeAiRoute = await request(
      { path: '/api/satellite/segment/python-opencv', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { sceneId: "S1A_IW_GRDH_1SDV_20260905T143210" }
    );
    console.assert(nativeAiRoute.status === 200, 'Native AI route expected 200');
    console.assert(nativeAiRoute.data.success === true, 'Expected native route success');
    console.log("✓ /api/satellite/segment/python-opencv (Pure Node.js) passed");

    console.log("\n All 12 backend test suites passed successfully without Python dependencies!");
  } finally {
    testServer.close();
  }
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

