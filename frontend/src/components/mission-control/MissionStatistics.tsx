import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { MISSION_STATISTICS } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export function MissionStatistics() {
  return (
    <motion.div variants={fadeIn} className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden px-1">
      <h3 className="text-label mb-5 shrink-0">Statistics</h3>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-6 gap-y-4 overflow-y-auto lg:grid-cols-2">
        {MISSION_STATISTICS.map((stat, index) => {
          const chartData = stat.sparkline.map((v, i) => ({ i, v }));

          return (
            <motion.div
              key={stat.id}
              className="relative min-w-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.8 }}
            >
              <p className="text-label truncate">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-stat-massive text-3xl text-text-primary">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.unit === '%' ? 1 : 0}
                  />
                </span>
                <span className="font-mono text-sm text-text-muted">{stat.unit}</span>
              </div>

              {stat.trend !== 0 && (
                <span
                  className={cn(
                    'mt-1 block font-mono text-xs',
                    stat.trend > 0 ? 'text-signal' : 'text-danger',
                  )}
                >
                  {stat.trend > 0 ? '+' : ''}
                  {stat.trend}%
                </span>
              )}

              <div className="absolute bottom-0 right-0 h-6 w-14 opacity-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#F97316"
                      strokeWidth={1}
                      fill={`url(#grad-${stat.id})`}
                      isAnimationActive
                      animationDuration={1600}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
