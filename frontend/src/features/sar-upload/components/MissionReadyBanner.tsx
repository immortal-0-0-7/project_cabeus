import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/routes/paths';
import { EASE_PREMIUM } from '@/utils/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MissionReadyBannerProps {
  visible: boolean;
  onReset: () => void;
}

export function MissionReadyBanner({ visible, onReset }: MissionReadyBannerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE_PREMIUM }}
          className="relative overflow-hidden rounded-xl border border-signal/30 bg-signal/6 p-5"
        >
          {!reducedMotion && (
            <>
              <motion.div
                className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-signal/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-signal/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </>
          )}

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex size-12 items-center justify-center rounded-xl border border-signal/40 bg-signal/15"
                initial={reducedMotion ? false : { scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
              >
                <Sparkles className="size-6 text-signal" />
              </motion.div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  Mission Ready
                </p>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Intelligence Package Compiled
                </h3>
                <p className="mt-0.5 text-sm text-text-secondary">
                  4 landing sites ranked · Ice probability maps generated · AI analysis complete
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="size-3.5" />} onClick={onReset}>
                New Upload
              </Button>
              <Link to={ROUTES.landingIntelligence}>
                <Button size="sm" rightIcon={<ArrowRight className="size-3.5" />}>
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
