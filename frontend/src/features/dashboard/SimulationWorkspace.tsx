import { motion } from 'framer-motion';
import { Battery, Compass, Gauge, Navigation, Radio, Route } from 'lucide-react';
import { GlassPanel } from '@/components/common/GlassPanel';
import { Badge } from '@/components/common/Badge';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import { ROVER_TELEMETRY } from '@/data/missionData';
import { staggerContainer, fadeUp } from '@/utils/motion';

function RoverPathMap() {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-lg border border-border-subtle bg-space-deep">
      <div className="absolute inset-0 grid-mission opacity-30" />
      <svg viewBox="0 0 200 120" className="size-full">
        <motion.path
          d="M 20 90 Q 50 70 80 75 T 140 50 T 175 35"
          fill="none"
          stroke="#67d8ff"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="175"
          cy="35"
          r="4"
          fill="#67d8ff"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle cx="20" cy="90" r="3" fill="#34d399" />
        <text x="20" y="105" fill="#64748b" fontSize="6" fontFamily="monospace">
          DEPLOY
        </text>
        <text x="160" y="28" fill="#64748b" fontSize="6" fontFamily="monospace">
          TARGET
        </text>
      </svg>
      <motion.div
        className="absolute size-2 rounded-full bg-ice shadow-[0_0_8px_#67d8ff]"
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        style={{
          offsetPath: 'path("M 20 90 Q 50 70 80 75 T 140 50 T 175 35")',
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function SimulationWorkspace() {
  const telemetry = [
    { icon: Battery, label: 'Battery', value: ROVER_TELEMETRY.battery, unit: '%', color: 'text-signal' },
    { icon: Gauge, label: 'Speed', value: ROVER_TELEMETRY.speed, unit: 'm/s', color: 'text-ice' },
    { icon: Route, label: 'Distance', value: ROVER_TELEMETRY.distance, unit: 'm', color: 'text-mission' },
    { icon: Compass, label: 'Heading', value: ROVER_TELEMETRY.heading, unit: '°', color: 'text-cinematic' },
    { icon: Navigation, label: 'Temperature', value: ROVER_TELEMETRY.temperature, unit: '°C', color: 'text-warning' },
    { icon: Radio, label: 'Signal', value: ROVER_TELEMETRY.signalStrength, unit: '%', color: 'text-signal' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge color="mission" pulse>
            Simulation Active
          </Badge>
          <h2 className="mt-2 font-display text-xl font-bold text-text-primary">Mission Simulation</h2>
          <p className="text-sm text-text-secondary">
            Virtual Pragyan rover deployment · Shackleton Rim Alpha traverse
          </p>
        </div>
        <GlassPanel animate={false} className="px-4 py-2">
          <p className="font-mono text-[10px] text-text-muted">Sim Time</p>
          <p className="font-mono text-lg font-semibold text-ice">
            T+<AnimatedCounter value={847} decimals={0} suffix=" min" />
          </p>
        </GlassPanel>
      </motion.div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <motion.div variants={fadeUp}>
          <GlassPanel animate={false} className="flex h-full flex-col p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Rover Trajectory</h3>
            <div className="min-h-0 flex-1">
              <RoverPathMap />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['Waypoint 1', 'Waypoint 2', 'Target'].map((wp, i) => (
                <div key={wp} className="rounded-lg border border-border-subtle bg-white/2 px-2 py-1.5 text-center">
                  <p className="font-mono text-[9px] text-text-muted">WP-{i + 1}</p>
                  <p className="text-[10px] text-text-secondary">{wp}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassPanel animate={false} className="flex h-full flex-col p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Live Telemetry</h3>
            <div className="grid grid-cols-2 gap-3">
              {telemetry.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="rounded-lg border border-border-subtle bg-white/2 p-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ borderColor: 'rgb(103 216 255 / 0.25)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`size-4 ${item.color}`} />
                      <span className="text-[10px] text-text-muted">{item.label}</span>
                    </div>
                    <p className={`mt-1 font-mono text-lg font-semibold ${item.color}`}>
                      <AnimatedCounter
                        value={Math.abs(item.value)}
                        decimals={item.value % 1 ? 1 : 0}
                        suffix={` ${item.unit}`}
                      />
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-border-subtle bg-space-deep/60 p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                Terrain Profile
              </p>
              <svg viewBox="0 0 200 40" className="w-full">
                <motion.path
                  d="M 0 30 L 30 25 L 60 28 L 90 15 L 120 20 L 150 10 L 180 18 L 200 12"
                  fill="none"
                  stroke="#4d8cff"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                />
                <motion.path
                  d="M 0 30 L 30 25 L 60 28 L 90 15 L 120 20 L 150 10 L 180 18 L 200 12 L 200 40 L 0 40 Z"
                  fill="#4d8cff"
                  fillOpacity="0.1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                />
              </svg>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
