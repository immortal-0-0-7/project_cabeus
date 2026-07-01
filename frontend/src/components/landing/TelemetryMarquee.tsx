import { useEffect, useRef } from 'react';
import { FadeIn } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TELEMETRY = [
  'PASS ID: C2-SAR-2024-1847',
  'ACQ: 2024-09-14T06:41:22Z',
  'LAT: 89.54°S',
  'LON: 32.67°E',
  'FREQ: 1.25 GHz L-BAND',
  'INCIDENCE: 35.2°',
  'RES: 5m/px',
  'PROCESSING: LEVEL-2A',
  'SNR: 18.3 dB',
  'PENETRATION: 4.8m',
  'SOUTH POLAR SWATH',
  'SHACKLETON RIM',
  'DFSAR CALIBRATED',
  'PSR MAPPING ACTIVE',
  'SIGNAL QUALITY: 94.2%',
  'TERRAIN STABILITY: 91.8%',
] as const;

const BASE_SPEED = 24;
const SCROLL_BOOST = 4;
const VELOCITY_DECAY = 0.92;

function MarqueeRow({
  items,
  trackRef,
  segmentWidthRef,
}: {
  items: readonly string[];
  trackRef: React.RefObject<HTMLDivElement | null>;
  segmentWidthRef: React.MutableRefObject<number>;
}) {
  const doubled = [...items, ...items];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const measure = () => {
      segmentWidthRef.current = el.scrollWidth / 2;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items, trackRef, segmentWidthRef]);

  return (
    <div ref={trackRef} className="flex gap-16 will-change-transform">
      {doubled.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="shrink-0 whitespace-nowrap font-mono text-[11px] tracking-[0.14em] text-text-muted uppercase"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function TelemetryMarquee() {
  const reducedMotion = useReducedMotion();
  const offsetRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const segmentRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollVelocityRef.current += y - lastScrollYRef.current;
      lastScrollYRef.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!reducedMotion) {
        scrollVelocityRef.current *= VELOCITY_DECAY;
        const boost = Math.abs(scrollVelocityRef.current) * SCROLL_BOOST;
        offsetRef.current += (BASE_SPEED + boost) * dt;
      }

      const el = rowRef.current;
      const segment = segmentRef.current;
      if (el && segment > 0) {
        const looped = offsetRef.current % segment;
        el.style.transform = `translateX(-${looped}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  return (
    <section className="relative overflow-hidden border-y border-border-subtle bg-space-panel py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-space-void to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-space-void to-transparent"
      />
      <FadeIn>
        <MarqueeRow
          items={TELEMETRY}
          trackRef={rowRef}
          segmentWidthRef={segmentRef}
        />
      </FadeIn>
    </section>
  );
}
