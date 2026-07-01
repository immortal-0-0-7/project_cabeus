import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
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
  subtitle,
}: TopbarProps) {
  const { toggleSidebarMobile } = useUI();
  const isMobile = useIsMobile();

  return (
    <motion.header
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={cn(
        'sticky top-0 z-30 flex h-(--spacing-topbar) items-center justify-between',
        'border-b border-border-subtle px-6 lg:px-10',
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {isMobile && (
          <IconButton label="Open navigation" onClick={toggleSidebarMobile}>
            <Menu className="size-4" />
          </IconButton>
        )}

        <div className="min-w-0">
          <h1 className="font-display text-[clamp(1.25rem,3vw,1.75rem)] font-semibold tracking-[-0.03em] text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-6">
        <div className="hidden items-baseline gap-2 font-mono text-xs md:flex">
          <span className="text-label">UTC</span>
          <LiveClock />
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
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="tabular-nums text-text-secondary"
    >
      {formatted}
    </motion.span>
  );
}
