import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { buttonStyles } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export function NotFoundPage({ framed = false }: { framed?: boolean }) {
  const content = (
    <div className="flex flex-col gap-6">
      {framed ? <Logo /> : null}
      <PageHeader
        eyebrow="404"
        title="This route is not on the floor plan."
        description="The address does not match a FORGE page."
      />
      <div className="flex flex-wrap gap-2">
        <Link to="/" className={buttonStyles()}>
          Back to FORGE
        </Link>
        <Link to="/app" className={buttonStyles('outline')}>
          Open workspace
        </Link>
      </div>
    </div>
  )

  if (!framed) return content

  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 outline-none">
      {content}
    </main>
  )
}
