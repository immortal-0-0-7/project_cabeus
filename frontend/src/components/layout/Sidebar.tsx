import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Moon, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { SidebarNavItem } from '@/components/layout/SidebarNavItem';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { DASHBOARD_NAV, MISSION_STATUS } from '@/types/navigation';
import { ROUTES } from '@/routes/paths';
import { useUI } from '@/store/uiContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';
import { staggerContainer } from '@/utils/motion';

export function Sidebar() {
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebarCollapsed, setSidebarMobileOpen } =
    useUI();
  const isMobile = useIsMobile();

  const collapsed = isMobile ? false : sidebarCollapsed;

  const closeMobile = () => setSidebarMobileOpen(false);

  return (
    <>
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-space-void/80 backdrop-blur-sm lg:hidden"
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
          'transition-[width,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          collapsed ? 'w-(--spacing-sidebar-collapsed)' : 'w-(--spacing-sidebar)',
          isMobile && !sidebarMobileOpen && '-translate-x-full',
          isMobile && sidebarMobileOpen && 'translate-x-0',
        )}
        initial={false}
      >
        <div className="flex h-0.5 shrink-0">
          <span className="flex-1 bg-isro-saffron" />
          <span className="flex-1 bg-white/90" />
          <span className="flex-1 bg-isro-green" />
        </div>
        <div
          className={cn(
            'flex h-(--spacing-topbar) shrink-0 items-center border-b border-border-subtle px-4',
            collapsed && 'justify-center px-2',
          )}
        >
          <Link
            to={ROUTES.home}
            className={cn(
              'group flex items-center gap-3 transition-opacity hover:opacity-90',
              collapsed && 'justify-center',
            )}
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-ice/25 bg-ice/10">
              <Moon className="size-4 text-ice" strokeWidth={1.75} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-text-primary">
                  PROJECT CABEUS
                </p>
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Mission Control
                </p>
              </div>
            )}
          </Link>

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

        <div className={cn('px-3 py-4', collapsed && 'px-2')}>
          {!collapsed && (
            <div className="mb-4 px-2">
              <Badge color="signal" pulse>
                {MISSION_STATUS.nominal}
              </Badge>
            </div>
          )}

          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            aria-label="Mission navigation"
          >
            <ul className="space-y-1">
              {DASHBOARD_NAV.map((item, index) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  index={index}
                  onNavigate={isMobile ? closeMobile : undefined}
                />
              ))}
            </ul>
          </motion.nav>
        </div>

        <div className="mt-auto border-t border-border-subtle p-3">
          {!isMobile && (
            <IconButton
              label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn('w-full', collapsed && 'mx-auto')}
              onClick={toggleSidebarCollapsed}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </IconButton>
          )}

          {!collapsed && (
            <Link
              to={ROUTES.home}
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              <ChevronLeft className="size-3.5" />
              Return to surface
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  );
}
