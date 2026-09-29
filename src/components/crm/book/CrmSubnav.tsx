import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

const links = [
  { to: '/app/crm', label: 'Overview', end: true },
  { to: '/app/crm/contacts', label: 'Contacts', end: false },
  { to: '/app/crm/companies', label: 'Companies', end: false },
]

export function CrmSubnav() {
  return (
    <nav aria-label="CRM" className="border-b border-stroke">
      <ul className="flex gap-4 overflow-x-auto">
        {links.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex border-b-2 py-2 text-sm no-underline',
                  isActive ? 'border-ember font-medium text-copy' : 'border-transparent text-muted hover:text-copy',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
