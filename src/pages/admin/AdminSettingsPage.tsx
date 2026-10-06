import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminSettingsSection, AdminToggle } from '@/components/admin/AdminSettingsSection'
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import { adminIntegrations, adminNotificationDefaults, adminOrganization } from '@/data/adminData'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

const sections = [
  { id: 'general', label: 'General' },
  { id: 'organization', label: 'Organization' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'integrations', label: 'Integrations' },
] as const

export function AdminSettingsPage() {
  const { user, organization } = useAuth()
  const [section, setSection] = useState<(typeof sections)[number]['id']>('general')
  const [name, setName] = useState(organization?.name ?? adminOrganization.name)
  const [slug, setSlug] = useState(organization?.slug ?? adminOrganization.slug)
  const [timezone, setTimezone] = useState(adminOrganization.timezone)
  const [currency, setCurrency] = useState(adminOrganization.currency)
  const [notes, setNotes] = useState(adminNotificationDefaults)
  const [saved, setSaved] = useState('')
  const provider = providerName(user?.app_metadata)

  return (
    <>
      <PageHeader title="SETTINGS" description="Organization controls for this session. Secrets are not shown." />
      <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
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
        <div className="flex flex-col gap-4">
          {section === 'general' ? (
            <AdminSettingsSection id="general" title="General" description="Name, address, and defaults used across the organization.">
              <TextField id="org-name" label="Organization Name" value={name} onChange={setName} />
              <TextField id="org-slug" label="Organization Slug" value={slug} onChange={setSlug} />
              <TextField id="org-timezone" label="Timezone" value={timezone} onChange={setTimezone} />
              <TextField id="org-currency" label="Default Currency" value={currency} onChange={setCurrency} />
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSaved('General settings saved for this session.')}
                >
                  Save general
                </Button>
                {saved ? <p className="text-sm text-ash">{saved}</p> : null}
              </div>
            </AdminSettingsSection>
          ) : null}
          {section === 'organization' ? (
            <AdminSettingsSection id="organization" title="Organization" description="The organization attached to this admin session.">
              <p className="text-sm text-paper">{name}</p>
              <p className="font-mono text-xs text-ash">{slug}</p>
              <p className="text-sm text-ash">
                {timezone} · {currency}
              </p>
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
            <AdminSettingsSection id="notifications" title="Notifications" description="Which organization alerts this preview keeps enabled.">
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
                  <dd className="mt-1 text-paper">{user?.email ?? 'No authenticated email on this session'}</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">OAuth providers</dt>
                  <dd className="mt-1 text-paper">Google and Discord are the configured sign-in providers. This session used {provider}.</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">Login security</dt>
                  <dd className="mt-1 text-paper">Access tokens stay with the Supabase session in this browser.</dd>
                </div>
                <div>
                  <dt className="type-kicker text-ash">Active sessions</dt>
                  <dd className="mt-1 text-paper">This browser</dd>
                </div>
              </dl>
            </AdminSettingsSection>
          ) : null}
          {section === 'integrations' ? (
            <AdminSettingsSection id="integrations" title="Integrations" description="Connections available to the organization.">
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

function providerName(metadata: unknown) {
  if (metadata && typeof metadata === 'object' && 'provider' in metadata) {
    const provider = (metadata as { provider?: unknown }).provider
    if (typeof provider === 'string' && provider.trim()) return provider
  }
  return 'an existing provider'
}
