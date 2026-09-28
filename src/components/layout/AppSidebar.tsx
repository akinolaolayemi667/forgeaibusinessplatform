import { NavLink } from 'react-router-dom'
import { appNav } from '@/data/navigation'
import { cn } from '@/lib/cn'

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Workspace">
      <ul className="flex flex-col gap-1">
        {appNav.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 border-l-2 px-3 py-2 text-sm no-underline',
                    isActive
                      ? 'border-ember bg-wash font-medium text-copy'
                      : 'border-transparent text-muted hover:bg-wash hover:text-copy',
                  )
                }
              >
                <Icon aria-hidden size={18} />
                {item.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
