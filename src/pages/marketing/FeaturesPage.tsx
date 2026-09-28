import { forgeData } from '@/data'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'

export function FeaturesPage() {
  const query = useAsyncData('features', () => forgeData.listFeatures())

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Product"
        title="What the workspace holds"
        description="Six places the team actually works. Later phases fill these screens; the records underneath are already shaped."
      />
      <QueryState loading={query.loading} error={query.error}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(query.data ?? []).map((feature) => (
            <Card key={feature.id} className="h-full">
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.summary}</CardDescription>
            </Card>
          ))}
        </div>
      </QueryState>
    </div>
  )
}
