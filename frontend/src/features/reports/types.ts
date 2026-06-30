import type { RiskLevel } from '@/data/missionData';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import type { SiteExplainability } from '@/features/explainability/types';
import type { ConfidenceBucket, SpectralBand } from '@/features/analysis/types';
import type { IceDeposit } from '@/features/rover-simulation/types';

export type ReportSectionId =
  | 'summary'
  | 'ice'
  | 'landing'
  | 'science'
  | 'yield'
  | 'risk'
  | 'confidence'
  | 'recommendations';

export interface ReportSectionMeta {
  id: ReportSectionId;
  title: string;
  pages: number;
  status: 'ready' | 'generating';
}

export interface MissionReportMeta {
  missionId: string;
  missionName: string;
  orbiter: string;
  targetRegion: string;
  generatedAt: string;
  totalPages: number;
}

export interface MissionSummaryData {
  headline: string;
  overview: string;
  primaryFinding: string;
  coverageKm2: number;
  processingComplete: number;
  sitesRanked: number;
  timelineStatus: string;
}

export interface DetectedIceData {
  totalDetections: number;
  highConfidenceCount: number;
  avgConfidence: number;
  iceProbability: number;
  spectralData: SpectralBand[];
  confidenceDistribution: ConfidenceBucket[];
  deposits: IceDeposit[];
  penetrationDepthM: number;
}

export interface LandingRecommendationData {
  primary: LandingCandidate;
  candidates: LandingCandidate[];
  explainability: SiteExplainability;
}

export interface ScientificAnalysisData {
  reasoning: string;
  radarSignature: string;
  permittivity: number;
  iceConcentration: number;
  processingMetrics: { label: string; value: number; max: number }[];
  modelVersion: string;
  inferenceTimeMs: number;
}

export interface ExpectedYieldData {
  primaryYieldLm3: number;
  totalProjectedKg: number;
  missionDurationSols: number;
  extractionPotential: number;
  depositYields: { label: string; yieldKg: number; confidence: number }[];
  siteComparison: { name: string; expectedYield: number; status: string }[];
}

export interface MissionRiskData {
  overallRisk: number;
  riskLevel: RiskLevel;
  riskLabel: string;
  factors: { label: string; score: number; level: RiskLevel }[];
  siteRisks: { name: string; risk: number; riskLevel: RiskLevel }[];
}

export interface ConfidenceData {
  overall: number;
  modelConfidence: number;
  factors: { label: string; value: number; weight: number }[];
  distribution: ConfidenceBucket[];
}

export interface MissionReportData {
  meta: MissionReportMeta;
  summary: MissionSummaryData;
  detectedIce: DetectedIceData;
  landing: LandingRecommendationData;
  science: ScientificAnalysisData;
  yield: ExpectedYieldData;
  risk: MissionRiskData;
  confidence: ConfidenceData;
  recommendations: string[];
}
