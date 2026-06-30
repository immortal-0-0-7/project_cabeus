import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { AI_INSIGHTS } from '@/data/missionData';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';
import { fadeIn, staggerContainer, slideFromLeft } from '@/utils/motion';

const categoryColors = {
  terrain: 'ice',
  ice: 'mission',
  navigation: 'cinematic',
  risk: 'warning',
  resource: 'signal',
} as const;

export function AIInsightsPanel() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(AI_INSIGHTS[0].id);

  const hidden = isMobile || isTablet;

  const panelContent = (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-cinematic/30 bg-cinematic/10">
            <Brain className="size-3.5 text-cinematic" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">AI Insights</h2>
            <p className="font-mono text-[10px] text-text-muted">Neural inference engine</p>
          </div>
        </div>
        <Badge color="cinematic" pulse>
          Live
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {AI_INSIGHTS.map((insight) => {
            const expanded = expandedId === insight.id;
            const color = categoryColors[insight.category];

            return (
              <motion.li key={insight.id} variants={slideFromLeft}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : insight.id)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-all duration-200',
                    expanded
                      ? 'border-cinematic/30 bg-cinematic/8 shadow-[inset_0_0_24px_rgb(110_93_255/0.06)]'
                      : 'border-border-subtle bg-white/2 hover:border-border-default hover:bg-white/4',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge color={color}>{insight.category}</Badge>
                        {insight.priority === 'high' && (
                          <Badge color="danger">Priority</Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium leading-snug text-text-primary">
                        {insight.title}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: expanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-0.5 shrink-0 text-text-muted"
                    >
                      <ChevronRight className="size-3.5" />
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
                          {insight.body}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/6">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-cinematic to-ice"
                              initial={{ width: 0 }}
                              animate={{ width: `${insight.confidence}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-ice">
                            <AnimatedCounter value={insight.confidence} decimals={1} suffix="%" />
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );

  if (hidden) {
    return (
      <>
        <motion.button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={cn(
            'fixed bottom-[calc(var(--spacing-bottom-dock-mobile)+1rem)] right-4 z-40',
            'flex items-center gap-2 rounded-full border border-cinematic/30 bg-cinematic/15',
            'px-4 py-2.5 shadow-panel backdrop-blur-xl',
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="size-4 text-cinematic" />
          <span className="text-xs font-medium text-text-primary">AI Insights</span>
          <Badge color="cinematic">{AI_INSIGHTS.length}</Badge>
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-space-void/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm border-l border-border-subtle glass-strong"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <div className="absolute right-3 top-3 z-10">
                  <IconButton label="Close AI insights" onClick={() => setMobileOpen(false)}>
                    <X className="size-4" />
                  </IconButton>
                </div>
                {panelContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.aside
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="hidden w-(--spacing-insights-panel) shrink-0 border-l border-border-subtle glass xl:flex xl:flex-col"
    >
      {panelContent}
    </motion.aside>
  );
}
