import { motion } from 'framer-motion';
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
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-12">
        <p className="text-label">{MISSION_ID}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.04em] text-text-primary">
          {MISSION_NAME}
        </h2>
        <p className="mt-3 text-lg font-light text-text-secondary">
          {ORBITER} · South polar SAR ice intelligence
        </p>

        <div className="mt-10 flex flex-wrap gap-12 border-t border-border-subtle pt-10">
          {[
            { label: 'Orbiter', value: 'Nominal' },
            { label: 'Primary Site', value: primary.name.split(' ')[0] },
            { label: 'DSN Link', value: `${ROVER_TELEMETRY.signalStrength}%` },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-label">{item.label}</p>
              <p className="mt-2 font-display text-xl font-medium text-text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="min-h-0 flex-1">
        <div className="flex h-full min-h-[400px] flex-col">
          <LunarWorkspaceMap />
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-12 grid grid-cols-2 gap-10 border-t border-border-subtle pt-10 lg:grid-cols-4"
      >
        {[
          { label: 'Orbital Altitude', value: 100, unit: 'km' },
          { label: 'Swath Resolution', value: 12.4, unit: 'm/px' },
          { label: 'Penetration Depth', value: 5, unit: 'm' },
          { label: 'Mission Elapsed', value: 847, unit: 'min' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-label">{item.label}</p>
            <p className="text-stat-massive mt-3 text-[clamp(2rem,4vw,3rem)] text-text-primary">
              <AnimatedCounter value={item.value} decimals={item.value % 1 ? 1 : 0} />
              <span className="ml-2 text-base font-normal text-text-muted">{item.unit}</span>
            </p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
