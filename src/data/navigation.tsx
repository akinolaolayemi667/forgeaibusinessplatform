import {
  BarChart3,
  BookUser,
  CreditCard,
  Kanban,
  LayoutDashboard,
  MessageSquare,
  Plug,
  Settings,
  Sparkles,
  UserPlus,
  Users,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AppNavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const marketingNav = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/case-study', label: 'Case study' },
  { to: '/demo', label: 'Demo' },
] as const

export const appNav: AppNavItem[] = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/leads', label: 'Leads', icon: UserPlus },
  { to: '/app/contacts', label: 'Contacts', icon: BookUser },
  { to: '/app/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/app/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/app/automations', label: 'Automations', icon: Workflow },
  { to: '/app/ai', label: 'Assistant', icon: Sparkles },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/integrations', label: 'Integrations', icon: Plug },
  { to: '/app/team', label: 'Team', icon: Users },
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/billing', label: 'Billing', icon: CreditCard },
]
