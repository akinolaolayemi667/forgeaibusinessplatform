import { Link } from 'react-router-dom'
import { buttonStyles } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export function DemoPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        eyebrow="Demo"
        title="Walk Harbor & Co."
        description="Open the workspace with sample records. Sign in if you want the header to carry your name. Nothing is sent to a server."
      />
      <div className="flex flex-wrap gap-2">
        <Link to="/app" className={buttonStyles()}>
          Enter the workspace
        </Link>
        <Link to="/login" className={buttonStyles('outline')}>
          Sign in
        </Link>
      </div>
    </div>
  )
}
