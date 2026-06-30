import {
  BASE_SCIENTIFIC_RETURN,
  BASE_SUCCESS_PROBABILITY,
  COLLECTION_RADIUS,
  ICE_DEPOSITS,
  INITIAL_BATTERY,
  MAX_MISSION_DISTANCE,
  ROVER_SPEED,
} from '../constants';
import type { IceDeposit, MapPoint, RoverMetrics } from '../types';

export function distance(a: MapPoint, b: MapPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function pathLength(path: MapPoint[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += distance(path[i - 1], path[i]);
  }
  return total * 4.2;
}

export function interpolatePath(path: MapPoint[], progress: number): { position: MapPoint; heading: number } {
  if (path.length === 0) return { position: { x: 50, y: 50 }, heading: 0 };
  if (path.length === 1) return { position: path[0], heading: 0 };

  const segments = path.length - 1;
  const scaled = Math.min(1, Math.max(0, progress)) * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const t = scaled - index;
  const from = path[index];
  const to = path[index + 1];
  const heading = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

  return {
    position: {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    },
    heading,
  };
}

export function generateMissionPath(start: MapPoint, deposits: IceDeposit[]): MapPoint[] {
  const remaining = [...deposits];
  const path: MapPoint[] = [start];
  let current = start;

  while (remaining.length > 0) {
    remaining.sort((a, b) => distance(current, a.position) - distance(current, b.position));
    const next = remaining.shift()!;
    const mid: MapPoint = {
      x: (current.x + next.position.x) / 2 + (Math.random() - 0.5) * 4,
      y: (current.y + next.position.y) / 2 + (Math.random() - 0.5) * 4,
    };
    path.push(
      { x: current.x + (mid.x - current.x) * 0.35, y: current.y + (mid.y - current.y) * 0.35 },
      mid,
      { x: mid.x + (next.position.x - mid.x) * 0.65, y: mid.y + (next.position.y - mid.y) * 0.65 },
      next.position,
    );
    current = next.position;
  }

  return path;
}

export function createInitialDeposits(): IceDeposit[] {
  return ICE_DEPOSITS.map((d) => ({ ...d, collected: false }));
}

export function computeMetrics(
  progress: number,
  path: MapPoint[],
  deposits: IceDeposit[],
  simTimeMin: number,
): RoverMetrics {
  const totalDist = pathLength(path);
  const distTraveled = totalDist * progress;
  const { position } = interpolatePath(path, progress);

  const updatedDeposits = deposits.map((d) => ({
    ...d,
    collected: d.collected || distance(position, d.position) <= COLLECTION_RADIUS,
  }));

  const collectedCount = updatedDeposits.filter((d) => d.collected).length;
  const iceCollected = updatedDeposits
    .filter((d) => d.collected)
    .reduce((sum, d) => sum + d.yieldKg, 0);

  const energy = distTraveled * 0.72 + iceCollected * 18 + simTimeMin * 0.4;
  const batteryDrain = (distTraveled / MAX_MISSION_DISTANCE) * 38 + simTimeMin * 0.08 + iceCollected * 2.5;
  const battery = Math.max(8, INITIAL_BATTERY - batteryDrain);

  const iceEfficiency = iceCollected / ICE_DEPOSITS.reduce((s, d) => s + d.yieldKg, 0);
  const distanceEfficiency = 1 - Math.min(1, distTraveled / MAX_MISSION_DISTANCE);
  const missionScore = Math.min(
    100,
    iceEfficiency * 42 + distanceEfficiency * 18 + (battery / 100) * 22 + collectedCount * 4,
  );

  const batteryFactor = battery / 100;
  const progressFactor = progress > 0.95 ? 1.05 : 1;
  const missionSuccessProbability = Math.min(
    99.8,
    BASE_SUCCESS_PROBABILITY * batteryFactor * progressFactor * (0.85 + iceEfficiency * 0.15),
  );

  const scientificReturn = Math.min(
    100,
    BASE_SCIENTIFIC_RETURN +
      collectedCount * 14 +
      updatedDeposits.filter((d) => d.collected).reduce((s, d) => s + d.confidence * 0.08, 0),
  );

  return {
    battery,
    distance: distTraveled,
    energy,
    iceCollected,
    missionScore,
    missionSuccessProbability,
    scientificReturn,
  };
}

export function applyCollection(
  position: MapPoint,
  deposits: IceDeposit[],
): IceDeposit[] {
  return deposits.map((d) => ({
    ...d,
    collected: d.collected || distance(position, d.position) <= COLLECTION_RADIUS,
  }));
}

export function estimateDuration(path: MapPoint[]): number {
  return pathLength(path) / (ROVER_SPEED * 420);
}
