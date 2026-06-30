import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Terminal } from 'lucide-react';
import { MissionTimeline } from '@/components/mission-control/MissionTimeline';
import { MissionStatistics } from '@/components/mission-control/MissionStatistics';
import { MissionLogs } from '@/components/mission-control/MissionLogs';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

type DockTab = 'timeline' | 'stats' | 'logs';

const tabs: { id: DockTab; label: string; icon: typeof Clock }[] = [
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'stats', label: 'Statistics', icon: Activity },
  { id: 'logs', label: 'Logs', icon: Terminal },
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
        className="shrink-0 border-t border-border-subtle glass"
      >
        <div className="flex border-b border-border-subtle">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'border-b-2 border-ice text-ice' : 'text-text-muted',
                )}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="h-(--spacing-bottom-dock-mobile) p-3">
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
      className="grid h-(--spacing-bottom-dock) shrink-0 grid-cols-1 gap-3 border-t border-border-subtle glass p-3 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-4 lg:p-4"
    >
      <MissionTimeline />
      <MissionStatistics />
      <MissionLogs />
    </motion.footer>
  );
}
