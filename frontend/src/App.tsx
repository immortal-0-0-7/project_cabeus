import { RouterProvider } from 'react-router-dom';
import { UIProvider } from '@/store/uiContext';
import { router } from '@/routes';

export function App() {
  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  );
}
