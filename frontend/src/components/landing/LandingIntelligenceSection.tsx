import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, SectionHeading } from '@/components/motion';
import { LandingCandidateCard } from '@/features/landing-intelligence/components/LandingCandidateCard';
import { LandingIntelligenceMap } from '@/features/landing-intelligence/components/LandingIntelligenceMap';
import { useLandingIntelligence } from '@/features/landing-intelligence/hooks/useLandingIntelligence';
import { ROUTES } from '@/routes/paths';

export function LandingIntelligenceSection() {
  const { candidates, selected, selectedId, isGenerating, selectCandidate } = useLandingIntelligence();

  return (
    <LandingSectionShell
      id="landing"
      className="border-t border-border-subtle px-8 py-32 md:px-12 md:py-48 lg:px-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="04 — Landing Intelligence"
          title="Site Selection"
          subtitle="Ranked landing candidates — ice probability, terrain stability, risk, and scientific value."
        />

        <FadeIn className="mt-16" delay={0.1}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-h-[420px] overflow-hidden border border-border-subtle">
              {isGenerating ? (
                <div className="flex h-full min-h-[420px] items-center justify-center">
                  <p className="text-label">Computing landing candidates…</p>
                </div>
              ) : (
                <LandingIntelligenceMap
                  candidates={candidates}
                  selectedId={selectedId}
                  onSelect={selectCandidate}
                />
              )}
            </div>

            <div className="space-y-3">
              {isGenerating
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse border border-border-subtle bg-space-panel" />
                  ))
                : candidates.slice(0, 4).map((candidate, i) => (
                    <div key={candidate.id} className="border border-border-subtle bg-space-panel px-2 transition-colors duration-500 hover:border-white/10">
                      <LandingCandidateCard
                        candidate={candidate}
                        selected={candidate.id === selectedId}
                        index={i}
                        onSelect={selectCandidate}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </FadeIn>

        {selected && !isGenerating && (
          <FadeIn className="mt-16" delay={0.15}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border-subtle pt-10 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: 'Ice Probability', value: `${selected.iceProbability}%` },
                { label: 'Terrain Stability', value: `${selected.terrainStability}%` },
                { label: 'Risk', value: `${selected.risk}%` },
                { label: 'Scientific Value', value: `${selected.scientificValue}%` },
                { label: 'Expected Yield', value: `${selected.expectedYield} kg` },
                { label: 'Mission Duration', value: `${selected.missionDurationSols} sols` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-label">{item.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn className="mt-16 flex justify-start" delay={0.2}>
          <Link to={ROUTES.landingIntelligence}>
            <Button size="lg">
              Open Landing Intelligence
            </Button>
          </Link>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
