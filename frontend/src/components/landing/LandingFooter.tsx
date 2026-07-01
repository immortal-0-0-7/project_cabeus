import { FadeIn } from '@/components/motion';

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border-subtle px-8 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="flex flex-col items-center text-center">
            <h3 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-[-0.04em] uppercase text-text-primary">
              Project Cabeus
            </h3>
            <p className="mt-6 max-w-md text-base font-light text-text-secondary">
              Built for Bharatiya Antariksh Hackathon 2026
            </p>
            <p className="text-label mt-4">
              Lunar Resource Intelligence Platform
            </p>
            <div className="separator mt-16 w-full max-w-xs" />
            <p className="text-label mt-8">
              © 2026 Project Cabeus
            </p>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
