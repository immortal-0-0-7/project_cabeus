import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const NAV_LINKS = [
  { id: 'overview', label: 'Overview' },
  { id: 'technology', label: 'Pipeline' },
  { id: 'detection', label: 'Detection' },
  { id: 'landing', label: 'Landing' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'report', label: 'Report' },
] as const;

export function LandingNav() {
  const [active, setActive] = useState('overview');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s!));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_PREMIUM }}
      className={cn(
        'pointer-events-auto fixed inset-x-0 top-0 z-50 transition-all duration-700',
        scrolled ? 'border-b border-border-default bg-space-void/95 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 md:px-12 md:py-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3 transition-opacity duration-500 hover:opacity-70"
        >
          <span className="font-display text-sm font-semibold tracking-[0.28em] text-text-primary uppercase">
            Cabeus
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              className={cn(
                'relative px-4 py-2 font-mono text-[11px] tracking-[0.1em] uppercase transition-colors duration-500',
                active === link.id
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {active === link.id && (
                <motion.span
                  layoutId="landing-nav-active"
                  className="absolute inset-x-2 -bottom-px h-px bg-text-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </button>
          ))}
        </nav>

        <span className="font-mono text-[10px] tracking-[0.14em] text-text-muted uppercase">
          Systems Nominal
        </span>
      </div>
    </motion.header>
  );
}
