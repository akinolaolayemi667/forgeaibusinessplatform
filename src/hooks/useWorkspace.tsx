import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultWorkspaceId, workspaces } from '@/data'
import { readStorage, writeStorage } from '@/lib/storage'
import type { Workspace } from '@/types'

const WORKSPACE_KEY = 'forge.workspace'

type WorkspaceContextValue = {
  workspace: Workspace
  workspaces: Workspace[]
  selectWorkspace: (id: string) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

function readWorkspaceId() {
  const stored = readStorage(WORKSPACE_KEY)
  return typeof stored === 'string' && workspaces.some((item) => item.id === stored) ? stored : defaultWorkspaceId
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState(readWorkspaceId)
  const workspace = workspaces.find((item) => item.id === workspaceId) ?? workspaces[0]

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace,
      workspaces,
      selectWorkspace: (id: string) => {
        if (!workspaces.some((item) => item.id === id)) return
        writeStorage(WORKSPACE_KEY, id)
        setWorkspaceId(id)
      },
    }),
    [workspace],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return value
}
