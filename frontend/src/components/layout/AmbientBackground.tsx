import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AmbientBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-space-void" />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgb(77 140 255 / 0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 50%, rgb(110 93 255 / 0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 0% 80%, rgb(103 216 255 / 0.08), transparent 45%)',
        }}
      />

      <motion.div
        className="absolute -left-1/4 top-1/4 size-[600px] rounded-full blur-[120px]"
        style={{ background: 'rgb(77 140 255 / 0.08)' }}
        animate={reducedMotion ? undefined : { x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -right-1/4 bottom-1/4 size-[500px] rounded-full blur-[100px]"
        style={{ background: 'rgb(110 93 255 / 0.06)' }}
        animate={reducedMotion ? undefined : { x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="noise-overlay absolute inset-0 opacity-40" />
      <div className="grid-mission absolute inset-0 opacity-30" />
    </div>
  );
}
