import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SessionProvider } from '@/hooks/useSession'
import { WorkspaceProvider } from '@/hooks/useWorkspace'
import { router } from '@/lib/router'

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <WorkspaceProvider>
          <RouterProvider router={router} />
        </WorkspaceProvider>
      </SessionProvider>
    </AuthProvider>
  )
}
