import { motion } from 'framer-motion';
import {
  Battery,
  FlaskConical,
  Route,
  Shield,
  Snowflake,
  Target,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { MISSION_METRICS } from '../constants';
import type { MetricHistory, RoverMetrics } from '../types';
import { cn } from '@/utils/cn';

const iconMap: Record<string, LucideIcon> = {
  battery: Battery,
  route: Route,
  zap: Zap,
  snowflake: Snowflake,
  target: Target,
  shield: Shield,
  microscope: FlaskConical,
};

interface MetricSparklineProps {
  data: number[];
  color: string;
}

function MetricSparkline({ data, color }: MetricSparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
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

export function RoverMetricCards({ metrics, history, isActive }: RoverMetricCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {MISSION_METRICS.map((def, index) => {
        const Icon = iconMap[def.icon] ?? Target;
        const value = metrics[def.id];
        const sparkData = history[def.id];
        const fillPct = Math.min(100, (value / def.max) * 100);
        const isLow = def.id === 'battery' && value < 25;

        return (
          <motion.div
            key={def.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border bg-white/2 p-3.5 transition-colors duration-300',
              isActive ? 'border-ice/20' : 'border-border-subtle',
              isLow && 'border-warning/30',
            )}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.45 }}
            whileHover={{ borderColor: 'rgb(103 216 255 / 0.3)' }}
          >
            <div
              className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25"
              style={{ background: def.color }}
            />

            <div className="relative flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-7 items-center justify-center rounded-lg border border-border-subtle"
                  style={{ background: `${def.color}12` }}
                >
                  <Icon className="size-3.5" style={{ color: def.color }} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    {def.label}
                  </p>
                  <p className="text-[8px] text-text-muted/70">{def.description}</p>
                </div>
              </div>
              {isActive && (
                <motion.span
                  className="size-1.5 rounded-full"
                  style={{ background: def.color, boxShadow: `0 0 8px ${def.color}` }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              )}
            </div>

            <div className="relative mt-3 flex items-baseline gap-1">
              <span
                className="font-mono text-2xl font-bold tabular-nums"
                style={{ color: def.color }}
              >
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
              <span className="font-mono text-[10px] text-text-muted">{def.unit}</span>
            </div>

            <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-white/6">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${def.color}55, ${def.color})`,
                  boxShadow: isActive ? `0 0 8px ${def.color}44` : undefined,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="relative mt-2 opacity-70 transition-opacity group-hover:opacity-100">
              <MetricSparkline data={sparkData} color={def.color} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
