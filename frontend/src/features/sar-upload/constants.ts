import type { MissionStage } from './types';

export const MISSION_STAGES: MissionStage[] = [
  {
    id: 'loading-dataset',
    label: 'Loading Dataset',
    description: 'Ingesting Chandrayaan-2 DFSAR dual-frequency swath into mission buffer',
    durationMs: 2400,
    telemetryCode: 'DS_LOAD',
  },
  {
    id: 'calibrating-sar',
    label: 'Calibrating SAR',
    description: 'Applying radiometric calibration and incidence-angle correction',
    durationMs: 3200,
    telemetryCode: 'SAR_CAL',
  },
  {
    id: 'filtering-noise',
    label: 'Filtering Noise',
    description: 'Lee adaptive speckle filtering on L-band and S-band channels',
    durationMs: 4100,
    telemetryCode: 'NOISE_FLT',
  },
  {
    id: 'ice-probability',
    label: 'Generating Ice Probability',
    description: 'Permittivity inversion and dielectric constant mapping',
    durationMs: 5200,
    telemetryCode: 'ICE_PROB',
  },
  {
    id: 'running-ai',
    label: 'Running AI',
    description: 'PyTorch segmentation model inference on polar regolith signatures',
    durationMs: 5800,
    telemetryCode: 'AI_INFER',
  },
  {
    id: 'landing-sites',
    label: 'Computing Landing Sites',
    description: 'Ranking candidate sites by ice probability and terrain stability',
    durationMs: 3800,
    telemetryCode: 'SITE_RANK',
  },
  {
    id: 'mission-ready',
    label: 'Mission Ready',
    description: 'Intelligence package compiled — south polar analysis complete',
    durationMs: 1800,
    telemetryCode: 'GO_NOGO',
  },
];

export const UPLOAD_DURATION_MS = 2800;

export const ACCEPTED_EXTENSIONS = ['.tif', '.tiff', '.h5', '.nc'];
