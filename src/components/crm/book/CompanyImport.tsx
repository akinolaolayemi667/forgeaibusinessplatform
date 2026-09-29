import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { parseCompanyCsv } from '@/data/crm/csv'
import { useCrm } from '@/hooks/useCrm'

export function CompanyImport() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { importCompanies } = useCrm()

  return (
    <>
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        Import
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="Import companies CSV"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          void file.text().then((text) => importCompanies(parseCompanyCsv(text)))
        }}
      />
    </>
  )
}
