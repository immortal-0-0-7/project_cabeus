import { motion } from 'framer-motion';
import { Radio, Satellite, Target } from 'lucide-react';
import { GlassPanel } from '@/components/common/GlassPanel';
import { Badge } from '@/components/common/Badge';
import { LunarWorkspaceMap } from '@/components/mission-control/LunarWorkspaceMap';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import {
  LANDING_SITES,
  MISSION_ID,
  MISSION_NAME,
  ORBITER,
  ROVER_TELEMETRY,
} from '@/data/missionData';
import { staggerContainer, fadeUp } from '@/utils/motion';

export function OverviewWorkspace() {
  const primary = LANDING_SITES[0];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge color="signal" pulse>
              Active Mission
            </Badge>
            <span className="font-mono text-[10px] text-text-muted">{MISSION_ID}</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-text-primary lg:text-2xl">
            {MISSION_NAME}
          </h2>
          <p className="mt-0.5 text-sm text-text-secondary">
            {ORBITER} · South polar SAR ice intelligence pipeline
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { icon: Satellite, label: 'Orbiter', value: 'Nominal', color: 'text-signal' },
            { icon: Target, label: 'Primary Site', value: primary.name.split(' ')[0], color: 'text-ice' },
            { icon: Radio, label: 'DSN Link', value: `${ROVER_TELEMETRY.signalStrength}%`, color: 'text-mission' },
          ].map(({ icon: Icon, label, value, color }) => (
            <GlassPanel key={label} animate={false} className="px-3 py-2">
              <div className="flex items-center gap-2">
                <Icon className={`size-3.5 ${color}`} />
                <div>
                  <p className="text-[9px] text-text-muted">{label}</p>
                  <p className={`font-mono text-[11px] font-medium ${color}`}>{value}</p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="min-h-0 flex-1">
        <GlassPanel animate={false} className="flex h-full min-h-[360px] flex-col p-4 lg:p-5">
          <LunarWorkspaceMap />
        </GlassPanel>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Orbital Altitude', value: 100, unit: 'km' },
          { label: 'Swath Resolution', value: 12.4, unit: 'm/px' },
          { label: 'Penetration Depth', value: 5, unit: 'm' },
          { label: 'Mission Elapsed', value: 847, unit: 'min' },
        ].map((item) => (
          <GlassPanel key={item.label} animate={false} className="p-3">
            <p className="text-[10px] text-text-muted">{item.label}</p>
            <p className="font-mono text-lg font-semibold text-text-primary">
              <AnimatedCounter value={item.value} decimals={item.value % 1 ? 1 : 0} />
              <span className="ml-1 text-xs font-normal text-text-muted">{item.unit}</span>
            </p>
          </GlassPanel>
        ))}
      </motion.div>
    </motion.div>
  );
}
