import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, X } from 'lucide-react';
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

  return (
    <>
      <AnimatePresence>
        {isMobile && sidebarMobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-space-void/90 backdrop-blur-md lg:hidden"
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
          'fixed left-0 top-0 z-50 flex h-dvh w-(--spacing-rail) flex-col',
          'border-r border-border-subtle',
          isMobile && !sidebarMobileOpen && '-translate-x-full',
          isMobile && sidebarMobileOpen && 'translate-x-0 w-64 glass-strong',
        )}
        initial={false}
      >
        <div className="flex h-(--spacing-topbar) shrink-0 items-center justify-center">
          <Link
            to={ROUTES.home}
            className="flex size-10 items-center justify-center transition-opacity duration-500 hover:opacity-70"
            aria-label="Project Cabeus home"
          >
            <Moon className="size-5 text-text-secondary" strokeWidth={1.25} />
          </Link>

          {isMobile && (
            <IconButton
              label="Close navigation"
              className="absolute right-3"
              onClick={closeMobile}
            >
              <X className="size-4" />
            </IconButton>
          )}
        </div>

        <nav className="flex flex-1 flex-col px-2 py-6" aria-label="Mission navigation">
          <ul className="space-y-1">
            {DASHBOARD_NAV.map((item, index) => (
              <SidebarNavItem
                key={item.id}
                item={item}
                collapsed={!isMobile}
                index={index}
                onNavigate={isMobile ? closeMobile : undefined}
              />
            ))}
          </ul>
        </nav>

        {!isMobile && (
          <div className="shrink-0 px-2 pb-6">
            <Link
              to={ROUTES.home}
              className="flex items-center justify-center py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-text-muted transition-colors duration-500 hover:text-text-secondary"
            >
              Exit
            </Link>
          </div>
        )}
      </motion.aside>
    </>
  );
}
