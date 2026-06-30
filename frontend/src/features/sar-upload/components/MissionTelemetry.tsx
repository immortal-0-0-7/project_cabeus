import { motion } from 'framer-motion';
import { Activity, Radio, Satellite, Server } from 'lucide-react';
import { GlassPanel } from '@/components/common/GlassPanel';
import { MISSION_ID } from '@/data/missionData';
import type { PipelinePhase } from '../types';

interface MissionTelemetryProps {
  phase: PipelinePhase;
  overallProgress: number;
}

const phaseLabels: Record<PipelinePhase, string> = {
  idle: 'STANDBY',
  uploading: 'UPLINK ACTIVE',
  processing: 'PIPELINE RUN',
  complete: 'MISSION READY',
};

const phaseColors: Record<PipelinePhase, string> = {
  idle: 'text-text-muted',
  uploading: 'text-mission',
  processing: 'text-ice',
  complete: 'text-signal',
};

export function MissionTelemetry({ phase, overallProgress }: MissionTelemetryProps) {
  const items = [
    { icon: Satellite, label: 'Mission ID', value: MISSION_ID },
    { icon: Radio, label: 'Uplink', value: phase === 'idle' ? 'Idle' : 'Nominal' },
    { icon: Server, label: 'Compute Node', value: 'C2-INFER-01' },
    { icon: Activity, label: 'Pipeline', value: `${Math.round(overallProgress)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, label, value }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
        >
          <GlassPanel animate={false} className="px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-md border border-border-subtle bg-white/3">
                <Icon className="size-3.5 text-ice" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[8px] uppercase tracking-widest text-text-muted">
                  {label}
                </p>
                <p className="truncate font-mono text-[11px] font-medium text-text-primary">
                  {value}
                </p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      ))}

      <motion.div
        className="col-span-2 flex items-center justify-center lg:col-span-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GlassPanel animate={false} className="flex w-full items-center justify-center gap-3 px-4 py-2">
          <span
            className={`size-2 rounded-full ${
              phase === 'complete'
                ? 'bg-signal shadow-[0_0_10px_rgb(52_211_153/0.5)]'
                : phase !== 'idle'
                  ? 'animate-pulse bg-ice shadow-[0_0_10px_rgb(103_216_255/0.4)]'
                  : 'bg-text-muted'
            }`}
          />
          <span className={`font-mono text-[10px] font-medium uppercase tracking-[0.15em] ${phaseColors[phase]}`}>
            {phaseLabels[phase]}
          </span>
          <span className="font-mono text-[9px] text-text-muted">
            · ISRO MCC · CHANDRAYAAN-2 DFSAR
          </span>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
