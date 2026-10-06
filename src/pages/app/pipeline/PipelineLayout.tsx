import { Outlet } from 'react-router-dom'
import { PipelineToast } from '@/components/pipeline/PipelineToast'
import { PipelineProvider } from '@/hooks/usePipeline'

export function PipelineLayout() {
  return (
    <PipelineProvider>
      <Outlet />
      <PipelineToast />
    </PipelineProvider>
  )
}
