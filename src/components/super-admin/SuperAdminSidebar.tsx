import { NavLink } from 'react-router-dom'
import { ArrowLeft, BarChart3, Building2, Cpu, CreditCard, Layers, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Plug, ScrollText, Server, Settings, Shield, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { platformNavigation } from '@/data/accessNavigation'
import { cn } from '@/lib/cn'

const icons: Record<string, LucideIcon> = {
  '/super-admin': LayoutDashboard,
  '/super-admin/organizations': Building2,
  '/super-admin/users': Users,
  '/super-admin/admins': Shield,
  '/super-admin/analytics': BarChart3,
  '/super-admin/revenue': CreditCard,
  '/super-admin/ai-usage': Cpu,
  '/super-admin/plans': Layers,
  '/super-admin/integrations': Plug,
  '/super-admin/system': Server,
  '/super-admin/audit-logs': ScrollText,
  '/super-admin/settings': Settings,
}

export function SuperAdminSidebar({
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
      <nav aria-label="Platform control" className="min-h-0 flex-1 overflow-y-auto">
        <p className={cn('type-kicker px-3 text-ember', collapsed && 'sr-only')}>Overview</p>
        <div className="mt-3 flex flex-col gap-4">
          {platformNavigation.map((group) => (
            <div key={group.id}>
              <p className={cn('type-kicker px-3 text-ash', collapsed && 'sr-only')}>{group.label}</p>
              <ul className="mt-1 flex flex-col gap-1">
                {group.items.map((item) => {
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
            </div>
          ))}
        </div>
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
