import { supabase } from '@/lib/supabase'
import type { OrganizationDraft, OrganizationRecord } from '@/types/organizationSettings'

type OrganizationRow = {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export function validateOrganizationName(name: string) {
  const value = name.trim()
  if (value.length < 1 || value.length > 80) return 'Use 1 to 80 characters.'
  return null
}

export function validateOrganizationSlug(slug: string) {
  const value = slug.trim().toLowerCase()
  if (value.length < 2 || value.length > 48) return 'Use 2 to 48 characters.'
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, numbers, and single hyphens.'
  return null
}

export function normalizeOrganizationSlug(slug: string) {
  return slug.trim().toLowerCase()
}

export async function getOrganization(organizationId: string): Promise<OrganizationRecord | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, created_at, updated_at')
    .eq('id', organizationId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return mapOrganization(data as OrganizationRow)
}

export async function updateOrganization(organizationId: string, draft: OrganizationDraft): Promise<OrganizationRecord> {
  const name = draft.name.trim()
  const slug = normalizeOrganizationSlug(draft.slug)
  const nameError = validateOrganizationName(name)
  const slugError = validateOrganizationSlug(slug)
  if (nameError) throw new Error(nameError)
  if (slugError) throw new Error(slugError)

  const { data, error } = await supabase
    .from('organizations')
    .update({ name, slug })
    .eq('id', organizationId)
    .select('id, name, slug, created_at, updated_at')

  if (error) throw error
  const row = Array.isArray(data) ? data[0] : null
  if (!row) throw new Error('not_authorized')
  return mapOrganization(row as OrganizationRow)
}

export function organizationMessage(error: unknown, fallback: string) {
  const message = errorText(error)
  if (/duplicate key|organizations_slug|23505/i.test(message)) return 'That slug is already in use.'
  if (/not_authorized|permission denied|row-level security/i.test(message)) return 'You do not have permission to update this organization.'
  if (message && !/jwt|token|stack/i.test(message)) return message
  return fallback
}

function mapOrganization(row: OrganizationRow): OrganizationRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function errorText(error: unknown) {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') return error.code
  return ''
}
