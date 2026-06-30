import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import {
  OverviewWorkspace,
  SARUploadWorkspace,
  AIAnalysisWorkspace,
  LandingIntelligenceWorkspace,
  SimulationWorkspace,
  ReportsWorkspace,
  SettingsWorkspace,
} from '@/features/dashboard';
import { ROUTES } from '@/routes/paths';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: ROUTES.dashboard,
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OverviewWorkspace /> },
          { path: 'sar-analysis', element: <SARUploadWorkspace /> },
          { path: 'ai-analysis', element: <AIAnalysisWorkspace /> },
          { path: 'landing-intelligence', element: <LandingIntelligenceWorkspace /> },
          { path: 'simulation', element: <SimulationWorkspace /> },
          { path: 'reports', element: <ReportsWorkspace /> },
          { path: 'settings', element: <SettingsWorkspace /> },
        ],
      },
    ],
  },
]);
