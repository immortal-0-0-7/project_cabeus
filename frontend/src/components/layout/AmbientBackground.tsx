import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AmbientBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-space-void" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 0%, rgb(249 115 22 / 0.04), transparent 60%)',
        }}
      />

      <motion.div
        className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 blur-[120px]"
        style={{ background: 'rgb(249 115 22 / 0.03)' }}
        animate={reducedMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="noise-overlay absolute inset-0 opacity-30" />
    </div>
  );
}
