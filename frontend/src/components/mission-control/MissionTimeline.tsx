import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { TIMELINE_PHASES } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

const statusIcon = {
  complete: Check,
  active: Loader2,
  pending: Circle,
};

const statusStyles = {
  complete: 'border-signal/40 bg-signal/10 text-signal',
  active: 'border-ice/40 bg-ice/10 text-ice',
  pending: 'border-border-default bg-white/4 text-text-muted',
};

export function MissionTimeline() {
  return (
    <motion.div variants={fadeIn} className="flex h-full min-w-0 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted">
          Mission Timeline
        </h3>
        <span className="font-mono text-[10px] text-ice">Phase 3/6 Active</span>
      </div>

      <div className="relative flex-1 overflow-x-auto overflow-y-hidden pb-1">
        <div className="flex min-w-max items-start gap-0 px-1">
          {TIMELINE_PHASES.map((phase, index) => {
            const Icon = statusIcon[phase.status];
            const isLast = index === TIMELINE_PHASES.length - 1;

            return (
              <div key={phase.id} className="flex items-start">
                <motion.div
                  className="group relative w-36 shrink-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'relative flex size-8 items-center justify-center rounded-full border-2 transition-shadow duration-300',
                        statusStyles[phase.status],
                        phase.status === 'active' && 'shadow-[0_0_16px_rgb(103_216_255/0.35)]',
                      )}
                    >
                      <Icon
                        className={cn('size-3.5', phase.status === 'active' && 'animate-spin')}
                        strokeWidth={2.5}
                      />
                      {phase.status === 'active' && (
                        <motion.span
                          className="absolute inset-0 rounded-full border-2 border-ice/50"
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>

                    <p className="mt-2 text-center text-[11px] font-medium text-text-primary">
                      {phase.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] text-text-muted">{phase.timestamp}</p>

                    <p className="mt-1.5 line-clamp-2 px-1 text-center text-[9px] leading-tight text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                      {phase.description}
                    </p>
                  </div>
                </motion.div>

                {!isLast && (
                  <div className="relative mt-4 h-0.5 w-8 shrink-0 overflow-hidden bg-white/8">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-signal to-ice"
                      initial={{ width: '0%' }}
                      animate={{
                        width: phase.status === 'complete' ? '100%' : phase.status === 'active' ? '50%' : '0%',
                      }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
