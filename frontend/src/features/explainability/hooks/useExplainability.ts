import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import type { SiteExplainability } from '@/features/explainability/types';
import { generateExplainability } from '@/features/explainability/utils/generateExplainability';

export function useExplainability(candidate: LandingCandidate | undefined) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<SiteExplainability | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsAnalyzing(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !candidate) return;

    setData(null);
    setIsAnalyzing(true);

    const timer = window.setTimeout(() => {
      setData(generateExplainability(candidate));
      setIsAnalyzing(false);
    }, 680);

    return () => window.clearTimeout(timer);
  }, [isOpen, candidate?.id, candidate]);

  const explainability = useMemo(
    () => (candidate && !isAnalyzing ? data : null),
    [candidate, data, isAnalyzing],
  );

  return {
    isOpen,
    isAnalyzing,
    explainability,
    open,
    close,
  };
}
