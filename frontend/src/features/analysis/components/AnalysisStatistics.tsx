import { motion } from 'framer-motion';
import { ANALYSIS_STATISTICS } from '../constants';
import { StatSparkline } from './AnalysisCharts';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';

export function AnalysisStatistics() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ANALYSIS_STATISTICS.map((stat, index) => (
        <Card
          key={stat.id}
          padding="sm"
          glow="ice"
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, duration: 0.4 }}
        >
          <div
            className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full opacity-20 blur-2xl"
            style={{ background: stat.color }}
          />
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {stat.label}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold text-text-primary">
              <AnimatedCounter
                value={stat.value}
                decimals={stat.unit === '%' || stat.unit === 'm' ? 1 : 0}
              />
            </span>
            <span className="font-mono text-[10px] text-text-muted">{stat.unit}</span>
          </div>
          {stat.trend !== 0 && (
            <span
              className={cn(
                'mt-0.5 inline-block font-mono text-[9px]',
                stat.trend > 0 ? 'text-signal' : 'text-danger',
              )}
            >
              {stat.trend > 0 ? '+' : ''}
              {stat.trend}%
            </span>
          )}
          <div className="mt-2">
            <StatSparkline data={stat.sparkline} color={stat.color} delay={index * 0.08} />
          </div>
        </Card>
      ))}
    </div>
  );
}

interface ProcessingMetricsProps {
  delay?: number;
}

export function ProcessingMetrics({ delay = 0 }: ProcessingMetricsProps) {
  const metrics = [
    { label: 'Ice Signature', value: 87.4, max: 100, color: '#67d8ff' },
    { label: 'Permittivity εr', value: 3.2, max: 10, color: '#6e5dff' },
    { label: 'Penetration Depth', value: 4.8, max: 10, color: '#4d8cff' },
    { label: 'Terrain Stability', value: 91.8, max: 100, color: '#34d399' },
  ];

  return (
    <div className="space-y-3">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.06, duration: 0.35 }}
        >
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted">{metric.label}</span>
            <span className="font-mono font-medium" style={{ color: metric.color }}>
              <AnimatedCounter value={metric.value} decimals={1} />
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/6">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${metric.color}66, ${metric.color})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(metric.value / metric.max) * 100}%` }}
              transition={{ duration: 0.8, delay: delay + i * 0.08 + 0.2 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
