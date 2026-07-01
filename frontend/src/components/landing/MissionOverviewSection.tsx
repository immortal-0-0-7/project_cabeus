import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { AnimatedText, FadeIn, SectionHeading, TiltCard } from '@/components/motion';
import { MISSION_STATISTICS, TIMELINE_PHASES } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const PROBLEM_ITEMS = [
  {
    title: 'Lunar Water Ice',
    body: 'Water ice at the lunar poles is the most valuable in-situ resource — propellant, life support, and radiation shielding for sustained exploration.',
  },
  {
    title: 'Chandrayaan-2 SAR',
    body: 'The Dual-Frequency Synthetic Aperture Radar penetrates regolith up to several metres, revealing subsurface ice signatures invisible to optical sensors.',
  },
  {
    title: 'Shadowed Regions',
    body: 'Permanently Shadowed Regions near the south pole trap volatiles for billions of years — but remain unmapped at mission-ready resolution.',
  },
  {
    title: 'Mission Risk',
    body: 'Landing without ice intelligence wastes payload mass and mission duration. Precision targeting converts exploration into operational capability.',
  },
] as const;

export function MissionOverviewSection() {
  return (
    <LandingSectionShell
      id="overview"
      className="px-8 py-32 md:px-12 md:py-48 lg:px-16"
    >
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="01 — Mission Briefing"
          title="Why Lunar Ice Matters"
          subtitle="From Chandrayaan-2 SAR swaths to landing-ready intelligence."
        />

        <div className="landing-divider-glow mx-auto mt-12 w-48" />

        <div className="mt-20">
          <AnimatedText
            text="Permanently Shadowed Regions at the lunar south pole preserve water ice deposited over billions of years. Chandrayaan-2's DFSAR instrument penetrates the regolith to detect these deposits — but raw SAR data requires AI-driven enhancement before mission planners can act."
            className="mx-auto max-w-2xl text-center text-[clamp(1.0625rem,2vw,1.25rem)] leading-[1.7] font-light text-text-secondary"
          />
        </div>

        <div className="mt-28 grid gap-6 md:grid-cols-2">
          {PROBLEM_ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <TiltCard className="group h-full">
                <div className="landing-glass landing-glass-hover h-full rounded-xl p-8 md:p-10">
                  <h3 className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tracking-[-0.03em] text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed font-light text-text-secondary">
                    {item.body}
                  </p>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-32" delay={0.15}>
          <p className="text-label mb-16 text-center">Mission Timeline</p>
          <div className="landing-glass rounded-xl px-6 py-2 md:px-8">
            {TIMELINE_PHASES.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_PREMIUM }}
                className="grid grid-cols-[auto_1fr] gap-8 border-t border-border-subtle py-8 first:border-t-0 md:grid-cols-[120px_1fr_2fr] md:gap-12 md:py-10"
              >
                <span className="font-mono text-xs text-ice-bright">{phase.timestamp}</span>
                <h4
                  className={cn(
                    'font-display text-lg font-medium tracking-tight',
                    phase.status === 'active' ? 'text-mission' : 'text-text-primary',
                  )}
                >
                  {phase.label}
                </h4>
                <p className="text-sm leading-relaxed font-light text-text-muted md:col-start-2 md:col-span-2 md:row-start-2 md:text-base">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mt-32" delay={0.2}>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {MISSION_STATISTICS.map((stat, i) => (
              <TiltCard key={stat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: EASE_PREMIUM }}
                  className="landing-glass landing-glass-hover rounded-xl p-8 text-center lg:text-left"
                >
                  <p className="text-stat-massive text-[clamp(2.5rem,6vw,4rem)] text-text-primary">
                    <AnimatedCounter value={stat.value} decimals={stat.value % 1 ? 1 : 0} />
                    <span className="text-xl text-text-muted">{stat.unit}</span>
                  </p>
                  <p className="text-label mt-4">{stat.label}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
