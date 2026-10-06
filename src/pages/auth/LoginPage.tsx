import { AuthScreen } from '@/components/auth/AuthScreen'

export function LoginPage() {
  return (
    <AuthScreen
      title="AUTHENTICATE ACCESS"
      description="Sign in to your FORGE workspace and continue managing your business operations."
      alternate={{ href: '/signup', prompt: 'New to FORGE?', label: 'Create an account' }}
    />
  )
}
