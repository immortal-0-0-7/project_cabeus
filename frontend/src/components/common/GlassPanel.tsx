import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  strong?: boolean;
  animate?: boolean;
  children?: ReactNode;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, strong = false, animate = true, children, ...props }, ref) => {
    const panelClassName = cn(
      strong ? 'glass-strong' : 'glass',
      'rounded-xl shadow-panel',
      className,
    );

    if (!animate) {
      return (
        <div ref={ref} className={panelClassName}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={panelClassName}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

GlassPanel.displayName = 'GlassPanel';
