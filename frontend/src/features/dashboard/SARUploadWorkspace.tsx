import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/common/GlassPanel';
import { Badge } from '@/components/common/Badge';
import { MISSION_ID } from '@/data/missionData';
import {
  DragDropZone,
  FileQueue,
  MissionControlSequence,
  MissionReadyBanner,
  MissionTelemetry,
  useSARUploadPipeline,
} from '@/features/sar-upload';
import { staggerContainer, fadeUp } from '@/utils/motion';

export function SARUploadWorkspace() {
  const {
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
    isBusy,
  } = useSARUploadPipeline();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge color="mission" pulse={isBusy}>
              SAR Ingestion
            </Badge>
            <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-text-primary lg:text-2xl">
              SAR Upload
            </h2>
            <p className="mt-0.5 text-sm text-text-secondary">
              Chandrayaan-2 DFSAR dual-frequency imagery · Mission Control pipeline
            </p>
          </div>
          <span className="font-mono text-[10px] text-text-muted">{MISSION_ID}</span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MissionTelemetry phase={phase} overallProgress={overallProgress} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MissionReadyBanner visible={phase === 'complete'} onReset={reset} />
      </motion.div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp} className="min-h-0">
          <GlassPanel animate={false} className="flex h-full flex-col p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted">
                Data Ingestion
              </h3>
              <span className="font-mono text-[9px] text-ice">CH-2 DFSAR PAYLOAD</span>
            </div>

            <DragDropZone
              onDrop={handleDrop}
              onFiles={handleFiles}
              phase={phase}
              uploadProgress={uploadProgress}
              disabled={isBusy}
            />

            <FileQueue files={files} activeFileId={activeFileId} />
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0">
          <GlassPanel
            animate={false}
            strong={phase === 'processing' || phase === 'complete'}
            className="relative flex h-full flex-col overflow-hidden p-5"
          >
            <div className="pointer-events-none absolute inset-0 grid-mission opacity-30" />

            {phase === 'idle' && (
              <div className="relative flex flex-1 flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border-default bg-white/3">
                  <span className="font-mono text-lg font-bold text-text-muted">—</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Pipeline Standing By
                </p>
                <p className="mt-2 max-w-xs text-sm text-text-secondary">
                  Upload a DFSAR swath to initiate the 7-stage mission control processing sequence
                </p>
              </div>
            )}

            {(phase === 'uploading' || phase === 'processing' || phase === 'complete') && (
              <div className="relative min-h-0 flex-1">
                <MissionControlSequence
                  stages={stages}
                  phase={phase}
                  overallProgress={overallProgress}
                  elapsedMs={elapsedMs}
                />
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
