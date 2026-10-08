import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminSettingsSection, AdminToggle } from '@/components/admin/AdminSettingsSection'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import { adminIntegrations, adminNotificationDefaults } from '@/data/adminData'
import { useAuth } from '@/hooks/useAuth'
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings'
import { cn } from '@/lib/cn'
import { normalizeOrganizationSlug, validateOrganizationName, validateOrganizationSlug } from '@/lib/organizationSettings'

const sections = [
  { id: 'general', label: 'General' },
  { id: 'organization', label: 'Organization' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'integrations', label: 'Integrations' },
] as const

export function AdminSettingsPage() {
  const { user, organization, organizationRole, isSuperAdmin, refreshAccess } = useAuth()
  const settings = useOrganizationSettings(organization?.id ?? null)
  const [section, setSection] = useState<(typeof sections)[number]['id']>('general')
  const [attempted, setAttempted] = useState(false)
  const [notes, setNotes] = useState(adminNotificationDefaults)
  const provider = providerName(user?.app_metadata)
  const canEdit = isSuperAdmin || organizationRole === 'owner' || organizationRole === 'admin'
  const nameError = attempted || settings.name !== (settings.record?.name ?? '') ? validateOrganizationName(settings.name) : null
  const slugError = attempted || settings.slug !== (settings.record?.slug ?? '') ? validateOrganizationSlug(settings.slug) : null
  const unchanged = Boolean(
    settings.record &&
      settings.name.trim() === settings.record.name &&
      normalizeOrganizationSlug(settings.slug) === settings.record.slug,
  )

  async function saveGeneral() {
    setAttempted(true)
    if (!canEdit || !settings.record || validateOrganizationName(settings.name) || validateOrganizationSlug(settings.slug) || unchanged) return
    const saved = await settings.save({ name: settings.name, slug: settings.slug })
    if (!saved) return
    try {
      await refreshAccess()
    } catch (caught) {
      if (import.meta.env.DEV) console.info('organization access refresh', caught)
    }
  }

  return (
    <>
      <PageHeader title="SETTINGS" description="Organization name and slug are stored for this organization. Other controls on this page are not persisted." />
      <div className="grid min-w-0 gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="flex gap-2 overflow-x-auto lg:flex-col">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? 'true' : undefined}
              className={cn('h-10 shrink-0 border px-3 text-left text-sm', section === item.id ? 'border-ember text-paper' : 'border-stroke text-ash hover:text-paper')}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-4">
          {section === 'general' ? (
            <AdminSettingsSection id="general" title="General" description="Name and slug written to this organization.">
              {!organization ? <p className="text-sm text-ash">No organization is attached to this session.</p> : null}
              {organization && settings.loading ? <p className="text-sm text-ash">Loading organization settings.</p> : null}
              {settings.error ? <p role="alert" className="text-sm text-badge-danger-fg">{settings.error}</p> : null}
              {organization && !settings.loading && settings.record ? (
                <>
                  <TextField
                    id="org-name"
                    label="Organization Name"
                    value={settings.name}
                    onChange={settings.setName}
                    disabled={!canEdit || settings.saving}
                    error={nameError ?? undefined}
                  />
                  <TextField
                    id="org-slug"
                    label="Organization Slug"
                    value={settings.slug}
                    onChange={settings.setSlug}
                    disabled={!canEdit || settings.saving}
                    hint="Lowercase letters, numbers, and single hyphens. 2 to 48 characters."
                    error={slugError ?? undefined}
                  />
                  {canEdit ? null : <p className="text-sm text-ash">Owners and admins can update this organization.</p>}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button loading={settings.saving} disabled={!canEdit || unchanged || Boolean(nameError || slugError)} onClick={() => void saveGeneral()}>
                      Save organization
                    </Button>
                    {settings.notice ? <p role="status" className="text-sm text-ash">{settings.notice}</p> : null}
                  </div>
                </>
              ) : null}
            </AdminSettingsSection>
          ) : null}
          {section === 'organization' ? (
            <AdminSettingsSection id="organization" title="Organization" description="The organization attached to this admin session.">
              {settings.record ? (
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="type-kicker text-ash">Name</dt>
                    <dd className="mt-1 break-words text-paper">{settings.record.name}</dd>
                  </div>
                  <div>
                    <dt className="type-kicker text-ash">Slug</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-paper">{settings.record.slug}</dd>
                  </div>
                  <div>
                    <dt className="type-kicker text-ash">Organization ID</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-ash">{settings.record.id}</dd>
                  </div>
                  <div>
                    <dt className="type-kicker text-ash">Updated</dt>
                    <dd className="mt-1 text-paper">{formatStamp(settings.record.updatedAt)}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-ash">{settings.loading ? 'Loading organization settings.' : 'No organization is attached to this session.'}</p>
              )}
            </AdminSettingsSection>
          ) : null}
          {section === 'team' ? (
            <AdminSettingsSection id="team" title="Team" description="Membership is managed from the team roster.">
              <Link to="/admin/users" className="text-sm text-ember no-underline hover:text-ember-hot">
                Open team members
              </Link>
            </AdminSettingsSection>
          ) : null}
          {section === 'notifications' ? (
            <AdminSettingsSection id="notifications" title="Notifications" description="Not stored. These toggles stay in this browser session only.">
              <AdminToggle id="notify-email" label="Email notifications" checked={notes.email} onChange={(email) => setNotes({ ...notes, email })} />
              <AdminToggle id="notify-automation" label="Automation alerts" checked={notes.automation} onChange={(automation) => setNotes({ ...notes, automation })} />
              <AdminToggle id="notify-team" label="Team activity alerts" checked={notes.team} onChange={(team) => setNotes({ ...notes, team })} />
              <AdminToggle id="notify-billing" label="Billing alerts" checked={notes.billing} onChange={(billing) => setNotes({ ...notes, billing })} />
            </AdminSettingsSection>
          ) : null}
          {section === 'security' ? (
            <AdminSettingsSection id="security" title="Security" description="The current sign-in. Provider secrets are not displayed.">
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="type-kicker text-ash">Session</dt>
                  <dd className="mt-1 break-all text-paper">{user?.email ?? 'No authenticated email on this session'}</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">Organization role</dt>
                  <dd className="mt-1 text-paper">{organizationRole ?? 'No organization role on this session'}</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">OAuth providers</dt>
                  <dd className="mt-1 text-paper">Google and Discord are the configured sign-in providers. This session used {provider}.</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">Login security</dt>
                  <dd className="mt-1 text-paper">Access tokens stay with the Supabase session in this browser.</dd>
                </div>
              </dl>
            </AdminSettingsSection>
          ) : null}
          {section === 'integrations' ? (
            <AdminSettingsSection id="integrations" title="Integrations" description="Sample connection states. Not read from this organization.">
              <ul className="flex flex-col gap-2">
                {adminIntegrations.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 border border-stroke px-3 py-3">
                    <span className="text-sm text-paper">{item.name}</span>
                    <AdminStatusBadge status={item.state} />
                  </li>
                ))}
              </ul>
              <Link to="/app/integrations" className="text-sm text-ember no-underline hover:text-ember-hot">
                Open workspace integrations
              </Link>
            </AdminSettingsSection>
          ) : null}
        </div>
      </div>
    </>
  )
}

function formatStamp(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
}

function providerName(metadata: unknown) {
  if (metadata && typeof metadata === 'object' && 'provider' in metadata) {
    const provider = (metadata as { provider?: unknown }).provider
    if (typeof provider === 'string' && provider.trim()) return provider
  }
  return 'an existing provider'
}
