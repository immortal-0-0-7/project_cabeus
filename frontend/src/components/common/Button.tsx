import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ButtonSize, ButtonVariant } from '@/types';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-text-primary text-space-void',
  secondary:
    'bg-space-elevated text-text-primary border border-white/8 hover:border-warning/35',
  ghost:
    'bg-transparent text-text-secondary',
  outline:
    'bg-transparent text-text-primary border border-border-default hover:border-mission/40',
  danger:
    'bg-danger/10 text-danger border border-danger/15',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-5 text-[0.6875rem] gap-1.5 tracking-[0.08em]',
  md: 'h-11 px-7 text-xs gap-2 tracking-[0.08em]',
  lg: 'h-[3.25rem] px-9 text-[0.8125rem] gap-2.5 tracking-[0.06em]',
};

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      whileHover,
      whileTap,
      // Accept but ignore icon props for backward compat
      leftIcon: _leftIcon,
      rightIcon: _rightIcon,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-medium uppercase transition-all duration-500',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mission/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-void',
          'disabled:pointer-events-none disabled:opacity-40',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : (whileHover ?? { opacity: 0.85 })}
        whileTap={isDisabled ? undefined : (whileTap ?? { opacity: 0.7 })}
        transition={{ duration: 0.5, ease: EASE_PREMIUM }}
        {...props}
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        )}
        <span>{children}</span>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
