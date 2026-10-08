import { PageHeader } from '@/components/ui/PageHeader'

export function SuperAdminPlaceholderPage({ title, phase }: { title: string; phase: string }) {
  return (
    <>
      <PageHeader title={title} description="This platform area is not built yet." />
      <section className="border border-stroke bg-surface-raised px-4 py-8 sm:px-5">
        <p className="type-kicker text-ember">{phase}</p>
        <p className="mt-3 max-w-xl text-sm text-ash">No records, metrics, or sample data are shown here.</p>
      </section>
    </>
  )
}
