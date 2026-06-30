import { motion } from 'framer-motion';
import { Bell, Menu, Radio } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { useUI } from '@/store/uiContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useLiveClock } from '@/hooks/useMissionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export function Topbar({
  title = 'Mission Control',
  subtitle = 'ISRO · Chandrayaan-2 SAR Intelligence Pipeline',
}: TopbarProps) {
  const { sidebarCollapsed, toggleSidebarMobile } = useUI();
  const isMobile = useIsMobile();

  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        'sticky top-0 z-30 flex h-(--spacing-topbar) items-center justify-between',
        'border-b border-border-subtle glass px-4 lg:px-6',
      )}
    >
      <div className="flex items-center gap-3">
        {isMobile && (
          <IconButton label="Open navigation" onClick={toggleSidebarMobile}>
            <Menu className="size-4" />
          </IconButton>
        )}

        <div>
          <h1 className="text-sm font-semibold tracking-tight text-text-primary lg:text-base">
            {title}
          </h1>
          <p className="hidden text-xs text-text-muted sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <Badge color="mission" className="hidden sm:inline-flex">
          <Radio className="mr-1 size-3" strokeWidth={2} />
          Live Feed
        </Badge>

        <div className="hidden items-center gap-2 font-mono text-[11px] text-text-muted md:flex">
          <span className="text-text-secondary">UTC</span>
          <LiveClock />
        </div>

        <IconButton label="Notifications">
          <Bell className="size-4" />
        </IconButton>

        <div
          className={cn(
            'hidden size-8 items-center justify-center rounded-full border border-ice/25 bg-ice/10 lg:flex',
            sidebarCollapsed && 'lg:flex',
          )}
          aria-hidden
        >
          <span className="font-mono text-[10px] font-medium text-ice">ISRO</span>
        </div>
      </div>
    </motion.header>
  );
}

function LiveClock() {
  const formatted = useLiveClock();

  return (
    <motion.span
      key={formatted}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="tabular-nums text-text-secondary"
    >
      {formatted}
    </motion.span>
  );
}
