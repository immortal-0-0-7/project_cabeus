import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import type { AnalysisLayerId } from '../types';
import { SyntheticLayerView } from './SyntheticLayerView';
import { cn } from '@/utils/cn';

interface LayerCompareSliderProps {
  beforeLayer: AnalysisLayerId;
  afterLayer: AnalysisLayerId;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}

export function LayerCompareSlider({
  beforeLayer,
  afterLayer,
  beforeLabel,
  afterLabel,
  className,
}: LayerCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(8, Math.min(92, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border-subtle shadow-panel',
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute inset-0">
        <SyntheticLayerView layer={afterLayer} />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <SyntheticLayerView layer={beforeLayer} />
      </div>

      <div
        className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white/80 shadow-[0_0_12px_rgb(103_216_255/0.6)]"
        style={{ left: `${position}%` }}
      >
        <motion.button
          type="button"
          className={cn(
            'absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/20 bg-space-panel/90 shadow-lg backdrop-blur-md transition-shadow',
            isDragging && 'shadow-glow-ice border-ice/40',
          )}
          onPointerDown={handlePointerDown}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Drag to compare layers"
        >
          <GripVertical className="size-4 text-ice" />
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3">
        <motion.span
          className="rounded-md border border-border-subtle bg-black/50 px-2 py-1 font-mono text-[10px] text-text-secondary backdrop-blur-sm"
          animate={{ opacity: position > 20 ? 1 : 0.4 }}
        >
          {beforeLabel}
        </motion.span>
        <motion.span
          className="rounded-md border border-border-subtle bg-black/50 px-2 py-1 font-mono text-[10px] text-text-secondary backdrop-blur-sm"
          animate={{ opacity: position < 80 ? 1 : 0.4 }}
        >
          {afterLabel}
        </motion.span>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border-subtle bg-black/40 px-3 py-1 font-mono text-[9px] text-text-muted backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
        Drag to compare
      </div>
    </div>
  );
}
