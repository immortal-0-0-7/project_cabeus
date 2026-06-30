import type { LandingSite, RiskLevel } from '@/data/missionData';

export interface LandingCandidate extends LandingSite {
  rank: number;
  riskLevel: RiskLevel;
  compositeScore: number;
}

export interface LandingIntelligenceState {
  candidates: LandingCandidate[];
  selectedId: string;
  isGenerating: boolean;
}
