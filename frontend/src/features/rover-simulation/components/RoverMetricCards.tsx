import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { MISSION_METRICS } from '../constants';
import type { MetricHistory, RoverMetrics } from '../types';

interface MetricSparklineProps {
  data: number[];
  color: string;
}

function MetricSparkline({ data, color }: MetricSparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));

  return (
    <div className="h-6 w-full opacity-50">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1}
            fill={`url(#spark-${color})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RoverMetricCardsProps {
  metrics: RoverMetrics;
  history: MetricHistory;
  isActive: boolean;
}

export function RoverMetricCards({ metrics, history }: RoverMetricCardsProps) {
  return (
    <div className="space-y-0 divide-y divide-border-subtle">
      {MISSION_METRICS.map((def, index) => {
        const value = metrics[def.id];
        const sparkData = history[def.id];

        return (
          <motion.div
            key={def.id}
            className="py-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.8 }}
          >
            <p className="text-label">{def.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-stat-massive text-3xl text-text-primary">
                <AnimatedCounter
                  value={value}
                  decimals={
                    def.id === 'iceCollected'
                      ? 2
                      : def.id === 'distance' || def.id === 'energy'
                        ? 0
                        : 1
                  }
                />
              </span>
              <span className="font-mono text-xs text-text-muted">{def.unit}</span>
            </div>
            <div className="mt-3">
              <MetricSparkline data={sparkData} color="#6b8fc7" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
