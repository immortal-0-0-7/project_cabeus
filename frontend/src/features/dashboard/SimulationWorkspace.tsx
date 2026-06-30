import { motion } from 'framer-motion';
import { Orbit, Radio } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { GlassPanel } from '@/components/common/GlassPanel';
import { AnimatedCounter } from '@/components/mission-control/AnimatedCounter';
import {
  RoverMetricCards,
  RoverMissionMap,
  useRoverSimulation,
} from '@/features/rover-simulation';
import { fadeUp, staggerContainer } from '@/utils/motion';

export function SimulationWorkspace() {
  const { state, isPlacing, placeRover, start, pause, resume, reset } = useRoverSimulation();
  const isActive = state.phase === 'running';

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex h-full min-h-0 flex-col gap-4"
    >
      <motion.div variants={fadeUp} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge color="mission" pulse={isActive}>
            {isActive ? 'Traverse Active' : state.phase === 'complete' ? 'Mission Complete' : 'Mission Planning'}
          </Badge>
          <h2 className="mt-2 font-display text-xl font-bold text-text-primary">
            Rover Simulation
          </h2>
          <p className="text-sm text-text-secondary">
            Virtual Pragyan deployment · Shackleton Rim Alpha · Path planning & telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GlassPanel animate={false} className="flex items-center gap-2.5 px-4 py-2">
            <Orbit className="size-4 text-mission" />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Sim Time</p>
              <p className="font-mono text-lg font-semibold text-ice">
                T+<AnimatedCounter value={state.simTimeMin} decimals={0} suffix=" min" />
              </p>
            </div>
          </GlassPanel>
          <GlassPanel animate={false} className="flex items-center gap-2.5 px-4 py-2">
            <Radio className={`size-4 ${isActive ? 'text-signal' : 'text-text-muted'}`} />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted">Link</p>
              <p className={`font-mono text-sm font-semibold ${isActive ? 'text-signal' : 'text-text-secondary'}`}>
                {isActive ? 'NOMINAL' : 'STANDBY'}
              </p>
            </div>
          </GlassPanel>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_1fr]">
        <GlassPanel animate={false} className="flex min-h-[420px] flex-col p-4">
          <RoverMissionMap
            roverPosition={state.roverPosition}
            path={state.path}
            pathProgress={state.pathProgress}
            heading={state.heading}
            iceDeposits={state.iceDeposits}
            phase={state.phase}
            isPlacing={isPlacing}
            onPlace={placeRover}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
          />
        </GlassPanel>

        <GlassPanel animate={false} className="flex min-h-[420px] flex-col overflow-hidden p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Mission Telemetry</h3>
              <p className="text-[11px] text-text-muted">Live metrics · Predictive scoring</p>
            </div>
            {state.phase !== 'idle' && (
              <motion.div
                className="flex items-center gap-1.5 rounded-md border border-border-subtle bg-white/2 px-2 py-1"
                animate={isActive ? { borderColor: 'rgb(103 216 255 / 0.3)' } : {}}
              >
                <span
                  className={`size-1.5 rounded-full ${isActive ? 'animate-pulse bg-ice' : 'bg-text-muted'}`}
                />
                <span className="font-mono text-[9px] text-text-muted">
                  {isActive ? 'STREAMING' : 'SNAPSHOT'}
                </span>
              </motion.div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <RoverMetricCards
              metrics={state.metrics}
              history={state.history}
              isActive={isActive}
            />
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
