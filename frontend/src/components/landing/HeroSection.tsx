import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { ScrollIndicator } from '@/components/motion';
import { ROUTES } from '@/routes/paths';
import { fadeUp, staggerContainer } from '@/utils/motion';

const HERO_STATS = [
  { label: 'PSR Regions', value: 847 },
  { label: 'Ice Confidence', value: 87.4, suffix: '%' },
  { label: 'Sites Ranked', value: 12 },
] as const;

export function HeroSection() {
  const scrollToOverview = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pointer-events-none relative flex min-h-dvh flex-col items-center justify-center px-8 text-center md:px-12">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-space-void to-transparent" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex max-w-5xl flex-col items-center"
      >
        <motion.p variants={fadeUp} className="text-label mb-10">
          ISRO · Lunar Resource Intelligence
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="hero-heading font-display text-[clamp(4rem,14vw,10rem)] font-semibold uppercase"
        >
          Project
          <br />
          Cabeus
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-10 max-w-lg text-[clamp(1.125rem,2.5vw,1.5rem)] leading-relaxed font-light text-text-secondary"
        >
          Mapping hidden lunar ice.
          <br />
          Powering tomorrow&apos;s missions.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="pointer-events-auto mt-16 flex flex-col items-center gap-6 sm:flex-row"
        >
          <Link to={ROUTES.dashboard}>
            <Button
              size="lg"
              rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}
            >
              Launch Mission
            </Button>
          </Link>
          <button type="button" onClick={scrollToOverview} className="pointer-events-auto">
            <Button variant="ghost" size="lg">
              Learn more
            </Button>
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-24 flex w-full max-w-2xl justify-between gap-8 border-t border-border-subtle pt-12"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="flex-1 text-center">
              <p className="text-stat-massive text-[clamp(2rem,5vw,3.5rem)] text-text-primary">
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.value % 1 ? 1 : 0}
                  suffix={'suffix' in stat ? stat.suffix : ''}
                />
              </p>
              <p className="text-label mt-3">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="pointer-events-auto absolute bottom-12">
        <ScrollIndicator onClick={scrollToOverview} />
      </div>
    </section>
  );
}
