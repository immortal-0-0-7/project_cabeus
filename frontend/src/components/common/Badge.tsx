import type { ThemeColor } from '@/types';
import { cn } from '@/utils/cn';

export interface BadgeProps {
  children: React.ReactNode;
  color?: ThemeColor;
  pulse?: boolean;
  className?: string;
}

const colorStyles: Record<ThemeColor, string> = {
  ice: 'bg-ice/15 text-ice border-ice/25',
  mission: 'bg-mission/15 text-mission border-mission/25',
  cinematic: 'bg-cinematic/15 text-cinematic border-cinematic/25',
  signal: 'bg-signal/15 text-signal border-signal/25',
  warning: 'bg-warning/15 text-warning border-warning/25',
  danger: 'bg-danger/15 text-danger border-danger/25',
};

export function Badge({ children, color = 'ice', pulse = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'font-mono text-[10px] font-medium uppercase tracking-widest',
        colorStyles[color],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex size-1.5">
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-60',
              color === 'signal' ? 'bg-signal' : 'bg-ice',
            )}
          />
          <span
            className={cn(
              'relative inline-flex size-1.5 rounded-full',
              color === 'signal' ? 'bg-signal' : 'bg-ice',
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
