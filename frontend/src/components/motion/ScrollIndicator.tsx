import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EASE_PREMIUM } from '@/utils/motion';

interface ScrollIndicatorProps {
  onClick?: () => void;
}

export function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-3 text-text-muted transition-colors duration-500 hover:text-text-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 1, ease: EASE_PREMIUM }}
      aria-label="Scroll to mission overview"
    >
      <motion.div
        animate={{ y: [0, 4, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="size-5" strokeWidth={1.25} />
      </motion.div>
    </motion.button>
  );
}
