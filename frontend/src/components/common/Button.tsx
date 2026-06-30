import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ButtonSize, ButtonVariant } from '@/types';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-r from-ice/90 to-mission/90 text-space-void border border-ice/30 shadow-[0_0_24px_rgb(103_216_255/0.2)] hover:from-ice hover:to-mission hover:shadow-[0_0_32px_rgb(103_216_255/0.35)]',
  secondary:
    'bg-mission/15 text-text-primary border border-mission/25 hover:bg-mission/25 hover:border-mission/40',
  ghost:
    'bg-transparent text-text-secondary border border-transparent hover:text-text-primary hover:bg-white/5',
  outline:
    'bg-transparent text-text-primary border border-border-default hover:border-ice/40 hover:bg-ice/5',
  danger:
    'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
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
      leftIcon,
      rightIcon,
      children,
      whileHover,
      whileTap,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-void',
          'disabled:pointer-events-none disabled:opacity-45',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : (whileHover ?? { scale: 1.02 })}
        whileTap={isDisabled ? undefined : (whileTap ?? { scale: 0.98 })}
        transition={{ duration: 0.2, ease: EASE_PREMIUM }}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
