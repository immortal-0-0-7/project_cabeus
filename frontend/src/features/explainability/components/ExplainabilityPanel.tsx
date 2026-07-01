import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Brain,
  ChevronRight,
  Crosshair,
  FlaskConical,
  Layers,
  MapPin,
  Mountain,
  Radar,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import type { SiteExplainability } from '@/features/explainability/types';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import { formatCoordinates } from '@/features/landing-intelligence/utils/generateCandidates';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM, staggerContainer } from '@/utils/motion';

const detectionTypeColors = {
  ice: 'ice',
  terrain: 'mission',
  anomaly: 'cinematic',
} as const;

function ConfidenceRing({ value, size = 72 }: { value: number; size?: number }) {
  const reducedMotion = useReducedMotion();
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(255 255 255 / 0.06)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#confidenceGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reducedMotion ? 0 : 1.1, ease: EASE_PREMIUM }}
        />
        <defs>
          <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6e5dff" />
            <stop offset="50%" stopColor="#67d8ff" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-bold text-text-primary">
          <AnimatedCounter value={value} decimals={0} suffix="%" />
        </span>
        <span className="text-[8px] uppercase tracking-wider text-text-muted">Confidence</span>
      </div>
    </div>
  );
}

function RadarWaveform({ waveform }: { waveform: number[] }) {
  const reducedMotion = useReducedMotion();
  const width = 100;
  const height = 36;
  const step = width / (waveform.length - 1);

  const path = waveform
    .map((v, i) => {
      const x = i * step;
      const y = height - v * height * 0.85 - 2;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-full">
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67d8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#67d8ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill="url(#radarFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#67d8ff"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.2, ease: EASE_PREMIUM }}
      />
      {!reducedMotion && (
        <motion.line
          x1="0"
          y1="0"
          x2="0"
          y2={height}
          stroke="#67d8ff"
          strokeWidth="0.8"
          opacity="0.6"
          animate={{ x1: [0, width], x2: [0, width] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </svg>
  );
}

function TypingText({ text, active }: { text: string; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? text : '');

  useEffect(() => {
    if (reducedMotion || !active) {
      setDisplayed(text);
      return;
    }

    setDisplayed('');
    let i = 0;
    const interval = window.setInterval(() => {
      i += 2;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) window.clearInterval(interval);
    }, 12);

    return () => window.clearInterval(interval);
  }, [text, active, reducedMotion]);

  return (
    <p className="text-[11px] leading-relaxed text-text-secondary">
      {displayed}
      {!reducedMotion && active && displayed.length < text.length && (
        <motion.span
          className="ml-0.5 inline-block h-3 w-0.5 bg-cinematic"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </p>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Brain;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE_PREMIUM }}
      className="rounded-lg border border-border-subtle bg-space-panel p-3"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md border border-cinematic/25 bg-cinematic/10">
          <Icon className="size-3 text-cinematic" />
        </div>
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-primary">
          {title}
        </h4>
      </div>
      {children}
    </motion.section>
  );
}

function AnalyzingShimmer() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className="relative flex size-14 items-center justify-center rounded-2xl border border-cinematic/30 bg-cinematic/10"
        animate={{ boxShadow: ['0 0 20px rgb(110 93 255 / 0.1)', '0 0 40px rgb(110 93 255 / 0.25)', '0 0 20px rgb(110 93 255 / 0.1)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Brain className="size-6 text-cinematic" />
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-cinematic/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">AI Copilot analyzing site</p>
        <p className="mt-1 font-mono text-[10px] text-text-muted">Running explainability inference...</p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-1.5 rounded-full bg-cinematic"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

export interface ExplainabilityPanelProps {
  candidate: LandingCandidate | undefined;
  explainability: SiteExplainability | null;
  isOpen: boolean;
  isAnalyzing: boolean;
  onClose: () => void;
}

export function ExplainabilityPanel({
  candidate,
  explainability,
  isOpen,
  isAnalyzing,
  onClose,
}: ExplainabilityPanelProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && candidate && (
        <>
          <motion.div
            className="absolute inset-0 z-20 rounded-xl bg-space-void/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.aside
            className={cn(
              'absolute right-3 top-3 z-30 flex w-[min(100%-1.5rem,380px)] flex-col',
              'max-h-[calc(100%-1.5rem)] overflow-hidden rounded-xl',
              'border border-cinematic/25 glass-strong shadow-[0_0_60px_rgb(110_93_255/0.15)]',
            )}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative border-b border-border-subtle px-4 py-3">
              {!reducedMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cinematic/60 to-transparent"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-cinematic/30 bg-cinematic/12">
                    <Sparkles className="size-4 text-cinematic" />
                    {!reducedMotion && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border border-cinematic/40"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">AI Copilot</h3>
                      <Badge color="cinematic" pulse>
                        XAI
                      </Badge>
                    </div>
                    <p className="truncate text-[10px] text-text-muted">Explainable site intelligence</p>
                  </div>
                </div>
                <IconButton label="Close explainability panel" onClick={onClose}>
                  <X className="size-4" />
                </IconButton>
              </div>

              <motion.div
                className="mt-3 flex items-center gap-2 rounded-lg border border-border-subtle bg-space-panel px-2.5 py-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MapPin className="size-3 shrink-0 text-ice" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-text-primary">{candidate.name}</p>
                  <p className="font-mono text-[9px] text-text-muted">
                    {formatCoordinates(candidate.lat, candidate.lon)} · Rank #{candidate.rank}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-3">
              {isAnalyzing || !explainability ? (
                <AnalyzingShimmer />
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {/* Why selected + confidence */}
                  <SectionCard icon={Target} title="Why AI Selected It" delay={0}>
                    <p className="text-[11px] leading-relaxed text-text-secondary">
                      {explainability.whySelected}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <ConfidenceRing value={explainability.confidence} />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {explainability.confidenceFactors.map((factor, i) => (
                          <div key={factor.label}>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-text-muted">{factor.label}</span>
                              <span className="font-mono text-[9px] text-ice">
                                {factor.value.toFixed(0)}%
                              </span>
                            </div>
                            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/6">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-cinematic to-ice"
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.value}%` }}
                                transition={{
                                  duration: reducedMotion ? 0 : 0.7,
                                  delay: 0.15 + i * 0.06,
                                  ease: EASE_PREMIUM,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SectionCard>

                  {/* Supporting evidence */}
                  <SectionCard icon={Zap} title="Supporting Evidence" delay={0.05}>
                    <ul className="space-y-2">
                      {explainability.supportingEvidence.map((ev, i) => (
                        <motion.li
                          key={ev.id}
                          initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          className="flex items-center gap-2 rounded-md border border-border-subtle bg-space-deep px-2.5 py-2"
                        >
                          <ChevronRight className="size-3 shrink-0 text-cinematic" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-medium text-text-primary">{ev.label}</p>
                            <p className="font-mono text-[9px] text-ice">{ev.value}</p>
                          </div>
                          <Badge color="mission">{ev.source}</Badge>
                          <div className="w-8 text-right">
                            <span className="font-mono text-[9px] text-text-muted">
                              {ev.strength.toFixed(0)}%
                            </span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </SectionCard>

                  {/* Terrain + Slope row */}
                  <div className="grid grid-cols-2 gap-2">
                    <SectionCard icon={Mountain} title="Terrain" delay={0.1}>
                      <p className="text-[10px] font-medium text-text-primary">
                        {explainability.terrain.classification}
                      </p>
                      <dl className="mt-2 space-y-1.5">
                        {[
                          { k: 'Stability', v: `${explainability.terrain.stability.toFixed(0)}%` },
                          { k: 'Regolith', v: `${explainability.terrain.regolithDepthM.toFixed(1)} m` },
                          { k: 'Illumination', v: `${explainability.terrain.illuminationHours} h/yr` },
                        ].map(({ k, v }) => (
                          <div key={k} className="flex justify-between">
                            <dt className="text-[9px] text-text-muted">{k}</dt>
                            <dd className="font-mono text-[9px] text-text-secondary">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </SectionCard>

                    <SectionCard icon={Activity} title="Slope" delay={0.12}>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-2xl font-bold text-text-primary">
                          {explainability.slope.degrees.toFixed(1)}
                        </span>
                        <span className="text-sm text-text-muted">°</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-text-secondary">
                        {explainability.slope.grade} gradient
                      </p>
                      <div
                        className={cn(
                          'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium',
                          explainability.slope.withinRoverLimits
                            ? 'bg-signal/15 text-signal'
                            : 'bg-warning/15 text-warning',
                        )}
                      >
                        <Crosshair className="size-2.5" />
                        {explainability.slope.withinRoverLimits
                          ? `Within ${explainability.slope.maxSafeDeg}° limit`
                          : 'Exceeds rover limit'}
                      </div>
                    </SectionCard>
                  </div>

                  {/* Nearby detections */}
                  <SectionCard icon={Layers} title="Nearby Detections" delay={0.15}>
                    <ul className="space-y-1.5">
                      {explainability.nearbyDetections.map((det, i) => (
                        <motion.li
                          key={det.id}
                          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 + i * 0.05 }}
                          className="flex items-center gap-2 rounded-md px-1 py-1"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-ice" />
                          <span className="min-w-0 flex-1 truncate text-[10px] text-text-primary">
                            {det.label}
                          </span>
                          <span className="font-mono text-[9px] text-text-muted">
                            {det.distanceKm.toFixed(1)} km
                          </span>
                          <Badge color={detectionTypeColors[det.type]}>
                            {det.confidence.toFixed(0)}%
                          </Badge>
                        </motion.li>
                      ))}
                    </ul>
                  </SectionCard>

                  {/* Radar signature */}
                  <SectionCard icon={Radar} title="Radar Signature" delay={0.18}>
                    <RadarWaveform waveform={explainability.radarSignature.waveform} />
                    <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {[
                        { k: 'Band', v: explainability.radarSignature.band },
                        { k: 'Backscatter', v: `${explainability.radarSignature.backscatterDb.toFixed(1)} dB` },
                        { k: 'Polarization', v: explainability.radarSignature.polarization },
                        { k: 'Permittivity', v: `εr ${explainability.radarSignature.permittivity.toFixed(2)}` },
                        { k: 'Penetration', v: `${explainability.radarSignature.penetrationDepthM.toFixed(1)} m` },
                      ].map(({ k, v }) => (
                        <div key={k}>
                          <dt className="text-[8px] text-text-muted">{k}</dt>
                          <dd className="font-mono text-[9px] text-ice">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </SectionCard>

                  {/* Scientific reasoning */}
                  <SectionCard icon={FlaskConical} title="Scientific Reasoning" delay={0.22}>
                    <TypingText text={explainability.scientificReasoning} active={!isAnalyzing} />
                  </SectionCard>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {explainability && !isAnalyzing && (
              <motion.div
                className="border-t border-border-subtle px-4 py-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-text-muted">
                    {explainability.modelVersion}
                  </span>
                  <span className="font-mono text-[9px] text-text-muted">
                    {explainability.inferenceTimeMs} ms inference
                  </span>
                </div>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
