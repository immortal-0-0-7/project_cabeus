import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SidebarNavItem } from '@/components/layout/SidebarNavItem';
import { IconButton } from '@/components/common/IconButton';
import { DASHBOARD_NAV } from '@/types/navigation';
import { ROUTES } from '@/routes/paths';
import { useUI } from '@/store/uiContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { sidebarMobileOpen, setSidebarMobileOpen } = useUI();
  const isMobile = useIsMobile();

  const closeMobile = () => setSidebarMobileOpen(false);
  const showLabels = isMobile ? sidebarMobileOpen : true;

  return (
    <>
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-space-void backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-dvh flex-col border-r border-border-subtle glass-strong',
          isMobile
            ? cn('w-64', !sidebarMobileOpen && '-translate-x-full')
            : 'w-(--spacing-sidebar)',
        )}
        initial={false}
      >
        <div className="flex h-(--spacing-topbar) shrink-0 items-center gap-3 px-4">
          <Link
            to={ROUTES.home}
            className="flex size-10 shrink-0 items-center justify-center transition-opacity duration-500 hover:opacity-70"
            aria-label="Project Cabeus home"
          >
            <span className="font-display text-base font-bold tracking-tight text-text-secondary">C</span>
          </Link>

          {showLabels && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold tracking-tight text-text-primary">
                Cabeus
              </p>
              <p className="truncate font-mono text-[9px] tracking-[0.14em] text-text-muted uppercase">
                Mission Control
              </p>
            </div>
          )}

          {isMobile && (
            <IconButton
              label="Close navigation"
              className="ml-auto"
              onClick={closeMobile}
            >
              <X className="size-4" />
            </IconButton>
          )}
        </div>

        <nav className="flex flex-1 flex-col px-3 py-6" aria-label="Mission navigation">
          <ul className="space-y-1">
            {DASHBOARD_NAV.map((item, index) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                collapsed={!showLabels}
                index={index}
                onNavigate={isMobile ? closeMobile : undefined}
              />
            ))}
          </ul>
        </nav>

        {!isMobile && (
          <div className="shrink-0 px-3 pb-6">
            <Link
              to={ROUTES.home}
              className="flex items-center gap-2 px-3 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted transition-colors duration-500 hover:text-text-secondary"
            >
              Exit Mission
            </Link>
          </div>
        )}
      </motion.aside>
    </>
  );
}
