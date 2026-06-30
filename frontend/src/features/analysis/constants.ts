import type { AnalysisLayer, AnalysisStatistic, ConfidenceBucket, SpectralBand } from './types';

export const ANALYSIS_LAYERS: AnalysisLayer[] = [
  {
    id: 'original',
    label: 'Original SAR',
    shortLabel: 'Raw',
    description: 'DFSAR L-band backscatter — unprocessed swath',
    accent: '#64748b',
    metric: 'SNR',
    metricValue: 12.4,
    metricUnit: 'dB',
  },
  {
    id: 'enhanced',
    label: 'Enhanced SAR',
    shortLabel: 'Enhanced',
    description: 'Speckle-filtered radiometric calibration',
    accent: '#4d8cff',
    metric: 'SNR Gain',
    metricValue: 18.3,
    metricUnit: 'dB',
  },
  {
    id: 'segmentation',
    label: 'Segmentation',
    shortLabel: 'Segment',
    description: 'Neural boundary detection — regolith vs ice',
    accent: '#6e5dff',
    metric: 'IoU Score',
    metricValue: 91.7,
    metricUnit: '%',
  },
  {
    id: 'heatmap',
    label: 'Confidence Heatmap',
    shortLabel: 'Heatmap',
    description: 'Subsurface ice probability distribution',
    accent: '#67d8ff',
    metric: 'Ice Confidence',
    metricValue: 87.4,
    metricUnit: '%',
  },
  {
    id: 'landing',
    label: 'Landing Overlay',
    shortLabel: 'Landing',
    description: 'Ranked landing corridors with safety zones',
    accent: '#34d399',
    metric: 'Site Score',
    metricValue: 94.2,
    metricUnit: '%',
  },
];

export const ANALYSIS_STATISTICS: AnalysisStatistic[] = [
  {
    id: 'coverage',
    label: 'SAR Coverage',
    value: 847,
    unit: 'km²',
    trend: 12.4,
    sparkline: [420, 510, 580, 620, 710, 780, 847],
    color: '#4d8cff',
  },
  {
    id: 'ice-prob',
    label: 'Ice Probability',
    value: 87.4,
    unit: '%',
    trend: 4.2,
    sparkline: [62, 68, 74, 79, 82, 85, 87.4],
    color: '#67d8ff',
  },
  {
    id: 'model-conf',
    label: 'Model Confidence',
    value: 94.2,
    unit: '%',
    trend: 2.1,
    sparkline: [78, 82, 86, 89, 91, 93, 94.2],
    color: '#6e5dff',
  },
  {
    id: 'penetration',
    label: 'L-Band Penetration',
    value: 4.8,
    unit: 'm',
    trend: 0.6,
    sparkline: [2.1, 2.8, 3.2, 3.8, 4.1, 4.5, 4.8],
    color: '#34d399',
  },
];

export const SPECTRAL_DATA: SpectralBand[] = [
  { band: 'L1', intensity: 42, ice: 18 },
  { band: 'L2', intensity: 58, ice: 34 },
  { band: 'L3', intensity: 71, ice: 52 },
  { band: 'L4', intensity: 84, ice: 68 },
  { band: 'L5', intensity: 76, ice: 79 },
  { band: 'L6', intensity: 62, ice: 87 },
  { band: 'L7', intensity: 48, ice: 91 },
];

export const CONFIDENCE_DISTRIBUTION: ConfidenceBucket[] = [
  { range: '0–20', count: 12, fill: '#1e293b' },
  { range: '20–40', count: 28, fill: '#334155' },
  { range: '40–60', count: 45, fill: '#4d8cff' },
  { range: '60–80', count: 89, fill: '#67d8ff' },
  { range: '80–100', count: 124, fill: '#34d399' },
];

export const PROCESSING_METRICS = [
  { label: 'Ice Signature', value: 87.4, max: 100 },
  { label: 'Permittivity εr', value: 3.2, max: 10 },
  { label: 'Penetration Depth', value: 4.8, max: 10 },
  { label: 'Terrain Stability', value: 91.8, max: 100 },
];
