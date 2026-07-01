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
    <motion.div variants={fadeIn} className="flex h-full min-w-0 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-label">Mission Logs</h3>
        <span className="font-mono text-[10px] text-text-muted">Streaming</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-[10px] leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex gap-3 py-1"
            >
              <span className="shrink-0 text-text-muted">{log.timestamp}</span>
              <span className={cn('shrink-0 uppercase', levelStyles[log.level])}>
                {log.level}
              </span>
              <span className="min-w-0 truncate text-text-secondary">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
