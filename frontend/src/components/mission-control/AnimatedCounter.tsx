import { motion } from 'framer-motion';
import { useAnimatedValue } from '@/hooks/useMissionData';
import { cn } from '@/utils/cn';

export interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const animated = useAnimatedValue(value);

  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {animated.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
