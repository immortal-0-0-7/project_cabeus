import { useEffect, useState } from 'react';
import type { MissionLog } from '@/data/missionData';
import { INITIAL_LOGS, STREAM_LOG_MESSAGES } from '@/data/missionData';

function formatTime(date: Date): string {
  return date.toISOString().slice(11, 19);
}

export function useMissionLogs(): MissionLog[] {
  const [logs, setLogs] = useState<MissionLog[]>(INITIAL_LOGS);
  const [streamIndex, setStreamIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = STREAM_LOG_MESSAGES[streamIndex % STREAM_LOG_MESSAGES.length];
      const entry: MissionLog = {
        ...template,
        id: `log-${Date.now()}`,
        timestamp: formatTime(new Date()),
      };
      setLogs((prev) => [...prev.slice(-19), entry]);
      setStreamIndex((i) => i + 1);
    }, 4200);

    return () => clearInterval(interval);
  }, [streamIndex]);

  return logs;
}

export function useLiveClock(tickMs = 1000): string {
  const [time, setTime] = useState(() => new Date().toISOString().slice(11, 19));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toISOString().slice(11, 19));
    }, tickMs);
    return () => clearInterval(interval);
  }, [tickMs]);

  return time;
}

export function useAnimatedValue(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
