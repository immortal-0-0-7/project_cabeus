import { useCallback, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LandingScene } from '@/components/3d/LandingScene';
import { AIDetectionShowcaseSection } from '@/components/landing/AIDetectionShowcaseSection';
import { ExplainableAISection } from '@/components/landing/ExplainableAISection';
import { HeroOverlay } from '@/components/landing/HeroOverlay';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingIntelligenceSection } from '@/components/landing/LandingIntelligenceSection';
import { LandingLoader } from '@/components/landing/LandingLoader';
import { LandingNav } from '@/components/landing/LandingNav';
import { MissionOverviewSection } from '@/components/landing/MissionOverviewSection';
import { MissionReportSection } from '@/components/landing/MissionReportSection';
import { MissionSimulationSection } from '@/components/landing/MissionSimulationSection';
import { TelemetryMarquee } from '@/components/landing/TelemetryMarquee';
import { TechnologyStackSection } from '@/components/landing/TechnologyStackSection';
import { CursorSpotlight, ScrollProgress } from '@/components/motion';
import { useMouseRef } from '@/hooks/useMouseRef';
import { EASE_PREMIUM } from '@/utils/motion';

export function LandingPage() {
  const mouse = useMouseRef();
  const mainRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end start'],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.35, 0.6], [1, 0.55, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.08]);
  const sceneBlur = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(6px)']);

  return (
    <>
      {!loaderDone && <LandingLoader onComplete={handleLoaderComplete} />}

      <motion.main
        ref={mainRef}
        className="landing-page relative bg-space-void"
        style={{ overflowX: 'clip' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaderDone ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE_PREMIUM }}
        onAnimationComplete={() => setLoaded(true)}
      >
        <ScrollProgress />

        <motion.div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ opacity: sceneOpacity, scale: sceneScale, filter: sceneBlur }}
        >
          {loaded && <LandingScene mouse={mouse} />}
        </motion.div>

        <CursorSpotlight className="pointer-events-none fixed inset-0 z-1 opacity-25 mix-blend-screen" />
        <div className="noise-overlay pointer-events-none fixed inset-0 z-1 opacity-30 mix-blend-overlay" />
        <div className="vignette pointer-events-none fixed inset-0 z-2" />

        <div className="relative z-10">
          <LandingNav />
          <HeroOverlay />
          <TelemetryMarquee />
          <MissionOverviewSection />
          <TechnologyStackSection />
          <AIDetectionShowcaseSection />
          <LandingIntelligenceSection />
          <ExplainableAISection />
          <MissionSimulationSection />
          <MissionReportSection />
          <LandingFooter />
        </div>
      </motion.main>
    </>
  );
}
