import { forgeData } from '@/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { useAsyncData } from '@/hooks/useAsyncData'

export function CaseStudyPage() {
  const query = useAsyncData('case-study', () => forgeData.getCaseStudy())
  const study = query.data

  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <PageHeader
        eyebrow="Case study"
        title={study?.client ?? 'Sample workspace'}
        description={study?.sector}
      />
      <QueryState loading={query.loading} error={query.error}>
        {study ? (
          <>
            <p className="text-base text-copy">{study.summary}</p>
            <dl className="grid gap-4 sm:grid-cols-3">
              {study.outcomes.map((outcome) => (
                <div key={outcome.label} className="rounded-lg border border-stroke bg-surface-raised p-4">
                  <dt className="text-sm text-muted">{outcome.label}</dt>
                  <dd className="font-display text-3xl text-copy">{outcome.value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </QueryState>
    </article>
  )
}
