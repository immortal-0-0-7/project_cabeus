import { useEffect, useRef, useState } from 'react';
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
  const mainRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const onScroll = () => setScrolled(main.scrollTop > 8);
    onScroll();
    main.addEventListener('scroll', onScroll, { passive: true });
    return () => main.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="dashboard-ui relative flex h-dvh overflow-hidden bg-space-void">
      <AmbientBackground />
      <Sidebar />

      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col',
          !isMobile && 'ml-(--spacing-sidebar)',
        )}
      >
        <Topbar scrolled={scrolled} />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <main ref={mainRef} className="relative min-w-0 flex-1 overflow-y-auto">
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
