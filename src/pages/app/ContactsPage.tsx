import { forgeData } from '@/data'
import { ContactTable } from '@/components/crm/ContactTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function ContactsPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`contacts:${workspace.id}`, () => forgeData.listContacts(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="CRM" title="Contacts" description={`People already on record at ${workspace.name}.`} />
      <QueryState loading={query.loading} error={query.error}>
        <ContactTable rows={query.data ?? []} />
      </QueryState>
    </div>
  )
}
