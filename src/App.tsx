import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from '@/hooks/useSession'
import { WorkspaceProvider } from '@/hooks/useWorkspace'
import { router } from '@/lib/router'

export default function App() {
  return (
    <SessionProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
    </SessionProvider>
  )
}
