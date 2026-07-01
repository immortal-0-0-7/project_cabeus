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
  sm: 'p-5',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      interactive = false,
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
        'module',
        paddingStyles[padding],
        interactive && 'cursor-pointer transition-opacity duration-500 hover:opacity-90',
        className,
      )}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  ),
);

Card.displayName = 'Card';
