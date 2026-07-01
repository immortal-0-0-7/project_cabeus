import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { ExplainabilityPanel, useExplainability } from '@/features/explainability';
import {
  LandingCandidatesPanel,
  LandingIntelligenceMap,
  LandingSummaryStrip,
  useLandingIntelligence,
} from '@/features/landing-intelligence';
import { fadeUp, staggerContainer } from '@/utils/motion';

export function LandingIntelligenceWorkspace() {
  const {
    candidates,
    selected,
    selectedId,
    isGenerating,
    selectCandidate,
    regenerate,
  } = useLandingIntelligence();

  const {
    isOpen: explainOpen,
    isAnalyzing,
    explainability,
    open: openExplainability,
    close: closeExplainability,
  } = useExplainability(selected);

  const handleHotspotSelect = (id: string) => {
    selectCandidate(id);
    openExplainability();
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-10">
        <Badge color="ice">Site Intelligence</Badge>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
          Landing Intelligence
        </h2>
        <p className="mt-3 text-lg font-light text-text-secondary">
          AI-ranked landing candidates · South polar region
        </p>
        <p className="text-label mt-2">
          {isGenerating ? 'Scanning terrain…' : `${candidates.length} candidates ranked`}
        </p>
      </motion.div>

      <LandingSummaryStrip candidates={candidates} isGenerating={isGenerating} />

      <div className="grid min-h-0 flex-1 gap-12 border-t border-border-subtle pt-10 xl:grid-cols-[1fr_380px]">
        <motion.div variants={fadeUp} className="relative min-h-[360px]">
          {!isGenerating && candidates.length > 0 ? (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <LandingIntelligenceMap
                candidates={candidates}
                selectedId={selectedId}
                onSelect={handleHotspotSelect}
                explainPanelOpen={explainOpen}
              />
              <ExplainabilityPanel
                candidate={selected}
                explainability={explainability}
                isOpen={explainOpen}
                isAnalyzing={isAnalyzing}
                onClose={closeExplainability}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-20">
              <p className="text-label">Initializing lunar workspace…</p>
            </div>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0 border-t border-border-subtle pt-8 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10">
          <LandingCandidatesPanel
            candidates={candidates}
            selectedId={selectedId}
            isGenerating={isGenerating}
            onSelect={handleHotspotSelect}
            onRegenerate={regenerate}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
