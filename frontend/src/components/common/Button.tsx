import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ButtonSize, ButtonVariant } from '@/types';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-text-primary text-space-void hover:bg-white/90',
  secondary:
    'bg-white/6 text-text-primary hover:bg-white/10',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary',
  outline:
    'bg-transparent text-text-primary border border-border-default hover:border-border-strong hover:bg-white/3',
  danger:
    'bg-danger/10 text-danger hover:bg-danger/18',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-[0.9375rem] gap-2.5 tracking-wide',
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
          'relative inline-flex items-center justify-center font-medium transition-colors duration-500',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mission/50 focus-visible:ring-offset-2 focus-visible:ring-offset-space-void',
          'disabled:pointer-events-none disabled:opacity-40',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : (whileHover ?? { opacity: 0.88 })}
        whileTap={isDisabled ? undefined : (whileTap ?? { opacity: 0.75 })}
        transition={{ duration: 0.5, ease: EASE_PREMIUM }}
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
