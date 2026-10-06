import { AccessHome } from '@/pages/admin/AccessHome'
import { superAdminNavigation } from '@/data/accessNavigation'

export function SuperAdminDashboardPage() {
  return (
    <AccessHome
      eyebrow="FORGE SUPER ADMIN"
      title="Platform Administration"
      description="Platform access is read from the database role. This screen is the super admin route shell."
      items={superAdminNavigation}
    />
  )
}