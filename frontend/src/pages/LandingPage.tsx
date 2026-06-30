import { motion } from 'framer-motion';
import { LandingScene } from '@/components/3d/LandingScene';
import { HeroOverlay } from '@/components/landing/HeroOverlay';
import { useMouseRef } from '@/hooks/useMouseRef';

export function LandingPage() {
  const mouse = useMouseRef();

  return (
    <motion.main
      className="relative h-dvh w-full overflow-hidden bg-space-void"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0">
        <LandingScene mouse={mouse} />
      </div>

      <div className="noise-overlay pointer-events-none absolute inset-0 z-20 opacity-30 mix-blend-overlay" />
      <HeroOverlay />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-5"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 50%, transparent 30%, rgb(2 4 10 / 0.55) 100%)',
        }}
      />
    </motion.main>
  );
}
