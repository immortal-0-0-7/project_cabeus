import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
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
      className="flex h-full min-h-0 flex-col"
    >
      <motion.div variants={fadeUp} className="mb-10">
        <Badge color="mission" pulse={isActive}>
          {isActive ? 'Traverse Active' : state.phase === 'complete' ? 'Mission Complete' : 'Mission Planning'}
        </Badge>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-text-primary">
          Rover Simulation
        </h2>
        <p className="mt-3 text-lg font-light text-text-secondary">
          Virtual Pragyan deployment · Shackleton Rim Alpha
        </p>

        <div className="mt-8 flex flex-wrap gap-12 border-t border-border-subtle pt-8">
          <div>
            <p className="text-label">Sim Time</p>
            <p className="mt-2 font-display text-2xl font-medium text-text-primary">
              T+<AnimatedCounter value={state.simTimeMin} decimals={0} suffix=" min" />
            </p>
          </div>
          <div>
            <p className="text-label">Link</p>
            <p className="mt-2 font-display text-2xl font-medium text-text-primary">
              {isActive ? 'Nominal' : 'Standby'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid min-h-0 flex-1 gap-12 border-t border-border-subtle pt-10 xl:grid-cols-2">
        <div className="min-h-[420px]">
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
        </div>

        <div className="min-h-[420px] overflow-y-auto border-t border-border-subtle pt-8 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-10">
          <p className="text-label mb-6">Mission Telemetry</p>
          <RoverMetricCards
            metrics={state.metrics}
            history={state.history}
            isActive={isActive}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
