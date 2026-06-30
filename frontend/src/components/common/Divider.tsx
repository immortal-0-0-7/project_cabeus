import { cn } from '@/utils/cn';

export interface DividerProps {
  className?: string;
  label?: string;
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="h-px flex-1 bg-border-default" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {label}
        </span>
        <div className="h-px flex-1 bg-border-default" />
      </div>
    );
  }

  return <div className={cn('h-px w-full bg-border-default', className)} />;
}
