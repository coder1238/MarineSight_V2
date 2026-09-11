import http from 'node:http';
import { URL } from 'node:url';
import { config } from './config/index.js';
import { createApiRouter } from './routes/index.js';

const router = createApiRouter();

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

export function createServer() {
  return http.createServer(async (req, res) => {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host || `localhost:${config.port}`;
    const parsedUrl = new URL(req.url, `http://${host}`);
    const pathname = parsedUrl.pathname;

    // Parse query params into simple object
    const query = {};
    for (const [k, v] of parsedUrl.searchParams.entries()) {
      query[k] = v;
    }
    req.query = query;

    // Attach response convenience methods
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data, null, 2));
    };

    // Match route
    const matched = router.match(req.method, pathname);
    if (!matched) {
      res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${pathname}`,
        availableEndpoints: [
          "/api/health",
          "/api/incidents",
          "/api/vessels",
          "/api/simulation/run",
          "/api/attribution/ranking",
          "/api/maps/config",
          "/api/maps/layers/all",
          "/api/live/stream"
        ]
      });
      return;
    }

    req.params = matched.params;

    // Parse body for POST / PATCH / PUT
    if (['POST', 'PATCH', 'PUT'].includes(req.method)) {
      let rawBody = '';
      req.on('data', chunk => {
        rawBody += chunk;
        if (rawBody.length > 2e6) { // 2MB limit
          res.status(413).json({ success: false, error: "Payload too large" });
          req.destroy();
        }
      });

      req.on('end', () => {
        try {
          req.body = rawBody ? JSON.parse(rawBody) : {};
          matched.handler(req, res);
        } catch (err) {
          res.status(400).json({ success: false, error: "Invalid JSON payload in request body" });
        }
      });
    } else {
      req.body = {};
      try {
        matched.handler(req, res);
      } catch (err) {
        console.error(`[Server Error] ${req.method} ${pathname}:`, err);
        res.status(500).json({ success: false, error: "Internal Server Error", message: err.message });
      }
    }
  });
}

const server = createServer();

// Start listening if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  server.listen(config.port, config.host, () => {
    console.log(`
=============================================================
  🌊 MARINESIGHT MARITIME BACKEND SERVER RUNNING
=============================================================
  ● HTTP URL:      http://localhost:${config.port}
  ● Live Stream:   http://localhost:${config.port}/api/live/stream (SSE)
  ● Health Check:  http://localhost:${config.port}/api/health
  ● Google Maps:   http://localhost:${config.port}/api/maps/config
  ● Incidents API: http://localhost:${config.port}/api/incidents
  ● Vessels API:   http://localhost:${config.port}/api/vessels
  ● Mode:          Native Node.js (Zero external dependencies)
=============================================================
    `);
  });
}

