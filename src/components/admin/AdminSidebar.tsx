import { NavLink } from 'react-router-dom'
import { ArrowLeft, BarChart3, CreditCard, LayoutDashboard, ScrollText, Settings, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { adminNavigation } from '@/data/accessNavigation'
import { cn } from '@/lib/cn'

const icons: Record<string, LucideIcon> = {
  '/admin': LayoutDashboard,
  '/admin/users': Users,
  '/admin/analytics': BarChart3,
  '/admin/activity': ScrollText,
  '/admin/billing': CreditCard,
  '/admin/settings': Settings,
}

export function AdminSidebar({
  collapsed = false,
  onNavigate,
  onToggleCollapse,
}: {
  collapsed?: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <nav aria-label="Administration" className="min-h-0 flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {adminNavigation.map((item) => {
            const Icon = icons[item.to] ?? LayoutDashboard
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={item.label}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 border-l-2 py-2 text-sm no-underline',
                      collapsed ? 'justify-center px-2' : 'px-3',
                      isActive ? 'border-ember bg-wash font-medium text-paper' : 'border-transparent text-ash hover:bg-wash hover:text-paper',
                    )
                  }
                >
                  <Icon aria-hidden size={18} className="shrink-0" />
                  <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-stroke pt-3">
        <NavLink
          to="/app"
          onClick={onNavigate}
          className={cn('flex items-center gap-2 px-3 py-2 text-sm text-stone no-underline hover:bg-wash hover:text-paper', collapsed && 'justify-center px-2')}
        >
          <ArrowLeft aria-hidden size={18} />
          <span className={collapsed ? 'sr-only' : ''}>Back to Workspace</span>
        </NavLink>
      </div>
      {onToggleCollapse ? (
        <button
          type="button"
          className="hidden h-10 cursor-pointer items-center gap-2 px-3 text-sm text-ash hover:bg-wash hover:text-paper lg:inline-flex"
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapse}
        >
          {collapsed ? <PanelLeftOpen aria-hidden size={18} /> : <PanelLeftClose aria-hidden size={18} />}
          <span className={collapsed ? 'sr-only' : ''}>{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      ) : null}
    </div>
  )
}
