import { forgeData } from '@/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'

export function ArchitecturePage() {
  const query = useAsyncData('architecture', () => forgeData.getArchitecture())

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Architecture"
        title="A seam you can replace"
        description="The preview is a real app shell. Live data later plugs into ForgeDataSource."
      />
      <QueryState loading={query.loading} error={query.error}>
        <ol className="flex flex-col gap-3">
          {(query.data ?? []).map((layer, index) => (
            <li key={layer.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-lg border border-stroke bg-surface-raised p-4">
              <span className="font-display text-2xl text-ember">{index + 1}</span>
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-xl text-copy">{layer.name}</h2>
                <p className="text-sm text-muted">{layer.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </QueryState>
    </div>
  )
}
