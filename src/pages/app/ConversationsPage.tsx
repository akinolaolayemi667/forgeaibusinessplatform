import { forgeData } from '@/data'
import { ConversationList } from '@/components/crm/ConversationList'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useWorkspace } from '@/hooks/useWorkspace'

export function ConversationsPage() {
  const { workspace } = useWorkspace()
  const query = useAsyncData(`conversations:${workspace.id}`, () => forgeData.listConversations(workspace.id))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Inbox"
        title="Conversations"
        description="The latest note on each thread. A full reply composer is a later phase."
      />
      <QueryState loading={query.loading} error={query.error}>
        <ConversationList rows={query.data ?? []} />
      </QueryState>
    </div>
  )
}
