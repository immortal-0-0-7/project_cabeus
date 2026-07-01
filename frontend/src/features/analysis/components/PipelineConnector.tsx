import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ANALYSIS_PALETTE } from '../constants';
import { EASE_PREMIUM } from '@/utils/motion';

interface PipelineConnectorProps {
  delay?: number;
  active?: boolean;
}

export function PipelineConnector({ delay = 0, active = false }: PipelineConnectorProps) {
  return (
    <div className="flex flex-col items-center py-1">
      <motion.div
        className="h-6 w-px origin-top bg-gradient-to-b from-border-default to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay, ease: EASE_PREMIUM }}
      />
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: delay + 0.15, ease: EASE_PREMIUM }}
      >
        <motion.div
          animate={
            active
              ? { y: [0, 3, 0], opacity: [0.5, 1, 0.5] }
              : { opacity: 0.4 }
          }
          transition={{ duration: 2, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
        >
          <ChevronDown
            className="size-4"
            style={{ color: active ? ANALYSIS_PALETTE.orange : 'rgb(148 163 184 / 0.5)' }}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="h-6 w-px origin-bottom bg-gradient-to-t from-border-default to-transparent"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.1, ease: EASE_PREMIUM }}
      />
    </div>
  );
}
