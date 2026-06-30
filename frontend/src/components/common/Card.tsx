import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { scaleIn } from '@/utils/motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean;
  glow?: 'ice' | 'mission' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const glowStyles = {
  ice: 'hover:shadow-[0_0_32px_rgb(103_216_255/0.12)]',
  mission: 'hover:shadow-[0_0_32px_rgb(77_140_255/0.12)]',
  none: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      interactive = false,
      glow = 'none',
      padding = 'md',
      children,
      ...props
    },
    ref,
  ) => (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={cn(
        'glass rounded-xl shadow-panel',
        paddingStyles[padding],
        interactive && 'cursor-pointer transition-shadow duration-300',
        glowStyles[glow],
        className,
      )}
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ duration: 0.25 }}
      {...props}
    >
      {children}
    </motion.div>
  ),
);

Card.displayName = 'Card';
