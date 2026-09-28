import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { TextField } from '@/components/ui/TextField'
import { useSession } from '@/hooks/useSession'
import { isEmail, nameFromEmail } from '@/utils/format'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = {
      email: isEmail(email) ? undefined : 'Enter a valid email.',
      password: password.length >= 8 ? undefined : 'Use at least 8 characters.',
    }
    setErrors(next)
    if (next.email || next.password) return
    signIn({
      id: crypto.randomUUID(),
      name: nameFromEmail(email),
      email: email.trim(),
      role: 'Owner',
    })
    navigate('/app')
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <PageHeader
        eyebrow="Log in"
        title="Open a tab session"
        description="The preview accepts any password of 8 or more characters and keeps it in this tab only."
      />
      <Card>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <TextField id="login-email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
          <TextField
            id="login-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            hint="Not sent to a server."
          />
          <Button type="submit">Enter workspace</Button>
        </form>
      </Card>
      <p className="text-sm text-muted">
        New here?{' '}
        <Link to="/signup" className="text-copy underline">
          Create an operator profile
        </Link>
      </p>
    </div>
  )
}
