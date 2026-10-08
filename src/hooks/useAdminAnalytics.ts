import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultWorkspaceId, forgeData } from '@/data'
import { adminActivity } from '@/data/adminData'
import { seedLeads } from '@/data/leads'
import { seedOpportunities } from '@/data/pipeline'
import { useAuth } from '@/hooks/useAuth'
import { useOrganizationMembers } from '@/hooks/useOrganizationMembers'
import { buildAdminAnalytics } from '@/lib/adminAnalytics'
import { withSessionIdentity } from '@/lib/organizationMembers'
import type { Automation, Briefing, Conversation } from '@/types'
import type { AnalyticsRange } from '@/types/adminAnalytics'

type DemoBundle = {
  automations: Automation[]
  conversations: Conversation[]
  briefings: Briefing[]
}

export function useAdminAnalytics() {
  const { organization, user, accessStatus } = useAuth()
  const organizationId = organization?.id ?? null
  const membersState = useOrganizationMembers(organizationId)
  const [range, setRange] = useState<AnalyticsRange>('30d')
  const [demo, setDemo] = useState<DemoBundle | null>(null)
  const [demoLoading, setDemoLoading] = useState(true)
  const [demoError, setDemoError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [revision, setRevision] = useState(0)

  const loadDemo = useCallback(async () => {
    const [automations, conversations, briefings] = await Promise.all([
      forgeData.listAutomations(defaultWorkspaceId),
      forgeData.listConversations(defaultWorkspaceId),
      forgeData.listBriefings(defaultWorkspaceId),
    ])
    return { automations, conversations, briefings }
  }, [])

  useEffect(() => {
    let active = true
    void loadDemo().then(
      (next) => {
        if (!active) return
        setDemo(next)
        setDemoError(null)
        setDemoLoading(false)
      },
      (caught: unknown) => {
        if (!active) return
        if (import.meta.env.DEV) console.info('admin analytics sample', caught)
        setDemoError('Unable to load analytics.')
        setDemoLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [loadDemo])

  const reloadMembers = membersState.reload

  const refresh = useCallback(() => {
    setRefreshing(true)
    setRevision((current) => current + 1)
    reloadMembers()
    void loadDemo()
      .then((next) => {
        setDemo(next)
        setDemoError(null)
      })
      .catch((caught: unknown) => {
        if (import.meta.env.DEV) console.info('admin analytics refresh', caught)
        setDemoError('Unable to load analytics.')
      })
      .finally(() => setRefreshing(false))
  }, [loadDemo, reloadMembers])

  const model = useMemo(() => {
    if (!demo) return null
    return buildAdminAnalytics({
      range,
      now: new Date(),
      members: withSessionIdentity(membersState.members, user),
      opportunities: seedOpportunities,
      leads: seedLeads,
      automations: demo.automations,
      conversations: demo.conversations,
      briefings: demo.briefings,
      activity: adminActivity,
    })
  }, [demo, membersState.members, range, revision, user])

  return {
    range,
    setRange,
    refresh,
    refreshing,
    model,
    organization,
    accessStatus,
    membersLoading: accessStatus === 'loading' || membersState.loading,
    membersError: membersState.error,
    demoLoading,
    demoError,
    reloadMembers,
  }
}
