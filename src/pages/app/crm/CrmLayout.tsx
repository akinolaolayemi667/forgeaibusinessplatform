import { Outlet } from 'react-router-dom'
import { CrmSubnav } from '@/components/crm/book/CrmSubnav'
import { CrmToast } from '@/components/crm/book/CrmToast'
import { CrmProvider } from '@/hooks/useCrm'

export function CrmLayout() {
  return (
    <CrmProvider>
      <div className="flex flex-col gap-6">
        <CrmSubnav />
        <Outlet />
      </div>
      <CrmToast />
    </CrmProvider>
  )
}
