import { motion } from 'framer-motion';
import { EASE_PREMIUM } from '@/utils/motion';

interface ScrollIndicatorProps {
  onClick?: () => void;
}

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-4 text-text-muted transition-colors duration-500 hover:text-text-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1, ease: EASE_PREMIUM }}
      aria-label="Scroll to mission overview"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      <motion.span
        className="block h-8 w-px bg-text-muted"
        animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top' }}
      />
    </motion.button>
  );
}
