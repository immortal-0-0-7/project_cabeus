import { motion } from 'framer-motion';
import { Loader2, MapPin, RefreshCw, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { LandingCandidateCard } from '@/features/landing-intelligence/components/LandingCandidateCard';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import { fadeUp } from '@/utils/motion';

export interface LandingCandidatesPanelProps {
  candidates: LandingCandidate[];
  selectedId: string;
  isGenerating: boolean;
  onSelect: (id: string) => void;
  onRegenerate: () => void;
}

export function LandingCandidatesPanel({
  candidates,
  selectedId,
  isGenerating,
  onSelect,
  onRegenerate,
}: LandingCandidatesPanelProps) {
  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-ice" />
          <h3 className="text-sm font-semibold text-text-primary">Ranked Candidates</h3>
          <Badge color="signal">{candidates.length} sites</Badge>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRegenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {isGenerating ? 'Analyzing...' : 'Regenerate'}
        </Button>
      </div>

      {isGenerating ? (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-border-subtle bg-white/2 py-16"
        >
          <div className="relative">
            <MapPin className="size-8 text-ice/40" />
            <motion.div
              className="absolute inset-0 rounded-full border border-ice/30"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text-primary">Generating landing candidates</p>
            <p className="mt-1 text-xs text-text-muted">
              Multi-criteria scoring · Terrain · Ice · Risk · ISRU yield
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {candidates.map((candidate, index) => (
            <LandingCandidateCard
              key={candidate.id}
              candidate={candidate}
              selected={selectedId === candidate.id}
              index={index}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
