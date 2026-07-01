import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, SectionHeading } from '@/components/motion';
import { LayerCompareSlider } from '@/features/analysis/components/LayerCompareSlider';
import { SyntheticLayerView } from '@/features/analysis/components/SyntheticLayerView';
import { ANALYSIS_LAYERS } from '@/features/analysis/constants';
import type { AnalysisLayerId } from '@/features/analysis/types';
import { ROUTES } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const LAYER_SEQUENCE: { id: AnalysisLayerId; label: string }[] = [
  { id: 'original', label: 'Original SAR' },
  { id: 'enhanced', label: 'Enhanced' },
  { id: 'segmentation', label: 'Segmentation' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'landing', label: 'Landing Zones' },
];

export function AIDetectionShowcaseSection() {
  const [activeLayer, setActiveLayer] = useState<AnalysisLayerId>('enhanced');
  const [compareMode, setCompareMode] = useState(false);

  const activeIndex = LAYER_SEQUENCE.findIndex((l) => l.id === activeLayer);
  const prevLayer = LAYER_SEQUENCE[Math.max(0, activeIndex - 1)];

  return (
    <LandingSectionShell id="detection" className="px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="03 — AI Detection"
          title="SAR Intelligence"
          subtitle="Interactive comparison across the full detection pipeline."
        />

        <FadeIn className="mt-16 flex flex-wrap items-center gap-6" delay={0.05}>
          {LAYER_SEQUENCE.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={cn(
                'relative pb-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-500',
                activeLayer === layer.id
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {layer.label}
              {activeLayer === layer.id && (
                <motion.span
                  layoutId="detection-tab-active"
                  className="absolute inset-x-0 -bottom-px h-px bg-text-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCompareMode((v) => !v)}
            className={cn(
              'pb-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-500',
              compareMode ? 'text-mission' : 'text-text-muted hover:text-text-secondary',
            )}
          >
            Compare
          </button>
        </FadeIn>

        <FadeIn className="mt-10" delay={0.1}>
          <div className="overflow-hidden border border-border-subtle">
            <AnimatePresence mode="wait">
              {compareMode ? (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE_PREMIUM }}
                >
                  <LayerCompareSlider
                    beforeLayer={prevLayer.id}
                    afterLayer={activeLayer}
                    beforeLabel={prevLayer.label}
                    afterLabel={LAYER_SEQUENCE[activeIndex].label}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeLayer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE_PREMIUM }}
                  className="relative aspect-[16/10] overflow-hidden"
                >
                  <SyntheticLayerView layer={activeLayer} />
                  <div className="pointer-events-none absolute bottom-6 left-6">
                    <p className="text-label">Active Layer</p>
                    <p className="mt-1 font-display text-lg font-medium text-text-primary">
                      {LAYER_SEQUENCE[activeIndex].label}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        <FadeIn className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5" delay={0.15}>
          {ANALYSIS_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={cn(
                'w-full overflow-hidden text-left transition-opacity duration-500',
                activeLayer === layer.id ? 'opacity-100' : 'opacity-40 hover:opacity-70',
              )}
            >
              <div className="aspect-square border border-border-subtle">
                <SyntheticLayerView layer={layer.id} />
              </div>
              <div className="pt-3">
                <p className="text-label">{layer.shortLabel}</p>
                <p className="mt-1 text-sm text-text-primary">
                  {layer.metricValue}{layer.metricUnit}
                </p>
              </div>
            </button>
          ))}
        </FadeIn>

        <FadeIn className="mt-16 flex justify-start" delay={0.2}>
          <Link to={ROUTES.aiAnalysis}>
            <Button size="lg">
              Open Analysis Workspace
            </Button>
          </Link>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
