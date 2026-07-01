import { motion } from 'framer-motion';
import {
  Clock,
  Crosshair,
  Droplets,
  FlaskConical,
  MapPin,
  Snowflake,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { RISK_LABELS } from '@/features/landing-intelligence/constants';
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
    { icon: TrendingUp, label: 'Score', value: candidate.compositeScore },
    { icon: Snowflake, label: 'Ice', value: candidate.iceProbability, suffix: '%' },
    { icon: FlaskConical, label: 'Science', value: candidate.scientificValue, suffix: '%' },
    { icon: Target, label: 'Success', value: candidate.missionSuccessProbability, suffix: '%' },
  ];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(candidate.id)}
      className={cn(
        'group relative w-full py-6 text-left transition-opacity duration-500',
        selected ? 'opacity-100' : 'opacity-70 hover:opacity-90',
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: selected ? 1 : 0.7 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: EASE_PREMIUM }}
      layout
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-muted">
              {String(candidate.rank).padStart(2, '0')}
            </span>
            <Badge color={statusBadge[candidate.status]}>{candidate.status}</Badge>
          </div>
          <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-medium tracking-tight text-text-primary">
            <MapPin className="size-3.5 shrink-0 text-text-muted" strokeWidth={1.25} />
            {candidate.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-text-muted">
            {formatCoordinates(candidate.lat, candidate.lon)}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-stat-massive text-3xl text-text-primary">
            <AnimatedCounter value={candidate.compositeScore} decimals={1} />
          </p>
          <p className="text-label mt-1">{RISK_LABELS[candidate.riskLevel]} risk</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center gap-1.5">
              <metric.icon className="size-3 text-text-muted" strokeWidth={1.25} />
              <span className="text-label">{metric.label}</span>
            </div>
            <p className="mt-1 font-mono text-sm text-text-secondary">
              <AnimatedCounter
                value={metric.value}
                decimals={1}
                suffix={'suffix' in metric ? metric.suffix : ''}
              />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-6 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {candidate.missionDurationSols} sols
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="size-3" />
          {candidate.expectedYield} kg
        </span>
        <span className="flex items-center gap-1">
          <Crosshair className="size-3" />
          {candidate.extractionPotential}%
        </span>
      </div>
    </motion.button>
  );
}
