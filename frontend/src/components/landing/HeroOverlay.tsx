import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Database, Rocket } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { GlassPanel } from '@/components/common/GlassPanel';
import { Magnet, ScrollIndicator } from '@/components/motion';
import { ROUTES } from '@/routes/paths';
import { EASE_PREMIUM, fadeUp, staggerContainer } from '@/utils/motion';
import { useRef } from 'react';

const TELEMETRY = [
  { label: 'ORBIT', value: 'L2 STABLE' },
  { label: 'SAR BAND', value: 'L & S' },
  { label: 'RESOLUTION', value: '5M/PIX' },
  { label: 'STATUS', value: 'NOMINAL' },
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
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.24em] text-ice-bright uppercase">
              Chandrayaan-2 SAR Platform
            </span>
            <motion.span
              className="h-px bg-linear-to-r from-ice/50 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE_PREMIUM }}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-text-primary"
          >
            Map the Moon.
            <br />
            <span className="text-gradient-ice">Find the ice.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-[clamp(1rem,2vw,1.25rem)] leading-relaxed tracking-[-0.01em] text-text-secondary"
          >
            AI-powered lunar resource intelligence for Chandrayaan-2 SAR data — from raw
            synthetic aperture radar to landing site decisions in seconds.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="pointer-events-auto mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Magnet strength={4}>
              <Link to={ROUTES.dashboard} className="inline-flex">
                <Button
                  size="lg"
                  leftIcon={<Rocket className="size-4" strokeWidth={1.75} />}
                  rightIcon={<ArrowRight className="size-4 opacity-70" strokeWidth={1.75} />}
                  className="min-w-[200px] justify-center glow-mission"
                >
                  Launch Mission
                </Button>
              </Link>
            </Magnet>
            <Magnet strength={4}>
              <Link to={ROUTES.sarAnalysis} className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Database className="size-4" strokeWidth={1.75} />}
                  className="min-w-[200px] justify-center border-white/12 bg-white/4 backdrop-blur-xl hover:bg-white/8"
                >
                  Explore Dataset
                </Button>
              </Link>
            </Magnet>
            <Magnet strength={4}>
              <button type="button" onClick={scrollToOverview} className="inline-flex">
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<BookOpen className="size-4" strokeWidth={1.75} />}
                  className="min-w-[200px] justify-center text-text-secondary hover:text-text-primary"
                >
                  Learn More
                </Button>
              </button>
            </Magnet>
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
        <GlassPanel
          animate={false}
          className="landing-glass landing-glass-hover mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="hidden size-10 items-center justify-center rounded-lg border border-ice-glow bg-ice/8 md:flex">
              <span className="font-mono text-xs text-ice-bright">AI</span>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase">
                Live telemetry
              </p>
              <p className="text-sm text-text-secondary">
                Processing pipeline ready · PyTorch inference online
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
            {TELEMETRY.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.08, ease: EASE_PREMIUM }}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-text-muted uppercase">
                  {item.label}
                </p>
                <p className="mt-0.5 font-mono text-sm tracking-wide text-text-primary">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator onClick={scrollToOverview} />
      </div>
    </section>
  );
}
