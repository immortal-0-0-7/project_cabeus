import { motion } from 'framer-motion';
import { FadeIn, Magnet } from '@/components/motion';
import { EASE_PREMIUM } from '@/utils/motion';

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border-subtle px-8 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="flex flex-col items-center text-center">
            <Magnet strength={5}>
              <motion.h3
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_PREMIUM }}
                className="font-display text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-[-0.04em] uppercase"
              >
                <span className="text-gradient-ice">Project Cabeus</span>
              </motion.h3>
            </Magnet>
            <p className="mt-6 max-w-md text-base font-light text-text-secondary">
              Built for Bharatiya Antariksh Hackathon 2026
            </p>
            <p className="text-label mt-4">
              Lunar Resource Intelligence Platform
            </p>
            <div className="landing-divider-glow mt-16 w-full max-w-xs" />
            <p className="text-label mt-8">
              © 2026 Project Cabeus
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
