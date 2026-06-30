import type { IceDeposit, MetricDefinition } from './types';

export const MAP_SIZE = 100;
export const ROVER_SPEED = 0.08;
export const COLLECTION_RADIUS = 3.5;
export const INITIAL_BATTERY = 100;
export const MAX_MISSION_DISTANCE = 420;

export const ICE_DEPOSITS: Omit<IceDeposit, 'collected'>[] = [
  { id: 'ice-1', position: { x: 72, y: 28 }, yieldKg: 0.42, confidence: 91, label: 'Alpha Vein' },
  { id: 'ice-2', position: { x: 58, y: 42 }, yieldKg: 0.68, confidence: 87, label: 'Rim Deposit' },
  { id: 'ice-3', position: { x: 38, y: 55 }, yieldKg: 0.54, confidence: 79, label: 'Shadow Edge' },
  { id: 'ice-4', position: { x: 24, y: 38 }, yieldKg: 0.31, confidence: 72, label: 'Regolith Patch' },
  { id: 'ice-5', position: { x: 48, y: 22 }, yieldKg: 0.89, confidence: 94, label: 'Primary Target' },
];

export const MISSION_METRICS: MetricDefinition[] = [
  {
    id: 'battery',
    label: 'Battery',
    unit: '%',
    icon: 'battery',
    color: '#34d399',
    max: 100,
    description: 'Power cell charge remaining',
  },
  {
    id: 'distance',
    label: 'Distance',
    unit: 'm',
    icon: 'route',
    color: '#67d8ff',
    max: MAX_MISSION_DISTANCE,
    description: 'Cumulative traverse distance',
  },
  {
    id: 'energy',
    label: 'Energy',
    unit: 'Wh',
    icon: 'zap',
    color: '#fbbf24',
    max: 340,
    description: 'Total power consumed',
  },
  {
    id: 'iceCollected',
    label: 'Ice Collected',
    unit: 'kg',
    icon: 'snowflake',
    color: '#4d8cff',
    max: 2.84,
    description: 'Water ice sample mass',
  },
  {
    id: 'missionScore',
    label: 'Mission Score',
    unit: '/100',
    icon: 'target',
    color: '#6e5dff',
    max: 100,
    description: 'Composite mission performance',
  },
  {
    id: 'missionSuccessProbability',
    label: 'Success Probability',
    unit: '%',
    icon: 'shield',
    color: '#34d399',
    max: 100,
    description: 'Predicted mission completion likelihood',
  },
  {
    id: 'scientificReturn',
    label: 'Scientific Return',
    unit: '%',
    icon: 'microscope',
    color: '#67d8ff',
    max: 100,
    description: 'Data and sample value index',
  },
];

export const BASE_SUCCESS_PROBABILITY = 94.2;
export const BASE_SCIENTIFIC_RETURN = 12;
