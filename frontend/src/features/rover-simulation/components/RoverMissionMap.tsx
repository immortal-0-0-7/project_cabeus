import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Crosshair,
  Flag,
  MapPin,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import type { IceDeposit, MapPoint, SimulationPhase } from '../types';

interface RoverMissionMapProps {
  roverPosition: MapPoint | null;
  path: MapPoint[];
  pathProgress: number;
  heading: number;
  iceDeposits: IceDeposit[];
  phase: SimulationPhase;
  isPlacing: boolean;
  onPlace: (point: MapPoint) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

function RoverIcon({ heading, active }: { heading: number; active: boolean }) {
  return (
    <g transform={`rotate(${heading + 90})`}>
      <motion.g
        animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
      >
        <rect x="-2.5" y="-1.8" width="5" height="3.6" rx="0.6" fill="#67d8ff" opacity="0.9" />
        <rect x="-1.8" y="-1.2" width="3.6" height="2.4" rx="0.4" fill="#050814" />
        <circle cx="-1.8" cy="2" r="0.9" fill="#94a3b8" />
        <circle cx="1.8" cy="2" r="0.9" fill="#94a3b8" />
        <rect x="-0.4" y="-3.2" width="0.8" height="1.6" rx="0.2" fill="#34d399" />
      </motion.g>
      {active && (
        <motion.circle
          r="4"
          fill="none"
          stroke="#67d8ff"
          strokeWidth="0.2"
          initial={{ r: 2, opacity: 0.8 }}
          animate={{ r: 7, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </g>
  );
}

export function RoverMissionMap({
  roverPosition,
  path,
  pathProgress,
  heading,
  iceDeposits,
  phase,
  isPlacing,
  onPlace,
  onStart,
  onPause,
  onResume,
  onReset,
}: RoverMissionMapProps) {
  const reducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1.12);
  const [cursorPoint, setCursorPoint] = useState<MapPoint | null>(null);

  const handleMapClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isPlacing || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (x < 5 || x > 95 || y < 5 || y > 95) return;
      onPlace({ x, y });
    },
    [isPlacing, onPlace],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isPlacing || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      setCursorPoint({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [isPlacing],
  );

  const pathD =
    path.length > 1
      ? path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      : '';

  const traveledD =
    path.length > 1 && pathProgress > 0
      ? (() => {
          const segments = path.length - 1;
          const scaled = pathProgress * segments;
          const idx = Math.min(Math.floor(scaled), segments - 1);
          const t = scaled - idx;
          const pts = path.slice(0, idx + 1);
          if (t > 0 && idx < segments) {
            const from = path[idx];
            const to = path[idx + 1];
            pts.push({
              x: from.x + (to.x - from.x) * t,
              y: from.y + (to.y - from.y) * t,
            });
          }
          return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        })()
      : '';

  const isRunning = phase === 'running';
  const canStart = phase === 'placed';
  const canResume = phase === 'paused';

  return (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Traverse Workspace</h3>
          <p className="text-[11px] text-text-muted">
            {isPlacing
              ? 'Click terrain to deploy Pragyan rover'
              : 'Shackleton Rim Alpha · Virtual mission path'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Zoom out" onClick={() => setZoom((z) => Math.max(0.85, z - 0.1))}>
            <ZoomOut className="size-3.5" />
          </IconButton>
          <span className="w-10 text-center font-mono text-[10px] text-text-muted">
            {(zoom * 100).toFixed(0)}%
          </span>
          <IconButton label="Zoom in" onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}>
            <ZoomIn className="size-3.5" />
          </IconButton>
          <IconButton label="Reset view" onClick={() => setZoom(1.12)}>
            <Maximize2 className="size-3.5" />
          </IconButton>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border-subtle bg-space-deep">
        <div className="absolute inset-0 grid-mission opacity-35" />
        <div className="absolute inset-0 noise-overlay opacity-25" />

        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ scale: zoom }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30 }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className={cn('size-full', isPlacing ? 'cursor-crosshair' : 'cursor-default')}
            preserveAspectRatio="xMidYMid slice"
            onClick={handleMapClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCursorPoint(null)}
          >
            <defs>
              <radialGradient id="roverPolarGlow" cx="50%" cy="85%" r="50%">
                <stop offset="0%" stopColor="#67d8ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="iceDepositGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4d8cff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4d8cff" stopOpacity="0" />
              </radialGradient>
              <filter id="roverGlow">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="100" height="100" fill="url(#roverPolarGlow)" />

            {[72, 78, 84, 90].map((y, i) => (
              <path
                key={y}
                d={`M ${6 + i} ${y} Q ${28 + i * 4} ${y - 3} 50 ${y - 1} T ${94 - i} ${y + 2}`}
                fill="none"
                stroke="rgb(255 255 255 / 0.05)"
                strokeWidth="0.2"
              />
            ))}

            {iceDeposits.map((deposit) => (
              <g key={deposit.id} transform={`translate(${deposit.position.x}, ${deposit.position.y})`}>
                <circle
                  r={deposit.collected ? 2 : 3.5}
                  fill="url(#iceDepositGlow)"
                  opacity={deposit.collected ? 0.3 : 0.75}
                />
                <circle
                  r={deposit.collected ? 1.2 : 1.8}
                  fill={deposit.collected ? '#34d399' : '#4d8cff'}
                  opacity={deposit.collected ? 0.6 : 1}
                />
                {!deposit.collected && !reducedMotion && (
                  <motion.circle
                    r="2.5"
                    fill="none"
                    stroke="#67d8ff"
                    strokeWidth="0.15"
                    animate={{ r: [2, 5], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <text
                  y="-4.5"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="2"
                  fontFamily="JetBrains Mono, monospace"
                  opacity={deposit.collected ? 0.4 : 0.8}
                >
                  {deposit.label.split(' ')[0].toUpperCase()}
                </text>
              </g>
            ))}

            {pathD && (
              <>
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgb(103 216 255 / 0.15)"
                  strokeWidth="0.4"
                  strokeDasharray="1.5 1"
                />
                {traveledD && (
                  <motion.path
                    d={traveledD}
                    fill="none"
                    stroke="#67d8ff"
                    strokeWidth="0.5"
                    filter="url(#roverGlow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </>
            )}

            {isPlacing && cursorPoint && (
              <g transform={`translate(${cursorPoint.x}, ${cursorPoint.y})`} opacity="0.6">
                <circle r="3" fill="none" stroke="#67d8ff" strokeWidth="0.2" strokeDasharray="0.8 0.8" />
                <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#67d8ff" strokeWidth="0.2" />
                <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#67d8ff" strokeWidth="0.2" />
              </g>
            )}

            <AnimatePresence>
              {roverPosition && (
                <motion.g
                  key="rover"
                  transform={`translate(${roverPosition.x}, ${roverPosition.y})`}
                  filter="url(#roverGlow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <RoverIcon heading={heading} active={isRunning} />
                </motion.g>
              )}
            </AnimatePresence>

            {phase === 'placed' && roverPosition && (
              <g transform={`translate(${roverPosition.x}, ${roverPosition.y - 8})`}>
                <text textAnchor="middle" fill="#34d399" fontSize="2.2" fontFamily="JetBrains Mono, monospace">
                  DEPLOYED
                </text>
              </g>
            )}
          </svg>

          {!reducedMotion && (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-ice/40 to-transparent"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>

        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border-subtle bg-space-panel px-2 py-1 backdrop-blur-sm">
          <Crosshair className="size-3 text-ice" />
          <span className="font-mono text-[9px] text-text-secondary">
            {isPlacing ? 'CLICK TO PLACE ROVER' : `PROGRESS ${(pathProgress * 100).toFixed(0)}%`}
          </span>
        </div>

        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-space-deep/40 backdrop-blur-[2px]"
          >
            <div className="rounded-xl border border-signal/30 bg-space-panel px-6 py-4 text-center shadow-[0_0_40px_rgb(52_211_153/0.15)]">
              <Flag className="mx-auto size-6 text-signal" />
              <p className="mt-2 font-display text-sm font-bold text-signal">Mission Complete</p>
              <p className="font-mono text-[10px] text-text-muted">All waypoints traversed</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {canStart && (
            <Button size="sm" leftIcon={<Play className="size-3.5" />} onClick={onStart}>
              Begin Traverse
            </Button>
          )}
          {isRunning && (
            <Button size="sm" variant="secondary" leftIcon={<Pause className="size-3.5" />} onClick={onPause}>
              Pause
            </Button>
          )}
          {canResume && (
            <Button size="sm" leftIcon={<Play className="size-3.5" />} onClick={onResume}>
              Resume
            </Button>
          )}
          {phase !== 'idle' && (
            <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="size-3.5" />} onClick={onReset}>
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3 text-ice" />
            <span className="font-mono text-[10px] text-text-muted">
              {iceDeposits.filter((d) => d.collected).length}/{iceDeposits.length} deposits
            </span>
          </div>
          <div className="rounded-lg border border-border-subtle bg-space-panel px-2.5 py-1">
            <span className="font-mono text-[9px] text-text-muted">PATH </span>
            <span className="font-mono text-[11px] font-semibold text-ice">
              <AnimatedCounter value={pathProgress * 100} decimals={0} suffix="%" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
