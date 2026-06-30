import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { AIInsightsPanel } from '@/components/mission-control/AIInsightsPanel';
import { MissionBottomDock } from '@/components/mission-control/MissionBottomDock';
import { useUI } from '@/store/uiContext';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

export function DashboardLayout() {
  const { sidebarCollapsed } = useUI();
  const isMobile = useIsMobile();

  return (
    <div className="relative flex h-dvh overflow-hidden">
      <AmbientBackground />
      <Sidebar />

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          !isMobile && (sidebarCollapsed ? 'ml-(--spacing-sidebar-collapsed)' : 'ml-(--spacing-sidebar)'),
        )}
      >
        <Topbar />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="relative min-w-0 flex-1 overflow-y-auto">
            <div className="noise-overlay pointer-events-none absolute inset-0 z-0" />
            <div className="relative z-10 flex min-h-full flex-col p-3 lg:p-4 xl:p-5">
              <PageTransition />
            </div>
          </main>

          <AIInsightsPanel />
        </div>

        <MissionBottomDock />
      </div>
    </div>
  );
}
