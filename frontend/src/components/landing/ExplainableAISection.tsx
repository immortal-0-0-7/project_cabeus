import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, SectionHeading } from '@/components/motion';
import { ExplainabilityPanel } from '@/features/explainability/components/ExplainabilityPanel';
import { useExplainability } from '@/features/explainability/hooks/useExplainability';
import { LandingCandidateCard } from '@/features/landing-intelligence/components/LandingCandidateCard';
import { useLandingIntelligence } from '@/features/landing-intelligence/hooks/useLandingIntelligence';
import { ROUTES } from '@/routes/paths';

export function ExplainableAISection() {
  const { candidates, selected, selectedId, selectCandidate } = useLandingIntelligence();
  const { isOpen, isAnalyzing, explainability, open, close } = useExplainability(selected);
  const [panelCandidate, setPanelCandidate] = useState(selected);

  const handleSelect = (id: string) => {
    selectCandidate(id);
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setPanelCandidate(candidate);
      open();
    }
  };

  return (
    <LandingSectionShell id="explainability" className="px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="05 — Explainable AI"
          title="Transparent Detection"
          subtitle="Every AI-selected hotspot opens with supporting evidence, confidence scoring, and scientific reasoning."
        />

        <FadeIn className="mt-16 space-y-3" delay={0.1}>
          {candidates.slice(0, 4).map((candidate, i) => (
            <div key={candidate.id} className="border border-border-subtle bg-space-panel px-2 transition-colors duration-500 hover:border-white/10">
              <LandingCandidateCard
                candidate={candidate}
                selected={candidate.id === selectedId}
                index={i}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </FadeIn>

        <FadeIn className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center" delay={0.15}>
          <Button
            size="lg"
            onClick={() => {
              setPanelCandidate(selected ?? candidates[0]);
              open();
            }}
          >
            Analyze Selected Hotspot
          </Button>
          <Link to={ROUTES.landingIntelligence}>
            <Button variant="ghost" size="lg">
              Full Explainability Suite
            </Button>
          </Link>
        </FadeIn>

        <div className="relative mt-16">
          <ExplainabilityPanel
            candidate={panelCandidate}
            explainability={explainability}
            isOpen={isOpen}
            isAnalyzing={isAnalyzing}
            onClose={close}
          />
        </div>
      </div>
    </LandingSectionShell>
  );
}
