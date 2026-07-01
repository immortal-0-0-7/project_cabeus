import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_PREMIUM } from '@/utils/motion';

const BOOT_SEQUENCE = [
  'Initializing mission control…',
  'Loading SAR telemetry…',
  'Calibrating penetration model…',
  'Systems nominal.',
] as const;

export function LandingLoader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, BOOT_SEQUENCE.length - 1));
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1.8, 100));
    }, 50);

    const done = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-space-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: EASE_PREMIUM }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_PREMIUM }}
            className="font-display text-3xl font-bold tracking-[-0.04em] uppercase md:text-4xl"
          >
            Cabeus
          </motion.h2>

          <motion.p
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-label mt-12"
          >
            {BOOT_SEQUENCE[step]}
          </motion.p>

          <div className="mt-16 h-px w-48 overflow-hidden bg-border-subtle">
            <motion.div
              className="h-full bg-gradient-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
