import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NavItem } from '@/types/navigation';
import { cn } from '@/utils/cn';
import { slideFromLeft } from '@/utils/motion';

export interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  index: number;
  onNavigate?: () => void;
}

export function SidebarNavItem({ item, collapsed, index, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <motion.li variants={slideFromLeft} custom={index}>
      <NavLink
        to={item.path}
        end={item.path === '/dashboard'}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
            'border border-transparent',
            isActive
              ? 'bg-ice/10 text-ice border-ice/20 shadow-[inset_0_0_20px_rgb(103_216_255/0.06)]'
              : 'text-text-secondary hover:border-border-subtle hover:bg-white/4 hover:text-text-primary',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="sidebar-active-indicator"
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-ice"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              className={cn(
                'size-[18px] shrink-0 transition-colors duration-200',
                isActive ? 'text-ice' : 'text-text-muted group-hover:text-text-secondary',
              )}
              strokeWidth={1.75}
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.label}</span>
                <span className="block truncate text-[11px] text-text-muted">{item.description}</span>
              </div>
            )}
          </>
        )}
      </NavLink>
    </motion.li>
  );
}
