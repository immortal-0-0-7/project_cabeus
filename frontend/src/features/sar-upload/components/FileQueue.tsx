import { motion, AnimatePresence } from 'framer-motion';
import { Check, FileImage, Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/utils/cn';
import type { UploadedFile } from '../types';

interface FileQueueProps {
  files: UploadedFile[];
  activeFileId: string | null;
}

const statusBadge = {
  queued: { label: 'Queued', color: 'mission' as const },
  uploading: { label: 'Uplink', color: 'ice' as const },
  uploaded: { label: 'Buffered', color: 'mission' as const },
  processing: { label: 'Processing', color: 'ice' as const },
  complete: { label: 'Complete', color: 'signal' as const },
};

export function FileQueue({ files, activeFileId }: FileQueueProps) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Swath Queue
        </h4>
        <span className="font-mono text-[9px] text-text-muted">{files.length} files</span>
      </div>

      <ul className="max-h-[200px] space-y-2 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {files.map((file, i) => {
            const badge = statusBadge[file.status];
            const isActive = file.id === activeFileId;

            return (
              <motion.li
                key={file.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  'relative overflow-hidden rounded-lg border px-3 py-2.5',
                  isActive
                    ? 'border-ice/30 bg-ice/5'
                    : 'border-border-subtle bg-white/2',
                )}
              >
                {file.status === 'uploading' && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-ice/8"
                    style={{ width: `${file.uploadProgress}%` }}
                    layout
                  />
                )}

                <div className="relative flex items-center gap-3">
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-md border',
                      file.status === 'complete'
                        ? 'border-signal/30 bg-signal/10 text-signal'
                        : file.status === 'uploading' || file.status === 'processing'
                          ? 'border-ice/30 bg-ice/10 text-ice'
                          : 'border-border-default bg-white/3 text-mission',
                    )}
                  >
                    {file.status === 'complete' ? (
                      <Check className="size-3.5" />
                    ) : file.status === 'uploading' ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : file.status === 'processing' ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <FileImage className="size-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text-primary">{file.name}</p>
                    <p className="text-[10px] text-text-muted">
                      {file.band} · {file.size}
                    </p>
                  </div>

                  <Badge color={badge.color} pulse={isActive && file.status !== 'complete'}>
                    {badge.label}
                  </Badge>
                </div>

                {file.status === 'uploading' && (
                  <div className="relative mt-2 h-0.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full bg-ice"
                      style={{ width: `${file.uploadProgress}%` }}
                    />
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>

        {files.length === 0 && (
          <li className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle py-8 text-center">
            <Upload className="mb-2 size-5 text-text-muted" />
            <p className="text-xs text-text-muted">No swaths in queue</p>
          </li>
        )}
      </ul>
    </div>
  );
}
