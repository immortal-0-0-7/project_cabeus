import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { IconButton } from '@/components/common/IconButton';
import { DisplayHeading } from '@/components/common/DisplayHeading';
import { useUI } from '@/store/uiContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useLiveClock } from '@/hooks/useMissionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export interface TopbarProps {
  title?: string;
  subtitle?: string;
  scrolled?: boolean;
}

export function Topbar({
  title = 'Mission Control',
  subtitle,
  scrolled = false,
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
        'border-b px-6 transition-all duration-500 lg:px-10',
        scrolled
          ? 'border-border-default bg-space-void/95 backdrop-blur-xl'
          : 'border-border-subtle bg-transparent',
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        {isMobile && (
          <IconButton label="Open navigation" onClick={toggleSidebarMobile}>
            <Menu className="size-4" />
          </IconButton>
        )}

        <div className="min-w-0">
          <DisplayHeading
            as="h1"
            accent="cool"
            className="font-display text-[clamp(1.25rem,3vw,1.75rem)] font-semibold tracking-[-0.03em] text-text-primary"
          >
            {title}
          </DisplayHeading>
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
