import type { ThemeColor } from '@/types';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  color?: ThemeColor;
  pulse?: boolean;
  className?: string;
}

const colorStyles: Record<ThemeColor, string> = {
  ice: 'text-ice',
  mission: 'text-mission',
  cinematic: 'text-cinematic',
  signal: 'text-signal',
  warning: 'text-warning',
  danger: 'text-danger',
};

export function Badge({ children, color = 'ice', pulse = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]',
        colorStyles[color],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex size-1">
          <span
            className={cn(
              'relative inline-flex size-1 rounded-full',
              color === 'signal' ? 'bg-signal' : 'bg-mission',
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
