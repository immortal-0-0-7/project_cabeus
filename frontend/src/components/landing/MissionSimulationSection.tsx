import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LandingSectionShell } from '@/components/landing/LandingSectionShell';
import { FadeIn, Magnet, SectionHeading, TiltCard } from '@/components/motion';
import { RoverMetricCards } from '@/features/rover-simulation/components/RoverMetricCards';
import { RoverMissionMap } from '@/features/rover-simulation/components/RoverMissionMap';
import { useRoverSimulation } from '@/features/rover-simulation/hooks/useRoverSimulation';
import { ROUTES } from '@/routes/paths';

export function MissionSimulationSection() {
  const { state, isPlacing, placeRover, start, pause, resume, reset } = useRoverSimulation();
  const isActive = state.phase === 'running';

  return (
    <LandingSectionShell
      id="simulation"
      className="border-t border-border-subtle px-8 py-32 md:px-12 md:py-48 lg:px-16"
    >
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          label="06 — Mission Simulation"
          title="Rover Path Planning"
          subtitle="Interactive rover simulation with live battery, distance, energy, and mission success probability."
        />

        <div className="landing-divider-glow mx-auto mt-12 w-48" />

        <FadeIn className="mt-16" delay={0.1}>
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <TiltCard className="min-h-[400px] overflow-hidden rounded-xl">
              <div className="landing-glass landing-glass-hover h-full min-h-[400px] overflow-hidden">
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
            </TiltCard>

            <TiltCard>
              <div className="landing-glass landing-glass-hover h-full rounded-xl p-2">
                <RoverMetricCards metrics={state.metrics} history={state.history} isActive={isActive} />
              </div>
            </TiltCard>
          </div>
        </FadeIn>

        <FadeIn className="mt-16 flex justify-center" delay={0.15}>
          <Magnet>
            <Link to={ROUTES.simulation}>
              <Button size="lg" rightIcon={<ArrowRight className="size-4 opacity-60" strokeWidth={1.5} />}>
                Launch Simulation Workspace
              </Button>
            </Link>
          </Magnet>
        </FadeIn>
      </div>
    </LandingSectionShell>
  );
}
