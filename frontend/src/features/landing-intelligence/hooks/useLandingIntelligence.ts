import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateLandingCandidates } from '@/features/landing-intelligence/utils/generateCandidates';
import type { LandingCandidate } from '@/features/landing-intelligence/types';

export function useLandingIntelligence() {
  const [candidates, setCandidates] = useState<LandingCandidate[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);

  const generate = useCallback(() => {
    setIsGenerating(true);
    const timer = window.setTimeout(() => {
      const ranked = generateLandingCandidates();
      setCandidates(ranked);
      setSelectedId(ranked[0]?.id ?? '');
      setIsGenerating(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = generate();
    return cleanup;
  }, [generate]);

  const selected = useMemo(
    () => candidates.find((c) => c.id === selectedId) ?? candidates[0],
    [candidates, selectedId],
  );

  const selectCandidate = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return {
    candidates,
    selected,
    selectedId,
    isGenerating,
    selectCandidate,
    regenerate: generate,
  };
}
