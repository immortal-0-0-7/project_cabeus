import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MissionReportData, ReportSectionId } from '../types';

const tooltipStyle = {
  background: 'rgb(10 15 30 / 0.92)',
  border: '1px solid rgb(255 255 255 / 0.1)',
  borderRadius: '8px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono, monospace',
  color: '#f4f7fa',
};

interface ReportChartsProps {
  data: MissionReportData;
  section: ReportSectionId;
}

export function ReportCharts({ data, section }: ReportChartsProps) {
  if (section === 'ice' || section === 'confidence') {
    if (section === 'ice') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <ChartPanel title="L-Band Spectral Response" subtitle="DFSAR · 1.25 GHz">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data.detectedIce.spectralData} barGap={2}>
                <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
                <XAxis dataKey="band" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
                <Bar dataKey="intensity" name="Backscatter" radius={[3, 3, 0, 0]}>
                  {data.detectedIce.spectralData.map((_, i) => (
                    <Cell key={i} fill="rgb(77 140 255 / 0.5)" />
                  ))}
                </Bar>
                <Bar dataKey="ice" name="Ice Signal" radius={[3, 3, 0, 0]}>
                  {data.detectedIce.spectralData.map((_, i) => (
                    <Cell key={i} fill={`rgb(103 216 255 / ${0.3 + i * 0.08})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <ChartPanel title="Confidence Distribution" subtitle="Detection buckets">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data.detectedIce.confidenceDistribution}>
                <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {data.detectedIce.confidenceDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </div>
      );
    }

    return (
      <ChartPanel title="Confidence Distribution" subtitle="Model output buckets">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.confidence.distribution}>
            <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
            <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={24} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {data.confidence.distribution.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    );
  }

  if (section === 'yield') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <ChartPanel title="Deposit Yields" subtitle="Rover collection targets">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data.yield.depositYields}>
              <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
              <Bar dataKey="yieldKg" name="Yield (kg)" fill="#67d8ff" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Site Yield Comparison" subtitle="L/m³ projected">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data.yield.siteComparison}>
              <CartesianGrid stroke="rgb(255 255 255 / 0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
              <Bar dataKey="expectedYield" name="Yield (L/m³)" radius={[3, 3, 0, 0]}>
                {data.yield.siteComparison.map((s, i) => (
                  <Cell key={i} fill={s.status === 'primary' ? '#34d399' : '#4d8cff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    );
  }

  if (section === 'risk') {
    return (
      <ChartPanel title="Risk Factors" subtitle="Primary site assessment">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data.risk.factors} layout="vertical">
            <CartesianGrid stroke="rgb(255 255 255 / 0.04)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgb(255 255 255 / 0.04)' }} />
            <Bar dataKey="score" name="Risk Score" fill="#fbbf24" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    );
  }

  return null;
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-space-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-primary">{title}</h4>
        <span className="font-mono text-[9px] text-text-muted">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}
