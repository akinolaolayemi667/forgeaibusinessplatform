import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import { useSession } from '@/hooks/useSession'
import { useWorkspace } from '@/hooks/useWorkspace'

export function SettingsPage() {
  const { user, signIn } = useSession()
  const { workspace } = useWorkspace()
  const [name, setName] = useState(user?.name ?? '')
  const [status, setStatus] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) {
      setStatus('Sign in to keep an operator name in this tab.')
      return
    }
    if (!name.trim()) {
      setStatus('Enter a name.')
      return
    }
    signIn({ ...user, name: name.trim() })
    setStatus('Operator name saved for this tab.')
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace"
        description="The open workspace is sample data. Your operator name can be stored in this tab."
      />
      <Card>
        <CardTitle as="h2">Operator</CardTitle>
        <CardDescription>
          {workspace.name}
          {user ? ` · ${user.email}` : ' · not signed in'}
        </CardDescription>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <TextField id="operator-name" label="Name" autoComplete="name" value={name} onChange={setName} />
          <Button type="submit">Save name</Button>
        </form>
        {status ? (
          <p role="status" className="text-sm text-muted">
            {status}
          </p>
        ) : null}
      </Card>
    </div>
  )
}
