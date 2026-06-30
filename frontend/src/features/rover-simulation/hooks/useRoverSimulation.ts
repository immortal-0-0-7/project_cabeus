import { useCallback, useEffect, useRef, useState } from 'react';
import { ROVER_SPEED } from '../constants';
import type { IceDeposit, MapPoint, MetricHistory, RoverMetrics, RoverSimulationState, SimulationPhase } from '../types';
import {
  applyCollection,
  computeMetrics,
  createInitialDeposits,
  generateMissionPath,
  interpolatePath,
} from '../utils/simulationEngine';

const EMPTY_METRICS: RoverMetrics = {
  battery: 100,
  distance: 0,
  energy: 0,
  iceCollected: 0,
  missionScore: 0,
  missionSuccessProbability: 94.2,
  scientificReturn: 12,
};

const EMPTY_HISTORY: MetricHistory = {
  battery: [100],
  distance: [0],
  energy: [0],
  iceCollected: [0],
  missionScore: [0],
  missionSuccessProbability: [94.2],
  scientificReturn: [12],
};

function pushHistory(history: MetricHistory, metrics: RoverMetrics): MetricHistory {
  const cap = 24;
  const push = <K extends keyof MetricHistory>(key: K) => [
    ...history[key].slice(-(cap - 1)),
    metrics[key],
  ];
  return {
    battery: push('battery'),
    distance: push('distance'),
    energy: push('energy'),
    iceCollected: push('iceCollected'),
    missionScore: push('missionScore'),
    missionSuccessProbability: push('missionSuccessProbability'),
    scientificReturn: push('scientificReturn'),
  };
}

export function useRoverSimulation() {
  const [phase, setPhase] = useState<SimulationPhase>('idle');
  const [roverPosition, setRoverPosition] = useState<MapPoint | null>(null);
  const [path, setPath] = useState<MapPoint[]>([]);
  const [pathProgress, setPathProgress] = useState(0);
  const [heading, setHeading] = useState(0);
  const [simTimeMin, setSimTimeMin] = useState(0);
  const [metrics, setMetrics] = useState<RoverMetrics>(EMPTY_METRICS);
  const [history, setHistory] = useState<MetricHistory>(EMPTY_HISTORY);
  const [iceDeposits, setIceDeposits] = useState<IceDeposit[]>(createInitialDeposits);
  const [isPlacing, setIsPlacing] = useState(true);

  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const progressRef = useRef(0);
  const depositsRef = useRef(iceDeposits);
  const pathRef = useRef(path);
  const simTimeRef = useRef(0);

  useEffect(() => {
    depositsRef.current = iceDeposits;
  }, [iceDeposits]);

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  const placeRover = useCallback((point: MapPoint) => {
    cancelAnimationFrame(rafRef.current);
    const deposits = createInitialDeposits();
    const missionPath = generateMissionPath(point, deposits);
    progressRef.current = 0;
    simTimeRef.current = 0;

    setRoverPosition(point);
    setPath(missionPath);
    setPathProgress(0);
    setHeading(0);
    setSimTimeMin(0);
    setIceDeposits(deposits);
    setMetrics(EMPTY_METRICS);
    setHistory(EMPTY_HISTORY);
    setPhase('placed');
    setIsPlacing(false);
    depositsRef.current = deposits;
    pathRef.current = missionPath;
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;
    simTimeRef.current = 0;
    setPhase('idle');
    setRoverPosition(null);
    setPath([]);
    setPathProgress(0);
    setHeading(0);
    setSimTimeMin(0);
    setMetrics(EMPTY_METRICS);
    setHistory(EMPTY_HISTORY);
    setIceDeposits(createInitialDeposits());
    setIsPlacing(true);
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (lastTickRef.current === 0) lastTickRef.current = timestamp;
    const delta = (timestamp - lastTickRef.current) / 1000;
    lastTickRef.current = timestamp;

    progressRef.current = Math.min(1, progressRef.current + ROVER_SPEED * delta);
    simTimeRef.current += delta * 2.4;

    const currentPath = pathRef.current;
    const { position, heading: h } = interpolatePath(currentPath, progressRef.current);
    const updatedDeposits = applyCollection(position, depositsRef.current);
    depositsRef.current = updatedDeposits;

    const newMetrics = computeMetrics(
      progressRef.current,
      currentPath,
      updatedDeposits,
      simTimeRef.current,
    );

    setPathProgress(progressRef.current);
    setRoverPosition(position);
    setHeading(h);
    setSimTimeMin(simTimeRef.current);
    setIceDeposits(updatedDeposits);
    setMetrics(newMetrics);
    setHistory((prev) => pushHistory(prev, newMetrics));

    if (progressRef.current >= 1) {
      setPhase('complete');
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (!roverPosition || path.length === 0) return;
    lastTickRef.current = 0;
    setPhase('running');
    rafRef.current = requestAnimationFrame(tick);
  }, [roverPosition, path.length, tick]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    if (pathProgress >= 1) return;
    lastTickRef.current = 0;
    setPhase('running');
    rafRef.current = requestAnimationFrame(tick);
  }, [pathProgress, tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const state: RoverSimulationState = {
    phase,
    roverPosition,
    path,
    pathProgress,
    heading,
    simTimeMin,
    metrics,
    history,
    iceDeposits,
  };

  return {
    state,
    isPlacing,
    placeRover,
    start,
    pause,
    resume,
    reset,
    setIsPlacing,
  };
}
