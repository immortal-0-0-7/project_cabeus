import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ScrollIndicator } from '@/components/motion';
import { ROUTES } from '@/routes/paths';
import { EASE_PREMIUM, fadeUp, staggerContainer } from '@/utils/motion';
import { useRef } from 'react';

const TELEMETRY = [
  { label: 'Orbital Pass', value: 'C2-SAR-2024-1847' },
  { label: 'Acquisition', value: '2024-09-14 T06:41Z' },
  { label: 'Coord', value: '89.54°S  32.67°E' },
  { label: 'Frequency', value: '1.25 GHz L-Band' },
] as const;

export function HeroOverlay() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const panelY = useTransform(scrollYProgress, [0, 0.8], [0, 60]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="pointer-events-none relative flex min-h-dvh flex-col"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-space-void/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-space-void/90 to-transparent" />

      <div className="flex flex-1 flex-col justify-center px-6 pb-8 pt-28 md:px-10 md:pb-12 md:pt-32 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="mx-auto w-full max-w-6xl"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase">
              Chandrayaan-2 SAR Platform
            </span>
            <motion.span
              className="h-px bg-white/8"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE_PREMIUM }}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display max-w-4xl text-[clamp(2.75rem,8vw,6rem)] leading-[0.88] font-bold tracking-[-0.05em] text-text-primary"
          >
            Map the Moon.
            <br />
            <span className="text-gradient-accent">Find the ice.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-lg text-[clamp(1rem,2vw,1.25rem)] leading-relaxed tracking-[-0.01em] text-text-secondary"
          >
            AI-powered lunar resource intelligence for Chandrayaan-2 SAR data — from raw
            synthetic aperture radar to landing site decisions.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="pointer-events-auto mt-12 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link to={ROUTES.dashboard} className="inline-flex">
              <Button size="lg">
                Launch Mission
              </Button>
            </Link>
            <Link to={ROUTES.sarAnalysis} className="inline-flex">
              <Button
                variant="outline"
                size="lg"
              >
                Explore Dataset
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE_PREMIUM }}
        style={{ y: panelY, opacity: panelOpacity }}
        className="pointer-events-auto px-6 pb-8 md:px-10 md:pb-10 lg:px-16"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-text-muted uppercase">
                DFSAR Level-2A Calibrated
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Processing pipeline ready · Inference online
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4">
            {TELEMETRY.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.08, ease: EASE_PREMIUM }}
              >
                <p className="font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 font-mono text-sm tracking-wide text-text-primary">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator onClick={scrollToOverview} />
      </div>
    </section>
  );
}
