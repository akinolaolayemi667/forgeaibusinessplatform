import { Link } from 'react-router-dom'
import { forgeData } from '@/data'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/Button'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryState } from '@/components/ui/QueryState'
import { cn } from '@/lib/cn'
import { useAsyncData } from '@/hooks/useAsyncData'

export function PricingPage() {
  const query = useAsyncData('plans', () => forgeData.listPlans())

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Pricing"
        title="Seats, not a maze of add-ons"
        description="Prices for the preview. Checkout is not wired up."
      />
      <QueryState loading={query.loading} error={query.error}>
        <div className="grid gap-4 lg:grid-cols-3">
          {(query.data ?? []).map((plan) => (
            <Card key={plan.id} className={cn('h-full', plan.featured && 'border-ember')}>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{plan.name}</CardTitle>
                {plan.featured ? <Badge variant="accent">Team default</Badge> : null}
              </div>
              <p className="type-data text-4xl text-copy">{plan.price}</p>
              <CardDescription>{plan.period}</CardDescription>
              <p className="text-sm text-copy">{plan.description}</p>
              <ul className="flex flex-col gap-2 text-sm text-copy">
                {plan.highlights.map((item) => (
                  <li key={item} className="border-t border-stroke pt-2">
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={buttonStyles(plan.featured ? 'primary' : 'outline')}>
                Start a preview
              </Link>
            </Card>
          ))}
        </div>
      </QueryState>
    </div>
  )
}
