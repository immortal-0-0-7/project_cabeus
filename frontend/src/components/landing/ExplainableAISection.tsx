import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
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
    <section id="explainability" className="relative px-8 py-32 md:px-12 md:py-48 lg:px-16">
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          label="05 — Explainable AI"
          title="Transparent Detection"
          subtitle="Every AI-selected hotspot opens with supporting evidence, confidence scoring, and scientific reasoning."
        />

        <FadeIn className="mt-16 divide-y divide-border-subtle" delay={0.1}>
          {candidates.slice(0, 4).map((candidate, i) => (
            <div key={candidate.id} className="py-2">
              <LandingCandidateCard
                candidate={candidate}
                selected={candidate.id === selectedId}
                index={i}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </FadeIn>

        <FadeIn className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center" delay={0.15}>
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
            <Button variant="ghost" size="lg" rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}>
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
    </section>
  );
}
