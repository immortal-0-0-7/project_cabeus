export type SimulationPhase = 'idle' | 'placed' | 'running' | 'paused' | 'complete';

export interface MapPoint {
  x: number;
  y: number;
}

export interface IceDeposit {
  id: string;
  position: MapPoint;
  yieldKg: number;
  confidence: number;
  label: string;
  collected: boolean;
}

export interface RoverMetrics {
  battery: number;
  distance: number;
  energy: number;
  iceCollected: number;
  missionScore: number;
  missionSuccessProbability: number;
  scientificReturn: number;
}

export interface MetricHistory {
  battery: number[];
  distance: number[];
  energy: number[];
  iceCollected: number[];
  missionScore: number[];
  missionSuccessProbability: number[];
  scientificReturn: number[];
}

export interface RoverSimulationState {
  phase: SimulationPhase;
  roverPosition: MapPoint | null;
  path: MapPoint[];
  pathProgress: number;
  heading: number;
  simTimeMin: number;
  metrics: RoverMetrics;
  history: MetricHistory;
  iceDeposits: IceDeposit[];
}

export interface MetricDefinition {
  id: keyof RoverMetrics;
  label: string;
  unit: string;
  icon: string;
  color: string;
  max: number;
  description: string;
}
