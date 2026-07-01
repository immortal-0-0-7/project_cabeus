import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, Magnet, SectionHeading, TiltCard } from '@/components/motion';
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

        <div className="landing-divider-glow mx-auto mt-12 w-48" />

        <FadeIn className="mt-16" delay={0.1}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <TiltCard className="min-h-[420px] overflow-hidden rounded-xl">
              <div className="landing-glass landing-glass-hover h-full min-h-[420px] overflow-hidden">
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
            </TiltCard>

            <div className="space-y-4">
              {isGenerating
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="landing-glass h-28 animate-pulse rounded-xl" />
                  ))
                : candidates.slice(0, 4).map((candidate, i) => (
                    <TiltCard key={candidate.id}>
                      <div className="landing-glass landing-glass-hover rounded-xl px-2">
                        <LandingCandidateCard
                          candidate={candidate}
                          selected={candidate.id === selectedId}
                          index={i}
                          onSelect={selectCandidate}
                        />
                      </div>
                    </TiltCard>
                  ))}
            </div>
          </div>
        </FadeIn>

        {selected && !isGenerating && (
          <FadeIn className="mt-16" delay={0.15}>
            <div className="landing-glass grid grid-cols-2 gap-8 rounded-xl p-8 sm:grid-cols-3 lg:grid-cols-6">
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
                  <p className="mt-2 font-display text-2xl font-medium tracking-tight text-gradient-ice">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeIn className="mt-16 flex justify-center" delay={0.2}>
          <Magnet>
            <Link to={ROUTES.landingIntelligence}>
              <Button size="lg" rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}>
                Open Landing Intelligence
              </Button>
            </Link>
          </Magnet>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
