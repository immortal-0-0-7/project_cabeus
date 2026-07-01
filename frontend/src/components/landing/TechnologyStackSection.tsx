import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { SectionHeading } from '@/components/motion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const PIPELINE_STAGES = [
  {
    id: 'sar',
    label: 'Chandrayaan-2 SAR',
    description: 'Raw DFSAR L-band backscatter swaths from lunar south polar passes',
    metric: 847,
    metricLabel: 'km² coverage',
  },
  {
    id: 'enhance',
    label: 'Image Enhancement',
    description: 'Speckle filtering, radiometric calibration, and noise reduction',
    metric: 18.3,
    metricLabel: 'dB SNR gain',
  },
  {
    id: 'dl',
    label: 'Deep Learning',
    description: 'PyTorch U-Net feature extraction trained on lunar regolith signatures',
    metric: 94.2,
    metricLabel: '% accuracy',
  },
  {
    id: 'segment',
    label: 'Segmentation',
    description: 'Neural boundary detection separating ice-bearing from dry regolith',
    metric: 91.7,
    metricLabel: '% IoU',
  },
  {
    id: 'ice',
    label: 'Ice Probability',
    description: 'Bayesian confidence mapping of subsurface volatile deposits',
    metric: 87.4,
    metricLabel: '% confidence',
  },
  {
    id: 'landing',
    label: 'Landing Recommendation',
    description: 'Multi-criteria site ranking with terrain stability and risk scoring',
    metric: 12,
    metricLabel: 'sites ranked',
  },
  {
    id: 'intel',
    label: 'Mission Intelligence',
    description: 'Integrated mission report with explainable AI and rover simulation',
    metric: 96.8,
    metricLabel: '% sci. value',
  },
] as const;

function PipelineStage({
  stage,
  index,
}: {
  stage: (typeof PIPELINE_STAGES)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.9, ease: EASE_PREMIUM }}
      className={cn(
        'grid gap-4 py-8 md:grid-cols-[3rem_1fr_auto] md:items-baseline md:gap-10 md:py-10',
        index > 0 && 'border-t border-border-subtle',
      )}
    >
      <span className="font-mono text-sm text-text-muted">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div>
        <h3 className="font-display text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold tracking-[-0.02em] text-text-primary">
          {stage.label}
        </h3>
        <p className="mt-2 max-w-lg text-sm font-light leading-relaxed text-text-secondary">
          {stage.description}
        </p>
      </div>

      <div className="text-left md:text-right">
        <p className="text-stat-massive text-[clamp(1.75rem,4vw,2.5rem)] text-text-primary">
          <AnimatedCounter value={stage.metric} decimals={stage.metric % 1 ? 1 : 0} />
        </p>
        <p className="text-label mt-1">{stage.metricLabel}</p>
      </div>
    </motion.div>
  );
}

export function TechnologyStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0.15, 0.85], ['0%', '100%']);

  return (
    <LandingSectionShell id="technology" className="border-t border-border-subtle">
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-space-panel/50 py-32 md:py-48">
        <div className="px-8 md:px-12 lg:px-16">
          <div ref={containerRef} className="relative mx-auto max-w-4xl">
            <SectionHeading
              label="02 — Processing Pipeline"
              title="Technology Stack"
              subtitle="Seven-stage intelligence pipeline from raw SAR to mission-ready landing recommendations."
            />

            <div className="relative mt-20">
              <div
                aria-hidden
                className="absolute top-0 bottom-0 -left-12 hidden w-px bg-space-elevated md:block"
              >
                <motion.div
                  className="w-full bg-linear-to-b from-warning via-mission to-danger"
                  style={{ height: lineHeight }}
                />
              </div>

              <div>
                {PIPELINE_STAGES.map((stage, i) => (
                  <PipelineStage key={stage.id} stage={stage} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingSectionShell>
  );
}
