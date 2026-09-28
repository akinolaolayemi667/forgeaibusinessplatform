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
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm no-underline',
                    isActive ? 'bg-wash text-copy' : 'text-muted hover:bg-wash hover:text-copy',
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
