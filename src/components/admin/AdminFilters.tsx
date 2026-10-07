type FilterOption = { value: string; label: string }

export function AdminFilters({
  search,
  onSearch,
  filters,
  placeholder = 'Search records',
}: {
  search: string
  onSearch: (value: string) => void
  placeholder?: string
  filters: { id: string; label: string; value: string; options: FilterOption[]; onChange: (value: string) => void }[]
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="type-kicker text-ash">Search</span>
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-10 border border-stroke bg-ink px-3 text-sm text-paper outline-none focus-visible:border-ember"
          placeholder={placeholder}
        />
      </label>
      {filters.map((filter) => (
        <label key={filter.id} className="flex min-w-40 flex-col gap-1.5">
          <span className="type-kicker text-ash">{filter.label}</span>
          <select
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
            className="h-10 border border-stroke bg-ink px-3 text-sm text-paper outline-none focus-visible:border-ember"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
