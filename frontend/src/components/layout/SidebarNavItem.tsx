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
  const Icon = item.icon;

  return (
    <li>
      <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 px-3 py-3 transition-colors duration-500',
            isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="rail-active"
                className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-mission"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <Icon
              className={cn(
                'size-[18px] shrink-0 transition-colors duration-500',
                isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary',
              )}
              strokeWidth={1.25}
            />
            {!collapsed && (
              <span className="truncate text-sm font-medium tracking-tight">{item.label}</span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}
