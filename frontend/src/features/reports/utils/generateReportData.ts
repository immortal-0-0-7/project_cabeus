import {
  MISSION_ID,
  MISSION_NAME,
  ORBITER,
  TARGET_REGION,
  MISSION_STATISTICS,
} from '@/data/missionData';
import {
  CONFIDENCE_DISTRIBUTION,
  PROCESSING_METRICS,
  SPECTRAL_DATA,
  ANALYSIS_STATISTICS,
} from '@/features/analysis/constants';
import { generateExplainability } from '@/features/explainability/utils/generateExplainability';
import { generateLandingCandidates } from '@/features/landing-intelligence/utils/generateCandidates';
import {
  RISK_LABELS,
  RISK_THRESHOLDS,
} from '@/features/landing-intelligence/constants';
import { getRiskLevel } from '@/features/landing-intelligence/utils/ranking';
import { ICE_DEPOSITS } from '@/features/rover-simulation/constants';
import type { RiskLevel } from '@/data/missionData';
import type { MissionReportData, ReportSectionMeta } from '../types';

function riskFromScore(score: number): RiskLevel {
  for (const t of RISK_THRESHOLDS) {
    if (score <= t.max) return t.level;
  }
  return 'high';
}

export const REPORT_SECTIONS: ReportSectionMeta[] = [
  { id: 'summary', title: 'Mission Summary', pages: 1, status: 'ready' },
  { id: 'ice', title: 'Detected Ice', pages: 2, status: 'ready' },
  { id: 'landing', title: 'Landing Recommendation', pages: 2, status: 'ready' },
  { id: 'science', title: 'Scientific Analysis', pages: 2, status: 'ready' },
  { id: 'yield', title: 'Expected Yield', pages: 1, status: 'ready' },
  { id: 'risk', title: 'Mission Risk', pages: 1, status: 'ready' },
  { id: 'confidence', title: 'Confidence', pages: 1, status: 'ready' },
  { id: 'recommendations', title: 'Recommendations', pages: 1, status: 'ready' },
];

export function generateMissionReportData(): MissionReportData {
  const candidates = generateLandingCandidates();
  const primary = candidates[0];
  const explainability = generateExplainability(primary);

  const deposits = ICE_DEPOSITS.map((d) => ({ ...d, collected: false }));
  const totalProjectedKg = deposits.reduce((sum, d) => sum + d.yieldKg, 0);
  const avgDepositConfidence =
    deposits.reduce((sum, d) => sum + d.confidence, 0) / deposits.length;

  const highConfidenceCount = CONFIDENCE_DISTRIBUTION.filter((b) =>
    b.range.startsWith('80'),
  ).reduce((sum, b) => sum + b.count, 0);

  const totalDetections = CONFIDENCE_DISTRIBUTION.reduce((sum, b) => sum + b.count, 0);

  const riskLevel = getRiskLevel(primary.risk);

  const riskFactors = [
    { label: 'Terrain Slope', score: primary.slopeDeg * 3.2, level: riskFromScore(primary.slopeDeg * 3.2) },
    { label: 'Shadow Exposure', score: 100 - primary.terrainStability * 0.4, level: riskFromScore(100 - primary.terrainStability * 0.4) },
    { label: 'Landing Precision', score: primary.risk, level: riskLevel },
    { label: 'Communication Gap', score: 14.2, level: 'low' as RiskLevel },
    { label: 'Thermal Extremes', score: 22.8, level: 'moderate' as RiskLevel },
  ];

  const recommendations = [
    `Proceed with ${primary.name} as primary landing target — composite score ${primary.compositeScore.toFixed(1)}/100 with ${primary.iceProbability.toFixed(1)}% ice probability.`,
    'Deploy rover to sunlit rim terrace rather than permanently shadowed crater floor to maximize solar power and thermal stability.',
    `Target subsurface ice at 1–2 m depth using L-band permittivity-guided navigation; projected extraction yield ${primary.expectedYield.toFixed(2)} L/m³.`,
    `Maintain ${primary.missionDurationSols}-sol mission window with ${candidates[1]?.name ?? 'backup site'} as contingency landing zone.`,
    'Prioritize Primary Target and Alpha Vein deposits during rover traverse — highest confidence ice signatures (94% and 91%).',
    'Continue DFSAR cross-polarization calibration to refine permittivity inversion before final descent commit.',
    'Implement shadow-zone mitigation: use orbital relay for DSN link during crater floor operations.',
  ];

  const totalPages = REPORT_SECTIONS.reduce((sum, s) => sum + s.pages, 0) + 1;

  return {
    meta: {
      missionId: MISSION_ID,
      missionName: MISSION_NAME,
      orbiter: ORBITER,
      targetRegion: TARGET_REGION,
      generatedAt: new Date().toISOString(),
      totalPages,
    },
    summary: {
      headline: 'Subsurface Ice Confirmed at Lunar South Pole',
      overview: `Chandrayaan-2 DFSAR dual-frequency SAR data from the lunar south polar region has been processed through the CABEUS ice intelligence pipeline. Analysis covers ${MISSION_STATISTICS[0].value} km² of terrain between 70°S and 90°S latitude with L-band penetration depth modeling and neural ice signature detection.`,
      primaryFinding: `Subsurface ice signatures detected at ${primary.name} with ${primary.iceProbability}% probability. Composite landing score of ${primary.compositeScore.toFixed(1)}/100 recommends this site as the primary target for resource extraction missions.`,
      coverageKm2: MISSION_STATISTICS[0].value,
      processingComplete: MISSION_STATISTICS[2].value,
      sitesRanked: MISSION_STATISTICS[3].value,
      timelineStatus: 'Analysis pipeline 68% complete · Site ranking active',
    },
    detectedIce: {
      totalDetections,
      highConfidenceCount,
      avgConfidence: avgDepositConfidence,
      iceProbability: primary.iceProbability,
      spectralData: SPECTRAL_DATA,
      confidenceDistribution: CONFIDENCE_DISTRIBUTION,
      deposits,
      penetrationDepthM: ANALYSIS_STATISTICS[3].value,
    },
    landing: {
      primary,
      candidates: candidates.slice(0, 6),
      explainability,
    },
    science: {
      reasoning: explainability.scientificReasoning,
      radarSignature: `${explainability.radarSignature.band} · σ° ${explainability.radarSignature.backscatterDb.toFixed(1)} dB · ${explainability.radarSignature.polarization} · εr ${explainability.radarSignature.permittivity.toFixed(2)} · penetration ${explainability.radarSignature.penetrationDepthM.toFixed(1)} m`,
      permittivity: explainability.radarSignature.permittivity,
      iceConcentration: 4.2,
      processingMetrics: PROCESSING_METRICS,
      modelVersion: explainability.modelVersion,
      inferenceTimeMs: explainability.inferenceTimeMs,
    },
    yield: {
      primaryYieldLm3: primary.expectedYield,
      totalProjectedKg,
      missionDurationSols: primary.missionDurationSols,
      extractionPotential: primary.extractionPotential,
      depositYields: deposits.map((d) => ({
        label: d.label,
        yieldKg: d.yieldKg,
        confidence: d.confidence,
      })),
      siteComparison: candidates.slice(0, 4).map((c) => ({
        name: c.name,
        expectedYield: c.expectedYield,
        status: c.status,
      })),
    },
    risk: {
      overallRisk: primary.risk,
      riskLevel,
      riskLabel: RISK_LABELS[riskLevel],
      factors: riskFactors,
      siteRisks: candidates.slice(0, 4).map((c) => ({
        name: c.name,
        risk: c.risk,
        riskLevel: getRiskLevel(c.risk),
      })),
    },
    confidence: {
      overall: explainability.confidence,
      modelConfidence: ANALYSIS_STATISTICS[2].value,
      factors: explainability.confidenceFactors,
      distribution: CONFIDENCE_DISTRIBUTION,
    },
    recommendations,
  };
}
