import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion';
import { EASE_PREMIUM } from '@/utils/motion';

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border-subtle px-8 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="flex flex-col items-start">
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_PREMIUM }}
              className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-[-0.04em] uppercase text-text-primary"
            >
              Project Cabeus
            </motion.h3>
            <p className="mt-6 max-w-md text-base font-light text-text-secondary">
              Built for Bharatiya Antariksh Hackathon 2026
            </p>
            <p className="text-label mt-4">
              Lunar Resource Intelligence Platform
            </p>
            <div className="mt-16 h-px w-full max-w-xs bg-border-subtle" />
            <p className="text-label mt-8">
              © 2026 Project Cabeus
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
