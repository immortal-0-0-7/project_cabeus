import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { AnalysisLayer } from '../types';
import { SyntheticLayerView } from './SyntheticLayerView';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

interface AnalysisStageCardProps {
  layer: AnalysisLayer;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  onSelect: () => void;
  compact?: boolean;
}

export function AnalysisStageCard({
  layer,
  index,
  isActive,
  isComplete,
  onSelect,
  compact = false,
}: AnalysisStageCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border text-left transition-colors duration-300',
        isActive
          ? 'border-mission/30 bg-mission/6 shadow-[0_0_24px_rgb(249_115_22/0.08)]'
          : 'border-border-subtle bg-space-panel hover:border-border-default hover:bg-space-elevated',
        compact ? 'p-3' : 'p-4',
      )}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE_PREMIUM }}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={cn('flex gap-3', compact ? 'flex-row items-center' : 'flex-col sm:flex-row')}>
        <div
          className={cn(
            'relative shrink-0 overflow-hidden rounded-lg border border-border-subtle',
            compact ? 'size-14' : 'h-20 w-full sm:h-24 sm:w-32',
          )}
        >
          <SyntheticLayerView layer={layer.id} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium"
                style={{
                  background: isComplete ? `${layer.accent}22` : 'rgb(255 255 255 / 0.06)',
                  color: isComplete ? layer.accent : '#64748b',
                }}
              >
                {isComplete ? <Check className="size-3" /> : index + 1}
              </span>
              <h4 className="text-base font-semibold text-text-primary">{layer.label}</h4>
            </div>
            <span
              className="shrink-0 font-mono text-xs font-medium"
              style={{ color: layer.accent }}
            >
              <AnimatedCounter value={layer.metricValue} decimals={layer.metricValue % 1 ? 1 : 0} />
              {layer.metricUnit}
            </span>
          </div>

          {!compact && (
            <p className="mt-1 text-xs leading-relaxed text-text-muted">{layer.description}</p>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-text-muted">{layer.metric}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${layer.accent}88, ${layer.accent})` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((layer.metricValue / 100) * 100, 100)}%` }}
                transition={{ duration: 0.7, delay: index * 0.1 + 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <motion.div
          className="absolute left-0 top-0 h-full w-0.5 rounded-full"
          style={{ background: layer.accent }}
          layoutId="stage-indicator"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
