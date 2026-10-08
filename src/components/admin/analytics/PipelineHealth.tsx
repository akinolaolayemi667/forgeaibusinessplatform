import { AnalyticsEmpty, AnalyticsPanel } from '@/components/admin/analytics/AnalyticsPanel'
import type { PipelineHealthMetric, PipelineStageRow } from '@/types/adminAnalytics'
import { formatCurrency } from '@/utils/format'

export function PipelineHealth({
  metrics,
  stages,
  hasRecords,
}: {
  metrics: PipelineHealthMetric[]
  stages: PipelineStageRow[]
  hasRecords: boolean
}) {
  const max = Math.max(...stages.map((stage) => stage.value), 1)

  return (
    <AnalyticsPanel title="PIPELINE HEALTH" source="demo" note="Calculated from the sample opportunity book for records created in this range.">
      {hasRecords ? (
        <div className="flex flex-col gap-4">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="border border-stroke px-3 py-3">
                <dt className="type-kicker text-ash">{metric.label}</dt>
                <dd className="mt-2 font-display text-xl text-paper">{metric.value}</dd>
              </div>
            ))}
          </dl>
          <div className="min-w-0 overflow-x-auto md:overflow-visible">
            <table className="w-full min-w-[32rem] table-fixed border-collapse text-left text-sm md:min-w-0">
              <caption className="sr-only">Pipeline distribution by stage</caption>
              <colgroup>
                <col className="w-[38%]" />
                <col className="w-[18%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-stroke">
                  {['Stage', 'Opportunities', 'Value', 'Weighted value'].map((header) => (
                    <th key={header} scope="col" className="type-kicker px-2 py-2 font-medium text-ash">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={stage.id} className="border-b border-stroke last:border-b-0 hover:bg-wash">
                    <th scope="row" className="px-2 py-2.5 font-normal text-paper">
                      <span className="block">{stage.stage}</span>
                      <span className="mt-2 block h-1 bg-wash" aria-hidden>
                        <span className="block h-full bg-ember" style={{ width: `${(stage.value / max) * 100}%` }} />
                      </span>
                    </th>
                    <td className="type-data px-2 py-2.5 whitespace-nowrap text-stone">{stage.opportunities}</td>
                    <td className="type-data px-2 py-2.5 whitespace-nowrap text-stone">{formatCurrency(stage.value)}</td>
                    <td className="type-data px-2 py-2.5 whitespace-nowrap text-stone">{formatCurrency(stage.weighted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <AnalyticsEmpty title="NO ANALYTICS DATA" detail="No sample opportunities were created in this range." />
      )}
    </AnalyticsPanel>
  )
}
