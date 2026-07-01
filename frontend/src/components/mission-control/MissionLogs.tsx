import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionLogs } from '@/hooks/useMissionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

const levelStyles = {
  info: 'text-mission',
  success: 'text-signal',
  warning: 'text-warning',
  system: 'text-text-secondary',
};

export function MissionLogs() {
  const logs = useMissionLogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <motion.div variants={fadeIn} className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-1">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
        <h3 className="text-label">Mission Logs</h3>
        <span className="shrink-0 font-mono text-xs text-text-muted">Streaming</span>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto pr-2 font-mono text-xs leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-[4.5rem_4rem_minmax(0,1fr)] items-baseline gap-x-3 gap-y-0.5 py-2"
            >
              <span className="shrink-0 text-text-muted">{log.timestamp}</span>
              <span className={cn('shrink-0 uppercase tracking-wide', levelStyles[log.level])}>
                {log.level}
              </span>
              <span className="min-w-0 text-text-secondary">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
