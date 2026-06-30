export type PipelinePhase = 'idle' | 'uploading' | 'processing' | 'complete';

export type StageStatus = 'pending' | 'active' | 'complete';

export interface MissionStage {
  id: string;
  label: string;
  description: string;
  durationMs: number;
  telemetryCode: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  band: string;
  status: 'queued' | 'uploading' | 'uploaded' | 'processing' | 'complete';
  uploadProgress: number;
}

export interface StageState {
  stage: MissionStage;
  status: StageStatus;
  progress: number;
}
