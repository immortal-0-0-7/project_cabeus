export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  sarAnalysis: '/dashboard/sar-analysis',
  aiAnalysis: '/dashboard/ai-analysis',
  landingIntelligence: '/dashboard/landing-intelligence',
  simulation: '/dashboard/simulation',
  reports: '/dashboard/reports',
  settings: '/dashboard/settings',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
