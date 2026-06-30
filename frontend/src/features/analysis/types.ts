export type AnalysisLayerId =
  | 'original'
  | 'enhanced'
  | 'segmentation'
  | 'heatmap'
  | 'landing';

export interface AnalysisLayer {
  id: AnalysisLayerId;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  metric: string;
  metricValue: number;
  metricUnit: string;
}

export interface AnalysisStatistic {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  sparkline: number[];
  color: string;
}

export interface SpectralBand {
  band: string;
  intensity: number;
  ice: number;
}

export interface ConfidenceBucket {
  range: string;
  count: number;
  fill: string;
}
