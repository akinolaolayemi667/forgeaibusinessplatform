import { supabase } from '@/lib/supabase'

export type PlatformCount = {
  status: 'live' | 'unavailable'
  value: number | null
}

export type PlatformOverview = {
  organizations: PlatformCount
  users: PlatformCount
  platformAdmins: PlatformCount
  superAdmins: PlatformCount
}

export async function getPlatformOverview(): Promise<PlatformOverview> {
  const [organizations, users, platformAdmins, superAdmins] = await Promise.all([
    countTable('organizations', 'id'),
    countTable('profiles', 'id'),
    countTable('platform_roles', 'user_id', 'admin'),
    countTable('platform_roles', 'user_id', 'super_admin'),
  ])

  return { organizations, users, platformAdmins, superAdmins }
}

async function countTable(table: 'organizations' | 'profiles' | 'platform_roles', column: 'id' | 'user_id', role?: 'admin' | 'super_admin'): Promise<PlatformCount> {
  let query = supabase.from(table).select(column, { count: 'exact', head: true })
  if (role) query = query.eq('role', role)
  const { count, error } = await query
  if (error || count === null) return { status: 'unavailable', value: null }
  return { status: 'live', value: count }
}
