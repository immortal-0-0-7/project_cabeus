import { motion } from 'framer-motion';
import { TIMELINE_PHASES } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export function MissionTimeline() {
  return (
    <motion.div variants={fadeIn} className="flex h-full min-w-0 flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-label">Mission Timeline</h3>
        <span className="font-mono text-[10px] text-text-muted">Phase 3/6</span>
      </div>

      <div className="relative flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex min-w-max items-start gap-0">
          {TIMELINE_PHASES.map((phase, index) => {
            const isLast = index === TIMELINE_PHASES.length - 1;

            return (
              <div key={phase.id} className="flex items-start">
                <motion.div
                  className="w-32 shrink-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <div
                    className={cn(
                      'mb-3 h-px w-8',
                      phase.status === 'complete' && 'bg-signal',
                      phase.status === 'active' && 'bg-mission',
                      phase.status === 'pending' && 'bg-border-subtle',
                    )}
                  />
                  <p className="font-mono text-[10px] text-text-muted">{phase.timestamp}</p>
                  <p
                    className={cn(
                      'mt-1 text-sm font-medium',
                      phase.status === 'active' ? 'text-mission' : 'text-text-primary',
                    )}
                  >
                    {phase.label}
                  </p>
                </motion.div>

                {!isLast && (
                  <div className="mt-0 h-px w-6 shrink-0 bg-border-subtle" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
