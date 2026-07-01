import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrainCircuit, Layers3, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { DisplayHeading } from '@/components/common/DisplayHeading';
import { GlassPanel } from '@/components/common/GlassPanel';
import {
  ANALYSIS_LAYERS,
  AnalysisStageCard,
  AnalysisStatistics,
  ConfidenceDistributionChart,
  LayerCompareSlider,
  PipelineConnector,
  ProcessingMetrics,
  SpectralChart,
  SyntheticLayerView,
  type AnalysisLayerId,
} from '@/features/analysis';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { fadeUp, staggerContainer, EASE_PREMIUM } from '@/utils/motion';
import { cn } from '@/utils/cn';

function getPreviousLayer(id: AnalysisLayerId): AnalysisLayerId {
  const index = ANALYSIS_LAYERS.findIndex((l) => l.id === id);
  return index > 0 ? ANALYSIS_LAYERS[index - 1].id : id;
}

export function AIAnalysisWorkspace() {
  const [activeLayer, setActiveLayer] = useState<AnalysisLayerId>('heatmap');
  const [compareMode, setCompareMode] = useState(true);

  const activeIndex = ANALYSIS_LAYERS.findIndex((l) => l.id === activeLayer);
  const activeMeta = ANALYSIS_LAYERS[activeIndex];
  const previousLayer = getPreviousLayer(activeLayer);
  const previousMeta = ANALYSIS_LAYERS[Math.max(0, activeIndex - 1)];

  const headerStats = useMemo(
    () => [
      { icon: BrainCircuit, label: 'Model Confidence', value: 94.2, suffix: '%' },
      { icon: Layers3, label: 'Pipeline Stages', value: 5, suffix: '' },
      { icon: Sparkles, label: 'Ice Detection', value: 87.4, suffix: '%' },
    ],
    [],
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge color="mission">Neural Pipeline</Badge>
          <DisplayHeading
            as="h2"
            className="mt-2 font-display text-2xl font-bold text-text-primary"
          >
            SAR Analysis
          </DisplayHeading>
          <p className="text-base text-text-secondary">
            PyTorch ice detection v2.4 · DFSAR L-band · Shackleton region
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {headerStats.map(({ icon: Icon, label, value, suffix }) => (
            <GlassPanel key={label} animate={false} className="px-3 py-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-mission/10">
                  <Icon className="size-4 text-mission" />
                </div>
                <div>
                  <p className="text-[11px] text-text-muted">{label}</p>
                  <p className="font-mono text-sm font-semibold text-mission">
                    <AnimatedCounter value={value} decimals={value % 1 ? 1 : 0} />
                    {suffix}
                  </p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={fadeUp}>
        <AnalysisStatistics />
      </motion.div>

      {/* Main content */}
      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(260px,300px)_1fr_minmax(280px,320px)]">
        {/* Vertical pipeline */}
        <motion.div variants={fadeUp} className="flex min-h-0 flex-col">
          <GlassPanel animate={false} className="flex flex-1 flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-text-primary">Processing Pipeline</h3>
              <span className="font-mono text-[11px] text-text-muted">
                {activeIndex + 1}/{ANALYSIS_LAYERS.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto pr-1">
              {ANALYSIS_LAYERS.map((layer, index) => (
                <div key={layer.id}>
                  <AnalysisStageCard
                    layer={layer}
                    index={index}
                    isActive={activeLayer === layer.id}
                    isComplete={index <= activeIndex}
                    onSelect={() => setActiveLayer(layer.id)}
                    compact
                  />
                  {index < ANALYSIS_LAYERS.length - 1 && (
                    <PipelineConnector
                      delay={index * 0.05}
                      active={activeLayer === layer.id || activeLayer === ANALYSIS_LAYERS[index + 1].id}
                    />
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Comparison viewport */}
        <motion.div variants={fadeUp} className="flex min-h-0 min-w-0 flex-col gap-3">
          <GlassPanel animate={false} className="flex flex-1 flex-col p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-text-primary">Analysis Viewport</h3>
                <p className="text-xs text-text-muted">
                  {activeMeta.label} — {activeMeta.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompareMode(false)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                    !compareMode
                      ? 'border-mission/30 bg-mission/10 text-mission'
                      : 'border-border-subtle text-text-muted hover:border-border-default',
                  )}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode(true)}
                  className={cn(
                    'flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                    compareMode
                      ? 'border-mission/30 bg-mission/10 text-mission'
                      : 'border-border-subtle text-text-muted hover:border-border-default',
                  )}
                >
                  <SlidersHorizontal className="size-3" />
                  Compare
                </button>
                <Badge color="mission">{activeMeta.shortLabel}</Badge>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <AnimatePresence mode="wait">
                {compareMode && activeIndex > 0 ? (
                  <motion.div
                    key={`compare-${activeLayer}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                    className="h-full min-h-[220px]"
                  >
                    <LayerCompareSlider
                      beforeLayer={previousLayer}
                      afterLayer={activeLayer}
                      beforeLabel={previousMeta.label}
                      afterLabel={activeMeta.label}
                      className="h-full"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`single-${activeLayer}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                    className="h-full min-h-[220px] overflow-hidden rounded-xl border border-border-subtle"
                  >
                    <SyntheticLayerView layer={activeLayer} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Layer metric strip */}
            <motion.div
              className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-border-subtle bg-space-panel p-2"
              key={activeLayer}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[
                { label: activeMeta.metric, value: activeMeta.metricValue, unit: activeMeta.metricUnit },
                { label: 'Resolution', value: 12.4, unit: 'm/px' },
                { label: 'Coverage', value: 847, unit: 'km²' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-[11px] text-text-muted">{item.label}</p>
                  <p className="font-mono text-sm font-semibold" style={{ color: activeMeta.accent }}>
                    <AnimatedCounter value={item.value} decimals={item.value % 1 ? 1 : 0} />
                    <span className="text-[11px] font-normal text-text-muted"> {item.unit}</span>
                  </p>
                </div>
              ))}
            </motion.div>
          </GlassPanel>
        </motion.div>

        {/* Charts & metrics sidebar */}
        <motion.div variants={fadeUp} className="flex min-h-0 flex-col gap-3">
          <SpectralChart />
          <ConfidenceDistributionChart />
          <GlassPanel animate={false} className="flex-1 p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Subsurface Metrics</h3>
            <ProcessingMetrics delay={0.2} />
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
