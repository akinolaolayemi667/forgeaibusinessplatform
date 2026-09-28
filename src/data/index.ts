import { createMockDataSource } from '@/data/mock'

export type { ForgeDataSource } from '@/data/source'
export { defaultWorkspaceId, workspaces } from '@/data/mock'
export const forgeData = createMockDataSource()
