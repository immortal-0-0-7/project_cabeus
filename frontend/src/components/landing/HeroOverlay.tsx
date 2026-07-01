import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { ArrowRight, BookOpen, Database, Rocket } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { GlassPanel } from '@/components/common/GlassPanel';
import { ROUTES } from '@/routes/paths';
import { EASE_PREMIUM, fadeUp, staggerContainer } from '@/utils/motion';
import { useEffect } from 'react';

const TELEMETRY = [
  { label: 'ORBIT', value: 'L2 STABLE' },
  { label: 'SAR BAND', value: 'L & S' },
  { label: 'RESOLUTION', value: '5M/PIX' },
  { label: 'STATUS', value: 'NOMINAL' },
] as const;

export function HeroOverlay() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const gradientX = useMotionTemplate`${pointerX}%`;
  const gradientY = useMotionTemplate`${pointerY}%`;
  const spotlightBackground = useMotionTemplate`radial-gradient(900px circle at ${gradientX} ${gradientY}, rgb(103 216 255 / 0.02), transparent 42%), radial-gradient(700px circle at 80% 20%, rgb(110 93 255 / 0.015), transparent 50%)`;

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 100);
      pointerY.set((event.clientY / window.innerHeight) * 100);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [pointerX, pointerY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{ background: spotlightBackground }}
      />

      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-space-void/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-space-void/90 to-transparent" />

      <header className="pointer-events-auto flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="flex items-center gap-3"
        >
          <div className="relative flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="absolute inset-0 rounded-lg bg-linear-to-br from-ice/20 to-mission/10" />
            <Rocket className="relative size-4 text-ice" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-display text-sm font-semibold tracking-[0.22em] text-text-primary">
              CABEUS
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] text-text-muted uppercase">
              Lunar Intelligence
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_PREMIUM }}
          className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 backdrop-blur-xl md:flex"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-text-secondary uppercase">
            Mission systems online
          </span>
        </motion.div>
      </header>

      <div className="flex flex-1 flex-col justify-center px-6 pb-8 md:px-10 md:pb-12 lg:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full max-w-6xl"
        >
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.24em] text-ice/90 uppercase">
              Chandrayaan-2 SAR Platform
            </span>
            <span className="h-px w-12 bg-linear-to-r from-ice/50 to-transparent" />
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
            <Link to={ROUTES.dashboard} className="inline-flex">
              <Button
                size="lg"
                leftIcon={<Rocket className="size-4" strokeWidth={1.75} />}
                rightIcon={<ArrowRight className="size-4 opacity-70" strokeWidth={1.75} />}
                className="min-w-[200px] justify-center"
              >
                Launch Mission
              </Button>
            </Link>
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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="ghost"
                size="lg"
                leftIcon={<BookOpen className="size-4" strokeWidth={1.75} />}
                className="min-w-[200px] justify-center text-text-secondary hover:text-text-primary"
              >
                Documentation
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE_PREMIUM }}
        className="pointer-events-auto px-6 pb-8 md:px-10 md:pb-10 lg:px-16"
      >
        <GlassPanel
          animate={false}
          className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-white/10 bg-white/3 px-5 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="hidden size-10 items-center justify-center rounded-lg border border-ice/20 bg-ice/8 md:flex">
              <span className="font-mono text-xs text-ice">AI</span>
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
    </div>
  );
}
