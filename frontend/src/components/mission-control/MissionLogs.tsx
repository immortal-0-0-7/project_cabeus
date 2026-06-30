import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionLogs } from '@/hooks/useMissionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

const levelStyles = {
  info: 'text-ice',
  success: 'text-signal',
  warning: 'text-warning',
  system: 'text-cinematic',
};

export function MissionLogs() {
  const logs = useMissionLogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <motion.div variants={fadeIn} className="flex h-full min-w-0 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Mission Logs
        </h3>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-signal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
          </span>
          Streaming
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg border border-border-subtle bg-space-deep/80 p-2 font-mono text-[10px] leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-2 py-0.5"
            >
              <span className="shrink-0 text-text-muted">{log.timestamp}</span>
              <span className={cn('shrink-0 uppercase', levelStyles[log.level])}>
                [{log.level}]
              </span>
              <span className="shrink-0 text-mission">{log.source}</span>
              <span className="min-w-0 truncate text-text-secondary">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
