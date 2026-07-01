import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { FadeIn, SectionHeading } from '@/components/motion';
import { RoverMetricCards } from '@/features/rover-simulation/components/RoverMetricCards';
import { RoverMissionMap } from '@/features/rover-simulation/components/RoverMissionMap';
import { useRoverSimulation } from '@/features/rover-simulation/hooks/useRoverSimulation';
import { ROUTES } from '@/routes/paths';

export function MissionSimulationSection() {
  const { state, isPlacing, placeRover, start, pause, resume, reset } = useRoverSimulation();
  const isActive = state.phase === 'running';

  return (
    <section
      id="simulation"
      className="relative border-t border-border-subtle px-8 py-32 md:px-12 md:py-48 lg:px-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="06 — Mission Simulation"
          title="Rover Path Planning"
          subtitle="Interactive rover simulation with live battery, distance, energy, and mission success probability."
        />

        <FadeIn className="mt-16" delay={0.1}>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-h-[400px] overflow-hidden">
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

            <RoverMetricCards metrics={state.metrics} history={state.history} isActive={isActive} />
          </div>
        </FadeIn>

        <FadeIn className="mt-16 flex justify-center" delay={0.15}>
          <Link to={ROUTES.simulation}>
            <Button size="lg" rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}>
              Launch Simulation Workspace
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
