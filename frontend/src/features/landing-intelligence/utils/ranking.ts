import type { LandingSite, RiskLevel } from '@/data/missionData';
import { RANKING_WEIGHTS, RISK_THRESHOLDS } from '@/features/landing-intelligence/constants';
import type { LandingCandidate } from '@/features/landing-intelligence/types';

export function getRiskLevel(risk: number): RiskLevel {
  return RISK_THRESHOLDS.find((t) => risk <= t.max)?.level ?? 'high';
}

export function computeCompositeScore(site: LandingSite): number {
  const safety = 100 - site.risk;
  const score =
    site.iceProbability * RANKING_WEIGHTS.iceProbability +
    site.terrainStability * RANKING_WEIGHTS.terrainStability +
    site.scientificValue * RANKING_WEIGHTS.scientificValue +
    site.extractionPotential * RANKING_WEIGHTS.extractionPotential +
    safety * RANKING_WEIGHTS.safety +
    site.missionSuccessProbability * RANKING_WEIGHTS.missionSuccessProbability;

  return Math.round(score * 10) / 10;
}

export function rankCandidates(sites: LandingSite[]): LandingCandidate[] {
  const scored = sites.map((site) => ({
    ...site,
    compositeScore: computeCompositeScore(site),
    riskLevel: getRiskLevel(site.risk),
    rank: 0,
  }));

  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  return scored.map((site, index) => ({
    ...site,
    rank: index + 1,
    score: site.compositeScore,
    status: index === 0 ? 'primary' : index === 1 ? 'backup' : 'candidate',
  }));
}
