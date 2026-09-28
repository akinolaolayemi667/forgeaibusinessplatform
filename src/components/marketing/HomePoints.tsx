import type { HomePoint } from '@/types'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'

export function HomePoints({ points }: { points: HomePoint[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {points.map((point) => (
        <li key={point.id}>
          <Card className="h-full">
            <p className="type-kicker text-ember">{point.kicker}</p>
            <CardTitle as="h3">{point.title}</CardTitle>
            <CardDescription>{point.summary}</CardDescription>
          </Card>
        </li>
      ))}
    </ol>
  )
}
