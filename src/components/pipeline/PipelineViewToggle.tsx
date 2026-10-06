import { cn } from '@/lib/cn'

export function PipelineViewToggle({ view, onChange }: { view: 'board' | 'list'; onChange: (view: 'board' | 'list') => void }) {
  return (
    <div role="group" aria-label="Pipeline view" className="inline-flex border border-stroke">
      {(['board', 'list'] as const).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={view === item}
          className={cn(
            'h-10 cursor-pointer px-3 text-sm capitalize',
            view === item ? 'bg-ember text-on-accent' : 'bg-surface text-copy hover:bg-wash',
          )}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
