import type { LandingSite } from '@/data/missionData';
import { LANDING_SITES } from '@/data/missionData';
import { rankCandidates } from '@/features/landing-intelligence/utils/ranking';
import type { LandingCandidate } from '@/features/landing-intelligence/types';

const SYNTHETIC_SEEDS: Omit<LandingSite, 'score' | 'status'>[] = [
  {
    id: 'faustini-ridge',
    name: 'Faustini Ridge Beta',
    lat: -87.2,
    lon: 22.8,
    iceProbability: 74.8,
    terrainStability: 82.1,
    slopeDeg: 7.4,
    risk: 22.1,
    scientificValue: 88.3,
    extractionPotential: 71.6,
    missionDurationSols: 17,
    expectedYield: 1.36,
    missionSuccessProbability: 84.6,
  },
  {
    id: 'cabeus-plateau',
    name: 'Cabeus Plateau Gamma',
    lat: -84.6,
    lon: -35.4,
    iceProbability: 68.2,
    terrainStability: 77.4,
    slopeDeg: 9.2,
    risk: 29.4,
    scientificValue: 81.7,
    extractionPotential: 69.3,
    missionDurationSols: 19,
    expectedYield: 1.12,
    missionSuccessProbability: 79.8,
  },
];

function seedToSite(seed: Omit<LandingSite, 'score' | 'status'>): LandingSite {
  return {
    ...seed,
    score: 0,
    status: 'candidate',
  };
}

export function generateLandingCandidates(): LandingCandidate[] {
  const baseSites = [...LANDING_SITES];
  const syntheticSites = SYNTHETIC_SEEDS.map(seedToSite);
  return rankCandidates([...baseSites, ...syntheticSites]);
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat < 0 ? 'S' : 'N';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir} · ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}
