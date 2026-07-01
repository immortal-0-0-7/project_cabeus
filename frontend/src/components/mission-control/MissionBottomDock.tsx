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
                  'flex flex-1 items-center justify-center py-4 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-500',
                  active ? 'text-text-primary' : 'text-text-muted',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="h-(--spacing-bottom-dock-mobile) px-6 py-4">
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
      className="grid h-(--spacing-bottom-dock) shrink-0 grid-cols-1 gap-8 border-t border-border-subtle px-8 py-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-12 lg:px-10"
    >
      <MissionTimeline />
      <MissionStatistics />
      <MissionLogs />
    </motion.footer>
  );
}
