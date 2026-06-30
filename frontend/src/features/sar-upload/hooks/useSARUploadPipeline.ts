import { useCallback, useEffect, useRef, useState } from 'react';
import { MISSION_STAGES, UPLOAD_DURATION_MS } from '../constants';
import type { PipelinePhase, StageState, UploadedFile } from '../types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

function inferBand(name: string): string {
  if (name.includes('_L_') || name.toLowerCase().includes('l-band')) return 'L-band HH/HV';
  if (name.includes('_S_') || name.toLowerCase().includes('s-band')) return 'S-band VV/VH';
  return 'DFSAR dual-pol';
}

function createFileFromNative(file: File): UploadedFile {
  return {
    id: `${file.name}-${Date.now()}`,
    name: file.name,
    size: formatBytes(file.size),
    sizeBytes: file.size,
    band: inferBand(file.name),
    status: 'queued',
    uploadProgress: 0,
  };
}

const DEMO_FILES: UploadedFile[] = [
  {
    id: 'demo-1',
    name: 'C2_DFSAR_L_South_2847.tif',
    size: '847 MB',
    sizeBytes: 888_143_872,
    band: 'L-band HH/HV',
    status: 'complete',
    uploadProgress: 100,
  },
  {
    id: 'demo-2',
    name: 'C2_DFSAR_S_South_2847.tif',
    size: '412 MB',
    sizeBytes: 432_013_312,
    band: 'S-band VV/VH',
    status: 'complete',
    uploadProgress: 100,
  },
];

export function useSARUploadPipeline() {
  const reducedMotion = useReducedMotion();
  const rafRef = useRef(0);
  const pipelineStartRef = useRef(0);

  const [phase, setPhase] = useState<PipelinePhase>('idle');
  const [files, setFiles] = useState<UploadedFile[]>(DEMO_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [stageProgress, setStageProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const stages: StageState[] = MISSION_STAGES.map((stage, index) => {
    let status: StageState['status'] = 'pending';
    if (phase === 'complete') status = 'complete';
    else if (index < activeStageIndex) status = 'complete';
    else if (index === activeStageIndex) status = 'active';

    return {
      stage,
      status,
      progress: index === activeStageIndex ? stageProgress : status === 'complete' ? 100 : 0,
    };
  });

  const overallProgress =
    phase === 'complete'
      ? 100
      : phase === 'idle'
        ? 0
        : phase === 'uploading'
          ? uploadProgress * 0.12
          : 12 + ((activeStageIndex + stageProgress / 100) / MISSION_STAGES.length) * 88;

  const markFileComplete = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'complete' } : f)),
    );
  }, []);

  const startProcessing = useCallback(
    (fileId: string) => {
      if (reducedMotion) {
        setPhase('complete');
        setActiveStageIndex(MISSION_STAGES.length - 1);
        setStageProgress(100);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'complete', uploadProgress: 100 } : f,
          ),
        );
        return;
      }

      setPhase('processing');
      setActiveStageIndex(0);
      setStageProgress(0);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: 'processing' } : f)),
      );
    },
    [reducedMotion],
  );

  const runUpload = useCallback(
    (file: UploadedFile) => {
      setActiveFileId(file.id);
      setPhase('uploading');
      setUploadProgress(0);
      setActiveStageIndex(-1);
      setStageProgress(0);
      pipelineStartRef.current = performance.now();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: 'uploading', uploadProgress: 0 } : f,
        ),
      );

      if (reducedMotion) {
        setUploadProgress(100);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'uploaded', uploadProgress: 100 } : f,
          ),
        );
        startProcessing(file.id);
        return;
      }

      const duration = UPLOAD_DURATION_MS;
      const tick = (now: number) => {
        const elapsed = now - pipelineStartRef.current;
        const progress = Math.min(100, (elapsed / duration) * 100);
        setUploadProgress(progress);
        setElapsedMs(elapsed);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, uploadProgress: progress } : f,
          ),
        );

        if (progress < 100) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: 'uploaded', uploadProgress: 100 } : f,
            ),
          );
          startProcessing(file.id);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [reducedMotion, startProcessing],
  );

  const handleFiles = useCallback(
    (nativeFiles: FileList | File[]) => {
      const list = Array.from(nativeFiles);
      if (!list.length) return;

      const newFile = createFileFromNative(list[0]);
      setFiles((prev) => [...prev, newFile]);
      runUpload(newFile);
    },
    [runUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  useEffect(() => {
    if (phase !== 'processing' || activeStageIndex < 0) return;

    const currentStage = MISSION_STAGES[activeStageIndex];
    if (!currentStage) return;

    const stageStart = performance.now();

    const tick = (now: number) => {
      const elapsed = now - pipelineStartRef.current;
      const stageElapsed = now - stageStart;
      const progress = Math.min(100, (stageElapsed / currentStage.durationMs) * 100);

      setElapsedMs(elapsed);
      setStageProgress(progress);

      if (progress < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (activeStageIndex < MISSION_STAGES.length - 1) {
        setActiveStageIndex((i) => i + 1);
        setStageProgress(0);
      } else {
        setPhase('complete');
        setStageProgress(100);
        if (activeFileId) markFileComplete(activeFileId);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, activeStageIndex, activeFileId, markFileComplete]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase('idle');
    setActiveStageIndex(-1);
    setStageProgress(0);
    setUploadProgress(0);
    setActiveFileId(null);
    setElapsedMs(0);
  }, []);

  return {
    phase,
    files,
    activeFileId,
    uploadProgress,
    stages,
    overallProgress,
    elapsedMs,
    handleDrop,
    handleFiles,
    reset,
    isBusy: phase === 'uploading' || phase === 'processing',
  };
}
