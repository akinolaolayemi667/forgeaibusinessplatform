import { Outlet } from 'react-router-dom'
import { LeadToast } from '@/components/leads/LeadToast'
import { LeadsProvider } from '@/hooks/useLeads'

export function LeadsLayout() {
  return (
    <LeadsProvider>
      <Outlet />
      <LeadToast />
    </LeadsProvider>
  )
}
