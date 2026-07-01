import { motion } from 'framer-motion';
import { TIMELINE_PHASES } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export function MissionTimeline() {
  return (
    <motion.div variants={fadeIn} className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-1">
      <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-normal text-text-primary">
          Mission Timeline
        </h3>
        <span className="shrink-0 font-mono text-xs text-text-muted">Phase 3/6</span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-x-auto overflow-y-auto pb-2">
        <div className="flex min-w-max items-start gap-2 px-1">
          {TIMELINE_PHASES.map((phase, index) => {
            const isLast = index === TIMELINE_PHASES.length - 1;

            return (
              <div key={phase.id} className="flex items-start">
                <motion.div
                  className="w-36 shrink-0 pr-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <div
                    className={cn(
                      'mb-3 h-px w-10',
                      phase.status === 'complete' && 'bg-signal',
                      phase.status === 'active' && 'bg-mission',
                      phase.status === 'pending' && 'bg-border-subtle',
                    )}
                  />
                  <p className="font-mono text-xs tracking-wide text-text-muted">{phase.timestamp}</p>
                  <p
                    className={cn(
                      'mt-1.5 text-base font-medium leading-snug tracking-normal',
                      phase.status === 'active' ? 'text-mission' : 'text-text-primary',
                    )}
                  >
                    {phase.label}
                  </p>
                </motion.div>

                {!isLast && (
                  <div className="mt-0 h-px w-8 shrink-0 self-start bg-border-subtle" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
