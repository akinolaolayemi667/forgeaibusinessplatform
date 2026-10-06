import { AuthScreen } from '@/components/auth/AuthScreen'

export function SignupPage() {
  return (
    <AuthScreen
      title="CREATE YOUR FORGE ACCOUNT"
      description="Connect your identity and start building your automated business workspace."
      alternate={{ href: '/login', prompt: 'Already have access?', label: 'Log in' }}
    />
  )
}