import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { IconButton } from '@/components/common/IconButton';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { LANDING_SITES, SOUTH_POLE_SAR_IMAGE, TARGET_REGION, type LandingSite } from '@/data/missionData';
import { cn } from '@/utils/cn';

function siteToCoords(site: LandingSite): { x: number; y: number } {
  const x = ((site.lon + 180) / 360) * 100;
  const y = ((90 + site.lat) / 180) * 100;
  return { x: Math.min(92, Math.max(8, x)), y: Math.min(92, Math.max(8, y)) };
}

const statusBadge = {
  primary: 'signal' as const,
  backup: 'mission' as const,
  candidate: 'ice' as const,
};

export interface LunarWorkspaceMapProps {
  highlightSiteId?: string;
  onSiteSelect?: (site: LandingSite) => void;
  showHeatmap?: boolean;
  compact?: boolean;
}

export function LunarWorkspaceMap({
  highlightSiteId,
  onSiteSelect,
  showHeatmap = true,
  compact = false,
}: LunarWorkspaceMapProps) {
  const [selectedId, setSelectedId] = useState(highlightSiteId ?? LANDING_SITES[0].id);
  const [zoom, setZoom] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selected = LANDING_SITES.find((s) => s.id === selectedId) ?? LANDING_SITES[0];

  const handleSelect = (site: LandingSite) => {
    setSelectedId(site.id);
    onSiteSelect?.(site);
  };

  return (
    <div className={cn('relative flex h-full flex-col', compact && 'min-h-[280px]')}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-text-primary">South Polar Workspace</h3>
          <p className="text-xs text-text-muted">{TARGET_REGION}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton label="Zoom out" onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}>
            <ZoomOut className="size-3.5" />
          </IconButton>
          <span className="w-10 text-center font-mono text-xs text-text-muted">
            {(zoom * 100).toFixed(0)}%
          </span>
          <IconButton label="Zoom in" onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}>
            <ZoomIn className="size-3.5" />
          </IconButton>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border-subtle bg-space-deep">
        <motion.div
          className="absolute inset-0 origin-center"
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          <img
            src={SOUTH_POLE_SAR_IMAGE}
            alt="Chandrayaan-2 DFSAR south polar swath"
            className="absolute inset-0 size-full object-cover"
            draggable={false}
          />
          <svg viewBox="0 0 100 100" className="relative size-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="polarGlow" cx="50%" cy="95%" r="55%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#FB923C" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#02040a" stopOpacity="0.35" />
              </radialGradient>
              <radialGradient id="iceHeat1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="iceHeat2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            {showHeatmap && (
              <>
                <ellipse cx="50" cy="88" rx="28" ry="14" fill="url(#iceHeat1)" opacity="0.7" />
                <ellipse cx="22" cy="82" rx="16" ry="10" fill="url(#iceHeat2)" opacity="0.6" />
                <ellipse cx="78" cy="80" rx="12" ry="8" fill="url(#iceHeat2)" opacity="0.4" />
              </>
            )}

            <path
              d="M 10 75 Q 30 65 50 70 T 90 72"
              fill="none"
              stroke="rgb(255 255 255 / 0.08)"
              strokeWidth="0.3"
            />
            <path
              d="M 15 85 Q 40 78 55 82 T 88 84"
              fill="none"
              stroke="rgb(255 255 255 / 0.06)"
              strokeWidth="0.2"
            />

            {LANDING_SITES.map((site) => {
              const { x, y } = siteToCoords(site);
              const isSelected = selectedId === site.id;
              const isHovered = hoveredId === site.id;

              return (
                <g
                  key={site.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer"
                  onClick={() => handleSelect(site)}
                  onMouseEnter={() => setHoveredId(site.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {(isSelected || isHovered) && (
                    <motion.circle
                      r="4"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="0.3"
                      initial={{ r: 2, opacity: 0.8 }}
                      animate={{ r: 5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  <circle
                    r={isSelected ? 1.8 : 1.2}
                    fill={isSelected ? '#F97316' : '#FB923C'}
                    opacity={isSelected ? 1 : 0.7}
                  />
                  {(isSelected || isHovered) && (
                    <text
                      y="-3"
                      textAnchor="middle"
                      fill="#f4f7fa"
                      fontSize="2.5"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {site.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <motion.div
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-mission/60 to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border-subtle bg-space-panel px-2 py-1 backdrop-blur-sm">
          <Crosshair className="size-3 text-mission" />
          <span className="font-mono text-[11px] text-text-secondary">DFSAR L-BAND</span>
        </div>

        <div className="absolute bottom-3 right-3 rounded-md border border-border-subtle bg-space-panel px-2 py-1 backdrop-blur-sm">
          <span className="font-mono text-[11px] text-text-muted">
            {selected.lat.toFixed(1)}°S · {Math.abs(selected.lon).toFixed(1)}°{selected.lon >= 0 ? 'E' : 'W'}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {[
            { label: 'Score', value: selected.score, suffix: '' },
            { label: 'Ice Prob.', value: selected.iceProbability, suffix: '%' },
            { label: 'Stability', value: selected.terrainStability, suffix: '%' },
            { label: 'Slope', value: selected.slopeDeg, suffix: '°' },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-border-subtle bg-space-panel px-2.5 py-2"
            >
              <p className="text-xs text-text-muted">{metric.label}</p>
              <p className="font-mono text-base font-semibold text-text-primary">
                <AnimatedCounter value={metric.value} decimals={1} suffix={metric.suffix} />
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {!compact && (
        <div className="mt-2 flex flex-wrap gap-2">
          {LANDING_SITES.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => handleSelect(site)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all',
                selectedId === site.id
                  ? 'border-mission/30 bg-mission/10 text-mission'
                  : 'border-border-subtle text-text-muted hover:text-text-secondary',
              )}
            >
              <MapPin className="size-3" />
              {site.name}
              <Badge color={statusBadge[site.status]}>{site.status}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
