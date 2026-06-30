export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

export interface LandingSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  score: number;
  iceProbability: number;
  terrainStability: number;
  slopeDeg: number;
  status: 'primary' | 'backup' | 'candidate';
  risk: number;
  scientificValue: number;
  extractionPotential: number;
  missionDurationSols: number;
  expectedYield: number;
  missionSuccessProbability: number;
}

export interface TimelinePhase {
  id: string;
  label: string;
  timestamp: string;
  status: 'complete' | 'active' | 'pending';
  description: string;
}

export interface MissionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'system';
  source: string;
  message: string;
}

export interface AIInsight {
  id: string;
  title: string;
  body: string;
  confidence: number;
  category: 'terrain' | 'ice' | 'navigation' | 'risk' | 'resource';
  priority: 'high' | 'medium' | 'low';
}

export interface MissionStatistic {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  sparkline: number[];
}

export const MISSION_ID = 'C2-SAR-ICE-2026';
export const MISSION_NAME = 'Chandrayaan-2 SAR Ice Intelligence';
export const ORBITER = 'Chandrayaan-2 Orbiter';
export const TARGET_REGION = 'Lunar South Polar Region (70°S–90°S)';

export const LANDING_SITES: LandingSite[] = [
  {
    id: 'shackleton-rim',
    name: 'Shackleton Rim Alpha',
    lat: -89.9,
    lon: 0.0,
    score: 94.2,
    iceProbability: 87.4,
    terrainStability: 91.8,
    slopeDeg: 4.2,
    status: 'primary',
    risk: 12.4,
    scientificValue: 96.8,
    extractionPotential: 88.2,
    missionDurationSols: 14,
    expectedYield: 1.82,
    missionSuccessProbability: 94.2,
  },
  {
    id: 'de-gerlache',
    name: 'de Gerlache Crater',
    lat: -88.5,
    lon: -66.0,
    score: 88.7,
    iceProbability: 79.1,
    terrainStability: 86.3,
    slopeDeg: 6.8,
    status: 'backup',
    risk: 18.6,
    scientificValue: 91.4,
    extractionPotential: 82.7,
    missionDurationSols: 16,
    expectedYield: 1.54,
    missionSuccessProbability: 88.7,
  },
  {
    id: 'haworth',
    name: 'Haworth Basin',
    lat: -86.4,
    lon: -4.5,
    score: 82.4,
    iceProbability: 71.6,
    terrainStability: 84.9,
    slopeDeg: 8.1,
    status: 'candidate',
    risk: 24.3,
    scientificValue: 84.2,
    extractionPotential: 76.4,
    missionDurationSols: 18,
    expectedYield: 1.28,
    missionSuccessProbability: 82.4,
  },
  {
    id: 'malapert',
    name: 'Malapert Massif',
    lat: -86.0,
    lon: 2.5,
    score: 76.9,
    iceProbability: 58.3,
    terrainStability: 79.2,
    slopeDeg: 11.4,
    status: 'candidate',
    risk: 34.8,
    scientificValue: 78.6,
    extractionPotential: 64.1,
    missionDurationSols: 21,
    expectedYield: 0.94,
    missionSuccessProbability: 76.9,
  },
];

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 't1',
    label: 'SAR Ingestion',
    timestamp: 'T+00:00',
    status: 'complete',
    description: 'Dual-frequency SAR swath received from DFSAR payload',
  },
  {
    id: 't2',
    label: 'Noise Reduction',
    timestamp: 'T+00:14',
    status: 'complete',
    description: 'Speckle filtering and radiometric calibration applied',
  },
  {
    id: 't3',
    label: 'Subsurface Analysis',
    timestamp: 'T+00:38',
    status: 'active',
    description: 'L-band penetration depth modeling in progress',
  },
  {
    id: 't4',
    label: 'Ice Probability Map',
    timestamp: 'T+01:02',
    status: 'pending',
    description: 'PyTorch inference on polar permittivity signatures',
  },
  {
    id: 't5',
    label: 'Site Ranking',
    timestamp: 'T+01:28',
    status: 'pending',
    description: 'Multi-criteria landing site scoring engine',
  },
  {
    id: 't6',
    label: 'Rover Simulation',
    timestamp: 'T+01:55',
    status: 'pending',
    description: 'Virtual Pragyan path planning and telemetry synthesis',
  },
];

export const INITIAL_LOGS: MissionLog[] = [
  {
    id: 'log-1',
    timestamp: '14:22:01',
    level: 'system',
    source: 'ISRO-MCC',
    message: 'Mission Control link established — Chandrayaan-2 Orbiter telemetry nominal',
  },
  {
    id: 'log-2',
    timestamp: '14:22:04',
    level: 'info',
    source: 'DFSAR',
    message: 'L-band SAR swath #2847 ingested — 12.4 km resolution, 70°S pass',
  },
  {
    id: 'log-3',
    timestamp: '14:22:11',
    level: 'success',
    source: 'PIPELINE',
    message: 'Speckle reduction complete — SNR improved by 18.3 dB',
  },
  {
    id: 'log-4',
    timestamp: '14:22:19',
    level: 'info',
    source: 'AI-CORE',
    message: 'Ice detection model v2.4 loaded — 847M parameters on CUDA',
  },
  {
    id: 'log-5',
    timestamp: '14:22:27',
    level: 'warning',
    source: 'NAV',
    message: 'Shadow zone detected at Shackleton interior — L-band penetration limited',
  },
  {
    id: 'log-6',
    timestamp: '14:22:35',
    level: 'info',
    source: 'GEO',
    message: '4 candidate landing sites ranked in south polar region',
  },
];

export const STREAM_LOG_MESSAGES: Omit<MissionLog, 'id' | 'timestamp'>[] = [
  { level: 'info', source: 'DFSAR', message: 'S-band cross-polarization channel aligned' },
  { level: 'success', source: 'AI-CORE', message: 'Permittivity inversion layer generated — 94.2% confidence' },
  { level: 'info', source: 'THERMAL', message: 'Regolith temperature gradient mapped at 2m depth resolution' },
  { level: 'system', source: 'ISRO-MCC', message: 'Deep space network lock maintained — 847 ms RTT' },
  { level: 'info', source: 'ROVER-SIM', message: 'Pragyan virtual deployment trajectory computed' },
  { level: 'success', source: 'PIPELINE', message: 'Subsurface ice signature detected at Shackleton Rim Alpha' },
  { level: 'warning', source: 'TERRAIN', message: 'Slope exceeds 10° at Malapert Massif — flagged for review' },
  { level: 'info', source: 'REPORT', message: 'Mission summary draft auto-generated — 12 sections' },
];

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    title: 'High-confidence ice at Shackleton Rim',
    body: 'L-band backscatter anomaly consistent with buried water ice at 1–2 m depth. Permittivity εr ≈ 3.2 matches frozen regolith signature from Chandrayaan-1 M3 data.',
    confidence: 87.4,
    category: 'ice',
    priority: 'high',
  },
  {
    id: 'ins-2',
    title: 'Optimal landing window identified',
    body: 'Shackleton Rim Alpha offers 94.2% composite score with stable illumination during local summer. Terrain slope within Pragyan rover operational limits (< 12°).',
    confidence: 94.2,
    category: 'terrain',
    priority: 'high',
  },
  {
    id: 'ins-3',
    title: 'Shadow zone mitigation strategy',
    body: 'Recommend targeting sunlit rim rather than crater floor. DFSAR L-band can penetrate up to 5 m in polar regolith — sufficient for subsurface ice detection without direct illumination.',
    confidence: 78.6,
    category: 'navigation',
    priority: 'medium',
  },
  {
    id: 'ins-4',
    title: 'Resource extraction feasibility',
    body: 'Estimated ice concentration of 4.2% by mass in top 2 m layer. ISRU water extraction viable with projected yield of 1.8 L per m³ regolith at primary site.',
    confidence: 72.1,
    category: 'resource',
    priority: 'medium',
  },
  {
    id: 'ins-5',
    title: 'Micro-meteorite risk assessment',
    body: 'South polar region shows 23% lower impact flux vs equatorial sites based on crater density analysis. Acceptable for soft landing mission profile.',
    confidence: 81.3,
    category: 'risk',
    priority: 'low',
  },
];

export const MISSION_STATISTICS: MissionStatistic[] = [
  {
    id: 'stat-1',
    label: 'SAR Coverage',
    value: 847,
    unit: 'km²',
    trend: 12.4,
    sparkline: [420, 510, 580, 620, 710, 780, 847],
  },
  {
    id: 'stat-2',
    label: 'Ice Probability',
    value: 87.4,
    unit: '%',
    trend: 4.2,
    sparkline: [62, 68, 74, 79, 82, 85, 87.4],
  },
  {
    id: 'stat-3',
    label: 'Processing',
    value: 68,
    unit: '%',
    trend: 8.1,
    sparkline: [10, 22, 35, 48, 55, 62, 68],
  },
  {
    id: 'stat-4',
    label: 'Sites Ranked',
    value: 4,
    unit: 'sites',
    trend: 0,
    sparkline: [1, 2, 3, 4, 4, 4, 4],
  },
];

export const SAR_PROCESSING_STEPS = [
  { id: 's1', label: 'Loading Dataset', status: 'complete' as const, duration: '2.4s' },
  { id: 's2', label: 'Calibrating SAR', status: 'complete' as const, duration: '3.2s' },
  { id: 's3', label: 'Filtering Noise', status: 'complete' as const, duration: '4.1s' },
  { id: 's4', label: 'Generating Ice Probability', status: 'active' as const, duration: '—' },
  { id: 's5', label: 'Running AI', status: 'pending' as const, duration: '—' },
  { id: 's6', label: 'Computing Landing Sites', status: 'pending' as const, duration: '—' },
  { id: 's7', label: 'Mission Ready', status: 'pending' as const, duration: '—' },
];

export const ROVER_TELEMETRY = {
  battery: 94.2,
  speed: 0.8,
  distance: 1247,
  heading: 247,
  temperature: -173,
  signalStrength: 98,
};
