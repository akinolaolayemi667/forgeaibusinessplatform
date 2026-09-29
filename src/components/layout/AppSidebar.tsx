import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { appPrimaryNav, appUtilityNav, type AppNavItem } from '@/data/navigation'
import { cn } from '@/lib/cn'

export function AppSidebar({
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
      <nav aria-label="Workspace" className="min-h-0 flex-1 overflow-y-auto">
        <NavList items={appPrimaryNav} collapsed={collapsed} onNavigate={onNavigate} />
      </nav>
      <nav aria-label="Account" className="border-t border-stroke pt-3">
        <NavList items={appUtilityNav} collapsed={collapsed} onNavigate={onNavigate} />
      </nav>
      {onToggleCollapse ? (
        <button
          type="button"
          className="hidden h-10 cursor-pointer items-center gap-2 rounded-sm px-3 text-sm text-muted hover:bg-wash hover:text-copy lg:inline-flex"
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

function NavList({
  items,
  collapsed,
  onNavigate,
}: {
  items: AppNavItem[]
  collapsed: boolean
  onNavigate?: () => void
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon
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
                  isActive
                    ? 'border-ember bg-wash font-medium text-copy'
                    : 'border-transparent text-muted hover:bg-wash hover:text-copy',
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
  )
}
