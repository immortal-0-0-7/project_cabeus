import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { AI_INSIGHTS } from '@/data/missionData';
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';
import { fadeIn, staggerContainer } from '@/utils/motion';

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
      <div className="px-6 py-8">
        <h2 className="font-display text-lg font-medium tracking-tight text-text-primary">
          AI Insights
        </h2>
        <p className="text-label mt-2">Neural inference</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <ul className="divide-y divide-border-subtle">
          {AI_INSIGHTS.map((insight) => {
            const expanded = expandedId === insight.id;

            return (
              <li key={insight.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : insight.id)}
                  className="w-full py-5 text-left transition-opacity duration-500 hover:opacity-80"
                >
                  <div className="flex items-start justify-between gap-3 px-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-label">{insight.category}</p>
                      <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
                        {insight.title}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: expanded ? 90 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-1 shrink-0 text-text-muted"
                    >
                      <ChevronRight className="size-4" strokeWidth={1.25} />
                    </motion.span>
                  </div>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 px-2 text-sm leading-relaxed font-light text-text-secondary">
                          {insight.body}
                        </p>
                        <div className="mt-4 flex items-center gap-4 px-2">
                          <div className="h-px flex-1 bg-border-subtle">
                            <motion.div
                              className="h-full bg-mission"
                              initial={{ width: 0 }}
                              animate={{ width: `${insight.confidence}%` }}
                              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <span className="font-mono text-xs text-text-secondary">
                            <AnimatedCounter value={insight.confidence} decimals={1} suffix="%" />
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </li>
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
            'fixed bottom-[calc(var(--spacing-bottom-dock-mobile)+1.5rem)] right-6 z-40',
            'px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-text-secondary uppercase',
            'transition-colors duration-500 hover:text-text-primary',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Insights · {AI_INSIGHTS.length}
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-space-void/90 backdrop-blur-md"
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
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute right-4 top-4 z-10">
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
      className="hidden w-(--spacing-insights-panel) shrink-0 border-l border-border-subtle xl:flex xl:flex-col"
    >
      {panelContent}
    </motion.aside>
  );
}
