import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'full' | 'xl' | '2xl';
}

const maxWidthStyles = {
  full: 'max-w-none',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[90rem]',
};

export function PageContainer({
  children,
  className,
  maxWidth = 'full',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full flex-1 p-4 lg:p-6',
        maxWidthStyles[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
