import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  env: process.env.NODE_ENV || 'development',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  attributionId: 'gmp_git_agentskills_v1',
  defaultRegion: 'Arabian Sea (Goa / Karnataka EEZ)',
  defaultCoordinates: {
    lat: 14.8214,
    lng: 68.2108
  },
  roboflow: {
    apiKey: process.env.ROBOFLOW_API_KEY || 'TyJb2VkX2RnPaxEniBl3',
    oilSpillUrl: process.env.ROBOFLOW_OIL_SPILL_URL || 'https://serverless.roboflow.com/oil-spill-segmentation/3',
    vesselWorkflowUrl: process.env.ROBOFLOW_VESSEL_WORKFLOW_URL || 'https://serverless.roboflow.com/user-maildev-dev/workflows/general-segmentation-api-5'
  }
};

