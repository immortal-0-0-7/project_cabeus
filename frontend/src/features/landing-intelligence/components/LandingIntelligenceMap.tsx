import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Layers, MapPin, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { SOUTH_POLE_SAR_IMAGE, TARGET_REGION } from '@/data/missionData';
import { RISK_LABELS } from '@/features/landing-intelligence/constants';
import { formatCoordinates } from '@/features/landing-intelligence/utils/generateCandidates';
import type { LandingCandidate } from '@/features/landing-intelligence/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import { EASE_PREMIUM } from '@/utils/motion';

function siteToCoords(site: LandingCandidate): { x: number; y: number } {
  const x = ((site.lon + 180) / 360) * 100;
  const y = ((90 + site.lat) / 180) * 100;
  return { x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)) };
}

const rankColors = ['#34d399', '#67d8ff', '#4d8cff', '#6e5dff', '#94a3b8', '#64748b'];

export interface LandingIntelligenceMapProps {
  candidates: LandingCandidate[];
  selectedId: string;
  onSelect: (id: string) => void;
  explainPanelOpen?: boolean;
}

export function LandingIntelligenceMap({
  candidates,
  selectedId,
  onSelect,
  explainPanelOpen = false,
}: LandingIntelligenceMapProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.15);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const selected = candidates.find((c) => c.id === selectedId) ?? candidates[0];
  const hovered = candidates.find((c) => c.id === hoveredId);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [pan],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - dragStart.x) / zoom;
      const dy = (e.clientY - dragStart.y) / zoom;
      setPan({
        x: Math.max(-30, Math.min(30, dragStart.panX + dx)),
        y: Math.max(-30, Math.min(30, dragStart.panY + dy)),
      });
    },
    [isDragging, dragStart, zoom],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = () => {
    setZoom(1.15);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-full min-h-[320px] flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">South Polar Workspace</h3>
          <p className="text-[11px] text-text-muted">{TARGET_REGION}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            label={showHeatmap ? 'Hide heatmap' : 'Show heatmap'}
            onClick={() => setShowHeatmap((v) => !v)}
          >
            <Layers className="size-3.5" />
          </IconButton>
          <IconButton label="Zoom out" onClick={() => setZoom((z) => Math.max(0.9, z - 0.1))}>
            <ZoomOut className="size-3.5" />
          </IconButton>
          <span className="w-10 text-center font-mono text-[10px] text-text-muted">
            {(zoom * 100).toFixed(0)}%
          </span>
          <IconButton label="Zoom in" onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}>
            <ZoomIn className="size-3.5" />
          </IconButton>
          <IconButton label="Reset view" onClick={resetView}>
            <Maximize2 className="size-3.5" />
          </IconButton>
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          'relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border-subtle bg-space-deep',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ scale: zoom, x: pan.x, y: pan.y }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30 }}
        >
          <img
            src={SOUTH_POLE_SAR_IMAGE}
            alt="Chandrayaan-2 DFSAR south polar swath"
            className="absolute inset-0 size-full object-cover"
            draggable={false}
          />
          <svg viewBox="0 0 100 100" className="relative size-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="polarGlowLi" cx="50%" cy="95%" r="55%">
                <stop offset="0%" stopColor="#67d8ff" stopOpacity="0.12" />
                <stop offset="50%" stopColor="#4d8cff" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#02040a" stopOpacity="0.35" />
              </radialGradient>
              <radialGradient id="iceHeatLi1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#67d8ff" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#67d8ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="iceHeatLi2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4d8cff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4d8cff" stopOpacity="0" />
              </radialGradient>
              <filter id="markerGlow">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {showHeatmap && (
              <>
                <ellipse cx="50" cy="88" rx="30" ry="15" fill="url(#iceHeatLi1)" opacity="0.75" />
                <ellipse cx="22" cy="82" rx="18" ry="11" fill="url(#iceHeatLi2)" opacity="0.65" />
                <ellipse cx="78" cy="80" rx="14" ry="9" fill="url(#iceHeatLi2)" opacity="0.45" />
                <ellipse cx="62" cy="76" rx="10" ry="7" fill="url(#iceHeatLi1)" opacity="0.35" />
              </>
            )}

            {/* Terrain contour lines */}
            {[75, 80, 85, 90].map((y, i) => (
              <path
                key={y}
                d={`M ${8 + i * 2} ${y} Q ${30 + i * 5} ${y - 4} 50 ${y - 1} T ${92 - i} ${y + 1}`}
                fill="none"
                stroke="rgb(255 255 255 / 0.06)"
                strokeWidth="0.25"
              />
            ))}

            {/* Rank connection lines from #1 */}
            {candidates[0] &&
              candidates.slice(1).map((site) => {
                const from = siteToCoords(candidates[0]);
                const to = siteToCoords(site);
                const isActive = selectedId === site.id || selectedId === candidates[0].id;
                return (
                  <line
                    key={`line-${site.id}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#67d8ff"
                    strokeWidth="0.15"
                    strokeDasharray="1 1"
                    opacity={isActive ? 0.35 : 0.12}
                  />
                );
              })}

            {candidates.map((site) => {
              const { x, y } = siteToCoords(site);
              const isSelected = selectedId === site.id;
              const isHovered = hoveredId === site.id;
              const color = rankColors[Math.min(site.rank - 1, rankColors.length - 1)];

              return (
                <g
                  key={site.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(site.id);
                  }}
                  onMouseEnter={() => setHoveredId(site.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  filter={isSelected ? 'url(#markerGlow)' : undefined}
                >
                  {(isSelected || isHovered) && !reducedMotion && (
                    <motion.circle
                      r="3"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.25"
                      initial={{ r: 1.5, opacity: 0.9 }}
                      animate={{ r: 6, opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <circle
                    r={isSelected ? 2.2 : isHovered ? 1.8 : 1.4}
                    fill={color}
                    opacity={isSelected ? 1 : 0.75}
                    stroke={isSelected ? '#f4f7fa' : 'none'}
                    strokeWidth="0.2"
                  />
                  <text
                    y="-3.5"
                    textAnchor="middle"
                    fill="#f4f7fa"
                    fontSize="2.2"
                    fontFamily="JetBrains Mono, monospace"
                    opacity={isSelected || isHovered ? 1 : 0}
                  >
                    #{site.rank}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* HUD overlays */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border-subtle bg-space-panel px-2 py-1 backdrop-blur-sm">
          <Crosshair className="size-3 text-ice" />
          <span className="font-mono text-[9px] text-text-secondary">
            {explainPanelOpen ? 'XAI PANEL ACTIVE · CLICK HOTSPOT' : 'DFSAR L-BAND · DRAG TO PAN'}
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 flex gap-1.5">
          {candidates.slice(0, 4).map((site, i) => (
            <div
              key={site.id}
              className="flex items-center gap-1 rounded-md border border-border-subtle bg-space-panel px-1.5 py-0.5 backdrop-blur-sm"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: rankColors[Math.min(i, rankColors.length - 1)] }}
              />
              <span className="font-mono text-[8px] text-text-muted">#{site.rank}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {(hovered ?? selected) && !explainPanelOpen && (
            <motion.div
              key={(hovered ?? selected).id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE_PREMIUM }}
              className="pointer-events-none absolute bottom-3 right-3 max-w-[200px] rounded-lg border border-border-subtle bg-space-panel p-2.5 backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3 text-ice" />
                <span className="truncate text-[11px] font-medium text-text-primary">
                  {(hovered ?? selected).name}
                </span>
              </div>
              <p className="mt-1 font-mono text-[9px] text-text-muted">
                {formatCoordinates((hovered ?? selected).lat, (hovered ?? selected).lon)}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div>
                  <p className="text-[8px] text-text-muted">Score</p>
                  <p className="font-mono text-[10px] font-semibold text-ice">
                    <AnimatedCounter value={(hovered ?? selected).compositeScore} decimals={1} />
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-text-muted">Risk</p>
                  <p className="font-mono text-[10px] font-semibold text-text-secondary">
                    {RISK_LABELS[(hovered ?? selected).riskLevel]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selected && (
        <motion.div
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[
            { label: 'Landing Score', value: selected.compositeScore, suffix: '' },
            { label: 'Ice Prob.', value: selected.iceProbability, suffix: '%' },
            { label: 'Success', value: selected.missionSuccessProbability, suffix: '%' },
            { label: 'Yield', value: selected.expectedYield, suffix: ' L/m³', decimals: 2 },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border-subtle bg-space-panel px-2.5 py-2"
            >
              <p className="text-[10px] text-text-muted">{metric.label}</p>
              <p className="font-mono text-sm font-semibold text-text-primary">
                <AnimatedCounter
                  value={metric.value}
                  decimals={'decimals' in metric ? metric.decimals : 1}
                  suffix={metric.suffix}
                />
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
