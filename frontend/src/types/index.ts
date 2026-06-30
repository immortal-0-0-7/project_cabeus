export type { NavItem, MissionStatus } from '@/types/navigation';
export { DASHBOARD_NAV, MISSION_STATUS } from '@/types/navigation';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  className?: string;
}

export interface MotionProps {
  delay?: number;
  duration?: number;
}

export type ThemeColor =
  | 'ice'
  | 'mission'
  | 'cinematic'
  | 'signal'
  | 'warning'
  | 'danger';

export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}
