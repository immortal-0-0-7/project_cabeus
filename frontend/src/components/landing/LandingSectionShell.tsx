import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LandingSectionShellProps {
  id?: string;
  children: ReactNode;
  className?: string;
  withGrid?: boolean;
  withOrbs?: boolean;
}

function SectionOrbs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-ice/8 blur-3xl"
        animate={{ y: [0, 24, 0], x: [0, 12, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full bg-mission/10 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, -10, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cinematic/8 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
    </>
  );
}

export function LandingSectionShell({
  id,
  children,
  className,
  withGrid = true,
  withOrbs = true,
}: LandingSectionShellProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section id={id} ref={ref} className={cn('relative overflow-hidden', className)}>
      {withOrbs && <SectionOrbs />}
      {withGrid && (
        <motion.div
          aria-hidden
          className="landing-grid pointer-events-none absolute inset-0 opacity-40"
          style={{ y: gridY }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
