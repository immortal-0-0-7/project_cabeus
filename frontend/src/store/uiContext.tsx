import { createContext, useContext, useState, type ReactNode } from 'react';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  toggleSidebarCollapsed: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  toggleSidebarMobile: () => void;
}

const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const value: UIState = {
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebarCollapsed: () => setSidebarCollapsed((prev) => !prev),
    setSidebarMobileOpen,
    toggleSidebarMobile: () => setSidebarMobileOpen((prev) => !prev),
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIState {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
}
