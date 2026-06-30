import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { MISSION_STATISTICS } from '@/data/missionData';
import { cn } from '@/utils/cn';
import { fadeIn } from '@/utils/motion';

export function MissionStatistics() {
  return (
    <motion.div variants={fadeIn} className="flex h-full min-w-0 flex-col">
      <h3 className="mb-2 px-1 font-mono text-[10px] font-medium uppercase tracking-widest text-text-muted">
        Statistics
      </h3>

      <div className="grid flex-1 grid-cols-2 gap-2 lg:grid-cols-4">
        {MISSION_STATISTICS.map((stat, index) => {
          const chartData = stat.sparkline.map((v, i) => ({ i, v }));

          return (
            <motion.div
              key={stat.id}
              className="relative overflow-hidden rounded-lg border border-border-subtle bg-white/2 p-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              whileHover={{ borderColor: 'rgb(103 216 255 / 0.2)' }}
            >
              <p className="truncate text-[10px] text-text-muted">{stat.label}</p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="font-mono text-base font-semibold text-text-primary">
                  <AnimatedCounter
                    value={stat.value}
                    decimals={stat.unit === '%' ? 1 : 0}
                  />
                </span>
                <span className="font-mono text-[10px] text-text-muted">{stat.unit}</span>
              </div>

              {stat.trend !== 0 && (
                <span
                  className={cn(
                    'font-mono text-[9px]',
                    stat.trend > 0 ? 'text-signal' : 'text-danger',
                  )}
                >
                  {stat.trend > 0 ? '+' : ''}
                  {stat.trend}%
                </span>
              )}

              <div className="absolute bottom-0 right-0 h-8 w-16 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`grad-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#67d8ff" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#67d8ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#67d8ff"
                      strokeWidth={1.5}
                      fill={`url(#grad-${stat.id})`}
                      isAnimationActive
                      animationDuration={1200}
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
