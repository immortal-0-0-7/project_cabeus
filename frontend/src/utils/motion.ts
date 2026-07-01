import type { Transition, Variants } from 'framer-motion';

/** Cinematic easing — slow, deliberate, no bounce */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_CINEMATIC = [0.25, 0.1, 0.25, 1] as const;

export const transition: Transition = {
  duration: 0.8,
  ease: EASE_PREMIUM,
};

export const cinematicTransition: Transition = {
  duration: 1.2,
  ease: EASE_CINEMATIC,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_PREMIUM },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_PREMIUM },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.5, ease: EASE_PREMIUM },
  },
};
