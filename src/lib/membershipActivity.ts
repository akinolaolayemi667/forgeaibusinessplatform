import type { MembershipActivity } from '@/types/organizationMember'

/** ADMIN-5 will persist these events. This phase only records the boundary. */
export function recordMembershipActivity(event: MembershipActivity) {
  if (import.meta.env.DEV) console.info('membership activity', event.type)
}
