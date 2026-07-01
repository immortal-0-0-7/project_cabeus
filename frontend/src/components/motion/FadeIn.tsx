import { motion, type HTMLMotionProps } from 'framer-motion';
import { EASE_PREMIUM } from '@/utils/motion';

type FadeInProps = HTMLMotionProps<'div'> & {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: EASE_PREMIUM }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
