import { ROUTES } from '@/routes/paths';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  code: string;
  description: string;
}

export const DASHBOARD_NAV: NavItem[] = [
  {
    id: 'overview',
    label: 'Mission Overview',
    path: ROUTES.dashboard,
    code: '01',
    description: 'Active missions and telemetry summary',
  },
  {
    id: 'sar-upload',
    label: 'SAR Upload',
    path: ROUTES.sarAnalysis,
    code: '02',
    description: 'Chandrayaan-2 SAR imagery ingestion',
  },
  {
    id: 'ai-analysis',
    label: 'AI Analysis',
    path: ROUTES.aiAnalysis,
    code: '03',
    description: 'Neural subsurface ice inference pipeline',
  },
  {
    id: 'landing-intelligence',
    label: 'Landing Intelligence',
    path: ROUTES.landingIntelligence,
    code: '04',
    description: 'Site scoring and risk assessment',
  },
  {
    id: 'simulation',
    label: 'Mission Simulation',
    path: ROUTES.simulation,
    code: '05',
    description: 'Virtual rover deployment and telemetry',
  },
  {
    id: 'reports',
    label: 'Reports',
    path: ROUTES.reports,
    code: '06',
    description: 'Exportable mission summaries',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.settings,
    code: '07',
    description: 'Platform configuration',
  },
];

export const MISSION_STATUS = {
  nominal: 'NOMINAL',
  active: 'ACTIVE',
  standby: 'STANDBY',
} as const;

export type MissionStatus = (typeof MISSION_STATUS)[keyof typeof MISSION_STATUS];
