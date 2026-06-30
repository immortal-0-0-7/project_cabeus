import { motion } from 'framer-motion';
import { Radar } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { GlassPanel } from '@/components/common/GlassPanel';
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
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp}>
        <Badge color="ice">Site Intelligence</Badge>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary">
              Landing Intelligence
            </h2>
            <p className="text-sm text-text-secondary">
              AI-ranked landing candidates · Multi-criteria scoring · South polar region
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-white/2 px-3 py-1.5">
            <Radar className="size-3.5 text-ice" />
            <span className="font-mono text-[10px] text-text-muted">
              {isGenerating ? 'SCANNING TERRAIN...' : `${candidates.length} CANDIDATES RANKED`}
            </span>
          </div>
        </div>
      </motion.div>

      <LandingSummaryStrip candidates={candidates} isGenerating={isGenerating} />

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_420px]">
        <motion.div variants={fadeUp} className="relative min-h-[360px]">
          <GlassPanel animate={false} className="flex h-full flex-col p-4">
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
              <div className="flex flex-1 items-center justify-center rounded-xl border border-border-subtle bg-space-deep">
                <p className="text-sm text-text-muted">Initializing lunar workspace...</p>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0">
          <GlassPanel animate={false} className="flex h-full flex-col p-4">
            <LandingCandidatesPanel
              candidates={candidates}
              selectedId={selectedId}
              isGenerating={isGenerating}
              onSelect={handleHotspotSelect}
              onRegenerate={regenerate}
            />
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
