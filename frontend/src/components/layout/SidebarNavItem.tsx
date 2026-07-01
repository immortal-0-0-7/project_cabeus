import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NavItem } from '@/types/navigation';
import { cn } from '@/utils/cn';

export interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  index: number;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, collapsed, onNavigate }: SidebarNavItemProps) {
  return (
    <li>
      <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3.5 rounded-sm px-3.5 py-3.5 transition-colors duration-500',
            isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="rail-active"
                className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-gradient-to-b from-warning to-danger"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span
              className={cn(
                'flex size-[18px] shrink-0 items-center justify-center font-mono text-xs tracking-wider transition-colors duration-500',
                isActive ? 'text-mission' : 'text-text-muted group-hover:text-text-secondary',
              )}
            >
              {item.code}
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1 truncate text-base font-medium tracking-normal">
                {item.label}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}
