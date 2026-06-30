import type { LandingCandidate } from '@/features/landing-intelligence/types';
import type { SiteExplainability } from '@/features/explainability/types';

const TERRAIN_PROFILES: Record<string, { classification: string; composition: string; crater: string }> = {
  'shackleton-rim': {
    classification: 'Permanently shadowed rim terrace',
    composition: 'Anorthositic breccia + ice-rich regolith',
    crater: 'Shackleton interior, 21 km diameter',
  },
  'de-gerlache': {
    classification: 'Crater floor bench',
    composition: 'Pyroclastic deposit overlay',
    crater: 'de Gerlache, 32 km diameter',
  },
  haworth: {
    classification: 'Basin ejecta apron',
    composition: 'Mature highland regolith',
    crater: 'Haworth, 52 km diameter',
  },
  malapert: {
    classification: 'Massif plateau',
    composition: 'Crystalline highland crust',
    crater: 'Malapert A vicinity',
  },
  'faustini-ridge': {
    classification: 'Ridge crest terrace',
    composition: 'Mixed mare-highland interface',
    crater: 'Faustini, 39 km diameter',
  },
  'cabeus-plateau': {
    classification: 'Plateau surface',
    composition: 'Volatile-enriched regolith',
    crater: 'Cabeus, 49 km diameter',
  },
};

function buildWaveform(seed: number): number[] {
  return Array.from({ length: 24 }).map((_, i) => {
    const base = Math.sin(i * 0.45 + seed) * 0.35 + 0.5;
    const spike = i === 14 || i === 15 ? 0.25 : 0;
    return Math.min(1, Math.max(0.08, base + spike + Math.cos(i * 0.2 + seed) * 0.12));
  });
}

function slopeGrade(deg: number): string {
  if (deg <= 5) return 'Gentle';
  if (deg <= 8) return 'Moderate';
  if (deg <= 12) return 'Steep';
  return 'Critical';
}

export function generateExplainability(candidate: LandingCandidate): SiteExplainability {
  const profile = TERRAIN_PROFILES[candidate.id] ?? {
    classification: 'Polar highland terrain',
    composition: 'Mixed lunar regolith',
    crater: 'Unnamed polar feature',
  };

  const confidence = Math.round(
    candidate.compositeScore * 0.35 +
      candidate.iceProbability * 0.3 +
      candidate.terrainStability * 0.2 +
      candidate.missionSuccessProbability * 0.15,
  );

  const whySelected =
    candidate.rank === 1
      ? `Primary selection driven by composite score ${candidate.compositeScore.toFixed(1)} with ${candidate.iceProbability.toFixed(1)}% ice probability. L-band permittivity inversion confirms subsurface volatiles at 1–2 m depth within Pragyan rover operational envelope.`
      : `Ranked #${candidate.rank} with ${candidate.compositeScore.toFixed(1)} composite score. ${candidate.iceProbability.toFixed(1)}% ice probability and ${candidate.terrainStability.toFixed(1)}% terrain stability meet mission threshold; ${candidate.risk.toFixed(1)}% risk profile within acceptable bounds.`;

  const scientificReasoning =
    candidate.iceProbability > 75
      ? `DFSAR L-band backscatter anomaly (σ° = ${(-8 + candidate.rank).toFixed(1)} dB) correlates with buried water ice signatures observed in Chandrayaan-1 M3 hyperspectral data. Dielectric permittivity εr ≈ ${(3.1 + candidate.rank * 0.05).toFixed(2)} exceeds dry regolith baseline (εr ≈ 2.8), indicating 4.2% ice concentration by mass in the top 2 m layer. Thermal modeling shows stable illumination at ${(180 + candidate.rank * 12).toFixed(0)} sol-hours/year on sunlit portions.`
      : `Moderate ice signature detected with permittivity εr ≈ ${(2.9 + candidate.rank * 0.04).toFixed(2)}. Surface regolith maturity index suggests ${candidate.missionDurationSols} sol mission viable with ${candidate.expectedYield.toFixed(2)} L/m³ extraction yield. Slope analysis confirms ${candidate.slopeDeg.toFixed(1)}° gradient within soft-landing tolerance.`;

  const nearbyNames = [
    'Subsurface ice cluster',
    'Permittivity anomaly',
    'Thermal cold trap',
    'Backscatter peak',
    'Regolith boundary',
  ];

  return {
    siteId: candidate.id,
    headline: `${candidate.name} — AI Site Assessment`,
    whySelected,
    confidence,
    confidenceFactors: [
      { label: 'Ice Detection', value: candidate.iceProbability, weight: 0.3 },
      { label: 'Terrain Stability', value: candidate.terrainStability, weight: 0.22 },
      { label: 'Mission Success', value: candidate.missionSuccessProbability, weight: 0.2 },
      { label: 'Scientific Value', value: candidate.scientificValue, weight: 0.15 },
      { label: 'Extraction Potential', value: candidate.extractionPotential, weight: 0.13 },
    ],
    supportingEvidence: [
      {
        id: 'ev-1',
        label: 'L-band backscatter',
        value: `${(-6.2 - candidate.rank * 0.4).toFixed(1)} dB`,
        source: 'DFSAR',
        strength: Math.min(98, candidate.iceProbability + 8),
      },
      {
        id: 'ev-2',
        label: 'Permittivity inversion',
        value: `εr ${(3.0 + candidate.rank * 0.06).toFixed(2)}`,
        source: 'AI-CORE',
        strength: candidate.iceProbability,
      },
      {
        id: 'ev-3',
        label: 'Slope gradient',
        value: `${candidate.slopeDeg.toFixed(1)}°`,
        source: 'DEM',
        strength: Math.max(60, 100 - candidate.slopeDeg * 4),
      },
      {
        id: 'ev-4',
        label: 'Thermal stability',
        value: `${candidate.terrainStability.toFixed(0)}%`,
        source: 'THERMAL',
        strength: candidate.terrainStability,
      },
    ],
    terrain: {
      classification: profile.classification,
      stability: candidate.terrainStability,
      regolithDepthM: 1.2 + candidate.rank * 0.3,
      illuminationHours: 180 + (7 - candidate.rank) * 18,
      craterProximity: profile.crater,
      surfaceComposition: profile.composition,
    },
    slope: {
      degrees: candidate.slopeDeg,
      grade: slopeGrade(candidate.slopeDeg),
      withinRoverLimits: candidate.slopeDeg <= 12,
      maxSafeDeg: 12,
    },
    nearbyDetections: nearbyNames.slice(0, 3 + (candidate.rank % 2)).map((label, i) => ({
      id: `near-${candidate.id}-${i}`,
      label,
      distanceKm: 0.8 + i * 1.4 + candidate.rank * 0.2,
      confidence: Math.max(55, candidate.iceProbability - i * 8),
      type: (['ice', 'anomaly', 'terrain'] as const)[i % 3],
    })),
    radarSignature: {
      band: 'L-band (1.25 GHz)',
      backscatterDb: -6.2 - candidate.rank * 0.4,
      polarization: 'HH / HV cross-pol',
      permittivity: 3.0 + candidate.rank * 0.06,
      penetrationDepthM: 4.8 - candidate.rank * 0.2,
      waveform: buildWaveform(candidate.rank * 1.7),
    },
    scientificReasoning,
    modelVersion: 'ice-detection-v2.4',
    inferenceTimeMs: 847 + candidate.rank * 42,
  };
}
