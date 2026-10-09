import type { SystemCheck } from '@/types/platformOverview'

const labels: Record<SystemCheck['state'], string> = {
  operational: 'Operational',
  configured: 'Configured',
  not_connected: 'Not connected',
  not_verified: 'Not verified',
}

export function SystemStatus({ checks, loading }: { checks: SystemCheck[]; loading: boolean }) {
  return (
    <section className="min-w-0 border border-stroke bg-surface-raised" aria-labelledby="system-status-heading">
      <div className="border-b border-stroke px-4 py-4 sm:px-5">
        <h2 id="system-status-heading" className="font-display text-xl text-paper">System status</h2>
        <p className="mt-1 text-sm text-ash">These checks describe what this session can verify. They are not server health metrics.</p>
      </div>
      {loading ? <p className="px-4 py-8 text-sm text-ash sm:px-5">Loading platform overview...</p> : null}
      {!loading ? (
        <ul className="flex flex-col">
          {checks.map((check) => (
            <li key={check.id} className="border-b border-stroke px-4 py-3 last:border-b-0 sm:px-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-paper">{check.label}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ember">{labels[check.state]}</p>
              </div>
              <p className="mt-1 text-sm text-ash">{check.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
