import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  FileText,
  LayoutDashboard,
  MapPin,
  Rocket,
  ScanSearch,
  Settings,
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

export const DASHBOARD_NAV: NavItem[] = [
  {
    id: 'overview',
    label: 'Mission Overview',
    path: ROUTES.dashboard,
    icon: LayoutDashboard,
    description: 'Active missions and telemetry summary',
  },
  {
    id: 'sar-upload',
    label: 'SAR Upload',
    path: ROUTES.sarAnalysis,
    icon: ScanSearch,
    description: 'Chandrayaan-2 SAR imagery ingestion',
  },
  {
    id: 'ai-analysis',
    label: 'AI Analysis',
    path: ROUTES.aiAnalysis,
    icon: BrainCircuit,
    description: 'Neural subsurface ice inference pipeline',
  },
  {
    id: 'landing-intelligence',
    label: 'Landing Intelligence',
    path: ROUTES.landingIntelligence,
    icon: MapPin,
    description: 'Site scoring and risk assessment',
  },
  {
    id: 'simulation',
    label: 'Mission Simulation',
    path: ROUTES.simulation,
    icon: Rocket,
    description: 'Virtual rover deployment and telemetry',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: ROUTES.reports,
    icon: FileText,
    description: 'Exportable mission summaries',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.settings,
    icon: Settings,
    description: 'Platform configuration',
  },
];

export const MISSION_STATUS = {
  nominal: 'NOMINAL',
  active: 'ACTIVE',
  standby: 'STANDBY',
} as const;

export type MissionStatus = (typeof MISSION_STATUS)[keyof typeof MISSION_STATUS];
