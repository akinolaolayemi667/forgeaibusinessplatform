import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import { useSession } from '@/hooks/useSession'
import { isEmail } from '@/utils/format'

export function SignupPage() {
  const navigate = useNavigate()
  const { signIn } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = {
      name: name.trim() ? undefined : 'Enter your name.',
      email: isEmail(email) ? undefined : 'Enter a valid email.',
      password: password.length >= 8 ? undefined : 'Use at least 8 characters.',
      confirm: confirm === password ? undefined : 'Passwords do not match.',
    }
    setErrors(next)
    if (next.name || next.email || next.password || next.confirm) return
    signIn({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      role: 'Owner',
    })
    navigate('/app')
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <PageHeader
        eyebrow="Sign up"
        title="Create an operator profile"
        description="This stores a name and email in the current tab so the workspace header can greet you."
      />
      <Card>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <TextField id="signup-name" label="Name" autoComplete="name" value={name} onChange={setName} error={errors.name} />
          <TextField id="signup-email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
          <TextField
            id="signup-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            hint="At least 8 characters. Not sent to a server."
          />
          <TextField
            id="signup-confirm"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={setConfirm}
            error={errors.confirm}
          />
          <Button type="submit">Create profile</Button>
        </form>
      </Card>
      <p className="text-sm text-muted">
        Already have a tab session?{' '}
        <Link to="/login" className="text-copy underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
