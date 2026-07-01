import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
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

        <div className="mt-20">
          <AnimatedText
            text="Permanently Shadowed Regions at the lunar south pole preserve water ice deposited over billions of years. Chandrayaan-2's DFSAR instrument penetrates the regolith to detect these deposits — but raw SAR data requires AI-driven enhancement before mission planners can act."
            className="max-w-2xl text-[clamp(1.0625rem,2vw,1.25rem)] leading-[1.7] font-light text-text-secondary"
          />
        </div>

        {/* Editorial layout: alternating items with thin dividers instead of glass cards */}
        <div className="mt-28">
          {PROBLEM_ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className={cn(
                'grid gap-4 py-10 md:grid-cols-[200px_1fr] md:gap-12',
                i > 0 && 'border-t border-border-subtle',
              )}>
                <h3 className="font-display text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold tracking-[-0.03em] text-text-primary">
                  {item.title}
                </h3>
                <p className="max-w-lg text-base leading-relaxed font-light text-text-secondary">
                  {item.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Timeline — bare structured data with thin rules, no glass wrapper */}
        <FadeIn className="mt-32" delay={0.15}>
          <h3 className="mb-12 font-display text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">
            Mission Timeline
          </h3>
          <div>
            {TIMELINE_PHASES.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_PREMIUM }}
                className={cn(
                  'grid grid-cols-[auto_1fr] gap-8 py-8 md:grid-cols-[120px_1fr_2fr] md:gap-12 md:py-10',
                  i > 0 && 'border-t border-border-subtle',
                )}
              >
                <span className="font-mono text-xs text-mission">{phase.timestamp}</span>
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

        {/* Statistics — horizontal strip with large numbers and thin vertical dividers */}
        <FadeIn className="mt-32" delay={0.2}>
          <div className="flex flex-wrap gap-y-8 bg-space-panel/40 px-8 py-10">
            {MISSION_STATISTICS.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8, ease: EASE_PREMIUM }}
                className={cn(
                  'min-w-[140px] flex-1 px-6 py-4',
                  i > 0 && 'border-l border-border-subtle',
                )}
              >
                <p className="text-stat-massive text-[clamp(2.5rem,6vw,3.5rem)] text-text-primary">
                  <AnimatedCounter value={stat.value} decimals={stat.value % 1 ? 1 : 0} />
                  <span className="ml-1 text-lg text-text-muted">{stat.unit}</span>
                </p>
                <p className="text-label mt-3">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
