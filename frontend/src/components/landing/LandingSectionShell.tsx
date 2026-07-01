import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface LandingSectionShellProps {
  id?: string;
  children: ReactNode;
  className?: string;
  withGrid?: boolean;
  withOrbs?: boolean;
}

export function LandingSectionShell({
  id,
  children,
  className,
}: LandingSectionShellProps) {
  return (
    <section id={id} className={cn('relative overflow-hidden', className)}>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
