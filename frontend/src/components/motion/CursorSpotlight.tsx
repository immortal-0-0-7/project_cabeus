import { useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CursorSpotlightProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export function CursorSpotlight({ className, size = 900, opacity = 0.35 }: CursorSpotlightProps) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 28, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 28, mass: 0.4 });
  const gradientX = useMotionTemplate`${springX}%`;
  const gradientY = useMotionTemplate`${springY}%`;
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${gradientX} ${gradientY}, rgb(249 115 22 / ${opacity}), transparent 42%), radial-gradient(700px circle at 80% 20%, rgb(239 68 68 / 0.08), transparent 50%)`;

  useEffect(() => {
    if (reducedMotion) return;

    const handleMove = (event: MouseEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 100);
      pointerY.set((event.clientY / window.innerHeight) * 100);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [pointerX, pointerY, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ background }}
    />
  );
}
