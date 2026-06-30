import type { LandingSite, RiskLevel } from '@/data/missionData';

export const RANKING_WEIGHTS = {
  iceProbability: 0.22,
  terrainStability: 0.18,
  scientificValue: 0.16,
  extractionPotential: 0.14,
  safety: 0.15,
  missionSuccessProbability: 0.15,
} as const;

export const RISK_THRESHOLDS: { max: number; level: RiskLevel }[] = [
  { max: 18, level: 'low' },
  { max: 28, level: 'moderate' },
  { max: 38, level: 'elevated' },
  { max: 100, level: 'high' },
];

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  elevated: 'Elevated',
  high: 'High',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'text-signal',
  moderate: 'text-ice',
  elevated: 'text-warning',
  high: 'text-danger',
};

export const STATUS_FROM_RANK: Record<number, LandingSite['status']> = {
  1: 'primary',
  2: 'backup',
};
