import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CONFIDENCE_DISTRIBUTION, SPECTRAL_DATA, ANALYSIS_PALETTE } from '../constants';
import { GlassPanel } from '@/components/common/GlassPanel';
import { EASE_PREMIUM } from '@/utils/motion';

const tooltipStyle = {
  background: 'rgb(10 15 30 / 0.92)',
  border: '1px solid rgb(255 255 255 / 0.1)',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'JetBrains Mono, monospace',
  color: '#f4f7fa',
};

export function SpectralChart() {
  return (
    <GlassPanel animate={false} className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">L-Band Spectral Response</h4>
        <span className="font-mono text-[11px] text-text-muted">DFSAR · 1.25 GHz</span>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SPECTRAL_DATA} barGap={2}>
            <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
            <XAxis
              dataKey="band"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgb(255 255 255 / 0.04)' }}
            />
            <Bar dataKey="intensity" name="Backscatter" radius={[3, 3, 0, 0]} animationDuration={1000}>
              {SPECTRAL_DATA.map((_, i) => (
                <Cell key={i} fill="rgb(251 146 60 / 0.55)" />
              ))}
            </Bar>
            <Bar dataKey="ice" name="Ice Signal" radius={[3, 3, 0, 0]} animationDuration={1200}>
              {SPECTRAL_DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={`rgb(251 191 36 / ${0.35 + i * 0.08})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-mission/50" />
          <span className="text-[11px] text-text-muted">Backscatter</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-ice/60" />
          <span className="text-[11px] text-text-muted">Ice Signal</span>
        </div>
      </div>
    </GlassPanel>
  );
}

export function ConfidenceDistributionChart() {
  return (
    <GlassPanel animate={false} className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">Confidence Distribution</h4>
        <span className="font-mono text-[11px] text-mission">μ = 72.4%</span>
      </div>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CONFIDENCE_DISTRIBUTION}>
            <defs>
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ANALYSIS_PALETTE.orange} stopOpacity={0.4} />
                <stop offset="100%" stopColor={ANALYSIS_PALETTE.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={ANALYSIS_PALETTE.orange}
              strokeWidth={2}
              fill="url(#confGrad)"
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}

interface StatSparklineProps {
  data: number[];
  color: string;
  delay?: number;
}

export function StatSparkline({ data, color, delay = 0 }: StatSparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <motion.div
      className="h-10 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: EASE_PREMIUM }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace('#', '')})`}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
