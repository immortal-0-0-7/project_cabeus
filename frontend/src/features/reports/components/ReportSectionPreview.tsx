import type { ReactNode } from 'react';
import { Badge } from '@/components/common/Badge';
import { RISK_COLORS, RISK_LABELS } from '@/features/landing-intelligence/constants';
import { cn } from '@/utils/cn';
import type { MissionReportData, ReportSectionId } from '../types';
import { ReportCharts } from './ReportCharts';

interface ReportSectionPreviewProps {
  data: MissionReportData;
  section: ReportSectionId;
}

function MetricGrid({ items }: { items: { label: string; value: string; accent?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border-subtle bg-white/2 p-3"
          style={{ borderLeftColor: item.accent, borderLeftWidth: 2 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {item.label}
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-text-primary">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 flex items-center gap-2 font-semibold text-text-primary">
        <span className="inline-block h-4 w-0.5 rounded-full bg-ice" />
        {title}
      </h4>
      {children}
    </section>
  );
}

export function ReportSectionPreview({ data, section }: ReportSectionPreviewProps) {
  switch (section) {
    case 'summary':
      return (
        <div className="space-y-5">
          <p className="text-base font-medium text-text-primary">{data.summary.headline}</p>
          <MetricGrid
            items={[
              { label: 'Coverage', value: `${data.summary.coverageKm2} km²`, accent: '#4d8cff' },
              { label: 'Processing', value: `${data.summary.processingComplete}%`, accent: '#007AFF' },
              { label: 'Sites Ranked', value: `${data.summary.sitesRanked}`, accent: '#67d8ff' },
              { label: 'Risk Level', value: data.risk.riskLabel, accent: '#34d399' },
            ]}
          />
          <SectionBlock title="Overview">
            <p className="text-sm leading-relaxed text-text-secondary">{data.summary.overview}</p>
          </SectionBlock>
          <SectionBlock title="Primary Finding">
            <p className="text-sm leading-relaxed text-text-secondary">{data.summary.primaryFinding}</p>
          </SectionBlock>
          <div className="rounded-lg border border-border-subtle bg-white/2 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Pipeline Status</p>
            <p className="mt-1 text-sm text-text-primary">{data.summary.timelineStatus}</p>
          </div>
        </div>
      );

    case 'ice':
      return (
        <div className="space-y-5">
          <MetricGrid
            items={[
              { label: 'Detections', value: `${data.detectedIce.totalDetections}`, accent: '#4d8cff' },
              { label: 'High Confidence', value: `${data.detectedIce.highConfidenceCount}`, accent: '#34d399' },
              { label: 'Ice Probability', value: `${data.detectedIce.iceProbability.toFixed(1)}%`, accent: '#67d8ff' },
              { label: 'Penetration', value: `${data.detectedIce.penetrationDepthM} m`, accent: '#6e5dff' },
            ]}
          />
          <ReportCharts data={data} section="ice" />
          <SectionBlock title="Ice Deposits">
            <div className="overflow-hidden rounded-lg border border-border-subtle">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-white/4">
                    <th className="px-3 py-2 text-left font-medium text-text-muted">Deposit</th>
                    <th className="px-3 py-2 text-right font-medium text-text-muted">Yield</th>
                    <th className="px-3 py-2 text-right font-medium text-text-muted">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detectedIce.deposits.map((d) => (
                    <tr key={d.id} className="border-b border-border-subtle last:border-0">
                      <td className="px-3 py-2 text-text-primary">{d.label}</td>
                      <td className="px-3 py-2 text-right font-mono text-ice">{d.yieldKg.toFixed(2)} kg</td>
                      <td className="px-3 py-2 text-right font-mono text-mission">{d.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>
        </div>
      );

    case 'landing':
      return (
        <div className="space-y-5">
          <div className="rounded-xl border border-signal/20 bg-signal/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge color="signal">Primary Target</Badge>
                <h4 className="mt-2 font-display text-lg font-bold text-text-primary">
                  {data.landing.primary.name}
                </h4>
                <p className="mt-1 text-xs text-text-muted">
                  Rank #{data.landing.primary.rank} · {data.landing.primary.lat.toFixed(1)}°S
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-bold text-ice">
                  {data.landing.primary.compositeScore.toFixed(1)}
                </p>
                <p className="text-[10px] text-text-muted">Composite Score</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {data.landing.explainability.whySelected}
            </p>
          </div>
          <SectionBlock title="Site Rankings">
            <div className="overflow-hidden rounded-lg border border-border-subtle">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-white/4">
                    <th className="px-3 py-2 text-left font-medium text-text-muted">Site</th>
                    <th className="px-3 py-2 text-right font-medium text-text-muted">Score</th>
                    <th className="px-3 py-2 text-right font-medium text-text-muted">Ice %</th>
                    <th className="px-3 py-2 text-right font-medium text-text-muted">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {data.landing.candidates.map((c) => (
                    <tr key={c.id} className="border-b border-border-subtle last:border-0">
                      <td className="px-3 py-2 text-text-primary">{c.name}</td>
                      <td className="px-3 py-2 text-right font-mono text-ice">{c.compositeScore.toFixed(1)}</td>
                      <td className="px-3 py-2 text-right font-mono text-mission">{c.iceProbability.toFixed(1)}%</td>
                      <td className={cn('px-3 py-2 text-right font-mono', RISK_COLORS[c.riskLevel])}>
                        {c.risk.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>
        </div>
      );

    case 'science':
      return (
        <div className="space-y-5">
          <SectionBlock title="Scientific Reasoning">
            <p className="text-sm leading-relaxed text-text-secondary">{data.science.reasoning}</p>
          </SectionBlock>
          <MetricGrid
            items={[
              { label: 'Permittivity εr', value: data.science.permittivity.toFixed(2), accent: '#67d8ff' },
              { label: 'Ice Concentration', value: `${data.science.iceConcentration}%`, accent: '#4d8cff' },
              { label: 'Model', value: data.science.modelVersion, accent: '#6e5dff' },
              { label: 'Inference', value: `${data.science.inferenceTimeMs} ms`, accent: '#34d399' },
            ]}
          />
          <SectionBlock title="Processing Metrics">
            <div className="space-y-3">
              {data.science.processingMetrics.map((m) => (
                <div key={m.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-text-secondary">{m.label}</span>
                    <span className="font-mono text-ice">{m.value}{m.max === 100 ? '%' : ''}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-mission to-ice"
                      style={{ width: `${(m.value / m.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>
          <SectionBlock title="Radar Signature">
            <p className="font-mono text-xs text-text-secondary">{data.science.radarSignature}</p>
          </SectionBlock>
        </div>
      );

    case 'yield':
      return (
        <div className="space-y-5">
          <MetricGrid
            items={[
              { label: 'Primary Yield', value: `${data.yield.primaryYieldLm3} L/m³`, accent: '#67d8ff' },
              { label: 'Rover Total', value: `${data.yield.totalProjectedKg.toFixed(2)} kg`, accent: '#4d8cff' },
              { label: 'Duration', value: `${data.yield.missionDurationSols} sols`, accent: '#6e5dff' },
              { label: 'Extraction', value: `${data.yield.extractionPotential.toFixed(1)}%`, accent: '#34d399' },
            ]}
          />
          <ReportCharts data={data} section="yield" />
        </div>
      );

    case 'risk':
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex size-20 flex-col items-center justify-center rounded-full border-4 border-signal/30">
              <span className="font-mono text-xl font-bold text-signal">
                {(100 - data.risk.overallRisk).toFixed(0)}%
              </span>
              <span className="text-[9px] text-text-muted">Safety</span>
            </div>
            <div>
              <Badge color={data.risk.riskLevel === 'low' ? 'signal' : data.risk.riskLevel === 'high' ? 'danger' : 'warning'}>
                {RISK_LABELS[data.risk.riskLevel]} Risk
              </Badge>
              <p className="mt-2 text-sm text-text-secondary">
                Overall risk score {data.risk.overallRisk.toFixed(1)}% for primary landing site.
              </p>
            </div>
          </div>
          <ReportCharts data={data} section="risk" />
        </div>
      );

    case 'confidence':
      return (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-xl border border-border-subtle bg-white/2 p-4">
              <span className="font-mono text-3xl font-bold text-signal">{data.confidence.overall}%</span>
              <span className="mt-1 text-xs text-text-muted">Overall Confidence</span>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border-subtle bg-white/2 p-4">
              <span className="font-mono text-3xl font-bold text-ice">{data.confidence.modelConfidence}%</span>
              <span className="mt-1 text-xs text-text-muted">Model Confidence</span>
            </div>
          </div>
          <SectionBlock title="Confidence Factors">
            <div className="space-y-3">
              {data.confidence.factors.map((f) => (
                <div key={f.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-text-secondary">{f.label}</span>
                    <span className="font-mono text-ice">{f.value.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full bg-ice/80"
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>
          <ReportCharts data={data} section="confidence" />
        </div>
      );

    case 'recommendations':
      return (
        <div className="space-y-3">
          {data.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-border-subtle bg-white/2 p-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ice/15 font-mono text-xs font-bold text-ice">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-text-secondary">{rec}</p>
            </div>
          ))}
          <div className="mt-4 rounded-xl border border-signal/20 bg-signal/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Mission Decision</p>
            <p className="mt-2 text-sm text-text-primary">
              Proceed with {data.landing.primary.name} as primary landing target. All confidence
              thresholds met.
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
