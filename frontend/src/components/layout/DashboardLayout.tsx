import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { AIInsightsPanel } from '@/components/mission-control/AIInsightsPanel';
import { MissionBottomDock } from '@/components/mission-control/MissionBottomDock';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

export function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex h-dvh overflow-hidden bg-space-void">
      <AmbientBackground />
      <Sidebar />

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          !isMobile && 'ml-(--spacing-rail)',
        )}
      >
        <Topbar />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main className="relative min-w-0 flex-1 overflow-y-auto">
            <div className="relative z-10 flex min-h-full flex-col px-6 py-8 lg:px-10 lg:py-10 xl:px-14">
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
