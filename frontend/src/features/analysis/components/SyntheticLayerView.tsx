import { motion } from 'framer-motion';
import type { AnalysisLayerId } from '../types';

interface SyntheticLayerViewProps {
  layer: AnalysisLayerId;
  className?: string;
}

const LAYER_CONFIG: Record<
  AnalysisLayerId,
  { gradient: string; accent: string; scanOpacity: number }
> = {
  original: {
    gradient: 'from-[#0c1018] via-[#141c2e] to-[#080c14]',
    accent: '#64748b',
    scanOpacity: 0.25,
  },
  enhanced: {
    gradient: 'from-[#0a1220] via-[#152a4a] to-[#060a12]',
    accent: '#4d8cff',
    scanOpacity: 0.4,
  },
  segmentation: {
    gradient: 'from-[#08081a] via-[#1a1a3e] to-[#060612]',
    accent: '#6e5dff',
    scanOpacity: 0.35,
  },
  heatmap: {
    gradient: 'from-[#061018] via-[#0c2840] to-[#040810]',
    accent: '#67d8ff',
    scanOpacity: 0.5,
  },
  landing: {
    gradient: 'from-[#061210] via-[#0a2018] to-[#040808]',
    accent: '#34d399',
    scanOpacity: 0.45,
  },
};

function generateNoiseCells(seed: number) {
  return Array.from({ length: 64 }).map((_, i) => {
    const x = (i % 8) * 12.5;
    const y = Math.floor(i / 8) * 12.5;
    const noise = Math.sin(i * seed + seed) * 0.5 + 0.5;
    return { x, y, opacity: 0.04 + noise * 0.12 };
  });
}

export function SyntheticLayerView({ layer, className }: SyntheticLayerViewProps) {
  const cfg = LAYER_CONFIG[layer];
  const cells = generateNoiseCells(layer === 'original' ? 1.7 : 2.3);

  return (
    <div
      className={`relative size-full overflow-hidden rounded-lg bg-gradient-to-br ${cfg.gradient} ${className ?? ''}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`glow-${layer}`} cx="50%" cy="55%" r="45%">
            <stop offset="0%" stopColor={cfg.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={cfg.accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`heat-${layer}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a3a5c" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#67d8ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4d8cff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {cells.map((cell, i) => (
          <rect
            key={i}
            x={cell.x}
            y={cell.y}
            width={11}
            height={11}
            fill={cfg.accent}
            opacity={cell.opacity}
            rx={0.5}
          />
        ))}

        {layer === 'original' && (
          <>
            <ellipse cx="52" cy="58" rx="28" ry="18" fill="#475569" opacity="0.15" />
            <ellipse cx="35" cy="42" rx="14" ry="10" fill="#64748b" opacity="0.1" />
            {Array.from({ length: 18 }).map((_, i) => (
              <circle
                key={i}
                cx={15 + (i % 6) * 14}
                cy={20 + Math.floor(i / 6) * 22}
                r={0.8 + (i % 3) * 0.3}
                fill="#94a3b8"
                opacity={0.15 + (i % 4) * 0.05}
              />
            ))}
          </>
        )}

        {layer === 'enhanced' && (
          <>
            <ellipse cx="50" cy="55" rx="32" ry="20" fill={cfg.accent} opacity="0.12" />
            <ellipse cx="38" cy="45" rx="16" ry="11" fill="#67d8ff" opacity="0.08" />
            <path
              d="M 20 70 Q 45 35 75 50 T 90 40"
              fill="none"
              stroke={cfg.accent}
              strokeWidth="0.4"
              opacity="0.3"
            />
          </>
        )}

        {layer === 'segmentation' && (
          <>
            <path
              d="M 15 75 Q 35 30 55 50 Q 70 65 85 35"
              fill="none"
              stroke="#6e5dff"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <path
              d="M 15 75 Q 35 30 55 50 Q 70 65 85 35 L 85 90 L 15 90 Z"
              fill="#6e5dff"
              opacity="0.12"
            />
            <path
              d="M 20 80 Q 40 55 60 70 Q 75 80 80 60 L 80 90 L 20 90 Z"
              fill="#4d8cff"
              opacity="0.08"
            />
            {[
              [30, 55],
              [50, 42],
              [68, 58],
              [78, 48],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.5" fill="#67d8ff" opacity="0.6" />
            ))}
          </>
        )}

        {layer === 'heatmap' && (
          <>
            <rect width="100" height="100" fill={`url(#heat-${layer})`} opacity="0.7" />
            <ellipse cx="55" cy="62" rx="30" ry="18" fill="#67d8ff" opacity="0.35" />
            <ellipse cx="32" cy="48" rx="18" ry="12" fill="#4d8cff" opacity="0.28" />
            <ellipse cx="72" cy="52" rx="14" ry="10" fill="#67d8ff" opacity="0.22" />
            <ellipse cx="48" cy="38" rx="10" ry="7" fill="#a5f3fc" opacity="0.18" />
          </>
        )}

        {layer === 'landing' && (
          <>
            <ellipse cx="55" cy="62" rx="30" ry="18" fill={`url(#glow-${layer})`} />
            <circle cx="52" cy="58" r="4" fill="none" stroke="#34d399" strokeWidth="0.6" opacity="0.9" />
            <circle cx="52" cy="58" r="7" fill="none" stroke="#34d399" strokeWidth="0.3" opacity="0.5" strokeDasharray="2 2" />
            <circle cx="52" cy="58" r="11" fill="none" stroke="#34d399" strokeWidth="0.2" opacity="0.3" />
            <path d="M 52 58 L 52 48" stroke="#34d399" strokeWidth="0.5" opacity="0.8" />
            <polygon points="52,46 54,50 50,50" fill="#34d399" opacity="0.8" />
            <circle cx="35" cy="72" r="2.5" fill="#fbbf24" opacity="0.7" />
            <circle cx="72" cy="68" r="2" fill="#4d8cff" opacity="0.6" />
            <text x="56" y="57" fontSize="3" fill="#34d399" opacity="0.9" fontFamily="monospace">
              α
            </text>
          </>
        )}
      </svg>

      <motion.div
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgb(255_255_255/0.015)_2px,rgb(255_255_255/0.015)_4px)]"
        animate={{ opacity: [cfg.scanOpacity * 0.7, cfg.scanOpacity, cfg.scanOpacity * 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="noise-overlay absolute inset-0 opacity-40" />

      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-text-muted backdrop-blur-sm">
          70.2°S · 0.0°E
        </span>
        <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-text-muted backdrop-blur-sm">
          12.4 m/px
        </span>
      </div>

      <div className="absolute right-2 top-2">
        <span
          className="rounded px-1.5 py-0.5 font-mono text-[8px] backdrop-blur-sm"
          style={{ background: `${cfg.accent}22`, color: cfg.accent }}
        >
          {layer.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
