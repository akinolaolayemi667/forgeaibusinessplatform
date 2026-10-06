import type { LeadFlowStage, LeadSourceMix } from '@/data/leads/leadTypes'

export const leadFlow: LeadFlowStage[] = [
  { stage: 'New', count: 1284 },
  { stage: 'Contacted', count: 806 },
  { stage: 'Qualified', count: 342 },
  { stage: 'Converted', count: 91 },
]

export const leadSourceMix: LeadSourceMix[] = [
  { label: 'Website', share: 32 },
  { label: 'Referral', share: 24 },
  { label: 'LinkedIn', share: 18 },
  { label: 'Google Ads', share: 14 },
  { label: 'WhatsApp', share: 8 },
  { label: 'Other', share: 4 },
]

export const leadBook = {
  total: 1284,
  newThisWeek: 86,
  qualified: 342,
  hot: 74,
  conversionRate: 18.6,
  followUps: 31,
  lost: 214,
}
