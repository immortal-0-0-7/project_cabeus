import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, type UseScrollOptions } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: UseScrollOptions['offset'];
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.15,
  offset = ['start end', 'end start'],
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -80, speed * 80]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
