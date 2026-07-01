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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_PREMIUM }}
      className={cn(
        'pointer-events-auto fixed inset-x-0 top-0 z-50 transition-all duration-700',
        scrolled && 'glass',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6 md:px-12 md:py-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-sm font-semibold tracking-[0.28em] text-text-primary uppercase transition-opacity duration-500 hover:opacity-60"
        >
          Cabeus
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollTo(link.id)}
              className={cn(
                'font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-500',
                active === link.id
                  ? 'text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <span className="font-mono text-[10px] tracking-[0.16em] text-text-muted uppercase">
          Nominal
        </span>
      </div>
    </motion.header>
  );
}
