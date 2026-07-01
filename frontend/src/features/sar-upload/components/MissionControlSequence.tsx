import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Check,
  Cpu,
  Database,
  Filter,
  Loader2,
  MapPin,
  Radar,
  Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PipelinePhase, StageState } from '../types';

const STAGE_ICONS: Record<string, LucideIcon> = {
  'loading-dataset': Database,
  'calibrating-sar': Radar,
  'filtering-noise': Filter,
  'ice-probability': Cpu,
  'running-ai': Brain,
  'landing-sites': MapPin,
  'mission-ready': Rocket,
};

interface MissionControlSequenceProps {
  stages: StageState[];
  phase: PipelinePhase;
  overallProgress: number;
  elapsedMs: number;
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `T+${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export function MissionControlSequence({
  stages,
  phase,
  overallProgress,
  elapsedMs,
}: MissionControlSequenceProps) {
  const reducedMotion = useReducedMotion();
  const isActive = phase === 'processing' || phase === 'uploading';
  const isComplete = phase === 'complete';

  return (
    <div className="flex h-full flex-col">
      {/* Header telemetry */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            Mission Control Sequence
          </p>
          <h3 className="mt-1 font-display text-base font-semibold text-text-primary">
            SAR Intelligence Pipeline
          </h3>
        </div>

        <div className="text-right">
          <p className="font-mono text-[9px] text-text-muted">MISSION ELAPSED</p>
          <motion.p
            key={Math.floor(elapsedMs / 100)}
            className="font-mono text-sm font-medium text-ice"
            initial={reducedMotion ? false : { opacity: 0.6 }}
            animate={{ opacity: 1 }}
          >
            {formatElapsed(elapsedMs)}
          </motion.p>
        </div>
      </div>

      {/* Overall progress ring */}
      <div className="relative mx-auto mb-6 flex size-28 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 112 112">
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="rgb(255 255 255 / 0.06)"
            strokeWidth="4"
          />
          <motion.circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 48}
            animate={{
              strokeDashoffset: 2 * Math.PI * 48 * (1 - overallProgress / 100),
            }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE_PREMIUM }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="45%" stopColor="#F97316" />
              <stop offset="78%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 text-center">
          <motion.span
            className="font-mono text-2xl font-bold text-text-primary"
            key={Math.round(overallProgress)}
          >
            {Math.round(overallProgress)}
          </motion.span>
          <p className="font-mono text-[9px] text-text-muted">% COMPLETE</p>
        </div>

        {isActive && !reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border border-ice/20"
            animate={{ scale: [1, 1.12], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Stage list */}
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {stages.map(({ stage, status, progress }, index) => {
          const Icon = STAGE_ICONS[stage.id] ?? Cpu;
          const isMissionReady = stage.id === 'mission-ready';
          const isStageComplete = status === 'complete';
          const isStageActive = status === 'active';

          return (
            <motion.li
              key={stage.id}
              initial={reducedMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4, ease: EASE_PREMIUM }}
              className={cn(
                'relative overflow-hidden rounded-lg border px-3 py-2.5 transition-colors duration-300',
                isStageActive && 'border-ice/35 bg-ice/6 shadow-[0_0_20px_rgb(103_216_255/0.08)]',
                isStageComplete &&
                  (isMissionReady && isComplete
                    ? 'border-signal/40 bg-signal/8 shadow-[0_0_24px_rgb(52_211_153/0.12)]'
                    : 'border-signal/20 bg-signal/4'),
                status === 'pending' && 'border-border-subtle bg-space-panel',
              )}
            >
              {/* Active stage shimmer */}
              {isStageActive && !reducedMotion && (
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-ice/5 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}

              <div className="relative flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg border',
                    isStageComplete &&
                      (isMissionReady && isComplete
                        ? 'border-signal/50 bg-signal/15 text-signal'
                        : 'border-signal/40 bg-signal/10 text-signal'),
                    isStageActive && 'border-ice/40 bg-ice/10 text-ice',
                    status === 'pending' && 'border-border-default bg-space-panel text-text-muted',
                  )}
                >
                  {isStageComplete ? (
                    <motion.div
                      initial={reducedMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      <Check className="size-4" strokeWidth={2.5} />
                    </motion.div>
                  ) : isStageActive ? (
                    <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <Icon className="size-4" strokeWidth={1.5} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-xs font-medium',
                        isStageActive ? 'text-ice' : 'text-text-primary',
                        isMissionReady && isComplete && 'text-signal',
                      )}
                    >
                      {stage.label}
                    </p>
                    <span className="font-mono text-[8px] text-text-muted">
                      {stage.telemetryCode}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-text-muted">
                    {stage.description}
                  </p>
                </div>

                <span
                  className={cn(
                    'shrink-0 font-mono text-[10px]',
                    isStageComplete ? 'text-signal' : isStageActive ? 'text-ice' : 'text-text-muted',
                  )}
                >
                  {isStageComplete ? 'DONE' : isStageActive ? `${Math.round(progress)}%` : '—'}
                </span>
              </div>

              {/* Per-stage progress bar */}
              <AnimatePresence>
                {isStageActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative mt-2.5"
                  >
                    <div className="h-0.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-gradient-progress"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>

      {/* Status footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-2 rounded-full',
              isComplete
                ? 'bg-signal shadow-[0_0_8px_rgb(52_211_153/0.6)]'
                : isActive
                  ? 'bg-ice animate-pulse shadow-[0_0_8px_rgb(103_216_255/0.5)]'
                  : 'bg-text-muted',
            )}
          />
          <span className="font-mono text-[10px] text-text-muted">
            {isComplete
              ? 'GO FOR ANALYSIS'
              : isActive
                ? 'PIPELINE ACTIVE'
                : 'STANDING BY'}
          </span>
        </div>
        <span className="font-mono text-[9px] text-text-muted">
          NODE: C2-INFER-01
        </span>
      </div>
    </div>
  );
}
