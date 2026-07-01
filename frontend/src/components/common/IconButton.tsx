import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

export interface IconButtonProps extends HTMLMotionProps<'button'> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

const sizeStyles = {
  sm: 'size-8 rounded-md',
  md: 'size-9 rounded-lg',
  lg: 'size-11 rounded-xl',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = 'md', active = false, children, disabled, ...props }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center border transition-colors duration-200',
        'text-text-secondary hover:text-text-primary hover:bg-space-elevated',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice/50',
        'disabled:pointer-events-none disabled:opacity-45',
        active
          ? 'border-ice/30 bg-ice/10 text-ice'
          : 'border-border-subtle bg-transparent',
        sizeStyles[size],
        className,
      )}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.18, ease: EASE_PREMIUM }}
      {...props}
    >
      {children}
    </motion.button>
  ),
);

IconButton.displayName = 'IconButton';
