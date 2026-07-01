import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { AnimatedText, FadeIn, SectionHeading } from '@/components/motion';
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
    <section id="overview" className="relative px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="01 — Mission Briefing"
          title="Why Lunar Ice Matters"
          subtitle="From Chandrayaan-2 SAR swaths to landing-ready intelligence."
        />

        <div className="mt-20">
          <AnimatedText
            text="Permanently Shadowed Regions at the lunar south pole preserve water ice deposited over billions of years. Chandrayaan-2's DFSAR instrument penetrates the regolith to detect these deposits — but raw SAR data requires AI-driven enhancement before mission planners can act."
            className="mx-auto max-w-2xl text-center text-[clamp(1.0625rem,2vw,1.25rem)] leading-[1.7] font-light text-text-secondary"
          />
        </div>

        <div className="mt-28 space-y-0">
          {PROBLEM_ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="border-t border-border-subtle py-12 md:py-16">
                <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed font-light text-text-secondary md:text-lg">
                    {item.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-32" delay={0.15}>
          <p className="text-label mb-16 text-center">Mission Timeline</p>
          <div className="space-y-0">
            {TIMELINE_PHASES.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_PREMIUM }}
                className="grid grid-cols-[auto_1fr] gap-8 border-t border-border-subtle py-8 md:grid-cols-[120px_1fr_2fr] md:gap-12 md:py-10"
              >
                <span className="font-mono text-xs text-text-muted">{phase.timestamp}</span>
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
          <div className="grid grid-cols-2 gap-12 border-t border-border-subtle pt-16 lg:grid-cols-4">
            {MISSION_STATISTICS.map((stat) => (
              <div key={stat.id} className="text-center lg:text-left">
                <p className="text-stat-massive text-[clamp(2.5rem,6vw,4rem)] text-text-primary">
                  <AnimatedCounter value={stat.value} decimals={stat.value % 1 ? 1 : 0} />
                  <span className="text-xl text-text-muted">{stat.unit}</span>
                </p>
                <p className="text-label mt-4">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
