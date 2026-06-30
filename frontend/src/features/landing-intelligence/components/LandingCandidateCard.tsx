import { motion } from 'framer-motion';
import {
  Clock,
  Crosshair,
  Droplets,
  FlaskConical,
  MapPin,
  ShieldAlert,
  Snowflake,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { RISK_COLORS, RISK_LABELS } from '@/features/landing-intelligence/constants';
import { formatCoordinates } from '@/features/landing-intelligence/utils/generateCandidates';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

const statusBadge = {
  primary: 'signal' as const,
  backup: 'mission' as const,
  candidate: 'ice' as const,
};

export interface LandingCandidateCardProps {
  candidate: LandingCandidate;
  selected: boolean;
  index: number;
  onSelect: (id: string) => void;
}

export function LandingCandidateCard({
  candidate,
  selected,
  index,
  onSelect,
}: LandingCandidateCardProps) {
  const reducedMotion = useReducedMotion();

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Landing Score',
      value: candidate.compositeScore,
      suffix: '',
      color: 'text-ice',
      bar: candidate.compositeScore,
    },
    {
      icon: ShieldAlert,
      label: 'Risk',
      value: candidate.risk,
      suffix: '%',
      color: RISK_COLORS[candidate.riskLevel],
      bar: candidate.risk,
      invert: true,
      display: RISK_LABELS[candidate.riskLevel],
    },
    {
      icon: Snowflake,
      label: 'Ice Probability',
      value: candidate.iceProbability,
      suffix: '%',
      color: 'text-ice',
      bar: candidate.iceProbability,
    },
    {
      icon: FlaskConical,
      label: 'Scientific Value',
      value: candidate.scientificValue,
      suffix: '%',
      color: 'text-cinematic',
      bar: candidate.scientificValue,
    },
    {
      icon: Droplets,
      label: 'Extraction Potential',
      value: candidate.extractionPotential,
      suffix: '%',
      color: 'text-mission',
      bar: candidate.extractionPotential,
    },
    {
      icon: Crosshair,
      label: 'Coordinates',
      display: formatCoordinates(candidate.lat, candidate.lon),
      color: 'text-text-secondary',
    },
    {
      icon: Clock,
      label: 'Mission Duration',
      value: candidate.missionDurationSols,
      suffix: ' sols',
      color: 'text-text-secondary',
    },
    {
      icon: Droplets,
      label: 'Expected Yield',
      value: candidate.expectedYield,
      suffix: ' L/m³',
      decimals: 2,
      color: 'text-signal',
    },
    {
      icon: Target,
      label: 'Success Probability',
      value: candidate.missionSuccessProbability,
      suffix: '%',
      color: 'text-signal',
      bar: candidate.missionSuccessProbability,
    },
  ];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(candidate.id)}
      className={cn(
        'group relative w-full overflow-hidden rounded-xl border text-left',
        'transition-colors duration-200',
        selected
          ? 'border-ice/40 bg-ice/6 shadow-[0_0_40px_rgb(103_216_255/0.12)]'
          : 'border-border-subtle bg-white/2 hover:border-border-default',
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE_PREMIUM }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -4,
              transition: { duration: 0.22, ease: EASE_PREMIUM },
            }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.995 }}
      layout
    >
      {/* Hover shine sweep */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/6 to-transparent"
          initial={false}
          whileHover={{ translateX: '200%' }}
          transition={{ duration: 0.65, ease: EASE_PREMIUM }}
        />
      )}

      {/* Rank accent bar */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          candidate.rank === 1 && 'bg-gradient-to-b from-signal via-ice to-mission',
          candidate.rank === 2 && 'bg-mission/80',
          candidate.rank > 2 && 'bg-white/10',
        )}
      />

      <div className="relative p-4 pl-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold',
                  candidate.rank === 1
                    ? 'bg-signal/15 text-signal'
                    : 'bg-white/6 text-text-muted',
                )}
              >
                {candidate.rank === 1 ? <Trophy className="size-3.5" /> : `#${candidate.rank}`}
              </span>
              <Badge color={statusBadge[candidate.status]}>{candidate.status}</Badge>
              <Badge color="ice">{RISK_LABELS[candidate.riskLevel]} Risk</Badge>
            </div>
            <h3 className="mt-2 flex items-center gap-1.5 truncate font-display text-sm font-semibold text-text-primary">
              <MapPin className="size-3.5 shrink-0 text-ice" />
              {candidate.name}
            </h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Score</p>
            <p className="font-mono text-xl font-bold text-gradient-ice">
              <AnimatedCounter value={candidate.compositeScore} decimals={1} />
            </p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <div className="flex items-center gap-1.5">
                <metric.icon className={cn('size-3 shrink-0', metric.color)} />
                <span className="truncate text-[10px] text-text-muted">{metric.label}</span>
              </div>
              <p className={cn('mt-0.5 truncate font-mono text-xs font-medium', metric.color)}>
                {'display' in metric && metric.display ? (
                  metric.display
                ) : (
                  <AnimatedCounter
                    value={metric.value!}
                    decimals={'decimals' in metric ? metric.decimals : metric.suffix === ' sols' ? 0 : 1}
                    suffix={metric.suffix}
                  />
                )}
              </p>
              {metric.bar !== undefined && (
                <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-white/6">
                  <motion.div
                    className={cn(
                      'h-full rounded-full',
                      metric.invert ? 'bg-warning' : 'bg-gradient-to-r from-mission to-ice',
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.bar}%` }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.6,
                      delay: reducedMotion ? 0 : index * 0.06 + 0.15,
                      ease: EASE_PREMIUM,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
