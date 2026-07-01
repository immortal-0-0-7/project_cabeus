import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { DisplayHeading } from '@/components/common/DisplayHeading';
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
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-12">
        <Badge color="mission" pulse={isBusy}>
          SAR Ingestion
        </Badge>
        <DisplayHeading
          accent="warm"
          className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary"
        >
          SAR Upload
        </DisplayHeading>
        <p className="mt-3 text-lg font-light text-text-secondary">
          Chandrayaan-2 DFSAR dual-frequency imagery
        </p>
        <p className="text-label mt-2">{MISSION_ID}</p>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-10">
        <MissionTelemetry phase={phase} overallProgress={overallProgress} />
      </motion.div>

      <motion.div variants={fadeUp} className="mb-10">
        <MissionReadyBanner visible={phase === 'complete'} onReset={reset} />
      </motion.div>

      <div className="grid min-h-0 flex-1 gap-12 border-t border-border-subtle pt-10 lg:grid-cols-2 lg:gap-16">
        <motion.div variants={fadeUp} className="min-h-0">
          <p className="text-label mb-6">Data Ingestion</p>
          <DragDropZone
            onDrop={handleDrop}
            onFiles={handleFiles}
            phase={phase}
            uploadProgress={uploadProgress}
            disabled={isBusy}
          />
          <FileQueue files={files} activeFileId={activeFileId} />
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0">
          <p className="text-label mb-6">Processing Pipeline</p>

          {phase === 'idle' && (
            <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
              <p className="font-display text-4xl font-light text-text-muted">—</p>
              <p className="text-label mt-6">Pipeline Standing By</p>
              <p className="mt-4 max-w-xs text-sm font-light text-text-secondary">
                Upload a DFSAR swath to initiate the 7-stage processing sequence
              </p>
            </div>
          )}

          {(phase === 'uploading' || phase === 'processing' || phase === 'complete') && (
            <div className="min-h-0 flex-1">
              <MissionControlSequence
                stages={stages}
                phase={phase}
                overallProgress={overallProgress}
                elapsedMs={elapsedMs}
              />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
