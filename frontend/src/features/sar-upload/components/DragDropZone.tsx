import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Radar, Upload } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PipelinePhase } from '../types';

interface DragDropZoneProps {
  onDrop: (e: React.DragEvent) => void;
  onFiles: (files: FileList) => void;
  phase: PipelinePhase;
  uploadProgress: number;
  disabled?: boolean;
}

export function DragDropZone({
  onDrop,
  onFiles,
  phase,
  uploadProgress,
  disabled,
}: DragDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useReducedMotion();
  const isUploading = phase === 'uploading';
  const isProcessing = phase === 'processing' || phase === 'complete';

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        setDragging(false);
        if (!disabled) onDrop(e);
      }}
      className={cn(
        'group relative flex min-h-[280px] flex-1 flex-col items-center justify-center overflow-hidden rounded-xl',
        'border-2 border-dashed transition-colors duration-300',
        dragging && !disabled
          ? 'border-ice bg-ice/8'
          : 'border-border-default bg-white/2 hover:border-ice/25 hover:bg-ice/4',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      {/* HUD corner brackets */}
      <span className="pointer-events-none absolute left-3 top-3 size-5 border-l-2 border-t-2 border-ice/30" />
      <span className="pointer-events-none absolute right-3 top-3 size-5 border-r-2 border-t-2 border-ice/30" />
      <span className="pointer-events-none absolute bottom-3 left-3 size-5 border-b-2 border-l-2 border-ice/30" />
      <span className="pointer-events-none absolute bottom-3 right-3 size-5 border-b-2 border-r-2 border-ice/30" />

      {/* Radar sweep */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <motion.div
            className="absolute size-64 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgb(103 216 255 / 0.35) 360deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute size-48 rounded-full border border-ice/10" />
          <div className="absolute size-32 rounded-full border border-ice/15" />
          <div className="absolute size-16 rounded-full border border-ice/20" />
        </div>
      )}

      {/* Scan line */}
      {!reducedMotion && (dragging || isUploading) && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-ice/60 to-transparent"
          initial={{ top: '10%' }}
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".tif,.tiff,.h5,.nc"
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      <motion.div
        animate={
          dragging
            ? { scale: 1.08, y: -6 }
            : isUploading
              ? { scale: [1, 1.04, 1] }
              : { scale: 1, y: 0 }
        }
        transition={
          isUploading
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 300, damping: 22 }
        }
        className="relative z-10 flex flex-col items-center"
      >
        <div
          className={cn(
            'relative flex size-16 items-center justify-center rounded-2xl border',
            dragging || isUploading
              ? 'border-ice/40 bg-ice/10 shadow-[0_0_32px_rgb(103_216_255/0.25)]'
              : 'border-border-default bg-white/4',
          )}
        >
          {isProcessing ? (
            <Radar className="size-8 text-ice" strokeWidth={1.5} />
          ) : (
            <Upload className="size-8 text-ice" strokeWidth={1.5} />
          )}
          {!reducedMotion && (dragging || isUploading) && (
            <motion.span
              className="absolute inset-0 rounded-2xl border border-ice/40"
              animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
        </div>

        <p className="mt-5 text-sm font-medium text-text-primary">
          {isUploading
            ? 'Transmitting SAR swath to mission buffer'
            : isProcessing
              ? 'Swath ingested — pipeline active'
              : 'Drop DFSAR imagery here'}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          L-band / S-band GeoTIFF · Max 2 GB per swath
        </p>
      </motion.div>

      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
            className="relative z-10 mt-6 w-full max-w-xs px-6"
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[10px]">
              <span className="text-text-muted">UPLINK</span>
              <span className="text-ice">{uploadProgress.toFixed(1)}%</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-progress"
                style={{ width: `${uploadProgress}%` }}
                layout
              />
              {!reducedMotion && (
                <motion.div
                  className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '400%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </div>
            <p className="mt-2 text-center font-mono text-[9px] text-text-muted">
              DSN LINK NOMINAL · CH-2 ORBIT 2847
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isUploading && !isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 mt-6"
        >
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FolderOpen className="size-3.5" />}
            onClick={() => inputRef.current?.click()}
          >
            Browse Mission Archive
          </Button>
        </motion.div>
      )}
    </div>
  );
}
