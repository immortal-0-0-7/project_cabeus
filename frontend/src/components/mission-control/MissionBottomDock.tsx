import { useState } from 'react';
import { motion } from 'framer-motion';
import { MissionTimeline } from '@/components/mission-control/MissionTimeline';
import { MissionStatistics } from '@/components/mission-control/MissionStatistics';
import { MissionLogs } from '@/components/mission-control/MissionLogs';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

type DockTab = 'timeline' | 'stats' | 'logs';

const tabs: { id: DockTab; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'stats', label: 'Statistics' },
  { id: 'logs', label: 'Logs' },
];

export function MissionBottomDock() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<DockTab>('timeline');

  if (isMobile) {
    return (
      <motion.footer
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="shrink-0 border-t border-border-subtle"
      >
        <div className="flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center py-4 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-500',
                  active ? 'text-text-primary' : 'text-text-muted',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="flex h-(--spacing-bottom-dock-mobile) min-h-0 flex-col overflow-hidden px-6 py-5">
          {activeTab === 'timeline' && <MissionTimeline />}
          {activeTab === 'stats' && <MissionStatistics />}
          {activeTab === 'logs' && <MissionLogs />}
        </div>
      </motion.footer>
    );
  }

  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="grid h-(--spacing-bottom-dock) max-h-(--spacing-bottom-dock) min-h-0 shrink-0 grid-cols-1 grid-rows-1 gap-0 overflow-hidden border-t border-border-subtle px-8 py-6 lg:grid-cols-[1.25fr_1fr_1fr] lg:gap-0 lg:px-10"
    >
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden lg:border-r lg:border-border-subtle lg:pr-10">
        <MissionTimeline />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden lg:border-r lg:border-border-subtle lg:px-10">
        <MissionStatistics />
      </div>
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden lg:pl-10">
        <MissionLogs />
      </div>
    </motion.footer>
  );
}
