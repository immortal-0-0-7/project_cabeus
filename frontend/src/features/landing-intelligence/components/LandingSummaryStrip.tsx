import { motion } from 'framer-motion';
import { BarChart3, Shield, Snowflake, Target } from 'lucide-react';
import { GlassPanel } from '@/components/common/GlassPanel';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import { fadeUp } from '@/utils/motion';

export interface LandingSummaryStripProps {
  candidates: LandingCandidate[];
  isGenerating: boolean;
}

export function LandingSummaryStrip({ candidates, isGenerating }: LandingSummaryStripProps) {
  if (isGenerating || candidates.length === 0) return null;

  const primary = candidates[0];
  const avgIce =
    candidates.reduce((sum, c) => sum + c.iceProbability, 0) / candidates.length;
  const avgSuccess =
    candidates.reduce((sum, c) => sum + c.missionSuccessProbability, 0) / candidates.length;
  const lowRiskCount = candidates.filter((c) => c.riskLevel === 'low').length;

  const stats = [
    {
      icon: Target,
      label: 'Top Site Score',
      value: primary.compositeScore,
      suffix: '',
      color: 'text-ice',
    },
    {
      icon: Snowflake,
      label: 'Avg Ice Probability',
      value: avgIce,
      suffix: '%',
      color: 'text-ice',
    },
    {
      icon: Shield,
      label: 'Low-Risk Sites',
      value: lowRiskCount,
      suffix: ` / ${candidates.length}`,
      color: 'text-signal',
      decimals: 0,
    },
    {
      icon: BarChart3,
      label: 'Avg Success Rate',
      value: avgSuccess,
      suffix: '%',
      color: 'text-signal',
    },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-2 gap-2 lg:grid-cols-4"
    >
      {stats.map(({ icon: Icon, label, value, suffix, color, decimals = 1 }) => (
        <GlassPanel key={label} animate={false} className="px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-ice/10">
              <Icon className={`size-3.5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[9px] text-text-muted">{label}</p>
              <p className={`font-mono text-xs font-semibold ${color}`}>
                <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
              </p>
            </div>
          </div>
        </GlassPanel>
      ))}
    </motion.div>
  );
}
