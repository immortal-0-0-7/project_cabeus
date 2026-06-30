export interface ConfidenceFactor {
  label: string;
  value: number;
  weight: number;
}

export interface SupportingEvidence {
  id: string;
  label: string;
  value: string;
  source: string;
  strength: number;
}

export interface NearbyDetection {
  id: string;
  label: string;
  distanceKm: number;
  confidence: number;
  type: 'ice' | 'terrain' | 'anomaly';
}

export interface RadarSignature {
  band: string;
  backscatterDb: number;
  polarization: string;
  permittivity: number;
  penetrationDepthM: number;
  waveform: number[];
}

export interface TerrainAnalysis {
  classification: string;
  stability: number;
  regolithDepthM: number;
  illuminationHours: number;
  craterProximity: string;
  surfaceComposition: string;
}

export interface SlopeAnalysis {
  degrees: number;
  grade: string;
  withinRoverLimits: boolean;
  maxSafeDeg: number;
}

export interface SiteExplainability {
  siteId: string;
  headline: string;
  whySelected: string;
  confidence: number;
  confidenceFactors: ConfidenceFactor[];
  supportingEvidence: SupportingEvidence[];
  terrain: TerrainAnalysis;
  slope: SlopeAnalysis;
  nearbyDetections: NearbyDetection[];
  radarSignature: RadarSignature;
  scientificReasoning: string;
  modelVersion: string;
  inferenceTimeMs: number;
}
